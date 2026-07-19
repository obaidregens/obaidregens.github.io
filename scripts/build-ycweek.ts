#!/usr/bin/env bun
// Generates ycweek/index.html (→ obaid.wtf/ycweek) from the events JSON.
// bun scripts/build-ycweek.ts

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";

const data = JSON.parse(readFileSync("data/startup-school-2026-events.json", "utf8"));
const IMG_DIR = "assets/startup-school-2026";

const imgByID = new Map<string, string>();
for (const f of readdirSync(IMG_DIR)) {
  const m = f.match(/^\d+-(.+)\.(png|jpe?g|webp)$/);
  if (m) imgByID.set(m[1], f);
}

const DAYS = [
  { date: "2026-07-21", label: "Tuesday", num: "21" },
  { date: "2026-07-22", label: "Wednesday", num: "22" },
  { date: "2026-07-23", label: "Thursday", num: "23" },
  { date: "2026-07-24", label: "Friday", num: "24" },
  { date: "2026-07-25", label: "Saturday", num: "25" },
  { date: "2026-07-26", label: "Sunday", num: "26" },
  { date: "2026-07-27", label: "Monday", num: "27" },
];

const events = data.events.map((e: any) => ({
  ...e,
  img: imgByID.get(e.id) ? `/${IMG_DIR}/${imgByID.get(e.id)}` : null,
}));

const payload = JSON.stringify(
  events.map((e: any) => ({
    id: e.id, t: e.title, h: e.host, d: e.date, s: e.start, e: e.end,
    v: e.venue, vibe: e.vibe, a: e.access, o: e.official,
    desc: e.description, url: e.url, img: e.img, note: e.note ?? null,
    aud: e.audience ?? null, tag: e.tagline ?? null,
    links: (e.links ?? []).map((l: any) => ({ u: l.url, k: l.type })),
  }))
).replace(/</g, "\\u003c");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Every event around YC Startup School 2026</title>
<meta name="description" content="All ${events.length} events happening around YC Startup School 2026 in SF, July 21–27.">
<meta property="og:title" content="Every event around YC Startup School 2026">
<meta property="og:description" content="All ${events.length} events around YC Startup School 2026 in SF, including the ${events.filter((e: any) => e.official).length} official afterparties.">
<meta property="og:url" content="https://obaid.wtf/ycweek">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<script async src="https://analytics.vibecheck-bot.com/js/pa-6zzIV3E5TRGxMKJb4LEAD.js"></script>
<script>window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)}</script>
<style>
:root{
  --bg:#fff; --ink:#141310; --dim:#8b867c; --rule:#eae7df;
  --y:#ffc33a; --y-deep:#8a6100;
  --f:"Instrument Sans",-apple-system,BlinkMacSystemFont,sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:var(--f);font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased}
.wrap{max-width:760px;margin:0 auto;padding:0 24px}

header{padding:64px 0 0;display:flex;align-items:flex-start;gap:28px}
.headtext{flex:1;min-width:0}
.intro{font-size:19px;line-height:1.45;max-width:44ch}

/* "made by" sticker */
.xcard{flex-shrink:0;display:block;text-decoration:none;color:inherit;position:relative;
  background:#fffdf6;border:1px solid var(--rule);border-radius:10px;padding:10px 14px 11px;
  transform:rotate(-1.6deg);transition:transform .22s cubic-bezier(.2,.8,.3,1),box-shadow .22s;
  box-shadow:2px 3px 0 rgba(20,19,16,.06)}
.xcard:hover{transform:rotate(0deg) translateY(-1px);box-shadow:3px 5px 0 var(--y)}
.xcard::before{content:"made by";position:absolute;top:-8px;left:12px;background:var(--y);
  font-size:9.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
  padding:2px 7px;border-radius:100px;color:var(--ink)}
