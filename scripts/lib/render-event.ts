// Per-event leaf page — the SEO/rich-result asset. One static page per event
// at /ycweek/<slug>/, reached from the hub via the secondary "More details"
// link and the share button. Carries a single Event + BreadcrumbList JSON-LD.

import { SITE, leafPath, leafUrl, eventSchema, escapeJsonLd } from "./ycweek-shared.ts";

const esc = (s: any) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function longDate(date: string): string {
  const d = new Date(date + "T12:00:00-07:00");
  return `${WEEKDAY[d.getUTCDay() === 0 ? 0 : d.getDay()]}, ${MONTH[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function fmtTime(t: string | null): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${ap}` : `${h12} ${ap}`;
}

const MONTH_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ordinal = (n: number) => n + (["th", "st", "nd", "rd"][(n % 100 - 20) % 10] || ["th", "st", "nd", "rd"][n % 100] || "th");
// "24th July"
function shortWhen(date: string): string {
  const d = new Date(date + "T12:00:00-07:00");
  return `${ordinal(d.getDate())} ${MONTH_LONG[d.getMonth()]}`;
}
// event category for the title tag — specific type wins, else "Afterparty"
function ycCategory(raw: string, vibe: string[] = [], official = false): string {
  const t = raw.toLowerCase();
  if (/hackathon/.test(t)) return "Hackathon";
  if (/poker|game night/.test(t)) return "Game Night";
  if (/mixer/.test(t)) return "Mixer";
  if (/dinner/.test(t)) return "Dinner";
  if (/gala/.test(t)) return "Gala";
  if (/fireside/.test(t)) return "Fireside";
  if (/picnic/.test(t)) return "Picnic";
  if (/brunch/.test(t)) return "Brunch";
  if (/pitch/.test(t)) return "Pitch Night";
  return "Afterparty";
}
const normKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function srcLabel(l: any): string {
  const u = l.u || "";
  if (/luma\.com/.test(u)) return "Luma";
  if (/partiful\.com/.test(u)) return "Partiful";
  if (/eventbrite/.test(u)) return "Eventbrite";
  if (/splashthat/.test(u)) return "Splash";
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return "link"; }
}

