# HYPE-V01 / P02-02 — formal user acceptance of bounded visual mapping

**Acceptance recorded:** 2026-11-11 (Europe/Moscow calendar date; exact chat message timestamp not independently verified).  
**Decision:** `P02-02 COMPLETED / APPROVED_WITH_LIMITATIONS / USER_ATTESTED`.  
**Approved scope:** read-only partial visual inspection of user-provided Veles DCA editor screenshots and associated self-reviews, **not** account or operational readiness.

## 1. Acceptance origin and precise meaning

After reviewing the original P02-02 result and additional evidence steps E02–E04, the user explicitly replied **«Принимаю»** to the offer to accept P02-02 with **all E02–E04 addenda and documented restrictions**. This accepts the *bounded evidence report* and self-review only; it is **not** instruction to create, edit, save, test or launch a bot, execute orders, transition to Stage 06, activate v2, or merge the legacy Draft PR #1.

**Previous acceptance:** P02-01 `COMPLETED / APPROVED_WITH_LIMITATIONS / USER_ATTESTED`, recorded separately in `docs/v2/pilots/hype-v01-p02-01-acceptance.md`.

## 2. Accepted immutable input artifacts and limits

| Step | Artifact | Git blob | Accepted conclusion |
|---|---|---|---|
| P02-02 | `docs/v2/pilots/hype-v01-p02-02-visual-mapping.md` | `8aed2ce357e270f4d471391e6195ba90fd932284` | S1–S3: 19 visual UI elements, partial mapping only |
| P02-02 self-review | `docs/v2/pilots/hype-v01-p02-02-self-review.md` | `a3bdb23c99760bc1a89c8eb421ffc489d3aa0424` | 7/7 structural checks; material risk/provenance gaps |
| E02 | `docs/v2/pilots/hype-v01-p02-02-e02-visual-recheck.md` | `a8ffc207043d56270ca0f304c7215e4af59e8070` | S4–S5: `Bybit Futures`, `HYPE/USDT`, `LONG`, `SIMPLE` visually selected; no chosen grid preset; position inclusion looked ON |
| E02 self-review | `docs/v2/pilots/hype-v01-p02-02-e02-self-review.md` | `638928fae6ce445637d79df0c7d2ddd79f78fc08` | 8 findings, no authenticated session/proof of trade |
| E03 | `docs/v2/pilots/hype-v01-p02-02-e03-position-intent.md` | `73e05fb41c6a80e7f525806c58c00f7f582f4f88` | User did not intend to include existing exchange position |
| E03 self-review | `docs/v2/pilots/hype-v01-p02-02-e03-self-review.md` | `22fbe0e17572410cd3bffb04867c3ac65c3c1c67` | 7/7 limited structural/policy checks |
| E04 | `docs/v2/pilots/hype-v01-p02-02-e04-position-toggle-off-observation.md` | `32d05702013c21171c2a26178e942d4b9deca2b9` | S6: position inclusion visually **OFF** (grey/left), not saved-state proof |
| E04 self-review | `docs/v2/pilots/hype-v01-p02-02-e04-self-review.md` | `8c3382b6a2c2b06c08bf5e96948c4b567472c062` | 8/8 scoped checks, persistent backend remains unverified |

Screenshots themselves remain **in the conversation only**; the public GitHub repository records observations and checksums, **not** private screenshot binaries.

## 3. Final approved facts vs open verification

**Approved visual facts within screenshot evidence:**
- Veles editor shows an existing connection labelled `Bybit Futures`, `HYPE/USDT` pair, `LONG` direction and order mode `Простой / SIMPLE`.
- Displayed Conservative / Moderate / Aggressive cards are **proposed presets**, not selected strategies.
- On the final S6 image, `Включать позицию на бирже в сделку` appears **OFF**. The user's choice is **not** to adopt an existing Bybit position in the proposed new bot.
- Numeric fields, allocation, TP/SL and trading filters are not established. The previous **synthetic `CUSTOM`** pilot does not prove a live `SIMPLE` configuration.

**Still OPEN / NOT_VERIFIED:**
- Full, authenticated Veles DCA P02 session identity, screenshot capture time/timezone, build, exact market-contract identity and connection details. Pair label alone is not Bybit instrument specification proof.
- Actual leverage, margin mode, One-Way/Hedge/UTA, current positions, Equity, account IM/MMR, Mark price and its freshness, worst bot loss, funding/fees, full grid reserves, and F/A/H/R scenarios.
- The switch being OFF in a **saved/executed** bot or reflected in actual Bybit state; only the visual form state is evidenced.
- Any executable/complete `BotConfigurationProposal`, `VERIFIED_FOR_MANUAL_REVIEW` and real trade `READY` status. All remain **forbidden/UNVERIFIED**.

**Data gates:** `P02_verified_at=null` and `field_map_version=null` remain correct at the *fully-verified account-specific form* level. Visual evidence entries are accepted as partial, not upgraded to authenticated execution proof.

## 4. Acceptance-record self-review and scope control

This acceptance file is created **only after** the user's explicit message. Review guardrails:
1. Explicit approval source is recorded accurately; screenshots alone were not treated as earlier acceptance.
2. All eight original/addendum files remain unchanged, with their immutable Git blobs listed.
3. Original `S5` ON-appearing and later `S6` OFF-appearing observation are preserved as separate snapshots.
4. No `P02_verified_at`, saved UI/account state, real risk PASS, strategy price/grid or bot launch is invented.
5. No legacy agent, old PR #1, default branch or active runtime is modified.
6. Any **future work requires separate user authorization and its own self-review + separate acceptance**.

**Next only proposed, NOT STARTED:** `P02-03` — close remaining read-only editor identity/margin/leverage/time provenance gaps (without private credentials or exchange changes), and separately define data necessary for an eventual financial risk review. Ask the user to authorize this as its own step.

**Final:** `P02-02 APPROVED_WITH_LIMITATIONS / NO_TRADE_READY / STAGE_06_NOT_STARTED / V2_NOT_ACTIVE`.
