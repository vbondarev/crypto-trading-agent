# HYPE-V01 / AN-01 — practical market-and-coin research dry run, 14 November 2026

**Scope:** user explicitly approved Step 1: test market → coin → multi-timeframe technical → Coin Profile on public data. This is **not** a bot configuration or a real futures-account review.
**Test execution:** 2026-11-14, from 16:08:08 to at least 16:10:09 UTC+03, corresponding to 13:08:08–13:10:09 UTC. These are **testing/retrieval-window times**, not source exchange timestamps.
**Pinned pretest branch HEAD:** `016a40b9c2424016b9487c685c6bd5ea80525d2c` on `feature/simplified-agent-v2`.
**Result:** `MARKET_RESEARCH_PARTIAL / TARGET_BYBIT_OHLCV_UNAVAILABLE / TECHNICAL_NOT_COMPUTED / COIN_PROFILE_PARTIAL / POSTURE_WAIT / BOT_NOT_STARTED / NO_TRADE_READY / USER_ACCEPTANCE_PENDING`.

## 1. What actually ran (and did not)

**Actual in-chat run:** this assistant read the pinned repository's `docs/v2/analytical-workflow.md`, `docs/v2/source-acquisition-policy.md`, `docs/v2/coin-report-template.md`, `.agents/skills/market-research-v2/SKILL.md`, `.agents/skills/technical-analysis-v2/SKILL.md`, `.agents/skills/strategy-synthesis-v2/SKILL.md`, `docs/v2/workflow-guard.mjs`, and the v2 JSON contracts, then made **public web searches and page-read attempts** to test a bounded `COIN_RESEARCH` route.

**Not executed:** a separately loaded/activated v2 agent, Bybit authenticated connector, private Bybit API, trading-bot runtime, browser account action, verified Bybit public-market REST payload, coded numerical indicator pipeline, real historical backtest, blind LLM test, independent end-to-end platform harness or actual strategy performance test. The `workflow-guard.mjs` source was inspected as text; this pass did **not** run it against fully materialized schema-valid bundles. No synthetic fixture data were used as market truth.

**RequestContext conceptual mapping** (not claimed schema-validated JSON): `request_id=HYPE-AN01-20261114`; `user_goal=COIN_RESEARCH`; `exchange=Bybit`; `symbol=HYPEUSDT`; `market_type=USDT_PERPETUAL`; `settle_coin=USDT`; `identity_status=USER_SUPPLIED` pending official instrument-status confirmation; horizons intraday/context; `timeframes=[15m,1h,4h,1d]`; `preferred_platform=VELES` known from pilot, but **bot module not invoked**; `risk_budget_usdt=null`; full private account input **not requested**.

## 2. Data acquisition and evidence ledger (real observed sources)

Each evidence ID denotes this run's public retrieval/search observation, not a claim of native upstream API response. Date/time printed by the upstream **source** is separated from retrieval time. Source snippets of dynamic pages can disagree with later full-page fetches; never combine them as one snapshot.

