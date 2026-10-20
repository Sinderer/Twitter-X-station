# Terminal: a system at work, filmed

## What it is

A 20–35 second video of a **system at work**: a
trading bot, a swarm of AI agents, a queue being sorted, a codebase growing,
a model learning, a brain being mapped. It is a page built with React and WebGL2
only to be shot frame by frame, never deployed. The genre is everywhere on X,
and most of it looks mocked, which viewers can tell: a random-walk line, round
numbers, events spaced evenly, Chart.js in a div, lorem-ipsum logs, nothing
that glows, nothing that moves with intent. What separated the ones worth
watching:

- **the frame is a world, not a dashboard**: one algorithm on the whole
  screen, running on the real data (§A);
- **instruments that belong to that world**: the time, the main number, the
  trail of events and the close-up take their form from the world (a scale
  marked on the world's own object, a tide gauge, a flight recorder), not from the
  last terminal (§A.1);
- **characters**: the entities of the data (agents, wallets, tickets,
  documents, commits) are nodes with names you can follow, and the camera goes to them (§A);
- **an operator**: someone visibly using the tool, singling out a character
  and showing its real numbers (§A.3);
- **a transformation**: the world changes state on screen (it sorts, routes,
  grows, discharges, synchronises, crystallises). The ending is that new
  state still moving, not a results card (§A);
- **real material** from a system that actually ran (§1–2), and a clock
  that tells the story (§3);
- **light**: HDR, bloom, grain; frame = function of time, shot frame by
  frame in **16:9 or 4:3**; sound from the events (all of it the `code-film`
  skill's `SKILL.md`: the engine, the live preview, the
  shoot, the sound, delivery);
- **the idea came from Claude**: the user asked for "a terminal" or named a
  topic loosely, and Claude came back with ideas worth filming, each on data
  it had already checked it could get (the section right after §0);
- **the user saw it before it was rendered**: the film played live in the
  browser, the user was asked what to change, and the long render started
  only after their "ok" (`code-film` §2).

Trading is one domain among several. This guide deliberately has no
reference film: the worst terminal is a copy of the last one, and the
first world that comes to mind (a particle cloud, stars and gravity, a
glowing network) is the one every viewer has already seen. The world is
chosen from the data every time (§A.0), from the ~100 algorithms in §4b.


## A. The film's shape: a world, characters, an operator

A first version built as panels (a price chart, a tape, an equity
curve, a gauge, a leaderboard) came out as "plain charts". A second one with
a black hole in a panel was still a dashboard with a picture in it. What
worked is the other way round.

**0. Choose the world from the shape of the data.** Before any code,
write down in one line what the data *does*, then go to the algorithm
families that do the same thing. The same shape can be drawn by a dozen
algorithms; the job is to find the one nobody has used for this data.

| the data's shape | families that behave that way (§4b palette) |
|---|---|
| things flow between places (money between venues, requests between services, traffic) | Physarum, ACO, river formation, Stable Fluids / LBM dye, Sankey ribbons that thicken, lightning between poles |
| many actors, each with a state, influencing each other (traders, agents, voters) | Boids, Ising domains, Kuramoto sync, predator–prey swarms (Grey Wolf, Harris Hawks, Marine Predators), Lenia creatures |
| pressure builds and releases (leverage, a backlog, load) | Abelian sandpile, dielectric breakdown (Lichtenberg), SPH splash, cloth tearing, earthquake / spring-block |
| a search for the best (a sweep, a model training, routing) | PSO, simulated annealing crystallising, Whale bubble-net, Moth-Flame spirals, a loss landscape as a morphing surface |
| something grows over time (a codebase, a user base, a corpus) | DLA, space colonisation, L-systems, differential growth, Wave Function Collapse city, hydraulic erosion carving terrain |
| similarity and neighbourhoods (documents, embeddings, wallets by behaviour) | UMAP field with Voronoi cells, Lloyd relaxation, weighted stippling into a portrait, metaballs merging |
| one path through time (a price, a metric) | Lorenz / double-pendulum futures, Fourier epicycles redrawing it, a Hilbert-curve texture, Chladni patterns from its spectrum |
| a hierarchy or pipeline (stages, modules, teams) | treemap extruded into a city, a wire-sphere network, a stage stepper whose stages are simulations |

Then: pick **three candidates from three different families**, none of
them a world already in the film log (§B), and build each as a rough
live sketch of 3–5 seconds on the real data, before the HUD. Show the user
all three running (the preview shell's `pick('world', …)` switches them
live) and let them choose. If a candidate only works with a different data
mapping, say so; the binding (§4b) is half of the idea. A world that could
be fed random numbers and look the same is not bound yet.

The same goes for everything after the world: the instruments, the operator
and the list below are **functions**, and their form is designed for each
film from its world. A second film that reuses the first one's layout (clock
top left, big number top right, list on the left, chart along the bottom,
the same card) reads as the same product with a new background, however
different its world. Engine code carries over between films (renderer,
clock, capture, preview shell); HUD components and their CSS don't.

**1. The algorithm IS the frame, and the instruments grow out of it.**
Give the world the whole screen. Every entity of the data is an element of
it: an agent, wallet, ticket or document is a node; an event (a tool call, a
fill, a decision, an edit) is a particle; a batch, round or job is the core
they thread to. The instruments stay small and quiet, and what they must do is
fixed while how they look is not:

