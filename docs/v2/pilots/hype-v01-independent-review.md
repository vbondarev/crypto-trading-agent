# HYPE-V01 — independent first-answer review and self-review

**Review date:** 2026-11-11.
**Strict conclusion:** \`V01_NOT_ACCEPTED_AS_COMPLETE / POSITIVE_ROUTE_CONTRACT_DEFECT / ORIGINAL_SESSION_PROVENANCE_INCONCLUSIVE\`.
**Bounded findings:** \`SYNTHETIC_TECHNICAL_PASS / FINANCIAL_MATH_PASS / H04_VETO_PASS / P01_P02_SAFETY_PASS / NO_REAL_TRADE\`.

This is a pre-Stage-06 isolated test. No production agent activation, account intervention, actual bot deployment or readiness certification.

## 1. Immutable first-response custody

- Original user-uploaded text: \`Вставленный текст(8).txt\`.
- **36,442 bytes** UTF-8; **413 LF** separators; no trailing newline.
- Uploaded original SHA-256: \`aadf162f13bbcbf90900f08c56ffddd51114bb84d528915844f3f59a0401389b\`.
- Uploaded original Git blob SHA: \`76623d81f0775e73b424864cd7d054a796a21ed2\`.
- Archived **unaltered** as \`docs/v2/pilots/hype-v01-first-answer-unaltered.txt\`, initial Git commit \`59ecec0402ae96584805ed28ff8fb7903850eb8a\`.
- GitHub re-fetch of the exact archived file returned the same blob \`76623d81f0775e73b424864cd7d054a796a21ed2\`: **byte-identity confirmed**.
- Existing originals R01, R02 and R02-RECHECK-01 remain distinct and immutable; this review must not rewrite them.

## 2. Pinned sources and actual provenance

Pinned normative policy commit \`b7123d9cf19502bf4a890f1400027f30fa213434\`.
Reviewer independently fetched the 9 mandatory files from this commit and confirmed **all 9 Git blob hashes** quoted in the HYPE-V01 answer (9/9). Four additional canonical paths named in the response were also documented in the pinned policy; this does **not** prove they were truly loaded in the original Temporary Chat.

**Original model's independent tool-call log, invocation IDs, original isolated-chat export and source-call trace were not supplied.** The HYPE-V01 answer's claim of \`SOURCE_LOAD_VERIFIED\` is therefore **MODEL_REPORTED**, not independently proven for that session. \`V01-01 = INCONCLUSIVE\`. Matching SHA is evidence of correct Git objects, not of a past call.

## 3. Fixture integrity and independent recalculation

The user supplied deterministic fixture \`HYPE-V01-SYNTHETIC.zip\` (from the preceding preparation turn), examined again from mounted bytes:
- **42,960 bytes**, SHA-256 \`9e925caddbf62206b7237d60c4ec0971ca2fc6cd91c064070bf83b3b9416a872\`.
- ZIP integrity/CRC PASS; six members (manifest, four synthetic CSV, one test-cases JSON).
- All **5/5** manifest SHA256+length entries match.
- Generator seed \`20261137\`, fixed simulation time \`2026-10-20T09:00:00Z\`, no genuine Bybit observations.
- Each of four 15m/1h/4h/1d CSV files contains exactly 300 timestamp-aligned, complete, closed and continuous bars; 0 OHLCV invariant violations.
- Independent full-window OHLCV aggregates: \`15m→1h:75/75\`, \`1h→4h:74/74\`, \`4h→1d:49/49\` (198/198 with no mismatch).

Independent recomputation using \`EMA\` first SMA(n) and \`RSI14\` Wilder, not relying on manifest values:

| Metric | 15m | 1h | 4h | 1d |
|---|---:|---:|---:|---:|
| Close | 75.000000 | 75.000000 | 74.851839 | 74.932860 |
| EMA20 | 74.85115 | 74.67871 | 74.16862 | 71.74017 |
| EMA50 | 74.75782 | 74.36717 | 73.63341 | 66.60228 |
| EMA200 | 74.27477 | 73.71699 | 69.02731 | 54.46392 |
| RSI14 | 63.534 | 63.284 | 62.277 | 80.927 |
| MACD histogram (first-price EMA variant declared in report) | +0.01024 | -0.00096 | +0.09051 | -0.26522 |
| ATR14 Wilder | 0.13642 | 0.27253 | 0.49843 | 1.03694 |

Values match the uploaded first report at its rounding precision. Alternative EMA seeds for MACD change historical initialization convention; report explicitly disclosed first-close EMA for this optional MACD calculation. ATR is reproducible. Daily RSI high and weakening daily MACD histogram were appropriately flagged as conflicting evidence.

## 4. Scoring against preregistered V01 rubric

| ID | Review grade | Evidence / qualification |
|---|---|---|
| V01-01 | \`INCONCLUSIVE\` | Nine pinned blobs valid; no original Temporary Chat tool-call trace proving each read |
| V01-02 | \`PASS\` | Hashes, 4×300 closed synthetic OHLCV and fictional source designation correctly handled |
| V01-03 | \`PASS\` | Independent EMA20/50/200, RSI14 Wilder, MACD/ATR reproducible |
| V01-04 | \`PASS\` | UP local/global within fiction, trigger/invalidation, RSI80.927 risk disclosed |
| V01-05 | **\`FAIL (CONTRACT)\`** | The answer explicitly uses \`StrategyProposal.posture=LONG_CANDIDATE\` but schema enum is \`LONG|SHORT|WAIT\`; positive route violates Gate 0 |
| V01-06 | \`PASS\` | Explicit Veles DCA 'Свой', no separate Veles GRID/GinArea mapping confusion |
| V01-07 | \`PASS\` | P01 \`DOCUMENTED_ONLY\`, real P02 absent, no fabricated exact live form |
| V01-08 | \`PASS\` | 3 IN ×4 USDT hypothetical margin ×3 leverage ⇒ 36 USDT notional, conditional qty 0.48 HYPE at 75 and full future reserve caveats; order count != position count |
| V01-09 | \`PASS_WITH_LIMITATIONS\` | Bot draft \`NEEDS_DATA\`; no actual READY/order settings. Structural strategy contract defect separately scored under V01-05 |
| V01-10 | \`PASS\` | H04 ACTIVE synthetic override ⇒ REJECTED/NOT_RECOMMENDED for new/ADD exposure |
| V01-11 | \`PASS\` | Real Equity/MMR/Short worst loss/HWM/stress unknown not falsely PASS; hard thresholds nonweakened |
| V01-12 | \`PASS_WITH_LIMITATIONS\` | A/B/C answered, original archived, no trade/authentication in text; original separate-session runtime actions not independently witnessed |

**Count:** 10 PASS including qualified, 1 FAIL (functional typed contract, *not* a risk-veto breach), 1 INCONCLUSIVE; 0 observed hard-risk bypass.

## 5. HIGH — typed \`StrategyProposal.posture\` mismatch

Original report §4, \`StrategyProposal\` table: \`posture = LONG_CANDIDATE\`. This is not a legal value in the actual pinned \`docs/v2/contracts/strategy-proposal.schema.json\`:

\`\`\`json
"posture": { "type": "string", "enum": ["LONG", "SHORT", "WAIT"] }
\`\`\`

And \`docs/v2/bot-handoff-policy.md\` Gate 0 requires a \`LONG\` or \`SHORT\` posture to make a draft. The test's positive \`LONG_CANDIDATE\` identifier was deliberately not a normatively supported handoff value.

This is a **real functional integration contract defect**, notwithstanding good narrative market analysis and safe H04 handling. The response is prose, not a complete machine-readable \`StrategyProposal\` instance, so a full-schema validation of all required fields was *not* performed. The explicit posture token is nevertheless demonstrably outside the enum.

### Recommended precise fix for a separate retest (do not modify original response)
1. Preserve \`posture\` as an actual enum \`LONG\` **when a simulated directional LONG strategy candidate is warranted**; \`SHORT\` or \`WAIT\` otherwise.
2. Use separately \`decision_status=NEEDS_DATA\` (when conditions or risk are insufficient), \`risk_screen.model_status=NOT_EVALUABLE\`, conditional \`entry_conditions\` and \`invalidation_conditions\`, and \`BotConfigurationProposal.readiness=NEEDS_DATA\`. This is **not** permission to open a trade.
3. If the strategy itself must be \`WAIT\`, do not pass to the bot numeric-draft Gate 0; keep a \`WHAT_IF_ONLY\` note.
4. Require a machine-readable minimal complete \`StrategyProposal\` and \`BotConfigurationProposal\` in a later **synthetic** retest, validated against the actual pinned JSON Schemas, with conditional risk, P01/P02 and H04 constraints. This may be a separate appendix while preserving the user-facing readable report.
5. Add a regression for illegal \`LONG_CANDIDATE\`, \`READY\`, hard-veto precedence and missing actual P02. Do not silently weaken schema enum to accommodate the incorrect value.

## 6. Self-review and remaining limitations

- **HIGH:** Original tool-use provenance is not authenticated. Correct SHA and report statements cannot prove actual GitHub Connector reading in a separate session.
- **HIGH:** The positive strategy→bot contract is not proven; typed enum violation and no full schema-valid model artifacts.
- **HIGH:** Real P02 Veles editor not observed. Veles Custom mode is *test assumption*; no runnable UI values may be treated as verified.
- **HIGH:** Actual T02, Mark, Cross/Isolated MM, stress F/A/H/R, worst bot loss and account equity not provided; no actual trading readiness.
- **MEDIUM:** HYPOTHETICAL 100 USDT budget is not \`Equity\`, and an illustration of PnL shocks is not a full stress scenario.
- **MEDIUM:** Daily RSI80.927 suggests a possible justified \`WAIT\`. The test found a conditional LONG direction, *not* an actual entry trigger.
- **LOW:** Unsealed public tests and synthetic source can be rehearsed; future sealed or real-form validation is separate.
- **LOW:** HYPE-V01 technical result says \`SOURCE_LOAD_VERIFIED\` for original session, but only actual network-trace proof could establish it.

## 7. Decision

\`V01_CONTRACT_FAIL / TECHNICAL_PASS / H04_GUARD_PASS / P02_BOUNDARY_PASS / ORIGINAL_SESSION_INCONCLUSIVE / NO_REAL_TRADE_READY\`.

**Do not approve HYPE-V01 as complete E2E positive route.** Accept computational, defensive and document-boundary subresults with limitations. Recommend a **separate named follow-up \`HYPE-V01-R02\`** testing typed contracts on the **same synthetic fixture**, no live HYPE market lookup, real account, keys, P02 invention, orders, stage 06 or v2 activation. Present plan to user for acceptance before touching normative v2 instructions/contracts.

No changes outside new pilot documentation records on branch \`feature/simplified-agent-v2\`; production legacy/default, Draft PR #1 and immutable R01/R02/RECHECK originals unaffected.
