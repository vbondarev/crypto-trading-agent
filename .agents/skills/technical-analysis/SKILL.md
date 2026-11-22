---
name: technical-analysis
description: Calculate and interpret validated multi-timeframe cryptocurrency technical evidence, indicators and structure without invented market data.
---
# Technical Analysis
**Trigger:** selected coin trend/indicator/level analysis for user research or future bot design.

## Inputs / output
Input: `RequestContext`, verified Bybit instrument, closed OHLCV or attributable user-provided indicator values. Output: `TechnicalEvidenceBundle` (`docs/v2/contracts/technical-evidence.schema.json`), with source IDs traceable to `EvidenceRecord`.

## Procedure
1. For current Bybit analysis, fetch public instrument and Kline data yourself according to `docs/v2/source-acquisition-policy.md`. Confirm exchange, instrument type, settlement, observation times, units, candle interval and **closed** status. Spot series do not substitute for futures Mark/liquidation inputs.
2. Choose timeframes appropriate to horizon (typically 15m/1h local and 4h/1d global, **only where data exist**). Require adequate closed-candle history and indicator warm-up; otherwise set indicator validation NOT_COMPUTED or NOT_VERIFIED rather than fabricate values.
3. Evaluate price structure HH/HL/LH/LL, trend/range, EMA/SMA/RSI/MACD/ATR when computable, traded volume and volatility. For EMA20/50, RSI(14), ATR(14) and relative volume, use the calculator below. State each computation's method/parameters, last closed candle timestamp and source evidence IDs.
4. Identify defensible support/resistance zones, momentum and volatility, scenario triggers and invalidations. Avoid spurious price precision and invented probability.
5. Compare timeframes; `UP|DOWN|RANGE|MIXED|UNKNOWN`. Report genuine conflicts rather than compress into a false strong trend. An indicator is evidence, not a trade signal by itself.
6. Recheck source freshness and AD-009 after an instrument/price/material event change. Return gaps and confidence reasons. Never declare configuration safety or issue live trading actions.

## Indicator calculator

Run the [Python calculator](../../../tools/technical_indicators.py) once for each timeframe using the candle CSV from the Bybit collector or an equivalent export of the same trade-price series. The input must contain `start_ms,open,high,low,close,volume_base`. Use the trusted Bybit cutoff for a current analysis or the specified cutoff for a historical replay.

```powershell
python tools/technical_indicators.py snapshot/candles/1h.csv --interval 1h --as-of 2026-11-22T17:00:15.653+03:00
```

- The calculator checks OHLCV, alignment and continuity, and accepts candles whose closing time is strictly before the cutoff. Convert raw Bybit Kline to the CSV columns above after filtering out open or boundary candles and confirming the latest expected closed bar. Confirm the market and the source, including the cutoff, before running the calculator.
- EMA20/50 use the mean of the first 20/50 closes as a seed. RSI(14) uses Wilder smoothing of gains and losses, with a flat series reported as 50. ATR(14) includes `High - Low` for the first candle, seeds with the mean of the first 14 true ranges and uses Wilder smoothing thereafter. ATR percent uses the last Close. RVOL divides the last base volume by the median of the previous 20 candles. A zero median or insufficient input produces `null` for the affected value.
- Keep the output's input hash, first open, last close and candle count with the evidence. State the units and round only in the report. Confirm the history is long enough for the requested analysis before citing a value. TA-Lib is an optional independent check. Its default ATR skips the first candle's true range, so align that convention before comparing.

## Validation / dependency
Schemas: `docs/v2/contracts/request-context.schema.json`, `evidence-record.schema.json`, `technical-evidence.schema.json`. Canonical sources: `docs/reference/market-analysis.md`, `docs/data-freshness.md`, `docs/prompts/technical-scenario.md`.

## End-to-end routing

Follow the single-request workflow in `docs/v2/analytical-workflow.md`, including shared RequestContext/EvidenceRecord identity, source accessibility checks, partial-data handling, AD-009 event invalidation and downstream risk status. For source acquisition use `docs/v2/source-acquisition-policy.md`; for platform handoff use `docs/v2/bot-handoff-policy.md`. Treat public data as observed only after a successful response in the current session. If the end-to-end workflow contradicts canonical `docs/risk-management.md` or actual Veles/GinArea P02, the canonical hard-safety/platform constraints prevail.
