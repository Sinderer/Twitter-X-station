# storybook — a life-cycle story as an illustrated storybook

## What it is

A **life-cycle story** drawn as an illustrated storybook: one guide
character (an ant), a want, a journey through the cycle with obstacles (a
storm, a flood), time shown inside the picture (tally marks, a sun and moon
strip), the last shot rhyming with the first. Flat fills with a
coloured-pencil texture, one living ink outline, soft light bands across the
paper — and the drawing's own construction lines left visible. Canvas 2D
(§4), beats and acting (§7), one melodic instrument and mickey-mousing (§12).

> Section numbers (§1, §4.3, §12 …) refer to the `code-animation` skill's SKILL.md — the common craft: the idea, the axes, the look, the canvas toolbox, the story beats, the simulations, the shoot, the sound, the formats, the handover. §9.x refers to the `blender-film` skill.

## The storybook look and its construction lines

The storybook piece described at the end (an ant, a seed, a vine, a storm,
a watermelon and back, 29 s, 1:1) sets this look. It works because it keeps three layers
apart:

- **Fills** — flat colour with a coloured-pencil texture clipped inside:
  short strokes at one angle per object, 10–20 % darker or lighter than the
  fill, boiled at 12 fps like the line (§4.3). A watermelon's flesh is a
  cell pattern (Voronoi, each cell a slightly different red with a
  highlight); its rind is bands along the outline.
- **Ink** — one dark outline around every object, the living line from
  §4.3, thicker on the shadow side.
- **Light** — wide soft diagonal bands across the whole paper, a few % of
  brightness, drifting slowly: sunlight through a window, without drawing a
  window.

On top of that, a fourth layer: **the drawing shows its own geometry.**
When the vine curls, thin blue compass circles, dashed arcs and arrows show
the spiral it follows; when the seed splits, a centre cross and a guide
ellipse; the passing days are tally marks in the corner (I, II, IIII, a
bundled five), day and night a thin strip with the sun or moon. The lines
are drawn in (§4.6, "a line drawn in") a beat before the motion that uses
them and fade after it. It reads as "made with care, by someone who
calculated", which is exactly what a code-drawn piece can claim honestly.

Scale changes stay inside the look: a cut-away (the seed underground drawn
as a cross-section in a circle), a magnifier inset (a circle with the root
hairs close up, joined to its spot by two thin lines), a night scene where
the same ink turns light on a dark blue ground.


## The bar, measured

What a finished piece looks like, measured frame by frame on the piece that set the bar in September 2026. Everything needed to hit the same quality is here; there is nothing to go and look up.

### Storybook: a life cycle (29 s, 1:1, 24 fps)

- **Paper**: warm cream (`#f6eade`) with wide diagonal light bands 3–5 %
  lighter; soil a mid brown (`#96724e`) with darker specks; night a deep
  indigo (`#363672` → `#1e1e42`) with sparse stars.
- **Drawing**: dark brown ink outlines; fills with coloured-pencil strokes;
  the watermelon flesh a red cell pattern (`#ba122a`, `#c63642`) with glossy
  highlights and black seeds; leaves with pale vein lines.
- **Geometry shown**: blue compass circles, dashed spiral guides and arrows
  where the vine curls; a centre cross on the seed; tally marks for days;
  a sun/moon strip for time.
- **Beats**: the ant eats watermelon → buries a seed → cross-section of
  the seed splitting underground at night, a magnifier on the root hairs →
  a sprout, the ant waters it, heat waves → the vine climbs in spirals,
  days tallied → a storm, lightning, a flood → the watermelon ripens → the
  ant climbs it → cuts it → shares a piece → the first shot again.


Its row on the axes of §2, for the log:

- *Storybook* — structure = a life cycle · transitions = cut-aways, a
  storm, day/night · camera = still frames and push-ins · character = a
  guide (the ant) · look = storybook · sound = one instrument and
  mickey-mousing · ending = loop to the start.


## Handing over

Save the master mp4 (and the 9:16 cut, the GIF of a loop) in the working folder under a descriptive name, with the post text in a `.md` next to it. Look at the result yourself — pull a frame, play it through — before showing it; then show the user. Add the piece's row on the axes to the log in the project's `NOTES.md`, under `log:animation`, so the next piece moves away from it (§2).
