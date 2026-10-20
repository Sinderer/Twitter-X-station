---
name: x-article
description: Writes a long-form X Article (the native x.com/i/article format, needs Premium+) in the engineer/operator voice — title, cover, 1000–1500 words of Markdown the X editor can render, with a cold-open hook, a cheap concrete number early, question headings, one quotable blockquote, numbered steps, an honest caveat and a close — plus the topic-finding pass and the announce post. Use when the user says "write an X Article", "turn this thread into an article on X", "long-form for X", "a Premium article about…", or asks what long piece to publish next on X.
---
# X Article

## What it is

A long-form piece published natively on X (`x.com/i/article/…`): a title, a cover and
a body in X's own editor, shown in the feed as a card. X Articles need **Premium+** on
the account (the editor refuses the rest). The piece is the title (the headline), the
body in Markdown, the cover (uploaded as the header image) and the inline graphics
referenced from the body. Publishing is done in X's editor, in the browser, and takes
up to an hour.

The genre is the engineer / operator sharing what they actually did, with numbers,
not the marketer. The title and the cover do the baiting; the body delivers, so the
reader quotes it and follows the account.

## Before writing, read what is already there

- the voice notes in `NOTES.md` (bio, style, languages, rules, examples), whether the
  account has Premium+ (no Premium+ → this format is not available; say so, offer a
  thread with the `social-thread` skill).
- the rubric brief when the article belongs to a recurring column; the `article` notes
  in `NOTES.md` for what was decided before ("once every two weeks", "covers without
  text").
- the articles already in the working folder — what the account has already published
  long-form; the next one must not retell it.
- the user's own instructions for articles, if they wrote some down in `NOTES.md` —
  they override this skill.

## Finding the topic (when the user has not handed one in)

Articles are expensive; the topic is chosen, not improvised. One pass, four reads,
then a short list the user picks from:

1. **What the account already knows.** The user's own posts (their profile in the
   browser, or with whatever social-data tool is connected) — the posts that got
   quoted and replied to are the articles they have not written yet. A thread with
   sixty replies is an article with its objections pre-collected.
2. **What the audience argues about now.** The trends page and a search of X for the
   topic for the live take; the replies under the posts that lead the argument for
   the questions people actually ask — those become section headings.
3. **What is being searched.** Google autocomplete for the topic for the phrasing,
   Google News sorted by date for the last two weeks, a Reddit search for the pain
   threads. In the browser, or with whatever search tool is connected.
4. **What the account can prove.** The five artifacts an article needs: a real
   example, a number from practice, a strong thesis, an honest caveat, a concrete next
   step. Three or more would have to be invented → change the angle or drop it.

Each candidate: `{angle in one sentence, why now, the artifacts, the title}`. The POV
test before anything else: is there a claim someone could disagree with? A recap of
what happened is a thread; an article says what it means.

## The title

One of two engines, both proven on the samples that did 400K–1.3M views:

- **Money / contrast:** a concrete object + a dollar contrast + an outsized outcome.
  «3D Printer for $300 vs Amazon. Simple Box Saves Your Money & Creates Best Business
  With 90% Margin.»
- **Status / shift thesis:** the thing serious people do that the reader does not yet.
  «The Era of One-Person Economy Has Already Started», «Claude on a Mac Mini: the second
  brain that builds itself.»

A specific noun, a number or a bold claim, present tense, the reader is currently
missing out. A vague title («Thoughts on AI») gets the 15K floor. Three or four title
variants in the draft note; the user picks.

## The structure

1. **Cold-open hook in second person** — a recognizable everyday scene in two or three
   short paragraphs («Your oven breaks…», «You probably have a computer that does
   nothing 23 hours a day…»). No preamble, no «in this article».
2. **A cheap, concrete number early** — it kills the first objection («$599, quieter
   than a lightbulb», «$0.30 vs $40»).
3. **The promise** — what the reader will have by the end («three workflows running»).
4. **Section headings as questions or punchy claims** — «Why your Mac Mini and not the
   Claude chat?», «What does it actually cost?». Skimmers and the recommendation
   models both read the headings.
