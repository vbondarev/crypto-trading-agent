# Crypto Trading Agent v2 — Stage 02 adversarial architecture self-review

**Reviewed on:** 2026-11-10. **Decision:** `STAGE_02_DOCUMENTARY_DESIGN_PASS_WITH_IMPLEMENTATION_GATES / USER_ACCEPTANCE_PENDING`.

**Reviewer provenance:** second-pass review by the **same development assistant**, not an external reviewer or actual runtime QA. This file is a separate, additive document. The reviewed [Stage 02 architecture specification](v2-stage-02-architecture.md) was initially committed at `3133d7cdee48bea9a19ced0cf731f487c95ab6cf`, Git Blob `f32454cf3b029fb25d6b400135882580b6e594f1`, based on user-accepted Stage 01 architecture audit. **No v2 implementation, actual live data collection or independent agent run has taken place.**

## 1. Structural/deliverable checks

| Self-review target | Result | Evidence and boundary |
|---|---|---|
| Four logical Skills, no hidden fifth agent | PASS | market-research, technical-analysis, strategy-synthesis, bot-configuration; data-verification, risk-assessment, portfolio-analysis remain internal normative sub-capabilities |
| Explicit module input/output and separation of responsibility | PASS | Table in §2 and shared data primitives/objects §3 |
| Shared source provenance, timestamps, typed market identity | PASS | RequestContext + EvidenceRecord includes publication, observation, retrieval and source access/quality |
| Independent-source deduplication | PASS | §4 one-origin groups; reposts and shared aggregated datasets never count as multiple corroborations |
| Social/network coverage not falsely promised | PASS | X, Telegram and aggregator research only if tools actually reach posts; missing coverage stated, no invented sentiment score |
| Technical calculation warm-up, closed candles and multi-TF disagreement | PASS | TechnicalEvidenceBundle and Technical Skill; no unsupported indicator values |
| Single Coin Profile + clear trend/action separation | PASS | CoinProfile trend UP/DOWN/RANGE/MIXED/UNKNOWN vs StrategyProposal LONG/SHORT/WAIT; negative result allowed |
| Source-backed two-platform form handling | PASS | Proposed distinct Veles and GinArea sub-adapters, P01/P02, typed sizes and currency units, no cross-platform copied fields |
| User manual control and no live trading | PASS | Explicitly no order placement/automatic bot launch and no credential collection |
| Critical risk contract preserved | PASS | FR-027–040, known ≥3% day/≥15% HWM/H04 new-risk veto, leverage 5×, IM 30%, bot bound 5%, slots 3, grid reserve, conditionally verified liquidation 15% |
| Known breach vs missing data precedence | PASS | §6 known veto > NEEDS_DATA; isolated H02/H03 history missing is NOT_CHECKED, not a fabricated violation |
| Frozen legacy records preserved, PR #1 still Draft/Open | PASS | No previous source was edited by this design; separate user gate before Stage 03 |
| Implementation tested, four Skills created, profile schema machine-validated? | **NOT_RUN** | Intentional design-only scope, not a claim of runtime functionality |

## 2. Adversarial scenarios (DESIGN CHECKS; no LLM executions)

1. **Source-access false positive:** X post behind login or inaccessible Telegram message must remain `ACCESS_UNAVAILABLE`; a search snippet or duplicated aggregator repost cannot be asserted as firsthand verified project announcement.
2. **Semantic event provenance:** Social positive coverage vs actual technical DOWN trend must produce explicit contradiction, possibly `WAIT`; no forced bullish bot.
3. **Market identity:** Binance spot last-price information cannot be silently substituted for Bybit USDT Perpetual Mark, especially for liquidation calculations.
4. **Trend ≠ signal:** `CoinProfile.global_trend=UP` does not force `LONG`; an imminent unlock, funding crowding, volatility or account risk can justify `WAIT`.
5. **Provisional config limitation:** If no real P02 or account-wide T02, `BotConfigurationProposal.readiness` stays `DRAFT/NEEDS_DATA`, **even when CoinProfile is detailed**.
6. **Hard risk override:** Verified active H04 or known slot/IM breach yields `NOT_RECOMMENDED/REJECTED` for NEW/ADD even when P02 or Mark are missing; no needless `READY` through an unrelated missing-data status.
7. **Cross/Short:** A displayed liquidation price or stop trigger is **not** proof of safe liquidation distance or capped short loss. `RV-02/03` stay OPEN.
8. **Unsupported platform fields:** If GinArea IndicatorGrid unavailable for chosen market, do not silently switch to DefaultGrid; if Veles field missing in user P02, do not invent or fill it.
9. **Lifecycle:** Pause, Stop, Cancel, Disable IN and exchange Close/fill are different operations; no bot config claims an exchange position has actually closed without evidence.
10. **Recheck after events:** Equity/Mark/order fill/bot edit/restart triggers AD-009 dependent recomputation even if a quote TTL has not elapsed.
11. **Missing social coverage:** The report can still explain well-supported technical information, but source coverage is `PARTIAL` and confidence cannot claim independent social confirmation.

