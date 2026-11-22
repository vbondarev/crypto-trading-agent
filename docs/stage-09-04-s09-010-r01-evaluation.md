# S09-010-R01 — sealed-oracle evaluation (2026-11-05)

## Fixed evidence and integrity
- Original run: S09-010-R01, case S09-010, P08-10, synthetic-only, fixture v1.
- Frozen normative commit: `10ed0743ee2e62654261ebf8b7205851bd5f23e8`.
- Source fixture Git blob: `965c12afa0c4afc4c0b1698732e61c597d351b88`.
- Original evaluator-only private oracle: `S09-010-R01_PRIVATE_ORACLE.json`, 4352 bytes, original SHA-256 `381a3a5026355ab4679a04c70b96adf5d69735f25a87dee6f0c5d83cee3b51f6`; verified by rehashing on 2026-11-05.
- Public commitment published **before the run** in `docs/stage-09-04-s09-010-r01-commitment.md` at commit `a4214d5c617075334aa5086c9ade514b9605c237`. The digest matches.
- Original apparent first analysis response supplied by user as `Вставленный текст(2).txt`; no authenticated session export or GitHub connector trace, and a separate post-run user attestation of fresh Temporary Chat outside Crypto, no regeneration and no prior-test hints is still **pending**.

## Frozen mandatory checks
| ID | Result | Observed evidence |
|---|---|---|
| E01 | PASS | All values fictional test observations at 2026-10-20 12:00 MSK; no market API/trades |
| E02 | PASS | Pinned S09-010 P08-10 correctly identified as SOL USDT Perpetual, API 403 |
| E03 | PASS | API 403 produced no verified primary Bybit quote; no speculation about the cause |
| E04 | PASS | Screenshot-reported perpetual Last=102 and Mark=100 at 11:59:15 treated as user data, not authenticated API |
| E05 | PASS | Third-party Binance Spot Last=108 at 11:59:30 explicitly distinct from Bybit Perpetual |
| E06 | PASS | Correct cross-source arithmetic: 2 (2%), 6 (5.88%), 8 (8%) with no inferred arbitrage/trade signal |
| E07 | PASS | Test clock distinct from 45s screenshot / 30s spot ages; temporal eligibility does not authenticate sources |
| E08 | PASS | Missing all closed OHLCV; trend, EMA/RSI/ATR, zones and volatility cannot be confirmed |
| E09 | PASS | Only qualitative conditional Short; no entry, SL, TP, grid, leverage or liquidation fabricated |
| E10 | PASS | R2_PRELIMINARY / UNVERIFIED + NEEDS_DATA; no READY/R3 or orders, missing trusted quote and OHLCV, portfolio/bot state deferred to later final check |

**Content result: `PASS / 10_OF_10`** under the unchanged precommitted evaluator criteria.

## Independent deterministic verification
At test clock 12:00 Moscow, screenshot observation age 45 seconds and spot observation age 30 seconds. Perpetual Last-Mark `102-100=2`, `2/100=2%`; Spot-Perpetual Last `108-102=6`, `6/102=5.8823529%`; Spot-Perpetual Mark `108-100=8`, `8/100=8%`. Prices span different sources and markets; these are conditional mathematical differences, not validated basis or arbitrage.

## Status and next action
- `execution_status = EXECUTED`.
- `oracle_sha256_verified_against_private_file = true`.
- `content_verdict = PASS`, `content_rubric_passed = 10`, `content_rubric_total = 10`.
- `conditional_verdict = CONTENT_PASS_10_OF_10_PROVENANCE_PENDING`.
- `formal_case_accepted = false` until user confirms this specific R01 is the first complete unmodified answer from a new Temporary Chat outside Crypto and no hints/re-generation.
- `formal_independent_technical_attestation = false`.

Stage 09.4 remains 9/12 formally accepted until confirmation. PR #1 remains Draft. Do not alter the oracle, fixture or earlier ledger records.
