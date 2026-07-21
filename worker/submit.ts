// Cloudflare Worker — event submission endpoint for the ycweek page.
//
// MODE (var):
//   "notify" (default) — no LLM, no commits. Fetches basic og metadata (no
//     blocking), gathers submitter IP / geo / device from Cloudflare, and
//     emails it all to SUBMIT_TO via Resend. This is the current live behavior.
//   "full" — the classify + auto-add pipeline (kept for later; see below).
//
// Secrets (wrangler secret put):
//   RESEND_API_KEY            (obaid.wtf sender — $RESEND_API_KEY_OBAID)
//   AWS_BEARER_TOKEN_BEDROCK  (full mode only)
//   GITHUB_TOKEN              (full mode only)
// Vars (wrangler.jsonc): MODE, SUBMIT_TO, SUBMIT_FROM, SUBMIT_ENDPOINT, GITHUB_REPO…

import { classifyUrl, WINDOW } from "../scripts/lib/classify.ts";
import { renderYcweek } from "../scripts/lib/render-ycweek.ts";
import { repoFromEnv, getJson, listDir, commitFiles } from "../scripts/lib/github-commit.ts";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (code: number, obj: any) =>
  new Response(JSON.stringify(obj), { status: code, headers: { ...CORS, "Content-Type": "application/json" } });

const esc = (s: any) =>
  String(s ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- best-effort og metadata (no LLM, no blocking, short timeout) ----------
async function ogMeta(url: string) {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(8000) });
    const h = await r.text();
    const m = (p: string) => {
      const x = h.match(new RegExp(`<meta[^>]+(?:property|name)=["']${p}["'][^>]+content=["']([^"']*)`, "i")) ||
                h.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${p}["']`, "i"));
      return x ? x[1].replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/").replace(/&quot;/g, '"') : null;
    };
    const dateField = (h.match(/"start_at":"([^"]+)"/) || h.match(/"startDate":"([^"]+)"/) || [])[1] || null;
    return {
      finalUrl: r.url, status: r.status,
      title: m("og:title") || m("twitter:title"),
      description: m("og:description") || m("twitter:description") || m("description"),
      image: m("og:image") || m("twitter:image"),
      siteName: m("og:site_name"),
      structuredDate: dateField,
    };
  } catch (e: any) {
    return { error: String(e?.message || e).slice(0, 120) };
  }
}

// ---------- approximate device from user-agent ----------
function parseUA(ua: string) {
  ua = ua || "";
  const os = /iphone|ipad|ipod/i.test(ua) ? "iOS" : /android/i.test(ua) ? "Android"
    : /mac os x|macintosh/i.test(ua) ? "macOS" : /windows nt/i.test(ua) ? "Windows"
    : /linux/i.test(ua) ? "Linux" : "unknown";
  const device = /ipad/i.test(ua) ? "iPad" : /iphone/i.test(ua) ? "iPhone"
    : /android/i.test(ua) && /mobile/i.test(ua) ? "Android phone" : /android/i.test(ua) ? "Android tablet"
    : /mobile/i.test(ua) ? "mobile"
    : os === "macOS" ? "Mac" : os === "Windows" ? "Windows PC" : os === "Linux" ? "Linux desktop" : "desktop";
  const browser = /edg\//i.test(ua) ? "Edge" : /opr\/|opera/i.test(ua) ? "Opera"
    : /chrome|crios/i.test(ua) ? "Chrome" : /firefox|fxios/i.test(ua) ? "Firefox"
    : /safari/i.test(ua) ? "Safari" : "unknown";
  return { os, device, browser };
}

async function sendEmail(env: any, subject: string, html: string, text: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.SUBMIT_FROM || "YC Week <ycweek@obaid.wtf>",
      to: [env.SUBMIT_TO || "me@obaid.wtf"],
      subject, html, text,
    }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

