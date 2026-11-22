"""Offline Stage 09 acceptance replay. All account and price inputs are fictional."""

from copy import deepcopy
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from fractions import Fraction
from pathlib import Path
from statistics import stdev
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "docs" / "v2"))
from workflow_guard import FINAL_ATTESTATIONS, inspect_handoff, schema_errors


NOW = datetime(2026, 11, 20, 0, 0, tzinfo=timezone.utc)
COVERAGE = {"account", "positions", "active_orders", "conditional_orders", "bots", "grid"}
SNAPSHOT = {
    "coverage": COVERAGE,
    "observed_at": NOW - timedelta(minutes=1),
    "mark_at": NOW - timedelta(seconds=30),
    "mark_ttl": timedelta(minutes=2),
    "events": (),
}


def snapshot_gate(snapshot):
    if COVERAGE - snapshot["coverage"]:
        return "NEEDS_DATA", "INCOMPLETE_ACCOUNT_SCOPE"
    for field, ttl in (("observed_at", timedelta(minutes=5)), ("mark_at", snapshot["mark_ttl"])):
        age = NOW - snapshot[field]
        if not timedelta() <= age <= ttl:
            return "RECHECK", field
    if any(snapshot["observed_at"] < time <= NOW for time, _ in snapshot["events"]):
        return "RECHECK", "ACCOUNT_CHANGED"
    return "PASS", None


SHORT_SLOT = ("SYN-UTA", "HYPEUSDT", 2)
POSITIONS = {SHORT_SLOT: 4}
ACCOUNT_ORDERS = {
    (*SHORT_SLOT, "order-a"): (3, 2, "OPEN", "bot-1"),
    (*SHORT_SLOT, "order-b"): (0, 2, "CONDITIONAL", "bot-1"),
    (*SHORT_SLOT, "order-c"): (1, 0, "FILLED", "bot-1"),
}
VIRTUAL_INS = {("bot-1", "grid-4"): 3}


def reconcile(positions, orders, linked_ins, virtual_ins):
    unresolved = []
    for key, owner in linked_ins.items():
        if key not in orders or orders[key][3] != owner:
            unresolved.append(key)
    # Synchronized position size already includes fills, including partial fills.
    current = sum(positions.values())
    exchange_remaining = sum(
        leaves for _, leaves, state, _ in orders.values() if state in {"OPEN", "CONDITIONAL"}
    )
    return current, exchange_remaining + sum(virtual_ins.values()), unresolved


def cross_mmr(margin_balance, haircut_loss, signed_order_loss, maintenance):
    if None in (margin_balance, haircut_loss, signed_order_loss, maintenance):
        return "NOT_EVALUABLE"
    denominator = margin_balance - haircut_loss + signed_order_loss
    if denominator <= 0:
        return "NOT_EVALUABLE"
    return Fraction(maintenance, denominator)


def short_scenario(exit_price):
    entry_notional = Decimal(205)
    exit_notional = Decimal(2) * exit_price
    fees = (entry_notional + exit_notional) * Decimal("0.001")
    return exit_notional - entry_notional + fees + Decimal("1.40")


def short_bound(max_exit_price):
    if max_exit_price is None:
        return "NOT_EVALUABLE"
    return short_scenario(max_exit_price)


def fixed_replay(btc_mark, eth_mark):
    # Assumes monotone paths and full fills at the two synthetic IN thresholds.
    loss = 2 * (100 - btc_mark) + 3 * (eth_mark - 50)
    loss += max(95 - btc_mark, 0) + max(eth_mark - 55, 0)
    return loss + 3


def adaptive_shock(returns, gap):
    if len(returns) < 30 or gap is None:
        return "NOT_EVALUABLE"
    return max(0.05, 3 * stdev(returns), gap)


def historical_replay(frames, *, historical_provenance):
    if not historical_provenance or not frames:
        return "NOT_EVALUABLE"
    return max(fixed_replay(btc, eth) for btc, eth in frames)


