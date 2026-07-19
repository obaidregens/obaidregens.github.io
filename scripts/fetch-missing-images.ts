#!/usr/bin/env bun
// Backfills images for events whose primary source had none.
// Preference order: Luma/Partiful og:image -> host site -> LinkedIn poster image.

import { writeFileSync, existsSync } from "node:fs";

const UA = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
};
const DIR = "assets/startup-school-2026";
const dec = (s: string) => s.replace(/&amp;/g, "&");

// n = thread-order prefix so it sorts alongside the rest
const JOBS: { id: string; n: string; src: string; from: string; ext?: string }[] = [
  {
    id: "farmhouse1", n: "42", ext: "png", from: "thefarm.haus OG image (canonical domain)",
    src: "https://www.thefarm.haus/opengraph-image",
  },
  {
    id: "farmhouse2", n: "43", ext: "png", from: "thefarm.haus OG image (canonical domain)",
    src: "https://www.thefarm.haus/opengraph-image",
  },
  {
    id: "deepmind", n: "30", ext: "webp", from: "The Pearl SF (venue photo — no event image published)",
    src: "https://cdn.prod.website-files.com/6603ce63f223f72944af8872/660cf8e89dcdab06cc990b12_ThePearL_mobileFallback6.webp",
  },
  {
    id: "batchelor", n: "24", from: "LinkedIn poster (Hema Dassani)",
    src: "https://media.licdn.com/dms/image/v2/D5622AQGNTxqLnavr3Q/image_627_1200/B56Z9nb2j4GcAQ-/0/1784146782682?e=2147483647&v=beta&t=4iz4_RViOy5biIxgduUWmoxhqI7FC5XWlGbHM5gDcj8",
  },
  {
    id: "foundess", n: "03", from: "LinkedIn photo (Pear Chotbunwong)",
    src: "https://media.licdn.com/dms/image/v2/D5622AQFbm1bhLuESEg/feedshare-image-high-res/B56Z9crVRXHIAY-/0/1783966291462?e=2147483647&v=beta&t=COThEUKeZYLV380dwJAmndHfgHU3imH1eIcFWHH0kpM",
  },
];

for (const j of JOBS) {
  const out = `${DIR}/${j.n}-${j.id}.${j.ext ?? "jpg"}`;
  if (existsSync(out)) { console.log(`skip  ${j.id} (already present)`); continue; }
  try {
    const r = await fetch(dec(j.src), { headers: UA, signal: AbortSignal.timeout(25000) });
    if (!r.ok) { console.log(`FAIL  ${j.id} — HTTP ${r.status}`); continue; }
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 2000) { console.log(`FAIL  ${j.id} — suspiciously small (${buf.length}b)`); continue; }
    writeFileSync(out, buf);
    console.log(`ok    ${j.id}  ${(buf.length / 1024).toFixed(0)}KB  <- ${j.from}`);
  } catch (e: any) {
    console.log(`ERR   ${j.id} — ${e.name}: ${String(e.message).slice(0, 70)}`);
  }
}

// Report what's still bare
const data = JSON.parse(await Bun.file("data/startup-school-2026-events.json").text());
const { readdirSync } = await import("node:fs");
const have = new Set(
  readdirSync(DIR).map((f) => f.match(/^\d+-(.+)\.(png|jpe?g|webp)$/)?.[1]).filter(Boolean)
);
const bare = data.events.filter((e: any) => !have.has(e.id));
console.log(`\nstill without an image: ${bare.length}`);
for (const e of bare) console.log(`  ${e.id.padEnd(12)} ${e.url ?? ""}`);
