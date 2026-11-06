# Stage 09.5.5 — prospective H01 / T06 output-contract analysis

**2026-11-06 — DOCUMENTARY ANALYSIS COMPLETED / POLICY CHANGES NOT AUTHORIZED.** Follow-up to the [adversarial E09 review](stage-09-05-05-s09-015-r01-adversarial-review.md). This is an **additive analysis proposal**, not a modification of normative instructions, fixtures, original oracle, scores or run ledger.

## Scope and fixed source
- Original normative source: `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`.
- Documents explicitly read at that commit:
  1. `docs/agent-operating-rules.md` (blob `62c33c1c6de5fbedbe16945b175a4ce1d98f5cba`).
  2. `docs/prompts/portfolio-recovery.md` (blob `8229d21df6db27f6a66cc4d157478884b983256a`).
  3. `.agents/skills/portfolio-analysis/SKILL.md` (blob `a46b934a07c5e3622e06449242c0c50b8763b095`).
  4. `.agents/skills/risk-assessment/SKILL.md` (blob `44661e995d2a5277eb034c8a0e97bef9223de50a`).
  5. `.agents/skills/strategy-planning/SKILL.md` (blob `ce7d5fb44ace79f5564a8c175fb0b2b6d4011ef1`).
- Existing sealed E09 fail remains the original `S09-015-R01` 9/10 evaluation; no rescoring.

## Evidence matrix

| Pinned document | Historical status semantics | Output/report visibility |
|---|---|---|
| `agent-operating-rules.md` RV-01, result policy | Missing H02/H03 `NOT_CHECKED` not an automatic veto; known breach remains active | In prose; output format explicitly emphasizes history for READY, not always compact RT05/H01-only response |
| `portfolio-analysis/SKILL.md` section 5, report format | H01 requires linked net; missing H02/H03 `NOT_CHECKED`; known active H04 must be forwarded | Structured portfolio report explicitly includes H01 and missing inputs but does not give a small per-H02/H03/H04 required diagnostic row for each H01-only response |
| `risk-assessment/SKILL.md` FR-028/035/036, section 6, response | H02 missing -> NOT_CHECKED; H03 missing -> NOT_CHECKED; known H04 veto | Explicit per-FR and H02/H03/H04 reporting is strong for full R3 assessment |
| `strategy-planning/SKILL.md` FR-044–046, sections 3–5 and response | H01 separate from H02/H03; missing history not a veto; known H04 matters for new risk | Candidate comparison and risk-gate status required; no one-line T06 diagnostic template for H01-only answer |
| `docs/prompts/portfolio-recovery.md` P08-15, T06 row, H01, result format | Missing H02/H03 -> NOT_CHECKED; known H04 forbids more risk | P08-15 explains H01; result 08.4 lists H01, S0–S3 and missing inputs, not explicit H02/H03/H04 row for a limited H01 answer |

## Finding 09.5.5-COV-01: consistent semantic rule, weaker output contract

Normative rules already agree: missing historical HWM/day loss histories cannot prove a pass or a violation; H02/H03 should be `NOT_CHECKED`. A **known active H04** blocks new risk, whereas an **unreported H04** is not license to assert a clear state. None of this makes H02/H03 histories mandatory for every preliminary H01 arithmetic answer or a blocker to READY by themselves.

The potential cross-Skill ambiguity concerns whether a *short RT05/H01-only* response must **display** H02/H03 diagnostics even if no new-risk decision is requested. Full R3 risk-assessment strongly calls for diagnostic output; portfolio and H01 prompt response formats don't explicitly enumerate T06 for limited responses. Original sealed E09 can defensibly be graded as FAIL for absent affirmative H02/H03 `NOT_CHECKED` but this observability expectation was not unambiguously encoded in the specific H01 output format.

**Important prior-review correction:** original E09 did *not* literally require the output line `H04=UNKNOWN`; it prohibited inventing/clearing H04 and claiming all limits passed. The S09-015 first answer made no such forbidden claim. Treating the absent H04 literal as independent E09 violation overstates the frozen oracle.

## Proposed prospective minimal rule text (NOT APPLIED)

If authorized later, add to `docs/prompts/portfolio-recovery.md` §6 and, if necessary, `.agents/skills/portfolio-analysis/SKILL.md` section 5/output format (one canonical rule cross-referenced rather than diverging duplicates):

> For an RT05 response evaluating linked-series H01 recovery, include a brief diagnostic summary of historical risk checks, independently of the H01 arithmetic result. If H02 adjusted HWM history or H03 adjusted Moscow-day baseline history is not supplied, explicitly label that separate check `NOT_CHECKED`. For H04, report only the evidence actually present: `ACTIVE` if confirmed, `INACTIVE` only if its cleared state is independently established, otherwise `UNKNOWN`/not supplied. A known active H04 vetoes **new risk**; missing H02/H03 must **not** on its own imply `REJECTED` or bar all advice. Do not claim R3 READY on sparse H01 inputs. These diagnostics are not new top-level trading statuses and do not require full historical account extraction for a preliminary educational calculation.

A compatible **optional display template** (not policy yet):
```text
H01: known conditional series gross/net estimate, missing T05 components
H02: NOT_CHECKED (history missing)
H03: NOT_CHECKED (Moscow-day history missing)
H04: UNKNOWN (no verified active/cleared state)
Risk gate: NOT_ASSESSED / NEEDS_DATA (depending on task)
```

The proposed template must be *conditionally worded*, not used to infer that missing H04 is false or every historical field is obligatory for educational arithmetic. `NOT_ASSESSED` is a diagnostic state, **not** one of the four allowed top-level R3 statuses.

## Trade-offs and proposed scope of future review

**Option A: No normative edits.** Create a non-overlapping R02 fixture and a new precommitted oracle with unambiguous observable assertions. Pros: minimal change, no model instruction contamination; con: the cross-Skill response-format ambiguity persists.

**Option B (preferred): Small prospective output-contract clarification.** One canonical RT05 result-format addition with a matching cross-reference to portfolio-analysis Skill, and explicit differentiation between a diagnostic status and full R3 verdict. Pros: addresses the observed omission without changing limits. Con: requires a new immutable normative pin and another independent blind test; overfitting if a future oracle merely prompts the tested answer.

**Option C: Global checklist in AGENTS.md/risk management.** Highest cross-route consistency but more scope and verbosity; not justified by this one minor case and could make R1 responses over-demand history.

Recommend **Option B**, conditional on separate user approval, with a genuinely novel R02 fixture and no literal leaked scoring checklist in the independent prompt. Before any R02 invocation, freeze a distinct fixture blob, new policy commit if edited, and **new original sealed oracle+backup+precommitted public digest**. No R01 history changes.

## Decision and gate
`09.5.5_NORMATIVE_COVERAGE_ANALYZED / CHANGE_PROPOSED_NOT_APPLIED / R02_NOT_RUN`.

No attempt to modify original R01, existing sealed oracle commitments, original frozen `inputs.v1.json`, 09.4 or 09.5 actual-run logs. Existing state **5 executed, 4 formally accepted, 1 mandatory FAIL**; PR #1 remains Draft. Request explicit approval of Option A or B before editing normative files or preparing the new test.
