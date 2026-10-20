---
name: video-clips
description: Local video work for short-form content — fetch a source (yt-dlp or a file), probe it, cut windows with ffmpeg, transcribe and burn subtitles (ASS sizing, positions, segment lengths, CJK rules), reframe to vertical, and optionally drive the OpenChatCut editor over MCP for layered montage. Produces clips (15–90 s, vertical, burned captions) ready for X, Reels, Shorts, TikTok, Threads; the genre guide is references/clip.md. Use when the user says "cut a clip from this podcast/stream/video", "make shorts/reels out of this", "burn subtitles", "make it vertical", "clip this Space", or asks about the local video editor.
---
# Working with video

All of it happens on this machine.

You run on the user's machine. Everything below — fetching, probing, cutting,
burning, montage, rendering — runs there too. Nothing waits on a server.

This skill is the instrument. What to make with it is a genre:
`clip` (a short cut from a longer source, `references/clip.md`),
`terminal` and `site_film` (films drawn by code, their instrument is the
`code-film` skill), `animation` (the `code-animation` skill). Writing a throwaway
python or shell script in the working directory to do a repetitive pass is
normal — prefer it to twenty identical tool calls.

## 1. Get the source

Local yt-dlp for public video; your browser (by hand, or a browser automation
MCP such as Playwright MCP / Chrome DevTools MCP) for anything behind a
login or a player you have to sit through; a file already on disk is the best
case and needs nothing. Check what you got before cutting:

    ffprobe -v error -show_entries format=duration -show_entries stream=width,height,codec_name -of default=nw=1 SOURCE

## 2. Which tool — ffmpeg or a timeline

Two ways to assemble, and the choice belongs to the user, not to you. Say what
each buys before starting a piece that might need the second:

  * **ffmpeg** — already installed, nothing to set up. Cuts, concatenates,
    reframes, burns subtitles. No timeline, no layers, no undo: you describe the
    result in commands and it produces a file.
  * **the local editor** — a real timeline: several video and audio tracks,
    transitions, effects, motion graphics, keyframes, version history, and an
    export the user can watch and correct. Costs an install and real RAM
    (section 4 — ask the user before installing anything).

For a straight cut with burned subtitles, ffmpeg is the shorter road. When the
piece has an intro card, overlays, a soundtrack under it or anything stacked, a
timeline stops being a luxury. If you are unsure which one the piece needs, ask
rather than assume — and if the editor is not installed, that question comes
before any work, not after.

### ffmpeg in practice

Stream-copy when you are only trimming (fast, lossless):

    ffmpeg -ss START -to END -i SOURCE -c copy OUT.mp4

Re-encode when you filter, scale or burn. Concat several windows through the
concat demuxer with identical codec params. Vertical: scale + pad over a blurred
copy of the same frame. Burns are CPU-bound — run them one at a time.

## 3. Subtitles: the mechanics

Transcribe locally (whisper.cpp, faster-whisper, any model you have). What
decides quality:

  * Segments stay SHORT — one spoken phrase, ~2-4 s. Coarse 10 s blobs render as
    a wall of stacked lines, because every active event is drawn at once.
  * Transcribe (or read the transcript of) the clip's REAL window. The text for
    a clip starting at 14:20 comes from 14:20, not from the opening of the
    episode.
  * CJK: Japanese has no spaces, so karaoke cannot word-split — keep JA segments
    ≤ ~4 s / ≤ ~22 chars. Korean splits fine but stay modest. Latin renders as-is.
  * One clean cut, one burn per language: the translation keeps the segment
    boundaries and timecodes of the original (you translate the text inside
    each segment, not the timing); burns are CPU-bound, run them one at a time.
  * A finished file does NOT prove the subs rendered. Pull one frame from the
    middle and look, once per language:
        ffmpeg -ss N -i OUT.mp4 -frames:v 1 check.png

## 4. The local editor over MCP

**You never open the editor yourself.** Not in a browser automation MCP, not in
a Playwright window, not to "have a look". Everything you need is an MCP tool:
projects, timeline, clips, tracks, effects, media, render, export. Clicking is
the user's half — they keep the window, you keep the tools.

This is not a style preference. The editor registry holds one window per
project; if you open a second one it evicts theirs, theirs evicts yours back, and
both the editor and your MCP binding break (see «What breaks» below). Opening a
window to inspect something is the fastest way to lose the session you were
working in.

When you want to SEE the result: render it (`submit_export`) or read frames with
the canvas tools. When the user wants to see it: ask them to look in their own
window.

### Is it running?

`openchatcut_status`. Not installed is a normal
first state, not a failure — ffmpeg alone covers most clips.

### Not installed? Ask first, then install

Installing it is the user's call, not yours. Put the trade plainly — roughly:

> Cutting and joining I can do as it is, ffmpeg is already installed. If you
> need real editing — layers, transitions, effects, titles — I will install the
> local editor OpenChatCut. It is open source, runs on your machine, keeps its
> projects in `~/.openchatcut`, renders on your CPU and sends nothing out.
> Rendering asks for roughly 1.25 GB per tab and reserves half of the memory —
> on 8 GB that is three tabs, comfortable from 16 GB. Install it?

