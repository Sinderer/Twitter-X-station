# bricks — a build from real parts

## What it is

A **build**: an object assembling itself from its real parts, in the real
build order — a robot of 1,100 bricks, a city of 17,600 parts from terrain
and map data — rendered in Blender from a Python script, then the artefact
that proves it (the instruction booklet flipping, the model dissolving into
the real map). Objects that must look real: toy bricks, products, clay. The
scene is code like everything else (`blender -b -P scene.py`), the frame is
a function of its number, the plan is a list of (part, position, landing
frame) that also exports the events for the sound.

> Section numbers (§1, §4.3, §12 …) refer to the `code-animation` skill's SKILL.md — the common craft: the idea, the axes, the look, the canvas toolbox, the story beats, the simulations, the shoot, the sound, the formats, the handover. §9.x refers to the `blender-film` skill (§9.1–9.2 in its SKILL.md, §9.3–9.9 below).

### 9.3 A build from real parts

The brick piece described at the end (24 s, 1:1): a robot designed from
about 1,100 real parts, shown assembling itself, then its 140-page instruction
booklet flipping. What makes it convincing:

- **Real parts, real order.** The parts list and the build steps are data
  (a model file, a CAD export, a list the piece computed), and the
  animation follows them: the base plates first, then each layer. Anyone
  who pauses sees a buildable model. The post can then say what was
  checked (connections, collisions, centre of mass), as in §6.
- **Sub-assemblies side by side.** The feet, the legs and the body build at
  the same time in different spots on the floor, in bursts of a few parts,
  each burst landing with a small dust puff. Then the finished groups fly
  together and lock; the camera pushes in on the join.
- **Parts arrive along their insertion axis**: plates and bricks drop from
  above, axles and pins slide in sideways, 6–10 frames, blurred by their
  speed, and stop dead. A slight tumble only while a part is far away.
- **Colour tells the structure**: one colour per functional group (orange
  feet, grey legs, white shell), on a pastel backdrop that none of them
  uses.
- **The second act is the artefact**: the booklet opens on its cover, a
  step page, then pages flip faster and faster. It proves the build is
  real and gives the piece its ending.


### 9.5 Tens of thousands of parts: instancing