| ID | Source, identity, dated evidence | Access and limitations | Role |
|---|---|---|---|
| EV01 | CoinDesk, 2026-11-13 publication, https://www.coindesk.com/markets/2026/11/13/bitcoin-hits-12-week-low-as-dollar-rallies-on-interest-rate-outlook-liquidations-top-usd1-6-billion | `OBSERVED_PUBLIC_ARTICLE`; original reporting BTC under $70k, pressure from stronger dollar, broader liquidations; historical article | Broader BTC/macro bearish regime, NOT a current Bybit HYPE ticker |
| EV02 | Goodman Macro 2026-11-14 report of fully closed **13 Nov UTC** Binance **spot** day: BTC 68,314 USDT (−4.40%), ETH 1,929.88 USDT (−4.45%); https://www.goodman-macro.com/en/articles/20261114-crypto-market/ | `OBSERVED_SECONDARY_SPOT_HISTORICAL`; closed session at 2026-11-14 00:00 UTC, distinct source identity | Context only: broad market selling; not futures/Mark |
| EV03 | Bybit V5 public `GET /v5/market/tickers?category=linear&symbol=HYPEUSDT`, attempted at https://api.bybit.com/v5/market/tickers?category=linear&symbol=HYPEUSDT and https://api.bytick.com/v5/market/tickers?category=linear&symbol=HYPEUSDT | `ACCESS_UNAVAILABLE`: web tool returned nonaccessible/URL error, **not** valid JSON, not necessarily native Bybit HTTP response or 403 | No authoritative live HYPE Last/Mark/Index or funding |
| EV04 | Bybit V5 public `GET /v5/market/kline` for `HYPEUSDT category=linear` and `interval=15,60`; attempted https://api.bybit.com/v5/market/kline?category=linear&symbol=HYPEUSDT&interval=60&limit=110 | `ACCESS_UNAVAILABLE`; no returned array, no timestamp, no verified 15m/1h/4h candle count or closure | `technical-analysis-v2` must not compute EMA/RSI/MACD/ATR |
| EV05 | Bybit V5 public `/v5/market/instruments-info?category=linear&symbol=HYPEUSDT`; https://api.bybit.com/v5/market/instruments-info?category=linear&symbol=HYPEUSDT | `ACCESS_UNAVAILABLE`; no current contract-status, risk tier, tick size, lot size or instrument metadata | No exact exchange contract numerical fields |
| EV06 | Fibonomy HYPE/USDT Bybit summary, https://fibonomy.com/en/futures/bybit/hypeusdt : page at one fetch displayed indicative Mark 68.62, Index 68.661, 8h funding +0.0035%, OI $218.73M, 24h change −6.76% | `OBSERVED_THIRD_PARTY_PAGE / UPSTREAM_TIME_UNVERIFIED`; page lacks a precise native `observed_at`; no public Bybit JSON; dynamic content can change; dollar OI and HYPE base-qty OI not directly interchangeable | Useful **secondary context**, values **NOT** authoritative current Bybit quote or trading levels |
| EV07 | BitcoinLeverage / Coinalyze HYPE, https://bitcoinleverage.com/hype/price : opened page showed Bybit HYPE contract OI ~$221.45M and funding −0.004738% with Bybit source sample 2026-11-13 16:00 UTC, checked at 17:46 UTC | `OBSERVED_THIRD_PARTY_HISTORICAL / STALE_FOR_R2`; search snippet separately displayed a different 2026-11-14 sample, **not** the same snapshot; avoid falsely averaging figures | Demonstrates derivatives data source coverage/time misalignment |
| EV08 | ClosedCandle indicators, https://closedcandle.com/coin/hype/indicators : specifically **Binance Spot** HYPEUSDT; full page showed last printed closed-bar start times 15m 2026-11-14 12:45 UTC, 1h 12:00 UTC, 4h 08:00 UTC, with RSI 36.6 / 34.0 / 38.7 and price below EMA50 | `OBSERVED_THIRD_PARTY_SPOT_TECHNICAL`; upstream values published by provider, raw OHLCV/method not independently audited; source is **NOT Bybit linear**; even close of interval does not guarantee finalized exchange bar without source verification | Secondary bearish context only. **Not** substitute for target contract EMA/RSI |
| EV09 | TradeAnalyzer multi-TF HYPEUSDT page https://tradeanalyzer.pro/crypto/pages/symbols/HYPEUSDT.html: full-page fetch displayed 2026-11-13 00:12 UTC bullish snapshot while separate indexed snippet gave bearish 2026-11-14 08:11 UTC | `SOURCE_VERSION_OR_CACHE_CONFLICT / INSUFFICIENT`; periodic updates and differing page versions. Venue/underlying OHLCV not independently resolved | Exclude from verified current Bybit trend; avoid optimistic cherry-picking |
| EV10 | Kinetiq developer press release dated 2026-11-09, https://www.globenewswire.com/news-release/2026/11/09/3398435/0/en/kinetiq-launches-elysium-public-mainnet-a-high-performance-layer-2-built-for-hyperliquid.html; Arbitrum independent partner announcement https://blog.arbitrum.io/elysium-joins-the-programmable-economy/ | `OBSERVED_FIRST_PARTY_ANNOUNCEMENT` plus partner `OBSERVED`; Elysium mainnet launch announced, HYPE is native gas; no causal HYPE price forecast | Coin-specific ecosystem catalyst (fact of announcement, not expected ROI) |
| EV11 | CoinStats AI HYPE article https://coinstats.app/ai/a/latest-news-for-hyperliquid dated updated 2026-11-14 00:43 UTC; same rendered page contained HYPE price 69.14 and another current-looking 71.77 | `OBSERVED_SECONDARY_REPORT / INTERNAL_PRICE_CONFLICT`; news aggregates revenues, burn and positioning but does not independently verify on-chain or direct Bybit trading account stats | Directional secondary background only; **exclude conflicting price from precise decision** |
| EV12 | X/Twitter / Telegram official Hyperliquid posts | `NOT_INDEPENDENTLY_VERIFIED`; no complete attributable dated first-party HYPE feed was obtained in this session | Do not claim social consensus, tweets, sentiment percentage, activity or official Telegram signals |

