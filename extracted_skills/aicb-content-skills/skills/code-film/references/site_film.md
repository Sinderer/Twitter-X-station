# Site film: a website or app as the hero

## What it is

A video presentation of a website, an app or a product: 30–60 seconds in which
the thing itself is the hero — its real screens, its widgets moving, its form
being filled, its one feature doing what it does. Shot from the live site state
by state and composed by code into a film (the `code-film` skill's `SKILL.md` is the
instrument: the page, the live preview, the shoot; §3a there is how a site is
shot). No screen recording, no editor timeline: once the machinery exists, the
next site is one shot list and one config.

Who it is for decides the film, so ask that first:

- **a studio showing a site it built** — the viewer is the studio's next client;
  the film sells the site and the studio, not the client's weddings or cars;
  the ending reveals the studio (the Kai example at the end);
- **the user's own site or app** — the viewer is a user; the ending is the
  product's URL and the one thing to do there («work out your timing»);
- **a launch or a new feature** — the viewer already knows the product; the
  film is the feature in use, before and after, and ends on it working;
- **an explainer / onboarding** — the viewer is about to use it; the screens go
  in the order of the first session, and the claims are the steps.

The photos, prices and texts on the screens are the site's content: the film
quotes them, never invents them, and never says more about the product than the
product says about itself.

Two finished files: a 16:9 film (a site, X, YouTube) and a native 9:16 cut on
the phone version (Reels, Shorts, TikTok), both from one shoot.

## 1. The frame comes from the site

A generic "scroll through the pages" is what makes these films long to make and
dull to watch. Look for **the one thing this site does that a template does
not** — a calculator, a live widget, a tool computing something real — and let
its subject become the film's frame:

- Kai's site lays the wedding day out from the sunset for any month and
  region → the film is one day by that sun; the day's steps
  give the order of the screens, and the light on the screens is the real sun
  of that day.
- a car service with a price calculator → the car's service day, the bill
  growing line by line;
- a travel site with routes → one route travelled, each stop a screen.

Do not borrow the "journey through worlds" of an animation piece: for a wedding
or events studio it reads as a science film, and the user turned it down.

**The frame is not the hook.** The clever feature can drive the film's
structure, but the first screen says what the site IS FOR — its strongest brand
screen (Kai: the home page, the logo over the live video, "A site for a wedding
studio in Tbilisi"). The first cut opened on the sunset widget with "a site that
computes the sunset", and the user rejected it: the site is not about that.

**The brand, not a style of ours.** The look comes from the client's brand book:
its palette as flat plates, its mark, its signature shapes and materials (Kai:
five colours, an embossed monogram, an arch, an envelope). Read the brand book
and the site's CSS before proposing anything.

**Three concepts** for the user, different on at least three of these, each
with its position written next to it:

| axis | some positions |
|---|---|
| frame | a clock or a day · one object of the brand (envelope, box, ticket) opening into the site · the brand's shape as a window the screens pass through · a question the site answers |
| screens shown as | prints on a table · a phone in a hand · sheets turning · a live scroll |
| camera | glides and holds over a table · one long push · a still frame with screens changing in it |
| light | the real sun of the site's subject · studio light · none (flat print) |
| pacing | a calm day · on a beat (Reels-first) · question → answer |
| sound | solo instrument following the frame · percussion from the site's own clicks · silent master for a trending track |
| ending | the studio revealed · the site's URL on the brand's plate · loop |

Keep a log in the project's `NOTES.md` under a `film:site` heading (read it
before the first
concept), one line per film on these axes, so the next site gets a different
film. Show the three concepts to the user in chat, then the picked one live in
the browser at once (`code-film` §2): that is where the film is decided.


## 2. Shooting the site

The screens come from the live site, shot with Playwright from a shot list: a
still per screen, a slowed-down transition the site animates (a month clicked,
a stack flipped), the hero video frame by frame, a scroll, a tool used step by
step, a form typed two characters at a time, the full page. Desktop and mobile
are shot separately; the lead endpoint is mocked so no fake lead reaches the
client. The how — the shot kinds, the CDP slowmo, the traps that bit — is
`code-film` §3a. What this guide adds is **what to shoot**:

- every screen the three concepts need, plus the two strongest brand screens
  (the home page is usually one), before any layout is designed;
