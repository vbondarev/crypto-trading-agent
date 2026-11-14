# HYPE-V01 / AN-02 — public Bybit collector security, evidence and correctness self-review

**Date:** 2026-11-14.
**Verdict:** `AN02_SOURCE_AND_RUNBOOK_SELF_REVIEW_COMPLETE / STATIC_CHECKS_PASS / LIVE_BYBIT_NOT_VERIFIED / PUBLISHED_NODE_RUNTIME_NOT_EXECUTED / USER_ACCEPTANCE_PENDING / NO_TRADE_READY`.

## 1. Tested scope / exact artifacts

- AN-01 acceptance of constrained trial, user message «Приниаю»: `docs/v2/pilots/hype-v01-an01-acceptance.md`, Git Blob `2ea5329464b3e2cabdfb55bb52986de663122dcd`.
- Public read-only Node.js source: `scripts/v2/bybit-public-market.mjs`, created at `1eee69b9a52211df64fca891358a4cdc2b280071`; readback Git Blob `c53568ecebbd0729fac60fd2dafa5f23088ce890` matched authored source.
- Windows PowerShell runbook and quality gates: `docs/v2/pilots/hype-v01-an02-public-bybit-data-repair.md`, created at `c6d24c20c5e49c31283c2016fc5fc1c16e19dea4`; Git Blob `781b197c151d5606182ba26735671b9b999c37bc` and content matched.
- Official Bybit V5 docs verified for `time`, `tickers`, `instruments-info` and `kline` public request/response structures; docs are not live quotes.

**Execution taxonomy:**
1. A **separate local Node.js prototype** was created in the model's container, passed `node --check` and `node --self-test` on synthetic data. It used substantially the same V5 validation/control design as the committed collector but was **not byte-identical** to the committed source.
2. The **exact committed Node.js file was fetched and statically inspected**, but **was not directly executed** in this environment; no false local PASS for its `--self-test`.
3. Direct Bybit API query via web was inaccessible; the execution container had DNS failure. No actual Bybit HYPE ticker, closed OHLCV or indicator calculation was achieved. This is **external-access not verified**, not an assertion that the exchange is down.

## 2. Static evidence and safety checks, specifically on committed source

| ID | Property | Result |
|---|---|---|
| S01 | Fixed official HTTPS host `api.bybit.com` | `PASS_STATIC` |
| S02 | Allowlisted four public `GET /v5/market/*` paths | `PASS_STATIC` |
| S03 | No account/order/position/execution/wallet endpoints | `PASS_STATIC` |
| S04 | No API key, auth signature or credential collection/header | `PASS_STATIC` |
| S05 | Exact `linear` market and intended symbol checks | `PASS_STATIC` |
| S06 | Response `retCode`, server timestamp and client clock skew checked | `PASS_STATIC` |
| S07 | Kline strictly descending unique starts, contiguous eligible bars | `PASS_STATIC` |
| S08 | ≥250 time-eligible OHLCV bars per 15m/1h/4h/1d | `PASS_STATIC` |
| S09 | Market-specific current candle filtering and no silent candle finality claim | `PASS_STATIC` |
| S10 | Public raw body and transport/source manifest retained | `PASS_STATIC` |
| S11 | At first failure stop with `NEEDS_DATA`, no Spot/secondary fallback | `PASS_STATIC` |
| S12 | `NO_TRADE_READY` remains even if data validation succeeds | `PASS_STATIC` |

**12/12 static source-invariant inspections PASS.** They do **NOT** establish actual Node execution on the published source, exchange reachability, profitable signals, real market authenticity or correctness for all possible provider responses.

## 3. Adversarial limitations

| ID | Severity | Remaining limitation | Proposed response |
|---|---|---|---|
| SR-AN02-01 | HIGH | Published source's `--self-test` still must run on an actual Node 18+ installation | First user-side or separate execution, do not claim it PASSED |
| SR-AN02-02 | HIGH | Direct public Bybit V5 unavailable from assistant tools/container DNS | Run public read-only collector from authorized user network, or keep `ACCESS_UNAVAILABLE` |
| SR-AN02-03 | HIGH | No actual fresh native `retCode=0` HYPEUSDT linear OHLCV and tickers, thus no technical indicators | No numeric LONG/SHORT or grid; rerun only after valid public response |
| SR-AN02-04 | MEDIUM | Kline does not include an explicit finalized-bar flag; elapsed interval + grace does not authenticate finalization | Keep `FINALIZATION_CAVEAT`, require independent freshness/completeness check |
| SR-AN02-05 | MEDIUM | Min 250 bars is not universal EMA/ATR/MACD convergence guarantee | Each future indicator needs its own warmup and last-closed-bar validation |
| SR-AN02-06 | MEDIUM | A successful HTTPS response and local export do not cryptographically prove upstream provenance once file is user supplied | Mark source as public user-supplied unless independently checked |
| SR-AN02-07 | MEDIUM | Script may encounter IP restrictions/rate-limits/clock skew or evolving response fields | Manifest records errors; fail closed and seek approved alternative, do not bypass restrictions |
| SR-AN02-08 | MEDIUM | User's Windows environment Node/git availability unknown; commands were not executed on their desktop | Offer manual run only, no claim of user-side success |
| SR-AN02-09 | LOW | No automated external v2 agent/process regression test, just module/source design | Require future full schema/guard + agent input-output test before activation |

## 4. Decision

It is appropriate to offer AN-02 for **bounded user acceptance as implementation of a reusable public-data acquisition path plus instructions**, **with live market ingestion and published-file runtime still outstanding**. This stage does **not** resolve access to Bybit from inside the current ChatGPT tool. A later valid public export (never account data) can be reviewed and used to calculate indicators and rerun HYPE Coin Profile.

Do not merge or activate v2; do not change the legacy agent, `AGENTS.md`, main or Draft PR #1. No Veles bot edit, private portfolio API, leverage change, trading order or numerical strategy.

`AN02_IMPLEMENTATION_COMPLETE_WITH_LIMITATIONS / SELF_REVIEW_COMPLETE / REAL_DATA_PENDING / USER_ACCEPTANCE_PENDING / STAGE_06_NOT_STARTED / V2_NOT_ACTIVE / NO_TRADE_READY`.
