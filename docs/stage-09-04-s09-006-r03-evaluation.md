# S09-006-R03 — independent synthetic R2 observation and evidence limitations (2026-11-05)

## Immutable inputs

- Run: `S09-006-R03`, case `S09-006`, prompt `P08-06`, fixture v1.
- Policy commit: `84b5043f442f4d976e17adb6e4f624361086fb34`.
- Fixture blob: `965c12afa0c4afc4c0b1698732e61c597d351b88`, independently fetched from GitHub.
- Synthetic clock: 2026-10-20 12:00 Europe/Moscow, **not** time of actual execution.
- Commitment published before R03: [S09-006-R03 commitment](stage-09-04-s09-006-r03-commitment.md), SHA-256 `4f87bb30d05e60d507bf68e6788d6646ced3802e3214384580a29637177872eb`.

## Received evidence

User pasted the complete apparent model answer in the development conversation on 2026-11-05. Preceding user-provided initialization report says all five normative documents were read via GitHub at the pinned policy commit with correct SHA and no failures. This is *user-supplied textual evidence*, not an independently authenticated session export. A separate explicit user attestation about first unedited response/session isolation for this specific R03 is not recorded.

## Independent arithmetic checks

Source-backed deterministic checks of the public fixture and returned response (not sealed oracle grading):

| Metric | 1h 109 bars (boundary excluded) | 1h 110 bars (conditional) | 4h 90 bars |
|---|---:|---:|---:|
| Last Close | 103.8454 | 103.9775 | 100.4907 |
| EMA20 | 102.5485 | 102.6846 | 100.9300 |
| EMA50 | 101.9972 | 102.0749 | 101.3814 |
| RSI14, Wilder | 85.24 | 86.09 | 33.94 |
| ATR14, Wilder | 2.3055 | 2.3188 | 2.2792 |
| 20-bar close return | +3.4751% | +3.4698% | -2.7429% |

All displayed model indicator values agree at stated precision. The final 1h starts 11:00 MSK and ends exactly at synthetic test time 12:00 MSK. Model correctly states the 110th bar is labelled closed by synthetic fixture but independent finalization/publication is `FINALIZATION_NOT_VERIFIED`, and bases its primary 1h indicators on the prior 109 candles.

Cross-timeframe 1h/4h overlap remains materially incompatible (4h close 100.4907 vs aggregated 1h close 103.8454 over 07:00–11:00 MSK). The model chooses WAIT, does not represent inferred data as live, does not claim READY, and does not transition to R3. Long/Short are conditional, explicitly subject to reconciling the inputs.

## Sealed oracle integrity: crucial missing evidence

The public commitment document is verified as existing at the previously committed GitHub ref. **However the evaluator's original private R03 oracle preimage is not found in current `/mnt/data/private_evaluator` or other accessible `/mnt/data` paths.** Consequently the published hash cannot be independently recomputed from the original bytes. It is improper to claim sealed `10/10` or to reconstruct/post-date a new rubric.

- `execution_status = EXECUTED`
- `content_screening = PROVISIONAL_PASS`
- `E03_observed = ADDRESSED`
- `oracle_original_preimage = UNAVAILABLE`
- `sealed_oracle_hash_reverified = false`
- `formal_acceptance = INCONCLUSIVE`
- `formal_case_accepted = false`
- `09.4 = PARTIAL / PENDING INDEPENDENT EVIDENCE`

Historical R01 INCONCLUSIVE and R02 FAIL_MINOR remain unchanged. Preserve original R03 response in development conversation as evidence; do not label this text a technical session export or a full independent scored run. A future complete sealed pass requires a new preregistered test and persistently accessible private oracle original; do not retrospectively relabel R03.
