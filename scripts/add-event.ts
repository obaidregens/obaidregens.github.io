#!/usr/bin/env bun
// Append (or update) manually-sourced events — e.g. ones found via LinkedIn posts
// that never got a Luma/Partiful listing.
//
// Edit MANUAL below, then: bun scripts/add-event.ts

import { readFileSync, writeFileSync } from "node:fs";
const SRC = "data/startup-school-2026-events.json";
const data = JSON.parse(readFileSync(SRC, "utf8"));

const MANUAL = [
  {
    id: "retell", title: "Retell × YC Startup School After Party",
    host: "Retell AI (voice AI)", official: false, day: "Saturday",
    date: "2026-07-25", start: "20:30", end: "00:00", venue: "Secret SF location (revealed by AI phone call)",
    vibe: ["party"], access: "waitlist",
    description: "A Day 1 afterparty from the voice-AI startup Retell. Get on the waitlist; once approved, 48 hours out their AI voice agent phone-calls you with the secret location — so don't miss the call. All ages.",
    image: null, url: "https://partiful.com/e/Ceoeh5peErfZ3SGWe4SQ",
    links: [{ url: "https://partiful.com/e/Ceoeh5peErfZ3SGWe4SQ", type: "partiful", foundOn: ["direct"] }],
    foundOn: ["direct"],
    note: "Location isn't published — an AI voice agent calls approved guests 48h before with the address.",
  },
  // ===== NEW official afterparties added to YC's attendee page (2nd sweep) =====
  {
    id: "helium", title: "YC Startup School Afterparty — Helium, Coval, Phonely",
    host: "Helium (S24), Coval (S24), Phonely (S24)", official: true, day: "Saturday",
    date: "2026-07-25", start: "18:00", end: "22:00", venue: "San Francisco, CA",
    vibe: ["party"], access: "open",
    description: "\"Last year's afterparty was so good we had to run it back.\" YC founders and Startup School participants, drinks, and a post-Day-1 debrief.",
    image: null, url: "https://partiful.com/e/Qm1zv5iS1MIxmoMRJ6FP",
    links: [{ url: "https://partiful.com/e/Qm1zv5iS1MIxmoMRJ6FP", type: "partiful", foundOn: ["yc-official"] }],
    foundOn: ["yc-official"], note: "Startup School badge required at the door.",
  },
  {
    id: "mintlify", title: "YC Startup School: Mintlify After Party",
    host: "Mintlify (W22)", official: true, day: "Saturday",
    date: "2026-07-25", start: "18:00", end: "22:00", venue: "San Francisco, CA",
    vibe: ["chill", "networking"], access: "open",
    description: "A low-key hangout with the Mintlify team after Day 1, heavy on founder-to-founder advice. For Startup School 2026 attendees only.",
    image: null, url: "https://luma.com/mintlify-mpse",
    links: [{ url: "https://luma.com/mintlify-mpse", type: "luma", foundOn: ["yc-official"] }],
    foundOn: ["yc-official"],
  },
  {
    id: "hotpot", title: "YC Startup School Afterparty: Founder Hot Pot",
    host: "Superset (P26), Halluminate (S25)", official: true, day: "Saturday",
    date: "2026-07-25", start: "18:00", end: "21:00", venue: "San Francisco, CA",
    vibe: ["chill", "networking"], access: "open",
    description: "A hot pot afterparty from the founders of Superset and Halluminate. Meet founders, engineers and builders over an actual meal instead of a rooftop.",
    image: null, url: "https://luma.com/mtwf2nth",
    links: [{ url: "https://luma.com/mtwf2nth", type: "luma", foundOn: ["yc-official", "luma"] }],
    foundOn: ["yc-official", "luma"],
  },
  {
    id: "anythingbutnames", title: "Anything But Names: a Sonder × Lemma afterparty",
    host: "Sonder x Lemma (F25)", official: true, day: "Saturday",
    date: "2026-07-25", start: "18:00", end: "21:00", venue: "349 9th St, San Francisco",
    vibe: ["networking"], access: "open",
    description: "A Saturday-night afterparty with a twist: you're known by your stories, dreams and worries rather than your name and title. Built for conversations that skip the pitch.",
    image: null, url: "https://luma.com/wmw6rnmh",
    links: [{ url: "https://luma.com/wmw6rnmh", type: "luma", foundOn: ["yc-official"] }],
    foundOn: ["yc-official"],
  },
  {
    id: "tavus", title: "Tavus × Y Combinator | Startup School Afterparty",
    host: "Tavus (S21)", official: true, day: "Saturday",
    date: "2026-07-25", start: "18:00", end: "22:00", venue: "Tavus, 35 Stillman St, San Francisco",
    vibe: ["party"], access: "open",
    description: "Day one down — take over one of SF's hottest offices, right down the street from YC, with a vintage computer history museum on site.",
    image: null, url: "https://luma.com/tavus-jv2v",
    links: [{ url: "https://luma.com/tavus-jv2v", type: "luma", foundOn: ["yc-official"] }],
    foundOn: ["yc-official"],
  },
  {
    id: "infralayer", title: "YC AI Startup School Infra Layer After-party",
    host: "InsForge (S26), Chronicle Labs (S26), smol machines (S26), Manufact (S25)",
    official: true, day: "Saturday", date: "2026-07-25", start: "18:00", end: "22:00",
    venue: "San Francisco (revealed on approval)", vibe: ["tech", "party"], access: "open",
    description: "Four YC infra companies co-hosting the afterparty for the GPU / agents / systems crowd, straight after Day 1.",
    image: null, url: "https://luma.com/9qz4l69s",
    links: [{ url: "https://luma.com/9qz4l69s", type: "luma", foundOn: ["yc-official", "luma"] }],
    foundOn: ["yc-official", "luma"],
  },
  // ===== NEW non-official, found on afterparty site / Luma (2nd sweep) =====
  {
    id: "kickoff", title: "Startup School 2026 Kickoff by V1, SX, PittCSC & BuildIllinois",
    host: "V1 x SX x PittCSC x BuildIllinois", official: false, day: "Friday",
    date: "2026-07-24", start: null, end: null, venue: "San Francisco, CA",
    vibe: ["networking"], access: "open",
    description: "The student-org kickoff the evening before Startup School — V1, SX, PittCSC and BuildIllinois bringing ambitious builders together regardless of school. Come if you build.",
    image: null, url: "https://partiful.com/e/79nW0XEpnaHGfq0XQODf",
    links: [{ url: "https://partiful.com/e/79nW0XEpnaHGfq0XQODf", type: "partiful", foundOn: ["afterparty-site"] }],
    foundOn: ["afterparty-site"],
  },
  {
    id: "nighthack", title: "Night Hack by Founders, Inc.",
    host: "Founders, Inc.", official: false, day: "Friday",
    date: "2026-07-24", start: "18:30", end: "00:30", venue: "San Francisco, CA",
    vibe: ["tech"], access: "open",
    description: "Founders Inc's recurring overnight hackathon. Last edition drew 50 teams shipping secure sandboxes, robot-training pipelines and sports tech, leaving with cash and credits.",
    image: null, url: "https://luma.com/nighthack",
    links: [{ url: "https://luma.com/nighthack", type: "luma", foundOn: ["afterparty-site"] }],
    foundOn: ["afterparty-site"],
  },
  {
    id: "agentctos", title: "Agent CTOs Fireside Chat | YC Startup School",
    host: "Agent CTOs", official: false, day: "Friday",
    date: "2026-07-24", start: "15:00", end: "18:00", venue: "San Francisco, CA",
    vibe: ["tech"], access: "open",
    description: "A fireside on the agentic era for engineering leaders: what agents can be trusted with, why they fail, and what it takes to make them work in production.",
    image: null, url: "https://luma.com/4c67jnyj",
    links: [{ url: "https://luma.com/4c67jnyj", type: "luma", foundOn: ["luma"] }],
    foundOn: ["luma"],
  },
  {
    id: "proxworks", title: "prox works @ YC SUS",
    host: "Prox", official: false, day: "Monday",
    date: "2026-07-27", start: "12:00", end: null, venue: "San Rafael, CA (private home near Napa/Sonoma)",
    vibe: ["chill"], access: "open",
    description: "A builder residence after Startup School — Prox brings 15 elite engineers to a private home near Napa/Sonoma for a few days of building. Application-based, not a drop-in.",
    image: null, url: "https://luma.com/zsgl2dqw",
    links: [{ url: "https://luma.com/zsgl2dqw", type: "luma", foundOn: ["afterparty-site"] }],
    foundOn: ["afterparty-site"],
    note: "A multi-day residence, not a party — 15 spots, application-based, near Napa/Sonoma.",
  },
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
    start: "18:30",
    end: "22:00",
    venue: "604 Mission St, San Francisco",
    vibe: ["chill", "networking"],
    access: "open",
    description:
      "The first Y Combinator dating show. 200 in the audience, 8 picked to date on stage: blind dates, pop-the-balloon, and a steal card that lets you take someone's date mid-round. CRSHMARKET runs live betting on every date, so the room sets odds while you flirt. Hosted by Evan Rama, behind one of the biggest college dating show formats. Framed as a nerve test, not just romance: put yourself out there, think on your feet, get rejected in public. The hosts call it 'networking with benefits'.",
    image: null,
    url: "https://luma.com/umq1h9te",
    links: [
      { url: "https://luma.com/umq1h9te", type: "luma", foundOn: ["afterparty-site"] },
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
