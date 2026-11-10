# v2 — research-source selection and reconciliation (NOT ACTIVE)

Use this as a narrow operational companion to the canonical `docs/data-sources.md` and `docs/data-freshness.md`. It grants **no** API, connector, privileged or paid access.

## Route source categories by objective

| Objective | Prefer when actually accessible | Negative rule |
|---|---|---|
| Bybit USDT perpetual price/candles | Official market identity, public tickers/kline/instrument details and verified returned data | Do not substitute Binance spot, quoted last for Mark, API documentation for observations |
| Broad market/macro | Original BTC/ETH and relevant market macro data/news, time-stamped | Do not present stale BTC narrative as current |
| Coin projects/events | Identified project issuer, exchange announcement, unlock/tokenomics primary source | Unverified impersonator posts remain RUMOR/UNVERIFIED |
| X/Twitter and Telegram | Public verified first-party announcements and attributable posts via actually enabled tools | No claimed access to inaccessible/private messages, no impression counts without sample |
| Independent news | Distinct original reporting and full event/time details | Syndicated clones are one provenance group |
| Derivatives | Official funding/OI where comparable; supported CoinGlass/CoinAnk view with time/model | Liquidation heatmap and inferred liquidation pools are estimates, not actual exchange fills |
| Platform fields | Selected mode's current official P01 plus actual user P02 | Do not invent form fields or treat a help page as current account UI |

## Quality and ambiguity
- Every important claim points to `EvidenceRecord`: source name, exact observed/retrieved/published time (when obtainable), instrument, method, independent-group and `access_status`.
- Count independent **originators**, not number of URLs mentioning a claim. Rumors have their own bucket; user posts and unverified screenshots are attributed rather than validated exchange data.
- If data conflict across time/source/instrument: show conflict; do not average incompatible prices/funding or silently select favorable account metrics.
- Sensitivity to volatility/event criticality follows AD-009; if a material event invalidates earlier evidence, mark `RECHECK` and update dependencies.
- Aggregate `coverage` from actual observations: `COMPLETE_FOR_SCOPE` only when relevant required classes genuinely covered; otherwise `PARTIAL` or `INSUFFICIENT`. A single inaccessible X/Telegram source need not invalidate unrelated technical analysis but **must** limit claimed social/news consensus.
- Distinguish `verified publisher` from `independently verified factual claim`; official social post confirms what an issuer *said*, not necessarily outcome of the claim.
- User's analysis may proceed with sparse evidence, but precision, strength and bot readiness must not exceed support.

## Reproducibility
For any coin profile keep a compact table of source class, status, observed/published time, independent provenance and material gaps. Never invent reference URLs. If no suitable data source is available in the live session, state it explicitly and produce a limited report or WAIT.
