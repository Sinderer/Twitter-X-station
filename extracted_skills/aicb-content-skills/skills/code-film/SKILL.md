---
name: code-film
description: Builds a short film as a web page (React for the overlay text, WebGL2 or canvas 2D for the picture, the frame a pure function of time), plays it live in the browser through a preview shell (scrubber, beats, knobs, timed notes), then shoots it frame by frame with Playwright + ffmpeg into an mp4 with a score synthesised from the film's own events. Produces a 16:9 or 4:3 master, a native 9:16 cut and a cover. Use when the user asks for a "terminal video", a visualization of a system or market running on real data, a code-drawn film shot from a browser, or a video presentation of a website or app shot from its live screens ("make a video of my site", "film this dashboard", "a terminal of my agents"). The genre guides are references/terminal.md and references/site_film.md.
---
# A film as a web page — engine, preview, shooting

The instrument behind the films that are drawn by
code and shot frame by frame: a page built with React and WebGL2, played live in
the browser while the user watches, then captured with Playwright into an mp4.
It is never deployed; the page IS the film. The `terminal` and `site_film` genres
are the films made this way (`references/terminal.md`,
`references/site_film.md`); a guide says what the film is about, this skill says how the page is built, shown,
shot and delivered. (`code-animation` is a different engine and keeps its own
skill; the shoot can also run on a rented GPU box (e.g. Vast.ai) over SSH, same script unchanged.)

What the instrument guarantees, when used as written here: the frame is a pure
function of time, so the live preview equals the capture; the user sees the
film before the render and their notes land where Claude reads them; a 30 s film
at 60 fps renders in minutes on a real GPU; sound is generated from the film's
own events and cannot drift.

## 1. Engine: React for words, WebGL2 for light

No chart library. Two layers over one frame state. When a new film starts
from an earlier one's project, take the engine (the files below except the
overlay) and write the overlay, its CSS and its fonts anew for this world
(the genre guide says what the overlay is).

```
src/timeline.ts  monotone-cubic clock: now(T), speed(T), videoAt(t)
src/gl/gl.ts     renderer: batches + HDR + bloom + tonemap
src/world.ts     the world: data → positions, camera, events; frame(T) then draw(frame)
src/Film.tsx     the overlay from the same frame (new for every film) + capture hooks
src/preview/     the preview shell: player bar, beats, knobs, notes (appendix)
shoot.mjs        stills → contact sheet; video → ffmpeg
```

- **`computeFrame(T)` is pure.** Anything with memory (smoothing, ranks,
  springs) is written as a function of T: a closed form, or an average of
  earlier T samples. Then frame 1,733 can be rendered alone, workers can split
  the film, and the preview equals the capture.
- **The renderer batches four primitives per frame**, each one instanced draw
  call: rounded rect with vertical gradient and optional glowing border; mesh
  triangles with per-vertex colour (areas, cones); SDF line segments with round
  caps and a gaussian halo; SDF dots with a halo. Coordinates are CSS px;
  a second "over" layer draws markers above everything.
- **HDR**: draw into an RGBA16F target with premultiplied blending; colours
  above 1.0 are what glows (the line core ×1.2–1.6, dots ×2). Then bloom as a
  6-level downsample (4-tap, threshold on the first) + tent upsample added
  back, composite with ACES tonemap, a slight edge chromatic split, vignette
  and animated grain. Exposure drops with zoom-out, or a fast-forward
  frame turns to white fog.
- **Text in the DOM** over the canvas, in typefaces chosen for the film's
  look like its palette (a monospace with `font-variant-numeric:
  tabular-nums` wherever digits change, a display face for the big figures;
  an engineering face, a serif, a typewriter: whatever the world would print).
  The faces a model reaches for first (IBM Plex Mono, JetBrains Mono, Barlow
  Condensed, Space Grotesk, Fraunces, Inter) end up in every film; look past
  them in `@fontsource` for one that belongs to this world,
  installed from `@fontsource/*`, sizes as
  `calc(Npx * var(--s))` with `s` from the frame size, so one stylesheet
  serves 1920×1080 and 1440×1080. Glow on text = `text-shadow` in the tone colour.
- **Palette**: one per film, from the genre guide's looks: a ground, one or two
  accents, a dim for labels. Decide it with the world, not from the last
  film's CSS.
- **Live preview at 120–144 Hz**: typed arrays, one `bufferData` per batch,
  no per-frame allocation in hot loops. A heavy simulation goes to a worker
  (OffscreenCanvas), while the DOM stays ~100 elements. React re-rendering the
  overlay every frame is fine at that size.
