# S09-007-R01 — sealed oracle preregistration

> **PRE-REGISTERED / NOT_RUN.** This public record was committed before independent S09-007-R01 execution. It contains only provenance and cryptographic commitment; the private scoring criteria and nonce are not published.

| Field | Fixed value |
|---|---|
| Case / run | `S09-007` / `S09-007-R01` |
| Public prompt | `P08-07` |
| Fixture | `tests/fixtures/stage-09/inputs.v1.json`, v1 |
| **Pinned policy commit** | `bc5a1801f7e6a641482117118db9704b97e0d24d` |
| Fixture Git blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Evaluator-only original oracle | `S09-007-R01_PRIVATE_ORACLE.json` (never commit or send to tested agent) |
| Exact UTF-8 file size | **2998 bytes** |
| Created/sealed at UTC | `2026-11-05T18:24:31.040614+00:00` |
| SHA-256 exact preimage | **`9bf89691ada131747f6c9b35a546348f569aaa3b317428bd134954be2691ee14`** |
| Private mandatory checks | **10** |
| Test state when preregistered | **NOT_RUN** |

## Protocol and preservation

1. Original private bytes are saved in evaluator-only `/mnt/data/private_evaluator/S09-007-R01_PRIVATE_ORACLE.json`. Before evaluation, independently recompute SHA-256 against these exact preregistered bytes. Retain a byte-identical offline backup; if unavailable or mismatch, verdict `FORMAL_INCONCLUSIVE`. Never regenerate oracle after observing the answer.
2. Start fresh Temporary Chat outside Crypto project. Explicitly fetch five normative files strictly using **pinned commit** above, not HEAD/default branch. Record blob SHA, length, and self-reported reading status.
3. Submit only `S09-007` public `user_message` and `payload` from fixture. The fixture contains other test cases: do not use them. Do not reveal oracle, historical tests, scoring expectations or prior answers.
4. Preserve the original *first* response and initialization; user independently attests session isolation, no regeneration, no hints. Technical ChatGPT session authentication remains separate and cannot be implied by user attestation.
5. Only after reply, verify original oracle hash and score 10 mandatory checks. Record result in append-only actual-runs file, preserve historical planning manifest and earlier verdicts.

**Constraints:** synthetic-only R2 reasoning; no live Bybit data/API, real trading, orders, R3, or risk-limit changes. Progress through stage 09.4 is still partial; PR #1 remains Draft.
