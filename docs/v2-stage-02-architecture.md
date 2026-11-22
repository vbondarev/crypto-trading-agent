# Crypto Trading Agent v2 — Stage 02 target architecture specification (DESIGN ONLY)

**Prepared:** 2026-11-10. **State:** `DESIGNED / PENDING_SELF_REVIEW / USER_ACCEPTANCE_PENDING / NOT_ACTIVATED`.

**Authority:** User accepted [Stage 01 technical audit](v2-stage-01-technical-audit.md) and [self-review](v2-stage-01-self-review.md), and authorized **only Stage 02 architecture design**: four logical Skills, data and Coin Profile schemas, source policy and module interfaces. They **did not authorize modifying live AGENTS.md, README.md, current Skills, prompts, platform mappings, historical tests, branches or runtime activation.**

**Baseline immutable commit:** `b2ddb1f97aa426027233a22b648dc226164a6902` in `vbondarev/crypto-trading-agent` on `feature/initial-agent-mvp`, PR #1 Draft/Open/unmerged when read. This document and its review are additive specifications only. Later changes to branch HEAD do **not** modify the baseline.

## 1. Purpose, boundaries and non-goals

**Single user purpose:** Given one selected coin, establish broad market regime, review available independently attributable external social/news/analytics, assess coin relevance, analyze real technical evidence, synthesize all inputs, determine multi-horizon trend, construct a concise Coin Profile and deliver a verifiable **manual-entry** Veles or GinArea bot proposal when justified.

**Primary market:** Bybit USDT Perpetual (linear) under the currently approved MVP. The symbol/contract and settlement must be confirmed; never silently mix spot, USDC or unrelated markets. User may ask market-only analysis without naming a bot.

**Explicitly not in v2 MVP:** placing/managing orders, starting or supervising bots, promising profits, fabricated live data/sentiment, assuming X/Telegram API access, building a proprietary high-frequency data backend, or awarding real trading `READY` without hard-gate proof. No credentials are requested or stored in public GitHub.

**Design principle:** *Simple user journey, strict internal validity*. Four short functional Skills are orchestrated **logically**, not necessarily four separately running agents. Existing detailed source standards remain canonical until user approves an actual migration. No business requirement mandates every module on every simple educational question.

## 2. Four Skills and their ownership boundaries

| Target logical Skill | Inputs | Responsibilities (owns) | Output | Must NOT do | Primary source references |
|---|---|---|---|---|---|
| `market-research` | request, identified symbol, market type, horizon, actually available public access | Broad BTC/ETH and market/sector regime, macro calendar/event relevance, attributable X/Telegram/project/bourse releases, news, tokenomics/unlocks and derivatives OI/funding/liquidation estimates; compare independent facts and distinguish rumors | `MarketEvidenceBundle` with per-claim provenance + coverage | Invent social sentiment counts, conflate posts/reposts with independent corroboration, publish unverified live indicators | `docs/data-sources.md`, `docs/data-freshness.md`, `data-verification`, market part of `market-analysis` |
| `technical-analysis` | exact Bybit instrument identity, closed OHLCV or verified indicator inputs, timeframes/horizon | Verify candle identity/time/closure and warm-up; EMA/SMA, RSI, MACD if supported, ATR, volume, volatility, HH/HL/LH/LL, S/R, market structure, multi-TF alignment, scenarios/invalidation | `TechnicalEvidenceBundle` with indicator computation provenance and uncertainty | Create values without sufficient warmup, use spot signals as verified futures Mark, declare strategy ready from one indicator | `market-analysis`, `docs/prompts/technical-scenario.md`, `docs/data-freshness.md` |
| `strategy-synthesis` | market+technical bundles, user objective/horizon, optional account/position/portfolio context | Join both bundles; independently rate source quality and contradictions; infer global/local regime and relative strength; build Coin Profile with bull/bear/neutral factors; choose `LONG/SHORT/WAIT` **as a recommendation**; compare alternatives; apply mandatory hard-risk screening and optional portfolio/H01 functions | `CoinProfile` and `StrategyProposal` with status and risk evidence | Automatically trade, falsely certify portfolio constraints, call H02/H03 missing a breach, infer H04 cleared, silently select user's bot platform | `strategy-planning`, `risk-assessment`, `portfolio-analysis`, `docs/risk-management.md`, `docs/prompts/risk-strategy-decision.md` |
| `bot-configuration` | chosen platform or explicit request to compare, CoinProfile, StrategyProposal, latest prices, candidate budget, platform/source-backed P01 fields, actual P02 when finalizing, synchronized whole-account T02 where needed | Translate one strategy to **exactly one user-chosen platform's** compatible fields, including mode, grid, IN/OUT, steps, order sizing, leverage, conditions, TP/SL/BE as supported; check required data, amount units and risk constraints; produce draft or abstain | `BotConfigurationProposal` and manual-entry checklist | Mix Veles/GinArea field names, pretend nonexistent P02 fields, claim Stop/Cancel/Pause equals exchange close, invoke live APIs or issue real `READY` from sparse account data | Both existing platform Skills, `docs/platforms/{veles,ginarea}.md`, `docs/platforms/configuration-contract.md` |

