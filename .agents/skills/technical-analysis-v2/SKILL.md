---
name: technical-analysis-v2
description: Calculate and interpret validated multi-timeframe cryptocurrency technical evidence, indicators and structure without invented market data.
---
# Technical Analysis (v2 preview, NOT ACTIVE)
**Trigger:** selected coin trend/indicator/level analysis for user research or future bot design.

## Inputs / output
Input: `RequestContext`, verified Bybit instrument, closed OHLCV or attributable user-provided indicator values. Output: `TechnicalEvidenceBundle` (`docs/v2/contracts/technical-evidence.schema.json`), with source IDs traceable to `EvidenceRecord`.

## Procedure
1. Confirm exchange, instrument type, settlement, observation times, units, candle interval and **closed** status. Spot series do not substitute for futures Mark/liquidation inputs.
2. Choose timeframes appropriate to horizon (typically 15m/1h local and 4h/1d global, **only where data exist**). Require adequate closed-candle history and indicator warm-up; otherwise set indicator validation NOT_COMPUTED or NOT_VERIFIED rather than fabricate values.
3. Evaluate price structure HH/HL/LH/LL, trend/range, EMA/SMA/RSI/MACD/ATR when computable, traded volume and volatility. State each computation's method/parameters, last closed candle timestamp and source evidence IDs.
4. Identify defensible support/resistance zones, momentum and volatility, scenario triggers and invalidations. Avoid spurious price precision and invented probability.
5. Compare timeframes; `UP|DOWN|RANGE|MIXED|UNKNOWN`. Report genuine conflicts rather than compress into a false strong trend. An indicator is evidence, not a trade signal by itself.
6. Recheck source freshness and AD-009 after an instrument/price/material event change. Return gaps and confidence reasons. Never declare configuration safety or issue live trading actions.

## Validation / dependency
Schemas: `docs/v2/contracts/request-context.schema.json`, `evidence-record.schema.json`, `technical-evidence.schema.json`. Canonical sources: `.agents/skills/market-analysis/SKILL.md`, `docs/data-freshness.md`, `docs/prompts/technical-scenario.md`.

## Stage 04 end-to-end routing (inactive preview)

Follow the single-request workflow in `docs/v2/analytical-workflow.md`, including shared RequestContext/EvidenceRecord identity, source accessibility checks, partial-data handling, AD-009 event invalidation and downstream risk status. For source acquisition use `docs/v2/source-acquisition-policy.md`; for platform handoff use `docs/v2/bot-handoff-policy.md`. Do **not** claim these documents confer live API/tool access or activate v2. If the end-to-end workflow contradicts canonical `docs/risk-management.md` or actual Veles/GinArea P02, the canonical hard-safety/platform constraints prevail. Legacy AGENTS.md remains active, untouched.