- Setup: `npm create vite@latest web -- --template react-ts`, no StrictMode
  (effects run once: one GL context, one clock), `session.json` in `public/`.


## 2. The film plays live before it is rendered

A full render is 20–40 minutes of the user waiting, and a render nobody
approved can come out wrong in a way the live page would have shown in 30
seconds. The page is already a film: without `?cap=1` it plays in real
time in the browser at 60+ fps, the same code and the same frames the
capture will shoot. So most of the work happens there, with the user
watching, and the render comes last.

What made this work is a **preview shell** built into the page from the
first run (the drop-in files are in the appendix): a player bar over the
film with a scrubber, pause, frame steps, speed, the film's beats as
marks you jump to with keys 1–9, a knobs panel (sliders and pickers for
the values worth tuning: bloom, the world's speed, density, which
algorithm drives the world), and notes: the user pauses on a second,
types "the numbers overlap the card here", and the note lands in
`public/notes.json` with its time for Claude to read. "Save" writes the
knobs to `public/knobs.json`, which the capture reads too, so the master is
shot with what was approved. None of it is drawn under `?cap=1`.

The checkpoints, each ending with something in front of the user:

1. **Concept** (before any code, after the user picked an idea): the system and its data, what it did and
   the shape of that (e.g. "starts in the red, one decision turns it, then
   a climb", or "2 M tickets, the queue drains in 20 s, three classes
   emerge"), the three candidate worlds (the genre guide) and how the data drives
   each, the format
   (16:9 or 4:3), the beats with seconds. Five lines, plus a reference
   frame if one exists.
2. **Live**: as soon as the page runs, start `npm run dev` and give the user
   the link (`http://localhost:5173/?…`; under WSL it opens in the Windows
   browser as is). The first live showing is the three world sketches,
   switched in the knobs panel; the user picks one. Then work in the loop: the user watches, scrubs, leaves
   notes or moves knobs; Claude reads `notes.json` and `knobs.json`, edits,
   and Vite's hot reload shows the change in a second, on the same second of
   the film (the shell keeps its time across reloads). Swapping the world's
   algorithm, recolouring, moving the HUD, retiming a beat all happen here.
   When the user can't open the page (away from that machine), record the
   live page for 30 s with Playwright's `recordVideo` and send the file: not
   frame-exact, but minutes instead of a render.
3. **Stills**: when the live film is liked, 6–9 full-quality stills at the
   beats as a contact sheet, plus one full-size hero frame, to check what a
   browser window hides: bloom and type at the final size, the 4:3 layout.
4. **Master**: only after the user's "ok" on the live film. The render is
   the expensive part (20–40 minutes of their machine, sometimes a paid GPU),
   so before it starts: send the live link or the recording, ask in so many
   words "anything to change before I render?", and wait for the answer.
   Silence, or "looks interesting", is not an ok. When it comes, say how
   long the render will take. Segmented capture means a later fix
   re-renders only the segments it touches.

Between checkpoints, work on your own: fixing what you see yourself is your
job, not a question. Before each showing, one test: put the last film's
instruments, palette and fonts on this world in your head. If the frame would
look about the same, the overlay isn't this film's yet. How to show stills: local paths the user can open (on
WSL: `\\wsl.localhost\<distro>\<path>`), or a
private page. A description of a frame doesn't replace the frame.


## 3. Shooting

- The page has a capture mode, `?cap=1&w=1920&h=1080`: no rAF loop, no preview
  shell, the saved `knobs.json` loaded before `__ready`, and it
  exposes `window.__frame(T)`, which sets the frame with `flushSync`, draws GL in
  `useLayoutEffect`, and resolves after two rAFs. `window.__ready` goes true
  after `document.fonts.ready`.
- `shoot.mjs`: Playwright Chromium, per frame `__frame(T)` → a screenshot →
  piped into `ffmpeg -f image2pipe -framerate 60 -i - -c:v libx264 -preset slow
  -crf 14 -pix_fmt yuv420p`, in segments of 300 frames, each in a fresh browser
  (a long session grows until the tab dies), with finished segments kept so a
  rerun resumes, then joined with `-f concat -c copy`.
- **Use the real graphics card.** Under WSL, headless Chromium defaults to
  SwiftShader (WebGL emulated on the CPU). The GPU is reachable through
  WSL's D3D12: launch with `--use-angle=gl --ignore-gpu-blocklist --enable-gpu`
  and env `GALLIUM_DRIVER=d3d12 LD_LIBRARY_PATH=/usr/lib/wsl/lib
  MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA` (without the last one Mesa may pick an
  integrated GPU). Check with `WEBGL_debug_renderer_info`: it should read
  `ANGLE (… D3D12 (NVIDIA GeForce …), OpenGL 4.6)`.
- **Grab frames through CDP**: `Page.captureScreenshot({format: 'png',
  optimizeForSpeed: true})` instead of `page.screenshot`. Measured on a
  1080p world of 7k dots, 12k lines and bloom: SwiftShader +
  `page.screenshot` 1.16 s/frame → GPU 0.55 → GPU + CDP **0.34 s/frame**, so a
  30 s film at 60 fps takes ~10 min instead of ~35.
- WSL's memory cap (`.wslconfig` `memory=`) matters: at 8 GB with a browser, the dev
  server and ffmpeg, it swaps and frames double in cost.
- **Where to shoot.** The D3D12 recipe is for a Windows machine with an
  NVIDIA card; the shoot script itself runs anywhere Chromium and ffmpeg do.
  When the author's computer has no such card, when the projected render is
  longer than they want to wait, or when the machine is needed meanwhile,
  offer a rented GPU box (e.g. Vast.ai) over SSH for the hours of the shoot,
  same script unchanged — the project goes up over rsync, the
  segments render there under tmux with a progress log, the stills and the
  master come back, the box is destroyed when nothing else is queued. On such
  a box the GPU is reached through Vulkan/EGL rather than D3D12: launch with
  `--use-angle=vulkan --enable-features=Vulkan --ignore-gpu-blocklist
  --enable-gpu` and check `WEBGL_debug_renderer_info` the same way (it should
  read `ANGLE (NVIDIA, Vulkan 1.4 … <card>)`; `--use-gl=egl` or no flags stay
  on SwiftShader).
- **The loop that makes it good:** stills at chosen seconds →
  `xstack` contact sheet → look → fix → again. A first sheet typically
  shows squashed curves, labels over values, stairs in sparse data and white
  fog in fast-forward; each is one edit.
- **Don't edit the source while a render runs.** Vite's HMR reloads modules
  inside the page being shot. Work in new files, or stop the dev server.


## 3a. Shooting a real site into the film

When the film's material is a website or an app (the `site_film` type), its
screens are shot from the live site first and become the textures the page
draws: prints on a table, a phone in a hand, sheets turning. Nothing is screen-
recorded; every frame of the site is a stored still with its own time.


Real pages, shot state by state with Playwright, from a shot list (JSON). Each
shot saves its frames plus the time of each frame:

| kind | what | how |
|---|---|---|
| `still` | one screen | scroll to a selector (+offset), screenshot the viewport |
| `slowmo` | a transition the site animates (a month clicked, a stack flipped, a card sliding) | slow every CSS animation with CDP `Animation.setPlaybackRate(0.05)`, click, screenshot as fast as it goes, store `(now − t0) × rate` as the frame's animation time |
| `video` | the hero video | pause it, set `currentTime`, wait for `seeked` + a rAF, screenshot |
| `scroll` | a page scrolled | `scrollTo` per frame; the film eases it |
| `states` | a tool used step by step (rows ticked) | an action, a wait, a screenshot |
| `type` | a form being filled | `fill()` the text two characters at a time |
| `full` | the whole page | a `full_page` screenshot |

```python
cdp = ctx.new_cdp_session(page); cdp.send("Animation.enable")
cdp.send("Animation.setPlaybackRate", {"playbackRate": 0.05})   # 20× slower
shot(0, 0); t0 = time.time(); page.locator(".day-months button").nth(11).click()
while (time.time() - t0) * 0.05 < 1.4:                          # 1.4 s of the site's animation
    shot(i, (time.time() - t0) * 0.05); i += 1
cdp.send("Animation.setPlaybackRate", {"playbackRate": 1})
```

Desktop at 1440×900 ×1.5; **mobile separately** at 390×844 ×2.5 with an iPhone
UA and touch — the 9:16 cut uses phone screens, never a crop of 16:9.

**Playing a shot on the film clock:** a screen in the page has `play: [[shot,
tStart, speed]]`; the shot's local time is `(t − tStart) × speed`, and its frame
is the last one whose stored time is ≤ that. Slowmo and video (seconds, speed
1), scroll (0..1, speed = 1/duration) and states (an index, speed = steps per
second) all work the same, and the same table gives the sound its events.
**Enough frames, not blending:** a scroll of 150 frames over 4 s is ~37 a
second and stutters at 60 fps; cross-fading neighbours doubles the text (the
page moves ~17 px between them). Shoot at least as many frames as the film
shows (4 s at 60 fps → 260). Only step shots (states, type) get a short fade
from the previous state (50–140 ms).

The page itself may be WebGL (§1) or plain canvas 2D over JPEG screens — the
Kai film rendered that way at ~0.1 s per frame on three workers, a 48 s film in
about three minutes. `computeFrame(T)` pure, the preview shell and `?cap=1`
apply the same.


What bit the first time:

- scroll the whole page once before shooting — lazy images and reveal
  animations otherwise show up half-loaded;
- hide the chat bubble and caret with injected CSS;
- after slowmo shots, reload before the next tool: a panel waiting for a slowed
  cross-fade never switched;
- a mobile layout hides some controls (arrows → swipe) — shoot a still there;
- **mock the lead endpoint** (`page.route('**/api/lead**')` → 200): the send
  animation plays and no fake lead reaches the client's admin or Telegram. Fill
  the form with obviously invented names.


## 4. Sound from the events

The score is made from the film's own events, on its clock (`videoAt` for
every event, the same keys as the page), so it can never drift from the
picture: generate the event list with the page's own world code (run under
`node --experimental-strip-types`) and synthesise from it (numpy + scipy, one
script, seconds to render).

