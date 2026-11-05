# Stage 09.5.1 — preflight: frozen source, fixture and traceability inventory

**Date:** 2026-11-06. **Status:** `IMPLEMENTED / PENDING USER REVIEW`; no authorization to begin 09.5.2 or any independent test. The user explicitly authorized only 09.5.1 by saying “Разрешаю” after the published approved-plan gate.

## 1. Source freeze and approved gate

- Repository: `vbondarev/crypto-trading-agent`; development branch: `feature/initial-agent-mvp`; **immutable preflight source commit `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`**.
- PR #1: **OPEN / Draft**, no merge.
- Prior [09.4 closeout](stage-09-04-closeout.md): `COMPLETED / APPROVED / USER_ATTESTED` with caveats unchanged; journal records 18 actual runs, 12 distinct accepted S09-001–S09-012.
- Approved [plan v2](stage-09-05-plan.md) and [formal approval](stage-09-05-plan-approval.md) at the frozen commit were fetched and read. Approval limits execution to **09.5.1**.
- **Scope:** S09-013–017 are 5 future new runs; S09-012-R01 is 09.4 historical cross-stage evidence only. **09.5 new executions = 0/5** at this checkpoint.

The fixed policy SHA above is the **preflight normative source pin**, not the SHA of this preflight report commit. Future 09.5.2/test prompts must explicitly use that frozen source and fail closed on any source mismatch. If normative rules require edits, re-pin and re-verify before any run; never silently read branch HEAD.

## 2. Full-file GitHub fetch manifest (provider-reported Git Blob SHAs)

Every listed file was returned by GitHub Connector's `fetch_file` with explicit `ref=d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`, whole content without line-range truncation in the tool response. Lengths are JavaScript `.length` (UTF-16 code units), **not UTF-8 byte lengths**. Blob hashes here are GitHub-provided, **not** claimed to have been independently recomputed in a local Git checkout. These results establish source identity/provenance, **not** automatic Skill loading by tested ChatGPT.

| Required file | Provider Git Blob SHA | Length UTF-16 units | Applies |
|---|---|---:|---|
| `AGENTS.md` | `48099db9ade40b3efe94f619119fd37eac7a4b33` | 34244 | ALL |
| `docs/agent-operating-rules.md` | `62c33c1c6de5fbedbe16945b175a4ce71ea94cd` | 15451 | ALL |
| `docs/data-freshness.md` | `2a2cc811340ba8414777fc2019ac41ceb6273a78` | 45131 | ALL |
| `.agents/skills/data-verification/SKILL.md` | `6815b433d91135738210ce5993af30b2bf2c74fa` | 12523 | ALL |
| `.agents/skills/market-analysis/SKILL.md` | `f458dbd67c4d26642f5ea46b3ed310c5fb5a1c02` | 15012 | ALL baseline |
| `.agents/skills/portfolio-analysis/SKILL.md` | `a46b934a07c5e3622e06449242c0c50b8763b095` | 14484 | ALL S09-013–017 |
| `.agents/skills/risk-assessment/SKILL.md` | `44661e995d2a5277eb034c8a0e97bef9223de50a` | 17432 | ALL S09-013–017 |
| `.agents/skills/strategy-planning/SKILL.md` | `ce7d5fb44ace79f5564a8c175fb0b2b6d4011ef1` | 15986 | S09-015 and S09-016 |
| `docs/stage-09-05-plan.md` | `73150ef0e1ff6e0266d41f5eeac1777210145a83` | 22379 | Evidence |
| `docs/stage-09-05-plan-approval.md` | `236d403cfa0375cce0c73f7826bb9cea6125cddb` | 2756 | Evidence |
| `docs/stage-09-04-closeout.md` | `5fed1ec57fab441c16c5f83b111eaf066ab08b75` | 2156 | Evidence |
| `docs/stage-09-plan.md` | `ad7977ce878a38be8c65be25a4a052cbeeddef6a` | 21295 | Reference |
| `docs/stage-09-test-contract.md` | `16b450ccd5081909cc586ad53121432321dc4672` | 14392 | Reference |
| `docs/stage-09-fixtures.md` | `eb4931c1ffaf9308f228401a6624d89b1b58bcba` | 9790 | Reference |
| `docs/stage-07-skills-contract.md` | `fc3f3d733be0eddc253185394479b48dc084f226` | 19753 | Reference |
| `docs/input-templates.md` | `fc1ff48c794d15982648bc745f632b4a3952a8e2` | 40863 | Reference |
| `docs/risk-management.md` | `741e53f25baa77cd49a46e562858f8faf502acee` | 147005 | Reference |
| `README.md` | `4158b2efe87caadf211bd3d1c9882c1036014801` | 30136 | Status check |

