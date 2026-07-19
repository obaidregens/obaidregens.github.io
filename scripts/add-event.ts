#!/usr/bin/env bun
// Append (or update) manually-sourced events — e.g. ones found via LinkedIn posts
// that never got a Luma/Partiful listing.
//
// Edit MANUAL below, then: bun scripts/add-event.ts

import { readFileSync, writeFileSync } from "node:fs";
const SRC = "data/startup-school-2026-events.json";
const data = JSON.parse(readFileSync(SRC, "utf8"));

const MANUAL = [
  // --- found via the Startup School Discord (#meetups) ---
  {
    id: "dstack", title: "AI Infra Builders Meetup — dstack, Crusoe & SGLang",
    host: "dstack x Crusoe x SGLang", official: false, day: "Thursday", date: "2026-07-23",
    start: "17:30", end: "21:30", venue: "San Francisco, CA",
    vibe: ["tech", "networking"], access: "open",
    description: "An AI infrastructure meetup for engineers, researchers and builders working on GPUs, training and inference. Not a Startup School event, but recommended in the Startup School Discord as the thing to do the night before things kick off.",
    image: null, url: "https://luma.com/rxsn0u0h",
    links: [{ url: "https://luma.com/rxsn0u0h", type: "luma", foundOn: ["discord"] }],
    foundOn: ["discord"],
    note: "Not Startup School branded — its page never mentions YC. Surfaced in the SUS Discord #meetups channel in reply to someone asking what to do in SF before Startup School.",
  },
  // --- found via Luma discover API ---
  {
    id: "ycreject", title: "YC Reject Pitch Night", host: "Sanscritic @ Workato HQ",
    official: false, day: "Tuesday", date: "2026-07-21", start: "17:00", end: "20:30",
    venue: "Workato HQ (two blocks from YC)", vibe: ["networking", "tech"], access: "open",
    description: "Rejected by YC? Good — now come prove them wrong. Founders, investors, operators and startup supporters, with pitches from people who didn't get in.",
    image: null, url: "https://luma.com/yc-reject-pitch-night",
    links: [{ url: "https://luma.com/yc-reject-pitch-night", type: "luma", foundOn: ["luma"] }],
    foundOn: ["luma"],
  },
  {
    id: "ycpoker", title: "Tony & Thibaut's Game Night — YC Startup School edition",
    host: "Tony & Thibaut", official: false, day: "Tuesday", date: "2026-07-21",
    start: "19:00", end: "00:00", venue: "San Francisco, CA",
    vibe: ["chill", "networking"], access: "open",
    description: "Make friends, not contacts. Built as a reaction to networking events — no quick conversations and LinkedIn swaps, just games and a room you actually stay in.",
    image: null, url: "https://luma.com/sfpokeryc",
    links: [{ url: "https://luma.com/sfpokeryc", type: "luma", foundOn: ["luma"] }],
    foundOn: ["luma"],
  },
  {
    id: "designsocial", title: "Pre-YC SUS Founder Design Social",
    host: "Lovart x Entrepreneurs First", official: false, day: "Wednesday", date: "2026-07-22",
    start: "18:00", end: "20:00", venue: "San Francisco, CA",
    vibe: ["networking", "tech"], access: "open",
    description: "For founders and early builders shipping without a designer. An evening on getting strong visuals out of a team that doesn't have a design hire.",
    image: null, url: "https://luma.com/8zbp6goy",
    links: [{ url: "https://luma.com/8zbp6goy", type: "luma", foundOn: ["luma"] }],
    foundOn: ["luma"],
  },
  {
    id: "painting", title: "YC Female Founder: Painting & Wine Night",
    host: "YC female founders", official: false, day: "Thursday", date: "2026-07-23",
    start: "18:00", end: "20:00", venue: "Corgi Cafe, 9 Claude Ln",
    vibe: ["chill"], access: "open", audience: "women only",
    description: "YC female founders painting, drinking wine and working through charcuterie boards. No agenda, no pressure.",
    image: null, url: "https://luma.com/xhj3qxhb",
    links: [{ url: "https://luma.com/xhj3qxhb", type: "luma", foundOn: ["luma"] }],
    foundOn: ["luma"],
  },
  {
    id: "breakin", title: "Startup School Week: How to Break Into Startups",
    host: "680 Folsom", official: false, day: "Friday", date: "2026-07-24",
    start: "16:00", end: "18:00", venue: "680 Folsom St",
    vibe: ["networking", "tech"], access: "open",
    description: "Aimed at summer interns and students finishing college who want to skip the corporate ladder and get into startups instead.",
    image: null, url: "https://luma.com/pxijn023",
    links: [{ url: "https://luma.com/pxijn023", type: "luma", foundOn: ["luma"] }],
    foundOn: ["luma"],
  },
  {
    id: "efgamenight", title: "YC SUS Game Night @ EF",
    host: "Entrepreneurs First", official: false, day: "Friday", date: "2026-07-24",
    start: "16:00", end: "18:00", venue: "Entrepreneurs First, San Francisco",
    vibe: ["chill"], access: "open",
    description: "An evening of niche board games where players compete in unfamiliar circumstances — deliberately designed so you meet people through the game rather than around it.",
    image: null, url: "https://luma.com/0pl3rlxm",
    links: [{ url: "https://luma.com/0pl3rlxm", type: "luma", foundOn: ["luma"] }],
    foundOn: ["luma"],
  },
  {
    id: "compiled13", title: "c0mpiled-13: Startup School Hackathon II",
    host: "c0mpiled x Transpose Platform", official: false, day: "Saturday", date: "2026-07-25",
    start: "18:00", end: "23:00", venue: "Transpose Platform, 27 South Park Suite 100",
    vibe: ["tech"], access: "open",
    description: "The second c0mpiled hackathon of the week, running Saturday night opposite the official afterparties. Dinner, drinks and snacks provided.",
    image: null, url: "https://luma.com/olys436o",
    links: [{ url: "https://luma.com/olys436o", type: "luma", foundOn: ["luma"] }],
    foundOn: ["luma"],
  },
  {
    id: "foundess",
    title: "Women in AI Dinner — Foundess x Uncork",
    host: "Uncork Capital x Foundess x Rho (Pear Chotbunwong)",
    official: false,
    day: "Friday",
    date: "2026-07-24",
    start: "17:00",
    end: null,
    venue: "San Francisco — venue not published",
    vibe: ["networking"],
    access: "open",
    audience: "women only",
    description:
      "A dinner putting women in AI around one table the night before Startup School. Pitched at women who ship code at an AI startup or lab (founding eng / early SWE), do research at a frontier or neolab, or are building their own thing at pre-seed or seed. Confirmed guests span Inflection AI, Cardboard, Scale AI, Vyra, Truli, Elara Health AI, Creatorgen, sixtytwo.ai, and SimXlabs.",
    image: null,
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7482498102956949505/",
    links: [
      {
        url: "https://www.linkedin.com/feed/update/urn:li:activity:7482498102956949505/",
        type: "linkedin",
        foundOn: ["linkedin"],
      },
    ],
    foundOn: ["linkedin"],
    note:
      "Women-only. No RSVP link — entry is comment-gated on the LinkedIn post: comment your name, where you build, and what you're shipping, then tag someone and repost (reposts surface your comment). Hosts say very few spots left. Venue and end time unpublished. Listed on neither YC's page nor startupschoolafter.party.",
  },
  {
    id: "batchelor",
    title: "The BATCHelor — YC Dating Show",
    host: "Hema Dassani x Ditto x CRSHMARKET",
    official: false,
    day: "Thursday",
    date: "2026-07-23",
    start: null,
    end: null,
    venue: "Ditto office, San Francisco",
    vibe: ["chill", "networking"],
    access: "open",
    description:
      "The first Y Combinator dating show. 200 in the audience, 8 picked to date on stage: blind dates, pop-the-balloon, and a steal card that lets you take someone's date mid-round. CRSHMARKET runs live betting on every date, so the room sets odds while you flirt. Hosted by Evan Rama, behind one of the biggest college dating show formats. Framed as a nerve test, not just romance: put yourself out there, think on your feet, get rejected in public. The hosts call it 'networking with benefits'.",
    image: null,
    url: "https://ditto.ai/batchelor",
    links: [
      { url: "https://ditto.ai/batchelor", type: "website", foundOn: ["linkedin"] },
      {
        url: "https://www.linkedin.com/feed/update/urn:li:activity:7483253075814780929/",
        type: "linkedin",
        foundOn: ["linkedin"],
      },
    ],
    foundOn: ["linkedin"],
    note:
      "No time published — the post only says '07.23 · Ditto Office'. Two entry paths, both via the LinkedIn post: comment or DM 'SINGLE' for the contestant application link, 'MINGLE' to attend as audience. The ditto.ai/batchelor page is a casting call with audience/participant buttons and no further detail. Listed on neither YC's page nor startupschoolafter.party.",
  },
];

let added = 0, updated = 0;
for (const ev of MANUAL) {
  const i = data.events.findIndex((e: any) => e.id === ev.id);
  if (i >= 0) { data.events[i] = { ...data.events[i], ...ev }; updated++; }
  else { data.events.push(ev); added++; }
}

data.meta.lastUpdated = new Date().toISOString().slice(0, 10);
if (!data.meta.sourceKeys.linkedin)
  data.meta.sourceKeys.linkedin = "Host announcement post on LinkedIn (verified manually)";

writeFileSync(SRC, JSON.stringify(data, null, 2) + "\n");
console.log(`added ${added}, updated ${updated} — total ${data.events.length} events`);
