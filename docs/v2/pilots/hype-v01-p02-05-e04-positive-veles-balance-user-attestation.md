# HYPE-V01 / P02-05-E04 — positive balance now displayed in Veles

**Recorded:** 2026-11-14 (chat calendar date; Veles screen capture/observation time not independently supplied).
**Status:** `USER_ATTESTED_VELES_POSITIVE_INDICATIVE_BALANCE / PREVIOUS_ZERO_NO_LONGER_REPRODUCED_BY_USER / ROOT_CAUSE_UNDETERMINED / P02_05_ACCEPTANCE_PENDING`.
**Scope:** documentary reconciliation under user-authorized P02-05; no Veles or Bybit account/tool action.

## 1. Exact user statement and evidence classification

The assistant asked whether the **same selected `Bybit Futures` connection in the HYPEUSDT Veles editor** still showed `БАЛАНС НА БИРЖЕ: 0 USDT` when checked now. The user's reply:

> «В выбранном подключении Bybit Futures в Veles теперь отображается положительный баланс.»

Interpretation: `USER_ATTESTED_POSITIVE_VELES_INDICATIVE_BALANCE`. This new user report **supersedes zero as the last reported visible Veles balance status**, but does **not** prove that the old S7 screenshot and the current observation came from the same live authenticated session, provide actual amount or source timestamp/timezone, independently verify exact Bybit account identity, show connection health or confirm the original insufficient-funds warning disappeared.

Previous evidence is unchanged and historically valid:
- S7 earlier displayed **indicative `0 USDT`** and a launch warning in a Veles DCA editor. Its capture time is unknown.
- User later attested that the selected Veles `Bybit Futures` connection was for a **subaccount** (P02-05-E01), the target Bybit UTA had **positive available derivatives-trading funds** (E02), and these funds were **in USDT** (E03).
- User had earlier reported Bybit `Cross` and `Hedge`. Veles editor showed `Cross` and `1×` in a historical separate screenshot. None of these reports are proof of a saved bot or current exchange account risk.

**Time distinction:** This is a sequence of two non-synchronized observations, `earlier screenshot zero -> later positive user report`, **not** proof of an intermittent API problem, balance reload, recovered permissions, funding transfer, changed collateral, newly selected connection or any particular root cause.

## 2. Differential diagnosis update (hypotheses, not findings)

| Code | Candidate explanation for old 0 USDT | After E04 | Verdict |
|---|---|---|---|
| D01 | Wrong main vs intended subaccount binding | User attested subaccount; new indicator positive on selected binding | `LESS_LIKELY / EXACT_BINDING_NOT_AUTHENTICATED` |
| D02 | Funds were in Funding/other account | User previously attested positive trading funds in target UTA | `WEAKENED / NO_DIRECT_ACCOUNT_EVIDENCE` |
| D03 | Different currency or available-margin metric | User specified USDT; new Veles positive amount removes apparent currently visible discrepancy | `OTHER_ASSETS_ONLY_EXPLANATION_WEAK / METRICS_NOT_RECONCILED` |
| D04 | Margin fully reserved by positions/orders/other bots | User attested available funds positive; actual exposure never examined | `FULL_RESERVATION_LESS_LIKELY / EXPOSURE_UNKNOWN` |
| D05 | Outdated display, sync or permission issue | A later positive display is **consistent** with a transient presentation issue but not diagnostic | `POSSIBLE / UNPROVEN` |
| D06 | Actual target UTA had no usable funds | User attested trading funds positive and Veles now positive | `LESS_LIKELY / HISTORICAL_STATE_UNKNOWN` |

**Conclusion:** The **observed/reported indicator discrepancy is no longer current by user report**. Its previous cause remains `UNKNOWN`; there is no basis for a technical fault attribution or a claim that it was repaired.

## 3. P02-05 L0–L7 evaluation

| Gate | Updated classification | Evidence limit |
|---|---|---|
| L0 intended account | `USER_INTENT_SUBACCOUNT` | Existing task target |
| L1 precise binding | `USER_ATTESTED_SUBACCOUNT_TYPE / EXACT_IDENTITY_UNVERIFIED` | No authenticated account match |
| L2 Veles indicative balance | `USER_ATTESTED_POSITIVE_NOW / PRIOR_S7_ZERO_HISTORICAL` | No fresh screenshot or amount |
| L3 Bybit UTA funds | `USER_ATTESTED_POSITIVE_AVAILABLE_USDT` | Not independently verified by exchange |
| L4 all positions, orders and bots | `NOT_CHECKED` | Still required for later full risk |
| L5 observation time/source | `TIME_UNVERIFIED` | Neither synchronized nor authenticated |
| L6 action/privacy | `PASS_NO_ACCOUNT_ACTION` | No keys, transfers, relinking or bot actions |
| L7 risk and handoff | `NO_TRADE_READY / P02_FULL_VERIFICATION_INCOMPLETE` | No complete T02/T03/T04, Mark/MMR, limits or stress |

## 4. Consequences and next controlled gate

1. Do **not** ask the user to reconnect Veles, regenerate API keys, move capital or change mode/leverage to diagnose an issue that is **not presently reported**.
2. **No additional balance troubleshooting is necessary solely on this report**. If it returns to zero, capture time/source and visible connection health without account actions.
3. Future financial-risk step is distinct. Before any actual R3 readiness decision, obtain full fresh private T02 for all relevant UTA futures exposure, current Mark, T03 relevant positions, T04 bots/full grid, IM/MMR, user H04/daily/HWM status and F/A/H/R stress. The existing `docs/data-freshness.md` requires `Mark ≤2min`, `T02 ≤5min plus no material changes` for final review. A positive Veles indicator does not satisfy any financial-risk gate.
4. Keep `P02_verified_at=null`, `field_map_version=null`, do not issue `VERIFIED_FOR_MANUAL_REVIEW`, a numeric Veles grid or live bot instructions.

**Result:** `P02_05_E04_USER_POSITIVE_BALANCE_RECORDED / CURRENT_DISPLAY_DISCREPANCY_NOT_REPORTED / ROOT_CAUSE_UNKNOWN / SELF_REVIEW_PENDING / P02_05_USER_ACCEPTANCE_PENDING`.

All work restricted to `feature/simplified-agent-v2`. Legacy agent, `main`, original HYPE records and Draft PR #1 unchanged. `STAGE_06_NOT_STARTED / V2_NOT_ACTIVE`.
