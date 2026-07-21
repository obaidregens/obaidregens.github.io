#!/usr/bin/env bun
// Local CLI to test the classifier against a URL.
//   bun scripts/classify-event.ts <url>
// Shows the extracted data + Bedrock's verdict. Does not add anything.

import { readFileSync } from "node:fs";
import { classifyUrl } from "./lib/classify.ts";

// load the Bedrock key from the local file if not already in env
if (!process.env.AWS_BEARER_TOKEN_BEDROCK) {
  try { process.env.AWS_BEARER_TOKEN_BEDROCK = readFileSync(process.env.HOME + "/.claude/bedrock-api-key", "utf8").trim(); } catch {}
}

const url = process.argv[2];
if (!url) { console.error("usage: bun scripts/classify-event.ts <url>"); process.exit(1); }

const t0 = Date.now();
const { extracted, classification } = await classifyUrl(url);
const ms = Date.now() - t0;

console.log("── extracted ──");
console.log("  title :", extracted.ogTitle);
console.log("  start :", extracted.startISO, "→", extracted.endISO);
console.log("  loc   :", extracted.location);
console.log("  image :", extracted.ogImage ? "yes" : "no");
console.log("\n── verdict (" + ms + "ms) ──");
console.log(JSON.stringify(classification, null, 2));

const c = classification;
const decision =
  !c.is_event ? "REJECT (not an event)" :
  !c.in_window ? "REJECT (outside Jul 21-27 / not SF)" :
  !c.is_sus_related ? "REJECT (off-theme — not startup/hacker/YC)" :
  c.confidence >= 0.75 ? "AUTO-ADD (confident)" :
  c.confidence >= 0.4 ? "PENDING (needs review)" :
  "REJECT (low confidence)";
console.log("\n→ " + decision + `  [confidence ${c.confidence}]`);
