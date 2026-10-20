---
name: code-animation
description: Make short animated pieces (a 3-second loop to a 60-second film) where every frame is drawn by code — a canvas 2D page or a pixel-art buffer shot frame by frame in headless Chromium through Playwright and joined by ffmpeg — with real simulations (agents, growth, physics), a designed look, directed transitions, sound synthesised from the picture's own events, and native 16:9 / 9:16 / 1:1 / GIF-loop formats. Holds the craft every genre shares (idea, axes and log, look, canvas toolbox, story beats, simulations, shoot loop, sound, formats, showing the work) plus four genre guides in references/ — algo_film, pixel_story, storybook, panel. Use when the user asks for a generative or algorithmic animation, a code-drawn short film, a simulation visualization (ants, slime mold, flocking, galaxies, reaction-diffusion), a pixel-art story, an illustrated storybook animation, an instrument-panel/HUD visual, or says "animate this in canvas", "make it a loop", "render a Reels cut of it". 3D pieces (bricks, paper craft) use the `blender-film` skill on top of this one.
---
# Animation drawn by code — the common craft and the canvas

Short animated pieces, from a 3-second loop to a
60-second film, where every frame is made by code: a canvas page shot
frame by frame, a pixel-art buffer, or a 3D scene built and rendered by a
Python script in Blender. The simulations in them are real (agents, growth,
physics); the look is designed; the camera and the cuts are directed. This
skill is about what separates such a piece from "a canvas demo":

- an idea worth the running time: true, surprising, the author's own;
- a form chosen for THIS piece, not repeated from the last one (§2);
- a visual language, and every simulation translated into it (§3–4);
- worlds that move into each other instead of cutting (§5);
- a story when the piece has one: beats, a gag, a payoff (§7);
- the medium that fits: canvas 2D (§4), pixel art, 3D (the `blender-film` skill);
- a sound made of the picture's own events (§12);
- finished formats: desktop 16:9, a native 9:16 cut, square, a loop (§13).

**The genres each have their own guide** — what the piece
is, the medium's own rules, the measured bar and the example that set it:

| kind | the piece | medium | guide |
|---|---|---|---|
| `algo_film` | a portrait of one algorithm, or a journey through worlds tied by one rule (One Rule) | canvas 2D | `references/algo_film.md` |
| `pixel_story` | a story in beats in a small game world (the juice lab) | pixel buffer | `references/pixel_story.md` |
| `storybook` | a life-cycle story as an illustrated storybook (the ant and the watermelon) | canvas 2D | `references/storybook.md` |
| `panel` | one filament object through named states inside a lab instrument's HUD | canvas 2D | `references/panel.md` |
| `bricks` | a build from real parts (the robot, Old Tbilisi) | Blender | the `blender-film` skill's `references/bricks.md` |
| `paper_gag` | a 2–4 s gag loop of paper characters | Blender | the `blender-film` skill's `references/paper_gag.md` |

Ask **which kind** first — or propose three (§2) — then read that guide and
come back here for the craft every kind shares: the idea (§1), the axes and
the log (§2), the look (§3), the canvas toolbox (§4–5), the story beats
(§7), the simulations (§10), building and shooting (§11), the sound (§12),
the formats (§13), showing the work (§14). All are made with the same
principle: a frame is a function of its number.

The piece that set the bar is **One Rule** (September 2026) —
`references/algo_film.md`. It is one answer to every question below; the next piece gives
different ones.

## 1. Finding the idea

Most of the quality comes from here. The code can draw anything; people watch
to the end when every step feels like a discovery.

**Start from the author.** The author's voice and the brief for the piece, what they post
about, what their audience comes for. Ask for the subject in one sentence and
for two or three things they love — a film, a painter, a place, a piece of
music. Examples beat adjectives.

**Look for a chain of true rhymes** — things at different scales or in
different places that share a structure, a rule or a shape. One Rule's links
were published science (slime mold ↔ Tokyo railways, Tero 2010; the same
algorithm ↔ the cosmic web, Burchett 2020; cosmic web ↔ neurons, Vazza &
Feletti 2020). A true link makes a transition feel like a revelation; a visual
pun makes it a trick.

