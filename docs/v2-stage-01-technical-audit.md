# Crypto Trading Agent v2 — Stage 01 technical audit and migration map

**Audit date:** 2026-11-10. **Status:** `STAGE_01_AUDIT_IMPLEMENTED / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING`.

## 1. Decision, authority and immutable baseline

The user approved the **six-stage simplification migration plan** and authorized only **Stage 01 technical audit and mapping**, expressly prohibiting deletion, archival, or edits to existing project instructions. This document is a **new, additive audit artifact**; it is not activation of v2, a replacement for `AGENTS.md`, a new runnable Skill, execution of stage 09.6.3, a real-market test or permission to trade.

Repository `vbondarev/crypto-trading-agent`; audited branch `feature/initial-agent-mvp`; **audited immutable commit SHA** `39725a2aa1dd81adf5871a38bea8aa3c23e0ff8a` (PR #1 Open/Draft/unmerged at audit start). The audit uses full-file GitHub Connector reads by explicit commit ref; Git Blob identifiers are provider-reported and source lengths are JS UTF-16 code units, not independently reconstructed Git blobs. **This is a reviewed set of significant source files, not a proven exhaustive enumeration of every repository path**. No source-code execution, runtime Skill auto-loading or external-service connection was authenticated.

**User's eight required outcomes:**
1. analyze broad crypto market;
2. examine X/Twitter, Telegram, news, aggregators and relevant independent external information;
3. evaluate implications for the selected coin;
4. technically analyze that coin;
5. synthesize all evidence;
6. determine trend;
7. construct coin profile;
8. propose a genuinely platform-matched Veles or GinArea bot configuration.

**Target deployment:** ChatGPT + GitHub textual instructions; public market/context sources when actually accessible; **user-operated/manual bot configuration**; no agent-controlled real orders.

## 2. Actual baseline inventory and evidence

### 2.1 Entry point and core normative documents

| Existing path | Git Blob SHA | Observed scope | v2 disposition |
|---|---|---|---|
| `AGENTS.md` | `4e96077337e550448eb262599089fba9eb879d81` | Entrypoint; stage history, routing, priorities, statuses | **REWRITE LATER** as short v2 router; preserve original at immutable SHA |
| `README.md` | `44a121a2c750e9991883d317885cff4d2e569c2f` | Current introduction, many stage links | **REWRITE LATER** user-facing v2 quick start |
| `docs/mvp-scope.md` | `bc817c3d0e0b7aac06ef152e00d75a0ffa855dad` | Already describes near-identical request→sources→coin/trend→risk→strategy→bot pipeline | **REUSE / SHORTEN** rather than invent new goals |
| `docs/requirements.md` | `7298e118db8a6bdfe7b750b626fae045ce03fbf6` | FR-007–011 external sources; FR-012–017 multitimeframe/indicators/trend; account/risk/bot | **RETAIN SOURCE**, trace relevant functional constraints into v2 |
| `docs/architecture-decisions.md` | `2281ee7ba8a8c312508d7096371a2a8665ee3076` | AD-001 ChatGPT, AD-002 user execution authority, AD-003 GitHub text-first, AD-009 freshness | **RETAIN CORE DECISIONS**, propose future v2 addendum |
| `docs/agent-operating-rules.md` | `62c33c1c6de5fbedbe16945b175a4ce1d98f5cba` | Global source, risk, strategy and platform gates | **EXTRACT concise policies** into v2 entry flow; keep original intact now |
| `docs/data-sources.md` | `4a3b23cfaa8ed3aab17b008b39ec2ce47817d975` | Explicit X, Telegram, CoinGlass, CoinAnk, Bybit, data category/source routing, fallback/access limits | **REUSE as evidence catalogue**, simplify operational selection |
| `docs/data-freshness.md` | `2a2cc811340ba8414777fc2019ac41ceb6273a78` | Source identity, timestamps, TTL, AD-009 event invalidation | **RETAIN invariant**, summarize freshness in acquisition skill |
| `docs/risk-management.md` | `741e53f25baa77cd49a46e562858f8faf502acee` | 147,005-character detailed account, Cross/MMR, Short worst loss, margin, risk and F/A/H/R | **KEEP authoritative reference**; expose minimal risk-check before configuration |
| `docs/input-templates.md` | `fc1ff48c794d15982648bc745f632b4a3952a8e2` | T01–T06; minimal data per task, full account only when needed | **REUSE / SHORTEN** user requests |
| `docs/development-roadmap.md` | `744ef266072519f8a126f0f72762696eb013f836` | Historical stage plan and prior decisions | **KEEP HISTORICAL**, new v2 plan separate |

### 2.2 Seven real existing Skills → four logical target modules

| Existing Skill at `.agents/skills/<name>/SKILL.md` | Blob | Primary content | Future mapping |
|---|---|---|---|
| `data-verification` | `6815b433d91135738210ce5993af30b2bf2c74fa` | Provenance, spot/perpetual, source conflicts, timestamp freshness | **Embedded contract** inside `market-research` and final configuration recheck |
| `market-analysis` | `f458dbd67c4d26642f5ea46b3ed310c5fb5a1c02` | BTC/sector context, indicators, OHLCV, derivatives, events | **SPLIT** context/news/derivatives into `market-research` and OHLCV/indicators into `technical-analysis` |
| `portfolio-analysis` | `15d4d476e772a681e719c16dc9845251d22d7036` | Full account, orders/filled quantities, H01 and S0–S3 | **OPTIONAL SUPPORT** under `strategy-synthesis` and `bot-configuration` when positions/account risk matter |
| `risk-assessment` | `44661e995d2a5277eb034c8a0e97bef9223de50a` | FR-027–040, hard limits, H04, Cross/Short, stress | **RETAIN mandatory safety gate** as a concise contract invoked by synthesis/config; detailed source stays available |
| `strategy-planning` | `ce7d5fb44ace79f5564a8c175fb0b2b6d4011ef1` | NEW/ADD/HOLD/WAIT/REDUCE/CLOSE, H01, CHOOSE | **MERGE** into `strategy-synthesis` |
| `veles-configuration` | `a2d449f7a24cbc532ebc17f0f2f7f83423784357` | Veles mode/fields/order lifecycle, actual P02 guard | **RETAIN separate platform adapter**, called by `bot-configuration` |
| `ginarea-configuration` | `506f4ce0a53a2aba7a7513ab33e961121cda7320` | GinArea mode compatibility, IN/OUT, Disable IN, actual P02 | **RETAIN separate platform adapter**, called by `bot-configuration` |

**Important:** four logical v2 Skills need not be four monolithic copies of seven originals. Keep small platform-specific field maps and one shared hard-risk reference, rather than combining incompatible Veles/GinArea controls into a false universal form. Target names are **proposals**, not present verified paths.

### 2.3 Existing prompts, workflows and platform references

| Current file | Git Blob SHA | Stage 01 disposition |
|---|---|---|
| `docs/prompts/market-overview.md` | `b88061961fa1f0165e2d9d83ff780ee620229f28` | Reuse market/BTC/news tasks; integrate automatically into one request |
| `docs/prompts/technical-scenario.md` | `eaa5cf744f2379e1f300dceadafc00709f1b742b` | Reuse EMA/RSI/ATR, multi-TF, support/resistance scenarios |
| `docs/prompts/portfolio-recovery.md` | `6cf7824ed6c6425edaa12d8e1961b9295d74cded` | Keep optional position/H01 module and status history |
| `docs/prompts/risk-strategy-decision.md` | `60a0aca979804352f82b6039d856c4de6b575f4d` | Core source for strategy, hard veto priority and user choice |
| `docs/prompts/veles-configuration.md` | `433d4eb018020dc79a82ad8165756457c4eac5f0` | Veles handoff and valid fields |
| `docs/prompts/ginarea-configuration.md` | `a068d017333fd777311c23fedc671222c3f2716f` | GinArea handoff and valid fields |
| `docs/workflows/interaction-contract.md` | `19846dcbdd4e2c6b4a9c052bf3215d8f1f61168c` | Simplify ASK/ANALYZE/CHOOSE/RECHECK into one proactive workflow |
| `docs/workflows/report-templates.md` | `a12d190b0bf760aa2fc6d9fc6f6c4481ca32effe` | Reduce to one coin-profile + one bot-configuration report |
| `docs/platforms/veles.md` | `01f796302267ce05129abcaefef484f7009aaadb` | Preserve source-backed Veles modes and field mapping |
| `docs/platforms/ginarea.md` | `f733e3878044ee5c7e28b945919799a8225c203d` | Preserve source-backed GinArea variants, IN/OUT/Disable IN |
| `docs/platforms/configuration-contract.md` | `31a4ab98223ae29baadc73701daad3bf3d7a409b` | Preserve typed units, notional vs margin, P01/P02 and manual handoff |

The earlier 09.6 preflight's candidate paths `docs/prompts/strategy-planning.md` / `docs/prompts/strategy-recommendation.md` returned **404**; the **actual existing strategy prompt** is `docs/prompts/risk-strategy-decision.md`. Do not propagate those unverified paths into v2.

### 2.4 Actual regression and historic evidence (do not delete)

Verified existing tests:
- `tests/stage-07-09-composition-synthetic.mjs`: `8e4b702b8f4fe3dd20f4a122c1558af234ff0fa4`.
- `tests/stage-07-09-policy-contract-synthetic.mjs`: `9613ecf4a40aa00f4d306b6395e70af43c3b538f`.
- `tests/stage-07-09-mutation-synthetic.mjs`: `293c4678855cc16ae30ccae5b3e16f472d212395`.
- `tests/stage-08-09-integration-synthetic.mjs`: `1f5cca763ff7268ce9bc3b423227717976548535`.
- `tests/stage-09-02-fixture-integrity-synthetic.mjs`: `417a1e317e499e9ea38e87ebe10f475bc3fc48fd`.
- Public immutable `tests/fixtures/stage-09/inputs.v1.json`: `965c12afa0c4afc4c0b1698732e61c597d351b88`, 45 synthetically marked cases.
- Frozen accepted `docs/stage-09-05-results.md`: `28e8ec6e8a83858133ca0951058db69ba966a3aa`.
- Prior step `docs/stage-09-05-closeout.md`: `16e5939aa09a58041c16c5f83b111eaf066ab08b75` is **NOT** the correct blob; actual verified SHA is **`16e5939aa09a58041c7a483ee25352aaa6ebe85d`**. Always use the second actual fetched value.

**Scope limitation:** scripts were fetched/read, **not executed**. Prior documented JS pass counts are historic reports, not claims of tests rerun today. The draft PR/09.4/09.5 evidence cannot be erased to improve apparent v2 metrics. 09.6.2 six sealed private commitments are historical prepared evidence; 09.6.3–09.9 remain not invoked, and their restart requires a new decision.

## 3. Audit findings: where complexity actually lives

| ID | Severity | Grounded finding | Migration consequence |
|---|---|---|---|
| `A01` | High UX, not trading bug | Current user interaction depends on multiple sequential R1/R2/R3, routing, choice and final gate procedures; example entrypoint links many stage documents | Single request should create a cohesive report with optional follow-up only when material data are missing |
| `A02` | High UX | seven overlapping Skills plus extensive global specifications; copies of source verification, risk constraints and decision statuses | Reduce to four logical modules; split source-of-truth from user-facing procedure |
| `A03` | Medium product gap | Source registry **already has X/Twitter, Telegram, CoinGlass, CoinAnk**, plus provenance and access limitations; however source coverage in a default per-coin research *workflow* and explicit synthesis is not organized as one output | Implement prioritized primary-source + independent-source research and timestamped claim attribution, avoid invented access |
| `A04` | High product gap | Technical analysis, context and signals already specified, but no unified concise **coin-profile** deliverable combining broad regime, catalysts, timeframe trend, derivatives, reliability/conflicts and strategy stance | Define one typed/report contract in v2 |
| `A05` | Critical preservation | Platform maps contain **noninterchangeable** field semantics; manual configuration requires verified actual form/P02, min/max and units | One config Skill **with two isolated adapters**, never copy one platform's fields to another |
| `A06` | Critical preservation | Existing hard risk rules FR-027–040, AD-009, H04, S0–S3 control real new exposure; current Cross MMR / Short upper loss / F/A/H/R remain evidence-limited | Simplify presentation, **not** weaken veto/unknown/portfolio checks |
| `A07` | Medium governance | 09.4/09.5 and 09.6.1/09.6.2 have many hash-backed private-oracle synthetic records; session provenance mostly user-attested | Preserve all historical failed/pass outcomes; replace daily testing bureaucracy with small critical regression in v2 |
| `A08` | Medium version risk | README/AGENTS contain historical stage status paragraphs, including earlier phase checkpoints; `docs/stage-09-05-closeout.md` is controlling for accepted 09.5 | v2 entrypoint should carry one current state and link archived history, without changing historical documents now |
| `A09` | High data access | Public API endpoint documentation and named sources do **not** guarantee live ChatGPT connector/API permissions or that private Telegram posts were read | Design graceful `ACCESS_UNAVAILABLE`, source evidence labels and alternative accessible sources; never simulate observed social sentiment |

## 4. Explicit old→new file-by-file migration decision

**KEEP as canonical technical reference, without moving in Stage 01:**
`docs/data-sources.md`, `docs/data-freshness.md`, `docs/risk-management.md`, `docs/platforms/veles.md`, `docs/platforms/ginarea.md`, `docs/platforms/configuration-contract.md`, `docs/architecture-decisions.md`, `docs/requirements.md`, original test/fixture ledgers and prior closeouts.

**CONSOLIDATE content only in future approved v2 working branch:**
- new `market-research/SKILL.md` = market context and social/event/derivatives research from existing `market-analysis`, `data-verification`, `docs/data-sources.md`, `docs/prompts/market-overview.md`;
- new `technical-analysis/SKILL.md` = multi-timeframe OHLCV, indicator warm-up, trend, levels and volatility from `market-analysis` and `docs/prompts/technical-scenario.md`;
- new `strategy-synthesis/SKILL.md` = market+technical synthesis, coin profile, LONG/SHORT/WAIT, explicit user choice, conditional recovery and hard-risk gating from `strategy-planning`, `risk-assessment`, `portfolio-analysis`, `docs/prompts/risk-strategy-decision.md`;
- new `bot-configuration/SKILL.md` = one output contract with **conditional Veles/GinArea adapters** referencing existing two platform Skills, mode-specific tables, `docs/platforms/configuration-contract.md`, P01/P02 and current portfolio checks.

**FUTURE REPLACE ACTIVE ENTRYPOINTS ONLY AFTER REGRESSION:** `AGENTS.md`, `README.md`, possibly user-facing `docs/workflows/interaction-contract.md` and `docs/workflows/report-templates.md`. Do not assume old seven Skills disappear immediately: old and new may coexist until controlled activation.

**FUTURE RETIRE FROM ACTIVE LOADING, NOT DELETE HISTORICAL RECORDS:** detailed stage-based test invocation workflow/independent oracle bureaucracy from `docs/stage-09-*`, long historical stage approvals in user path; they remain in Git history and stable source paths unless later explicitly approved relocation with link validation. The current 09.6.2 commitments remain published as historical pre-test evidence, not silently marked passed.

## 5. Proposed v2 minimal invocation and report contract (design proposal, not implemented)

Input: `symbol`, exchange+market type (default as explicitly established by user; don't silently switch spot/perp), intended platform `Veles|GinArea|UNSELECTED`, budget/leverage if proposing concrete numeric settings, strategy horizon. Source availability can be discovered automatically where supported. Avoid requesting full private T02 merely to explain a coin.

Flow: `request → market+news/social/derivatives evidence ∥ OHLCV/technical evidence → source checks/conflicts → synthesis/coin profile → LONG/SHORT/WAIT → safe platform-matched draft or WAIT/NEEDS_DATA`.

Output **one report**:
1. market context (BTC/ETH, dominance, sector/regime);
2. coin-specific external catalysts (X/Telegram/news/aggregators, dated evidence and rumors);
3. actual technical analysis (timeframes, indicators/inputs, levels/volatility, conflict);
4. derivatives (OI/funding/liquidation liquidity with reliability);
5. **Coin Profile** (drivers, market regime, global/local trend, bullish/bearish/neutral evidence, confidence calibrated to coverage, invalidation);
6. strategy stance `LONG / SHORT / WAIT` plus conditional alternative;
7. **Veles or GinArea field mapping** when selected+supported, with budget/risk control, costs, grid, entry/exit, form evidence, and clear `DRAFT / NEEDS_DATA / NOT_RECOMMENDED` outcome;
8. critical missing data and follow-up needed for user manual activation.

Safety: preserve hard vetoes (5× leverage, 30% margin loading, 5% bot worst loss, ≤3 position slots, full future grid reserve, conditional reliable ≥15% liq gap, known ≥3% Moscow-day loss or ≥15% HWM DD and active H04 block new risk), AD-009 event invalidation, no fictitious bot fields or direct trading.

## 6. Stage 02 readiness and change control

1. **Stage 01 is inspection only.** No source edits, deletion, archive relocation, branch creation, PR merge, actual bot config or test executions are authorized/completed here.
2. On separate user approval, Stage 02 shall produce a concise v2 architecture contract, canonical sources, four logical Skills responsibilities and report schemas; **do not automatically deploy**.
3. Later implement in a **new isolated development branch/PR** rather than modifying existing PR #1 directly; branch name proposal `feature/simplified-agent-v2`, not created now. Existing SHA `39725a2aa1dd81adf5871a38bea8aa3c23e0ff8a` remains a recovery baseline.
4. Before any cutover, prove unchanged critical limits, correct bot-specific fields, no synthetic-to-live claims, source accessibility caveats and manual-only execution with a **small reproducible regression suite**; exact tests/acceptance in Stage 05.
5. Open problems `RV-02/03/04/06`, `TV-01..TV-04`, real `FR-038` remain OPEN. Auditing source documents is not proof they are resolved.

**Stage 01 handoff:** `AUDIT_COMPLETE / SELF_REVIEW_PENDING / USER_REVIEW_REQUIRED`. Current PR #1 stays Draft/Open; legacy 09.6.3 NOT_STARTED. No claim that a four-Skill v2 runtime already exists.
