// Crypto Trading Agent v2 — deterministic documentary handoff guard (inactive).
// This module does NOT retrieve live sources, calculate trading indicators,
// assess whole-account risk, choose market direction, or submit orders.
// It only refuses inconsistent/unsupported already-supplied structured handoffs.
export const SAME_INSTRUMENT_FIELDS=["exchange","symbol","market_type","settle_coin"];
export const HARD_VETO=["H04_ACTIVE","DAY_LOSS_LIMIT","HWM_DRAWDOWN_LIMIT","LEVERAGE_LIMIT","PORTFOLIO_IM_LIMIT","BOT_WORST_LOSS_LIMIT","POSITION_SLOT_LIMIT","GRID_RESERVE_DEFICIT","LIQUIDATION_DISTANCE_VIOLATION"];

const sameInstrument=(a,b)=>SAME_INSTRUMENT_FIELDS.every(k=>(a?.[k]??null)===(b?.[k]??null));
const validObserved=(e)=>e?.access_status==="OBSERVED"&&e?.quality!=="STALE"&&e?.quality!=="CONFLICTED"&&e?.quality!=="UNKNOWN";
const unique=(a)=>[...new Set(a)];
export function inspectHandoff({request_context, evidence_records=[],market_evidence,technical_evidence,coin_profile,strategy_proposal,bot_configuration=null}, options={}){
  const issues=[],gaps=[];
  const base=request_context?.instrument;
  if(!base?.symbol||!base?.exchange||!base?.market_type)issues.push("MARKET_IDENTITY_MISSING");
  for(const [name,b] of [["MARKET",market_evidence],["TECHNICAL",technical_evidence],["COIN",coin_profile],["BOT",bot_configuration]]){
    if(b&&!sameInstrument(base,b.instrument))issues.push(name+"_INSTRUMENT_MISMATCH");
  }
  for(const [name,b] of [["MARKET",market_evidence],["TECHNICAL",technical_evidence],["COIN",coin_profile]]){
    if(b?.request_id!==request_context?.request_id)issues.push(name+"_REQUEST_MISMATCH");
  }
  const ids=new Map();
  for(const e of evidence_records){if(!e?.evidence_id||ids.has(e.evidence_id))issues.push("DUPLICATE_OR_INVALID_EVIDENCE_ID");else ids.set(e.evidence_id,e);}
  const allRefs=[...(market_evidence?.evidence_ids??[]),...(coin_profile?.evidence_refs??[])];
  for(const id of allRefs)if(!ids.has(id))issues.push("MISSING_EVIDENCE_REFERENCE");
  for(const e of evidence_records){
    if((e?.access_status==="ACCESS_UNAVAILABLE"||e?.access_status==="NOT_CHECKED")&&e?.quality==="VERIFIED_SOURCE")issues.push("UNOBSERVED_VERIFIED_EVIDENCE");
    if(e?.source_kind==="COMPUTED"&&e?.depends_on?.some(id=>!ids.has(id)))issues.push("COMPUTED_DEPENDENCY_MISSING");
  }
  if(technical_evidence?.indicators?.some(i=>i.validation==="VERIFIED"&&(!i.source_ids?.length||i.value===null)))issues.push("INDICATOR_WITHOUT_DATA");
  const known=options.known_hard_vetoes??[];
  const veto=known.filter(code=>HARD_VETO.includes(code));
  if(known.some(code=>!HARD_VETO.includes(code)))issues.push("UNRECOGNIZED_HARD_VETO_CODE");
  const safeVeto=veto.length>0||strategy_proposal?.risk_screen?.model_status==="REJECTED"||(strategy_proposal?.risk_screen?.hard_vetoes??[]).length>0;
  if(market_evidence?.coverage!=="COMPLETE_FOR_SCOPE")gaps.push("MARKET_COVERAGE_INCOMPLETE");
  if(technical_evidence?.gaps?.length)gaps.push("TECHNICAL_GAPS");
  if([...ids.values()].some(e=>!validObserved(e)))gaps.push("UNVERIFIED_OR_UNAVAILABLE_EVIDENCE");
  if(!coin_profile||!strategy_proposal)issues.push("SYNTHESIS_MISSING");
  const noTrade=strategy_proposal?.posture==="WAIT"||["WAIT","NEEDS_DATA","NOT_RECOMMENDED"].includes(strategy_proposal?.decision_status);
  let recommendation= safeVeto?"NOT_RECOMMENDED":issues.length?"NEEDS_DATA":noTrade?"WAIT":strategy_proposal?.posture??"WAIT";
  if(safeVeto&&bot_configuration&&bot_configuration.readiness!=="NOT_RECOMMENDED")issues.push("HARD_VETO_WITH_BOT_PROPOSAL");
  if(noTrade&&bot_configuration?.mapping?.length)issues.push("EXECUTABLE_FIELD_MAP_ON_WAIT");
  if(bot_configuration){
    if(request_context?.preferred_platform==="UNSELECTED")issues.push("PLATFORM_NOT_SELECTED");
    if(request_context?.preferred_platform!=="UNSELECTED"&&bot_configuration.platform!==request_context?.preferred_platform)issues.push("PLATFORM_MISMATCH");
    if(bot_configuration.strategy_ref!==strategy_proposal?.strategy_id)issues.push("STRATEGY_REFERENCE_MISMATCH");
    if(bot_configuration.forbidden_automated_execution!==true)issues.push("AUTO_EXECUTION_PROHIBITED");
    if(bot_configuration.readiness==="VERIFIED_FOR_MANUAL_REVIEW"){
      if(!bot_configuration.form_evidence?.P01_source||!bot_configuration.form_evidence?.P02_verified_at)issues.push("P02_NOT_VERIFIED");
      if(bot_configuration.risk_checks?.model_status!=="PASS"||bot_configuration.risk_checks?.missing?.length||bot_configuration.risk_checks?.not_evaluable?.length)issues.push("RISK_UNVERIFIED");
      if(!bot_configuration.mapping?.length||bot_configuration.mapping.some(f=>f.verified_status!=="VERIFIED"||!f.source_ref))issues.push("UI_FIELDS_UNVERIFIED");
      if(safeVeto||noTrade||issues.length||gaps.length)issues.push("UNSUPPORTED_READY");
    }
  }
  return {issues:unique(issues),gaps:unique(gaps),known_hard_vetoes:unique(veto),recommendation,can_publish_verified_manual_config:!!bot_configuration&&bot_configuration.readiness==="VERIFIED_FOR_MANUAL_REVIEW"&&!issues.length&&!gaps.length&&!safeVeto&&!noTrade,execution_authorized:false};
}
