# S09-006-R04 — sealed oracle preregistration

> **PRE-REGISTERED / NOT_RUN**. This record is published before any R04 independent LLM analysis. It intentionally contains no private rubric, oracle nonce, prior failed-check instructions, or model answer.

| Field | Fixed value |
|---|---|
| Run | `S09-006-R04` |
| Case / prompt | `S09-006` / `P08-06` |
| Fixture | `tests/fixtures/stage-09/inputs.v1.json`, version `1` |
| Pinned post-E03 policy commit | `84b5043f442f4d976e17adb6e4f624361086fb34` |
| Fixture Git blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Private sealed oracle (evaluator-only) | `S09-006-R04_PRIVATE_ORACLE.json` |
| Exact UTF-8 byte length | **3978** |
| Sealed at UTC | `2026-11-05T18:06:58.956625+00:00` |
| Hash algorithm | SHA-256 over exact file bytes; private random nonce included |
| **Pre-run SHA-256** | **`696d63684bac765aaaf08d7ce3ee3af2082c815fc355c1cc4caa87428e05080d`** |
| Mandatory private checks | **10** |
| Current execution status | **NOT_RUN** |
| Prior attempts | R01 `INCONCLUSIVE`, R02 `9/10 FAIL_MINOR`, R03 `PROVISIONAL_PASS / FORMAL_INCONCLUSIVE` |

## Preservation / verifier contract

The original private oracle was written in the evaluator working area `/mnt/data/private_evaluator/S09-006-R04_PRIVATE_ORACLE.json` **before this commitment**. The evaluator must preserve a byte-identical copy outside an ephemeral runtime; the user can hold a local backup. Never commit it to GitHub, attach it to the tested agent conversation, or paste its criteria into the test prompt.

To score a response, independently recompute SHA-256 on those **original bytes** and compare to the above preregistered digest **before** opening/applying the grading rules. If a file is missing or its hash mismatches, `FORMAL_INCONCLUSIVE`; do not manufacture a replacement or claim `10/10`.

## R04 independent run procedure

1. Start a **fresh** Temporary Chat outside Crypto project, distinct from R01, R02, R03.
2. Initialize exactly five normative files by GitHub Connector with `ref=84b5043f442f4d976e17adb6e4f624361086fb34`, and report their exact blob SHA, status and lengths. Do not use HEAD/default.
3. Submit the original *public* S09-006 case's `user_message` and `payload` from the immutable fixture. No private oracle, previous answers, evaluations or hints.
4. Record the first full, unedited answer and initialization report, including tool errors, and user-attest new non-project session and non-regeneration. No real markets, Bybit API, orders or R3.
5. Reverify original oracle SHA and apply 10 mandatory checks. Formal acceptance requires all checks and adequate execution evidence. Record in append-only actual runs. Historical runs remain unchanged.

This preregistration is not an R04 test result. PR #1 remains Draft; stage 09.4 partial and stage 09.5+ not started.