**Important design distinction:** `data-verification`, `portfolio-analysis` and `risk-assessment` do **not disappear as protections**: their validated algorithms/contracts are kept as reusable sub-capabilities or reference documents within the four Skills. Only the **top-level discovery surface** becomes four modules. This is a planned mapping, not a mechanical deletion of the seven original Skills.

**Platform sub-adapters:** `bot-configuration/adapters/veles.md` and `bot-configuration/adapters/ginarea.md` are *proposed* v2 files, not current verified repo paths. Veles SIMPLE/CUSTOM/SIGNAL, GinArea Default/Auto/Dynamic/Indicator/DCA and variant compatibility are looked up separately. If an advertised mode/field is not confirmed in actual P01/P02, output `NOT_VERIFIED` and no fabricated field assignment.

## 3. Shared data contracts: evidence first, then derived conclusions

The schemas below are **conceptual examples (JSON-like contracts, not currently implemented or validated by runtime)**. Every scalar that is time-sensitive or potentially disputed must be traceable to an evidence record; a source URL alone is not a verified measurement.

### 3.1 RequestContext
- `request_id`, `as_of`, `user_goal` (`COIN_RESEARCH|BOT_PROPOSAL|POSITION_REVIEW|EXPLAIN`), `instrument` {exchange, symbol, market_type, settle_coin, identity_status}, `horizon`/timeframes, `preferred_platform` (`VELES|GINAREA|UNSELECTED`), `risk_budget_usdt?`, `leverage_cap?`, `account_scope?`, `existing_position?`.
- Minimum for research: identifiable coin/market; ask one essential missing fact only if no defensible interpretation. Concrete grid sizing needs budget and the selected platform. Private full T02 is **not** required for a general coin research report; it is required for a **verified account-level final config/risk conclusion**.

### 3.2 EvidenceRecord (atomic shared primitive)
```json
{
  "evidence_id": "E-001",
  "subject": "HYPEUSDT",
  "claim": "one narrowly stated factual observation",
  "category": "MARKET|SOCIAL|NEWS|DERIVATIVES|ONCHAIN|TECHNICAL|PLATFORM|ACCOUNT",
  "source_kind": "EXCHANGE_PRIMARY|PROJECT_PRIMARY|PUBLIC_POST|NEWS_ORIGINAL|AGGREGATOR|USER_SUPPLIED|COMPUTED",
  "source_name": "named source",
  "source_ref": "URL or explicit user-supplied attachment identifier; never invented",
  "source_method": "ACTUAL_PUBLIC_WEB|DOCUMENTED_API|CONNECTED_TOOL|USER_TEXT|DERIVED",
  "access_status": "OBSERVED|USER_SUPPLIED_UNVERIFIED|ACCESS_UNAVAILABLE|NOT_CHECKED",
  "published_at": null,
  "observed_at": null,
  "retrieved_at": null,
  "timezone": "UTC or explicit offset",
  "value": null,
  "unit": null,
  "market_identity": "Bybit linear USDT perpetual or explicit non-equivalent market",
  "quality": "VERIFIED_SOURCE|SINGLE_SOURCE|CONFLICTED|STALE|ESTIMATE|UNKNOWN",
  "independence_group": "original-publisher-or-dataset-id",
  "limitations": [],
  "depends_on": []
}
```
- Not every record needs numerical `value`; news claims can be text with event time. Source name/date/identity are **mandatory when applicable to its use**; null values are explicitly null, not filled by guessing.
- A derived technical indicator references underlying `evidence_id`/OHLCV version and parameters. Never mark user screenshots/API documentation as independently verified live account measurements.

