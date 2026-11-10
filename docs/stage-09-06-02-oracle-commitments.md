# Stage 09.6.2 — sealed private oracle commitments (PUBLIC ONLY)

**Prepared on 2026-11-09 (Asia/Bishkek) / 2026-11-08 UTC; status: `PRE_REGISTERED / R01_NOT_RUN / 09.6.3_NOT_AUTHORIZED`.** This record contains only public commitment and provenance metadata. **No sealed criteria, expected responses, nonce, trade/account data, or evaluator-only oracle bytes** are stored in this repository.

## Scope and immutable test sources

- Repository: `vbondarev/crypto-trading-agent`, working PR #1 on `feature/initial-agent-mvp`, Draft/Open/unmerged.
- **Normative policy pinned Git commit:** `d8a162342cba57803ddbd0efdb1e53c373e9406e` — frozen in [the accepted 09.6.1 preflight](stage-09-06-01-preflight.md); after this commitment the branch HEAD will differ. Independently test against the **exact fixed SHA**, never by default branch HEAD.
- Public input `tests/fixtures/stage-09/inputs.v1.json`: pinned **Git Blob** `965c12afa0c4afc4c0b1698732e61c597d351b88`. Its six unique relevant cases are `S09-018` to `S09-023`, fixture version 1, prompts P08-18–P08-23, each synthetic at `2026-10-20T12:00:00+03:00`.
- Mandatory existing source file/Skill manifest (path + Git Blob SHA) is in [09.6.1 preflight](stage-09-06-01-preflight.md) and [09.6.1 self-review](stage-09-06-01-self-review.md). The speculative paths `docs/prompts/strategy-planning.md` and `docs/prompts/strategy-recommendation.md` are **NOT_FOUND** and **not** valid required sources; do not pretend they were fetched.
- The six synthetic fixture inputs were not edited. No other case, normative policy or historical run was changed.

## Six precommitted private ORIGINAL SHA-256 digests

Exactly one freshly generated **distinct original evaluator-only oracle** per run, with an independent cryptographically random nonce and **ten frozen mandatory rubric conditions**. Each original was written **before** this public commitment and before any tested model invocation; a separate byte-identical JSON backup and a separate ZIP archive member were created per run, and all 18 copies were reread byte-for-byte/hashed.

| Case / run | Private original basename (NOT included here) | Original UTF-8 bytes | Mandatory criteria | SHA-256 of exact original and backups |
|---|---|---:|---:|---|
| `S09-018-R01` | `S09-018-R01_PRIVATE_ORACLE.json` | 2565 | 10 | `681e6b1892afae9c72836f4326eb6973f208d021ec5299487546f441aa6f5836` |
| `S09-019-R01` | `S09-019-R01_PRIVATE_ORACLE.json` | 2492 | 10 | `77a0072d54a31ff50196bbbb56e52503802daf70f45eb39052d462668e8db413` |
| `S09-020-R01` | `S09-020-R01_PRIVATE_ORACLE.json` | 2607 | 10 | `bfa3c9a296684c7893ef46a7e64eb54ef330c1fc263469897961842bcd7c14ab` |
| `S09-021-R01` | `S09-021-R01_PRIVATE_ORACLE.json` | 2565 | 10 | `ae40e1d42652ff69704859315211c015b718d0c75969c16c92dd2201ecb5d070` |
| `S09-022-R01` | `S09-022-R01_PRIVATE_ORACLE.json` | 2680 | 10 | `8f8abf2c0df6d3b61e86b1c33695464b67bef91c220cba86deabc69cf96e3b6e` |
| `S09-023-R01` | `S09-023-R01_PRIVATE_ORACLE.json` | 2624 | 10 | `ac0e293b8e07ce2db3f9a94b700ad6682f455298e154ff300afd91a13eaef2d1` |

## Original and backup custody (evaluator only, never paste into Temporary Chat)

- Six original standalone oracle files: `/mnt/data/private_evaluator/stage-09-06/originals/`.
- Six independently stored JSON backups: `/mnt/data/private_evaluator/stage-09-06/backups/`.
- Six independently stored per-run ZIP archives: `/mnt/data/private_evaluator/stage-09-06/archives/`.
- Evaluator-only record: `/mnt/data/private_evaluator/stage-09-06/INTERNAL_MANIFEST.json`.
- Private directory/JSON permissions were constrained for the current runtime; these **session-local paths are not a claim of long-term external persistence or an encrypted backup**. Before an authorized 09.6.3 execution, confirm that the **same original and backup** are still available. Absence of original ⇒ **FORMAL_INCONCLUSIVE**, not reconstruction from backup and not an automatic exception.

## Strict prospective blind-test protocol

1. This GitHub commitment MUST be verified as **published before each tested agent first response**. The exact GitHub commitment commit SHA must be recorded by the evaluator before issuing R01 prompts.
2. A fresh **Temporary Chat outside Crypto Project** per case; read mandatory file/Skill bodies from the immutable policy SHA. Request only `user_message` and `payload` for one selected unique case. No prior failed responses, scoring rules, private oracle, nonce, hidden rubric, expected numerical conclusions or developer feedback in test prompt.
3. Capture the first full, unchanged model response; document source-loading method, model if known, input/ref, precise test clock, session provenance, real execution time and independently obtain post-run user attestation.
4. **After** the tested model output, re-read/hash the actual original standalone private oracle and independent backup + ZIP member. Hash must match the registered SHA and byte count. Evaluate 10 mandatory checks using only the unchanged original and record PASS/FAIL per item, including any critical/major severity and all real provenance limitations. Never waive a mandatory criterion to make a case PASS.
5. Corrective attempts require new `run_id`, new oracle original/backup and public precommitment **before** new first response; historical originals and failures remain immutable.
6. Prior stage `S09-015-R02` user-approved ZIP-only exception **does not carry forward**: 09.6 requires actual original standalone file verification.
7. No live Bybit data/API/key/account, real order or bot action, R3 READY, real F/A/H/R proof or trading approval. PR #1 remains Draft.

**Current gate:** `09.6.2 ORACLES_CREATED / PUBLIC_COMMITMENT_PUBLISHED / INDEPENDENT_RUNS_0_OF_6 / USER_REVIEW_PENDING`. **Do not begin 09.6.3** without a separate explicit user decision. No 09.6 actual-run record is created by this registration.