Where rhymes are found: web search (in the browser, or with whatever search tool is connected) for "X looks like
Y", "same pattern at every scale", "why does X resemble Y" — then the paper or
museum page it points to, not the listicle; and the author's own field. A
baker: sourdough bubbles → foam → soap film → Plateau's laws → cells. A
musician: a plucked string → standing waves → Chladni figures in sand → the
cochlea. A finance author: a coin → an order book → a price line like a
heartbeat → a crowd. Others: a raindrop → a river delta → blood vessels →
lightning → roots; a letter → a street grid → a circuit board → a city at
night; a snowflake → a crystal lattice → honeycomb → basalt columns.

Not every idea is a chain. One process watched growing (a city, a crystal, a
flock), one rule shown in five costumes, one object seen at ten scales, one
question answered in a race — §2 has the shapes.


## 2. Not one format: deciding what THIS piece is

A piece is a set of choices along several axes. Two pieces that share the idea
but differ on four axes look like different authors; two that differ only in
colour look like the same film twice. Keep a log of what this author already
made in the project's `NOTES.md`, under the heading `log:animation` —
one line per piece on the axes below, started with the first piece;
read it back next time. Before proposing concepts, read it, and write every concept's position
on these axes next to it:

| axis | some positions |
|---|---|
| medium | canvas 2D (§4) · pixel art (`pixel_story`) · 3D in Blender (`blender-film`) · 2D characters over a 3D set |
| structure | one-take chain of worlds · one algorithm portrait · an anthology (one algorithm, three scales or regimes) · the same rule in N costumes · a race/tournament · a loop that never ends · question → experiment → answer · a story in beats (§7) · a build from parts (`bricks`) · a 3-second gag loop |
| transitions | dive into an object · pull-out reveal · particles that become the next thing · shape match-cut · a wipe of light · a change of time or season in place · a dissolve on shared paper · iris · none (one continuous world) |
| camera | still frame · slow drift · one long push · dives · orbit · tracking a character |
| character | none · a guide (an ant, a drop, a spark) · a cast with roles (the scientist, the boss, the intern) · the author's mascot · the viewer as the character · the data itself as the character |
| words on screen | none · chapter cards · speech bubbles · a HUD with live numbers · a payoff title |
| look | §3 table — paper & ink is only one line of it |
| palette | one hue per world · two spot colours for the whole piece · black and white with one accent · full night neon |
| pacing | even · accelerating to a climax · calm–burst–calm · on a musical beat |
| sound | synth bed + event hits · percussion made from the simulation · one solo instrument · a drone and silence · field recordings re-synthesised |
| ending | loop to the start · a reveal · a question · a freeze on the result · a payoff title and a button (§7) · the artefact (the booklet of the model just built) |

Three concepts for the author, different from each other on at least three
axes AND different from the log on at least three. After the author picks, add
the finished piece's row to the log.

Shapes that work, beyond the chain of dives:

- **One world, evolving** — no transitions at all: a city grown from one
  street, a coral reef, a galaxy collision. The drama is in time: slow start,
  runaway middle, a settling. Camera: one long, very slow push.
- **Same rule, five costumes** — flocking as birds, fish, cars, stars,
  people; each costume 6–8 s, linked by particles that keep their motion and
  change their drawing (§5).
- **Race / tournament** — several processes solving one problem side by side;
  the transition is the result banner.
- **Question → experiment → answer** — "why is a honeycomb hexagonal?" asked
  in one frame, tested by a simulation, answered by the picture.
- **Endless loop** — a cycle whose last frame is its first: water cycle,
  a seed to a tree to a seed.
- **A metaphor taken literally** — a phrase people say about the subject,
  built as a machine: "this model is pure juice" → a lab with a
  Juice-o-Matic extracting juice from a UI, a purity gauge climbing to 100 %
  (§7).
- **A build** — the object assembles itself from its real parts, in the real
  build order, sub-assemblies side by side, then they join; the second act
  is the artefact that proves it (the instruction booklet flipping, `bricks`).
- **A gag loop** — 2–4 s, one action and its reveal, the last frame is the
  first: a paper character draws a twin with a pencil, the drawing pops into
  a real one, they look at each other (`paper_gag`).


## 3. The look

Choose the visual language from the subject, and check it against the log.

