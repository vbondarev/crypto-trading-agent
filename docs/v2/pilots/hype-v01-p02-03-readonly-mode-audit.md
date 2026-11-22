# HYPE-V01 / P02-03 — read-only Veles/Bybit mode, leverage and freshness audit

**Opened:** 2026-11-11 (Europe/Moscow calendar date).  
**Authorization:** user explicitly replied **«Согласую»** to the proposal to proceed to P02-03 after accepting P02-02. This authorizes this **read-only next step only**; it does not approve its eventual results, any UI/account changes, Stage 06 or v2 activation.  
**Status:** `IN_PROGRESS / PREPARATION_DOCUMENTED / AWAITING_P02_03_USER_EVIDENCE / NO_RISK_PASS / USER_ACCEPTANCE_NOT_YET_REQUESTED`.  
**Branch:** `feature/simplified-agent-v2`. Baseline before this step: `6d2149b18c7f13f9dfd6c3a3e0b05341efd97566`.

## 1. Existing accepted evidence and objective

P02-01 and P02-02 (including E02/E03/E04) were separately accepted with limitations. Prior screenshots show Veles UI connection label **Bybit Futures**, HYPE/USDT selected, LONG, trading mode **Простой / SIMPLE**, unselected preset cards, unfilled grid inputs and a later screenshot of **Включать позицию на бирже в сделку** visually OFF. These are UI observations, **not** proof of saved settings, exact exchange account status or trade readiness. Previous synthetic `HYPE-V01-R02 CUSTOM` remains separate.

**Only P02-03 goal:** identify the actual selected **Veles editor and existing Bybit account modes**, **visible leverage without altering it**, and valid source/capture timing; prepare requirements for a later financial review. Do not perform R3, run bot, place trades, calculate liquidation or open Stage 06.

## 2. Read-only collection instructions (minimal evidence)

**Evidence A — Veles editor, if shown without edits:**
- A screenshot of the **same DCA / new-bot draft** displaying the exchange connection label (Bybit Futures), selected HYPE/USDT, LONG, and if visible, the **Плечо** value and **Тип маржи** (Cross/Isolated) with exact UI labels and units. One or two separate screenshots are fine when linked by user attestation.
- Distinguish `displayed_leverage` from user preference (e.g. historical max 5×). Distinguish current field value from a menu option. Do **not** select or change leverage or margin to obtain a screenshot; if not visible mark `NOT_SHOWN`.
- Confirm whether this is an **unsaved draft** or a live bot editor. If it is a live bot, no changes should be made. Also preserve inclusion-position switch OFF as a **visual** state only; do not claim persisted setting.
- Do not share actual API keys, connection IDs, UID, or third-party account details. The label `API КЛЮЧ` alone is not a secret.

**Evidence B — Bybit UTA settings, if accessible in read-only form:**
- Optional redacted screenshot/text **showing currently selected** account margin mode `Isolated / Cross / Portfolio Margin`, and position mode `One-Way / Hedge` if explicitly displayed, with **screenshot capture time and timezone**.
- Only use a **read-only status page**; do not click a margin-mode selection, position-mode selection, leverage confirmation button or an account-changing control just for evidence. Some controls may apply instantly. If actual mode cannot be seen without entering a change screen, report `NOT_SAFELY_OBSERVABLE`.
- Existing positions, other active bots, risk tiers or cross-account exposure are **not** inferred from the selected mode or the DCA editor. This step does **not** require complete private T02 or revealing wallet balances.

**Evidence C — timing and correspondence:**
- In the user message accompanying evidence, state e.g. `Скриншоты: 2026-11-11 23:xx МСК (UTC+03:00); один черновик/один субаккаунт: да/нет/не уверен; изменений после снимков: нет/да/не уверен`. This is **user-attested capture time**, not independently authenticated exchange time.
- Record `captured_at` from the user's statement, `retrieved_at` when the assistant actually receives the files and `observed_at` only if source explicitly states its own observation timestamp. Do **not** substitute chat upload/review time for screenshot capture time.
- These are one-time read-only editor observations, not a fresh live market/portfolio snapshot. A previous screenshot cannot be considered refreshed merely because it was uploaded later.

