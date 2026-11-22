# HYPE-V01 / P02-02 — evidence-based visual mapping of three Veles editor screenshots

**Evaluation date:** 2026-11-11 (Europe/Moscow calendar date).  
**State:** `PARTIAL_VISUAL_OBSERVATION / USER_SCREENSHOTS_UNVERIFIED_AS_CURRENT_HYPE_FORM / P02_VERIFICATION_INCONCLUSIVE / RISK_NOT_EVALUABLE / USER_ACCEPTANCE_PENDING`.  
**Read-only:** the user supplied three PNG screenshots; there was **no Veles login, no exchange/API call, no GUI interaction, no bot creation or order**. This is not a trade recommendation or complete P02 verification.

## 1. Evidence custody and what the images do not establish

The three uploaded images were directly inspected as screenshots. Raw bytes were **not** written to public GitHub.

| Evidence | In-chat filename | Resolution | File bytes | SHA-256 | Visible scope |
|---|---|---:|---:|---|---|
| `S1` | `image.png` | 863×679 | 57,438 | `8a5742125365f26c717c40d8bc58bd7564c1e4137e6338ca3d4402eb3446f9c9` | Wizard, trading pair, deposit, entry conditions |
| `S2` | `image(1).png` | 733×521 | 43,039 | `07709a93282eec8cb0b7883f0bd47ec540ee3d2d9b5ac24f7f1ffdb1227a101f` | Orders / trading mode SIMPLE |
| `S3` | `image(2).png` | 623×435 | 36,306 | `9f5f34429ff6d2fa60a94fea7dcd0031d66fffa7a1cd7a8288490ebe97bd9498` | Exit, take-profit and stop-loss toggles |

Screenshot creation/observation time, timezone, same-session lineage, login identity, Veles UI build and actual selected Bybit/API connection **not supplied**. PNG metadata contained **no EXIF**. Date of upload/evaluation is **not** screenshot observation time. Screenshot filenames/hash attest only bytes received, not that the session is live, that the UI was successfully saved or that it is the actual user's current HYPE bot. Keep `observed_at=null`, `P02_verified_at=null`, `field_map_version=null`.

The requested **Veles DCA** context is from the user/project, while the screenshots themselves show a compatible wizard and its categories but no explicit product branding `DCA` or authenticated exchange/account identity. No basis to claim screenshots are all one verified session; their visual grouping is plausible only.

## 2. Exact visual observations (screenshots are primary source, not P01 documentation)

Status `VISUALLY_OBSERVED` means only the label and depicted UI state are visible. It is **not** a schema-level `verified_status=VERIFIED`, since market/session identity and timestamp are missing. `PLACEHOLDER` does not mean a configured value, and grey/off state does not prove live exchange behavior.

