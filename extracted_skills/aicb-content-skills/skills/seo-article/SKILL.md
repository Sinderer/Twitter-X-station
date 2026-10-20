---
name: seo-article
description: Writes a long search-oriented article for the user's own website, in twelve stages — site audit, topic discovery, go/no-go, live SERP and keyword recon, brief, media, the draft (Quick answer, question H2s, a comparison table, FAQ), a blocking editing pass (facts, structure, words, punctuation, AI tics per language), a blocking defensible-claims pass, links, the YAML publishing package with JSON-LD, localization into every site language, announce and measure. The user publishes on their own site or CMS. Use when the user says "write an SEO article", "a blog post for the site that ranks", "an article for /journal about…", "localize this article into…", or asks what to write next for the site.
---
# SEO article

## What it is

A long search-oriented article for the user's **own website**: ranks in classic
search, gets cited by AI engines (Perplexity, ChatGPT, AI Overviews), and is
extractable as a direct answer. Written for a real reader who came from a search
query, edited to the standard of a print magazine, in every language the site has.

The article is one piece per language: the H1 (the title), the body in Markdown with a
front-matter block carrying the publishing package (below), and the media (cover,
…inline graphics). Publishing is the site's own deploy chain or CMS (how it works is
written under `seo:site` in `NOTES.md`), and the user publishes; there is no editor to
click through. The piece is done when its live URL is noted.

Two gates are blocking: the editing pass and the defensible-claims pass. Most
articles fail there, not at research.

## The site's standing facts

Before the first article, read the voice notes and the `seo:site` section of
`NOTES.md`; when there is none, this is the first conversation with the user, and it
ends with the section written:

```
## seo:site
  domain, languages: ["ru", "en", "ka"], primary_language,
  taxonomy: [category → slug], internal_link_map: {topic → url},
  cta: "…", banned_words: [...], verified_sources: [...],
  deploy: "how a finished article reaches the site, or 'the user by hand'",
  cover_style: "…", methodology_page: url?
```

The voice notes in `NOTES.md` are the site's voice (bio = what the site is, style = how
it writes, rules = what never appears, examples = two paragraphs the user likes).
Decisions made later ("from today on, always…") go into `seo:site`, not into a chat
reply. Past results go to `seo:learnings`, read at the start of every topic search.

## Stage 0 — Site audit (once per site)

Content cannot outrank a broken platform. Two curls and a search, before or alongside
the first article, findings under `seo:site-audit` in `NOTES.md`:

- `robots.txt` allows the AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot,
  PerplexityBot, Google-Extended, CCBot, Meta-ExternalAgent); a site that blocks them
  cannot appear in AI answers.
- `llms.txt` exists: the one-liner, permission to quote with attribution, key URLs.
- `sitemap.xml` exists, is referenced from robots.txt, and a Google search for
  `site:<domain>` roughly matches its count — the gap is the indexing work-list.
- hreflang between language versions, one canonical per page, an author / about page.

Unfixed items are the client work-list; they are not a reason to stop writing.

## Stage 1 — Topic discovery (skip when the topic is handed in)

Read, in parallel, one query set per source — in the browser, or with whatever search
or social-data tool is connected:

- Google autocomplete for "<vertical> …" — how people phrase it;
- a Google search for "<vertical> news" limited to the past month, and Google News for
  the vertical sorted by date — what moved this month;
- a Reddit search / the subs, and a search of X — the pain threads, the questions
  asked three times a week, the arguments with velocity;
- competitor blogs (a Google search for "<vertical> blog <topic>") — their gaps are
  the angles;
- `seo:learnings` in `NOTES.md` — which past angles ranked or got cited.

Each candidate: `{topic, sub_intent, angle, why_now, sources[]}`. **One sub-intent
per article** — definition, comparison, risk, pricing, use case, alternatives, proof,
operating notes; two pieces on the same sub-intent of one cluster cannibalise each
other. Rank by audience pain × freshness × fit with the site × past learnings; the
user picks from the top three.

## Stage 2 — Go / no-go

