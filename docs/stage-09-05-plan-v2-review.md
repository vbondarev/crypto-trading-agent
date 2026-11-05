# Stage 09.5 — v2 critical self-review and revalidation

**Review date:** 2026-11-06.
**Review scope:** the actually committed [stage-09-05-plan.md v2](stage-09-05-plan.md) (latest Git blob at assessment `187f33760bae2b43753abe1c31dd371c89266ca0`), the earlier [SR095-01..12 review](stage-09-05-plan-self-review.md), approved [master stage 09 plan](stage-09-plan.md), [test contract](stage-09-test-contract.md), [fixture catalog](stage-09-fixtures.md), [input templates](input-templates.md), [risk management](risk-management.md), [freshness](data-freshness.md), and previous [09.4 closeout](stage-09-04-closeout.md).

**Independence disclaimer:** This is a *separate adversarial second review* of the submitted plan by the same development assistant; it is **not** an external independent evaluator. GitHub-backed documentary audit and presence checks are not a runtime validation of independent ChatGPT sessions or a preflight under 09.5.1.

## A. Resolution of all approved v1 findings

| Original finding | v2 outcome | Verified remediation |
|---|---|---|
| SR095-01 HIGH | **CLOSED AT PLAN LEVEL** | §3 traceability table maps RT04/RT05, T02–T05, AD-009, H01, FR-032–034 and S0–S3 to fixtures, bounded observations and `NOT_EVALUABLE/NOT_PERFORMED` |
| SR095-02 HIGH | **CLOSED** | §§4.2–4.3 require every frozen mandatory item PASS or the case is unaccepted; FAIL_CRITICAL/MAJOR blocking rules, separate agent versus evaluator outcomes and direct quote evidence |
| SR095-03 HIGH | **CLOSED** | §§1/3/5/6 dual counters: `S09-012-R01` is 09.4 historic reference only; precisely five new 09.5 executions |
| SR095-04 MEDIUM | **CLOSED FOR PLANNING** | §2 lists exact paths and fetched Git blob SHA values for five baseline documents plus portfolio-analysis, risk-assessment and strategy-planning Skills; §6 freezes/rechecks per run during future authorized 09.5.1 |
| SR095-05 MEDIUM | **CLOSED** | §5 names one canonical journal `portfolio-recovery-actual-runs.v1.json`, unique (stage,case,run) keys, external reference to historical S09-012 and no raw-run rewrites |
| SR095-06 MEDIUM | **CLOSED** | §5 demands byte-identical original private oracle plus backup, published SHA before first response, verified preregistration commit, original file rehash before scoring and no recreation on mismatch |
| SR095-07 MEDIUM | **CLOSED** | §§3–4 H01 `-8` conditional series net versus actual realized exit, `-13` subtotal with missing fees/funding, no guaranteed recovery |
| SR095-08 MEDIUM | **CLOSED** | S09-014 unknown A/B ownership, distinct order identities, FILLED A not pending, NEW B leaves counted once, GPS fourth slot conditional |
| SR095-09 MEDIUM | **CLOSED** | S09-013 30% Mark-to-displayed-liq arithmetic is not proof of Cross liquidation safety, missing whole T02/MMR blocks verified risk |
| SR095-10 LOW | **CLOSED** | S09-017 two-point Equity change `-80/-8%` not auto-converted into verified daily/HWM loss or realized PnL; AD-009 fresh recheck |
| SR095-11 MEDIUM | **CLOSED** | §4 standard grader card, per-criterion observed line quote, immutable verdict, evaluator independence explicitly limited; new clarification makes `NOT_EVALUABLE` an evidence tag, not grading PASS |
| SR095-12 LOW | **CLOSED** | Current-status preambles added to both README.md and AGENTS.md; old dated entries remain intact; future policy pin explicitly deferred until authorized preflight |

**Original findings closed: 12/12** at the *documentary plan* level, not execution level.

## B. Independent critical challenge of v2's internal logic

