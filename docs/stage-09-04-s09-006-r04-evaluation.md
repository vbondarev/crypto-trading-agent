# S09-006-R04 — sealed-oracle content evaluation (2026-11-05)

## Frozen source and oracle integrity

- Run: `S09-006-R04`, case `S09-006`, P08-06, fixture v1, synthetic-only R2.
- Pinned post-E03 policy commit: `84b5043f442f4d976e17adb6e4f624361086fb34`.
- Source fixture Git blob: `965c12afa0c4afc4c0b1698732e61c597d351b88`, independently re-fetched.
- Prior preregistration: [R04 commitment](stage-09-04-s09-006-r04-commitment.md), published at GitHub commit `4e7539422b91df5fd98b4a07703de65d9beb6933` before independent run.
- Private evaluator oracle `S09-006-R04_PRIVATE_ORACLE.json`, exact size `3978` bytes; actual file SHA-256 recomputed locally: `696d63684bac765aaaf08d7ce3ee3af2082c815fc355c1cc4caa87428e05080d`. **MATCH** to precommitted hash. No private nonce, preimage or rubric committed.
- User supplied initialization report (5/5 pinned files, explicit-read self-report) and complete apparent R04 analysis reply in development conversation.
- No separately recorded user attestation yet for *this run* confirming a fresh Temporary Chat outside Crypto project and first unmodified response without regeneration. It is a requested test protocol but cannot be assumed.
- No technical attestation of ChatGPT runtime/GitHub invocations or byte-authenticated transcript.

## Pre-registered mandatory checks: 10/10 content PASS

| Check | Verdict | Visible evidence |
|---|---|---|
| E01 | PASS | All quotations and indicators marked synthetic; no real-source/transaction claims. |
| E02 | PASS | Pinned commit, exact original fixture blob, unique S09-006, SOLUSDT Bybit perp, 100 USDT Mark at 11:59 vs 12:00 synthetic now. |
| E03 | PASS | 110 1h/90 4h; final 1h closes at exact boundary 12:00, final publication explicitly unverified; using all 110 explicitly conditional and also computes 109-bar exclusion. |
| E04 | PASS | Six OHLCV fields, chronological gaps, finite prices, valid bars; volume unit and price kind not invented. |
| E05 | PASS | 27 4h overlaps mismatch, exact reproducible 07:00–11:00 example, refuses unified directional interpretation. |
| E06 | PASS | EMA20/50, Wilder RSI14/ATR14, 20-bar returns correct within rounding; conditional boundary treatment. |
| E07 | PASS | Reasoned WAIT, no unsupported Long or Short; identifies data reconciliation as condition to revisit. |
| E08 | PASS | Separates Mark=100 at 11:59 (one minute) from close, flags unexplained difference without asserting error. |
| E09 | PASS | No trades, bot configuration, margin/liquidation guarantees, fabricated portfolio values, unjustified READY, or R3. |
| E10 | PASS | Contradictions and missing BTC/OI/funding/orderbook etc clearly flagged; R2_PRELIMINARY/WAIT and non-ready conclusion. |

**Sealed content verdict: `CONTENT_PASS / 10_OF_10`.**
**Formal acceptance: `PROVENANCE_PENDING`, not yet `formal_case_accepted=true`.** Require explicit user attestation about fresh non-project session and first complete unedited model answer; recorded afterward as *post-run attestation*, not technical independent session proof. Preserve R01 INCONCLUSIVE, R02 FAIL_MINOR, R03 INCONCLUSIVE unchanged.

## Deterministic spot checks

Independent GitHub fixture recomputation (not dependent on another language-model judgment):

| Series | EMA20 | EMA50 | RSI14 | ATR14 |
|---|---:|---:|---:|---:|
| 1h, 109 bars excluding boundary | 102.5485 | 101.9972 | 85.24 | 2.3055 |
| 1h, all 110 conditionally | 102.6846 | 102.0749 | 86.09 | 2.3188 |
| 4h, all 90 | 100.9300 | 101.3814 | 33.94 | 2.2792 |

All 90 four-hour price/volume tuples equal the first 90 one-hour tuples but timestamp steps differ; they are not meaningful 4h aggregations. Example at 07:00–11:00 MSK: 4h `[100.2417,101.4907,99.2417,100.4907,945]` vs aggregated 1h `[103.6850,105.3076,102.4111,103.8454,4130]`. The last 1h close boundary equals synthetic clock.

## Scope / next action

Do not move PR #1 out of Draft; no real market or execution. Do not change frozen fixture or R04 oracle. On receipt of user confirmation, append a **dated post-run attestation** and update journal/acceptance, explicitly noting absence of technical session authentication. Stage 09.4 stays partial until evidence recorded; 09.5+ not started.


## Post-run independent-session attestation — 2026-11-05

**User confirmation received after the first submitted response** in the development conversation: the S09-006-R04 answer was produced in a **new Temporary Chat outside Crypto Project**, was the **first full model answer**, and had **no corrections, regeneration, or hints about results of earlier tests**. This is a **user attestation**, not a technically authenticated ChatGPT session export. It does not change the original response text, private oracle bytes, or previously scored mandatory checks.

- `session_isolation = NEW_TEMPORARY_CHAT_OUTSIDE_CRYPTO_PROJECT_USER_ATTESTED`
- `first_response_unmodified = USER_ATTESTED`
- `content_rubric = PASS (10/10)`
- `oracle_precommitment_integrity = SHA256_VERIFIED`
- `formal_case_accepted = true` **under the user-attested independent-test protocol**, not under technical-session attestation.
- `formal_independent_technical_attestation = false`
- `S09-006 = ACCEPTED_WITH_USER_ATTESTATION`; R01–R03 unchanged.

A bookkeeping caveat: the actual-runs ledger has S09-001-R02 `PASS` (9/9) without an explicit `formal_case_accepted` field. Do not silently rewrite that historical record. The cumulative accepted-scenario total should distinguish the prior historically stated 5/12 from the number having explicit boolean acceptance in the machine-readable ledger, pending separate reconciliation.
