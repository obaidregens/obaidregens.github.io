// Shared event-classifier core. Used by the local CLI (classify-event.ts) and
// the Lambda submit handler. Fetches an event URL, extracts what it can, and
// asks Bedrock (Claude Haiku 4.5) whether it's a real SUS-week SF event —
// returning a structured event object in our JSON schema plus a confidence.

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
// Opus 4.6 by default; override via env for a cheaper classifier.
//   Opus 4.6:   us.anthropic.claude-opus-4-6-v1
//   Sonnet 4.6: us.anthropic.claude-sonnet-4-6
//   Haiku 4.5:  us.anthropic.claude-haiku-4-5-20251001-v1:0
const BEDROCK_MODEL = process.env.BEDROCK_MODEL || "us.anthropic.claude-opus-4-6-v1";
const BEDROCK_REGION = process.env.BEDROCK_REGION || "us-east-1";

// The event week. Anything outside this SF window is out of scope.
export const WINDOW = { from: "2026-07-21", to: "2026-07-27" };

export type Extracted = {
  url: string;
  finalUrl: string;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  startISO: string | null;
  endISO: string | null;
  location: string | null;
  textSnippet: string;
  sourceHost: string;
};

export type Classification = {
  is_event: boolean;
  is_sus_related: boolean;
  in_window: boolean;
  confidence: number; // 0..1
  reason: string;
  event: {
    title: string;
    host: string;
    date: string | null; // YYYY-MM-DD (PT)
    start: string | null; // HH:MM 24h (PT)
    end: string | null;
    venue: string;
    vibe: string[]; // subset of networking|tech|chill|party
    access: string; // open|waitlist|sold-out|tba
    description: string;
    tagline: string;
    audience: string | null; // e.g. "women only", "students only", else null
    note: string | null; // caveat: comment-gated entry, badge required, address-on-approval, tentative…
  } | null;
};

const meta = (h: string, p: string) => {
  const m =
    h.match(new RegExp(`<meta[^>]+(?:property|name)=["']${p}["'][^>]+content=["']([^"']*)["']`, "i")) ||
    h.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${p}["']`, "i"));
  return m ? m[1].replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/").replace(/&quot;/g, '"') : null;
};

export async function extract(url: string): Promise<Extracted> {
  const r = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(20000) });
  const h = await r.text();

  let startISO: string | null = null,
    endISO: string | null = null,
    location: string | null = null;

  // JSON-LD Event
  for (const m of h.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      const e = Array.isArray(j) ? j.find((x: any) => /Event/i.test(x["@type"] || "")) : j;
      if (e && (e.startDate || e.start_at)) {
        startISO = e.startDate || e.start_at;
        endISO = e.endDate || e.end_at || null;
        if (e.location) location = e.location.name || e.location.address?.streetAddress || null;
      }
    } catch {}
  }
  // Luma / Partiful embedded fields
  if (!startISO) startISO = (h.match(/"start_at":"([^"]+)"/) || h.match(/"startDate":"([^"]+)"/) || [])[1] || null;
  if (!endISO) endISO = (h.match(/"end_at":"([^"]+)"/) || h.match(/"endDate":"([^"]+)"/) || [])[1] || null;
  if (!location)
    location =
      (h.match(/"full_address":"([^"]+)"/) || h.match(/"city_state":"([^"]+)"/) || h.match(/"address":"([^"]+)"/) || [])[1] ||
      null;

  const text = h
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  // social posts (LinkedIn/IG/X) carry the event details in the description,
  // not structured fields — grab the richest text we can from either.
  const desc = meta(h, "og:description") || meta(h, "twitter:description") || meta(h, "description");
  const host = (() => { try { return new URL(r.url).hostname.replace(/^www\./, ""); } catch { return ""; } })();

  return {
    url,
    finalUrl: r.url,
    ogTitle: meta(h, "og:title") || meta(h, "twitter:title"),
    ogDescription: desc,
    ogImage: meta(h, "og:image") || meta(h, "twitter:image"),
    startISO,
    endISO,
    location,
    textSnippet: (desc && desc.length > text.length ? desc : text).slice(0, 2200),
    sourceHost: host,
  };
}

const PT = (iso: string | null, opts: Intl.DateTimeFormatOptions) =>
  iso ? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles", ...opts }).format(new Date(iso)) : null;

