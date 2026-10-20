# Clip

## What it is

A short video cut from a longer source — a podcast, a stream, an interview, a
talk, a tutorial, a Space — that lands on its own: 15–90 seconds, usually
vertical, with burned-in subtitles, posted as a clip on X, a Reel, a Short, a
TikTok. One source usually gives several; "1 video = 1 clip" is an assumption,
not a rule. The instrument (fetching, probing, ffmpeg, the local editor, the
upload) is the `video-clips` skill (its `SKILL.md`); this guide is what a clip is, what decides
whether it is good, and the numbers that have been paid for already: subtitle
sizes and positions, segment lengths, platform limits, the post around it.

Everything happens on the user's machine: the download, the cut, the burn.

## Before cutting, read what is already there

- the user's voice (the post around the clip is written in it; the languages
  the user posts in decide the subtitle languages) and whether their X account
  is Premium (non-Premium X: video ≤ 2:20 and 280 characters; Premium: long
  video and long text) — ask, or read the project's `NOTES.md`.
- the rubric, when clips are a recurring column («clips from the podcast»,
  «stream highlights», «reels for the launch»): its brief says what a clip of
  this rubric is about, how long, and what the post says. A new kind of video
  (a different show, a different format, a different audience) is a new rubric,
  not a second format piled onto an existing one's notes.
- the `clip:*` headings in the project's `NOTES.md`:
  - `clip:format` — length, framing (vertical / landscape), intro card or none,
    music or none, hook line or none, which of the editor's workflows fits,
    what never appears («no music in this rubric»);
  - `clip:style` — the caption look: preset name or the fields below (font,
    colours, outline, position, grouping);
  - `clip:learned` — what landed.
  Nothing there and the user has no preference yet: ask once, make it, write
  down what they approved. A house style they never chose is the first thing
  they notice.
- the previous clips in the working folder — which minutes of which sources
  were already posted. A clip is not reposted from the same minute of the same
  episode; two clips from one episode go out days apart, not in one hour.
- the user's own clip rules if they wrote any — they override this guide.

Then say the plan back in words before building: which moments (with
timecodes), in what order, what sits on top, how long, which languages. Two
sentences are cheaper to correct than a rendered timeline.

## Finding the moments

Read the material before cutting anything. A transcript with timecodes is the
fastest way to read two hours: YouTube's own captions (yt-dlp fetches them, or
whatever transcript tool you have connected) come as `{start_s, text}`, a
local whisper run does it for any file, the episode's chapters
narrow it further; your browser is the way to read a Space or a stream behind a
login. Then reason from **duration and content**: a 10–15
minute source usually carries two or three moments, a two-hour podcast eight
to twelve, a five-minute short one. The audience has usually marked the minutes
already: the comments under the source (`yt-dlp --write-comments` or the browser
for YouTube, the replies under the post for a Space or a native video) quote the
lines people remembered, often with the timestamp — start there.

A moment is worth a clip when:

- **it lands without the setup around it.** A viewer who never saw the episode
  gets it in the first two seconds, because the clip opens on the claim, the
  question, the number or the punchline — not on the run-up. If the moment
  needs the previous five minutes, it is not a clip, or it needs a hook line.
