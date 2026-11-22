import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

CALCULATOR = Path(__file__).resolve().parents[2] / "tools" / "technical_indicators.py"
sys.path.insert(0, str(CALCULATOR.parent))
import technical_indicators as indicators

START = datetime(2026, 11, 16, tzinfo=timezone.utc)
START_MS = int(START.timestamp() * 1000)
HOUR_MS = indicators.INTERVAL_MS["1h"]


def candles_for_prices(prices, volume=10):
    return [indicators.Candle(START_MS + i * HOUR_MS, price, price + 1, price - 1, price, volume)
            for i, price in enumerate(prices)]


def csv_for(candles):
    rows = ["start_ms,start_utc,end_utc,open,high,low,close,volume_base,turnover_quote"]
    rows.extend(f"{c.start_ms},,,{c.open},{c.high},{c.low},{c.close},{c.volume},{c.volume*c.close}"
                for c in candles)
    return ("\n".join(rows) + "\n").encode("ascii")


class IndicatorTests(unittest.TestCase):
    def test_ema_seed_and_first_update(self):
        candles = candles_for_prices(range(100, 151))
        self.assertEqual(indicators.calculate(candles[:20])["ema20"], 109.5)
        self.assertEqual(indicators.calculate(candles[:21])["ema20"], 110.5)
        self.assertEqual(indicators.calculate(candles[:50])["ema50"], 124.5)
        self.assertEqual(indicators.calculate(candles)["ema50"], 125.5)

    def test_rsi_seed_first_update_and_flat_series(self):
        prices = [100]
        for i in range(14):
            prices.append(prices[-1] + (2 if i % 2 == 0 else -1))
        candles = candles_for_prices(prices + [prices[-1] - 2])
        self.assertAlmostEqual(indicators.calculate(candles[:15])["rsi14"], 200 / 3)
        self.assertAlmostEqual(indicators.calculate(candles)["rsi14"], 2600 / 43)
        self.assertEqual(indicators.calculate(candles_for_prices([100] * 15))["rsi14"], 50)
        self.assertEqual(indicators.calculate(candles_for_prices(range(100, 115)))["rsi14"], 100)
        self.assertEqual(indicators.calculate(candles_for_prices(range(115, 100, -1)))["rsi14"], 0)

    def test_atr_includes_first_candle_and_uses_previous_close_on_gap(self):
        first = indicators.Candle(START_MS, 100, 110, 90, 100, 10)
        candles = [first, *candles_for_prices([100] * 14)[1:]]
        seed = indicators.calculate(candles[:14])
        self.assertAlmostEqual(seed["atr14"], 46 / 14)
        self.assertAlmostEqual(seed["atr14_pct"], 46 / 14)
        after_gap = indicators.Candle(START_MS + 14 * HOUR_MS, 105, 107, 105, 106, 10)
        result = indicators.calculate([*candles[:14], after_gap])
        self.assertAlmostEqual(result["atr14"], 174 / 49)
        self.assertAlmostEqual(result["atr14_pct"], (174 / 49) / 106 * 100)

    def test_rvol_uses_median_of_previous_twenty_only(self):
        volumes = [1000] * 5 + [10] * 10 + [30] * 10 + [40]
        candles = [indicators.Candle(START_MS + i * HOUR_MS, 100, 101, 99, 100, volume)
                   for i, volume in enumerate(volumes)]
        self.assertEqual(indicators.calculate(candles)["rvol20"], 2)
        zero_window = candles_for_prices([100] * 20, volume=0)
        self.assertIsNone(indicators.calculate([*zero_window, candles[-1]])["rvol20"])

    def test_insufficient_history_is_reported_per_indicator(self):
        result = indicators.calculate(candles_for_prices([100] * 13))
        self.assertEqual(result["close"], 100)
        for indicator in ("ema20", "ema50", "rsi14", "atr14", "atr14_pct", "rvol20"):
            with self.subTest(indicator=indicator):
                self.assertIsNone(result[indicator])


class CaptureTests(unittest.TestCase):
    def test_cli_on_reversed_collector_csv(self):
        candles = candles_for_prices(range(100, 151))
        data = csv_for(list(reversed(candles)))
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "candles.csv"
            path.write_bytes(data)
            result = subprocess.run(
                [sys.executable, str(CALCULATOR), str(path), "--interval", "1h",
                 "--as-of", "2026-11-18T06:01:00+03:00"],
                capture_output=True, text=True, check=True,
            )
        output = json.loads(result.stdout)
        self.assertEqual(output["candle_count"], 51)
        self.assertEqual(output["first_open_utc"], "2026-11-16T00:00:00.000Z")
        self.assertEqual(output["last_close_utc"], "2026-11-18T03:00:00.000Z")
        self.assertEqual(output["input_sha256"], hashlib.sha256(data).hexdigest())
        self.assertEqual(output["ema50"], 125.5)

    def test_gap_duplicate_unclosed_and_bad_values_are_rejected(self):
        candles = candles_for_prices([100, 102, 104])
        cutoff = START + timedelta(hours=3, seconds=1)
        with self.assertRaisesRegex(ValueError, "Gap or duplicate"):
            indicators.analyze_csv(csv_for([candles[0], candles[2]]), "1h", cutoff)
        with self.assertRaisesRegex(ValueError, "Gap or duplicate"):
            indicators.analyze_csv(csv_for([candles[0], candles[0]]), "1h", cutoff)
        for stamp in (START + timedelta(hours=3), START + timedelta(hours=2, minutes=30)):
            with self.subTest(cutoff=stamp):
                with self.assertRaisesRegex(ValueError, "cutoff"):
                    indicators.analyze_csv(csv_for(candles), "1h", stamp)
        bad = indicators.Candle(START_MS, 100, 101, 99, float("nan"), 10)
        with self.assertRaisesRegex(ValueError, "non-finite"):
            indicators.analyze_csv(csv_for([bad]), "1h", cutoff)

    def test_weekly_alignment_and_timezone(self):
        candle = candles_for_prices([100])[0]
        data = csv_for([candle])
        cutoff = START + timedelta(weeks=1, seconds=1)
        output = indicators.analyze_csv(data, "1w", cutoff)
        self.assertEqual(output["last_close_utc"], "2026-11-23T00:00:00.000Z")
        with self.assertRaisesRegex(ValueError, "align"):
            indicators.analyze_csv(csv_for(candles_for_prices([100, 101])[1:]), "1w", cutoff)
        with self.assertRaisesRegex(ValueError, "timezone"):
            indicators.analyze_csv(data, "1w", cutoff.replace(tzinfo=None))


if __name__ == "__main__":
    unittest.main()