export default {
  async fetch(request: Request, env: Record<string, string>): Promise<Response> {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (request.method !== "POST") return json(405, { status: "error", reason: "POST only" });

    (globalThis as any).process = (globalThis as any).process || { env: {} };
    Object.assign(process.env, env);

    let url = "";
    try { url = (await request.json() as any).url?.trim() || ""; } catch { return json(400, { status: "error", reason: "bad body" }); }
    if (!/^https?:\/\/.{4,}/i.test(url) || url.length > 500) return json(400, { status: "error", reason: "invalid url" });

    // ============ NOTIFY MODE (default) — email obaid, do nothing else ============
    if ((env.MODE || "notify") !== "full") {
      const cf: any = (request as any).cf || {};
      const ua = request.headers.get("User-Agent") || "";
      const dev = parseUA(ua);
      const og = await ogMeta(url);
      const geoBits = [cf.city, cf.region, cf.country, cf.postalCode].filter(Boolean).join(", ") || "unknown";
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const when = new Date().toISOString();

      const rows: [string, any][] = [
        ["Submitted URL", `<a href="${esc(url)}">${esc(url)}</a>`],
        ["Resolves to", og.finalUrl && og.finalUrl !== url ? esc(og.finalUrl) : "—"],
        ["og:title", esc(og.title)],
        ["og:description", esc(og.description)],
        ["Poster", og.image
          ? `<img src="${esc(og.image)}" alt="poster" style="max-width:300px;max-height:240px;border-radius:6px;display:block;margin-bottom:4px"><a href="${esc(og.image)}" style="font-size:11px;color:#888">${esc(og.image)}</a>`
          : "—"],
        ["Structured date", esc(og.structuredDate)],
        ["Source", esc(og.siteName)],
        ["Fetch status", og.error ? `error: ${esc(og.error)}` : esc(og.status)],
        ["—", "—"],
        ["IP", esc(ip)],
        ["Approx location", esc(geoBits)],
        ["Coordinates", cf.latitude ? `${esc(cf.latitude)}, ${esc(cf.longitude)}` : "—"],
        ["Timezone", esc(cf.timezone)],
        ["ISP / ASN", esc([cf.asOrganization, cf.asn].filter(Boolean).join(" · "))],
        ["CF edge", esc(cf.colo)],
        ["Device", esc(`${dev.device} · ${dev.os} · ${dev.browser}`)],
        ["User-Agent", esc(ua)],
        ["Received", esc(when)],
      ];
      const html = `<h2>New event submission</h2><table cellpadding="6" style="border-collapse:collapse;font:14px system-ui">${
        rows.map(([k, v]) => k === "—"
          ? `<tr><td colspan="2" style="border-top:1px solid #ddd"></td></tr>`
          : `<tr><td style="color:#888;vertical-align:top;white-space:nowrap">${esc(k)}</td><td>${v}</td></tr>`).join("")
      }</table>`;
      const text = rows.filter(([k]) => k !== "—").map(([k, v]) => `${k}: ${String(v).replace(/<[^>]+>/g, "")}`).join("\n");

      try {
        await sendEmail(env, `YC Week submission: ${og.title || url}`, html, text);
        return json(200, { status: "received" });
      } catch (e: any) {
        return json(500, { status: "error", reason: "couldn't send", detail: String(e?.message || e).slice(0, 120) });
      }
    }

    // ============ FULL MODE — classify + auto-add (enable with MODE=full) ============
    const repo = repoFromEnv();
    if (!repo.token) return json(500, { status: "error", reason: "server not configured" });
    let cls, ex;
    try { const out = await classifyUrl(url); cls = out.classification; ex = out.extracted; }
    catch { return json(200, { status: "rejected", reason: "couldn't read that page" }); }
    if (!cls.is_event || !cls.event) return json(200, { status: "rejected", reason: cls.reason || "not an event" });
    if (!cls.in_window) return json(200, { status: "rejected", reason: `outside ${WINDOW.from}–${WINDOW.to} or not SF` });
    if (!cls.is_sus_related) return json(200, { status: "rejected", reason: "not a Startup School / founder / hacker event" });
    if (cls.confidence < 0.4) return json(200, { status: "rejected", reason: "couldn't confirm it's a Startup School event" });

    const DATA = "data/startup-school-2026-events.json", PAGE = "ycweek/index.html", PENDING = "data/pending-submissions.json";
    const normUrl = (u: string) => u.split("?")[0].replace(/\/$/, "").toLowerCase();
    const { json: data } = await getJson(repo, DATA);
    const target = normUrl(ex.finalUrl);
    if (data.events.some((e: any) => normUrl(e.url || "") === target || (e.links || []).some((l: any) => normUrl(l.url) === target)))
      return json(200, { status: "duplicate" });

    const ev = cls.event;
    const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "event";
    const WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let id = slug(ev.title);
    if (new Set(data.events.map((e: any) => e.id)).has(id)) id += "-" + Math.random().toString(36).slice(2, 6);
    const plat = /partiful/.test(target) ? "partiful" : /luma/.test(target) ? "luma"
      : /linkedin/.test(target) ? "linkedin" : /instagram/.test(target) ? "instagram" : "website";
    const record: any = {
      id, title: ev.title, host: ev.host, official: false,
      day: ev.date ? WD[new Date(ev.date + "T12:00:00-07:00").getUTCDay()] : "TBA",
      date: ev.date, start: ev.start, end: ev.end, venue: ev.venue,
      vibe: (ev.vibe || []).filter((v: string) => ["networking", "tech", "chill", "party"].includes(v)),
      access: ["open", "waitlist", "sold-out", "tba"].includes(ev.access) ? ev.access : "open",
      description: ev.description, tagline: ev.tagline, url: ex.finalUrl, image: ex.ogImage || null,
      links: [{ url: ex.finalUrl, type: plat, foundOn: ["submission"] }], foundOn: ["submission"],
      submittedAt: new Date().toISOString(), confidence: cls.confidence,
    };
    if (ev.audience) record.audience = ev.audience;
    if (ev.note) record.note = ev.note;

    if (cls.confidence >= 0.75) {
      data.events.push(record);
      data.meta.lastUpdated = new Date().toISOString().slice(0, 10);
      data.meta.sourceKeys = { ...(data.meta.sourceKeys || {}), submission: "Submitted via the site and auto-verified" };
      const html = renderYcweek({ data, assetFiles: await listDir(repo, "assets/startup-school-2026"), submitEndpoint: env.SUBMIT_ENDPOINT || "" });
      await commitFiles(repo, [
        { path: DATA, content: JSON.stringify(data, null, 2) + "\n" },
        { path: PAGE, content: html },
      ], `Add submitted event: ${ev.title} (auto, conf ${cls.confidence})`);
      return json(200, { status: "added", id, title: ev.title });
    }
    let pending: any = { items: [] };
    try { pending = (await getJson(repo, PENDING)).json; } catch {}
    pending.items = pending.items || [];
    pending.items.push({ ...record, reason: cls.reason });
    await commitFiles(repo, [{ path: PENDING, content: JSON.stringify(pending, null, 2) + "\n" }], `Queue for review: ${ev.title} (conf ${cls.confidence})`);
    return json(200, { status: "pending", title: ev.title });
  },
};
