#!/usr/bin/env bun
// Generates an X/Twitter thread from the events JSON.
// bun scripts/build-thread.ts

import { readFileSync, writeFileSync } from "node:fs";
const data = JSON.parse(readFileSync("data/startup-school-2026-events.json", "utf8"));

const VIBE = { networking: "🤝 NETWORKING", tech: "⚙️ TECH", chill: "🌿 CHILL", party: "🎉 PARTY" };

// Hand-written hooks — the part a template can't do.
const HOOK: Record<string, string> = {
  batchelor: "YC's first dating show. 8 contestants on stage, 200 watching, live betting on every date.",
  cocktail: "Land, drop your bags, meet investors. Pre-game for the whole weekend.",
  foundess: "Women shipping AI, one table, fed extremely well. Women only.",
  gokart: "40 go-karts through SF. The anti-rooftop-nametag event.",
  hackathon: "Highest-signal hackathon of the week. Cursor + Dynamic sponsoring.",
  picnic: "Golden Gate Park. Free food, free merch, zero pitch decks.",
  emergence: "Emergence Capital opens up Pier 5. Food, drinks, their whole AI portfolio.",
  betafund: "Penthouse rooftop. Founders landing, investors waiting.",
  compiled: "5-hour build sprint. Cash prizes, YC alumni judging.",
  yacht: "Black tie. Actual yacht. Lightning pitches at sea.",
  stripe: "Stripe's love letter to SF. Sold out — watch for drops.",
  dmodel: "Drinks, snacks, raffle at Spark Social. Badge required.",
  terra: "Vinod Khosla on AI + healthcare. Then dinner with the speakers.",
  archil: "File systems, agent sandboxes, and an Irish pub. They moved venue to fit more people.",
  moss: "Moss + Supabase + Modal + Render. The infra crowd's party.",
  respan: "Waterfront. Music. No panels, no pitches.",
  deusex: "A speakeasy nobody has set foot in. Password required. One night only.",
  corgi: "10 hours to build something you'd actually demo to a YC partner. Overnight.",
  posthog: "The hedgehogs throw a party. Free, all ages, bring your badge.",
  agentmail: "You defended your TAM all day. Now go be a person.",
  legalos: "Harmonic Brewing, Thrive City. Founders, builders, friends of LegalOS.",
  greptile: "9PM–midnight in a coffee shop. The only chill thing running after the parties end.",
  presidio: "Presidio views, food, drinks, and 2x YC founders.",
  canadian: "🇨🇦 Canadian YC startups show what they're building — and who they're hiring.",
  hxyc: "Sunnyside house party. The whole listing reads: 'Welcome friends! Pull up.'",
  farmhouse1: "Stanford hacker house opens its doors. Night one.",
  farmhouse2: "Night two, quieter. For the people still building.",
  fondo: "Sunday night. Food and drinks covered. Just pull up.",
  aws: "The Exploratorium. A Zoox robotaxi. A 40-foot media wall. Sticker quest with a 9PM raffle.",
  microsoft: "Billed as the biggest post-SUS gathering of the weekend. Venue revealed on acceptance.",
  deepmind: "The Pearl. DeepMind + Google Cloud. Demos, games, non-transferable invite.",
  rooftop: "Afrobeats, jazz house, open-format DJ. The last one standing.",
};

const DAY: Record<string, string> = {
  "2026-07-23": "THU 7/23", "2026-07-24": "FRI 7/24",
  "2026-07-25": "SAT 7/25 · DAY 1", "2026-07-26": "SUN 7/26 · DAY 2",
  "2026-07-27": "MON 7/27",
};

const fmt = (t: string | null) => {
  if (!t) return "time TBA";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "pm" : "am", hr = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hr}:${String(m).padStart(2, "0")}${ap}` : `${hr}${ap}`;
};

const events = [...data.events].sort((a, b) =>
  a.date === b.date
    ? (a.start ?? "99:99").localeCompare(b.start ?? "99:99")
    : a.date.localeCompare(b.date));

const tweets: { n: number; text: string; image: string | null; id: string }[] = [];

tweets.push({
  n: 1, id: "__intro", image: null,
  text: `Every event happening around YC Startup School 2026.