### 3.3 MarketEvidenceBundle
`{request_id, instrument, market_regime, btc_eth_context, sector_context, macro_events, coin_catalysts[], social_observations[], derivatives[], evidence_ids[], gaps[], conflicts[], fetched_at, coverage}`.

`coverage` uses `COMPLETE_FOR_SCOPE|PARTIAL|INSUFFICIENT` with brief reason. The outcome can be `PARTIAL` without inventing substitutes. This bundle **does not output a bot signal**.

### 3.4 TechnicalEvidenceBundle
`{request_id, instrument, candles_by_timeframe:[{timeframe, source_ids, count_closed, last_closed_at, candle_completeness}], indicators:[{name, parameters, value, computed_at, source_ids, validation}], trend_by_timeframe[], levels:[{price, type, method, source_ids}], volatility, momentum, volume, invalidation, disagreements[], gaps[]}`.
- EMA/SMA/RSI/MACD/ATR use valid closed candles and sufficient warmup when calculated. If raw data are insufficient: `NOT_COMPUTED`, not extrapolated current values.
- `trend_by_timeframe` = `UP|DOWN|RANGE|MIXED|UNKNOWN`, plus `confidence` and conditions. Do not automatically infer Mark Price from a spot OHLCV quote.

### 3.5 CoinProfile (single synthesized report object)
```json
{
  "instrument": {"exchange":"Bybit","symbol":"HYPEUSDT","market_type":"USDT_PERPETUAL"},
  "snapshot_at": "ISO8601-or-null",
  "market_regime": {"state":"RISK_ON|RISK_OFF|MIXED|UNKNOWN","reasons":[]},
  "coin_context": {"sector":"unknown-until-verified","relative_strength":"UNKNOWN","catalysts":[],"tokenomics_flags":[]},
  "social_news": {"dominant_narratives":[],"confirmed_events":[],"rumors":[],"coverage":"PARTIAL"},
  "technical": {"global_trend":"UP|DOWN|RANGE|MIXED|UNKNOWN","local_trend":"UP|DOWN|RANGE|MIXED|UNKNOWN","timeframes":[],"key_levels":[],"volatility":"UNKNOWN","signals":[]},
  "derivatives": {"funding":null,"open_interest":null,"liquidations":null,"interpretation":"NOT_CHECKED"},
  "bullish_factors": [],
  "bearish_factors": [],
  "contradictions": [],
  "scenarios": [{"name":"BULL|BASE|BEAR","trigger":"conditional","invalidation":"conditional","risk":"contextual"}],
  "trend_decision": {"direction":"UP|DOWN|RANGE|MIXED|UNKNOWN","confidence":"HIGH|MEDIUM|LOW|INSUFFICIENT","rationale":[]},
  "evidence_refs": [],
  "coverage_gaps": [],
  "last_material_event_at": null
}
```
All placeholders above are **schema examples, not live HYPE observations**. `confidence` is a qualitative, evidence-calibrated band, **not** an invented probability of profit. A direction can be UNKNOWN while the strategy is WAIT; direction and trading action are separate outputs.

