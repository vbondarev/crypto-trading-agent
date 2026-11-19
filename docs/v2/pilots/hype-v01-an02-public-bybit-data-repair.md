# HYPE-V01 / AN-02 — public Bybit market-data acquisition repair and handoff

## Current runbook — Python (2026-11-19)

The Python collector extends the existing HYPEUSDT pilot script. Sections 1–5 below record the original Node.js implementation and its historical test status.

Run from the repository root on `feature/simplified-agent-v2` with Python 3.12 (the verified version). The collector and tests use the standard library.

```powershell
python -m unittest discover -s tests/v2/pilots -p "test_collect_hype_r02_ohlcv.py" -v
$capture = Join-Path $env:TEMP ('bybit-hype-' + [guid]::NewGuid().ToString('N'))
python .\tests\v2\pilots\collect_hype_r02_ohlcv.py --out $capture
```

A successful run writes a ZIP next to the capture directory. It includes exact response bytes for server time, instrument metadata, ticker and four trade-price kline series, plus CSVs and a manifest with request and retrieval times, exchange response times, and SHA-256 for the data files. The ticker records Mark, Last and Index separately. The manifest labels them with the response time as a proxy for the individual quote times.

The collector requires 250 or more contiguous time-eligible candles per interval and emits up to 300. It excludes open and recently elapsed bars, checks the latest expected bar against exchange time, and rejects a run spanning a change in the latest eligible candle. Elapsed time remains an eligibility check, with exchange finalization unverified. The clock and response freshness checks are acquisition checks. Evaluate freshness again at the time of analysis.

**Verification:** 10 offline Python tests passed, including a complete synthetic capture and negative cases. The direct HYPEUSDT capture stopped at the first request to get server time at 13:57 MSK with DNS error `[Errno 11001] getaddrinfo failed`. The manifest recorded `ACCESS_UNAVAILABLE_OR_INVALID / NEEDS_DATA` and no snapshot archive was created. The fresh public snapshot and therefore the analytical rerun are pending.

**Date:** 2026-11-14.
**Authorization:** user's «Приниаю» reply accepting AN-01 and allowing repair; evidence in `docs/v2/pilots/hype-v01-an01-acceptance.md`.
**Outcome:** `PUBLIC_READ_ONLY_COLLECTOR_COMMITTED / PUBLISHED_SOURCE_READBACK_VERIFIED / REAL_BYBIT_API_IN_THIS_SESSION_UNAVAILABLE / IN_REPO_SCRIPT_RUNTIME_NOT_YET_EXECUTED / USER_ACCEPTANCE_PENDING / NO_TRADE_READY`.

## 1. Root cause classification

This assistant's public web interface cannot retrieve usable JSON from `https://api.bybit.com/v5/market/tickers?category=linear&symbol=HYPEUSDT`, `https://api.bytick.com/v5/market/time` or equivalent HYPE V5 kline/instrument URLs. Its error was **tool-level URL inaccessible**, not an observed native Bybit `retCode` or verified HTTP 403. The container runtime also had no working DNS resolution for `api.bybit.com` in an independent 2026-11-14 test. These environments do not prove that the Bybit API is down for the user.

The official public Bybit API documents **read-only** `GET /v5/market/time`, `tickers`, `instruments-info` and `kline`:
- https://bybit-exchange.github.io/docs/v5/market/time
- https://bybit-exchange.github.io/docs/v5/market/tickers
- https://bybit-exchange.github.io/docs/v5/market/instrument
- https://bybit-exchange.github.io/docs/v5/market/kline

These methods do not require an exchange wallet API key. Bybit market `kline` uses `category=linear`, uppercase symbol, interval codes `15`, `60`, `240`, `D` and reverse chronological `list`. Its `limit` parameter permits up to 1000. This **official documentation establishes the interface contract, NOT actual successful calls in this session**.

## 2. Implemented feature-branch artifact

`scripts/v2/bybit-public-market.mjs` (Node.js ≥18, no external NPM packages; read-only public methods, fixed official host) is committed to `feature/simplified-agent-v2`.

**Public endpoint allowlist:** `/v5/market/time`, `/v5/market/instruments-info`, `/v5/market/tickers`, `/v5/market/kline`; it rejects arbitrary account/trade endpoints. Request symbols are validated as uppercase USDT pairs. No Bybit credentials, REST signing, authentication headers, local user account file, trading/transfer methods or browser session.

**Capture:** public `time`, instrument metadata and ticker; up to **300 raw** OHLCV rows for each interval `15`, `60`, `240`, `D`. Raw text of successful **public** responses saved as `bybit-*.json`. Save a `manifest.json` with endpoint URL, client retrieval timestamps, source's V5 response timestamp, source identity, row counts, gaps and status. Data stay on the operator's machine (do **not** commit current snapshots to public GitHub).

**Checks:** `retCode==0`, `result`, V5 time and local clock difference, `category=linear` and exact symbol, `quoteCoin/settleCoin=USDT`, `status=Trading`, positive `lastPrice/markPrice/indexPrice`, every OHLCV row length 7 with valid decimals and OHLC bounds, UTC-aligned start-time, strictly reverse chronological and unique, remove still-open/recent bars, ≥250 eligible bars, no gaps, latest expected elapsed interval. Special `FINALIZATION_CAVEAT`: elapsed wall time and provider V5 `time` **do not independently prove final exchange bar publication**; verify that before a real execution claim. Preserve original numeric strings, not imprecisely rounded market prices.

