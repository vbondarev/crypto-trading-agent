"""Replay a fictional two-leg portfolio against official Bybit historical Mark closes."""

from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from decimal import Decimal
import hashlib
import json
import sys
from urllib.parse import urlencode
from urllib.request import urlopen


ENDPOINT = "https://api.bybit.com/v5/market/mark-price-kline"
EPISODES = ("2025-02-02", "2025-04-06", "2025-10-10")
SYMBOLS = ("BTCUSDT", "HYPEUSDT")
HOUR_MS = 3_600_000
HOURS = 72
LEG_NOTIONAL = Decimal(500)


def epoch_ms(instant):
    return int(instant.timestamp()) * 1000


def load_mark_candles(symbol, first_day):
    start = datetime.fromisoformat(first_day).replace(tzinfo=timezone.utc)
    end = start + timedelta(hours=HOURS)
    start_ms, end_ms = epoch_ms(start), epoch_ms(end)
    params = urlencode({
        "category": "linear", "symbol": symbol, "interval": "60",
        "start": start_ms, "end": end_ms - 1, "limit": HOURS,
    })
    with urlopen(f"{ENDPOINT}?{params}", timeout=15) as response:
        http_status = response.status
        raw = response.read()
    data = json.loads(raw)
    if http_status != 200 or data.get("retCode") != 0:
        raise ValueError(f"{symbol} {first_day}: HTTP {http_status}, retCode {data.get('retCode')}")
    result = data["result"]
    if result.get("category") != "linear" or result.get("symbol") != symbol:
        raise ValueError(f"{symbol} {first_day}: wrong response identity")
    if int(data["time"]) < end_ms:
        raise ValueError(f"{symbol} {first_day}: historical window extends beyond exchange time")
    source_rows = result["list"]
    if any(len(row) != 5 for row in source_rows):
        raise ValueError(f"{symbol} {first_day}: unexpected Mark candle shape")
    rows = sorted(source_rows, key=lambda row: int(row[0]))
    if [int(row[0]) for row in rows] != list(range(start_ms, end_ms, HOUR_MS)):
        raise ValueError(f"{symbol} {first_day}: missing or duplicate hourly candles")
    closes = {}
    for timestamp, opening, highest, lowest, close in rows:
        op, hi, lo, cl = map(Decimal, (opening, highest, lowest, close))
        if not all(price.is_finite() for price in (op, hi, lo, cl)):
            raise ValueError(f"{symbol} {first_day}: non-finite OHLC price")
        if not (0 < lo <= min(op, cl) <= max(op, cl) <= hi):
            raise ValueError(f"{symbol} {first_day}: invalid OHLC relation")
        closes[int(timestamp) + HOUR_MS] = cl
    serialized = json.dumps(rows, separators=(",", ":")).encode()
    evidence = {
        "http_status": http_status, "ret_code": data["retCode"], "count": len(closes),
        "rows_sha256": hashlib.sha256(serialized).hexdigest(),
        "response_sha256": hashlib.sha256(raw).hexdigest(),
        "server_time_ms": int(data["time"]),
    }
    return closes, evidence


def replay_episode(first_day):
    (btc, btc_evidence), (hype, hype_evidence) = [
        load_mark_candles(symbol, first_day) for symbol in SYMBOLS
    ]
    if btc.keys() != hype.keys():
        raise ValueError(f"{first_day}: Mark candles are not aligned")
    t0 = next(iter(btc))
    pnl = {
        t: LEG_NOTIONAL * ((btc[t] / btc[t0] - 1) - (hype[t] / hype[t0] - 1))
        for t in btc
    }
    worst_t = min(pnl, key=pnl.get)
    return {
        "episode_start_utc": first_day,
        "sources": dict(zip(SYMBOLS, (btc_evidence, hype_evidence))),
        "aligned_hours": len(pnl),
        "worst_close_utc": datetime.fromtimestamp(worst_t // 1000, timezone.utc).isoformat(),
        "worst_gross_pnl_usdt": str(pnl[worst_t].quantize(Decimal("0.01"))),
    }


def main():
    try:
        with ThreadPoolExecutor(max_workers=len(EPISODES)) as pool:
            results = list(pool.map(replay_episode, EPISODES))
    except (OSError, ValueError, KeyError, ArithmeticError) as error:
        print(f"HISTORICAL_MARK_SOURCE_NOT_VERIFIED: {error}", file=sys.stderr)
        return 2
    print(json.dumps({
        "scope": "PUBLIC_MARK / FICTIONAL_PORTFOLIO / NO_TRADE_READY",
        "model": "BTC long and HYPE short, fixed size, 500 USDT per leg at first hourly close, no costs or fills",
        "results": results,
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
