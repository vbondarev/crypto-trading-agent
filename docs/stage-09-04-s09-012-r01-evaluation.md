# S09-012-R01 — independent sealed-oracle evaluation and acceptance

## Frozen evidence
- Case `S09-012`, run `S09-012-R01`, fixture `v1`, prompt `P08-12`.
- Pinned normative commit: `ea12ab9ae3c865bddd1455b01dae47357e6dc9cc`.
- Fixture Git Blob: `965c12afa0c4afc4c0b1698732e61c597d351b88`.
- Public sealed commitment written **before the independent run**: `docs/stage-09-04-s09-012-r01-commitment.md`, commit `80758d3530ff186fd919d4af54a15a76fcc06445`.
- Original evaluator-only private oracle `S09-012-R01_PRIVATE_ORACLE.json`: 4126 bytes, SHA-256 `9d8098e696a41d7bba4e1efa469582e7fef6966d0eecf7811993f53a114b1023`; verified against preregistered hash before scoring. Oracle was not provided to tested agent.
- Original complete answer: user attachment `Вставленный текст(4).txt` in evaluation conversation. No authenticated session/tool export.

## Frozen mandatory evaluation

| Criterion | Verdict | Tested observation |
|---|---|---|
| E01 | PASS | Synthetic-only at fixed 2026-10-20 12:00 Moscow time; no live API, trades or bot activation |
| E02 | PASS | Unique `S09-012` source at pinned revision, declared account T02 and Equity 1000 USDT |
| E03 | PASS | SOL 50 Long Cross and BTC 0.01 Short Isolated distinguished; both positionIdx 0 |
| E04 | PASS | SOL IN order SYN-A leavesQty 5 versus BTC OUT SYN-B leavesQty 0.01; no premature execution or false netting |
| E05 | PASS | Declared `ALL_USDT_PERPETUAL_SYNTHETIC` scope not misinterpreted as independently demonstrated T02 completeness |
| E06 | PASS | `account_mmr=UNKNOWN` blocks verified margin safety and liquidation-distance conclusions |
| E07 | PASS | Cross versus Isolated risks and collateral requirements kept distinct |
| E08 | PASS | Hard limits not assumed satisfied; two reported slots versus maximum three, conditional 30%/5% bounds, unknown leverage and IM/MM |
| E09 | PASS | Lists synchronized account state, Mark, IM/MM/MMR, margin tiers, order flags/execution, bot obligations and risk inputs |
| E10 | PASS | Audit concludes UNVERIFIED and NEEDS_DATA; no ungrounded READY, REJECTED, R3 approval or trading |

**Original content evaluation: 10/10 PASS.** Fixture and oracle remained unchanged.

## Post-run user provenance confirmation

User explicitly confirmed this was the first full, unedited answer from a fresh Temporary Chat outside Crypto, without regeneration or prior-test hints. This is user attestation; independent technical session attestation is **not** available. Hence acceptance tier: `FORMAL_ACCEPTED_USER_ATTESTED`; `formal_independent_technical_attestation=false`.

## Formal verdict

- `content_verdict=PASS` / `10_OF_10`
- `formal_case_accepted=true`
- `session_isolation=NEW_TEMPORARY_CHAT_OUTSIDE_CRYPTO_PROJECT_USER_ATTESTED`
- `oracle_integrity=SHA256_VERIFIED`
- `trading_authorization=NONE`

Record is appended to `tests/fixtures/stage-09/r1-r2-actual-runs.v1.json`. Stage 09.4 requires full aggregate audit before closure, and PR #1 remains Draft until explicitly reviewed.
