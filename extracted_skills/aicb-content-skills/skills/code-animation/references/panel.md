# panel — one filament object through named states inside a lab instrument's HUD

## What it is

One luminous **object** made of thousands of fine filaments and sparks on
near-black, shown through a series of named states (a corona, a cocoon, a
wave, restore), framed by the HUD of an imaginary lab instrument: live
meters, a dial, a scrolling register, chapter tabs, a footer that says the
data is simulated. Canvas 2D (§4), additive light (§4.4), morphs instead of
cuts (§5), a ticking pulse over a low bass (§12).

> Section numbers (§1, §4.3, §12 …) refer to the `code-animation` skill's SKILL.md — the common craft: the idea, the axes, the look, the canvas toolbox, the story beats, the simulations, the shoot, the sound, the formats, the handover. §9.x refers to the `blender-film` skill.

## Filaments and an instrument panel

The look of a lab instrument showing one object. Two layers:

**The object: a surface drawn as filaments.** Take a parametric surface
(u along the ribbon, v across it) and draw it as 100–200 curves of
constant v, each a fine line (0.6–1 px) in a warm gold at low alpha,
added with `lighter` so crossings glow. Scatter sparks along the curves:
small bright dots (white-gold) at random u, a few percent of them with a
soft halo. A handful of "signals" travel along single filaments as short
bright streaks in a second colour (mint), each with a fading tail
(§4.6). The object turns slowly in 3D (project with a small
perspective); a glowing glyph sits in its centre.

The piece is a series of **states** of that surface, each named: a rose
of petals (a corona), a closed ellipsoid (a cocoon), a hyperbolic bow (a
wave), back to the rose (restore). A state change is a morph: interpolate
the surface function between two states with an eased parameter, add a
twist that peaks mid-way, so the ribbon folds rather than cross-fades.
Hold each state 4–6 s, morph in 1.5–2.

**The instrument: a HUD that behaves.** Everything is small monospace
caps (10–12 px at 960 wide), labels grey, values in the accent colours,
hairline dividers; one big thin title (the current state's name). And it
all moves with the object:

- top: brand line and an instrument number; three meters, each a
  sparkline of thin bars and a value with one decimal that changes every
  frame;
- a state line ("FOLDING / COCOON") and a running timer in seconds;
- counters under the object (filaments, active signals);
- a radial dial: tick marks, an arc for progress, a three-digit number;
- a register table: hex id, an event name, a packet count, a status; the
  newest row enters at the top highlighted and "STREAMING", older ones
  settle to "VERIFIED";
- chapter tabs at the bottom (01 / CORONA … 04 / RESTORE) with a progress
  underline;
- a footer that says what it is: "CONCEPT VISUALIZATION / SIMULATED
  DATA". When numbers are invented, the screen says so.

The HUD is what turns a pretty particle shape into "a machine at work";
the numbers do not need to mean anything as long as they are labelled
honestly, and they should move in step with the object (the register
streams faster during a morph, a meter spikes when a state locks).


## The bar, measured

What a finished piece looks like, measured frame by frame on the piece that set the bar in September 2026. Everything needed to hit the same quality is here; there is nothing to go and look up.

### Instrument panel: an object in four states (26 s, 4:5, 960×1200, 30 fps)

- **Ground**: near-black `#060606`, a faint warm lift in the middle.
- **Object**: ~170 filaments in warm gold (`#b8a898`–`#988878` at low
  alpha, additive), white sparks along them, a few mint streaks
  travelling; a gold hexagram glyph glowing at the centre. It fills about
  60 % of the frame height.
- **States**: CORONA (a rose of twisted petals) → COCOON (a closed
  ellipsoid of parallel lines) → WAVE (a bow tie, two cones meeting at
  the centre) → RESTORE (it crumples and blooms back into the corona). Each
  held ~5 s, morphs ~2 s with a fold.
- **HUD**: "LUMMOX / SYNTHESIS LAB" and "INSTRUMENT 043" top line; title
  in a thin sans ~44 px; model name and "CONTINUOUS TOPOLOGY
  TRANSFORMATION" right; three meters (EXCITATION gold, TRANSFER white,
  RETENTION mint) with sparklines and values ticking; "168 FILAMENTS" /
  "2,900 ACTIVE SIGNALS"; PHASE ENCODER dial; SIGNAL REGISTER with five
  rows streaming; tabs 01–04 with underline progress; footer "CONCEPT
  VISUALIZATION / SIMULATED DATA". Accents: gold `#e8a868`, mint
  `#8fd6b8`, labels grey, dividers `#2a2a2a`.
- **Sound**: a steady ticking pulse (short clicks on a grid) over a low
  bass, quiet (about −22 LUFS in the original; aim for −14).


Its row on the axes of §2, for the log:

- *Instrument panel* — structure = one object through named states, a
  loop · transitions = morphs with a fold · camera = still, the object
  turns · character = none · words = a full HUD · look = gold filaments on
  black · palette = gold + one mint · sound = ticking pulse and bass ·
  ending = back to the first state.

## Handing over

Save the master mp4 (and the 9:16 cut, the GIF of a loop) in the working folder under a descriptive name, with the post text in a `.md` next to it. Look at the result yourself — pull a frame, play it through — before showing it; then show the user. Add the piece's row on the axes to the log in the project's `NOTES.md`, under `log:animation`, so the next piece moves away from it (§2).
