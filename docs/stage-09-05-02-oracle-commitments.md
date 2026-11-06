# Stage 09.5.2 — pre-registered sealed oracle commitments (S09-013–S09-017)

> **CREATED BEFORE ANY 09.5.3 INDEPENDENT MODEL INVOCATION — 2026-11-06.**
>
> Status: `PRE_REGISTERED / NOT_RUN`. This document contains **public hashes and provenance only**. Hidden mandatory criteria, oracle nonces and expected answers are stored in **private evaluator-only original files**, not in GitHub and not to be passed into tested Temporary Chats.
>
> **Only step 09.5.2 was authorized.** This commitment does not authorize 09.5.3 test invocation, portfolio access, real Bybit APIs or trades. PR #1 remains Draft.

## Immutable source provenance

- Repository: `vbondarev/crypto-trading-agent`.
- Pinned **normative source commit SHA** (frozen and verified during approved 09.5.1 preflight): `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`.
- Synthetic public fixture: `tests/fixtures/stage-09/inputs.v1.json`, Git blob `965c12afa0c4afc4c0b1698732e61c597d351b88`.
- Fixture clock: `2026-10-20T12:00:00+03:00`, `SYNTHETIC_ONLY`.
- 09.5.1 preflight: [source and Skill manifest](stage-09-05-01-preflight.md) and [formal acceptance](stage-09-05-01-acceptance.md).
- Five original private evaluator-only files created at `2026-11-05T22:43:58.343332+00:00` (same instant corresponds to 2026-11-06 01:43:58 MSK). Each has 10 frozen mandatory evaluation criteria, an independent random nonce and evaluator-only source metadata. File lengths below are **raw UTF-8 bytes**.

## Exact original-file SHA-256 commitments

| Case / run | Private original filename (not public) | Bytes | Mandatory checks | Precommitted SHA-256 |
|---|---|---:|---:|---|
| `S09-013-R01` | `S09-013-R01_PRIVATE_ORACLE.json` | 3219 | 10 | `47ae74e6046b472e8a0f731471b11532ca802e546a9534d74bfac71ff5433efa` |
| `S09-014-R01` | `S09-014-R01_PRIVATE_ORACLE.json` | 3140 | 10 | `f64b4e352d50bbe5d3d283d6bead4bf2bd52948a001212656839c82dc028c985` |
| `S09-015-R01` | `S09-015-R01_PRIVATE_ORACLE.json` | 2982 | 10 | `a3a038bc243645f1c162edfc2ff82012778ae7bcb09708a6677d4e18f02ad3c2` |
| `S09-016-R01` | `S09-016-R01_PRIVATE_ORACLE.json` | 3009 | 10 | `b1d9eb4ef68c8b37348903c4d29469f97ed77bd94163642d9b6f83914b1c1daf` |
| `S09-017-R01` | `S09-017-R01_PRIVATE_ORACLE.json` | 3008 | 10 | `760b4f44c77d715923b1da77f4917cc214c3495753c49375bc0eb0c1afb4e2fb` |

## Integrity, grading and run gates

1. The original private files and separately stored byte-identical private backups must be preserved **unchanged**, with private oracle criteria and nonces never disclosed to the tested agent.
2. For each independent run, confirm this **commitment is already published and retrievable from GitHub before the first model answer**. Any original private file missing or failing its registered SHA-256 after response ⇒ `FORMAL_INCONCLUSIVE` and no retrospective oracle reconstruction.
3. Invoke only the public `user_message` and `payload` for the selected unique fixture `case_id`, with **explicit fixed source commit** and independently confirmed full read of the mandatory normative/Skill manifest. Each S09-013–S09-017 requires its **own fresh Temporary Chat outside Crypto Project**.
4. Capture the first complete, unedited answer as a distinct user-provided artifact and request a separate **post-run user attestation**. Absence of authenticated ChatGPT tool/session trace must remain `USER_ATTESTED`, not technically certified.
5. Each immutable mandatory criterion must be observed PASS. Missing or failed mandatory criterion blocks that case; preserve all historical attempts in the separate 09.5 actual-run ledger after execution authorization. Evidence-level `NOT_EVALUABLE` is not a grading PASS by itself.
6. `S09-012-R01` is a historic **09.4** reference only and must not be counted as a new 09.5 run.

No trading action, bot activation, real `READY`, independent test or new run ledger is performed or implied by this registration.