| language | how it is drawn on a canvas |
|---|---|
| paper & ink | paper texture, doubled wobbly strokes, pencil hatching, boiling grain (One Rule) |
| risograph | 2–3 spot inks, each layer offset a few px (misregistration), halftone dots, overprint with `multiply` |
| blueprint | cyan ground, white hairlines, dimension arrows, faint grid, stencil lettering |
| woodcut / linocut | solid black shapes, hatching that follows the form, white gouges, grain |
| watercolour | blurred field + darker rim (bloom), granulation noise, colour crossing the lines |
| chalkboard | dusty broken strokes (dash + jitter), a smudge layer, erased ghosts |
| cut paper / collage | layered flat shapes, soft drop shadows, torn edges from noise, fibres |
| engraving / science plate | stipple and cross-hatch by tone, thin frame lines, a plate number |
| ukiyo-e | flat colour areas, bold even outlines, bokashi gradients, wave and cloud motifs |
| neon / night | dark ground, additive glow, a hot thin core inside a wide soft line |
| pixel | low-res buffer upscaled nearest-neighbour, 16 colours, ordered dithering; a whole game world with sprites, bubbles and a HUD (`pixel_story`) |
| illustrated storybook | flat fills with an ink outline, coloured-pencil texture inside the fills, soft diagonal light bands across the paper, and the drawing's own construction lines left visible (`storybook`) |
| 3D toy / bricks | real parts, a seamless one-colour backdrop, one soft sun, motion blur on falling pieces, deep focus (`bricks`, the `blender-film` skill) |
| 3D paper craft | folded-paper characters with printed faces, pale paper cut edges, a warm tabletop, a real pencil (`paper_gag`) |
| instrument panel | one luminous object made of thousands of fine filaments and sparks on near-black, framed by the HUD of an imaginary lab instrument: live meters, a dial, a scrolling register, chapter tabs (`panel`) |

**A simulation looks like "a simulation" until it is drawn in the piece's
language** (§4.5). What holds different worlds together is the line and the
grain; each world can keep its own ground and palette.


## 4. The toolbox: drawing a world

Everything below is plain canvas 2D. The snippets are from the engine One
Rule was made with; the tricks carry over to any look. Pixel art has its own
rules (`references/pixel_story.md`), 3D its own tools (the `blender-film` skill); the ideas (a frame as a function of its
number, the living line, acting beats) carry over to both.

### 4.1 A frame is a function of its number

```js
renderFrame(ctx, f)     // pure: same f → same picture, however slow
scene = { init(), step(lf), camera(lf), portal(lf), draw(ctx, lf, cam, clip) }
```

Simulations step once per frame with seeded random numbers (`mulberry32`),
never by the clock; `hash2(i, frame, seed)` gives per-element jitter that is
stable within a frame. A timeline lists scenes with overlapping windows — the
overlap is where a transition lives (§5).

### 4.2 The ground: never a flat colour

A flat fill is what makes vector art look like vector art. Generate the ground
once per world into an offscreen canvas: two octaves of noise at a few % of
brightness (large blotches + fine tooth), a few hundred short curved fibres
at 2–5 % alpha, a few thousand specks, a soft vignette. For a dark world the
same, with light fibres. Then a grain on top of the FINISHED frame, in
`overlay` mode at ~8 %, switched between three noise frames at 12 fps — that
is the glue that makes vector shapes, simulations and fields sit in one film.

```js
function grain(ctx) {
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.085;
  ctx.drawImage(GRAIN[Math.floor(frame / 5) % 3], 0, 0, W, H);   // boils at 12 fps
}
```

### 4.3 The living line

Hand animation redraws every drawing slightly differently each few frames.
Two things make a code line feel alive: every stroke laid twice, each pass with
its own wobble; and that wobble re-seeded at 12 fps ("boil"), not every frame
(60 fps jitter reads as noise, 12 fps reads as drawing). Amplitudes are in
SCREEN pixels, divided by the zoom, so a line looks equally hand-made at any
scale.