1. Cluster + sub-intent + angle named.
2. Collision check: the articles in flight in the working folder, and a Google search
   for `site:<domain> <primary keyword>` (published). Same sub-intent already covered
   → extend that page instead.
3. POV test: a claim someone could disagree with. None → it is a recap → stop.
4. Artifact test: the five human artifacts — a real example, a number from practice,
   a strong thesis, a caveat, a concrete next step. Three or more would be invented →
   change the angle or drop it.

## Stage 3 — SERP and keyword recon (live, no keyword tools)

1. A Google search for the candidate primary, in the target country and language —
   who ranks and in what shape (listicles, docs, vendor pages, forums). Page one all
   high-authority exact-match → pick a longer-tail primary. A Reddit or forum result
   on page one is the sign the query is winnable.
2. Harvest the phrasings from the ranking titles and snippets → three to six
   secondary long-tails; Google autocomplete for the rest.
3. Mine real question language for the FAQ (five to seven): the Reddit threads with
   their comments, the replies under X posts — copy how people ask, not how a
   marketer would.
4. **Freshness check for anything law-, price- or rule-sensitive:** search the last
   90 days (results limited to the past month, Google News, the live communities). A
   guide from January about a law that changed in April is wrong by July; the forum
   thread from last week usually is not. Sources conflict → the newer primary-adjacent
   source wins, and the discrepancy itself becomes content.
5. **Community evidence:** two to four live threads where real people hit the problem.
   They become the FAQ phrasing and links inside the body.
6. Meta: title ≤ 60 characters (cap 70), carries the primary, reads human;
   description 140–156; slug in kebab-case with the primary and no stop-words (keep
   the exact question when the primary is a question).

Result: the keyword block and a one-paragraph SERP gap («page one has X and Y,
nobody covers Z — Z is our wedge»). No gap → back to Stage 2 with another angle.

## Stage 4 — Brief

Compress Stages 1–3 into the contract, saved under `seo:brief:<slug>` in `NOTES.md`:
the angle in one sentence, the keyword block, the SERP gap, the tier (pillar 2000–3500
words or supporting 600–1200), the category from the taxonomy, the internal links
(three to five sibling pages + two or three product pages, with anchor text), the
external citations (one to three, verified only), the five artifacts named, the media
plan (which sections get a graphic), the special instructions (vendors to avoid, cases
to obscure). A draft that drifts from its brief is a bug.

## Stage 5 — Media (start early; generation runs while you write)

A pillar carries a cover + two to four inline graphics + one or two code or quote
blocks, so that no section is pure text. The `find-images` skill is the map of how to
get a picture (an image generator you have, local or web; a real photo with its
credit); every file sits in the working folder next to the text and is referenced
twice: `![alt](url)` under its section and in the media list, cover first.

- **Prefer text-free imagery.** It serves every language as is.
- A graphic that carries words is **one asset per language**; the language version
  embeds its own variant, including a text-bearing cover.
- Photos: not screenshots of someone's phone; the licence credit goes under the
  photo; the photo stands next to the paragraph it illustrates, not in a pile at the
  end of the section.

## Stage 6 — The draft

Rich Markdown for the site renderer, the whole vocabulary:

| Construct | Use for |
|---|---|
| `## H2` as a question or a claim | one per sub-intent facet |
| `### H3` | steps or variants inside a facet |
| `**bold**` on its own line | the claims to be quoted |
| lists | features, steps, checklists |
| `> ` blockquote | ONE quotable line per article, and every quotation from a person |
| fenced code | real commands, configs — even one buys technical weight |
| pipe table | ≥ 1 comparison table, required; tables get cited disproportionately |
| `![alt](url)` on its own line | the inline graphics, under the section they serve |
| `[anchor](url)` | sibling, product and external links from the brief |

**The body starts without an H1**: the site prints the title. Required flow:

1. **Cold open** — two or three short paragraphs: a scene or a hard number, the
   deeper shift. No preamble, no recap. The introduction does not give away the main
   figures (they belong to the sections); it should be more interesting, not more
   informative, than what follows.
2. **`## Quick answer`** — about 80 words, extractable, contains the primary keyword,
   ends with two or three links to the closest sibling pages.
