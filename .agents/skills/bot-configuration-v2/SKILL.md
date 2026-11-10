---
name: bot-configuration-v2
description: Produce a conditional manual-entry Veles or GinArea configuration using separate verified platform field mappings and strict portfolio/risk gates.
---
# Bot Configuration (v2 preview, NOT ACTIVE)
**Trigger:** user requests a Veles or GinArea bot for a selected symbol and strategy, or audits a current bot.

## Inputs / output
Input: `RequestContext`, `CoinProfile`, `StrategyProposal`, user budget, account evidence as needed, platform choice, P01 documentation and user-current P02 for final verification. Output: `BotConfigurationProposal` in `docs/v2/contracts/bot-configuration.schema.json`.

## Procedure
1. If strategy decision is WAIT or a known hard risk gate is breached, return NOT_RECOMMENDED, without manufactured settings. If platform is unselected, show concise comparison and ask user to choose before providing platform-specific fields.
2. For VELES use only `docs/v2/adapters/veles.md` and legacy source `docs/platforms/veles.md`; for GINAREA use `docs/v2/adapters/ginarea.md` and legacy source `docs/platforms/ginarea.md`. Mode compatibility and exact UI label/units must be verified independently; no silent IndicatorGrid→DefaultGrid switch.
3. Separate deposit/equity, notional, initial margin, order size, percent and contract quantity. Compute grid amount/steps, prospective fills and TP/SL/BE from verified evidence; record mathematical assumptions and fees/funding/slippage buffer. Missing budget or valid price data ⇒ NEEDS_DATA, no invented numbers.
4. For a **final account-level** assessment require synchronized full T02, current Mark, complete orders and future grid, platform P02 and validated risk/liq model. An overview or preliminary draft must **not** demand private account evidence by default.
5. All applicable hard gates from `strategy-synthesis` and canonical `docs/risk-management.md` apply; known breach ⇒ NOT_RECOMMENDED/REJECTED, missing evidence ⇒ NEEDS_DATA/UNVERIFIED. Existing active bot/position Stop/Pause/Disable IN/Cancel ≠ actual exchange Close/fill.
6. Set `readiness=DRAFT|NEEDS_DATA|NOT_RECOMMENDED|VERIFIED_FOR_MANUAL_REVIEW`. Final value only if **all** mandatory values/form/account/liq/stress evidence verified. This never means automatic execution, live READY, backtest or profit guarantee; user manually inputs any approved values.
7. AD-009 triggers recheck on price/Mark, fill, orders, Equity, margin, bot edit/restart or P02 form updates. No real bot orders, API credentials or autonomous operations.

## Validation / dependency
Schemas: `docs/v2/contracts/{request-context,coin-profile,strategy-proposal,bot-configuration}.schema.json`. Adapters: `docs/v2/adapters/{veles,ginarea}.md`. Canonical legacy sources: `docs/platforms/configuration-contract.md` and two existing platform Skills; no actual P02 verified by this repository artifact.
