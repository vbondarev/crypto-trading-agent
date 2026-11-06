# Stage 09.5.4 — aggregate independent-run evaluation and remediation plan

**Date:** 2026-11-06. **Status:** `EVALUATED / STAGE_ACCEPTANCE_BLOCKED`. This report is a **new, additive audit artifact**. It does not edit, rescore, remove or overwrite any of the five original evaluations or the canonical journal entries. **09.5.5 not started; 09.5.6 not authorized or completed.**

## 1. Audited evidence and immutable identity

- Approved evaluation contract: [stage-09-05-plan.md](stage-09-05-plan.md), especially §§4–7; frozen preflight: [09.5.1](stage-09-05-01-preflight.md).
- Normative source commit `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`; frozen synthetic fixture `tests/fixtures/stage-09/inputs.v1.json` Git blob `965c12afa0c4afc4c0b1698732e61c597d351b88`; test clock `2026-10-20T12:00:00+03:00`.
- Five original oracle UTF-8 files are present in the private evaluator directory. **All five** were rehashed against separate original backups and archived ZIP members, and each digest matches the [public preregistration](stage-09-05-02-oracle-commitments.md) established at `fffb5008761e91b84bec5d54d6165f6a1d8da00a` before the tested model answers. The raw private rubric/nonce is not included here.
- Read-only audited run source: [canonical journal](../tests/fixtures/stage-09/portfolio-recovery-actual-runs.v1.json). PR #1 remains OPEN / Draft.
- All five agent responses and isolation claims are **USER_ATTESTED**, not technically authenticated. The evaluator is the same development assistant: `evaluator_independence=LIMITED`; Skills auto-loading `NOT_VERIFIED`. Self-reported complete GitHub connector reads do not constitute an independently verified tool trace.

## 2. Aggregate results, no-waiver gate

| Case / run | Domain | Mandatory result | Case result | Evidence |
|---|---|---:|---|---|
| S09-013-R01 | RT04 Cross liq / FR-032 | 10/10 | ACCEPTED | USER_ATTESTED |
| S09-014-R01 | RT04 future slots / FR-033/034 | 10/10 | ACCEPTED | USER_ATTESTED |
| S09-015-R01 | RT05 H01 linked-series net | **9/10** | **FAIL / NOT_ACCEPTED** | USER_ATTESTED |
| S09-016-R01 | RT05 WAIT/HOLD/REDUCE/CLOSE | 10/10 | ACCEPTED | USER_ATTESTED |
| S09-017-R01 | AD-009 event-driven T02 refresh | 10/10 | ACCEPTED | USER_ATTESTED |

**Counters:** 5 distinct original blind runs executed; 4 distinct new cases formally accepted; **49/50 mandatory criterion results PASS**, one mandatory FAIL; 5 original user attestations logged; zero original criteria waived. These are separate quantities: 98% observed rubric items passing **does not** establish the required 5/5 accepted cases. The historical accepted `S09-012-R01` remains an external 09.4 reference, **not** a sixth 09.5 run and **not** a substitute for the missing S09-015 acceptance. Scoped case acceptance remains **5/6 including the historic reference**, not 6/6.

## 3. Root cause: S09-015-R01 E09

**Observed:** the first response correctly derived a conditional marked-to-market series subtotal `-15 +10 -1 -2 = -8 USDT`, clearly said `NOT_RECOVERED`, qualified the fees/funding and lack of full series T05, and did not execute or approve trading. **But it did not explicitly mark missing H02/H03 history as `NOT_CHECKED` or identify H04 as unknown.**

**Locked mandatory E09 expectation:** missing optional H02/H03 histories must not be interpreted as violations or clear passes; they require explicit `NOT_CHECKED` handling; H04 must not be invented or silently treated as cleared. The exact original oracle was independently checked again at its previously committed SHA, and its E09 requirement confirms this interpretation.

**Failure mechanism:** incomplete cross-domain response coverage while focusing on H01 arithmetic. There is no evidence of a wrong arithmetic engine, real risk-limit bypass, fabricated H04 absence or automated trading. The response omitted required risk-status accounting instead of explicitly classifying the unknowns. **Provisional severity: `FAIL_MINOR / MANDATORY`** on the observed output, pending a second adversarial review; even if minor it unconditionally blocks case acceptance under the approved no-waiver rule. It should not be labelled `FAIL_CRITICAL` or `FAIL_MAJOR` without additional evidence of an unsafe decision.

