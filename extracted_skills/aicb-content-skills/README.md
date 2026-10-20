# AICB Content Skills

Twelve free skills for [Claude Code](https://claude.com/claude-code) that teach Claude how to
make content: short clips with burned-in subtitles, posts and threads, X Articles, SEO
articles, code-drawn animation, Blender builds, films shot from a web page, and where to get
free pictures and live market data for all of that.

They were written as the working playbooks of [AICB](https://aicb.notpeople.ai), the MCP for
creators, and have been running real accounts since spring 2026. This package is the craft
part of those playbooks with the product layer removed: no API keys, no subscription, no
server. Everything runs on your machine with open-source tools.

## Install

```bash
git clone https://github.com/corj1k/aicb-content-skills.git
cp -r aicb-content-skills/skills/* ~/.claude/skills/
```

Restart Claude Code (or `claude --resume`). Each skill triggers on its own; you can also
call one by name: `/video-clips`, `/social-post`, `/seo-article`, and so on.

## The skills

| skill | what it makes | tools it leans on |
|---|---|---|
| `video-clips` | a short vertical cut from a podcast, stream or talk, subtitles burned in, one language per burn (`references/clip.md` is the genre guide) | yt-dlp, ffmpeg, faster-whisper / whisper.cpp, optional [OpenChatCut](https://github.com/0xsline/OpenChatCut) editor |
| `social-post` | a single post for X, Threads, Reddit: research first, then several variants | the browser |
| `social-thread` | a chain of posts: a story, a build log, a list told in parts | the browser |
| `social-reply` | an answer under someone else's post that earns the reader | the browser |
| `social-quote` | someone else's post embedded under your own comment | the browser |
| `x-article` | a long-form X Article (Premium+ editor): topic, title, structure, cover | the browser |
| `seo-article` | a search-oriented article for your own site in 12 stages: audit, SERP recon, brief, draft, blocking edit and fact gates, localization | the browser, your CMS |
| `find-images` | pictures that already exist and are free to use: Wikimedia Commons, the Met, Art Institute of Chicago, archive.org, Unsplash/Pexels, Pixiv, cut-outs with rembg | public APIs, rembg |
| `code-animation` | 3–60 s films where every frame is drawn by code on a canvas or a pixel buffer; four genres in `references/` (algorithm film, pixel story, storybook, instrument panel) | HTML canvas, headless Chromium, ffmpeg |
| `blender-film` | photoreal 3D pieces rendered headless from a Python script; two genres in `references/` (brick build, paper gag loop) | Blender 4.5 LTS, ffmpeg |
| `code-film` | a film as a React + WebGL2 page, played live and shot frame by frame with Playwright; two genres in `references/` (terminal film, site film) | React, WebGL2, Playwright, ffmpeg |
| `market-data` | live prediction-market and crypto data without a key: Polymarket, Binance, Hyperliquid, CoinGecko, DexScreener, DefiLlama | public REST / websockets |

The skills refer to each other by name (a `terminal` film takes its data from `market-data`,
a `clip` is cut with `video-clips`), so installing the whole set is the simplest.

## What is not here, and where it is

These skills are the craft. The hands are in [AICB](https://aicb.notpeople.ai): connect the
same Claude to its MCP and it gets what a skill alone cannot have.

- **Reads without a browser.** X, Reddit, Threads, Instagram, Google, YouTube as tools:
  search, a user's posts, the replies under a post, trends. The research steps in
  `social-post`, `x-article` and `seo-article` turn from "open the browser" into one call.
- **Monitoring.** Mentions, keywords, authors and communities watched around the clock; new
  finds land in the inbox and `social-reply` / `social-quote` have their targets ready.
- **One timeline.** Drafts, approval, scheduling and the journal of what went live, per
  account, with the memory that `NOTES.md` imitates here kept on the server.
- **Posting from your own browser** on X and Reddit, in the account's own window, with the
  procedures that have run for months.
- **A render box.** A GPU server by the minute for `code-film`, `code-animation` and
  `blender-film` when the laptop is not enough.

The free skills stay free. Where one of them needs research it says so and leaves the tool to
you: a browser, or whatever search MCP you have connected.

## Conventions the skills share

- **Working folder.** One folder per project. Downloads, cuts, renders and the post text
  next to the media. Nothing is deleted on its own.
- **`NOTES.md`.** Standing facts about the voice, the formats that worked, what was already
  said. Skills read it before writing and append to it after.
- **Look before you show.** Open the file, pull a frame from the middle of the video, read
  the text once more. Then show the user.
- **Nothing is posted until the user says so.** The skills write; publishing is the user's
  click.

## License

MIT. Use them, change them, ship them with your own product.
