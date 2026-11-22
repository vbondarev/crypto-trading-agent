# Stage 09.5.5 — narrowly scoped integrity-policy exception for S09-015-R02

**Decision date:** 2026-11-08. **Authority:** User explicitly chose the second option (practical acceptance based on a previously sealed cryptographic backup, instead of a new R03). This is a **new, additive, user-approved procedural exception** to the formal original-file-rehash gate, and does **not** retroactively claim that the original standalone oracle was located.

## Scope and controlling distinction
- **Applies only to** `S09-015-R02`, whose independent answer was already received, graded 10/10 provisionally and separately user-attested.
- The approved standard process in `docs/stage-09-05-plan.md` still requires the actual originally saved private file to be available and rehashed. **The standard gate was not satisfied in this R02**; it is explicitly **waived for this run** under user authorization, rather than falsely reported as passed.
- Neither the old rule text nor any original R01, fixture, source pin, sealed oracle, historical score or earlier published report shall be edited. This exception is **not** a generally reusable precedent for future tests; future oracles must retain original-file/backup checking unless a new explicit deviation is approved.

## Evidentiary basis reverified after user's decision
1. The GitHub public commitment `docs/stage-09-05-05-s09-015-r02-oracle-commitment.md` was committed at `b6d87e6b3d084f1ba05b8c72b09f610605b363b1` **before the first R02 model reply**.
2. An existing private ZIP at `/mnt/data/private_evaluator/S09-015-R02-PRIVATE-ORACLE-BACKUP.zip` contains exactly one evaluator-only member `S09-015-R02_PRIVATE_ORACLE.json`; **4,318 UTF-8 bytes**, SHA-256 `a2f563e0eec0228f9c4a7c8895ebb0f4533b0c6b040e3c99296184aca929718c`. This matches the prepublished commitment. The member is valid JSON with exactly 10 frozen `rubric` entries, `case_id=S09-015`, `run_id=S09-015-R02`, source policy SHA `1a0c12f7baba99d2b1dfb7b8afe18ef40034264c` and fixture blob `5cd4c2ef9c8fdfdc572e154d38868941ec253959`.
3. The separate original standalone private oracle file remains **unavailable**; no retrospective replacement from ZIP was created and its original checksum **was not reverified directly**. This is the known, recorded evidence deficit.
4. Full first model answer was user supplied and separately user-attested as first complete unchanged response in a new Temporary Chat outside Crypto, without previous scores, sealed oracle or hints. This is `LLM_BLIND_USER_ATTESTED`, not independently authenticated session/tool traces. Original evaluation `docs/stage-09-05-05-s09-015-r02-preliminary-evaluation.md` found **10/10 content PASS** against the sealed archived rubric, with no observed content failures.
5. Frozen public v2 fixture Git Blob `5cd4c2ef9c8fdfdc572e154d38868941ec253959` and historical v1 fixture blob `965c12afa0c4afc4c0b1698732e61c597d351b88` remain unchanged.

## Limited amended acceptance decision

**Decision:** `S09-015-R02 = ACCEPTED_WITH_USER_APPROVED_BACKUP_EXCEPTION / LLM_BLIND_USER_ATTESTED / CONTENT_PASS_10_OF_10`.

The acceptance is at a **lower assurance tier** than standard original-file-verified acceptance:
- `oracle_sha256_verified_against_original_private_file = false` remains **false**.
- `oracle_backup_zip_hash_verified = true` remains **true**.
- `technical_session_attestation = false` remains **false**.
- `user_approved_procedural_exception = true`, limited to `S09-015-R02`.
- `formal_case_accepted = true` is allowed **under this explicit exception only**.
- The initial `FORMAL_INCONCLUSIVE` determination is preserved as a **historical preliminary assessment**. The later approval is represented as a **new audit event and exception document**, not as a claim the earlier determination was wrong.
- `S09-015-R01` remains permanently `CONTENT_FAIL_9_OF_10 / NOT_ACCEPTED`. A retry cannot erase its original failure.

**Counter after this user-approved exception:** six executed R01/R02 runs, **five distinct accepted cases** (four original full-hash-verified 10/10 PASS cases, plus one 10/10 case accepted with explicitly lowered original-oracle-file assurance). Historical S09-012-R01 is the separate 09.4 reference; counting it yields 6/6 covered scoped case IDs, **not** a sixth new stage 09.5 execution. The unqualified statement `all five passed the standard original-file-rehash gate` remains **false**.

**Next gate:** Stage 09.5.6 final review is still separately required. The stage is **not closed**, PR #1 stays **Draft/Open**, no real market or Bybit account access, orders, bot actions, stress proof or R3 READY are authorized. If a future auditor demands the original-file invariant without exceptions, the R02 assurance deficit remains open and another sealed test is required.
