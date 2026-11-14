# HYPE-V01 / P02-05-E03 — available funds are USDT (user attestation)

**Recorded:** 2026-11-14 (chat date, NOT exchange observation timestamp).  
**Decision:** `USER_ATTESTED_USDT_AS_AVAILABLE_FUNDS_CURRENCY / VELES_ZERO_NOT_TIME_MATCHED / BALANCE_CAUSE_UNRESOLVED / P02_05_IN_PROGRESS / ACCEPTANCE_PENDING`.  
**Scope:** bounded user clarification in P02-05. No bot/account modification, independent Bybit/Veles verification, risk conclusion or new trading configuration.

## 1. Exact input and interpretation

The previous P02-05-E02 self-review asked: **«Доступные средства на субаккаунте Bybit находятся непосредственно в USDT или в других криптоактивах, используемых как обеспечение?»** (choices USDT, others, both or don't know).

The user answered, verbatim: **«USDT»**.

**Evidence classification:** `USER_ATTESTED_FUNDS_CURRENCY_USDT` for the already reported positive derivatives-trading funds in the chosen Bybit UTA subaccount. This **reduces the applicability** of the explanation "the user has no USDT at all and only has non-USDT collateral"; it does **not** independently establish the exact *free USDT amount*, which Bybit balance label the user read, current spot/cross portfolio debt, Veles quote-balance calculation, available margin after reservations, Veles access scope or whether both apps observed the **same account at the same time**.

**Prior evidence** (do not rewrite): the user said Veles selected `Bybit Futures` is linked to a `Субаккаунт` (E01); the user then stated their subaccount UTA has positive futures-available funds (E02). An older Veles screenshot S7 showed **indicative `0 USDT`** plus an insufficient-balance warning, blank deposit, Cross and 1×. The screenshot's capture time was never independently determined. **This is an apparent mismatch across non-synchronized observations, not a proven simultaneous contradiction.**

Do not treat the account's total USDT holdings, order-zone available balance, withdrawable amount, UTA margin balance and Veles "exchange balance" as necessarily identical; each may depend on funding location, loan/borrow, reservations, product restrictions and margin accounting.

## 2. Differential diagnosis updated without overreach

| Candidate | Before E03 | After the user says USDT | Interpretation |
|---|---|---|---|
| D01: wrong main-account binding | User reports selected connection is a subaccount | `LESS_LIKELY_USER_ATTESTED / EXACT_LINKAGE_UNVERIFIED` | Still no independently matched account identity |
| D02: only Funding/other account holds usable assets | User reports target UTA has funds for derivatives | `WEAKENED / NOT_FULLY_EXCLUDED` | Actual custody and balances not read |
| D03: available collateral only in non-USDT assets | Previously plausible | `OTHER_ASSETS_ONLY_EXPLANATION_WEAKENED` | User says **USDT**; Veles free USDT and Bybit available USDT may still use different definitions |
| D04: all margin already reserved | User reports positive futures available balance | `ZERO_AVAILABLE_MARGIN_LESS_LIKELY / OBLIGATIONS_UNKNOWN` | Nonzero available funds and some reservations can coexist |
| D05: stale/mis-scoped Veles display / connectivity/permissions | No API health evidence | `POSSIBLE / NOT_CONFIRMED` | Not justified to assert an error solely from one historical screenshot |
| D06: target UTA has no derivative-usable collateral | User reports positive available funds in USDT | `LESS_LIKELY_USER_ATTESTED / NOT_INDEPENDENTLY_EXCLUDED` | Amount, time and exchange status still not verified |

**No confirmed root cause.** In particular, do not say "Veles is broken", "the wrong API key is installed", "funds are actually unavailable", "Cross margin safety is proved" or "account needs topping up" based on the input.

## 3. P02-05 L0–L7 source/readiness checks after E03

| Gate | Status | Why |
|---|---|---|
| L0 intended scope | `SUBACCOUNT_CONFIRMED_AS_USER_INTENT` | User chose subaccount in prior P02-05 turns |
| L1 specific binding | `USER_ATTESTED_SUBACCOUNT_TYPE / IDENTITY_NOT_VERIFIED` | Same precise Bybit account not proven |
| L2 Veles indicative balance | `HISTORICAL_S7_ZERO / NOT_CURRENT_VERIFIED` | No fresh Veles read-only observation |
| L3 UTA derivative funds | `USER_ATTESTED_POSITIVE_USDT_FUNDS / LABEL_NOT_VERIFIED` | No screenshot/source balance amount |
| L4 positions/orders/bots | `NOT_CHECKED` | No account exposure data |
| L5 time alignment | `INCONCLUSIVE` | Dates/times for direct balance comparison missing |
| L6 no account actions / privacy | `PASS_READ_ONLY` | Documentation only; no keys, account IDs or private financial values in GitHub |
| L7 financial/bot readiness | `NOT_EVALUABLE / NO_TRADE_READY` | T02/T03/T04, Mark, MMR, risk and grid missing |

## 4. Narrowest next check without altering settings

**Ask one question:** In the **currently selected Veles `Bybit Futures` connection** for the HYPEUSDT bot, **does the editor STILL show `БАЛАНС НА БИРЖЕ: 0 USDT` at the time of a new read-only view?** Accept `Да, сейчас 0`, `Нет, сейчас не 0`, or `Не могу проверить`.

If possible the user can add the moment/timezone of this view, but it is **not required** for a qualitative answer. Do not click `Создать`, `Сохранить`, `Тестировать`, `Запустить`, change connection/margin/leverage/position mode, regenerate/relink API credentials, move funds, or force refresh by a modifying action.

- If Veles now shows a positive amount: record possible **stale historical screenshot**, not proof that connection problems are resolved for R3.
- If Veles still shows `0 USDT`: investigate, in a later separately reviewed read-only step, visible connection-health text and exact metric labels/time alignment without diagnosing an API fault.
- If cannot be checked safely: retain `NEEDS_DATA`; no readiness promotion.

No full Bybit T02, keys, money transfers or numerical strategy required to answer this question.

## 5. Scope and status

`P02_05_E03_USER_USDT_ATTESTATION_RECORDED / ROOT_CAUSE_UNKNOWN / SELF_REVIEW_PENDING / P02_05_ACCEPTANCE_PENDING`.  
`P02_verified_at=null`, `field_map_version=null`, `STAGE_06_NOT_STARTED`, `V2_NOT_ACTIVE`. Work only on `feature/simplified-agent-v2`, preserving original pilot records, active agent, `main`, and open Draft PR #1.