3. **A cheap concrete number early.**
4. **The body** — one H2 per facet; sentence length varies; a graphic, a code block
   or a quote per major section; the community threads linked where the pain shows.
5. **≥ 1 comparison table**, with an intro line that says WHAT is in it; no paragraph
   after it retelling its rows.
6. **A methodology line** when citing the site's own data.
7. **An honest caveat.**
8. **`## Frequently asked`** — six to eight `**Q?**` items on the Stage 3 long-tails;
   the site renders FAQPage schema from this pattern.
9. **Close** — one declarative sentence, then the CTA paragraph from `seo:site`.

Tier discipline: a pillar under 2000 words is unfinished (expand or re-tier); a
supporting page padded past 1200 is worse than tight. Depth is more facets, never
filler.

## Stage 7 — Editing (BLOCKING)

The pass that fails most drafts. Run it on title, every heading and the body, as a
full sweep, not a spot fix, before anyone sees the text.

**Facts and sources**
- Every sentence answers «where is this from?». Sources conflict → the number is not
  given at all. A quotation is opened in the source in full, with enough context;
  someone else's claim is attributed. Prices, contacts, laws are checked against the
  live source on the day of editing; what ages is dated.
- A sum of money on one forum comment is not published as ours: a second independent
  source, or it goes inside the quote as that person's words, or it is cut with its
  table row.
- Blogs and aggregators are not sources for prices or rules; the order is the law
  (the official register), the official portal, the operator's site, the official
  explanation via an agency. A claim that rests only on a blog is deleted — together
  with the conclusion built on it and its repeats elsewhere in the text (search the
  text after deleting).
- A mass sample beats a single review (Google Maps 4.8/1049 over TripAdvisor 4.9/68);
  what seven visitors say over three years is a statement, what one said is a hedge.
- No relative dates: «this spring» → «in April 2026». Every reference to a norm
  carries a link to the norm itself.
- Natural units interest the reader more than money (count cars, not billions);
  an absolute number is compared only next to its share.
- Between an event and the numbers there must be a mechanism, or it is «after,
  therefore because».

**What is not written**
- Nothing about our own work («this article too is written by this rule», «we
  checked the listings»). No section about the method; no section about the absence
  of information (that is one FAQ item). A conclusion anyone can draw alone is not
  written.
- No first person and no brand-as-agent («we will deliver», «AutoHub will bring the
  car»); impersonal («the car is delivered»); the brand sits in a FAQ question or as
  an attribute.
- Advertising only where the section is already commercial, before the table, not
  after; direct calls («rent from $450») go to the FAQ. Other people's services are
  not promoted.
- «Legally» creates a criminal subtext; wrapper words without support («all plans —
  all inclusive», «rare», «fresh») are replaced with the specific or cut.

**Structure**
- A heading is the name of its section, not part of the text: the section does not
  open by answering its own heading; it opens with two or three sentences of context,
  then the answer. Three or four heading variants in the note; the user picks.
- Every paragraph opens with a concrete fact, not an abstract lead-in («Then the
  direction changes»). One year, one episode, one paragraph. A story-example is
  introduced by a question it answers.
- Sections that answer the same question are merged (three sections about money are
  one section with H3s). A section without content is rewritten or folded into a FAQ
  item, never propped up. Nothing is said twice; the table does not duplicate the
  text, and the text does not retell the table.
- The introduction promises what the table of contents delivers (three routes → three
  route sections). The lead (annotation) is a short retelling, not a copy of a
  paragraph, without the concrete prices and routes.
- A biography is one or two sentences; a person is introduced (who → photo → the
  point); people are called by name; an object is not introduced out of nowhere.
- FAQ: short self-contained answers (not «see the table above»), each question a real
  search query about the subject of the article, in the modality of the question; no
  duplicates of sections, no questions about an adjacent topic.

**Words**
- Nothing inanimate acts: roads do not «take shape», a law does not «appoint», a
  city does not «count its money», statistics do not «name the cause», accidents do
  not «distribute themselves», road safety has no «budget». Check every inanimate
  subject in front of an action verb; write through the people, the bodies, the
  numbers.
