# HYPE-V01 / P02-04 — preparatory decision-matrix self-review

**Reviewed:** 2026-11-12.  
**Disposition:** `P02_04_PREFLIGHT_DOCUMENTED / 9_STRUCTURAL_CHECKS_PASS / ACTUAL_BYBIT_MODES_NOT_OBSERVED / P02_04_USER_ACCEPTANCE_NOT_DUE`.

## 1. Source and custody

- User confirmed only that the relevant Bybit settings are available and instructed the next step. Actual selected values **were not supplied**. This was recorded without falsely declaring full P02-03 mode verification in `docs/v2/pilots/hype-v01-p02-03-acceptance-with-open-items.md`.
- Document reviewed: `docs/v2/pilots/hype-v01-p02-04-bybit-mode-compatibility-plan.md`, initial commit `6f0736ba97e88bf8896520128e06802a577abc0f`, observed read-back Git Blob `b4be1f24f7a82ef7427735c19baa248cdef3249a`.
- Reviewed official Bybit UTA account margin modes and position mode, and Veles warnings about position mode and leverage. Official documentation **does not authenticate** selected user account modes.
- Review was done by the **same assistant** as the author; it is not a blind independent live-session or portfolio evaluation.

## 2. Actual limited checks

**9/9 structural/content checks PASS** on committed material: (1) twelve numbered synthetic mode-compatibility expectations; (2) eight `B0..B7` gates; (3) source/update identity recorded; (4) no assumed actual Cross/Hedge/One-Way; (5) not a live account test; (6) no `READY`; (7) text or screenshot accepted rather than forcing private artifacts; (8) no margin/leverage/position-mode changes; (9) separate future acceptance preserved.

These checks inspect documentation completeness and conservatism only, **not** a demonstration that Veles and Bybit actually work together in a real account.

## 3. Adversarial findings

| ID | Severity | Finding | Outcome |
|---|---|---|---|
| SR-P02-04-01 | HIGH | A user's “settings exist” is **not** evidence that margin is currently Cross or position mode Hedge; Veles Cross field is not Bybit UTA state | Both remain `UNKNOWN` until actual selected-mode observation |
| SR-P02-04-02 | HIGH | Bybit UTA margin change can affect whole account, Veles leverage may affect existing position even when other protections block the bot | Never request switching/clicking an action; only read existing selected values |
| SR-P02-04-03 | HIGH | Even apparent `Cross + Hedge` alignment proves neither exchange execution nor whole-account risk, nor platform mode support in user's version | `CONDITIONAL_MODE_ALIGNMENT` only, never `READY` or P02 verified |
| SR-P02-04-04 | HIGH | Full current T02/T03/T04, actual Equity/Mark/MMR, F/A/H/R and H04 remain absent | No R3 final review or numeric Veles grid |
| SR-P02-04-05 | MEDIUM | Veles balance 0 USDT might be a partial or unsynchronized indicator | No claim actual wallet empty or recommendation to deposit |
| SR-P02-04-06 | MEDIUM | Date/time and subaccount binding not independently authenticated | Attestation-only time and account linkage tagged `USER_SUPPLIED_UNVERIFIED` |
| SR-P02-04-07 | MEDIUM | Position mode may be instrument-specific and cannot be inferred from a default or unrelated symbol | Request selected HYPEUSDT status, no generic/account-level extrapolation |
| SR-P02-04-08 | MEDIUM | 12-case matrix is only an *expected outcome catalog*, without running the model in an independent session | Report conditional logic, not 12 independent E2E PASS |
| SR-P02-04-09 | LOW | Tests for excessive leverage/hard H04 are synthetic negatives, not proof user has an actual breach | Never label actual user's trading state `REJECTED` absent confirmed violation |

## 4. Limited verdict and next evidence

**Current state:** `P02_04_PREPARED / SELF_REVIEW_COMPLETE / AWAITING_SELECTED_BYBIT_MARGIN_AND_POSITION_MODES / NO_TRADE_READY`.

For the actual P02-04 result request just **the two selected modes** (margin **Cross / Isolated / Portfolio**, position **One-Way / Hedge**), ideally with date/time/timezone and confirmation of the same Bybit subaccount used by Veles. User may type the values; no screenshots or private financial history required. If unsafe to view, record `NOT_SAFELY_OBSERVABLE`.

When actual values arrive, evaluate the matrix, self-review the **specific result** and request **separate user acceptance**. Until then P02-04 is **not accepted as a completed test**, v2 not active, Stage 06 not started, legacy agent and PR #1 untouched.
