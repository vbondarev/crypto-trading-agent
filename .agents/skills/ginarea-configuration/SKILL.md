---
name: ginarea-configuration
description: Prepare and audit user-selected GinArea PRO configurations for Bybit USDT perpetuals from verified P02 fields; validate Default/Auto/Dynamic/Indicator/DCA compatibility, IN/OUT grids, Instop, sticky Disable IN, PnL, exchange positions and strict full-portfolio risk. Do not copy Veles fields or claim live READY.
---

# GinArea Configuration — Crypto Trading Agent

## When to use

- The user **explicitly selects GinArea PRO**, a concrete strategy and Bybit USDT perpetual pair, asking for a **preliminary R2 configuration**, or a **final R3 audit** of their *actual* GinArea PRO form.
- The user needs to understand/adjust a GinArea bot's IN/OUT, multiplier and grid step, Default/Indicator availability, trading bounds, Disable IN, Instop, Pause/Close/Failed, TP/SL, funding-adjusted linked H01 net PnL, or **actual exchange** ownership/position exposure.
- Use an evidence-labelled plan, not presumed live UI access. The project's **approval of step 07.8** is not authorization to select GinArea for the user's personal trade, configure a running bot or place orders.

## When **not** to use

- The user chose Veles or has **not** chosen a platform and specific strategy. Route to strategy planning; do not silently switch from Indicator Grid to Default or choose Auto/Grid settings.
- Pure R1 education or R2 trend commentary without a bot configuration does not require private T02/P02. For R2 with missing P02: a *documentary, explicitly provisional* example is possible, **not an exact copyable PRO configuration**.
- Do **not** copy Veles-only fields `Депозит` interpreted as Veles grid budget, `% Мартингейла`, `Перекрытие изменения цены`, `POSITION -1`, `Остановить бота после N сделок`. Never claim these are verified GinArea PRO controls.
- Never ask for exchange API key secrets, execute bot UI operations, place/cancel orders, change Bybit modes or promise background monitoring/confirmed `READY` based on documentation, model flags or synthetic test output.

## Approved normative references (links relative to this Skill)

- [Project restrictions and current RV/TV blockers](../../../AGENTS.md)
- [GinArea P01: GD01–GD40, C-G01–C-G10 and lifecycle E01–E18](../../../docs/platforms/ginarea.md)
- [GinArea compatibility and 06.4 limitations](../../../docs/platform-06-04-validation.md)
- [GinArea 06.5 lifecycle validation](../../../docs/platform-06-05-validation.md)
- [Different platforms are not isomorphic: 06.6](../../../docs/platforms/configuration-contract.md)
- [Actual P01/P02 proof and account T02](../../../docs/platforms/platform-validation.md)
- [FR-047–FR-053, FR-027–FR-040](../../../docs/requirements.md)
- [Freshness R1/R2/R3, AD-009](../../../docs/data-freshness.md)
- [T01–T06: all-account T02, bot T04 and actual P02](../../../docs/input-templates.md)
- [Risk stage 05: S0–S3, Cross, Short, F/A/H/R](../../../docs/risk-management.md)
- [Stage-06 review and outstanding P02/RV/TV](../../../docs/stage-06-review.md)
- [Skills routing contract](../../../docs/stage-07-skills-contract.md)
- [Data Verification Skill — only if actually accessible](../data-verification/SKILL.md)
- [Market Analysis Skill — only if actually accessible](../market-analysis/SKILL.md)
- [Portfolio Analysis Skill — only if actually accessible](../portfolio-analysis/SKILL.md)
- [Risk Assessment Skill — only if actually accessible](../risk-assessment/SKILL.md)
- [Strategy Planning Skill — only if actually accessible](../strategy-planning/SKILL.md)