def handoff(platform, snapshot, *, observed_bot_loss=None):
    market_id = {"exchange": "Bybit", "symbol": "HYPEUSDT", "market_type": "USDT_PERPETUAL",
                 "settle_coin": "USDT", "identity_status": "VERIFIED"}
    common = {"instrument": market_id, "request_id": "stage09-replay"}
    evidence_id = "synthetic-candles"
    date = NOW.isoformat()
    trend = {"direction": "DOWN", "confidence": "LOW", "rationale": ["Synthetic fixture"]}
    _, gap = snapshot_gate(snapshot)
    breach = observed_bot_loss is not None and observed_bot_loss > Decimal("0.05") * 1000
    vetoes = ["BOT_WORST_LOSS_LIMIT"] if breach else []
    model = "REJECTED" if vetoes else "NOT_EVALUABLE"
    missing = [gap] if gap else []
    form_labels = {
        "VELES": ["Депозит", "Плечо", "Тип маржи"],
        "GINAREA": ["Размер ордера", "Макс. размер", "Шаг сетки"],
    }
    form_reference = "stage-08-platform-form-verification.md"
    return {
        "synthetic": True,
        "request_context": dict(common, as_of=date, user_goal="BOT_PROPOSAL",
                                horizon="fixed offline replay", preferred_platform=platform),
        "evidence_records": [{
            "evidence_id": evidence_id, "subject": "synthetic HYPEUSDT candles",
            "claim": "Fictional market input", "category": "TECHNICAL", "source_kind": "USER_SUPPLIED",
            "source_name": "Stage 09 fixture", "source_method": "USER_TEXT", "access_status": "OBSERVED",
            "quality": "ESTIMATE", "independence_group": "stage09",
        }],
        "market_evidence": dict(common, market_regime="UNKNOWN", evidence_ids=[evidence_id], gaps=[],
                                conflicts=[], fetched_at=date, coverage="COMPLETE_FOR_SCOPE"),
        "technical_evidence": dict(common, candles_by_timeframe=[{
            "timeframe": "1h", "source_ids": [evidence_id], "count_closed": 30,
            "candle_completeness": "VERIFIED",
        }], indicators=[], trend_by_timeframe=[], levels=[], disagreements=[], gaps=[]),
        "coin_profile": dict(common, market_regime={"state": "UNKNOWN", "reasons": []},
            coin_context={"sector": None, "relative_strength": None, "catalysts": [], "tokenomics_flags": []},
            social_news={"dominant_narratives": [], "confirmed_events": [], "rumors": [], "coverage": "INSUFFICIENT"},
            technical={"global_trend": trend, "local_trend": trend, "timeframes": ["1h"],
                       "key_levels": [], "signals": []},
            derivatives={"funding": None, "open_interest": None, "liquidations": None,
                         "interpretation": "NOT_CHECKED"},
            bullish_factors=[], bearish_factors=[], contradictions=[], scenarios=[],
            trend_decision=trend, evidence_refs=[evidence_id], coverage_gaps=[]),
        "strategy_proposal": {
            "strategy_id": "short", "coin_profile_ref": "stage09-replay", "posture": "SHORT",
            "strategy_type": "GRID", "rationale": [], "alternatives": [], "entry_conditions": [],
            "invalidation_conditions": [], "profitability_claim": "NONE", "user_choice_required": True,
            "risk_screen": {"hard_vetoes": vetoes, "not_evaluable": ["LIVE_RISK"], "model_status": model},
            "decision_status": "NOT_RECOMMENDED" if vetoes else "RECOMMENDED_CONDITIONAL",
        },
        "bot_configuration": {
            "config_id": f"offline-{platform}", "platform": platform, "instrument": market_id,
            "strategy_ref": "short", "form_evidence": {"P01_source": form_reference,
                "P02_verified_at": None, "field_map_version": "stage08-labels"},
            "input_budget": None, "leverage": None, "order_amounts": [], "grid_steps": [],
            "boundaries": {}, "entry_rules": [], "exits": [], "currency_units": "USDT",
            "risk_checks": {"hard_checks": vetoes, "missing": missing, "not_evaluable": ["LIVE_RISK"],
                            "model_status": model},
            "assumptions": ["SYNTHETIC_ONLY"], "mapping": [] if vetoes else [
                {"ui_label": label, "value": None, "source_ref": form_reference,
                 "verified_status": "VERIFIED"} for label in form_labels[platform]
            ],
            "readiness": "NOT_RECOMMENDED" if vetoes else "NEEDS_DATA",
            "manual_steps": [], "forbidden_automated_execution": True,
        },
    }


