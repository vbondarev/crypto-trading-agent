# HYPE-V01 / P02-02-E04 — user screenshot of existing-position toggle OFF

**Recorded:** 2026-11-11 (Europe/Moscow calendar date of review).  
**Decision:** `VISUAL_OFF_CONFIRMED / NO_SAVED_STATE_PROOF / P02_02_ACCEPTANCE_PENDING / V2_INACTIVE`.  
**Branch:** `feature/simplified-agent-v2`. **Scope:** read-only evidence addendum to P02-02; not a final Bybit/Veles trading configuration.

## 1. Input provenance and visual observations

| Item | Evidence |
|---|---|
| Label | `S6` |
| In-chat upload | `image(5).png` (user-supplied screenshot) |
| Resolution | `853×652` pixels |
| Uploaded bytes | `65817` |
| Uploaded SHA-256 | `049daeaf47f14ff61c0e3a10b5d651fd2844286f579ede20a06a0a992ea337fc` |
| PNG EXIF | No EXIF information found |
| Actual capture date/time/timezone | `UNKNOWN` (upload/review date is not necessarily capture time) |
| Raw private image in repository | `NOT_UPLOADED` |

S6 shows the **`Простой` / SIMPLE** order mode selected. The `Консервативный`, `Умеренный`, and `Агрессивный` preset cards remain visible with **no apparent selected radio**. The `ПЕРЕКРЫТИЕ`, `СЕТКА ОРДЕРОВ`, `% МАРТИНГЕЙЛА`, `ОТСТУП` and `ПОДТЯЖКА СЕТКИ ОРДЕРОВ` dropdowns still display `Выберите`.

The target label **`ВКЛЮЧАТЬ ПОЗИЦИЮ НА БИРЖЕ В СДЕЛКУ`** has a **grey track and a light handle on the left**, visually consistent with **OFF**. The nearby **`ОСТАНОВИТЬ БОТА ПОСЛЕ ЗАВЕРШЕНИЯ СДЕЛОК`** and **`ЛОГАРИФМИЧЕСКОЕ РАСПРЕДЕЛЕНИЕ ЦЕН`** toggles also visually appear OFF.

**S5 -> S6 correction:** Previous screenshot `S5` (P02-02-E02) showed inclusion switch **ON-appearing** (orange/right). The user later explicitly stated **«Нет, не намеренно»** (P02-02-E03) about inclusion of a pre-existing position. Now S6 shows that specific control **OFF-appearing**. This provides visual evidence consistent with the user's intent; it **does not** independently prove that S5 and S6 represent the same authenticated editor session, a saved bot configuration, exchange state or change to a running bot.

## 2. Updated narrow P02-02 safety gate

| Gate | Status | Rationale |
|---|---|---|
| E03 user intention | `CONFIRMED_NO_ADOPTION_INTENT` | User explicitly stated it was not intentional |
| E04 target UI control | `VISUAL_OFF_CONFIRMED` | Grey/left switch in S6; screenshot observation only |
| Current saved bot state | `NOT_VERIFIED` | No evidence of save/create action or persisted form |
| Current Bybit position / ownership | `NOT_CHECKED` | Screen does not show actual exchange positions |
| G0 screenshot time & same session | `INCONCLUSIVE` | Capture time/timezone and authenticated session trace absent |
| G1 market/account identity | `PARTIAL_VISUAL_PASS` **from earlier S4** | Bybit Futures label, HYPE/USDT selectors and LONG were visible earlier, but not in S6 |
| G2 displayed mode / controls | `PARTIAL_VISUAL_PASS` | SIMPLE labels visible; no applied numeric dropdown settings |
| G3 budget, quantity, reserve | `NOT_EVALUABLE` | Not displayed/calculated |
| G4 position-inclusion safety | `VISUAL_CONTROL_OFF` | Previously flagged ON-appearing control is now OFF-appearing; execution behavior not tested |
| G5 risk / portfolio | `NOT_EVALUABLE` | No current T02/T03/T04, Equity, Mark, IM/MMR, H04 status or F/A/H/R stress |
| G6 operational readiness | `NO_TRADE_READY` | No account-level/financial verification or bot action |

## 3. Scope and follow-up

1. Do not press `Создать`, `Обновить`, `Сохранить`, `Протестировать` or `Запустить` to satisfy this visual validation. No live account or position change is claimed.
2. Do not transfer numeric settings from suggested SIMPLE presets or synthetic `HYPE-V01 CUSTOM` into actual grid, TP/SL or risk calculations.
3. The P02-02 screenshots, mappings and all self-reviews remain **awaiting separate user acceptance**. The additional screenshot is not itself an approval.
4. Missing capture timestamp/timezone, authenticated market/account and risk state still block `VERIFIED_FOR_MANUAL_REVIEW` and any trade. `P02_verified_at=null`, `field_map_version=null` remain the correct state.
5. Raw screenshot is private conversation evidence only, with a cryptographic checksum in GitHub; no secrets or original screenshot bytes committed.

**Outcome:** `P02_02_E04_VISIBLE_OFF_CORRECTION / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING / STAGE_06_NOT_STARTED / V2_NOT_ACTIVE`. Only an addendum to P02-02 is authorized, with its own self-review. Original pilot evidence, legacy agent, PR #1 and main are unchanged.
