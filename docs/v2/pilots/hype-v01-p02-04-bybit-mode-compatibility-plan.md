# HYPE-V01 / P02-04 — Bybit mode compatibility evidence check (READ-ONLY, NO EXECUTION)

**Prepared:** 2026-11-12.  
**Status:** `PREPARED / IN_PROGRESS / AWAITING_SELECTED_BYBIT_MODE_VALUES / V2_INACTIVE / STAGE_06_NOT_STARTED`.  
**Authorization:** user instruction «Там эти настройки есть. Подтверждаю. Следующий шаг.»; P02-03 partial evidence transition recorded at `docs/v2/pilots/hype-v01-p02-03-acceptance-with-open-items.md`. This is not P02-04 completion or acceptance.

## 1. Goal and fixed source boundaries

**Purpose:** check whether the **currently selected** Bybit UTA margin mode and HYPEUSDT position mode are compatible with observed Veles draft settings, strictly as a **read-only documentary/visual review**. Do not select, apply, change, save, create, backtest or run any setting, bot or order to obtain evidence.

Grounded Veles observations, **not** authenticated account state:
- `Bybit Futures` connection label, `HYPE/USDT` pair, `LONG`, `Простой / SIMPLE` in previously supplied screenshots;
- existing-position inclusion switch visibly OFF in last observed screenshot, not proof of persisted bot state;
- draft Veles **Плечо=1×** and **Тип маржи=Перекрестная/Cross** in screenshot S7;
- Veles indicative balance **0 USDT** and insufficient-funds banner do **not** prove actual Bybit Equity or balance of subaccount;
- actual screenshot capture timestamp/session provenance is missing. Prior `HYPE-V01-R02 CUSTOM` was a separate synthetic-only test and not the selected live SIMPLE mode.

**Sources read:**
- Project: `docs/platforms/veles.md`, `docs/platforms/configuration-contract.md`, `docs/input-templates.md`, `docs/data-freshness.md`, `docs/v2/adapters/veles.md`, `docs/v2/bot-handoff-policy.md`.
- Official Bybit position modes: https://www.bybit.com/en/help-center/article/Difference-Between-Position-Modes-One-Way-Mode-and-Hedge-Mode (One-Way vs Hedge and per-contract constraints).
- Official Bybit UTA margin modes: https://www.bybit.com/ru-RU/help-center/article/Differences-Between-the-Margin-Modes-Under-the-Unified-Trading-Account (account-wide Isolated / Cross / Portfolio; dated update 2026-08-04 in retrieved page).
- Official Bybit trade preferences: https://www.bybit.com/en/help-center/article/How-to-activate-deactivate-trade-option-settings (margin and position mode are distinct).
- Official Veles modes: https://help.veles.finance/ru/exchange/general/position-mode/ (Veles futures bot restrictions and Hedge use).
- Official Veles settings: https://help.veles.finance/ru/platform/settings/full/ (leverage and account-mode side effects).

Documentation from the internet **is not proof of user's actual settings**, and available options are not necessarily selected. Bybit UTA margin-mode switches may apply to **the entire account**; Veles warns about leverage changes even before position blocking, so no changes during this test.

## 2. Minimal user-supplied observation (no form, no keys, no account balances)

We already know that the relevant settings **exist** in the user's Bybit interface. The next request is for the **actually selected values**:

- `Bybit margin mode = Cross | Isolated | Portfolio | NOT_SAFELY_OBSERVABLE`;
- `Bybit HYPEUSDT position mode = One-Way | Hedge | NOT_SAFELY_OBSERVABLE`;
- `captured_at = YYYY-MM-DD HH:MM timezone`, when user observed the settings;
- `same_subaccount_as_veles_connection = YES | NO | UNKNOWN`, if user can attest without exposing identifiers.

Accept either an explicit **text statement** of current values or a **redacted read-only screenshot** that shows which selection is active. Do not demand both. No UID/API keys, email, balances, positions, account identifiers or private screenshot upload to public GitHub. If the mode cannot be read without entering a change dialog or touching a live account control, report `NOT_SAFELY_OBSERVABLE` and stop. Never infer the position mode from default values or prior accounts.

If no actual selected values are provided, log `MARGIN_MODE_UNKNOWN / POSITION_MODE_UNKNOWN / WAITING_FOR_EVIDENCE` and do **not** claim a compatible trading setup.

## 3. Evidence contract

| Field | Value before actual selected-mode evidence | Provenance |
|---|---|---|
| `veles_target` | `HYPE/USDT LONG SIMPLE` (prior screenshots) | `USER_SUPPLIED_SCREENSHOT / PARTIAL` |
| `veles_leverage_display` | `1×` (S7) | `USER_SUPPLIED_SCREENSHOT / NOT_SAVED_VERIFIED` |
| `veles_margin_display` | `Cross` (S7) | `USER_SUPPLIED_SCREENSHOT / NOT_SAVED_VERIFIED` |
| `bybit_uta_margin_selected` | `UNKNOWN` | No selected-mode evidence |
| `bybit_position_mode_selected` | `UNKNOWN` | No selected-mode evidence |
| `account_match_proven` | `UNKNOWN` | Veles connection label is not subaccount authentication |
| `captured_at` | `UNKNOWN` | No user-attested observation date/time |
| `actual_equity/mark/MMR/T02` | `NOT_REQUESTED / NOT_EVALUABLE` | Separate later financial review |
| `P02_verified_at` and `field_map_version` | `null` / `null` | Only visual and partial form evidence, not R3 risk-ready |
| `bot_readiness` | `NEEDS_DATA` | Incomplete modes and risk checks |

