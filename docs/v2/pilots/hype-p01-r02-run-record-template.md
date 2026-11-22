# HYPE-P01-R02 — first-answer and dataset custody record (EMPTY / NOT_RUN)

Do not alter the R01 archive. Do not assign PASS values or write fictitious source URLs before the independent run.

## Identity
- `run_id`: `HYPE-P01-R02`
- `policy_sha`: `b7123d9cf19502bf4a890f1400027f30fa213434`
- `data_zip_sha256`: `NOT_RECEIVED`
- `data_zip_path`: `NOT_RECEIVED`
- `collector_source_commit`: `853085ca7e35bb36efde269d79d9e17b6b7ea1ef`
- `data_fetch_method, operator/date/time and network`: `NOT_RECORDED`
- `session_model/platform, distinct chat and link/export`: `NOT_RECORDED`
- `full_original_prompt`: `docs/v2/pilots/hype-p01-r02-instructions.md` (copy prompt literally, no legacy R01 response)
- `account T02`, `P02`, `real Equity`: `NOT_PROVIDED`
- `100 USDT`: TEST_BUDGET_NOT_VERIFIED_EQUITY

## Pinned GitHub source loading
| Path | pinned ref | actual tool id/call trace | blob SHA | result |
|---|---|---|---|---|
| nine mandatory v2 paths | `b7123d9...` | `NOT_RECEIVED` | `NOT_CHECKED` | `NOT_RUN` |

## Dataset authentication
| Scope | Raw data file | CSV file | Rows | Last closed bar | Hash matches | Status |
|---|---|---|---|---|---|---|
| Instruments info | `raw/instruments-info.json` | n/a | | | | NOT_RECEIVED |
| 15m | `raw/kline-15m.json` | `candles/15m.csv` | | | | NOT_RECEIVED |
| 1h | `raw/kline-1h.json` | `candles/1h.csv` | | | | NOT_RECEIVED |
| 4h | `raw/kline-4h.json` | `candles/4h.csv` | | | | NOT_RECEIVED |
| 1d | `raw/kline-1d.json` | `candles/1d.csv` | | | | NOT_RECEIVED |

- `server_time_utc`: `NOT_RECEIVED`
- `R02 session as_of`: `NOT_RECEIVED`
- `AD-009 staleness/RECHECK`: `NOT_ASSESSED`
- `instrument identity and continuous closed OHLCV`: `NOT_VERIFIED`

## Technical calculations
| Indicator | TF | Last closed UTC | Source and method | Value | Reviewer recomputation |
|---|---|---|---|---|---|
| EMA20/50/200, RSI14, MACD12/26/9, ATR14 | 15m/1h/4h/1d | | | NOT_RUN | NOT_CHECKED |

## Decisions and checks
- `global/local trends`: `NOT_EVALUATED`
- `Coin Profile confidence/source coverage`: `NOT_EVALUATED`
- `LONG/SHORT/WAIT`: `NOT_EVALUATED`
- `WHAT_IF_ONLY conditional scenario`: `NOT_EVALUATED`
- `Veles readiness`: `NOT_EVALUATED`
- `Risk known violations / missing proofs`: `NOT_EVALUATED`
- `R02-01..R02-12 scores`: `NOT_SCORED`
- `session provenance`: `NOT_RECEIVED`
- `final R02 verdict`: `R02_NOT_RUN`

## Unmodified first complete independent R02 answer

`NOT_CAPTURED`

## Review and follow-up
- Raw first answer must be copied unedited to a **new** archive and SHA-verified; corrected answer is a new run id, never overwritten.
- Review using `hype-p01-r02-evaluation.md`.
- No Stage 06 activation, Veles order, legacy AGENTS/Skills/README or Draft PR #1 mutation.
