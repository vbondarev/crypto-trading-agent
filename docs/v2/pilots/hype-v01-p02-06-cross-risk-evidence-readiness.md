# HYPE-V01 / P02-06 — evidence readiness for Veles LONG SIMPLE / Bybit UTA Cross

**Prepared:** 2026-11-14.
**Authorization:** P02-05 accepted and P02-06 opened by user: «Согласую. Переходим.»; see `docs/v2/pilots/hype-v01-p02-05-acceptance.md`, commit `8df838d0150535f3233bce897edcd516078df433`.
**Status:** `P02_06_DOCUMENTED / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING / REAL_R3_NOT_RUN / NO_TRADE_READY`.
**Branch:** `feature/simplified-agent-v2`. This is a nontrading preparation of later evidence gates, not a financial-risk result, configuration proposal or live test.

## 1. Fixed user context versus actual verified account data

**User-attested:** selected Veles `Bybit Futures` connection is to a subaccount; Bybit UTA account margin is `Cross`, position mode is `Hedge`; available futures funds reportedly exist in USDT; Veles once displayed indicative `0 USDT` but later user reported a positive displayed balance. Exact matching account identity, timestamps and actual Equity/MMR are **NOT independently verified**.

**Previous partial Veles UI screenshots:** HYPE/USDT, LONG, order mode `Простой/SIMPLE`, `Тип маржи=Перекрестная`, `Плечо=1×`, blank deposit; existing-position-inclusion switch visually **OFF**, per user intent. These are **not** evidence of a saved/current bot, actual Bybit leverage, a live position or an accepted future grid. Previous synthetic HYPE `CUSTOM` values must never be transferred to `SIMPLE`.

No current account portfolio, price/Mark, order lists, full Equity or final bot budget was collected on this step. Historical mentions of **100 USDT or 5×** are not verified current selected Veles parameters and must not be assumed.

## 2. Repository sources consulted and hard boundaries

| Normative reference | Use |
|---|---|
| `docs/input-templates.md` | T02 entire futures account; T03 only if positions; T04 complete all bots and future IN; T06 H02/H03 optional |
| `docs/risk-management.md`, `docs/risk-validation.md` | States S0 current, S1 committed, S2 reachable fills, S3 stressed; identity/deduplication; **RV-02 Cross MMR/liquidation OPEN**, **RV-03 Short worst-loss OPEN** |
| `docs/risk-05-06-validation.md` | FR-038 **F fixed, A adaptive, H historical market Mark, R reverse** stresses; synthetic tests not live validations |
| `docs/risk-05-07-validation.md` | Missing historical H02/H03 = `NOT_CHECKED` and not sole READY blocker; **known H04 ACTIVE** vetoes new/add risk |
| `docs/data-freshness.md` (AD-009) | At later actual R3: **Mark ≤2min; complete T02 ≤5min plus explicit no material changes; InstrumentInfo ≤24h** or earlier on invalidating events |
| `docs/platforms/veles.md`, `docs/platforms/configuration-contract.md`, `docs/v2/adapters/veles.md`, `docs/v2/bot-handoff-policy.md` | Exact documented Veles SIMPLE P01/P02 labels, budget semantics, future reserves, full Cross risk, stop limits, no automatic mapping |

Public references reviewed for *background only* (not authenticated user inputs):
- Bybit UTA: https://www.bybit.com/en/help-center/article/FAQ-Unified-Trading-Account
- Bybit perpetual/Hedge/Cross: https://www.bybit.com/en/help-center/article/FAQ-USDT-Perpetual-and-Expiry-Contracts
- Bybit account-wide modes: https://www.bybit.com/en/help-center/article/Differences-Between-the-Margin-Modes-Under-the-Unified-Trading-Account
- Veles DCA editor/deposit/balance/leverage: https://help.veles.finance/ru/platform/settings/full/

## 3. Progressive minimum-data collection — do NOT ask for everything at once

### Tier A — single exposure scoping question, non-sensitive, next user turn

**«Есть ли сейчас на этом субаккаунте Bybit хотя бы одна открытая фьючерсная позиция, активная/условная заявка либо действующий/приостановленный бот Veles/GinArea? Да / Нет / Не уверен.»**

