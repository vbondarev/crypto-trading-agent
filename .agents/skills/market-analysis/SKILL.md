---
name: market-analysis
description: Analyze BTC and altcoin market context, multi-timeframe trend, closed OHLCV, EMA/SMA/RSI/ATR, volume, volatility, derivatives, liquidity, news and conditional scenarios. Use for R1 market overviews or R2 preliminary Bybit USDT perpetual market analysis, never final bot approval.
---

# Market Analysis — Crypto Trading Agent

## When to use

- The user requests a **BTC / altcoin market overview**, relative strength, technical trend, volatility, levels, derivatives context or market catalysts.
- An R2 preliminary Long/Short scenario needs evidence-based market conditions, alternative outcomes and invalidation—not a ready-to-enter trade.
- A broader portfolio/strategy workflow requests the **market-analysis** component. Verify time-sensitive data with [data-verification](../data-verification/SKILL.md) **when that Skill is actually available/read**; a hyperlink alone does not prove execution.

## When **not** to use

- No market data are needed to explain basic crypto terminology: answer directly instead of creating fictitious indicators.
- Do **not** audit full Bybit Equity, Cross liquidation, bot margin, cumulative position risk or future IN reserves; those belong to `portfolio-analysis` and `risk-assessment` (planned later).
- Do **not** present a final Veles/GinArea form, issue an order, select a platform for the user, grant `READY`, claim profit guarantees or schedule monitoring between messages.
- Do **not** assume live Bybit/TradingView/Coinglass APIs, account keys, installed scripts, indicator libraries, or an automatically loaded Skill runtime.

## Read approved references **as needed** (paths relative to this folder)

- [Global AGENTS and strict boundaries](../../../AGENTS.md)
- [FR-001–FR-017 market and technical requirements](../../../docs/requirements.md)
- [Verification rules R1/R2/R3, freshness, closed candles and AD-009](../../../docs/data-freshness.md)
- [Actual source access and safe fallbacks](../../../docs/data-sources.md)
- [Source quality, conflicts and known TV limits](../../../docs/data-validation.md)
- [Minimal T01–T06 requests](../../../docs/input-templates.md)
- [Operating rules and reporting](../../../docs/agent-operating-rules.md)
- [Selection / execution contract for Skills](../../../docs/stage-07-skills-contract.md)
- [Risk guards and FR-038 stress requirements](../../../docs/risk-management.md)
- [Current project limitations](../../../docs/stage-06-review.md)

