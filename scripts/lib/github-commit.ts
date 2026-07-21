// Minimal GitHub Contents API helpers — read a JSON file, mutate it, commit back.
// Used by the Lambda to append submitted events to the data JSON without a checkout.

type Repo = { owner: string; repo: string; branch: string; token: string };

const api = (r: Repo, path: string) =>
  `https://api.github.com/repos/${r.owner}/${r.repo}/contents/${path}`;

const headers = (r: Repo) => ({
  Authorization: `Bearer ${r.token}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "ycweek-submit-bot",
  "X-GitHub-Api-Version": "2022-11-28",
});

export function repoFromEnv(): Repo {
  const full = process.env.GITHUB_REPO || "obaidregens/obaidregens.github.io";
  const [owner, repo] = full.split("/");
  return { owner, repo, branch: process.env.GITHUB_BRANCH || "main", token: process.env.GITHUB_TOKEN || "" };
}

export async function getJson(r: Repo, path: string): Promise<{ json: any; sha: string }> {
  const res = await fetch(`${api(r, path)}?ref=${r.branch}`, { headers: headers(r) });
  if (!res.ok) throw new Error(`GitHub GET ${path} ${res.status}: ${(await res.text()).slice(0, 160)}`);
  const meta = await res.json();
  const content = Buffer.from(meta.content, "base64").toString("utf8");
  return { json: JSON.parse(content), sha: meta.sha };
}

// List filenames directly under a directory (for the render asset map).
export async function listDir(r: Repo, path: string): Promise<string[]> {
  const res = await fetch(`${api(r, path)}?ref=${r.branch}`, { headers: headers(r) });
  if (!res.ok) throw new Error(`GitHub GET dir ${path} ${res.status}`);
  const arr = await res.json();
  return Array.isArray(arr) ? arr.filter((x: any) => x.type === "file").map((x: any) => x.name) : [];
}

// Atomic multi-file commit via the Git Data API — commits several files as one
// commit (used to write the data JSON and the regenerated HTML together).
export async function commitFiles(r: Repo, files: { path: string; content: string }[], message: string) {
  const gh = (p: string, init?: RequestInit) =>
    fetch(`https://api.github.com/repos/${r.owner}/${r.repo}/${p}`, { ...init, headers: headers(r) });

  const ref = await (await gh(`git/ref/heads/${r.branch}`)).json();
  const baseSha = ref.object.sha;
  const baseCommit = await (await gh(`git/commits/${baseSha}`)).json();

  const blobs = await Promise.all(
    files.map(async (f) => {
      const b = await (await gh("git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: f.content, encoding: "utf-8" }),
      })).json();
      return { path: f.path, mode: "100644", type: "blob", sha: b.sha };
    })
  );

  const tree = await (await gh("git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: blobs }),
  })).json();

  const commit = await (await gh("git/commits", {
    method: "POST",
    body: JSON.stringify({ message, tree: tree.sha, parents: [baseSha] }),
  })).json();

  const upd = await gh(`git/refs/heads/${r.branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
  if (!upd.ok) throw new Error(`GitHub update ref ${upd.status}: ${(await upd.text()).slice(0, 160)}`);
  return commit.sha as string;
}

export async function putJson(r: Repo, path: string, json: any, sha: string, message: string) {
  const body = {
    message,
    branch: r.branch,
    sha,
    content: Buffer.from(JSON.stringify(json, null, 2) + "\n", "utf8").toString("base64"),
  };
  // one retry on 409 (someone committed between our read and write)
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(api(r, path), { method: "PUT", headers: headers(r), body: JSON.stringify(body) });
    if (res.ok) return await res.json();
    if (res.status === 409 && attempt === 0) {
      const fresh = await getJson(r, path);
      body.sha = fresh.sha;
      continue;
    }
    throw new Error(`GitHub PUT ${path} ${res.status}: ${(await res.text()).slice(0, 160)}`);
  }
}
