#!/usr/bin/env python3
"""Check HYPEUSDT single-entry signals and model exits on fixed historical weeks."""

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from decimal import InvalidOperation
import hashlib
import json
from pathlib import Path
import sqlite3

import replay_stage09_hype_short_exits as exits
import replay_stage09_hype_short_sample as sample


HOUR, QUARTER, WEEK = sample.HOUR, sample.QUARTER, sample.WEEK
WINDOWS = {"2026-09-21": WEEK, "2026-09-28": WEEK, "2026-11-16": 72 * HOUR}
RULE = "HYPE_SHORT_RETEST_V1"
# The positive Stage 09 control is already known and is excluded from the backtest.
KNOWN_BREAKDOWNS = {sample.utc_ms("2026-11-18") + 21 * HOUR}


def collect():
    captures = {day: {} for day in WINDOWS}
    tasks = [(day, kind) for day in WINDOWS for kind in (*sample.TIMEFRAMES, "tail", "funding")]
    with ThreadPoolExecutor(max_workers=4) as pool:
        for (day, kind), payload in zip(tasks, pool.map(lambda task: exits.market_payload(*task, window=WINDOWS[task[0]]), tasks)):
            captures[day][kind] = payload
    return captures


def init_journal(db):
    db.execute(
        """CREATE TABLE IF NOT EXISTS signal (
            symbol TEXT NOT NULL, rule TEXT NOT NULL, breakdown_ms INTEGER NOT NULL,
            observed_ms INTEGER NOT NULL, status TEXT NOT NULL, reason TEXT NOT NULL,
            PRIMARY KEY (symbol, rule, breakdown_ms, observed_ms, status, reason)
        )"""
    )


def record(db, breakdown, observed, outcome):
    status, reason, _ = outcome
    db.execute("INSERT OR IGNORE INTO signal VALUES (?, ?, ?, ?, ?, ?)",
               (sample.SYMBOL, RULE, breakdown, observed, status, reason))


def signal_events(day, m15, h1, h4, window):
    start = sample.utc_ms(day)
    for cutoff in range(start + HOUR, start + window + 1, HOUR):
        level = min(m15[t].low for t in range(cutoff - HOUR - 5 * QUARTER, cutoff - HOUR + 1, QUARTER))
        hour = h1[cutoff]
        if hour.close >= level or not all(sample.trend_bearish(series.values(), cutoff) for series in (h1, h4)):
            continue
        retests = [m15[t] for t in range(cutoff + QUARTER, cutoff + HOUR + 1, QUARTER)]
        for observed in range(cutoff, cutoff + HOUR + 1, QUARTER):
            outcome = sample.evaluate(level, hour, True, retests, observed)
            if outcome[1] == "RETEST_PENDING":
                if observed == cutoff:
                    yield cutoff, observed, outcome
                continue
            yield cutoff, observed, outcome
            break


def validate_controls(db):
    d = exits.D
    candle = sample.Candle
    hour = candle(0, d("66.88"), d("67.092"), d("66.428"), d("66.777"))
    bars = [
        candle(QUARTER, d("66.777"), d("66.857"), d("66.67"), d("66.789")),
        candle(2 * QUARTER, d("66.789"), d("66.889"), d("66.54"), d("66.64")),
    ]
    level = d("66.825")
    cases = [
        (2 * QUARTER - 1, bars, "WAIT"),
        (2 * QUARTER, bars, "SHORT_CONFIRMED"),
        (2 * QUARTER, bars[1:], "NEEDS_DATA"),
    ]
    for observed, rows, expected in cases:
        outcome = sample.evaluate(level, hour, True, rows, observed)
        if outcome[0] != expected:
            raise ValueError(f"Expected {expected}, got {outcome}")
        record(db, 0, observed, outcome)
        record(db, 0, observed, outcome)
    count = db.execute("SELECT count(*) FROM signal WHERE breakdown_ms = 0").fetchone()[0]
    if count != len(cases):
        raise ValueError("Duplicate control events recorded")
    return len(cases)


def run(captures, journal):
    trades = []
    counts = Counter()
    windows = []
    events = []
    for day in WINDOWS:
        data = captures[day]
        window = WINDOWS[day]
        reference = sample.replay_window(day, data, window=window)
        m15, h1, h4 = [sample.read_bars(data[tf], day, tf, window=window)[0] for tf in sample.TIMEFRAMES]
        found = list(signal_events(day, m15, h1, h4, window))
        exact = [(start, observed) for start, observed, outcome in found if outcome[0] == "SHORT_CONFIRMED"]
        expected = [(row["breakdown_end_ms"], row["retest_end_ms"]) for row in reference["signals"]]
        if exact != expected:
            raise ValueError(f"{day}: candle-by-candle journal diverges from the exact replay")
        events.extend(found)
        tail, tail_hash = exits.load_tail(data["tail"], day, window=window)
        rates, funding_hash = exits.load_funding(data["funding"], day, window=window)
        unseen = [signal for signal in reference["signals"]
                  if signal["breakdown_end_ms"] not in KNOWN_BREAKDOWNS]
        fills, skipped = exits.simulate_window(unseen, m15 | tail, rates, False,
                                               stop_from_first_limit=True)
        trades.extend(fills)
        counts.update(skipped)
        windows.append({
            "start_utc": day, "hours": reference["hours"],
            "raw_breakdowns": reference["raw_breakdowns"],
            "qualified_breakdowns": reference["qualified_breakdowns"],
            "signals": len(exact), "already_known_signals": len(exact) - len(unseen),
            "backtest": exits.summarize(fills, skipped),
            "rows_sha256": {**reference["rows_sha256"], "tail": tail_hash, "funding": funding_hash},
        })

    with sqlite3.connect(":memory:") as control_db:
        init_journal(control_db)
        controls = validate_controls(control_db)

    with sqlite3.connect(journal) as db:
        init_journal(db)
        before = db.total_changes
        for start, observed, outcome in events:
            record(db, start, observed, outcome)
        inserted = db.total_changes - before
        before_repeat = db.total_changes
        for start, observed, outcome in events:
            record(db, start, observed, outcome)
        if db.total_changes != before_repeat:
            raise ValueError("Reprocessing inserted duplicate events")
    return {"scope": "OFFLINE_SINGLE_ENTRY_CHECK", "readiness": "NO_TRADE_READY",
            "windows": windows, "totals": exits.summarize(trades, counts),
            "history_status_counts": dict(Counter(event[2][0] for event in events)),
            "journal_inserted": inserted, "journal_reprocess_inserted": 0, "controls_passed": controls}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("capture", type=Path)
    parser.add_argument("journal", type=Path)
    parser.add_argument("--collect", action="store_true")
    args = parser.parse_args()
    try:
        if args.collect:
            captures = collect()
            with args.capture.open("x", encoding="utf-8") as f:
                json.dump(captures, f, separators=(",", ":"))
        else:
            captures = json.loads(args.capture.read_text(encoding="utf-8"))
        result = run(captures, args.journal)
        result["capture_sha256"] = hashlib.sha256(args.capture.read_bytes()).hexdigest()
        print(json.dumps(result, indent=2))
    except (OSError, ValueError, InvalidOperation, KeyError, sqlite3.Error) as error:
        parser.exit(2, f"{error}\n")


if __name__ == "__main__":
    main()