What it sounds like comes from the world, the way the instruments do: a
harbour has water and rope creak, a lab hums and crackles, a city has
traffic under it, an orbit has a slow drone and radio pings. Then map the
film's parts onto that palette: a bed that opens with the clock's speed
(bands rising with `log10(speed)`), every visible event a short sound whose
pitch or size follows one of its real values (only the big ones when the
clock races), the operator's gesture its own small sound, the system's
successes and failures two different families, the transformation a long
build, the new state arriving one full hit. A convolution reverb send
(decaying noise IR), `tanh` soft clip, then `loudnorm=I=-14:TP=-1.5` at mux.

**The sounds of a site's events** (taps, typing, a page turned), when the film
shows a site being used: made physical, not "computer" — filtered-noise clicks
and beeps were rejected twice. What replaced them:

- a tap = a small wooden body: three damped sine modes (≈410 / 1030 / 1720 Hz,
  decays 55–120 /s) plus a 6 ms low-passed transient, pitch jittered ±3 %;
- typing = a fingertip on glass: modes ≈230 / 610 / 1180 Hz decaying in
  ~40 ms, a 4 ms soft transient, level and pitch varied per key, kept quiet;
- a ticked row = a pencil check: band-passed noise shaped as two strokes
  (short down, longer up) with a grainy amplitude;