**Independence:** EV10 developer + ecosystem partner reflect the same announced launch (one event, two attributing parties), not two independent investment catalysts. EV06/EV07 may ultimately originate from exchange or shared derivatives data; not automatically independent. EV08 is a different market (spot) and cannot validate EV03/EV04. EV01/EV02 are broader BTC/ETH context, not HYPE contract evidence.

## 3. Coin Profile (bounded and intentionally incomplete)

| Dimension | Finding | Basis/status |
|---|---|---|
| Market regime | **RISK_OFF / BEARISH_CONTEXT** observed in Nov 13 BTC/ETH spot closes and wider selloff | EV01, EV02; historical as-of |
| HYPE ecosystem | Elysium network launch is an identifiable potentially supportive structural event; no verified immediate price effect | EV10 |
| Project/tokenomics | Buyback, revenue and unlock commentary exists, but current on-chain amounts not independently validated in this run | EV11; `PARTIAL` |
| HYPE Bybit 15m local trend | `UNKNOWN / NOT_COMPUTED` | EV04 missing native completed OHLCV; EV08 spot only |
| HYPE Bybit 1h local trend | `UNKNOWN / NOT_COMPUTED` | EV04; third-party spot bearish but non-transferable |
| HYPE Bybit 4h/1d global trend | `UNKNOWN / NOT_COMPUTED` | EV04; no validated close/warmup |
| Target Bybit indicators | EMA/RSI/MACD/ATR and volume/levels `NOT_COMPUTED` | No Bybit complete closed-candle array |
| Bybit derivatives | `PARTIAL / TIME_UNVERIFIED`; variable third-party samples do not establish currently verified funding or OI trend | EV06, EV07 |
| Verified Bybit Mark / price | `MISSING` | EV03; third-party displayed mark is not official payload |
| Media and social coverage | Distinct dated ecosystem release; X/Telegram not verified, other summaries mixed | EV10, EV12 |
| Confidence | `INSUFFICIENT` for direction-specific Bybit trading decision | Evidence limitations above |
| Overall coverage | `PARTIAL` for market/coin narrative, `INSUFFICIENT` for a futures trade setup | Important fields missing |

**Important distinction:** a source's **bearish Binance Spot indicators** are a plausible contextual caution, not proof that Bybit HYPEUSDT futures has verified current bearish EMA/RSI or a precise Bybit entry. No price bands or targets calculated on unverified exchange data.

### BULL / BASE / BEAR conditional interpretation (no invented prices)

- **BULL (not confirmed):** a fresh, attributable Bybit HYPEUSDT linear closed OHLCV sequence establishes a reversal on at least 1h with supporting 4h structure, reliable current Mark and volume; losing the reclaimed level invalidates the case. Current numeric trigger is **UNKNOWN**.
- **BASE:** uncertainty and seller-heavy broad market context continue without a validated target-contract setup ⇒ keep `WAIT`; first obtain actual Bybit OHLCV and price source.
- **BEAR (not independently confirmed for Bybit):** updated and closed 1h/4h contract data confirm lower structure and a verified breakdown with adequate volume, while BTC risk-off persists; invalidated on recovery above the relevant *yet-to-be-computed* structural level. Do not mistake this for a current Short entry.

**Recommendation for this test:** `StrategyProposal.posture=WAIT`; `decision_status=NEEDS_DATA`; confidence `INSUFFICIENT`; `risk_screen=NOT_EVALUABLE` (no current account snapshot required for coin research); **no bot proposal/map**. The user has previously mentioned an account position in chat; it was **not used** to decide this public-market trend and its private details are absent here.

## 4. Actual route and stop-condition checks (not independent runtime tests)