```js
const boil = () => Math.floor(frame / 5);
function jitterPts(pts, amp, seed, z) {
  const a = amp / z, b = boil();
  return pts.map(([x, y], i) => [x + (hash2(i, b, seed) - 0.5) * 2 * a,
                                 y + (hash2(i, b, seed + 7) - 0.5) * 2 * a]);
}
function ink(ctx, pts, cam, o) {                       // two passes, the 2nd thinner
  for (let k = 0; k < 2; k++) {
    ctx.lineWidth = (o.w * (k ? 0.7 : 1)) / cam.z;
    tracePts(ctx, jitterPts(pts, o.amp, o.seed + k * 31, cam.z));   // quadratic through midpoints
    ctx.stroke();
  }
}
```

### 4.4 Shading, light, depth

- **Hatching** — clip to the shape, draw parallel lines at an angle across its
  bounding circle, each line's offset jittered by the boil; `mask(d)` keeps
  hatching to the shadow side only. Shadow without a gradient in sight.
- **Glow** — a radial gradient in `lighter` mode: centre colour at full, 35 %
  at a third of the radius, 0 at the edge. Stack two (wide faint + small hot).
  Remember that a radial gradient paints its first stop INSIDE the inner
  radius — a ring must start transparent at radius 0.
- **Depth** — a back layer drawn with a camera that moves less
  (`cam(c.x * 0.6, c.y * 0.6, c.z * 0.72)`) and at a quarter of the opacity;
  distant stars at half parallax. Two layers are enough to make a flat world
  deep.
- **Additive vs multiply** — light on dark (spikes, city lights, stars) goes
  in `lighter`; pigment on paper (slime, pheromone, watercolour) goes in
  `multiply`, so the paper's texture shows through.

### 4.5 Turning a simulation into an illustration

The single most important trick. A simulation outputs a soft field; drawn
directly it is a blurry heat map. Drawn through bands, it becomes a picture:

```js
// per screen pixel: world → field cell (affine, the camera may be turned) → value
let t = field(fx, fy) * gain;
t = 1 - Math.exp(-t * tone);                  // compress peaks: one clump must not outshine the rest
const q = Math.min(bands - 1, t * bands | 0); // 4–6 flat tones
const edge = q !== leftNeighbourBand || q !== upperNeighbourBand;
colour = palette[q] * (edge ? 0.6 : 1);       // a darker rim on every band edge = an ink outline
```

`gain` comes from a percentile of the field (the 97–99.7th), recomputed every
few frames and smoothed, so a growing field keeps its brightness. Other looks
translate the same field differently: halftone dot size by value (risograph),
stipple density (engraving), a bloom = blurred copy with a darker rim
(watercolour), a lit core line inside a wide dim line (neon).

### 4.6 Things that grow and things that travel

- **Growth** — compute the whole structure first (a tree by space colonisation,
  a network, a crack), store each segment's birth order `t ∈ [0,1]`, and draw
  only `t < grow(time)`. Add a small glow at the tips being born. The growth
  curve is eased (`easeInOut`) so it starts shy, runs, and settles.
- **A line drawn in** — store cumulative length along a polyline and draw up
  to `len × progress`: a ground line, an axon, a route.
- **A pulse that travels** — a hot head at distance `d = (t − t0) × v` and a
  tail of 10–15 fading glows behind it; a flash on arrival that decays
  (`exp(−(t − t_arrive) × 3)`); chain reactions by scheduling the next pulse at
  the arrival time. The schedule is precomputed, so the sound can hit it (§12).
- **Moving data** — trains as beads sliding along real lines, lights
  flickering by `sin(t + i)`.

### 4.7 A character, if the piece has one

- Big, simple, readable at 5 % of the screen and at 100 %. Big eyes — they
  are where the audience looks, and a pupil is a perfect portal.
