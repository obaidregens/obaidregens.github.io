---
layout: post
title: "My foray into video editing"
date: 2026-05-13
published: false
---

If you've watched enough reels, videos, TikToks, or similar modern-era short-form content, you know what "video editing" is, and the goals it should achieve.

But if somehow, you are from a different generation, live under a rock or are having your first contact with the modern human-internet society, you would need an explanation.

Likely, this description will not match any who come across this blog, but it does allow me a natural, imaginatory medium to break down and explore this process in the level I want to.

"film", was by definition a series of pictures that conveyed a story, and often capturing reality-like movement through the camera. Any kind.

Edited videos are its evolution, but somehow, different. The focus of video-editing is not on the timeline, but the canvas. Where the canvas exists, images are placed on any part of it, either cleanly separated or overlapping, as a series of moving pictures or one individual picture, and for any duration of time.

Essentially, unlike film which had one dimension, the timeline, this has two: the canvas and the timeline.

I should mention that this theory is completely original. I intentionally block out and avoid research when theorizing or thinking deeply, to avoid polluting my headspace with ideas only occurring as a result of reinforcement.

Theory is complete. So we begin.

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">

<style>
.wt {
  --bg:     #faf8f4;
  --paper:  #ffffff;
  --ink:    #1a1916;
  --muted:  #8a857c;
  --hair:   #e6e2d9;
  --track:  #d6d2c8;
  --accent: #b85c26;
  width: 100%;
  margin: 2rem 0;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: var(--ink);
}

.wt *, .wt *::before, .wt *::after { box-sizing: border-box; }

/* ── HEADER ─────────────────────────────────────────────────────────────── */
.wt-header {
  margin-bottom: 16px;
}
.wt-title {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -.015em;
  line-height: 1.18;
  margin: 0;
}

/* ── OVERVIEW TIMELINE ──────────────────────────────────────────────────── */
.wt-tl {
  margin-bottom: 32px;
}

#tlSvg { display: block; width: 100%; overflow: visible; }

/* ── TWO-COLUMN CONTENT ─────────────────────────────────────────────────── */
.wt-content {
  display: grid;
  grid-template-columns: 248px 1fr;
  gap: 0 52px;
  align-items: start;
}

/* ── LEFT: STICKY SLIDER ────────────────────────────────────────────────── */
.wt-slider-col {
  position: sticky;
  top: 32px;
}
.slider-eyebrow {
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 10px;
}
.slider-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  background: #111;
  border-radius: 3px;
  overflow: hidden;
}
.s-frame {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: bottom;
  z-index: 25;
  pointer-events: none;
  opacity: 0;
  transition: opacity .4s ease;
}
.s-frame.is-visible { opacity: 1; }
.di-pill {
  position: absolute;
  left: 34.27%;
  top: 1.545%;
  width: 31.46%;
  height: 5.43%;
  background: #000;
  border-radius: 9999px;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity .4s ease;
}
.di-pill.is-visible { opacity: 1; }
.prefix-panel {
  display: none;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0;
  margin-top: 0;
}
.prefix-panel.is-visible { display: flex; }
.pp-frame {
  flex: 1;
  min-width: 0;
  aspect-ratio: 9 / 16;
  border-radius: 5px;
  overflow: hidden;
  background: #000;
  position: relative;
}
.pp-frame-overlay {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: bottom;
  pointer-events: none;
}
.pp-frame-di {
  position: absolute;
  left: 34.27%;
  top: 1.545%;
  width: 31.46%;
  height: 5.43%;
  background: #000;
  border-radius: 9999px;
  pointer-events: none;
}
.pp-replay {
  position: absolute;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.pp-replay.is-visible { display: flex; }
.pp-replay-btn {
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background: rgba(255,255,255,.15);
  border: none;
  border-radius: 999px;
  padding: 5px 12px;
  backdrop-filter: blur(4px);
}
.pp-black-overlay {
  position: absolute;
  inset: 0;
  background: #000;
  pointer-events: none;
  transition: opacity .5s ease;
}
.pp-black-overlay.is-gone { opacity: 0; }
.step6-replay-btn {
  display: none;
  width: 100%;
  margin: 10px 0 0;
  padding: 6px;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: center;
}
.step6-replay-btn.is-visible { display: block; }
.step7-panel {
  display: none;
  width: 100%;
  padding: 2px 0;
}
.step7-panel.is-visible { display: block; }
.s8b-check {
  position: relative;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  user-select: none;
  padding: 5px 13px 5px 10px;
  border-radius: 999px;
  border: 2px solid var(--track);
  color: var(--track);
  transition: border-color .15s, color .15s, background .15s;
}
.s8b-check input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}
.s8b-check::before {
  content: '';
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-radius: 3px;
  box-sizing: border-box;
  opacity: 0.5;
  transition: background .15s, opacity .15s;
}
.s8b-check:has(input:checked)::before {
  background: currentColor;
  border-color: currentColor;
  opacity: 1;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 6l3 3 4-4.5' stroke='white' stroke-width='1.9' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-size: cover;
}
.s8b-check:has(input[data-s8b="vocals"]:checked) { background: #3aaa6810; border-color: #3aaa68; color: #3aaa68; }
.s8b-check:has(input[data-s8b="music"]:checked)  { background: #b85c2610; border-color: #b85c26; color: #b85c26; }
.s8b-check:has(input[data-s8b="orig"]:checked)   { background: #5a6e8210; border-color: #5a6e82; color: #5a6e82; }
.step7-play-btn {
  display: block;
  margin: 10px auto 0;
  padding: 5px 18px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--hair);
  border-radius: 999px;
  cursor: pointer;
  letter-spacing: .06em;
}
.step7-play-btn:hover { border-color: var(--track); color: var(--ink); }
.pp-frame video {
  width: 100%; height: 100%;
  object-fit: contain;
  display: block;
}
.pp-frame:last-child video { object-fit: cover; }
.pp-plus {
  flex-shrink: 0;
  width: 28px;
  text-align: center;
  color: var(--muted);
  font-family: "IBM Plex Mono", monospace;
  font-size: 15px;
}
.slider-hint { transition: opacity .4s ease; }
.slider-hint.is-hidden { opacity: 0; pointer-events: none; }
.s-layer {
  position: absolute;
  inset: 0;
}
.s-layer video {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
#sliderContent {
  position: absolute;
  inset: 0;
  transition: transform .5s ease;
}
.show-crop #sliderContent {
  transform: scale(0.829);
  transform-origin: center bottom;
}
.crop-indicator {
  position: absolute;
  left: 8.55%; right: 8.55%; top: 17.1%; bottom: 0;
  border: 3px solid rgba(255,255,255,.88);
  border-radius: 7%;
  box-shadow: 0 0 0 9999px rgba(0,0,0,.45);
  pointer-events: none;
  z-index: 26;
  opacity: 0;
  transition: opacity .4s ease;
}
.show-crop .crop-indicator { opacity: 1; }
.split-div {
  position: absolute;
  top: 0; bottom: 0;
  width: 48px;
  transform: translateX(-50%);
  z-index: 20;
  cursor: ew-resize;
  touch-action: none;
  display: flex; align-items: center; justify-content: center;
}
.split-div::before {
  content: '';
  position: absolute; top: 0; bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 1.5px;
  background: rgba(255,255,255,.82);
  pointer-events: none;
}
.split-knob {
  position: relative; z-index: 1;
  width: 28px; height: 28px;
  background: #fff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 8px rgba(0,0,0,.35);
  pointer-events: none;
}
.split-knob svg { display: block; }
.slider-ba-labels {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  display: flex; justify-content: space-between;
  padding: 8px 10px;
  pointer-events: none;
  z-index: 30;
}
.ba-lbl {
  font-family: "IBM Plex Mono", monospace;
  font-size: 8.5px; letter-spacing: .12em; text-transform: uppercase;
  color: rgba(255,255,255,.55);
  background: rgba(0,0,0,.3);
  padding: 3px 7px;
  border-radius: 2px;
}
.slider-hint {
  margin: 10px 0 0;
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--muted);
  opacity: .6;
  text-align: center;
}

/* ── RIGHT: STEPS ───────────────────────────────────────────────────────── */
.wt-steps { list-style: none; margin: 0; padding: 0; }
.wt-step {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 0 20px;
  padding: 24px 0;
  border-top: 1px solid var(--hair);
  opacity: .35;
  transition: opacity .35s ease;
}
.wt-step.is-active { opacity: 1; }
.wt-step.is-pending { opacity: .18; }
.wt-gutter {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3px;
}
.wt-dot {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 1.5px solid var(--ink);
  display: flex; align-items: center; justify-content: center;
  font-family: "IBM Plex Mono", monospace;
  font-size: 10px; font-weight: 500;
  color: var(--ink);
  flex-shrink: 0;
  background: var(--bg);
}
.wt-step.is-pending .wt-dot {
  border-style: dashed;
  border-color: var(--muted);
  color: var(--muted);
}
.wt-line {
  width: 1px; flex: 1; min-height: 16px;
  background: var(--hair);
  margin: 5px 0 0;
}
.wt-step:last-child .wt-line { display: none; }
.wt-body {
  min-width: 0;
  transform: scale(.88);
  transform-origin: top left;
  transition: transform .35s ease;
}
.wt-step.is-active .wt-body { transform: scale(1); }
.wt-step-label {
  font-family: "IBM Plex Mono", monospace;
  font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 6px;
}
.wt-step-title {
  font-size: 16px; font-weight: 600;
  letter-spacing: -.012em; line-height: 1.2;
  color: var(--ink);
  margin: 0 0 10px;
}
.wt-desc {
  font-size: 13.5px; line-height: 1.72;
  color: #4a4640;
  margin: 0;
}

