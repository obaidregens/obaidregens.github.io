#!/usr/bin/env bun
// CLI: render ycweek/index.html from the events JSON.
//   bun scripts/build-ycweek.ts
// SUBMIT_ENDPOINT env is baked into the page's submit form.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { renderYcweek } from "./lib/render-ycweek.ts";

const data = JSON.parse(readFileSync("data/startup-school-2026-events.json", "utf8"));
const assetFiles = readdirSync("assets/startup-school-2026");

// live Discord member count (invite API has no CORS, so we fetch at build time)
let discordMembers = 250;
try {
  const r = await fetch(
    "https://discord.com/api/v10/invites/ycstartupschool2026?with_counts=true",
    { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) }
  );
  if (r.ok) { const j: any = await r.json(); if (j.approximate_member_count) discordMembers = j.approximate_member_count; }
} catch { /* keep fallback */ }

const html = renderYcweek({
  data, assetFiles, discordMembers,
  submitEndpoint: process.env.SUBMIT_ENDPOINT || "",
});

mkdirSync("ycweek", { recursive: true });
writeFileSync("ycweek/index.html", html);
console.log(`wrote ycweek/index.html — ${data.events.length} events, ${(html.length / 1024).toFixed(1)} KB`);
