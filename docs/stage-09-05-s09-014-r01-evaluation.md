# S09-014-R01 — formal evaluation

**2026-11-06: FORMAL_ACCEPTED / USER_ATTESTED; CONTENT_PASS 10/10.**

Normative commit: `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`. Fixture: `tests/fixtures/stage-09/inputs.v1.json`, Git Blob `965c12afa0c4afc4c0b1698732e61c597d351b88`, S09-014/P08-14, synthetic test time 2026-10-20 12:00 MSK.

Precommitted evaluator-only oracle: 3140 bytes, SHA-256 `f64b4e352d50bbe5d3d283d6bead4bf2bd52948a001212656839c82dc028c985`, published before test at commit `fffb5008761e91b84bec5d54d6165f6a1d8da00a`. Original and its separately kept backup and archived copy matched commitment. Private rubric text is not included.

## Grading
| Criterion | Grade | Evidence |
|---|---|---|
| E01 | PASS | Explicit synthetic time, no live market activity |
| E02 | PASS | Current S0 slots BTC/ETH/SOL = 3 |
| E03 | PASS | GPSUSDT:0 is virtual, future fourth slot |
| E04 | PASS | Conditional reachable fourth slot violates FR-033; GPS additional risk REJECTED |
| E05 | PASS | Order A Filled, leavesQty=0; no future reservation |
| E06 | PASS | Order B New, leavesQty=2; remaining obligation preserved |
| E07 | PASS | No unproven ownership or B-to-GPS mapping |
| E08 | PASS | S0/S1/S2 separated; S3 not numerically evaluated |
| E09 | PASS | Margin, liquidation, reserves not invented |
| E10 | PASS | No trades, bot actions, real READY, or automatic position close |

**All 10 mandatory criteria PASS; no blocking failures.** The prospective FR-033 rejection is conditional on a reachable GPS entry; no assertion that GPS position has already opened.

## Provenance
Full first response headed “Crypto Trading Agent — S09-014-R01” was pasted into the development chat. User subsequently stated “Подтверждаю” to three explicit conditions: **new Temporary Chat outside Crypto Project**, **first full unmodified answer without regeneration/reprompt**, and **no private oracle, prior evaluation or answer hints** shared with tested agent.

Provenance `LLM_BLIND_USER_ATTESTED`; technical session authentication `false`; independent evaluator `LIMITED`; seven full pinned source reads are test-agent self-reported; automatic Skill loading `NOT_VERIFIED`. No real Bybit R3 READY or live stress proof.

S09-014-R01 is the second new accepted case under 09.5; S09-013 remains accepted, S09-015–017 remain NOT_RUN, historical S09-012 remains 09.4 reference only.
