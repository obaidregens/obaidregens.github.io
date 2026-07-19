#!/usr/bin/env bun
// Pushes the generated thread to Typefully as a DRAFT (never auto-publishes).
//
//   export TYPEFULLY_API_KEY=...        # Settings -> API, must be a v2 key
//   bun scripts/push-to-typefully.ts --dry      # inspect payload, no network writes
//   bun scripts/push-to-typefully.ts            # create the draft
//   bun scripts/push-to-typefully.ts --linkedin # also enable LinkedIn in the draft

import { readFileSync, existsSync } from "node:fs";

const KEY = process.env.TYPEFULLY_API_KEY;
const DRY = process.argv.includes("--dry");
const WITH_LI = process.argv.includes("--linkedin");
const API = "https://api.typefully.com/v2";
const IMG_DIR = "assets/startup-school-2026";

if (!KEY && !DRY) {
  console.error("TYPEFULLY_API_KEY not set. Get a v2 key at Settings -> API.");
  process.exit(1);
}

const H = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const tweets: { n: number; id: string; text: string; image: string | null }[] =
  JSON.parse(readFileSync("data/thread.json", "utf8"));

const imgPath = (t: (typeof tweets)[0]) => {
  if (!t.image) return null;
  for (const ext of ["png", "jpg"]) {
    const p = `${IMG_DIR}/${String(t.n).padStart(2, "0")}-${t.id}.${ext}`;
    if (existsSync(p)) return p;
  }
  return null;
};

const api = async (path: string, init?: RequestInit) => {
  const r = await fetch(`${API}${path}`, { ...init, headers: { ...H, ...(init?.headers ?? {}) } });
  const body = await r.text();
  if (!r.ok) throw new Error(`${init?.method ?? "GET"} ${path} -> ${r.status}: ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : null;
};

// ---- 1. pick the social set --------------------------------------------
let socialSetId = process.env.TYPEFULLY_SOCIAL_SET_ID;
if (!DRY && !socialSetId) {
  const sets = await api("/social-sets");
  const list = sets.results ?? sets.data ?? sets;
  if (!Array.isArray(list) || !list.length) throw new Error(`no social sets: ${JSON.stringify(sets).slice(0, 300)}`);
  console.log("social sets found:");
  for (const s of list) console.log(`  ${s.id}  ${s.name ?? s.title ?? "(unnamed)"}`);
  socialSetId = String(list[0].id);
  console.log(`using: ${socialSetId}\n`);
}

// ---- 2. upload images --------------------------------------------------
const mediaFor = new Map<number, string>();
const withImages = tweets.filter((t) => imgPath(t));
console.log(`${tweets.length} tweets, ${withImages.length} with images`);

if (!DRY) {
  for (const t of withImages) {
    const path = imgPath(t)!;
    const fileName = path.split("/").pop()!;
    try {
      const up = await api(`/social-sets/${socialSetId}/media/upload`, {
        method: "POST",
        body: JSON.stringify({ file_name: fileName }),
      });
      const mediaId = up.media_id ?? up.id;
      const uploadUrl = up.upload_url ?? up.url;

      const bytes = readFileSync(path);
      const put = await fetch(uploadUrl, {
        method: "PUT",
        body: bytes,
        headers: { "Content-Type": fileName.endsWith(".png") ? "image/png" : "image/jpeg" },
      });
      if (!put.ok) throw new Error(`S3 PUT ${put.status}`);

      // poll until processed
      let status = "processing";
      for (let i = 0; i < 15 && status === "processing"; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        const st = await api(`/social-sets/${socialSetId}/media/${mediaId}`);
        status = st.status;
      }
      if (status !== "ready") throw new Error(`media status=${status}`);

      mediaFor.set(t.n, mediaId);
      console.log(`  ✓ ${String(t.n).padStart(2)} ${fileName}`);
    } catch (e: any) {
      console.log(`  ✗ ${String(t.n).padStart(2)} ${fileName} — ${e.message.slice(0, 90)} (posting without image)`);
    }
  }
}

// ---- 3. build + create the draft --------------------------------------
const posts = tweets.map((t) => {
  const mid = mediaFor.get(t.n);
  return mid ? { text: t.text, media_ids: [mid] } : { text: t.text };
});

const payload: any = {
  draft_title: "Startup School 2026 — every event in SF",
  platforms: { x: { enabled: true, posts } },
  // publish_at intentionally omitted -> saved as a draft, never auto-posted
};
if (WITH_LI) payload.platforms.linkedin = { enabled: true, posts };

if (DRY) {
  console.log(`\n--- DRY RUN, nothing sent ---`);
  console.log(`posts: ${posts.length}`);
  const over = tweets.filter((t) => t.text.length > 280);
  console.log(`over 280 chars: ${over.length}`);
  console.log(`images that would attach: ${withImages.length}`);
  console.log(`\nfirst post:\n${JSON.stringify(posts[0], null, 2)}`);
  process.exit(0);
}

const draft = await api(`/social-sets/${socialSetId}/drafts`, {
  method: "POST",
  body: JSON.stringify(payload),
});

console.log(`\n✓ draft created`);
console.log(`  id:      ${draft.id}`);
console.log(`  posts:   ${posts.length}`);
console.log(`  images:  ${mediaFor.size}`);
console.log(`  open:    ${draft.private_url ?? draft.share_url ?? "(check typefully.com)"}`);
console.log(`\nSaved as a DRAFT. Review it, then publish from Typefully.`);