These are **static specification trace checks**, not executed independent tests and not proof of live-source access.

## 3. Findings / agreed design caveats

**SR-V2-02-01 — Status vocabulary needs implementation discipline (medium, nonblocking design):** `VERIFIED_FOR_MANUAL_REVIEW` is an intended user-facing handoff only after all legacy applicable safety/evidence requirements have been fulfilled. It is **not** legacy `R3 READY`, not permission to place an order. During Stage 03 make the UI wording visibly say “verified fields, user must decide/manual action”; keep risk evaluation status independently typed as `PASS|REJECTED|UNVERIFIED|NOT_CHECKED`. If complete live account, Cross MMR, risk, stress and P02 evidence cannot be checked, do not issue this status.

**SR-V2-02-02 — A single quantitative `confidence` metric is unsupported (low, prevent false precision):** the architecture deliberately uses qualitative HIGH/MEDIUM/LOW/INSUFFICIENT. Stage 03 should document deterministic downgrade reasons (source absence, independent corroboration, time staleness, indicator mismatch) without inventing probabilities or treating number of mentions as probability.

**SR-V2-02-03 — Source availability/identity is not proven by this document (medium):** `docs/data-sources.md` contains X, Telegram, CoinGlass and CoinAnk **as source candidates** with varying access status. Do not turn an existing documentation entry into a claim that ChatGPT can access private channels, API endpoints, or paywalled data. For an inaccessible source retain an honest coverage gap.

**SR-V2-02-04 — Schema is a design, not a formal JSON Schema (medium, next-stage task):** §3 examples are explanatory. Stage 03 must implement actual schema-valid examples, enumerations, nullability, linked evidence provenance and a validation strategy; perform type/fixture regression then. Strings resembling contracts are not verified program behavior.

**SR-V2-02-05 — Critical algorithmic boundary (medium):** hard caps are faithfully carried forward, but unverified Cross/UTA models and actual F/A/H/R stresses are not solved by new prose; v2 cannot promise a real fully checked bot. Reserve/IM and worst-loss need defensible full-portfolio source inputs.

**SR-V2-02-06 — Scope/change control (PASS):** The current branch PR #1 continues as Draft/Open, old `AGENTS.md`, README, seven original Skills, docs, tests and run histories untouched. The approved stage 09.5 closeout, failed S09-015-R01 and lower-assurance S09-015-R02 exception remain historic; 09.6.3–09.9 not automatically resumed or marked complete. Future development should occur on a separately authorized isolated branch; this document is not a cutover instruction.

## 4. Self-review conclusion and user decision gate

**`STAGE_02_DESIGN_COMPLETE / SELF_REVIEW_PASS_WITH_DISCLOSED_IMPLEMENTATION_GATES / USER_APPROVAL_PENDING`.** The specification addresses the user's eight functional outcomes, includes 4 Skills, data contracts, CoinProfile, external-source research, synthesis and Veles/GinArea adapters; no blocking architectural contradiction was found in documented source constraints.

No Stage 03 Skills have been created; no active instructions were modified; no model test, bot execution, live API call, branch creation or PR merge occurred. The **next step requires explicit user acceptance** of the architecture, including its provisional statuses and the fact that some sources/risk inputs may remain inaccessible. After that, Stage 03 can implement the four modules on an isolated v2 branch without activating them in the active agent.