| Ref | Visible UI label | Visual state / selected value | Unit actually visible | Source |
|---|---|---|---|---|
| UI-01 | `Торговая пара` | Two `МОНЕТА` placeholder selectors; no chosen HYPEUSDT | None shown | S1 |
| UI-02 | `Депозит` | Input `Введите сумму депозита`; **empty** | Not displayed for input | S1 |
| UI-03 | `Баланс на бирже` | Indicative display **0** | Not displayed; **not verified Equity** | S1 |
| UI-04 | `РЕИНВЕСТ` | Toggle appears **off** | Boolean UI | S1 |
| UI-05 | `Условия открытия сделки` | Section expanded; `Гибкие индикаторы` card and `Включить` button; `Добавить фильтр` and visually grey `Рассчитать` buttons; no configured rule shown | None | S1 |
| UI-06 | `Режим торговли` | Tabs `Простой`, `Свой`, `Сигнал`; **Простой** selected by underline | Enum `SIMPLE` visually | S2 |
| UI-07 | `ПЕРЕКРЫТИЕ` | Dropdown placeholder `Выберите` | Not printed in screenshot; P01 describes percent | S2 |
| UI-08 | `СЕТКА ОРДЕРОВ` | Dropdown placeholder `Выберите` | Not printed in screenshot; P01 describes count | S2 |
| UI-09 | `% МАРТИНГЕЙЛА` | Dropdown placeholder `Выберите` | `%` in label | S2 |
| UI-10 | `ОТСТУП` | Dropdown placeholder `Выберите` | Not printed in screenshot | S2 |
| UI-11 | `ЛОГАРИФМИЧЕСКОЕ РАСПРЕДЕЛЕНИЕ ЦЕН` | Toggle appears **off** | Boolean UI | S2 |
| UI-12 | `ПОДТЯЖКА СЕТКИ ОРДЕРОВ` | Dropdown placeholder `Выберите` | Not printed in screenshot | S2 |
| UI-13 | `ОСТАНОВИТЬ БОТА ПОСЛЕ ЗАВЕРШЕНИЯ СДЕЛОК` | Toggle appears **off**; no number selected | Boolean UI | S2 |
| UI-14 | `Тейк-профит` | Tabs `Простой`, `Свой`, `Сигнал`; **Простой** selected | Enum `SIMPLE` visually | S3 |
| UI-15 | `ПРОФИТ` | Dropdown placeholder `Выберите`; no target | Not printed in screenshot | S3 |
| UI-16 | `ВАЛЮТА ПРОФИТА` | `МОНЕТА` placeholder/label, not proof of selected settlement coin | No actual asset selected | S3 |
| UI-17 | `СТОП-ЛОСС` | Toggle appears **off**; no SL rule displayed | Boolean UI | S3 |
| UI-18 | `СТОП-ЛОСС ПО СИГНАЛУ` | Toggle appears **off** | Boolean UI | S3 |
| UI-19 | `ОСТАНОВИТЬ БОТА ПОСЛЕ ИСПОЛНЕНИЯ СТОП-ЛОССА` | Toggle appears **off** | Boolean UI | S3 |

S1 wizard progress header also visibly lists `Название`, `API`, `Пара`, `Депозит`, `Фильтры`, `Ордера`, `Выход из сделки`. This shows **section names**, not verified completed API/market setup. No final “Создать/Обновить” action is visible in these images.

## 3. P01-to-screenshot mapping and material deviations

P01 source `docs/platforms/veles.md` was previously created from published Veles documentation. Official pages https://help.veles.finance/ru/platform/settings/full/ and https://help.veles.finance/ru/platform/settings/trading-mode/ were also accessible during this review (2026-11-11). Published help does not authenticate any of the three private screenshots.

| P01 catalog | Candidate UI match | Observational result and restraint |
|---|---|---|
| VL-04, VL-05, VL-06, VL-09 | Trading pair, deposit, indicative balance, reinvest | `S1` confirms matching labels/UI only; HYPE/Bybit, real amount and Equity not established |
| VL-10 | `Простой/Свой/Сигнал` | `S2` **Simple selected**; v2 HYPE-V01 `CUSTOM/Свой` was hypothetical, **not** a real P02 Custom selection |
| VL-11, VL-12, VL-13, VL-14 | `ПЕРЕКРЫТИЕ`, `СЕТКА ОРДЕРОВ`, `% МАРТИНГЕЙЛА`, `ОТСТУП` | Simple-mode controls visible, **all unconfigured**. `ОТСТУП` not proven equivalent to every P01 “Отступ первого ордера” semantic detail |
| VL-15, VL-17, VL-18 | Log distribution / pull-up / stop after deals | Toggle/dropdown visibly exists; no real default, threshold or saved behavior inferred |
| VL-20 | `Условия открытия сделки` | Entry filter affordances visible, no actual indicator/conditions tested; `Гибкие индикаторы` card not activated in visible state |
| VL-21, VL-22 | TP Simple/Custom/Signal, SL | `S3` shows Simple TP selected but target unset; both SL toggles appear off. This does **not** establish a capped loss or exchange SL state |
| VL-07, VL-08, VL-19 | Leverage, Cross/Isolated, `POSITION -1` | **Not shown**; must not be invented |
| VL-16, VL-23–25 | Partial placement, backtest, preview, save/create | **Not shown**; do not infer existence of active orders or execution |

