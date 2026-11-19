"""Validate supplied v2 handoffs offline. Produces diagnostics only."""

import argparse
import json
from pathlib import Path

from jsonschema import Draft202012Validator


CONTRACTS = {
    "request_context": "request-context",
    "evidence_records": "evidence-record",
    "market_evidence": "market-evidence",
    "technical_evidence": "technical-evidence",
    "coin_profile": "coin-profile",
    "strategy_proposal": "strategy-proposal",
    "bot_configuration": "bot-configuration",
}
INSTRUMENT_KEYS = ("exchange", "symbol", "market_type", "settle_coin")
HARD_VETOES = frozenset({
    "H04_ACTIVE", "DAY_LOSS_LIMIT", "HWM_DRAWDOWN_LIMIT", "LEVERAGE_LIMIT",
    "PORTFOLIO_IM_LIMIT", "BOT_WORST_LOSS_LIMIT", "POSITION_SLOT_LIMIT",
    "GRID_RESERVE_DEFICIT", "LIQUIDATION_DISTANCE_VIOLATION",
})
FINAL_ATTESTATIONS = (
    "account_evidence_verified", "platform_form_verified",
    "risk_calculations_verified", "required_stress_verified",
)


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def schema_errors(bundle, contracts_dir=None):
    """Check all seven Draft 2020-12 contracts. A bot proposal is optional."""
    contracts_dir = contracts_dir or Path(__file__).with_name("contracts")
    errors = []
    for key, contract in CONTRACTS.items():
        value = bundle.get(key)
        if key == "bot_configuration" and value is None:
            continue
        schema = read_json(contracts_dir / f"{contract}.schema.json")
        Draft202012Validator.check_schema(schema)
        if key == "evidence_records":
            schema = {"type": "array", "items": schema}
        validator = Draft202012Validator(schema)
        for error in validator.iter_errors(value):
            path = "/".join(map(str, (key, *error.absolute_path)))
            errors.append(f"{path}: {error.message}")
    return errors


def _evidence_issues(records, market, technical, profile):
    issues = []
    ids = set()
    for record in records:
        evidence_id = record.get("evidence_id")
        if not evidence_id or evidence_id in ids:
            issues.append("DUPLICATE_OR_INVALID_EVIDENCE_ID")
        else:
            ids.add(evidence_id)

    references = market.get("evidence_ids", []) + profile.get("evidence_refs", [])
    if any(reference not in ids for reference in references):
        issues.append("MISSING_EVIDENCE_REFERENCE")
    for record in records:
        if (record.get("access_status") in {"ACCESS_UNAVAILABLE", "NOT_CHECKED"}
                and record.get("quality") == "VERIFIED_SOURCE"):
            issues.append("UNOBSERVED_VERIFIED_EVIDENCE")
        if record.get("source_kind") == "COMPUTED" and any(
            dependency not in ids for dependency in record.get("depends_on", [])
        ):
            issues.append("COMPUTED_DEPENDENCY_MISSING")
    if any(
        item.get("validation") == "VERIFIED"
        and (not item.get("source_ids") or item.get("value") is None)
        for item in technical.get("indicators", [])
    ):
        issues.append("INDICATOR_WITHOUT_DATA")
    return issues, ids


def _readiness_issues(bot, market, technical, ids, attestations):
    issues = []
    form = bot.get("form_evidence") or {}
    risk = bot.get("risk_checks") or {}
    mapping = bot.get("mapping") or []
    if not form.get("P01_source") or not form.get("P02_verified_at"):
        issues.append("P02_NOT_VERIFIED")
    if risk.get("model_status") != "PASS" or risk.get("missing") or risk.get("not_evaluable"):
        issues.append("RISK_UNVERIFIED")
    if not mapping or any(
        field.get("verified_status") != "VERIFIED" or not field.get("source_ref")
        for field in mapping
    ):
        issues.append("UI_FIELDS_UNVERIFIED")
    if any(attestations.get(key) is not True for key in FINAL_ATTESTATIONS):
        issues.append("FINAL_VERIFICATION_NOT_ATTESTED")
    candles = technical.get("candles_by_timeframe", [])
    if not ids or not market.get("evidence_ids") or not any(
        item.get("candle_completeness") == "VERIFIED" and item.get("count_closed", 0) > 0
        for item in candles
    ):
        issues.append("REAL_MARKET_EVIDENCE_INSUFFICIENT")
    return issues