### 3.6 StrategyProposal
`{strategy_id, coin_profile_ref, posture:LONG|SHORT|WAIT, strategy_type:GRID|INDICATOR|DCA|OTHER|NONE, rationale[], alternatives[], entry_conditions[], invalidation_conditions[], proposed_bounds?, profitability_claim:"NONE", risk_screen:{hard_vetoes[], not_evaluable[], model_status}, decision_status:RECOMMENDED_CONDITIONAL|WAIT|NOT_RECOMMENDED|NEEDS_DATA, user_choice_required:true}`.

Example: `trend_decision=DOWN` does **not** entail `posture=SHORT`: short may be too expensive, crowded, volatile or unsafe. Evidence gaps may yield WAIT.

### 3.7 BotConfigurationProposal
`{config_id, platform:VELES|GINAREA, platform_variant, instrument, strategy_ref, form_evidence:{P01_source,P02_verified_at?,field_map_version?}, input_budget, leverage, order_amounts[], grid_steps[], boundaries, entry_rules, exits, risk_checks:{hard_checks[],missing[],not_evaluable[]}, currency_units, assumptions[], mapping:[{ui_label,form_key_if_verified,value,unit,source_ref,verified_status}], readiness: DRAFT|NEEDS_DATA|NOT_RECOMMENDED|VERIFIED_FOR_MANUAL_REVIEW, manual_steps[], last_recheck_at, forbidden_automated_execution:true}`.
- `DRAFT` = non-executable analytic suggestion, values may be incomplete.
- `NEEDS_DATA` = essential fields unavailable.
- `NOT_RECOMMENDED` = strategy unfavorable or **known hard veto**; known veto takes precedence over missing data.
- `VERIFIED_FOR_MANUAL_REVIEW` = *all mandatory P02/current portfolio/margin/liquidation/risk/evidence gates actually verified*, not a synonym for legacy real R3 `READY`, not auto launch. If such gates cannot be verified in current tooling, remain DRAFT/NEEDS_DATA.
- Only **exactly one selected platform** may receive full field assignments. If unselected, provide high-level comparison and request the user's choice before specific handoff.

## 4. Source research and claim reconciliation policy

### 4.1 Coverage order
1. **Market identity/facts**: check official Bybit linear symbol, Last/Mark/Index and closed OHLCV from actual accessible authoritative source, not from an unrelated Binance spot quote.
2. **Broad context**: BTC and ETH direction, BTC dominance/sector and broad market risk appetite when source available; macro calendar events and policy news only with dates/time and relevance.
3. **Coin-specific primary statements**: verified project/issuer communication, exchange announcements, governance/tokenomics and unlock calendars. For X and Telegram, confirm *account/channel belongs to project* or disclose uncertain attribution.
4. **Independent reporting and context**: reputable original reporting; separately sourced commentary; independent derivative datasets where accessible (e.g., CoinGlass/CoinAnk), clearly marked as estimates/model heatmaps.
5. **User context**: risk budget, open portfolio/positions and platform evidence only where needed for numeric bot sizing.

### 4.2 Mandatory distinctions
- `SOURCE_PRIMARY_CONFIRMED`: official publisher and primary fact; source identity checked.
- `INDEPENDENT_CORROBORATED`: two or more genuinely independent origins/methods. Reposts, syndication, multiple aggregators sharing same API and bots echoing one message **count as one independence group**.
- `SINGLE_SOURCE_UNCONFIRMED`: one attributable publication but claim not independently validated.
- `RUMOR/OPINION`: commentary/speculation; sentiment evidence, **not factual event confirmation**.
- `ACCESS_UNAVAILABLE/STALE/CONFLICTED`: do not fabricate scraped text, followers, volumes, sentiment index or dates; say which source was unavailable and impact on final confidence.
- `AGGREGATOR_ESTIMATE`: OI/funding/liquidation map models are not exchange-realized fills or guaranteed stop/magnet levels.

