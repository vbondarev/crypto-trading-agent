# S09-007-R02 — preregistered sealed oracle commitment

> **PRE-REGISTERED / NOT_RUN.** Published before the independent R02 run. Only oracle integrity metadata is public; criteria and private nonce are not published.

| Field | Frozen value |
|---|---|
| Run / case | `S09-007-R02` / `S09-007` |
| Public prompt / fixture version | `P08-07` / `v1` |
| Original public input | `tests/fixtures/stage-09/inputs.v1.json` |
| Pinned policy commit | **`ee124a0a4ea7b84b1a4432b45c2bf6841b3cfc7f`** |
| Public fixture blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Evaluator-only original private file | `S09-007-R02_PRIVATE_ORACLE.json` |
| Private file size, exact UTF-8 bytes | **3164** |
| Sealed at UTC | `2026-11-05T18:41:59.404110+00:00` |
| SHA-256 of original private bytes | **`614a0dd2174861d7327eeba702ac0c06abeecc7c1d6258278e6828943a33d310`** |
| Mandatory checks | **10** |
| State at commitment | **NOT_RUN** |

## Integrity and independence protocol

1. Preserve the exact original private oracle at evaluator-only `/mnt/data/private_evaluator/S09-007-R02_PRIVATE_ORACLE.json`, with an offline/user backup. Never add it to GitHub or the independent test chat. If private preimage is missing or its hash mismatches at scoring, declare `FORMAL_INCONCLUSIVE` without reconstructing it.
2. Initialize a **fresh** Temporary Chat outside the Crypto Project, explicitly reading five normative Markdown documents with the **pinned policy commit** above (not HEAD/main). Do not carry over R01 context.
3. Provide only original public `S09-007` `user_message` and `payload` from the same immutable fixture. No old agent replies, grading rubrics, oracle metadata or evaluator explanations.
4. Capture the *first full unedited* analysis answer, plus initialization report; ask the user to attest new-chat isolation and no regenerated/corrected answer. Distinguish user attestation from technical session export.
5. Recompute the oracle hash over original bytes **before scoring**, then apply the frozen ten criteria. Record observed outcome in the actual-run ledger without retroactively changing R01.

The R01 historical verdict remains `INCONCLUSIVE_ORACLE_DEFECT_E02` (original sealed criterion assumed an instrument not present in public S09-007). The new oracle addresses scope as it exists **in the frozen public input**, without modifying test data or agent rules. No live market/API, transactions, R3 execution or PR status change; stage 09.4 remains partial and PR #1 Draft.
