# S09-007-R01 — sealed-oracle evaluation (2026-11-05)

## Provenance

- Run: `S09-007-R01`, fixture v1, P08-07.
- Pinned policy commit `bc5a1801f7e6a641482117118db9704b97e0d24d`.
- Fixture blob SHA `965c12afa0c4afc4c0b1698732e61c597d351b88`, independently fetched and checked.
- Original private evaluator oracle `S09-007-R01_PRIVATE_ORACLE.json`, **2998 bytes**; independent SHA-256 `9bf89691ada131747f6c9b35a546348f569aaa3b317428bd134954be2691ee14` **MATCH** the publicly preregistered [commitment](stage-09-04-s09-007-r01-commitment.md).
- User pasted apparent complete first model analysis response in development conversation; separate user attestation of new Temporary Chat and no regeneration for this specific test has **not yet** been recorded. No authenticated runtime/tool trace.

## Input and substantive outcome

The original `user_message` provides only conflicting synthetic EMA snapshots: 1h EMA20=98, EMA35=95; 4h EMA20=108, EMA35=110, with synthetic time 2026-10-20 12:00 Moscow, explicitly no source candles/method. `payload` repeats these four numbers. **The original public fixture does NOT specify exchange or symbol**, nor OHLCV, Mark, Last, exact EMA observation time or calculation method.

The tested response correctly:
- Separates 1h positive EMA20–EMA35 spread (+3) from 4h negative spread (-2).
- Treats both as unverified supplied indicators, not proof of trends, crossovers or signals.
- Reports instrument/exchange unspecified instead of inventing SOLUSDT/Bybit.
- Marks missing OHLCV, warm-up, price basis and freshness and requests appropriate inputs for stronger analysis.
- Describes as `R1 / MIXED / LIMITED_DATA` and avoids unsupported R2 trade specifics. Does not issue READY, REJECTED, order or R3 transition.

## Immutable sealed oracle checklist

| ID | Outcome | Observation |
|---|---|---|
| E01 | PASS | Synthetic time and no live data. |
| E02 | **NOT_SCORABLE — ORACLE_DEFECT** | Private criterion erroneously requires 'correctly identifies SOLUSDT scenario', but neither public case message nor payload names SOLUSDT; model rightly states unidentified. Correct pinned source/case selection portion passes. Do not penalize model for avoiding invented symbol. |
| E03 | PASS | All four EMA values and their timeframes correct. |
| E04 | PASS | 1h positive EMA alignment; no unverified Long. |
| E05 | PASS | 4h negative EMA alignment, timeframe conflict. |
| E06 | PASS | Missing candle, EMA calculation provenance and freshness explicitly stated. |
| E07 | PASS | No invented trading levels, account state or candles. |
| E08 | PASS | No directional trade; MIXED/LIMITED_DATA equivalent to insufficient-data/WAIT. |
| E09 | PASS | Separates supplied facts, hypotheses, missing verification inputs. |
| E10 | PASS | R1 descriptive, analysis-only without R3/READY/execution. |

**Content: 9/9 applicable mandatory checks PASS; E02 unscorable due to a preregistered oracle error.** Not a sealed `10/10 PASS`. The private oracle must remain unchanged; this defect was discovered **after** observing the model response. Avoid retrospective rewriting or ex-post selection.

**Formal verdict: `INCONCLUSIVE_ORACLE_DEFECT_E02`; `formal_case_accepted=false`.** An additional provenance attestation alone cannot repair the oracle defect.

## Required next action

Create an independently authored, versioned R02 private oracle that only grades attributes actually present in the immutable public input. Preserve its original bytes and publish a fresh SHA-256 **before** a fresh independent R02 run. Do not change fixture/policy to fit the failed oracle; do not reclassify R01 as an accepted 10/10. Historical accepted case tally remains 6/12. PR #1 stays Draft.