class Stage09(unittest.TestCase):
    def test_092_fresh_snapshot(self):
        self.assertEqual(snapshot_gate(SNAPSHOT), ("PASS", None))

    def test_092_missing_conditional_orders(self):
        missing = dict(SNAPSHOT, coverage=COVERAGE - {"conditional_orders"})
        self.assertEqual(snapshot_gate(missing), ("NEEDS_DATA", "INCOMPLETE_ACCOUNT_SCOPE"))

    def test_092_stale_and_adaptive_mark(self):
        for snapshot in (
            dict(SNAPSHOT, mark_at=NOW - timedelta(seconds=121)),
            dict(SNAPSHOT, mark_ttl=timedelta(seconds=20)),
        ):
            self.assertEqual(snapshot_gate(snapshot), ("RECHECK", "mark_at"))

    def test_092_partial_fill_invalidates_snapshot(self):
        events = ((NOW - timedelta(seconds=1), "PARTIAL_FILL"),)
        self.assertEqual(snapshot_gate(dict(SNAPSHOT, events=events)), ("RECHECK", "ACCOUNT_CHANGED"))

    def test_092_t02_boundary(self):
        self.assertEqual(snapshot_gate(dict(SNAPSHOT, observed_at=NOW - timedelta(minutes=5)))[0], "PASS")
        self.assertEqual(snapshot_gate(dict(SNAPSHOT, observed_at=NOW - timedelta(seconds=301)))[0], "RECHECK")

    def test_093_reconcile_partial_fill_and_future_obligations(self):
        linked = {key: "bot-1" for key in ACCOUNT_ORDERS}
        self.assertEqual(reconcile(POSITIONS, ACCOUNT_ORDERS, linked, VIRTUAL_INS), (4, 7, []))

    def test_093_unproved_owner_keeps_obligation(self):
        key = next(iter(ACCOUNT_ORDERS))
        self.assertEqual(reconcile(POSITIONS, ACCOUNT_ORDERS, {key: "other"}, VIRTUAL_INS), (4, 7, [key]))

    def test_093_distinct_exchange_ids_and_full_remaining_reserve(self):
        orders = dict(ACCOUNT_ORDERS)
        orders[(*SHORT_SLOT, "order-d")] = orders[(*SHORT_SLOT, "order-b")]
        current, future, unresolved = reconcile(POSITIONS, orders, {}, VIRTUAL_INS)
        self.assertEqual((current, future, unresolved), (4, 9, []))
        # Fictional incremental IM per unit, plus fees, slippage and funding buffers.
        self.assertEqual(future * 6 + 8 + 12 + 6, 80)

    def test_094_cross_signed_order_loss_and_missing_inputs(self):
        self.assertEqual(cross_mmr(900, 20, -10, 100), Fraction(10, 87))
        self.assertEqual(cross_mmr(900, 20, None, 100), "NOT_EVALUABLE")
        self.assertEqual(cross_mmr(10, 10, -1, 100), "NOT_EVALUABLE")

    def test_094_short_execution_and_known_breach(self):
        self.assertEqual(short_scenario(Decimal(112)), Decimal("20.829"))
        self.assertEqual(short_bound(None), "NOT_EVALUABLE")
        self.assertEqual(short_scenario(Decimal(130)), Decimal("56.865"))
        self.assertGreater(short_scenario(Decimal(130)), Decimal(50))

    def test_094_fixed_shocks(self):
        for pct, expected in ((5, 20.5), (10, 43), (15, 68), (30, 143)):
            scale = Fraction(pct, 100)
            with self.subTest(pct=pct):
                self.assertEqual(fixed_replay(100 * (1 - scale), 50 * (1 + scale)), expected)
                for sign in (-1, 1):
                    self.assertEqual(
                        fixed_replay(100 * (1 + sign * scale), 50),
                        3 - 2 * sign * pct + max(-sign * pct - 5, 0),
                    )
                    self.assertEqual(
                        fixed_replay(100, 50 * (1 + sign * scale)),
                        3 + 3 * sign * pct / 2 + max(sign * pct / 2 - 5, 0),
                    )

    def test_094_adaptive_shocks(self):
        returns = [0.04, -0.04, 0.0] * 10
        self.assertAlmostEqual(adaptive_shock(returns, 0.06), 0.12 * (20 / 29) ** 0.5)
        self.assertEqual(adaptive_shock(returns[:-1], 0.06), "NOT_EVALUABLE")
        self.assertEqual(adaptive_shock(returns, None), "NOT_EVALUABLE")

    def test_094_historical_path_without_market_provenance(self):
        frames = [(100, 50), (95, 55), (90, 60)]
        self.assertEqual([fixed_replay(*frame) for frame in frames], [3, 28, 63])
        self.assertEqual(historical_replay(frames, historical_provenance=False), "NOT_EVALUABLE")
        self.assertEqual(historical_replay([], historical_provenance=False), "NOT_EVALUABLE")

    def test_094_reverse_stress_on_one_declared_path(self):
        boundary = Fraction(57, 70)
        for t, cmp in ((boundary - Fraction(1, 1000), self.assertLess),
                       (boundary, self.assertEqual),
                       (boundary + Fraction(1, 1000), self.assertGreater)):
            cmp(fixed_replay(100 - 10 * t, 50 + 10 * t), 50)

    def test_095_handoff_gaps_block_both_platforms(self):
        variants = [
            SNAPSHOT,
            dict(SNAPSHOT, coverage=COVERAGE - {"conditional_orders"}),
            dict(SNAPSHOT, mark_at=NOW - timedelta(seconds=121)),
            dict(SNAPSHOT, events=((NOW - timedelta(seconds=1), "PARTIAL_FILL"),)),
        ]
        for platform in ("VELES", "GINAREA"):
            for snapshot in variants:
                with self.subTest(platform=platform, snapshot=snapshot):
                    bundle = handoff(platform, snapshot)
                    self.assertEqual(schema_errors(bundle), [])
                    self.assertEqual(inspect_handoff(bundle)["issues"], [])
                    bot = bundle["bot_configuration"]
                    self.assertEqual(bot["readiness"], "NEEDS_DATA")
                    _, snapshot_gap = snapshot_gate(snapshot)
                    self.assertEqual(bot["risk_checks"]["missing"], [snapshot_gap] if snapshot_gap else [])
                    self.assertFalse(inspect_handoff(bundle)["execution_authorized"])
                    proposal = deepcopy(bundle)
                    proposal["bot_configuration"]["readiness"] = "VERIFIED_FOR_MANUAL_REVIEW"
                    self.assertTrue(schema_errors(proposal))
                    result = inspect_handoff(proposal)
                    self.assertTrue({"P02_NOT_VERIFIED", "RISK_UNVERIFIED", "UNSUPPORTED_READY"}
                                    <= set(result["issues"]))
                    self.assertFalse(result["can_publish_verified_manual_config"])

    def test_095_wrong_platform_market_and_known_loss_breach(self):
        for platform in ("VELES", "GINAREA"):
            with self.subTest(platform=platform):
                bundle = handoff(platform, SNAPSHOT)
                bot = bundle["bot_configuration"]
                bot["platform"] = "GINAREA" if platform == "VELES" else "VELES"
                bot["instrument"] = dict(bot["instrument"], symbol="OTHERUSDT")
                self.assertTrue({"PLATFORM_MISMATCH", "BOT_INSTRUMENT_MISMATCH"}
                                <= set(inspect_handoff(bundle)["issues"]))
                vetoed = handoff(platform, SNAPSHOT, observed_bot_loss=short_scenario(Decimal(130)))
                self.assertEqual(schema_errors(vetoed), [])
                self.assertEqual(inspect_handoff(vetoed)["recommendation"], "NOT_RECOMMENDED")

    def test_095_synthetic_mode_blocks_even_filled_attestations(self):
        for platform in ("VELES", "GINAREA"):
            with self.subTest(platform=platform):
                proposal = handoff(platform, SNAPSHOT)
                bot = proposal["bot_configuration"]
                bot["form_evidence"]["P02_verified_at"] = NOW.isoformat()
                bot["risk_checks"] = {"model_status": "PASS", "missing": [], "not_evaluable": [], "hard_checks": []}
                bot["readiness"] = "VERIFIED_FOR_MANUAL_REVIEW"
                strategy = proposal["strategy_proposal"]
                strategy["decision_status"] = "RECOMMENDED_CONDITIONAL"
                strategy["risk_screen"] = {"model_status": "PASS", "not_evaluable": [], "hard_vetoes": []}
                self.assertEqual(schema_errors(proposal), [])
                result = inspect_handoff(proposal, dict.fromkeys(FINAL_ATTESTATIONS, True))
                self.assertIn("SYNTHETIC_READY_PROHIBITED", result["issues"])
                self.assertFalse(result["can_publish_verified_manual_config"])
                self.assertFalse(result["execution_authorized"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
