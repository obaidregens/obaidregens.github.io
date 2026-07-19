#!/usr/bin/env bun
// Mines Luma's public discover API for Startup School week events in SF
// and reports anything not already in our JSON.
//   bun scripts/harvest-luma.ts

import { readFileSync } from "node:fs";

const UA = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
};
const API = "https://api.lu.ma/discover/get-paginated-events";
const QUERIES = [
  "startup school", "yc startup school", "yc", "sus 2026",
  "afterparty san francisco", "founders san francisco", "startup school afterparty",
  "hackathon san francisco", "yc afterparty",
];
const FROM = "2026-07-22", TO = "2026-07-29";

const data = JSON.parse(readFileSync("data/startup-school-2026-events.json", "utf8"));
const knownSlugs = new Set<string>();
for (const e of data.events)
  for (const l of e.links ?? []) {
    const m = l.url.match(/luma\.com\/([^/?#]+)/i);
    if (m) knownSlugs.add(m[1].toLowerCase());
  }

type Hit = { slug: string; name: string; start: string; city: string; host: string; q: string };
const found = new Map<string, Hit>();

for (const q of QUERIES) {
  let cursor: string | null = null;
  for (let page = 0; page < 6; page++) {
    const url = `${API}?pagination_limit=50&query=${encodeURIComponent(q)}` +
      (cursor ? `&pagination_cursor=${encodeURIComponent(cursor)}` : "");
    let j: any;
    try {
      const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
      if (!r.ok) break;
      j = await r.json();
    } catch { break; }

    for (const en of j.entries ?? []) {
      const v = en.event ?? en;
      if (!v?.start_at || v.start_at < FROM || v.start_at > TO) continue;
      const city = v.geo_address_info?.city_state ?? v.geo_address_info?.city ?? "";
      const nearSF = /san francisco|oakland|berkeley|palo alto|menlo|sunnyvale|bay area|CA$/i.test(city) || city === "";
      if (!nearSF) continue;
      const slug = String(v.url ?? "").toLowerCase();
      if (!slug || found.has(slug)) continue;
      const hosts = (en.hosts ?? []).map((h: any) => h.name).filter(Boolean).join(", ");
      found.set(slug, { slug, name: v.name, start: v.start_at, city, host: hosts, q });
    }
    if (!j.has_more || !j.next_cursor) break;
    cursor = j.next_cursor;
    await new Promise((r) => setTimeout(r, 250));
  }
}

const all = [...found.values()].sort((a, b) => a.start.localeCompare(b.start));
const fresh = all.filter((h) => !knownSlugs.has(h.slug));
const relevant = fresh.filter((h) =>
  /startup school|\bsus\b|\byc\b|y combinator|afterparty|after party/i.test(h.name + " " + h.host)
);

const pt = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { timeZone: "America/Los_Angeles", weekday: "short", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit" });
};

console.log(`scanned ${QUERIES.length} queries · ${all.length} SF events in window · ${fresh.length} not already listed\n`);
console.log(`=== LIKELY STARTUP-SCHOOL RELATED (${relevant.length}) ===`);
for (const h of relevant)
  console.log(`  ${pt(h.start).padEnd(22)} ${h.name.slice(0, 58).padEnd(60)} https://luma.com/${h.slug}`);

const maybe = fresh.filter((h) => !relevant.includes(h));
console.log(`\n=== OTHER SF EVENTS IN WINDOW (${maybe.length}) — judgement call ===`);
for (const h of maybe.slice(0, 30))
  console.log(`  ${pt(h.start).padEnd(22)} ${h.name.slice(0, 58).padEnd(60)} https://luma.com/${h.slug}`);
