#!/usr/bin/env python3
"""Evaluate single-order HYPEUSDT execution assumptions on saved historical windows."""

import argparse
from collections import Counter
from decimal import InvalidOperation
import hashlib
import json
from pathlib import Path

import replay_stage09_hype_short_exits as exits
import replay_stage09_hype_short_sample as sample


PLANNED_STARTS = (
    "2026-07-27", "2026-08-03", "2026-08-10", "2026-08-17",
    "2026-08-24", "2026-08-31", "2026-09-07", "2026-09-14",
)
ARCHIVED_STARTS = tuple(sorted(exits.DEVELOPMENT + exits.HOLDOUT))
D = exits.D
SCENARIOS = {
    "baseline": {},
    "higher_fee": {"fee": D("0.001")},
    "higher_slippage": {"slippage": D("0.001")},
    "strict_limits": {"limit_through": D("0.0005")},
    "combined": {"fee": D("0.001"), "slippage": D("0.001"), "limit_through": D("0.0005")},
}


def replay(captures, starts):
    trades = {name: [] for name in SCENARIOS}
    skips = {name: Counter() for name in SCENARIOS}
    windows = []
    busy_until = dict.fromkeys(SCENARIOS, 0)
    for day in starts:
        payloads = captures[day]
        reference = sample.replay_window(day, payloads)
        m15, _ = sample.read_bars(payloads["15"], day, "15")
        tail, tail_hash = exits.load_tail(payloads["tail"], day)
        funding, funding_hash = exits.load_funding(payloads["funding"], day)
        candles = m15 | tail
        week = {}
        for name, params in SCENARIOS.items():
            completed, skipped = exits.simulate_window(
                reference["signals"], candles, funding, False,
                stop_from_first_limit=True, busy_until=busy_until[name], **params,
            )
            if len(completed) + skipped["unfilled"] + skipped["overlap"] != reference["confirmed"]:
                raise ValueError(f"{day} {name}: one or more signals not accounted for")
            if completed:
                busy_until[name] = completed[-1]['end']
            trades[name].extend(completed)
            skips[name].update(skipped)
            week[name] = exits.summarize(completed, skipped)
        windows.append({
            "start_utc": day, "hours": reference["hours"], "raw_breakdowns": reference["raw_breakdowns"],
            "qualified": reference["qualified_breakdowns"], "signals": reference["confirmed"],
            "reset": reference["reset"], "expired": reference["expired"],
            "scenarios": week,
            "rows_sha256": {**reference["rows_sha256"], "tail": tail_hash, "funding": funding_hash},
        })
    return {
        "scope": "OFFLINE_SINGLE_ENTRY_SENSITIVITY",
        "readiness": "NO_TRADE_READY",
        "windows": windows,
        "totals": {name: exits.summarize(trades[name], skips[name]) for name in SCENARIOS},
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("capture", type=Path)
    parser.add_argument("--archived-six", action="store_true", help="Replay the previous six-week capture")
    args = parser.parse_args()
    try:
        captures = json.loads(args.capture.read_text(encoding="utf-8"))
        starts = ARCHIVED_STARTS if args.archived_six else PLANNED_STARTS
        if set(captures) != set(starts):
            raise ValueError("Capture windows do not match the selected sample")
        result = replay(captures, starts)
        result["capture_sha256"] = hashlib.sha256(args.capture.read_bytes()).hexdigest()
        print(json.dumps(result, indent=2))
    except (OSError, ValueError, InvalidOperation, KeyError) as error:
        parser.exit(2, f"{error}\n")


if __name__ == "__main__":
    main()
