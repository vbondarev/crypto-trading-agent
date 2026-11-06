# S09-008-R01 — pre-registered sealed oracle commitment

> **PRE-REGISTERED / NOT_RUN.** This commitment is published before any independent S09-008-R01 agent execution. Only hash metadata and the evaluation protocol are public; the private ten-check rubric and nonce are not disclosed.

| Field | Frozen value |
|---|---|
| Run / case | `S09-008-R01` / `S09-008` |
| Public fixture / prompt | `tests/fixtures/stage-09/inputs.v1.json`, `P08-08`, version 1 |
| Pinned normative policy commit | `5edf869ad2690e08792bd014d9ae21380e7d54ed` |
| Public fixture Git blob SHA | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Original private oracle filename | `S09-008-R01_PRIVATE_ORACLE.json` |
| Private exact UTF-8 bytes | **3241** |
| Private sealed timestamp UTC | `2026-11-05T19:05:22.866733+00:00` |
| SHA-256 exact private bytes | **`39363f9fa95e1767d16baebec5cfa634d52110dbd52e3db25f3ec7601a19269d`** |
| Mandatory checks | **10** |
| Status at publication | **NOT_RUN** |

## Preservation and independent evaluation

- The original, unmodified private oracle was created before this commitment at `/mnt/data/private_evaluator/S09-008-R01_PRIVATE_ORACLE.json` and must be backed up outside the ephemeral evaluator runtime. **Do not** commit it to GitHub or disclose it in the test agent's Temporary Chat.
- Start a **fresh Temporary Chat outside the Crypto Project**. Load the five normative files explicitly with the pinned commit, not HEAD/main; report Blob SHA and size.
- Submit only the public case S09-008 original `user_message` and `payload`, not any evaluator instructions, prior answers, or sealed rubric.
- Preserve the first complete unmodified agent answer and initialization report. User attests fresh independent session and absence of regeneration or prior-test hints. This is user attestation, not technical session export.
- Recompute SHA-256 on original private bytes **before** grading; if missing or mismatched, stop with `FORMAL_INCONCLUSIVE` and never retrospectively recreate an oracle.
- Score the ten frozen checks and append outcome to the separate actual-runs journal, without modifying frozen fixture, previous run outcomes, or historical planning ledger.

Synthetic-only analytical testing: no real Bybit API, live trading, order submission, account actions or R3. Stage 09.4 stays partial; PR #1 stays Draft.
