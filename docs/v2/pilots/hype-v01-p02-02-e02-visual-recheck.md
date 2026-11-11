# HYPE-V01 / P02-02-E02 — additional Bybit HYPE/USDT Veles UI screenshots

**Review date:** 2026-11-11 (Europe/Moscow calendar date of user upload).  
**Result:** `SUPPLEMENTAL_VISUAL_PASS_WITH_LIMITATIONS / MARKET_IDENTITY_PARTIAL / RISK_NOT_EVALUABLE / USER_ACCEPTANCE_PENDING`.  
**Evidence classification:** two more **user-provided screenshots**, read-only visual observation; no trusted UI-session trace, no API/account verification, no executing trades.

This is an **addendum** to P02-02, whose original partial mapping and self-review remain immutable and **not yet accepted by the user**. The user submitted further screenshots after a request for acceptance + an exchange/pair/direction capture; submission **does not itself constitute explicit acceptance** of P02-02. No Stage 06 or v2 activation is authorized.

## 1. Custody, scope and timestamps

| Evidence | User attachment | Pixels | Bytes | SHA-256 | Observed section |
|---|---|---|---|---|---|
| `S4` | `image(3).png` | 789×403 | 52282 | `cedb193f6cfdccb5609a31fad81dfc823fa4c43887460f8c22ebd1c6be4d7ee5` | API binding and trading direction; HYPE/USDT selectors |
| `S5` | `image(4).png` | 856×629 | 66436 | `d66da62c996d94c243a46110c83a29320e48019986b25e8170e9408359a535a9` | SIMPLE mode and three suggested grid profiles; existing position inclusion toggle |

Raw screenshot image bytes stay in the conversation and **are not committed** to the public GitHub repository. PNG metadata provides no original capture timestamp; **actual screenshot observation time/timezone, UI version, same-session attestation and verified account mode remain UNKNOWN**. Upload date is not capture time. Set `P02_verified_at=null`, `observed_at=null`, `field_map_version=null`.

## 2. What is actually visible

| ID | Screenshot | Exact visible UI | Selected/visible state | Distinction |
|---|---|---|---|---|
| E02-01 | S4 | `API КЛЮЧ`; `Bybit Futures` | Veles **connection label** selected | No API key characters or account details captured; does not independently authenticate Bybit/UTA |
| E02-02 | S4 | `ТИП ТОРГОВЛИ` LONG / SHORT | **LONG** green; SHORT grey | Trade direction, not margin mode or market identity |
| E02-03 | S4 | `HYPE` and `USDT` in `ЗАДАТЬ ПАРУ` selectors | **HYPE / USDT** selected | Market UI pair identified; exact linear contract rules, mark, instrument status still not verified |
| E02-04 | S4 | Recommended pair chip `HYPE / USDT` | Highlighted as paired with selected selectors | Popularity/recent profit claim in UI does **not** establish profitability or strategy suitability |
| E02-05 | S5 | `Простой`, `Свой`, `Сигнал` | **Простой** selected | `SIMPLE`, not `CUSTOM`; previous synthetic HYPE-V01 `CUSTOM` assumption not transferable |
| E02-06 | S5 | `Консервативный` preset | Coverage 40%; martingale 5%; order grid 20 | **Suggestion card only, no selected radio** |
| E02-07 | S5 | `Умеренный` preset | Coverage 25%; martingale 5%; order grid 15 | **Suggestion card only, no selected radio** |
| E02-08 | S5 | `Агрессивный` preset | Coverage 15%; martingale 5%; order grid 10 | **Suggestion card only, no selected radio** |
| E02-09 | S5 | `ПЕРЕКРЫТИЕ`, `СЕТКА ОРДЕРОВ`, `% МАРТИНГЕЙЛА`, `ОТСТУП`, `ПОДТЯЖКА СЕТКИ ОРДЕРОВ` | All dropdowns still show `Выберите` | Suggested presets ≠ applied/validated numerical inputs |
| E02-10 | S5 | `ЛОГАРИФМИЧЕСКОЕ РАСПРЕДЕЛЕНИЕ ЦЕН`, `ОСТАНОВИТЬ БОТА ПОСЛЕ ЗАВЕРШЕНИЯ СДЕЛОК` | Toggles appear OFF | UI appearance only; no saved state proved |
| E02-11 | S5 | `ВКЛЮЧАТЬ ПОЗИЦИЮ НА БИРЖЕ В СДЕЛКУ` | Toggle **appears ON**: orange handle at right | **HIGH SAFETY ATTENTION** — may adopt already-open position as `POSITION -1`; do not assume adoption/execution occurred |

