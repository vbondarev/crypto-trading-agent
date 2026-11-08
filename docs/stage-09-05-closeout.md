# Stage 09.5 — formal user acceptance and closeout

**Decision date:** 2026-11-08.
**Status:** `09.5 COMPLETED / APPROVED_BY_USER / SYNTHETIC_CONTENT_COMPLETE / USER_ATTESTED / ONE_EXPLICIT_BACKUP_ORACLE_EXCEPTION`.
**This is the formal closeout of stage 09.5 only.** The user explicitly approved the final audit and self-review of step 09.5.6, including the narrowly scoped `S09-015-R02` archived-backup oracle exception and all unresolved caveats, and instructed: close stage 09.5 in GitHub, **do not start 09.6, keep PR #1 Draft**.

## 1. Approved evidence and acceptance scope

The user's exact decision in the development conversation:

> Принимаю итоговый аудит и self-review 09.5.6, включая явно зафиксированное исключение S09-015-R02 и все открытые ограничения. Оформи формальное закрытие этапа 09.5 в GitHub. К этапу 09.6 пока не переходи, PR #1 оставь Draft.

Approved audit artifacts:
- [Final 09.5.6 evidence report](stage-09-05-results.md), authored at commit `e8b2f01e9a9327981c64185f8ba04848a46fd37f`, Git Blob `28e8ec6e8a83858133ca0951058db69ba966a3aa`.
- [Adversarial self-review](stage-09-05-06-self-review.md), authored at commit `3f45d5707f6f260a49bef652273edd674700117f`, Git Blob `42faa781d595256f220bdc50d961761358c1efc1`.
- [R02 user-approved exception](stage-09-05-05-s09-015-r02-backup-exception-approval.md) remains part of accepted scope, NOT generalized to any later run.

**What is accepted:** documentation and observed agent behavior in **synthetic** Portfolio & Recovery tests at `LLM_BLIND_USER_ATTESTED` evidence tier, with the declared R02 integrity-method deviation. This is **not** acceptance of real risk calculation performance, historical stress execution, live market access, R3 READY, bot launch or autonomous trading.

## 2. Correct case/run accounting

| Measure | Accepted closure value |
|---|---|
| New 09.5 case IDs | Exactly `S09-013`, `S09-014`, `S09-015`, `S09-016`, `S09-017` |
| Distinct new 09.5 cases accepted | **5/5**, including the explicit R02 exception |
| New actual 09.5 executions | **6**, unique run IDs |
| Mandatory rubric items over five chosen accepted runs | **50/50** content PASS |
| Mandatory rubric items across all six runs | **59/60** with one preserved failure |
| Standard original standalone-oracle rehash among five accepted runs | **4/5** |
| Corrective accepted case | `S09-015-R02`, 10/10 content, **accepted only with approved archived-backup exception** |
| Original failed case | `S09-015-R01`, 9/10; `E09=FAIL`, never accepted, never overwritten |
| Historical 09.4 scoped reference | `S09-012-R01`, existing historic 10/10 accepted, **not** a new 09.5 run |
| Scoped historical+new case coverage | **6/6** distinct IDs, with historic reference counted once |
| Historical 09.4 source journal | **18 executions / 12 distinct accepted cases**; separate and unchanged |

Canonical source journal: [portfolio-recovery actual runs v1](../tests/fixtures/stage-09/portfolio-recovery-actual-runs.v1.json), audit-time Git Blob `99ee5edb616cb27391c2882ff93a5ed8c75c5e93`.
09.4 historical journal: `tests/fixtures/stage-09/r1-r2-actual-runs.v1.json`, Git Blob `437014ce0861d48a82c031de2206414864989f5d`.
Original v1 fixture `tests/fixtures/stage-09/inputs.v1.json`, Git Blob `965c12afa0c4afc4c0b1698732e61c597d351b88`; v2 corrective fixture `tests/fixtures/stage-09/s09-015-r02-input.v2.json`, Git Blob `5cd4c2ef9c8fdfdc572e154d38868941ec253959`. No historical run, fixture or grading result was altered for this closeout.

## 3. Final interpretation of the R02 exception

The original sealed R02 oracle's **separate standalone private file was unavailable after the response**; `oracle_sha256_verified_against_original_private_file=false` remains true as a description of an unmet requirement. A previously preserved private ZIP member matched the **prepublished** SHA-256 `a2f563e0eec0228f9c4a7c8895ebb0f4533b0c6b040e3c99296184aca929718c`, originally committed at `b6d87e6b3d084f1ba05b8c72b09f610605b363b1` before the first R02 answer. Following 10/10 substantive review and user session attestation, the user explicitly approved **one case-specific procedural exception** allowing acceptance at **lower integrity assurance**, which is now carried into the formal stage closure.

This closeout neither rewrites the strict original-file policy nor asserts that `5/5` accepted runs meet the unchanged original-file rehash rule. No retroactive original was reconstructed and no downgrade has been hidden. If a future higher-assurance gate forbids exceptions, this item remains deficient and calls for a fresh sealed test with a new run ID; historical R02 acceptance under the user's selected tier remains documented.

## 4. Scope and unresolved limitations deliberately preserved

- `RV-02` OPEN: authoritative Bybit Cross/UTA collateral, maintenance margin and Mark-to-liquidation model.
- `RV-03` OPEN: robust short-side worst loss/upper bound.
- `RV-04` OPEN: actual Veles/GinArea P02 form/field alignment.
- `RV-06` OPEN: independently verified runtime automatic Skills loader.
- `TV-01` through `TV-04` OPEN: data origin and independent source verification.
- `FR-038` actual F/A/H/R stress **NOT_PERFORMED**; synthetic qualitative handling does not imply stress success.
- Current/complete T02/T03/T04 and true account MMR absent; no reliable real S0/S1/S2/S3 execution-calculated margin/risk approval.
- Historical H01 accounting is a synthetic conditional model, not authenticated linked Bybit trades, true realized exit proceeds or verified recovery.
- Independent Temporary Chat provenance is `USER_ATTESTED`, not authenticated tool traces or immutable session exports; same assistant's review is `LIMITED` rather than externally independent.
- The historic 09.4 `S09-002-R02` first-output caveat remains in its own earlier closeout; nothing in 09.5 silently repairs it.

**No `READY` and no trading permission**, no API keys, real Bybit portfolio, market orders, bot activation, PR merge or automatic deployment are authorized.

## 5. Exact transition gate

`STAGE_09_5 = CLOSED / APPROVED_BY_USER` **under the described synthetic, USER_ATTESTED, one-exception assurance tier**.

`STAGE_09_6 = NOT_STARTED / NOT_AUTHORIZED`. Do **not** plan-execute or begin 09.6 based merely on this approval; require **a separate, explicit user command**.

`PR_1 = OPEN / DRAFT / NOT_MERGED`. This closeout is a documentation-only new GitHub file; do not change PR title, draft status, reviewers or merge state.

**Approved next condition:** user may independently authorize planning/starting 09.6 later. Until then, preserve this exact stage boundary and all open issues.