Official GinArea reference pages (not proof of personal P02 or bot state):
[Bybit UTA/Cross/One-Way/Hedge conditions](https://help.ginarea.org/connection/exchangesetup/),
[available strategy selectors](https://help.ginarea.org/ru/strategies/basicset/),
[USDT Futures families](https://help.ginarea.org/ru/strategies/usdtfut/),
[grid](https://help.ginarea.org/ru/settings/gridsettings/),
[order size/cap](https://help.ginarea.org/ru/settings/orderdetails/),
[IN/OUT](https://help.ginarea.org/ru/settings/positionset/),
[Disable IN](https://help.ginarea.org/ru/settings/disablein/),
[indicators](https://help.ginarea.org/ru/strategies/indicatorgrid/),
[Auto](https://help.ginarea.org/ru/strategies/autogrid/),
[Dynamic](https://help.ginarea.org/strategies/dynamic/),
[DCA](https://help.ginarea.org/ru/strategies/dca/),
[TP/SL](https://help.ginarea.org/ru/settings/tpslset/),
[manual exchange conflicts](https://help.ginarea.org/ru/onewaymode/),
[exchange-specific errors](https://help.ginarea.org/botmanagement/connecting-telegram/excherrors/).

## 1. Preflight: selection, real form and Bybit compatibility

Record `analysis=R2|R3; selected_platform=GinArea; plan_selected_by_user; actual_strategy=Default|Auto|Dynamic|Indicator|DCA; selected_pair; direction=Long|Short|Auto (only where supported); PRO/version; P02_form_kind=new|edit|running; P02_field_visibility/units/observed_at; account UTA; Bybit category=linear; settleCoin=USDT; margin_mode; position_mode; positionIdx; leverage; all-bot ownership; T02/T03/T04 time; actual Mark time`.

1. **GinArea selector is authoritative for its availability**: a Bybit-listed pair may be **unavailable specifically in Indicator Grid**, although Default Grid supports it. Unknown symbol, PRO entitlement, indicator, strategy or version → `NEEDS_DATA`; never auto-switch strategy or reuse parameters for a different coin.
2. Official Bybit setup requires **UTA and Cross Margin**; **One-Way for non-Default**. Only **Default Grid** is documented to allow **Hedge**. A positively confirmed `non-Default + Hedge` or `Isolated` under the published Bybit restrictions → `REJECTED` as an incompatible **new bot configuration**; a conflict between current P02/support and docs → `UNVERIFIED`, not a fabricated override. Do not silently change a live account position mode, margin or leverage.
3. For two-direction Auto/Dynamic, **virtual GinArea Long/Short IN** can coexist while Bybit One-Way holds **one net position slot or zero**. Zero net qty does not prove no open orders or virtual commitments; model both directions/owners. Hedge `positionIdx=1/2` is distinct when actually supported and confirmed.
4. **P01** is the documentary field catalog; **P02** is the user's actual current GinArea PRO form (mode, screenshots/exports, available tabs, exact labels, units, controls and value ranges); **T02** is the synchronized full Bybit account snapshot. Do not infer P02 from P01, or T02 from a GinArea bot Profit card.
5. For final `R3`: whole account T02 ≤**5 min**, actual Bybit Mark ≤**2 min** (stricter on volatility/events via AD-009), all opened/conditional/manual/bot orders and every potential IN plus actual P02. A fill, bot edit, restart, Disable IN reset, margin change, manual Bybit trade, TP or OUT invalidates earlier dependent snapshots even if within TTL.

## 2. Vetted *conditional* GinArea PRO field map (GD01–GD40)

Use **only fields visible and source-confirmed for the selected mode**. `GDxx` is an internal evidence ID, not a UI label; headings and dropdown values are not necessarily editable scalar fields.

| Evidence IDs | Documented GinArea setting/concept | Conditional rule for actual P02 |
|---|---|---|
| GD01–GD05 | `Биржа`, `Стратегия`, `Тип бота`, `Торговая пара`, `Направление торговли` | Bybit, USDT Futures, chosen pair and supported Long/Short/Auto **only where permitted** |
| GD06–GD11 | `Границы торгов`, `Шаг сетки`, `Множитель шага сетки`, `Количество ордеров`, separate long/short counts | Grid controls; Dynamic Auto side-specific step; max levels are **not** count of currently placed Bybit orders |
| GD12–GD14 | `Размер ордера`, `Макс. размер`, `Мультипликатор` | Base/USDT **per IN**, cap **per IN**, growth of successive IN, **not total bot nominal or portfolio budget** |
| GD15–GD21 | `% Режим`, `Целевой уровень прибыли`, `Мин. Стоп`, `Макс. Стоп`, `Выход по средней цене`, `Не ухудшать цену входа`, `Инстоп` | % vs absolute typed units; IN→OUT trigger and potential trailing/averaging mechanics; `Инстоп` is mode-dependent, **not Indicator Grid default** |
| GD22–GD23 | `Disable IN`, `Активация Disable IN вне границ` | New IN disabled, OUT/existing exposure remains; out-of-bounds latch **never clears merely on price re-entry** |
| GD24–GD29 | `Тейк-Профит`, `Обновление Тейк-Профита`, `Стоп-Лосс`, `Стоп-Лосс трейлинг`, `Процент от профита`, `Целевой профит` | Bot Profit or trailing financial target, **not guaranteed fill or full H01 net**; different %/USDT bases |
| GD30–GD34 | `Условия входа`, `Индикатор`, `Таймфрейм и период`, `И/ИЛИ/Не задано`, `Условия выхода` | **Only Indicator Grid** when P02 proves visibility; indicator exits can realize **loss**, don't assume profit |
| GD35–GD36 | `Start Offset (%)`, `IN Open Offset (%)` | **Only Dynamic PRO** P01 labels (EN), real RU labels/availability may differ |
| GD37–GD38 | DCA period/cycle count | **DCA source/template**, no assumption of a universal PRO edit field or grid multiplier |
| GD39–GD40 | P&L trailing `Стартовая дистанция`, `% на трейлинг` | May consume prior bot profit; require explicit selected mode/units and H01 evidence |

**Do not silently copy** GinArea's `Макс. размер` between pairs, interpret `Размер ордера` as bot deposit, use Veles `Перекрытие изменения цены` in place of `Шаг сетки`, or treat `Целевой уровень прибыли` as the required exact net profit for a full historical recovery.

## 3. Typed math: individual IN, full grid and currency

For each candidate IN, keep `amount_value; amount_unit=USDT_NOMINAL|BASE_QTY; price_unit=USDT/BASE; qtyStep; tickSize; minQty; minNotional; status=EXCHANGE_OPEN|CONDITIONAL|VIRTUAL|PLANNED|PARTIAL|FILLED|EXCHANGE_CANCELLED; orderId/owner; time; user P02 evidence`.

- Synthetic example **BASE units**: `Размер ордера=0.1 BTC`, `Мультипликатор=1.5`, `Макс. размер=0.3 BTC` yields *theoretical* successive unrounded IN `0.1, 0.15, 0.225, 0.3` BTC under a simple capped model. **This is not validated as exact GinArea execution**: actual rounding down, per-mode resets, price changes, recurrences, max count, fills and 0.3 cap all need real P02 and Bybit instrument filters.
- `Размер ордера=20 USDT` means **nominal of first IN in quote**, *not* 20 BASE units, **not** automatically wallet margin or 20% Equity. `Макс. размер=100 USDT` is **cap per IN**, not forced first IN and not capped total grid. Require compatible unit conversions before comparison.
- `Множитель шага сетки` scales **price spacing**, `Мультипликатор` scales **order size**. Price range `Шаг сетки×Количество` is an approximation, **not** an exact generated grid or liquidation distance.
- `% Режим` affects **basis/units** of OUT distances; `Целевой уровень прибыли` is a trigger offset per IN, not a proved realized PnL. `Мин. Стоп` and `Макс. Стоп` affect OUT behavior, not FR-030 maximum monetary loss.
- Convert USDT nominal to BASE only with actual price and contract; check Bybit `tickSize`, `qtyStep`, `minOrderQty`, `minNotionalValue` and max constraints in **exact decimal arithmetic**. Round quantity conservatively as documented by GinArea **down** subject to evidence, but never automatically raise an order to exchange minimum or pretend all price rounding choices are equivalent.
- The illustrative bot leverage estimate `(Размер ордера × Количество ордеров) / Депозит` is only a **fixed-identical-IN** documentary shortcut, not actual Bybit leverage or a valid forecast for multipliers, Auto opposite directions, merged Instop, repeated cycles or future margin.
- Compute potential future IN for **every reachable continuation/cycle/side**, including a larger merged `Инстоп` order and reopening after partial OUT. If infinity/horizon/finite cap cannot be demonstrated, `worst_future_margin` and strict max loss are **UNVERIFIED**, not zero.
- Full portfolio Equity and margin are **different accounting layers**. Existing filled IN belongs to current S0 after synchronized position snapshot; remaining `leavesQty` and valid planned levels to S1, possible fills to S2, adverse portfolio co-loss/cross MMR to S3. No double-counting verified `orderId`; different IDs at same price remain different obligations.

## 4. IN/OUT lifecycle, disable and account reality

- **IN** may have a price condition, generated order, partial fill and full fill at distinct times. Merely hitting the trigger is not a confirmed fill; recompute quantity/average/fees/IM after confirmation.
- **OUT**: crossing `Целевой уровень прибыли` creates the conditional next step `Мин. Стоп` / stop-profit order; it is **not** immediate proven closure. `Макс. Стоп`, `Выход по средней цене` and related trailing/combination affect real exit/fees; check exact P02 for selected strategy.
- **Инстоп** may combine several missed IN levels into a **single larger incoming order**. A cap *per ordinary IN* does not automatically prove a merged order is capped the same way. Real sequence, restart, order size and reserve must be verified; don't synthesize multiple exchange orders from one trigger.
- **Multiplier reset/re-entry** after all IN exits and reopening from partially exited grids can create **new future exposure**. Distinguish lifetime risk vs a finite scenario tree.
- **Disable IN ON**: no *new* IN from that bot; existing exchange orders/positions **are not proved cancelled**, OUT continues. The `Активация Disable IN вне границ` is **sticky**: after price returns in range, **no automatic re-enable**. Re-enabling manually requires fresh whole-portfolio risk checks (and might be blocked by insufficient margin or H04).
- **Bot Paused / Failed ≠ exchange qty=0**. Documentation describes **Pause then “Закрыть позицию”** as two separate actions; a close request is not executed closure until Bybit confirms `Filled` and residual position. Manual Bybit execution while GinArea manages the same symbol can produce mismatches / `Failed`. No auto-restart without owners/orders reconciliation.
- Auto Grid/Dynamic virtual Long and Short can **net on Bybit One-Way**; do not pretend zero net position means zero future IN/OUT risks. Model both bot-side ledgers and actual **one** exchange slot; only actual Hedge Mode holds distinct positionIdx=1/2.
- `Тейк-Профит`, its updates, `Стоп-Лосс` and P&L trailing are **bot-level financial signals**. To claim historical **H01 recovered**, include linked realized/unrealized, **all fees/funding once**, owner/execution IDs; gross bot Profit alone is insufficient. Stop trigger never proves execution price or a strict finite Short upper-loss bound.

## 5. R3 safety gates, hard veto and failure

**Final readiness requires actual selected strategy and current P02**, real GinArea availability for **that pair + strategy**, UTA/Cross/position mode evidence, current whole-account **T02/T03/T04** ≤5 min, real Bybit Mark ≤2 min (or stricter AD-009), no intervening orders/fills/edits, every active/conditional/virtual IN, and account-wide FR checks.

- FR-029 portfolio worst projected **IM ≤30% E0**; FR-030 **provable** bot worst net loss **≤5% E0** incl. fees/funding/gap/stops and cycling, FR-031 leverage ≤5×, FR-032 reliable adverse Bybit Mark-to-liquidation distance ≥15% (Cross requires full account MMR), FR-033 ≤3 current and potential real exchange position slots, FR-034 **100% reserve** for all reachable future IN + costs/buffers, FR-035/036 verified Moscow-day loss ≥3% or HWM drawdown ≥15% or H04 → **block adding risk**.
- Full FR-037/038 correlation/concentration and **four** F/A/H/R stress families using real historical Bybit Mark for H are mandatory for real R3; synthetic market paths **do not** count. Missing H02/H03 user Equity history alone remains `NOT_CHECKED`, but **known H04 hard veto** persists.
- Known incompatible Bybit mode/supported strategy, breach of margin/leverage/slots/reserve/confirmed loss block → **`REJECTED`** (new risk). Material mode conflict, unknown owner/Cross MMR/Short bound, unclear merged IN and price unit → **`UNVERIFIED`**. Missing mandatory P02/T02/Mark/selector → **`NEEDS_DATA`**. Known hard breach takes priority even if P02 also missing.
- RV-02 (Cross liquidation), RV-03 (finite Short worst loss), RV-04 (actual P02), RV-06 (real independent execution), TV-01–TV-04 and real FR-038 remain **OPEN**. This document **does not output live READY**; a synthetically passing model flag is not evidence.

## 6. Output format and manual-only handoff

For R2 give a **DOCUMENTARY / PRELIMINARY** table: `exact current GinArea label or UNKNOWN; GD evidence ID; strategy/version visibility; chosen unit; hypothetical input/NEEDS_DATA; calculation for complete IN/OUT ladder; order constraints; bot/exchange owner; S0–S3 effect; risk evidence and blocker`. If Indicator Grid is missing for this pair, **present Default Grid only as a separate option for the user's approval**, not as a silent fallback.

For R3 add exact **P02 screenshot/form labels**, selected pair in strategy selector, snapshot times, account mode, full T02/Mark, Bybit lot/tick, entire future IN & OUT lifecycle/Disable/Instop, owner reconciliation, FR-029–040 proofs, F/A/H/R real history, decision and the minimal required inputs. Treat live settings as changed after Disable/reset/fill/pause/restart; request new snapshot before final approval.

**Hard boundary:** this step creates an auditable instruction in GitHub, **not** a GinArea PRO UI plugin, not a real Bybit trading bot, not autonomous exchange access, and not a trade permit. **Current project approval status:** 07.8 and stage 07 were separately accepted by the user in documentary/synthetic scope; as of 20.10.2026 step 08.7 is implemented and pending user review. **Skill acceptance does not imply acceptance of any user's bot, live P02, trade or R3 READY.**
