# Veles SIMPLE conditional LONG draft review

Date: 2026-11-19. Scope: synthetic fixture and documented form fields.
Baseline: `cbd6b5360a6a1eacd818a115721b803e31df3936`.
Result: `PASS_SYNTHETIC_DRAFT_CHECK / NO_TRADE_READY`. The independent agent replay and current platform-form verification remain open.

## Case and result

Use [conditional-long-draft.v1.json](../../../tests/v2/fixtures/conditional-long-draft.v1.json), request `V2-SYN-002`, strategy `SYN-S002`, configuration `SYN-C002`. The fixture supplies a conditional `LONG` on synthetic Bybit HYPEUSDT USDT Perpetual data. For this review, set `platform_variant` to `SIMPLE` and add the four field descriptions below. The fixture's illustrative budget and leverage do not supply order values.

| Label in the historical form | Documented purpose | Unit | P01 reference |
| --- | --- | --- | --- |
| ПЕРЕКРЫТИЕ | Price range covered by the grid | % | VL-11 |
| СЕТКА ОРДЕРОВ | Number of planned orders | orders (integer) | VL-12 |
| % МАРТИНГЕЙЛА | Growth of successive order sizes | % | VL-13 |
| ОТСТУП | First-order price offset | % | VL-14 |

Each entry uses `verified_status=DOCUMENTED_ONLY`, `value=null` and `form_key_if_verified=null`. Sources: [P01 platform reference](../../platforms/veles.md), [historical P02 visual mapping](hype-v01-p02-02-visual-mapping.md), [Veles Help Center](https://help.veles.finance/ru/platform/settings/trading-mode/). The historical screenshots show the controls but do not establish their current options, limits or rounding. The price basis for the offset and the calculation of successive order sizes still require verification.

Python 3.12 assertions passed for request and strategy linkage, presence of required top-level and mapping properties, all four mapping entries with unset values, `DRAFT`, `NOT_EVALUABLE`, unset `P02_verified_at` and `field_map_version`, empty order amounts, grid steps and exits, unset price bounds, and prohibited automatic execution. Coverage is limited to these assertions and a review of the existing guard source. Full JSON Schema validation and execution of the existing guard were outside this check.

The handoff remains `DRAFT`. Current P02, current market and technical evidence, and account-level T02 and risk calculations are missing. For the latter, verify portfolio margin, worst-case loss, reserve across all potential grid executions and applicable Cross liquidation and stress checks before any manual-readiness review. Source: [bot handoff policy](../bot-handoff-policy.md).

## Remaining pilot evidence

For an independent agent replay, provide the pinned policy, synthetic inputs and a request for Veles SIMPLE. Remove the expected output sections `strategy_proposal` and `bot_configuration` from the supplied fixture and omit this review. Preserve the first raw answer and the session evidence. Check that the agent can independently produce a sourced conditional direction and an appropriately limited handoff. A WAIT result may be safe but leaves this positive branch uncovered. A current P02 review remains a separate check of the exact form, field options and units in one session.