### 4.3 Temporal and conflict handling
- Record `published_at`, `event_time` (if distinct), `observed_at`, `retrieved_at`, timezone and instrument identity; apply existing `docs/data-freshness.md` and **AD-009** task-dependent freshness and instant event invalidation.
- Conflicting sources: show both with identities, time difference, methodological differences and which is usable. No numeric averaging of non-comparable spot/perp/mark metrics. If material conflict unresolved, downgrade confidence and refrain from precise entry/liq level assertions.
- Sentiment analysis: qualitative `POSITIVE|NEGATIVE|MIXED|UNDETERMINED` only with cited sample origin and time window. A **numeric sentiment score** requires known sampling frame, platform coverage, deduplication, period and actual method; otherwise OMIT.
- Investigation is best effort **for actually reachable public data**. The v2 design must not assume unrestricted Telegram browsing, private channel access, X API payment/keys, paid aggregator APIs or a background watcher.

### 4.4 User-visible minimal provenance
For major claims show short claim + direct source + publication/observation time + evidence tag. Keep lengthy raw records in internal report, avoiding 40-source dumps in final answer. If research coverage is partial, include a concise `Coverage/Unknowns` line.

## 5. Workflow: one request, explicit quality gates, incremental refresh

```text
USER QUERY
   │ normalize market identity / task / desired bot
   ├───────────────┬───────────────────┐
   ▼               ▼                   │
MARKET-RESEARCH   TECHNICAL-ANALYSIS  │ optional account/form inputs
   └──────┬────────┘                   │ only if numeric config required
          ▼                            │
     STRATEGY-SYNTHESIS ◀──────────────┘
          │ CoinProfile + posture LONG/SHORT/WAIT
          ├─ WAIT/NOT_RECOMMENDED → show reason, sources, risk and follow-up
          ├─ no platform or budget → show comparison / draft; ask one essential selection
          ▼
     BOT-CONFIGURATION → one platform adapter → risk and form validation
          ├─ evidence insufficient → DRAFT / NEEDS_DATA
          ├─ known hard violation → NOT_RECOMMENDED (risk REJECTED)
          └─ all verified → VERIFIED_FOR_MANUAL_REVIEW (never automatic trade)
```

**Pipeline contracts and ownership:**
- Modules share one `RequestContext` and `EvidenceRecord` registry. CoinProfile references evidence IDs rather than copying unverified prose between modules.
- `market-research` and `technical-analysis` can run in parallel **only if** resources permit; no claim of background/asynchronous monitoring. Strategy synthesis waits for actual results or records the `PARTIAL` gap.
- `strategy-synthesis` must not supply missing per-platform UI fields; `bot-configuration` must not override analysis to force a bot. A negative result ends the workflow helpfully.
- User input required only for missing essential variables (e.g., trade budget, chosen platform, real P02, portfolio snapshot before account-level approval). No full T02 requirement for a plain coin overview.
- On user update to a specific dimension, reuse still-valid evidence selectively, **re-evaluate all dependent findings via AD-009**; update only changed module results when dependencies still valid.
- An existing bot/position request invokes optional portfolio/H01 reconciliation and the actual exchange order/bot lifecycle, not the simplified 'new bot' route.

## 6. Non-negotiable internal risk contract (compact public presentation)

Preserve the authoritative legacy `docs/risk-management.md` and current FR-027–040 interpretation until formally migrated; do not redefine or weaken its thresholds in a new abbreviated doc:

| Risk gate | Current known condition and consequence |
|---|---|
| Leverage | ≤5×; higher requested leverage vetoes config |
| Total proposed portfolio IM | ≤30% of relevant current Equity, including reachable future orders; unknown full account/margin model ⇒ NOT_EVALUABLE |
| Per-bot maximum loss | ≤5% Equity with **defensible modeled worst loss**, not deposit or stop trigger proxy |
| Position slots | ≤3 concurrently reachable exchange positions incl. future fills, not bots counted naively |
| Future averaging funds | 100% of relevant future IN reserve plus fees/funding/slippage buffers, avoid double counting |
| Liquidation safety | Adverse Mark-to-liquidation distance ≥15% **only if valid for actual Cross/Isolated mode**; displayed Cross liquidation estimate alone insufficient |
| Daily drawdown | Verified ≥3% Moscow-day loss blocks **new risk** under FR-035/036 |
| Historical HWM | Verified ≥15% drawdown blocks **new risk** under FR-028/036 |
| H04 | Known active block prohibits NEW/ADD/risk-expanding recovery; missing history H02/H03 = NOT_CHECKED, **not** assumed violation or pass |
| Stress/portfolio scope | True real-risk READY relies on complete synchronized account/positions/orders/P02 and valid F/A/H/R stress where required; synthetic scenarios cannot close FR-038 |

