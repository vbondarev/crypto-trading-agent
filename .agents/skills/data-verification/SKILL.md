---
name: data-verification
description: Verify provenance, market identity, timestamps, freshness, completeness and conflicts in cryptocurrency data. Use for Bybit USDT perpetual prices, OHLCV, screenshots, HTTP 403, account snapshots, Veles/GinArea forms and R1/R2/R3 analysis before trading decisions.
---

# Data verification — Crypto Trading Agent

## When to use

- The user requests **current** quotes, trend/indicator inputs, trading levels, a Bybit USDT perpetual position, risk assessment, or final Veles/GinArea configuration.
- Data come from Bybit, another exchange, an aggregator, a screenshot, user-supplied JSON/text, or a copied earlier calculation; provenance, time, units or comparability matter.
- A request failed (including **HTTP 403**), sources disagree, the market or instrument may be wrong, or a fill/restart/edit may invalidate an earlier assessment.
- A larger workflow calls for **R1**, **R2** or **R3** evidence verification.

## When *not* to use

- Simple education or definitions with **no current numbers** and no claim of readiness. Do not require T02, portfolio access or all 40 data classes for R1.
- Do **not** act as the market-analysis, portfolio-analysis, risk-assessment, strategy-planning, Veles or GinArea Skill. This Skill validates inputs and returns an evidence gate; it does not determine trade entry or grant `READY`.
- Do **not** assume access to a private Bybit/GinArea/Veles account, a persistent monitor, scripts, CI, or real-time price feed. Never submit orders or request credentials.

## Required references — read when relevant

The paths below are **relative to this Skill directory**. Read their actual contents from the **specified GitHub branch/commit** or another verified mounted copy; do not claim they were automatically loaded.

- [Primary freshness and conflict rules — R1/R2/R3; AD-009](../../../docs/data-freshness.md)
- [Source availability, applicability, fallbacks and data categories](../../../docs/data-sources.md)
- [Evidence classes, validation and TV-01–TV-04](../../../docs/data-validation.md)
- [Minimal input requests T01–T06](../../../docs/input-templates.md)
- [Cross-cutting operating rules](../../../docs/agent-operating-rules.md)
- [P01/P02 — platform help is not actual user form](../../../docs/platforms/platform-validation.md)
- [Final configuration evidence contract](../../../docs/platforms/configuration-contract.md)
- [Accepted scope and open issues after stage 06](../../../docs/stage-06-review.md)
- [Full FR-001–FR-053](../../../docs/requirements.md)
- [Global repository instructions](../../../AGENTS.md)

**Precedence:** runtime/system/developer instructions and hard safety constraints → user's adopted FR/AD limits → AGENTS and approved policy documents → this Skill → examples. In a meaningful document conflict: identify it and return `UNVERIFIED`; do not silently loosen a gate.

## Procedure

1. **Classify the decision and scope.**
   - `R1`: education / market overview; can use dated context and explain limits. No blanket requirement for account T02.
   - `R2`: preliminary Long/Short, price zones, strategy or grid; verify recent prices **and enough closed OHLCV for the claimed timeframe**. May provide a clearly conditional, non-ready analysis if inputs are insufficient.
   - `R3`: only when preparing/finally verifying **one selected platform** configuration or an action needing final `READY`; all mandatory market, account, platform and risk inputs apply. This Skill's `DATA_CHECK_PASSED` **never itself means `READY`**.
   - Determine specific symbols, timeframe, market category, account scope and which data categories actually affect the requested conclusion.

2. **Identify each source and field.** Store for each material metric:
   - `metric; value; unit; exchange/provider; symbol; category/market_type; settleCoin; price_kind (Last/Mark/Index/bid/ask/trigger); timeframe; methodology; source URL/identifier; evidence_class; confidence/limitations`.
   - Distinguish **Bybit USDT Perpetual (`category=linear`, symbol and contract confirmed)** from Binance Spot or similarly named perpetuals. A coin name or ticker alone is not proof of the correct market.
   - Verify USD vs USDT, base quantity vs quote notional, percentages vs fractions, and instrument specification. Do not combine unlike money or price definitions without a proven conversion.
   - A **user screenshot** is user-provided evidence, not independently verified market API data. A source page or chart containing 'BYBIT' is not automatically the correct perpetual.

3. **Preserve separate time fields**, with the original timezone/precision:
   - `observed_at`: source's actual observation, only if provided.
   - `response_time`: source server reply time (Bybit V5 `time` is Unix **milliseconds**); an explicit proxy, not automatically every field's observation time.
   - `retrieved_at`: when this interaction actually retrieved/read it; **does not refresh** old data.
   - `snapshot_at`: original capture time of a screenshot/export; not message upload time.
   - `published_at`: actual announcement publication; not a search crawl timestamp.
   - `market_startTime`: opening time of an OHLCV bar; **not** the bar's close or retrieval time.
   - Compare UTC instants (ISO 8601 with `Z` or an offset) and show user-facing time in **Europe/Moscow** when applicable per approved policy. If time/zone is missing: `UNKNOWN_TIME`/`TIME_UNVERIFIED`; a future timestamp with incompatible clocks: `CLOCK_CONFLICT`. Do not infer freshness from `retrieved_at` alone.

