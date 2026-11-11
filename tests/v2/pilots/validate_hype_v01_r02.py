#!/usr/bin/env python3
"""Offline HYPE-V01-R02 typed-contract regression grader.

This is a test tool, not a trading tool. Requires 'pip install jsonschema'.
Both schemas MUST be the exact Git blobs from pinned v2 policy commit.
Never connects to exchanges, bot APIs, accounts or trading endpoints.
"""
import argparse
import copy
import hashlib
import json
import sys
from pathlib import Path
from jsonschema import Draft202012Validator

POLICY_SHA = "b7123d9cf19502bf4a890f1400027f30fa213434"
FIXTURE_SHA256 = "9e925caddbf62206b7237d60c4ec0971ca2fc6cd91c064070bf83b3b9416a872"
SCHEMA_BLOBS = {
    "strategy-proposal.schema.json": "59db0de12477388f93cacee48314ef70eaaa10a3",
    "bot-configuration.schema.json": "0fb510fd07d33f78da3e05c5dd187b6bd6b4cb40",
}


def git_blob_sha(data):
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()


def read_schema(path, expected):
    raw = path.read_bytes()
    observed = git_blob_sha(raw)
    if observed != expected:
        raise ValueError(f"schema {path.name}: expected Git blob {expected}, got {observed}; do not use a modified/branch schema")
    data = json.loads(raw)
    Draft202012Validator.check_schema(data)
    return Draft202012Validator(data)


def check(response, schema_strategy, schema_bot):
    errors = []
    def fail(message):
        errors.append(message)

    if not isinstance(response, dict):
        return ["Root must be a JSON object"], "INVALID"
    if response.get("run_id") != "HYPE-V01-R02": fail("run_id must be HYPE-V01-R02")
    if response.get("policy_sha") != POLICY_SHA: fail("Wrong normative policy SHA")
    if response.get("fixture_sha256") != FIXTURE_SHA256: fail("Wrong synthetic fixture SHA256")
    if response.get("synthetic_only") is not True: fail("synthetic_only must be true")
    cases = response.get("cases")
    if not isinstance(cases, dict): return errors + ["cases must be a JSON object"], "INVALID"
    for case_id in ("V01-A", "V01-B"):
        case = cases.get(case_id)
        if not isinstance(case, dict):
            fail(f"{case_id} is missing or not an object")
            continue
        s = case.get("StrategyProposal")
        b = case.get("BotConfigurationProposal")
        if not isinstance(s, dict) or not isinstance(b, dict):
            fail(f"{case_id}: full StrategyProposal and BotConfigurationProposal objects required")
            continue
        for label, validator, value in (("StrategyProposal", schema_strategy, s),
                                        ("BotConfigurationProposal", schema_bot, b)):
            for err in sorted(validator.iter_errors(value), key=lambda e: str(e.absolute_path)):
                place = ".".join(map(str, err.absolute_path)) or "<root>"
                fail(f"{case_id}.{label}.{place}: {err.message}")
        if s.get("strategy_id") != b.get("strategy_ref"):
            fail(f"{case_id}: bot.strategy_ref must match StrategyProposal.strategy_id")
        if s.get("strategy_type") != "DCA" or b.get("platform") != "VELES":
            fail(f"{case_id}: strategy_type must be DCA and platform VELES")
        instrument = b.get("instrument", {})
        if not isinstance(instrument, dict): instrument = {}
        if instrument.get("symbol") != "HYPEUSDT" or instrument.get("market_type") != "USDT_PERPETUAL":
            fail(f"{case_id}: fictional instrument must be HYPEUSDT USDT_PERPETUAL")
        if instrument.get("identity_status") == "VERIFIED":
            fail(f"{case_id}: fabricated synthetic exchange identity cannot be VERIFIED")
        form = b.get("form_evidence", {})
        if not isinstance(form, dict): form = {}
        if form.get("P02_verified_at") is not None or form.get("field_map_version") is not None:
            fail(f"{case_id}: real P02 never supplied; fields must be null")
        if b.get("readiness") not in ("DRAFT", "NEEDS_DATA", "NOT_RECOMMENDED"):
            fail(f"{case_id}: no verified manual review/READY in synthetic test")
        mapping = b.get("mapping", [])
        if not isinstance(mapping, list): mapping = []
        for i, row in enumerate(mapping):
            if not isinstance(row, dict): continue
            if row.get("verified_status") != "DOCUMENTED_ONLY" or row.get("form_key_if_verified") is not None:
                fail(f"{case_id}.mapping[{i}]: only DOCUMENTED_ONLY with null P02 form key")
        rs = s.get("risk_screen", {})
        if not isinstance(rs, dict): rs = {}
        br = b.get("risk_checks", {})
        if not isinstance(br, dict): br = {}
        if b.get("forbidden_automated_execution") is not True:
            fail(f"{case_id}: forbidden_automated_execution must be true")
        lev = b.get("leverage")
        if isinstance(lev, (int, float)) and not isinstance(lev, bool) and lev > 5:
            fail(f"{case_id}: leverage exceeds 5x")
        if case_id == "V01-A":
            if s.get("posture") == "WAIT":
                if s.get("decision_status") != "WAIT" or b.get("readiness") != "NOT_RECOMMENDED":
                    fail("V01-A: WAIT must not hand off a draft")
                if b.get("grid_steps") or b.get("order_amounts"):
                    fail("V01-A: WAIT must not produce numeric orders/grid")
            elif s.get("posture") == "LONG":
                if s.get("decision_status") != "NEEDS_DATA":
                    fail("V01-A: conditional LONG has unconfirmed entry; decision_status=NEEDS_DATA")
                if b.get("readiness") != "NEEDS_DATA":
                    fail("V01-A: draft needs actual P02/T02; readiness=NEEDS_DATA")
            else:
                fail("V01-A: positive synthetic branch must use LONG or justified WAIT (not LONG_CANDIDATE)")
            if rs.get("model_status") not in ("NOT_EVALUABLE", "UNVERIFIED"):
                fail("V01-A: simulated test budget does not permit verified risk PASS")
            if br.get("model_status") not in ("NOT_EVALUABLE", "UNVERIFIED"):
                fail("V01-A: no actual portfolio risk PASS")
            if not br.get("missing") or not br.get("not_evaluable"):
                fail("V01-A: list missing form/account evidence and not-evaluable account risk")
        else:
            if case.get("injected_H04") != "ACTIVE":
                fail("V01-B: must explicitly declare synthetic injected_H04=ACTIVE")
            if rs.get("model_status") != "REJECTED" or br.get("model_status") != "REJECTED":
                fail("V01-B: active H04 MUST reject both strategy and bot risk gates")
            if not any("H04" in str(v).upper() for v in rs.get("hard_vetoes", [])):
                fail("V01-B: H04 must appear explicitly in hard_vetoes")
            if s.get("decision_status") != "NOT_RECOMMENDED" or b.get("readiness") != "NOT_RECOMMENDED":
                fail("V01-B: known H04 veto overrides missing P02/T02 and blocks new ADD")
            if b.get("order_amounts") or b.get("grid_steps"):
                fail("V01-B: no executable order amounts/grid under active H04")
    positive = cases.get("V01-A", {}).get("StrategyProposal", {}).get("posture") == "LONG" if isinstance(cases.get("V01-A"),dict) else False
    return errors, "POSITIVE_CONTRACT_PASS" if positive else "POSITIVE_BRANCH_NOT_EXERCISED"


