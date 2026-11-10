# Stage 09.4 — aggregate independent synthetic test audit

## Scope and verdict

Twelve specified cases `S09-001` through `S09-012` of synthetic fixture v1 were tested and are now **12/12 FORMAL_ACCEPTED_USER_ATTESTED** at the agreed evidence tier. **Stage 09.4 READY_FOR_USER_CLOSEOUT**, not a certification of technical session isolation or real-market trading safety. PR #1 remains open and Draft. This report does not authorize real Bybit interaction, R3 bot activation or autonomous execution.

## Source controls
- Fixture `tests/fixtures/stage-09/inputs.v1.json` SHA-1 Git blob: `965c12afa0c4afc4c0b1698732e61c597d351b88`, unchanged throughout the final twelve.
- Historic `NOT_RUN` planning baseline was intentionally not rewritten. Actual evidence maintained separately in append-only `tests/fixtures/stage-09/r1-r2-actual-runs.v1.json`.
- Public commitment documents and their private-oracle original SHA-256 digests were established ahead of the corresponding assessed responses. Each accepted record documents oracle verification at time of evaluation; this aggregate report relies on those records, not universal rehash of every historical oracle in today's runtime.
- Total runs preserved **18**, of which **12 accepted** and **6 not accepted**. Each accepted record belongs to a distinct case ID and references a retrievable GitHub evaluation/acceptance document.

## Accepted result matrix

| Case | Accepted run | Frozen content evaluation | Provenance |
|---|---|---|---|
| S09-001 | R02 | 9/9 PASS | USER_ATTESTED |
| S09-002 | R02 | 10/10 PASS | USER_ATTESTED; two distinct versions reported in one Temporary Chat (see limitations) |
| S09-003 | R03 | 10/10 PASS | USER_ATTESTED |
| S09-004 | R01 | 10/10 PASS | USER_ATTESTED |
| S09-005 | R01 | 10/10 PASS | USER_ATTESTED |
| S09-006 | R04 | 10/10 PASS | USER_ATTESTED |
| S09-007 | R02 | 10/10 PASS | USER_ATTESTED |
| S09-008 | R01 | 10/10 PASS | USER_ATTESTED |
| S09-009 | R01 | 10/10 PASS | USER_ATTESTED |
| S09-010 | R01 | 10/10 PASS | USER_ATTESTED |
| S09-011 | R01 | 10/10 PASS | USER_ATTESTED |
| S09-012 | R01 | 10/10 PASS | USER_ATTESTED |

## Preserved non-accepted runs
- `S09-003-R01`, `S09-003-R02`, `S09-006-R02`: `FAIL_MINOR`.
- `S09-006-R01`, `S09-006-R03`: provisional outcomes not formally scored against an original sealed oracle.
- `S09-007-R01`: `INCONCLUSIVE_ORACLE_DEFECT`. These six are not overwritten, not counted as passes and not hidden from reporting.

## Reproducibility and governance limitations (do not silently waive)
1. All accepted sessions rely on **user attestations**, not authenticated, immutable ChatGPT Temporary Chat exports, exact model IDs, or verifiable tool-call traces. The assessor was involved in preparation and evaluation; evaluator independence is limited.
2. **S09-002-R02** has two different submitted answers from **one** user-confirmed Temporary Chat, attributable to regeneration or re-prompting. Both passed the same frozen 10/10 content oracle and are correctly counted as **one case**, not two. This is weaker evidence for a strict *first unedited answer* protocol; source evaluation explicitly records the caveat. Original private oracle was unavailable for *new* SHA verification on 2026-10-31; historical verification on 2026-10-22 is preserved. For a higher-assurance release gate, repeat S09-002 in a new independently captured and committed run before calling it uncompromised first-output evidence. Its current acceptance tier remains USER_ATTESTED per historical accepted decision, not technical first-output proof.
3. Some early initializations reported partial file reads, without independently provable Git Blob byte integrity; Skills explicitly read does not demonstrate runtime auto-loading.
4. Synthetic fixture data and conditional calculations are **not** live exchange data; FR limits were tested only in intended illustrative circumstances and do not establish production readiness.

## Final audit checks

- Exact accepted distinct IDs: `S09-001` through `S09-012`, count 12: **PASS**.
- Each accepted record has an existing report path: **12/12 PASS**.
- Non-accepted historical attempts retained: **6 PASS**.
- Frozen fixture blob unchanged: **PASS**.
- PR #1 Draft: **TRUE**.
- Stage 09.4 status: `TEST_CONTENT_COMPLETE / USER_ATTESTED / READY_FOR_USER_CLOSEOUT`.
- Not performed: independent runtime provenance audit, formal high-assurance first-output retest of S09-002, tests 09.5–09.9, real-money trading/auto execution.

## Recommendation

Obtain explicit user acceptance of this aggregate audit, including the S09-002 evidence limitation. If user requires strict first-output-only assurance for all twelve, schedule one clean **S09-002-R03** test with a newly precommitted private oracle; do not modify R02 history. Otherwise accept stage 09.4 under USER_ATTESTED tier and proceed to plan/execute stage 09.5 as defined by the repository's own roadmap. Keep PR #1 Draft until explicitly approved for a different state.
