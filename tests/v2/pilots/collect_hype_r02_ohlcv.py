#!/usr/bin/env python3
"""Collect a public Bybit HYPEUSDT linear perpetual market snapshot.

No API keys, trading endpoints, private accounts or external dependencies.
Run on a device with public HTTPS access to api.bybit.com. Fails closed on
missing candles, wrong instrument, gaps or malformed responses.
"""
import argparse
import csv
import hashlib
import io
import json
import pathlib
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from datetime import datetime, timezone
from decimal import Decimal

BASE = "https://api.bybit.com"
MARKET = {"category": "linear", "symbol": "HYPEUSDT"}
INTERVALS = {"15m": ("15", 15 * 60_000), "1h": ("60", 60 * 60_000),
             "4h": ("240", 240 * 60_000), "1d": ("D", 24 * 60 * 60_000)}
REQUEST_LIMIT = 350
CLOSED_COUNT = 300
MIN_CLOSED = 250
CLOSE_MARGIN_MS = 10_000
MAX_CLOCK_SKEW_MS = 30_000
MAX_RESPONSE_AGE_MS = 30_000
MAX_BODY_BYTES = 3_000_000
PUBLIC_PATHS = frozenset({
    "/v5/market/time", "/v5/market/instruments-info",
    "/v5/market/tickers", "/v5/market/kline",
})
DECIMAL_TEXT = re.compile(r"(?:0|[1-9][0-9]*)(?:\.[0-9]+)?")
QUALITY_READY = "PUBLIC_DATA_READY_FOR_TECHNICAL_REVIEW_WITH_FINALIZATION_CAVEAT"
FINALIZATION = "Elapsed candle time does not independently prove exchange finalization."


def iso(ms):
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def sha256(data):
    return hashlib.sha256(data).hexdigest()


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def clock_ms():
    return time.time_ns() // 1_000_000


def fetch(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": "HYPE-V01-AN02-public-market-collector/2.0",
        "Accept": "application/json",
        "Cache-Control": "no-cache",
    })
    opener = urllib.request.build_opener(NoRedirect())
    try:
        response = opener.open(req, timeout=16)
    except urllib.error.HTTPError as exc:
        response = exc
    with response:
        return response.status, response.read(MAX_BODY_BYTES + 1)


def epoch_ms(value):
    if type(value) is not int or not 1_500_000_000_000 <= value < 9_000_000_000_000:
        raise ValueError("Invalid Bybit response timestamp")
    return value


def validate_envelope(payload):
    obj = json.loads(payload.decode("utf-8"))
    if not isinstance(obj, dict) or type(obj.get("retCode")) is not int or obj["retCode"] != 0:
        code = obj.get("retCode") if isinstance(obj, dict) else None
        raise ValueError(f"Invalid Bybit envelope or retCode: {code}")
    if not isinstance(obj.get("result"), dict):
        raise ValueError("Missing Bybit result")
    return obj["result"], epoch_ms(obj.get("time"))


def server_time(result, stamp, received):
    seconds = result.get("timeSecond")
    if not isinstance(seconds, str) or not seconds.isascii() or not seconds.isdecimal():
        raise ValueError("Invalid Bybit timeSecond")
    if abs(int(seconds) * 1000 - stamp) >= 3000:
        raise ValueError("Conflicting Bybit server timestamps")
    if abs(received - stamp) > MAX_CLOCK_SKEW_MS:
        raise ValueError("Local clock and Bybit server differ by more than 30 seconds")
    return stamp


def market_item(result):
    rows = result.get("list")
    if (result.get("category") != MARKET["category"] or not isinstance(rows, list)
            or len(rows) != 1 or not isinstance(rows[0], dict)
            or rows[0].get("symbol") != MARKET["symbol"]):
        raise ValueError("Expected one matching Bybit linear HYPEUSDT instrument")
    return rows[0]


def validate_instrument(result):
    item = market_item(result)
    expected = {"quoteCoin": "USDT", "settleCoin": "USDT",
                "contractType": "LinearPerpetual", "status": "Trading"}
    for field, value in expected.items():
        if item.get(field) != value:
            raise ValueError(f"Unexpected instrument {field}")
    for group, field in (("priceFilter", "tickSize"), ("lotSizeFilter", "qtyStep")):
        fields = item.get(group)
        if not isinstance(fields, dict):
            raise ValueError(f"Missing instrument {group}")
        if decimal_value(fields.get(field)) <= 0:
            raise ValueError(f"Invalid instrument {field}")
    return item


def decimal_value(value):
    if not isinstance(value, str) or DECIMAL_TEXT.fullmatch(value) is None:
        raise ValueError("Expected a nonnegative decimal string")
    return Decimal(value)


