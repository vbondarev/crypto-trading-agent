# S09-009-R01 — pre-registered sealed oracle commitment

> **PRE-REGISTERED / NOT_RUN.** This is a public digest of the original evaluator-only scoring document, committed before any independent S09-009-R01 answer. The private rubric and nonce are not public.

| Field | Fixed value |
|---|---|
| Case / run | `S09-009` / `S09-009-R01` |
| Fixture version / prompt | `1` / `P08-09` |
| Source fixture | `tests/fixtures/stage-09/inputs.v1.json` |
| Pinned normative policy commit | **`9caa0327abc990850c10dfccba472922c592471f`** |
| Fixture Git blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Private original filename | `S09-009-R01_PRIVATE_ORACLE.json` |
| Private UTF-8 byte length | **3884** |
| Original created UTC | `2026-11-05T19:17:17.261355+00:00` |
| Private file SHA-256 | **`4384343c4fff2e3b29e8f958711d0db9be2161313ae7ea6fc1aeb9c8da332bfc`** |
| Mandatory pre-committed checks | **10** |
| Case state at commit | **NOT_RUN** |

## Controlled independent procedure

1. Keep private original `/mnt/data/private_evaluator/S09-009-R01_PRIVATE_ORACLE.json` out of GitHub and test agent's context; preserve byte-identical backup. If original preimage is missing or SHA-256 later fails, evaluation must be `FORMAL_INCONCLUSIVE`, never reconstructed post-hoc.
2. Open a **new Temporary Chat outside Crypto project**, not a continuation of an earlier test.
3. Fetch five normative Markdown files explicitly using the pinned commit shown above (not HEAD/main), and report their actual blob identifiers/lengths. Do not load sealed rubric or earlier S09-001–S09-008 test results.
4. Send only the original public `user_message` and `payload` of `cases[]` entry `case_id=S09-009` from fixture version 1. The broader fixture has other scenarios which must not be used.
5. Preserve first complete unedited answer and initialization report. Obtain explicit user's after-run attestation of session isolation, no regenerated answer and no previous-test hints. This is not equivalent to a technical session audit.
6. Before grading, independently rehash the original oracle file and compare to the digest above; score all ten frozen criteria. Append immutable run result to actual-runs ledger. Do not rewrite earlier scenarios, private oracle or fixture.

All data synthetic. No real market or Bybit API, trades, account actions, automated bot launch or R3. Stage 09.4 stays PARTIAL, PR #1 Draft.