| function | what it carries | forms that came out of different worlds |
|---|---|---|
| time | where we are in the data, and how fast it runs | a big light clock in a corner · a scale marked on the world's own object · a tide gauge on a harbour wall · a chart recorder's paper feeding out · an orbit's phase dial · the sun's position over a city |
| the main number | the system's own result (P&L, tickets decided, tasks done) | rolling digits · a meter with a needle or a segment display · a counter stamped into the world (a building's height, a crater's depth) · a gauge that fills · a single figure set in huge type inside the world near the end |
| the trail of events | that things are happening now, with names | a transparent list the events fly into · tags pinned to where each event happened, flaring and fading · a console log along one edge · a flight-recorder strip · labels that float up from the world and dissolve |
| context | totals, rates, distributions | hairline rows · ridgelines · a stream graph · a stage stepper · marks and ticks on the world's own geometry |

Choose each form by asking what an instrument *inside that world* would look
like: a harbour gets a tide gauge; a city gets signs on its buildings; an
observatory gets a star chart's grid and a plate number. The forms in the
table are the ones already used; a new film invents at least one of its own,
and doesn't take the whole set from one row. Two have already become habits:
a tag that flares at the spot of an event and fades, and a number stamped
into the world. Use them when they are the best fit, not by default. Whatever the form, the
main number is the system's own result: a market total put in the big spot
gets read as the system's own result.

**2. Characters.** Real named things the viewer can follow. In an agent
system: the agents themselves with call-signs, a colour and the model each runs
(SCOUT-01 · CLAUDE, ARB-04 · GROK). In a queue: one ticket with its actual text.
In a repository: a developer or a module. In a market: the day's top wallet
by its real name, the strategy's own node ("THIS BOT"), a whale that loses. Each gets a size (its weight in the data), a colour (its class),
a ring if it is big, and a flash when it acts. Keep call-signs and colours the
same for the whole film.

**3. The operator.** Interactivity in a video = someone using the tool,
singling out one character and showing its real numbers (its name, what it
is doing now, its history: `TK-0071542 · "third time this week…" · DECIDED
70 ms · NEEDS HUMAN`),
2–3 times per film, 3–5 s each. The gesture is invented for the world,
the way a person inside it would single one thing out: a harbour master's
binoculars, a surgeon's clamp, a librarian pulling a card from a drawer, a
sonar ping that returns from one target, a spotlight on one building, a
command typed into a console. Two gestures are already worn out by earlier
films: the cursor with a reticle and a card, and a magnifier read through its
rim. Take either only when nothing in the world suggests better. Whichever
it is: the rest of the frame dims, the camera moves to the character, and it
pulls back after.

**4. Events you can see.** Every real event does something visible in the
world, in the world's own terms: a tool call's output flows back to the agent
that asked, a ticket drops into its class, money moves from losers to
winners, a level breaks down. The instruments count what the viewer just saw.

**Events that leave a trace in the instruments.** An event born in the
world shows up as text with its real name and number (`BUY UP $1,240 @0.62`,
`tool: search · 1.2 s`, `TK-00715 → URGENT`): a comet flies from the node
into a list, or a tag flares where it happened, or a line prints in a log.
What held in every form: pick the biggest events, more when the clock is slow
and one at a time when it races (≈2.5 per video second), always the
characters you lock; no panels or row backgrounds, text straight over the
world with a dark text-shadow; the fresh one glows for a moment in its
colour; it sits where the world is emptiest; it fades when the
transformation starts.

**5. A transformation instead of an ending.** The last third is the
chosen algorithm doing its own thing to the whole population, with a
readout of its progress: the network prunes to the routes that paid, the
sandpile discharges, the oscillators fall into sync, the annealing
crystallises, the city is finished, the swarm closes on its prey, the
population sorts into what it actually was (tickets into classes, agents
into the roles they played, wallets by behaviour). The transformation is
the algorithm's, not a generic "sort": it comes out of what that algorithm
naturally does. Totals count up next to the thing they describe, and one
character is locked once more inside the new state.
End on the new state still moving; it loops cleanly. An earlier cut ended
on a big results card, and that read as an ad; ending inside the world kept it
a film.

**Traps already paid for:**
- *Overexposure.* Thousands of additive dots + a web of edges + bloom
  make the centre white. Keep the base node brightness low (≈0.1 of the active
  brightness) and edges at 2 % alpha, and let only events glow.
- *Rays.* Drawing every neighbour of a locked node gives a sunburst of
  long lines. Use the 30 nearest, fade by distance, and let them grow.
- *A structure that smears.* Anything that rotates or flows for many
  seconds loses its shape (differential speeds wind spirals into a blur,
  advected dye turns to grey). Move shapes rigidly, or re-inject.
- *Labels on top of labels.* Give each counter its own side of its cluster,
  hide counters while the camera is zoomed, and one card at a time.
- *A digit frozen mid-roll.* A mechanical odometer carries a higher digit
  while the one below passes 9 → 0, so a value at rest like 29.61 shows the
  tens digit half-turned. Scale the carry by how fast the value is moving, and
  at rest every digit sits exactly.
- *HUD one frame late.* If the overlay reads positions the GL pass
  computed, it shows the previous frame. Compute the frame state first
  (positions, camera, clock), then render both from it.


## B. Never the same terminal twice

§A describes the shape, not the film. Every world is one answer for one
kind of data; the next terminal gives a different one. What kept the `code-animation` films from
repeating themselves works here too: a log in the project's `NOTES.md`
under a `film:terminal` heading, one line per film
on the axes below; read it
before the first concept.
The log only works if it is written: add the line when the user approves the
film, with the world, the look, the typefaces, the operator's gesture and the
instruments' forms, so the next film can steer away from all of them.
Then three concepts shown to the user that differ from each other and from the log on
three or more axes, each with its positions written next to it. The user's pick
then goes into the log.