- Plain words over beautiful ones; the reader is an ordinary person. Jargon and
  industry terms are explained or replaced («one-way rental» → «pick up in Georgia,
  return in Armenia»). Figures of speech («by the piece», «a window», «under the
  hood», «fleet» for a country, «old» for a car) go; an event is called by its own
  word (towed, not «vanished»).
- Colloquial expressions are removed in one sweep across the whole text («managed to
  grow», «next come», «all the more so», «this means the following»); so are pairs of
  words that do not occur in life («accuracy suffers», «the deadliest violations»).
- No canceller («to the level of such-and-such year», «at 1.5 lari a day… two
  services cost» → «the booking costs 1.5 lari per day»). Long sentences are split; a
  semicolon is almost always a place to cut.
- Publications are declined by what they are (an online newspaper «counted», a TV
  company «took apart»). A word only in its own meaning (brand ≠ model ≠ range). A
  pronoun does not reach back across half a sentence; «its» / «his» is never
  ambiguous.
- A generalisation («in two ways», «they differ», «all cars») is unpacked at once into
  the items and the shares. «Indicator», «criterion» without the measured thing do
  not work. A list of factors is homogeneous in sign. A planned tightening is
  preceded by what applies now.
- Translations of official wording are literal («wins UEFA Player of the Season» ≠
  «UEFA named»); «translation ours» is never written, in any language; source handles
  (r/…, u/…) live only in the attribution line, never in prose.

**Punctuation (RU)**, a separate full pass
- The dash is put by a rule you can name, never for rhythm: between a noun subject
  and a noun predicate («ремонт здесь — массовая услуга»), for an omitted member in a
  comparison («в одном городе берут, а в соседнем — нет», «20 — за осмотр, 80 — за
  знаки»), for the explanation after a number («189 839 из США — почти четыре из
  пяти»), in a route name («Садахло — Баграташен»), in the attribution line of a quote.
  An authorial dash before «и», «но» or an explanation becomes a full stop, a comma or
  a colon. A missed obligatory dash is as wrong as an extra one.
- A comma, not a dash, before «чтобы»; a comma before «чем»; a comma before a
  participial clause; a comma before «и известно это». Quotation marks wrap the whole
  phrase from the source. Enumerations are numbered lists or dashes, not «Первое: …
  Второе: …». Pairs «name + number» are formatted the same way throughout; units and
  percentages in one way per section; no silent rounding.
- A quotation = blockquote with the original, the translation and the last line
  `> — [source](url)`; a paragraph consisting only of a Markdown link becomes an embed
  on most renderers — check before publishing. No embeds.