**Documentation crosswalk:** VL-02 (connection), VL-03 (direction), VL-04 (pair), VL-10 (mode), VL-11/12/13/14/15/17 (SIMPLE controls), VL-19 (include existing position). Source `docs/platforms/veles.md` says `POSITION -1` is a *virtual inclusion of an existing exchange position*, not a new exchange order. It is not evidence that the user already has such a position or that the bot has been activated. It warrants explicit human intention and current account/ownership check **before** any bot creation/update.

**Preset warning:** 40/25/15% coverage, 5% martingale and 20/15/10 orders are **visible UI offerings**, not current configuration, risk-tested plans or recommendations. The previous synthetic `CUSTOM / Свой` cannot be called observed P02.

## 3. G0–G6 re-evaluation

| Gate | Result with S4/S5 | Remaining limits |
|---|---|---|
| G0 — provenance, same session and date | `INCONCLUSIVE` | No user-provided capture timestamp/timezone or authenticated same-editor state; images as supplied |
| G1 — platform/market/direction | `PARTIAL_VISUAL_PASS` | Bybit Futures label, HYPE/USDT selectors, LONG are visible; **exact USDT perpetual/linear, actual connection mode, account, margin/leverage not proven** |
| G2 — form labels/mode | `PARTIAL_VISUAL_PASS` | SIMPLE selected, presets visible, no preset selected and dropdowns empty; P02 concrete options/limits unverified |
| G3 — field units and sizing | `NOT_EVALUABLE` | No applied deposit, quantity, leverage, min order, current Equity or full-grid reserve |
| G4 — lifecycle / existing position | `SAFETY_WARNING` | `ВКЛЮЧАТЬ ПОЗИЦИЮ...` visually ON; must clarify intent and check account/position ownership before changes |
| G5 — portfolio risk / H04 | `NOT_EVALUABLE` | No T02/T03/T04, Mark, MMR, worst Short loss, F/A/H/R; known hard veto if separately observed prevails |
| G6 — handoff and isolation | `SAFE_NO_ACTION` | No bot creation, no order, no verified form mapping or READY |

## 4. Next safe action

1. Ask user **whether adopting an already-open exchange position is intended**; until clarified, treat `include existing position` as an **unresolved safety gate**. If not intended, ensure it is OFF **before any future save/create**, without editing a running bot or live account as part of this check.
2. For further form identity if desired: provide capture date/time with timezone and a read-only screenshot of actual editor's margin and leverage mode if it is visible. Do not reveal keys, UID, full portfolio, account identifiers or create the bot.
3. No numeric grid, TP, SL, market signal, funding, equity inference, liquidation calculation, live bot deployment or `VERIFIED_FOR_MANUAL_REVIEW` from screenshots.

**Decision:** `P02-02-E02 SUPPLEMENTAL_MAPPING_DOCUMENTED / HIGH_ATTENTION_POSITION_INCLUSION / P02_PARTIAL / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING`. A **separate self-review** follows. Both original P02-02 and this addendum await **explicit user acceptance**. Branch only: `feature/simplified-agent-v2`; legacy agent, PR #1 and main untouched; v2 inactive and Stage 06 not started.
