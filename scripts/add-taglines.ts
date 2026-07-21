#!/usr/bin/env bun
// Adds a short one-line `tagline` to every event. Single source of truth for
// both the page (ycweek) and the X thread.

import { readFileSync, writeFileSync } from "node:fs";
const SRC = "data/startup-school-2026-events.json";
const data = JSON.parse(readFileSync(SRC, "utf8"));

// Rule: say something the title and venue don't already say.
// The catch, the draw, or the thing that decides it for you.
const TAGLINE: Record<string, string> = {
  ycreject: "Rejected by YC? That's the entry requirement.",
  ycpoker: "Games instead of nametag swaps. Runs to midnight.",
  designsocial: "For founders shipping without a designer on the team.",
  painting: "Painting, wine and charcuterie. Genuinely no agenda.",
  breakin: "Aimed at interns and students, not founders.",
  efgamenight: "Niche board games, picked so nobody has an advantage.",
  compiled13: "A second hackathon, running opposite Saturday's afterparties.",
  retell: "The waitlist calls you — literally. An AI agent phones the address.",
  healthday: "Padel, a workout and a cold plunge before the keynotes start.",
  helium: "Badge required. Last year's ran so well they rebooked it.",
  mintlify: "Low-key, heavy on founder-to-founder advice. Attendees only.",
  hotpot: "An actual hot pot dinner instead of another rooftop.",
  anythingbutnames: "No names, no titles — you're known by your stories.",
  tavus: "Office takeover down the street from YC, with a computer museum.",
  infralayer: "Four YC infra startups, one room. The GPU crowd.",
  kickoff: "Student orgs' pre-game the night before. Any school, just build.",
  nighthack: "Founders Inc's overnight hack. Last one drew 50 teams.",
  agentctos: "For eng leaders: what agents can be trusted with, and why they fail.",
  proxworks: "A multi-day builder residence near Napa. 15 spots, apply.",
  dstack: "Not a Startup School event — the Discord just rates it.",
  cocktail: "First thing on the calendar all week. Address revealed on approval.",
  gokart: "A 40-car convoy past the landmarks, finishing with drinks and merch.",
  hackathon: "Cursor and Dynamic sponsoring. Built for student engineers.",
  picnic: "Register on Luma or you don't get the food and merch.",
  emergence: "Their AI portfolio companies in the room, before anything official starts.",
  betafund: "They don't tell you the address until you're approved.",
  compiled: "Cash prizes, YC alumni judging, tracks pulled from YC's Summer RFS.",
  yacht: "Product demos and lightning pitches, on the water.",
  batchelor: "Eight date on stage, 200 watch, and the room bets live on it.",
  foundess: "Guests from Inflection, Scale and Cardboard. Comment on the post to get in.",
  stripe: "Day 1's biggest name — and it went in days.",
  dmodel: "Badge or confirmation email at the door. Raffle for swag.",
  terra: "Ask Khosla anything, then eat dinner with the speakers.",
  archil: "Moved venue to fit more people. Free Archil credits for attendees.",
  moss: "Four infra companies co-hosting — Supabase, Modal and Render included.",
  respan: "No panels, no pitches. Attendees only.",
  deusex: "Password at the door, and they won't publish the address.",
  corgi: "Ten hours, overnight, and YC founders judge what you ship.",
  posthog: "Free, all ages, no cap. Just bring your badge.",
  agentmail: "No agenda whatsoever. That's the entire pitch.",
  legalos: "A brewery, not an office. Runs to 10.",
  greptile: "Starts at 9pm, when everything else ends. Coffee, not cocktails.",
  presidio: "Hosted by two-time YC founders, with park views.",
  canadian: "They're hiring, and they'll tell you exactly for what.",
  hxyc: "Someone's house. The entire listing is two words long.",
  farmhouse1: "A Stanford hacker house. No RSVP page and no times posted.",
  farmhouse2: "Smaller than night one, aimed at people still building.",
  fondo: "Badge required at the door. Food and drinks on them.",
  aws: "A Zoox robotaxi indoors, a sticker quest, and a 9pm raffle.",
  microsoft: "Hundreds expected. Venue stays secret until you're accepted.",
  deepmind: "Non-transferable, no guests. Register with your Startup School email.",
  rooftop: "Two days after everything ends. Open-format DJ till late.",
};

let set = 0;
const missing: string[] = [];
for (const e of data.events) {
  if (TAGLINE[e.id]) { e.tagline = TAGLINE[e.id]; set++; }
  else missing.push(e.id);
}

writeFileSync(SRC, JSON.stringify(data, null, 2) + "\n");
console.log(`taglines set: ${set}/${data.events.length}`);
if (missing.length) console.log(`MISSING: ${missing.join(", ")}`);
const long = data.events.filter((e: any) => e.tagline && e.tagline.length > 75);
if (long.length) console.log(`over 75 chars: ${long.map((e: any) => `${e.id}(${e.tagline.length})`).join(", ")}`);