- a camera move between screens = music, not noise, and muted: three low
  plucked strings of the current chord (Karplus–Strong) over 0.3 s, a dark
  excitation and a 1.6 kHz low-pass, the last note exactly as the screen lands.
  Paper rustle and a filtered-air swell read as "just noise"; a five-note run
  in the middle register as "too bright";
- paper (a photo flipped off a stack, a postcard turned) is the one sound
  synthesis could not fake. Use a recording: public-domain foley from Wikimedia
  Commons (search the File namespace with `filetype:audio`, check the licence
  in `extmetadata`), cut one clean page turn, vary its speed ±6 % per use,
  start it 50 ms before the flip;
- send = paper, a soft thump, one bell note; lights = a run of high notes.

Mix: bass an octave higher than feels natural (synth low notes turn to rumble
under reverb), a high-pass at 55 Hz and a low shelf, a compressor, `loudnorm`
to −14 LUFS; check with `showspectrumpic`. A 9:16 cut also ships silent, for a
trending track.


## 5. Formats and delivery

- **16:9**: 1920×1080 or **4:3**: 1440×1080. 60 fps, 20–50 s,
  H.264 crf 14, AAC 256k. The world scales by `min(W/aspect, H)`, its
  centres and the HUD corners move per aspect; lay both out from the start.
