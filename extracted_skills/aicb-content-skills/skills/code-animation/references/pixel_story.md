# pixel_story — a story in beats in a small game world

## What it is

A **story** told in a small pixel-art game world, filmed: a cast of
mascots, a premise taken from the subject and built literally (a lab that
squeezes "juice" out of a UI), a process with a number that climbs, a
payoff title, a last small reaction. The story bones — a premise in one
line, 6–10 beats of 2–5 s, speech bubbles, acting, the camera moving
between spots instead of cutting — are §7 of the `code-animation` skill; this
guide is the pixel medium and the measured bar. Sound is a chiptune made
the way the old chips made it (§12).

> Section numbers (§1, §4.3, §12 …) refer to the `code-animation` skill's SKILL.md — the common craft: the idea, the axes, the look, the canvas toolbox, the story beats, the simulations, the shoot, the sound, the formats, the handover. §9.x refers to the `blender-film` skill.

## Pixel art: the medium

A pixel piece is a small game world filmed. It looks deliberate when the
pixel grid is never broken, and it feels alive when the game "juice" is on.

**The buffer.** Draw everything into a low-resolution canvas (270×480 for
9:16, 480×270 for 16:9, 320×320 for square), then scale to the output with
`ctx.imageSmoothingEnabled = false`. Every sprite and every camera offset is
rounded to whole buffer pixels; a sprite at x = 10.4 shimmers. A camera zoom
scales the finished buffer, which keeps the pixels crisp at any size (the
pixels simply get bigger in a close-up, which reads as a close-up).

```js
buf.width = 270; buf.height = 480;               // the world
bctx.setTransform(1, 0, 0, 1, -Math.round(cam.x), -Math.round(cam.y));
drawWorld(bctx, f);
out.imageSmoothingEnabled = false;
out.drawImage(buf, sx, sy, sw, sh, 0, 0, 1080, 1920);   // sx..sh = the zoom window
drawGlow(out, f);                                 // full-resolution light on top
```

**Sprites from code.** Each sprite is a list of strings with a palette,
one character per pixel, frames next to each other; bake them to canvases
once in `init`. Keep one palette of 16–32 colours for the whole piece,
with 3–4 ramp steps per hue (shadow, base, light, highlight); shade by
changing the ramp step, not by transparency. A tile set (brick wall, floor,
pipes) repeats small tiles with a few variants so the wall does not look
stamped.

```js
const CRAB = { pal: { o: '#d9744a', d: '#a4502e', k: '#1d1b1f', w: '#fff' },
  frames: [[ '..oooooo..',
             '.oooooooo.',
             'oookoookoo', ...], ...] };
```

**Two clocks.** Sprite animation runs at 8–12 fps (a walk in 4 frames, a
blink in 2), held across 60 fps output. Camera moves, particles, glow and
screen shake run at the full rate. That mix is what makes modern pixel
pieces feel smooth and still hand-made.

**Juice.** Screen shake that decays over 0.3 s (whole-pixel offsets);
a white flash frame on impact; squash and stretch in whole pixels; particles
with gravity (droplets, sparks, confetti) at buffer resolution; counters that
roll digit by digit; blinking indicator lights; a warning sign that swings.
Everything that happens gets at least one of these.

**Light over pixels.** A glow layer at full resolution, added in `lighter`
over the upscaled buffer: the liquid in the beaker, the lamp, the screen.
Pixel art with soft modern light is the look of the juice lab; without it
the same scene reads as a retro game screenshot.

**Letters.** A bitmap font: a table of glyphs as small pixel maps, drawn
like sprites. A TTF pixel font drawn by canvas gets antialiased edges at
most sizes; a glyph table cannot. Big titles are the same glyphs at 4–8×,
with a darker copy offset one pixel down as a drop shadow and a 1-pixel
outline.

**Transitions.** Inside one world: pans and pushes (§7). Between worlds: a
dither dissolve (the ordered-dither matrix as the threshold for which
pixels show the new scene), an iris of square steps, or a pixel mosaic that
coarsens and resolves.


## The bar, measured

What a finished piece looks like, measured frame by frame on the piece that set the bar in September 2026. Everything needed to hit the same quality is here; there is nothing to go and look up.

### Pixel: a story (32 s, 9:16, 60 fps)

- **World**: one lab, white-tiled walls in pale mint (`#c6ded2`, grout and
  shadow tiles `#a2baae`/`#96baae`), a darker dado and floor, a dark ceiling
  strip (`#1e2a36`) with hanging lamps. Props tell the joke: a whiteboard
  plan (UI → juice → a rising graph), a "SAFETY FIRST" poster, a clock, a
  "DANGER JUICY" sign, pipes, gauges, beakers, test tubes.
- **Cast**: a row of the same blocky mascot in different roles (glasses,
  a hard hat, a lab coat and goggles), reading at 20 px tall.
- **Words**: chapter cards top-left in a pixel font on a dark tab with a red
  edge ("SPECIMEN 01: THE UI MACHINE", "EXTRACTION IN PROGRESS"); speech
  bubbles white with a black 1-px border; the machine's green LCD
  ("PURITY 42%", "93%", "100%") with a digital font; the payoff in huge
  orange pixel letters with a dark drop shadow and outline ("100% PURE
  JUICINESS"), a small line under it.
- **Beats**: wide on the lab → the specimen in a glass chamber, its screen
  showing a UI that assembles (header, cards, a cursor clicks, "SHIPPED ✓"
  stamps) → the cast reacts in bubbles → a scientist pulls a lever → light
  travels along the pipe → the gauge climbs with cutaways → the screen and
  room tint warm as purity rises → 100 %: flash, orange juice-drop particles,
  the cast raises its arms → the title.
- **Light**: soft modern glow over crisp pixels (the lit beaker, the lamp,
  the pipe pulse), a warm grade creeping in as the story heats up.
- **Camera**: never a hard cut inside the lab: pans along the wall, pushes
  into the machine and its screen, pull-backs to the room.


Its row on the axes of §2, for the log:

- *Pixel* — structure = a story in beats · transitions = pans and pushes in
  one world · camera = tracking between spots · character = a cast of
  mascots · words = chapter cards, bubbles, HUD, payoff title · look =
  pixel with soft light · ending = payoff title and a button.

## Handing over

Save the master mp4 (and the 9:16 cut, the GIF of a loop) in the working folder under a descriptive name, with the post text in a `.md` next to it. Look at the result yourself — pull a frame, play it through — before showing it; then show the user. Add the piece's row on the axes to the log in the project's `NOTES.md`, under `log:animation`, so the next piece moves away from it (§2).
