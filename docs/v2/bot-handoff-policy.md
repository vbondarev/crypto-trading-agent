# v2 — strategy-to-Veles/GinArea conditional bot handoff (NOT ACTIVE)

## Gate 0: can a draft be produced?
`StrategyProposal.posture` must be LONG or SHORT, and the relevant `CoinProfile` must be based on attributable valid market and technical evidence. `WAIT` or `NOT_RECOMMENDED` produces **no numeric grid**, only rationale and data needed.

If platform `UNSELECTED`, compare Veles/GinArea briefly and request user choice. The choice of platform or of an unsupported strategy mode is **not made silently**. If numeric budget unknown, seek it before presenting precise order amounts.

## Gate 1: mapping and budget
Select *exactly one* adapter: `docs/v2/adapters/veles.md` or `docs/v2/adapters/ginarea.md`. Map a setting only with the exact mode and **P01 documented field**; label `DOCUMENTED_ONLY` until user's actual P02 is confirmed. Never fill a nonexistent field or translate a Veles field directly into a GinArea setting.

Distinguish first IN nominal amount, equity, planned initial margin, leverage, number of remaining IN orders, grid steps, fees, funding and total future reserve. Include order min quantity/precision only if actual instrument rules available. Full per-bot worst loss must be demonstrable; a proposed stop trigger cannot bound market slippage or Cross liquidation by itself.

## Gate 2: risk precedence
- **Known** H04 ACTIVE, daily loss ≥3% Moscow-day, HWM DD ≥15%, excessive planned account IM >30%, position count >3, leverage >5×, bot worst loss >5%, or insufficient total reserve => `NOT_RECOMMENDED/REJECTED` new/ADD, even if unrelated P02 fields unknown.
- Actual applicable Mark liquidation adverse gap ≥15% required for final risk validation, not the displayed Cross estimate alone.
- If full T02, current Mark, P02, Cross MMR, Short worst loss or mandatory stress evidence unavailable ⇒ `NEEDS_DATA/UNVERIFIED`; may show **safe illustrative draft only**, without fabricated exact field values or real READY.
- A reduction/close of an existing risky position is distinct from adding risk and may require separate safe handling.

## Gate 3: final output
One `BotConfigurationProposal` with `platform`, `platform_variant`, `mapping[]` (UI label/value/unit/source), `risk_checks`, `readiness`, and `manual_steps`. `VERIFIED_FOR_MANUAL_REVIEW` requires actual P01/P02 evidence, risk model PASS, no missing/not-evaluable critical items and verified mapping. This remains **manual input only**, never an automated trade.

On fill, bot edit, Stop/Pause/Disable IN, Mark/Equity change or material news, trigger AD-009 RECHECK before reusing the draft or approval.
