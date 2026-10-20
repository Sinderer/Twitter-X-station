---
name: social-quote
description: Writes a quote post (X or Threads "Quote") — one to three sentences of the user's own comment over someone else's embedded post — using one of five moves (correction, context, example, extension, joke), and decides when a quote is right versus a reply or a repost. Covers where the target comes from, reading the post and its replies first, tone and risk (disagree with the post, not the person; small vs big authors), the 280/500 limits and a checklist before the user sees it. Use when the user says "quote this", "QRT this", "respond to this on my own feed", "what would I say over this post", or pastes a post link asking for a take on it.
---
# Social quote

## What it is

Someone else's post embedded under the account's own comment on it (X «Quote»,
Threads «Quote»). The embedded post is the target (its URL, author and text);
the comment is the text. It is a reply in public: the quoted author sees it,
their audience sees it, and the account's own audience sees both. The result is
a new post on the account.

## When a quote, and when not

- The comment **adds something the post did not have**: a disagreement with a
  reason, the missing context, the number that changes the reading, the next
  step, the case that proves or breaks it, the joke that only this account
  would make. «This.», «So true», «Thread 👇», «Great take» are a repost with
  extra steps: repost instead.
- The point is **for the account's audience**: then quote. The point is for the
  author and the people already under their post: then a reply (the
  `social-reply` skill). The same thought can be both; it is not posted as both.
- The post is one the account would not want to be seen next to (a scam, a
  pile-on, a stranger's bad day): skip. A quote amplifies the quoted post as
  much as the comment; quoting to dunk hands the author the account's audience.
- The author is a small account: a quote from a bigger one drops a crowd on
  them; say so in the draft note and let the user decide. The author is a big
  account: the quote competes with hundreds, and only a comment with new
  information or a real joke gets seen.
- A quote of the account's own earlier post («what changed since») is a
  legitimate form and the one way to bring an old post back; once a month, not
  weekly.

## Where the target comes from

- **a find from a watch you run** (a mention or keyword watch, with any tool,
  or searching by hand): a keyword watch surfaces posts on the account's topic
  (quote when the account has the missing piece), an author watch the people
  the user follows (the account is a regular in their replies, a quote is for
  the one post a month that deserves it), a mentions watch the posts naming
  the account (a quote answers in public when the mention is public praise or
  a public question; a complaint gets a reply, not a quote). Triage as for
  replies; after writing, mark the find handled in your watch list.
- **the user's own link** («quote this one», «answer this on your own feed»).
- **a post the account found while reading** (searching X, the trends page →
  the top posts of a trend are the ones everyone quotes; the second-tier post
  in the same trend is where a quote gets seen).

In every case **read the post first**: open it in the browser, or with
whatever social-data tool is connected, with the replies under it for what has
already been said (a point made thirty times in the replies is not new in a
quote), and the author's recent posts when the quote argues with them — a
quote that misreads the author (they said the opposite two posts earlier) is
the one that gets quoted back. A post the account already replied to is not
quoted as well: pick one.

## Before writing

- the voice notes in `NOTES.md` (languages, style, rules, examples: does this
  account joke, does it argue), whether the account has X Premium (280
  characters without Premium; the quoted post does not count).
- the `quote` notes in `NOTES.md` for standing instructions ("don't quote
  competitors", "no politics", "quotes only with a number").
- the user's own instructions for quotes, if they wrote some down in
  `NOTES.md` — they override this skill.
- the last twenty quotes in the working folder, so the account does not quote
  the same three people every week, and so a post quoted last month is not
  quoted again (a second quote of the same post is done on purpose or not at
  all).

## What the comment does

Five moves that read well; pick one, not three:

1. **The correction** — the post is wrong or incomplete; say what is right,
   with the number or the source, in the account's voice, without the sneer.
   «The 40 % figure is from 2019. The 2025 survey has it at 12 %, and the
   method changed — link in the reply.»
2. **The context** — the post makes more sense once you know X; the account
   knows X. «This is what happens when the vendor's default is 30 s and nobody
   reads the config. We hit the same wall in March.»
3. **The example** — the post states a principle; the account has the case
   that proves or breaks it. «We did exactly this with ants and a maze. Took 48
   hours; the shortest path appeared at hour 31.»
4. **The extension** — the post stops one step early; the account takes the
   step. «And the part nobody says: once you have this, the next bottleneck is
   the review queue, not the model.»
5. **The joke** — the post sets up a line the account's audience will get. Only
   in a voice that already jokes (the voice examples), and never at the
   author's expense when they are smaller than the account.

A quote is **one to three sentences**. The quoted post is already on the screen;
the comment does not retell it, does not start with «This post…», does not
say «Great point». The first words carry the point, because in the feed the
comment is read before the card loads. The language is the account's (the
languages in the voice notes); quoting a post in another language is fine and
the comment is still in the account's own.

## Tone and risk

- Disagree with the post, not the person. A quote that is a dunk collects the
  author's audience under it, and X ranks the quoted author's reply above the
  account's. If the user wants a dunk, it is their call, written down in
  `NOTES.md`, and the account takes the ratio.
- Praise is cheap and reads as an ask for attention; praise with a specific («the
  third chart is the one everyone should save») reads as a reader.
- Links are allowed in the comment (a link the user gave, verbatim). X shows a
  quote with a link to fewer people; that is a known trade, not a reason to
  drop it. No invented sources, no «according to…» without the link.
- Media can ride with the comment: a screenshot that proves the correction is
  the strongest quote there is; a chart with the right number is the second.
- The account's product in a quote is a perspective («we measured this across
  200 runs») and never a pitch («try our tool»); the one exception is a quote
  of praise for the product, which is also the one that reads worst when done
  often.
