# HYPE-V01 / AN-01 — acceptance and authorization for public-data repair

**Recorded:** 2026-11-14. No claim about exact message timestamp beyond conversation date.
**Decision:** `AN01_ACCEPTED_WITH_LIMITATIONS / PUBLIC_BYBIT_DATA_ACCESS_REPAIR_AUTHORIZED / NO_TRADE_READY / V2_NOT_ACTIVE`.

## User instruction

The assistant asked: «Принимаете результаты AN-01 с указанными ограничениями и переход к исправлению доступа к рыночным данным?» The user responded:

> «Приниаю»

Interpret the obvious typo as affirmative acceptance in the immediate question's context. This approves the **AN-01 partial public-data research trial**, acknowledges blocked native Bybit API/OHLCV and independent v2 runtime limitations, and authorizes work on a **reproducible publicly documented data acquisition and validation path**. It does not approve a market strategy, numeric order grid, bot launch, trade, portfolio review or v2 activation.

## Accepted immutable artifacts

| Source | Git blob | Scope |
|---|---|---|
| `docs/v2/pilots/hype-v01-an01-20261114-analytical-source-test.md` | `e4224ad9228b195badc4319bf467c86298358177` | Partial public market research and Coin Profile, WAIT, no authentic direct OHLCV |
| `docs/v2/pilots/hype-v01-an01-20261114-self-review.md` | `3b24d03c00be70e639ab94a9a457ad6404b4b4d3` | 12/12 scoped document checks, 8 open findings; no full live agent or OHLCV calculation |

Original pre-test base: `016a40b9c2424016b9487c685c6bd5ea80525d2c`. Current work restricted to `feature/simplified-agent-v2`.

## Authorized repair scope

1. Check current official Bybit V5 **public** endpoints and access constraints for `category=linear` symbol HYPEUSDT; explicitly distinguish direct provider errors from the assistant's web-tool restrictions.
2. Prepare narrowly scoped **read-only** public-market data collector and deterministic local/offline validation (timestamps, V5 `retCode`, symbol, category, reverse-sorted OHLCV, incomplete-candle removal, continuity, precision/units, response provenance). Keep private REST and account API methods disallowed. Acceptable to commit new source files and public documentation in the isolated branch only.
3. If a native API cannot be reached from this execution environment, state that clearly. Supply executable instructions for acquiring the public JSON from a network where it is reachable, with no API keys; never fabricate a successful live exchange response or claim real OHLCV computed.
4. Perform local synthetic tests and self-review, then return results for **separate user acceptance**. Actual rerun of indicators/Coin Profile on authenticated public Bybit responses is contingent on receiving the data, not automatic.
5. No private account files/IDs or user's existing position details in the public repository; no legacy agent, main, AGENTS.md or old Draft PR #1 changes.

**Prohibited:** buy/sell orders, stop changes, funds transfers, account API usage, Veles edits, setting leverage, merging PR #1, activating v2, Stage 06, classifying portfolio as SAFE or issuing trade `READY`.

`AN01_ACCEPTED_WITH_LIMITATIONS / AN02_PUBLIC_DATA_REPAIR_STARTED / AN02_USER_ACCEPTANCE_PENDING / STAGE_06_NOT_STARTED`.
