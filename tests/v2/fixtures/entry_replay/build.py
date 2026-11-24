"""Generate deterministic synthetic HYPE bars for one blinded replay."""

import argparse
import csv
from datetime import datetime, timezone
from pathlib import Path


def build(case, destination):
    destination.mkdir(parents=True, exist_ok=True)
    end = int(datetime(2026, 11, 20, 12, 15, tzinfo=timezone.utc).timestamp())
    start = end // 86400 * 86400 - 64 * 86400
    bars = []
    previous = 100
    for i, stamp in enumerate(range(start, end, 900)):
        close = 100 + (i % 9 - 4) / 10
        if stamp == end - 900:
            close = {"A": 102, "B": 98, "C": 100, "D": 100}[case]
        bars.append((stamp, previous, max(close, previous) + .1,
                     min(close, previous) - .1, close, 100))
        previous = close
    for interval, size in (("1d", 96), ("4h", 16), ("1h", 4), ("15m", 1)):
        count = len(bars) // size
        if interval == "15m" and case == "D":
            count -= 1
        with (destination / f"{interval}.csv").open("w", newline="") as stream:
            writer = csv.writer(stream)
            writer.writerow(("start_ms", "open", "high", "low", "close", "volume_base"))
            for index in range(count - 64, count):
                group = bars[index * size:(index + 1) * size]
                writer.writerow((group[0][0] * 1000, group[0][1], max(b[2] for b in group),
                                 min(b[3] for b in group), group[-1][4], sum(b[5] for b in group)))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case", choices=("A", "B", "C", "D"))
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    build(args.case, args.destination)
