# HYPE-V01 / P02-05-E03 — self-review of USDT denomination clarification

**Reviewed:** 2026-11-14.  
**Verdict:** `SELF_REVIEW_COMPLETE / USER_ATTESTED_USDT / BALANCE_ROOT_CAUSE_UNKNOWN / P02_05_IN_PROGRESS / ACCEPTANCE_PENDING`.

## 1. Evidence under review

The user explicitly replied `«USDT»` to the question whether *already-attested available funds in the intended Bybit UTA subaccount* were in USDT or other collateral. This is a qualitative currency attestation, not a quantitative statement about free USDT, independent wallet verification or a fresh account snapshot.

Report `docs/v2/pilots/hype-v01-p02-05-e03-usdt-collateral-user-attestation.md` was committed at `7df647b9c5f94a30fdefdc577d546ed83f9c1f3f` and fetched back from GitHub as Blob `6514786487979c411b24e41e048fd6ff409b98a0` with matching content. Prior P02-05-E01/E02 records remain immutable.

**Review limitations:** same assistant authored and reviewed this documentation; this is **not** a blinded reviewer, live API test, current Veles-account verification or real risk/stress evaluation.

## 2. Ten bounded structural and policy assertions

| Check | Status | Basis |
|---|---|---|
| Exact literal user response | `PASS` | `USDT` recorded with no invented amount |
| Existing user-attested UTA and subaccount scope preserved | `PASS` | Earlier `Субаккаунт` and available-futures-funds claims remain attributed |
| All six D01–D06 hypotheses reviewed | `PASS` | None asserted as root cause |
| All eight L0–L7 gates evaluated | `PASS` | Unconfirmed fields remain unknown |
| "Only other assets" hypothesis appropriately weakened | `PASS` | Does not conflate holdings with exact free quote balance |
| Historic Veles screenshot NOT treated as synchronized with user report | `PASS` | `TIME_ALIGNMENT_UNVERIFIED` |
| 0 USDT not promoted to true Bybit Equity=0 | `PASS` | Veles indicator is incomplete account evidence |
| No live API, authentication change, orders or funds movement | `PASS` | Read-only documentation |
| One next nonintrusive observation selected | `PASS` | Does Veles currently still show 0 USDT? |
| No P02-05 acceptance or trading readiness presumed | `PASS` | Separate acceptance required and risk gates unsatisfied |

**10/10 document/policy assertions PASS**, not ten completed live integration tests.

## 3. Adversarial findings and safeguards

| ID | Severity | Finding | Treatment |
|---|---|---|---|
| SR-E03-01 | HIGH | `USDT` as available-funds denomination does not establish actual **free USDT** metric, amount or API-visible value | `USER_ATTESTED_CURRENCY_ONLY` |
| SR-E03-02 | HIGH | Old Veles zero screenshot and today's verbal reply may be from different times or connection states | `APPARENT_MISMATCH / TIME_UNVERIFIED` |
| SR-E03-03 | HIGH | Exact matched subaccount and API scope remain unverified, despite user identifying account kind | No assumption of account mismatch or valid same-account linkage |
| SR-E03-04 | HIGH | Actual T02, Mark/MMR, existing exposures and F/A/H/R remain missing | `NO_TRADE_READY`; no numerical grid, budget or liquidation |
| SR-E03-05 | MEDIUM | Source labels "available to trade", "equity", "free quote" and "withdrawable" can differ | Do not translate qualitative currency answer to account value equivalence |
| SR-E03-06 | MEDIUM | A zero UI indicator alone cannot establish stale API cache or permission error | Check current **read-only** Veles UI state before hypothesis prioritization |
| SR-E03-07 | MEDIUM | Opening an editor of a running bot may expose mutable controls | No clicks/toggles/changes, no save or reconnect; observation only |
| SR-E03-08 | LOW | Same-model self-review of text is not independent runtime validation | Label as structural, preserve limits |

## 4. Decision and stopping condition

`P02_05_E03_RECORDED / SELF_REVIEW_COMPLETE / CURRENT_VELES_INDICATOR_NOT_RECHECKED / ROOT_CAUSE_UNDETERMINED / ACCEPTANCE_PENDING`.

Next step within existing authorized P02-05: ask whether the same Veles `Bybit Futures` connection **still displays `0 USDT` now**, with options yes/no/not safely observable. Prefer an approximate observation time/timezone if voluntarily supplied; do not require amounts. If not accessible read-only, mark `NEEDS_DATA` and avoid risky UI changes.

Never infer `P02_verified_at` or trading readiness. `STAGE_06_NOT_STARTED`, `V2_NOT_ACTIVE`, only `feature/simplified-agent-v2` files written; `main`, legacy agent and Draft PR #1 unchanged.