**AI tics (every language)**, strict zero in title, headings and body:
- EN: em-dashes in prose; «seamless, delve, unlock, leverage, robust, comprehensive,
  cutting-edge, transformative, holistic, harness, empower, streamline, game-changer,
  deep dive, crucial, paramount, moreover, furthermore, important to note, in today's
  …»; antithesis in headings («X isn't Y. It's Z», «X, not Y»); triple parallels;
  meta openers («The truth is», «Here's the thing»).
- RU: the dash is grammar and stays; the tics are «в современном мире», «не секрет,
  что», «стоит отметить», «важно понимать», «давайте разберёмся», «данный» as a
  filler, «является» chains, «в заключение», «сам/сами» opening a sentence.
- KA and others: the structural bans (antithesis, meta openers, triple parallels,
  the site's banned list); the local tic list grows in `seo:site` → `banned_words`.

A factual error found during any pass is fixed in the same pass, not queued.

## Stage 8 — Defensible claims (BLOCKING)

Find every `[0-9]+%`, `$N`, `Nx`, «published», «reported», «according to». Each one is
the site's own data with its methodology, a third-party fact with a URL verified this
session (search the claim, open the page, link THAT page), or a first-person frame
(«by our estimates»). No verifiable source → attributed in prose without a link, or
cut. The list of claims → treatment goes into the draft note.

## Stage 9 — Links

Outbound: three to five sibling pages and two or three product pages linked inline
where they belong (a Google search for `site:<domain> <topic>` when the link map in
`seo:site` is silent), plus the verified external citations and the community threads.
Inbound: the two or three most related existing pages get one sentence linking to the
new one; a page nobody links to is invisible. Apply where the deploy chain allows;
otherwise list the edits in the note for the user. A link leads to what the sentence
is about, or it goes.

## Stage 10 — The publishing package and handing over

The visible body is half the page; the head is the other half. It travels as YAML
front matter at the top of the file (the site's deploy chain or CMS reads it):

```
---
lang: ru
slug: parking-in-georgia
meta_title: …            # ≤ 60 chars, may differ from the H1
meta_description: …      # 140–156
canonical: https://<domain>/ru/journal/parking-in-georgia
hreflang: {ru: …, en: …, ka: …, x-default: …}
category: <from the taxonomy>
jsonld:                  # schema.org blocks, an array
  - Article (headline, description, image = cover, datePublished, dateModified, author, publisher)
  - FAQPage (every Q/A from the FAQ block, verbatim)
  - BreadcrumbList (home → journal → article)
  - the business subtype when the site is a local business (AutoRental: name, url, telephone, address, areaServed) — never a fabricated aggregateRating
  - VideoObject for every embedded or linked video (name, description, embedUrl, thumbnailUrl; omit uploadDate rather than invent it)
sources: [the verified URLs]
---
```

One file per language in the working folder (`<slug>.<lang>.md`: the H1, then the
front matter + Markdown body), the cover and inline graphics next to it, same `slug`
across languages, each with its own front matter; the primary language first, the
others after it has passed every gate. Read the file through as the reader would
before showing it. Show it to the user; nothing is published until they say so. Then
the user publishes through the deploy chain from `seo:site`, or by hand; verify live
(HTTP 200, in the sitemap, text/HTML ratio ≥ 15%) and note the live URL in the file.

## Stage 11 — Localization (every site language, not optional)

Localization is not translation. Per language, redo the keyword recon in that
language (the SERP is different; the Quick answer and FAQ target THOSE queries), write
the meta fresh (counted in the target language), rewrite the body idiomatically in the
site's voice with the structure, tables and links kept, swap text-bearing images for
that language's variant. **Facts stay frozen:** every number, name, date, price and
source link is copied from the gated primary exactly; nothing added, dropped or
rounded. The editing pass runs per language with that language's tic list.

## Stage 12 — Announce and measure

Within a day: a post (the `social-post` skill) or a thread (`social-thread`) on the
user's social accounts linking the live URL, in each account's voice; indexing
requested where `seo:site` says how. On day ~14: a Google search for the primary for
the rank, a search for `"<title>"` in quotes for pickup, the target queries in
Perplexity / AI Overviews for citations. Then append under `seo:learnings` in
`NOTES.md`: which angle, title and SERP-gap call produced the result, which SERP
shapes proved winnable. The pipeline does not learn without the write-back.

## Checklist before the user sees it

- Go recorded (cluster + sub-intent + angle, collision-checked live)
- keyword block from the live SERP; meta title ≤ 60/70, slop-clean; a named gap
- brief under `seo:brief:<slug>`; the draft matches it
- cover + 2–4 inline graphics woven in (`![]()` and the media list); no section is pure text
- question H2s, ≥ 1 table, ≥ 1 code or standalone quote, Quick answer, FAQ 6–8
- no H1 in the body; the introduction gives nothing away; a caveat; one CTA close
- editing pass: facts, structure, words, punctuation, tics — 0 hits, full sweeps
- every number verified this session and cited, anchored or first-person framed
- 3–5 sibling + 2–3 product links; inbound edits applied or handed off
- front matter complete; no fabricated schema values
- one file per language, facts frozen, per-language recon, meta and editing pass
- `seo:site-audit` exists for this site; `seo:learnings` written after measuring

---

*Part of the free [AICB content skills](https://github.com/corj1k/aicb-content-skills). What a skill alone cannot do — reads of X / Reddit / Instagram / Google as tools, monitoring, posting from your own browser, the timeline, a render box — is [AICB](https://aicb.notpeople.ai).*
