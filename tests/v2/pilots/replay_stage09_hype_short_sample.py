#!/usr/bin/env python3
"""Replay HYPEUSDT historical Short candidates across three fixed UTC weeks."""

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
import hashlib
import json
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen

from replay_stage09_hype_short import Candle, HOUR, QUARTER, evaluate, trend_bearish


SYMBOL = "HYPEUSDT"
SOURCE = "https://api.bybit.com/v5/market/kline"
STARTS = ("2026-10-05", "2026-10-19", "2026-11-02")
WEEK = 7 * 24 * HOUR
WARMUP = 250
TIMEFRAMES = {"15": QUARTER, "60": HOUR, "240": 4 * HOUR}


def utc_ms(day):
    return int(datetime.fromisoformat(day).replace(tzinfo=timezone.utc).timestamp()) * 1000


def bounds(day, interval):
    start = utc_ms(day)
    end = start + WEEK
    step = TIMEFRAMES[interval]
    if interval == "15":
        return start - 6 * QUARTER, end + HOUR
    return start - WARMUP * step, end


def collect(day, interval):
    start, end = bounds(day, interval)
    query = urlencode({
        "category": "linear", "symbol": SYMBOL, "interval": interval,
        "start": start, "end": end - 1, "limit": (end - start) // TIMEFRAMES[interval],
    })
    url = f"{SOURCE}?{query}"
    with urlopen(url, timeout=20) as response:
        if response.status != 200:
            raise ValueError(f"{url}: HTTP {response.status}")
        return json.load(response)


def read_bars(payload, day, interval):
    start, end = bounds(day, interval)
    step = TIMEFRAMES[interval]
    if payload["retCode"] != 0 or int(payload["time"]) < end:
        raise ValueError(f"{day} {interval}m: Bybit response or closing-time check failed")
    result = payload["result"]
    if (result["category"], result["symbol"]) != ("linear", SYMBOL):
        raise ValueError(f"{day} {interval}m: unexpected market identity")
    rows = sorted(result["list"], key=lambda row: int(row[0]))
    if [int(row[0]) for row in rows] != list(range(start, end, step)):
        raise ValueError(f"{day} {interval}m: missing, duplicate or misaligned bars")
    candles = {}
    for row in rows:
        if len(row) != 7:
            raise ValueError(f"{day} {interval}m: invalid OHLCV row")
        opened, high, low, close, volume, turnover = map(Decimal, row[1:])
        if not all(n.is_finite() for n in (opened, high, low, close, volume, turnover)):
            raise ValueError(f"{day} {interval}m: non-finite candle value")
        if not (0 < low <= min(opened, close) <= max(opened, close) <= high and volume >= 0 and turnover >= 0):
            raise ValueError(f"{day} {interval}m: invalid OHLCV values")
        candle_end = int(row[0]) + step
        candles[candle_end] = Candle(candle_end, opened, high, low, close)
    digest = hashlib.sha256(json.dumps(rows, separators=(",", ":")).encode()).hexdigest()
    return candles, digest


def verify_aggregate(parent, children):
    aggregate = (
        children[0].opening, max(bar.high for bar in children),
        min(bar.low for bar in children), children[-1].close,
    )
    if aggregate != (parent.opening, parent.high, parent.low, parent.close):
        raise ValueError(f"Cross-timeframe OHLC mismatch at {parent.end}")


def replay_window(day, payloads):
    start = utc_ms(day)
    end = start + WEEK
    quarter, hourly, four_hour = (
        read_bars(payloads[label], day, label) for label in TIMEFRAMES
    )
    m15, hourly_bars, h4 = quarter[0], hourly[0], four_hour[0]
    for cutoff in range(start + 4 * HOUR, end + 1, 4 * HOUR):
        verify_aggregate(h4[cutoff], [hourly_bars[t] for t in range(cutoff - 3 * HOUR, cutoff + 1, HOUR)])

    results = Counter()
    close_breakdowns = 0
    signals = []
    for cutoff in range(start + HOUR, end + 1, HOUR):
        bar = hourly_bars[cutoff]
        verify_aggregate(bar, [m15[t] for t in range(cutoff - 3 * QUARTER, cutoff + 1, QUARTER)])
        first_close = cutoff - HOUR - 5 * QUARTER
        support = min(m15[t].low for t in range(first_close, cutoff - HOUR + 1, QUARTER))
        if bar.close >= support:
            continue
        close_breakdowns += 1
        if not all(trend_bearish(bars.values(), cutoff) for bars in (hourly_bars, h4)):
            continue
        retests = [m15[t] for t in range(cutoff + QUARTER, cutoff + HOUR + 1, QUARTER)]
        status, reason, retest_end = evaluate(support, bar, True, retests, cutoff + HOUR)
        results[reason] += 1
        if status == "SHORT_CONFIRMED":
            signals.append({
                "breakdown_end_ms": cutoff, "retest_end_ms": retest_end,
                "support": str(support), "close": str(m15[retest_end].close),
            })

    return {
        "start_utc": day, "hours": WEEK // HOUR,
        "raw_breakdowns": close_breakdowns,
        "rejected_by_trend": close_breakdowns - results.total(),
        "qualified_breakdowns": results.total(),
        "confirmed": results["BEARISH_RETEST"],
        "reset": results["RECOVERED_SUPPORT"],
        "expired": results["RETEST_EXPIRED"],
        "needs_data": results["MISSING_CLOSED_15M_BAR"],
        "rows_sha256": {"15m": quarter[1], "1h": hourly[1], "4h": four_hour[1]},
        "signals": signals,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("capture", type=Path, help="Path to the historical response JSON")
    parser.add_argument("--capture", action="store_true", dest="download",
                        help="Collect the fixed historical windows from the public Bybit API")
    args = parser.parse_args()
    try:
        if args.download:
            tasks = [(day, interval) for day in STARTS for interval in TIMEFRAMES]
            captures = {day: {} for day in STARTS}
            with ThreadPoolExecutor(max_workers=3) as pool:
                for (day, interval), payload in zip(tasks, pool.map(lambda key: collect(*key), tasks)):
                    captures[day][interval] = payload
        else:
            captures = json.loads(args.capture.read_text(encoding="utf-8"))

        windows = [replay_window(day, captures[day]) for day in STARTS]
        for window in windows:
            classified = sum(window[key] for key in ("confirmed", "reset", "expired", "needs_data"))
            if classified != window["qualified_breakdowns"]:
                raise ValueError("A qualified breakdown was not classified")
        metrics = ("hours", "raw_breakdowns", "rejected_by_trend", "qualified_breakdowns",
                   "confirmed", "reset", "expired", "needs_data")
        totals = {key: sum(window[key] for window in windows) for key in metrics}
        if args.download:
            with args.capture.open("x", encoding="utf-8") as target:
                json.dump(captures, target, separators=(",", ":"))
        print(json.dumps({"scope": "HISTORICAL_SIGNAL_FREQUENCY", "readiness": "NO_TRADE_READY",
                          "windows": windows, "totals": totals}, indent=2))
    except (OSError, ValueError, KeyError, InvalidOperation) as error:
        parser.exit(2, f"{error}\n")


if __name__ == "__main__":
    main()