| axis | positions |
|---|---|
| data | **systems**: an AI agent swarm's own run log (tool calls, decisions, tokens, latencies) · a queue being processed (support tickets, GitHub issues/PRs) · a repository's history (commits, files, authors) · a corpus mapped by embeddings · a model training (loss, checkpoints) · a live public stream (Wikipedia edits, GitHub events, OSM changesets). **Markets**: prediction markets (Polymarket rounds, fills, holders) · perps (Hyperliquid book, trades, liquidations) · memecoins (DexScreener) · the top 100 coins (CoinGecko) · DEX and chain flows (DefiLlama) · a strategy's backtest sweep |
| world (the algorithm on the whole frame) | a graph cloud that sorts into clusters · one point-surface morphing through named shapes · a black hole with an accretion disk · a Physarum network between markets · boids and predators · fluid ink · a sandpile / lightning cascade · Ising domains · Kuramoto oscillators on a ring · N-body gravity · reaction–diffusion · a city built by Wave Function Collapse · a 3D object the camera dives into |
| characters | named agents with call-signs and a model each · tickets with their text · documents · developers / modules · subsystems (SCOUT, FILTER, SCORE, EXECUTE) · wallets · strategies · coins with logos · one hero among thousands |
| operator | cursor clicks → reticle → dive → card · tabs switching the view · dragging a parameter slider and the world reacts · scrubbing the timeline · typing a command into a console · no cursor, the camera is the operator |
| transformation | one surface morphing shape to shape and back (a loop) · sort into clusters · a network grows and prunes to its routes · a cascade discharges · everything synchronises · the solution crystallises · a swarm converges on the best · one world splits in two · a city is built |
| camera | still with dives · one long dolly · into one detail and back out · orbit around a 3D world · split screen |
| look | dark neon on black · warm gold on near-black with one teal accent · warm paper, black type, one red · phosphor monochrome · ice-blue monochrome · blueprint · risograph print |
| HUD | numbers floating in the corners · a stage stepper with progress bars (01 / CORONA … 04 / RESTORE) · waveform-bar meters · a phase dial · a signal register with statuses (STREAMING / VERIFIED) · a pipeline stepper across the top · a console log along the bottom · a rail of agents on the left · radial dials |
| story | a queue drained from millions to zero · the day in 30 s · one batch in real time · a race between agents or strategies · before/after one change · one character's journey · a system learning, epoch by epoch |

**Concepts that already fit together** (world + characters + operator + transformation).

*Systems and intelligence:*

- **Ticket rain**: a real queue (support tickets, GitHub issues) falls as
  SPH droplets into channels carved by hydraulic erosion, one channel per
  class, the counter draining from its full size to zero → the reticle locks
  one droplet and its card shows the actual text, the decision and the ms it
  took → the channels deepen into a delta shaped by where the work went.
  Latency ridgelines per class and a stream of throughput along the bottom.
- **The ensemble**: the agents of an AI system as a sphere of light trails
  around a core, each tool call a streak from agent to core and back → the camera
  pushes in, and numbered callouts 01…05 pop up beside it naming the parts
  (ROUTER, MEMORY, TOOLS…) with a live mini chart each → the orbits
  settle into one coherent shape as the task completes.
- **Subsystem network**: the pipeline's stages as wire-frame spheres (SCOUT,
  FILTER, SCORE, EXECUTE around a central model) with packets flowing along the
  edges from the real run log → the cursor opens each sphere's card → a
  Physarum network thickens on the routes that carried the work.
- **Codebase city**: a repository's real history; each commit raises or
  extends a building per module (extruded treemap, or Wave Function Collapse
  tiles), and the authors drive through as vehicles → paper light theme → the
  camera flies over the finished city.
- **Mind map**: a corpus's embeddings (UMAP) as a star field, each question
  a comet whose nearest documents light up → the camera dives into a cluster and
  titles surface → the field condenses into named constellations.
- **Learning surface**: a model training as one point-surface that morphs
  through the loss landscape epoch by epoch, with checkpoints as a stage
  stepper → it settles into the shape of the trained model.

*Markets:*

1. **Event horizon**: fills are the accretion disk of a black hole (Keplerian
   dust, Doppler beaming, lensed far side) → the strategy is a star in orbit → a win leaves on
   the jet, a loss falls in → the disk's colour shifts as the day's flow turns.
2. **Slime router**: markets or venues are food sources, a Physarum network
   grows between them weighted by realised edge → the operator drags the
   edge threshold slider and the network re-routes live → it prunes to the one
   route that paid.
3. **The hunt**: every fill is a fish in a school (boids), the strategies are
   named hawks (Harris Hawks / Grey Wolf moves) that dive on mispricings →
   click a hawk to see its target and reason → at settle the school scatters and
   the hawks carry their catch to their nests (P&L bars).
4. **Liquidation lightning** (Hyperliquid): leverage piles up as sand on
   price levels (Abelian sandpile) → a move topples it into a cascade drawn as
   a Lichtenberg figure → the liquidated wallets are the characters.
5. **The crowd magnet**: wallets as spins on a lattice (long/short), the price
   move is the field → domains grow (Ising, Metropolis) → tabs switch the
   timeframe → the whole lattice aligns right before the dump.
6. **Sync**: the top 100 coins as oscillators on a ring with their logos,
   phase = returns, coupling = correlation (Kuramoto) → hovering a coin
   opens its card → the ring flashes in unison as the market synchronises.
7. **City of rounds**: every settled round places a building (Wave Function
   Collapse tiles, green/red), strategies drive through it as vehicles → paper
   light theme → the day becomes a city.
8. **Crystal**: the backtest's parameter sweep as simulated annealing / PSO,
   each particle a parameter set whose fitness is its real P&L → the operator
   drags the temperature → it crystallises into the chosen settings, and then
   that strategy runs.