def validate_ticker(result):
    item = market_item(result)
    prices = {field: item.get(field) for field in ("markPrice", "lastPrice", "indexPrice")}
    for field, value in prices.items():
        if decimal_value(value) <= 0:
            raise ValueError(f"Invalid ticker {field}")
    for field in ("fundingRate", "openInterest"):
        value = item.get(field)
        prices[field] = value if isinstance(value, str) else None
    return {**prices, "time_semantics": "BYBIT_RESPONSE_TIME_PROXY_NOT_FIELD_TIME"}


def latest_start(stamp, interval):
    return (stamp - CLOSE_MARGIN_MS) // interval * interval - interval


def validate_candles(result, tf_ms, anchor_ms, label):
    if result.get("category") != MARKET["category"] or result.get("symbol") != MARKET["symbol"]:
        raise ValueError(f"{label}: market identity mismatch")
    rows = result.get("list")
    if not isinstance(rows, list) or not 0 < len(rows) <= REQUEST_LIMIT:
        raise ValueError(f"{label}: invalid candle count")

    eligible = []
    previous = None
    for row in rows:
        if not isinstance(row, list) or len(row) != 7 or not isinstance(row[0], str):
            raise ValueError(f"{label}: invalid candle tuple")
        if not re.fullmatch(r"[0-9]{13}", row[0]):
            raise ValueError(f"{label}: invalid candle start")
        start = epoch_ms(int(row[0]))
        if start % tf_ms or start > anchor_ms:
            raise ValueError(f"{label}: misaligned or future candle")
        if previous is not None and start >= previous:
            raise ValueError(f"{label}: candle order or duplicate")
        previous = start
        o, h, l, c, _, _ = map(decimal_value, row[1:])
        if min(o, h, l, c) <= 0 or h < max(o, c) or l > min(o, c):
            raise ValueError(f"{label}: invalid OHLC bounds")
        if start <= latest_start(anchor_ms, tf_ms):
            eligible.append((start, tuple(row[1:])))

    if len(eligible) < MIN_CLOSED:
        raise ValueError(f"{label}: only {len(eligible)} eligible candles, need {MIN_CLOSED}")
    if eligible[0][0] != latest_start(anchor_ms, tf_ms):
        raise ValueError(f"{label}: latest eligible candle is missing")
    if any(a[0] - b[0] != tf_ms for a, b in zip(eligible, eligible[1:])):
        raise ValueError(f"{label}: gap in eligible candles")
    return list(reversed(eligible[:CLOSED_COUNT])), len(rows) - len(eligible)


def save_bytes(root, relative, data, files):
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    files.append({"path": relative, "bytes": len(data), "sha256": sha256(data)})


def csv_bytes(rows, tf_ms):
    stream = io.StringIO(newline="")
    w = csv.writer(stream, lineterminator="\n")
    w.writerow(["start_ms", "start_utc", "end_utc", "open", "high", "low",
                "close", "volume_base", "turnover_quote"])
    for t, values in rows:
        w.writerow([t, iso(t), iso(t + tf_ms), *values])
    return stream.getvalue().encode("utf-8")


