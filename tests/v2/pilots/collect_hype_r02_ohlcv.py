#!/usr/bin/env python3
"""Collect a reproducible public Bybit HYPEUSDT linear perpetual OHLCV bundle.

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
CLOSE_MARGIN_MS = 5_000


def iso(ms):
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def read_public(path, params):
    query = urllib.parse.urlencode(params)
    url = BASE + path + ("?" + query if query else "")
    req = urllib.request.Request(url, headers={"User-Agent": "HYPE-P01-R02-public-OHLCV-collector/1.0",
                                                 "Accept": "application/json"})
    started = datetime.now(timezone.utc).isoformat()
    with urllib.request.urlopen(req, timeout=20) as resp:
        payload = resp.read()
        http_code = resp.status
    received = datetime.now(timezone.utc).isoformat()
    obj = json.loads(payload.decode("utf-8"))
    if http_code != 200 or obj.get("retCode") != 0 or not isinstance(obj.get("result"), dict):
        raise ValueError("Bad Bybit response for " + url + ": " + str(obj.get("retCode")))
    return {"url": url, "body": payload, "parsed": obj,
            "request_started_at_utc": started, "received_at_utc": received,
            "http_status": http_code}


def save_bytes(root, relative, data, files):
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    files.append({"path": relative, "bytes": len(data), "sha256": sha256(data)})


def validate_candles(response, tf_ms, anchor_ms, label):
    data = response["parsed"]["result"]
    if data.get("category") != MARKET["category"] or data.get("symbol") != MARKET["symbol"]:
        raise ValueError(label + ": market identity mismatch")
    rows = data.get("list")
    if not isinstance(rows, list):
        raise ValueError(label + ": missing list")
    found = {}
    for a in rows:
        if not isinstance(a, list) or len(a) < 7:
            raise ValueError(label + ": invalid candle tuple")
        t = int(a[0])
        if t % tf_ms:
            raise ValueError(label + ": misaligned candle start")
        if t + tf_ms > anchor_ms - CLOSE_MARGIN_MS:
            continue  # discard still-open candle (including partial last price)
        if t in found:
            raise ValueError(label + ": duplicate candle")
        o, h, l, c, volume, turnover = map(Decimal, a[1:7])
        if not all(v.is_finite() for v in (o, h, l, c, volume, turnover)):
            raise ValueError(label + ": nonfinite OHLCV")
        if min(o, h, l, c) <= 0 or volume < 0 or turnover < 0 or h < max(o, c) or l > min(o, c):
            raise ValueError(label + ": invalid OHLCV invariant")
        found[t] = (str(o), str(h), str(l), str(c), str(volume), str(turnover))
    selected = sorted(found.items())[-CLOSED_COUNT:]
    if len(selected) < MIN_CLOSED:
        raise ValueError(label + ": " + str(len(selected)) + " verified closed candles; need >= " + str(MIN_CLOSED))
    if any(selected[i][0] - selected[i-1][0] != tf_ms for i in range(1, len(selected))):
        raise ValueError(label + ": noncontinuous timestamp series")
    return selected


def csv_bytes(rows, tf_ms):
    stream = io.StringIO(newline="")
    w = csv.writer(stream, lineterminator="\n")
    w.writerow(["start_ms", "start_utc", "end_utc", "open", "high", "low",
                "close", "volume_base", "turnover_quote"])
    for t, values in rows:
        w.writerow([t, iso(t), iso(t + tf_ms), *values])
    return stream.getvalue().encode("utf-8")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--out", default="HYPE-P01-R02-data", help="New output directory. Existing dir is never overwritten.")
    opts = p.parse_args()
    root = pathlib.Path(opts.out)
    if root.exists():
        raise FileExistsError("Refusing to overwrite evidence folder: " + str(root))
    # In a failed acquisition, keep raw collected responses for diagnosis, but never label bundle verified.
    root.mkdir(parents=True)
    files = []
    try:
        server = read_public("/v5/market/time", {})
        save_bytes(root, "raw/time.json", server["body"], files)
        result = server["parsed"]["result"]
        anchor_ms = int(result.get("timeSecond", "0")) * 1000
        if anchor_ms <= 0:
            anchor_ms = int(server["parsed"].get("time", 0))
        if anchor_ms <= 0:
            raise ValueError("No valid official Bybit server timestamp")

        ins = read_public("/v5/market/instruments-info", MARKET)
        save_bytes(root, "raw/instruments-info.json", ins["body"], files)
        instruments = ins["parsed"]["result"].get("list", [])
        matching = [x for x in instruments if x.get("symbol") == "HYPEUSDT"]
        if len(matching) != 1 or matching[0].get("settleCoin") != "USDT" or \
           matching[0].get("quoteCoin") != "USDT" or \
           matching[0].get("contractType") != "LinearPerpetual":
            raise ValueError("Bybit instrument is not exactly HYPEUSDT Linear USDT Perpetual")

        summaries = {}
        for label, (interval, tf_ms) in INTERVALS.items():
            r = read_public("/v5/market/kline", {**MARKET, "interval": interval,
                                                 "limit": REQUEST_LIMIT, "end": anchor_ms})
            save_bytes(root, "raw/kline-" + label + ".json", r["body"], files)
            selected = validate_candles(r, tf_ms, anchor_ms, label)
            save_bytes(root, "candles/" + label + ".csv", csv_bytes(selected, tf_ms), files)
            summaries[label] = {
                "interval_bybit": interval, "candle_count": len(selected),
                "first_start_utc": iso(selected[0][0]),
                "last_start_utc": iso(selected[-1][0]),
                "last_closed_end_utc": iso(selected[-1][0] + tf_ms),
                "no_gaps": True, "all_closed_at_server_anchor": True,
                "http_url": r["url"], "retrieved_at_utc": r["received_at_utc"]
            }
        manifest = {
            "run": "HYPE-P01-R02", "status": "BYBIT_DATA_COLLECTED_AND_STRUCTURALLY_VALIDATED",
            "note": "Integrity checks are local; independent source provenance still needs separate-session review. Never a trade approval.",
            "source": "BYBIT_V5_PUBLIC", "symbol": "HYPEUSDT", "category": "linear",
            "contractType": matching[0]["contractType"],
            "quoteCoin": matching[0]["quoteCoin"], "settleCoin": matching[0]["settleCoin"],
            "server_time_utc": iso(anchor_ms), "observed_client_time_utc": server["received_at_utc"],
            "instrument_retrieved_at_utc": ins["received_at_utc"],
            "intervals": summaries, "files": files,
            "all_candles_trading_price_not_mark_price": True,
            "credentials_used": False
        }
        manifest_bytes = (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
        (root / "manifest.json").write_bytes(manifest_bytes)
        archive = root.parent / (root.name + ".zip")
        with zipfile.ZipFile(archive, "x", compression=zipfile.ZIP_DEFLATED) as z:
            for file in sorted(root.rglob("*")):
                if file.is_file():
                    z.write(file, file.relative_to(root).as_posix())
        print("COLLECTED_AND_STRUCTURALLY_VALIDATED", archive, "SHA256", sha256(archive.read_bytes()))
        print("Bybit server anchor UTC", iso(anchor_ms))
        for k, v in summaries.items():
            print(k, v["candle_count"], "closed candles", v["first_start_utc"], "to", v["last_closed_end_utc"])
    except Exception as exc:
        (root / "ACQUISITION_FAILED.txt").write_text(
            type(exc).__name__ + ": " + str(exc) + "\nNo verified OHLCV bundle generated.\n",
            encoding="utf-8")
        raise


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ACQUISITION_FAILED:", type(exc).__name__, str(exc), file=sys.stderr)
        sys.exit(2)