4. **Apply AD-009 — mode- and metric-specific freshness** (maximum values from the accepted policy; earlier invalidation always wins):
   - **Last/Mark/Index:** `R1 ≤15 min` for current context; `R2 ≤5 min` for intraday levels; `R3 ≤2 min` for required current price; separately obtain applicable **Bybit Mark** for liquidation, not Last or Spot.
   - **Whole T02 account (R3): ≤5 min** **and** affirmative coverage of equity, all positions, accounts/subaccounts in scope, active/conditional orders, bots and future IN obligations, **and** confirmation no material change occurred since capture.
   - **Order book / trade stream:** about `≤30 sec` when used as live execution evidence, tighter under rapid changes; top-of-book ticker is not full depth.
   - **OI:** about `≤15 min` if needed as a current signal; no blanket requirement when irrelevant. **Funding:** `≤30 min` for R1/R2 current context, `≤10 min` for a material R3 cost estimate; preserve interval and next funding time.
   - **OHLCV/indicators:** verify **last expected *closed* candle**, sufficient history, source and interval; `startTime` denotes bar **open**, and the current unfinished bar is not a closed observation.
   - **Instrument filters/risk steps:** for R3 verify within `≤24 h` **or immediately after** relevant exchange/symbol/risk change; `≤7 days` is a conditional R1/R2 reference ceiling, not a trading permit.
   - P01/P02 use **version and material event changes**, not arbitrary numeric 'five-minute TTL'. Historical H02/H03 have historical scope, not a five-minute expiry.
   - Large volatility, breaking news, funding event, API outage, position/order/price/mark/margin/fee change or bot edit/restart can require earlier refresh. `age ≤ TTL` **alone does not prove data validity**.

5. **Check completeness and internal consistency.**
   - Use only the minimum T01–T06 needed for the task. T01: goal/symbol; T02: full Bybit account for whole-risk/R3; T03: position when present; T04: bot/strategy/current form and full future IN grid; T05: linked trade series/H01 if recovery; T06: optional Equity history/H02/H03 plus known H04.
   - Do not request all T01–T06 for a generic market overview. Missing H02/H03 history is `NOT_CHECKED`, **not** itself a ban on `READY`; confirmed H04 bars risk expansion and must be reported to the risk stage.
   - For final R3 require actual **P02** form for the selected Veles/GinArea account/version/symbol/strategy and full actual **T02** portfolio; public platform help **P01 does not prove P02**.
   - One-Way/Hedge, Cross/Isolated, ownership, current vs future exposure and conditional-order states belong to portfolio/risk verification; pass their missing/conflicting evidence onwards, do not invent it.

6. **Resolve source conflicts conservatively.**
   - Compare only observations with compatible `exchange, symbol, market_type, price_kind, time, unit, window, method`.
   - Prefer traceable exchange-specific primary sources **when they actually supply the required observation**, but freshness alone does not override a substantial unresolved inconsistency. Never average incompatible market values.
   - **HTTP 403 or blocked API:** record exact failed endpoint/time/metric and `UNAVAILABLE` **for that route**, not 'all Bybit unavailable'. Try approved, actually accessible same-market sources; user-supplied clearly dated Bybit screenshot can support conditional analysis with `UNVERIFIED` provenance, not independent confirmation.
   - A Binance Spot Last value may provide **separately labelled background context**, never replace Bybit USDT Perpetual Mark, T02, execution price or liquidation value. Do not infer candles, indicators or balances from unrelated pages.
   - Missing/unknown and contradictions have different consequences: genuinely absent mandatory data → `NEEDS_DATA`; material identity/source/method conflict or unprovable Cross/MMR or Short-loss model → `UNVERIFIED`; **known hard violation / H04** → `REJECTED` for new risk even if other inputs are missing.
   - Nonessential stale data must be omitted from the operative rationale, not silently upgraded to verified.

7. **Output a verification report to the calling workflow.** Provide:
   - `task; mode (R1/R2/R3); exchange/market/symbol; source-and-timestamp table; required/present/missing/conflicting data; last expected closed candle where relevant; applied TTL and event invalidators; evidence labels; requests for only missing items; scope limitations`.
   - Add `decision_impact = CONTEXT_ONLY | PRELIMINARY_LIMITED | DATA_CHECK_PASSED_NOT_READY | NEEDS_DATA | UNVERIFIED | REJECTED`. The first three are **internal data-gate labels, not new final trading statuses**. Only the larger approved risk/platform chain can consider `READY`.
   - If multiple issues coexist, preserve all: proven hard failure takes precedence over critical unresolved model/source conflict, which takes precedence over missing input (`REJECTED > UNVERIFIED > NEEDS_DATA`). Do not declare a standalone education reply `NEEDS_DATA` merely because private T02 was not supplied.
   - Always state what **was actually read/verified**, what is user-provided, what is a synthetic calculation, and which sources could not be reached. Never claim a GitHub Skill was automatically invoked unless the runtime provides that evidence.

## R3 handoff: mandatory final recheck

Before final Veles/GinArea settings, request or validate a **new synchronized complete T02** (equity, cross/isolated, every position, every active/conditional order, all bots, projected IN and reserve), current **Bybit Mark** and P02 of the **one selected** platform, then hand them to portfolio/risk/platform Skills for S0–S3, FR-029–FR-040 and F/A/H/R. Historical data, public screenshots or this Skill cannot close open issues **RV-02/RV-03, RV-04/RV-06, TV-01–TV-04** or real-world FR-038 by themselves.

**Never:** send trades, change leverage, publish keys or private account data to GitHub, present a stale snapshot as current, infer a precise Cross liquidation price or guaranteed maximum Short loss from a stop.
