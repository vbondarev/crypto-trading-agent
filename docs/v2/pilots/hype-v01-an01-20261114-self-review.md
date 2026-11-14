# HYPE-V01 / AN-01 — self-review of real-source analytical-route trial (public only)

**Reviewed:** 2026-11-14.
**Disposition:** `DOCUMENTARY_SELF_REVIEW_COMPLETE / REAL_SOURCE_ACCESS_PARTIAL / SAFE_WAIT_CONFIRMED_IN_CHAT / INDEPENDENT_V2_RUNTIME_NOT_TESTED / USER_ACCEPTANCE_PENDING / NO_TRADE_READY`.

## 1. Test artifact and provenance

Reviewed `docs/v2/pilots/hype-v01-an01-20261114-analytical-source-test.md`, initial commit `3350a78df5b92209af95b5bc4b6582c9d60ca00d`, re-read through GitHub as Blob `e4224ad9228b195badc4319bf467c86298358177` with exact content. Pretest reference branch HEAD was `016a40b9c2424016b9487c685c6bd5ea80525d2c`, limited to `feature/simplified-agent-v2`.

This was a **manual in-chat execution of the v2 written research/technical/source-handling instructions** using actual public website tool results. It was **not** a test invocation of a separately running agent; market data quality and vendor pages are not independently attested exchange API truth. `workflow-guard.mjs` was read but **not executed against full JSON Schema instances**. Reviewer and report author are the **same assistant**, not an independent verifier.

## 2. Twelve structural, logical and safety checks

| Check | Result | What was actually verified |
|---|---|---|
| Correct Bybit target scope + market mismatch handling | `PASS` | Target `HYPEUSDT USDT_PERPETUAL`, spot context explicitly separated |
| Public source retrieval and status distinctions | `PASS` | Search/open results obtained; inaccessible Bybit endpoints not called verified |
| Timestamp/provenance source-retrieval separation | `PASS` | Session time distinguished from publisher, candle and source-observed time |
| No fabricated Bybit V5 responses, price or candles | `PASS` | Missing API and OHLCV explicitly stated |
| Secondary spot RSI/EMA not treated as computed linear futures indicators | `PASS` | Correct `NOT_COMPUTED` for Bybit 15m/1h/4h |
| Source conflict and dynamic-cached versions handled | `PASS` | Discrepant page values not averaged or cherry-picked |
| Broad market and project issuer/partner context actually obtained | `PASS` | Attributable dated BTC/ETH session plus Kinetiq announcement |
| Unobserved X/Telegram/social samples not invented | `PASS` | Coverage explicit, no fabricated sentiment |
| Coin Profile maintains context vs verified target trend | `PASS` | `RISK_OFF` context, Bybit local/global `UNKNOWN` |
| Safe trade decision follows missing critical inputs | `PASS` | `WAIT / NEEDS_DATA / INSUFFICIENT` |
| No live bot, private account request, price grid or account change | `PASS` | The step stayed public/nontrading |
| No false automated/independent runtime pass or premature acceptance | `PASS` | Missing separately loaded agent, typed handoff, R3, user acceptance clearly stated |

**12/12 scoped documentation/logic assertions PASS.** This is **not** 12 successful live Bybit integrations, market feeds or independent agent test cases. Of the report's T01–T10 controls, T04/T07 were blocked/incomplete. Counts of actual successful external market data collection are **not** conflated with documentary PASS.

## 3. Independent-minded adversarial findings

| ID | Severity | Finding | Status / remedy |
|---|---|---|---|
| SR-AN01-01 | HIGH | Official Bybit ticker, instruments and multi-timeframe kline retrieval failed through available public web tool; no native Mark | `BLOCKED_UPSTREAM_ACCESS`; implement/test an authorized public REST data path or inspect a public export |
| SR-AN01-02 | HIGH | No sufficiently long and attributable closed Bybit candle history for EMA/RSI/MACD/ATR; secondary Binance spot data not equivalent | `NOT_COMPUTED`; do not issue numeric levels |
| SR-AN01-03 | HIGH | Dynamic sites have upstream timestamp gaps and cached version differences | `TIME_UNVERIFIED/CONFLICT`; exclude exact current signal from them |
| SR-AN01-04 | HIGH | Distinct v2 agent was not loaded; `workflow-guard.mjs` and JSON schemas were not exercised end to end | `INDEPENDENT_RUNTIME_NOT_TESTED`; separate executable validation required |
| SR-AN01-05 | MEDIUM | User's earlier complaint that portfolio intake displaced market analysis is valid | Add explicit routing regression case: `COIN_RESEARCH` must never demand T02 absent account-specific goal |
| SR-AN01-06 | MEDIUM | Social X/Telegram, issuer buyback/unlock claims lack direct independent observation in current session | Preserve gap; request dated first-party source only if material |
| SR-AN01-07 | MEDIUM | Funding/OI from aggregators are not contemporaneous, may differ in units/coverage, and not proven native Bybit | Secondary derivatives context only; not a proof of position pressure or arbitrage |
| SR-AN01-08 | LOW | "WAIT" is safe and appropriate but cannot be interpreted as verified profitable or optimal outcome | Treat as data-gated result, not successful directional prediction |

## 4. Acceptance gates and next step

**Proposed user acceptance:** accept AN-01 as **completed source-access and evidence-discipline trial with blockers**, NOT as full technical/market analysis, successful automated agent execution or approval of a trading setup.

Recommended next step **only with separate user agreement**:
1. Validate access to actual public Bybit `category=linear; symbol=HYPEUSDT` tickers, instrument metadata and sufficient **closed 15m/1h/4h OHLCV** from an authorized source path. No user wallet/API secrets required.
2. Pin original response source/time, `retCode`, symbol, list length, candle closure/finalization, units and independent data integrity. Then actually calculate indicators with documented methods/parameters.
3. Rerun the same Coin Profile and report conditional posture, with no account T02 needed for research. If `LONG/SHORT` justified and user authorizes Step 2/3, prepare conditional non-executable Veles plan. Full R3 account risk remains separate.

Known user position details and balance never stored in these public docs; no Legacy `AGENTS.md`, old agents/Skills, prior P02 acceptance artifacts or PR #1 were modified.

**State:** `AN01_ACCEPTANCE_PENDING / NEXT_STEP_NOT_AUTHORIZED / NO_TRADE_READY / STAGE_06_NOT_STARTED / V2_NOT_ACTIVE`.
