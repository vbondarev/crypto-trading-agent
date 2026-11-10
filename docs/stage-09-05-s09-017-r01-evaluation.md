# S09-017-R01 — formal sealed-oracle evaluation

**Decision date: 2026-11-06. Verdict: FORMAL_ACCEPTED / USER_ATTESTED; content: 10/10 PASS.**

## Frozen test sources and integrity
- Immutable normative SHA `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`.
- Public synthetic fixture `tests/fixtures/stage-09/inputs.v1.json`, Git Blob `965c12afa0c4afc4c0b1698732e61c597d351b88`; case `S09-017`, prompt `P08-17`, v1, fixed test time `2026-10-20T12:00:00+03:00`.
- Original private oracle `S09-017-R01_PRIVATE_ORACLE.json`, **3008 bytes**, SHA-256 `760b4f44c77d715923b1da77f4917cc214c3495753c49375bc0eb0c1afb4e2fb`.
- SHA-256 recalculated after the user response on original private bytes, separate private backup, and member of stored private ZIP: all three identical to public precommitment in `docs/stage-09-05-02-oracle-commitments.md`, published at commit `fffb5008761e91b84bec5d54d6165f6a1d8da00a` before independent S09-017 invocation.
- The hidden rubric and nonce remain evaluator-only; neither are included in this report or the independent test prompt.

## Content rubric assessment
| Criterion | Outcome | Observed evidence |
|---|---|---|
| E01 | PASS | Synthetic data and explicit fixed test clock; no real exchange activity |
| E02 | PASS | T02 11:58, Equity change 11:59:40, 1000 to 920 USDT |
| E03 | PASS | Difference -80 USDT (-8%) correctly derived |
| E04 | PASS | AD-009 event-invalidation regardless of nominal two-minute T02 TTL |
| E05 | PASS | Old portfolio/risk calculations and earlier READY not inherited |
| E06 | PASS | New synchronized post-event T02 of complete account, positions, orders and IM/MM required |
| E07 | PASS | Fresh Bybit Mark with source timestamps needed for price-dependent checks |
| E08 | PASS | No fabricated reason for decline or inference of trade losses |
| E09 | PASS | H02/H03 NOT_CHECKED and H04 unknown, absent day baseline/HWM and flows |
| E10 | PASS | RT10 RECHECK / NEEDS_DATA; no unjustified READY, hard-rule rejection or live actions |

**Mandatory content checks: 10/10 PASS.** The conditional ceilings at 920 USDT (IM <=276; single bot risk <=46) are arithmetic limits, not observed compliance. S0-S3, full R3 and current portfolio state remain unverified.

## Independent-run provenance
The user pasted the full first answer titled `Crypto Trading Agent — S09-017-R01` in the development chat. In a **separate later response**, the user replied **“Подтверждаю”** to three explicit controls: (1) new Temporary Chat outside Crypto Project; (2) first complete unchanged response without regeneration or additional prompts; (3) no sealed oracle, past evaluation or scoring hints provided to the tested agent.

Evidence tier `LLM_BLIND_USER_ATTESTED`. Reported 7/7 complete pinned GitHub reads are self-reported, not authenticated tool traces. `AUTO_LOADED=NOT_VERIFIED`, evaluator independence `LIMITED`, technical session attestation `false`. This is **not** independent technical authentication of the session, trading readiness or market data.

## Formal accounting
`S09-017-R01` accepted at USER_ATTESTED tier; **four of five distinct new scenarios accepted**, one failed: S09-015-R01 `CONTENT_FAIL_9_OF_10 / USER_ATTESTED / NOT_ACCEPTED`. Stage 09.5.3 retains the failed attempt unchanged and does **not** automatically become 5/5, close the stage or unlock a real trading decision. Historical S09-012-R01 is a 09.4 reference only. PR #1 stays Draft.
