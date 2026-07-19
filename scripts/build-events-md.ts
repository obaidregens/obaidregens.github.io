#!/usr/bin/env bun
// Renders startup-school-2026-events.md from the JSON source of truth.
// Usage: bun scripts/build-events-md.ts

import { readFileSync, writeFileSync } from "node:fs";

const SRC = "data/startup-school-2026-events.json";
const OUT = "startup-school-2026-events.md";

type Link = { url: string; type: string; foundOn: string[] };
type Event = {
  id: string; title: string; host: string; official: boolean;
  day: string; date: string; start: string | null; end: string | null;
  venue: string; vibe: string[]; access: string; description: string;
  url: string | null; image: string | null; note?: string; timeUncertain?: boolean;
  links?: Link[]; foundOn?: string[];
};

const data = JSON.parse(readFileSync(SRC, "utf8"));
const events: Event[] = data.events;

const VIBE_EMOJI: Record<string, string> = {
  networking: "🤝", tech: "⚙️", chill: "🌿", party: "🎉",
};
const ACCESS_LABEL: Record<string, string> = {
  open: "Open", waitlist: "Waitlist", "sold-out": "**Sold out**", tba: "TBA",
};
const LINK_LABEL: Record<string, string> = {
  luma: "RSVP (Luma)", partiful: "RSVP (Partiful)",
  linkedin: "LinkedIn announcement", website: "Website",
};
const SOURCE_LABEL: Record<string, string> = {
  "yc-official": "YC attendee page",
  "afterparty-site": "startupschoolafter.party",
  linkedin: "LinkedIn post",
};

const fmtTime = (t: string | null) => {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hr} ${ampm}` : `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
};

const fmtRange = (e: Event) => {
  const s = fmtTime(e.start), en = fmtTime(e.end);
  if (!s) return "Time TBA";
  const r = en ? `${s} – ${en}` : s;
  return e.timeUncertain ? `${r} ⚠️` : r;
};

const vibes = (e: Event) =>
  e.vibe.map((v) => `${VIBE_EMOJI[v] ?? ""} ${v}`).join(", ");

// group by date, preserving chronological order
const byDate = new Map<string, Event[]>();
for (const e of events) {
  if (!byDate.has(e.date)) byDate.set(e.date, []);
  byDate.get(e.date)!.push(e);
}
for (const list of byDate.values()) {
  list.sort((a, b) => (a.start ?? "99:99").localeCompare(b.start ?? "99:99"));
}

const DAY_LABEL: Record<string, string> = {
  "2026-07-23": "Thursday, Jul 23 — *pre-event*",
  "2026-07-24": "Friday, Jul 24 — *pre-event*",
  "2026-07-25": "Saturday, Jul 25 — **DAY 1**",
  "2026-07-26": "Sunday, Jul 26 — **DAY 2**",
  "2026-07-27": "Monday, Jul 27 — *post-event*",
};

const m = data.meta;
const out: string[] = [];

out.push(`# Startup School 2026 — SF Event List\n`);
out.push(`**${m.event}: ${m.dates} · ${m.venue}**`);
out.push(`Day 1 ${m.day1} · Day 2 ${m.day2}`);
out.push(`Entry: ${m.entry}\n`);
out.push(`> ⚠️ **${m.rule}**\n`);
out.push(`**${events.length} events** · last updated ${m.lastUpdated}\n`);
out.push(`Vibes: ${Object.entries(VIBE_EMOJI).map(([k, v]) => `${v} ${k}`).join(" · ")}`);
out.push(`**[OFFICIAL]** = listed on YC's own attendee page\n`);
out.push(`---\n`);

for (const [date, list] of [...byDate.entries()].sort()) {
  out.push(`## ${DAY_LABEL[date] ?? date}\n`);
  for (const e of list) {
    const links = e.links ?? [];
    const link = links.length
      ? links.map((l) => `[${LINK_LABEL[l.type] ?? l.type}](${l.url})`).join(" · ")
      : "*no link yet*";
    const badge = e.official ? " **[OFFICIAL]**" : "";
    out.push(`### ${e.title}${badge}\n`);
    if (e.image) out.push(`<img src="${e.image}" alt="${e.title}" width="420">\n`);
    out.push(`| | |`);
    out.push(`|---|---|`);
    out.push(`| **When** | ${fmtRange(e)} |`);
    out.push(`| **Where** | ${e.venue} |`);
    out.push(`| **Host** | ${e.host} |`);
    out.push(`| **Vibe** | ${vibes(e)} |`);
    out.push(`| **Access** | ${ACCESS_LABEL[e.access] ?? e.access} |`);
    out.push(`| **Links** | ${link} |`);
    out.push(`| **Found on** | ${(e.foundOn ?? []).map((s) => SOURCE_LABEL[s] ?? s).join(", ") || "—"} |`);
    out.push(``);
    out.push(e.description);
    if (e.note) out.push(`\n> ⚠️ ${e.note}`);
    out.push(`\n`);
  }
}

// Vibe index
out.push(`---\n`);
out.push(`## By vibe\n`);
for (const v of Object.keys(VIBE_EMOJI)) {
  const hits = events.filter((e) => e.vibe.includes(v));
  out.push(`**${VIBE_EMOJI[v]} ${v}** (${hits.length}) — ${hits.map((e) => e.title).join(" · ")}\n`);
}

// Source coverage
out.push(`---\n`);
out.push(`## Source coverage\n`);
const only = (s: string) => events.filter((e) => e.foundOn?.length === 1 && e.foundOn[0] === s);
const both = events.filter((e) => (e.foundOn?.length ?? 0) > 1);
out.push(`| Source | Events |`);
out.push(`|---|---|`);
out.push(`| YC attendee page **only** | ${only("yc-official").length} — ${only("yc-official").map((e) => e.title).join(" · ") || "—"} |`);
out.push(`| startupschoolafter.party **only** | ${only("afterparty-site").length} |`);
out.push(`| Corroborated by 2+ sources | ${both.length} — ${both.map((e) => e.title).join(" · ")} |`);
out.push(``);
const multi = events.filter((e) => (e.links?.length ?? 0) > 1);
if (multi.length) {
  out.push(`**Events with multiple distinct links:**\n`);
  for (const e of multi)
    out.push(`- **${e.title}** — ${e.links!.map((l) => `[${l.type}](${l.url})`).join(" · ")}`);
  out.push(``);
}

writeFileSync(OUT, out.join("\n"));
console.log(`Wrote ${OUT}: ${events.length} events across ${byDate.size} days`);
const noLink = events.filter((e) => !e.url);
const noTime = events.filter((e) => !e.start);
if (noLink.length) console.log(`  missing link (${noLink.length}): ${noLink.map((e) => e.id).join(", ")}`);
if (noTime.length) console.log(`  missing time (${noTime.length}): ${noTime.map((e) => e.id).join(", ")}`);
