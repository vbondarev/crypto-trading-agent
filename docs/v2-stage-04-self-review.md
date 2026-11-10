# Crypto Trading Agent v2 — Stage 04 adversarial self-review

**Date:** 2026-11-10. **Finding:** `SELF_REVIEW_PASS_WITH_RUNTIME_AND_LIVE_DATA_LIMITATIONS / USER_ACCEPTANCE_PENDING / NOT_ACTIVATED`.

This is a second-pass critique by the **same** development assistant, not an independent model-run grader. The reviewed deliverables are [Stage 04 workflow results](v2-stage-04-results.md), `docs/v2/analytical-workflow.md`, source acquisition and bot handoff policies, four inactive v2 Skills, `docs/v2/workflow-guard.mjs`, two synthetic fixtures and `tests/v2/workflow-smoke.mjs`.

## 1. Review checklist

| Requirement | Finding | Explanation |
|---|---|---|
| End-to-end user journey from source research to Coin Profile/strategy/draft | **PASS at instruction/contract level** | One request and two source streams; unified synthesis and conditional bot handoff |
| Source verification and independence | PASS for design | X/Telegram/aggregators only if reachable, independent-origin dedup, dated EvidenceRecord and conflict/rumor labeling |
| Verified multi-TF technical indicators | PASS for design; **NOT_TESTED live** | Closed candle/warmup mandatory, unverified indicators remain null/not computed |
| Trend vs recommendation separation | PASS | CoinProfile `UP/DOWN/MIXED` distinct from StrategyProposal `LONG/SHORT/WAIT` |
| Complete bot proposal route with platform adapter | PASS for *conditional draft route*; **NOT_TESTED on real P02** | One Veles/GinArea selection, meaningful missing-evidence status, no fabricated UI mappings |
| Hard-risk new-exposure veto precedence | PASS for modeled synthetic cases | Known H04 and other hard veto logic checked; real Margin/Cross/Short calculation still OPEN |
| Unknown/contradictory source and no-data refusal | PASS | Missing market/technical and social access end in WAIT/NEEDS_DATA rather than imagined current numbers |
| False READY resistance | PASS for structural and modeled guard | P01/P02, risk model, source/candle proof and explicit external attestation gates needed |
| Pure routing guard performs real computations? | **NO; correctly not claimed** | No OHLCV indicator computation, Bybit MMR or actual portfolio calculations in JS module |
| Small regression suite | PASS for limited scope | 15/15 synthetic cases, 59 test-body assertions, conditional LONG remains DRAFT |
| Seven contract structures + two fixture parses | PASS in limited JS checker | 1,496 recursive structural assertions, not full JSON Schema standards engine |
| Real checkout Node tests, actual X/TG/Bybit, real LLM agent e2e | **NOT_RUN** | Network isolation; additional full tests required before production |
| Legacy branch and PR #1 protected | PASS pending final GitHub recheck | Writes only new/updated v2-only paths, never legacy files |
| v2 active? | **NO** | `AGENTS.md`, README, original seven Skills not modified; no auto-load or bot API work |

## 2. Adversarial scenarios and fault attribution

1. **Source unavailable:** A Telegram post or X thread cannot be inspected — source is `ACCESS_UNAVAILABLE`, not first-hand observation; synthetic tests reject falsely verified source.
2. **Same story five times:** Reposts or analytics using the same source count once (`independence_group`); this is an instruction policy, not an empirically measured social credibility classifier.
3. **Wrong market:** Bybit perpetual request plus a DOGEUSDT source is a typed mismatch and blocks handoff; Binance Spot vs Bybit Mark remains a semantic restriction, not a tested exchange API.
4. **Insufficient candles:** `EMA50` with no authentic price history cannot be marked verified; test rejects indicator without a source ID and non-null value.
5. **Contradicting sentiment and trend:** Workflow requires explicit MIXED/LOW and possible WAIT; no actual semantic LLM adjudication run yet.
6. **H04 active:** synthetic hard veto produces NOT_RECOMMENDED despite incomplete P02; if a bot draft still indicates readiness, guard issues a mismatch.
7. **Unsupported actual platform mode:** Veles and GinArea separate docs; silent switch or copying form fields forbidden, but no real interface P02 run conducted.
8. **User-supplied synthetic local UP:** second fixture carries conditional LONG, data gaps and DRAFT without executable mapping, demonstrating pipeline continuation **without** false READY.
9. **Unsafe final readiness:** even a form-like structured object is blocked unless current account, platform form, actual risk and mandatory stress evidence were externally verified. Guard's Boolean inputs are **not** proof of those facts; no live account claims.
10. **Event invalidation:** AD-009 dependent recomputation is specified but **not** demonstrated against real fills/market event streams.

## 3. New findings and remediation priorities

**SR-0401 / HIGH implementation limitation — no actual collectors:** Stage 04 implements a coherent *on-demand text-first agent procedure* and handoff validator, not external connector integration. Before claiming a fully operational analyst, run a real ChatGPT source-retrieval session for the selected coin and record what sources were actually reachable, with a real timestamp and identities. No invented sources.

**SR-0402 / MEDIUM — semantic checks beyond schema:** Incomplete access, bad publisher identity, forged evidence links, source independence and technical warmup require real verification and not only JSON shape checks. The separate `workflow-guard.mjs` is defense-in-depth, not a cryptographic oracle or exchange authority.

**SR-0403 / MEDIUM — real Node & JSON Schema checks:** The GitHub read-back test body was executed in V8 with test doubles, not in the repo's actual Node runtime. The original test and guard were loaded from pinned returned GitHub file content; 15 cases passed. Stage 05 should execute `node tests/v2/workflow-smoke.mjs` and `node tests/v2/contracts-smoke.mjs` in a real checkout and run full 2020-12 schema validation with Ajv or equivalent. Until then, retain `NODE_CHECKOUT_NOT_RUN`.

**SR-0404 / HIGH real trading risk remains open:** Known hard limits were retained (max 5×, IM ≤30%, bot worst loss ≤5%, max three projected positions, full future grid reserve, account-level liquidation where valid, day loss ≥3%, HWM DD ≥15%, H04). Missing or unverified Cross MMR, real worst-case Short loss and real F/A/H/R ⇒ no final trading approval. Existing `RV-02/03/04/06`, `TV-01..04` stay OPEN.

**SR-0405 / LOW product UX:** The Stage 04 v2 Skills now link to a consistent common route, but a novice user still may be shown a long report under `INSUFFICIENT` coverage. Keep user-visible answer compact and identify at most one essential follow-up rather than dump empty data fields. Stage 05 should assert concise response behavior.

**SR-0406 / scope:** No old files edited or archived; no PR #1 update, no live API, orders, bot activation, external account credentials, 09.6.3 restart or Stage 05/06 cutover.

## 4. Final decision

`STAGE_04_IMPLEMENTED / SELF_REVIEW_PASS_WITH_EXPLICIT_EVIDENCE_LIMITS / USER_ACCEPTANCE_PENDING`.

The user-requested eight-step **analysis process** exists as one documented/inactive v2 workflow with safe source aggregation, a tested structured handoff validator, a Coin Profile template, and a conditional selected-platform draft route. **It is not yet proven to work autonomously with live crypto/X/Telegram inputs or with real Veles/GinArea user forms**. Stage 05 must test actual agent end-to-end behavior before any Stage 06 activation.

**No transition to Stage 05 without user acceptance.** v2 stays isolated on `feature/simplified-agent-v2`.
