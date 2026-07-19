#!/usr/bin/env bun
// For every event with no local image, pull og:image from its own page.
// Idempotent — skips anything already downloaded.
//   bun scripts/fetch-event-images.ts

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";

const UA = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
};
const DIR = "assets/startup-school-2026";
const data = JSON.parse(readFileSync("data/startup-school-2026-events.json", "utf8"));

const have = new Set(
  readdirSync(DIR).map((f) => f.match(/^\d+-(.+)\.(png|jpe?g|webp)$/)?.[1]).filter(Boolean) as string[]
);
// next free numeric prefix
let next = Math.max(0, ...readdirSync(DIR).map((f) => parseInt(f) || 0)) + 1;

const ogImage = (h: string) =>
  (h.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
   h.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) || [])[1];

let got = 0;
const failed: string[] = [];

for (const e of data.events) {
  if (have.has(e.id)) continue;
  if (!e.url) { failed.push(`${e.id} (no url)`); continue; }
  try {
    const page = await fetch(e.url, { headers: UA, signal: AbortSignal.timeout(20000) });
    const src = ogImage(await page.text());
    if (!src) { failed.push(`${e.id} (no og:image)`); continue; }

    // Sites often declare og:image on a stale preview host (e.g. *.vercel.app)
    // while the same path still serves from their canonical domain. Try both.
    const candidates = [src.replace(/&amp;/g, "&")];
    try {
      const declared = new URL(candidates[0]);
      const canonical = new URL(e.url).origin;
      if (declared.origin !== canonical) candidates.push(canonical + declared.pathname);
    } catch {}

    let img: Response | null = null;
    for (const c of candidates) {
      try {
        const attempt = await fetch(c, { headers: UA, signal: AbortSignal.timeout(25000) });
        if (attempt.ok && (attempt.headers.get("content-type") || "").startsWith("image/")) { img = attempt; break; }
      } catch {}
    }
    if (!img) { failed.push(`${e.id} (og:image unreachable)`); continue; }
    const buf = Buffer.from(await img.arrayBuffer());
    if (buf.length < 2000) { failed.push(`${e.id} (too small)`); continue; }

    const ct = img.headers.get("content-type") || "";
    const ext = ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : "jpg";
    const name = `${String(next++).padStart(2, "0")}-${e.id}.${ext}`;
    writeFileSync(`${DIR}/${name}`, buf);
    console.log(`ok    ${e.id.padEnd(14)} ${(buf.length / 1024).toFixed(0).padStart(4)}KB  ${name}`);
    got++;
  } catch (err: any) {
    failed.push(`${e.id} (${err.name})`);
  }
}

console.log(`\ndownloaded ${got}`);
if (failed.length) console.log(`still bare (${failed.length}): ${failed.join(", ")}`);