- **Walk cycle from distance, not time:** `phase = distance / strideLength × 2π`,
  so feet never skate when the character speeds up or stops. Legs in groups
  (an insect's tripod gait: two groups in antiphase); a foot lifts on a sine
  during swing; the body bobs a little at each step.
- **Secondary motion** — antennae, tails, hair on their own slow sines; they
  keep moving when the body stops, which is what makes a still pose alive.
- **Acting beats before a transition** — stop, turn the head toward the camera,
  blink (an eyelid is a filled shape clipped to the eye, sliding down on a
  sine), then the camera moves. The beat tells the audience "watch this".
- **Anticipation** — a small dip before a hop, a reach of the antennae before
  a pick-up.

### 4.8 Fast enough to iterate

- Batch many small shapes into one `Path2D` and fill/stroke once; group by
  colour so `fillStyle` changes a few times per frame, not thousands.
- Typed arrays for every simulation; precompute anything static per pixel
  (distance maps, noise) once in `init`, never per frame.
- Offscreen canvases for masks (a day/night terminator, a wipe) and
  `destination-in` / `destination-out` to apply them.
- Grid resolution: a simulation cell of 1–2 screen px at the widest shot.


### 4.9 The storybook look and its construction lines

Moved into `references/storybook.md`: fills, ink, light, and the drawing that shows its own geometry.

### 4.10 Filaments and an instrument panel

Moved into `references/panel.md`: the filament surface, its states and morphs, the HUD that behaves.

## 5. The toolbox: moving between worlds

Cuts are cheap; a transition that keeps the eye inside the picture is what
makes it a film. Use two or three kinds in one piece, not one kind six times.

**Dive into an object.** Scene A's camera zooms exponentially toward an object
until its radius covers the screen's half-diagonal; B is drawn clipped to the
object's shape with its own camera scaled by (window radius ÷ final radius)
and an extra zoom-out that decays to 1 — the window grows faster than the world
in it, so B OPENS rather than grows. At the end B's camera is exactly its own:
no cut.

```js
const g = easeInOut(u), r0 = p.r * base.z, R1 = halfDiagonal * 1.04;
const rs = r0 * Math.pow(R1 / r0, g);                  // window radius on screen
const ps = lerp(toScreen(base, p), centre, smoother(u / 0.8));   // centre it early
const camA = cam(p.x, p.y, rs / p.r, ps);
const s = rs / R1, open = Math.pow(1 / E, 1 - g);      // E ≈ 1.6–2.8
const camB = cam(b.x, b.y, b.z * s * open, ps + (b.c - centre) * s);
drawA(camA); clip(ellipse(ps, rs)); drawB(camB);
```

What sells it: a hint of B inside the object a second before (sparks in a
nucleus); the object's rim thickening; speed lines on A while the zoom is
fast; B's colour glowing out of the window; B already alive (its simulation
runs inside the window); a low thump in the sound as the window covers the
screen. 1.4–1.8 s per dive. B's world must be larger than the frame × E, or its
edges show in the window.

**Pull-out reveal** — the dive backwards: the camera pulls away and the world
we were in turns out to be inside an object of a bigger one (a drop in a
river, a city in a satellite photo). Same math with `u` running 1 → 0.

**Particles that become the next thing** — one set of particles, retargeted:
sunflower seeds lift off and become a flock, the flock tightens into a
spiral, the spiral becomes stars. Each particle springs toward its new target
(`v += (target − p) × k; v *= damping`) while its drawing cross-fades. Nothing
cuts because nothing is replaced.

**Shape match-cut** — end one world on a shape, open the next on the same
shape at the same place on screen: a pupil → a planet, a ring road → a tree
ring. Hold both for 3–4 frames in a quick dissolve.

**A wipe of light** — a change of time within the same place: the night layer
rendered to an offscreen canvas, erased by a soft moving edge
(`destination-out` with a linear gradient), and a warm band of light riding
that edge in `screen` mode. One Rule's Tokyo went from night to dawn this way,
and it is where the lights became a pencil map.

```js
nb.globalCompositeOperation = 'destination-out';           // erase the night...
const g = nb.createLinearGradient(edge, 0, edge + soft, 0);
g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)');
nb.fillStyle = g; nb.fillRect(0, 0, W, H);
ctx.drawImage(nightBuffer, 0, 0);                           // ...over the day map
ctx.globalCompositeOperation = 'screen';                    // and the sunrise on its edge
```

**A change of state in place** — the same map, a different material: lights →
pencil lines → a slime mold; a skeleton → flesh; a sketch → paint. The
geometry stays; the drawing changes. Staggered pops (things appearing one by
one with a small overshoot) make the change feel made, not faded.

**A dissolve on shared ground** — when two worlds share the same paper, a
short cross-dissolve (0.3–0.4 s) reads as a change of view, not a cut: One
Rule flipped from a top view of the colony to the side view of the ant this
way.

