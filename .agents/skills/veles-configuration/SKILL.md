---
name: veles-configuration
description: Prepare and audit Veles bot settings for a user-selected Bybit USDT perpetual strategy using actual P02 form evidence, source-backed SIMPLE/CUSTOM/SIGNAL fields, IN grid, TP/SL/BE, position adoption, exchange orders and strict portfolio risk gates. Use only after Veles and strategy are selected; never treat documentation or synthetic tests as live READY.
---

# Veles Configuration — Crypto Trading Agent

## When to use

- The user **explicitly selects Veles** and a specific strategy, direction, symbol and purpose, and wants a **preliminary R2 parameter plan** or **R3 final Veles form review**.
- The user asks to **audit an existing Veles bot**, compare bot settings with the actual Bybit position/active orders, adopt an already open position, recover a linked H01 series, or safely diagnose cancellation/stop/restart.
- Do not equate the project's **approval of this Skill-development step 07.7** with approval of a personal trade or a particular Veles configuration. Ask only for the missing material information for the actual requested workflow.

## When NOT to use

- The user has **not chosen Veles** (including when comparing platforms or has chosen GinArea PRO); route instead to strategy planning. Do not insert GinArea-only fields such as `Disable IN`, `Макс. размер`, `Мультипликатор`, `Indicator Grid`, `Instop` or `Min./Max. Stop` as Veles UI fields.
- General education, R1 market commentary or a plain R2 market scenario **do not require** the private T02/P02 and do not justify a final Veles bot form.
- **Never** submit orders, toggle bots, change leverage/margin/position mode, request API secret keys, claim background monitoring, or present a P01 reference page, screenshot-free guess, backtest or synthetic PASS as live `READY`.

## Read approved source files, with paths relative to this Skill

- [Global policy, statuses and sequential user approval](../../../AGENTS.md)
- [Veles approved P01 catalogue VL-01–VL-25, 06.3 states/exits and VV01–VV34](../../../docs/platforms/veles.md)
- [Veles 06.3 validation limits](../../../docs/platform-06-03-validation.md)
- [Common but NON-equivalent platform configuration contract](../../../docs/platforms/configuration-contract.md)
- [P01 vs P02 vs T02 and proof levels](../../../docs/platforms/platform-validation.md)
- [FR-047–FR-053 and all risk requirements](../../../docs/requirements.md)
- [Live data TTL and event invalidation AD-009](../../../docs/data-freshness.md)
- [T01–T06 and real P02 capture](../../../docs/input-templates.md)
- [Risk S0–S3, Cross RV-02 / Short RV-03 and F/A/H/R](../../../docs/risk-management.md)
- [Stage 06 unverified UI/margin and final limits](../../../docs/stage-06-review.md)
- [Stage 07 route and selection contract](../../../docs/stage-07-skills-contract.md)
- [Data Verification Skill when actually available](../data-verification/SKILL.md)
- [Market Analysis Skill when actually available](../market-analysis/SKILL.md)
- [Portfolio Analysis Skill when actually available](../portfolio-analysis/SKILL.md)
- [Risk Assessment Skill when actually available](../risk-assessment/SKILL.md)
- [Strategy Planning Skill when actually available](../strategy-planning/SKILL.md)

### Official Veles P01 help — documentary sources, not proof of the user's P02

