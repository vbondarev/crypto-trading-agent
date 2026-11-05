# Stage 09.5.1 — formal user acceptance of preflight

**Decision date:** 2026-11-06.

**Final status:** `09.5.1 COMPLETED / APPROVED / DOCUMENTARY_PREFLIGHT`.
**Next gate:** `09.5.2 NOT_STARTED / WAITING_FOR_SEPARATE_USER_AUTHORIZATION`.

## Explicit user decision

The user states: “Принимаю результаты шага 09.5.1 и его self-review. Зафиксируй формальную приёмку в GitHub. К выполнению 09.5.2 пока не переходи.”

This authorizes recording the acceptance of **09.5.1 only**, and explicitly **does not authorize** creation of private oracle files, public commitments, evaluation runs, stage 09.5.2 work, live Bybit requests, trades, real `READY`, or PR merge.

## Accepted evidence

- [Frozen-source preflight](stage-09-05-01-preflight.md) with immutable normative source pin `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`.
- [Post-implementation critical self-review](stage-09-05-01-self-review.md), documentary `SELF_REVIEW_PASS`. One initially miscopied SHA was corrected and all **18/18** listed provider-reported Git blob hashes and JavaScript UTF-16 file lengths rechecked against fresh file fetches using the exact source pin.
- Input fixture `tests/fixtures/stage-09/inputs.v1.json`, Git Blob `965c12afa0c4afc4c0b1698732e61c597d351b88`, contains precisely five planned new cases `S09-013`–`S09-017` with fixed test time and P08-13–17. It was **not modified**.
- `S09-012-R01` remains historical cross-stage coverage under 09.4, **not** a new 09.5 execution. Stage 09.4 recorded 12 accepted cases in 18 historical runs.
- RT04/RT05, T02–T05, AD-009, H01, S0–S3 and applicable FR negative gates traced to the five cases. Full numerical S3/FR-038 remain `NOT_EVALUABLE / NOT_PERFORMED`.

## Evidence limitations still OPEN

- Git Blob SHA values were returned by GitHub connector, not independently computed from a local Git checkout; reported JavaScript `.length` denotes UTF-16 code units, not raw byte count.
- Source retrieval during preflight is not proof of automatic Skill loading or tool behavior in a fresh, independent ChatGPT session.
- Cross account MMR, strict Short loss upper bound, live platform P02, independent Skills-loader evidence, real F/A/H/R stress and technical Temporary Chat session provenance remain unavailable or outside the synthetic step.
- No original private oracle, preregistered hashes for S09-013–017, 09.5 actual-run ledger or new independent tests have been created by this acceptance.

## Formal decision

`09.5.1 = COMPLETED / APPROVED` within the stated documentary and synthetic scope.

`09.5.2 = NOT_STARTED`; **wait for a distinct explicit instruction from the user to begin 09.5.2**. Steps 09.5.3–09.5.6 and 09.6–09.9 remain `NOT_STARTED`. PR #1 remains **Draft/Open**.
