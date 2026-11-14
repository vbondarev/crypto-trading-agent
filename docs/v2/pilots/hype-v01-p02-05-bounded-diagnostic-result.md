# HYPE-V01 / P02-05 — bounded read-only account-binding / indicative-balance diagnostic result

**Consolidated:** 2026-11-14.
**Status:** `P02_05_DIAGNOSTIC_COMPLETE_WITH_LIMITATIONS / PREVIOUS_ZERO_NOT_REPRODUCED_BY_LAST_USER_REPORT / ROOT_CAUSE_UNKNOWN / USER_ACCEPTANCE_PENDING / NO_TRADE_READY`.
**Scope:** accepted P02-04 to P02-05 authorization permitted documentary account-linkage and indicator diagnostics only. This is the **report proposed for separate user acceptance**, not an acceptance record.

## 1. Reproducible evidence ledger

| Evidence | Record | Source tier | Findings |
|---|---|---|---|
| P02-05 protocol | `hype-v01-p02-05-connection-balance-diagnostic.md` (Git Blob `0e43c30d011d2b2790f2b8a41a5a785fa5eb1143`) | Approved read-only diagnostic plan | Six hypotheses D01–D06, eight gates L0–L7, no account actions |
| E01 | `hype-v01-p02-05-e01-subaccount-linkage-user-attestation.md` (Blob `2e9eca895968640879088c08cf63eb5b6fd5f947`) | User-attested | Selected Veles `Bybit Futures` connection is to a **subaccount** by user report; exact account ID not independently matched |
| E02 | `hype-v01-p02-05-e02-available-collateral-attestation.md` (Blob `e2cd9440cf283002ca2a4f31cb76177f7ab944b4`) | User-attested | Target Bybit UTA subaccount has **positive available funds for futures**, no amount or official balance source |
| E03 | `hype-v01-p02-05-e03-usdt-collateral-user-attestation.md` (Blob `6514786487979c411b24e41e048fd6ff409b98a0`) | User-attested | Those available funds are **USDT**, not solely non-USDT cross collateral, by user report |
| E04 | `hype-v01-p02-05-e04-positive-veles-balance-user-attestation.md` (Blob `978c42540962c1c3312418ae6153e62e3da90d04`) | User-attested | **Same selected Veles connection now shows a positive balance**; screenshot S7 previously showed 0 USDT |
| E04 self-review | `hype-v01-p02-05-e04-self-review.md` (Blob `c1b16da48d08887cdb1b1f52264bf5a2baeab792`) | Same-assistant document review | 10/10 scoped checks, 8 adversarial findings, no root-cause attribution |

All cited files are under `docs/v2/pilots/`. Previously accepted P02-02/P02-03/P02-04 observations remain unchanged.

## 2. What can and cannot be concluded

**Supported, with explicit source-tier limits:**
- User's intended Bybit subaccount and the Veles binding's **account category** agree by user attestation; identity has not been independently authenticated.
- User reports positive Bybit UTA futures available funds in USDT.
- Historic S7 showed `БАЛАНС НА БИРЖЕ: 0 USDT` with a Veles insufficient-funds warning, followed in the conversation by the user confirming that the selected Veles `Bybit Futures` connection **now has positive displayed balance**.
- **The previously reported 0-USDT display is no longer reproduced in the latest user report.** A fixed external service, recovered API permissions or a deposit is **not** established.

**Not supported:**
- A single independently measured real-time comparison: S7 original screenshot capture time, new observation time/timezone, exact connected account IDs, live available balance, API sync status, connection-health log and warning persistence remain unverified.
- The positive displayed value is not a proof of usable trading capacity, sufficient full-grid funding, stable connection, or the absence of all positions/orders/bots.
- No direct Bybit private account connector access, API tests, order creation, test order, account switch, new link, permission change, fund transfer or Veles setting update has happened.

**Diagnostic disposition:** `ROOT_CAUSE_UNDETERMINED`; `CURRENT_VELES_POSITIVE_USER_ATTESTED`. Do **not** prescribe a fix to an already non-reproduced symptom. If the UI returns to zero, request time-matched read-only evidence and connection status rather than guessing an API error.

## 3. P02-05 final gate disposition

| Gate | Outcome | Why not a trading PASS |
|---|---|---|
| L0 intended subaccount | `USER_INTENT_KNOWN` | Account type is not exact authenticated identity |
| L1 exact Veles–Bybit binding | `USER_ATTESTED_TYPE_ONLY` | No independent exact subaccount match |
| L2 Veles balance | `LAST_USER_REPORT_POSITIVE` | Historical S7 zero, no new verified screenshot/time |
| L3 Bybit UTA available funds | `USER_ATTESTED_USDT_AVAILABLE` | No amounts/source numeric risk data |
| L4 existing exposure | `NOT_CHECKED` | T02 positions/orders/bots absent |
| L5 capture/source timing | `INCONCLUSIVE` | No synchronized timestamps or native server clocks |
| L6 safe private read-only process | `PASS_NO_ACTION` | No secrets/operations/real account modification |
| L7 full bot risk and readiness | `NO_TRADE_READY` | Cross MMR/IM, Mark, grid, risk vetoes and F/A/H/R unverified |

No financial risk gate was evaluated as `PASS`. The form's previous visually displayed `Cross / 1× / LONG / SIMPLE`, selected HYPE/USDT and existing-position inclusion OFF **do not** form an executable bot configuration.

## 4. Suggested future step, separate authorization REQUIRED

**Propose `P02-06` only, NOT STARTED:** a bounded **readiness/evidence checklist** for future user-approved HYPEUSDT LONG SIMPLE manual configuration and Cross portfolio-risk preflight, separating `T02` (entire relevant Bybit futures account, Equity/available margin/current positions/orders/bots), `T03` (existing positions if any), `T04` (full proposed grid/budget, existing bot commitments), authenticated HYPEUSDT instrument specs, current Bybit Mark, liquidation and worst-case loss model including fees/funding/slippage, H04/daily/HWM and stress F/A/H/R. Decide exact minimum data to request only when such assessment is separately authorized. Do not demand full account details for finishing P02-05.

Existing risk policy requires: max leverage 5×, margin occupancy ≤30% Equity, bot worst loss ≤5% Equity, max 3 positions, reserve all future grid orders, adverse liquidation distance ≥15% from Mark, Moscow-day realized+unrealized loss gate ≥3%, HWM drawdown ≥15%; known H04 hard violation stops new risk. Per `docs/data-freshness.md` **only for a future R3 final decision** the Mark must be ≤2 min old and full T02 ≤5 min old plus confirmation nothing material changed.

**No `BotConfigurationProposal`, no `VERIFIED_FOR_MANUAL_REVIEW`, no `READY`, no trade.** `P02_verified_at=null`, `field_map_version=null`, `STAGE_06_NOT_STARTED`, `V2_NOT_ACTIVE`.

## 5. Acceptance boundaries

P02-05 may be **accepted by user only as completed bounded documentary diagnosis**, in which (a) positive Veles balance was most recently reported, (b) historical cause of zero remains unknown and (c) all real financial/account-readiness checks remain pending.

The user's latest reply was evidence about balance, **not** explicit acceptance of P02-05 and **not** an authorization for P02-06 or a trading workflow. Obtain separate user approval before transition.

**Repo isolation:** `feature/simplified-agent-v2` only; `main`, legacy agent, original HYPE pilot, existing Draft PR #1 unchanged.
