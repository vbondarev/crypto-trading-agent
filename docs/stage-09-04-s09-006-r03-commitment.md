# S09-006-R03 — preregistered sealed oracle commitment

> **PRE-REGISTERED / NOT_RUN — 2026-11-05.** This commitment was written after the versioned E03 policy fix and before any R03 independent LLM run. The private oracle is not included in this repository.

| Field | Fixed value |
|---|---|
| Run ID | `S09-006-R03` |
| Case / prompt | `S09-006` / `P08-06` |
| Fixture version | `1` |
| **Pinned post-fix policy commit** | `84b5043f442f4d976e17adb6e4f624361086fb34` |
| Public fixture Git blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Original private oracle | `S09-006-R03_PRIVATE_ORACLE.json` — evaluator-only, in `/mnt/data/private_evaluator/`, not GitHub |
| Exact private JSON bytes | `2385` |
| Sealed at UTC | `2026-11-05T16:44:57.811442+00:00` |
| Algorithm | SHA-256 over original exact UTF-8 JSON bytes, including a fresh private 32-byte nonce |
| **Sealed SHA-256** | **`4f87bb30d05e60d507bf68e6788d6646ced3802e3214384580a29637177872eb`** |
| Mandatory private checks | 10 |
| Test status | **NOT_RUN** |
| Previous runs | R01 `INCONCLUSIVE`; R02 `9/10 FAIL_MINOR`; neither retrospectively upgraded |

## Procedure

1. Preserve original private oracle bytes in evaluator-only storage; do not expose grading rules or R01/R02 answers to tested agent.
2. Start a **new** Temporary Chat outside Crypto project, not the R01/R02 sessions.
3. Explicitly read normative files from **exact pinned post-fix commit** in this record. Any HEAD or old pinned commit invalidates the policy comparison; report exact Git blobs.
4. Submit ONLY the public `S09-006` case's original `user_message` and `payload` from `tests/fixtures/stage-09/inputs.v1.json`; no historical output, oracle, evaluation or hints.
5. Save full first unedited agent response (including any tool errors) and its initialization report, attest session status.
6. Before evaluation, re-hash original private oracle; hash MUST equal published commitment; if missing/mismatch, `FORMAL_INCONCLUSIVE` (do not create a substitute).
7. Score with sealed mandatory checks, append outcome to separate actual-runs journal. Static checks are not independent LLM results.

See [E03 versioned fix validation](stage-09-04-s09-006-e03-fix-validation.md). No real market calls, trading or R3. Stage 09.4 remains PARTIAL and PR #1 Draft pending independent evidence.
