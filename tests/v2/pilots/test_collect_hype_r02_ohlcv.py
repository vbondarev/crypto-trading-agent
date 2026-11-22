import hashlib
import json
import tempfile
import unittest
import urllib.error
import urllib.parse
import zipfile
from pathlib import Path

import collect_hype_r02_ohlcv as collector


STAMP = 1795090380000
SYMBOL = collector.MARKET["symbol"]


def response(path, query):
    if path == "/v5/market/time":
        result = {"timeSecond": str(STAMP // 1000)}
    elif path == "/v5/market/instruments-info":
        result = {"category": "linear", "list": [{
            "symbol": SYMBOL, "status": "Trading", "contractType": "LinearPerpetual",
            "quoteCoin": "USDT", "settleCoin": "USDT", "priceFilter": {"tickSize": "0.001"},
            "lotSizeFilter": {"qtyStep": "0.01"},
        }]}
    elif path == "/v5/market/tickers":
        result = {"category": "linear", "list": [{
            "symbol": SYMBOL, "markPrice": "32.50", "lastPrice": "32.49", "indexPrice": "32.51",
        }]}
    elif path == "/v5/market/kline":
        frames = {key: size for key, size in collector.INTERVALS.values()}
        size = frames[query["interval"][0]]
        assert query["end"] == [str(STAMP)]
        assert query["limit"] == [str(collector.REQUEST_LIMIT)]
        start = STAMP // size * size
        result = {"category": "linear", "symbol": SYMBOL, "list": [
            [str(start - i * size), "32.0", "33", "31", "32.5", "100", "3200"]
            for i in range(collector.REQUEST_LIMIT)
        ]}
    else:
        raise AssertionError(f"Unexpected endpoint: {path}")
    return {"retCode": 0, "result": result, "time": STAMP}


class CollectorTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name) / "snapshot"
        self.raw = {}

    def run_capture(self, mutate=lambda path, query, payload: None):
        def transport(url):
            parsed = urllib.parse.urlsplit(url)
            self.assertEqual(parsed.netloc, "api.bybit.com")
            query = urllib.parse.parse_qs(parsed.query)
            payload = response(parsed.path, query)
            mutate(parsed.path, query, payload)
            raw = json.dumps(payload, indent=1).encode()
            self.raw[(parsed.path, query.get("interval", [""])[0])] = raw
            return 200, raw

        return collector.collect(self.root, transport=transport, now=lambda: STAMP)

    def assert_failure(self, manifest, archive, dataset, reason):
        self.assertIsNone(archive)
        self.assertEqual(manifest["quality"], "NEEDS_DATA")
        self.assertEqual(manifest["readiness"], "NO_TRADE_READY")
        self.assertEqual(manifest["error"]["dataset"], dataset)
        self.assertIn(reason, manifest["error"]["message"])
        self.assertEqual(json.loads((self.root / "manifest.json").read_text()), manifest)
        self.assertFalse(self.root.with_suffix(".zip").exists())

    def test_snapshot_archives_exact_responses_and_closed_candles(self):
        manifest, archive = self.run_capture()
        self.assertEqual(manifest["quality"], collector.QUALITY_READY)
        self.assertEqual(manifest["readiness"], "NO_TRADE_READY")
        self.assertEqual(len(manifest["datasets"]), 7)
        self.assertEqual([manifest["ticker"][key] for key in ("markPrice", "lastPrice", "indexPrice")],
                         ["32.50", "32.49", "32.51"])
        with zipfile.ZipFile(archive) as bundle:
            self.assertEqual(bundle.read("raw/ticker.json"), self.raw[("/v5/market/tickers", "")])
            self.assertEqual(json.loads(bundle.read("manifest.json")), manifest)
            for label, (interval, size) in collector.INTERVALS.items():
                with self.subTest(label=label):
                    summary = manifest["intervals"][label]
                    self.assertEqual(summary["candle_count"], 300)
                    self.assertGreaterEqual(summary["excluded_recent_or_open"], 1)
                    last = collector.latest_start(STAMP, size)
                    csv_rows = bundle.read(f"candles/{label}.csv").decode().splitlines()
                    self.assertEqual(len(csv_rows), 301)
                    self.assertEqual(int(csv_rows[-1].split(",")[0]), last)
                    self.assertEqual(bundle.read(f"raw/kline-{label}.json"),
                                     self.raw[("/v5/market/kline", interval)])
            for item in manifest["files"]:
                self.assertEqual(hashlib.sha256(bundle.read(item["path"])).hexdigest(), item["sha256"])

    def test_gap_duplicate_wrong_order_and_malformed_prices(self):
        def gap(rows):
            rows.pop(10)

        def duplicate(rows):
            rows[10] = rows[9]

        def wrong_order(rows):
            rows[9], rows[10] = rows[10], rows[9]

        def bad_ohlc(rows):
            rows[10][2] = "1"

        def stale(rows):
            del rows[:2]

        def insufficient(rows):
            del rows[100:]

        for update, reason in [(gap, "gap"), (duplicate, "duplicate"), (wrong_order, "order"),
                               (bad_ohlc, "OHLC"), (stale, "latest"), (insufficient, "only")]:
            with self.subTest(case=update.__name__):
                self.root = self.root.parent / update.__name__

                def mutate(path, query, payload):
                    if query.get("interval") == ["15"]:
                        update(payload["result"]["list"])

                self.assert_failure(*self.run_capture(mutate), "kline-15m", reason)

    def test_invalid_api_result_remains_available_for_audit(self):
        def mutate(path, query, payload):
            if path == "/v5/market/time":
                payload["retCode"] = 10006

        self.assert_failure(*self.run_capture(mutate), "time", "10006")
        self.assertEqual((self.root / "raw/time.json").read_bytes(),
                         self.raw[("/v5/market/time", "")])

    def test_clock_conflict(self):
        def mutate(path, query, payload):
            if path == "/v5/market/time":
                payload["result"]["timeSecond"] = str(STAMP // 1000 + 10)

        self.assert_failure(*self.run_capture(mutate), "time", "Conflicting")

    def test_stale_time_anchor(self):
        def mutate(path, query, payload):
            if path == "/v5/market/time":
                payload["time"] -= 120000
                payload["result"]["timeSecond"] = str(payload["time"] // 1000)

        self.assert_failure(*self.run_capture(mutate), "time", "clock")

    def test_stale_ticker(self):
        def mutate(path, query, payload):
            if path == "/v5/market/tickers":
                payload["time"] -= 120000

        self.assert_failure(*self.run_capture(mutate), "ticker", "Stale")

    def test_invalid_ticker_price_keeps_raw_response(self):
        def mutate(path, query, payload):
            if path == "/v5/market/tickers":
                payload["result"]["list"][0]["markPrice"] = "0"

        self.assert_failure(*self.run_capture(mutate), "ticker", "markPrice")
        self.assertTrue((self.root / "raw/ticker.json").exists())

    def test_wrong_instrument(self):
        def mutate(path, query, payload):
            if path == "/v5/market/instruments-info":
                payload["result"]["category"] = "spot"

        self.assert_failure(*self.run_capture(mutate), "instruments-info", "matching")

    def test_network_failure_records_attempt(self):
        def transport(url):
            raise urllib.error.URLError("DNS unavailable")

        capture = collector.collect(self.root, transport=transport, now=lambda: STAMP)
        self.assert_failure(*capture, "time", "DNS unavailable")
        self.assertIn("received_at_utc", capture[0]["datasets"]["time"])

    def test_existing_output_is_preserved(self):
        manifest, archive = self.run_capture()
        with self.assertRaises(FileExistsError):
            self.run_capture()
        self.assertEqual(json.loads((self.root / "manifest.json").read_text()), manifest)
        self.assertTrue(archive.is_file())


if __name__ == "__main__":
    unittest.main()
