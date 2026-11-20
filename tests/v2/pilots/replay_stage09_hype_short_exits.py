#!/usr/bin/env python3
"""Collect and replay six fixed HYPEUSDT weeks without sending trading signals."""

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from decimal import Decimal as D, InvalidOperation
import hashlib
import json
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen

import replay_stage09_hype_short_sample as sample


DEVELOPMENT = sample.STARTS
HOLDOUT = ("2026-10-12", "2026-10-26", "2026-11-09")
HOUR, QUARTER, WEEK = sample.HOUR, sample.QUARTER, sample.WEEK
HOLD_BARS = 32
NOTIONAL = D("100")
FEE = D("0.00055")
SLIPPAGE = D("0.0002")
STOP = D("0.01")
TAKE = D("0.01")
OFFSET = D("0.0001")
OVERLAP = D("0.005")
MARTINGALE = D("1.01")
FUNDING_SOURCE = "https://api.bybit.com/v5/market/funding/history"


def get(url, params):
    with urlopen(f"{url}?{urlencode(params)}", timeout=25) as response:
        if response.status != 200:
            raise ValueError(f"HTTP {response.status} from {url}")
        return json.load(response)


def market_payload(day, kind):
    if kind in sample.TIMEFRAMES:
        return sample.collect(day, kind)
    start = sample.utc_ms(day)
    end = start + WEEK
    if kind == "tail":
        return get(sample.SOURCE, dict(category="linear", symbol=sample.SYMBOL, interval="15",
                                       start=end + HOUR, end=end + 9 * HOUR - 1, limit=32))
    return get(FUNDING_SOURCE, dict(category="linear", symbol=sample.SYMBOL,
                                   startTime=start - 8 * HOUR, endTime=end + 9 * HOUR, limit=200))


def collect(development=None):
    windows = DEVELOPMENT + HOLDOUT
    captures = {day: dict(development[day]) if development and day in DEVELOPMENT else {} for day in windows}
    tasks = [(day, kind) for day in windows for kind in (*sample.TIMEFRAMES, "tail", "funding")
             if kind not in captures[day]]
    with ThreadPoolExecutor(max_workers=4) as pool:
        for (day, kind), payload in zip(tasks, pool.map(lambda task: market_payload(*task), tasks)):
            captures[day][kind] = payload
    return captures


def load_tail(payload, day):
    start = sample.utc_ms(day) + WEEK + HOUR
    end = start + 8 * HOUR
    result = payload["result"]
    rows = sorted(result["list"], key=lambda row: int(row[0]))
    if (payload["retCode"] != 0 or int(payload["time"]) < end
            or (result["symbol"], result["category"]) != (sample.SYMBOL, "linear")
            or [int(row[0]) for row in rows] != list(range(start, end, QUARTER))):
        raise ValueError(f"{day}: invalid 15m exit tail")
    candles = {}
    for row in rows:
        opened, high, low, close, volume, turnover = map(D, row[1:])
        if not all(v.is_finite() for v in (opened, high, low, close, volume, turnover)):
            raise ValueError(f"{day}: non-finite tail candle")
        if not (0 < low <= min(opened, close) <= max(opened, close) <= high and min(volume, turnover) >= 0):
            raise ValueError(f"{day}: invalid tail candle")
        close_time = int(row[0]) + QUARTER
        candles[close_time] = sample.Candle(close_time, opened, high, low, close)
    digest = hashlib.sha256(json.dumps(rows, separators=(",", ":")).encode()).hexdigest()
    return candles, digest


