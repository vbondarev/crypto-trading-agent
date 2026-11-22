# S09-006-R02 — preregistered sealed oracle commitment

**Status: PRE-REGISTERED / NOT_RUN.** This record is published before the first R02 test invocation. It exposes no private scoring criteria, hidden expected outcome, or evaluator nonce.

| Field | Fixed value |
|---|---|
| Run ID | `S09-006-R02` |
| Case / prompt / fixture | `S09-006` / `P08-06` / `v1` |
| Pinned policy commit SHA | `39ec1f2a0f04cd5762d4b095c9fe9cf3e0046f13` |
| Public fixture blob SHA | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Original sealed oracle private filename | `S09-006-R02_PRIVATE_ORACLE.json` (evaluator-only, outside GitHub) |
| Oracle UTF-8 exact bytes | `3969` |
| Sealed at UTC (recorded in private file) | `2026-11-05T16:20:43.279510+00:00` |
| SHA-256 of exact original oracle bytes | `8a9d4bcb088a1d92a235f54da4288b20f7996e8086ee904231a01460e1e7539a` |
| Number of private mandatory checks | `10` |
| Test status at preregistration | `NOT_RUN` |
| Historical prior R01 | `EXECUTED / PROVISIONAL_PASS / FORMAL_INCONCLUSIVE`; do not retroactively accept it |

## Required sequence

1. Preserve the original private preimage byte-for-byte in an evaluator-only space; neither the private filename's contents nor the evaluation rubric may be shown to the tested agent.
2. Start a **new** independent ChatGPT session outside Crypto Project, not the historical R01 Temporary Chat. Read the same five normative files at the pinned policy commit; record the full initiation report.
3. Submit only the original public S09-006 user message and payload (or retrieve specifically the case via GitHub), retaining the original synthetic test clock. Do not share this file, R01 answer, grader, or hidden rubric with the tested agent.
4. Preserve the full unedited first market reply before evaluation; note whether any regeneration/re-prompt occurred and whether the session is independently user-attested.
5. Before scoring, recompute SHA-256 of the **original** private oracle exact bytes, verify it matches this pre-run commitment, and only then privately apply the sealed criteria. If private preimage is unavailable, verdict is `INCONCLUSIVE`, never reconstructed post hoc.
6. Record observed run in append-only actual runs and retain the pinned baseline unchanged. Independent ChatGPT sessions and user attestation are not technical session exports.

**Scope:** synthetic-only R2; no live market data, API calls, trading, order execution, or R3. No claim that PR #1, stage 09.4, or subsequent stages have been accepted.
