# HYPE-V01 / P02-02-E03 — user clarification of existing-position adoption

**Recorded:** 2026-11-11 (Europe/Moscow calendar date).  
**State:** `USER_INTENT_CLARIFIED / SWITCH_STATE_NOT_RECHECKED / P02-02_USER_ACCEPTANCE_PENDING`.  
**Branch:** `feature/simplified-agent-v2`.

## Source of the decision

In response to the specific question whether the selected `ВКЛЮЧАТЬ ПОЗИЦИЮ НА БИРЖЕ В СДЕЛКУ` switch was intentional, the user answered: **«Нет, не намеренно»**. This is a clarification of *intent only*, not evidence that the switch was already changed, not explicit approval of P02-02, and not authorization for any exchange or bot modification.

The previous user screenshots in P02-02-E02 showed the `LONG` direction, `Bybit Futures` connection label, selected `HYPE / USDT` and `Простой` trading mode. The existing-position inclusion switch visually **appeared ON** (orange handle on right); no trade execution or real position adoption was observed. Earlier synthetic `CUSTOM` remains unrelated to the observed `SIMPLE` UI.

## Safe instruction and evidence gate

1. **If editing an unsaved new-bot draft** and the user does **not** want to adopt a preexisting exchange position, set `ВКЛЮЧАТЬ ПОЗИЦИЮ НА БИРЖЕ В СДЕЛКУ` to **OFF**, check that the switch visibly appears grey/left and do not create, save, update, run, test or start a bot.
2. **If this is the editor of a running bot or existing active trade**, do not toggle anything yet; first establish actual bot/trade state and ownership. No autonomous actions.
3. Ask for a **read-only screenshot showing the switch OFF** if/when the user performs the harmless draft UI adjustment, plus observation time/timezone if available. Until then the intended state is `OFF`, the observed state remains `ON_APPEARING`, and the actual updated UI state is `NOT_VERIFIED`.
4. Preserve absence of actual T02/T03/T04, account mode, current Mark, leverage, Equity, MMR, Short risk and mandatory F/A/H/R stress. This is not a real-ready Veles setup; `P02_verified_at=null`, `field_map_version=null`, no numeric grid or orders.

**Scope:** update of user intent in P02-02 only; original screenshot audit and self-review remain immutable. User acceptance of P02-02 remains `PENDING`. Legacy agent/PR #1, `main` and production instructions unchanged; `v2 NOT_ACTIVE`, `Stage 06 NOT_STARTED`.