| ID | Expected behavioral control | Observed outcome | Result |
|---|---|---|---|
| T01 | Honor isolated feature branch, pin sources | GitHub documents fetched by feature branch and pretest HEAD recorded | `PASS_DOC_ROUTE` |
| T02 | Do not pretend official Bybit API returned data | EV03–EV05 `ACCESS_UNAVAILABLE`, web tool error not called HTTP 403 | `PASS_SAFE_FALLBACK` |
| T03 | Distinguish spot vs linear futures and Last vs Mark | EV08 spot and EV06 third-party explicitly segregated | `PASS_SOURCE_DISCIPLINE` |
| T04 | Verify exact closed Bybit OHLCV and indicator warm-up | Native Bybit candles absent | `BLOCKED_MISSING_DATA` |
| T05 | Assess BTC/ETH and coin-specific event context | Dated EV01/EV02 + EV10 found | `PASS_PARTIAL_RESEARCH` |
| T06 | Preserve source conflict and time differences | EV07 vs snippets and EV09 versions not merged | `PASS_CONFLICT_HANDLING` |
| T07 | Verify first-party X/TG and independent social sample | Not available/confirmed | `GAP_NOT_VERIFIED` |
| T08 | Produce evidence-aware Coin Profile and allow WAIT | Profile above and explicit WAIT/data-gap | `PASS_SAFE_DECISION` |
| T09 | Prohibit numeric grid/READY on WAIT | No Veles bot configuration created | `PASS_NO_BOT_ON_WAIT` |
| T10 | Do not demand private T02 to run public coin analysis | No account-balance/position requests, no private account read | `PASS_PRIVACY` |

The `PASS_*` labels mean specific **in-chat documented behavior**, not real agent-integration regression passes. Data availability failures are **not** counted as analysis successes. An independent v2 runtime test and full typed schema handoff were NOT EXECUTED.

## 5. Defects and bounded recommendations (not silently applied to core Skills)

| ID | Priority | Gap / risk | Suggested next corrective action |
|---|---|---|---|
| AN01-F01 | P1 | Official Bybit V5 tickers/klines/instruments not reachable via available public browser tool | Provide an explicit verified public market-data acquisition adapter or user-supplied **public** Bybit JSON/dated OHLCV; validate `retCode, category, symbol, timestamp`, no private keys |
| AN01-F02 | P1 | No complete target OHLCV history/warmup to calculate 15m/1h/4h indicators | Require at least chosen indicator lookbacks + warmup and last closed-bar continuity per chosen indicator; never assert calculated Bybit EMA from secondary spot |
| AN01-F03 | P1 | Third-party dynamic pages can show internally inconsistent and differently cached prices | Require upstream `observed_at` and stable source identity; mark `TIME_UNVERIFIED/CONFLICT` and stop precise strategy |
| AN01-F04 | P2 | X/Telegram first-party and tokenomics provenance incomplete | Separate issuer announcement, on-chain observation, syndicated reporting, and rumors; declare gaps |
| AN01-F05 | P2 | Previously excessive account-intake before analytics is a route/usability regression | Add a negative acceptance test: `COIN_RESEARCH` requires **no T02** and can complete with WAIT; final `BOT_PROPOSAL`/R3 alone gates account-wide risk |
| AN01-F06 | P2 | Repository guard and schemas can validate structure but do not verify actual data truth or running v2 agent | A future independently executed test should assemble literal v2 schema bundles and run guard + actual agent responses; report any failure without claiming current run did it |

## 6. Closeout and approval boundary

**Done:** actual public source attempts, evidence classification, partial market/Coin Profile, safe WAIT and annotated route tests.
**Not done:** verified Bybit futures OHLCV, quantitative target technical model, historical Bybit entry levels, LONG/SHORT signal, private-account risk, bot draft, independent running-agent test.
**Next after separate acceptance:** fix/validate public Bybit data acquisition (without account access or editing old agent), collect true HYPEUSDT linear 15m/1h/4h OHLCV, then rerun market + technical + Coin Profile. Only when evidence supports LONG or SHORT move to Step 2/3.

**No changes to legacy `AGENTS.md`, active agent, `main`, earlier P02 evidence or Draft PR #1. No v2 activation, bot launch, leveraged instruction or funds movement.** `AN01_SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING / NO_TRADE_READY / STAGE_06_NOT_STARTED / V2_NOT_ACTIVE`.