For external public facts, consult **current primary/official material when accessible**, including [Bybit V5 Kline](https://bybit-exchange.github.io/docs/v5/market/kline), [Open Interest](https://bybit-exchange.github.io/docs/v5/market/open-interest), [Funding History](https://bybit-exchange.github.io/docs/v5/market/history-fund-rate), [Instruments Info](https://bybit-exchange.github.io/docs/v5/market/instrument). Reading API documentation does **not** mean a price was successfully retrieved. Use only data actually returned; log the source/market/times and explicit failures (e.g., HTTP 403).

## Required workflow

### 1. Scope the question before gathering data

- Record `purpose`, `mode` (`R1` overview vs `R2` preliminary; `R3` only delegated to full verification), `exchange`, exact `symbol`, `market_type`, horizon, user's preferred direction **if specified**, and applicable timeframes.
- Base intervals for analysis are **15m / 1h / 4h / 1d**; select relevant ones by horizon and user request. **Do not assert analysis of an unqueried timeframe** and do not demand four intervals when the question does not need them.
- For Bybit perpetual calls specify `category=linear` and verify the **exact** USDT-settled symbol/contract (not merely a name ending with USDT). A Binance Spot observation is *context*, **not** Bybit Perpetual Last/Mark/OHLCV/volume.
- For educational R1 without numeric current claims, do not demand data or personal portfolio. R2 exact entry/stop/strategy constraints are preliminary and need relevant verified prices/OHLCV.

### 2. Get evidence, or state exactly what is unavailable

- Hand off material source, identity, timestamps and R1/R2 TTL to `data-verification` **when available**; otherwise follow its published policy directly and note the absence of a confirmed Skill invocation.
- Each key observation needs: `exchange, instrument, category/settleCoin, price_kind, source, observed_at (or labelled proxy), retrieved_at, unit, timeframe, sample_coverage, validation_state`.
- Distinguish **Last, Mark, Index**, spot and perpetual. For R1 current prices follow accepted **15-minute** ceiling; R2 intraday uses **5 minutes** or stricter when volatility/events demand. Old dated data may still support explicitly historical R1 context, never “current” R2 levels.
- If **HTTP 403 / incomplete page / screenshot**: say which requested route/field failed and when; seek a genuinely equivalent source or a user-provided, dated same-market input. Do not invent price, timestamp or OHLCV, and do not silently replace Bybit Perpetual with Binance Spot.
- An accessible webpage is not proof of a numerical market observation. A user screenshot is not an independently confirmed API return.

### 3. Validate closed OHLCV per timeframe

For every requested `interval`:

1. Obtain **ordered, deduplicated** candles for the **same exchange, contract, interval and price basis**. Bybit V5 `/v5/market/kline` returns rows **reverse-sorted by `startTime`**; explicitly sort chronological ascending before any indicator. Rows use `[startTime, open, high, low, close, volume, turnover]`; for **USDT linear contracts**, volume is base coin, turnover is quote (USDT). Do not exchange volume and turnover.
2. Convert `startTime` (Unix milliseconds) to an absolute instant; derive `end = start + exchange interval` using actual exchange session/calendar boundaries. For intraday minute intervals, fixed minutes are valid; **daily/weekly/monthly boundaries must follow the exchange interval calendar**, not an invented rolling Moscow-month duration.
3. **Exclude the current unclosed bar**. A close field of an unfinished Bybit candle is last traded and may change. Confirm the **last expected closed candle** is present for the chosen `as_of` reference. Do not calculate “latest confirmed EMA/RSI” on an open or missing-last-bar sequence.
4. Verify OHLC `low ≤ open/close ≤ high`, timestamps unique and aligned, sorted order, expected continuity, known gaps, correct `price_kind`, finite positive prices, nonnegative volume. If gaps/holes/inconsistent chronology are material: mark dependent indicators `NEEDS_DATA` or `UNVERIFIED`, rather than interpolating silently.
5. Demand **enough closed historical bars including warm-up** for every claimed indicator; period `n` by itself is not proof of stable EMA/RSI/ATR. Record warm-up, seed convention and calculation method or quote the verified provider's same-period setting/source explicitly.
6. If only Mark-price candles are available, label them **Mark-series** and do not transfer exchange-traded volume/turnover from a different series as if same observations. Spot candles and perpetual candles must remain separate.

### 4. Interpret indicators with their inputs and limitations

| Indicator / evidence | Required handling and caution |
|---|---|
| EMA / SMA | State period, `source` (e.g. close), `timeframe`, seeding and warm-up, last closed bar/time. Crossovers describe observed structure, not a reliable stand-alone order signal. |
| RSI | State period and smoothing method (e.g. Wilder), sufficient positive/negative movements and previous average, handle no-gain/no-loss cases explicitly. RSI extreme values are not a guaranteed reversal; no value without bars or source. |
| ATR | Use verified high/low/previous close and true range; state period, smoothing, unit and ATR/price convention when expressed as %. Historical ATR is not a guaranteed future gap or max drawdown. |
| Volume / turnover | State unit, trade-market/contract and comparison window. Spike = comparison to measured baseline, **not** an arbitrary universal multiplier; do not conflate traded contracts with quote turnover. |
| Price structure / levels | Distinguish confirmed swing highs/lows, range bounds, retests from modelled volume-profile/value-area or liquidation heatmap. Cite input timeframe/lookback/method and **zones of uncertainty**, not spurious decimal precision. |
| Multi-timeframe alignment | Summarize observed direction/structure on each **actually supported** timeframe. If 15m is bullish and 4h bearish, report tension or pullback; do not erase the conflict. |
| Trend regime | Classify `UPTREND / DOWNTREND / RANGE / MIXED / INSUFFICIENT_DATA` **as a descriptive label**, with evidence and invalidating counterevidence. No fabricated fixed threshold for trend strength. |

When series are insufficient, explicitly list which numbers/periods cannot be calculated and **do not approximate indicators from Last Price alone**.

### 5. Add BTC/sector context and derivatives without inference leaps

- For an **altcoin**, compare BTC and that coin over **matched windows** and data definitions; if BTC context is unavailable, mark the comparison `NOT_CHECKED`, not “BTC confirms”.
- OI: retain `timestamp`, `intervalTime`, market, unit and whether `openInterest` means summed sides or `singleOpenInterest` means one side (where supplied). Bybit documents these separately; do not mix them in a growth series. One observation or a definition change cannot establish an OI *trend*.
- Funding: specify **rate unit/interval**, settlement history vs current displayed estimated rate, next funding time where available. Historical funding is not an exact forecast of future funding charges.
- Order book / trade flow: only describe *observed* depth and liquidity at stated time/window; spread/top-of-book is not full depth and can change before execution.
- Maps of liquidation clusters / liquidity heatmaps are **third-party estimates**, never confirmed exchange orders or guaranteed bounce/reversal points.
- Note verified **news, economic releases, unlocks, listings/delistings, tokenomics** with original `published_at/event_at`, timezone, primary source and asset scope; avoid interpreting rumors or scheduled events as realized price movement. Unverified social claims are labelled as such. Do not invent current events.

### 6. Create a conditional conclusion proportional to evidence

1. Separate **FACT** (observed value with source/time), **DERIVED** (shown calculation), **HYPOTHESIS** (possible future path) and **MISSING/UNVERIFIED** (unknown or conflicting source).
2. Provide **base scenario**, **alternative scenario**, and **invalidation triggers**, each tied to data actually available; state direction only conditionally. If levels are warranted, derive support/resistance from real candles or correctly labelled user data, state timeframe and uncertainty. If no verified series: no numerical levels.
3. R1 output may contain high-level historical interpretation with clearly dated figures. R2 outputs may contain a **conditional preliminary market scenario** when evidence suffices, but do not give an unconditional entry/exit, P02 form, leverage or stop with guaranteed maximum loss.
4. If active positions, recovery, averaging or final bot configuration are involved, hand off the market evidence to **portfolio-analysis → risk-assessment → strategy-planning → one chosen platform Skill** as appropriate. Those future Skills may not exist yet; if unavailable, use approved policy docs and explicitly state the missing integration. **Never assign `READY` here.**
5. Hard rule breaches (`H04` / verified strict risk-limit breaches) belong to risk decision; market analysis must not override `REJECTED` with a bullish or bearish signal. When Cross MMR, strict Short upper bound, full F/V/H/R or personal P02/T02 are not proven, do not claim they are safe. Open RV-02/RV-03, RV-04/RV-06 and TV-01–TV-04 remain open.

## Output contract

Provide a concise report covering:

- **Scope:** `R1/R2; exchange; exact instrument and market type; horizon; as_of; analysed timeframes`.
- **Evidence matrix:** source/observed/snapshot/retrieved time, price kind, OHLCV coverage and **quality** for each relevant field; missing/error paths.
- **BTC / broader market context**, and **trend by each verified timeframe** with actual observed evidence.
- **Indicators:** time, period, smoothing/source and bar count; omit numbers not computed/observed.
- **Volatility/liquidity/derivatives and verifiable catalysts**, with category-specific limitations.
- **Base / alternative / invalidation**, risks, unknowns and minimum missing data to advance.
- **Status of analysis:** `R1_CONTEXT`, `R2_PRELIMINARY`, `NEEDS_DATA` or `UNVERIFIED` as *analytical labels only*. These are **not** `READY/REJECTED` classifications of a portfolio or a trade.

**End boundary:** this Skill can only improve the *market evidence component* of the user's decision. It never silently selects a trade, creates a bot, executes orders or watches the market after the response.