**Key correction:** the actual observed order mode is `SIMPLE`. The previously synthetic `HYPE-V01-R02` `CUSTOM` mapping cannot be promoted to “P02 verified”. There is no demonstrated `CUSTOM` per-order row, no confirmed percentage denominator, and no executable grid.

## 4. Required per-field machine mapping boundary

For every UI-01..UI-19 observational record the following **common** fields apply:
- `screenshot_ref=S1|S2|S3` from table; `source_ref=user_supplied_screenshot:<ref>`;
- `observed_at=null`; `form_key_if_verified=null`; `field_map_version=null`;
- `verified_status=UNVERIFIED` **in the normative v2 BotConfigurationProposal enum** until user-confirmed editor/session/market identity exists. `VISUALLY_OBSERVED` in §2 is a separate analyst-only display state and must **not** be serialized as schema enum;
- `ui_label`, `observed_value`, `unit`, `visible_selected_mode` are represented by the row label/state/unit and screenshot context; for S1 selected mode remains unknown, S2 order mode SIMPLE, S3 TP mode SIMPLE;
- P01-only inferred range/semantic details are `DOCUMENTED_ONLY`, not additional observed fields.

No full `BotConfigurationProposal` is emitted: trade identity and selected portfolio/platform parameters are absent, so a complete risk-screen result would be misleading. No previous synthetic `LONG` decision is carried forward.

## 5. P02-02 gates (G0–G6), evaluated conservatively

| Gate | Verdict | Why |
|---|---|---|
| G0 provenance/coherent session | `INCONCLUSIVE` | Three distinct images and hashes received, but no capture time/timezone or same-session proof |
| G1 DCA/Bybit/HYPE identity | `INCONCLUSIVE` | DCA from context and structurally matching wizard; exchange binding, symbol, direction, leverage, margin/position modes not visible |
| G2 field-level P02 | `PARTIAL_VISUAL_PASS` | **19** visible UI items mapped to 3 screenshot refs; no configured field ranges/options observed |
| G3 units/margin distinction | `PASS_FOR_RESTRAINT_ONLY` | No unsupported values: 0 indicative balance ≠ Equity, deposit empty, unshown units not guessed |
| G4 entry/exit semantics | `PARTIAL_VISUAL_PASS` | Filters/TP/SL labels and off/empty states visible, behavior and actual stops not verified |
| G5 account risk | `NOT_EVALUABLE` | No T02/T03/T04, Equity, Mark/MMR, loss bound, H04 status or F/A/H/R; any **known** veto would take priority |
| G6 readiness & custody | `SAFE_NON_ACTIONABLE` | No secrets in the committed report, no UI or bot operation; no READY or `VERIFIED_FOR_MANUAL_REVIEW` |

**Result:** `P02_02_PARTIAL_VISUAL_MAPPING / P02_IDENTITY_AND_PROVENANCE_INCONCLUSIVE / ACCOUNT_RISK_NOT_EVALUABLE / NO_TRADE_READY`. This is a **completed partial observational report**, not completed verified P02 mapping. The next evidence intake needs an explicit acceptance of this limited result and a separate read-only confirmation of real selected market/mode.

## 6. Minimum safe follow-up, no button presses

Request one additional **redacted** capture that visibly shows Veles DCA, selected existing **Bybit USDT perpetual** connection (no keys), `HYPEUSDT` selected, actual `Long/Short` and chosen mode, plus the local capture timestamp/timezone. The platform may not show all at once; two adjacent section screenshots are acceptable if user attests same editor session. No changes, no bot save, no trading. Optional: a view with leverage and margin mode **if already exposed without modifying the account**.

A later separate account risk check is still required even if such screenshot confirms the form. Do **not** publish private user screenshot bytes in the public GitHub repository.

## 7. Isolation, review and acceptance

- Work restricted to `feature/simplified-agent-v2`; `main`, `feature/initial-agent-mvp`, legacy Skills/agent, `AGENTS.md`, prior HYPE originals and Draft PR #1 must remain untouched.
- `Stage 06 NOT_STARTED`, `v2 NOT_ACTIVE`, no real `READY`, no new/ADD exposure.
- This file records observations only. A separate self-review and **separate user acceptance** must precede any further stage or claims of completeness.