def load_funding(payload, day):
    if payload["retCode"] != 0:
        raise ValueError(f"{day}: funding API failure")
    rows = sorted(payload["result"]["list"], key=lambda row: int(row["fundingRateTimestamp"]))
    rates = {int(row["fundingRateTimestamp"]): D(row["fundingRate"]) for row in rows}
    start = sample.utc_ms(day)
    times = list(rates)
    if (not times or payload["result"]["category"] != "linear" or len(times) != len(rows)
            or any(row["symbol"] != sample.SYMBOL for row in rows)
            or any(not rate.is_finite() for rate in rates.values())
            or any(t % QUARTER for t in times)
            or times[0] > start or times[-1] < start + WEEK + HOUR
            or any(not 0 < b - a <= 8 * HOUR for a, b in zip(times, times[1:]))):
        raise ValueError(f"{day}: funding coverage or identity failed")
    return rates, hashlib.sha256(json.dumps(rows, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def proxy_counts(day, m15, hourly, h4, reference):
    """Compare parallel conditions with exact outcomes using equal input context."""
    start = sample.utc_ms(day)
    reference_times = {item["retest_end_ms"] for item in reference["signals"]}
    proxy_times = set()
    for cutoff in range(start + HOUR, start + WEEK + 1, HOUR):
        support = min(m15[t].low for t in range(cutoff - HOUR - 5 * QUARTER, cutoff - HOUR + 1, QUARTER))
        if hourly[cutoff].close >= support or not all(
            sample.trend_bearish(bars.values(), cutoff) for bars in (hourly, h4)
        ):
            continue
        for t in range(cutoff + QUARTER, cutoff + HOUR + 1, QUARTER):
            bar = m15[t]
            if bar.high >= support and bar.close < min(support, bar.opening):
                proxy_times.add(t)
                break
    return {"match": len(reference_times & proxy_times),
            "missed": len(reference_times - proxy_times),
            "extra": len(proxy_times - reference_times)}


def simulate(signal_end, bars, funding, grid):
    first_bar = bars[signal_end + QUARTER]
    baseline = first_bar.opening
    first_limit = baseline * (1 + OFFSET)
    second_limit = first_limit * (1 + OVERLAP)
    stop = baseline * (1 + STOP)
    if grid and not first_limit < second_limit < stop:
        raise ValueError("Grid limits must be below the stop")
    if first_bar.high < first_limit:
        return None
    quantity = D(0)
    entry_value = D(0)
    cash_funding = D(0)
    first_size = NOTIONAL / (1 + MARTINGALE) if grid else NOTIONAL
    pending = [(first_limit, first_size)]
    if grid:
        pending.append((second_limit, NOTIONAL - first_size))

    for i in range(1, HOLD_BARS + 1):
        bar = bars[signal_end + i * QUARTER]
        # A settlement at a new bar's opening applies before new intrabar fills.
        rate = funding.get(bar.end - QUARTER, D(0))
        cash_funding += quantity * bar.opening * rate
        if quantity and bar.opening >= stop:
            exit_price, reason = bar.opening * (1 + SLIPPAGE), "STOP"
            break
        added = False
        while pending and bar.high >= pending[0][0]:
            price, size = pending.pop(0)
            quantity += size / price
            entry_value += size
            added = True
        if bar.high >= stop:
            exit_price, reason = stop * (1 + SLIPPAGE), "STOP"
            break
        target = entry_value / quantity * (1 - TAKE)
        if not added and bar.low <= target:
            exit_price, reason = target, "TAKE"
            break
        if i == HOLD_BARS:
            exit_price, reason = bar.close * (1 + SLIPPAGE), "TIME"
            break

    exit_value = quantity * exit_price
    fees = (entry_value + exit_value) * FEE
    return dict(end=bar.end, reason=reason, filled=entry_value, fees=fees, funding=cash_funding,
                net=entry_value - exit_value - fees + cash_funding)


def simulate_window(signals, bars, funding, grid):
    trades = []
    counts = Counter()
    busy_until = 0
    for signal in signals:
        t = signal["retest_end_ms"]
        if t < busy_until:
            counts["overlap"] += 1
            continue
        trade = simulate(t, bars, funding, grid)
        if trade is None:
            counts["unfilled"] += 1
            continue
        busy_until = trade["end"]
        trades.append(trade)
    return trades, counts


def summarize(trades, counts):
    reasons = Counter(trade["reason"] for trade in trades)
    balance = peak = drawdown = D(0)
    for trade in trades:
        balance += trade["net"]
        peak = max(balance, peak)
        drawdown = max(drawdown, peak - balance)
    totals = {name: str(sum((t[name] for t in trades), D(0)).quantize(D("0.0001")))
              for name in ("fees", "funding", "net")}
    return {"trades": len(trades), "wins": sum(t["net"] > 0 for t in trades),
            "fully_allocated": sum(t["filled"] == NOTIONAL for t in trades),
            "stop": reasons["STOP"], "take": reasons["TAKE"], "time": reasons["TIME"],
            "unfilled": counts["unfilled"], "overlap": counts["overlap"], **totals,
            "closed_drawdown": str(drawdown.quantize(D("0.0001")))}


def run(captures):
    output = {}
    for label, days in (("development", DEVELOPMENT), ("holdout", HOLDOUT)):
        models = {"one": ([], Counter()), "two": ([], Counter())}
        checks = Counter()
        window_reports = []
        for day in days:
            payloads = captures[day]
            reference = sample.replay_window(day, payloads)
            m15, h1, h4 = [sample.read_bars(payloads[key], day, key)[0] for key in sample.TIMEFRAMES]
            tail, tail_hash = load_tail(payloads["tail"], day)
            rates, funding_hash = load_funding(payloads["funding"], day)
            checks.update(proxy_counts(day, m15, h1, h4, reference))
            for name, (trades, counts) in models.items():
                results, counters = simulate_window(reference["signals"], m15 | tail, rates, name == "two")
                trades.extend(results)
                counts.update(counters)
            window_reports.append({"date": day, "signals": reference["confirmed"],
                                   "sha256": {**reference["rows_sha256"], "tail": tail_hash,
                                              "funding": funding_hash}})
        summaries = {name: summarize(*parts) for name, parts in models.items()}
        output[label] = {"windows": window_reports, "proxy": dict(checks), **summaries}
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("capture", type=Path)
    parser.add_argument("--collect", action="store_true")
    parser.add_argument("--development", type=Path, help="Optional previously collected Stage 09 sample")
    args = parser.parse_args()
    try:
        if args.collect:
            existing = json.loads(args.development.read_text(encoding="utf-8")) if args.development else None
            payloads = collect(existing)
            with args.capture.open("x", encoding="utf-8") as f:
                json.dump(payloads, f, separators=(",", ":"))
        else:
            payloads = json.loads(args.capture.read_text(encoding="utf-8"))
        print(json.dumps(run(payloads), indent=2))
    except (OSError, ValueError, InvalidOperation, KeyError) as error:
        parser.exit(2, f"{error}\n")


if __name__ == "__main__":
    main()