- **it is one idea.** A clip with two ideas is two clips. A clip that is a list
  («three things I'd do differently») is a clip only if all three fit in 60 s.
- **the speaker is at their best in it**: a number, a story with a turn, a
  disagreement, a demonstration, a confession. «And that's basically how it
  works» is not a clip; the sentence before it may be.
- **it has an ending.** The last line closes (a punchline, a conclusion, a
  question to the viewer); cutting mid-thought reads as an error, not as a
  cliffhanger.
- **it is safe for the account**: the clip is quoted out of context by design,
  so read it as a stranger would. A joke that needed the room is a clip that
  needs a hook line or no clip at all.

Cut on a breath, not on a word: start half a second before the first word, end
on the last word plus half a second of air. Stream-copy cuts land on the
nearest keyframe (up to ~2 s off), so for a tight start re-encode the cut or
begin on a keyframe the probe shows. Cutting needs no transcript —
transcription is the separate step you run for subtitles, and you run it on
the clip's real window, not on the episode's opening (a transcript of 0:00–1:08
burned onto a clip from 20:05 is a clip with no subtitles, and a post about the
wrong moment).

## The shape, per platform

| where | length | frame | text with it | video |
|---|---|---|---|---|
| X, non-Premium | ≤ 2:20 (hard) | 16:9 or 9:16, 1080p | ≤ 280 chars | H.264 + AAC, yuv420p; AV1 is refused at 100 % |
| X, Premium | up to the plan's limit; 15–90 s still wins | same | long text allowed | same |
| Instagram Reels | ≤ 90 s | 9:16 1080×1920 | caption ≤ 2,200, first line is what shows | H.264 + AAC |
| YouTube Shorts | ≤ 60 s (longer allowed, 60 is the Shorts shelf) | 9:16 | title ≤ 100 | H.264 + AAC |
| TikTok | 15–60 s wins; longer allowed | 9:16 | caption short, hashtags matter there | H.264 + AAC |
| Threads | ≤ 5 min | 16:9 or 9:16 | ≤ 500 chars | H.264 + AAC |

15–60 seconds is where clips get watched to the end; a 90-second clip is a clip
with a reason; 2:20 is a ceiling, not a target. 30 fps is enough for talking
heads; keep the source's fps otherwise. Loudness normalised to −14 LUFS
(`loudnorm=I=-14:TP=-1.5`) so the clip is not quieter than the feed around it.

**Vertical (9:16)** for Reels, Shorts, TikTok and most X feeds. Two ways:

1. **Reframe on the speaker** — a 9:16 crop that follows the face. Best when
   there is one person and the camera is static; the editor's
   landscape-to-portrait action does it with tracking.
2. **Scale + pad over a blurred copy** — the whole 16:9 frame at full width in
   the middle, the same frame blurred behind it. Best when the picture needs
   its width (two people, a screen share, a slide). The band below the picture
   is where the subtitles go. The filtergraph that does it:

```
[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=luma_radius=40:luma_power=1,setsar=1[bg];
[0:v]scale=1080:-2:force_original_aspect_ratio=decrease,setsar=1[fg];
[bg][fg]overlay=(W-w)/2:(H-h)/2[base];
[base]subtitles=subs.ass[v]
```

A 16:9 original is right on X and YouTube when the picture is the point (a
demo, a chart, two faces); a vertical crop of a two-shot that keeps cutting
between heads is worse than the landscape.

**Safe zones.** The apps draw their own chrome over the video: on Reels, Shorts
and TikTok the bottom ~350 px (caption, music, progress), the top ~200 px
(title, back), and the right ~120 px (like, comment, share icons). Nothing that
must be read lives there: subtitles sit in the band under the picture or in the
lower third above the chrome, the hook line sits under the top band, nothing is
right-aligned.

## Subtitles are the content

Most viewers watch with the sound off; the subtitles are the clip. What decides
whether they read:

**Timing and grouping.** Word timestamps from the transcriber (whisper's
`word_timestamps`), packed into groups that break on pauses:

| grouping | words per caption | font (fraction of frame height) | when |
|---|---|---|---|
| `karaoke` | 3–5 | 0.075 | the default for clips under 2 minutes |
| `readable` | 6–9 | 0.050 | clips over 2 minutes, dense speech, screen shares |
| `punch` | 1–2, ≤ 12 characters | 0.095 | Shorts energy: one or two words popping, short quick words pair up («so I», «in the»), long words pop alone |
| `punch_pop` | as punch | 0.095 | punch plus a scale-in bounce on every caption: 55 % → 112 % → 100 % over 180 ms (ASS `{\fscx55\fscy55\t(0,100,\fscx112\fscy112)\t(100,180,\fscx100\fscy100)}`) |

Whatever the grouping, a caption stays on screen 0.8–3 s and **one caption at a
time**. Segments of 10 s with several sentences render as a wall: libass draws
every active event at once, so three long lines stack and cover the picture.
Keep every segment to one spoken phrase, ~2–4 s, and never merge segments when
translating.

**Size and position** (the ASS style that has been tuned on real clips):

- font size = 7.5 % of the frame height for karaoke (5 % readable, 9.5 % punch),
  never under 28 px; on a **portrait** frame cap it at 11 % of the frame WIDTH,
  or a five-word line runs off the 1080 px and gets clipped;
- `Alignment=2` (bottom centre), `MarginL/R=40`, `WrapStyle: 0` (smart wrap to
  the frame width; manual wrap lets long lines overflow);
- **landscape:** `MarginV` = 12 % of the height — the lower third, above the
  speaker's chin, readable on a phone, under nothing;
- **vertical with the blurred pad:** the captions go in the band BELOW the
  picture, anchored just under its bottom edge, not centred in the band: with
  the picture scaled to full width its height is `1080 × sh / sw`, the band is
  `(1920 − that) / 2`, and `MarginV = band − 1.25 × font − 24` (never under 60).
  Centred in the band it reads as a footer; over the picture it covers the
  speaker;
- **vertical reframed on the speaker:** lower third again, `MarginV` ≈ 18–20 %
  so the text clears the apps' bottom chrome;
- max two lines; a third line means the segment is too long.

**Look.** White bold text, black outline 10 % of the font size, shadow 4 %, a
black box behind at alpha 150/255 — the classic that reads on anything. Named
presets a user may pick by name in `clip:style`, or override field by field:

| preset | font | text | outline | notes |
|---|---|---|---|---|
| `default` | Liberation Sans / Arial-like | white | black, 0.10 | box behind |
| `bold_yellow` | Montserrat Bold | #FFE000 | black, 0.14 | the podcast-clip look |
| `minimal` | Liberation Sans regular | white | black, 0.06 | no box |
| `impact` | Anton | white | black, 0.16, `MarginV` 15 % | the Shorts look, pairs with punch_pop |

Fonts: Montserrat, Anton, Bebas Neue (bundled .ttf files, pointed at with
`fontsdir`), or whatever the user's brand uses — the brand font beats any
preset. **CJK needs a CJK font**: Korean, Japanese and Chinese render as empty
boxes (tofu) with a Latin font; use Noto Sans CJK (`fonts-noto-cjk`) and check
a frame. Colours are given as `#RRGGBB` and converted to ASS `&HAABBGGRR`
(reversed byte order; alpha 0 = opaque).

The style header, filled in for a 1080×1920 vertical clip with karaoke sizing
(font 118 px = 11 % of width cap; MarginV computed for a 16:9 source):

```
[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, Outline, Shadow, Alignment, MarginL, MarginR, MarginV
Style: Default,Montserrat,118,&H00FFFFFF,&H00000000,&H96000000,-1,12,5,2,40,40,490

[Events]
Format: Layer, Start, End, Style, Text
Dialogue: 0,0:00:00.40,0:00:02.10,Default,we shipped it in a week
```

**A top label** («Part 1», the show's name, the guest's name) is a static
`Dialogue` pinned for the whole clip, `\an2\pos(540, y)` with `y` just above the
picture's top edge in the top band (or font + 24 px from the top on landscape),
font ≈ 5.5 % of the shorter side. One label, not a title card.

**Languages.** Latin scripts render as they are; Turkish and Portuguese have
never needed anything. Japanese has no spaces, so word-splitting cannot help:
keep JA segments ≤ ~4 s and ≤ ~22 characters (split the transcriber's segments
and interpolate the timings). Korean splits on spaces but stays modest.

**Verify, every language, every time.** A finished mp4 proves nothing about the
subtitles: `ffmpeg -ss <mid> -i out.mp4 -frames:v 1 check.png` and look at
the frame — the text is there, inside the safe zone, not over the face, in the
right language, in a font with glyphs. Then `ffprobe -select_streams v:0
-show_entries stream=codec_name` = `h264`, or X refuses the upload at 100 %.

## The hook line

When the clip needs context in its first second («why we shut the product down
in a week», «Jensen on why CUDA won»), one line over the top band or as the
first caption, in the user's voice, taken from the clip itself — a plain
summary of what the viewer is about to hear, not a clickbait rewrite of it. It
stays 1.5–3 s or the whole clip as a top label; it never covers the speaker's
face. No hook when the first sentence already is one.

## Intro card, music, b-roll

Only when `clip:format` says so. A straight cut with burned subtitles is the
default and ffmpeg's road: it ships in minutes and it is what the genre mostly
is. When the piece stacks things — an intro card, a soundtrack under the
speech, inserts, a progress bar, zoom-ins on the speaker — it is the editor's
timeline and the user's install decision (`video-clips` §2, §4); the editor's
"long-form highlights as shorts" workflow is the named shape for this type, and
its quick actions (remove silence, remove filler words, jump cut, generate
captions, normalize loudness, landscape to portrait) are the small ones. Music
under speech sits at −20 dB or lower and is a choice the user made, not a
default; a soundtrack also kills the clip as a quote source.

## Making it (the order that works)

1. **Source** → `video-clips` §1: a local file, yt-dlp (prefer H.264: `bv*[vcodec^=avc1][height<=1080]+ba[acodec^=mp4a]`), your browser.
   Probe it: duration, size, codec.
2. **Windows** → the list of `(start, end, why, hook?)`, said back to the user in
   words; several clips are decided in one pass.
3. **Clean cut** per window, no subtitles, stream-copy when the source is H.264
   (`ffmpeg -ss START -to END -i SRC -c copy clean.mp4`), re-encode otherwise
   (`-c:v libx264 -preset veryfast -pix_fmt yuv420p -c:a aac`). The clean cut is
   kept: every language and every format is burned from it without re-cutting.
4. **Transcript of the window** → segments with word timings; or read the
   existing transcript at exactly those seconds.
5. **Translate** when the user posts in another language: you translate (or a
   sub-agent does), segment by segment, keeping every boundary and timecode;
   the JA/KO rules above.
6. **Burn** → one burn per language, from the clean cut, with the vertical
   filtergraph when vertical: `-c:v libx264 -preset veryfast -c:a aac -movflags
   +faststart`, loudnorm in the audio chain. Burns are CPU-bound: **one at a
   time**, never four in parallel on a laptop.
7. **Check a frame** per language; probe the codec.
8. **Cover** = a frame from the clip at its strongest second (the face mid-word,
   the number on screen), or the hook line over it; the platforms use the first
   frame when none is given, so the first frame must not be black.
9. **Hand over** (below). Keep the clean cuts and the source on the
   machine (the next language or format starts from them); the burned files go
   to the working folder.

## Many languages — one cut, one burn per language

One clean cut, one burn per language. The wave that worked: 18 clips in 4
languages from two episodes, cut once, burned sequentially (1–2 minutes each
with ready translations).

- **The translation is yours**, not a service's: it keeps the segment
  boundaries, it reads like the language (a Brazilian engineer, not a
  dictionary), and it costs minutes, not the ten a pipeline took.
- **The post is not one skeleton with translated words.** Vary the opening move
  (a quote, a question, a flat statement), the structure (two lines, one line,
  three dashes, no bullets), the length and the kicker (a dry one-liner, «full
  segment 👇», nothing) — in each language and in the user's voice. The same
  «hook → three → arrows → 👇» in every language reads as copy-paste.

## The post around the clip

A post by the `social-post` skill, in the user's voice: the one line the
clip proves, or the question it answers, or the quote that is in it — no «new
clip from the podcast», no «check this out». Non-Premium X: ≤ 280 characters
including the kicker (a hook line + at most one reaction line + «👇» if it
fits); JA/KO ≈ ≤ 120 characters because X weighs CJK characters ×2. Premium,
Threads, YouTube take longer copy, which is not a reason to write it. The
episode link stays verbatim when the user wants it there (X shows a post with
a link to fewer people; that trade is theirs; the usual move is the link in a
reply under the clip). Hashtags only where the account already uses them —
TikTok yes, X no.

## Handing over

Save each burned file in the working folder as
`<episode>-<mm-ss>-<lang>.mp4`, the cover as `<episode>-<mm-ss>-cover.jpg`,
and the post text in a `.md` next to them — one file per language. Look at
the result yourself (a frame per language, the codec probe) before showing it,
then show the user; clips from one episode spread over days, inside the hours
the user posts in. When it is posted to X: H.264 only, wait for the upload bar
to finish, never re-attach the file, a long wait after a video is normal — the
post appearing in the feed is the proof, not the response.

## After

- `clip:format` / `clip:style` in `NOTES.md`: «bigger captions», «inserts
  always on the right», «no music in this rubric», «yellow subtitles like X's»
  are the rubric's format, not a note about one clip. The tenth clip should
  need none of the instructions the first one did.
- `clip:learned`: which moments were watched to the end, which hook lines
  opened, which length held on which platform (the platforms show retention
  per second; read it once a week).
- A reply under the clip asking for the full episode is a reply with the
  link (`social-reply`).

## Checklist before the user sees it

- the moment lands alone; one idea; ends on a line; safe out of context
- length inside the platform's limit; H.264 + AAC + yuv420p; −14 LUFS
- vertical: picture at full width, captions in the band under it (or lower third
  on a speaker reframe); nothing in the apps' bottom 350 / top 200 / right 120 px
- captions: one spoken phrase per segment (2–4 s), one on screen at a time, max
  two lines, size by the table, portrait cap at 11 % of width, box or outline
- CJK in a CJK font; JA ≤ 4 s / 22 chars per segment
- a frame checked per language; the transcript is the clip's own window
- hook line only when needed, from the clip, not over the face
- the post in the user's voice, within its limit; the link where the user
  wants it
- one file per language, named by episode and minute, clips from one episode
  spread over days; `clip:format` / `clip:style` written back to `NOTES.md`