- [Full settings](https://help.veles.finance/ru/platform/settings/full/)
- [Trading mode SIMPLE / CUSTOM / SIGNAL](https://help.veles.finance/ru/platform/settings/trading-mode/)
- [Bybit position mode and locks](https://help.veles.finance/ru/exchange/general/position-mode/)
- [Take-profit](https://help.veles.finance/ru/platform/settings/take-profit/)
- [Stop-loss](https://help.veles.finance/ru/platform/settings/stop-loss/)
- [Active deal management](https://help.veles.finance/ru/platform/components/trade-management/)
- [Active deal card](https://help.veles.finance/ru/platform/components/trade-card/)
- [Bot card and lifecycle](https://help.veles.finance/ru/platform/components/bot-card/)
- [Bot errors](https://help.veles.finance/ru/platform/components/bot-errors/)
- [Min order and budget](https://help.veles.finance/ru/getting-started/pricing/minimum/)
- [Bybit V5 instrument limits](https://bybit-exchange.github.io/docs/v5/market/instrument)

These are **P01: what documentation describes**. **P02: what the user's real Veles form currently shows** is separate, and neither is proof of **T02: actual full Bybit portfolio**. An official page may change; record source URL, check time and any differences, not invented UI labels or defaults.

## 1. Gate selection, market identity, form scope and account ownership

Before drafting parameters record:

`mode=R2|R3; selected_platform=Veles; user_selected_strategy=SIMPLE|CUSTOM|SIGNAL; exchange=Bybit; category=linear; settleCoin=USDT; symbol; side=Long|Short; margin_mode; account_mode; position_mode; form_kind=new_bot|edit_bot|running_trade; surface; bot_id; position/account owner; P01_revision; P02_observed_at; T02_snapshot_at; Mark_observed_at; source/confidence`.

- **Do not mistake UI labels:** `Тип торговли` is Long/Short; `Режим торговли` is `Простой`/`Свой`/`Сигнал`; `Тип маржи` is Cross/Isolated; Hedge/One-Way is a **Bybit position-mode/account setting**, not guaranteed to be a distinct field on the Veles form.
- Confirm that the **Veles connection actually maps to Bybit USDT perpetual**, the intended symbol is **selectable in the user's Veles form**, and correct bot direction/slot and permissions are known. Bybit listing does **not** prove Veles availability.
- Confirm **live Hedge/One-Way compatibility** for the actual account; Veles help normally emphasizes Hedge, but neither help nor the bot selection proves a mode change is feasible with existing positions. Never silently change mode, leverage or Cross/Isolated; Veles may set leverage before position locks and affect another bot.
- **P02 is mandatory for R3 exact one-to-one fields, dropdown values, visibility, input units, ranges, mode-specific choices and saved values**. If P02 missing, give **R2 documentary draft only** with explicit unverified labels. Do not convert `UI?` from P01 into asserted fields.
- With an existing position, identify **Bybit account, symbol, positionIdx, side, order IDs and other/manual/Veles/GinArea owners**. Two bots are not insulated positions in One-Way. If an owner or side is uncertain, stop at `UNVERIFIED` for takeover/parallel management.

## 2. Only verified Veles settings; no imaginary form items

Use [VL-01–VL-25](../../../docs/platforms/veles.md) as the **documentary whitelist**, refining it **only** when user P02 confirms additional/current controls:

| UI concept documented in Veles P01 | Meaning / validation |
|---|---|
| `Название бота`, `API-ключ (Привязка)`, `Торговая пара` | User-readable bot alias, **pre-existing** connection selector (never reveal key), exact available Bybit pair |
| `Тип торговли`, `Режим торговли`, `Тип маржи` | Long/Short; `Простой`/`Свой`/`Сигнал`; `Изолированная`/`Кросс-маржа`, with verified compatibility |
| `Депозит`, `Плечо`, `Реинвест` | **Bot planned budget**, leverage multiplier and conditional re-invest setting. Deposit is **not** E0, account available balance, Isolated IM or hard worst-loss cap; re-invest changes reachable future budget |
| `Перекрытие изменения цены`, `Сетка ордеров (количество)`, `% Мартингейла` | SIMPLE coverage %, order count and **percent** volume-growth parameter; not GinArea step/multiplier. Exact formula/default/min/max **UI and model dependent** |
| `Отступ первого ордера`, `Логарифмическое распределение цен`, `Частичное выставление сетки`, `Подтяжка сетки ордеров` | Entry offset/market behavior; non-linear placement; physically placed limit vs future virtual orders; pull-up can cancel unfilled entry setups. Don't guess fill order/default |
| `Включать позицию на бирже в сделку` | Conditional **takeover** of a pre-existing futures position, represented by virtual **`POSITION -1`**. This is **not** a newly executed exchange IN |
| `Условия открытия сделки`, `Тейк-профит`, `Стоп-лосс` | Entry filters and exit groups; exact nested labels, indicators and options depend on current P02/strategy |
| `Остановить бота после N сделок`, `Протестировать`, `Предпросмотр`, `Создать / Обновить бота` | Stop after N *completed trades*; preview/backtest and save controls are **actions**, not risk-adjustment fields or confirmations of exchange order placement |

- `Свой` / **CUSTOM**: user-defined per-order **offset and size shares** only after units/source are shown; do not treat a stated “% volume” as USDT or assert default quantities.
- `Сигнал` / **SIGNAL**: actual indicator/entry/averaging triggers depend on current selector, timeframe and logic. A signal or “minimal offset” is not a guaranteed execution price.
- `Простой` / **SIMPLE**: coverage, order count, % Martingale, log distribution and first offset are **different independent dimensions**. The complete planned grid—not merely placed orders—must be validated in T04.
- `Депозит × Плечо` provides **only an approximate documentary planned notional**, not equity, initial margin, actual rounded exchange quantity, first order size or loss bound. Example **synthetic**: 50 USDT ×3 ≈150 USDT planned nominal; distribution, quantities, execution and full future reserve **remain unverified** until data/algorithm prove them.
- Do not invent a universal minimum deposit or order, tickSize/qtyStep/minNotional, bot order-count caps, permissible SL%, success rate or profit target. Use actual Bybit instrument and user P02 version; any rounding that changes risk requires a re-evaluation and user's consent.

## 3. IN grid, fill timing, virtual commitment and Position −1

Build `T04`: every reachable IN with `level_id; account; bot_alias; orderId if verified; symbol/positionIdx; role=IN|TP|SL|OTHER; placed/conditional/virtual/planned/filled/cancelled_confirmed; qty_base/nominal_quote; cumExecQty; leavesQty; order price vs trigger basis; timing; source; required new IM and buffers`.

1. `S0`: current **exchange-confirmed** position, Mark, Equity, aggregate IM/MM, existing orders, manual and other-bot exposure. Never replace with Veles bot "Balance" or its dashboard Profit.
2. `S1`: confirmed open/conditional IN only by **remaining `leavesQty`**, plus every not-yet-placed virtual grid level and restartable obligation. `FILLED` is **already exposure** when the synchronized S0 reflects it; `Cancelled` is no longer a future order **only with actual Bybit confirmation**, but any filled part remains real.
3. `S2`: each reachable partial/full fill, TP update, canceled/replaced order, reset/restart, minimum-size filter and future slot. Project *all* combined bots and available capital without double counting already occupied IM/order reservations.
4. `S3`: adverse market moves, slippage/partial or no fill, gap, funding, Cross collateral co-loss and liquidation before planned protective action. Do not replace verified FR-038 by made-up trajectories.
5. **`POSITION -1`** is virtual bookkeeping of an existing exchange position on takeover, **not** a real orderId, an extra exchange slot or an independently realized new entry. Existing realized losses, commission and funding **remain in H01**; new Veles averaging orders **add risk**.
6. `SIMPLE / CUSTOM / SIGNAL` behavior differs. A SIMPLE partial-placement setting does not reduce the **full reserve** required for reachable future levels; SIGNAL averaging may not be fixed priced or pre-placed.
7. The user-visible “grid simulation” or preview is **not** a confirmed exchange order. Take current contract filters from Bybit, and independently verify filled/remaining orders, price ticks, qtyStep, notional and risk of rejected orders.

## 4. TP, stop-loss, break-even and execution are distinct

- **Simple TP:** P01 describes a Limit profit target **relative to average entry**; after averaging the previous TP can be cancelled/replaced with updated price/qty. Until actual exchange IDs and statuses are checked, old and new commitments may be in flight. A bot setting of `Профит %` is **not** guaranteed realized net PnL, ROE or user H01 recovery.
- **Custom TP / multi-TP:** successive partial exits with order-specific **offset % / volume %** of position, plus conditional BE stop after the first TP in applicable multi-TP configurations; first partial TP and cancellation of remaining grid **must be confirmed**, not assumed. A "break-even" stop can still produce **negative net** after fees/funding/slippage.
- **Signal TP:** depends on actual indicator trigger and P02 field `Минимальный P&L` where applicable. The signal may not fill at the example threshold; do not make it a guaranteed cash target.
- **Ordinary percent SL:** official Veles docs describe its trigger/market behavior **only after the last grid IN fills**. On Bybit futures a trigger order is placed by the bot only when the last grid order has executed; before that, an ordinary Veles percent SL **is not proven present on the exchange**. Liquidity/margin shocks can cause liquidation **before** this event.
- **Signal SL:** separate mechanism with a **minimum offset measured from last IN or average position**, depending on selected P02. With "last order" basis, it waits for full grid; with "average price" basis, it **may act earlier**. Simple and signal SL may coexist; the first applicable can trigger, but **neither guarantees final execution price**.
- **TP trailing:** Veles help's reviewed list for the TP trailing function did **not explicitly list Bybit**. For Bybit mark as `NOT_VERIFIED` until the current P02/official support proves it; do not assert universal “never available”, and do not invent a Bybit trailing field.
- Trigger, exchange-accepted order, execution and final position closure are **four separate events**. A market order may slip or only partially fill; a stop-limit can remain unfilled. **Neither percent SL nor regular stop market alone establishes bounded worst Short-loss RV-03**, nor does a Cross displayed `liqPrice` establish RV-02.
- Manual TP/SL placed on Bybit can conflict with Veles order ownership and lead to error/restart; confirm actual order IDs/position and do not recommend simultaneous management with unknown `owner`.

## 5. Lifecycle gates: STOP ≠ CANCEL ≠ CLOSE ≠ RESTART

| User-visible command/state | Documented intended effect | Required exchange reality check |
|---|---|---|
| **`Остановить`** Veles bot | If active trade, can enter **`Ожидает остановки`** until the current trade finishes | Position, TP/SL and IN orders may remain live |
| **`Отменить сделку`** | Bot cancels its unfilled orders and stops managing trade | **Futures position remains OPEN**; inspect Bybit orders and actual position. Do not declare a zero-position, realized loss or canceled order before confirmation |
| **`Закрыть по рынку`** | Bot attempts to exit at market, finalize PnL and remove remaining bot orders | Verify exchange **Filled/PartiallyFilled** and final position size; a click/intention is not proved execution |
| **`Ошибка`** / stop after error | Bot does not manage trade reliably; manual exchange position/order may persist | Inspect T02/T03/T04, determine whether there is liquidation/manual change/unknown owner |
| **`Перезапустить сделку`** | Veles documentation limits eligibility (including a reported 14-day cutoff and disallowed errors), potentially resumes/recreates orders | Do not assume restart is offered or safe; refresh snapshot and run full S0–S3 risk incl. new IN and bot ownership |
| **Manual exchange fill / stop** | Bybit account state changes without Veles coordination | Invalidate previous snapshot/risk; reconcile order IDs, owned bot and positions before any future setup |

Editing a bot's **next-trade editor** is not proof that the **current active deal** now uses changed TP/IN/SL. Stop/Cancel/Close labels are **not interchangeable**. If bot UI says "active deal" but exchange position is missing, the Veles help cautions against allowing new unintended orders; recommend **verification and manual investigation**, not automatic restart/submit.

## 6. Full risk gate (never silently bypass the adopted contract)

For actual R3 **recheck** fresh T02 ≤5 minutes and Bybit Mark ≤2 minutes (or stricter per AD-009), no intervening fills/account events, **current P02** of the right form/version, selected strategy, supported pair, Bybit instrument filters, valid order/tick/qty values, all bots/positions and H01 where recovery is claimed.

Strict limits for **all** reachable new and ongoing exposures:

- **FR-029:** worst portfolio aggregate IM ≤30% of current full Equity, no double counting baseline vs next order IM.
- **FR-030:** bot's **verified total worst-case net loss bound ≤5% Equity**, including partial/non-fill, funding, fees, all IN and exit uncertainty. An ordinary Short stop and guessed slippage **do not prove** the bound.
- **FR-031:** leverage ≤5×.
- **FR-032:** reliable adverse Mark-to-liquidation distance ≥15%, **Cross account-level MMR required**, not one estimated displayed position `liqPrice`.
- **FR-033:** ≤3 **potential exchange position slots**; include future IN on different symbols/hedge sides, not virtual bots as separate slots.
- **FR-034:** **100% future averaging IM + verified costs and slippage/funding buffers** available for all reachable levels, even if not currently placed.
- **FR-035/036:** confirmed daily loss ≥3% (Moscow 00:00) or historical adjusted HWM drawdown ≥15%, or active H04 → **no NEW/ADD/restart raising risk**. Missing H02/H03 is `NOT_CHECKED`, not automatic rejection; known H04 is binding.
- **FR-037/038/040:** portfolio-wide concentration and all **F/A/H/R** mandatory family stresses with real history Bybit Mark for H (if R3); absent real history or model → no final `READY`.

**Decision precedence:** proven hard breach → `REJECTED`; material source/model conflicts (unknown Cross MMR, strict Short upper loss, conflicting order ownership) → `UNVERIFIED`; missing mandatory current P02/T02/Mark/selector values → `NEEDS_DATA`. A confirmed violation takes precedence over missing data. Only independently verified *complete* R3 could consider `READY`; in the current repository RV-02/RV-03, RV-04/RV-06, TV-01–TV-04 and real FR-038 remain open.

## 7. Required output, without pretending to control Veles

For **R2 draft**: provide an explicit `DOCUMENTARY / PRELIMINARY` header and a table of `actual P02 label (or UNKNOWN); proposed value or NEEDS_DATA; unit; source and observation time; mode-dependent visibility; calculation and assumptions; effect on S0–S3; risk gate / blocker`. Never fill undocumented defaults or promise account access.

For **R3 final check**, in addition require `P02 scope/version + selected-by-user platform/strategy; all quoted values from actual UI; supported pair/mode; T02 full account and synchronized orders; real Mark; exact Bybit filters; complete 100% grid/reachable states; TP/SL timing; risk table FR-029–040; F/A/H/R real evidence; final status and minimal required corrections`. No secret keys or private account identifiers in public GitHub.

If the user asks for **adopting a loss-making position**: show original net H01, `POSITION -1` at most once, all future Veles IN, positive/negative scenarios, manual WAIT/REDUCE/CLOSE options, and veto any H04-violating addition. Neither a positive bot Profit nor virtual BE stop means the linked series recovered.

**Hard boundary:** a GitHub file or synthetic test cannot actually create/activate or auto-install this Skill in ChatGPT, cannot authorize a trade, and cannot assert a real Veles P02, live Bybit risk or independent execution. **07.7 remains a documentation/testing deliverable until user approves it; 07.8 is not authorized.**
