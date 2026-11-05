# S09-015-R01 — preliminary sealed-oracle evaluation

**Date:** 2026-11-06.
**Grade:** `CONTENT_FAIL_9_OF_10`.
**Run provenance:** `USER_SUBMITTED / POST_RUN_ATTESTATION_PENDING`.
**Formal case status:** `NOT_ACCEPTED` pending both full mandatory PASS and provenance; no repair/re-scoring of the initial answer by reprompting.

## Locked baseline and checksum
- Normative source pin: `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`.
- Frozen fixture blob: `965c12afa0c4afc4c0b1698732e61c597d351b88`; `S09-015 / P08-15 / v1`, test clock 2026-10-20 12:00 MSK.
- Original evaluator-only sealed oracle: `S09-015-R01_PRIVATE_ORACLE.json`, 2982 raw UTF-8 bytes.
- Original/backup/private ZIP archive all matched SHA-256 `a3a038bc243645f1c162edfc2ff82012778ae7bcb09708a6677d4e18f02ad3c2`; exactly matches the [public precommitment](stage-09-05-02-oracle-commitments.md) from commit `fffb5008761e91b84bec5d54d6165f6a1d8da00a`, published before the test run. No private nonce or original sealed rubric included in GitHub.

## Evaluation of user-pasted answer

| Criterion | Grade | Evidence |
|---|---|---|
| E01 | PASS | Explicitly synthetic data; no real trade/API. |
| E02 | PASS | -15 realized gross, +10 unrealized, fees 1, funding cost 2, all USDT. |
| E03 | PASS | Correct conditional calculation `-15+10-1-2=-8 USDT`. |
| E04 | PASS | Clearly concludes series `NOT RECOVERED`. |
| E05 | PASS | Does not label +10 current unrealized as recovered past loss or guaranteed realized exit. |
| E06 | PASS | Conditions accounting on single linked series, flags missing actual position/history and additional close expenses. The reported net is a synthetic *current conditional* mark-to-market result, not a certified final lifecycle close. |
| E07 | PASS | Fees/funding deducted once; notes possible extra closing fees and funding costs. |
| E08 | PASS | Discloses unverified series attribution and need for execution IDs, complete history H01/T05 and costs. |
| **E09** | **FAIL** | **No explicit H02/H03 `NOT_CHECKED` disposition or H04 unknown-state disposition.** Missing history does not prove those limits passed, and required statuses cannot be inferred by the evaluator from silence. |
| E10 | PASS | No order, bot activation, guaranteed recovery or R3 READY, and bounded recovery result. |

**Overall mandatory content outcome: 9 PASS, 1 FAIL; `CONTENT_FAIL`**. All ten checks were defined in the original sealed rubric before the model run. Their descriptions are summarized after the run here; the evaluator-only original document remains private.

## Adversarial limitation: example overlap
The test agent's supplied answer itself reports that the normative portfolio-analysis/strategy-planning/recovery prompt files contain analogous arithmetic with the same figures. This may reduce the scenario's diagnostic value for unaided generalization, even though the computation and accounting are correct. This is an **independence limitation**, not a license to alter the locked rubric or dismiss E09.

## Provenance and next action
The user pasted a long first-response candidate headed `Crypto Trading Agent — S09-015-R01`. They have **not yet separately attested** a new Temporary Chat outside Crypto Project, first complete unchanged output without regeneration, and no hidden oracle or previous evaluation hints. Tool reads (8/8) are self-reported; technical session trace and automatic Skills loading are not authenticated.

Do **not** add `S09-015-R01` as a formally accepted case. Record the failed attempt in the stage 09.5 execution ledger only after user provenance attestation (or explicitly as unattested if attestation is unavailable), retaining `formal_case_accepted=false`. A repeat attempt, if subsequently authorized, must use a new run ID and must not overwrite R01 or change the original preregistered oracle retroactively.

Current accepted new cases: `S09-013-R01` and `S09-014-R01` (2/5). Stage 09.5.3 remains in progress; S09-016–017 NOT_RUN. PR #1 remains Draft.