/* ── RESPONSIVE ─────────────────────────────────────────────────────────── */
@media (max-width: 680px) {
  .wt-content { grid-template-columns: 1fr; }
  .wt-slider-col { position: static; margin-bottom: 40px; }
  .slider-wrap { max-width: 220px; margin: 0 auto; }
}
</style>

<div class="wt">

  <header class="wt-header">
    <h2 class="wt-title">How the original footage was transformed</h2>
  </header>

  <div class="wt-tl">
    <svg id="tlSvg"></svg>
  </div>

  <div class="wt-content">

    <aside class="wt-slider-col">
      <p class="slider-eyebrow" id="sliderEyebrow">Before / After</p>
      <div class="slider-wrap" id="sliderWrap">
        <div class="crop-indicator"></div>
        <div id="sliderContent"></div>
        <img class="s-frame" id="phoneFrame" src="/assets/iphone-frame.png" alt="">
        <img class="s-frame" id="phoneCutout" src="/assets/iphone-cutout.svg" alt="">
        <div class="di-pill" id="diPill"></div>
        <div class="pp-replay" id="step12Replay" style="z-index:35;">
          <div class="pp-replay-btn">Replay</div>
        </div>
        <div id="step11Overlay" style="display:none;position:absolute;inset:0;z-index:30;background:#000;">
          <video id="step11Vid" src="/assets/subtitles-after.mp4" playsinline preload="auto" style="width:100%;height:100%;object-fit:cover;display:block;"></video>
          <div class="pp-replay" id="step11Replay">
            <div class="pp-replay-btn">Replay</div>
          </div>
        </div>
      </div>
      <div class="prefix-panel" id="prefixPanel">
        <div class="pp-frame">
          <video id="prefixVid" src="/assets/prefix.mp4" playsinline preload="auto"></video>
          <div class="pp-replay" id="prefixReplay">
            <div class="pp-replay-btn">Replay</div>
          </div>
        </div>
        <div class="pp-plus">+</div>
        <div class="pp-frame">
          <video id="afterFrameVid" src="/assets/silvertone.mp4" muted playsinline preload="auto"></video>
          <div class="pp-black-overlay" id="afterOverlay"></div>
          <div class="pp-frame-di"></div>
          <img class="pp-frame-overlay" src="/assets/iphone-frame.png" alt="">
        </div>
      </div>
      <div class="prefix-panel" id="step6Panel">
        <div class="pp-frame">
          <video id="step6PrefixVid" src="/assets/prefix.mp4" playsinline preload="auto"></video>
        </div>
        <div class="pp-plus">+</div>
        <div class="pp-frame" id="step6AfterFrame">
          <video id="step6AfterVid" src="/assets/silvertone.mp4" muted playsinline preload="auto"></video>
          <div class="pp-black-overlay" id="step6Overlay"></div>
          <div class="pp-frame-di"></div>
          <img class="pp-frame-overlay" src="/assets/iphone-frame.png" alt="">
        </div>
      </div>
      <button class="step6-replay-btn" id="step6ReplayBtn">Replay transition</button>
      <div id="step8bPanel" class="step7-panel">
        <svg id="s8bSvgV" style="display:block;overflow:visible;width:100%;"></svg>
        <svg id="s8bSvgM" style="display:block;overflow:visible;width:100%;"></svg>
        <svg id="s8bSvgO" style="display:block;overflow:visible;width:100%;"></svg>
        <div id="step8bControls" style="display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:20px;">
          <button id="step8bPlayBtn" class="step7-play-btn" style="margin:0;">▶ Play</button>
          <div style="display:flex;flex-direction:column;align-items:flex-start;gap:5px;">
            <div style="font-family:system-ui,-apple-system,sans-serif;font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);opacity:0.6;">Playing tracks</div>
            <div style="display:flex;align-items:center;gap:10px;">
              <label class="s8b-check"><input type="checkbox" data-s8b="vocals" checked> Vocals</label>
              <label class="s8b-check"><input type="checkbox" data-s8b="music" checked> Music</label>
              <label class="s8b-check"><input type="checkbox" data-s8b="orig" checked> Concert</label>
            </div>
          </div>
        </div>
      </div>
      <div id="step8Panel" class="step7-panel">
        <svg id="step8SvgTop" style="display:block;overflow:visible;width:100%;"></svg>
        <p style="font-family:system-ui,-apple-system,sans-serif;font-size:10px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);opacity:0.5;margin:2px 0 0;">Before</p>
        <button id="step8PlayBtn" class="step7-play-btn" style="font-family:system-ui,-apple-system,sans-serif;font-weight:600;letter-spacing:.02em;margin:5px auto 9px;">▶ Play</button>
        <svg id="step8SvgBot" style="display:block;overflow:visible;width:100%;"></svg>
        <p style="font-family:system-ui,-apple-system,sans-serif;font-size:10px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);opacity:0.5;margin:2px 0 0;">Processed</p>
      </div>
      <div id="step7Panel" class="step7-panel">
        <svg id="step7Svg" style="display:block;overflow:visible;width:100%;"></svg>
        <button id="step7PlayBtn" class="step7-play-btn">▶ Play</button>
      </div>
      <p class="slider-hint">Drag to compare</p>
    </aside>

    <ol class="wt-steps" id="wtSteps"></ol>

  </div>

</div>

