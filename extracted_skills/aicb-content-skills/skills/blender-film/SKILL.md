---
name: blender-film
description: Build and render 3D animated pieces that must look real (toy bricks, paper craft, products, clay) as code — a Python script drives headless Blender (`blender -b -P scene.py -- <args>`), Cycles on the GPU, motion planned as a keyframed list that also exports the sound events, heavy scenes rendered in parallel chunks, frames joined by ffmpeg. Holds the setup that works and its traps (factory settings, AgX colour, DOF, backdrop, parallel processes) plus two genre guides in references/ — bricks (a build from real parts, instancing tens of thousands of parts with geometry nodes, build order as drama, models from terrain/map data, several scales in one shot, endings that stay in 3D) and paper_gag (paper material, a pencil line drawn in 3D, a seamless 2–4 s loop). Use when the user asks for a LEGO/brick build animation, a paper-craft gag loop or GIF, a 3D product assembly, a model built from map or scan data, "render this in Blender headless", or a Blender scene from a Python script. The shared craft (idea, axes and log, look, story beats, sound, formats, showing the work) is the `code-animation` skill — read it alongside.
---
# 3D in Blender — the headless scene as code

The instrument behind the pieces that must look
real — the `bricks` and `paper_gag` genres (`references/bricks.md`,
`references/paper_gag.md`): a 3D scene built and rendered by a Python script in
Blender, headless, frames on the GPU, joined by ffmpeg. The idea, the axes
and the log, the look, the story beats, the simulations, the shoot loop, the
sound, the formats and the handover are the `code-animation` skill (its §
numbers are used below as "the `code-animation` skill §N"); this one is the setup that works and the way motion
is planned.

For objects that must look real: toy bricks, paper craft, products,
clay. Blender runs headless from a Python script, so the scene is code like
everything else: `blender -b -P scene.py -- <args>`, frames rendered on the
GPU and joined by ffmpeg as usual.


### 9.1 The setup that works

Blender 4.5 LTS from the official tarball (`download.blender.org/release`,
unpacked to `/opt`, linked into `/usr/local/bin`). Under WSL with an NVIDIA
card, Cycles found the GPU as CUDA (OptiX was not offered); 1080×1080 at 64
samples with the denoiser cost about 4 s per frame on an RTX 5070 Ti, so a
30 s square piece at 30 fps is about an hour. Iterate on stills at 16 samples
and half size, then render once. Without a CUDA card at hand (a Mac, a
laptop), the same script runs unchanged on a rented GPU box (e.g. Vast.ai)
over SSH — see the `code-animation` skill §11 and "Rendering elsewhere" below.

**A heavy scene is CPU-bound: render it in parallel chunks.** With hundreds
of thousands of instances animated by geometry nodes, each frame spends ~3 s
on the CPU (re-evaluating the instances, rebuilding the BVH) and ~2 s on the
GPU. One process leaves the GPU idle most of the time. Run 3–4 `blender -b`
processes on separate frame ranges (`f:0-246`, `f:247-493`, …) into one
folder. While one process prepares its frame, the GPU traces another's:
three chunks gave about 3–4× the throughput of one. Each process holds its
own copy of the scene, so count the RAM (WSL gets half the machine's by
default).
Also cut what costs time for nothing visible: 4 light bounces instead of 12,
adaptive sampling, 32 samples with the denoiser.

```python
import bpy, sys
argv = sys.argv[sys.argv.index('--') + 1:]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'CUDA'; prefs.get_devices()
for d in prefs.devices: d.use = d.type != 'CPU'
sc.cycles.device = 'GPU'; sc.cycles.samples = 64; sc.cycles.use_denoising = True
sc.render.use_motion_blur = True; sc.render.motion_blur_shutter = 0.5
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Punchy'
```

What the first test taught:

- `read_factory_settings(use_empty=True)` also drops Blender's bundled
  assets, so `shade_auto_smooth` fails ("No asset found … Smooth by Angle").
  Use a bevel modifier and flat shading, or set normals yourself.
- Colour management decides the look. `Standard` burns white bricks into
  flat white; AgX keeps them but takes saturation out of bright colours:
  push base colours about 20 % more saturated than the target, and check a
  still with a white object in it before rendering.
- Depth of field at f/2.8 turns a toy into a macro shot of mush. The brick
  pieces at the end keep almost everything sharp: f/8 or no DOF, and let motion
  blur on falling parts do the work.
- A seamless backdrop (a floor subdivided and bent up into a wall, one
  matte colour, the world light in the same hue) has to extend well past
  the camera's orbit, or its edge swings into frame halfway through.
- Save the `.blend` next to the script (`bpy.ops.wm.save_as_mainfile`) so
  the author can open the scene in the Blender app and look around.

### 9.2 Motion is a plan, keyframed

As in the `code-animation` skill §4.1, the frame is a function of its number: a Python list says what
happens when (part, final position, landing frame) and is written into
keyframes; the render just plays it. The same list exports the events for
the sound (the `code-animation` skill §12). Rigid-body physics is fine for a pile that collapses, but
bake it and treat the bake as the plan.

```python
for part, (x, y, z), land in plan:              # the build order is the timeline
    part.location = (x + jitter(), y + jitter(), z + 9)
    part.rotation_euler = random_tumble()
    part.keyframe_insert('location', frame=land - 14)
    part.keyframe_insert('rotation_euler', frame=land - 14)
    part.location = (x, y, z); part.rotation_euler = (0, 0, 0)
    part.keyframe_insert('location', frame=land)          # lands
    part.keyframe_insert('rotation_euler', frame=land)
    part.location = (x, y, z + 0.12); part.keyframe_insert('location', frame=land + 3)
    part.location = (x, y, z);        part.keyframe_insert('location', frame=land + 6)  # settles
```

Set the fall's first key to `EASE_IN` (it accelerates like something
dropped) and the settle to Bézier. The camera sits on an empty that turns
slowly (30–40° over a shot), with a Track To constraint on a target that
rises as the build grows.


## 9.3–9.9 The genres

What a build is made of (real parts, sub-assemblies, instancing tens of
thousands of parts, the build order as the drama, a model from data, several
scales in one shot, endings that stay in 3D) is `references/bricks.md`;
the paper material, the drawn line in 3D and the loop are
`references/paper_gag.md`. Both run on the setup above.

## Rendering elsewhere

Without a CUDA card at hand (a Mac, a laptop), or when the render is longer
than the author wants to wait, the same script runs unchanged on a rented
GPU box (e.g. Vast.ai) over SSH (the `code-animation` skill §11) — the project
goes up over rsync, `blender -b` runs there under tmux with a progress log,
frames and the master come back.

---

*Part of the free [AICB content skills](https://github.com/corj1k/aicb-content-skills). What a skill alone cannot do — reads of X / Reddit / Instagram / Google as tools, monitoring, posting from your own browser, the timeline, a render box — is [AICB](https://aicb.notpeople.ai).*