// portable base64 (bun + Cloudflare Workers)
function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

// og:image is usually a resized/cropped social card. Upgrade it to the full,
// UNCROPPED original so the model can read text at the poster's edges (Luma's
// card is center-cropped to 800x420 and would clip a tall poster's date).
function fullResImage(u: string): string {
  // Luma: strip the "/cdn-cgi/image/<transform>/" crop segment → original asset
  if (/lumacdn\.com\/cdn-cgi\/image\//.test(u)) return u.replace(/\/cdn-cgi\/image\/[^/]+\//, "/");
  // Partiful/imgix: request larger, fit=max (no crop, aspect kept)
  if (/imgix\.net/.test(u)) return u.split("?")[0] + "?w=1600&fit=max";
  // LinkedIn: prefer a larger shrink variant when present
  if (/media\.licdn\.com/.test(u)) return u.replace(/feedshare-shrink_\d+/, "feedshare-shrink_2048");
  return u;
}

// Fetch the poster and return a Bedrock image block, or null. Event posters
// often print the date/venue that the caption drops (see LinkedIn posts), so
// feeding the full image lets the model read it directly.
async function fetchPoster(url: string | null): Promise<{ media_type: string; data: string } | null> {
  if (!url) return null;
  try {
    let target = fullResImage(url);
    let r = await fetch(target, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(15000) });
    if (!r.ok && target !== url) r = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(15000) }); // fall back to the og card
    if (!r.ok) return null;
    const ct = (r.headers.get("content-type") || "").toLowerCase();
    const media = ct.includes("png") ? "image/png" : ct.includes("webp") ? "image/webp"
      : ct.includes("gif") ? "image/gif" : "image/jpeg";
    const buf = await r.arrayBuffer();
    if (buf.byteLength < 500 || buf.byteLength > 4_500_000) return null; // skip empties / oversize
    return { media_type: media, data: toBase64(buf) };
  } catch { return null; }
}

// Library reads the key from env only (Worker-safe — no fs). Callers populate
// process.env (the CLI loads it from ~/.claude/bedrock-api-key; the Worker from
// a wrangler secret).
function bedrockKey(): string {
  const k = (globalThis as any).process?.env?.AWS_BEARER_TOKEN_BEDROCK;
  if (!k) throw new Error("no Bedrock key: set AWS_BEARER_TOKEN_BEDROCK");
  return k;
}

const SYSTEM = `You curate a directory of events happening around YC Startup School 2026 in San Francisco. Event week is July 21-27, 2026, in the SF Bay Area.

The input is scraped data from ONE URL. It can be any kind of page: a Luma or Partiful event, a LinkedIn / Instagram / X post announcing an event, a host's own site, or something that isn't an event at all. Luma/Partiful give clean structured dates; social posts hide everything in the post text (ogDescription) — read it like a human and pull the event out of the prose.

Decide:
- is_event: does this URL represent ONE real-world gathering (party, mixer, hackathon, dinner, fireside, showcase, meetup, residence)? Not a company homepage, a person's profile, an article, or a generic multi-event calendar.
- is_sus_related: is this for the startup / founder / hacker / builder / YC crowd around Startup School? TRUE if it is SUS/YC-branded, OR a startup/tech founder event (mixer, hackathon, demo day, founder dinner, VC/AI/infra event, builder residence) in SF that week. FALSE for anything off-theme even if it's in SF that same week — e.g. a marathon afterparty, a general nightlife party, a sports meetup, a non-tech networking event, a wedding, a concert. When in doubt about theme, set false. This is the gate that keeps the directory on-topic, so do not stretch it.
- in_window: is its date within July 21-27, 2026, in the SF Bay Area?
- confidence: 0..1 — your certainty this belongs in a YC Startup School week directory. Be strict: a company homepage or an out-of-town/out-of-window event is low. A clearly SUS-branded SF party in-window is high (0.9+). A plausible-but-underspecified social post is medium (0.5-0.7).

If is_event, extract the event. Field rules:
- date: YYYY-MM-DD Pacific. start/end: HH:MM 24h Pacific, or null if the text doesn't say. Read relative dates ("this Saturday", "the night before Startup School") against the July 21-27 week.
- venue: address or area. If the host withholds it ("revealed on approval", "secret location", "DM for address"), put the best area you can and record the withholding in note.
- vibe: 1-2 from exactly ["networking","tech","chill","party"]. networking=mixers/dinners/showcases/investor meetups; tech=hackathons/firesides/technical talks; chill=low-key hangs, coworking, games, sports, picnics, residences; party=drinks/music/DJs/late night.
- access: "open" (RSVP/register), "waitlist", "sold-out", or "tba". For a social post with no RSVP link where you get in by commenting/DMing, use "tba".
- host: organizing person/company, short. Keep YC batch tags e.g. "Retell (S24)", "Tavus (S21)".
- description: 1-2 factual sentences. tagline: <=70 chars — the catch or the draw, never a restatement of the title.
- audience: if entry is restricted to a group (e.g. "women only", "students only", "YC founders only"), say so; else null.
- note: any catch a person would want before RSVPing — comment/DM-gated entry and how ("comment PREMIERE"), badge required at door, address-revealed-on-approval, invite-only, tentative/unconfirmed date, non-transferable. Else null.
- Prefer scraped start/end/location fields when present; they beat prose.

Output ONLY one JSON object, no markdown:
{"is_event":bool,"is_sus_related":bool,"in_window":bool,"confidence":number,"reason":"short","event":{"title","host","date","start","end","venue","vibe":[],"access","description","tagline","audience","note"}|null}`;