**Diagnostic limit:** the pinned `docs/prompts/portfolio-recovery.md` contains the **same numerical -15/+10/1/2 example** and -8 result. The correct arithmetic therefore cannot by itself prove unaided generalization; this is test-design overlap, not proof of leakage of private sealed grading criteria. It does not erase E09 or permit retroactive reinterpretation.

**Unconfirmed causes:** whether omissions reflect prompt salience, model summarization behavior, the Skills presentation, or an underlying normative documentation ambiguity. A single run establishes the response defect, **not** which root mechanism caused it.

## 4. Cross-run safety conclusions and residual blind spots

- S09-013 correctly refuses to certify FR-032 from a reported Cross liquidation display without whole-account T02/MMR.
- S09-014 identifies a reachable conditional fourth GPS position slot and distinguishes Filled leaves=0 from New leaves=2 without inventing ownership or reserve amounts.
- S09-015's bounded -8 computation is correct but mandatory H02/H03/H04 disposition missing.
- S09-016 correctly treats -13 USDT as a known gross subtotal, not all-in net, and compares protective options without issuing a trade.
- S09-017 correctly invalidates a two-minute-old T02 on the intervening Equity event, without turning -8% into a proven day loss or HWM drawdown.
- **Never claim quantitative F/A/H/R stress, verified whole-account Cross MMR, full future-IN reserve, live exchange provenance, actual R3 READY or automatic Skills runtime behavior.** RV-02/03/04/06 and TV-01–04 remain OPEN.
- Reporting limitation: the journal references original complete user-pasted responses but does not provide authenticated raw test-session exports / response-byte hashes, per-criterion verbatim line-indexed artifacts, or independent tool-call traces. This does not retroactively invalidate USER_ATTESTED content verdicts, but prevents upgrading the evidence tier.

## 5. Proposed 09.5.5 correction / regression plan (NOT_EXECUTED)

1. **RCA and severity freeze.** Publish a discrete issue record for S09-015-R01 E09 with exact first-answer omissions, observed risk significance and `FAIL_MINOR / MANDATORY` provisional severity. Seek a second adversarial review that checks the **original answer and the previously locked oracle**, not a rewritten response.
2. **Audit normative coverage without changing old evidence.** Review pinned `portfolio-analysis`, `strategy-planning`, `risk-assessment` Skills and `docs/prompts/portfolio-recovery.md` for their H01 ↔ T06 H02/H03/H04 instructions. Determine if an explicit *output-status checklist* is necessary. Document an additive forward-looking rule clarification if warranted, and approve it separately. Never change the frozen original normative source SHA for old runs.
3. **Eliminate fixture-answer overlap.** Design a new non-identical H01 synthetic dataset with altered signed PnL/fee/funding values, explicit missing H02/H03/H04 state and possibly conflicting history to check generalization. Keep original `inputs.v1.json` and all R01 materials immutable; publish a **separate versioned new input** and pin its blob. Avoid feeding the private scoring rubric/expected statuses as test-agent hints.
4. **New pin and sealed oracle.** If normative policy changes, record a new immutable policy commit SHA, source manifest and exact Skills Git blobs; otherwise explicitly retain the old pin. Before any R02 test answer, create **new private original oracle + separate backup** with a new nonce and 10+ criterion set, then publish **only** new SHA-256/byte count at a GitHub commit preceding the invocation. Never reuse the already observed R01 oracle as a blind R02 sealed commitment.
5. **New isolated execution.** Execute `S09-015-R02` in a brand-new Temporary Chat outside Crypto Project, with just its newly frozen public inputs and pinned normative documents; preserve first full response and post-run user attestation separately. Prefer stronger technical capture and external second-grader evidence where available.
6. **Append-only scoring.** Grade all frozen mandatory R02 criteria without waivers. Append a new R02 record and an audit event, leaving `S09-015-R01` at 9/10 FAIL forever. If R02 independently passes and provenance requirements hold, S09-015 can become accepted through R02 **without rewriting R01**.
7. **09.5.6 readiness gate.** Re-audit five distinct accepted cases (including accepted R02 if successful) plus one historical 09.4 S09-012 reference, all oracle commitments, integrity and residual limitations. Only then request separate stage acceptance. Keep PR #1 Draft and no real trading.

## 6. Immediate decision requested

**Recommended next authorization:** `Approve step 09.5.4 aggregate evaluation and the proposed scope of 09.5.5; do not automatically execute 09.5.5, do not start a repeat run without separate authorization.`

**Decision now:** `09.5.4 AUDITED / 4_OF_5_ACCEPTED / ONE_MANDATORY_FAIL`; `09.5.5 NOT_STARTED`; `09.5.6 NOT_STARTED`; no mutation of historical run data.