.xrow{display:flex;align-items:center;gap:10px;margin-top:3px}
.xcard img{width:38px;height:38px;border-radius:50%;flex-shrink:0}
.xcard .who{line-height:1.25}
.xcard .nm{font-size:15px;font-weight:600;display:flex;align-items:center;gap:5px}
.xcard .nm svg{width:10px;height:10px;fill:currentColor;opacity:.5}
.xcard .hd{font-size:12px;color:var(--dim)}
.xcard .fl{display:block;margin-top:9px;text-align:center;font-size:11.5px;font-weight:600;
  background:var(--y);color:var(--ink);border-radius:6px;padding:5px 0;letter-spacing:.02em}
.intro b{font-weight:600;-webkit-box-decoration-break:clone;box-decoration-break:clone;
  background-image:linear-gradient(var(--y),var(--y));background-repeat:no-repeat;
  background-position:0 88%;background-size:100% .45em}
.meta{margin-top:12px;font-size:13px;color:var(--dim)}

.filters{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.95);backdrop-filter:blur(10px);padding:14px 0 12px;border-bottom:1px solid var(--rule);margin-top:28px}
.frow{display:flex;flex-wrap:wrap;gap:5px;align-items:center}
.frow+.frow{margin-top:6px}
button.pill{font-family:var(--f);font-size:12.5px;color:var(--dim);background:transparent;border:1px solid var(--rule);border-radius:100px;padding:5px 12px;cursor:pointer;transition:.15s}
button.pill:hover{border-color:var(--ink);color:var(--ink)}
button.pill[aria-pressed="true"]{background:var(--y);border-color:var(--y);color:var(--ink);font-weight:600}
button.pill[data-vibe]{font-weight:600}
button.pill[data-vibe]:hover{border-color:currentColor}
button.pill[data-vibe][aria-pressed="true"]{color:var(--ink)}
button.pill[data-vibe="tech"][aria-pressed="true"]{background:#d7f5ee;border-color:#2bb597}
button.pill[data-vibe="chill"][aria-pressed="true"]{background:#e2e9fb;border-color:#6f8ee0}
button.pill[data-vibe="party"][aria-pressed="true"]{background:#fde3dd;border-color:#e8492a}
.count{margin-left:auto;font-size:12.5px;color:var(--dim);font-variant-numeric:tabular-nums}

.day{margin-top:44px}
.dayhead{display:flex;align-items:baseline;gap:10px;margin-bottom:4px}
.daynum{font-size:34px;font-weight:600;line-height:1;color:var(--y);font-variant-numeric:tabular-nums}
.dayname{font-size:19px;font-weight:600}
.daycount{margin-left:auto;font-size:12.5px;color:var(--dim);font-variant-numeric:tabular-nums}

.ev{border-top:1px solid var(--rule)}
.ev summary{display:grid;grid-template-columns:62px 132px 1fr auto;gap:16px;align-items:center;padding:15px 0;cursor:pointer;list-style:none}
.ev summary::-webkit-details-marker{display:none}
/* per-line highlight: background gradient + clone, so wrapped titles
   underline each line rather than drawing one bar across the whole box */
.ev summary:hover .name{background-size:100% .38em}
.time{font-size:12.5px;color:var(--dim);font-variant-numeric:tabular-nums}
/* 800x420 is the native Luma card size — match it instead of cropping to a square */
.thumb{width:132px;aspect-ratio:800/420;object-fit:cover;border-radius:4px;background:#f3f1ea;
  display:block;transition:transform .2s ease,box-shadow .2s ease}
.ev summary:hover .thumb{transform:scale(1.04);box-shadow:0 3px 12px rgba(20,19,16,.16)}
.noimg{width:132px;aspect-ratio:800/420;border-radius:4px;background:var(--y);display:flex;
  align-items:center;justify-content:center;font-size:22px;font-weight:600;color:rgba(0,0,0,.4)}
/* full-bleed image once a row is expanded */
.detail .hero{display:block;width:100%;max-width:420px;border-radius:6px;margin-bottom:14px}
.name{display:inline;font-size:16px;font-weight:500;line-height:1.45;
  -webkit-box-decoration-break:clone;box-decoration-break:clone;
  background-image:linear-gradient(var(--y),var(--y));
  background-repeat:no-repeat;background-position:0 90%;background-size:0 .38em;
  transition:background-size .18s ease}
.tagline{display:block;font-size:13.5px;color:#5f5a51;margin-top:3px;line-height:1.35}
.where{display:block;font-size:12px;color:var(--dim);margin-top:3px;line-height:1.3}
.where .hostn{color:#6d675d;font-weight:500}
.where .dim{color:#b0aba0;font-weight:400}
.where .dot-sep{margin:0 5px;color:#cfcabe}
.badges{display:flex;gap:6px;align-items:center;flex-shrink:0}
/* bright = fills/dots, deep = text on white (contrast-safe) */
.dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.dot.networking{background:var(--y)}
.dot.tech{background:#2bb597}
.dot.chill{background:#6f8ee0}
.dot.party{background:#e8492a}
.vibes-in{font-size:11.5px;font-weight:600;white-space:nowrap;letter-spacing:.01em}
.vibes-in .sep{color:#c9c4b8;font-weight:400}
.v-networking{color:#8a6100}
.v-tech{color:#12796a}
.v-chill{color:#4257a8}
.v-party{color:#bf3418}
.mini{font-size:10.5px;padding:2px 7px;border-radius:100px;white-space:nowrap;font-weight:500}
.mini.official{background:var(--y);color:var(--ink)}
.mini.soldout{background:#f3f1ea;color:#9a9186;text-decoration:line-through}
.mini.aud{border:1px solid var(--rule);color:var(--dim)}

.detail{padding:0 0 16px 132px;font-size:14px;color:#5f5a51;line-height:1.6}
.detail .note{margin-top:8px;padding-left:12px;border-left:3px solid var(--y);color:var(--ink);font-size:13.5px}
.detail .who{margin-top:9px;font-size:12.5px;color:var(--dim)}
.linkrow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:13px}
.detail .go{font-size:13px;font-weight:600;color:var(--ink);text-decoration:none;box-shadow:inset 0 -.4em 0 var(--y)}
.detail .go:hover{box-shadow:inset 0 -1.1em 0 var(--y)}
.alsolbl{font-size:11.5px;color:#b8b3a7;margin-left:4px}
.src{font-size:11.5px;color:var(--dim);text-decoration:none;border:1px solid var(--rule);border-radius:100px;padding:3px 9px;transition:.15s;white-space:nowrap}
.src:hover{border-color:var(--ink);color:var(--ink)}

/* repeat of the sticker, after the list */
.endcap{display:flex;justify-content:center;margin-top:64px}
.endcap .xcard{transform:rotate(1.4deg);min-width:210px;text-align:left}
.endcap .xcard:hover{transform:rotate(0deg) translateY(-1px)}
.endcap .xcard::before{content:"made by";left:auto;right:12px}

.empty{padding:56px 0;text-align:center;color:var(--dim);font-size:13.5px}
footer{margin-top:64px;padding:22px 0 56px;border-top:3px solid var(--y);font-size:12.5px;color:var(--dim);line-height:1.85}
footer a{color:var(--y-deep)}

@media(max-width:640px){
  header{padding:40px 0 0;flex-direction:column-reverse;align-items:flex-start;gap:18px}
  .xcard{padding:5px 12px 5px 5px}
  .xcard img{width:30px;height:30px}
  .intro{font-size:17px}
  .ev summary{grid-template-columns:104px 1fr;gap:12px;align-items:start}
  .time{grid-column:1;grid-row:1;padding-top:2px}
  .thumb,.noimg{grid-column:1;grid-row:2;width:104px}
  .ev summary > span:nth-of-type(2){grid-column:2;grid-row:1/span 2}
  .badges{grid-column:2;justify-content:flex-start;margin-top:4px}
  .detail{padding-left:0}
  .detail .hero{max-width:100%}
}
</style>
</head>
<body>
<div class="wrap">

<header>
  <div class="headtext">
    <p class="intro">Every event around <b>YC Startup School 2026</b>. San Francisco, July 21–27.</p>
    <p class="meta">${events.length} events · ${events.filter((e: any) => e.official).length} official · tap any for details</p>
  </div>
  <a class="xcard" href="https://x.com/wtfobaid" target="_blank" rel="noopener" aria-label="made by obaid — follow @wtfobaid on X">
    <span class="xrow">
      <img src="/assets/ycweek/wtfobaid.jpg" alt="" width="38" height="38" loading="lazy">
      <span class="who">
        <span class="nm">obaid <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 1.2h3.7l-8 9.1 9.4 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.4h2L6.5 3.3H4.4l13.2 17.3Z"/></svg></span>
        <span class="hd">@wtfobaid</span>
      </span>
    </span>
    <span class="fl">follow for updates</span>
  </a>
</header>

<div class="filters">
  <div class="frow">
    <button class="pill" data-day="all" aria-pressed="true">all days</button>
    ${DAYS.map((d) => `<button class="pill" data-day="${d.date}" aria-pressed="false">${d.label.slice(0, 3)} ${d.num}</button>`).join("\n    ")}
    <span class="count" id="count"></span>
  </div>
  <div class="frow">
    <button class="pill" data-vibe="all" aria-pressed="true">all vibes</button>
    <button class="pill v-networking" data-vibe="networking" aria-pressed="false">networking</button>
    <button class="pill v-tech" data-vibe="tech" aria-pressed="false">tech</button>
    <button class="pill v-chill" data-vibe="chill" aria-pressed="false">chill</button>
    <button class="pill v-party" data-vibe="party" aria-pressed="false">party</button>
    <button class="pill" data-only="official" aria-pressed="false">official only</button>
  </div>
</div>

<main id="list"></main>

<div class="endcap">
  <a class="xcard" href="https://x.com/wtfobaid" target="_blank" rel="noopener" aria-label="made by obaid — follow @wtfobaid on X">
    <span class="xrow">
      <img src="/assets/ycweek/wtfobaid.jpg" alt="" width="38" height="38" loading="lazy">
      <span class="who">
        <span class="nm">obaid <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 1.2h3.7l-8 9.1 9.4 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.4h2L6.5 3.3H4.4l13.2 17.3Z"/></svg></span>
        <span class="hd">@wtfobaid</span>
      </span>
    </span>
    <span class="fl">follow me for more</span>
  </a>
</div>

<footer>
  <div>Updated ${data.meta.lastUpdated} · times PT · not affiliated with YC · confirm with the host</div>
  <div style="margin-top:10px">missing something? <a href="https://x.com/wtfobaid">dm</a> or <a href="mailto:me@obaid.wtf?subject=YC%20Week%20%E2%80%94%20missing%20event">email me</a></div>
</footer>

</div>

<script>
const EVENTS = ${payload};
const DAYS = ${JSON.stringify(DAYS)};
const state = { day: "all", vibe: "all", official: false };

const fmt = t => {
  if (!t) return "TBA";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "pm" : "am", hr = h % 12 === 0 ? 12 : h % 12;
  return m ? hr + ":" + String(m).padStart(2, "0") + ap : hr + ap;
};

// Multi-host strings get collapsed: "Moss (F25), Supabase (S20), Modal, Render"
// becomes "Moss (F25) +3". Full list still shows when the row is expanded.
function hostShort(h) {
  if (!h) return "";
  const parts = h.split(/\\s+x\\s+|,\\s*/i).map(s => s.trim()).filter(Boolean);
  if (parts.length <= 1) return h;
  return parts[0] + ' <span class="dim">+' + (parts.length - 1) + "</span>";
}

// Label a source link: LinkedIn posts resolve to the poster's handle,
// everything else to its platform or host.
function srcLabel(l) {
  if (l.k === "luma") return "Luma";
  if (l.k === "partiful") return "Partiful";
  if (l.k === "linkedin") {
    const m = l.u.match(/\\/posts\\/([^_\\/]+)_/);
    // profile slugs carry a trailing id: "mehul-agarwal-a274a0287"
    return m ? "@" + m[1].replace(/-[a-z0-9]{7,}$/i, "") : "LinkedIn";
  }
  try { return new URL(l.u).hostname.replace(/^www\\./, ""); } catch { return "link"; }
}

// Every link except the primary one already used by the RSVP button.
function extraSources(e) {
  const rest = (e.links || []).filter(l => l.u !== e.url);
  if (!rest.length) return "";
  return '<span class="alsolbl">also on</span>' + rest.map(l =>
    '<a class="src" href="' + l.u + '" target="_blank" rel="noopener">' + srcLabel(l) + '</a>'
  ).join("");
}

const matches = e =>
  (state.day === "all" || e.d === state.day) &&
  (state.vibe === "all" || e.vibe.includes(state.vibe)) &&
  (!state.official || e.o);

function render() {
  const list = document.getElementById("list");
  const shown = EVENTS.filter(matches);
  document.getElementById("count").textContent = shown.length + " of " + EVENTS.length;
  if (!shown.length) { list.innerHTML = '<div class="empty">nothing matches that.</div>'; return; }

  let html = "";
  for (const d of DAYS) {
    const evs = shown.filter(e => e.d === d.date)
      .sort((a, b) => (a.s || "99:99").localeCompare(b.s || "99:99"));
    if (!evs.length) continue;
    html += '<section class="day"><div class="dayhead"><span class="daynum">' + d.num +
      '</span><span class="dayname">' + d.label + '</span><span class="daycount">' + evs.length + '</span></div>';
    for (const e of evs) {
      const dots = '<span class="vibes-in">' +
        e.vibe.map(v => '<span class="v-' + v + '">' + v + '</span>').join('<span class="sep">+</span>') +
        '</span>';
      const mini =
        (e.o ? '<span class="mini official">official</span>' : "") +
        (e.a === "sold-out" ? '<span class="mini soldout">sold out</span>' : "") +
        (e.aud ? '<span class="mini aud">' + e.aud + '</span>' : "");
      const thumb = e.img
        ? '<img class="thumb" src="' + e.img + '" alt="" loading="lazy">'
        : '<div class="noimg">' + e.t.replace(/^(The|YC)\\s+/i, "").charAt(0).toUpperCase() + '</div>';
      html += '<details class="ev"><summary>' +
        '<span class="time">' + (e.s ? fmt(e.s) : "TBA") + '</span>' + thumb +
        '<span><span class="name">' + e.t + '</span>' +
        (e.tag ? '<span class="tagline">' + e.tag + '</span>' : "") +
        '<span class="where"><span class="hostn">' + hostShort(e.h) + '</span>' +
        '<span class="dot-sep">·</span>' + e.v.split(/,| — /)[0] + '</span></span>' +
        '<span class="badges">' + mini + dots + '</span></summary>' +
        '<div class="detail">' +
        (e.img ? '<img class="hero" src="' + e.img + '" alt="" loading="lazy">' : "") + e.desc +
        (e.note ? '<div class="note">' + e.note + '</div>' : "") +
        '<div class="who">' + e.h + ' · ' + (e.s ? fmt(e.s) + (e.e ? "–" + fmt(e.e) : "") : "time TBA") + '</div>' +
        '<div class="linkrow"><a class="go" href="' + e.url + '" target="_blank" rel="noopener">RSVP →</a>' +
        extraSources(e) + '</div></div></details>';
    }
    html += "</section>";
  }
  list.innerHTML = html;
}

document.querySelectorAll("button.pill").forEach(b => {
  b.addEventListener("click", () => {
    if (b.dataset.day) {
      state.day = b.dataset.day;
      document.querySelectorAll("[data-day]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    } else if (b.dataset.vibe) {
      state.vibe = b.dataset.vibe;
      document.querySelectorAll("[data-vibe]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    } else {
      state.official = !state.official;
      b.setAttribute("aria-pressed", String(state.official));
    }
    render();
  });
});
render();
</script>
</body>
</html>
`;

mkdirSync("ycweek", { recursive: true });
writeFileSync("ycweek/index.html", html);
console.log(`wrote ycweek/index.html — ${events.length} events, ${(html.length / 1024).toFixed(1)} KB`);
