# S09-011-R01 — sealed-oracle public commitment

> **PRE-REGISTERED / NOT_RUN.** Published before the independent blind execution. Only the provenance, digest and protocol are public. The private rubric and nonce are excluded.

| Parameter | Precommitted value |
|---|---|
| Case / run | `S09-011` / `S09-011-R01` |
| Public prompt | `P08-11` |
| Fixture | `tests/fixtures/stage-09/inputs.v1.json`, v1 |
| Pinned normative commit | **`0e5b31d9394806b1e019787f6198c434bf927512`** |
| Fixture Git blob SHA | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Evaluator-only filename | `S09-011-R01_PRIVATE_ORACLE.json` |
| Exact private byte count | **2925** |
| Original creation UTC | `2026-11-05T20:55:59.615933+00:00` |
| SHA-256 of original private bytes | **`a47f1102624deed87fd22fe1ea52a730d9d598777fc14e3751bffbb31444ec6a`** |
| Mandatory criteria | **10** |
| Status at registration | **NOT_RUN** |

## Independent test instructions

1. Preserve the unmodified original private oracle in evaluator-only `/mnt/data/private_evaluator/S09-011-R01_PRIVATE_ORACLE.json`, with a separate byte-identical backup. Do not provide the oracle to the tested agent or publish its contents.
2. Start a fresh Temporary Chat outside the Crypto project. Explicitly read all five normative Markdown files with the pinned policy commit above (not HEAD or the latest branch). Record status and Git blob integrity for every file.
3. Execute **only** the original `user_message` and `payload` of the unique `S09-011` object from the pinned fixture. Do not supply previous tests, assessor notes or rubric.
4. Capture the **first complete unedited model answer** and initialization report. After submission, separately obtain user attestation of fresh-chat isolation, no regeneration and no feedback about preceding tests. Such attestation does not establish technical session authentication.
5. Before scoring, recompute SHA-256 over the same original private file. A missing/mismatched original requires `FORMAL_INCONCLUSIVE`; never recreate or silently adjust the oracle after seeing the model answer.
6. Score all ten frozen mandatory checks and append the true outcome to the actual-run ledger, without overwriting earlier run records.

All input is fictional and for analysis only. No real Bybit API, actual positions, bot configuration, orders, portfolio changes, or R3 trading approval. The historical planning ledger and fixture remain unchanged. Stage 09.4 is partial; PR #1 Draft.