def collect(root, transport=fetch, now=clock_ms):
    archive = root.with_suffix(root.suffix + ".zip")
    if archive.exists():
        raise FileExistsError(f"Refusing to overwrite evidence archive: {archive}")
    root.mkdir(parents=True, exist_ok=False)
    files = []
    datasets = {}
    manifest = {
        "run": "HYPE-P01-R02",
        "purpose": "HYPE-V01-AN02",
        "status": "ACCESS_UNAVAILABLE_OR_INVALID",
        "quality": "NEEDS_DATA",
        "readiness": "NO_TRADE_READY",
        "source": "BYBIT_V5_PUBLIC",
        **MARKET,
        "all_candles_trading_price_not_mark_price": True,
        "credentials_used": False,
        "note": FINALIZATION,
        "datasets": datasets,
        "intervals": {},
        "files": files,
    }
    dataset = "time"

    def read(name, path, params):
        nonlocal dataset
        dataset = name
        if path not in PUBLIC_PATHS:
            raise ValueError("Endpoint is outside the Bybit public market allowlist")
        url = BASE + path
        if params:
            url += "?" + urllib.parse.urlencode(params)
        started = now()
        meta = {"url": url, "request_started_at_utc": iso(started)}
        datasets[name] = meta
        try:
            http_code, payload = transport(url)
        finally:
            received = now()
            meta["received_at_utc"] = iso(received)
        meta["http_status"] = http_code
        if not 0 < len(payload) <= MAX_BODY_BYTES:
            raise ValueError("Empty or oversized HTTP response")
        relative = f"raw/{name}.json"
        save_bytes(root, relative, payload, files)
        meta["file"] = relative
        if http_code != 200:
            raise ValueError(f"Unexpected HTTP status: {http_code}")
        result, stamp = validate_envelope(payload)
        meta["response_time_ms"] = stamp
        if not 0 <= received - started <= MAX_RESPONSE_AGE_MS:
            raise ValueError("Request duration or local clock is inconsistent")
        return result, stamp, received, started

    def check_fresh(stamp, received, offset, uncertainty):
        age = received - offset - stamp
        if not -uncertainty <= age <= MAX_RESPONSE_AGE_MS:
            raise ValueError("Stale or future Bybit response timestamp")

    try:
        result, stamp, received, started = read("time", "/v5/market/time", {})
        anchor = server_time(result, stamp, received)
        offset = (started + received) // 2 - anchor
        uncertainty = max(3000, received - started)
        manifest["server_time_utc"] = iso(anchor)
        manifest["observed_client_time_utc"] = iso(received)
        manifest["estimated_client_clock_offset_ms"] = offset

        result, stamp, received, _ = read("instruments-info", "/v5/market/instruments-info", MARKET)
        check_fresh(stamp, received, offset, uncertainty)
        instrument = validate_instrument(result)
        for field in ("contractType", "quoteCoin", "settleCoin"):
            manifest[field] = instrument[field]
        manifest["instrument_retrieved_at_utc"] = iso(received)

        for label, (interval, tf_ms) in INTERVALS.items():
            result, stamp, received, _ = read(
                f"kline-{label}", "/v5/market/kline",
                {**MARKET, "interval": interval, "limit": REQUEST_LIMIT, "end": anchor},
            )
            check_fresh(stamp, received, offset, uncertainty)
            selected, excluded = validate_candles(result, tf_ms, anchor, label)
            if latest_start(stamp, tf_ms) != selected[-1][0]:
                raise ValueError(f"{label}: a new candle became eligible during capture")
            save_bytes(root, f"candles/{label}.csv", csv_bytes(selected, tf_ms), files)
            manifest["intervals"][label] = {
                "interval_bybit": interval, "candle_count": len(selected),
                "first_start_utc": iso(selected[0][0]), "last_start_utc": iso(selected[-1][0]),
                "last_closed_end_utc": iso(selected[-1][0] + tf_ms),
                "no_gaps": True, "all_closed_at_server_anchor": True,
                "excluded_recent_or_open": excluded,
                "http_url": datasets[dataset]["url"], "retrieved_at_utc": iso(received),
            }

        result, stamp, received, _ = read("ticker", "/v5/market/tickers", MARKET)
        check_fresh(stamp, received, offset, uncertainty)
        ticker = validate_ticker(result)
        for label, (_, tf_ms) in INTERVALS.items():
            if latest_start(stamp, tf_ms) != latest_start(anchor, tf_ms):
                raise ValueError(f"{label}: a new candle became eligible before ticker capture")
        manifest["ticker"] = {**ticker, "response_time_ms": stamp, "retrieved_at_utc": iso(received)}
        manifest["status"] = "BYBIT_DATA_COLLECTED_AND_STRUCTURALLY_VALIDATED"
        manifest["quality"] = QUALITY_READY
    except (OSError, ValueError) as exc:
        error = {"dataset": dataset, "type": type(exc).__name__, "message": str(exc)}
        manifest["error"] = error
        (root / "ACQUISITION_FAILED.txt").write_text(
            f"{dataset}: {type(exc).__name__}: {exc}\nNo verified market snapshot generated.\n",
            encoding="utf-8",
        )

    (root / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8",
    )
    if manifest["quality"] != QUALITY_READY:
        return manifest, None
    with zipfile.ZipFile(archive, "x", compression=zipfile.ZIP_DEFLATED) as bundle:
        bundle.write(root / "manifest.json", "manifest.json")
        for item in files:
            bundle.write(root / item["path"], item["path"])
    return manifest, archive


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", default="HYPE-P01-R02-data",
                        help="New output directory. Existing evidence is never overwritten.")
    opts = parser.parse_args()
    manifest, archive = collect(pathlib.Path(opts.out))
    if archive is None:
        error = manifest["error"]
        print(f'ACQUISITION_FAILED: {error["dataset"]}: {error["message"]}', file=sys.stderr)
        return 2
    print("COLLECTED_AND_STRUCTURALLY_VALIDATED", archive, "SHA256", sha256(archive.read_bytes()))
    print("Bybit server anchor UTC", manifest["server_time_utc"])
    for label, summary in manifest["intervals"].items():
        print(label, summary["candle_count"], "closed candles",
              summary["first_start_utc"], "to", summary["last_closed_end_utc"])
    print("QUALITY=" + manifest["quality"], manifest["readiness"])
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except OSError as exc:
        print("ACQUISITION_FAILED:", type(exc).__name__, str(exc), file=sys.stderr)
        sys.exit(2)