- YES ⇒ later T02 covers **all** positions (both Hedge LONG and SHORT slots), all regular/conditional/trigger orders and all bots including paused and future IN, not only HYPE.
- NO ⇒ `USER_ATTESTED_NO_EXPOSURE` but not authenticated empty scope; later full T02 is still required for real R3, with actual empty sections checked.
- UNKNOWN ⇒ `NEEDS_DATA`; provide read-only guidance later, do not assert absence.

**No balances, screenshots or secrets are needed in Tier A.** Do not turn a verbal "нет" into a real risk PASS.

### Tier B — intention/budget for possible future preliminary DRAFT, only when separately requested

- **Actual intended Veles "Депозит" in USDT** (`B_bot`), not currently populated, distinct from account Equity, exchange available margin, planned initial margin (IM) and **first IN nominal**.
- Does user *propose* keeping the visually displayed **1×**, or want another candidate leverage ≤5×? This does not prove actual Bybit setting or authorize switching it.
- Confirm LONG/SIMPLE, selected order count, coverage, martingale, offset, grid pull-up, condition filters, TP/SL and exact UI mode-specific labels/units/ranges **only with actual P02/P01 evidence**. Do not infer preset selection or use `CUSTOM` values.
- Identify genuine Bybit `category=linear; symbol=HYPEUSDT` instrument status/tickSize/qtyStep/minQty/minNotional/risk tier, when this data is needed; no concrete present values are assumed.

No executable order sizes or grid from Tier B alone.

### Tier C — full private synchronized account and instrument input for later separately authorized R3 (NOT COLLECTED NOW)

**T02 — entire applicable futures account**:
- Exact connected Bybit UTA subaccount scope (private identity check, not public repository); Cross account and Hedge position slots; `captured_at`/timezone, `observed_at` or `response_time` only when source genuinely provides them, `retrieved_at` separate.
- Actual Equity + valuation currency, quote USDT balance, available collateral, eligible asset value/haircuts and borrow, occupied/initial/maintenance margin, **account IMR/MMR** where available; account-wide risk and pending obligations.
- **All positions** for every collateral-sharing instrument and both Hedge sides, size + unit, entry, current Bybit Mark, unrealized PnL, position mode/leverage/IM/MM and liquidation display where available; **T03 only if open positions exist**.
- **All open, conditional and trigger orders**, partial fills, reduce-only, order intent/owner/status; **all Veles/GinArea bots**, running/paused/possibly live exchange orders; their **full planned and unplaced INs**. Verify page completeness and explicit emptiness where appropriate.
- Known H04/daily/HWM restrictions (including Moscow-day boundary), without requiring full private historical Equity H02/H03 where absent; H02/H03 = `NOT_CHECKED` if not reliably documented.
- Avoid double-counting actual order present both on exchange and bot page: normalize one verifiable identity or label `POSSIBLE_DUPLICATE`, not guessed match. Separate Hedge LONG and SHORT positions count as two if actually open.

**T04 — real Veles and other bot commitments**:
- `new unsaved / edit / running` editor state, exact current SIMPLE fields/values/units/conditional visibility and capture time, complete proposed IN scenario, fees/funding/slippage/buffers, all existing bots' committed/future IN and possible restart/partial-fills, exit behavior and existing-position adoption visually OFF.
- All **100% reachable future IN** are included in reserve even if not yet placed/triggered by Bybit; avoid double addition of already allocated exchange IM.
- Do not treat stop-loss trigger as guaranteed upper bound on realized loss, exchange LP or absence of slippage.

**Public market/spec/time inputs**:
- Bybit HYPEUSDT linear perpetual `Mark` (not Last/Index), official instrument rules, risk tier/fees/funding, as applicable; market OHLCV/closed bars for actual strategy; historical **market Mark** series for H stress, distinct from optional personal Equity H02/H03.
- For actual R3: **Mark ≤2min**, whole T02 **≤5min plus no material changes**, instrument rules **≤24h**, or earlier recheck when volatility, fill, positions/orders, bot settings, margin, funding, news or exchange rule events invalidate old facts. TTL alone does not prove completeness.

