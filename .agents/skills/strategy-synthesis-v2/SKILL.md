---
name: strategy-synthesis-v2
description: Synthesize research and technical evidence into a coin profile, LONG/SHORT/WAIT recommendation and non-weakening risk screening.
---
# Strategy Synthesis (v2 preview, NOT ACTIVE)
**Trigger:** user wants integrated coin outlook, trend portrait, possible strategy and bot feasibility.

## Inputs / output
Input: `RequestContext`, `MarketEvidenceBundle`, `TechnicalEvidenceBundle`, optionally validated user account/position history. Output: `CoinProfile` and `StrategyProposal` (`docs/v2/contracts/coin-profile.schema.json`, `strategy-proposal.schema.json`).

## Procedure
1. Join only **actual** source-backed observations by `evidence_id`; preserve missing sources and conflicts. Do not elevate rumors into verified catalysts or transmute a market analysis into account evidence.
2. Describe macro/BTC/sector regime, asset catalysts, relative strength, independent social/news coverage, multi-TF technical structure, derivatives and reliability. Produce bullish, bearish and conflicting factors.
3. Construct CoinProfile with global/local trend `UP|DOWN|RANGE|MIXED|UNKNOWN`, evidence-calibrated confidence `HIGH|MEDIUM|LOW|INSUFFICIENT`, and BULL/BASE/BEAR conditional scenarios with triggers and invalidations. Confidence is **not** a probability of profit.
4. Select a *recommendation* `LONG|SHORT|WAIT` by market setup plus risk, not solely by trend direction. Allow WAIT/NOT_RECOMMENDED when contradictory, risky, stale or thin data.
5. Apply a **non-weakening** hard-risk check before proposing exposure: leverage ≤5×; total planned IM ≤30% of verified Equity; bot worst loss ≤5% Equity if truly bounded; ≤3 reachable position slots; full margin and cost reserve for future IN; applicable adverse Mark-to-liquidation ≥15% only with valid account/margin model; known ≥3% Moscow-day loss, ≥15% HWM drawdown or H04 active blocks new risk. For unknown facts use NOT_EVALUABLE, not PASS. Known breach ⇒ REJECTED regardless of other missing data.
6. Ask only necessary account information for personalised portfolio-level or final bot approval. An ordinary coin overview **does not** require complete T02. If existing positions/averaging/recovery, use optional legacy portfolio-analysis and signed H01, H02/H03 NOT_CHECKED and H04 UNKNOWN semantics.
7. Present rationale, alternatives and user choice. **Do not silently choose platform or execute a trade.** Pass StrategyProposal to bot-configuration only if the user requested/selected the platform and conditions permit a draft.

## Validation / dependency
Schemas: `docs/v2/contracts/{request-context,market-evidence,technical-evidence,coin-profile,strategy-proposal}.schema.json`. Canonical **unchanged** risk source `docs/risk-management.md`, `.agents/skills/risk-assessment/SKILL.md`, `.agents/skills/portfolio-analysis/SKILL.md`, `.agents/skills/strategy-planning/SKILL.md`; AD-009 applies. Never conflate a v2 prose gate with real Cross/UTA modeling or F/A/H/R stress proof.

## Stage 04 end-to-end routing (inactive preview)

Follow the single-request workflow in `docs/v2/analytical-workflow.md`, including shared RequestContext/EvidenceRecord identity, source accessibility checks, partial-data handling, AD-009 event invalidation and downstream risk status. For source acquisition use `docs/v2/source-acquisition-policy.md`; for platform handoff use `docs/v2/bot-handoff-policy.md`. Do **not** claim these documents confer live API/tool access or activate v2. If the end-to-end workflow contradicts canonical `docs/risk-management.md` or actual Veles/GinArea P02, the canonical hard-safety/platform constraints prevail. Legacy AGENTS.md remains active, untouched.
