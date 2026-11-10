# Crypto Trading Agent v2 — end-to-end analytical workflow (candidate, NOT ACTIVE)

**Stage 04.** One user request → market/context + source research → technical analysis → Coin Profile → LONG/SHORT/WAIT → a **draft** Veles/GinArea configuration where appropriate. This is a **text-only ChatGPT/GitHub orchestration contract**, not a live API collector, autonomous agent, bot executor, or backtest. Do not infer that any external account/source was actually reached.

## 1. Entry routing

- Accept `RequestContext` (§3 of `docs/v2-stage-02-architecture.md`) with exact instrument, user goal, timeframe, preferred platform, budget if specified. MVP primarily Bybit USDT perpetual. Do not replace missing Bybit Mark with another exchange's Spot last.
- If user only asks for an educational explanation or market overview, stop at the necessary layer; do not request full T02, P02 or private account data.
- If user requests **coin + bot**, perform all relevant phases; no need to require separate confirmations at every substep. A **known** user platform preference can be carried forward; absent platform means show comparison and ask user to select before mapping actual UI fields.
- Do not treat documentation or a project GitHub connector as proof of current X/Telegram, Bybit, paid-aggregator or account API access.

## 2. Acquisition: two evidence streams; no fabricated tools

A. **market-research-v2** (source registry `docs/data-sources.md`):
1. Confirm symbol, exchange, instrument type and observation time.
2. Inspect reachable **official** Bybit market/instrument data and broad BTC/ETH/sector/macro context when relevant. Capture literal provenance in `EvidenceRecord`.
3. Look for coin/project announcements, tokenomics/unlocks and verified project/issuer posts from X/Twitter and Telegram, then independent original news and aggregators (CoinGlass, CoinAnk etc.) when reachable.
4. Keep `published_at`, `observed_at`, `retrieved_at`; distinguish `OBSERVED`, `USER_SUPPLIED_UNVERIFIED`, `ACCESS_UNAVAILABLE`, `NOT_CHECKED`. Syndication and copied datasets are a **single independence group**. Rumors and numeric sentiment metrics without a real sample are not confirmed.
5. Compare BTC regime, individual asset drivers, funding/OI/liquidation *estimates*. Preserve conflict or `PARTIAL/INSUFFICIENT` coverage.

B. **technical-analysis-v2**:
1. Verify price-source identity and closed OHLCV timeframe/warmup before EMA/SMA/RSI/MACD/ATR, volume, levels, multi-TF trends or numerical entry bands. Unavailable history ⇒ `NOT_COMPUTED`, no synthesized fake indicator values.
2. Resolve 15m/1h vs 4h/1d conflicts as `MIXED` or conditional scenarios rather than a forced trend. Record last closed candle and source IDs.
3. Produce `TechnicalEvidenceBundle` with real limits and `EvidenceRecord` references. Any event invalidating snapshots triggers AD-009 RECHECK.

**Ordering:** fetch inputs as allowed by tools. Market and technical research may be arranged concurrently in concept, but **do not claim asynchronous or automatic background execution**. Both must actually complete, or be marked as partial, before synthesis.

## 3. Evidence handoff

Before the next phase, check:
- `request_id`, exchange, symbol, `market_type`, settle and time-window coherence across request, market and technical bundles. Mismatch ⇒ `RECHECK/NEEDS_DATA`, not a combined answer.
- Every cited evidence ID resolves to a distinct `EvidenceRecord`; evidence with `ACCESS_UNAVAILABLE` or `NOT_CHECKED` must **not** support a verified factual claim, calculated indicator or precise numeric configuration.
- `independence_group` is used when counting independent corroboration. Multiple reports of one event do not increase certainty.
- Distinct published/event/retrieval dates are not silently merged. `docs/data-freshness.md`/AD-009 governs task-dependent freshness and event-triggered invalidation.
- Do not use fixture synthetic values as current market data.

## 4. Synthesis → Coin Profile