**Priority:** known hard veto ⇒ `NOT_RECOMMENDED` / risk `REJECTED` **even if other data missing**; missing critical inputs without known breach ⇒ `NEEDS_DATA`; unvalidated Cross/Short risk ⇒ `UNVERIFIED`; positive technical trend or news is never a waiver. Reducing existing risk may be discussed safely despite a block on adding exposure.

**Remaining unresolved:** `RV-02/03/04/06`, `TV-01..TV-04`, actual `FR-038` and automatic Skill loading remain OPEN, not solved by architectural design.

## 7. Reporting contract: one human-readable result

`COIN REPORT` has seven short sections, using only sections applicable to the question:
1. **Overview:** instrument/market, analysis time, broad BTC/ETH regime and sector context.
2. **External landscape:** verified releases, X/Telegram/news narratives, tokenomics, source disagreements, unavailable sources.
3. **Technical picture:** global 4h/1d and local 15m/1h (as applicable), valid indicator facts, volatility, price levels and invalidation.
4. **Derivatives and liquidity:** OI, funding, positioning/liquidation estimates when actually available.
5. **Coin Profile:** global/local trend, bullish/bearish evidence, key drivers, risk flags, confidence/coverage and BULL/BASE/BEAR conditional scenarios.
6. **Trading posture:** LONG/SHORT/WAIT (or no stance when insufficient evidence) and why it differs from raw price-trend sign.
7. **Bot proposal:** only one chosen Veles/GinArea set of verified UI fields with quantities and units, entry/exit/stop/TP as supported, risk table, clear readiness; otherwise WAIT/NEEDS_DATA/NOT_RECOMMENDED and concise next required fact.

Avoid exact fabricated prices, confidence percentages or fake backtest. The Coin Profile is not a trade signal until the risk/configuration stages have been completed.

## 8. Stage 03 build handoff, acceptance and change-control

**This document creates no v2 Skills or active user routing.** Stage 03, only after separate user acceptance, should:
1. Create a **new isolated v2 work branch or proposal PR** (suggested `feature/simplified-agent-v2`), without changing or merging Draft PR #1.
2. Implement four concise `SKILL.md` files and the two platform sub-adapter references; ensure each describes a true role and path, and preserves tested safety/freshness policy.
3. Add shared data contracts/report template and a small source-selection policy, then lint paths/structured outputs and run small synthetic tests.
4. Do **not** activate v2 in `AGENTS.md`/README before Stage 05 regression and Stage 06 explicit cutover approval. Any new branch changes are prospective and traceable to Stage 02 accepted spec.
5. Historical stage-09 reports, R01 failures, 09.5 R02 exception, sealed 09.6.2 commitments, and old project instructions remain unchanged.

**Stage 02 acceptance checklist (documentary only):**
- [x] Four distinct Skill responsibilities and no hidden fifth runtime agent.
- [x] Shared RequestContext/EvidenceRecord and typed handoffs.
- [x] CoinProfile, StrategyProposal, BotConfigurationProposal contracts and separation of market trend from trading action.
- [x] Source provenance/independence/time/access and conflicting news/derivatives handling.
- [x] Risk hard-veto priority and separate Veles/GinArea adapter structure.
- [x] Partial-data UX and AD-009 incremental refresh.
- [ ] Separate adversarial Stage 02 self-review.
- [ ] Explicit user acceptance.

**State:** `STAGE_02_DESIGNED / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING`; `STAGE_03_NOT_STARTED`. No real bot, live market evaluation, backtest or repository runtime migration completed.