- **the feature in use**, not at rest: the calculator with a number changing,
  the form being sent, the rows being ticked — a still of a tool reads as a
  screenshot, a tool used reads as a product;
- the hero video of the site itself, if it has one; it is the client's best
  material and it was made for this;
- the mobile version of everything the 9:16 cut will show, on the phone layout
  (controls change there: arrows become swipes, panels become sheets).

## 3. The screens on screen: the table, the phone, the light

The Kai film's answer, one of several (§1's axis «screens shown as»): the
screens are prints lying on the brand's paper: a cream border, the paper
generated once (noise, fibres, the client's mark embossed — a light copy offset
up-left, a dark one down-right, the mark in the paper's colour on top). About
twelve screens in a 4×3 spread; six or seven get the camera.

- **Camera** — glides between prints in ~1.2 s, zoom interpolated in log space
  with a dip on long moves (`z × (1 − min(.42, dist/9000) × sin πu)`), holds
  ~4 s while the print's shot plays, pulls out to the spread after the hook and
  before the end.
- **Focus** — the print under the camera lifts: rotation eases to 0, the shadow
  grows (`lift = 8 + 18 × focus`, focus from distance to the camera).
- **Holds are not still** — during each hold the camera pushes slowly toward
  what moves on that screen (the rows being ticked, the stack, the form):
  a hold keyframe with zoom ×1.1–1.2 and an offset to the detail. Without it
  the user felt the showings lacked dynamics.
- **Enough frames, not blending**, and shots played on the film clock — the
  mechanics are `code-film` §3a; what matters here is that a hold shows the
  site moving at the site's own pace, and that the viewer never sees a
  cross-fade double the text.

**Light from the real sun** (when the frame has a sun): the film's clock drives
the NOAA sun position for the date and place — the formulas a sunset widget
already uses.

```js
const dl = lift * Math.min(1 / Math.tan(el * RAD), 6);            // shadow length
const dx = Math.sin(shadowAng) * dl, dy = -Math.cos(shadowAng) * dl; // shadowAng = azimuth + 180°
// window of light in the brand's shape, stretched along the shadow as the sun drops
ctx.rotate(shadowAng); ctx.scale(s, s * clamp(0.6 / Math.tan(el * RAD), .55, 5));
ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .36 * sunUp; ctx.drawImage(gobo, -512, -1000);
```

A `multiply` grade by elevation (white → gold → dusk), after sunset a warm lamp
pool over the focused print and garlands switching on bulb by bulb. **Keep it
light**: the window at ~0.17 alpha in `screen` (0.36 read as a glare and
the user asked for less), the dusk and night grade pale — at full
strength the screens (the product) wash out or sink, and the night form must
still read.


## 4. Text

- **A clock** (or whatever the frame counts) on its own paper card — on an
  overview it would otherwise sit on top of the screens.
- **One claim per screen**, on the brand's colour plates wiping in from the
  left. Each claim is something the site really does, in words no bigger than
  the site's own — quote its heading or lead where you can ("The timing is built
  around beautiful light" is theirs; "a site that computes the sunset" was ours and
  overclaimed). Check it on the page ("reviews from Google" only if they are).
- **The hook**: what the site is for, on its strongest screen, two plates —
  the kind of site and the client's URL.
- **The end card** follows who the film is for (above): the studio revealed
  (the client's site name small, the studio's name large in its own typeface,
  one line of what it does, its URL); or the product's URL on the brand's plate
  with the one thing to do there; or the feature still working with its name.


## 5. Sound

Synthesised, following the frame: Kai's is a solo piano by the hours — bright
arpeggios by day, slower gold before sunset, a long chord at sunset, sparse
low notes at night, a waltz for the first dance, the opening motif closing the
film. On top, the site's own events on their frames, made physical — a tap is a
small wooden body, typing a fingertip on glass, a ticked row a pencil, a page
turned a recording of paper, the camera's move three muted low strings of the
current chord. The synthesis of each, the mix and what was rejected as "just
noise" are `code-film` §4. The 9:16 cut also ships silent, for a trending track.

## 6. Two formats

**16:9** — 1920×1080, 60 fps, 40–50 s: hook 3–4 s, ~4 s per screen + 1.2 s
glide, an overview, end card ~6 s.

