# S09-012-R01 — public sealed oracle commitment

> **PRE-REGISTERED / NOT_RUN.** Published before any independent S09-012-R01 test answer. The private rubric and nonce are not included in this document.

| Field | Frozen value |
|---|---|
| Scenario / run | `S09-012` / `S09-012-R01` |
| Fixture version / prompt | `v1` / `P08-12` |
| Public source | `tests/fixtures/stage-09/inputs.v1.json` |
| **Pinned normative policy commit** | **`ea12ab9ae3c865bddd1455b01dae47357e6dc9cc`** |
| Fixture Git blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Evaluator-only original file | `S09-012-R01_PRIVATE_ORACLE.json` |
| Exact private file size | **4126 UTF-8 bytes** |
| Created at UTC | `2026-11-05T21:20:54.920877+00:00` |
| Original private file SHA-256 | **`9d8098e696a41d7bba4e1efa469582e7fef6966d0eecf7811993f53a114b1023`** |
| Mandatory criteria | **10** |
| Status on publication | **NOT_RUN** |

## Independent blind-run procedure

1. Preserve the original sealed evaluator-only file `/mnt/data/private_evaluator/S09-012-R01_PRIVATE_ORACLE.json` without edits, with an offline byte-identical backup. **Do not** upload it to GitHub, the tested agent, or a new Temporary Chat. If original bytes become unavailable or fail the committed SHA-256 check, report `FORMAL_INCONCLUSIVE` without reconstructing the oracle after the test.
2. Start a **fresh Temporary Chat outside Crypto Project**. Explicitly read the five normative documents strictly at the pinned commit above; include reported blob SHAs, text lengths and integrity results.
3. Execute **only** the original public `user_message` and `payload` for the unique `cases[]` object with `case_id=S09-012`. Do not load prior stage 09 results, evaluator comments, scoring documents or other fixture cases.
4. Preserve the **first full unmodified response** and initialisation report. After execution the user separately confirms independent Temporary Chat, no regeneration, no edits or hints from previous tests. User attestation is not technically authenticated session provenance.
5. Rehash the original precommitted oracle before evaluating any response, then score all **ten frozen mandatory criteria**. Record the real verdict in the append-only actual-run ledger, retaining historical records.

All inputs are synthetic. No live Bybit/API requests, account operations, bot launches, real trades or R3 authorization. Stage 09.4 remains partial until all relevant cases are evaluated, formally accepted and reviewed; PR #1 stays Draft.