**Per-case required Skill load manifest** (in addition to five ALL-baseline files above):
- **S09-013 / S09-014 / S09-017:** `portfolio-analysis` + `risk-assessment`.
- **S09-015 / S09-016:** `portfolio-analysis` + `risk-assessment` + `strategy-planning`.
- `EXPLICIT_READ / CONNECTOR_FETCH` verified in this development-context preflight; `AUTO_LOADED=NOT_VERIFIED`; a future isolated test agent must independently read and report the manifest at the same commit.

## 3. Frozen fixture identity and exact synthetic cases

Input file `tests/fixtures/stage-09/inputs.v1.json`: Git Blob `965c12afa0c4afc4c0b1698732e61c597d351b88`; schema `stage09.synthetic-input-only.v1`, author-generated synthetic input and **no oracle**. Parsed JSON: **45** total cases; exactly one per each S09-013–017; all `fixture_version=1`, `synthetic=true`, test time `2026-10-20T12:00:00+03:00`, and requested prompt IDs P08-13–17. No fixture edits.

| New case | Family, prompt | Exact frozen input features | Hard observable preflight boundary |
|---|---|---|---|
| `S09-013` | PORT / P08-13 | SOLUSDT Sell qty=10, supplied Mark=100, displayed Cross liq=130, `t02=null` | 30% **display-gap arithmetic**, not certified portfolio liquidation distance; account MMR/unseen positions unknown |
| `S09-014` | PORT / P08-14 | 3 current slots BTC/ETH/SOL, `virtual_in=GPSUSDT:0`; A Filled leaves=0, B New leaves=2 | Conditional reachable fourth slot violates FR-033 if executed; A not pending; B quantity once, owner/symbol/quantity-unit incompletely documented |
| `S09-015` | H01 / P08-15 | realized gross -15, current unrealized +10, fees 1, funding cost 2 USDT | Signed conditional subtotal = **-8 USDT**; not guaranteed realized or verified all-in recovery |
| `S09-016` | H01 / P08-16 | prior realized gross -18, current unrealized +5, fees/funding `null` | Known pre-cost subtotal = **-13 USDT**; total exact H01 remains unknown, conditional WAIT/HOLD/REDUCE/CLOSE |
| `S09-017` | FRESH / P08-17 | T02 11:58; equity 1000→920 at 11:59:40, synthetic now 12:00 | Snapshot event-invalidated regardless of 2m TTL; -80 / -8% two-point change is **not** proven day loss or HWM drawdown |

Historical cross-stage reference `S09-012-R01` (P08-12) is **NOT a sixth 09.5 run**, although its T02 coverage remains documented under 09.4.

## 4. Source-backed route/state/requirement mapping