**Privacy:** redact API keys, UID, full balances, private position sizes, trade/order IDs, QR codes, emails and unrelated positions; leave visible the nonsecret labels and selected modes. **No actual user screenshot bytes or account values may be committed to the public repository**. Persist only abstract findings and hashes.

## 3. Source map and compatibility concerns

| Source | What it establishes | What it does NOT prove |
|---|---|---|
| `docs/platforms/veles.md`, VL-02/07/08/10/19 | P01 mode/leveraging semantics; potential exposure changes; `POSITION -1` adoption | User-specific current margin/leverage/position |
| `docs/v2/adapters/veles.md` + `docs/v2/bot-handoff-policy.md` | Exact selected-mode mapping and veto/NEEDS_DATA precedence | Actual P02 verified or executable configuration |
| `docs/platforms/configuration-contract.md` | P01→P02→T02/T03/T04→InstrumentInfo order; no UI-internal key invention | Any live portfolio risk PASS |
| `docs/data-freshness.md` | AD-009 task-specific freshness and invalidating events | Timestamp of old screenshot unless user provides it |
| `docs/input-templates.md` | Minimal T02/T03/T04 evidence needed **later** for risk | Need to disclose private T02 now |
| Veles official https://help.veles.finance/ru/platform/settings/full/ | DCA bot leverage and margin controls, including risk of same-symbol leverage changes | Current user editor/app version or saved values |
| Veles official https://help.veles.finance/ru/exchange/general/position-mode/ | General One-Way/Hedge and open-position restrictions | Current user's actual position mode |
| Bybit official https://www.bybit.com/ru-RU/help-center/article/Differences-Between-the-Margin-Modes-Under-the-Unified-Trading-Account | UTA account-level margin-mode semantics (Isolated/Cross/Portfolio) | Current account mode or permission to switch |
| Bybit official https://www.bybit.com/en/help-center/article/Introduction-to-Bybit-Unified-Trading-Account | UTA and account-level Cross/MMR risk | Account Equity, MMR or liquidation risk |

**Critical side effects to avoid:** Veles documentation explicitly warns that bot setup may set leverage before position lock; conflicting leverage can affect an existing position. Bybit UTA margin-mode changes are account-level, not harmless pair-specific previews. Therefore this step must never recommend changing modes or leverage to "test" them.

## 4. Expected observation fields and evidence classes

| Field | Prior evidence | P02-03 required observation | Initial status |
|---|---|---|---|
| `platform` / editor | Veles DCA UI per user-provided context | New vs existing bot editor, same session/context | `PARTIAL` |
| `exchange_binding` | `Bybit Futures` label | Current selected connection class, no key details | `PARTIAL` |
| `instrument` | `HYPE/USDT` selectors | Confirm linear USDT perpetual where shown; do not infer contract metadata | `PARTIAL` |
| `direction` | `LONG` selected | Same displayed direction in target session | `PARTIAL` |
| `strategy_mode` | `Простой / SIMPLE` selected | Same chosen editor mode | `PARTIAL` |
| `existing_position_inclusion` | Later grey/left OFF visually | OFF still displayed, no saved-state claim | `VISUAL_OFF_ONLY` |
| `veles_leverage` | Not previously shown | Exact **displayed** `Плечо` numeric x, if safe | `NOT_SHOWN` |
| `veles_margin_mode` | Not previously shown | Exact **displayed** `Тип маржи`, if safe | `NOT_SHOWN` |
| `bybit_uta_margin_mode` | No screenshot | Current account status, no switching | `NOT_VERIFIED` |
| `bybit_position_mode` | No screenshot | Current One-Way/Hedge status, no switching | `NOT_VERIFIED` |
| `capture_time/timezone` | Not supplied with earlier images | User-attested timestamp and timezone for new image(s) | `UNKNOWN` |
| `same_account/editor_session` | Earlier images not authenticated | User confirmation or explicit `UNKNOWN` | `UNKNOWN` |
| `account_risk_T02` | Not provided | **Not requested in P02-03**; separate later stage | `NOT_EVALUABLE` |

