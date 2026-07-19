#!/usr/bin/env bun
// Day 2 partner parties: full details pulled via headless-browser rendering
// (their pages are client-rendered / bot-blocked, so plain fetch returns nothing).

import { readFileSync, writeFileSync } from "node:fs";
const SRC = "data/startup-school-2026-events.json";
const data = JSON.parse(readFileSync(SRC, "utf8"));

const PATCH: Record<string, any> = {
  deepmind: {
    title: "Google DeepMind YC Startup School After Party",
    host: "Google DeepMind + Google Cloud",
    start: "18:00",
    end: "22:00",
    venue: "The Pearl, San Francisco",
    vibe: ["party", "tech"],
    access: "open",
    description:
      "Exclusive afterparty with AI leaders from Google DeepMind and Google Cloud, technical experts, and fellow founders. Hands-on product demos, interactive games, and playful vibes. Food, drinks, and music throughout the night.",
    image: null,
    url: "https://rsvp.withgoogle.com/events/gdm-yc-sus-afterparty-2026",
    extraLinks: [
      "https://rsvp.withgoogle.com/events/gdm-yc-sus-afterparty-2026/forms/registration",
    ],
    note:
      "Exclusive to confirmed Startup School attendees; register with the same email used for SUS registration. Invite is non-transferable and guests are not permitted — space is extremely limited. Page branding says 'Google Cloud YC After Party' while YC lists it as Google DeepMind; it is co-hosted by both.",
  },
  aws: {
    title: "The AWS YC Startup School Afterparty",
    host: "AWS + Amazon",
    start: "18:30",
    end: "22:00",
    venue: "Exploratorium, Pier 15 Embarcadero at Green St, San Francisco, CA 94111",
    vibe: ["party", "tech"],
    access: "open",
    description:
      "Afterparty at the Exploratorium, SF's waterfront museum of science and perception. Get up close with a Zoox autonomous robotaxi, go hands-on with Amazon Kiro (their AI coding tool) live, and watch founder stories on a 40-foot media wall. Pick up an Explorer's Quest card at the door, collect stickers across the museum, complete it to enter the raffle — winners announced live at 9 PM. Dinner stations, craft mocktails, recruiters on-site.",
    image: "https://d24wuq6o951i2g.cloudfront.net/img/events/splash/cards/459374115.x3.1be81d2d.png",
    url: "https://awsycstartupschoolafterparty.splashthat.com/",
    note:
      "Exclusive to confirmed Startup School attendees. Bring ID. Register with the same email used for YC Startup School. Agenda: 6:30 PM doors + Explorer's Quest card, 7:00 PM dinner and activations, 9:00 PM raffle winners.",
  },
  microsoft: {
    title: "Microsoft YC AI Startup School After Party",
    host: "Microsoft for Startups",
    start: "18:00",
    end: "22:00",
    venue: "San Francisco, CA — exact venue shared upon acceptance",
    vibe: ["networking", "party"],
    access: "open",
    description:
      "Billed as the biggest post-Startup School gathering of the weekend. Microsoft for Startups hosts hundreds of founders, builders, students, and AI fanatics. Food, games, and conversations — plus how to unlock the YC Student Starter Pack offer. Tagline: 'Your next co-founder, investor, or big opportunity could be in this room.'",
    image:
      "https://microsoftforstartups.eventbuilder.com/events/11f1376c3b274120be33071c025a25a9/uploads/public/b8021aa4d0624047b7b1507320db7755.png",
    url: "https://aka.ms/YCAIStartupSchool/Reception",
    extraLinks: [
      "https://microsoftforstartups.eventbuilder.com/events/11f1376c3b274120be33071c025a25a9?ref=YC",
    ],
    note:
      "Listed as 26 July 2026 18:00 PDT, duration 4 hours. Venue withheld until registration is accepted. Must register with the same email address used for Startup School.",
  },
};

for (const e of data.events) {
  const p = PATCH[e.id];
  if (!p) continue;
  Object.assign(e, {
    title: p.title, host: p.host, start: p.start, end: p.end,
    venue: p.venue, vibe: p.vibe, access: p.access,
    description: p.description, image: p.image, url: p.url, note: p.note,
  });
  e.links = [{ url: p.url, type: "website", foundOn: ["yc-official"] }];
  for (const x of p.extraLinks ?? [])
    e.links.push({ url: x, type: "website", foundOn: ["yc-official"] });
  e.foundOn = ["yc-official"];
}

data.meta.lastUpdated = "2026-07-19";
writeFileSync(SRC, JSON.stringify(data, null, 2) + "\n");

const noLink = data.events.filter((e: any) => !e.url);
const noTime = data.events.filter((e: any) => !e.start);
console.log(`patched: ${Object.keys(PATCH).join(", ")}`);
console.log(`no link: ${noLink.length ? noLink.map((e: any) => e.id).join(", ") : "none"}`);
console.log(`no time: ${noTime.length ? noTime.map((e: any) => e.id).join(", ") : "none"}`);

// Sunday clash check — YC caps you at one official party per day
const sun = data.events.filter((e: any) => e.date === "2026-07-26" && e.official);
console.log(`\nSunday official parties (pick ONE): ${sun.length}`);
for (const e of sun) console.log(`  ${e.start ?? "TBA"}-${e.end ?? "?"}  ${e.title} @ ${e.venue.split(",")[0]}`);