## 4. Future-only risk matrix; no actual PASS

| Gate | Canonical check | Current disposition |
|---|---|---|
| R00 hard veto | Known H04 ACTIVE or proven hard violation blocks **new/add risk**, even if data missing | `H04 UNKNOWN` |
| R01 leverage | **≤5×** for new/changed risk, checked against actual exchange-side setting | `VELES_VISIBLE_1X_ONLY` |
| R02 account IM | Maximum reachable aggregate IM **≤30% of current Equity**, current/committed/fill/stress states; USD/USDT units kept distinct | `NOT_EVALUABLE` |
| R03 bot worst loss | **≤5% Equity** attributable bot worst-case including credible gap/fees/funding/slippage; unbounded losses must not be invented as bounded | `NOT_EVALUABLE` |
| R04 adverse liquidation gap | **≥15% of current Bybit Mark** along relevant adverse states under verified account Cross model | `UNVERIFIED / RV-02 OPEN` |
| R05 positions | **≤3** real/reachable open positions; both actual Hedge sides are separate slots | `NOT_EVALUABLE` |
| R06 full reserve | **100% of all planned IN** + buffers across current/new bots, dedup IM actually already reserved | `NOT_EVALUABLE` |
| R07 daily/HWM | Daily loss **3% (Moscow day)** / HWM drawdown **15%**; H02/H03 missing = `NOT_CHECKED`, known H04 veto mandatory | `NOT_CHECKED / H04 UNKNOWN` |
| R08 stress | Full portfolio fixed F, adaptive A, historical market Mark H, reverse R | `NOT_RUN` |
| R09 identity/P02 | Same account, actual HYPE linear symbol, Cross/Hedge and Veles SIMPLE active field mapping | `PARTIAL USER_REPORT/SCREENSHOTS` |
| R10 final freshness | Synchronized full T02 + Mark + actual filled form; AD-009 invalidators checked | `NOT_RUN` |

**Decision precedence:** known violation => `REJECTED/NOT_RECOMMENDED` for increased risk, missing essential evidence => `NEEDS_DATA`, unprovable Cross liquidation or conflicting critical sources => `UNVERIFIED`. `READY` is forbidden here. RV-02 (real UTA Cross) and RV-03 (general Short worst bound) remain **OPEN** even after the prior synthetic stage 05 acceptance.

### Documentary negative controls (NOT live tests)

| Case | Hypothetical evidence | Required response |
|---|---|---|
| NX01 | User says no open positions; T02 not supplied | `NEEDS_DATA`, no verified empty portfolio |
| NX02 | Veles 1× and positive balance, no full T02/Mark or planned IN | `NO_TRADE_READY` |
| NX03 | H04 ACTIVE known, Mark absent | `REJECTED` new/add risk before gap checks |
| NX04 | Planned IN invisible on active exchange order list | Keep **all** future IN in reserve and stress |

The NX cases are expectations in a policy document, **not independently executed test runs**.

## 5. Privacy, isolation and next decision

The PUBLIC GitHub repository receives **only this checklist and source-tier statuses**, never actual private Equity, account IDs, screenshot binary, open positions/order IDs, past wallet data or credentials. Any later numeric source, with secrets/IDs redacted, must remain in a private conversation; request only needed account fields at the appropriate review stage.

**No actions:** no Bybit account connector or API query, Veles create/save/test/run, margin/position/leverage change, funds transfer, orders or actual risk evaluation. No `BotConfigurationProposal`, `VERIFIED_FOR_MANUAL_REVIEW` or executable grid. `P02_verified_at=null`, `field_map_version=null`.

**Completed:** tiered evidence protocol, 11 future risk gates and 4 documentary negative controls. **Not completed:** any real T02/T03/T04 collection or portfolio-risk/market validation. The user must separately accept this P02-06 result before opening a subsequent step; the next high-value Tier A question is about presence of **any** open positions/orders/bots.

`P02_06_PROTOCOL_PREPARED / USER_ACCEPTANCE_PENDING / NO_TRADE_READY / STAGE_06_NOT_STARTED / V2_NOT_ACTIVE`.
