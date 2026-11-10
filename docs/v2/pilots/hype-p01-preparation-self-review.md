# Crypto Trading Agent v2 — HYPE Pilot P01 preparation self-review

**Review date:** 2026-11-10. **Status:** `PREPARATION_PASS / INDEPENDENT_PILOT_NOT_RUN / USER_REVIEW_PENDING / STAGE_06_NOT_STARTED`.

## Scope, audit independence and source freeze

Same development assistant drafted and reviewed the prospective pilot, not an external independent evaluator. No actual pilot model was launched, no market data or social posts queried, and no live Veles/account action performed.

**Immutable policy source SHA:** `b7123d9cf19502bf4a890f1400027f30fa213434` in `vbondarev/crypto-trading-agent`. The pilot documents themselves are later on `feature/simplified-agent-v2` and are **not** part of the policy pin. The test prompt therefore **contains its own required source list**, avoiding circular dependencies.

Published artifacts:
- `docs/v2/pilots/hype-p01-instructions.md` — self-contained prompt, isolated-session steps, source manifest, run custody;
- `docs/v2/pilots/hype-p01-evaluation.md` — public 12-criterion nonsealed qualitative rubric with PASS/FAIL/INCONCLUSIVE;
- `docs/v2/pilots/hype-p01-run-record-template.md` — explicit untouched original-answer, actual loading and public source evidence log, all `NOT_RUN` initially.

## Verifications performed

| Review question | Result | Evidence |
|---|---|---|
| Nine required v2 Skill/workflow/adaptor paths exist at immutable commit | PASS, 9/9 | Fetched full files separately with GitHub Connector at exact ref and recorded Git Blob SHA |
| Prompt independently contains all nine actual paths | PASS | Reread GitHub pilot instruction after creation and amendment; literal path-presence check |
| Five canonical legacy references available when material risk/field claims require them | PASS, 5/5 | `risk-management`, `data-freshness`, `data-sources`, `veles`, `configuration-contract` fetched at same immutable commit |
| Pilot not mistaken for current market data | PASS | Only instructions about future live research, no prices, X messages or trend findings prefilled |
| Source integrity and independence checks | PASS | Public source/time, correct linear market, source availability, independent news group, rumors and no invented social reach |
| Technical Coin Profile and trade stance | PASS at spec level | Requires closed OHLCV/timeframes/warmup or NOT_COMPUTED, explicit global/local and LONG/SHORT/WAIT |
| Veles mode/form/portfolio limits | PASS at spec level | Missing P02/T02/budget forces safe draft or NEEDS_DATA, strict non-executable output |
| Evaluation criteria | PASS, 12/12 configured | Covers source load, market identity, public feeds, social, BTC context, technical, derivatives, Coin Profile, stance, Veles, risk, manual scope |
| Original-first-answer record | PASS as empty template | Explicit `NOT_CAPTURED` and `NOT_SCORED`; no invented sample feedback or grade |
| New session already run? | **NO**, intentionally | `HYPE-P01-R01=NOT_RUN`, no external model tool call |
| Stage 06 v2 activation occurred? | **NO**, intentionally | Active legacy AGENTS.md, README, 7 original Skills and PR #1 untouched |

## Corrective self-review finding

**SR-P01-01 / RESOLVED:** Original preparation required fully loading **14** lengthy normative files, including very large legacy references, in the new agent's context. This needlessly risked context overload and contradicted simplification. Fixed **before pilot execution**: require full fetch of **nine** v2 source files, while five canonical legacy references are consulted by relevant section whenever an actual field, margin, liquidation, freshness or source identity claim requires them. Critical safety policy is **not waived**; missing canonical evidence means uncertainty/abstention. Rubric and run-template aligned.

**SR-P01-02 / LIMITATION:** A new Temporary Chat may not have the connected GitHub capability; even if it does, its reported read operations may be model-attested rather than independently authenticated. Without real reads at fixed commit the pilot is `INCONCLUSIVE_SOURCE_LOAD`; no policy bypass.

**SR-P01-03 / LIMITATION:** This pilot intentionally assumes no current private Veles form P02, full Bybit T02, bot deposit or API key. It **cannot** demonstrate complete validated numeric bot settings, real Cross margin liquidation or F/A/H/R stress and cannot certify production operational readiness. These are expected, explicit constraints rather than reasons to invent data.

**SR-P01-04 / LIMITATION:** Rubric is transparent and authored by the same assistant. It tests a first separate-session answer and honest live-public-source behavior, but **not** a sealed-oracle/blind independent evaluator or statistically meaningful quality sample.

## Disposition and user gate

`PILOT_INSTRUCTIONS_READY / 9_OF_9_V2_SOURCE_PINS_VERIFIED / 12_OF_12_CRITERIA_DEFINED / P01_R01_NOT_RUN / SELF_REVIEW_PASS_WITH_LIMITATIONS`.

**Recommended next action:** User opens isolated Temporary Chat outside project, copies the self-contained prompt from `hype-p01-instructions.md`, obtains first unmodified full response and actual retrieval provenance, then brings it back for rubric evaluation. Do **not** pre-judge PASS, fill run record, activate Stage 06, launch Veles or modify original PR #1.