32 of them. Thu 7/23 → Mon 7/27, all over SF.

Hackathons, yacht galas, a secret speakeasy, a dating show, and 17 official YC afterparties.

Sorted by day, tagged by vibe. 🧵`,
});

let n = 2, lastDay = "";
for (const e of events) {
  const lines: string[] = [];
  if (e.date !== lastDay) { lines.push(`— ${DAY[e.date]} —`, ""); lastDay = e.date; }
  lines.push(e.vibe.map((v: string) => VIBE[v as keyof typeof VIBE]).join(" + "));
  lines.push("");
  lines.push(e.title);
  const when = e.end ? `${fmt(e.start)}–${fmt(e.end)}` : fmt(e.start);
  lines.push(`${when} · ${e.venue.split(/,| — /)[0]}`);
  lines.push("");
  lines.push(HOOK[e.id] ?? e.tagline ?? e.description.split(".")[0] + ".");
  if (e.access === "sold-out") lines.push("\n⚠️ SOLD OUT");
  else if (e.access === "waitlist") lines.push("\n⚠️ waitlist only");
  if (e.official) lines.push("\n✅ official YC afterparty");
  lines.push("");
  lines.push(e.url);
  tweets.push({ n: n++, id: e.id, image: e.image, text: lines.join("\n") });
}

tweets.push({
  n: n++, id: "__outro", image: null,
  text: `Two things worth knowing:

• YC caps you at ONE official afterparty per day.
• All 4 Sunday officials (AWS, Microsoft, DeepMind, Fondo) run 6–10pm. Total overlap. Pick one.

Friday has zero official events, so Friday is a free-for-all.`,
});

const out = tweets.map((t) => {
  const over = t.text.length > 280 ? `  ⚠️ ${t.text.length} CHARS — OVER LIMIT` : `  (${t.text.length})`;
  return `### ${t.n}/${tweets.length}${over}\n${t.image ? `🖼 ${t.image}\n` : "🖼 (no image)\n"}\n${t.text}\n`;
}).join("\n---\n\n");

writeFileSync("thread-startup-school-2026.md", out);
writeFileSync("data/thread.json", JSON.stringify(tweets, null, 2) + "\n");

// Typefully paste format: tweets separated by a lone "---" line.
writeFileSync(
  "thread-typefully.txt",
  tweets.map((t) => t.text).join("\n\n---\n\n") + "\n"
);

// Which image belongs to which tweet, for attaching in the editor.
const manifest = tweets
  .filter((t) => !t.id.startsWith("__"))
  .map((t) => {
    const ext = t.image ? (/png/.test(t.image) ? "png" : "jpg") : null;
    const file = t.image ? `${String(t.n).padStart(2, "0")}-${t.id}.${ext}` : "(no image)";
    return `${String(t.n).padStart(2, "0")}/${tweets.length}  ${file.padEnd(26)}  ${t.text.split("\n").find((l) => l && !l.startsWith("—") && !/^[🤝⚙️🌿🎉]/.test(l)) ?? t.id}`;
  })
  .join("\n");
writeFileSync("thread-image-manifest.txt", `Tweet → image mapping (attach in order)\n\n${manifest}\n`);

const over = tweets.filter((t) => t.text.length > 280);
const noImg = tweets.filter((t) => !t.image && !t.id.startsWith("__"));
console.log(`${tweets.length} tweets written`);
console.log(`over 280 chars: ${over.length}${over.length ? " → " + over.map((t) => `${t.n}(${t.text.length})`).join(", ") : ""}`);
console.log(`events missing an image: ${noImg.length}${noImg.length ? " → " + noImg.map((t) => t.id).join(", ") : ""}`);