def inspect_handoff(bundle, options=None):
    """Check consistency and safety after schema validation."""
    options = options or {}
    request = bundle.get("request_context") or {}
    market = bundle.get("market_evidence") or {}
    technical = bundle.get("technical_evidence") or {}
    profile = bundle.get("coin_profile") or {}
    strategy = bundle.get("strategy_proposal") or {}
    bot = bundle.get("bot_configuration")
    records = bundle.get("evidence_records", [])
    issues, gaps = [], []

    instrument = request.get("instrument") or {}
    if not all(instrument.get(key) for key in ("symbol", "exchange", "market_type")):
        issues.append("MARKET_IDENTITY_MISSING")
    sections = (("MARKET", market), ("TECHNICAL", technical), ("COIN", profile))
    for name, section in (*sections, ("BOT", bot)):
        if section and any(
            instrument.get(key) != (section.get("instrument") or {}).get(key)
            for key in INSTRUMENT_KEYS
        ):
            issues.append(f"{name}_INSTRUMENT_MISMATCH")

    for name, section in sections:
        if section.get("request_id") != request.get("request_id"):
            issues.append(f"{name}_REQUEST_MISMATCH")
    evidence_issues, ids = _evidence_issues(records, market, technical, profile)
    issues.extend(evidence_issues)

    known = options.get("known_hard_vetoes", [])
    vetoes = [code for code in known if code in HARD_VETOES]
    if any(code not in HARD_VETOES for code in known):
        issues.append("UNRECOGNIZED_HARD_VETO_CODE")
    risk = strategy.get("risk_screen") or {}
    veto = bool(vetoes or risk.get("model_status") == "REJECTED" or risk.get("hard_vetoes"))
    if market.get("coverage") != "COMPLETE_FOR_SCOPE":
        gaps.append("MARKET_COVERAGE_INCOMPLETE")
    if technical.get("gaps"):
        gaps.append("TECHNICAL_GAPS")
    if any(
        record.get("access_status") != "OBSERVED"
        or record.get("quality") in {"STALE", "CONFLICTED", "UNKNOWN"}
        for record in records
    ):
        gaps.append("UNVERIFIED_OR_UNAVAILABLE_EVIDENCE")
    if not profile or not strategy:
        issues.append("SYNTHESIS_MISSING")

    posture = strategy.get("posture")
    no_trade = posture == "WAIT" or strategy.get("decision_status") in {
        "WAIT", "NEEDS_DATA", "NOT_RECOMMENDED",
    }
    if veto:
        recommendation = "NOT_RECOMMENDED"
    elif issues:
        recommendation = "NEEDS_DATA"
    elif no_trade:
        recommendation = "WAIT"
    else:
        recommendation = posture or "WAIT"

    wants_ready = False
    if bot is not None:
        readiness = bot.get("readiness")
        if veto and readiness != "NOT_RECOMMENDED":
            issues.append("HARD_VETO_WITH_BOT_PROPOSAL")
        if no_trade and bot.get("mapping"):
            issues.append("EXECUTABLE_FIELD_MAP_ON_WAIT")
        if no_trade and (
            bot.get("grid_steps") or bot.get("order_amounts")
            or any(value is not None for value in (bot.get("boundaries") or {}).values())
        ):
            issues.append("NUMERIC_GRID_ON_WAIT")

        preferred = request.get("preferred_platform")
        if preferred == "UNSELECTED":
            issues.append("PLATFORM_NOT_SELECTED")
        elif bot.get("platform") != preferred:
            issues.append("PLATFORM_MISMATCH")
        if bot.get("strategy_ref") != strategy.get("strategy_id"):
            issues.append("STRATEGY_REFERENCE_MISMATCH")
        if bot.get("forbidden_automated_execution") is not True:
            issues.append("AUTO_EXECUTION_PROHIBITED")

        wants_ready = readiness == "VERIFIED_FOR_MANUAL_REVIEW"
        if wants_ready:
            issues.extend(_readiness_issues(bot, market, technical, ids, options))
            if bundle.get("synthetic") is True:
                issues.append("SYNTHETIC_READY_PROHIBITED")
            if veto or no_trade or issues or gaps:
                issues.append("UNSUPPORTED_READY")

    return {
        "issues": list(dict.fromkeys(issues)),
        "gaps": gaps,
        "known_hard_vetoes": list(dict.fromkeys(vetoes)),
        "recommendation": recommendation,
        "can_publish_verified_manual_config": wants_ready and not (issues or gaps or veto or no_trade),
        "execution_authorized": False,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("bundle", type=Path)
    args = parser.parse_args()
    try:
        bundle = read_json(args.bundle)
    except (OSError, ValueError) as error:
        parser.exit(2, f"{error}\n")
    if not isinstance(bundle, dict):
        parser.exit(2, "Handoff must be a JSON object\n")

    errors = schema_errors(bundle)
    result = {"schema_errors": errors}
    if not errors:
        result.update(inspect_handoff(bundle))
    print(json.dumps(result, indent=2))
    return 1 if errors or result["issues"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