Every observed field must have `field_name`, `exact_ui_label`, `displayed_value`, `unit`, `screenshot_ref`, `capture_time_source`, `source_ref`, `verification_scope`. `verified_status=UNVERIFIED` for unobserved or not authenticated fields; P01 text is only `DOCUMENTED_ONLY`. Never infer default leverage or auto-choose Cross from past user history.

## 5. Deterministic gates, results and stop rules

- **M0 SOURCE:** Does the new screenshot/text exist and correspond to the requested Veles/Bybit display? If absent: `WAITING_FOR_EVIDENCE`.
- **M1 IDENTITY:** Confirm actual selected UI connection/pair/direction/mode. UI label `Bybit Futures` is stronger than assumption but not actual authenticated exchange account or exchange instrument metadata.
- **M2 LEVERAGE:** Clearly distinguish the **current displayed value** from allowed menu entries, an old proposal, or user's maximum (5×); missing actual field ⇒ `NOT_VERIFIED`. Known leverage >5× for *proposed new risk* ⇒ `REJECTED`, not silent normalization.
- **M3 MARGIN:** Distinguish Veles UI field from Bybit **account-level** Isolated/Cross/Portfolio, and separate margin mode from position mode One-Way/Hedge. Mismatch/conflict ⇒ `UNVERIFIED` and no automatic switch.
- **M4 TIME:** Require user-attested `captured_at` and timezone, note absence of native source timestamp. Different sessions or material configuration changes invalidate linkage, requiring bounded recheck.
- **M5 SIDE EFFECT:** Do not modify any Veles or Bybit form/position, leverage or UTA modes; do not press Save/Create/Test/Run or use secret credentials. A screenshot of a toggle is not proof of persistence.
- **M6 RISK:** Account Equity, positions, working/pending orders, grid reserve, current Mark/MMR and F/A/H/R remain `NOT_EVALUABLE` without real T02/T03/T04. Known hard H04/daily/HWM/bot-loss/IM/slots veto takes precedence over missing data.
- **M7 REPORT:** A later P02-03 report will separate `P02_03_VISUAL_PASS_WITH_LIMITATIONS`, `PARTIAL`, `INCONCLUSIVE`, or `REJECTED` where grounded, append self-review, and require **separate explicit user acceptance**. This preflight itself is not P02-03 completion.

**Freshness for a future R3, not for this documentation step:** canonical `docs/data-freshness.md` requires **Bybit Mark ≤2 minutes**, **full-account T02 ≤5 minutes** plus unchanged-state confirmation, and instrument spec ≤24 hours unless invalidated earlier. UI P02 validity depends on mode/version/state and events, not arbitrary five-minute TTL. On any fill, position, margin/leverage or bot edit, invalidate dependent snapshots immediately.

**Release boundary:** no `BotConfigurationProposal.readiness=VERIFIED_FOR_MANUAL_REVIEW`, no real trading `READY`, and no prices/order grid until separate live risk and complete P02 evidence. `P02_verified_at=null`, `field_map_version=null`, `STAGE_06_NOT_STARTED`, `V2_NOT_ACTIVE`. No change to `AGENTS.md`, legacy files/branch, Draft PR #1 or `main`.

## 6. Execution ledger

- P02-03 authorization: **RECEIVED** (user: «Согласую»).
- Relevant official/reference docs and prior accepted P02-02 evidence: **REVIEWED**.
- Actual new Veles leverage/margin screenshots: **NOT_RECEIVED**.
- Bybit account-mode screenshot: **NOT_RECEIVED** (optional for initial identity check).
- Per-field P02-03 observation and current risk calculation: **NOT_RUN**.
- P02-03 self-review of observed new settings: **PENDING_INPUT**.
- P02-03 acceptance: **NOT_REQUESTED**, requires separate user decision after actual result.
