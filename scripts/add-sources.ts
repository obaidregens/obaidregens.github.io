#!/usr/bin/env bun
// One-shot migration: adds per-event `links[]` + `foundOn[]` to the events JSON.
// Cross-checks YC's official attendee page against startupschoolafter.party.

import { readFileSync, writeFileSync } from "node:fs";

const SRC = "data/startup-school-2026-events.json";
const data = JSON.parse(readFileSync(SRC, "utf8"));

// Links harvested from events.ycombinator.com/startup-school-2026 (logged-in attendee page)
const YC: Record<string, string> = {
  corgi: "https://partiful.com/e/igxGqp6c00c2ESX44CpG",
  posthog: "https://luma.com/posthog-sus26",
  terra: "https://partiful.com/e/YU4mWYWpui1IVPAomO1c",
  stripe: "https://luma.com/xggm2di5",
  archil: "https://luma.com/chqmxhyg",
  agentmail: "https://partiful.com/e/aGVSDQ7ym3eCaaeVrLwf",
  legalos: "https://luma.com/47w3zljn",
  deusex: "https://luma.com/p7q8z7zl",
  respan: "https://luma.com/2p9zbnzn",
  greptile: "https://luma.com/greptile-sltd",
  moss: "https://luma.com/m4ez9liu",
  dmodel: "https://luma.com/jz0h1t7q",
  fondo: "https://luma.com/fondo_yc_startup_school_afterparty",
  presidio: "https://luma.com/ispbsl3o",
  // announced on YC's page, no signup link published yet
  aws: "", microsoft: "", deepmind: "",
};

// Links harvested from startupschoolafter.party
const ASP: Record<string, string> = {
  yacht: "https://luma.com/ojidqyj8",
  cocktail: "https://luma.com/axd56nxv",
  hackathon: "https://luma.com/dpp4ulna",
  picnic: "https://luma.com/6vko8q90",
  emergence: "https://luma.com/2ev1tu8a",
  compiled: "https://luma.com/compiled-cp9o",
  betafund: "https://luma.com/beta-ugt5",
  gokart: "https://luma.com/ueokvzdw",
  moss: "https://luma.com/m4ez9liu",
  terra: "https://partiful.com/e/YU4mWYWpui1IVPAomO1c",
  dmodel: "https://luma.com/jz0h1t7q",
  canadian: "https://luma.com/8sf0hjs0",
  hxyc: "https://luma.com/ngoyztxr",
  stripe: "https://luma.com/xggm2di5",
  archil: "https://luma.com/chqmxhyg",
  respan: "https://luma.com/2p9zbnzn",
  fondo: "https://luma.com/fondo_yc_startup_school_afterparty",
  farmhouse1: "https://www.thefarm.haus/",
  farmhouse2: "https://www.thefarm.haus/",
  rooftop: "https://luma.com/z9teb942",
  // ASP links Deus Ex Machina to a LinkedIn announcement, not the Luma page
  deusex: "https://www.linkedin.com/posts/mehul-agarwal-a274a0287_were-hosting-the-official-y-combinator-startup-activity-7483222994480263168-F2aN",
};

// Extra announcement posts verified by hand (LinkedIn, logged-in)
const EXTRA: Record<string, string[]> = {
  deusex: [
    "https://www.linkedin.com/posts/cathydi_were-taking-over-the-best-speakeasy-in-sf-share-7482973840445423616-582_/",
    "https://www.linkedin.com/posts/stephaniesgao_im-co-hosting-an-official-yc-sus-afterparty-share-7483204839657865216-20wc/",
  ],
};

const kind = (u: string) =>
  /luma\.com|lu\.ma/.test(u) ? "luma"
  : /partiful/.test(u) ? "partiful"
  : /linkedin/.test(u) ? "linkedin"
  : "website";

// canonical preference: luma > partiful > website > linkedin
const RANK: Record<string, number> = { luma: 0, partiful: 1, website: 2, linkedin: 3 };

let same = 0, differ = 0, ycOnly = 0, aspOnly = 0;

for (const e of data.events) {
  const seen = new Map<string, Set<string>>(); // url -> sources
  const add = (u: string, src: string) => {
    if (!u) return;
    if (!seen.has(u)) seen.set(u, new Set());
    seen.get(u)!.add(src);
  };

  add(YC[e.id] ?? "", "yc-official");
  add(ASP[e.id] ?? "", "afterparty-site");
  for (const u of EXTRA[e.id] ?? []) add(u, "linkedin");

  const inYC = e.id in YC, inASP = e.id in ASP;
  if (inYC && inASP) (YC[e.id] === ASP[e.id] ? same++ : differ++);
  else if (inYC) ycOnly++;
  else if (inASP) aspOnly++;

  const links = [...seen.entries()]
    .map(([url, srcs]) => ({ url, type: kind(url), foundOn: [...srcs].sort() }))
    .sort((a, b) => RANK[a.type] - RANK[b.type]);

  e.links = links;
  e.foundOn = [...new Set(links.flatMap((l) => l.foundOn))].sort();
  if (!e.foundOn.length) e.foundOn = ["yc-official"]; // AWS/MS/DeepMind: named, unlinked
  e.url = links[0]?.url ?? null; // canonical stays the primary
}

data.meta.sourceKeys = {
  "yc-official": "events.ycombinator.com/startup-school-2026 (logged-in attendee page)",
  "afterparty-site": "startupschoolafter.party",
  linkedin: "Host announcement post on LinkedIn (verified manually)",
};
data.meta.lastUpdated = "2026-07-19";

writeFileSync(SRC, JSON.stringify(data, null, 2) + "\n");

console.log(`cross-check:`);
console.log(`  in both, identical link : ${same}`);
console.log(`  in both, DIFFERENT link : ${differ}`);
console.log(`  YC only                 : ${ycOnly}`);
console.log(`  afterparty-site only    : ${aspOnly}`);
console.log(`  multi-source events     : ${data.events.filter((e: any) => e.foundOn.length > 1).length}`);
console.log(`  multi-link events       : ${data.events.filter((e: any) => e.links.length > 1).length}`);
for (const e of data.events.filter((x: any) => x.links.length > 1))
  console.log(`    ${e.id}: ${e.links.map((l: any) => l.type).join(" + ")}`);
