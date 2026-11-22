# HYPE-V01 / P02-06 — formal acceptance of Cross-risk evidence-readiness protocol

**Recorded:** 2026-11-14 (conversation calendar date; exact message time not independently authenticated).  
**Decision:** `P02_06_COMPLETED / APPROVED_WITH_LIMITATIONS / USER_ATTESTED / NO_TRADE_READY`.  
**Branch:** `feature/simplified-agent-v2`.

## 1. User decision and precise scope

After reviewing the P02-06 evidence-readiness protocol and its self-review, the assistant asked:

> «Принимаете P02-06 с указанными ограничениями?»

The user explicitly answered:

> **«Принимаю»**

This **accepts only the P02-06 preparatory protocol** and its documented restrictions. The user's statement does **not** authorize full live R3, obtaining private account data by API, calculating executable prices or grid orders, bot creation/save/backtest/run, exchange account mode/leverage changes, transfer of funds, v2 activation, Stage 06 or changing the legacy PR #1.

## 2. Exact accepted artifacts

| Document | Git blob | Accepted result |
|---|---|---|
| `docs/v2/pilots/hype-v01-p02-06-cross-risk-evidence-readiness.md` | `7f31dc36ff19623d7c218e3cd16002df95a02808` | Three progressively requested evidence tiers A/B/C, eleven future R00–R10 gates, four documentary NX01–NX04 negative controls |
| `docs/v2/pilots/hype-v01-p02-06-self-review.md` | `415314a2566d7c2de670d1c265a87d26c932e5c7` | 12/12 **documentation/policy** checks PASS and 11 adversarial findings, not 12 real risk/integration tests |

Previous P02-05 acceptance was recorded separately in `docs/v2/pilots/hype-v01-p02-05-acceptance.md`. Preserve all pre-existing files and their original evidence records unchanged.

## 3. Explicit remaining blockers

- The targeted Veles form has partial historical visual evidence `HYPE/USDT LONG SIMPLE`, Cross, displayed 1×, user intent not to adopt an existing position. There is **no authenticated same-session saved configuration** and no completed `P02_verified_at` or `field_map_version`.
- User reported Bybit subaccount UTA Cross/Hedge and positive available futures funds in USDT, Veles currently displaying positive indicative balance; these reports **do not** establish actual current Equity, IM/MMR, open positions, orders, other bots, total reserves or account scope.
- Full fresh T02, conditional T03, complete T04, official HYPEUSDT instrument info, Bybit Mark, fees/funding/slippage and F/A/H/R stress **not collected or evaluated**.
- `RV-02` (real UTA Cross liquidation model) and `RV-03` (generic bounded Short loss) remain open. No margin utilization ≤30% Equity, worst bot loss ≤5%, leverage ≤5× on Bybit, adverse liquidation buffer ≥15%, position cap ≤3 or complete reserve pass is claimed.
- H02/H03 historical Equity may be marked `NOT_CHECKED` if unavailable; known H04 hard restrictions must still veto adding risk. Nothing here establishes H04 as clear.

**Status:** `NO_TRADE_READY / REAL_R3_NOT_RUN / V2_NOT_ACTIVE / STAGE_06_NOT_STARTED`. No bot or position action.

## 4. Next bounded action after this acceptance

The previously described **Tier A** discovery question may now be asked: whether **any** open futures position, active/conditional order, or running/paused bot exists on the targeted Bybit subaccount. Answer `Да / Нет / Не уверен`; no amounts, keys, or screenshot necessary.

This is **portfolio-scope discovery only**. A verbal `Нет` must be recorded as `USER_ATTESTED_NO_EXPOSURE`, *never* as an independently verified empty account. Any subsequent Tier B (bot budget) or Tier C (real financial-risk inputs) remains subject to a separately discussed and approved step; no silent stage advancement.

The same assistant's record review checks: user acceptance string is explicit; two immutable Git blob references retained; no real-risk PASS invented; no main/legacy artifacts modified; separate future approval required.

**Isolation:** all writes on `feature/simplified-agent-v2`. Existing `AGENTS.md`, main, legacy agent, original pilot, and open Draft PR #1 untouched.