- No quoting a post that is itself a quote of the account; that is a reply.

## Per platform

- **X:** the Quote item under the repost icon → the composer with the card →
  text (→ media) → Post. 280 characters without Premium. The result URL is the
  account's new post; the quoted post's author is notified. A quote within the
  first hour of a post is seen with the post; after a day it is seen only by
  the account's own audience, which is sometimes the point.
- **Threads:** the same shape and the same five moves; 500 characters; the
  quoted post's replies and the quote's replies are separate conversations.
- **Reddit** has no quote: a crosspost is a different thing; quoting a Reddit
  post on X is a post (the `social-post` skill) with a screenshot and the
  author's permission. **Instagram** has no quote (this skill is for X and
  Threads).

## Handing over

Write the comment into a dated `.md` in the working folder, with the target
above it — the post's URL, its author and its text — so the user sees what is
being quoted without opening it; the media file, if any, next to it. Show it
to the user; nothing is posted until they say so. After it is live, note the
new post's URL in the file.

## After

- Mark the find handled in your watch list when it came from a watch; the
  finds not quoted are skipped, with the reason.
- When the quoted author answers, that is a reply (the `social-reply` skill) to
  write, not a second quote.
- Note under `quote:learned` in `NOTES.md`: which moves the audience picked
  up, which authors answered, whom not to quote again, what the user changed
  in review.

## Checklist before the user sees it

- the comment adds something (one of the five moves); not «This.»
- the post was read in full with its replies; the author not misread
- one to three sentences; the point in the first words; in the account's language
- disagreement with the post, not the person; no dunk unless the user asked
- the user's link verbatim; no invented sources; media proves, not decorates
- 280 / 500; the account has not quoted this post or this author lately
- the target noted in full (URL, author, text); the find marked handled after

---

*Part of the free [AICB content skills](https://github.com/corj1k/aicb-content-skills). What a skill alone cannot do — reads of X / Reddit / Instagram / Google as tools, monitoring, posting from your own browser, the timeline, a render box — is [AICB](https://aicb.notpeople.ai).*