export async function classify(ex: Extracted): Promise<Classification> {
  const userData = {
    url: ex.finalUrl,
    sourceHost: ex.sourceHost,
    ogTitle: ex.ogTitle,
    ogDescription: ex.ogDescription,
    scraped_start_PT: PT(ex.startISO, { weekday: "short", year: "numeric", month: "2-digit", day: "2-digit" }),
    scraped_start_time_PT: PT(ex.startISO, { hour: "2-digit", minute: "2-digit", hour12: false }),
    scraped_end_time_PT: PT(ex.endISO, { hour: "2-digit", minute: "2-digit", hour12: false }),
    scraped_start_date: PT(ex.startISO, { year: "numeric", month: "2-digit", day: "2-digit" }),
    scraped_location: ex.location,
    pageText: ex.textSnippet,
  };

  // multimodal: attach the full-res poster when available so the model can read
  // date/venue printed on the image (often present when the caption omits them)
  const content: any[] = [{ type: "text", text: "Scraped data:\n" + JSON.stringify(userData, null, 1) }];
  const poster = await fetchPoster(ex.ogImage);
  if (poster) {
    content.push({
      type: "text",
      text: "Below is the event's poster/cover image. Read any date, time, venue, host, or access details printed on it — treat text on the poster as authoritative, especially where the scraped fields above are missing or truncated.",
    });
    content.push({ type: "image", source: { type: "base64", media_type: poster.media_type, data: poster.data } });
  }

  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 700,
    system: SYSTEM,
    messages: [{ role: "user", content }],
  });

  const url = `https://bedrock-runtime.${BEDROCK_REGION}.amazonaws.com/model/${encodeURIComponent(BEDROCK_MODEL)}/invoke`;
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + bedrockKey(), "Content-Type": "application/json" },
    body,
    signal: AbortSignal.timeout(30000),
  });
  if (!r.ok) throw new Error(`bedrock ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j: any = await r.json();
  const raw = (j.content?.[0]?.text || "").trim().replace(/^```json\s*|\s*```$/g, "");
  const parsed = JSON.parse(raw) as Classification;

  // trust scraped date/time over the model when we have them
  if (parsed.event) {
    const d = PT(ex.startISO, { year: "numeric", month: "2-digit", day: "2-digit" });
    if (d) {
      parsed.event.date = d;
      parsed.in_window = d >= WINDOW.from && d <= WINDOW.to;
    }
    const st = PT(ex.startISO, { hour: "2-digit", minute: "2-digit", hour12: false });
    const en = PT(ex.endISO, { hour: "2-digit", minute: "2-digit", hour12: false });
    if (st) parsed.event.start = st;
    if (en) parsed.event.end = en;
  }
  return parsed;
}

export async function classifyUrl(url: string) {
  const ex = await extract(url);
  const cls = await classify(ex);
  return { extracted: ex, classification: cls };
}
