# HYPE-V01 / P02-07-E02 — user confirms open futures positions

**Date recorded:** 2026-11-14. This chat date is **not** a verified exchange observation timestamp.
**State:** `POSITIONS_PRESENT_USER_ATTESTED / ORDERS_UNKNOWN / BOTS_UNKNOWN / T03_APPLICABLE_LATER / P02_07_IN_PROGRESS / NO_TRADE_READY / USER_ACCEPTANCE_PENDING`.

## 1. Evidence and source tier

Following the prior P02-07 Tier A report (Git Blob `67e56abc548b971dc7ba5c6b898d220763691d13`), the assistant specifically asked which categories were present: (1) open futures positions, (2) active or conditional orders, and/or (3) active or paused bots. The user replied:

> «- Открытые фьючерсные позиции»

Interpret as `OPEN_FUTURES_POSITIONS_PRESENT_USER_ATTESTED` **on the previously specified Bybit UTA subaccount**. This confirms **at least one** open futures position by user report. It **does not** establish the number, symbols, Long/Short slots, size, ownership, account-wide risk, or whether HYPEUSDT is among them.

**Crucially, the omitted categories were not explicitly denied**: `ACTIVE_OR_CONDITIONAL_ORDERS = UNKNOWN`; `RUNNING_OR_PAUSED_BOTS = UNKNOWN`. A selection of one category from a nonexclusive list is **not** evidence that all other categories are absent. Do not interpret it as 'only positions'.

This is private-account **user testimony**, not a direct Bybit authenticated T02/T03 response, source-timed screenshot, current exchange query, or verified exact Veles–Bybit account identity.

## 2. Evidence table and the safe effect on scope

| Category | Updated state | Why |
|---|---|---|
| At least one open futures position (P) | `YES_USER_ATTESTED` | User directly named this category |
| Active/conditional/trigger orders (O) | `UNKNOWN` | Not mentioned or denied |
| Running/paused Veles/GinArea bots (B) | `UNKNOWN` | Not mentioned or denied |
| Actual position count, both Hedge sides, instruments | `UNKNOWN` | No quantitative list |
| HYPEUSDT LONG/SHORT presence or absence | `UNKNOWN` | No named symbols |
| Risk model and current Equity/IM/MMR | `NOT_EVALUABLE` | No fresh full T02, Mark or full T04 |
| Observation time + exact selected account identity | `TIME_AND_LINKAGE_UNVERIFIED` | No independently attributable observation |
| Existing-position adoption in proposed Veles bot | `USER_INTENT_OFF / PERSISTENT_STATE_UNVERIFIED` | Earlier visual S6 OFF and user intent; not an actual exchange-state check |

The P02-06 protocol now requires a future **T03 for each actually open position** (conditional on a separately approved real account/risk review), *in addition to* the complete account-wide T02. A fresh T02 still needs to cover **all** orders (including conditional/pending and no-orders confirmation), other bots and their future INs; a T03 screenshot alone cannot close the entire Cross-account risk coverage. Never double-count bot and exchange orders without proven identity.

Hedge enables distinct LONG and SHORT position slots; unknown symbol/direction and position count mean **FR-033 ≤3 slots is NOT_CHECKED**, not PASS or known REJECTED. Unknown H04 is **not an asserted breach**, but an established active H04 would veto new/add risk. Existing HYPE position adoption is NOT intended; the Veles toggle OFF screenshot does not prove no existing HYPE position or safe separate bot management.

## 3. Next minimal, non-sensitive question

Ask one qualitative question only, before discussing position amounts:

**«Есть ли среди этих открытых фьючерсных позиций HYPEUSDT? Если да, это LONG, SHORT или обе стороны? Можно ответить: нет / LONG / SHORT / обе / не знаю.»**

Why: HYPEUSDT already being open on either Hedge slot could affect future Veles LONG bot ownership/aggregation/position-adoption decisions, whereas unrelated positions still affect shared Cross margin. **Do not assume a different symbol is absent, infer a trading recommendation, or prescribe closing/repositioning.**

Subsequent open/conditional-order and bot presence must be queried separately; no unrequested user-specific monetary data, account IDs, screenshot bytes or credentials belong in public GitHub.

**No real R3, bot configuration, price/stop, allocation, account mutation or trade has occurred.** `P02_verified_at=null`, `field_map_version=null`, `STAGE_06_NOT_STARTED`, `V2_NOT_ACTIVE`. Only `feature/simplified-agent-v2`; legacy agent, earlier accepted pilot documents, `main` and Draft PR #1 untouched.
