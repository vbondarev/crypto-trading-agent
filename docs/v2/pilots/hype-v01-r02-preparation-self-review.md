# HYPE-V01-R02 — preparation self-review

**Date:** 2026-11-11. **Outcome:** `PREPARATION_PASS_WITH_LIMITATIONS / TEST_NOT_RUN / USER_ACCEPTANCE_PENDING / STAGE_06_NOT_STARTED`.

## 1. Scope

This corrective test addresses exactly the original HYPE-V01 defect:
- Original reported `StrategyProposal.posture=LONG_CANDIDATE` but pinned `strategy-proposal.schema.json` only supports `LONG|SHORT|WAIT`.
- Original still produced safe test calculations and H04 veto. It is preserved unchanged.
- This rerun **does not modify the normative schema, original v2 policies, old AGENTS.md, PR #1, or actual Veles bots**. It is a controlled prompt-and-validator regression only, **not** a permanent fix to unspecified model behavior.

All new files are under `docs/v2/pilots/` or `tests/v2/pilots/`, on `feature/simplified-agent-v2`.

## 2. Independently verified normative contracts

Read both **actual pinned** JSON Schemas from `b7123d9cf19502bf4a890f1400027f30fa213434`:
- `docs/v2/contracts/strategy-proposal.schema.json`, blob `59db0de12477388f93cacee48314ef70eaaa10a3`.
- `docs/v2/contracts/bot-configuration.schema.json`, blob `0fb510fd07d33f78da3e05c5dd187b6bd6b4cb40`.
- Confirmed `docs/v2/bot-handoff-policy.md` Gate 0 requires LONG/SHORT for a positive handoff and rejects WAIT numeric grids.
- Confirmed Veles adapter requires P01/P02 separation, no real P02 in synthetic case, no VERIFIED_FOR_MANUAL_REVIEW.
- H04 ACTIVE must reject new/ADD exposure, even when account and form are unknown.

No change was made to the pinned JSON Schema to accommodate the invalid enum.

## 3. Synthetic fixture continuity

- Original immutable `HYPE-V01-SYNTHETIC.zip`, **42,960 bytes**; verified local SHA-256 `9e925caddbf62206b7237d60c4ec0971ca2fc6cd91c064070bf83b3b9416a872`.
- Manifest `run_id=HYPE-V01` intentionally retained: R02 is a **new evaluation run on same unchanged fixture**, not a rewritten market snapshot. Input fixture hash, not manifest run-id alone, establishes identity.
- Manifest five items match their content SHA/byte sizes. Four × 300 closed OHLCV records remain the same. Generator remains network-free.
- Historical fictional clock `2026-10-20 09:00 UTC`; no claims of real current HYPE.

## 4. Corrective validator and test behavior

Script: `tests/v2/pilots/validate_hype_v01_r02.py`.

- Uses `jsonschema.Draft202012Validator` against locally supplied **unchanged pinned schemas**, refusing schema files whose Git Blob SHA differ from two known pinned hashes.
- Additionally checks A/B shape, referential integrity, exact synthetic input SHA, no fake current instrument verification, P02 null, DOCUMENTED_ONLY mapping, absence of live-ready flags, unknown portfolio risk, and H04 veto.
- A synthetic `LONG` candidate with unconfirmed entry must be `posture=LONG / decision_status=NEEDS_DATA / bot readiness=NEEDS_DATA`; WAIT must remain safe and may leave positive route unexercised.
- B `H04=ACTIVE` must yield both strategy and bot risk `REJECTED`, `NOT_RECOMMENDED`, with no order amounts/steps.
- **Local semantic smoke suite was executed on synthetic example objects using minimal stand-in schema validators**: 1 valid baseline accepted and 5 negative mutations (invalid posture, fake VERIFIED form, ignored H04, orders during H04, broken strategy_ref) rejected, **6/6 expected outcomes**.
- **Limitation:** an end-to-end test of the tool's *Git-blob-pinned actual JSON Schema loading* was **not** executed in the current environment because exact raw schema files were not materialized locally. Do not claim full validator/schema integration PASS until the first independent output arrives and exact two schema files are available for execution.
- The independent model itself has **not yet been run**. No first answer exists in this preparation stage.

## 5. Self-review findings

1. **HIGH / boundary** — This is a directed prompt compliance regression, not evidence of a permanently fixed agent. If R02 passes, a separate decision is needed on whether to amend normative v2 prompt to require valid typed outputs by default.
2. **HIGH / boundary** — No real P02, account T02, current Mark, MMR, stress F/A/H/R, execution or actual Veles API test. READY remains impossible.
3. **HIGH / boundary** — A correct `WAIT` in A is safe, but positive branch would remain untested. Do not reward fabricated LONG.
4. **MEDIUM / provenance** — Original isolated GitHub invocation logs cannot be verified from the model's reported hashes alone. This is separate from typed contract checks.
5. **MEDIUM / tooling** — `jsonschema` Python dependency required by the offline validator. CI is not established for this test, and a full integration validation is pending raw schema availability.
6. **LOW / test design** — Reusing a known public fixture and explicit schema prompts weakens blind-generalization claims; test is intentionally narrow to regression of a known mismatch.

## 6. Handoff and acceptance

- `docs/v2/pilots/hype-v01-r02-instructions.md` — full isolated-session prompt, input, JSON response and file preservation.
- `docs/v2/pilots/hype-v01-r02-evaluation.md` — 12 predeclared criteria and critical failure conditions.
- `docs/v2/pilots/hype-v01-r02-run-record-template.md` — blank, `NOT_RUN` (no invented results).
- `tests/v2/pilots/validate_hype_v01_r02.py` — offline schema/semantic grader.
- No changes to original R01/R02/R02-RECHECK-01/HYPE-V01 answers, no v2 activation or Stage 06.
- Next user action: launch a new isolated Temporary Chat with unchanged synthetic ZIP and full prompt; return the **first original answer** and the **unchanged JSON block**. Reviewer then executes full pinned schema validation and self-review.
