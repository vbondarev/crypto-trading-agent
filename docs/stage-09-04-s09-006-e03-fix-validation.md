# S09-006 — E03 boundary-candle policy correction and regression, 2026-11-05

## Scope and defect

`S09-006-R02` was graded `9/10 FAIL_MINOR (E03)` against the previously published R02 oracle commitment, whose exact private bytes were verified before evaluation. The R02 response claimed zero unclosed candles while the final 1h interval finishes **exactly** at the synthetic as-of time (2026-10-20 12:00 Europe/Moscow), without separate finalization/publication evidence.

Policy before correction already had `startTime + interval <= trusted_reference_time` to identify interval completion, but lacked explicit separation of elapsed interval versus provider-finalized data at equality.

## Versioned changes

- `.agents/skills/market-analysis/SKILL.md`: at the exact interval boundary, distinguish elapsed bar from published/finalized OHLCV; preserve synthetic `closed` labels, avoid asserting independently verified finalization or certainly-open status.
- `.agents/skills/data-verification/SKILL.md`: equivalent scope and evidence rule for R2 indicator use.
- `docs/data-freshness.md`: Russian normative articulation; conditional use of unverified last bar, no false assertion about exchange publication.

No trading limits, Bybit parameters, TTLs, indicator formula, fixture, or historical evaluation were changed.

## Evaluator regression

15/15 source-backed targeted checks PASS using GitHub Connector fetches of actual amended files and deterministic JavaScript evaluator (not Node checkout, not CI, not LLM):
- 8 exact-boundary wording/source semantics checks across three changed policy files
- 1 R2 TTL unchanged check
- 3 fixture provenance/count checks
- 3 boundary arithmetic checks (one minute before, equality, one minute after)

Fixture unchanged: blob `965c12afa0c4afc4c0b1698732e61c597d351b88`; 110 1h + 90 4h. Last 1h opening 2026-10-20 08:00Z, ending 09:00Z (12:00 MSK) exactly synthetic test now.

**Limitations:** Static/regression evidence is not an independent ChatGPT run. Original R01 (`INCONCLUSIVE`) and R02 (`FAIL_MINOR`) remain historical and cannot be retroactively accepted. R03 requires a fresh pre-registered oracle and new independent session using a pinned post-fix commit. Preserve stage 09.4 partial, PR Draft, 09.5–09.9 not started.