def mock_response():
    # Test-only fixture of complete schema shapes, not a claim about model behavior.
    s = {"strategy_id":"s-A", "coin_profile_ref":"fixture-profile-A", "posture":"LONG",
         "strategy_type":"DCA","rationale":["Synthetic trend ONLY"],"alternatives":["WAIT"],
         "entry_conditions":["Requires future synthetic confirmation"],"invalidation_conditions":["Trend breaks"],
         "profitability_claim":"NONE", "risk_screen":{"hard_vetoes":[],"not_evaluable":["T02, actual account"],"model_status":"NOT_EVALUABLE"},
         "decision_status":"NEEDS_DATA","user_choice_required":True}
    b = {"config_id":"b-A", "platform":"VELES", "platform_variant":"CUSTOM (hypothetical)",
         "instrument":{"exchange":"BYBIT_LABEL_ONLY","symbol":"HYPEUSDT","market_type":"USDT_PERPETUAL","settle_coin":"USDT","identity_status":"UNVERIFIED"},
         "strategy_ref":"s-A", "form_evidence":{"P01_source":"docs/platforms/veles.md","P02_verified_at":None,"field_map_version":None},
         "input_budget":100,"leverage":3,"order_amounts":[],"grid_steps":[],"boundaries":{},
         "entry_rules":["Synthetic condition, not an order"],"exits":["No configured TP/SL"],
         "risk_checks":{"hard_checks":[],"missing":["P02","T02"],"not_evaluable":["IM, MMR, HWM and full bot loss"],"model_status":"NOT_EVALUABLE"},
         "currency_units":"100 USDT TEST_BUDGET, not account equity; example 3x margin 4+4+4 USDT = 36 USDT notional before costs",
         "assumptions":["SIMULATED_ONLY"],"mapping":[{"ui_label":"Режим торговли","form_key_if_verified":None,"value":None,"unit":None,
         "source_ref":"docs/platforms/veles.md","verified_status":"DOCUMENTED_ONLY"}],
         "readiness":"NEEDS_DATA","manual_steps":["No trades; obtain P02 and T02 in a separate pilot"],
         "forbidden_automated_execution":True}
    sb=copy.deepcopy(s);sb["strategy_id"]="s-B";sb["risk_screen"]["hard_vetoes"]=["H04_ACTIVE"]
    sb["risk_screen"]["model_status"]="REJECTED";sb["decision_status"]="NOT_RECOMMENDED"
    bb=copy.deepcopy(b);bb["config_id"]="b-B";bb["strategy_ref"]="s-B";bb["readiness"]="NOT_RECOMMENDED"
    bb["risk_checks"]["model_status"]="REJECTED";bb["order_amounts"]=[];bb["grid_steps"]=[]
    return {"run_id":"HYPE-V01-R02", "policy_sha":POLICY_SHA,"fixture_sha256":FIXTURE_SHA256,
            "synthetic_only":True,"cases":{"V01-A":{"StrategyProposal":s,"BotConfigurationProposal":b},
              "V01-B":{"injected_H04":"ACTIVE","StrategyProposal":sb,"BotConfigurationProposal":bb}}}