9. **Regimes of the day**: one surface of points, one filament per round
   (one per round or batch, ~200 points each), drawn in 3D and turning slowly, far points darker. The real
   day's volatility splits it into regimes (calm, trend, chop, reversal), and at
   each change the surface flows into another named shape (corona of spiral
   petals, a closed cocoon, a saddle wave, and back). Real fills run as teal streaks
   along their round's filament, the strategy is a gold star glyph in the
   centre, and a stage stepper along the bottom names the shape and fills its bar.

The concepts above are sketches to show the range, not a menu: a new
dataset usually wants a world of its own from §A.0.


## 0. What the genre's videos share, and where they fall short

The terminal videos that travel on X have a common anatomy; take all of it:

- **Frame**: many of them are near-vertical. Ours were cut in 16:9 (1920×1080)
  and 4:3 (1440×1080): the feed shows both well, and the world had room to breathe.
- **One hero picture on 50–80 % of the frame**: in the ones we watched, an
  orb of light trails, a particle field, a ring of nodes with packets firing
  from a hub, a wave of hundreds of agents, a 3D fly whose brain is mapped. The terminal chrome around it is
  thin, dense and small.
- **Three speeds of motion at once**: the hero moves slowly and big; the numbers
  tick every frame (KPI row, P&L, counters); logs and tape scroll fast in
  small type. The frame is never still, and the eye always has somewhere to go.
- **Numbered callouts 01…05** appear one after another next to the hero, each a
  small card with a title, a mini chart and a formula line. They explain the picture
  without a voice, and each new card resets attention.
- **Signs of a live app**: a running clock, a progress counter (`42/300`),
  LIVE / REC badges, tabs that switch, a line of tape text, sometimes a cursor.
- **One colour family + one or two accents** (ice blue; magenta on black;
  phosphor green; graphite with pink and cyan).
- 15–25 s is typical; the main number (a P&L, a count of things done, a queue
  left) moves the whole time.

The strongest ones add a layer on top of that:

- **A pipeline stepper**: 5–6 stages across the top (SCAN → FILTER → MODEL →
  EDGE → ENTRY → SETTLE), each lighting up in turn with its own live counter.
  The interface tells the story, and the viewer always knows where they are.
- **A camera that dives**: the hero is a 3D object and the camera pushes
  from ×1 into a detail (×5–6) and pulls back out for the end, with the
  zoom factor as a live readout and depth of field (the foreground and background go soft).
- **Labels pinned to the hero**: a leader line from a part of the object to
  a small card (the name + one number), which follows it as the camera moves.
- **A matrix heatmap** with one cell highlighted, moving from pair to pair,
  and a small graph next to it showing the same pair.
- **A light theme done well**: warm paper background, black type, one
  saturated accent. Dark neon is one look, not the only one; choose the
  palette the way `code-animation` chooses a look.
- **A statement in big type** set inside the world near the end: one number and
  one short sentence that says what it means, while the world keeps moving.

Where they fall short, and so where to beat them: low resolution with text
turned to mush; a static camera; particles that are driven by nothing; numbers
nobody believes (a few dollars to six figures in a minute); flat colour with no light,
depth or grain; logs that are lorem ipsum. What lifted ours above them:
real data, an algorithm that actually runs, film lighting, readable type at
1080 px wide, a camera that moves, and a story with a turn.


## Bring ideas, don't wait for them

Most requests arrive as "make me a terminal video", or a topic in three
words. Waiting for a brief gets a generic film; the films that worked started
from an idea Claude brought. So the first answer to a request is ideas, not
questions, and they are researched before they are pitched:

