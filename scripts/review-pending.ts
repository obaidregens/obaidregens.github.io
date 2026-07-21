#!/usr/bin/env bun
// Review medium-confidence submissions queued by the Lambda.
//   bun scripts/review-pending.ts          list the queue
//   bun scripts/review-pending.ts approve <id>
//   bun scripts/review-pending.ts reject  <id>
// Approving moves the item into the main events JSON; reject drops it.
// Then run build-ycweek.ts (or let the GitHub Action rebuild on commit).

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const DATA = "data/startup-school-2026-events.json";
const PENDING = "data/pending-submissions.json";
const [cmd, id] = process.argv.slice(2);

const pending = existsSync(PENDING) ? JSON.parse(readFileSync(PENDING, "utf8")) : { items: [] };
const items = pending.items || [];

if (!cmd || cmd === "list") {
  if (!items.length) { console.log("queue empty"); process.exit(0); }
  console.log(`${items.length} pending:\n`);
  for (const it of items) {
    console.log(`  ${it.id}`);
    console.log(`    ${it.title}  [conf ${it.confidence}]`);
    console.log(`    ${it.date} ${it.start ?? ""} · ${it.venue}`);
    console.log(`    ${it.url}`);
    console.log(`    why-flagged: ${it.reason}\n`);
  }
  console.log("approve:  bun scripts/review-pending.ts approve <id>");
  console.log("reject:   bun scripts/review-pending.ts reject <id>");
  process.exit(0);
}

const idx = items.findIndex((x: any) => x.id === id);
if (idx < 0) { console.error(`no pending item "${id}"`); process.exit(1); }
const item = items[idx];

if (cmd === "reject") {
  items.splice(idx, 1);
  writeFileSync(PENDING, JSON.stringify({ items }, null, 2) + "\n");
  console.log(`rejected & removed: ${item.title}`);
  process.exit(0);
}

if (cmd === "approve") {
  const data = JSON.parse(readFileSync(DATA, "utf8"));
  if (data.events.some((e: any) => e.id === item.id)) { console.error("id already in data"); process.exit(1); }
  const { reason, ...clean } = item; // drop the review note
  data.events.push(clean);
  data.meta.lastUpdated = new Date().toISOString().slice(0, 10);
  if (!data.meta.sourceKeys.submission) data.meta.sourceKeys.submission = "Submitted via the site";
  writeFileSync(DATA, JSON.stringify(data, null, 2) + "\n");
  items.splice(idx, 1);
  writeFileSync(PENDING, JSON.stringify({ items }, null, 2) + "\n");
  console.log(`approved & added: ${item.title}`);
  console.log("now rebuild:  bun scripts/build-ycweek.ts");
  process.exit(0);
}

console.error("unknown command; use list | approve <id> | reject <id>");
process.exit(1);