**Iris** — a circle closing on the character (an even-odd fill of the screen
minus a jittered circle): an ending that says "the end" in every cartoon
language.

**Rhythm.** A transition starts after a beat of stillness (a character's look,
a flash), runs fast in the middle, and lands softly; the next world gets a
moment to be looked at before anything moves again.


## 6. Portrait of an algorithm

The genre is `references/algo_film.md`: the twist that makes it new, honesty, the drama, the shapes it comes in, how it is drawn, the sound, the post — and One Rule, the journey that set the bar.

## 7. Telling a story

A story piece is watched for its characters and its joke, not for a
simulation. Three pieces set the bar (measured in their guides): a pixel-art lab
where crab-like mascots extract "juice" from a UI (32 s, 9:16, `pixel_story`), an ant's
year around a watermelon (29 s, 1:1, `storybook`), and a paper character drawing its twin
(3.4 s loop, `paper_gag`). What they share:

**A premise in one line, taken from the subject.** The strongest engine is
a phrase people already say about the subject, built literally: "pure juice"
→ a Juice-o-Matic. Others: a slang word, a boast, a complaint, a
before/after. The premise is a machine or a process with a number that can
climb, because a climbing number is a plot everyone follows.

**Beats, not scenes.** Write the piece as 6–10 beats of 2–5 s, each with
one thing happening and one reaction to it:

1. *Where we are*: a wide establishing shot and a chapter card
   ("CLAW'D LABS, SUBLEVEL 3"), 2–3 s.