**9:16** — 1080×1920, 30 fps, ≤ 30 s, rendered natively on the mobile shots,
each in a phone body rather than a paper border: a dark rounded case
(`roundRect`, radius ~104 units for a 780-wide screen, 24 bezel), a thin light
rim, side buttons, the screen clipped to the inner radius, a camera pill over
the top of the page. Phone screens at zoom ~0.84, 2.5–3 s per screen, the hook
moving in the first second, captions inside the safe band (`code-film` §5).
Cover from the hook with both claim plates on screen.


## 7. The loop, and where it renders

The film plays live in the browser before anything is rendered (`code-film`
§2): the user scrubs, moves the knobs (the camera's dwell, the light's
strength, which concept), leaves notes on a second; Claude reads them and the
page reloads on the same second. Then stills at chosen seconds → one contact
sheet → look → fix → again; the master only after the user's «ok» in so many
words. A 48 s canvas film renders in minutes on one machine; shooting a site is
about ten minutes per format. On a weak computer, or with several formats
queued, the same scripts run on a rented GPU box (e.g. Vast.ai) over SSH, same script unchanged,
and only the masters come back. Keep the machinery (capture tool, film page,
renderer, sound, mux) with your films: the next site needs a new shot
list, a new config (spread, camera keys, clock, captions, end card) and a new
frame — nothing else.

## 8. Handing over

Look at the full render yourself the moment it exists (pull a frame from each
cut), then show the user, as a path they can open
(under WSL the `\\wsl.localhost\…` path) or a URL. Save the files in the
working folder under descriptive names (`<site>-16x9.mp4`, `<site>-9x16.mp4`,
the silent 9:16, and the covers), with the post text in a `.md` next to them:
what the site does, the one feature the film is built on, the URL.

One post per platform cut (the 9:16 on Instagram / TikTok, the
16:9 on X or YouTube); the post text follows the `social-post` skill in the
user's voice. Non-Premium X takes ≤ 2:20 and 280 characters; the upload traps:
H.264, wait for the progress bar, do not re-attach. Add the film's row to the
`film:site` log in `NOTES.md` (§1).

## Example: Kai — a day by the sun (a studio's portfolio film)

48 s 16:9 at 60 fps and a 30 s 9:16 cut on phone screens, for wan2ted — the
studio that built kaievent.studio, a wedding and events studio in Tbilisi. From
three concepts (a day by the sun; the brand's envelope opening into the site;
the brand's arch as a window with halftone dots becoming photos) the user
chose the day.

| s | clock | screen | what moves |
|---|---|---|---|
| 0–3.5 | — | the home page, full frame | the hero video under the logo; "A site for a wedding studio in Tbilisi" · kaievent.studio |
| 3.5–6 | 15:06 | the whole spread | pull-out; the arched window light on the table |
| 6–11 | 15:06 getting ready | the timing widget | December clicked → the ceremony moves 18:36 → 15:31 → back; push to the sky bar |
| 12–16 | 17:36 portraits | portfolio stack | two prints flipped |
| 17–22 | 18:36 ceremony | a case page | scrolled |
| 23–27 | 19:21 welcome drinks | the estimate | ten rows ticked |
| 28–32 | 20:36 sunset | reviews | a postcard turned; the gold peak |
| 33–40 | 22:21 first dance | the letter form | typed, sent; garlands |
| 40–48 | — | spread at night → end card | wan2ted · design and development studio · wan2ted.space |

Second cut after the user's notes: the hook moved from the widget to the
home page, the "computes" claim went, taps/typing/transition sounds became
physical, holds got pushes, scrolls were reshot denser. Third: the screen
change became a harp run, the window light half as bright, the Reels screens
went into phone bodies. Fourth: the harp went low and muted, and "every
wedding has its story" became "every event" — Kai is an events studio, not
only weddings; say what the client says about itself. Fifth: the flips
got a recorded page turn; a version without the screen-change sound at all
ships alongside (the score skips those events behind one flag).

Its row in the log: frame = a day by the site's own sun · screens = prints on
the brand's paper · camera = glides and holds · light = the real sun of 15 June
in Tbilisi · pacing = calm, even · sound = solo piano by the hours + the site's
clicks · ending = the studio revealed.