Only on a yes:

    git clone https://github.com/0xsline/OpenChatCut.git ~/openchatcut
    cd ~/openchatcut
    # needs Node 24 — installing it beside the system node is fine
    ONNXRUNTIME_NODE_INSTALL_CUDA=skip ELECTRON_SKIP_BINARY_DOWNLOAD=1 \
      npm install --no-audit --no-fund
    npm run dev          # → http://localhost:5199

`ONNXRUNTIME_NODE_INSTALL_CUDA=skip` is not optional: without it the postinstall
fetches a CUDA build, fails, and rolls back the whole `node_modules`. That
package is only used by the packaged desktop build.

Then wire it to Claude — and this part the user clicks, not you. The editor
generates its own access token and writes the connection itself; there is no
token for anyone to copy by hand. Walk them through it in their window:

> The editor is open — top right, find the «External agents (MCP)» button,
> press it, pick Claude Code in the list and hit Connect. It writes the
> connection itself, nothing to copy.

Then the restart, said the same way, because it sounds like losing the chat and
does not have to be:

> Now Ctrl+C, type `claude --resume` and pick this same chat — everything we
> talked about stays, the editor's tools are simply added.

When it comes back, call `openchatcut_status` — an answer is the proof it worked.
Say that out loud too, so they are not left guessing whether the clicking helped.

The same shape applies everywhere the user owns a button: logins happen in
their browser window, export is approved in their editor. You say which button
and why; they press it.

### Driving it

    target_project → begin_edit_session → …tools… → review_edit_session

Everything between is a draft; `review_edit_session` commits it atomically. The
work landed only when status is `applied`.

Two tiers, and they differ a lot:
  * no editor window open → structure only (timeline, clips, tracks, import)
  * a window open → plus render, export, media upload, the library, canvas reads

### What breaks, and why

  * **One project, one window.** The registry keeps a single editor per project;
    a second window evicts the first, the evicted one's credential goes stale, it
    re-registers and evicts back. The result is a 409 loop that breaks both the
    editor and your MCP binding.
  * **Call sequentially.** Parallel calls tear the transport binding.
  * **A session is a snapshot.** Media added after `begin_edit_session` is not in
    your draft; open a new session to see it.
  * **Status-style tools check strictly.** `openchatcut_status`,
    `list_edit_sessions` and `recover_edit_session` compare the ownership epoch
    exactly, and that epoch moves on every keep-alive poll. On a mismatch they
    mark the session dead for good. Reach for them when something is already
    wrong, not between edits.

### Remember the projects

The editor answers only its own page, so nothing outside it can read the
project list. You can, so write it down after you create or rename a project:
note it in the project's `NOTES.md` under the heading `editor:projects` — the
array `list_projects` returned.

Names and links only; the projects stay on the machine. The next session finds
the right timeline from there instead of hunting for it.

### Media into a project

    import_media(create_session) → POST the bytes to the returned slot → finalize_uploaded_asset

The slot is single-use and lives 5 minutes. `import_asset` (import by local path)
only works in the packaged desktop build.

### Building a timeline

FCPXML keeps layers; EDL flattens everything into one video and one audio track.

  * FCPXML `lane` decides the layer, and **lane 1 becomes the TOP track** — put
    the base footage on the highest lane number and overlays on lane 1.
  * EDL channel must be `V` for picture; `B` is read as audio and conflicts with
    a video asset.
  * `edit_item` is atomic: adds → updates → deletes, and one unknown field
    rejects the whole batch without changing anything.

The bundled library is worth reading before building anything by hand:
motion graphics, sound effects, transitions, FX, LUTs and zoom presets, browsable
with `browse_library` and placed with `edit_item`.

### Export

`submit_export` renders synchronously and needs an open editor window. The result
comes back as a download, not a file on disk.

## 5. Handing over

Save the finished file in the working folder with a descriptive name
(`<episode>-<mm-ss>-<lang>.mp4`), the post text / caption in a `.md` next to
it. Look at the result yourself before showing it — pull a frame
(`ffmpeg -ss N -i OUT.mp4 -frames:v 1 check.png`) and probe the codec — then
show the user; the genre guide (`references/clip.md`) says what the post around
it is. Uploading to X has its traps: H.264 + yuv420p, ≤ 2:20 on non-Premium X,
wait for the progress bar to finish, never re-attach the file. The source video
stays on the user's machine.

## 6. The editor's vocabulary

Its built-in workflows name the shapes people actually ask for: a clean
talking-head edit (pauses and filler removed, captions synced), a motion package
(titles, info cards, transitions), long-form highlights reshaped as shorts, a
product story, a knowledge explainer. Quick actions cover the small ones —
remove filler words, remove silence, jump cut, generate captions, normalize
loudness, landscape to portrait.

When a request maps onto one of those, use it instead of assembling the same
thing by hand, and record the match in the project's `NOTES.md` under
`clip:format`: the next request in that rubric will be the same shape.

---

*Part of the free [AICB content skills](https://github.com/corj1k/aicb-content-skills). What a skill alone cannot do — reads of X / Reddit / Instagram / Google as tools, monitoring, posting from your own browser, the timeline, a render box — is [AICB](https://aicb.notpeople.ai).*
