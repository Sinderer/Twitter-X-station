# paper_gag — a 2–4 s gag loop of paper characters

## What it is

A **gag loop**, 2–4 s: folded-paper characters on a tabletop, one action
and its reveal, the last frame the first — a paper character draws a twin
with a pencil, the drawing pops into a real one, they look at each other.
Animated in Python, rendered in Blender (the `blender-film` skill), delivered as a
GIF for X (§13, "A loop"). Beats and acting: §7; sound (paper is softer than
bricks: a brush, a tap, the pencil's scratch): §12.

> Section numbers (§1, §4.3, §12 …) refer to the `code-animation` skill's SKILL.md — the common craft: the idea, the axes, the look, the canvas toolbox, the story beats, the simulations, the shoot, the sound, the formats, the handover. §9.x refers to the `blender-film` skill.

## Paper craft and the drawing that becomes real

The paper loop described at the end (3.4 s, animated in Python, rendered in Blender): two
folded-paper characters on a tabletop; one takes a pencil, draws the
outline of a twin on the paper, the outline fills in and stands up as a
real paper character, and the loop starts again.

- **Paper material**: matte (roughness around 0.6), a little subsurface so
  light glows through thin parts, very slightly rounded edges with a paler
  edge line where the paper is cut. Faces are printed textures (a few
  expressions, `^ ^`, `> <`, `■ ■`), swapped on single frames, never morphed.
- **A drawn line in 3D**: a curve object on the table with its bevel
  depth set to a pencil line, `bevel_factor_end` keyframed 0 → 1 while the
  pencil tip follows the same curve. Then the flat drawing fills (an
  emission or texture mask growing), extrudes (a Solidify modifier's
  thickness keyframed from 0) and pops upright with an overshoot: the
  change-of-state transition of §5, in 3D.
- **The loop**: the last frame equals the first. Plan the piece backwards
  from the pose it must return to; check it by looking at the last and the
  first frame one after the other.


## The bar, measured

What a finished piece looks like, measured frame by frame on the piece that set the bar in September 2026. Everything needed to hit the same quality is here; there is nothing to go and look up.

### Paper craft: a gag loop (3.4 s, 1:1, 25 fps)

- **Set**: a warm cream tabletop (`#f6ead2`) fading into a soft brown wall
  band at the top (`#7e4e1e`); one big soft light, so shadows are pale
  pinkish pools under the characters.
- **Characters**: coral folded-paper boxes (`#f67e5a`) with square arms and
  four legs, faces printed in black: `^ ^` happy, `■ ■` neutral, `> <`
  effort. A real green pencil, sharpened, with a pink eraser.
- **Action**: one character holds the pencil, draws the outline of a twin on
  the table in a thin wobbly graphite line (≈1 s), dots in the eyes, the
  flat drawing fills white, then pops up as a coral paper box; the two look
  at each other, happy faces, and the loop closes on the first frame. The
  pencil is tossed and caught in the middle as the gag's accent.
- **Timing**: expressions change on single frames; a 2–3 frame anticipation
  before every move; the whole gag in under 90 frames.


Its row on the axes of §2, for the log:

- *Paper* — structure = a gag loop · transitions = a change of state
  (drawing → object) · camera = still · character = two · look = 3D paper
  craft · ending = loop.

## Handing over

Save the master mp4 (and the 9:16 cut, the GIF of a loop) in the working folder under a descriptive name, with the post text in a `.md` next to it. Look at the result yourself — pull a frame, play it through, check the loop's seam — before showing it; then show the user. Add the piece's row on the axes to the log in the project's `NOTES.md`, under `log:animation`, so the next piece moves away from it (§2).
