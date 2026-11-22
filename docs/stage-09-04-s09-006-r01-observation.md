# S09-006-R01 — independent synthetic R2 run: evidence and provisional evaluation

## Immutable source and scope

- Case: `S09-006`, P08-06, fixture v1, SOLUSDT Bybit USDT Perpetual, **synthetic only**.
- Policy commit (pinned in tested agent session): `39ec1f2a0f04cd5762d4b095c9fe9cf3e0046f13`.
- Input fixture blob SHA: `965c12afa0c4afc4c0b1698732e61c597d351b88`.
- Synthetic clock: 2026-10-20 12:00 Europe/Moscow (NOT real execution time).
- Input: 110 closed-labelled 1h and 90 closed-labelled 4h OHLCV entries; synthetic Mark=100 at 11:59 MSK.

## Execution evidence

The user supplied an initiation report and the independent model's original market response in the development conversation on 2026-11-02. The user **explicitly attested** that the market response was the first answer in a fresh Temporary Chat outside the Crypto project, with no regeneration or subsequent corrections. The earlier Temporary Chat was lost; this execution used a fresh initialized session.

The initiation report named five explicitly read files, each tied to pinned commit and with blob SHA matching that Git tree:
- `AGENTS.md`: `e9e1c79ea522f886a0897ce266c802e3fd7e0e24`
- `docs/agent-operating-rules.md`: `62c33c1c6de5fbedbe16945b175a4ce1d98f5cba`
- `docs/data-freshness.md`: `10a1d9a39344990cb48ee13538ad3295a6e2808d`
- `.agents/skills/data-verification/SKILL.md`: `0425e4c8f75b280c6f5afe46af8e343a47d59c27`
- `.agents/skills/market-analysis/SKILL.md`: `50041bb11e1c8e7c6171e2163e4320e867f53e40`

The independent answer was supplied as a user-uploaded plain-text artifact titled `Вставленный текст(1).txt` (238 lines). This document is an evidence summary, **not** a technical browser/session export and **not** an embedded full raw transcript. Preserve the original uploaded transcript outside the test agent; do not claim it is archived in GitHub.

## Content observations (not sealed oracle results)

- Response: `R2_PRELIMINARY / UNVERIFIED`, directional decision **WAIT**; no ready strategy, trade, order, R3 transition, or live market request claimed.
- Explicitly labeled all data synthetic; reported 110 1h and 90 4h candles and pinned input blob.
- Reported major cross-timeframe OHLCV inconsistency and explained why directional confirmation is not possible.
- Calculated indicators on each series separately, distinguishing arithmetic from source provenance.
- Identified last 1h candle closing exactly at synthetic test time without a separate confirmed finalization event.
- Named Long/Short as unconfirmed conditional hypotheses, without execution prices or unsupported trade settings.
- Reported Mark (observed 11:59) separately from bar close and noted unknown candle price basis.

These are **provisional content observations**, not a numbered 10/10 oracle grade. The evaluator did not independently authenticate the temporary-chat tool trace or cryptographically archive the complete raw model transcript in this repository.

## Oracle availability and formal verdict

At the pinned policy commit, `docs/stage-09-04-oracle-commitments.md` contains **no S09-006-R01 preregistered commitment**. No accessible original private oracle preimage has been established in this evaluation. A hash or rubric authored *after* this response cannot retroactively prove preregistration or blind evaluation.

- `execution_status = EXECUTED`
- `session_isolation = NEW_TEMPORARY_CHAT_USER_ATTESTED`
- `raw_response = USER_UPLOADED_TEXT; NO_VERIFIED_SESSION_EXPORT`
- `content_screening = PROVISIONAL_PASS`
- `oracle_integrity = NOT_VERIFIED / NO_PRIOR_COMMITMENT_FOUND`
- `formal_acceptance = INCONCLUSIVE`
- `case_accepted = false`
- `09.4 = PARTIAL / PENDING INDEPENDENT EVIDENCE`

**Next action:** retain R01 as an executed observational run; prepare and publish a new immutable `S09-006-R02` oracle commitment **before** a genuinely fresh rerun, preserve its private preimage outside the tested agent, then independently score the complete original response. Do not rewrite R01 as PASS. No changes to risk limits, trading logic or 09.5–09.9 status.