When a model has more than a few hundred parts, do not make an object per
part. One point cloud holds one point per part with its attributes:
`tid` (which template), `col` (colour), `land` (the frame it lands),
and whatever the plan needs (a group's join frame, a group's offset).
Geometry nodes do the rest: Set Position computes the motion from Scene
Time (the fall, the group's slide), then Instance on Points with Pick
Instance takes the template from a Collection Info of part templates; the
material reads `col` with an Attribute node of type Instancer. Building
the scene stays instant at 20k parts, and a 1080² frame renders in ~4 s.

- **Collection Info with Separate Children orders the children by NAME**,
  not by creation order. Name templates `t000_…`, `t001_…`; otherwise every
  part gets the wrong template and the model looks like rubble with holes
  and spikes (easy to mistake for a design problem).
- Hide a part before its moment by scale 0, never by removing the point:
  the instance count must stay constant.
- Cycles gives these instances motion blur; falling parts smear like the
  references.

### 9.6 The build order is the drama

A build is watched for the order parts arrive in. Plan it as data:

- A pure layer-by-layer order spends the first seconds on the hidden
  inside (in a landscape: seconds of brown). A **front** sweeping across
  the model, bottom-up inside each band, shows finished surfaces in the
  first second and keeps the eye on one moving edge.
- After any ordering, one pass enforces physics: a part lands after the
  parts it stands on (push its frame past the latest supporter's).
- Groups (modules, sub-assemblies) build at the same time in different
  places, then slide together; baseplates arrive just before the first part
  that needs them, so the opening is not empty plates.
- Ease the rate: slow enough at the start to read single parts, faster in
  the middle.
- **Time follows what the eye tracks, not the count of parts.** Give each
  place on the path its frame and let parts take the frame of where they
  are. Pacing by part count flashes the light areas (a flat lawn is a few
  plates) and drags on the heavy ones (a hollow hill is thousands).
- **Never squeeze landing frames min-max after the physics pass.** Long
  support chains push a few parts far out; the squeeze then crowds every
  other part into the first frames and the model stands finished at frame 0.
  Scale down only when the maximum overshoots the window, or map by rank.
- **The fall depends on where the camera looks.** A fall of ~14 units over
  9 frames is fine seen from above. Seen from the side, the same fall is a
  cloud of smeared bricks in the air. From the side, fall ~3–4 bricks over
  6 frames: the part snaps in. A model at another scale gets its own fall in
  its own units (one node group per fall).
- **Baseplates waiting for parts show.** Black ones read as a trench next to
  the build. Use a colour close to the ground (dark tan, green).

### 9.7 When the model comes from data

Most 3D pieces are designed objects: a robot, a character, a product, a
machine, modelled part by part like the brick robot of §9.3. Generating
the model from data is one option among others, for the rare idea that is
itself about real data (a place, a scan, a simulation's output). When it
is:

- **Voxels, then parts.** Rasterise to a stud grid, heights in plates;
  pack each layer greedily into standard bricks (3 plates tall where three
  layers agree) and plates, tiles on smooth tops (water, roads, roofs),
  the orientation preference alternating by layer.
- **Check it.** Union-find over "sits on and overlaps"; a tile holds
  nothing on top. Report the number of floating parts; the goal is 0.
- **Hollow what a builder would hollow**: a shell one brick thick, all
  exposed faces kept, 2 × 2 pillars on a regular grid. Then loop: pack →
  find floating parts → a support column under each → pack again.
- **Design the data, or it is noise.** Data cell by cell reads as rubble.
  Smooth and quantise (terraces one brick high, heights in whole bricks),
  drop detail below the grid's scale, use a calm palette with strong
  colour kept for the few things the viewer should find, fill one-cell
  gaps. Look at a still after each of these; the difference is large.

### 9.8 Several scales in one shot

A landmark with a far view (a monument and the mountain behind it, a tower
and the sea) cannot be one model at one scale. Build it the way an
architecture set does: a detailed model near, microscale beyond.

- **One origin in metres for everything.** Every model is placed by where
  its grid's corner is in metres from one point, and scaled by its metres
  per stud over the near model's. Check landmarks against a real coordinate
  before building on them.
- **Near: modelled from dimensions** when the maps do not hold the thing.
  Use published numbers (length, rise, levels, heights) and write the model
  as code: a height profile along the axis, bands across it.
- **Middle: a skin, not a solid.** A city over a slope is the ground's
  surface and the risers between its terraces, not a hollow hill (a quarter
  of the parts). Say where the "no
  floating parts" claim holds (the near model), and do not make it for the
  rest.
- **Far: at its real bearing and distance, drawn bigger.** Put the far model
  where it really is, at its own scale (one stud = hundreds of metres).
  Enlarge it 1.5× if a normal lens makes it too small, and say so in the
  caption. Fade the outer edge of a terrain crop to the plain, or the crop
  shows as a wall.
- **Haze by log distance** in the brick material and on the ground plane:
  mix towards the sky colour and add a little emission of it, mapped over
  log(distance) so the near, middle and far each get a share. A ground plane
  without the same haze shows as a band at the horizon.
- **Composition before animation.** Put the camera on the line from the far
  landmark through the subject, so both fit one frame. Try 3–4 stills at
  540 × 960 and 32 samples (3–7 s each) before any animation.
- **Storyboard every change.** Render one frame per second at 360 × 640 and
  16 samples and hand the sheet to the author (§14).

### 9.9 Endings and extras that stay in 3D

- **A match to reality**, for a model of something real. End on a view
  that can be laid over the real thing: straight above with a long lens (small parallax), north up (Track
  To with `UP_Y`, the camera a hair off the vertical). Project the model's
  corners with `world_to_camera_view` in a `corners` mode, draw the real
  map for the same square and cross-fade it in at exactly that place. The
  model turns into the source, which proves it without a word.
- **Text in the model's own material.** A pixel font turned into parts and
  dropped with the same geometry nodes, rendered in a separate pass with
  `film_transparent` and the floor as a **shadow catcher**, so the parts and
  their shadows land on whatever the compose step puts under them.
  `film_transparent` alone does not hide a floor plane.
- **Sound from the plan**: recorded clicks on the real landing frames,
  thinned to a few per frame (thousands of landings played one by one are
  a hiss), a heavier hit when groups lock (§12).
- **Pages from the same scene.** Step images for an instruction booklet or
  a carousel: the same plan at chosen frames, one group alone, orthographic,
  on white with the floor hidden.


## The bar, measured

What a finished piece looks like, measured frame by frame on the piece that set the bar in September 2026. Everything needed to hit the same quality is here; there is nothing to go and look up.

### Bricks: a build (24 s, 1:1, 1080×1080, 30 fps)

- **Ground**: one seamless pastel sky-blue, `#aedef6`, filling 45–75 % of
  every frame; no horizon, no texture. Shadows on it are soft-edged,
  blue-grey (`#8abac6`), long and to one side: one sun low at about 40°,
  plus fill light so the shadow side of a brick never goes below mid-grey.
- **Parts**: three colour groups, one per function: orange feet (`#d27e4e`
  lit, `#ba724e` shade), grey legs (`#727272`/`#666666`), white shell
  (`#eaeaea`/`#d2d2d2`). Studs, holes and axles are modelled; small bevels
  catch a highlight on every edge. Black axle pins are the only dark accent.
- **Motion**: sub-assemblies (two feet, two legs, the body, the head) build
  at the same time in different places in the frame, each in bursts of 2–6
  parts. A part arrives along its real insertion axis: plates and bricks
  drop from above, axles and pins slide in sideways, all in 6–10 frames
  with heavy motion blur, and stop dead (no bounce). Small white dust puffs
  where a burst lands. Built groups stay almost still while new parts come
  in, so the eye always knows where to look.
- **The join**: finished groups fly together (legs onto feet, body onto
  legs, head on top), each a 10–15-frame move, the camera pushing in so the
  model fills the frame at the end, then a slow turn on the finished model.
- **Camera**: slightly high (25–35° down), a long lens (little perspective
  distortion), a slow drift or orbit; cuts only between groups.
- **Second act (last ~8 s)**: the instruction booklet on the same blue
  ground. Cover (title, a render of the model, piece and step counts), a
  "how to read the steps" page, then step pages: a step number, a parts
  call-out box with the new parts, an isometric render of the state with
  the new parts outlined. Pages turn on a spine with motion blur, slowly at
  first, then a fast riffle, ending on the parts inventory page.
- **Sound**: a music track with a steady pulse and a crisp click for every
  landing, dense rattles for bursts.


Its row on the axes of §2, for the log:

- *Bricks* — structure = a build · transitions = parts joining, a cut to
  the booklet · camera = high, long lens, slow orbit, push-ins · character
  = none · look = 3D toy · palette = three part colours on pastel blue ·
  sound = music with a click per landing · ending = the artefact.

## A second bar: Old Tbilisi in bricks

Made in September 2026 for wan2ted: 520 × 520 m of Old Tbilisi (Narikala,
the sulphur baths, Metekhi) as a 128 × 128-stud model of about 17,600
parts, 1:1 and 9:16, 23 s.

A case, not a template. It worked because this idea was about a real place;
the next 3D piece starts from its own idea (§1) and moves at least three
axes away from this row in the log (§2): a different subject (an object, a
character, a machine, not another map), structure, camera and ending.

| s | what | how |
|---|---|---|
| 0–10 | four 64 × 64 modules build side by side, a front sweeping each | §9.5, §9.6 |
| 10–12 | the modules slide together and lock, a clack each | the `spread` offset easing to 0 |
| 12–17 | a low orbit over the finished model | camera keys |
| 17–19 | the camera rises straight above | long lens, north up |
| 19–20 | the model dissolves into the OpenStreetMap map of the same square | §9.8 |
| 20–23 | TBILISI and the part count fall onto the map in red bricks | §9.8 |

Data: SRTM terrain (`elevation-tiles-prod/skadi` on S3; Copernicus GLO-30
has no tiles for Georgia), OSM buildings, river, green, streets and the
fortress's `barrier=city_wall` (Overpass was busy; the plain
`api.openstreetmap.org/api/0.6/map?bbox=` worked). Model: terraces one
brick high, white walls and rust-red tiled roofs, orange domes for the
baths, the Orbeliani bath blue, hollow hill on pillars, 0 floating parts.
The instruction booklet was made (the pages exist) and left out of the
film: the viewer is a future client of the studio, not a builder; the
pages became a carousel. Sound: a marimba ostinato at 100 bpm, clicks
from a public-domain Commons recording on the landing frames.

Its row in the log: medium = 3D bricks · structure = a build from real
data · transitions = groups joining, a match to the real map · camera =
close start, pull back, orbit, rise to the top · character = none · words =
a title in bricks · look = 3D toy on a warm peach ground · palette = white,
rust, green, one blue, one orange · sound = marimba + recorded clicks ·
ending = the model becomes the map.

## Handing over

Save the master mp4 (and the 9:16 cut, the GIF of a loop) in the working folder under a descriptive name, with the post text in a `.md` next to it. Look at the result yourself — pull a frame, play it through — before showing it; then show the user. Add the piece's row on the axes to the log in the project's `NOTES.md`, under `log:animation`, so the next piece moves away from it (§2).