A subsequently supplied user-attested time **does not independently authenticate exchange measurement time**. Record source type `USER_ATTESTED` separately from verified API/Bybit source.

## 4. Conditional decision matrix — SYNTHETIC EXPECTATIONS, NOT OBSERVED ACCOUNT RESULTS

Hard known safety violation (e.g. H04 ACTIVE or proposed leverage >5×) **precedes** missing account data and rejects new/add risk. Otherwise use the following bounded **compatibility assessment only**. A UI compatibility signal is never an account-level risk PASS.

| Case | Hypothetical Bybit UTA margin | Hypothetical Bybit HYPE position mode | Veles observed draft | Expected disposition |
|---|---|---|---|---|
| C01 | UNKNOWN | UNKNOWN | Cross 1× SIMPLE | `NEEDS_DATA` both actual modes |
| C02 | Cross | UNKNOWN | Cross 1× SIMPLE | `PARTIAL_MODE_MATCH`; position-mode still missing |
| C03 | UNKNOWN | Hedge | Cross 1× SIMPLE | `PARTIAL_MODE_MATCH`; account margin still missing |
| C04 | Cross | Hedge | Cross 1× SIMPLE | `CONDITIONAL_MODE_ALIGNMENT`; **not** runtime/P02/risk ready |
| C05 | Cross | One-Way | Cross 1× SIMPLE | `VELES_COMPATIBILITY_UNVERIFIED`; do not force Hedge |
| C06 | Isolated | Hedge | Cross 1× SIMPLE | `MARGIN_MISMATCH`; no automatic switch |
| C07 | Isolated | One-Way | Cross 1× SIMPLE | `MARGIN_MISMATCH_AND_POSITION_REVIEW`; no switch |
| C08 | Portfolio | Hedge | Cross 1× SIMPLE | `ACCOUNT_MARGIN_COMPATIBILITY_UNVERIFIED`; no switch |
| C09 | Portfolio | One-Way | Cross 1× SIMPLE | `ACCOUNT_MARGIN_AND_POSITION_UNVERIFIED`; no switch |
| C10 | Cross | Hedge | Veles proposed 8× (hypothetical) | `REJECTED` for proposed **new/add** exposure: leverage exceeds 5× |
| C11 | UNKNOWN | UNKNOWN | Cross 1× SIMPLE, **H04 ACTIVE** | `REJECTED` known hard veto despite missing modes |
| C12 | Cross | Hedge | Cross 1× SIMPLE, **full T02/Mark not provided** | `MODE_ONLY_PASS / NO_TRADE_READY`; risk still `NOT_EVALUABLE` |

**These are normative expected decisions, not actual user data or independent live trades.** No claim that Veles currently supports every account-mode/market combination, since exact supported mode can differ by instrument/version. C04 and C12 deliberately avoid unqualified `PASS` and `READY`.

## 5. P02-04 verification gates

- `B0`: actual selected values (not menu options) received; text attestation accepted and labeled.
- `B1`: source/session and date/time with timezone; no inferred live timestamp.
- `B2`: account-wide UTA margin vs Veles local dropdown separated; Cross only visually in Veles now.
- `B3`: HYPEUSDT One-Way/Hedge vs simple LONG DCA differentiated; no automatic mode switching.
- `B4`: preserve leverage<=5× for new/add and stop on H04/other known hard veto, independent of gaps.
- `B5`: no T02/Equity/Mark/MMR/future-grid/liq-loss stress ==> no R3 readiness.
- `B6`: no private secret, raw screenshot in public repo, API key or any exchange/UI write.
- `B7`: produce evidence table, compatibility finding (`CONDITIONAL` or `NEEDS_DATA`), separate self-review and separate user acceptance; no Stage 06 or v2 activation.

## 6. Current execution record

- User statement that Bybit settings exist: `USER_ATTESTED`.
- Actual selected Bybit UTA margin value: `NOT_PROVIDED`.
- Actual selected Bybit HYPE position mode: `NOT_PROVIDED`.
- Screenshot/time/subaccount linkage: `NOT_PROVIDED`.
- Visual/API account compatibility test: `NOT_RUN`.
- Conditional synthetic decision matrix: **12 expectations designed, not executed against live account**.
- P02-04 completed-result self-review: `NOT_STARTED`; preparatory document self-review to follow.
- P02-04 user acceptance: `PENDING_FUTURE_RESULT`.

**Stop state:** `P02_04_PREPARED / AWAITING_ACTUAL_SELECTED_VALUES / NO_TRADE_READY / STAGE_06_NOT_STARTED / V2_NOT_ACTIVE`. Keep original HYPE pilots, `AGENTS.md`, main, legacy branch and Draft PR #1 untouched.
