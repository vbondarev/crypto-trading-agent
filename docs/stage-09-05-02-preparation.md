# Stage 09.5.2 — sealed evaluator-only oracle preparation

**Date:** 2026-11-06. **Status:** `IMPLEMENTED / PENDING USER ACCEPTANCE`.
**No 09.5.3 independent run was launched.**

## Approval and boundaries

The user explicitly authorized 09.5.2 after formal 09.5.1 acceptance. This step exclusively creates **five private evaluator-only original rubrics and exact backups** and pre-registers **public SHA-256 commitments**. No fixture modifications, tests, run logs, price requests, account reads or trades.

Normative source pinned to `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`, verified at [09.5.1 preflight](stage-09-05-01-preflight.md) and [acceptance](stage-09-05-01-acceptance.md). Frozen fixture is `tests/fixtures/stage-09/inputs.v1.json`, Git Blob SHA `965c12afa0c4afc4c0b1698732e61c597d351b88`.

## Created artifact inventory

| Case | Run | Original bytes | Criteria | Oracle SHA-256 |
|---|---|---:|---:|---|
| S09-013 | S09-013-R01 | 3219 | 10 | `47ae74e6046b472e8a0f731471b11532ca802e546a9534d74bfac71ff5433efa` |
| S09-014 | S09-014-R01 | 3140 | 10 | `f64b4e352d50bbe5d3d283d6bead4bf2bd52948a001212656839c82dc028c985` |
| S09-015 | S09-015-R01 | 2982 | 10 | `a3a038bc243645f1c162edfc2ff82012778ae7bcb09708a6677d4e18f02ad3c2` |
| S09-016 | S09-016-R01 | 3009 | 10 | `b1d9eb4ef68c8b37348903c4d29469f97ed77bd94163642d9b6f83914b1c1daf` |
| S09-017 | S09-017-R01 | 3008 | 10 | `760b4f44c77d715923b1da77f4917cc214c3495753c49375bc0eb0c1afb4e2fb` |

Each original contains a distinct evaluator-only private nonce, exactly 10 mandatory pre-frozen assertions, the source commit, fixture blob, synthetic clock and the rule **all mandatory criteria must PASS**. A negative/missing required assertion cannot be waived or inferred from `NOT_EVALUABLE`.

**Private original directory in evaluator local container:** `/mnt/data/private_evaluator/stage-09-05/`.
**Private byte-identical backup directory:** `/mnt/data/private_evaluator/stage-09-05-backup/`.
These private evaluator paths are **not GitHub files, tested-session sources, or transferable runtime storage guarantees**. Preserve/download the originals and backups securely before future testing; future evaluation requires **the same original bytes**, not reconstructed oracle content.

### Public preregistration

[Public sealed commitments (metadata only)](stage-09-05-02-oracle-commitments.md) were created **before any test invocation** by Git commit `fffb5008761e91b84bec5d54d6165f6a1d8da00a`.

Commitment was subsequently re-fetched from GitHub. All five run IDs and SHA-256 values were found. The public document does not include original hidden criterion IDs/descriptions, expected results, or private nonces.

## Integrity verification

- Created five original UTF-8 JSON files and five private byte-for-byte copies.
- Rehashed the same original files after public preregistration and matched **5/5 SHA-256**.
- Compared original with backup byte-for-byte: **5/5 match**.
- Compared original UTF-8 byte count, 10 criterion count, frozen source commit, private nonce presence: **5/5 each pass**.
- Re-fetched public commitment and fixture: **5/5 run IDs present**, unchanged fixture Git Blob SHA.
- `S09-012-R01` was not recreated or counted as a new 09.5 oracle/run.

## Constraints and next gate

Private files exist in the current evaluation container only. Future session availability is not guaranteed unless their bytes are independently preserved, and their disclosure to a tested agent would invalidate the blind test. If an original oracle disappears or its digest disagrees with its precommitment, evaluate the corresponding future answer as `FORMAL_INCONCLUSIVE`; **never regenerate** an oracle after seeing it.

**09.5.2 = IMPLEMENTED / PENDING USER ACCEPTANCE**. **09.5.3 = NOT_STARTED**. Only after formal acceptance and **separate new authorization** may any new Temporary Chat be initiated for S09-013. Stage 09.5 still in progress, PR #1 Draft.
