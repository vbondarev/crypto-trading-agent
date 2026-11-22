"""Replay two preregistered historical TREEUSDT scenarios. No trading requests."""

import argparse
import hashlib
import json
from datetime import datetime, timedelta
from decimal import Decimal
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen


HOURS = 72
D = Decimal
CASES = (
    ("TREE-R1", "2026-03-02T00:00:00Z", -1, D("0.06766")),
    ("TREE-R2", "2026-09-07T00:00:00Z", 1, D("0.04400")),
)


def fetch(cutoff, interval):
    start = int(cutoff.timestamp() * 1000)
    query = urlencode({
        "category": "linear", "symbol": "TREEUSDT", "interval": interval,
        "start": start, "end": start + HOURS * 3_600_000 - 1, "limit": HOURS,
    })
    with urlopen("https://api.bybit.com/v5/market/kline?" + query, timeout=15) as response:
        return json.load(response)


def checked_bars(response, cutoff, interval):
    result = response["result"]
    if response["retCode"] != 0 or result["symbol"] != "TREEUSDT" or result["category"] != "linear":
        raise ValueError("Bybit response does not match the requested market")
    start = int(cutoff.timestamp() * 1000)
    interval_ms = interval * 60_000
    rows = sorted(result["list"], key=lambda row: int(row[0]))
    if [int(row[0]) for row in rows] != list(range(start, start + HOURS * 3_600_000, interval_ms)):
        raise ValueError("Missing, duplicate or out-of-window candles")
    bars = [tuple(D(value) for value in row[1:5]) for row in rows]
    if any(not 0 < low <= min(op, close) <= max(op, close) <= high for op, high, low, close in bars):
        raise ValueError("Invalid OHLC bounds")
    return bars


def digest(bars, cutoff, minutes):
    start = int(cutoff.timestamp() * 1000)
    rows = [[start + i * minutes * 60_000, *(format(price, ".5f") for price in bar)]
            for i, bar in enumerate(bars)]
    return hashlib.sha256(json.dumps(rows, separators=(",", ":")).encode()).hexdigest()


def replay(bars, side, level):
    four_hour_closes = range(4, HOURS + 1, 4)
    breakout = next((i for i in four_hour_closes if side * (bars[i-1][3] - level) > 0), None)
    if breakout is None:
        return {"decision": "WAIT", "reason": "NO_BREAKOUT"}
    cancellation = next((i for i in four_hour_closes
                         if i > breakout and side * (bars[i-1][3] - level) < 0), None)
    deadline = cancellation if cancellation is not None else HOURS
    retest = next((i for i in range(breakout + 1, deadline)
                   if bars[i-1][2] <= level <= bars[i-1][1] and side * (bars[i-1][3] - level) > 0), None)
    events = {"breakout_hour": breakout, "retest_hour": retest, "cancellation_hour": cancellation}
    if retest is None or side * (bars[retest][0] - level) <= 0:
        return {"decision": "WAIT", "reason": "NO_CONFIRMED_FILL", **events}

    entry = bars[retest][0]
    exit_price = bars[deadline][0] if deadline < HOURS else bars[-1][3]
    fee = D("0.00055")
    results = []
    for slip in (D("0.0005"), D("0.0015")):
        adjusted_entry = entry * (1 + side * slip)
        adjusted_exit = exit_price * (1 - side * slip)
        net = (side * (adjusted_exit - adjusted_entry) - fee * (adjusted_entry + adjusted_exit)) / adjusted_entry
        results.append({
            "slippage_bp_each_side": str(slip * 10_000),
            "net_pct_of_filled_notional": str(100 * net),
            "net_per_100_planned_at_100pct": str(100 * net),
            "net_per_100_planned_at_50pct": str(50 * net),
        })
    return {"decision": "LONG" if side == 1 else "SHORT", **events,
            "entry": str(entry), "exit": str(exit_price), "exit_hour": deadline, "costs": results}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--capture", type=Path, help="JSON with raw Bybit responses keyed by case then interval")
    args = parser.parse_args()
    captured = json.loads(args.capture.read_text(encoding="utf-8-sig")) if args.capture else None
    for case, asof, side, level in CASES:
        cutoff = datetime.fromisoformat(asof)
        responses = captured[case] if captured is not None else {str(n): fetch(cutoff, n) for n in (60, 240)}
        hourly = checked_bars(responses["60"], cutoff, 60)
        published = checked_bars(responses["240"], cutoff, 240)
        aggregated = [(block[0][0], max(x[1] for x in block), min(x[2] for x in block), block[-1][3])
                      for block in (hourly[i:i+4] for i in range(0, HOURS, 4))]
        if aggregated != published:
            raise ValueError(f"{case}: four-hour OHLC mismatch")
        result = replay(hourly, side, level)
        event_times = {key.replace("_hour", "_utc"): (cutoff + timedelta(hours=value)).isoformat()
                       for key, value in result.items() if key.endswith("_hour") and value is not None}
        print(json.dumps({"case": case, "status": "NO_TRADE_READY",
                          "ohlc_sha256": {"60": digest(hourly, cutoff, 60), "240": digest(published, cutoff, 240)},
                          **result, **event_times}, sort_keys=True))


if __name__ == "__main__":
    main()