2. *The specimen*: the object of the story, shown big ("SPECIMEN 01: THE
   UI MACHINE"). Push in on it.
3. *The cast reacts*: a speech bubble ("It's… beautiful."), a second
   character tops it ("THOSE ROUNDED CORNERS!!").
4. *The process starts*: a button, a lever, a warning light ("EXTRACTION
   IN PROGRESS"), a pipe glowing as the stuff travels along it.
5. *The spine*: the gauge climbs (42 % … 93 % … 99.7 %), with cutaways to
   the cast leaning in. It slows near the top; a stall before the last
   percent is the suspense.
6. *The climax*: the number hits, flash, shake, particles.
7. *The payoff title*: the premise said once, big and in the piece's own
   lettering ("100% PURE JUICINESS"), with a small deadpan line under it
   ("Certified by Claw'd Labs").
8. *The button*: one last small reaction after the title, so the piece ends
   on a character, not on text.

A life-cycle story (the watermelon) has the same bones: a want (the ant
eats), a journey through the cycle with obstacles (a storm, a flood), time
shown inside the picture (tally marks, a sun and moon strip) rather than in
titles, and the last shot rhymes with the first.

**Speech bubbles.** A box in the piece's lettering with a tail to the
speaker. Text types in at about 25 characters per second with a blip per
character (§12); it stays for 0.5 s + 0.06 s per character, then pops off.
Short lines: two to five words. The reaction reads before the line does:
the speaker bounces or blinks as the bubble appears.

**Acting.** The rules of §4.7 apply with more weight: anticipation before
every action, a hold after every surprise, secondary motion (goggles
bouncing, a hard hat wobbling). A cast needs silhouettes that differ at a
glance: glasses, a hat, a lab coat, a clipboard. The author's own mascot
as the cast (a brand character in lab coats) makes the joke theirs.

**The camera tells the story.** Wide for where, push-in for what matters,
cutaway to faces for how it feels. In a single world (one lab), the camera
moves between spots instead of cutting: a pan along the wall, a push into
the machine's screen, a tilt up the pipe.


## 8. Pixel art

The medium is `references/pixel_story.md`: the low-resolution buffer, sprites from code, two clocks, juice, light over pixels, the bitmap font, pixel transitions.

## 9. 3D in Blender

The instrument is the `blender-film` skill: the setup that works, motion as a keyframed plan, rendering in parallel chunks. What a build or a paper piece is made of is in that skill's `references/bricks.md` and `references/paper_gag.md`.

## 10. Making simulations behave

Most of the iteration goes here. What One Rule ran into:

- **Physarum (Jones 2010)** — agents sense ahead-left/ahead/ahead-right, turn
  to the strongest trail, step, deposit. Released as one blob it crawls off in
  a few fat slugs. What grows a real network: high jitter while growing, a
  small chance for a starving agent to jump to a random food source, then a
  pruning phase (stronger decay, less jitter). Food is sensed, never written
  into the drawn trail.
- **Cosmic web** — the same agents born at the galaxies, food weighing far
  more than trail; galaxies placed on the walls of a Voronoi foam.
- **Ant colony** — two pheromones (to food, to home); weight each sensor by
  how much it points toward the ant's goal, or the colony locks itself in a
  loop that has forgotten the nest. An obstacle gives the double-bridge
  moment: two routes, the long one fades.
- **Growth** (dendrites, trees, roots) — space colonisation; thickness by the
  pipe model.
- **A globe** — orthographic projection; a polygon around a pole pinned to the
  limb covers the whole disc, so skip it; lights capped in screen size so a
  zoom does not turn them into tiles.
- **Real data** where the piece claims something real (Natural Earth,
  OpenStreetMap) — baked into one `data.js`, since a page opened from `file://`
  cannot `fetch()` a JSON.

## 11. Building and shooting

- One HTML page, plain canvas 2D (WebGL where a scene needs it), no framework.
- Headless Chromium through Playwright: per frame `render(f)` →
  `canvas.toDataURL('image/png')` → piped into ffmpeg (`libx264 -crf 15
  -pix_fmt yuv420p`). Several workers split the frame range; a worker that
  starts mid-film re-steps the simulations from their scene's start, and each
  of those steps must see its own frame number — anything sampled by frame
  (a brightness estimate) otherwise differs at the seam and flickers.
- **The loop that makes it good:** stills at chosen seconds → one contact sheet
  → look → fix → again. Each scene is brought up on stills before the first
  full render; transitions are checked at 4 frames per second across them. At
  1080p on a CPU a frame costs 0.15–0.45 s; 51 s ≈ 10 min on three workers.
- **3D** goes through Blender instead of the page (§9): one script builds
  the scene, keys the plan and renders PNG frames (`-- out frames samples`
  as arguments, so a still, a range or the whole piece come from the same
  script); ffmpeg joins them. The same stills → contact sheet → fix loop,
  at 16 samples and half size until the look is right.
- **Where it renders.** The numbers above are from one machine with an
  NVIDIA card; the scripts do not care whose machine it is. When the author's
  computer has no card Chromium or Blender can reach, when the projected
  render is longer than they want to wait, or when it is needed for other
  work meanwhile, offer a rented GPU box (e.g. Vast.ai) over SSH for the
  hours of the render, the same scripts unchanged — the project goes up over rsync, the
  same scripts run there under tmux with a progress log, stills and the
  master come back, the box is destroyed when nothing else is queued.
- Keep the engine with the user's work folder. The next piece starts from its
  machinery (timeline, transitions, capture, field renderer, event-synced
  sound, the portrait table) — none of that depends on the look — while the
  structure, the look and the sound are chosen fresh (§2).

## 12. Sound

Synthesised, not licensed: a bed that follows the worlds, and on top of it the
picture's own events on their exact frames — the page exports them (footsteps
from the walk cycle, pulses, arrivals, transitions) and the score places a
sound on each. Choose the sound world like the look (§2): One Rule used
kalimba, bells, pads and noise sweeps in D major with the opening motif closing
the film — the next piece deserves percussion made from its simulation, a
solo instrument, or a drone and silence. Aim near −14 LUFS; a spectrogram
(`ffmpeg … showspectrumpic`) shows at a glance whether every hit landed.

Each medium has its natural sound:

- **Pixel** — a chiptune made the way the old chips made it: two square
  waves (melody, harmony), a triangle (bass), a noise channel (drums, hiss).
  A blip per typed character in a bubble (a square wave, pitch varied a
  little per letter and per speaker), a rising tone that follows a gauge,
  an arpeggio on success, a noise burst on every impact.
- **3D bricks and paper** — foley on every landing from the plan: a brick
  click is a very short noise burst band-passed around 2–4 kHz over a small
  low knock, pitch and level varied per part; bursts of parts give rattles.
  Paper is softer: a filtered brush for sliding, a light tap for landing, the
  pencil a thin scratch that follows the line's speed. Under it, light
  music with a clear pulse; the LEGO piece's track is dense with such hits.
- **Storybook** — one melodic instrument and hits on the character's
  actions (mickey-mousing): a pluck on each step of a climb, a whoosh on a
  fall, a thunder of low noise for the storm, the melody coming back at
  the end with the first shot's rhyme.

When the synthesis sounds "too computer" (one site film heard this twice),
use a recording: public-domain foley from Wikimedia Commons, credited in a
SOURCES file next to it.

## 13. Formats: desktop, Reels, square, loop

The same piece, made for the screens it will be watched on.

**Desktop — X, YouTube, a site (16:9)**

- 1920×1080, 60 fps, 45–60 s, the score embedded.
- Worlds get time: 4–8 s between transitions, long enough to watch a
  simulation do its work.
- The opening can be quiet (a character walking in); the ending holds a beat of
  black for the last chord.
- Delivered: master mp4 (H.264 crf ~15, AAC 256k) and the post text.

**Reels / Shorts / TikTok (9:16)**

- **Render natively, not cropped.** A centre crop of 16:9 is 608 px wide and
  soft when scaled up, and it throws away the sides. The page renders at
  1080×1920 with a per-scene table: extra zoom for scenes that must fill the
  frame, a 90° camera turn for wide worlds (a map, a colony) so they stand on
  end, centred objects (a globe, a galaxy) at their own size. That needs a
  camera with rotation and a field renderer that maps screen → field through a
  general affine transform.
- **≤ 30 s, hook in the first 1.5–2 s** — start at the most striking moment,
  not at the slow opening.
- **Re-timed, still one take** — transitions near real speed (×1.2), the
  worlds between them ×1.6–2, the ending as is; shoot only the source frames
  the new timing needs (simulations still step through all), at 30 fps.
- **Sound** rebuilt on the new clock (a synth does not pitch-shift like a
  stretched recording), plus a version without sound for a trending track.
- Cover from the hook — check the character's eyes are open.
- Key action out of the top ~200 px and the bottom ~350 px.

**Square (1:1)** — 1080×1080. Three of the four pieces at the end
are square: it fills the most of an X or Instagram feed on both phone
and desktop, and it suits a single object in the middle (a model, a
character, a watermelon). Compose for it from the start; 24–30 fps is
enough for illustration and 3D.

**A loop (2–6 s)** — for X, uploaded as a GIF (X shows it as a clip that
loops on its own), 1:1, 25 fps, no
sound. Make it from the rendered frames with ffmpeg's `palettegen` /
`paletteuse` so the colours hold. The last frame must lead into the first without a
jump: plan the piece from the pose it returns to (the `blender-film` skill's `references/paper_gag.md`, "The loop"), and check the seam
by playing it three times in a row.

## 14. Showing the work, and handing it over

**Show before you spend.** The author sees the piece before any render that
takes more than a few minutes, not after it. In order, each handed over as
a path in one line the moment it exists:

1. **Key stills** at final quality: the opening, the middle, the ending
   frame (3–4 images, seconds each).
2. **A storyboard sheet**: one frame per second at small size and few
   samples, labelled with frame numbers (minutes).
3. **A rough animatic**: every frame or every second one at half size and
   few samples, with the draft sound, as an mp4 (minutes to tens of
   minutes).

The final render starts only after the author has seen the animatic: that
is their decision, like the idea and the style. Between these steps keep
working without asking whether to continue. Every sheet or still you look
at to judge the work goes to the author at once; a sheet looked at and not
handed over is a preview the author did not get.

Show the author the full render as soon as it exists. Put the files where the author
keeps their work (under WSL, give the `\\wsl.localhost\…` path), under a
descriptive name, the post text in a `.md` next to the video. Look at the
result yourself first — pull a frame, play the seam of a loop — before you
show it; then show the author. Add the piece's row to the log in the
project's `NOTES.md` (§2).


---

*Part of the free [AICB content skills](https://github.com/corj1k/aicb-content-skills). What a skill alone cannot do — reads of X / Reddit / Instagram / Google as tools, monitoring, posting from your own browser, the timeline, a render box — is [AICB](https://aicb.notpeople.ai).*