5. **One quotable line** set alone as a blockquote — the sentence designed to be
   screenshotted («The market doesn't reward perfect anymore. It rewards complete.»).
   This is what drives the quotes count.
6. **Numbered steps or paths + «where everyone gets it wrong»** — practical and
   repeatable, with the real command, the real price, the real setting.
7. **An honest caveat** — «$60M profit doesn't mean YOU become a millionaire». The
   genre always plants one; without it the piece reads as a shill.
8. **The close** — «My take: start with X», then the account's link or CTA from the
   voice rules / `NOTES.md`. One paragraph.

Length: 1000–1500 words carries a cover + two to four inline graphics + one or two
code / quote blocks, spread so no section is pure text. A wall of paragraphs with
headings reads shallow and (the samples show it) the recommendation does not pick it
up.

## Formatting the body (what the editor can render)

The body is typed into X's Draft.js editor, which renders these constructs; use
only these, anything else lands as literal text:

| Markdown | Renders as |
|---|---|
| `# Heading` | Heading |
| `## Sub` / `### Sub` | Subheading |
| `**bold**`, `*italic*` | bold, italic |
| `- item` / `1. item` | bullet / numbered list |
| `> quote` | blockquote (the quotable line, or a short pulled context) |
| ```` ```code``` ```` fenced | code block — even one real command buys technical weight |
| `---` on its own line | divider |
| `![alt](url)` on its own line | inline image, no cropping |
| `\| a \| b \|` + `\|---\|` row | table (max ~10×10) |
| a bare `https://x.com/<u>/status/<id>` line | embedded post |

Short paragraphs (one to three sentences), many line breaks: it is read on a phone.
Bold claims on their own line. Numbers and `$` everywhere a number exists. A heading,
quote or list marker starts its own line; a table needs the separator row; a code
fence needs its own opening and closing lines. The title is the title field, not the
body's first line.

## Cover and graphics

The **cover is required**: it is the card X shows, and it echoes the title's bait (the
object + the number or the claim), clean, readable as a thumbnail. Inline graphics:
one per major section where a visual lands the point (the loop, the stack, the
before/after, the person being discussed). The `find-images` skill is the map of how
to get a picture: generate (an image generator you have, local or web) or make it by
hand; the file sits in the working folder next to the text, referenced from the body
as `![alt](url)` under its section AND listed in the note's media list. Cover first in
that list, never inline. Prefer text-free imagery; when a graphic carries words,
verify them by eye.

## Voice and facts

The account's voice, read from the voice notes; the genre's energy comes from specifics
and the status-shift thesis, not from hype adjectives — none of «revolutionary»,
«game-changing», «unleash», «10x», none of the account's banned words. Every number
is the user's own (with how it was measured) or verified this session (search the
claim, open the page, link the page that actually says it). A URL that was not opened
is not in the article. The audience's language (the languages in the voice notes),
with the humanize pass from the `seo-article` skill's «Stage 7 — Editing» section —
the same tics kill an X Article.

## Handing over and publishing

Write the article into a dated `.md` in the working folder: the headline on top, the
Markdown body under it, the media list (cover first, then the inline graphics) with
the files next to it. Open the file and read it as the reader would before showing
it. Show it to the user; nothing is published until they say so.

Publishing, in X's editor in the browser: cover, title, body paragraph by paragraph,
blocks via the toolbar, publish, confirm. The live URL is
`https://x.com/i/article/<id>`; note it in the file. A failed run leaves a draft in
X's Articles → Drafts; delete it by hand before retrying.

**The announce layer:** a long piece needs a post that points at it — a post (the
`social-post` skill) or a thread (`social-thread`, with the three strongest findings)
in the account's voice, linking the article URL, scheduled for the account's posting
hours. Write it as a separate piece after the live URL exists.

## After

Note under `article:learned` in `NOTES.md`: which title engine worked, what got
quoted, which sections readers asked about in the replies (watching the user's own
posts). The next article starts from that.

---

*Part of the free [AICB content skills](https://github.com/corj1k/aicb-content-skills). What a skill alone cannot do — reads of X / Reddit / Instagram / Google as tools, monitoring, posting from your own browser, the timeline, a render box — is [AICB](https://aicb.notpeople.ai).*
