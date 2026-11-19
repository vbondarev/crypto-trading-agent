"""Run with python tests/v2/workflow_smoke.py from a checkout."""

from copy import deepcopy
from pathlib import Path
import sys
import unittest

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "docs" / "v2"))

from workflow_guard import inspect_handoff, read_json, schema_errors


GAPS = {
    "MARKET_COVERAGE_INCOMPLETE", "TECHNICAL_GAPS", "UNVERIFIED_OR_UNAVAILABLE_EVIDENCE",
}


class WorkflowSmoke(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.wait = read_json(HERE / "fixtures" / "incomplete-hype.v1.json")
        cls.long = read_json(HERE / "fixtures" / "conditional-long-draft.v1.json")

    def inspect(self, bundle, *, issues=(), gaps=(), recommendation=None, options=None):
        result = inspect_handoff(bundle, options)
        self.assertTrue(set(issues) <= set(result["issues"]), result)
        self.assertTrue(set(gaps) <= set(result["gaps"]), result)
        if recommendation is not None:
            self.assertEqual(result["recommendation"], recommendation)
        self.assertIs(result["can_publish_verified_manual_config"], False)
        self.assertIs(result["execution_authorized"], False)
        return result

    def test_existing_fixtures_match_all_seven_schemas(self):
        for fixture in (self.wait, self.long):
            with self.subTest(request=fixture["request_context"]["request_id"]):
                self.assertEqual(schema_errors(fixture), [])

    def test_legacy_handoff_cases(self):
        self.inspect(self.wait, gaps=GAPS, recommendation="WAIT")
        self.inspect(self.long, gaps=GAPS, recommendation="LONG")
        self.assertEqual(self.long["bot_configuration"]["readiness"], "DRAFT")
        self.assertEqual(self.long["bot_configuration"]["mapping"], [])

        mutations = (
            (("market_evidence", "instrument", "symbol"), "DOGEUSDT", "MARKET_INSTRUMENT_MISMATCH", "NEEDS_DATA"),
            (("market_evidence", "request_id"), "WRONG", "MARKET_REQUEST_MISMATCH", None),
            (("coin_profile", "evidence_refs"), ["E-404"], "MISSING_EVIDENCE_REFERENCE", None),
            (("evidence_records", 0, "quality"), "VERIFIED_SOURCE", "UNOBSERVED_VERIFIED_EVIDENCE", None),
            (("technical_evidence", "indicators", 0, "validation"), "VERIFIED", "INDICATOR_WITHOUT_DATA", None),
            (("request_context", "preferred_platform"), "UNSELECTED", "PLATFORM_NOT_SELECTED", None),
            (("request_context", "preferred_platform"), "GINAREA", "PLATFORM_MISMATCH", None),
            (("strategy_proposal", "risk_screen", "hard_vetoes"), ["H04 ACTIVE"], "HARD_VETO_WITH_BOT_PROPOSAL", "NOT_RECOMMENDED"),
            (("bot_configuration", "mapping"), [{"ui_label": "Unproven order size", "value": 100, "verified_status": "UNVERIFIED"}], "EXECUTABLE_FIELD_MAP_ON_WAIT", None),
        )
        for path, value, issue, recommendation in mutations:
            with self.subTest(issue=issue):
                bundle = deepcopy(self.wait)
                parent = bundle
                for key in path[:-1]:
                    parent = parent[key]
                parent[path[-1]] = value
                self.inspect(bundle, issues=(issue,), recommendation=recommendation)

        bundle = deepcopy(self.wait)
        bundle["bot_configuration"]["readiness"] = "VERIFIED_FOR_MANUAL_REVIEW"
        self.inspect(bundle, issues=(
            "P02_NOT_VERIFIED", "RISK_UNVERIFIED", "UI_FIELDS_UNVERIFIED", "UNSUPPORTED_READY",
        ))

        bundle = deepcopy(self.wait)
        bundle["bot_configuration"]["readiness"] = "NOT_RECOMMENDED"
        self.inspect(bundle, recommendation="NOT_RECOMMENDED", options={"known_hard_vetoes": ["H04_ACTIVE"]})

        bundle = deepcopy(self.wait)
        records = bundle["evidence_records"]
        records.append(deepcopy(records[0]))
        self.inspect(bundle, issues=("DUPLICATE_OR_INVALID_EVIDENCE_ID",))
        records[-1].update(evidence_id="E-002", source_kind="COMPUTED", depends_on=["E-404"])
        self.inspect(bundle, issues=("COMPUTED_DEPENDENCY_MISSING",))

    def test_wait_rejects_numeric_grid_in_schema_valid_handoff(self):
        for field, value in (
            ("grid_steps", [0.5]), ("order_amounts", [10]), ("boundaries", {"lower": 100}),
        ):
            with self.subTest(field=field):
                bundle = deepcopy(self.wait)
                bundle["bot_configuration"][field] = value
                self.assertEqual(schema_errors(bundle), [])
                self.inspect(bundle, issues=("NUMERIC_GRID_ON_WAIT",), recommendation="WAIT")

    def test_rejects_literal_ready(self):
        bundle = deepcopy(self.long)
        bundle["bot_configuration"]["readiness"] = "READY"
        self.assertTrue(any(
            error.startswith("bot_configuration/readiness:") for error in schema_errors(bundle)
        ))

    def test_rejects_premature_manual_review(self):
        bundle = deepcopy(self.long)
        bundle["bot_configuration"]["readiness"] = "VERIFIED_FOR_MANUAL_REVIEW"
        errors = schema_errors(bundle)
        for path in ("form_evidence", "risk_checks", "mapping"):
            with self.subTest(path=path):
                self.assertTrue(any(error.startswith(f"bot_configuration/{path}") for error in errors))
        self.inspect(bundle, issues=(
            "P02_NOT_VERIFIED", "RISK_UNVERIFIED", "FINAL_VERIFICATION_NOT_ATTESTED", "UNSUPPORTED_READY",
        ))

    def test_synthetic_data_cannot_publish_a_schema_valid_ready_config(self):
        bundle = deepcopy(self.long)
        bot = bundle["bot_configuration"]
        bot.update(readiness="VERIFIED_FOR_MANUAL_REVIEW", mapping=[{
            "ui_label": "Synthetic field", "value": 1, "verified_status": "VERIFIED",
            "source_ref": "synthetic-only",
        }])
        bot["form_evidence"]["P02_verified_at"] = "2026-10-20T00:00:00Z"
        bot["risk_checks"].update(model_status="PASS", missing=[], not_evaluable=[])
        self.assertEqual(schema_errors(bundle), [])
        self.inspect(bundle, issues=("SYNTHETIC_READY_PROHIBITED", "UNSUPPORTED_READY"))

    def test_rejects_wrong_strategy_reference_in_schema_valid_handoff(self):
        bundle = deepcopy(self.long)
        bundle["bot_configuration"]["strategy_ref"] = "WRONG-STRATEGY"
        self.assertEqual(schema_errors(bundle), [])
        self.inspect(bundle, issues=("STRATEGY_REFERENCE_MISMATCH",))


if __name__ == "__main__":
    unittest.main(verbosity=2)
