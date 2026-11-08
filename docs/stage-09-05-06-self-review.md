# Stage 09.5.6 — adversarial self-review of final Portfolio & Recovery audit

**Review date:** 2026-11-08. **Status:** `SELF_REVIEW_COMPLETED / NO_BLOCKING_DOCUMENTARY_ERRORS_FOUND / USER_ACCEPTANCE_PENDING`.

**Reviewer independence:** This is a second-pass critical review by the **same** assistant in the development conversation, NOT an externally independent audit and NOT authenticated verification of model runtime/session/tool traces.

**Reviewed source:** [Stage 09.5 final results](stage-09-05-results.md), as published in commit `e8b2f01e9a9327981c64185f8ba04848a46fd37f`, Git Blob `28e8ec6e8a83858133ca0951058db69ba966a3aa`. Compared with the approved [09.5 v2 execution and acceptance plan](stage-09-05-plan.md), canonical [09.5 journal](../tests/fixtures/stage-09/portfolio-recovery-actual-runs.v1.json), historical [09.4 journal](../tests/fixtures/stage-09/r1-r2-actual-runs.v1.json), evaluations for accepted and failed attempts, 09.4 historical S09-012 evaluation, public original and R02 oracle commitments, and the [user-approved narrow exception](stage-09-05-05-s09-015-r02-backup-exception-approval.md).

## 1. Mechanical documentary assertions (all passed)

| Adversarial question | Finding |
|---|---|
| Is there exactly one canonical 09.5 journal with **six** distinct run IDs? | PASS: 6/6 unique; corrective R02 is a separate entry |
| Are there exactly **five unique accepted case IDs** among S09-013–017? | PASS: all five covered, S09-015 by R02 |
| Did the failed `S09-015-R01` secretly become PASS or disappear? | PASS: still 9/10 E09 FAIL, `formal_case_accepted=false` |
| Are all **accepted** outcomes 10/10 content PASS with no failed rubric IDs? | PASS: 50/50 for five accepted runs; this is content scoring, not market/risk proof |
| Are **all six** attempts also 60/60? | NO: correctly reported 59/60; preserved R01 mandatory failure |
| Does S09-012 appear incorrectly as a new 09.5 execution? | PASS: S09-012 is 09.4 reference only, 10/10 USER_ATTESTED |
| Does 09.4 keep its 18 prior records and 12 distinct accepted case IDs? | PASS: 18 prior runs; historical journal Git Blob `437014ce0861d48a82c031de2206414864989f5d` |
| Was the source-policy pin **changed prospectively**, not retroactively? | PASS: R01 fixed `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`; R02 fixed `1a0c12f7baba99d2b1dfb7b8afe18ef40034264c`; historical 09.4 S09-012 retains `ea12ab9ae3c865bddd1455b01dae47357e6dc9cc` |
| Is original v1 fixture unchanged? | PASS: `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Is R02 fixture unchanged and separate? | PASS: `5cd4c2ef9c8fdfdc572e154d38868941ec253959` |
| Does one accepted case **not** meet strict original standalone oracle-file rehash? | PASS: R02 explicitly `false`, archive `true`, user exception `true`; therefore strict-standard original-integrity coverage **4/5** |
| Are session independence and auto-Skill loading overstated? | PASS: USER_ATTESTED and self-reported explicit source reads, not authenticated/tool-autoload proof |
| Is PR #1 left Draft/Open/unmerged with no stage closeout? | PASS |

## 2. Adversarial semantic checks (qualitative)

1. **Cross liquidation**: The 30% displayed price gap in S09-013 is **not** verified account-level adverse distance for FR-032 without Cross MMR. No false PASS claim in final report.
2. **Order identity and slots**: S09-014's fourth GPS slot is **conditional**, not already filled; order A FILLED leaves0 is not a pending future obligation, B NEW leaves2 is counted once, owner/link unknown. Full margin reserve is NOT_EVALUABLE. No verified real FR-033 or FR-034 beyond supplied branches.
3. **H01 signed components**: original -8 signed subtotal remains in historical failed R01, accepted R02 subtotal is -15.90 with **received** funding +0.35, and S09-016 -13 is **pre unknown costs**. Positive uPnL does not create realized recovery, and no completed T05 linked trade ledger exists.
4. **H02/H03/H04**: missing historical HWM and Moscow-day baseline is NOT_CHECKED (not false violation or automatic veto); H04 missing means UNKNOWN, not cleared. Corrected R02 observed this behavior; the original failed E09 wording remains methodologically disputable but recorded as a failed mandatory item.
5. **Event invalidation**: S09-017 -80/-8% is a two-snapshot difference, not proven day trading loss or HWM drawdown. Event invalidation despite nominal TTL is explicitly protected.
6. **S0–S3, real F/A/H/R**: Evidence-level NOT_EVALUABLE and NOT_PERFORMED not counted as stress compliance; absence of needed market histories/tier/MMR and actual complete account means no R3 READY.

## 3. Findings and caveats that must survive user acceptance

- **AUD-0956-01 — medium process assurance limitation, disclosed:** S09-015-R02 is accepted using the **user-approved one-run archived-backup exception**, while the original private standalone oracle file remains inaccessible. This **does not meet** the unmodified strict original-file criterion in the approved v2 plan. The exception neither silently changes that plan nor proves original-file verification. If strict original-file-based gate is ever required, repeat with a new original and run ID; do not edit the historical R02 verdict.
- **AUD-0956-02 — independent provenance limitation, disclosed:** full 09.5 independent session/tool trace is not available; user attestations support a lower tier; the same development assistant reviewed the tests. No external audit.
- **AUD-0956-03 — result-file time context:** earlier per-run reports and public preregistration are time-stamped records of **their own checkpoints**, not necessarily current 09.5 status. The new final report is additive and controlling for this audit; do not rewrite historical checkpoint headers or old journal data to synchronize dates.
- **AUD-0956-04 — risk evidence gap, open:** RV-02/03/04/06, TV-01–04 and real FR-038 S3 remain OPEN; no true full-account stress, Bybit live/UTA/portfolio liquidation proof, verified bot P02 or runtime auto-loader proof.
- **AUD-0956-05 — historical cross-stage provenance, disclosed:** S09-012 accepted under 09.4 USER_ATTESTED; 09.4 still contains its independent first-output caveat for S09-002, which stage 09.5 cannot repair or erase.

**Severity classification:** These are documented **assurance and evidence limitations**, not new discovered `FAIL_CRITICAL` or `FAIL_MAJOR` model outputs in any of the five accepted scenarios. No change to original evaluator grades. Under the **unmodified strict process gate** R02 still fails original-file identity rehash, so final report should never claim unconditional formal high-assurance completion.

## 4. Verdict and user gate

**Self-review decision:** `09.5.6_REVIEW_PASS_WITH_DISCLOSED_ASSURANCE_EXCEPTION / USER_APPROVAL_PENDING`.

No additional corrective commit, R03 invocation, rewrite of R01, R02 answer, private oracle or normative source was needed for documentary accuracy. The final [results report](stage-09-05-results.md) must continue to say **five accepted cases including one exception**, not “five strict-original-oracle-verified runs.”

**Not authorized:** closing/marking stage 09.5 `APPROVED`, merging PR #1, beginning 09.6, live access, executing positions or issuing R3 READY. The next action is explicit **user review and approval** of the final report *with the R02 exception and unresolved risk caveats*.
