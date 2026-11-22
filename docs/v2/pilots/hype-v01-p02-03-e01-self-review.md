# HYPE-V01 / P02-03-E01 — adversarial self-review of Veles leverage/Cross screenshot

**Review date:** 2026-11-12.  
**Decision:** `SELF_REVIEW_COMPLETED / PARTIAL_VELES_UI_PASS / ACCOUNT_RISK_NOT_EVALUABLE / P02-03_IN_PROGRESS`.

## 1. Review material

- Evidence report: `docs/v2/pilots/hype-v01-p02-03-e01-veles-leverage-cross-observation.md`, initial commit `2849bd397c229502e7f9aebdae03310431b2f76b`; re-fetched Git Blob SHA `4ab12d0e0b8c2039562644c1ddd6ad6cc73b242e`.
- The one attached screenshot `S7` was read visually and its actual bytes checked (868×343px, 49,513 bytes, SHA-256 `769885427392c471e9b1f674e7c2915be113d71d8d97c3c0398ab2ee71887a09`, no EXIF). No screenshot raw bytes in public GitHub.
- Referenced original accepted P02-02/E02–E04 records remain separate and unmodified.
- Reviewer is the same assistant as the report author: **not** an independently authenticated Veles login, Bybit account read, blinded external audit or a real trading evaluation.

## 2. Targeted controls — observed/pass vs missing

| Check | Result | Reason |
|---|---|---|
| Screenshot bytes / hash / scope recorded | `PASS` | S7 exact PNG observations; original image not published |
| Six visual UI observations `S7-01..S7-06` | `PASS` | Deposit, indicative 0, warning, 1×, Cross, reinvest |
| Eight M0–M7 gates explicitly evaluated | `PASS` | Missing inputs acknowledged without false ready |
| Veles `1×` vs `≤5×` policy | `PASS_FOR_VISIBLE_VALUE_ONLY` | Actual Bybit leverage and total risk unknown |
| `Cross` in editor vs Bybit UTA account mode | `PASS_FOR_SEPARATION` | Correctly **not** treated as the same observation |
| Veles `0 USDT` vs wallet/equity/available | `PASS_FOR_SEPARATION` | Platform shows insufficient-funds warning; actual exchange account is not proven empty |
| Screenshot capture time / same-session proof | `INCONCLUSIVE` | No source timestamp or user attestation |
| Real account risk incl. Mark/IM/MMR/F/A/H/R | `NOT_EVALUABLE` | No complete fresh T02/T03/T04 |
| Save/create/execution safety | `PASS_FOR_RESTRAINT` | No account or bot action, no executable config or activation |

**Structure assertion set:** six `S7-01..06` rows, eight `M0..M7` rows, exact SHA and snapshot limits, no private screenshots in GitHub, no readiness escalation. These are documentation checks, not executed portfolio tests.

## 3. Adversarial findings

| ID | Severity | Finding | Correct disposition |
|---|---|---|---|
| SR-P02-03-E01-01 | HIGH | `Перекрестная` in the Veles draft can differ from actual Bybit UTA mode; setting or saving it may change account state | Do not infer Bybit Cross; request existing Bybit mode read-only, **never switch** merely for this test |
| SR-P02-03-E01-02 | HIGH | Veles may apply leverage before position lock and a draft 1× may mismatch an existing position's leverage | Do not change or confirm leverage, save, test or run bot; no compatibility PASS |
| SR-P02-03-E01-03 | HIGH | `Баланс на бирже 0 USDT` is Veles **indicative** rather than an authenticated complete Bybit wallet/Equity; orange warning blocks apparent bot launch in this UI | No claim user has zero funds or need to deposit; first establish correct binding/account and available collateral via proper later checks |
| SR-P02-03-E01-04 | HIGH | Without complete portfolio, account MMR/IM, future grid and F/A/H/R, Cross liquidation and bot worst loss cannot be evaluated | `RISK_NOT_EVALUABLE / NO_TRADE_READY` |
| SR-P02-03-E01-05 | MEDIUM | Right endpoint 75 on slider does not establish permitted leverage for HYPE/USDT on actual Bybit/account tier | Do not promote 75× into product spec or suggest moving slider |
| SR-P02-03-E01-06 | MEDIUM | S7 lacks its own selected Bybit Futures connection/pair/LONG header, so may be from another form state | Require user same-session attestation; carry only as user-supplied separate screenshot |
| SR-P02-03-E01-07 | MEDIUM | No capture time/timezone; an upload date cannot establish UI snapshot freshness under AD-009 | `captured_at=UNKNOWN`, `P02_verified_at=null` |
| SR-P02-03-E01-08 | MEDIUM | Deposit is empty and no order or TP/SL exists; hypothetical 100 USDT/3× old synthetic values cannot fill real form | Keep `NEEDS_DATA` for sizing; no READY, no numerical grid |
| SR-P02-03-E01-09 | LOW | Self-review is not independent blinded testing or mechanical validation of a live browser session | Report as scoped documentary/visual review, nothing stronger |

## 4. Self-review conclusion, handoff and stop

**Disposition:** `P02-03-E01 VISUAL_LEVERAGE_AND_CROSS_MAPPED / SOURCE_AND_ACCOUNT_MODE_PARTIAL / SELF_REVIEW_COMPLETE / P02-03_AWAITING_REMAINING_EVIDENCE`.

The current P02-03 **must stay open** after this addendum. No user approval of P02-03 has been requested or inferred from sending the screenshot. Next safe evidence: optional read-only screenshot of actual currently selected **Bybit UTA margin mode and One-Way/Hedge position mode** plus capture date/time/timezone and confirmation whether S4–S7 refer to the same Veles draft/account. If not safely accessible, record unknown and deliver bounded partial P02-03 rather than forcing another mode change.

Never request credentials, complete wallet values or a deposit as a condition to finish this *UI evidence* step. For future real account-level trading review, fresh full-account data and independent risk model remain separately necessary; no `READY` or `VERIFIED_FOR_MANUAL_REVIEW` now.

**Isolation:** `feature/simplified-agent-v2` only; previous original evidence, old agent, `AGENTS.md`, `main`, and Draft PR #1 unchanged. `Stage 06 NOT_STARTED`; `v2 NOT_ACTIVE`.