export function renderEvent({ event: e, allEvents }: { event: any; allEvents: any[] }): string {
  const day = longDate(e.date);
  const time = e.start ? fmtTime(e.start) + (e.end ? "–" + fmtTime(e.end) : "") : "Time TBA";
  const img = e.img ? (/^https?:\/\//.test(e.img) ? e.img : SITE + e.img) : `${SITE}/assets/ycweek/og.png`;
  const canonical = leafUrl(e);
  const desc = String(e.description || `${e.title} — an event around YC Startup School 2026 in San Francisco.`)
    .replace(/\s+/g, " ")
    .slice(0, 155);
  // readable title: "Photon GoKart Rally — 24th July @ YC SuS Afterparty"
  // (drop the category word if the cleaned name already contains it)
  const cat = ycCategory(e.rawTitle || e.title, e.vibe, e.official);
  const catOut = normKey(e.title).includes(normKey(cat)) ? "" : ` ${cat}`;
  const pageTitle = `${e.title} — ${shortWhen(e.date)} @ YC SuS${catOut}`;

  // same-day siblings for internal linking (excluding self)
  const related = allEvents
    .filter((x) => x.date === e.date && x.slug !== e.slug)
    .sort((a, b) => (a.start || "99:99").localeCompare(b.start || "99:99"))
    .slice(0, 4);

  const eventLd = escapeJsonLd(eventSchema(e, true));
  const breadcrumbLd = escapeJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "YC Startup School 2026 Events", item: SITE + "/ycweek/" },
      { "@type": "ListItem", position: 3, name: e.title, item: canonical },
    ],
  });

  const badges =
    (e.official ? '<span class="mini official">official</span>' : "") +
    (e.access === "sold-out" ? '<span class="mini soldout">sold out</span>' : "") +
    (e.audience ? `<span class="mini aud">${esc(e.audience)}</span>` : "");

  const extra = (e.links || [])
    .filter((l: any) => l.url !== e.url)
    .map((l: any) => `<a class="src" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(srcLabel({ u: l.url }))}</a>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(e.title)} — YC Startup School 2026">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${esc(img)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<script async src="https://analytics.vibecheck-bot.com/js/pa-6zzIV3E5TRGxMKJb4LEAD.js"></script>
<script type="application/ld+json">${eventLd}</script>
<script type="application/ld+json">${breadcrumbLd}</script>
<style>
:root{--bg:#fff;--ink:#141310;--dim:#8b867c;--rule:#eae7df;--y:#ffc33a;--y-deep:#8a6100;
  --f:"Instrument Sans",-apple-system,BlinkMacSystemFont,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:var(--f);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased}
.wrap{max-width:680px;margin:0 auto;padding:0 24px}
.crumb{font-size:13px;color:var(--dim);padding:28px 0 0}
.crumb a{color:var(--dim);text-decoration:none}
.crumb a:hover{color:var(--ink)}
.crumb .sep{margin:0 6px;opacity:.5}
h1{font-size:30px;line-height:1.15;font-weight:600;margin:18px 0 8px;letter-spacing:-.01em}
.when{font-size:16px;color:var(--y-deep);font-weight:600}
.venue{font-size:15px;color:var(--dim);margin-top:2px}
.badges{margin-top:12px;display:flex;flex-wrap:wrap;gap:6px}
.mini{font-size:11px;font-weight:600;padding:3px 8px;border-radius:100px;border:1px solid var(--rule);color:var(--dim)}
.mini.official{background:var(--y);border-color:var(--y);color:var(--ink)}
.mini.soldout{color:#a12;border-color:#f0c9c9}
.hero{width:100%;border-radius:14px;margin:22px 0;border:1px solid var(--rule)}
.body{font-size:17px;line-height:1.6;margin-top:4px}
.tagline{font-size:18px;color:var(--dim);font-style:italic;margin:6px 0 0}
.host{font-size:14px;color:var(--dim);margin-top:18px}
.linkrow{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin:26px 0 8px}
.go{display:inline-flex;align-items:center;background:var(--y);color:var(--ink);font-weight:600;
  text-decoration:none;padding:12px 22px;border-radius:10px;font-size:16px}
.go:hover{background:var(--y-deep);color:#fff}
.src{font-size:13px;color:var(--dim);text-decoration:none;border-bottom:1px solid var(--rule)}
.src:hover{color:var(--ink)}
.related{margin:40px 0 8px;border-top:1px solid var(--rule);padding-top:22px}
.related h2{font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:var(--dim);font-weight:600;margin-bottom:12px}
.related a{display:block;text-decoration:none;color:var(--ink);padding:9px 0;border-bottom:1px solid var(--rule);font-size:15px}
.related a:hover{color:var(--y-deep)}
.related .t{font-size:12px;color:var(--dim);margin-right:8px}
.back{display:inline-block;margin:26px 0 50px;font-size:14px;color:var(--dim);text-decoration:none}
.back:hover{color:var(--ink)}
@media(max-width:520px){h1{font-size:25px}.wrap{padding:0 18px}}
</style>
</head>
<body>
<article class="wrap">
  <nav class="crumb" aria-label="Breadcrumb">
    <a href="/">obaid</a><span class="sep">›</span>
    <a href="/ycweek/">YC Startup School 2026</a><span class="sep">›</span>
    <span>${esc(e.title)}</span>
  </nav>
  <h1>${esc(e.title)}</h1>
  <div class="when">${esc(day)} · ${esc(time)}</div>
  <div class="venue">${esc(e.venue || "San Francisco, CA")}</div>
  ${e.tagline ? `<p class="tagline">${esc(e.tagline)}</p>` : ""}
  <div class="badges">${badges}</div>
  ${e.img ? `<img class="hero" src="${esc(e.img)}" alt="${esc(e.title)} — event artwork" width="800" height="420">` : ""}
  <div class="body">${esc(e.description || "")}</div>
  ${e.note ? `<p class="host">${esc(e.note)}</p>` : ""}
  <p class="host">Hosted by ${esc(e.host || "—")}</p>
  <div class="linkrow">
    <a class="go" href="${esc(e.url)}" target="_blank" rel="noopener">RSVP →</a>
    ${extra ? `<span>${extra}</span>` : ""}
  </div>
  ${related.length ? `<section class="related">
    <h2>More on ${esc(day.replace(/,.*$/, ""))}</h2>
    ${related.map((r) => `<a href="${leafPath(r)}"><span class="t">${esc(fmtTime(r.start) || "TBA")}</span>${esc(r.title)}</a>`).join("\n    ")}
  </section>` : ""}
  <a class="back" href="/ycweek/">← All ${allEvents.length} YC Startup School events</a>
</article>
</body>
</html>
`;
}
