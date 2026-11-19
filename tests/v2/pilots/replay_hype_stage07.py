#!/usr/bin/env python3
"""Replay a public HYPEUSDT snapshot from the Stage 07 pilot offline."""

import argparse
import json
import re
import zipfile
from urllib.parse import urlencode
from datetime import datetime
from decimal import Decimal, localcontext
from pathlib import Path

import collect_hype_r02_ohlcv as collector


def parse_time_ms(value):
    stamp = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if stamp.utcoffset() is None:
        raise ValueError("Expected a timezone-aware timestamp")
    return int(stamp.timestamp() * 1000)


def ema(closes, period):
    with localcontext() as context:
        context.prec = 40
        average = sum(closes[:period]) / period
        weight = Decimal(2) / (period + 1)
        for close in closes[period:]:
            average += weight * (close - average)
        return str(average.quantize(Decimal("0.00000001")))


def ticker_values(result):
    prices = collector.validate_ticker(result)
    rules = {
        "fundingRate": r"-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?",
        "openInterest": collector.DECIMAL_TEXT,
    }
    warnings = {}
    for field, rule in rules.items():
        value = prices[field]
        if not value or re.fullmatch(rule, value) is None:
            warnings[field] = "MISSING" if value is None or value == "" else "INVALID"
            prices[field] = None
    return prices, warnings


def analyze(archive, analysis_ms):
    intervals = collector.INTERVALS
    raw_names = {"time", "instruments-info", "ticker", *(f"kline-{key}" for key in intervals)}
    paths = {f"raw/{key}.json" for key in raw_names} | {f"candles/{key}.csv" for key in intervals}
    with zipfile.ZipFile(archive) as bundle:
        names = bundle.namelist()
        if len(names) != len(set(names)) or set(names) != paths | {"manifest.json"}:
            raise ValueError("Unexpected archive entries")
        if any(item.file_size > collector.MAX_BODY_BYTES for item in bundle.infolist()):
            raise ValueError("Oversized archive entry")
        manifest = json.loads(bundle.read("manifest.json"))
        if (manifest.get("quality") != collector.QUALITY_READY or manifest.get("source") != "BYBIT_V5_PUBLIC"
                or any(manifest.get(k) != v for k, v in collector.MARKET.items())):
            raise ValueError("Archive is not a structurally validated HYPEUSDT capture")
        entries = {item["path"]: item for item in manifest["files"]}
        if set(entries) != paths or len(entries) != len(manifest["files"]):
            raise ValueError("Unexpected manifest file list")
        artifacts = {path: bundle.read(path) for path in paths}
        for path, data in artifacts.items():
            if len(data) != entries[path]["bytes"] or collector.sha256(data) != entries[path]["sha256"]:
                raise ValueError(f"Archive integrity check failed: {path}")

    responses = {
        name: collector.validate_envelope(artifacts[f"raw/{name}.json"])
        for name in raw_names
    }
    result, stamp = responses["time"]
    anchor = collector.server_time(result, stamp, parse_time_ms(manifest["observed_client_time_utc"]))
    if collector.iso(anchor) != manifest["server_time_utc"]:
        raise ValueError("Manifest and raw clock disagree")
    collector.validate_instrument(responses["instruments-info"][0])

    technical = {}
    price_evidence = {}
    expected_urls = {
        "time": collector.BASE + "/v5/market/time",
        "instruments-info": collector.BASE + "/v5/market/instruments-info?" + urlencode(collector.MARKET),
        "ticker": collector.BASE + "/v5/market/tickers?" + urlencode(collector.MARKET),
        **{
            f"kline-{label}": collector.BASE + "/v5/market/kline?" + urlencode({
                **collector.MARKET, "interval": interval, "limit": collector.REQUEST_LIMIT, "end": anchor,
            })
            for label, (interval, _) in intervals.items()
        },
    }
    clock = manifest["datasets"]["time"]
    time_sent = parse_time_ms(clock["request_started_at_utc"])
    time_received = parse_time_ms(clock["received_at_utc"])
    offset = (time_sent + time_received) // 2 - anchor
    uncertainty = max(3000, time_received - time_sent)
    for name in sorted(raw_names):
        _, stamp = responses[name]
        metadata = manifest["datasets"][name]
        sent = parse_time_ms(metadata["request_started_at_utc"])
        received = parse_time_ms(metadata["received_at_utc"])
        elapsed = received - sent
        age_at_capture = received - offset - stamp
        if (stamp != metadata["response_time_ms"] or metadata["http_status"] != 200
                or metadata["url"] != expected_urls[name]
                or not 0 <= elapsed <= collector.MAX_RESPONSE_AGE_MS
                or (name != "time" and not -uncertainty <= age_at_capture <= collector.MAX_RESPONSE_AGE_MS)):
            raise ValueError(f"Raw and manifest provenance disagree: {name}")
        price_evidence[name] = {
            "url": metadata["url"],
            "response_time_utc": collector.iso(stamp),
            "retrieved_at_utc": metadata["received_at_utc"],
        }

    ticker_result, ticker_stamp = responses["ticker"]
    for label, (_, duration) in intervals.items():
        result, stamp = responses[f"kline-{label}"]
        rows, _ = collector.validate_candles(result, duration, anchor, label)
        if any(collector.latest_start(t, duration) != rows[-1][0] for t in (stamp, ticker_stamp)):
            raise ValueError(f"{label}: latest eligible candle changed during capture")
        if collector.csv_bytes(rows, duration) != artifacts[f"candles/{label}.csv"]:
            raise ValueError(f"{label}: CSV differs from raw Bybit candles")
        close = [collector.decimal_value(values[3]) for _, values in rows]
        technical[label] = {
            "closed_count": len(rows), "last_candle_end_utc": collector.iso(rows[-1][0] + duration),
            "last_close": str(close[-1]), "ema50": ema(close, 50), "ema200": ema(close, 200),
        }

    prices, warnings = ticker_values(ticker_result)
    age_ms = analysis_ms - ticker_stamp
    freshness = "WITHIN_CAPTURE_WINDOW"
    if age_ms < 0:
        freshness = "FUTURE_AT_ANALYSIS"
    elif age_ms > collector.MAX_RESPONSE_AGE_MS:
        freshness = "OLDER_THAN_CAPTURE_WINDOW"
    return {
        "symbol": collector.MARKET["symbol"], "market": "BYBIT_LINEAR_USDT_PERPETUAL",
        "server_anchor_utc": collector.iso(anchor), "analysis_utc": collector.iso(analysis_ms),
        "ticker_age_ms": age_ms, "ticker_replay_freshness": freshness,
        "freshness_note": "30-second collector window, not an AD-009 decision threshold",
        "ticker": prices, "missing_or_invalid": warnings,
        "public_data_status": "NEEDS_DATA" if warnings or freshness != "WITHIN_CAPTURE_WINDOW" else "COMPLETE_SNAPSHOT",
        "technical": technical, "sources": price_evidence,
        "candle_finalization_note": collector.FINALIZATION, "readiness": "NO_TRADE_READY",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("--as-of", help="UTC or offset timestamp for historical reproduction")
    args = parser.parse_args()
    try:
        analysis_ms = parse_time_ms(args.as_of) if args.as_of else collector.clock_ms()
        report = analyze(args.archive, analysis_ms)
    except (OSError, ValueError, KeyError, TypeError, zipfile.BadZipFile) as exc:
        parser.exit(2, f"REPLAY_FAILED: {exc}\n")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
