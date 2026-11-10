# Crypto Trading Agent v2 — Stage 04 implementation results

**Date:** 2026-11-10. **Status:** `STAGE_04_IMPLEMENTED / SYNTHETIC_HANDOFF_CHECKS_PASS / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING / NOT_ACTIVATED`.

## Authorization and scope

The user accepted Stage 03 and its self-review, authorized **Stage 04 only**: implementing the end-to-end analysis route market/social/aggregators → technical → Coin Profile → LONG/SHORT/WAIT → Veles/GinArea **draft**, with checks and self-review. Changes MUST remain on `feature/simplified-agent-v2`; old `AGENTS.md`, `README.md`, original seven Skills, legacy stage logs and PR #1 remain untouched. v2 is **not activated**.

**Important architecture boundary:** v2 remains **ChatGPT + GitHub text-instruction orchestration**; the new route specifies how an assistant uses actually accessible sources at query time. We have **not created a self-running data collector**, any X/Telegram credential or live exchange model. A documentary route is not evidence that live feeds were accessed.

## Delivered components

1. `docs/v2/analytical-workflow.md` — **single-request** routing from RequestContext to two acquisition streams, evidence reconciliation, CoinProfile, StrategyProposal, risk-safe chosen-platform BotConfigurationProposal, AD-009 refresh and user-visible report. Supports early WAIT/NEEDS_DATA; doesn't demand full account merely to analyze coin.
2. `docs/v2/source-acquisition-policy.md` — source priority (Bybit identity, BTC/ETH, original project X/Telegram/news and independent analytics), independent publisher deduplication, real access states, rumors, timestamps, source conflicts, derivatives estimates.
3. `docs/v2/bot-handoff-policy.md` — selected-platform-only mode/field mapping, P01 documentation vs actual user P02, missing account/model gates, full grid/cost/reserve checks, known hard veto priority.
4. All **four** inactive v2 Skills `market-research-v2`, `technical-analysis-v2`, `strategy-synthesis-v2`, `bot-configuration-v2` now explicitly refer to those three docs. They remain `NOT ACTIVE`; **legacy seven Skills unchanged**.
5. `docs/v2/workflow-guard.mjs` — **pure synchronous deterministic nontrading handoff guard** for already-supplied structured records. Checks cross-module request/instrument IDs, evidence references/duplicates, missing or falsely verified evidence, invalid computed dependencies, indicator absence, WAIT+field map, platform/strategy mismatch, known hard veto, unsupported manual-review readiness. It **does not fetch data, compute market indicators, choose trading direction, calculate actual portfolio risk or place orders**.
6. `tests/v2/workflow-smoke.mjs` — **15 synthetic** negative/refusal/conditional-draft integration cases (including known H04 veto and false P02-ready), and original existing `tests/v2/fixtures/incomplete-hype.v1.json` unchanged.
7. `tests/v2/fixtures/conditional-long-draft.v1.json` — a second cross-contract synthetic scenario: **user-supplied, unverified** market+technical data indicate tentative local UP; overall trend MIXED/LOW, posture `LONG` only conditionally, Veles proposal `DRAFT` with **no fabricated mapping or future order grid**, because real P02/account/Bybit data unavailable.

## Tests actually executed

The committed guard and committed test source were **fetched back via GitHub connector** from `feature/simplified-agent-v2`; actual `inspectHandoff` function was evaluated in a fresh isolated V8 JS execution, and the actual committed `tests/v2/workflow-smoke.mjs` test body was run with its Node `fs` and `assert` dependencies adapted to in-memory test doubles loaded from the two original committed fixture files. **Result: 15/15 test cases PASS and 59 actual assertion calls.** This is **not** equivalent to a verified `node tests/v2/workflow-smoke.mjs` execution in a Git checkout.

A separate recursive structural test fetched **all 7 published JSON Schema Draft 2020-12** documents and both synthetic fixtures; checked types, enums, required fields, minima, conditional `if/then` used for config readiness, and cross-file evidence references. **Result: both fixtures PASS; 1,496 structural assertion invocations** (not 1,496 independent scenarios). This was a **subset structural validator, not a full standards-compliant JSON Schema engine**.

Recorded source Git Blob proofs during read-back:
- `docs/v2/workflow-guard.mjs`: `0509c5c709666aa53cd0222fa2f2334ddbe92a41`.
- `tests/v2/workflow-smoke.mjs`: `43afc271da54c15581ef95adb466b3ce575faed7`.
- `tests/v2/fixtures/incomplete-hype.v1.json`: `6dd8d2c8ee10622b6e1ba9ed77eeabfdbcb91e02`.
- `tests/v2/fixtures/conditional-long-draft.v1.json`: `1683d19fa910b26e218f92354984662a9801aacd`.

**Scope of success:** synthetically consistent workflow handoff, refusal/partial handling and typed shape checks; **NOT** actual live market ingestion, correct sentiment/classification, complete validated OHLCV, bot P02 form compatibility, historical or forward backtest, correct Cross/UTA MMR, real F/A/H/R or AI-autoload and response quality.

## Critical assurance and design choices

- Market evidence with inaccessible X/Telegram remains `ACCESS_UNAVAILABLE`; the system **must not** fabricate real posts or claim independent validation from duplicates. An issuer's statement is not independently verified truth.
- A global UP trend is **not automatically LONG**, and a conditional LONG with synthetic-only data is a **DRAFT**, not an executable bot setup.
- No true `VERIFIED_FOR_MANUAL_REVIEW` on scant evidence: the new guard additionally requires independently supplied `account_evidence_verified`, `platform_form_verified`, `risk_calculations_verified` and `required_stress_verified` options **plus** nonempty evidence and validated closed candles, atop P01/P02/risk map requirements. These Boolean attestations are a conservative guard input, **not** technical proof by themselves; final real compliance always remains external/account evidence dependent.
- Known hard violation (H04 / >3 slots / >5× / margin & loss limits etc.) takes priority over other missing data, and new risk should not be recommended even if the user requests a bot.
- No connector, runtime, plugin, Bybit account, bot or trading order is accessed by these tests.

## Known gaps before production activation

- `data ingestion` is a specified on-demand research workflow, not an implemented source-specific client/collector. No actual X/Telegram/Binance/Bybit feed run or third-party authorization is demonstrated.
- No complete JSON Schema 2020-12 validation using Ajv or standard engine, nor Node tests executed in a real Git checkout; Stage 05 should run these with a working GitHub checkout and CI.
- Guard validates inter-module consistency and **does not implement actual risk calculation, financial simulation, or P02 UI field mapping**. That work needs verified user data and trusted market observations, or must stay `NEEDS_DATA/UNVERIFIED`.
- No independently assessed LLM end-to-end coin research, synthesis or field plan output yet; Stage 05 to establish small critical regression on actual model behavior.
- Legacy `RV-02/03/04/06`, `TV-01..04`, and real `FR-038` remain OPEN. Nothing here constitutes real `R3 READY`.
- No external PR was opened for v2, no stage 05/06 execution and no cutover of current legacy agent.

**Disposition:** `STAGE_04_WORKFLOW_IMPLEMENTED / LIMITED_SYNTHETIC_PASS / USER_ACCEPTANCE_PENDING`. Await separate adversarial self-review and explicit user acceptance. Do not proceed to Stage 05 or switch the active agent automatically.
