#!/usr/bin/env bun
// One-off: sync access → "sold-out" for events YC's official attendee page
// (events.ycombinator.com/startup-school-2026) now marks SOLD OUT.
//   bun scripts/mark-soldout.ts

import { readFileSync, writeFileSync } from "node:fs";
const SRC = "data/startup-school-2026-events.json";
const data = JSON.parse(readFileSync(SRC, "utf8"));

// keyword → matched against title OR host (lowercased)
const SOLD_OUT = [
  "respan", "mintlify", "posthog", "greptile", "made in san francisco",
  "archil", "agentmail", "legalos", "deus ex machina", "moss",
  "d_model", "fondo", "presidio", "microsoft", "google deepmind",
];

let n = 0;
for (const e of data.events) {
  const hay = (e.title + " " + e.host).toLowerCase();
  if (SOLD_OUT.some((k) => hay.includes(k)) && e.access !== "sold-out") {
    console.log(`  sold-out: ${e.title}  (was ${e.access})`);
    e.access = "sold-out";
    n++;
  }
}

data.meta.lastUpdated = new Date().toISOString().slice(0, 10);
writeFileSync(SRC, JSON.stringify(data, null, 2) + "\n");
console.log(`marked ${n} events sold-out — total ${data.events.length}`);