- **9:16** (Reels, Shorts, TikTok): 1080×1920, 30 fps, ≤ 30 s, rendered
  natively — the mobile shots in a phone body, the hook moving in the first
  second, captions inside y 1150–1560, nothing in the top ~200 and bottom
  ~350 px (the apps' own chrome sits there). Never a crop of the 16:9.
- End on the world still working, not on a profit card: a card after the
  transformation reads as an ad and flattens the ending.
- A cover: the densest moment (a character singled out, or the new state).
- Deliver: save the master (mp4) and the cover (png) in the working folder
  under descriptive names, with the post text in a `.md` next to them; look at
  the result yourself (pull a frame from the master, open the cover) before
  showing it, then show the user. The genre guide has the platform limits for
  the post. Keep the master and the engine locally; the next film of the genre
  starts from this engine with a new overlay.


## Appendix: the preview shell (drop-in files)

Four files, no dependencies beyond React and Vite. Copy them in when the page
is created, not at the end: the film is watched through them from the first
run. The panel fades while the film plays and the mouse rests.
Keys: space play/pause · ←/→ one frame (shift: 1 s) · 1–9 beats · `[` `]`
speed · K knobs · N a note at this second · H hide the panel.

Wiring in the page (trimmed):

```tsx
import { PreviewPanel, usePreviewClock, type Beat } from '../preview/Preview';
import { knob, loadKnobs } from '../preview/knobs';

const BEATS: Beat[] = [{ T: 0, label: 'boot' }, { T: 4, label: 'first lock' }, { T: 20, label: 'transformation' }];

// load saved knobs together with the data, before the first frame
Promise.all([fetch('/session.json').then(r => r.json()), loadKnobs()]).then(([d]) => setD(d));

const [capT, setT] = useState(-1);                        // set by window.__frame under ?cap=1
const liveT = usePreviewClock(duration, !CAP);            // replaces the page's own rAF loop
const T = CAP ? capT : liveT;

g.flush({ time: T, bloom: knob('bloom', 0.75, 0, 2), ... });  // a knob is read where the value is used

{!CAP && <PreviewPanel T={T} duration={duration} beats={BEATS} />}
```

In world code: `knob('world speed', 1, 0, 3)`, or
`pick('world', ['physarum', 'sandpile', 'kuramoto'], 'physarum')` to switch
the three candidate worlds live. A knob appears in the panel when it is first read, so read
the ones used late in the film once at start. `vite.config.ts`:
`plugins: [react(), preview()]` with `import { preview } from './preview-plugin.ts'`
(and the file added to `tsconfig.node.json`'s `include`).

`preview-plugin.ts` (next to `vite.config.ts`):

```ts
// Dev-server side of the preview panel: it saves knobs and the viewer's notes
// into public/, where Claude reads them and the capture picks the knobs up.
//   POST /__knobs  {name: value}            → public/knobs.json
//   POST /__notes  [{T, text, at}]          → public/notes.json
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

export function preview(): Plugin {
  const files: Record<string, string> = { '/__knobs': 'knobs.json', '/__notes': 'notes.json' };
  return {
    name: 'film-preview',
    // saving must not reload the page under the viewer
    config: () => ({ server: { watch: { ignored: ['**/public/knobs.json', '**/public/notes.json'] } } }),
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = files[req.url ?? ''];
        if (!file || req.method !== 'POST') return next();
        let body = '';
        req.on('data', c => { body += c; });
        req.on('end', () => {
          try {
            const json = JSON.parse(body);
            writeFileSync(resolve(server.config.publicDir, file), JSON.stringify(json, null, 2) + '\n');
            res.statusCode = 204;
          } catch {
            res.statusCode = 400;
          }
          res.end();
        });
      });
    },
  };
}
```

`src/preview/knobs.ts`:

```ts
// Knobs: named values the film reads while it draws, tuned live from the preview panel.
//
//   const speed = knob('world speed', 1, 0, 3);
//   const world = pick('world', ['physarum', 'sandpile', 'kuramoto'], 'physarum');
//
// Call them anywhere (render, world code): they return the current value. Saved
// values live in public/knobs.json, which the capture reads too, so the master
// is shot with what was approved in the preview.

type Num = { kind: 'num'; v: number; def: number; min: number; max: number; step: number };
type Pick = { kind: 'pick'; v: string; def: string; options: string[] };
export type Knob = Num | Pick;

const reg = new Map<string, Knob>();
let saved: Record<string, number | string> = {};
const subs = new Set<() => void>();
const notify = () => subs.forEach(f => f());

export async function loadKnobs() {
  try {
    const r = await fetch('/knobs.json', { cache: 'no-store' });
    if (r.ok) saved = await r.json();
  } catch { /* no file yet: defaults */ }
}

export function knob(name: string, def: number, min: number, max: number, step = (max - min) / 200): number {
  let k = reg.get(name);
  if (!k) {
    const s = saved[name];
    k = { kind: 'num', v: typeof s === 'number' ? s : def, def, min, max, step };
    reg.set(name, k);
    queueMicrotask(notify);
  }
  return k.v as number;
}

export function pick<T extends string>(name: string, options: readonly T[], def: T): T {
  let k = reg.get(name);
  if (!k) {
    const s = saved[name];
    k = { kind: 'pick', v: typeof s === 'string' && options.includes(s as T) ? s : def, def, options: [...options] };
    reg.set(name, k);
    queueMicrotask(notify);
  }
  return k.v as T;
}

export function setKnob(name: string, v: number | string) {
  const k = reg.get(name);
  if (!k) return;
  k.v = v as never;
  notify();
}

export const allKnobs = () => [...reg.entries()];
export const knobValues = () => Object.fromEntries([...reg.entries()].map(([n, k]) => [n, k.v]));
export function subscribeKnobs(f: () => void) { subs.add(f); return () => { subs.delete(f); }; }
```

`src/preview/Preview.tsx`:

```tsx
// The preview shell: the film plays live in the browser, and the viewer scrubs,
// pauses, jumps to beats, tunes knobs and leaves notes at a second, all before
// anything is rendered. Not drawn under ?cap=1, so it never reaches a frame.
//
//   const T = usePreviewClock(duration);              // replaces the page's own rAF loop
//   {!CAP && <PreviewPanel T={T} duration={duration} beats={BEATS} />}
//
// Keys: space play/pause · ←/→ one frame (shift: 1 s) · 1–9 beats · [ ] speed ·
// K knobs · N note at this second · H hide the panel.
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { allKnobs, knobValues, setKnob, subscribeKnobs } from './knobs';
import './preview.css';

export type Beat = { T: number; label: string };
type Note = { T: number; text: string; at: string };

const SPEEDS = [0.25, 0.5, 1, 2];
const FPS = 60;
const store = {
  T: 0, playing: true, speed: 1,
  subs: new Set<() => void>(),
  set(p: Partial<{ T: number; playing: boolean; speed: number }>) {
    Object.assign(store, p);
    try { sessionStorage.setItem('preview', JSON.stringify({ T: store.T, playing: store.playing, speed: store.speed })); } catch { /* private window */ }
    store.subs.forEach(f => f());
  },
};
try {
  const q = new URLSearchParams(location.search).get('t');
  const s = JSON.parse(sessionStorage.getItem('preview') ?? 'null');
  if (s) Object.assign(store, s);          // a reload after an edit lands on the same second
  if (q) store.T = Number(q);
} catch { /* defaults */ }

/** Video time for a live preview; the rAF loop lives here, not in the page. */
export function usePreviewClock(duration: number, enabled = true) {
  const [T, setT] = useState(store.T % duration);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (store.playing) store.set({ T: (store.T + dt * store.speed) % duration });
      raf = requestAnimationFrame(loop);
    };
    const unsub = (() => { const f = () => setT(store.T); store.subs.add(f); return () => store.subs.delete(f); })();
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); unsub(); };
  }, [duration, enabled]);
  // knob changes while paused must still redraw the frame
  useSyncExternalStore(subscribeKnobs, () => JSON.stringify(knobValues()));
  return T;
}

export function PreviewPanel({ T, duration, beats = [] }: { T: number; duration: number; beats?: Beat[] }) {
  const [shown, setShown] = useState(true);
  const [knobsOpen, setKnobsOpen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<string | null>(null);
  const [saved, setSaved] = useState('');
  const bar = useRef<HTMLDivElement>(null);
  useSyncExternalStore(subscribeKnobs, () => JSON.stringify(knobValues()));
  const { playing, speed } = store;

  useEffect(() => { fetch('/notes.json', { cache: 'no-store' }).then(r => (r.ok ? r.json() : [])).then(setNotes).catch(() => {}); }, []);

  // the panel fades while the film plays and the mouse rests
  useEffect(() => {
    let t = 0;
    const wake = () => { setIdle(false); clearTimeout(t); t = window.setTimeout(() => setIdle(true), 2500); };
    addEventListener('mousemove', wake); wake();
    return () => { removeEventListener('mousemove', wake); clearTimeout(t); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (draft !== null || (e.target as HTMLElement).tagName === 'INPUT') return;
      const k = e.key;
      if (k === ' ') { e.preventDefault(); store.set({ playing: !store.playing }); }
      else if (k === 'ArrowRight' || k === 'ArrowLeft') {
        const d = (e.shiftKey ? 1 : 1 / FPS) * (k === 'ArrowRight' ? 1 : -1);
        store.set({ playing: false, T: Math.max(0, Math.min(duration - 1e-3, store.T + d)) });
      } else if (k >= '1' && k <= '9' && beats[+k - 1]) store.set({ T: beats[+k - 1].T });
      else if (k === '[' || k === ']') {
        const i = SPEEDS.indexOf(store.speed) + (k === ']' ? 1 : -1);
        store.set({ speed: SPEEDS[Math.max(0, Math.min(SPEEDS.length - 1, i))] });
      } else if (k === 'k' || k === 'K') setKnobsOpen(o => !o);
      else if (k === 'h' || k === 'H') setShown(s => !s);
      else if (k === 'n' || k === 'N') { e.preventDefault(); store.set({ playing: false }); setDraft(''); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [beats, duration, draft]);

  const seek = (clientX: number) => {
    const r = bar.current!.getBoundingClientRect();
    store.set({ T: Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * (duration - 1e-3) });
  };
  const saveKnobs = async () => {
    await fetch('/__knobs', { method: 'POST', body: JSON.stringify(knobValues()) });
    setSaved('saved'); setTimeout(() => setSaved(''), 1500);
  };
  const addNote = async (text: string) => {
    const next = [...notes, { T: +T.toFixed(2), text, at: new Date().toISOString() }].sort((a, b) => a.T - b.T);
    setNotes(next); setDraft(null);
    await fetch('/__notes', { method: 'POST', body: JSON.stringify(next) });
  };
  const dropNote = async (i: number) => {
    const next = notes.filter((_, j) => j !== i);
    setNotes(next);
    await fetch('/__notes', { method: 'POST', body: JSON.stringify(next) });
  };
  const beatNow = useMemo(() => [...beats].reverse().find(b => T >= b.T), [beats, T]);
  const knobs = allKnobs();

  if (!shown) return null;
  return (
    <div className={`pv ${idle && playing && draft === null ? 'pv-idle' : ''}`}>
      {knobsOpen && (
        <div className="pv-knobs">
          <div className="pv-h">KNOBS <button onClick={saveKnobs}>{saved || 'save → knobs.json'}</button></div>
          {knobs.length === 0 && <div className="pv-dim">the film reads no knob() yet</div>}
          {knobs.map(([name, k]) => (
            <label key={name}>
              <span>{name}</span>
              {k.kind === 'num' ? (
                <>
                  <input type="range" min={k.min} max={k.max} step={k.step} value={k.v}
                    onChange={e => setKnob(name, +e.target.value)} onDoubleClick={() => setKnob(name, k.def)} />
                  <b>{+k.v.toFixed(3)}</b>
                </>
              ) : (
                <select value={k.v} onChange={e => setKnob(name, e.target.value)}>
                  {k.options.map(o => <option key={o}>{o}</option>)}
                </select>
              )}
            </label>
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <div className="pv-notes">
          {notes.map((n, i) => (
            <div key={i} className={Math.abs(n.T - T) < 0.6 ? 'on' : ''}>
              <a onClick={() => store.set({ T: n.T, playing: false })}>{n.T.toFixed(1)}s</a> {n.text}
              <button onClick={() => dropNote(i)}>×</button>
            </div>
          ))}
        </div>
      )}

      {draft !== null && (
        <form className="pv-draft" onSubmit={e => { e.preventDefault(); if (draft.trim()) addNote(draft.trim()); }}>
          <span>note @ {T.toFixed(2)}s</span>
          <input autoFocus value={draft} placeholder="what to change here…" onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') setDraft(null); }} />
        </form>
      )}

      <div className="pv-bar">
        <button className="pv-play" onClick={() => store.set({ playing: !playing })}>{playing ? '❚❚' : '▶'}</button>
        <div className="pv-time"><b>{T.toFixed(2)}</b> / {duration.toFixed(1)} s <i>f {Math.floor(T * FPS)}</i></div>
        <div className="pv-track" ref={bar}
          onPointerDown={e => { (e.target as HTMLElement).setPointerCapture(e.pointerId); seek(e.clientX); }}
          onPointerMove={e => { if (e.buttons) seek(e.clientX); }}>
          <div className="pv-fill" style={{ width: `${(T / duration) * 100}%` }} />
          {beats.map((b, i) => (
            <div key={i} className={`pv-beat ${i % 2 ? 'lo' : ''} ${beatNow === b ? 'on' : ''}`} style={{ left: `${(b.T / duration) * 100}%` }}>
              <span>{i + 1} {b.label}</span>
            </div>
          ))}
          {notes.map((n, i) => <div key={i} className="pv-note" style={{ left: `${(n.T / duration) * 100}%` }} />)}
        </div>
        <div className="pv-speed">
          {SPEEDS.map(s => <button key={s} className={s === speed ? 'on' : ''} onClick={() => store.set({ speed: s })}>{s}×</button>)}
        </div>
        <button onClick={() => setKnobsOpen(o => !o)} className={knobsOpen ? 'on' : ''}>K</button>
        <button onClick={() => { store.set({ playing: false }); setDraft(''); }}>+ note</button>
      </div>
    </div>
  );
}
```

`src/preview/preview.css`:

```css
.pv { position: fixed; inset: 0; pointer-events: none; z-index: 1000; font: 12px/1.4 'JetBrains Mono', ui-monospace, monospace; color: #cdd6e4; transition: opacity 0.4s; }
.pv > * { pointer-events: auto; }
.pv-idle { opacity: 0; }
.pv button { font: inherit; color: #cdd6e4; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(160, 180, 210, 0.2); border-radius: 4px; padding: 3px 8px; cursor: pointer; }
.pv button:hover, .pv button.on { background: rgba(212, 255, 58, 0.14); border-color: rgba(212, 255, 58, 0.5); color: #efffb8; }
.pv i { font-style: normal; color: #5d6a7d; margin-left: 8px; }

.pv-bar { position: absolute; left: 16px; right: 16px; bottom: 14px; display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: rgba(6, 9, 14, 0.82); backdrop-filter: blur(8px); border: 1px solid rgba(160, 180, 210, 0.16); border-radius: 8px; }
.pv-play { width: 36px; }
.pv-time { width: 190px; white-space: nowrap; color: #8390a3; }
.pv-time b { color: #f2f5fa; font-weight: 500; }
.pv-track { position: relative; flex: 1; height: 26px; cursor: pointer; touch-action: none; }
.pv-track::before { content: ''; position: absolute; left: 0; right: 0; top: 12px; height: 2px; background: rgba(160, 180, 210, 0.2); }
.pv-fill { position: absolute; left: 0; top: 12px; height: 2px; background: #d4ff3a; box-shadow: 0 0 8px #d4ff3a; }
.pv-fill::after { content: ''; position: absolute; right: -5px; top: -4px; width: 10px; height: 10px; border-radius: 50%; background: #f4ffd0; }
.pv-beat { position: absolute; top: 4px; width: 1px; height: 18px; background: rgba(160, 180, 210, 0.45); }
.pv-beat span { position: absolute; bottom: 20px; left: 0; transform: translateX(-50%); white-space: nowrap; font-size: 10px; color: #5d6a7d; letter-spacing: 0.08em; }
.pv-beat.lo span { bottom: 32px; }
.pv-beat.on { background: #d4ff3a; }
.pv-beat.on span { color: #d4ff3a; }
.pv-note { position: absolute; top: 17px; width: 7px; height: 7px; margin-left: -3px; border-radius: 50%; background: #ffb840; }
.pv-speed { display: flex; gap: 4px; }

.pv-knobs { position: absolute; right: 16px; bottom: 76px; width: 340px; max-height: 60vh; overflow: auto; padding: 12px; background: rgba(6, 9, 14, 0.88); backdrop-filter: blur(8px); border: 1px solid rgba(160, 180, 210, 0.16); border-radius: 8px; }
.pv-h { display: flex; justify-content: space-between; align-items: center; letter-spacing: 0.2em; color: #6f7c90; margin-bottom: 8px; }
.pv-knobs label { display: grid; grid-template-columns: 110px 1fr 54px; align-items: center; gap: 8px; padding: 4px 0; }
.pv-knobs label span { color: #8390a3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pv-knobs label b { font-weight: 500; text-align: right; }
.pv-knobs input[type=range] { accent-color: #d4ff3a; width: 100%; }
.pv-knobs select { grid-column: 2 / 4; font: inherit; color: #cdd6e4; background: #0b1017; border: 1px solid rgba(160, 180, 210, 0.2); border-radius: 4px; padding: 2px 4px; }
.pv-dim { color: #5d6a7d; }

.pv-notes { position: absolute; left: 16px; bottom: 76px; max-width: 460px; max-height: 40vh; overflow: auto; padding: 8px 10px; background: rgba(6, 9, 14, 0.82); border: 1px solid rgba(255, 184, 64, 0.25); border-radius: 8px; }
.pv-notes div { display: flex; gap: 8px; align-items: baseline; padding: 2px 0; color: #aab4c3; }
.pv-notes div.on { color: #ffe0a8; }
.pv-notes a { color: #ffb840; cursor: pointer; flex: none; }
.pv-notes button { margin-left: auto; padding: 0 6px; }
.pv-draft { position: absolute; left: 50%; bottom: 84px; transform: translateX(-50%); display: flex; gap: 10px; align-items: center; padding: 10px 12px; background: rgba(6, 9, 14, 0.92); border: 1px solid rgba(255, 184, 64, 0.5); border-radius: 8px; }
.pv-draft span { color: #ffb840; white-space: nowrap; }
.pv-draft input { width: 420px; font: inherit; color: #f2f5fa; background: transparent; border: 0; outline: 0; }
```

---

*Part of the free [AICB content skills](https://github.com/corj1k/aicb-content-skills). What a skill alone cannot do — reads of X / Reddit / Instagram / Google as tools, monitoring, posting from your own browser, the timeline, a render box — is [AICB](https://aicb.notpeople.ai).*