| Probe | Result | Rationale |
|---|---|---|
| Correct approved scope | PASS | RT04/RT05, P08-12..17; no reclassification of S09-018/020, no automatic RT10/FR-038 proof |
| Five fixture boundaries | PASS | S09-013 Cross incomplete, S09-014 slots/orders, S09-015 signed recovery net, S09-016 options with unknown costs, S09-017 post-snapshot Equity |
| No double count | PASS | 5 new runs vs 6 total coverage with historical S09-012 reference |
| Risk-gate integrity | PASS | No oracle waiver, no fabricated Cross MMR, no synthetic READY, no basisless exchange trading |
| Source completeness and version pin | PASS **at plan level** | Exact files/Skill manifests; normative SHA not yet frozen for execution, intentionally deferred to 09.5.1 |
| State-machine proof | PASS **with explicit limitation** | S0/S1/S2 conditionally checked; S3 and FR-038 full numerical stress `NOT_PERFORMED` |
| Oracle reproducibility | PASS **at design level** | Verifiable original SHA, backup, pre-run commitment, missing/mismatch ⇒ formal INCONCLUSIVE |
| First-output provenance | PASS **at design level** | One fresh chat and first answer per case; user attested only absent independent export |
| Acceptance/severity vocabulary | PASS | Criterion verdict `PASS/FAIL/INCONCLUSIVE` distinct from evidence-state tag `NOT_EVALUABLE`, agent-side `NEEDS_DATA/UNVERIFIED/REJECTED` and evaluator run verdict |
| README/AGENTS status | PASS | Current status is accurate and old chronological entries explicitly marked historical |

**One ambiguity discovered during this second review and corrected before issuing the verdict:** previous draft v2 had used `NOT_EVALUABLE` both for a criterion verdict and an evidence-state tag. Plan v2 now distinguishes those namespaces: evaluator's mandatory rubric grade is PASS/FAIL/INCONCLUSIVE; missing-data evidence may be NOT_EVALUABLE and earns PASS only for the explicitly precommitted refusal-to-invent assertion. This corrective commit was made **before** this review report; no tests, commitments or oracle exist for 09.5 yet.

## C. Remaining limitations, not plan defects

1. **Deferred execution pin:** `AGENTS.md` was legitimately updated for current-status accuracy and its Git Blob SHA changed. On 09.5.1, freeze the exact post-edit commit and independently retrieve/hash all required Skills and files again; until that action the plan's historical SHA list is a reference, not an execution manifest. This is an expected gate, not proof it already passed.
2. **Sparse synthetic fixtures:** do not report quantitative S3/FR-038 coverage; only safe `NOT_PERFORMED` responses are testable. Proper live/complete data validation belongs to later stages and release gates.
3. **No technical attestation:** Temporary Chat external provenance is at best USER_ATTESTED; model identifiers, GUI events, tool-call history and auto-discovery are unverified unless independently captured.
4. **S09-002 historical first-response caveat** persists under approved 09.4 closeout; do not quietly call it independently authenticated.
5. **Future artifacts do not yet exist:** 09.5-specific private oracle originals, public commitment files, execution journal and independent case reports are intentionally NOT_STARTED. Approval of this v2 plan is not evidence they have been generated.

## D. Documentary checks and recommendation

- All twelve SR095 identifiers present in v2's corrections table: **12/12**.
- All six P08-12..17 IDs mapped to exactly one source case: **6/6**.
- Six sequential worksteps 09.5.1–09.5.6 defined: **6/6**.
- Source paths for `portfolio-analysis`, `risk-assessment`, `strategy-planning` and five stable initialization sources included.
- Root README.md and AGENTS.md statuses updated without erasing earlier history.
- No live requests, no synthetic model calls, no private oracles generated, no 09.5.1 execution, no PR merge.

**Final critical review verdict: `V2_REVIEW_PASS / READY_FOR_USER_APPROVAL`**, subject to the above explicitly documented evidence limitations. This is **not** `09.5 APPROVED` and **not** permission to execute 09.5.1. Wait for the user's explicit decision; after any approval, require a separate instruction to start the first workstep.