1. **Look for material that has a story now.** What happened in the last
   days and weeks that has drama in its data: the most violent day of a
   market (a crash, a squeeze, a liquidation cascade), a repository that
   exploded, a model release and its downloads, a wiki article edited
   hundreds of times in an hour during breaking news, the user's own
   system (their agents' runs, their GitHub). Search
   the web, check the sources in §1, and read the user's context
   (the project's `NOTES.md`: voice, bio, what was decided before; the
   previous pieces in the working folder: what they post about).
2. **Check the data before pitching it.** Fetch a sample: is the day
   there, with names, at the needed resolution, without a key? If a key or
   an account is needed, say which and why, with the free alternatives and
   what each costs the film (a source without wallet addresses loses its
   characters). An idea whose data turns out unreachable after an hour of
   building is the most expensive mistake in this genre.
3. **Pitch three ideas**, each in five lines:
   - the material: which system, which day or run, the one number that makes
     it worth a film (`4,000 issues closed in a week`, `a model downloaded
     2 M times on its first day`);
   - the metaphor: the world and why it *is* this data, not a picture of it
     (a support queue as a river delta: every resolved ticket deepens the
     channel it took, so the delta's shape is where the work went);
   - the story: calm, the turn, the character it happens to, the aftermath;
   - the closing image: what stays on screen at the end;
   - the hook: the one line a viewer would repeat.
4. **Test each idea before showing it:**
   - the metaphor fits in one sentence, and a viewer who knows the domain
     would nod at it;
   - it would not work on random numbers: the real data makes the picture;
   - the data has a turn and a named character, not just a rising line;
   - the ending is an image, not a table;
   - it differs from the last films in the film log (§B) on world,
     look and instruments.
5. When the user brings a clear topic, still bring the angle: three ways
   to film that topic, and which day or run of it has the strongest story.

Keep going proactively through the build as well: when the data shows
something better than the plan (a character nobody expected, a second
cascade), say so and propose it. The pitch goes to the user in chat; the
picked idea and the three candidate worlds go live in the browser at once
(`code-film` §2), which is where the film is actually decided.


## 1. Data: real material from a system that ran

The data comes first and the design follows it. The credibility comes from
details nobody would invent: a price that stalls for four seconds, a whale
with a silly name, a round that settles against the model. The same holds
for any system: a real ticket's clumsy wording, an agent's tool call that
took 3.4 s, a commit message at 2 AM.

**Systems** — sources that answered without a key in September 2026, plus
your own:

| source | request | what it gives the frame |
|---|---|---|
| your own agents | the run's log (JSONL of tool calls, decisions, tokens, latencies) | agents as characters, every call an event, real latencies |
| GitHub | `GET https://api.github.com/repos/{owner}/{repo}/commits?per_page=100` · `/issues?state=all` · `/pulls` · `https://api.github.com/events` | commits, authors, files, issues as a queue; 60 requests/h without a token |
| Wikimedia EventStreams | `GET https://stream.wikimedia.org/v2/stream/recentchange` (server-sent events) | a live firehose of edits: record a few minutes to JSONL |
| Hacker News | `https://hacker-news.firebaseio.com/v0/topstories.json` · `/item/{id}.json` | stories, comment trees, authors |
| Hugging Face | `https://huggingface.co/api/models?sort=downloads&limit=100` | models, downloads, likes, tags |
| OpenStreetMap | `https://api.openstreetmap.org/api/0.6/changesets?limit=100` | edits by mappers, with places |
| a dataset | a public one (support tickets, reviews, papers) run through a real classifier or embedding model on this machine | the queue and its decisions, the corpus and its map |

**Markets** — for a trading terminal, take one full day (UTC) of the market, raw,
into `data/raw/<day>/` (the full catalog of sources and their limits: the `market-data` skill):

| source | request | what it gives the frame |
|---|---|---|
| Binance klines | `GET https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1s&startTime=<ms>&limit=1000` | 1 s OHLCV: 87 pages per day. Seconds with no trade are missing, so carry the last close forward. |
| Binance trades / book | `/api/v3/aggTrades?symbol=…`, `/api/v3/depth?symbol=…&limit=1000`; live: `wss://stream.binance.com:9443/ws/btcusdt@aggTrade`, `@depth@100ms` | tape, book mountains, liquidity heatmap (book history must be RECORDED live, no REST history) |
| Polymarket rounds | gamma `/events?slug=btc-updown-5m-<start_unix>` (also `eth-`, `sol-`, `xrp-`), browser UA required | `eventMetadata.priceToBeat` / `finalPrice` = the real open and settle, `outcomePrices` = who won, `clobTokenIds` |
| Polymarket fills | data-api `/trades?market=<conditionId>&limit=500&offset=…` | every fill with `side`, `size`, `price`, `outcome`, `name`/`pseudonym`, `proxyWallet`, which covers a tape, whales and a leaderboard; ~1,300–1,600 per 5-min round |
| Polymarket, the rest | the `market-data` skill (books, history, holders, positions; every source below in full) | |
| CoinGecko | `GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&sparkline=true&price_change_percentage=1h,24h` · `/coins/{id}/market_chart?vs_currency=usd&days=1` | caps, 24h moves, 7d sparklines, **`image` = the coin's logo URL**; ~30 calls/min free, add `x-cg-demo-api-key` with a demo key |
| Hyperliquid | `POST https://api.hyperliquid.xyz/info` `{"type":"candleSnapshot","req":{"coin":"BTC","interval":"1m","startTime":…,"endTime":…}}`, `{"type":"l2Book","coin":"BTC"}`, `{"type":"recentTrades","coin":"BTC"}` | perp candles, a book with order counts, trades |
| DexScreener | `GET https://api.dexscreener.com/latest/dex/search?q=<symbol>` · `/latest/dex/tokens/<address>` | memecoin pairs: price, liquidity, txns, `info.imageUrl` |
| DefiLlama | `GET https://api.llama.fi/overview/dexs?excludeTotalDataChart=true` · `/protocols` · `https://yields.llama.fi/pools` | chain/DEX volumes, TVL, yields, which make good treemaps and flows |
| icons | CoinGecko `image`, DexScreener `info.imageUrl`, Polymarket event `icon`, `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/<sym>.svg` | download into `public/`, don't hotlink during capture |

For either kind: a fetch script with retries (429 → back off), a semaphore of ~6, one
JSON per source. A day of 1 s candles plus every fill of a busy market is on
the order of 100 MB and a couple of minutes to pull.

Then **export** a compact `public/session.json` for the page: rounded numbers,
events packed as arrays (`[t, side, usd, price, nameIndex]` with a names
table), full detail only for the stretches the camera slows down on and the
top N events for the rest. A couple of MB is plenty.

## 2. The number comes from something that ran

The main number is the output of something that actually ran, not a number
typed in. For a system: replay its real log (the agents' calls and decisions,
the classifier's verdicts on a real queue, the training's real loss) and let
the counters add it up. The frame says in small type what it is: `LIVE RUN ·
<date>`, `REPLAY OF <run id>`, `BACKTEST · <date>`.

For a trading bot:

1. Write the strategy as a function of the downloaded data: a model (e.g.
   `P(up) = Φ(move / σ√T)` with σ from the trailing hour), an entry rule
   (edge against the market's traded price, a price cap, a time window),
   fills at the real traded price plus slippage, payout by the real
   resolution.
2. Sweep a few parameters and look at every result, including the losing ones.
   Fixed stake reads truer than compounding (compounding turns a few
   thousand into tens of thousands on the same fills).
3. Pick the run, export its fills, and let the page compute the bank from
   them. The frame says what it is in small type: `BACKTEST · <date> ·
   $100 / TICKET`.
4. Look at the run's own story before designing anything: where it was
   red, which trade turned it, where it climbed. That shape becomes the film.

Other honest sources of the number: a recorded paper session (the live feed
logged to JSONL, strategies with virtual balances), or a real account's
fills. A backtest on last-traded prices is optimistic (the book has
often moved by the time you'd fill), so the label says backtest.

Real people's P&L is often the strongest panel: from the fills,
per wallet: `−Σ buy cost + Σ sell proceeds + winning shares × $1`. The top
40 wallets' cumulative P&L after each round gives a leaderboard that re-ranks
itself as the day plays, and "THIS BOT · backtest" can sit among them.

## 3. The clock tells the story

Video time `T` maps to the data's time (the day, the run, the queue's
progress) through keyframes, interpolated with a
**monotone cubic (Fritsch–Carlson)**, so the speed eases between
fast-forward and near-real-time with no jerks and never runs backwards:

```ts
// [video second, data time]: fast, brake into the hero moment, slow, fast again
[0, t0], [1.5, t0 + 60],                  // boot, the data starts
[4.5, hero - 60], [5.5, hero + 30],       // fast-forward, braking
[12.0, hero + 300],                       // near real time: the hero moment
[14.0, hero + 1800],                      // accelerate
[22.0, t1], [30.0, t1 + 1],               // the rest at full speed, then the transformation
```

- **Hook in 1.5 s**: panels trace in, the headers decode, the number is
  already moving.
- **One slow passage** where the viewer can read what happens to one
  character, near real time.
- **Speed is part of the picture**: show it (a `×25` / `×4,600` readout, a
  paper feed that speeds up), and let the world's view widen as the clock
  races and close in when it slows.
- **No payoff card.** The last seconds are the world's transformation
  (§A.5); the totals appear inside it, next to the thing they describe.
- `speed(T)` and `videoAt(dayTime)` (binary search) come from the same
  timeline. Particles, sounds and flashes are timed with `videoAt`, so they
  land on the frame where their event happens at any speed.

## 4. Visual algorithms: a catalog

Claude won't reach for these unprompted; a terminal is good when every panel
is one of them, mapped to a real field. The first groups are for markets,
then instruments for any system.

**Flow and trades**

- **Ballistic fills that spring to their price.** Each real fill launches
  from the bottom (buy) or falls from the top (sell) and lands on its implied
  probability with a damped spring, closed form so any frame can be computed
  alone: `y = target + (from − target)·e^(−5.5·age)·cos(11·age)`, a small x
  spread that converges (`jx·e^(−4·age)`), radius `∝ √usd`, a short trail while
  fresh. The cloud they build *is* the market's price path. This is the "trades
  flying into the sky" shot.
- **Model line over the cloud + the gap as a glowing segment**: the edge
  made visible.
- **Liquidity heatmap (Bookmap)**: book depth per price level over time, one
  column per snapshot written into a float texture, log colour map
  (dark → violet → amber → white), trades as circles on top. Needs a recorded book.
- **Book mountain**: cumulative bid/ask depth mirrored around the mid, area +
  glow line, levels that flicker on update.
- **Volume profile (VPVR)**: horizontal histogram of volume per price beside
  the chart.
- **Whale callouts**: the 2–3 biggest fills of the last second get a label
  (`name  $1,240 ↑`) that fades in 1.4 s.
- **Coins along Bézier curves**: on a win, 8–46 particles fly from the
  settle point into the P&L number (quadratic Bézier, staggered delays,
  `sin(πu)` alpha); on a loss, red shards fall.

**Price and probability**

- **Future cone**: from now to settle, ±1σ and ±2σ of `σ√τ` as a fan, which
  shows the model's uncertainty shrinking as the clock runs.
- **Open / price-to-beat line** per round, the current one bright with a halo.
- **Outcome bands**: finished rounds tinted faintly by who won.
- **Candles as instanced quads** (thousands in one draw), wicks as lines;
  Heikin-Ashi or Renko for a different texture.
- **Bollinger / Keltner bands, EMA ribbons**: area between lines as a
  mesh with a vertical gradient.
- **LTTB downsampling** (Largest-Triangle-Three-Buckets) to draw 86,400
  points as 700 without losing the spikes.
- **Kalman or 1-2-3-2-1 smoothing** for display only (the 1 s data has gaps
  that draw as stairs); keep the last 3 seconds raw so the head is honest.

**Portfolio and market structure**

- **Squarified treemap** (Bruls–Huizing–van Wijk) of market caps from
  CoinGecko, coloured by 24h change, logos in the big tiles; tiles interpolate
  between states.
- **Weighted Voronoi treemap / Delaunay mesh** for a more organic map.
- **Force-directed graph** (Barnes–Hut) of wallets ↔ markets, edges pulse
  with each fill.
- **Sankey / flow ribbons**: money moving between outcomes, chains, DEXs.
- **Correlation matrix**, reordered by hierarchical clustering so blocks appear.
- **UMAP/t-SNE map of markets** (computed offline), points glowing by volume.
- **Hilbert-curve day**: 86,400 seconds into a 294×294 texture, where
  neighbouring seconds stay neighbours, a whole day as one image.
- **Round strip**: one cell per round or batch, the system's results bright,
  the rest dim, a glowing playhead.
- **Radial countdown**: an SDF arc for the time to settle.

**Numbers and UI motion**

- **Odometer digits** with carry: the last digit turns continuously, a
  higher one only rolls while the digit below passes 9→0.
- **Box-filtered values**: average a number over the last 8 frames of
  *video time* (`value(T − k·0.045)`) and it rolls instead of snapping. This
  deterministic smoothing gives the same result at any frame.
- **Rank interpolation**: rank averaged over 6 earlier frames, so
  leaderboard rows slide past each other.
- **Detector grid**: each of the system's conditions as a cell that lights
  when it passes, with its real value.
- **Text decode**: headers scramble in from glyphs during boot.
- **Numbered callout cards** (01 … 05) that pop in beside the hero on a
  schedule, each with a title, a live mini chart and one formula line from
  the system itself, then collapse to make room for the next.
- **Execution log**: the run's own events as monospace lines scrolling in,
  each with its real time, decision and numbers, new lines typed in, colour
  by kind. Lines taken from the run itself are what made
  it read as real.
- **Status chip** with tones: scanning, signal, holding, settled +$ / −$.
- **Settle shockwave**: expanding ring + a screen flash in the win colour
  (≤ 0.22, decays in 0.2 s).

**Instruments for any system**

- **Queue counter draining**: a big light-weight number going from millions to
  zero, with the per-second rates in hairline rows and their sparklines under it.
- **Latency ridgelines by class**: one row per class with its distribution on
  a log axis; the slow class (a big model, a human) sits visibly apart.
- **Stream graph of throughput by class** along the bottom, the last N seconds.
- **Stage stepper** with progress bars (IMAGER → ALIGNER → … or 01 / CORONA …
  04 / RESTORE), each stage lighting in turn with its live count.
- **Waveform-bar meters** (EXCITATION / TRANSFER / RETENTION style): a row of
  thin bars whose heights breathe with the live values.
- **Phase dial**: a ring of ticks with a sweep and a number in the middle.
- **Signal register**: ids, event names, sizes and a status column
  (STREAMING / VERIFIED / NEEDS HUMAN) scrolling in.
- **Matrix heatmap** with the active pair highlighted and a small graph beside it.
- **Agent rail**: the agents down one side with call-sign, model, state
  (SCAN / THINK / ACT / DONE) and a tiny meter each.

**Backgrounds that breathe** (low contrast, behind everything):
curl-noise flow field advected by order-flow imbalance, domain-warped FBM
whose speed follows volatility, reaction–diffusion seeded by trades.

## 4b. The picture inside: an algorithm as the engine

The panels above are instruments. What stops the scroll is a picture: one
beautiful algorithm running as the terminal's world or ENGINE panel (a big
cell of the grid, or the background of the chart, or the hero of the hook and
the transformation at the end). Driven by the same real data it reads as the
engine; driven by nothing it reads as a screensaver.
Name it in the panel head ("ENGINE · PHYSARUM ROUTER"), show 2–3 of its live
variables next to it (iteration, energy, best score, particles), and let its
events line up with the system's: the decision fires when the swarm converges,
the batch resolves when the black hole swallows the disk.

**Bindings that read** (algorithm → the real data that drives it → what the viewer sees):

| algorithm | driven by | reads as |
|---|---|---|
| Cluster sort (a cloud → structures by class) | items of a queue, agents, documents, wallets; the class decides the cluster, a score the place inside it | the system sorting its world |
| Light-trail sphere (an ensemble) | agents as orbits, each call a streak to the core and back | a mind working |
| Wire-sphere network | subsystems as spheres, packets along edges from the run log | the pipeline breathing |
| UMAP star field | documents as stars placed by their embeddings; a query lights its neighbours | a map of knowledge |
| Extruded treemap / WFC city | modules as blocks raised by commits | a codebase growing |
| Point-surface morph | a model's loss landscape per epoch, or the day's regimes | a system changing state |
| Black hole (Schwarzschild geodesics, accretion disk) | every real fill is a particle spiralling in; disk brightness = volume, the shadow grows with the bank | liquidity falling into the strategy |
| Gravitational Search / Barnes–Hut N-body | markets or coins as masses = volume/cap; the strategy's picks are the bodies others orbit | where the money's gravity is |
| Kepler Optimization | open positions orbit the best solution; ellipse = risk, period = time to settle | the portfolio as a solar system |
| Physarum / Slime Mould | food sources = markets or venues weighted by edge; the network thickens on routes that pay | arbitrage routes found by a slime mould |
| ACO | pheromone on venue→venue edges = realised spread; ants = orders | the arb path lighting up |
| PSO / Grey Wolf / Whale / Harris Hawks / Moth-Flame | the parameter sweep of the backtest itself: each agent = a param set, fitness = its real P&L on the day | the optimiser hunting the settings that were then run |
| Simulated Annealing | temperature = time left in the round or in the sweep; the state = the chosen subset (QUBO) | the solution crystallising |
| Ising (Metropolis) | spins = wallets long/short; field = price move; domains form as the crowd aligns | bull and bear domains |
| Kuramoto | oscillators = coins, phase = returns; coupling = correlation of the last hour | the market synchronising before a dump |
| Abelian sandpile / Dielectric breakdown (Lichtenberg) | grains = leverage; toppling = liquidations from a real liquidation feed | a cascade as a lightning figure |
| Boids | birds = traders (real wallets), heading = side, speed = size | herds forming and scattering |
| Stable Fluids / curl noise | dye injected at each fill, velocity = order-flow imbalance | the tape as ink in water |
| Gray-Scott / Lenia | feed and kill rates from volatility and volume | the market's "weather" |
| SPH / FLIP | liquidity pool depth as fluid volume; a big fill is a splash | a pool you can see move |
| Lorenz / double pendulum / three-body | seeded with the real price path; a tiny change → another future | why the model shows a cone |
| Weighted Voronoi stippling | a whale's avatar drawn by dots sized by their fills | the trader's portrait from their trades |
| Fourier epicycles | the day's price curve drawn by rotating circles | the chart redrawn by math |
| Wave Function Collapse | a city of tiles where each settled round places a building (green/red) | the day as a city |
| Hilbert curve / Mandelbrot zoom | 86,400 seconds as a texture; a zoom into the bank's digits | scale |

**The full palette** to choose from (group → pieces). The three candidates
of §A.0 come from three different groups, and none repeats a world in the
film log (the `film:terminal` heading in `NOTES.md`, the same way `code-animation` keeps its
axes). Go past the first names in a group: the famous ones are the ones
already seen.

- **Space and gravity**: Black Hole Algorithm (2013), Gravitational Search
  (2009), Big Bang–Big Crunch (2006), Galaxy-based Search (2011), Galactic
  Swarm (2016), Multi-Verse Optimizer (2016: white/black holes, wormholes),
  Kepler Optimization (2023), Central Force Optimization (2007), Barnes–Hut
  N-body (galaxy collision), three-body problem (symplectic integrator),
  Schwarzschild geodesics (accretion disk, Interstellar), Kerr ray tracing
  (asymmetric shadow), gravitational lensing (Einstein rings), pulsar beam.
- **Physics and fields**: Simulated Annealing (1983), Electromagnetism-like
  (2003), Charged System Search (2010), Artificial Electric Field (2019), Atom
  Search (Lennard-Jones, 2019), Henry Gas Solubility (2019), Equilibrium
  Optimizer (2020), Lightning Search (2015), Dielectric Breakdown (Lichtenberg),
  Ising/Metropolis, Abelian sandpile, Chladni figures, double pendulum, Lorenz
  attractor, Kuramoto (fireflies in sync), FDTD waves.
- **Fluids and matter**: Stable Fluids (Stam 1999), SPH, Lattice Boltzmann
  (Kármán street), FLIP/PIC, Material Point Method, FFT ocean (Tessendorf),
  curl noise, Verlet cloth, Position Based Dynamics, hydraulic erosion, Water
  Cycle (2012), River Formation Dynamics (2007).
- **Life and growth**: Physarum (Jones 2010), Slime Mould Algorithm (2020),
  Gray-Scott, Lenia (2019), Game of Life, Langton's ant, DLA, space
  colonization, differential growth, L-systems, Invasive Weed (2006), Flower
  Pollination (Lévy flights), Boids, Bacterial Foraging, Neural Cellular
  Automata, Karl Sims' creatures.
- **Swarms and predators**: ACO, PSO, ABC (bee dance), Firefly, Whale (bubble
  net spiral), Grey Wolf, Harris Hawks, Moth-Flame (log spiral), Marine
  Predators (Lévy ↔ Brownian), Cuckoo (Lévy flights), Bat (echolocation),
  Dragonfly, Ant Lion (sand traps), Salp chains, Krill Herd, Social Spider.
- **Fractals and maths**: Mandelbrot, Mandelbulb, Buddhabrot, Julia sets,
  Chaos Game/IFS (Barnsley fern), flame fractals, Clifford/De Jong attractors,
  Apollonian gasket, Voronoi + Lloyd relaxation, Hilbert curve, Penrose
  tiling, Fourier epicycles.
- **Rendering and generation**: path tracing, Metropolis Light Transport
  (caustics), ray-marched SDF worlds, photon mapping, volumetric clouds,
  Gaussian splatting, NeRF, Wave Function Collapse, Perlin/simplex + domain
  warping, marching cubes, metaballs, weighted Voronoi stippling, DDPM
  (image from noise), DeepDream.

**A morphing point-surface** (the "Regimes" world): each shape is a
function `(u, v) → xyz` over the same grid (u along a filament, v across
filaments): a corona is petals `r = R·|sin(k·θ)|` swept along a spiral, a
cocoon is an ellipsoid, a wave is a saddle `z = a·(x² − y²)` or a hyperbolic sheet.
The frame is `lerp(shapeA(u,v), shapeB(u,v), e)`, with `e` staggered per filament
(`smooth(t0 + 0.4·v, …)`), so the change ripples across the sheet instead of
jumping. Then a slow 3D rotation, a perspective divide, and brightness from depth
(near = bright, far = 25 %). Draw it as dots (thousands per call); signals
are 6–10 dot trails moving along u at their own speed. It loops when the
last shape is the first.

**Making it run inside the frame**: a GPU algorithm lives in its own
fragment/compute pass (ping-pong float textures: fluids, reaction–diffusion,
Physarum trail maps, sandpile, Ising; ray marching for black holes and
fractals) rendered into the panel's rect before the bloom pass, so it shares
the terminal's light. A particle algorithm (swarms, N-body, boids) uses the
dot batch. It must stay a function of T: simulations are stepped from a
fixed seed in fixed dt, and a capture that starts mid-film re-steps from the
start (or from a cached checkpoint). The `code-animation` skill §4.5 and §10 have
the rules for turning a simulation into an illustration and keeping it well-behaved.


## Making it, and handing it over

Everything from here is the instrument, not the genre, and lives in the
`code-film` skill's `SKILL.md`: the engine (React for
words, WebGL2 for light, `computeFrame(T)` pure), the live preview with the
player bar, knobs and the user's notes, the four checkpoints before any render
(concept → live → stills → master, and silence is not an ok), the shoot on a
real GPU or on a rented GPU box (e.g. Vast.ai) over SSH, same script unchanged, the sound synthesised from the
events, and the formats. Read it once before the first page is created.

When the master exists: save it and the cover in the working folder under
descriptive names (`<film>.mp4`, `<film>-cover.png`), with the post text in a
`.md` next to them; look at the result yourself (pull a frame from the master,
open the cover) before showing it, then show the user.

The post is a `post` written by the `social-post` skill, in the user's voice:
the one number that made the film worth making, the system it shows, no
«check out my new video». Non-Premium X takes a video ≤ 2:20 and 280
characters; the upload traps: H.264, wait for the
progress bar, do not re-attach.

Then the log line under `film:terminal` in `NOTES.md` (§B): world, look, typefaces, the
operator's gesture, the instruments' forms, so the next film steers away from
all of them.
