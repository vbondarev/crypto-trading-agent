// Run on real repository checkout: node tests/v2/workflow-smoke.mjs
// Synthetic / no live source or API access / no trading action.
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {inspectHandoff} from "../../docs/v2/workflow-guard.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const baseline=read("tests/v2/fixtures/incomplete-hype.v1.json");
const copy=()=>structuredClone(baseline);
let cases=0;
const run=(label,doc,options,expected)=>{
  const result=inspectHandoff(doc,options);
  for(const issue of expected.issues??[])assert(result.issues.includes(issue),`${label} missing ${issue}`);
  for(const gap of expected.gaps??[])assert(result.gaps.includes(gap),`${label} missing gap ${gap}`);
  if(expected.recommendation)assert.equal(result.recommendation,expected.recommendation,label);
  assert.equal(result.can_publish_verified_manual_config,false,label+" should never claim verified ready");
  assert.equal(result.execution_authorized,false,label+" must never authorize execution");
  cases++;
};
run("missing research and OHLCV",copy(),{}, {recommendation:"WAIT",gaps:["MARKET_COVERAGE_INCOMPLETE","TECHNICAL_GAPS","UNVERIFIED_OR_UNAVAILABLE_EVIDENCE"]});
let x=copy();x.market_evidence.instrument.symbol="DOGEUSDT";run("instrument mismatch",x,{}, {issues:["MARKET_INSTRUMENT_MISMATCH"],recommendation:"NEEDS_DATA"});
x=copy();x.market_evidence.request_id="WRONG";run("request mismatch",x,{}, {issues:["MARKET_REQUEST_MISMATCH"]});
x=copy();x.coin_profile.evidence_refs=["E-404"];run("missing reference",x,{}, {issues:["MISSING_EVIDENCE_REFERENCE"]});
x=copy();x.evidence_records[0].quality="VERIFIED_SOURCE";run("false source verification",x,{}, {issues:["UNOBSERVED_VERIFIED_EVIDENCE"]});
x=copy();x.technical_evidence.indicators[0].validation="VERIFIED";run("indicator without source",x,{}, {issues:["INDICATOR_WITHOUT_DATA"]});
x=copy();x.bot_configuration.readiness="VERIFIED_FOR_MANUAL_REVIEW";run("unverified final form and risk",x,{}, {issues:["P02_NOT_VERIFIED","RISK_UNVERIFIED","UI_FIELDS_UNVERIFIED","UNSUPPORTED_READY"]});
x=copy();x.request_context.preferred_platform="UNSELECTED";run("platform missing",x,{}, {issues:["PLATFORM_NOT_SELECTED"]});
x=copy();x.request_context.preferred_platform="GINAREA";run("wrong platform",x,{}, {issues:["PLATFORM_MISMATCH"]});
x=copy();x.strategy_proposal.risk_screen.hard_vetoes=["H04 ACTIVE"];run("active H04 veto",x,{}, {recommendation:"NOT_RECOMMENDED",issues:["HARD_VETO_WITH_BOT_PROPOSAL"]});
x=copy();x.bot_configuration.readiness="NOT_RECOMMENDED";run("valid explicit H04 rejection",x,{known_hard_vetoes:["H04_ACTIVE"]},{recommendation:"NOT_RECOMMENDED"});
x=copy();x.bot_configuration.mapping=[{ui_label:"Unproven order size",value:100,verified_status:"UNVERIFIED"}];run("WAIT may not generate field map",x,{}, {issues:["EXECUTABLE_FIELD_MAP_ON_WAIT"]});
x=copy();x.evidence_records.push(structuredClone(x.evidence_records[0]));run("duplicate evidence ids",x,{}, {issues:["DUPLICATE_OR_INVALID_EVIDENCE_ID"]});
x=copy();x.evidence_records.push({...x.evidence_records[0],evidence_id:"E-002",source_kind:"COMPUTED",depends_on:["E-404"]});run("broken computed lineage",x,{}, {issues:["COMPUTED_DEPENDENCY_MISSING"]});
const conditional=read("tests/v2/fixtures/conditional-long-draft.v1.json");
run("conditional LONG remains DRAFT with incomplete independently verified evidence",conditional,{}, {recommendation:"LONG",gaps:["MARKET_COVERAGE_INCOMPLETE","TECHNICAL_GAPS","UNVERIFIED_OR_UNAVAILABLE_EVIDENCE"]});
assert.equal(conditional.bot_configuration.readiness,"DRAFT");
assert.equal(conditional.bot_configuration.mapping.length,0);
assert.equal(cases,15);
console.log(`PASS ${cases} synthetic handoff / refusal cases; source acquisition, live risk and runtime LLM NOT TESTED`);