**strategy-synthesis-v2** combines only supported evidence from both bundles, assigning:
- Broad risk regime (BTC/ETH/sector), coin-specific catalysts, tokenomics and social/news coverage, derivatives limitations.
- Technical **global** and **local** trend `UP/DOWN/RANGE/MIXED/UNKNOWN`; key levels only if computed/verified.
- BULL/BASE/BEAR paths, triggers/invalidation, bullish/bearish drivers, contradictions and qualitative confidence (`HIGH/MEDIUM/LOW/INSUFFICIENT`). No invented profit probabilities.
- **Trade recommendation** `LONG/SHORT/WAIT` separately from trend. A rising trend can warrant WAIT if news conflict, funding, volatility, data gaps or portfolio risk make entry unjustified.
- `StrategyProposal.risk_screen`: known hard veto ⇒ `REJECTED`, unknown risk ⇒ `NOT_EVALUABLE/UNVERIFIED`; no fabricated live portfolio checks.

**If no adequate evidence:** useful `CoinProfile` may have UNKNOWN/INSUFFICIENT; explicit WAIT and missing-data reasons are a **completed analysis** outcome. Do not force bot configuration.

## 5. Strategy → bot handoff

**bot-configuration-v2** runs only when:
- user requests bot planning; platform is VELES or GINAREA (otherwise ask choice, do not invent mode);
- `StrategyProposal` is not WAIT/NOT_RECOMMENDED and not blocked by known hard risk; user trade purpose/budget known for numeric sizing;
- verified price/volatility evidence supports grid ranges and order sizing.

Then:
1. Choose **one** platform adapter: `docs/v2/adapters/veles.md` OR `docs/v2/adapters/ginarea.md`. Respect exact mode availability, UI label/units and P01-vs-P02 source distinction.
2. Size first IN and **all** reachable future grid orders with USDT notional vs margin clearly differentiated. Include fees/funding/slippage; state assumptions and reserve math.
3. Apply canonical `docs/risk-management.md`: leverage ≤5×, account IM ≤30% Equity, one-bot defensible worst loss ≤5% Equity, max three reachable positions, full reserve, verified applicable ≥15% Mark liquidation distance, known day-loss ≥3%, HWM DD ≥15% and H04 block risk additions. Missing full T02/MMR/P02 does **not** permit real READY.
4. Return `DRAFT|NEEDS_DATA|NOT_RECOMMENDED|VERIFIED_FOR_MANUAL_REVIEW`; even the last is a manual review handoff, **not** automatic execution or a guarantee of a live risk model.

**Known veto precedence:** active H04 or known hard-limit breach ⇒ reject new exposure regardless of P02 gaps. For unavailable P02/portfolio before approval, output **safe draft with missing fields**, not manufactured UI settings. If user has an existing position use optional legacy portfolio-analysis and H01/T05 only as needed.

## 6. User-facing response contract

Render **one coherent answer** using `docs/v2/coin-report-template.md`:
1. As-of time and market identification;
2. BTC/ETH and broad regime;
3. source-backed project/news/X/Telegram/aggregator findings and coverage gaps;
4. technical global+local trend, valid indicators/levels;
5. derivatives, Coin Profile, BULL/BASE/BEAR;
6. clear LONG/SHORT/WAIT with conditions and contradictions;
7. selected-platform bot parameters **only if evidenced**, status and risk/missing data; one essential follow-up when needed.

Do not dump a seven-schema JSON object to the user by default. Evidence may be recorded in typed documents, but prose must distinguish facts, calculations, estimates, assumptions and speculation.

## 7. Incremental update and stop conditions

- On new Mark, fill, Equity, order, platform mode or source event, invalidate dependent levels/risk/config and recompute via AD-009; do not blindly reuse earlier READY.
- Missing trusted data ⇒ `NEEDS_DATA`, risk `UNVERIFIED/NOT_EVALUABLE`; fabricated access or false result ⇒ correction, not a silent upgrade.
- A known hard veto, platform mode not supported, or unverifiable Cross/Short worst loss ⇒ no executable bot configuration; state why.
- **No API secrets, live orders, bot activation, background monitoring or trading automation.**

## 8. Evidence and implementation boundary

The current repo contains *instructions and JSON contracts*, not a verified collector, independent social network credential, P02 snapshot or running model. Deterministic checks can validate route semantics on synthetic inputs, but **cannot validate real market truth**. Before any activation, Stage 05 must test concrete end-to-end model behavior and user-facing responses; Stage 06 needs explicit cutover approval. The legacy `AGENTS.md` remains active and unchanged.
