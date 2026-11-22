#!/usr/bin/env python3
"""Offline Stage 09 replay of the HYPEUSDT Short entry rule."""

import argparse
import hashlib
import json
from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path
import zipfile

from collect_hype_r02_ohlcv import INTERVALS, validate_candles
from replay_hype_stage07 import analyze, ema, parse_time_ms


ARCHIVE_SHA256 = "dc829d7dd609769d7c40f462e46690ff24e7148ba1069843f78427681e57dd85"
ARCHIVE_ANCHOR = "2026-11-19T20:33:27.509Z"
ARCHIVE_AS_OF = "2026-11-19T20:33:33.826Z"
QUARTER = 15 * 60_000
HOUR = 4 * QUARTER
D = Decimal


@dataclass(frozen=True)
class Candle:
    end: int
    opening: Decimal
    high: Decimal
    low: Decimal
    close: Decimal


def evaluate(support, breakdown, trend_confirmed, retests, as_of):
    if as_of < breakdown.end:
        return "WAIT", "HOUR_NOT_CLOSED", None
    if not trend_confirmed or breakdown.close >= support:
        return "WAIT", "BREAKDOWN_NOT_CONFIRMED", None

    available_until = min(as_of, breakdown.end + HOUR)
    observed = {bar.end: bar for bar in retests if breakdown.end < bar.end <= available_until}
    for end in range(breakdown.end + QUARTER, available_until + 1, QUARTER):
        candle = observed.get(end)
        if candle is None:
            return "NEEDS_DATA", "MISSING_CLOSED_15M_BAR", end
        if candle.close >= support:
            return "WAIT", "RECOVERED_SUPPORT", end
        if candle.high >= support and candle.close < candle.opening:
            return "SHORT_CONFIRMED", "BEARISH_RETEST", end

    reason = "RETEST_EXPIRED" if as_of >= breakdown.end + HOUR else "RETEST_PENDING"
    return "WAIT", reason, None


def archive_candles(archive):
    if hashlib.sha256(archive.read_bytes()).hexdigest() != ARCHIVE_SHA256:
        raise ValueError("Unexpected Stage 07 archive SHA-256")
    report = analyze(archive, parse_time_ms(ARCHIVE_AS_OF))
    if report["public_data_status"] != "COMPLETE_SNAPSHOT":
        raise ValueError("Stage 07 snapshot validation did not pass")

    anchor = parse_time_ms(ARCHIVE_ANCHOR)
    series = {}
    with zipfile.ZipFile(archive) as bundle:
        for label in ("15m", "1h", "4h"):
            _, duration = INTERVALS[label]
            raw = json.loads(bundle.read(f"raw/kline-{label}.json"))
            rows, _ = validate_candles(raw["result"], duration, anchor, label)
            series[label] = [
                Candle(start + duration, *map(D, values[:4]))
                for start, values in rows
            ]
    return series


def trend_bearish(candles, cutoff):
    closes = [bar.close for bar in candles if bar.end <= cutoff]
    if len(closes) < 200:
        raise ValueError("At least 200 closed candles required for trend validation")
    return closes[-1] < D(ema(closes, 50)) < D(ema(closes, 200))


def replay(archive):
    series = archive_candles(archive)
    end = parse_time_ms("2026-11-18T21:00:00Z")
    breakdown = next(bar for bar in series["1h"] if bar.end == end)
    before_open = [bar for bar in series["15m"] if bar.end <= end - HOUR][-6:]
    expected_ends = range(end - HOUR - 5 * QUARTER, end - HOUR + 1, QUARTER)
    if [bar.end for bar in before_open] != list(expected_ends):
        raise ValueError("Missing support candles before the hourly breakdown")
    support = min(bar.low for bar in before_open)
    if support != D("66.825"):
        raise ValueError(f"Unexpected historical support {support}")
    trend = all(trend_bearish(series[label], end) for label in ("1h", "4h"))
    retests = [bar for bar in series["15m"] if end < bar.end <= end + HOUR]

    # Historical continuation values recorded in the Stage 09 report.
    # Its support and trend are supplied as the prior scenario's inputs.
    continuation_end = parse_time_ms("2026-11-19T22:00:00Z")
    continuation_break = Candle(continuation_end, *map(D, ("67.739", "67.84", "65.916", "66.006")))
    continuation_retests = [
        Candle(continuation_end + QUARTER, *map(D, ("66.006", "66.544", "65.97", "66.417"))),
        Candle(continuation_end + 2 * QUARTER, *map(D, ("66.417", "67.2", "66.349", "67.07"))),
    ]
    expired = [Candle(end + step * QUARTER, D("66.75"), D("66.80"), D("66.70"), D("66.73"))
               for step in range(1, 5)]
    late = Candle(end + 5 * QUARTER, D("66.79"), D("66.89"), D("66.54"), D("66.64"))
    cases = {
        "historical_positive": (
            evaluate(support, breakdown, trend, retests, end + 2 * QUARTER),
            ("SHORT_CONFIRMED", "BEARISH_RETEST", end + 2 * QUARTER),
        ),
        "historical_continuation": (
            evaluate(D("66.62"), continuation_break, True, continuation_retests,
                     continuation_end + 2 * QUARTER),
            ("WAIT", "RECOVERED_SUPPORT", continuation_end + 2 * QUARTER),
        ),
        "confirmation_candle_open": (
            evaluate(support, breakdown, trend, retests, end + 2 * QUARTER - 1),
            ("WAIT", "RETEST_PENDING", None),
        ),
        "hourly_candle_open": (
            evaluate(support, breakdown, trend, retests, end - 1),
            ("WAIT", "HOUR_NOT_CLOSED", None),
        ),
        "missing_15m_bar": (
            evaluate(support, breakdown, trend, retests[1:], end + 2 * QUARTER),
            ("NEEDS_DATA", "MISSING_CLOSED_15M_BAR", end + QUARTER),
        ),
        "expired_window": (
            evaluate(support, breakdown, trend, [*expired, late], end + 5 * QUARTER),
            ("WAIT", "RETEST_EXPIRED", None),
        ),
        "fourth_bar_in_window": (
            evaluate(support, breakdown, trend, [
                *expired[:3], Candle(end + HOUR, late.opening, late.high, late.low, late.close),
            ], end + HOUR),
            ("SHORT_CONFIRMED", "BEARISH_RETEST", end + HOUR),
        ),
    }
    results = {}
    for name, (actual, expected) in cases.items():
        if actual != expected:
            raise ValueError(f"{name}: expected {expected!r}, got {actual!r}")
        status, reason, candle_end_ms = actual
        results[name] = {"status": status, "reason": reason, "candle_end_ms": candle_end_ms}
    return {
        "scope": "OFFLINE_HISTORICAL_SIGNAL_REPLAY",
        "readiness": "NO_TRADE_READY",
        "archive_sha256": ARCHIVE_SHA256,
        "positive_support": str(support),
        "cases": results,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    args = parser.parse_args()
    try:
        print(json.dumps(replay(args.archive), indent=2))
    except (OSError, ValueError, KeyError, zipfile.BadZipFile) as error:
        parser.exit(2, f"{error}\n")


if __name__ == "__main__":
    main()