def run():
    p = argparse.ArgumentParser(description="Offline pinned-schema and H04 check for HYPE-V01-R02")
    p.add_argument("response", nargs="?", help="Exact JSON extracted unedited from original first model answer")
    p.add_argument("--schema-dir", type=Path, required=True, help="Local directory with two exact pinned v2 schema files")
    p.add_argument("--self-test", action="store_true", help="Run fixture tests of the validator itself, not the model")
    args = p.parse_args()
    strategy = read_schema(args.schema_dir/"strategy-proposal.schema.json", SCHEMA_BLOBS["strategy-proposal.schema.json"])
    bot = read_schema(args.schema_dir/"bot-configuration.schema.json", SCHEMA_BLOBS["bot-configuration.schema.json"])
    if args.self_test:
        good = mock_response()
        bad_enum = copy.deepcopy(good);bad_enum["cases"]["V01-A"]["StrategyProposal"]["posture"]="LONG_CANDIDATE"
        bad_ready = copy.deepcopy(good);bad_ready["cases"]["V01-A"]["BotConfigurationProposal"]["readiness"]="VERIFIED_FOR_MANUAL_REVIEW"
        bad_veto = copy.deepcopy(good);bad_veto["cases"]["V01-B"]["BotConfigurationProposal"]["readiness"]="NEEDS_DATA"
        bad_magic = copy.deepcopy(good);bad_magic["cases"]["V01-B"]["BotConfigurationProposal"]["order_amounts"]=[12,12,12]
        tests=[("valid",good,True),("bad_LONG_CANDIDATE",bad_enum,False),
               ("bad_fake_verified_P02",bad_ready,False),("bad_H04_ignored",bad_veto,False),
               ("bad_H04_order_amounts",bad_magic,False)]
        failed=[]
        for name,data,should_pass in tests:
            errors,_=check(data,strategy,bot)
            observed=not errors
            print(f"{name}: {'PASS' if observed == should_pass else 'FAIL'} (accepted={observed}, expected={should_pass})")
            if observed!=should_pass: failed.append(name)
        return 0 if not failed else 2
    if not args.response:
        p.error("response JSON path is required unless --self-test is used")
    response=json.loads(Path(args.response).read_text(encoding="utf-8-sig"))
    errors,status=check(response,strategy,bot)
    if errors:
        print("CONTRACT_FAIL",len(errors),"violation(s)")
        for x in errors: print(" -",x)
        return 1
    print("CONTRACT_SEMANTIC_PASS /",status,"/ SYNTHETIC_ONLY / NOT_REAL_TRADE_READY")
    return 0


if __name__=="__main__":
    try:sys.exit(run())
    except (OSError, ValueError, KeyError) as exc:
        print("VALIDATOR_ERROR:",str(exc),file=sys.stderr);sys.exit(2)