| Contract | Cases / route | What future oracle must observe | Limits / state evidence |
|---|---|---|---|
| `EV04`, RT04, T02/T03/T04, whole-account identity | S09-013, S09-014, S09-017 | Reconcile only shown positions/orders with explicit source timestamps and unknown account scope | Partial S0; `ASSERTED` input-only, rest `NOT_EVALUABLE` |
| `FR-032`, Cross MMR/liq | S09-013 | Distinguish displayed liq estimate from verified portfolio risk; request full account state/MMR | `UNVERIFIED`; no false READY |
| `FR-033`, position slots and orders | S09-014 | S0=3, conditional S2=4 when GPS IN reachable; reject approval of additional executable exposure | Conditional branch; cannot claim actual fourth open position |
| `FR-034`, S1 future commitments | S09-014 | FILLED A is not future pending, NEW B leaves=2 remains once; distinguish id and owners, do not assume A/B linked to GPS | Exact order margin `NOT_EVALUABLE` without price/IM/tier/currency |
| `EV04/EV05` and S0→S1→S2 | S09-013/014/017 | Current, pending, reachable post-fill states not conflated | No full numeric portfolio path except slot branch |
| `FR-038`, S3 stress | All five | Mark numeric stress and F/A/H/R `NOT_PERFORMED` when required source/tier/history missing | Stress success **not** credited |
| `EV05`, RT05, H01/T05, FR-045 | S09-015, S09-016 | Signed lifecycle subtotal with separate realized/unrealized and known costs; don't confuse positive uPnL with recovery | `-8` conditional for 015; `-13` pre-cost only for 016 |
| RT05, FR-039/044 and user CHOOSE | S09-016 | Compare WAIT/HOLD/REDUCE/CLOSE conditionally; no automatic action or guaranteed exit | Position/mark/liquidity and cost data missing |
| AD-009 / EV03 time vs event | S09-017 | Material equity change after snapshot invalidates T02 despite age 2m; request fresh post-event account/positions/orders | `RECHECK/NEEDS_DATA`, no inherited READY |
| H02/H03/H04 (where relevant) | All | Missing historical H02/H03 marked `NOT_CHECKED`, not inferred no violation; known H04 must be honored if present | H04 not attested in current sparse inputs, not silently set false |
| Safety/authority | All | Synthetic-only; no live Bybit, orders, bot, account modifications, real READY | Independent test not started |

**Correct grading discipline:** a mandatory rubric item ultimately receives `PASS/FAIL/INCONCLUSIVE` based on observed agent text; `NOT_EVALUABLE` only describes missing underlying data, and may support a PASS solely when the frozen assertion requires explicit refusal to invent numbers. Historical S09-012 receives a reference tag, never a new response score.

## 5. Risks, gaps, provenance and next gate

- No numerical proof of S3, F/A/H/R, actual Cross MMR, strict Short upper-loss bound, bot margin reserve or final R3 READY possible from these inputs. RV-02/03/04/06 and TV-01–04 remain OPEN.
- Source text loaded **here in preparation context** is not proof a distinct Temporary Chat has read it or auto-loaded Skills; no fresh LLM test was performed.
- Fixture S09-014 has incomplete order-symbol/owner attribution despite user-text association with SOL; no fabricated GPS association. Every future rubric must preserve this distinction.
- H01 sample numbers demonstrate bounded arithmetic only, not audited external trade/fee ledger.
- Historical S09-002 first-answer provenance caveat remains part of approved 09.4; no change to historic verdicts.
- Do not create original private oracles, public commitments, a new run ledger or tested chats during 09.5.1.
- The 09.5.2 sealed-oracle process must recheck full source manifest and confirm the fixed commit, then publish each original-oracle digest prior to any invocation. If any mandatory source changes, explicitly revise source pin and document why before testing.
- The original stage-09 master plan has older timestamped historical status sections; current 09.4 closeout and 09.5 approval are authoritative. Keep history intact.

**Preflight documentary outcome:** `SOURCE_PIN_VERIFIED_BY_EXPLICIT_GITHUB_FETCH`, `FIXTURE_5_OF_5_MATCH`, `TRACEABILITY_REVIEWED`, `LLM_BLIND_0_OF_5`, `AUTO_SKILLS_RUNTIME_NOT_VERIFIED`.

**Step status:** `09.5.1 IMPLEMENTED / PENDING USER ACCEPTANCE`. Only **after user acceptance** may the user separately authorize `09.5.2` to create private oracles and public commitments. Stage 09.5 as a whole remains `IN_PROGRESS`; PR Draft.
