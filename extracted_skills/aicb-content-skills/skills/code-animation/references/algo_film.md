# algo_film — a portrait of one algorithm, or a journey through worlds tied by one rule

## What it is

A film where the beauty is what an algorithm does anyway, drawn well — in
one of two shapes. A **portrait of one algorithm**: its own beauty, simply
and honestly animated, such as ants finding a route through a real city, a
reaction-diffusion growing spots and labyrinths, or gravity winding a galaxy
out of noise. A **journey**: several worlds tied into one film by a rule
they share — a chain of true rhymes, each world moving into the next instead
of cutting (One Rule, at the end). Every frame is made by code on a canvas
page shot frame by frame; the simulations are real (agents, growth,
physics); the look is designed (§3); the camera and the cuts are directed
(§5); the sound is made of the picture's own events (§12). The idea comes
first and from the author (§1); the form is chosen for THIS piece against
the log of what they already made (§2).

> Section numbers (§1, §4.3, §12 …) refer to the `code-animation` skill's SKILL.md — the common craft: the idea, the axes, the look, the canvas toolbox, the story beats, the simulations, the shoot, the sound, the formats, the handover. §9.x refers to the `blender-film` skill.

## The portrait of an algorithm

The simplest piece and often the most watched: one algorithm, doing its work,
drawn well. Nothing is added to it — the beauty is what the algorithm does
anyway (a flock turning, a maze being carved, ants settling on a route,
stars winding into arms). What makes it more than a screen recording:

**A twist that makes it new.** Check first whether the obvious version exists
(search "<algorithm> visualization" on YouTube and X — the well-known
explainers have covered sorting, boids, ant colonies, mazes). Then move one
thing: real data instead of a toy (ants on a real city's streets, a slime mold
over a real metro, a benchmark actually measured on five languages), an
unexpected result (bubble sort winning on nearly-sorted data), an unusual
scale (200,000 stars instead of 2,000), a known painting as the target of an
evolution.

**It is honest.** Real computation, real numbers on screen. Counters are the
physics, not decoration: the step, the metric scientists use for that
system (polarisation of a flock, the spiral strength of a galaxy, the size of
the largest cluster), the time each contestant really took. The post can then
say "this is not an animation" and mean it.

**It has a drama.** Most algorithms have a natural arc — let it show:
- *a slow start, then acceleration*: the simulation steps per frame ramp up
  (e.g. 0.4 → 2 steps per frame over the piece), so the beginning is readable
  and the end is dense — "slow at first, never dragging";
- *a eureka*: the moment a metric crosses its threshold (the maze is solved,
  the water percolates, the arms lock in) gets a change of colour and a bell;
- *acts*: switch a rule off and watch the collapse, add a predator, change a
  parameter regime (reaction-diffusion: spots → labyrinth → boiling →
  starvation), each act a few seconds.

**Shapes it comes in:**
- *portrait* — one run, one arc, a panel with the live counters;
- *anthology* — the same algorithm three times at different scales or
  regimes, side by side or one after another, ending on what they share
  ("always near 0.59");
- *tournament* — three rounds of "place your bets → race → the winner's banner
  → one line of why", then the conclusion; different problems per round so the
  winner changes;
- *tour of regimes* — one system through its parameter space.

**Drawing it.** A muted palette (saturation 0.5–0.8) reads as considered; full
saturation reads as a debug view. Light in soft spots (a slow 2D noise), not
in stripes. A highlighted path is drawn by REPLACING colour, not adding it —
additive light on a bright ground washes every hue to white. A path through a
maze is a thin thread (3 px), not a filled corridor. Agents as bright heads
over their own fading trails, or thousands of one-pixel dots disappear. Spawn
in groups (clans, colonies) rather than uniformly — groups make stories.

**Sound is the data.** A low voice follows the main metric, every event
(a merger, a death, a find) is a pluck, the eureka is the bell. Check the
loudness of a sparse mix — loudness normalisation alone leaves it quiet; a
compressor/compand stage brings it to about −14 LUFS.

**The post** says what is real, what the counters mean, the one trick nobody
tells you about this system, and ends with a question ("what should gravity
build next?").


## The journey, measured: One Rule

51 s 16:9 at 60 fps, plus a 29 s native 9:16 cut. The author chose it from
three concepts: "one rule builds networks". No text on screen.

| s | world | into the next by | what is real |
|---|---|---|---|
| 0–7 | an ant on paper finds a sugar crumb, looks at us, blinks | a dive into its pupil | — |
| 6–15 | neurons grow dendrites, spikes run in a chain toward one cell | a dive into its nucleus | space colonisation, spike chains |
| 13–22 | the cosmic web condenses out of a haze | a dive into a knot of filaments | the slime-mold algorithm used on galaxy surveys |
| 20–26 | a spiral galaxy turning | a dive into the Sun | log spirals, differential rotation |
| 24–30 | the Earth, a day crescent, the night lit by 7,342 real cities | a dive into Tokyo's lights | Natural Earth |
| 28–40 | the metro burning at night → a wipe of dawn → a slime mold grows over 144 real stations | a dive into an oat flake | Tero 2010, the real metro |
| 39–51 | a colony takes the short way round a leaf; the red ant carries the crumb | a dissolve to the side view; an iris | the double-bridge experiment |

Its row in the log: structure = one-take chain of worlds · transitions = dives
+ a wipe of light + a dissolve + an iris · camera = continuous push inward ·
character = a guide (the ant) · look = paper & ink · palette = one ground per
world · pacing = calm → dives → calm · sound = synth bed + event hits in D
major · ending = loop to the start. The next piece moves at least three of
these.


## Handing over

Save the master mp4 (and the 9:16 cut, the GIF of a loop) in the working folder under a descriptive name, with the post text in a `.md` next to it. Look at the result yourself — pull a frame, play it through — before showing it; then show the user. Add the piece's row on the axes to the log in the project's `NOTES.md`, under `log:animation`, so the next piece moves away from it (§2).
