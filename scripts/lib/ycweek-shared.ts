// Shared helpers for the ycweek hub page and the per-event leaf pages.
// Single source of truth for slugs + Event structured data so the hub's
// ItemList and each leaf's Event block never drift apart.

export const SITE = "https://obaid.wtf";

// keyword-rich, filesystem-safe slug from the event title
export function slugify(s: string): string {
  return String(s)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

// assign a unique `slug` to every event (mutates in place)
export function assignSlugs(events: any[]): void {
  const seen = new Map<string, number>();
  for (const e of events) {
    const base = slugify(e.title) || e.id;
    const n = seen.get(base) || 0;
    seen.set(base, n + 1);
    e.slug = n === 0 ? base : `${base}-${n + 1}`;
  }
}

export const leafPath = (e: any) => `/ycweek/${e.slug}/`;
export const leafUrl = (e: any) => `${SITE}${leafPath(e)}`;

// Hand-cleaned display titles (authored by reading every title), keyed by event
// id. Anything not listed keeps its original. Shown everywhere: cards, leaf h1,
// schema name, and slug. Goal: drop redundant "YC Startup School / SUS" noise
// while keeping each event's identity (host/brand) and never a bare generic word.
export const CLEAN_TITLES: Record<string, string> = {
  gokart: "Photon GoKart Rally",
  picnic: "2nd Annual Startup School Picnic",
  emergence: "Emergence Capital Mixer",
  betafund: "Founder & Investor Mixer",
  compiled: "c0mpiled-11 Hackathon",
  yacht: "Ship 2 Prod: Black-Tie Yacht Gala",
  dmodel: "d_model Afterparty",
  terra: "Fireside: Vinod Khosla × Terra API",
  archil: "File Systems, Sandboxes & the Irish Bank @ Archil",
  moss: "Moss Afterparty",
  respan: "Respan After Party",
  deusex: "Deus Ex Machina",
  posthog: "PostHog After Party",
  agentmail: "AgentMail After Party",
  legalos: "LegalOS After Party",
  greptile: "Greptile Afterhours @ Sōhn",
  canadian: "Canadian YC Founders Showcase",
  hxyc: "H × YC Afterparty",
  farmhouse1: "FarmHouse Afterparty I",
  fondo: "Fondo Afterparty",
  aws: "AWS After Party",
  microsoft: "Microsoft After Party",
  deepmind: "Google DeepMind After Party",
  farmhouse2: "FarmHouse Afterparty II",
  ycpoker: "Tony & Thibaut's Game Night",
  designsocial: "Pre-YC Founder Design Social",
  painting: "Female Founder Painting & Wine Night",
  breakin: "How to Break Into Startups",
  efgamenight: "EF Game Night",
  compiled13: "c0mpiled-13 Hackathon II",
  helium: "Helium × Coval × Phonely Afterparty",
  mintlify: "Mintlify After Party",
  hotpot: "Founder Hot Pot Afterparty",
  anythingbutnames: "Anything But Names: a Sonder × Lemma Afterparty",
  tavus: "Tavus After Party",
  infralayer: "Infra Layer After-Party",
  kickoff: "Kickoff by V1, SX, PittCSC & BuildIllinois",
  agentctos: "Agent CTOs Fireside Chat",
  proxworks: "prox works",
  retell: "Retell After Party",
  afterhours: "After Hours — YC After-After Party",
  roboflow: "Roboflow After Party",
  waferpoker: "Chips & Chips: Wafer Poker Night",
};

export const IMG_DIR = "assets/startup-school-2026";

// resolve each event's image + assign slugs — one derivation shared by the hub
// (renderYcweek) and the leaf pages (build loop) so slugs/images never diverge.
export function prepareEvents(rawEvents: any[], assetFiles: string[]): any[] {
  const imgByID = new Map<string, string>();
  for (const f of assetFiles) {
    const m = f.match(/^\d+-(.+)\.(png|jpe?g|webp)$/);
    if (m) imgByID.set(m[1], f);
  }
  const events = rawEvents.map((e: any) => ({
    ...e,
    // prefer a locally-committed asset; fall back to a remote og:image URL
    img: imgByID.get(e.id) ? `/${IMG_DIR}/${imgByID.get(e.id)}` : (e.image || null),
    rawTitle: e.title,                       // keep the original for category detection
    title: CLEAN_TITLES[e.id] ?? e.title,    // hand-cleaned title shown everywhere
  }));
  assignSlugs(events);          // slugs derive from the cleaned title
  return events;
}

const absUrl = (u: string | null) =>
  !u ? null : /^https?:\/\//.test(u) ? u : `${SITE}${u}`;

// SF observes PDT (-07:00) across July 21–27, 2026
const iso = (date: string, t: string | null) => (t ? `${date}T${t}:00-07:00` : date);

const nextDay = (date: string) => {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
// end time on the same date, rolled to the next day when the event crosses
// midnight (end <= start), so endDate is never before startDate
const isoEnd = (date: string, start: string | null, end: string | null) =>
  !end ? null : `${start && end <= start ? nextDay(date) : date}T${end}:00-07:00`;

// access enum → schema.org Offer availability
const AVAILABILITY: Record<string, string> = {
  open: "InStock",
  "sold-out": "SoldOut",
  waitlist: "PreOrder",
  tba: "PreOrder",
};

// schema.org Event object for one event. Used both nested in the hub's
// ItemList and standalone (with @context) on the leaf page.
export function eventSchema(e: any, withContext = false): any {
  const s: any = {
    ...(withContext ? { "@context": "https://schema.org" } : {}),
    "@type": "Event",
    name: e.title,
    startDate: iso(e.date, e.start),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: e.venue || "San Francisco, CA",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Francisco",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    // the event's own canonical page (Google wants a unique leaf URL here)
    url: leafUrl(e),
  };
  const endDate = isoEnd(e.date, e.start, e.end);
  if (endDate) s.endDate = endDate;
  if (absUrl(e.img)) s.image = absUrl(e.img);
  if (e.description) s.description = String(e.description).slice(0, 300);
  if (e.host) s.organizer = { "@type": "Organization", name: e.host };
  // RSVP link modeled as an Offer; price omitted (unknown/varies — don't assert free)
  if (e.url) {
    const avail = AVAILABILITY[e.access];
    s.offers = {
      "@type": "Offer",
      url: e.url,
      ...(avail ? { availability: `https://schema.org/${avail}` } : {}),
    };
  }
  return s;
}

export const escapeJsonLd = (obj: any) =>
  JSON.stringify(obj).replace(/</g, "\\u003c");