<script>
(function () {
  const FINAL = 46.9, IN = 14.1, OUT = 37.9;
  const S7_TRIM = 11.6, S7_OVERLAP = 0.5;
  const MUSIC_END = 32.3; // stems-relative duration of music; right handle position
  const P  = { track:'#d6d2c8', hair:'#e6e2d9', source:'#b85c26', spotify:'#4a7c59', credits:'#5a6e82' };
  const MF = '"IBM Plex Mono", ui-monospace, monospace';
  const SF = '"IBM Plex Sans", system-ui, sans-serif';

  const VIDEOS = {
    original:   '/assets/original.mp4',
    silvertone: '/assets/silvertone.mp4',
  };

  const STEPS = [
    { id:1, label:'Step 1 · Color grade', title:'Silvertone filter applied', change:'Silvertone', desc:'Silvertone from the Photos app was applied to give it a cinematic look and obscure the lack of color depth in the footage. Tested with a few LUTs from CapCut for a long time before settling on this one.', lanes:[] },
    { id:2, label:'Step 2 · Crop', title:'Cropped to 9:16 Reel', change:'9:16 crop', desc:'The footage is scaled up 1.21× and cropped to 1080×1920 for Instagram Reels. 111.56px are cut from each side (centred horizontally), 396.65px from the top, and 8px from the bottom.', lanes:[] },
    { id:3, label:'Step 3 · Frame overlay', title:'iPhone frame overlaid', change:'iPhone frame', desc:'A screenshot of the Camera app open — screen covered — was used as the frame. Every background removal tool tried, including Canva, failed to cleanly isolate it. Claude Code was used instead to strip all black pixels, then the threshold was dialled up experimentally until t7 — the darkest 7 shades of black — gave the cleanest result.', lanes:[] },
    { id:4, label:'Step 4 · Dynamic Island', title:'Dynamic Island cutout added', change:'Dynamic Island', desc:'The iPhone frame image includes the Dynamic Island — the pill-shaped cutout at the top of the screen. To make it transparent in the composite, a matching ellipse was punched through the video layer beneath it, so the frame’s existing hole aligns perfectly and the background shows through rather than a solid fill.', lanes:[] },
    { id:5, label:'Step 5 · Prefix clip', title:'Prefix clip merged before the shot', change:'Prefix clip', desc:'The recording opens with a lead-in shot — captured immediately before the main footage. Its last frame is identical to the first frame of the main clip, so the cut is invisible when they’re joined.', lanes:[] },
    { id:6, label:'Step 6 · Transition', title:'Clips joined seamlessly', change:'Transition', desc:'The prefix clip and main shot are merged. The last frame of the prefix is identical to the first frame of the main clip, so the cut is invisible.', lanes:[] },
    { id:7, label:'Step 7 · Trim', title:'Silvertone clip trimmed to 14.1s', change:'Trim', desc:'The silvertone clip is trimmed so it starts at 14.1s — exactly where the Spotify section ends. This makes the transition between the app screen and the real-life footage seamless.', lanes:[] },
    { id:8, label:'Step 8 · Backing track', title:'Spotify track played into audio', change:'Backing track', desc:'The studio version of the song was played through Spotify, then its stems were split using <a href="https://vocalremover.org" target="_blank" rel="noopener" style="color:inherit;opacity:.6;font-size:.9em">vocalremover.org</a> — isolating the instrumental backing track. This is layered underneath the live concert audio in the final edit.', lanes:[] },
    { id:9, label:'Step 9 · Audio restore',  title:'MP3 Music Restoration', change:'Apollo restore', desc:'The concert audio was processed through Apollo (2025) by Neural Analog — an AI-powered MP3 restoration tool that recovers high-frequency detail and removes compression artefacts lost in the original recording. <a href="https://www.neuralanalog.com" target="_blank" rel="noopener" style="color:inherit;opacity:.6;font-size:.9em">neuralanalog.com</a>', lanes:[] },
    { id:10, label:'Step 10 · Subtitles', title:'Karaoke-fill captions added', change:'Subtitles', desc:'Subtitles are added in CapCut using the fill-text animation. The fill sweeps linearly left-to-right, but the number of letters revealed at any moment is proportional to the length of enunciation — longer syllables take more horizontal space, so the fill front tracks the singer\'s voice naturally.', lanes:[] },
    { id:11, label:'Step 11 · Credits', title:'Rolling credits screen', change:'Credits', desc:'After the final frame fades to black, the screen holds for a beat. The credit screen cuts in exactly on the snare hit. Made with Dazzcam.', lanes:[] },
    { id:12, label:'Step 12 · Hook text', title:'Hook text overlay added', change:'Hook text', desc:'A short hook text is added at the top of the reel — the kind Instagram edits use to stop the scroll. It appears immediately and stays just long enough to pull the viewer in before the footage takes over.', lanes:[] },
  ];

  // ── Slider ──────────────────────────────────────────────────────────────
  function buildSlider() {
    const wrap    = document.getElementById('sliderWrap');
    const content = document.getElementById('sliderContent');
    const below = makeLayer(VIDEOS.silvertone, 1, 'sliderBelowVid');
    const above = makeLayer(VIDEOS.original,   2, 'sliderAboveVid');
    setClip(above, 50);

    const div = document.createElement('div');
    div.className = 'split-div';
    div.style.left = '50%';
    div.innerHTML = `<div class="split-knob"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#666" stroke-width="1.4" stroke-linecap="round"><path d="M4 7H1M13 7h-3M4 4L1 7l3 3M10 4l3 3-3 3"/></svg></div>`;

    const labels = document.createElement('div');
    labels.className = 'slider-ba-labels';
    labels.innerHTML = `<span class="ba-lbl">Before</span><span class="ba-lbl">After</span>`;

    content.appendChild(below); content.appendChild(above);
    content.appendChild(div);   content.appendChild(labels);

    const afterWrap = document.createElement('div');
    afterWrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:25;';
    afterWrap.style.clipPath = 'inset(0 0 0 50%)';
    ['phoneFrame', 'diPill'].forEach(id => {
      const el = document.getElementById(id);
      if (el) afterWrap.appendChild(el);
    });
    content.appendChild(afterWrap);

    let dragging = false;
    const move = cx => {
      const rect = wrap.getBoundingClientRect();
      const pct  = Math.max(4, Math.min(96, (cx - rect.left) / rect.width * 100));
      div.style.left = pct + '%';
      setClip(above, pct);
      afterWrap.style.clipPath = `inset(0 0 0 ${pct}%)`;
    };
    div.addEventListener('mousedown',  e => { dragging = true; e.preventDefault(); });
    window.addEventListener('mousemove', e => { if (dragging) move(e.clientX); });
    window.addEventListener('mouseup',   () => { dragging = false; });
    div.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, { passive: false });
    window.addEventListener('touchmove', e => { if (dragging) move(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend',  () => { dragging = false; });
  }

  function setClip(el, pct) { el.style.clipPath = `inset(0 ${100 - pct}% 0 0)`; }

  function makeLayer(src, z, vidId) {
    const div = document.createElement('div');
    div.className = 's-layer'; div.style.zIndex = z;
    const vid = document.createElement('video');
    vid.src = src; vid.muted = true; vid.autoplay = true;
    vid.playsInline = true; vid.loop = true;
    vid.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    if (vidId) vid.id = vidId;
    vid.play().catch(() => {});
    div.appendChild(vid);
    return div;
  }

  // ── Step 8 audio-timeline visualization (before/after Apollo restore) ──
  let s8Before = null, s8After = null, s8Playing = false, s8Active = 'before', s8Raf = null;

  function step8UpdateBtn() {
    const btn = document.getElementById('step8PlayBtn');
    if (!btn) return;
    if (!s8Playing) {
      btn.textContent = '▶ Play';
      ['step8SvgTop','step8SvgBot'].forEach(id => { const el = document.getElementById(id); if (el) el.style.opacity = '1'; });
      return;
    }
    btn.textContent = s8Active === 'before' ? '⇅ Switch to Processed' : '⇅ Switch to Before';
    const svgTop = document.getElementById('step8SvgTop');
    const svgBot = document.getElementById('step8SvgBot');
    if (svgTop) svgTop.style.opacity = s8Active === 'before' ? '1' : '0.25';
    if (svgBot) svgBot.style.opacity = s8Active === 'after'  ? '1' : '0.25';
  }

  function step8Stop() {
    if (s8Before) { s8Before.pause(); }
    if (s8After)  { s8After.pause(); }
    s8Playing = false;
    if (s8Raf) { cancelAnimationFrame(s8Raf); s8Raf = null; }
    step8UpdateBtn();
    ['s8ph0','s8ph1'].forEach(id => { const el = document.getElementById(id); if (el) el.setAttribute('opacity','0'); });
  }

  function step8Switch() {
    if (!s8Playing) return;
    s8Active = s8Active === 'before' ? 'after' : 'before';
    s8Before.muted = s8Active !== 'before';
    s8After.muted  = s8Active !== 'after';
    step8UpdateBtn();
  }

  function step8PlayPause() {
    if (s8Playing) { step8Stop(); return; }
    if (!s8Before) s8Before = new Audio('/assets/silvertone-trimmed.mp3');
    if (!s8After)  s8After  = new Audio('/assets/silvertone-restored.mp3');
    s8Playing = true; s8Active = 'before';
    const t0 = 0;
    s8Before.currentTime = t0; s8Before.muted = false;
    s8After.currentTime  = t0; s8After.muted  = true;
    step8UpdateBtn();

    const done = () => { step8Stop(); };
    s8Before.onended = done;
    s8After.onended  = done;

    s8Before.play().catch(() => step8Stop());
    s8After.play().catch(() => {});

    const PAD = 16;
    function tick() {
      if (!s8Playing) { s8Raf = null; return; }
      const svgT = document.getElementById('step8SvgTop');
      const svgB = document.getElementById('step8SvgBot');
      const ph0  = document.getElementById('s8ph0');
      const ph1  = document.getElementById('s8ph1');
      if (svgT && ph0) {
        const vb = svgT.viewBox.baseVal;
        const W  = vb && vb.width > 0 ? vb.width : (svgT.clientWidth || 240);
        const dur = (s8Before && isFinite(s8Before.duration) && s8Before.duration > 0) ? s8Before.duration : 26;
        const sc  = (W - PAD * 2) / dur;
        const src = s8Active === 'before' ? s8Before : s8After;
        const x   = PAD + src.currentTime * sc;
        if (ph0) { ph0.setAttribute('x1',x); ph0.setAttribute('x2',x); ph0.setAttribute('opacity', s8Active === 'before' ? '1' : '0.3'); }
        if (ph1 && svgB) {
          const vb2 = svgB.viewBox.baseVal;
          const W2  = vb2 && vb2.width > 0 ? vb2.width : (svgB.clientWidth || 240);
          const sc2 = (W2 - PAD * 2) / dur;
          const x2  = PAD + src.currentTime * sc2;
          ph1.setAttribute('x1',x2); ph1.setAttribute('x2',x2); ph1.setAttribute('opacity', s8Active === 'after' ? '1' : '0.3');
        }
      }
      s8Raf = requestAnimationFrame(tick);
    }
    s8Raf = requestAnimationFrame(tick);

    const btn = document.getElementById('step8PlayBtn');
    if (btn) btn.onclick = () => { if (s8Playing) step8Switch(); else step8PlayPause(); };
  }

  function buildStep8Viz() {
    const svgTop = document.getElementById('step8SvgTop');
    const svgBot = document.getElementById('step8SvgBot');
    if (!svgTop || !svgBot) return;
    const W = svgTop.parentElement.clientWidth || 240;
    const PAD = 16, waveW = W - PAD * 2;
    const dur = (s8Before && isFinite(s8Before.duration) && s8Before.duration > 0) ? s8Before.duration : 26;

    const SLATE = '#5a6e82';
    const AMBER = '#b85c26';
    const RULER_H = 18, WAVE_H = 48, totalH = RULER_H + WAVE_H;

    function srand(seed) {
      let s = seed >>> 0;
      return () => { s = (Math.imul(s,1664525)+1013904223)>>>0; return s/0xffffffff; };
    }
    function waveform(svg, seed, color, opac, phId) {
      const o = [], midY = RULER_H + WAVE_H / 2, rand = srand(seed), N = Math.ceil(waveW/2.4);
      const int = dur <= 15 ? 5 : dur <= 30 ? 10 : 15;
      o.push(`<line x1="${PAD}" y1="${RULER_H}" x2="${PAD+waveW}" y2="${RULER_H}" stroke="${color}" stroke-width="0.5" opacity="0.3"/>`);
      for (let t=0; t<=dur+.001; t+=int) {
        const tx = PAD+(t/dur)*waveW;
        o.push(`<line x1="${tx.toFixed(1)}" y1="${RULER_H-5}" x2="${tx.toFixed(1)}" y2="${RULER_H}" stroke="${color}" stroke-width="0.8" opacity="0.4"/>`);
        o.push(`<text x="${tx.toFixed(1)}" y="${RULER_H-7}" text-anchor="middle" font-size="8" font-family=${MF} fill="${color}" opacity="0.55">${t}s</text>`);
      }
      o.push(`<rect x="${PAD}" y="${RULER_H}" width="${waveW}" height="${WAVE_H}" fill="${color}" opacity="0.07" rx="3"/>`);
      for (let i=0;i<N;i++) {
        const t=i/N, bx=PAD+t*waveW;
        const amp = 0.38*Math.sin(t*Math.PI*4.1)+0.22*Math.sin(t*Math.PI*11.3+0.7)
                  + 0.18*Math.sin(t*Math.PI*2.2+1.8)+0.12*(rand()*2-1);
        const bh = Math.max(2,Math.abs(amp)*WAVE_H*0.44);
        o.push(`<rect x="${bx.toFixed(1)}" y="${(midY-bh).toFixed(1)}" width="1.8" height="${(bh*2).toFixed(1)}" fill="${color}" opacity="${opac}" rx=".9"/>`);
      }
      o.push(`<line id="${phId}" x1="${PAD}" y1="${RULER_H-4}" x2="${PAD}" y2="${RULER_H+WAVE_H+4}" stroke="${color}" stroke-width="1.5" opacity="0" stroke-linecap="round"/>`);
      svg.setAttribute('viewBox', `0 0 ${W} ${totalH}`);
      svg.setAttribute('height', totalH);
      svg.innerHTML = o.join('');
    }

    waveform(svgTop, 11, SLATE, 0.55, 's8ph0');
    waveform(svgBot, 88, AMBER, 0.60, 's8ph1');

    const btn = document.getElementById('step8PlayBtn');
    if (btn) btn.onclick = () => { if (s8Playing) step8Switch(); else step8PlayPause(); };
  }

  // ── Step 8b stems visualization (vocals / music / concert) ─────────────
  // Master clock: s8bMusic.currentTime drives all playheads and side-effects.
  // Tracks play only within their handle range; playheads are clamped to handles.
  // Concert audio starts when master clock hits VOCALS_END, seeked to S7_TRIM.
  let s8bVocals = null, s8bMusic = null, s8bOrig = null, s8bOrigCtx = null;
  const S8B_STEMS_START = 8.19; // stems begin at this offset on the shared timeline
  const VOCALS_END = S7_TRIM - S8B_STEMS_START; // 3.41s into stems → vocals stop, concert starts
  let s8bPlaying = false, s8bRaf = null, s8bConcertStarted = false;

  function s8bChecked(key) {
    const el = document.querySelector(`#step8bControls input[data-s8b="${key}"]`);
    return el && el.checked;
  }

  function s8bApplyMutes() {
    if (s8bVocals) s8bVocals.muted = !s8bChecked('vocals');
    if (s8bMusic)  s8bMusic.muted  = !s8bChecked('music');
    if (s8bOrig)   s8bOrig.muted   = !s8bChecked('orig');
  }

  function step8bStop() {
    [s8bVocals, s8bMusic, s8bOrig].forEach(a => { if (a) { a.pause(); a.onended = null; } });
    s8bPlaying = false; s8bConcertStarted = false;
    if (s8bRaf) { cancelAnimationFrame(s8bRaf); s8bRaf = null; }
    const btn = document.getElementById('step8bPlayBtn');
    if (btn) btn.textContent = '▶ Play';
    ['s8bphV','s8bphM','s8bphO'].forEach(id => {
      const el = document.getElementById(id); if (el) el.setAttribute('opacity','0');
    });
  }

  function step8bPlayPause() {
    if (s8bPlaying) { step8bStop(); return; }
    if (!s8bVocals) s8bVocals = new Audio('/assets/stems-vocals.mp3');
    if (!s8bMusic)  s8bMusic  = new Audio('/assets/stems-music.mp3');
    if (!s8bOrig)   s8bOrig   = new Audio('/assets/silvertone.mp3');
    if (!s8bOrigCtx) {
      s8bOrigCtx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = s8bOrigCtx.createGain();
      gain.gain.value = 2;
      s8bOrigCtx.createMediaElementSource(s8bOrig).connect(gain);
      gain.connect(s8bOrigCtx.destination);
    }
    s8bOrigCtx.resume().catch(() => {});

    s8bPlaying = true; s8bConcertStarted = false;
    s8bVocals.currentTime = 0; s8bVocals.muted = !s8bChecked('vocals');
    s8bMusic.currentTime  = 0; s8bMusic.muted  = !s8bChecked('music');
    s8bOrig.muted = !s8bChecked('orig');

    document.querySelectorAll('#step8bControls input[type=checkbox]').forEach(cb => { cb.onchange = s8bApplyMutes; });
    const btn = document.getElementById('step8bPlayBtn');
    if (btn) btn.textContent = '⏸ Pause';
    Promise.all([s8bVocals, s8bMusic].map(a => a.play().catch(() => {})));

    function tick() {
      if (!s8bPlaying) { s8bRaf = null; return; }
      const PAD = 16;
      const stemsDur = s8bMusic && isFinite(s8bMusic.duration) && s8bMusic.duration > 0 ? s8bMusic.duration : 59.77;
      const totalDur = S8B_STEMS_START + stemsDur;
      const mCt = s8bMusic ? s8bMusic.currentTime : 0; // master clock

      // Music: stop at MUSIC_END handle
      if (mCt >= MUSIC_END) { step8bStop(); return; }

      // Vocals: play only within [0, VOCALS_END] on stems timeline
      if (s8bVocals && !s8bVocals.paused && mCt >= VOCALS_END) s8bVocals.pause();

      // Concert: start when master clock reaches VOCALS_END, seek to S7_TRIM in silvertone
      if (!s8bConcertStarted && mCt >= VOCALS_END) {
        s8bConcertStarted = true;
        s8bOrig.currentTime = S7_TRIM;
        s8bOrig.play().catch(() => {});
      }
      // Concert: stop at OUT handle
      if (s8bOrig && !s8bOrig.paused && s8bConcertStarted && s8bOrig.currentTime >= OUT) s8bOrig.pause();

      // Track descriptors: all positions expressed as absolute time on the shared timeline
      const tracks = [
        {
          svgId: 's8bSvgV', phId: 's8bphV', key: 'vocals',
          // playhead travels [S8B_STEMS_START, S7_TRIM]; clamp at trim handle
          pos: S8B_STEMS_START + Math.min(mCt, VOCALS_END),
          visible: true,
        },
        {
          svgId: 's8bSvgM', phId: 's8bphM', key: 'music',
          // playhead travels [S8B_STEMS_START, S8B_STEMS_START + MUSIC_END]; clamp at right handle
          pos: S8B_STEMS_START + Math.min(mCt, MUSIC_END),
          visible: true,
        },
        {
          svgId: 's8bSvgO', phId: 's8bphO', key: 'orig',
          // playhead travels [S7_TRIM, OUT] in silvertone coords (same shared timeline)
          pos: s8bConcertStarted ? Math.min(Math.max(s8bOrig.currentTime, S7_TRIM), OUT) : S7_TRIM,
          visible: s8bConcertStarted,
        },
      ];

      tracks.forEach(({ svgId, phId, key, pos, visible }) => {
        const svg = document.getElementById(svgId);
        const ph  = document.getElementById(phId);
        if (!svg || !ph) return;
        const vb = svg.viewBox.baseVal, W = vb && vb.width > 0 ? vb.width : (svg.clientWidth || 240);
        const x = PAD + pos * (W - PAD * 2) / totalDur;
        ph.setAttribute('x1', x); ph.setAttribute('x2', x);
        ph.setAttribute('opacity', visible && s8bChecked(key) ? '1' : '0.15');
      });

      s8bRaf = requestAnimationFrame(tick);
    }
    s8bRaf = requestAnimationFrame(tick);
  }

  function buildStep8bViz() {
    const stemsDur  = s8bMusic && isFinite(s8bMusic.duration) && s8bMusic.duration > 0 ? s8bMusic.duration : 59.77;
    const silverDur = s8bOrig  && isFinite(s8bOrig.duration)  && s8bOrig.duration  > 0 ? s8bOrig.duration  : 46.5;
    const totalDur  = S8B_STEMS_START + stemsDur;
    const PAD = 16, RULER_H = 18, WAVE_H = 46;

    function srand(seed) {
      let s = seed >>> 0;
      return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0xffffffff; };
    }

    // clipStart/clipEnd = full waveform extent; trimAt = vocals trim; stopAt = early right handle (waveform continues dimmed after)
    function drawRow(svgId, color, seed, label, phId, clipStart, clipEnd, trimAt, stopAt) {
      const svg = document.getElementById(svgId);
      if (!svg) return;
      const W = svg.parentElement.clientWidth || 240;
      const waveW = W - PAD * 2, sc = waveW / totalDur;
      const cx = PAD + clipStart * sc, cw = (clipEnd - clipStart) * sc;
      const midY = RULER_H + WAVE_H / 2;
      const o = [];

      const int = totalDur <= 40 ? 10 : 20;
      o.push(`<line x1="${PAD}" y1="${RULER_H}" x2="${PAD + waveW}" y2="${RULER_H}" stroke="${color}" stroke-width="0.5" opacity="0.25"/>`);
      for (let t = 0; t <= totalDur + 0.001; t += int) {
        const tx = (PAD + (t / totalDur) * waveW).toFixed(1);
        o.push(`<line x1="${tx}" y1="${(RULER_H - 4).toFixed(1)}" x2="${tx}" y2="${RULER_H}" stroke="${color}" stroke-width="0.8" opacity="0.35"/>`);
        o.push(`<text x="${tx}" y="${(RULER_H - 6).toFixed(1)}" text-anchor="middle" font-size="8" font-family=${MF} fill="${color}" opacity="0.5">${t}s</text>`);
      }

      o.push(`<rect x="${cx.toFixed(1)}" y="${RULER_H}" width="${cw.toFixed(1)}" height="${WAVE_H}" fill="${color}" opacity="0.07" rx="3"/>`);
      const rand = srand(seed), N = Math.ceil(cw / 2.4);
      for (let j = 0; j < N; j++) {
        const t = j / N, bx = cx + t * cw;
        const amp = 0.38 * Math.sin(t * Math.PI * 4.1) + 0.22 * Math.sin(t * Math.PI * 11.3 + 0.7)
                  + 0.18 * Math.sin(t * Math.PI * 2.2 + 1.8) + 0.12 * (rand() * 2 - 1);
        const bh = Math.max(2, Math.abs(amp) * WAVE_H * 0.44);
        o.push(`<rect x="${bx.toFixed(1)}" y="${(midY - bh).toFixed(1)}" width="1.8" height="${(bh * 2).toFixed(1)}" fill="${color}" opacity="0.6" rx=".9"/>`);
      }

      if (trimAt !== undefined) {
        // vocals: fade zone then dim to end
        const trimX    = PAD + trimAt * sc;
        const fadeEndX = trimX + S7_OVERLAP * sc;
        o.push(`<rect x="${trimX.toFixed(1)}" y="${RULER_H}" width="${(fadeEndX - trimX).toFixed(1)}" height="${WAVE_H}" fill="white" opacity="0.4"/>`);
        o.push(`<rect x="${fadeEndX.toFixed(1)}" y="${RULER_H}" width="${(cx + cw - fadeEndX).toFixed(1)}" height="${WAVE_H}" fill="white" opacity="0.65"/>`);
        [cx, trimX].forEach(hx => {
          o.push(`<line x1="${hx.toFixed(1)}" y1="${(RULER_H - 6).toFixed(1)}" x2="${hx.toFixed(1)}" y2="${(RULER_H + WAVE_H + 6).toFixed(1)}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`);
        });
      } else if (stopAt !== undefined) {
        // music: handle at stopAt, waveform continues dimmed beyond it
        const stopX = PAD + stopAt * sc;
        o.push(`<rect x="${stopX.toFixed(1)}" y="${RULER_H}" width="${(cx + cw - stopX).toFixed(1)}" height="${WAVE_H}" fill="white" opacity="0.6"/>`);
        [cx, stopX].forEach(hx => {
          o.push(`<line x1="${hx.toFixed(1)}" y1="${(RULER_H - 6).toFixed(1)}" x2="${hx.toFixed(1)}" y2="${(RULER_H + WAVE_H + 6).toFixed(1)}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`);
        });
      } else {
        [cx, cx + cw].forEach(hx => {
          o.push(`<line x1="${hx.toFixed(1)}" y1="${(RULER_H - 6).toFixed(1)}" x2="${hx.toFixed(1)}" y2="${(RULER_H + WAVE_H + 6).toFixed(1)}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`);
        });
      }

      o.push(`<text x="${(cx + cw + 8).toFixed(1)}" y="${(midY + 4).toFixed(1)}" text-anchor="start" font-size="9" font-weight="600" font-family=${MF} fill="${color}" opacity="0.7" letter-spacing=".06em">${label}</text>`);
      o.push(`<line id="${phId}" x1="${cx.toFixed(1)}" y1="${(RULER_H - 4).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${(RULER_H + WAVE_H + 4).toFixed(1)}" stroke="${color}" stroke-width="1.5" opacity="0" stroke-linecap="round"/>`);
      svg.setAttribute('viewBox', `0 0 ${W} ${RULER_H + WAVE_H}`);
      svg.setAttribute('height', RULER_H + WAVE_H);
      svg.innerHTML = o.join('');
    }

    function drawConcertRow() {
      const color = '#5a6e82', svg = document.getElementById('s8bSvgO');
      if (!svg) return;
      const W = svg.parentElement.clientWidth || 240;
      const waveW = W - PAD * 2, sc = waveW / totalDur;
      const cx = PAD, cw = silverDur * sc;
      const trimX = PAD + S7_TRIM * sc, outX = PAD + OUT * sc;
      const midY  = RULER_H + WAVE_H / 2;
      const o = [];

      const int = totalDur <= 40 ? 10 : 20;
      o.push(`<line x1="${PAD}" y1="${RULER_H}" x2="${PAD + waveW}" y2="${RULER_H}" stroke="${color}" stroke-width="0.5" opacity="0.25"/>`);
      for (let t = 0; t <= totalDur + 0.001; t += int) {
        const tx = (PAD + (t / totalDur) * waveW).toFixed(1);
        o.push(`<line x1="${tx}" y1="${(RULER_H - 4).toFixed(1)}" x2="${tx}" y2="${RULER_H}" stroke="${color}" stroke-width="0.8" opacity="0.35"/>`);
        o.push(`<text x="${tx}" y="${(RULER_H - 6).toFixed(1)}" text-anchor="middle" font-size="8" font-family=${MF} fill="${color}" opacity="0.5">${t}s</text>`);
      }

      o.push(`<rect x="${cx.toFixed(1)}" y="${RULER_H}" width="${cw.toFixed(1)}" height="${WAVE_H}" fill="${color}" opacity="0.07" rx="3"/>`);
      o.push(`<rect x="${trimX.toFixed(1)}" y="${(RULER_H - 3).toFixed(1)}" width="${(outX - trimX).toFixed(1)}" height="${WAVE_H + 6}" fill="${color}" opacity="0.13" rx="2"/>`);
      const rand = srand(11), N = Math.ceil(cw / 2.4);
      for (let j = 0; j < N; j++) {
        const t = j / N, bx = cx + t * cw;
        const amp = 0.38 * Math.sin(t * Math.PI * 4.1) + 0.22 * Math.sin(t * Math.PI * 11.3 + 0.7)
                  + 0.18 * Math.sin(t * Math.PI * 2.2 + 1.8) + 0.12 * (rand() * 2 - 1);
        const bh = Math.max(2, Math.abs(amp) * WAVE_H * 0.44);
        o.push(`<rect x="${bx.toFixed(1)}" y="${(midY - bh).toFixed(1)}" width="1.8" height="${(bh * 2).toFixed(1)}" fill="${color}" opacity="0.6" rx=".9"/>`);
      }
      o.push(`<rect x="${PAD}" y="${RULER_H}" width="${(S7_TRIM * sc).toFixed(1)}" height="${WAVE_H}" fill="white" opacity="0.5"/>`);
      o.push(`<rect x="${outX.toFixed(1)}" y="${RULER_H}" width="${((silverDur - OUT) * sc).toFixed(1)}" height="${WAVE_H}" fill="white" opacity="0.5"/>`);
      [trimX, outX].forEach(hx => {
        o.push(`<line x1="${hx.toFixed(1)}" y1="${(RULER_H - 6).toFixed(1)}" x2="${hx.toFixed(1)}" y2="${(RULER_H + WAVE_H + 6).toFixed(1)}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`);
      });
      o.push(`<text x="${(PAD + silverDur * sc + 8).toFixed(1)}" y="${(midY + 4).toFixed(1)}" text-anchor="start" font-size="9" font-weight="600" font-family=${MF} fill="${color}" opacity="0.7" letter-spacing=".06em">CONCERT</text>`);
      o.push(`<line id="s8bphO" x1="${cx.toFixed(1)}" y1="${(RULER_H - 4).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${(RULER_H + WAVE_H + 4).toFixed(1)}" stroke="${color}" stroke-width="1.5" opacity="0" stroke-linecap="round"/>`);
      svg.setAttribute('viewBox', `0 0 ${W} ${RULER_H + WAVE_H}`);
      svg.setAttribute('height', RULER_H + WAVE_H);
      svg.innerHTML = o.join('');
    }

    drawRow('s8bSvgV', '#3aaa68', 37, 'VOCALS', 's8bphV', S8B_STEMS_START, S8B_STEMS_START + stemsDur, S7_TRIM);
    drawRow('s8bSvgM', '#b85c26', 73, 'MUSIC',  's8bphM', S8B_STEMS_START, S8B_STEMS_START + stemsDur, undefined, S8B_STEMS_START + MUSIC_END);
    drawConcertRow();

    const btn = document.getElementById('step8bPlayBtn');
    if (btn) btn.onclick = step8bPlayPause;
    document.querySelectorAll('#step8bControls input[type=checkbox]').forEach(cb => { cb.onchange = s8bApplyMutes; });
  }

  // ── Step 7 audio-timeline visualization ────────────────────────────────
  let s7Audio1 = null, s7Audio2 = null, s7Playing = false, s7Phase = 0, s7Raf = null, s7XfadeStarted = false;

  function step7Stop() {
    [s7Audio1, s7Audio2].forEach(a => { if (a) { a.pause(); a.onended = null; a.volume = 1; } });
    s7Playing = false; s7Phase = 0; s7XfadeStarted = false;
    if (s7Raf) { cancelAnimationFrame(s7Raf); s7Raf = null; }
    const btn = document.getElementById('step7PlayBtn');
    if (btn) btn.textContent = '▶ Play';
    ['s7ph1','s7ph2'].forEach(id => { const el = document.getElementById(id); if (el) el.setAttribute('opacity','0'); });
  }

  function step7PlayPause() {
    if (s7Playing) { step7Stop(); return; }
    if (!s7Audio1) s7Audio1 = new Audio('/assets/prefix.mp4');
    if (!s7Audio2) s7Audio2 = new Audio('/assets/silvertone.mp4');
    s7Playing = true; s7Phase = 0; s7XfadeStarted = false;
    s7Audio1.currentTime = 0; s7Audio1.volume = 1;
    const btn = document.getElementById('step7PlayBtn');
    if (btn) btn.textContent = '⏸ Pause';

    s7Audio1.onended = () => {
      if (!s7Playing) return;
      s7Phase = 1; s7Audio1.volume = 1; s7Audio2.volume = 1;
      if (s7Audio2.paused) { s7Audio2.currentTime = S7_TRIM; s7Audio2.play().catch(() => {}); }
    };
    s7Audio2.onended = () => { step7Stop(); };
    s7Audio1.play().catch(() => step7Stop());

    function tick() {
      if (!s7Playing) { s7Raf = null; return; }
      const svg = document.getElementById('step7Svg');
      const ph1 = document.getElementById('s7ph1');
      const ph2 = document.getElementById('s7ph2');
      if (svg && ph1 && ph2) {
        const vb = svg.viewBox.baseVal;
        const W = vb && vb.width > 0 ? vb.width : (svg.clientWidth || 240);
        const PAD = 16;
        const silverDur = s7Audio2 && isFinite(s7Audio2.duration) && s7Audio2.duration > 0 ? s7Audio2.duration : 46.5;
        const prefDur   = s7Audio1 && isFinite(s7Audio1.duration) && s7Audio1.duration > 0 ? s7Audio1.duration : 3.4;
        const sc = (W - PAD * 2) / silverDur;
        const prefOffset = S7_TRIM - prefDur;

        if (s7Phase === 0) {
          const ct = s7Audio1.currentTime, dur = s7Audio1.duration;
          if (isFinite(dur) && !s7XfadeStarted && ct >= dur - S7_OVERLAP) {
            s7XfadeStarted = true;
            s7Audio2.volume = 0; s7Audio2.currentTime = S7_TRIM;
            s7Audio2.play().catch(() => {});
          }
          if (s7XfadeStarted && isFinite(dur)) {
            const prog = Math.max(0, Math.min(1, (ct - (dur - S7_OVERLAP)) / S7_OVERLAP));
            s7Audio1.volume = 1 - prog; s7Audio2.volume = prog;
          }
          const x1 = PAD + (prefOffset + ct) * sc;
          ph1.setAttribute('x1', x1); ph1.setAttribute('x2', x1);
          ph1.setAttribute('opacity', s7XfadeStarted ? String(s7Audio1.volume) : '1');
          if (s7XfadeStarted) {
            const x2 = PAD + s7Audio2.currentTime * sc;
            ph2.setAttribute('x1', x2); ph2.setAttribute('x2', x2);
            ph2.setAttribute('opacity', String(s7Audio2.volume));
          } else {
            ph2.setAttribute('opacity', '0');
          }
        } else {
          if (!s7Audio2.paused && s7Audio2.currentTime >= OUT) { s7Audio2.pause(); step7Stop(); }
          const x = PAD + Math.min(s7Audio2.currentTime, OUT) * sc;
          ph1.setAttribute('opacity', '0');
          ph2.setAttribute('x1', x); ph2.setAttribute('x2', x); ph2.setAttribute('opacity', '1');
        }
      }
      s7Raf = requestAnimationFrame(tick);
    }
    s7Raf = requestAnimationFrame(tick);
  }

  function buildStep7Viz() {
    const svg = document.getElementById('step7Svg');
    if (!svg) return;
    const W = svg.parentElement.clientWidth || 240;
    const PAD = 16, RULER_H = 18, WAVE_H = 50, GAP = 10;
    const totalH = (RULER_H + WAVE_H) * 2 + GAP + 18;

    const silverDur  = s7Audio2 && isFinite(s7Audio2.duration) && s7Audio2.duration > 0 ? s7Audio2.duration : 46.5;
    const prefDur    = s7Audio1 && isFinite(s7Audio1.duration) && s7Audio1.duration > 0 ? s7Audio1.duration : 3.4;
    const prefOffset = S7_TRIM - prefDur;
    const waveW = W - PAD * 2;
    const sc = waveW / silverDur;

    const GREEN = '#3aaa68', BROWN = '#9c7b65';
    const o = [];

    function srand(seed) {
      let s = seed >>> 0;
      return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0xffffffff; };
    }

    function drawRuler(y, color) {
      const int = silverDur <= 30 ? 10 : 15;
      o.push(`<line x1="${PAD}" y1="${y + RULER_H}" x2="${PAD + waveW}" y2="${y + RULER_H}" stroke="${color}" stroke-width="0.5" opacity="0.25"/>`);
      for (let t = 0; t <= silverDur + 0.001; t += int) {
        const tx = (PAD + (t / silverDur) * waveW).toFixed(1);
        o.push(`<line x1="${tx}" y1="${(y + RULER_H - 4).toFixed(1)}" x2="${tx}" y2="${(y + RULER_H).toFixed(1)}" stroke="${color}" stroke-width="0.8" opacity="0.35"/>`);
        o.push(`<text x="${tx}" y="${(y + RULER_H - 6).toFixed(1)}" text-anchor="middle" font-size="8" font-family=${MF} fill="${color}" opacity="0.5">${t}s</text>`);
      }
    }

    function drawWave(cx, y, cw, seed, color, opac) {
      const rand = srand(seed), N = Math.ceil(cw / 2.4), midY = y + RULER_H + WAVE_H / 2;
      for (let i = 0; i < N; i++) {
        const t = i / N, bx = cx + t * cw;
        const amp = 0.38 * Math.sin(t * Math.PI * 4.1) + 0.22 * Math.sin(t * Math.PI * 11.3 + 0.7)
                  + 0.18 * Math.sin(t * Math.PI * 2.2 + 1.8) + 0.12 * (rand() * 2 - 1);
        const bh = Math.max(2, Math.abs(amp) * WAVE_H * 0.44);
        o.push(`<rect x="${bx.toFixed(1)}" y="${(midY - bh).toFixed(1)}" width="1.8" height="${(bh * 2).toFixed(1)}" fill="${color}" opacity="${opac}" rx=".9"/>`);
      }
    }

    function drawHandles(x1, x2, y, color) {
      [x1, x2].forEach(hx => {
        o.push(`<line x1="${hx.toFixed(1)}" y1="${(y + RULER_H - 6).toFixed(1)}" x2="${hx.toFixed(1)}" y2="${(y + RULER_H + WAVE_H + 6).toFixed(1)}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`);
      });
    }

    // ── Row 1: Prefix clip (green) — positioned on shared 0→silverDur scale ──
    const pX = PAD + prefOffset * sc, pW = prefDur * sc;
    drawRuler(0, GREEN);
    o.push(`<rect x="${pX.toFixed(1)}" y="${RULER_H}" width="${pW.toFixed(1)}" height="${WAVE_H}" fill="${GREEN}" opacity="0.09" rx="3"/>`);
    drawWave(pX, 0, pW, 42, GREEN, 0.72);
    drawHandles(pX, pX + pW, 0, GREEN);
    { const lx = (pX + pW + 8).toFixed(1), ly = (RULER_H + WAVE_H / 2 + 4).toFixed(1);
      o.push(`<text text-anchor="start" font-size="10" font-weight="600" font-family=${SF} fill="${GREEN}" opacity="0.85"><tspan x="${lx}" y="${ly}">beetei thei</tspan><tspan x="${lx}" dy="13">jo woh</tspan><tspan x="${lx}" dy="13">guzrei zamaanei</tspan></text>`); }
    o.push(`<line id="s7ph1" x1="${pX.toFixed(1)}" y1="${(RULER_H - 4).toFixed(1)}" x2="${pX.toFixed(1)}" y2="${(RULER_H + WAVE_H + 4).toFixed(1)}" stroke="${GREEN}" stroke-width="1.5" opacity="0" stroke-linecap="round"/>`);

    // ── Row 2: Silvertone clip (brown) — full duration on same shared scale ──
    const r2Y = RULER_H + WAVE_H + GAP;
    const trimX  = PAD + S7_TRIM * sc;
    const crossX = trimX - S7_OVERLAP * sc;
    const outX   = PAD + OUT * sc;
    drawRuler(r2Y, BROWN);
    o.push(`<rect x="${PAD}" y="${r2Y + RULER_H}" width="${waveW}" height="${WAVE_H}" fill="${BROWN}" opacity="0.07" rx="3"/>`);
    o.push(`<rect x="${crossX.toFixed(1)}" y="${(r2Y + RULER_H - 3).toFixed(1)}" width="${(outX - crossX).toFixed(1)}" height="${WAVE_H + 6}" fill="${BROWN}" opacity="0.13" rx="2"/>`);
    drawWave(PAD, r2Y, waveW, 73, BROWN, 0.6);
    o.push(`<rect x="${PAD}" y="${(r2Y + RULER_H).toFixed(1)}" width="${(S7_TRIM * sc).toFixed(1)}" height="${WAVE_H}" fill="white" opacity="0.5"/>`);
    drawHandles(crossX, outX, r2Y, BROWN);
    o.push(`<text x="${((crossX + outX) / 2).toFixed(1)}" y="${(r2Y + RULER_H + WAVE_H + 16).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="600" font-family=${SF} fill="${BROWN}" opacity="0.85">yeh meiri hei kahani...</text>`);
    o.push(`<line id="s7ph2" x1="${crossX.toFixed(1)}" y1="${(r2Y + RULER_H - 4).toFixed(1)}" x2="${crossX.toFixed(1)}" y2="${(r2Y + RULER_H + WAVE_H + 4).toFixed(1)}" stroke="${BROWN}" stroke-width="1.5" opacity="0" stroke-linecap="round"/>`);

    svg.setAttribute('viewBox', `0 0 ${W} ${totalH}`);
    svg.setAttribute('height', totalH);
    svg.innerHTML = o.join('');

    const btn = document.getElementById('step7PlayBtn');
    if (btn) btn.onclick = step7PlayPause;
  }

  // ── Timeline ────────────────────────────────────────────────────────────
  const SEGMENTS = [
    { label:'Spotify & app transition', start:0,    end:IN,    color:P.spotify  },
    { label:'Original source',          start:IN,   end:OUT,   color:P.source   },
    { label:'Rolling credits',          start:OUT,  end:FINAL, color:P.credits  },
  ];

  function r(n) { return Math.round(n * 10) / 10; }

  function renderTimeline() {
    const svg = document.getElementById('tlSvg');
    const W   = svg.parentElement.clientWidth;
    if (W < 60) return;
    const lanes = STEPS.filter(s => !s.pending).flatMap(s => s.lanes);
    const L=0, R=0, T=0, RULER_H=16, BASE_H=40, LANE_H=24, GAP=4, B=0;
    const usableW = W - L - R, sc = usableW / FINAL;
    const xv = t => L + t * sc;
    const laneBlock = lanes.length ? GAP + lanes.length * (LANE_H + GAP) : 0;
    const H = T + RULER_H + 8 + BASE_H + laneBlock + B;
    const o = [], ry = T + RULER_H;

    o.push(`<line x1="${L}" y1="${ry}" x2="${L+usableW}" y2="${ry}" stroke="${P.hair}" stroke-width="1"/>`);
    for (let t = 0; t <= FINAL + .001; t += 10) {
      const tx = xv(Math.min(t, FINAL));
      o.push(`<line x1="${r(tx)}" y1="${ry-5}" x2="${r(tx)}" y2="${ry}" stroke="#c8c4bb" stroke-width="1"/>`);
      o.push(`<text x="${r(tx)}" y="${ry-8}" text-anchor="middle" font-size="9" font-family=${MF} fill="#c0bbb2">${Math.round(t)}s</text>`);
    }

    const by = ry + 8;
    SEGMENTS.forEach(seg => {
      const sx = xv(seg.start), sw = xv(seg.end) - xv(seg.start);
      o.push(`<rect x="${r(sx)}" y="${by}" width="${r(sw)}" height="${BASE_H}" fill="${seg.color}" rx="3"/>`);
      if (sw > 80) {
        o.push(`<text x="${r(sx+sw/2)}" y="${by+BASE_H/2-3}"  text-anchor="middle" font-size="9.5" font-weight="600" font-family=${SF} fill="white" letter-spacing=".01em">${seg.label}</text>`);
        o.push(`<text x="${r(sx+sw/2)}" y="${by+BASE_H/2+9}" text-anchor="middle" font-size="8"  font-family=${MF} fill="rgba(255,255,255,.55)" letter-spacing=".1em">${seg.start}s — ${seg.end}s</text>`);
      }
    });

    lanes.forEach((lane, i) => {
      const ly = by + BASE_H + GAP + i * (LANE_H + GAP);
      const lx = xv(lane.start), lw = xv(lane.end) - xv(lane.start);
      o.push(`<rect x="${L}" y="${ly}" width="${usableW}" height="${LANE_H}" fill="${P.track}" fill-opacity=".5" rx="3"/>`);
      o.push(`<rect x="${r(lx)}" y="${ly}" width="${r(lw)}" height="${LANE_H}" fill="${lane.color}" rx="3"/>`);
      if (lw > 50) o.push(`<text x="${r(lx+lw/2)}" y="${ly+LANE_H/2+4}" text-anchor="middle" font-size="9.5" font-family=${MF} fill="rgba(255,255,255,.9)" letter-spacing=".05em">${lane.label}</text>`);
    });

    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('height', H);
    svg.innerHTML = o.join('\n');
  }

  // ── Steps ───────────────────────────────────────────────────────────────
  function buildSteps() {
    const list = document.getElementById('wtSteps');
    STEPS.forEach((step, i) => {
      const li = document.createElement('li');
      li.className = 'wt-step' + (step.pending ? ' is-pending' : '');
      li.dataset.stepId = step.id;
      li.innerHTML = `<div class="wt-gutter"><div class="wt-dot">${step.id}</div><div class="wt-line"></div></div><div class="wt-body"><p class="wt-step-label">${step.label}</p><h3 class="wt-step-title">${step.title}</h3><p class="wt-desc">${step.desc}</p></div>`;
      list.appendChild(li);
    });
  }

  buildSteps();
  buildSlider();
  renderTimeline();
  window.addEventListener('resize', () => { renderTimeline(); if (step7Panel.classList.contains('is-visible')) buildStep7Viz(); if (step8bPanel.classList.contains('is-visible')) buildStep8bViz(); if (step8Panel.classList.contains('is-visible')) buildStep8Viz(); });

  // ── Step hooks ───────────────────────────────────────────────────────────
  // Add enter/exit callbacks keyed by step id.
  const frame      = document.getElementById('phoneFrame');
  const cutout     = document.getElementById('phoneCutout');
  const diPill     = document.getElementById('diPill');
  const sliderWrap = document.getElementById('sliderWrap');
  const prefixPanel   = document.getElementById('prefixPanel');
  const prefixVid     = document.getElementById('prefixVid');
  const prefixReplay  = document.getElementById('prefixReplay');
  const afterFrameVid = document.getElementById('afterFrameVid');
  const afterOverlay    = document.getElementById('afterOverlay');
  const step6Panel      = document.getElementById('step6Panel');
  const step6PrefixVid  = document.getElementById('step6PrefixVid');
  const step6AfterFrame = document.getElementById('step6AfterFrame');
  const step6AfterVid   = document.getElementById('step6AfterVid');
  const step6Overlay    = document.getElementById('step6Overlay');
  const step6ReplayBtn  = document.getElementById('step6ReplayBtn');
  const step7Panel      = document.getElementById('step7Panel');
  const step8bPanel     = document.getElementById('step8bPanel');
  const step8Panel      = document.getElementById('step8Panel');
  const sliderHint    = document.querySelector('.slider-hint');

  afterFrameVid.addEventListener('loadedmetadata', () => { afterFrameVid.currentTime = 0; });
  step6AfterVid.addEventListener('loadedmetadata', () => { step6AfterVid.currentTime = 0; });

  prefixVid.addEventListener('play',  () => { prefixReplay.classList.remove('is-visible'); });
  prefixVid.addEventListener('ended', () => { prefixReplay.classList.add('is-visible'); });
  prefixReplay.addEventListener('click', () => {
    prefixVid.currentTime = 0;
    prefixVid.play().catch(() => { prefixReplay.classList.add('is-visible'); });
  });

  step6PrefixVid.addEventListener('play',  () => { step6ReplayBtn.classList.remove('is-visible'); });
  step6PrefixVid.addEventListener('ended', () => {
    step6Overlay.classList.add('is-gone');
    step6ReplayBtn.classList.add('is-visible');
  });
  step6ReplayBtn.addEventListener('click', () => {
    step6Overlay.classList.remove('is-gone');
    step6AfterVid.currentTime = 0;
    step6PrefixVid.currentTime = 0;
    step6PrefixVid.play().catch(() => { step6ReplayBtn.classList.add('is-visible'); });
  });

  // persistent: true  → effect stays from this step onward (cumulative)
  // persistent: false → effect only shows at exactly this step
  const STEP_HOOKS = {
    2: {
      enter: () => sliderWrap.classList.add('show-crop'),
      exit:  () => sliderWrap.classList.remove('show-crop'),
      persistent: false,
    },
    3: {
      enter: () => frame.classList.add('is-visible'),
      exit:  () => frame.classList.remove('is-visible'),
      persistent: true,
    },
    4: {
      enter: () => diPill.classList.add('is-visible'),
      exit:  () => diPill.classList.remove('is-visible'),
      persistent: true,
    },
    5: {
      enter: () => {
        prefixPanel.classList.add('is-visible');
        afterFrameVid.currentTime = 0;
        afterOverlay.classList.add('is-gone');
        prefixVid.currentTime = 0;
        prefixVid.play().catch(() => { prefixReplay.classList.add('is-visible'); });
      },
      exit: () => {
        prefixPanel.classList.remove('is-visible');
        afterOverlay.classList.remove('is-gone');
        prefixVid.pause();
        prefixVid.currentTime = 0;
      },
      persistent: false,
    },
    6: {
      enter: () => {
        step6Panel.classList.add('is-visible');
        step6Overlay.classList.remove('is-gone');
        step6AfterVid.currentTime = 0;
        step6PrefixVid.currentTime = 0;
        step6PrefixVid.play().catch(() => { step6ReplayBtn.classList.add('is-visible'); });
      },
      exit: () => {
        step6Panel.classList.remove('is-visible');
        step6Overlay.classList.remove('is-gone');
        step6ReplayBtn.classList.remove('is-visible');
        step6PrefixVid.pause();
        step6PrefixVid.currentTime = 0;
      },
      persistent: false,
    },
    7: {
      enter: () => {
        step7Panel.classList.add('is-visible');
        const redraw = () => { if (step7Panel.classList.contains('is-visible')) buildStep7Viz(); };
        if (!s7Audio1) { s7Audio1 = new Audio('/assets/prefix.mp4'); s7Audio1.addEventListener('loadedmetadata', redraw, { once: true }); }
        if (!s7Audio2) { s7Audio2 = new Audio('/assets/silvertone.mp4'); s7Audio2.addEventListener('loadedmetadata', redraw, { once: true }); }
        buildStep7Viz();
      },
      exit:  () => { step7Panel.classList.remove('is-visible'); step7Stop(); },
      persistent: false,
    },
    8: {
      enter: () => {
        step8bPanel.classList.add('is-visible');
        const redraw = () => { if (step8bPanel.classList.contains('is-visible')) buildStep8bViz(); };
        if (!s8bVocals) { s8bVocals = new Audio('/assets/stems-vocals.mp3'); s8bVocals.addEventListener('loadedmetadata', redraw, { once: true }); }
        if (!s8bMusic)  { s8bMusic  = new Audio('/assets/stems-music.mp3');  s8bMusic.addEventListener('loadedmetadata',  redraw, { once: true }); }
        if (!s8bOrig)   { s8bOrig   = new Audio('/assets/silvertone.mp3');   s8bOrig.addEventListener('loadedmetadata',   redraw, { once: true }); }
        buildStep8bViz();
      },
      exit: () => { step8bPanel.classList.remove('is-visible'); step8bStop(); },
      persistent: false,
    },
    9: {
      enter: () => {
        step8Panel.classList.add('is-visible');
        const redraw = () => { if (step8Panel.classList.contains('is-visible')) buildStep8Viz(); };
        if (!s8Before) { s8Before = new Audio('/assets/silvertone-trimmed.mp3'); s8Before.addEventListener('loadedmetadata', redraw, { once: true }); }
        if (!s8After)  { s8After  = new Audio('/assets/silvertone-restored.mp3'); s8After.addEventListener('loadedmetadata', redraw, { once: true }); }
        buildStep8Viz();
      },
      exit: () => { step8Panel.classList.remove('is-visible'); step8Stop(); },
      persistent: false,
    },
    10: {
      enter: () => {
        const bVid = document.getElementById('sliderBelowVid');
        const aVid = document.getElementById('sliderAboveVid');
        if (bVid) { bVid.src = '/assets/subtitles-before.mp4'; bVid.play().catch(() => {}); }
        if (aVid) { aVid.src = '/assets/subtitles-after.mp4';  aVid.play().catch(() => {}); }
        frame.classList.remove('is-visible');
        diPill.classList.remove('is-visible');
      },
      exit: () => {
        const bVid = document.getElementById('sliderBelowVid');
        const aVid = document.getElementById('sliderAboveVid');
        if (bVid) { bVid.src = VIDEOS.silvertone; bVid.play().catch(() => {}); }
        if (aVid) { aVid.src = VIDEOS.original;   aVid.play().catch(() => {}); }
        frame.classList.add('is-visible');
        diPill.classList.add('is-visible');
      },
      persistent: false,
    },
    11: {
      enter: () => {
        const overlay = document.getElementById('step11Overlay');
        const vid     = document.getElementById('step11Vid');
        const replay  = document.getElementById('step11Replay');
        if (overlay) overlay.style.display = 'block';
        if (replay)  replay.classList.remove('is-visible');
        frame.classList.remove('is-visible');
        diPill.classList.remove('is-visible');
        const s11Play = () => {
          replay && replay.classList.remove('is-visible');
          vid.currentTime = 28;
          vid.play().catch(() => replay && replay.classList.add('is-visible'));
        };
        if (vid) {
          vid.loop = false; vid.muted = false;
          vid.onended = () => replay && replay.classList.add('is-visible');
          s11Play();
        }
        if (replay) replay.onclick = s11Play;
      },
      exit: () => {
        const overlay = document.getElementById('step11Overlay');
        const vid     = document.getElementById('step11Vid');
        const replay  = document.getElementById('step11Replay');
        if (overlay) overlay.style.display = 'none';
        if (replay)  replay.classList.remove('is-visible');
        if (vid) { vid.pause(); vid.onended = null; vid.muted = true; vid.currentTime = 28; }
        frame.classList.add('is-visible');
        diPill.classList.add('is-visible');
      },
      persistent: false,
    },
    12: {
      enter: () => {
        const bVid  = document.getElementById('sliderBelowVid');
        const aVid  = document.getElementById('sliderAboveVid');
        const replay = document.getElementById('step12Replay');
        const s12Play = () => {
          replay && replay.classList.remove('is-visible');
          if (bVid) { bVid.currentTime = 0; bVid.play().catch(() => replay && replay.classList.add('is-visible')); }
          if (aVid) { aVid.currentTime = 0; aVid.play().catch(() => {}); }
        };
        if (bVid) { bVid.src = '/assets/hook-before.mp4'; bVid.onended = () => replay && replay.classList.add('is-visible'); }
        if (aVid) { aVid.src = '/assets/hook-after.mp4';  aVid.onended = null; }
        if (replay) replay.onclick = s12Play;
        frame.classList.remove('is-visible');
        diPill.classList.remove('is-visible');
        s12Play();
      },
      exit: () => {
        const bVid  = document.getElementById('sliderBelowVid');
        const aVid  = document.getElementById('sliderAboveVid');
        const replay = document.getElementById('step12Replay');
        if (replay) replay.classList.remove('is-visible');
        if (bVid) { bVid.onended = null; bVid.src = VIDEOS.silvertone; bVid.play().catch(() => {}); }
        if (aVid) { aVid.src = VIDEOS.original; aVid.play().catch(() => {}); }
        frame.classList.add('is-visible');
        diPill.classList.add('is-visible');
      },
      persistent: false,
    },
  };

  const hookedIds = Object.keys(STEP_HOOKS).map(Number).sort((a, b) => a - b);

  const stepEls = Array.from(document.querySelectorAll('[data-step-id]'));
  const stepChange = Object.fromEntries(STEPS.filter(s => s.change).map(s => [s.id, s.change]));
  const eyebrow = document.getElementById('sliderEyebrow');
  let activeEl = null;

  function updateActiveStep() {
    const viewH = window.innerHeight;
    const center = viewH / 2;
    let bestEl = null, bestDist = Infinity;

    stepEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > viewH) return;
      const dist = Math.abs((rect.top + rect.bottom) / 2 - center);
      if (dist < bestDist) { bestDist = dist; bestEl = el; }
    });

    if (bestEl === activeEl) return;

    if (activeEl) activeEl.classList.remove('is-active');
    activeEl = bestEl;
    if (activeEl) {
      activeEl.classList.add('is-active');
      const change = stepChange[activeEl.dataset.stepId];
      if (eyebrow) eyebrow.textContent = change ? `${change} · Before / After` : 'Before / After';
    }

    // Apply hooks: persistent ones accumulate from their step onward;
    // non-persistent ones fire only at exactly their step.
    const activeId = activeEl ? Number(activeEl.dataset.stepId) : -Infinity;
    hookedIds.forEach(id => {
      const hooks = STEP_HOOKS[id];
      const on = hooks.persistent ? id <= activeId : id === activeId;
      if (on) hooks.enter?.();
      else    hooks.exit?.();
    });

    const anyPanel = prefixPanel.classList.contains('is-visible') || step6Panel.classList.contains('is-visible') || step7Panel.classList.contains('is-visible') || step8bPanel.classList.contains('is-visible') || step8Panel.classList.contains('is-visible');
    sliderWrap.style.display = anyPanel ? 'none' : '';
    sliderHint.classList.toggle('is-hidden', anyPanel);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { updateActiveStep(); ticking = false; }); ticking = true; }
  }, { passive: true });
  updateActiveStep();
})();
</script>

Twelve steps. Some manual, some fiddly, a few satisfying.

The honest observation looking back: several of these steps are ripe for automation. The crop math is deterministic. The frame and Dynamic Island overlay are always the same. The trim points follow from the audio. These aren't creative decisions — they're mechanical ones, and mechanical ones can be scripted.

The bigger ambition is music. Right now the backing track is sourced manually — played through Spotify, stems split by hand, levels set by ear. The goal is to have this happen automatically: given a video, detect the mood or genre, find a matching track, separate the stems, and layer them in at calibrated levels. That's the edit that writes itself.

For now, twelve steps, done by hand, once.
