---
name: bot-configuration
description: Produce a conditional manual-entry Veles or GinArea configuration using separate verified platform field mappings and strict portfolio/risk gates.
---
# Bot Configuration
**Trigger:** user requests a Veles or GinArea bot for a selected symbol and strategy, or audits a current bot.

## Inputs / output
Input: `RequestContext`, `CoinProfile`, `StrategyProposal`, user budget, account evidence as needed, platform choice, P01 documentation and user-current P02 for final verification. Output: `BotConfigurationProposal` in `docs/v2/contracts/bot-configuration.schema.json`.

## Procedure
1. If strategy decision is WAIT or a known hard risk gate is breached, return NOT_RECOMMENDED, without manufactured settings. If platform is unselected, show concise comparison and ask user to choose before providing platform-specific fields.
2. For VELES use only `docs/v2/adapters/veles.md` and legacy source `docs/platforms/veles.md`; for GINAREA use `docs/v2/adapters/ginarea.md` and legacy source `docs/platforms/ginarea.md`. Mode compatibility and exact UI label/units must be verified independently; no silent IndicatorGrid→DefaultGrid switch.
   For Veles DCA entry conditions, use the reference for the chosen tab: [simple indicators](../../../docs/reference/veles-dca-simple-indicators.md) or [flexible indicators](../../../docs/reference/veles-dca-flexible-indicators.md). Distinguish the indicator tab, preset or individual filters, and order mode. For a sequence, verify event order and reset separately from the documented comparisons.
   For Veles DCA orders, use the [trading modes reference](../../../docs/reference/veles-dca-trading-modes.md). Distinguish a platform preset, manually entered orders and a simulated grid. Check each planned opening order against contract limits after rounding and verify the reference price for order offsets.
   For Veles DCA take-profit, use the [take-profit reference](../../../docs/reference/veles-dca-take-profit.md). State the order mode, bot-wide indicator type and take-profit mode separately. Cite the evidence for each exit field and state how the exit changes after a fill.
3. Separate deposit/equity, notional, initial margin, order size, percent and contract quantity. Compute grid amount/steps, prospective fills and TP/SL/BE from verified evidence; record mathematical assumptions and fees/funding/slippage buffer. Missing budget or valid price data ⇒ NEEDS_DATA, no invented numbers.
4. For a **final account-level** assessment require synchronized full T02, current Mark, complete orders and future grid, platform P02 and validated risk/liq model. An overview or preliminary draft must **not** demand private account evidence by default.
5. All applicable hard gates from `strategy-synthesis` and canonical `docs/risk-management.md` apply; known breach ⇒ NOT_RECOMMENDED/REJECTED, missing evidence ⇒ NEEDS_DATA/UNVERIFIED. Existing active bot/position Stop/Pause/Disable IN/Cancel ≠ actual exchange Close/fill.
6. Set `readiness=DRAFT|NEEDS_DATA|NOT_RECOMMENDED` according to the evidence and risk gates. The active route stays in `NO_TRADE_READY`. Final account-level verification requires separate acceptance under `docs/v2/bot-handoff-policy.md`.
7. AD-009 triggers recheck on price/Mark, fill, orders, Equity, margin, bot edit/restart or P02 form updates. No real bot orders, API credentials or autonomous operations.

## Veles mode selection

When a Veles mode is unspecified, use the same market thesis, first-entry confirmation, exit and invalidation rules, protection requirements and known budget and loss ceilings for all candidates. Identify unknown ceilings. Keep the order count and build-up plan open until the comparison.

- Evaluate a suitable automatic grid in SIMPLE and a suitable single order or manual grid in CUSTOM. In SIGNAL, assess whether new market evidence after the first entry could justify adding exposure. For a viable signal add, check the indicator, timeframe, execution and cancellation conditions, minimum indent and its basis, order share and execution reserve.
- For each mode, show its best supported candidate or the specific obstacle. Check documented fields and actual form evidence separately. Assess protection after each fill, including partial fills, the greatest reachable exposure, compliance with shared ceilings and execution costs. Actual exposure and budget use may vary by mode.
- Select the mode and order count after comparing the candidates. When outcomes are comparable, prefer fewer execution dependencies. If a material field or behavior remains unverified, state the conditional result and the verification it depends on. Apply the existing risk and readiness gates.

## Validation / dependency
Schemas: `docs/v2/contracts/{request-context,coin-profile,strategy-proposal,bot-configuration}.schema.json`. Adapters: `docs/v2/adapters/{veles,ginarea}.md`. Domain references: `docs/platforms/configuration-contract.md` and the matching platform reference in `docs/reference/`; no actual P02 verified by this repository artifact.

## End-to-end routing

Follow the single-request workflow in `docs/v2/analytical-workflow.md`, including shared RequestContext/EvidenceRecord identity, source accessibility checks, partial-data handling, AD-009 event invalidation and downstream risk status. For source acquisition use `docs/v2/source-acquisition-policy.md`; for platform handoff use `docs/v2/bot-handoff-policy.md`. Follow the active workflow in the root `AGENTS.md`. Record source access from actual responses. If the end-to-end workflow contradicts canonical `docs/risk-management.md` or actual Veles/GinArea P02, the canonical hard-safety/platform constraints prevail.
