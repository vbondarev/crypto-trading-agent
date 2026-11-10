# Crypto Trading Agent v2 — Stage 03 implementation report

**Date:** 2026-11-10. **Decision:** `IMPLEMENTED_IN_ISOLATED_BRANCH / STRUCTURAL_SMOKE_PASS / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING / NOT_ACTIVATED`.

## 1. Authorization and untouched production boundary

User approved Stage 02 architecture and explicitly ordered Stage 03 implementation **only on separate `feature/simplified-agent-v2`**, leaving legacy `AGENTS.md`, `README.md`, seven original Skills, PR #1 and all historic test records untouched. Baseline PR #1 head before branch creation was `0333a6a34f2c9d0537ed080ebaf91af4261fc63c`. The new v2 branch was created directly from this full commit. Stage 03 changes are **new files only**; nothing is routed from active legacy `AGENTS.md` into the v2 modules. PR #1 remains Draft/Open. **No v2 PR was created or merged**.

## 2. Files created

### Four inactive v2 Skills
- `.agents/skills/market-research-v2/SKILL.md` — source identity, broad BTC/ETH and coin news, X/Telegram/analytics where reachable, derivatives, evidence, freshness, duplicate reports and coverage.
- `.agents/skills/technical-analysis-v2/SKILL.md` — correct instrument OHLCV, closed candle warmup, EMA/RSI/MACD/ATR when backed by data, structure, trend, levels and invalidation.
- `.agents/skills/strategy-synthesis-v2/SKILL.md` — merged evidence, Coin Profile, global/local trend vs LONG/SHORT/WAIT, conditional scenarios, hard risk precedence and optional account/H01 logic.
- `.agents/skills/bot-configuration-v2/SKILL.md` — one platform selected, P01/P02-backed fields, grid/costs/portfolio risks, only manual draft/review statuses.

Each Skill contains explicit `NOT ACTIVE` and never grants autonomous execution. The v2 variants use a suffix specifically to avoid shadowing existing names.

### Seven machine-readable JSON Schema Draft 2020-12 documents
`docs/v2/contracts/{request-context,evidence-record,market-evidence,technical-evidence,coin-profile,strategy-proposal,bot-configuration}.schema.json`.

Contracts cover required fields, typed objects/arrays, enums (market identity, provenance, confidence, trend, posture, risk/readiness) and constants (manual-only `forbidden_automated_execution=true`, `user_choice_required=true`). `CoinProfile` is distinct from the `StrategyProposal` trade stance, and an unverified social source has a proper typed `ACCESS_UNAVAILABLE` state.

### Two platform adapters + one report template
`docs/v2/adapters/veles.md`, `docs/v2/adapters/ginarea.md`, and `docs/v2/coin-report-template.md`. These are thin mode-specific checklists referencing **actual existing** source maps; no fake Veles/GinArea P02 data was generated.

### Test artifacts
- `tests/v2/fixtures/incomplete-hype.v1.json`: explicitly synthetic cross-contract fixture, unavailable social evidence, no OHLCV, UNKNOWN trend, WAIT, NEEDS_DATA Veles bot, no executable fields.
- `tests/v2/contracts-smoke.mjs`: dependency-free, runnable on a real checkout with `node tests/v2/contracts-smoke.mjs`; implements a structural subset of used JSON Schema keywords, cross-evidence references, manual-only assertions, and four negative mutations.
- `docs/v2/implementation-notes.md`: controls, limits and no activation.

## 3. Actual executed checks (scope-limited)

A separate isolated JavaScript tool run **fetched back all 16 newly created core JSON/Skill/test/adapter files** directly from GitHub at `feature/simplified-agent-v2`, parsed 7 JSON Schema documents and the fixture, recursively checked required types/enums/required fields, cross-reference IDs and adverse safety/status cases.

**Observed:** `PASS`, **1,079 structural assertion invocations** (recursive sub-property checks; not 957 independent tests), and **5/5 deliberately invalid mutations rejected**:
1. unsupported strategy posture `BUY_NOW`;
2. `forbidden_automated_execution=false`;
3. unsupported platform `UNKNOWN_BOT`;
4. fabricated source access state `SCRAPED_FOR_SURE`;
5. false `VERIFIED_FOR_MANUAL_REVIEW` with missing P02 and no passing risk model.

Additional checks confirm **four new inactive Skill documents** and **two inactive platform adapter documents**, plus existence of the reproducible Node smoke script. A post-review strengthening of the BotConfiguration JSON Schema adds a conditional `if/then` constraint: VERIFIED_FOR_MANUAL_REVIEW requires nonempty P01 and P02 evidence, risk model PASS, no missing/not-evaluable risk items and at least one mapped field. The smoke script was extended to check this condition and a fifth unsafe-status negative mutation; all 1,079 structural assertion invocations/5 negative mutations were rerun by the same isolated JavaScript read-back method. The core fixture correctly avoids a bot READY when user has only marketless synthetic context; `P02_verified_at=null`, posture WAIT and readiness NEEDS_DATA.

**Crucial qualification:** Direct `git ls-remote` in the local shell failed due DNS resolution of github.com; therefore the committed `node tests/v2/contracts-smoke.mjs` **was NOT executed on a true checked-out filesystem**. The executed verification was an equivalent **connector-read-back isolated JavaScript structural test**, not the checked-in Node script, a formal standard JSON Schema validator, integration/runtime skills loader proof, independent LLM run, fresh-source ingestion, or bot backtest. Keep these evidence classes separate.

## 4. Scope and known constraints

1. Schema structure cannot independently prove **source truth, timestamp freshness, sufficient OHLCV warmup, access permission, real P02 compatibility, real Bybit Cross MMR, Short worst-loss or F/A/H/R**. Those remain blocked by actual source evidence.
2. Risk-rule prose remains detailed and authoritative in legacy `docs/risk-management.md`, `.agents/skills/risk-assessment/SKILL.md`; simplified Skills point there and do not claim to have resolved `RV-02/03/04/06`, `TV-01..04` or real `FR-038`.
3. The current schema examples use labels to represent manually verified config fields, but the sample is intentionally `NEEDS_DATA`; nothing demonstrates numeric profitability, actual Veles/GinArea live form fields or a currently executable grid.
4. Current legacy `AGENTS.md` and old seven Skills are **not switched**, and the newly created `-v2` names must not be added to active router without a separate authorization and Stage 05/06 cutover.
5. Existing detailed old tests, failed R01, user-approved R02 exception and original 09.6.2 sealed commitments are preserved; they are **not v2 smoke test PASS outcomes**.

## 5. Next step and acceptance gate

`STAGE_03_IMPLEMENTED / LOCAL_STRUCTURAL_VALIDATION_PASS / NODE_CHECKOUT_NOT_RUN / SELF_REVIEW_PENDING / USER_APPROVAL_PENDING`.

If Stage 03 is accepted, Stage 04 may implement more detailed source/research and bot-config behavior on the isolated v2 branch without activating v2. Stage 05 must include actual checkout-based Node/JSON Schema full validator and a compact set of critical behavioral regression cases before any cutover, or clearly expose any missing proof. Stage 06 cutover requires separate user approval. **Do not merge or change legacy PR #1**.
