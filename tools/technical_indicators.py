#!/usr/bin/env python3
"""Calculate indicators from a continuous CSV series of closed trade candles."""

import argparse
import csv
import hashlib
import io
import json
import math
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from statistics import mean, median

EPOCH = datetime(1970, 1, 1, tzinfo=timezone.utc)
MINUTE_MS = 60_000
DAY_MS = 1_440 * MINUTE_MS
INTERVAL_MS = {
    "15m": 15 * MINUTE_MS,
    "1h": 60 * MINUTE_MS,
    "4h": 240 * MINUTE_MS,
    "1d": DAY_MS,
    "1w": 7 * DAY_MS,
}
# Bybit weeks open at Monday 00:00 UTC. The Unix epoch was a Thursday.
INTERVAL_ORIGIN_MS = {"1w": 4 * DAY_MS}
CANDLE_FIELDS = ("start_ms", "open", "high", "low", "close", "volume_base")


@dataclass(frozen=True)
class Candle:
    start_ms: int
    open: float
    high: float
    low: float
    close: float
    volume: float


def utc_time(ms):
    return (EPOCH + timedelta(milliseconds=ms)).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def read_candles(data, interval, as_of):
    """Read the collector's candle CSV, with times checked against a trusted cutoff."""
    if as_of.utcoffset() is None:
        raise ValueError("Cutoff must include a timezone")

    duration = INTERVAL_MS[interval]
    origin = INTERVAL_ORIGIN_MS.get(interval, 0)
    reader = csv.DictReader(io.StringIO(data.decode("utf-8-sig"), newline=""))
    if not set(CANDLE_FIELDS).issubset(reader.fieldnames or []):
        raise ValueError(f"Expected CSV columns: {', '.join(CANDLE_FIELDS)}")

    candles = []
    for row in reader:
        try:
            start_ms = int(row["start_ms"])
            prices = [float(row[field]) for field in CANDLE_FIELDS[1:]]
        except (ValueError, TypeError) as exc:
            raise ValueError(f"CSV line {reader.line_num}: invalid candle") from exc

        candle = Candle(start_ms, *prices)
        if not all(math.isfinite(value) for value in prices):
            raise ValueError(f"CSV line {reader.line_num}: non-finite OHLCV")
        if (not 0 < candle.low <= min(candle.open, candle.close)
                <= max(candle.open, candle.close) <= candle.high or candle.volume < 0):
            raise ValueError(f"CSV line {reader.line_num}: invalid OHLCV bounds")
        if (start_ms - origin) % duration:
            raise ValueError(f"CSV line {reader.line_num}: candle does not align with {interval}")
        if EPOCH + timedelta(milliseconds=start_ms + duration) >= as_of:
            raise ValueError(f"CSV line {reader.line_num}: candle close must precede the cutoff")
        candles.append(candle)

    if not candles:
        raise ValueError("CSV contains no candles")
    candles.sort(key=lambda candle: candle.start_ms)
    for previous, current in zip(candles, candles[1:]):
        if current.start_ms - previous.start_ms != duration:
            raise ValueError(f"Gap or duplicate before candle {utc_time(current.start_ms)}")
    return candles


def smoothed_last(values, period, weight):
    if len(values) < period:
        return None
    result = mean(values[:period])
    for value in values[period:]:
        result += weight * (value - result)
    return result


def calculate(candles):
    """Return the latest indicators for a validated chronological candle series."""
    closes = [candle.close for candle in candles]
    ema20 = smoothed_last(closes, 20, 2 / 21)
    ema50 = smoothed_last(closes, 50, 2 / 51)

    changes = [current - previous for previous, current in zip(closes, closes[1:])]
    average_gain = smoothed_last([max(change, 0) for change in changes], 14, 1 / 14)
    average_loss = smoothed_last([max(-change, 0) for change in changes], 14, 1 / 14)
    rsi = None
    if average_gain is not None:
        if average_gain == average_loss == 0:
            rsi = 50.0
        else:
            rsi = 100 * (average_gain / (average_gain + average_loss))

    # The first candle contributes High - Low to the initial ATR average.
    first = candles[0]
    ranges = [first.high - first.low]
    for previous, current in zip(candles, candles[1:]):
        ranges.append(max(current.high - current.low,
                          abs(current.high - previous.close),
                          abs(current.low - previous.close)))
    atr = smoothed_last(ranges, 14, 1 / 14)

    rvol = None
    if len(candles) >= 21:
        baseline = median(candle.volume for candle in candles[-21:-1])
        if baseline > 0:
            rvol = candles[-1].volume / baseline

    return {
        "close": closes[-1],
        "ema20": ema20,
        "ema50": ema50,
        "rsi14": rsi,
        "atr14": atr,
        "atr14_pct": (atr / closes[-1]) * 100 if atr is not None else None,
        "rvol20": rvol,
    }


def analyze_csv(data, interval, as_of, *, require_latest=False):
    candles = read_candles(data, interval, as_of)
    duration = INTERVAL_MS[interval]
    last_close = candles[-1].start_ms + duration
    if require_latest:
        origin = INTERVAL_ORIGIN_MS.get(interval, 0)
        # A candle whose close equals the cutoff is ineligible.
        before_cutoff = (as_of - EPOCH - timedelta(microseconds=1)) // timedelta(milliseconds=1)
        expected_close = origin + ((before_cutoff - origin) // duration) * duration
        if last_close != expected_close:
            raise ValueError(f"Latest expected {interval} candle is missing: "
                             f"expected close {utc_time(expected_close)}, "
                             f"last CSV close {utc_time(last_close)}")
    return {
        "interval": interval,
        "as_of_utc": as_of.astimezone(timezone.utc).isoformat(),
        "candle_count": len(candles),
        "first_open_utc": utc_time(candles[0].start_ms),
        "last_close_utc": utc_time(last_close),
        "input_sha256": hashlib.sha256(data).hexdigest(),
        **calculate(candles),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv", type=Path, help="Bybit collector candle CSV or equivalent")
    parser.add_argument("--interval", required=True, choices=INTERVAL_MS)
    parser.add_argument("--as-of", required=True, type=datetime.fromisoformat,
                        help="trusted cutoff in ISO 8601 with Z or an explicit UTC offset")
    parser.add_argument("--require-latest", action="store_true",
                        help="require the last expected close strictly before the cutoff")
    args = parser.parse_args()
    try:
        result = analyze_csv(args.csv.read_bytes(), args.interval, args.as_of,
                             require_latest=args.require_latest)
        output = json.dumps(result, indent=2, allow_nan=False)
    except (OSError, ValueError, OverflowError, csv.Error) as exc:
        parser.error(str(exc))
    print(output)


if __name__ == "__main__":
    main()