**Fail closed:** at first request failure write partial `manifest.json` with `ACCESS_UNAVAILABLE_OR_INVALID` and `NEEDS_DATA`, not invented quotes or replacement Binance Spot rows. Even a complete bundle is only `PUBLIC_DATA_READY_FOR_TECHNICAL_REVIEW_WITH_FINALIZATION_CAVEAT`, NEVER `READY` for an order or bot.

## 3. Windows PowerShell runbook (user's own PC, no API keys)

**Prerequisite:** Node.js 18 or newer and Git installed. Existing local repository users should fetch the `feature/simplified-agent-v2` branch; otherwise clone only that branch:

```powershell
git clone --branch feature/simplified-agent-v2 --single-branch https://github.com/vbondarev/crypto-trading-agent.git
cd crypto-trading-agent
node --version
node .\scripts\v2\bybit-public-market.mjs --self-test
node .\scripts\v2\bybit-public-market.mjs --symbol HYPEUSDT --out "$env:TEMP\bybit-hype-public"
```

**After successful data collection** (no need to disclose an account balance), create an archive of **public market files only**:

```powershell
Compress-Archive -Path "$env:TEMP\bybit-hype-public\*" -DestinationPath "$env:TEMP\bybit-hype-public.zip" -Force
```

If local repo exists, `git fetch origin feature/simplified-agent-v2` followed by a safe checkout of the desired branch is preferable to cloning a duplicate. Do not copy script into an active bot runtime or commit exported snapshots. No `Downloads` path is assumed (Windows may redirect it); using `$env:TEMP` avoids that issue.

The user may upload `bybit-hype-public.zip` here for source-level review. It contains **public** market data only. It should never contain private Bybit API keys, UID, balance, orders, positions or authentication headers.

**Self-test semantics:** `--self-test` injects fabricated Bybit-shaped offline responses and exercises identity, `retCode` failure, malformed OHLC, gaps/duplicates, current-bar exclusion and synthetic end-to-end manifest. A passing self-test proves code handles selected fixtures, not that Bybit is reachable or that current indicator signals are correct. No network is contacted in self-test.

## 4. Acceptance criteria and open issues

| Gate | Required evidence | As of this report |
|---|---|---|
| A1 source committed in isolated branch | Exact GitHub file readback | `PASS_SOURCE_READBACK` |
| A2 no account/trading endpoints | Static allowlist and source inspection | `PASS_STATIC_SCOPE` |
| A3 local synthetic behavior | `node --self-test` **on the actual committed file** | `NOT_EXECUTED_ON_COMMITTED_FILE`; offline prototype with equivalent controls passed separately |
| A4 genuine Bybit public time/ticker/instruments/klines | Real `retCode=0`, market identity, server times, complete raw response files | `BLOCKED_BY_CURRENT_TOOL_NETWORK`; local user-side collection not yet observed |
| A5 15m/1h/4h valid history and warmup | ≥250 unique recent closed-interval bars, continuity and provenance | `NEEDS_DATA` |
| A6 actual EMA/RSI/MACD/ATR run | Real unmodified public Bybit OHLCV, methods and indicator test outputs | `NOT_STARTED` |
| A7 rerun real HYPE Coin Profile | Market evidence + calculated technical results, WAIT allowed | `NOT_STARTED` |
| A8 real user bot/R3 | Full separate current account/margin and platform P02 review | `NOT_AUTHORIZED / NO_TRADE_READY` |

### Risks and limitations to keep explicit

- The published source has **not run on the user's network or as a loaded v2 agent**. A separate local draft with substantially the same public V5 validation logic was tested synthetically in this session, but one must **not claim the exact GitHub artifact passed those tests** until a fresh `--self-test` on the clone is observed.
- The actual provider might refuse public access due to jurisdiction, IP/geoblocking, DNS, anti-bot policy, rate limits, maintenance or altered API contract. Do not bypass restrictions, use private keys, automatically switch to unvetted third-party mirrors or present source failures as a Bybit exchange outage.
- `250` contiguous bars is a minimum collector requirement for many indicator lookbacks; it is **not universal proof of adequate warmup** for all indicator methods or a sufficient market decision. Indicator-specific full history and candle finalization remain independent checks.
- A `D` candle series or Bybit public market history is not a current **Mark** snapshot. For eventual risk R3, all canonical AD-009 time, account and platform gates remain. `market/tickers` Mark is a separate string from traded Last and Index.
- Static HTTPS public API payloads may be user-supplied without independent chain-of-custody authentication. Mark authenticity as **public-source user-provided** until independent source acquisition can corroborate it.

## 5. Handoff

User decision after review: accept AN-02 as a **public data collector and validation protocol with live access outstanding**, or request changes. After the user runs the cloned script and supplies the public export, perform independent **content validation/indicator calculations** and rerun Coin Profile — **without requesting private T02**. If source fails, return concrete `ACCESS_UNAVAILABLE / NEEDS_DATA` rather than market certainty.

`AN02_IMPLEMENTATION_RECORDED / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING / BYBIT_LIVE_DATA_NOT_VERIFIED / NO_TRADE_READY / V2_NOT_ACTIVE / STAGE_06_NOT_STARTED`.

Repo isolation: `feature/simplified-agent-v2` only. Do not edit legacy `AGENTS.md`, existing v2 Skills, `main`, draft PR #1 or previous pilot result files.
