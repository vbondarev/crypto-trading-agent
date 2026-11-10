---
name: market-research-v2
description: Evidence-based crypto market, social/news and derivatives research for the selected coin; produce a verifiable MarketEvidenceBundle, never invent access or quotes.
---
# Market Research (v2 preview, NOT ACTIVE)
**Trigger:** user requests market context, coin research, social narratives or bot analysis. This Skill is a candidate for the v2 routing only; the current AGENTS.md remains authoritative.

## Inputs / output
Input: `RequestContext` with exchange, symbol, market_type, as_of and horizon. Output: `MarketEvidenceBundle` described in `docs/v2/contracts/market-evidence.schema.json` plus atomic `EvidenceRecord` items from `docs/v2/contracts/evidence-record.schema.json`.

## Procedure
1. Verify instrument identity and scope. For MVP use Bybit USDT Perpetual (linear) where requested. Binance spot, index, last and mark are **not** interchangeable.
2. Research **actual available** BTC/ETH market regime, dominance, sector changes, relevant macro events, project/issuer announcements, supply/unlocks, X/Twitter and Telegram posts, original news reports, and derivatives (open interest, funding, liquidation estimates, market depth) from appropriate sources. See `docs/data-sources.md`.
3. For each material factual claim, produce EvidenceRecord with source, access_status, observed_at/published_at/retrieved_at, market identity, reliability and independence_group. If no tool can access a source, mark ACCESS_UNAVAILABLE. A documented endpoint is not proof of access.
4. Differentiate first-party facts, independent reporting, opinions and rumors. Reposts, news syndication and aggregators using one underlying dataset belong to **one** independence group. Do not create a sentiment percentage without a defensible actual sampling frame and methodology.
5. Resolve conflicts by time/instrument/method and preserve both competing claims. No averaging of mismatched spot/perp or derivative metrics. Mark model heatmaps as estimates, not exchange orders.
6. Apply AD-009 freshness and event invalidation by decision type. Missing important market evidence reduces coverage and confidence; never invent data.
7. Return concise context with citations/evidence IDs, `coverage=COMPLETE_FOR_SCOPE|PARTIAL|INSUFFICIENT`, `gaps`, `conflicts` and time of report. Do not select LONG/SHORT, fill bot fields, trade or claim real READY.

## Validation / dependency
Schema references: `docs/v2/contracts/request-context.schema.json`, `evidence-record.schema.json`, `market-evidence.schema.json`. Canonical legacy references: `docs/data-sources.md`, `docs/data-freshness.md`, `.agents/skills/data-verification/SKILL.md`. Generated in isolated v2 branch for testing; no auto-loader proof.
