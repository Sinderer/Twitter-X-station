---
name: market-data
description: Public REST and websocket recipes for market data — Polymarket (gamma / CLOB / data-api: events, books, fills, probability history, the 5-minute crypto rounds), Binance and Hyperliquid (klines, trades, books, live streams), CoinGecko and DexScreener (coins, charts, logos), DefiLlama (TVL, DEX volumes, yields), coin icons — with the fetch-script shape, rate-limit traps and the token-id vs condition-id gotcha. Use when the user asks for prediction-market data, crypto prices or candles, order books, whale trades, a chart or post about a market, or data for a terminal / algo film.
---
# Prediction markets and crypto data

Where market data comes from and how each API is
talked to: prediction markets (Polymarket), spot and perps (Binance,
Hyperliquid), coins and tokens (CoinGecko, DexScreener), DeFi and chains
(DefiLlama), the icons. All of it is public REST and websockets — no login,
no browser, nothing metered: the reads run on the user's
machine, the raw answers land in the working folder
(`work/markets/<day>/`), and only what is published leaves it. Who uses
it: a `terminal` film (the `code-film` skill's `references/terminal.md` §1 has
the short table and points here), an `algo_film` on real market data (the
`code-animation` skill's `references/algo_film.md`), a post or thread about a
market, a recurring watch on a market the user asked for.

Every source here answered without a key in September 2026. Where a free
key makes the limits comfortable it is said; the key is the user's and stays
on the machine.

## 0. The shape of every pull

- **A fetch script, not a chain of curls**: retries with back-off on 429
  (pause, retry once, never loop), a semaphore of ~6 concurrent requests, one
  JSON file per source and page into `work/markets/<day>/raw/`. A day of 1 s
  candles plus every fill of a busy market is on the order of 100 MB and a
  couple of minutes to pull.
- **A browser user agent** on the services that 403 a bare one (Polymarket's
  gamma and CLOB):

  ```
  curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/146.0.0.0 Safari/537.36" "https://gamma-api.polymarket.com/events?slug=<slug>"
  ```
- **Time in UTC, milliseconds where the API wants them** (Binance), seconds
  elsewhere (Polymarket slugs and history). Take one full UTC day when the
  piece is a day; say which day in the frame or the post.
- **Then export** a compact file for whatever consumes it (a page, a chart,
  a post): rounded numbers, events packed as arrays (`[t, side, usd, price,
  nameIndex]` with a names table), full detail only for the stretches that
  matter and the top N events for the rest. A couple of MB is plenty.
- **What is real stays real.** A number on screen or in a post is the API's
  number with its time; a detail nobody would invent (a price that stalls
  for four seconds, a whale with a silly name, a round that settles against
  the model) is what makes the piece worth watching. When something is
  simulated, say so.

## 1. Polymarket — prediction markets

Three hosts: **gamma** `https://gamma-api.polymarket.com` (events / markets
metadata), **clob** `https://clob.polymarket.com` (books, prices, history),
**data** `https://data-api.polymarket.com` (trades, holders, positions,
activity). Gamma and CLOB need the browser user agent (§0).

| what | request | notes |
|---|---|---|
| events by text | gamma `/events?closed=false&active=true&archived=false&order=volume24hr&ascending=false&limit=100` then filter `title`/`slug` locally | gamma has no text search; `?closed=true` for resolved |
| hottest events | gamma `/events?closed=false&active=true&archived=false&order=volume24hr|volume|liquidity|openInterest|startDate|endDate&ascending=false&limit=20&offset=0[&tag_slug=geopolitics]` | live/upcoming is not a gamma filter — read `startDate`/`endDate` yourself |
| biggest price moves | gamma `/markets?closed=false&active=true&archived=false&order=volume24hr&ascending=false&limit=100` → rank by `oneDayPriceChange` (or `oneHourPriceChange`) | keep a volume floor (`volume24hr` ≥ 10 000) — illiquid markets "move" on a $5 fill |
| niche catalog | gamma `/tags` is an unranked dump; better: the `tags[]` of the top-volume events above, aggregated by 24h volume | |
| one event + its markets | gamma `/events?slug=<slug>` or `/events?id=<id>` | `markets[]` with `clobTokenIds` (JSON string → list) and `outcomePrices` |
| one market | gamma `/markets?slug=<slug>` or `/markets?condition_ids=0x…` | `clobTokenIds[i]` = token per outcome; a resolved market may vanish from `?slug=` — go through its event |
| the 5-minute crypto rounds | gamma `/events?slug=btc-updown-5m-<start_unix>` (also `eth-`, `sol-`, `xrp-`) | `eventMetadata.priceToBeat` / `finalPrice` = the real open and settle, `outcomePrices` = who won, `clobTokenIds`; one round every 300 s, the slug is the round's start |
| recent fills | data `/trades?market=<conditionId>&limit=50[&filterAmount=500]` | |
| every fill of a market | data `/trades?market=<conditionId>&limit=500&offset=…` | `side`, `size`, `price`, `outcome`, `name`/`pseudonym`, `proxyWallet` — a tape, whales and a leaderboard from one endpoint; ~1,300–1,600 fills per 5-min round |
| big fills | data `/trades?limit=50&filterAmount=10000[&market=<conditionId>]` | |
| top holders | data `/holders?market=<conditionId>&limit=20` | per outcome |
| order book | clob `/book?token_id=<token>` | bids/asks |
| midpoint / spread / last | clob `/midpoint?token_id=`, `/spread?token_id=`, `/last-trade-price?token_id=` | three tiny calls |
| probability history | clob `/prices-history?market=<token_id>&startTs=<unix>&endTs=<unix>&fidelity=60` | `market=` takes the TOKEN id here, not the condition id; `history[].{t,p}` |
| trader positions | data `/positions?user=<wallet>&limit=100[&market=<conditionId>]` | holdings + P&L |
| trader activity | data `/activity?user=<wallet>&limit=100` | action feed |
| trader page | `https://polymarket.com/profile/<wallet>` | |
| the event's icon | `icon` on the gamma event | download it, do not hotlink |

`token_id` is the CLOB token id (one per outcome), NOT the 0x condition id.
Gamma is camelCase and stringifies lists (`clobTokenIds`, `outcomePrices`);
data-api returns real floats.

**Screenshots** of a market or a trader, in your browser (by hand, or a browser
automation MCP such as Playwright MCP / Chrome DevTools MCP; logged out is
fine): open `https://polymarket.com/event/<slug>` → wait ~3 s (numbers hydrate
client-side) → take the screenshot. Trader pages:
`https://polymarket.com/profile/<wallet>?tab=positions|activity`.

## 2. Spot and perps — Binance, Hyperliquid

| source | request | what it gives |
|---|---|---|
| Binance klines | `GET https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1s&startTime=<ms>&limit=1000` | 1 s OHLCV: 87 pages per day. Seconds with no trade are missing, so carry the last close forward. Other intervals: `1m`, `5m`, `1h`, `1d` |
| Binance trades | `/api/v3/aggTrades?symbol=BTCUSDT&startTime=<ms>&endTime=<ms>&limit=1000` | the tape: price, quantity, buyer-maker flag, time |
| Binance book | `/api/v3/depth?symbol=BTCUSDT&limit=1000` | the book NOW — there is no REST history of the book: a liquidity heatmap or "book mountains" over time must be RECORDED live (below) |
| Binance live | `wss://stream.binance.com:9443/ws/btcusdt@aggTrade`, `…@depth@100ms`, `…@kline_1s` | record to JSONL for as long as the piece needs; the book stream is diffs over a `/depth` snapshot |
| Hyperliquid candles | `POST https://api.hyperliquid.xyz/info` `{"type":"candleSnapshot","req":{"coin":"BTC","interval":"1m","startTime":<ms>,"endTime":<ms>}}` | perp candles |
| Hyperliquid book | `POST …/info` `{"type":"l2Book","coin":"BTC"}` | a book with order counts per level |
| Hyperliquid trades | `POST …/info` `{"type":"recentTrades","coin":"BTC"}` | recent perp trades; liquidations show as trades with the liquidation flag in the explorer feeds |

Binance public endpoints need no key; weight limits are generous for a
day's pull at a semaphore of 6, and a `429` / `418` means stop for the
minute it names in `Retry-After`.

## 3. Coins and tokens — CoinGecko, DexScreener

| source | request | what it gives |
|---|---|---|
| CoinGecko markets | `GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&sparkline=true&price_change_percentage=1h,24h` | the top 250: caps, 24h / 1h moves, 7d sparklines, **`image` = the coin's logo URL** |
| CoinGecko chart | `/coins/{id}/market_chart?vs_currency=usd&days=1` (`days=7`, `30`, `max`) | prices, caps and volumes over time; `days=1` is 5-minute points |
| CoinGecko one coin | `/coins/{id}` | description, links, categories, the full market data |
| limits | ~30 calls/min free; a free **demo key** from coingecko.com sent as the header `x-cg-demo-api-key` makes it comfortable | the key is the user's and stays on the machine |
| DexScreener search | `GET https://api.dexscreener.com/latest/dex/search?q=<symbol>` | memecoin pairs across chains: price, liquidity, txns, volume, `info.imageUrl` |
| DexScreener token | `/latest/dex/tokens/<address>` | every pair of one token |

## 4. DeFi and chains — DefiLlama

| request | what it gives |
|---|---|
| `GET https://api.llama.fi/overview/dexs?excludeTotalDataChart=true` | DEX volumes by chain and protocol |
| `GET https://api.llama.fi/protocols` | every protocol with TVL, chain, category |
| `GET https://api.llama.fi/protocol/<slug>` | one protocol's TVL history by chain |
| `GET https://yields.llama.fi/pools` | yields by pool |

Volumes, TVL and flows make good treemaps and flow diagrams; no key, no
limits worth noting at this pace.

## 5. Icons

CoinGecko `image`, DexScreener `info.imageUrl`, the Polymarket event's
`icon`, and the generic set
`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/<sym>.svg`.
Download them into the project (`public/` for a page) — never hotlink during
a capture or in a post's image.

## 6. Publishing about a market

Read → write → the post or thread (the `social-post` / `social-thread` skill),
saved as a `.md` in the working folder with the screenshot or chart next to
it. The numbers in the text are the API's, with their time; a thread about a
round says which round (the slug's timestamp). Look at the chart or screenshot
yourself before showing it; the user reads the piece before it goes out. A
daily or weekly piece on the same market is a recurring column, and what was
already said about it is in the previous pieces in the working folder and the
project's `NOTES.md`.

## 7. Known

- 429 anywhere → pause and retry once; do not loop. Binance also answers
  `418` after repeated 429s — that is a temporary ban, stop for the minute
  given.
- Polymarket gamma / CLOB 403 without a browser user agent.
- `token_id` (CLOB, per outcome) ≠ condition id (0x…, per market); the
  history endpoint wants the token id under the name `market`.
- Binance 1 s klines skip seconds with no trade; a book over time exists
  only if it was recorded.
- A resolved Polymarket market may vanish from `/markets?slug=`; read it
  through its event.
- Illiquid markets "move" on a $5 fill — rank moves with a volume floor.

---

*Part of the free [AICB content skills](https://github.com/corj1k/aicb-content-skills). What a skill alone cannot do — reads of X / Reddit / Instagram / Google as tools, monitoring, posting from your own browser, the timeline, a render box — is [AICB](https://aicb.notpeople.ai).*
