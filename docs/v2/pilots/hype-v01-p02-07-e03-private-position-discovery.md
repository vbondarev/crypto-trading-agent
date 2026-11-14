# HYPE-V01 / P02-07-E03 — target-instrument exposure classification (PUBLIC SAFE)

**Recorded:** 2026-11-14. Chat date is not an authenticated exchange snapshot time.
**State:** `TARGET_INSTRUMENT_POSITION_USER_ATTESTED / EXCHANGE_EXPOSURE_PRESENT / OWNERSHIP_UNKNOWN / PORTFOLIO_NOT_VERIFIED / NO_TRADE_READY / P02_07_IN_PROGRESS`.
**Source tier:** user supplied confidential account-specific position information in chat; **details deliberately omitted** from this public repository. No account read was performed.

## 1. Scope and privacy

Under P02-07 Tier A, a user reported having an actual open position **on the instrument being considered for the HYPE pilot**. The user-supplied position **direction, size, account-specific timestamps, cost basis, price/PnL, order and bot links** are intentionally NOT reproduced in this public file. The prior P02-07 E02 report established that there is at least one open futures position on the intended Bybit subaccount, by user report. E03 narrows this to **presence of exposure on the pilot instrument** only.

Do **not** publish the verbatim user statement, actual position direction, size, entry, liquidation price, balance, screenshots, UID, orders, bot identities or API keys. Do not store these details in the repository even if a user supplied them privately. Privately reported facts must not be promoted into direct exchange authentication.

## 2. Decision impact (without private account details)

- Existing exposure on the proposed bot's instrument makes **position ownership**, current Veles bot/exchange order overlap, position mode, and account-wide collateral requirements material.
- Public documentation from Bybit states that in Hedge mode LONG/SHORT slots can coexist but Cross-account margin is assessed using account-level exposure, and a position in one slot does **not** eliminate risk of another slot. See https://www.bybit.com/en/help-center/article/Difference-Between-Position-Modes-One-Way-Mode-and-Hedge-Mode .
- Veles documents separate two-direction futures bots in Hedge mode, but warns that multiple bots sharing a **same side** of the same instrument can interfere. See https://help.veles.finance/ru/exchange/general/position-mode/ .
- The prior screenshot of Veles's **existing-position inclusion toggle OFF** was **not** proof of a saved bot state. Do not infer bot ownership from position existence or assume any position will or will not be adopted automatically.
- The user report does not give an authenticated total number of current Hedge positions/slots or an assurance that another simultaneous slot is empty. No exchange-side leverage, risk tier, current Mark, Cross MMR/IM, equity, stop, funding or future grid reserve is available.
- A proposed additional bot position would increase or interact with reachable account exposure. The FR-033 limit of **at most three open positions** and FR-029/030/032/034 gates remain **NOT_EVALUABLE** until whole-account T02 and planned T04 (with account-matched positions/orders/other bots). Known H04 ACTIVE remains a hard veto for added risk; no current H04 fact was provided.
- **No real R3** and no `READY`, executable grid, liquidation assessment, order, API request or account modification. Real Cross-model RV-02 remains open.

## 3. Tier A coverage update

| Field | Current documented status |
|---|---|
| Open futures positions somewhere on the subaccount | `YES_USER_ATTESTED` |
| Open position on the candidate pilot instrument | `YES_USER_ATTESTED / DETAILS_REDACTED` |
| Who manages that existing position (manual / Veles / GinArea / other) | `UNKNOWN` |
| Any active or conditional order related to it | `UNKNOWN` |
| Existence of any other running/paused bot | `UNKNOWN` |
| Other position symbols, count and both Hedge slots | `UNKNOWN` |
| Exact Veles–Bybit subaccount identity and source time | `UNVERIFIED` |
| Financial and bot readiness | `NOT_EVALUABLE / NO_TRADE_READY` |

## 4. Next minimal question

Ask, **without requesting amounts or screenshots**:

> «Существующая позиция по рассматриваемому инструменту открыта **вручную** или сейчас управляется **ботом Veles/GinArea**? Варианты: вручную / Veles / GinArea / другой бот / не знаю.»

This is a **management/ownership classification**, not an assumption that the position is automated. Once answered, separately check the presence of active/conditional orders and other bots before any final risk-data review. A private detail provided in chat stays private; public reports may state only aggregate categories and unresolved risk gates.

**Authorization:** previously accepted P02-06 Tier A follow-up, not approval of Tier B/C, real R3 or bot launch. `P02_verified_at=null`, `field_map_version=null`, `STAGE_06_NOT_STARTED`, `V2_NOT_ACTIVE`. Only `feature/simplified-agent-v2` changes; `main`, `AGENTS.md`, legacy agent, accepted pilot docs, Draft PR #1 unchanged.

**Result:** `P02_07_E03_DOCUMENTED / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING / NO_TRADE_READY`.
