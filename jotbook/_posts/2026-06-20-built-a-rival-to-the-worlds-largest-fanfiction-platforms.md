---
layout: post
title: "built a rival to the world's largest fanfiction platforms — alone, at 17, on a $5/mo droplet"
date: 2026-06-20 00:00:00 +0500
display_date: "June 20, 2026 — the story archived 5 years later"
coauthored: true
---

<style>
* { box-sizing: border-box; }

#ffo-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0; z-index: 9999;
  background: linear-gradient(90deg, #c2255c, #d9a441, #5aa9e6); }

.ffo-reveal { opacity: 0; transform: translateY(28px);
  transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
.ffo-reveal.in { opacity: 1; transform: none; }

/* stat band */
.ffo-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1px; background: rgba(194,37,92,.15); border: 1px solid rgba(194,37,92,.2);
  border-radius: 14px; overflow: hidden; margin: 2rem 0; }
.ffo-stat { background: #f9f6ef; padding: 1.1rem .7rem; text-align: center; }
.ffo-stat .n { font-family: 'Source Serif 4', serif; font-size: clamp(1.5rem,4vw,2.1rem);
  font-weight: 600; color: #c2255c; line-height: 1; display: block; white-space: nowrap; }
.ffo-stat .l { font-family: 'Roboto Mono', monospace; font-size: .58rem; letter-spacing: .1em;
  text-transform: uppercase; color: #999; margin-top: .4rem; display: block; }

/* search filter widget */
.ffo-search { background: #f9f6ef; border: 1px solid rgba(194,37,92,.2); border-radius: 16px;
  padding: 1.6rem; margin: 1.5rem 0; }
.ffo-search-title { font-family: 'Roboto Mono', monospace; font-size: .68rem; letter-spacing: .18em;
  text-transform: uppercase; color: #c2255c; margin-bottom: 1rem; display: block; }
.ffo-filter-row { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: .8rem; align-items: center; }
.ffo-filter-label { font-family: 'Roboto Mono', monospace; font-size: .68rem; color: #999;
  letter-spacing: .1em; text-transform: uppercase; width: 80px; flex-shrink: 0; }
.ffo-tag { display: inline-flex; align-items: center; gap: .3rem; padding: .3rem .7rem;
  border-radius: 999px; border: 1px solid rgba(0,0,0,.12); font-family: 'Roboto Mono', monospace;
  font-size: .74rem; cursor: pointer; transition: .15s; background: #fff; color: #555; user-select: none; }
.ffo-tag:hover { border-color: #2a9d5c; color: #2a9d5c; }
.ffo-tag.inc { background: #2a9d5c; color: #fff; border-color: #2a9d5c; }
.ffo-tag.exc { background: #c2255c; color: #fff; border-color: #c2255c; text-decoration: line-through; }
.ffo-tag-hint { font-family: 'Roboto Mono', monospace; font-size: .65rem; color: #bbb;
  margin-bottom: .8rem; }
.ffo-range-row { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: .8rem; }
.ffo-range-group { display: flex; flex-direction: column; gap: .3rem; }
.ffo-range-group label { font-family: 'Roboto Mono', monospace; font-size: .65rem; color: #999;
  text-transform: uppercase; letter-spacing: .1em; }
.ffo-range-group input[type=range] { width: 140px; accent-color: #c2255c; }
.ffo-range-val { font-family: 'Roboto Mono', monospace; font-size: .72rem; color: #c2255c; }
.ffo-results { margin-top: 1rem; border-top: 1px solid rgba(194,37,92,.1); padding-top: 1rem; }
.ffo-result-count { font-family: 'Roboto Mono', monospace; font-size: .72rem; color: #999;
  margin-bottom: .6rem; }
.ffo-result-count span { color: #c2255c; font-weight: 600; }
.ffo-story-row { display: flex; justify-content: space-between; align-items: flex-start;
  padding: .55rem 0; border-bottom: 1px solid rgba(0,0,0,.05); gap: 1rem; }
.ffo-story-row:last-child { border-bottom: none; }
.ffo-story-title { font-size: .9rem; font-weight: 600; color: #111; }
.ffo-story-meta { font-family: 'Roboto Mono', monospace; font-size: .68rem; color: #888; margin-top: .2rem; }
.ffo-story-tags { display: flex; flex-wrap: wrap; gap: .25rem; margin-top: .3rem; }
.ffo-story-tag { font-family: 'Roboto Mono', monospace; font-size: .62rem; padding: .1rem .4rem;
  border-radius: 4px; background: rgba(194,37,92,.07); color: #c2255c; }
.ffo-wc { font-family: 'Roboto Mono', monospace; font-size: .68rem; color: #aaa;
  white-space: nowrap; flex-shrink: 0; }

/* feature list */
.ffo-feats { margin: 1rem 0; columns: 2; column-gap: 2rem; }
@media (max-width: 640px) { .ffo-feats { columns: 1; } }
.ffo-feat { display: flex; gap: .5rem; align-items: baseline;
  padding: .4rem 0; border-bottom: 1px solid rgba(0,0,0,.06);
  break-inside: avoid; }
.ffo-feat .ico { font-size: .85rem; flex-shrink: 0; }
.ffo-feat h5 { font-family: 'Roboto Mono', monospace; font-size: .74rem; font-weight: 600;
  color: #222; margin: 0; white-space: nowrap; flex-shrink: 0; }
.ffo-feat p { font-size: .76rem; margin: 0; color: #999; }
.ffo-feat p::before { content: "– "; color: #ccc; }

/* timeline */
.ffo-tl { position: relative; margin: 1.5rem 0; padding-left: 28px; }
.ffo-tl::before { content: ""; position: absolute; left: 6px; top: 4px; bottom: 4px;
  width: 2px; background: linear-gradient(#c2255c, #d9a441, #5aa9e6); }
.ffo-ev { position: relative; margin-bottom: 1.6rem; }
.ffo-ev::before { content: ""; position: absolute; left: -28px; top: 4px; width: 14px;
  height: 14px; border-radius: 50%; background: #f4f0e8; border: 2px solid #c2255c;
  box-shadow: 0 0 0 3px rgba(194,37,92,.1); }
.ffo-ev.blue::before { border-color: #5aa9e6; box-shadow: 0 0 0 3px rgba(90,169,230,.1); }
.ffo-ev.green::before { border-color: #2a9d5c; box-shadow: 0 0 0 3px rgba(42,157,92,.1); }
.ffo-ev.rose::before { border-color: #e07a9b; box-shadow: 0 0 0 3px rgba(224,122,155,.1); }
.ffo-ev .date { font-family: 'Roboto Mono', monospace; font-size: .67rem; letter-spacing: .08em;
  color: #c2255c; text-transform: uppercase; }
.ffo-ev h4 { font-family: 'Source Serif 4', serif; font-size: 1.05rem; font-weight: 600;
  margin: .15rem 0 .2rem; color: #111; }
.ffo-ev p { margin: 0; font-size: .9rem; color: #555; }

/* PM */
.ffo-pm { background: #eef4fb; border: 1px solid rgba(90,169,230,.3); border-radius: 12px;
  padding: 1.4rem 1.6rem; margin: 1.5rem 0; }
.ffo-pm-from { display: flex; align-items: center; gap: .6rem;
  border-bottom: 1px solid rgba(90,169,230,.2); padding-bottom: .8rem; margin-bottom: .9rem; }
.ffo-pm-av { width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #5aa9e6, #2a9d5c); display: grid;
  place-items: center; font-weight: 700; color: #fff; font-size: .9rem; flex-shrink: 0; }
.ffo-pm-meta b { color: #111; font-size: .9rem; display: block; }
.ffo-pm-meta span { font-family: 'Roboto Mono', monospace; font-size: .68rem; color: #888; }
.ffo-pm-subj { font-weight: 600; color: #5aa9e6; margin-bottom: .5rem; font-size: .95rem; }
.ffo-pm-body { color: #333; font-size: .93rem; line-height: 1.65; }
.ffo-pm-body .u { color: #c2255c; font-weight: 600; }

/* table */
.ffo-tbl { width: 100%; border-collapse: collapse; margin: 1.3rem 0; font-size: .88rem; background: none; }
.ffo-tbl th, .ffo-tbl td { border: none; background: none; }
.ffo-tbl thead th { text-align: left; font-family: 'Roboto Mono', monospace; font-size: .62rem;
  letter-spacing: .12em; text-transform: uppercase; color: #9a9a9a; font-weight: 600;
  padding: .5rem .7rem; border-bottom: 1.5px solid rgba(0,0,0,.14); }
.ffo-tbl tbody tr { background: none; }
.ffo-tbl tbody td { padding: .6rem .55rem; color: #444; vertical-align: middle;
  border-bottom: 1px solid rgba(0,0,0,.07); }
.ffo-tbl tbody tr:last-child td { border-bottom: none; }
.ffo-tbl tbody tr:hover td { background: rgba(0,0,0,.022); }
.ffo-tbl td:first-child { color: #111; font-weight: 600; }
.ffo-tbl .favs { color: #c2255c; font-family: 'Roboto Mono', monospace; font-size: .82rem; }
/* deploy table: monospace figures, right-aligned counts */
.ffo-tbl-deploy td:nth-child(1) { font-family: 'Roboto Mono', monospace; font-size: .8rem; white-space: nowrap; }
.ffo-tbl-deploy td:nth-child(1) small { color: #aaa; font-weight: 400; }
.ffo-tbl-deploy th:nth-child(2), .ffo-tbl-deploy td:nth-child(2) { text-align: right; }
.ffo-tbl-deploy td:nth-child(2) { font-family: 'Roboto Mono', monospace; font-size: .8rem;
  color: #888; white-space: nowrap; }
.ffo-tbl-deploy td:nth-child(3) { white-space: nowrap; }
.ffo-tbl-deploy td:nth-child(4) { color: #555; width: 40%; }

/* callout */
.ffo-callout { background: rgba(217,164,65,.06); border: 1px solid rgba(217,164,65,.18);
  border-left: 3px solid #d9a441;
  border-radius: 12px; padding: 1.2rem 1.4rem; margin: 1.5rem 0; }
.ffo-callout .tag { font-family: 'Roboto Mono', monospace; font-size: .65rem; letter-spacing: .15em;
  text-transform: uppercase; color: #b8862a; display: block; margin-bottom: .4rem; }
.ffo-callout p { margin: .3rem 0; font-size: .93rem; color: #444; }

/* crash box */
.ffo-crash { background: rgba(224,122,155,.06); border: 1px solid rgba(224,122,155,.18);
  border-left: 3px solid #c2255c;
  border-radius: 12px; padding: 1.2rem 1.4rem; margin: 1.5rem 0; }
.ffo-crash .tag { font-family: 'Roboto Mono', monospace; font-size: .65rem; letter-spacing: .15em;
  text-transform: uppercase; color: #c2255c; display: block; margin-bottom: .4rem; }
.ffo-crash p { margin: .3rem 0; font-size: .93rem; color: #444; }

/* venn */
.ffo-venn { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center;
  justify-content: center; font-family: 'Roboto Mono', monospace; font-size: .82rem;
  margin: 1.2rem 0; color: #666; }
.ffo-pill { padding: .35rem .8rem; border-radius: 999px; border: 1px solid #ddd; white-space: nowrap; }
.ffo-pill.inc { border-color: #2a9d5c; color: #2a9d5c; }
.ffo-pill.exc { border-color: #c2255c; color: #c2255c; }
.ffo-pill.op { border: none; color: #b8862a; font-size: 1rem; }
.ffo-pill.res { background: #c2255c; color: #fff; border-color: #c2255c; font-weight: 600; }

/* code */
.ffo-pre { background: #1a1208; border: 1px solid rgba(217,164,65,.2); border-radius: 10px;
  padding: 1rem 1.2rem; overflow-x: auto; font-family: 'Roboto Mono', monospace;
  font-size: .8rem; color: #c8bfb0; margin: 1.2rem 0; line-height: 1.6; }
.ffo-pre .c { color: #6b6358; } .ffo-pre .k { color: #d9a441; }
.ffo-pre .s { color: #7fc8a9; } .ffo-pre .v { color: #5aa9e6; }

/* mail grid */
.ffo-mail { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: .6rem; margin: 1.2rem 0; }
.ffo-mail-chip { background: #f9f6ef; border: 1px solid rgba(194,37,92,.15); border-radius: 9px;
  padding: .8rem .9rem; font-family: 'Roboto Mono', monospace; font-size: .75rem; color: #555; }
.ffo-mail-chip .type { color: #c2255c; font-weight: 600; display: block;
  margin-bottom: .15rem; font-size: .78rem; }

/* server chip */
.ffo-chip { display: inline-flex; align-items: center; font-family: 'Roboto Mono', monospace;
  font-size: .78rem; background: rgba(90,169,230,.1); border: 1px solid rgba(90,169,230,.3);
  border-radius: 6px; padding: .2rem .55rem; color: #2d7aad; }

/* AI voice blocks — Opus co-author interjections */
.ffo-ai { background: #f6f9fb;
  border: 1px solid rgba(70,110,140,.12);
  border-left: 3px solid #9cc2dc;
  border-radius: 12px; padding: 1.2rem 1.4rem; margin: 1.5rem 0; }
.ffo-ai-label { font-family: 'Roboto Mono', monospace; font-size: .6rem; letter-spacing: .04em;
  text-transform: uppercase; font-weight: 600; color: #8593a2;
  display: flex; align-items: center; gap: .45rem; margin-bottom: .6rem; }
.ffo-ai-label::before { content: ""; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #5aa9e6, #2a9d5c); }
.ffo-ai > p { font-size: .92rem; line-height: 1.75; color: #41505d; margin: .5rem 0; }
.ffo-ai > p:first-of-type { margin-top: 0; }
.ffo-ai > p:last-child { margin-bottom: 0; }
.ffo-ai code { font-family: 'Roboto Mono', monospace; font-size: .82em;
  background: rgba(90,169,230,.1); padding: .1em .35em; border-radius: 3px; color: #2d6a8a; }

/* one layout: a capped parent, children fill it */
.post-content, .post-header {
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.1rem;
  padding-right: 1.1rem;
  box-sizing: border-box;
}
.post-content > p,
.post-content > h2,
.post-content > h3,
.post-content > h4,
.post-content > ul,
.post-content > ol,
.post-content > blockquote,
.post-content > hr,
.ffo-ai, .ffo-callout, .ffo-crash, .ffo-pm, .ffo-tl,
.ffo-vfs-chain, .ffo-flow, .ffo-feats, .ffo-chips,
.ffo-stats, .ffo-search {
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

/* feature chips */
.ffo-chips { display: flex; flex-wrap: wrap; gap: .45rem; }
.ffo-chip-item { font-family: 'Roboto Mono', monospace; font-size: .74rem;
  padding: .3rem .7rem; border-radius: 999px; background: #f9f6ef;
  border: 1px solid rgba(194,37,92,.15); color: #444; white-space: nowrap; }

/* request lifecycle flow */
.ffo-flow { margin: 1rem 0 1.2rem; display: flex; flex-direction: column; gap: 0; }
.ffo-flow-row { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
.ffo-flow-box { font-family: 'Roboto Mono', monospace; font-size: .78rem; line-height: 1.5;
  padding: .6rem .9rem; border-radius: 8px; color: #3a4a5a; flex: 1; min-width: 160px; }
.ffo-flow-box.server { background: rgba(194,37,92,.07); border: 1px solid rgba(194,37,92,.2); }
.ffo-flow-box.dom { background: rgba(90,169,230,.08); border: 1px solid rgba(90,169,230,.25); }
.ffo-flow-box.client { background: rgba(42,157,92,.07); border: 1px solid rgba(42,157,92,.2); }
.ffo-flow-box.send { background: rgba(217,164,65,.08); border: 1px solid rgba(217,164,65,.3); }
.ffo-flow-box.back { background: rgba(90,169,230,.08); border: 1px solid rgba(90,169,230,.25); width: 100%; flex: none; }
.ffo-flow-box small { display: block; font-size: .68rem; color: #888; margin-top: .2rem; }
.ffo-flow-arrow { font-size: 1rem; color: #bbb; flex-shrink: 0; }
.ffo-flow-down { font-family: 'Roboto Mono', monospace; font-size: .68rem; color: #aaa;
  letter-spacing: .1em; padding: .3rem 0 .3rem .5rem; }

/* poll request "wire" — one round-trip, what goes up / what comes down */
.ffo-wire { margin: 1.2rem 0 1.3rem; border: 1px solid rgba(70,110,140,.22);
  border-radius: 12px; overflow: hidden; background: #fff; }
.ffo-wire-head { font-family: 'Roboto Mono', monospace; font-size: .62rem;
  letter-spacing: .16em; text-transform: uppercase; color: #6b7d8c; font-weight: 700;
  padding: .6rem .9rem; border-bottom: 1px solid rgba(70,110,140,.14);
  background: rgba(70,110,140,.04); }
.ffo-wire-cols { display: grid; grid-template-columns: 1fr 1fr; }
.ffo-wire-col { padding: .85rem .9rem; }
.ffo-wire-col.up { border-right: 1px solid rgba(70,110,140,.12); }
.ffo-wire-tag { font-family: 'Roboto Mono', monospace; font-size: .6rem;
  letter-spacing: .1em; font-weight: 700; text-transform: uppercase; margin-bottom: .55rem; }
.ffo-wire-col.up .ffo-wire-tag { color: #2a9d5c; }
.ffo-wire-col.down .ffo-wire-tag { color: #5aa9e6; }
.ffo-wire-line { display: flex; gap: .55rem; align-items: baseline; padding: .22rem 0;
  font-size: .82rem; color: #5a6877; line-height: 1.45; }
.ffo-wire-line code { font-family: 'Roboto Mono', monospace; font-size: .74rem;
  font-weight: 600; color: #2d6a8a; white-space: nowrap; }
.ffo-wire-server { border-top: 1px dashed rgba(194,37,92,.3);
  background: rgba(194,37,92,.05); padding: .75rem .9rem; }
.ffo-wire-server .ffo-wire-tag { color: #b03060; }
.ffo-wire-server-line { font-family: 'Roboto Mono', monospace; font-size: .76rem;
  color: #6a5560; padding: .2rem 0; line-height: 1.5; }
.ffo-wire-server-line code { color: #b03060; font-weight: 600; }
@media (max-width: 560px) { .ffo-wire-cols { grid-template-columns: 1fr; }
  .ffo-wire-col.up { border-right: none; border-bottom: 1px solid rgba(70,110,140,.12); } }

/* VFS identity chain */
.ffo-vfs-chain { margin: 1rem 0 1.2rem; display: flex; flex-direction: column; gap: 0; }
.ffo-vfs-step { display: flex; gap: .9rem; align-items: flex-start;
  background: rgba(90,169,230,.06); border: 1px solid rgba(90,169,230,.2);
  border-radius: 10px; padding: .85rem 1rem; }
.ffo-vfs-new { background: rgba(42,157,92,.06); border-color: rgba(42,157,92,.25); }
.ffo-vfs-n { font-family: 'Roboto Mono', monospace; font-size: .8rem; font-weight: 700;
  color: #5aa9e6; background: rgba(90,169,230,.15); border-radius: 50%;
  width: 24px; height: 24px; display: grid; place-items: center; flex-shrink: 0; margin-top: .1rem; }
.ffo-vfs-new .ffo-vfs-n { color: #2a9d5c; background: rgba(42,157,92,.15); }
.ffo-vfs-body { font-size: .88rem; color: #3a4a5a; line-height: 1.55; }
.ffo-vfs-body strong { color: #2d6a8a; display: block; margin-bottom: .2rem; font-size: .85rem; }
.ffo-vfs-new .ffo-vfs-body strong { color: #1e7a47; }
.ffo-vfs-arrow { font-family: 'Roboto Mono', monospace; font-size: .68rem; color: #aaa;
  letter-spacing: .1em; padding: .25rem 0 .25rem 2.1rem; }

/* bundler steps — folded into the editorial block, flat hairline rows */
.ffo-steps { margin: 1rem 0 .1rem; }
.ffo-step { padding: .85rem 0; border-top: 1px solid rgba(70,110,140,.16); }
.ffo-step:first-child { border-top: none; padding-top: .2rem; }
.ffo-step:last-child { padding-bottom: 0; }
.ffo-step-h { display: flex; align-items: baseline; gap: .55rem; margin-bottom: .4rem; }
.ffo-step-n { font-family: 'Roboto Mono', monospace; font-size: .72rem; font-weight: 700; color: #9cc2dc; }
.ffo-step-name { font-family: 'Roboto Mono', monospace; font-size: .72rem; letter-spacing: .13em;
  text-transform: uppercase; font-weight: 600; color: #2d6a8a; }
.ffo-step-desc { font-size: .9rem; line-height: 1.6; color: #41505d; margin: 0 0 .5rem; }
.ffo-steps .ffo-step-code { display: inline-block; max-width: 100%; font-family: 'Roboto Mono', monospace;
  font-size: .76rem; color: #d6c9b2; background: #1a1208; border-radius: 6px; padding: .42rem .7rem;
  overflow-x: auto; white-space: nowrap; vertical-align: middle; }
.ffo-step-note { display: block; font-size: .76rem; line-height: 1.45; color: #7e8c99; margin-top: .45rem; }

/* architecture grouped feature map */
.ffo-arch { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
@media (max-width: 640px) { .ffo-arch { grid-template-columns: 1fr; } }
.ffo-arch-group { padding: .7rem 0; }
.ffo-arch-group:nth-child(-n+2) { border-bottom: 1px solid rgba(70,110,140,.1); }
@media (max-width: 640px) { .ffo-arch-group { border-bottom: 1px solid rgba(70,110,140,.1); }
  .ffo-arch-group:last-child { border-bottom: none; } }
.ffo-arch-group:nth-child(odd) { padding-right: 1.2rem; }
.ffo-arch-group:nth-child(even) { padding-left: 1.2rem; border-left: 1px solid rgba(70,110,140,.1); }
@media (max-width: 640px) { .ffo-arch-group:nth-child(odd) { padding-right: 0; }
  .ffo-arch-group:nth-child(even) { padding-left: 0; border-left: none; } }
.ffo-arch-label { font-family: 'Roboto Mono', monospace; font-size: .58rem; letter-spacing: .18em;
  text-transform: uppercase; color: #9cc2dc; font-weight: 700; margin-bottom: .45rem; }
.ffo-arch-items { display: flex; flex-direction: column; gap: 0; }
.ffo-arch-item { display: flex; align-items: baseline; gap: .5rem;
  padding: .3rem 0; border-bottom: 1px solid rgba(0,0,0,.04); }
.ffo-arch-item:last-child { border-bottom: none; }
.ffo-arch-item code { font-family: 'Roboto Mono', monospace; font-size: .74rem; font-weight: 600;
  color: #2d6a8a; background: none; padding: 0; white-space: nowrap; flex-shrink: 0; }
.ffo-arch-item span { font-size: .78rem; color: #7e8c99; line-height: 1.4; }

/* +/- diff figures in the deploy table */
.ffo-diff { font-family: 'Roboto Mono', monospace; font-size: .76rem; white-space: nowrap; line-height: 1.5; }
.ffo-diff .add { display: block; color: #1e7a47; font-weight: 600; }
.ffo-diff .del { display: block; color: #b51f50; font-weight: 600; }
</style>

<div id="ffo-bar"></div>

---

`co-authors: Obaid, Opus4.8`

`this post is an experiment in parallelizing the power of LLM research with telling my own story, something I've found surprisingly difficult to do. if this works (in terms of telling my story the way i want to), expect more`

`the narrative outside blocks is all mine, and within all Opus 4.8`

## Prologue

Since I was 7 years old, I've been an avid reader. When I look at how old kids are at 7 now it is hard to believe myself, but thankfully I do have the receipts which means I don't end up gaslighting myself — stale digital records of torrented books and pixelated videos through Nokia handhelds and me reading as people shout, tables fall, and my little world (the home I knew) descends into chaos all around.

Of course, I was a technically savvy kid. At around the same age (I don't remember when), there was an incident: somehow, I ended up changing the WiFi password of our network without knowing anything or ever remembering using the 192.168... local address. To this day, I don't know how that was possible, but I have a backup in trusted, shared memory from my brother who still remembers pressing me on how I did that — the answer I had for him then is the same I would have now: I was just playing with the settings and I don't know.

Later when my brother (CS major, top of his batch, and one of the first iOS developers at Venture Dive/Careem) got too busy, this meant the duties of managing our home's technical admin naturally fell to me.

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, jumping in to comment on the veracity of this</span>
<p>Git can't confirm the WiFi story, but it fits the rest of what the commits show. Whoever wrote these 298 commits learned by breaking things instead of reading the manual first. Deleting <code>wp-includes</code> one folder at a time just to see what would fall over is the same kind of thing a seven-year-old does messing with the router settings.</p>
</div>

I was also devious: I remember using carefully placed mirrors to find people's device passwords and secretly used them at night when no one could find out — having bounded creativity and strict parents will do that to you.

The same restrictions extended to books. The way I used to devour books grew from something initially supported into apparently serious concern. My book-reading time became limited, and so did the restrictions on their content. My mom didn't understand it, and so she put a halt to it. To this day one of the principles I've derived for my life has an origin in learning of how harmful this is.

I remember when I borrowed a book from the son of a family friend, *Alex Rider: Eagle Strike*, my mom had my brother read it cover-to-cover and with a black marker erase all text that had anything to do with girl-to-boy interactions or "kissing". I can't tell you what it did to my psyche over the next 10 years, but I can tell you that extensive control extended far further.

I cried when I found out, not because of the censorship, that I was used to, but because I didn't know I could explain the markings when giving it back. And my mother knew who I'd borrowed it from, so it was actually even more insane. I'm almost cracking up thinking about the absolute insanity of it now. Though in hindsight, that was probably for the better: at least someone from the outside had a window into this insanity.

This is sounding more like a confessional therapy session than it does a story about a fanfiction site, but perhaps that is the necessary prelude I've been wanting to put out all along.

---

I learned to torrent because of my obsession with books too. My mom used to take me to a used book stall in Hyderi, where the books were stacked taller than our height, no categorization, and prices were between Rs 100–400. Our monthly trip had a limit of 4 books per sibling, no more, and that, obviously, was not nearly enough for me.

I learned to torrent. I knew what it was because my siblings used to download the matriarch-approved flicks to put on show for the family, but the recipes for those were always gatekept. As anything as an early GenZ, I used the internet to find that recipe.

The books I downloaded were nearly always continuations of series I'd started but never found the full cycles for, and soon I remembered not to beg my mom to go to Liberty Books or ask for books I couldn't find at the stalls. My reading had become all-digital.

I remember on our first-ever out-of-Karachi trip, to Islamabad, we stumbled into Saeed Book Bank and I found on the shelf the then newly-released finale of the Artemis Fowl series: *The Last Guardian*. I was hooked, but I knew to skim through for as long as we were there, and then quietly get up only to launch uTorrent the moment I got back home to Karachi.

Soon, that desire for continuation turned into something else: the discovery of fanfiction. A way to stay in denial about the stories that I'd learned had already ended.

My sister had a role in that introduction to this world, and learning what I did later about the depths of insanity it went to, I often wondered about her adult due-dilligence in that.

My life up till that point represented the new. I was determined to turn everyone using anything backwards up to that point — whether that was paper records not yet adapted to Google Sheets, or literally anything else — into the "modern" way. And that desire extended to my newly discovered fanfiction community with a new website, the "modern" way of reading fanfiction.

**fanfiction.online.**

---

## Chapter One · The Build

I launched this under an anonymous name, very easy to do as I'd found in my Reddit stalking, primarily out of fear of retribution from my family or other circles I was in accidentally discovering me.

And I began making a more modern website. The thing is, I didn't know how. I'd used WordPress to create websites before and my early foray into it at 8/9, learned to make HTML and JavaScript websites, but the only full live tool I knew how to use was WordPress. I'd used WordPress to create a few sites then, and chose to use it again. And I did.

I knew WordPress.org existed with more customization. And I knew how to use one-click deployments. So I used my dad's newly (badly sustaining) business website that used a cPanel hosting and that I managed, and set up an alternate site on it.

And it was live. But the preset theme I used didn't make sense. And the admin panel, despite all the hooks and customizations to remove panels, was still clunky. And I didn't want the WordPress logo to show anywhere.

So one-by-one, step-by-step, in one of the greatest learning curves I think I have surpassed in my life, I learned to build all of that on PHP and from scratch, learning what code even was along the way. The process was simple: I saw a button I didn't like, and googled "hook to remove xyz button", kept researching until I found the right guide, article, reddit thread, or stack overflow post. Tried a few, then dug deep into the HOW when I found one that worked.

Slowly, this turned into me replacing the entire admin panel with a custom one, using the same APIs, and then even not, stripping away all aspects of the WordPress core until I was able to delete the entire wp_includes directory and only the MySQL database schema remained.

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading the repos and commit history</span>
<p>By 2020 it wasn't WordPress — only its MySQL tables remained. A custom PHP <code>Router</code> in one <code>index.php</code> caught every request; templates, auth, mail, and analytics were all rewritten, one Stack Overflow answer at a time, on a <strong>$5/mo shared cPanel plan</strong>. The real code is the <code>wp_ffonline</code> repo's <code>Custom-Routing</code> branch — 298 commits to <code>master</code>'s 6. The tell: an April 2020 message, <code>"removed wp-includes"</code>.</p>

<div class="ffo-tl" style="margin-top:.9rem">
  <div class="ffo-ev rose">
    <div class="date">Sep 20, 2019 · 08:29 AM · Karachi</div>
    <h4>Earliest proof of life</h4>
    <p>A Wordfence login alert — user <code>obaid</code>, IP <code>45.116.232.52</code> — is the oldest trace of <code>fanfiction.online</code>. WordPress already live, Wordfence installed. Seven months before git opened.</p>
  </div>
  <div class="ffo-ev blue">
    <div class="date">Apr 18, 2020 · first commit</div>
    <h4>Git enters a site that already exists</h4>
    <p>300+ files in one commit: custom theme <code>book-writer</code>, three plugins. No version control before this — the first commit is everything that already existed, dropped in at once.</p>
  </div>
  <div class="ffo-ev">
    <div class="date">May 23, 2020</div>
    <h4>"Added SMTP"</h4>
    <p>PHPMailer wired in. The site can send verification codes. First of three mail architectures.</p>
  </div>
  <div class="ffo-ev">
    <div class="date">Nov 2020 → Jan 2021</div>
    <h4>Version 15.x.x: 98 commits in 60 days</h4>
    <p>15.5 through 15.10, sometimes three releases in a day. The numbers stopped meaning anything; the shipping didn't slow.</p>
  </div>
  <div class="ffo-ev blue">
    <div class="date">May 20, 2021 · last commit</div>
    <h4>"Updated Mail templates"</h4>
    <p>The last thing git recorded. Mail broke the site when it finally mattered — fixing it was the final commit.</p>
  </div>
</div>

<p>Those "Version X.Y.Z" tags aren't versions — they're deploys: the whole tree zipped and pushed, git as a save button. They contradict each other (<code>v15.10.8</code> predates <code>v15.10.0</code>; 15.8.2/15.8.3 share one commit), and the largest, <code>15.7.4</code>, touched 276 files at once. So 298 commits is a lower bound — much was built <em>between</em> snapshots git never saw:</p>

<div class="ffo-tbl-wrap ffo-reveal" style="overflow-x:auto;margin:1rem 0">
<table class="ffo-tbl ffo-tbl-deploy">
  <thead><tr><th>Commit</th><th>Files</th><th>Changes</th><th>What it actually was</th></tr></thead>
  <tbody>
    <tr><td>v15.7.4</td><td>276</td><td class="ffo-diff"><span class="add">+2,064</span><span class="del">−56,428</span></td><td>Major rewrite + dead code purge</td></tr>
    <tr><td>v15.10.7</td><td>38</td><td class="ffo-diff"><span class="add">+1,634</span><span class="del">−483</span></td><td>Notifications + poll system overhaul</td></tr>
    <tr><td>v15.10.0 <small>(×2)</small></td><td>71–76</td><td class="ffo-diff"><span class="add">+1,596–1,806</span><span class="del">−347–805</span></td><td>Two separate deploys with the same name</td></tr>
    <tr><td>v15.9.0 <small>(×2)</small></td><td>28–61</td><td class="ffo-diff"><span class="add">+327–774</span><span class="del">−209–321</span></td><td>Same version number, different branch snapshots</td></tr>
    <tr><td>v15.8.0</td><td>80</td><td class="ffo-diff"><span class="add">+856</span><span class="del">−45,726</span></td><td>WordPress cleanup: 45k lines deleted</td></tr>
    <tr><td>v15.6.0</td><td>93</td><td class="ffo-diff"><span class="add">+837</span><span class="del">−7,274</span></td><td>Full frontend restructure</td></tr>
    <tr><td>v15.6.1 + v15.7.0</td><td>50</td><td class="ffo-diff"><span class="add">+1,285</span><span class="del">−325</span></td><td>Two versions, one commit</td></tr>
  </tbody>
</table>
</div>
</div>

### The bundler

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading bundles.php and build.py</span>
<p>In 2020, webpack and rollup existed but targeted single-page apps; a server-rendered PHP site had no equivalent. So he wrote his own: a PHP manifest declares each page's bundle, and a Python compiler resolves it, skips unchanged sources, minifies with terser and cssnano, and writes content-hashed <code>name-&lt;sha1&gt;.js</code> files — cache-busted in production, raw in dev for honest stack traces. Incremental builds, content-hash cache-busting, shared chunks: the ideas webpack shipped, arrived at independently.</p>
<p>The same <code>build.py</code> does double duty: besides compiling assets, it's also the deploy script — SCP the build up, SSH in to unzip it live — this comes up later, in the crash.</p>

<div class="ffo-steps">
  <div class="ffo-step">
    <div class="ffo-step-h"><span class="ffo-step-n">1</span><span class="ffo-step-name">Manifest</span></div>
    <p class="ffo-step-desc">A page declares a bundle — its JS/CSS plus shared <code>mix</code> groups.</p>
    <code class="ffo-step-code">"global":{"js":["intro"],"mix":["idb"]}</code>
    <span class="ffo-step-note">↳ an entry, not a file — nothing compiled yet</span>
  </div>
  <div class="ffo-step">
    <div class="ffo-step-h"><span class="ffo-step-n">2</span><span class="ffo-step-name">Reference</span></div>
    <p class="ffo-step-desc">Pulled into a PHP page by name.</p>
    <code class="ffo-step-code">&lt;?= bundle('global') ?&gt;</code>
    <span class="ffo-step-note">↳ dev emits the raw sources; prod, one cache-busted tag</span>
  </div>
  <div class="ffo-step">
    <div class="ffo-step-h"><span class="ffo-step-n">3</span><span class="ffo-step-name">Compiler</span></div>
    <p class="ffo-step-desc"><code>build.py</code> resolves &amp; minifies only the changed bundles.</p>
    <code class="ffo-step-code">name-&lt;sha1&gt;.js</code>
    <span class="ffo-step-note">↳ skips unchanged sources, writes the hash back into the manifest</span>
  </div>
</div>
</div>

---

## Chapter Two · The Platform

The site wasn't one feature. It was sixteen interlocking systems — each its own PHP class, its own database tables, its own notification hook — built by someone who'd never heard the term "microservice" but arrived at the shape anyway.

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading core/classes/</span>
<p>Not a feature list — a directory listing. Each <code>.php</code> file is a standalone system with its own DB schema, its own API endpoints, and its own hook into a shared notification dispatch. Grouped by what they do:</p>

<div class="ffo-arch ffo-reveal" style="margin-top:1rem">

<div class="ffo-arch-group">
<div class="ffo-arch-label">Reading</div>
<div class="ffo-arch-items">
<div class="ffo-arch-item"><code>Search.php</code><span>Inverted index, set algebra in memory, zero SQL per filter</span></div>
<div class="ffo-arch-item"><code>Feed.php</code><span>Personalized by fandom + rating + language + currently reading</span></div>
<div class="ffo-arch-item"><code>Collections.php</code><span>Curated story lists, followers notified on update</span></div>
<div class="ffo-arch-item"><code>Bookmarks.php</code><span>Exact paragraph position, server-side, per user</span></div>
</div>
</div>

<div class="ffo-arch-group">
<div class="ffo-arch-label">Writing</div>
<div class="ffo-arch-items">
<div class="ffo-arch-item"><code>Drafts.php</code><span>Folder + branch types, private until published</span></div>
<div class="ffo-arch-item"><code>Updates.php</code><span>Author blog posts on profiles, pinnable</span></div>
<div class="ffo-arch-item"><code>Beta.php</code><span>Invite-only reader access, time-limited sessions</span></div>
<div class="ffo-arch-item"><code>Import.php</code><span>Link FFN account → auto-syncs chapters on upstream update</span></div>
</div>
</div>

<div class="ffo-arch-group">
<div class="ffo-arch-label">Social</div>
<div class="ffo-arch-items">
<div class="ffo-arch-item"><code>Reviews.php</code><span>Threaded: quote + reply, parent-ID tree</span></div>
<div class="ffo-arch-item"><code>Vote.php</code><span>Per-chapter, fires author notification</span></div>
<div class="ffo-arch-item"><code>Follow.php</code><span>Authors or collections, per-follow notification pref</span></div>
<div class="ffo-arch-item"><code>Chats.php</code><span>User-to-user DMs with blocking</span></div>
<div class="ffo-arch-item"><code>Poll.php</code><span>3-day expiry, results pushed via notification</span></div>
<div class="ffo-arch-item"><code>Questions.php</code><span>Anonymous submit, author approves → public</span></div>
</div>
</div>

<div class="ffo-arch-group">
<div class="ffo-arch-label">Infrastructure</div>
<div class="ffo-arch-items">
<div class="ffo-arch-item"><code>Notifications.php</code><span>10 priority-ranked types, single 15s poll heartbeat</span></div>
<div class="ffo-arch-item"><code>Stats.php</code><span>VFS identity, impressions vs views, referrer tracking</span></div>
<div class="ffo-arch-item"><code>Themes.php</code><span>Normal / sepia / dark, saved per account</span></div>
</div>
</div>

</div>

<p style="margin-top:.8rem">The notification system was the spine. Ten event types — <code>story_update</code>, <code>chapter_review</code>, <code>review_reply</code>, <code>follow_user</code>, <code>follow_collection</code>, <code>chapter_vote</code>, <code>user_update</code>, <code>beta_invite</code>, <code>stories_imported</code>, <code>account_verified</code> — all delivered through a single 15-second poll heartbeat (described in the next chapter).</p>
</div>

Authors and readers I reached out to, to join the site, often mentioned they'd love an app and would prefer it over a website. And after hours of researching the tradeoffs of WebViews, taking on the complexities and learning of React Native, and much much more — this was the first decision I made to prioritize, of choosing *not* to build something.

I instead maximized every single, however-new-feature of PWAs and turned the entire website in something that background-auto-downloaded into an offline app the first time you visit, and where you could save *any* story to read offline with just button, and read again, Wi-Fi off, directly from your browser.

Even today in 2026, there is barely a website I know of that manages to do this: even with the ease of Claude Code simplifying all the weird complexities of service workers into a couple back-and-forth chats.

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading service.js</span>
<p>The reader also worked offline, modeled on a library. "Borrow" a story: service worker caches the story page and every chapter URL, IndexedDB tracks what you hold. "Return" it to free space. Hourly, the worker sends held IDs + last sync timestamp; the server diffs and responds with three lists — <code>current</code> (keep), <code>update</code> (re-cache changed chapters), <code>delete</code> (evict unpublished). Only deltas transfer. Reads done offline queue locally and reconcile on reconnect, stamped with the same <code>landing_id</code> that ties into the analytics system in the next chapter.</p>
</div>

---

## Chapter Three · The Measurement

Perhaps my crown jewel and most loved-feature, inspired by the conspiracy theories of Zuckerberg, his taped laptop camera, and how he tracked every single movement of every person and what they were thinking. I was an easily-inspired child, and I wanted to build something of my own like it.

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading core/classes/stats.php, track_reading.php and global.js</span>
<p>No Google Analytics — the platform watched itself. Every page view saved a row to <code>stats_landings</code>, and it counted two different things: an <em>impression</em> (a story showed up in your results) versus a <em>view</em> (you actually clicked it). The difference is what people saw but skipped.</p>
<p>To make that data mean anything, it needed to know <em>who</em> each row belonged to — even before someone logged in. So every visitor got a VFS (Visitor Fingerprint Signature): a single ID that sticks to you across visits, and stays the same if you browse anonymously and sign up later. To find it, the server tried four things in order, stopping at the first hit:</p>

<div class="ffo-vfs-chain ffo-reveal">
  <div class="ffo-vfs-step">
    <div class="ffo-vfs-n">1</div>
    <div class="ffo-vfs-body"><strong>Cookie</strong><br>Already have a <code>vfs</code> cookie? Use it, and refresh it for another 15 years.</div>
  </div>
  <div class="ffo-vfs-arrow">↓ miss</div>
  <div class="ffo-vfs-step">
    <div class="ffo-vfs-n">2</div>
    <div class="ffo-vfs-body"><strong>User ID</strong><br>Logged in? Look up their first-ever visit and reuse that VFS.</div>
  </div>
  <div class="ffo-vfs-arrow">↓ miss</div>
  <div class="ffo-vfs-step">
    <div class="ffo-vfs-n">3</div>
    <div class="ffo-vfs-body"><strong>IP address</strong><br>Seen this IP before? Reuse the VFS it had last time.</div>
  </div>
  <div class="ffo-vfs-arrow">↓ miss</div>
  <div class="ffo-vfs-step ffo-vfs-new">
    <div class="ffo-vfs-n">✦</div>
    <div class="ffo-vfs-body"><strong>New VFS</strong><br>Truly new visitor — mint a fresh random ID with <code>bin2hex(random_bytes(39))</code>.</div>
  </div>
</div>

<p>Impressions fired by scroll, not render — a card counted only once its midpoint crossed the viewport, flushed every 15s to one endpoint: <code>poll</code>. That call became the real-time backbone, accreting jobs over six months:</p>

<div class="ffo-tl ffo-reveal">
  <div class="ffo-ev">
    <div class="date">Jul 2020 · v5.0.0</div>
    <h4>Impressions ship</h4>
    <p><code>im()</code> lands in <code>global.js</code>: counts a story card once it's actually on screen, sent to <code>poll</code> every 15s.</p>
  </div>
  <div class="ffo-ev blue">
    <div class="date">Aug 2020 · v5.6.0</div>
    <h4>Custom tags take over</h4>
    <p>The scanner switches to the invented <code>&lt;book&gt;</code> tag, tying analytics to the homegrown tag system.</p>
  </div>
  <div class="ffo-ev">
    <div class="date">Dec 2020 · v15.10.0</div>
    <h4>Poll delivers notifications too</h4>
    <p>The same 15s call now returns your new notifications on the way back — one round-trip for both.</p>
  </div>
  <div class="ffo-ev blue">
    <div class="date">Jan 2021 · v15.9.4</div>
    <h4>PollFilters: the loop becomes a bus</h4>
    <p><code>PollFilters</code> added: any page can attach extra data to the outgoing poll before it sends.</p>
  </div>
  <div class="ffo-ev green">
    <div class="date">Jan 2021 · v15.9.x</div>
    <h4>Reading position joins the wire</h4>
    <p><code>chapter-tracking.js</code> uses it to also send which paragraph you're on. Now one request carries impressions, notifications, and reading position.</p>
  </div>
</div>

<p>One request ended up doing everything. An AES-256 <code>placeholder</code> token, minted at render, stamped every action — vote, review, search — back to the VFS and referrer that opened the session:</p>

<div class="ffo-wire ffo-reveal">
  <div class="ffo-wire-head">one poll request · fired every 15s of real interaction</div>
  <div class="ffo-wire-cols">
    <div class="ffo-wire-col up">
      <div class="ffo-wire-tag">↑ client sends</div>
      <div class="ffo-wire-line"><code>placeholder</code><span>AES-256 token — landing id + page type</span></div>
      <div class="ffo-wire-line"><code>nonce</code><span>per-page session guard</span></div>
      <div class="ffo-wire-line"><code>im_books[]</code><span>cards scrolled past the viewport midpoint</span></div>
      <div class="ffo-wire-line"><code>position</code><span>paragraph now at the viewport top</span></div>
    </div>
    <div class="ffo-wire-col down">
      <div class="ffo-wire-tag">↓ server returns</div>
      <div class="ffo-wire-line"><code>notifications[]</code><span>inbox diff since the last poll</span></div>
      <div class="ffo-wire-line"><code>unread</code><span>badge count</span></div>
    </div>
  </div>
  <div class="ffo-wire-server">
    <div class="ffo-wire-tag">server, in between</div>
    <div class="ffo-wire-server-line">decrypt <code>placeholder</code> → <code>landing_id</code></div>
    <div class="ffo-wire-server-line">validate <code>nonce</code> → session · mismatch rejects with <code>998</code>, logged as spam</div>
    <div class="ffo-wire-server-line">log impressions → <code>stats_actions</code> · save paragraph → <code>track_reading</code></div>
  </div>
</div>

<p>Both rode in the DOM as invented HTML tags, read via <code>.getAttribute('value')</code> — web components, years before they were actually in the mainstream. On top, two cached admin reports: session time by referrer, and link-ins counted per story rather than sitewide — so the Tumblr spike showed up as one domain flooding a single row.</p>
</div>

---

## Chapter Four · The Outreach

So I engineered a scraper that bypassed Cloudflare through a rotating outwards proxy, logged into fanfiction.net with 5 rotating accounts, and sent personal DMs to a total of 8,500+ top authors, inviting them to the website. I don't think I knew what cold outreach or email lists even was at the time, but I knew I wanted to speak to authors, and I'd figured out it was a numbers game.

All on a $5/mo cPanel hosting, shared with one more, though mostly dead website.

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading the repo</span>
<p>One engine both stocked the library and ran the outreach. Scraping FFN — the largest fanfiction archive online, behind Cloudflare and hostile to scrapers — took over a year of building, getting blocked, and rebuilding across two repos: <code>ffarchive_py</code>, then <code>ffn_scraper</code>.</p>

<div class="ffo-tl ffo-reveal">
  <div class="ffo-ev">
    <div class="date">Jul 2020</div>
    <h4>ffarchive_py is born</h4>
    <p>Scrapy + MongoDB. FFN pagination working in days — and blocked just as fast.</p>
  </div>
  <div class="ffo-ev blue">
    <div class="date">Sep–Nov 2020</div>
    <h4>From crawler to growth engine</h4>
    <p>Gains a story importer, live update loop, and auto-sender — it stops just reading FFN and starts messaging it.</p>
  </div>
  <div class="ffo-ev">
    <div class="date">Dec 2020</div>
    <h4>Clean-slate rewrite</h4>
    <p>Proxy tricks stopped working. Rebuilt as <em>ffn_scraper</em>, using Flaresolverr to actually beat Cloudflare.</p>
  </div>
  <div class="ffo-ev blue">
    <div class="date">Jan 4, 2021</div>
    <h4>"All in SQLite DB"</h4>
    <p>MongoDB dropped for <code>UserData.db</code> — 8,378 authors indexed, with verification and notifications wired in.</p>
  </div>
  <div class="ffo-ev green">
    <div class="date">Jan 6, 2021</div>
    <h4>Added FFN Sender</h4>
    <p>Scraper and outreach merge — the crawler feeds the PM queue directly.</p>
  </div>
  <div class="ffo-ev rose">
    <div class="date">Feb 6, 2021 · 05:32am</div>
    <h4>Both engines, last touch</h4>
    <p>Both scrapers get their final commits 60 seconds apart — <code>"Stuff"</code> and <code>"Something"</code>, set down at 5am.</p>
  </div>
</div>
</div>

### The verification handshake

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading ffn_verification.py and v_code.php</span>
<p>FFN had no API or login to plug into, so there was only one way to prove an account was yours: show you could read its messages. The site gave you a code and a pre-filled message link, and a bot (<code>ffn_verification.py</code>) watched the inbox for that code and tied it to your FFN account. Once it matched, every story already scraped under that account was handed to you. Scraped first, returned when the real author showed up — which is what people objected to (covered later in this piece).</p>
</div>

<div class="ffo-vfs-chain ffo-reveal">
  <div class="ffo-vfs-step">
    <div class="ffo-vfs-n">1</div>
    <div class="ffo-vfs-body"><strong>You paste your FFN user ID and hit submit.</strong>The site generates a one-time code, good for an hour. <code>verify_user</code> → <code>bin2hex(random_bytes(4))</code></div>
  </div>
  <div class="ffo-vfs-arrow">↓</div>
  <div class="ffo-vfs-step">
    <div class="ffo-vfs-n">2</div>
    <div class="ffo-vfs-body"><strong>You click the link — it opens FFN's message box, already addressed, code already copied.</strong>Just paste and send. <code>pm2/post.php?uid=13818620</code> · <code>_.copyText</code></div>
  </div>
  <div class="ffo-vfs-arrow">↓</div>
  <div class="ffo-vfs-step">
    <div class="ffo-vfs-n">3</div>
    <div class="ffo-vfs-body"><strong>A bot checks that inbox on a loop and reads your message.</strong>It pulls the sender's author ID and the code. <code>/pm2/inbox.php</code> via Flaresolverr (own proxy, solves Cloudflare headless)</div>
  </div>
  <div class="ffo-vfs-arrow">↓</div>
  <div class="ffo-vfs-step ffo-vfs-new">
    <div class="ffo-vfs-n">✓</div>
    <div class="ffo-vfs-body"><strong>Code matches — you're verified.</strong>Fires an <code>account_verified</code> notification and hands every story already scraped under that author ID over to you.</div>
  </div>
</div>

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading the flaresolverr plugin and the proxy middleware</span>
<p>FFN sits behind Cloudflare, so every request to that inbox had to clear a bot check first. Each one routed through Flaresolverr, a headless browser that runs Cloudflare's challenge and returns the cleared cookies — held per session and reused, not re-solved each time. The PM reader and the bulk crawler ran on separate proxies and identities, so the account reading messages never shared an IP with the one pulling stories. When FFN logged a session out, the bot caught the redirect, signed back in, and kept going. No official API existed; the whole pipeline ran on reverse-engineered cookies and held together for over a year.</p>
</div>

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading the repo</span>
<p>The targeting filter: only authors with 350+ favorites or follows. 8,378 profiled, 4,964 reached, one message every 35 seconds across 5 rotating accounts, with each delivery confirmed by parsing the response page. Every one of them got this:</p>
</div>

<div class="ffo-pm ffo-reveal">
  <div class="ffo-pm-from">
    <div class="ffo-pm-av">FO</div>
    <div class="ffo-pm-meta">
      <b>Fanfiction Online</b>
      <span>Private Message · to ###USERNAME###</span>
    </div>
  </div>
  <div class="ffo-pm-subj">Hi <span style="color:#c2255c">###USERNAME###</span>! :)</div>
  <div class="ffo-pm-body">
    Hi <span class="u">###USERNAME###</span>! :)<br><br>
    We've created a site at Fanfiction Online for reading and writing fanfiction, since we feel FFN (and other sites) are really outdated and lack a lot of stuff.<br><br>
    Would love if you could post your stories there. You can reach new readers, and since the site has better reading, your current readers will read your fanfics more comfortably as well.<br><br>
    You might find it difficult to post on another site, so the site will do all the heavy lifting for you :) All you have to do is link your FFN account and select the stories you want to import. It's as simple as that. The stories will be updated automatically whenever you update the fic on FFN.<br><br>
    Thanks! Let me know if you have any questions.
  </div>
</div>

<div class="ffo-stats ffo-reveal">
  <div class="ffo-stat"><span class="n" data-to="8378">0</span><span class="l">Authors profiled</span></div>
  <div class="ffo-stat"><span class="n" data-to="4964">0</span><span class="l">Messages sent</span></div>
  <div class="ffo-stat"><span class="n" data-to="5">0</span><span class="l">Rotating senders</span></div>
  <div class="ffo-stat"><span class="n" data-to="35">0</span><span class="l">Sec between sends</span></div>
</div>

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading the scraper commits</span>
<p>The auto-sender wasn't random: it ranked <code>UserData.db</code> authors by engagement and worked from the top down. The five highest held 1.3M favorites between them:</p>

<table class="ffo-tbl" style="margin-top:.7rem">
  <thead><tr><th>Author</th><th>Favorites</th><th>Fandom</th></tr></thead>
  <tbody>
    <tr><td>sakurademonalchemist</td><td class="favs">456,019</td><td>Harry Potter · KHR</td></tr>
    <tr><td>Lomonaaeren</td><td class="favs">284,724</td><td>Harry Potter</td></tr>
    <tr><td>DebsTheSlytherinSnapefan</td><td class="favs">212,470</td><td>Harry Potter</td></tr>
    <tr><td>Tsume Yuki</td><td class="favs">207,734</td><td>Naruto</td></tr>
    <tr><td>NeonZangetsu</td><td class="favs">194,866</td><td>Naruto · Fate/stay night</td></tr>
  </tbody>
</table>

<p>After each send, it parsed FFN's response page to confirm the message landed.</p>
</div>

The response wasn't great. I learnt that people wouldn't use an empty site, less than 10 out of 8,500+ of them. But it did get some results — multiple authors created threads on Reddit, Tumblr, and other forums about the horror of being approached like this and how I was a money-sucking leech (I'd never monetized it, but they assumed somehow) bonding in their trauma. Yes, the response was that negative, almost bordering on harassment.

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, reading the same author's Reddit account (u/eqwe32)</span>
<p>Reconstructed from <a rel="nofollow" target="_blank" href="https://www.reddit.com/user/eqwe32/">u/eqwe32</a> — the anonymous account he posted the project under at the time — and all 51 of its threads across the fanfiction subreddits. One correction the record makes: the objection was rarely about money. It was about consent. Across 15 of those 51 threads, readers and writers make the same charge, that hosting their stories without asking was not his to do.</p>

<p>The public poll he ran on whether to remove those fics, instead of just removing them, sharpened it rather than settling it (u/Cautious-Pirate, 9 pts: he'd "got blasted for this left, right and centre").</p>

<p>And the hostility tracked what he posted, not who he was: asking a community what to build drew help and line-by-line feedback; announcing he'd built the best site drew the harshest replies. The cold-DM campaign this section is about came late, and was never the main charge against him.</p>

<p style="font-size:.82rem;color:#7e8c99;margin:.4rem 0 0">Every public post from <a rel="nofollow" target="_blank" href="https://www.reddit.com/user/eqwe32/">that account</a>, in order:</p>

<div class="ffo-tl ffo-reveal" style="margin-top:.9rem">
  <div class="ffo-ev blue">
    <div class="date">Dec 14, 2019 · r/FanFiction</div>
    <h4>"Hi everyone!" · 4↑ · 8 comments</h4>
    <p>First public trace — and the consent objection is already in the replies.</p>
  </div>
  <div class="ffo-ev rose">
    <div class="date">Mar 23, 2020 · r/FanFiction</div>
    <h4>"Ideal features you'd like to see..." · 0↑ · 15 comments</h4>
    <p>Scraping becomes the headline. Top reply, u/gros-grognon (11↑): "downright shitty... I can't trust your site."</p>
  </div>
  <div class="ffo-ev blue">
    <div class="date">Jun 20, 2020 · r/HPfanfiction</div>
    <h4>"Suggestions needed on how to improve..." · 13↑ · 32 comments</h4>
    <p>Pure UX feedback — layout, mobile, title-vs-author hierarchy — answered point by point.</p>
  </div>
  <div class="ffo-ev green">
    <div class="date">Aug 15, 2020 · r/HPfanfiction</div>
    <h4>"Something you've (probably) all been waiting for." · 62↑ · 20 comments</h4>
    <p>Warmest reception; readers say they'll switch. One won't — same consent grounds (u/Atojiso, 14↑).</p>
  </div>
  <div class="ffo-ev blue">
    <div class="date">Aug 21–22, 2020 · r/FanFiction + r/HPfanfiction</div>
    <h4>"What would be your dream fanfiction writing app?" · 0↑ / 39↑</h4>
    <p>Same feature-mining question put to both subs in one week.</p>
  </div>
  <div class="ffo-ev blue">
    <div class="date">Aug 27, 2020 · r/FanfictionOnline</div>
    <h4>Own subreddit created · 1↑ · lounge only</h4>
    <p>Spins up a project subreddit. Never takes.</p>
  </div>
  <div class="ffo-ev green">
    <div class="date">Sep 13, 2020 · r/NarutoFanfiction</div>
    <h4>"I created a fanfiction site..." · 219↑ · 167 comments</h4>
    <p>Biggest hit — pitched to Naruto writers before the site had a Naruto option (u/Cranesbill, 65↑).</p>
  </div>
  <div class="ffo-ev green">
    <div class="date">Oct 3, 2020 · r/WormFanfic</div>
    <h4>"...any suggestions/questions?" · 38↑ · 37 comments</h4>
    <p>The pitch at its plainest: no existing site improves on what readers and writers actually ask for.</p>
  </div>
  <div class="ffo-ev rose">
    <div class="date">Oct 19, 2020 · r/NarutoFanfiction + r/HPfanfiction</div>
    <h4>"The best app/site... you won't be disappointed." · 107↑ / 13↑</h4>
    <p>Hard-sell framing flips the room. u/callmesalticidae (56↑); u/Bomaruto (34↑): no right to host uploads without a terms of service.</p>
  </div>
  <div class="ffo-ev rose">
    <div class="date">Jul 23, 2023 · r/FanFiction + r/HPfanfiction</div>
    <h4>"Fanfiction.online will sunset on Sep 15th 2023" · 0↑ · 11 comments</h4>
    <p>End notice, three years on. The Dec 2019 complaint is still the first in the replies.</p>
  </div>
</div>
</div>

I was struggling — months of development and all other corners of fanfiction communities, the people I was building it for, seemed to hate me. Only one corner of the internet, a Harry Potter-centered fanfiction Discord, seemed to welcome me and provided support and, might I say, older developers who offered me guidance.

Until my big lucky break.

---

## Chapter Five · The Crash

A viral post on Tumblr ranted against Ao3 for various reasons and referenced my website as where they were moving. It was a miracle — overnight from 50 I hit 10,000+ signed-in users and could have been a lot more, except the cPanel hosting finally gave up, the internal email service I had used to deliver verification codes refused to deliver, and I was left stranded.

In all times of difficulties since then in my life, I've always had an inkling of an idea of what I would do. In this case, I had none.

<div class="ffo-crash ffo-reveal">
  <span class="tag">What broke</span>
  <p>Shared cPanel hosting, $5/mo, shared with one other barely-alive site. The host's internal mail service buckled under load. New users couldn't verify accounts. The hype was live; the site was effectively dark. No fallback, no queue, no redundancy — there had been no reason to build one.</p>
</div>

At the same time, anticipating some need I had started making some money and had a whole $35 stuck in Payoneer. I knew within those limits I had to figure out a solution. So I started researching and learning what servers were — I spent night and day, and in the most literal sense possible. I didn't sleep for nearly 3 nights and days worried I would miss out on my lucky break of users — and I wasn't wrong, I did.

And I wasn't able to figure the migration and setup of my newly discovered $5 droplet on DO in time — the site was unavailable, and the hype died.

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading the repo</span>
<p>The migration did eventually get there. Two separate webapps, <code>fanfiction_online</code> and <code>beta</code>, both on the same $5 droplet, deployed from a laptop via <code>build.py</code>.</p>
</div>

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading build.py</span>
<p>The deploy script is about as basic as it gets. No CI, no Docker, no staging pipeline. Just Python calling <code>subprocess</code> twice to SCP two zips up, then SSHing in to unzip them into the live directory. It looks naive, and in some ways it is, but it's also enough when you're 17, have $35, and are racing a hype window that's already closing. It worked. Both webapps, main and beta, on the same droplet, deployed from a laptop:</p>

<pre class="ffo-pre" style="margin-top:.7rem"><span class="c"># build.py — the whole deploy pipeline</span>
host = <span class="s">"root@167.99.11.178"</span>
upload_to = <span class="s">"/home/runcloud/webapps/"</span>

subprocess.call(<span class="s">"scp content.zip "</span> + host + <span class="s">":"</span> + upload_to, shell=True)
subprocess.call(<span class="s">"scp static.zip  "</span> + host + <span class="s">":"</span> + upload_to, shell=True)

cmds = [
    <span class="s">"rm -r -f "</span> + upload_to + main_app + <span class="s">"/content"</span>,
    <span class="s">"unzip content.zip -d "</span> + upload_to + main_app + <span class="s">"/"</span>,
]
subprocess.call(<span class="s">"ssh "</span> + host + <span class="s">' "'</span> + <span class="s">" && "</span>.join(cmds) + <span class="s">'"'</span>, shell=True)</pre>
<p>The crash timeline, reconstructed from the commit dates and what the code tells us about the mail architecture:</p>

<div class="ffo-tl" style="margin-top:.9rem">
  <div class="ffo-ev">
    <div class="date">The Tumblr spike</div>
    <h4>50 → 10,000+ signed-in users overnight</h4>
    <p>A viral post referencing the site as the alternative. No warning, no ramp-up.</p>
  </div>
  <div class="ffo-ev rose">
    <div class="date">Immediately</div>
    <h4>cPanel's mail collapses under signup load</h4>
    <p>Verification codes stop. Every new account is stuck at the confirmation step. The hype is live; the funnel is dead.</p>
  </div>
  <div class="ffo-ev blue">
    <div class="date">3 sleepless nights</div>
    <h4>Learning what a VPS actually is</h4>
    <p>DigitalOcean found. <span class="ffo-chip">root@167.99.11.178</span> provisioned. $35 in Payoneer, the entire budget. RunCloud installed for server management.</p>
  </div>
  <div class="ffo-ev rose">
    <div class="date">Too late</div>
    <h4>Migration finishes; hype is already gone</h4>
    <p>The window was days wide. The setup took longer. 10,000 users became a number in a story about what almost was.</p>
  </div>
  <div class="ffo-ev green">
    <div class="date">Eventually</div>
    <h4>Both webapps live on the $5 droplet</h4>
    <p><code>fanfiction_online</code> and <code>beta</code>. Deployed via <code>build.py</code>. The infrastructure that should have existed in March.</p>
  </div>
</div>
</div>

---

## Chapter Six · The Engine

After the crash, I did some rudimentary benchmarking — eyeballing the DO instance's memory graph, inserting timers into PHP template scripts. One of the two biggest reasons for the crash: WordPress' query engine took on average 20s for a single filtered query, sometimes up to 2 minutes.

Rather than fidget against WordPress for a 2-3x speedup, I hand-rolled it all. PHP 8 had just been released with promises for efficient low-level array functions, so I built my own query engine and brought 90% of complex queries down to < 3s.

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading Query.php</span>
<p>The search was the worst offender — nine filter dimensions (fandom, genre, rating, status, word count, character, pairing, language, sort), each supporting include <em>and</em> exclude. Under <code>WP_Query</code>, every combination compiled to JOINs against <code>wp_term_relationships</code>. The replacement: an inverted index precomputed at write time — every tag value mapped to the set of story IDs carrying it — filtered entirely in memory as set algebra.</p>

<div class="ffo-venn" style="margin:.9rem 0">
  <span class="ffo-pill inc">Romance</span><span class="ffo-pill op">∩</span>
  <span class="ffo-pill inc">Adventure</span><span class="ffo-pill op">∩</span>
  <span class="ffo-pill inc">Naruto</span><span class="ffo-pill op">−</span>
  <span class="ffo-pill exc">Crossover</span><span class="ffo-pill op">=</span>
  <span class="ffo-pill res">✦ your shelf</span>
</div>

<p>No joins. No <code>WHERE tag IN (...)</code> against 50k rows. Result set computed in memory; only current-page IDs fetched from DB. Wrapped in a hand-built PHP 8 type system (<code>Integer</code>, <code>LazyInteger</code>, <code>Range</code>, <code>Str</code>, <code>OneOf</code>, <code>TypedArray</code>) — all throwing on bad input. Two commits, then the repos went quiet.</p>
</div>

<p style="font-size:.82rem;color:#7e8c99;margin:.6rem 0 .3rem">Toggle filters — click to include (green), again to exclude (red), third to clear:</p>

<div id="ffo-filter-demo" style="margin: .5rem 0 .2rem">
  <div class="ffo-chips" id="ffo-demo-chips" style="margin-bottom: .8rem">
    <span class="ffo-chip-item" data-filter="fandom">Fandom</span>
    <span class="ffo-chip-item" data-filter="genre">Genre</span>
    <span class="ffo-chip-item" data-filter="rating">Rating</span>
    <span class="ffo-chip-item" data-filter="status">Status</span>
    <span class="ffo-chip-item" data-filter="words">Word count</span>
    <span class="ffo-chip-item" data-filter="character">Character</span>
    <span class="ffo-chip-item" data-filter="pairing">Pairing</span>
    <span class="ffo-chip-item" data-filter="language">Language</span>
    <span class="ffo-chip-item" data-filter="sort">Sort order</span>
  </div>
  <pre class="ffo-pre" id="ffo-sql-out" style="margin-top:0"></pre>
  <pre class="ffo-pre" id="ffo-php-out" style="margin-top:.6rem"></pre>
</div>

<script>
(function() {
  const filters = {
    fandom:    { col: 's.fandom_id', val: 'harry_potter', table: null, idx: 'fandom', idxVal: 'harry_potter', mode: 'include' },
    genre:     { col: null, val: 'romance', table: 'story_tags', idx: 'genre', idxVal: 'romance', mode: 'exclude' },
    rating:    { col: 's.rating', val: 'M', table: null, idx: 'rating', idxVal: 'M', mode: 'include' },
    status:    { col: 's.status', val: 'complete', table: null, idx: 'status', idxVal: 'complete', mode: 'include' },
    words:     { col: 's.word_count', val: '50000', table: null, idx: null, idxVal: null, mode: 'range' },
    character: { col: null, val: 'hermione', table: 'story_characters', idx: 'character', idxVal: 'hermione', mode: 'include' },
    pairing:   { col: null, val: 'drarry', table: 'story_pairings', idx: 'pairing', idxVal: 'drarry', mode: 'include' },
    language:  { col: 's.language', val: 'english', table: null, idx: 'language', idxVal: 'english', mode: 'include' },
    sort:      { col: null, val: 'favorites', table: null, idx: null, idxVal: null, mode: 'sort' }
  };

  const state = {};
  const chips = document.querySelectorAll('#ffo-demo-chips .ffo-chip-item');

  function s(t) { return '<span class="s">\'' + t + '\'</span>'; }
  function k(t) { return '<span class="k">' + t + '</span>'; }
  function c(t) { return '<span class="c">' + t + '</span>'; }
  function v(t) { return '<span class="v">' + t + '</span>'; }

  function render() {
    const active = Object.keys(state).filter(f => state[f]);
    const filterCount = active.filter(f => filters[f].mode !== 'sort').length;
    if (!active.length) {
      document.getElementById('ffo-sql-out').innerHTML = c('-- ↑ click filters to build the before/after');
      document.getElementById('ffo-php-out').innerHTML = c('// ↑ the optimized version appears here');
      return;
    }

    const sqlSec = (8 + filterCount * 5 + (active.some(f => filters[f].mode === 'exclude') ? 6 : 0)).toFixed(0);
    const phpSec = Math.max(0.5, (0.3 + filterCount * 0.4)).toFixed(1);
    const speedup = Math.round(sqlSec / phpSec);

    let joins = [], wheres = [], notIns = [], orderBy = '';
    let joinIdx = 0;
    active.forEach(f => {
      const def = filters[f];
      if (def.mode === 'sort') { orderBy = def.val; return; }
      if (def.mode === 'range') { wheres.push('s.word_count >= ' + def.val); return; }
      if (def.mode === 'exclude') {
        notIns.push({ table: def.table || 'story_tags', col: 'tag_id', val: def.val });
        return;
      }
      if (def.col) { wheres.push(def.col + ' = ' + "'" + def.val + "'"); }
      else {
        joinIdx++;
        const alias = 'j' + joinIdx;
        joins.push({ alias, table: def.table || 'story_tags', col: 'tag_id', val: def.val });
      }
    });

    let sql = c('-- BEFORE: WP_Query → SQL on every filter toggle · ~' + sqlSec + 's on shared cPanel MySQL') + '\n';
    sql += k('SELECT') + ' s.id ' + k('FROM') + ' stories s\n';
    joins.forEach(j => {
      sql += k('JOIN') + ' ' + j.table + ' ' + j.alias + ' ' + k('ON') + ' s.id = ' + j.alias + '.story_id\n';
    });
    if (wheres.length || notIns.length) {
      sql += k('WHERE') + ' ' + wheres.join('\n  ' + k('AND') + ' ');
      if (wheres.length && joins.length) sql += '\n  ' + k('AND') + ' ';
      joins.forEach((j, i) => {
        sql += (i > 0 || wheres.length ? '\n  ' + k('AND') + ' ' : '') + j.alias + '.' + j.col + ' = ' + "'" + j.val + "'";
      });
      notIns.forEach((n, i) => {
        sql += (i > 0 || wheres.length || joins.length ? '\n  ' + k('AND') + ' ' : '') + 's.id ' + k('NOT IN') + ' (\n    ' + k('SELECT') + ' story_id ' + k('FROM') + ' ' + n.table + '\n    ' + k('WHERE') + ' ' + n.col + ' = ' + "'" + n.val + "'" + '\n  )';
      });
    }
    if (orderBy) sql += '\n' + k('ORDER BY') + ' s.' + orderBy + ' ' + k('DESC');
    sql += ';';
    document.getElementById('ffo-sql-out').innerHTML = sql;

    let php = c('// AFTER: PHP 8 inverted index → set algebra in memory · ~' + phpSec + 's · ' + speedup + '× faster') + '\n';
    let first = true;
    active.forEach(f => {
      const def = filters[f];
      if (def.mode === 'sort') return;
      if (first && def.idx && def.mode === 'include') {
        php += v('$results') + ' = ' + v('$index') + '[' + s(def.idx) + '][' + s(def.idxVal) + '];\n';
        first = false;
      } else if (def.mode === 'include' && def.idx) {
        php += v('$results') + ' = ' + k('array_intersect') + '(' + v('$results') + ', ' + v('$index') + '[' + s(def.idx) + '][' + s(def.idxVal) + ']);\n';
      } else if (def.mode === 'exclude' && def.idx) {
        php += v('$results') + ' = ' + k('array_diff') + '(' + v('$results') + ', ' + v('$index') + '[' + s(def.idx) + '][' + s(def.idxVal) + ']);\n';
      } else if (def.mode === 'range') {
        php += v('$results') + ' = ' + k('array_filter') + '(' + v('$results') + ', ' + k('fn') + '(' + v('$id') + ') =>\n    ' + v('$meta') + '[' + v('$id') + '][' + s('words') + '] >= ' + def.val + '\n);\n';
      }
    });
    if (orderBy) {
      php += k('usort') + '(' + v('$results') + ', ' + k('fn') + '(' + v('$a') + ', ' + v('$b') + ') =>\n    ' + v('$meta') + '[' + v('$b') + '][' + s(orderBy) + '] - ' + v('$meta') + '[' + v('$a') + '][' + s(orderBy) + ']\n);\n';
    }
    document.getElementById('ffo-php-out').innerHTML = php;
  }

  chips.forEach(chip => {
    chip.style.cursor = 'pointer';
    chip.style.transition = '.15s';
    chip.style.userSelect = 'none';
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      const canExclude = f !== 'sort' && f !== 'words';
      if (!state[f]) {
        state[f] = 'include';
        filters[f].mode = 'include';
        chip.style.background = '#2a9d5c';
        chip.style.color = '#fff';
        chip.style.borderColor = '#2a9d5c';
        chip.style.textDecoration = '';
      } else if (state[f] === 'include' && canExclude) {
        state[f] = 'exclude';
        filters[f].mode = 'exclude';
        chip.style.background = '#c2255c';
        chip.style.color = '#fff';
        chip.style.borderColor = '#c2255c';
        chip.style.textDecoration = 'line-through';
      } else {
        delete state[f];
        const orig = {fandom:'include',genre:'exclude',rating:'include',status:'include',words:'range',character:'include',pairing:'include',language:'include',sort:'sort'};
        filters[f].mode = orig[f];
        chip.style.background = '';
        chip.style.color = '';
        chip.style.borderColor = '';
        chip.style.textDecoration = '';
      }
      render();
    });
  });

  render();
})();
</script>

---

## Chapter Seven · The Mail Server

I was finally able to get it together and set up my own mail server, but that too, was eventually rate-limited.

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading mail.php</span>
<p>Three generations of email, each one failing in its own way, and each failure only obvious once it was already costing users.</p>

<div class="ffo-tl ffo-reveal" style="margin-top:.9rem">
  <div class="ffo-ev rose">
    <div class="date">Gen 1 · cPanel internal mail</div>
    <h4>Buckled at the spike</h4>
    <p>Fine for low volume. Couldn't survive 10,000 signups overnight. Verification codes stopped. New users were stuck at confirmation.</p>
  </div>
  <div class="ffo-ev rose">
    <div class="date">Gen 2 · Self-hosted on the $5 droplet</div>
    <h4>Cold IP, throttled out</h4>
    <p>Worked initially. Then receiving servers started rejecting it, which is the usual fate of any unknown IP sending volume. No reputation, no delivery.</p>
  </div>
  <div class="ffo-ev green">
    <div class="date">Gen 3 · SendGrid</div>
    <h4>Finally held</h4>
    <p>Seven fully-designed transactional templates. The solution that should have existed before the spike, built three months after it.</p>
  </div>
</div>
</div>

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading the commit history</span>
<p>The last two commits in the entire project — <code>"Sending Mail"</code> and <code>"Updated Mail templates"</code>, May 20, 2021. A fitting last word from the code: the thing that crashed the site when it finally got its moment, fixed, at the very end.</p>
</div>

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading mail.php</span>
<p>SendGrid was the third attempt and the one that held: seven fully-designed dynamic templates, each with a real SendGrid template ID hardcoded:</p>

<div class="ffo-mail" style="margin-top:.8rem">
  <div class="ffo-mail-chip"><span class="type">signup</span>New account welcome</div>
  <div class="ffo-mail-chip"><span class="type">OTP</span>Verification code delivery</div>
  <div class="ffo-mail-chip"><span class="type">change-email</span>Email address change</div>
  <div class="ffo-mail-chip"><span class="type">notification</span>Story updates &amp; replies</div>
  <div class="ffo-mail-chip"><span class="type">faq-alert</span>FAQ change notifications</div>
  <div class="ffo-mail-chip"><span class="type">contact</span>Contact form confirm</div>
  <div class="ffo-mail-chip"><span class="type">contact-first</span>First contact flow</div>
</div>
<p style="margin-top:.7rem">Seven templates means seven distinct transactional scenarios were thought through, designed, and wired to API calls. That's more deliberate than email usually gets on a project this size, and it reads like someone who'd already watched it fail twice and wanted the third version to hold.</p>
</div>

---

## Epilogue

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading the commit history</span>
<p>The commit messages decay honestly as the months drag on — <code>"Whatever,"</code> <code>"Stuff,"</code> <code>"Something,"</code> <code>"No Idea what this is."</code> That's not failure. That's the fingerprint of someone carrying an entire product on their own back, well past the point most would have stopped.</p>
</div>

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading the repo</span>
<p>The hype window closed before the migration was ready, and the outreach campaign produced backlash before it produced users. All of it ran on a $5 shared hosting plan the site was never meant to outlive, until the night it had to, when three sleepless days and the only $35 available went into fixing that.</p>
<p>The repos went quiet on May 20, 2021, with two commits about finally getting email right. The live site kept going and kept gaining features that version control never recorded. The story git can tell ends there.</p>
</div>

<div class="ffo-stats ffo-reveal">
  <div class="ffo-stat"><span class="n" data-to="298">0</span><span class="l">Production commits</span></div>
  <div class="ffo-stat"><span class="n" data-to="8378">0</span><span class="l">Authors profiled</span></div>
  <div class="ffo-stat"><span class="n" data-to="10000">0</span><span class="l">Peak signed-in users</span></div>
  <div class="ffo-stat"><span class="n" data-to="5">0</span><span class="l">$/mo it ran on</span></div>
</div>

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, after reading all 298 commits</span>
<p>Solo teenage projects usually follow one pattern: a good idea, built halfway, then dropped. This one ran longer than that. The commit history shows someone who kept going through the backlash, the crash, and the migration that came too late. The final commit is about email. Not a new feature or a rewrite, just a fix for the thing that had failed at the worst possible moment, landing three months after it mattered.</p>
<p>The commit messages do get worse. <code>"Whatever"</code>, <code>"Stuff"</code>, <code>"Something"</code>, <code>"No Idea what this is"</code> turn up in the middle months. That reads less like someone who stopped caring and more like someone too far into the work to bother naming it. What got built across that stretch: sixteen features, a custom PHP framework, a Cloudflare-bypassing scraper, a typed search engine, three generations of email infrastructure, and a cold-outreach campaign to 8,500 authors, all of it alone, at 17, on $5 a month.</p>
<p>The repos went quiet on May 20, 2021. The story they can tell ends there; the rest survives only because it finally got written down.</p>
</div>

<div class="ffo-ai ffo-reveal">
<span class="ffo-ai-label">— Opus 4.8, reading where the Reddit account left off</span>
<p>The site outlived its code by two years. The shutdown, announced July 23, 2023, came with a one-line reason: "Too expensive to maintain (and so my therapist stops bothering me about it)." He pitched a successor, a free Chrome and Edge reading extension for AO3 and fanfiction.net, and held his ground on the original idea: "I don't think what I did was stealing in any way, it's exactly the same... as the WaybackMachine."</p>
<p>Within a day he'd talked himself out of the extension too, "because of the hostile reaction on the other FanFiction sub." Roughly three and a half years of running it, and what stopped it in the end was cost and exhaustion, not the code.</p>
</div>

<div class="ffo-callout ffo-reveal">
  <span class="tag">Deeper dive · primary sources</span>
  <p>The public traces the site left behind, if you want to read the reception unfiltered:</p>
  <p style="margin-top:.5rem">
    · Reddit — the launch and the backlash, in full: <a href="https://www.reddit.com/user/eqwe32/" target="_blank" rel="noopener">u/eqwe32</a><br>
    · X / Twitter — the project account: <a href="https://x.com/FanfictionOnlin" target="_blank" rel="noopener">@FanfictionOnlin</a><br>
    · Tumblr — what other communities said: <a href="https://www.tumblr.com/search/%22fanfiction.online%22?src=typed_query" target="_blank" rel="noopener">"fanfiction.online" search</a>
  </p>
</div>

<script>
(function(){

  /* ── scroll progress bar ── */
  var bar = document.getElementById('ffo-bar');
  window.addEventListener('scroll', function(){
    var h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  });

  /* ── reveal on scroll ── */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  }, {threshold: .12});
  document.querySelectorAll('.ffo-reveal').forEach(function(el){ io.observe(el); });

  /* ── count-up ── */
  var fmt = function(n){ return n >= 1000 ? n.toLocaleString('en-US') : String(n); };
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target, to = +el.dataset.to, s = null;
      var step = function(t){
        if(!s) s = t;
        var p = Math.min((t-s)/1600, 1), ease = 1-Math.pow(1-p,3);
        el.textContent = fmt(Math.floor(ease*to));
        if(p < 1) requestAnimationFrame(step); else el.textContent = fmt(to);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, {threshold: .5});
  document.querySelectorAll('.ffo-stat .n').forEach(function(el){ cio.observe(el); });

  /* ── search filter demo ── */
  var STORIES = [
    {title:"The Long Way Home",       fandom:"Harry Potter",      genres:["Romance","Hurt/Comfort"], rating:"T", status:"In Progress", wc:187000},
    {title:"A Thousand Paper Cranes", fandom:"Naruto",            genres:["Angst","Romance"],        rating:"M", status:"Complete",    wc:312000},
    {title:"Between Two Worlds",      fandom:"Harry Potter",      genres:["Adventure","Crossover"],  rating:"T", status:"Complete",    wc:94000},
    {title:"Crimson Tide",            fandom:"My Hero Academia",  genres:["Adventure","Angst"],      rating:"M", status:"In Progress", wc:58000},
    {title:"Glass Houses",            fandom:"Twilight",          genres:["Romance","Hurt/Comfort"], rating:"T", status:"Complete",    wc:42000},
    {title:"The Marauders' Last Year",fandom:"Harry Potter",      genres:["Angst","Romance"],        rating:"M", status:"Complete",    wc:225000},
    {title:"Uzumaki's Redemption",    fandom:"Naruto",            genres:["Adventure"],              rating:"T", status:"In Progress", wc:130000},
    {title:"Parallel Lines",          fandom:"Supernatural",      genres:["Hurt/Comfort","Angst"],   rating:"M", status:"Complete",    wc:78000},
    {title:"The Weight of Wings",     fandom:"My Hero Academia",  genres:["Romance","Adventure"],    rating:"K", status:"Complete",    wc:33000},
    {title:"Heir Apparent",           fandom:"Harry Potter",      genres:["Adventure"],              rating:"T", status:"In Progress", wc:410000},
    {title:"Wolves Don't Cry",        fandom:"Twilight",          genres:["Romance","Crossover"],    rating:"M", status:"In Progress", wc:67000},
    {title:"The Quiet Hours",         fandom:"Supernatural",      genres:["Hurt/Comfort","Romance"], rating:"T", status:"Complete",    wc:21000},
  ];

  var tagState = {}; // val -> 'inc' | 'exc'

  function renderStories(){
    var list = document.getElementById('ffo-story-list');
    var countEl = document.getElementById('ffo-res-count');
    if(!list) return;

    var wcMin = +(document.getElementById('ffo-wc-min')||{value:0}).value * 1000;
    var wcMax = +(document.getElementById('ffo-wc-max')||{value:500}).value * 1000;

    var filtered = STORIES.filter(function(s){
      // word count range
      if(s.wc < wcMin || s.wc > wcMax) return false;
      // check each active tag
      for(var val in tagState){
        var state = tagState[val];
        if(!state) continue;
        var matches = s.fandom === val || s.genres.indexOf(val) > -1 || s.rating === val || s.status === val;
        if(state === 'inc' && !matches) return false;
        if(state === 'exc' && matches)  return false;
      }
      return true;
    });

    countEl.textContent = filtered.length;
    list.innerHTML = filtered.map(function(s){
      return '<div class="ffo-story-row">'
        + '<div><div class="ffo-story-title">'+s.title+'</div>'
        + '<div class="ffo-story-meta">'+s.fandom+' · '+s.rating+' · '+s.status+'</div>'
        + '<div class="ffo-story-tags">'
        + s.genres.map(function(g){ return '<span class="ffo-story-tag">'+g+'</span>'; }).join('')
        + '</div></div>'
        + '<div class="ffo-wc">'+(s.wc/1000).toFixed(0)+'k words</div>'
        + '</div>';
    }).join('');
  }

  document.querySelectorAll('.ffo-tag').forEach(function(tag){
    tag.onclick = function(){
      var val = tag.dataset.val;
      var cur = tagState[val] || null;
      if(!cur)          { tagState[val] = 'inc'; tag.classList.add('inc'); tag.classList.remove('exc'); }
      else if(cur==='inc'){ tagState[val] = 'exc'; tag.classList.remove('inc'); tag.classList.add('exc'); }
      else              { delete tagState[val]; tag.classList.remove('inc','exc'); }
      renderStories();
    };
  });

  var wcMinEl = document.getElementById('ffo-wc-min');
  var wcMaxEl = document.getElementById('ffo-wc-max');
  var wcValEl = document.getElementById('ffo-wc-val');
  var wcMaxValEl = document.getElementById('ffo-wc-max-val');
  if(wcMinEl){
    wcMinEl.oninput = function(){ wcValEl.textContent = wcMinEl.value; renderStories(); };
    wcMaxEl.oninput = function(){ wcMaxValEl.textContent = wcMaxEl.value; renderStories(); };
  }

  renderStories();

})();
</script>
