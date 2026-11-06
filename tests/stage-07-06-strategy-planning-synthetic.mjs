// Stage 07.6 Strategy Planning synthetic tests. No live Bybit, order placement or ChatGPT Skill auto-discovery.
// Node >=18: node tests/stage-07-06-strategy-planning-synthetic.mjs
import { readFileSync, existsSync } from "node:fs";
const skillText=readFileSync(new URL("../.agents/skills/strategy-planning/SKILL.md",import.meta.url),"utf8");
const skillUrl=new URL("../.agents/skills/strategy-planning/SKILL.md",import.meta.url);
const tests=[];
function t(label,got,expected){tests.push({id:"SP"+String(tests.length+1).padStart(2,"0"),label,got,expected,pass:Object.is(got,expected)});}
const actionLabels=["NEW_LONG","NEW_SHORT","ADD","HOLD","WAIT","REDUCE","CLOSE","RECOVER"];
const riskExpanding=new Set(["NEW_LONG","NEW_SHORT","ADD"]);
function isExpanding(action,{recoveryAdds=false,reductionOpens=false}={}){
 if(riskExpanding.has(action))return true;
 if(action==="RECOVER")return recoveryAdds;
 if((action==="REDUCE"||action==="CLOSE")&&reductionOpens)return null;
 return false;
}
function optionGate(action,{hasPosition=false,hard=false,critical=false,missing=false,recoveryAdds=false,reductionOpens=false}={}){
 if(!actionLabels.includes(action))return "UNSUPPORTED_ACTION";
 if((action==="ADD"||action==="HOLD"||action==="REDUCE"||action==="CLOSE"||action==="RECOVER")&&!hasPosition)return "NO_POSITION_OR_LINKED_SERIES";
 const expanding=isExpanding(action,{recoveryAdds,reductionOpens});
 if(expanding===null)return "REDUCTION_NOT_PROVEN";
 if(expanding&&hard)return "REJECTED";
 if(expanding&&critical)return "UNVERIFIED";
 if(expanding&&missing)return "NEEDS_DATA";
 if(expanding)return "CONDITIONAL_R2_NOT_READY";
 if(action==="WAIT"&&hasPosition)return "WAIT_EXISTING_EXPOSURE_NOT_SAFE_DEFAULT";
 if(action==="REDUCE"||action==="CLOSE")return "DISCUSS_MANUAL_RISK_REDUCTION_NOT_ORDER";
 if(action==="RECOVER")return "RECOVERY_NO_NEW_RISK_STILL_CONDITIONAL";
 if(action==="HOLD")return "HOLD_NOT_AN_APPROVAL";
 return "WAIT_NO_NEW_RISK";
}
function strategyTransition({choice=null,platform=null,p02=false,verified=false,planAccepted=false}={}){
 // A general analysis-acceptance isn't a trade authorization.
 if(!choice||!actionLabels.includes(choice)||!planAccepted)return "USER_SELECTION_PENDING";
 if(["WAIT","HOLD","REDUCE","CLOSE"].includes(choice))return "NO_AUTOMATIC_BOT";
 if(!platform)return "PLATFORM_SELECTION_PENDING";
 if(!["Veles","GinArea"].includes(platform))return "PLATFORM_UNKNOWN";
 if(!p02)return "P02_REQUIRED";
 if(!verified)return "FRESH_RISK_RECHECK_REQUIRED";
 return platform==="Veles"?"REQUEST_VELES_CONFIG_NOT_READY":"REQUEST_GINAREA_CONFIG_NOT_READY";
}
function seriesNet({realized,unrealized,fees=0,funding=0,feesIncluded=false,fundingIncluded=false}={}){
 if([realized,unrealized,fees,funding].some(v=>!Number.isFinite(v)))return null;
 return realized+unrealized+(feesIncluded?0:fees)+(fundingIncluded?0:funding);
}
function targetRecovery(netNow,futureFeeOutflow=0,futureFundingOutflow=0){
 if([netNow,futureFeeOutflow,futureFundingOutflow].some(v=>!Number.isFinite(v)))return null;
 if(futureFeeOutflow<0||futureFundingOutflow<0)return null;
 return Math.max(0,-netNow)+futureFeeOutflow+futureFundingOutflow;
}
function recoveryStatement({h01=false,owner=false,netNow=null,fullFees=false,fullFunding=false}={}){
 if(!h01||!owner)return "H01_OR_OWNER_UNVERIFIED";
 if(!Number.isFinite(netNow)||!fullFees||!fullFunding)return "NET_UNKNOWN";
 return netNow>=0?"NET_NONNEGATIVE_HISTORY_SCOPE_ONLY":"SERIES_STILL_LOSS";
}
function userSelection({strategyChoice=false,platformChoice=false,liveConfirm=false}={}){
 return !strategyChoice?"STRATEGY_NOT_SELECTED":!platformChoice?"PLATFORM_NOT_SELECTED":!liveConfirm?"NOT_AUTHORIZED_TO_TRADE":"EXPLICIT_USER_INTENT_NOT_LIVE_ENGINE";
}
function mapOrder({side,positionSide,positionMode,reduceOnly=false}={}){
 if(reduceOnly)return "OUT_CANNOT_OPEN";
 if(positionMode==="OneWay"&&positionSide==="Sell"&&side==="Buy")return "MAY_REDUCE_OR_REVERSE_SHORT";
 if(positionMode==="Hedge"&&side==="Buy"&&positionSide==="Buy")return "HEDGE_LONG_SLOT";
 return "INTENT_UNVERIFIED";
}
function scoreOption({timeframeChecked=false,priceVerified=false,closedBars=false,marketConflict=false,exactLevel=false}={}){
 if(marketConflict)return "UNVERIFIED_MARKET";
 if(exactLevel&&(!timeframeChecked||!priceVerified||!closedBars))return "NUMERIC_LEVELS_FORBIDDEN";
 if(!timeframeChecked||!priceVerified||!closedBars)return "QUALITATIVE_R2_ONLY";
 return "MARKET_EVIDENCE_NOT_RISK_READY";
}
function evidenceFreshness({r3=false,t02Minutes=null,markMinutes=null,changed=false,p02=false}={}){
 if(!r3)return "R2_CONDITIONAL_ONLY";
 if(changed)return "EVENT_INVALIDATED";
 if(t02Minutes===null||markMinutes===null||!p02)return "NEEDS_DATA";
 if(t02Minutes<0||t02Minutes>5||markMinutes<0||markMinutes>2)return "STALE";
 return "FRESHNESS_ONLY_NOT_READY";
}
function fullRiskState({hard=false,modelConflict=false,mandatoryMissing=false,h04=false,hasHistory=false}={}){
 if(hard||h04)return "REJECTED";
 if(modelConflict)return "UNVERIFIED";
 if(mandatoryMissing)return "NEEDS_DATA";
 return hasHistory?"RISK_EVIDENCE_ONLY_NOT_READY":"H02_H03_NOT_CHECKED_NOT_READY";
}
function hasFourStressFamilies({F=false,A=false,H=false,R=false,realMark=false}={}){return F&&A&&H&&R&&realMark?"STRESS_FAMILY_FLAGS_ONLY_NOT_READY":"FR038_NOT_PROVED";}
function compareReasons(options){return options.map(x=>x.action+":"+x.status).join(" | ");}
function exactMarket(obs,need){return ["exchange","symbol","category","settleCoin"].every(k=>obs?.[k]===need?.[k]&&!!obs?.[k]);}
const money={realized:-15,unrealized:10,fees:-1,funding:-2},baseline={exchange:"Bybit",symbol:"SOLUSDT",category:"linear",settleCoin:"USDT"};
t("frontmatter actual",/^---\nname: strategy-planning\ndescription: [^\n]+\n---\n/.test(skillText),true);
t("description within 1024",skillText.split("\n")[2].length-13<=1024,true);
t("When use present",skillText.includes("## When to use"),true);
t("When not use present",skillText.includes("## When not to use"),true);
t("FR-041–FR-046",Array.from({length:6},(_,i)=>"FR-0"+(41+i)).every(x=>skillText.includes(x)),true);
t("all seven action concepts",["NEW","ADD","HOLD","WAIT","REDUCE","CLOSE","RECOVER"].every(x=>skillText.includes(x)),true);
t("real P02 excluded",skillText.includes("Never fill out a concrete Veles/GinArea form"),true);
t("user choice is separate",skillText.includes("Explicit user decision required"),true);
t("H01 net restoration documented",skillText.includes("H01")&&skillText.includes("−8 USDT"),true);
t("no real READY",skillText.includes("This Skill cannot grant READY"),true);
t("NEW Long adds risk",isExpanding("NEW_LONG"),true);
t("NEW Short adds risk",isExpanding("NEW_SHORT"),true);
t("ADD adds risk",isExpanding("ADD"),true);
t("WAIT no new risk",isExpanding("WAIT"),false);
t("HOLD no incremental risk by action",isExpanding("HOLD"),false);
t("risk-free recovery scenario not automatically an ADD",isExpanding("RECOVER",{recoveryAdds:false}),false);
t("recovery ADD requires risk gate",isExpanding("RECOVER",{recoveryAdds:true}),true);
t("REDUCE that may open opposite risk unknown",isExpanding("REDUCE",{reductionOpens:true}),null);
t("NEW confirmed H04 hard block",optionGate("NEW_LONG",{hard:true}),"REJECTED");
t("ADD confirmed daily block",optionGate("ADD",{hasPosition:true,hard:true}),"REJECTED");
t("RECOVER with increased IN and block",optionGate("RECOVER",{hasPosition:true,recoveryAdds:true,hard:true}),"REJECTED");
t("NEW Cross unknown model",optionGate("NEW_SHORT",{critical:true}),"UNVERIFIED");
t("NEW no mandatory T02",optionGate("NEW_LONG",{missing:true}),"NEEDS_DATA");
t("NEW clean R2 still not ready",optionGate("NEW_LONG"),"CONDITIONAL_R2_NOT_READY");
t("ADD no existing position invalid",optionGate("ADD"),"NO_POSITION_OR_LINKED_SERIES");
t("HOLD no current position invalid",optionGate("HOLD"),"NO_POSITION_OR_LINKED_SERIES");
t("REDUCE no current position invalid",optionGate("REDUCE"),"NO_POSITION_OR_LINKED_SERIES");
t("CLOSE no current position invalid",optionGate("CLOSE"),"NO_POSITION_OR_LINKED_SERIES");
t("HOLD current is not risk safe",optionGate("HOLD",{hasPosition:true}),"HOLD_NOT_AN_APPROVAL");
t("WAIT with position must mention live exposure",optionGate("WAIT",{hasPosition:true}),"WAIT_EXISTING_EXPOSURE_NOT_SAFE_DEFAULT");
t("WAIT no position",optionGate("WAIT"),"WAIT_NO_NEW_RISK");
t("REDUCE under hard block discuss separately",optionGate("REDUCE",{hasPosition:true,hard:true}),"DISCUSS_MANUAL_RISK_REDUCTION_NOT_ORDER");
t("CLOSE under hard block discuss separately",optionGate("CLOSE",{hasPosition:true,hard:true}),"DISCUSS_MANUAL_RISK_REDUCTION_NOT_ORDER");
t("reduce unknown reverse can open slot",optionGate("REDUCE",{hasPosition:true,reductionOpens:true}),"REDUCTION_NOT_PROVEN");
t("RECOVER without adding risk still conditional",optionGate("RECOVER",{hasPosition:true}),"RECOVERY_NO_NEW_RISK_STILL_CONDITIONAL");
t("RECOVER unknown risk model no new risk remains conditional",optionGate("RECOVER",{hasPosition:true,critical:true}),"RECOVERY_NO_NEW_RISK_STILL_CONDITIONAL");
t("unsupported action",optionGate("ALL_IN"),"UNSUPPORTED_ACTION");
t("no choice -> no auto config",strategyTransition(),"USER_SELECTION_PENDING");
t("accepted document not a choice",strategyTransition({planAccepted:true}),"USER_SELECTION_PENDING");
t("chosen strategy without accepted intent",strategyTransition({choice:"NEW_SHORT"}),"USER_SELECTION_PENDING");
t("chosen WAIT no bot config",strategyTransition({choice:"WAIT",planAccepted:true}),"NO_AUTOMATIC_BOT");
t("chosen REDUCE no bot config",strategyTransition({choice:"REDUCE",planAccepted:true}),"NO_AUTOMATIC_BOT");
t("chosen NEW but no platform",strategyTransition({choice:"NEW_LONG",planAccepted:true}),"PLATFORM_SELECTION_PENDING");
t("chosen RECOVER but no platform",strategyTransition({choice:"RECOVER",planAccepted:true}),"PLATFORM_SELECTION_PENDING");
t("unsupported bot platform rejected",strategyTransition({choice:"NEW_SHORT",platform:"UNKNOWN",planAccepted:true}),"PLATFORM_UNKNOWN");
t("Veles chosen P02 not confirmed",strategyTransition({choice:"NEW_SHORT",platform:"Veles",planAccepted:true}),"P02_REQUIRED");
t("GinArea chosen P02 not confirmed",strategyTransition({choice:"ADD",platform:"GinArea",planAccepted:true}),"P02_REQUIRED");
t("chosen platform form without fresh risk",strategyTransition({choice:"ADD",platform:"GinArea",p02:true,planAccepted:true}),"FRESH_RISK_RECHECK_REQUIRED");
t("Veles branch permitted only as request, not READY",strategyTransition({choice:"NEW_SHORT",platform:"Veles",p02:true,verified:true,planAccepted:true}),"REQUEST_VELES_CONFIG_NOT_READY");
t("GinArea branch permitted only as request, not READY",strategyTransition({choice:"NEW_LONG",platform:"GinArea",p02:true,verified:true,planAccepted:true}),"REQUEST_GINAREA_CONFIG_NOT_READY");
t("series net loss -8",seriesNet(money),-8);
t("series profitable current leg still loss",seriesNet({realized:-15,unrealized:12,fees:-1,funding:-2}),-6);
t("series net fee already included",seriesNet({realized:-16,unrealized:10,fees:-1,funding:-2,feesIncluded:true}),-8);
t("series net both costs included",seriesNet({realized:-18,unrealized:10,fees:-1,funding:-2,feesIncluded:true,fundingIncluded:true}),-8);
t("series no funding source cannot infer profit",seriesNet({...money,funding:NaN}),null);
t("series missing realized",seriesNet({...money,realized:null}),null);
t("recovery requires +8 net improvement no future costs",targetRecovery(-8),8);
t("recovery +8 net with 2 future fee cost ->+10 price PnL",targetRecovery(-8,2),10);
t("already recovered no further fee ->0",targetRecovery(1),0);
t("already positive with cost3 requires only future cost",targetRecovery(1,3),3);
t("cost unknown",targetRecovery(-8,NaN),null);
t("no H01 cannot declare recovered",recoveryStatement({owner:true,netNow:8,fullFees:true,fullFunding:true}),"H01_OR_OWNER_UNVERIFIED");
t("unknown bot owner cannot declare recovered",recoveryStatement({h01:true,netNow:8,fullFees:true,fullFunding:true}),"H01_OR_OWNER_UNVERIFIED");
t("H01 with incomplete fee evidence",recoveryStatement({h01:true,owner:true,netNow:-8,fullFunding:true}),"NET_UNKNOWN");
t("H01 full negative result",recoveryStatement({h01:true,owner:true,netNow:-8,fullFees:true,fullFunding:true}),"SERIES_STILL_LOSS");
t("H01 net nonnegative only history scope",recoveryStatement({h01:true,owner:true,netNow:0,fullFees:true,fullFunding:true}),"NET_NONNEGATIVE_HISTORY_SCOPE_ONLY");
t("manual bot decision needs user strategy choice",userSelection(),"STRATEGY_NOT_SELECTED");
t("strategy chosen platform not chosen",userSelection({strategyChoice:true}),"PLATFORM_NOT_SELECTED");
t("strategy+platform do not authorize live trade",userSelection({strategyChoice:true,platformChoice:true}),"NOT_AUTHORIZED_TO_TRADE");
t("explicit live intent not proof of exchange engine",userSelection({strategyChoice:true,platformChoice:true,liveConfirm:true}),"EXPLICIT_USER_INTENT_NOT_LIVE_ENGINE");
t("OneWay Buy can reduce/reverse existing Short",mapOrder({side:"Buy",positionSide:"Sell",positionMode:"OneWay"}),"MAY_REDUCE_OR_REVERSE_SHORT");
t("reduceOnly cannot open new exposure",mapOrder({side:"Buy",positionSide:"Sell",positionMode:"OneWay",reduceOnly:true}),"OUT_CANNOT_OPEN");
t("Hedge Buy has separate Long slot",mapOrder({side:"Buy",positionSide:"Buy",positionMode:"Hedge"}),"HEDGE_LONG_SLOT");
t("unknown mode cannot be inferred from Buy",mapOrder({side:"Buy"}),"INTENT_UNVERIFIED");
t("missing OHLCV no exact R2 level",scoreOption({timeframeChecked:true,priceVerified:true,exactLevel:true}),"NUMERIC_LEVELS_FORBIDDEN");
t("source conflict blocks technical reasoning",scoreOption({marketConflict:true,priceVerified:true}),"UNVERIFIED_MARKET");
t("no latest price only qualitative",scoreOption({timeframeChecked:true,closedBars:true}),"QUALITATIVE_R2_ONLY");
t("market verified still not risk READY",scoreOption({timeframeChecked:true,priceVerified:true,closedBars:true}),"MARKET_EVIDENCE_NOT_RISK_READY");
t("R2 can compare without complete T02 for pure market scenario",evidenceFreshness(),"R2_CONDITIONAL_ONLY");
t("R3 requires P02",evidenceFreshness({r3:true,t02Minutes:1,markMinutes:1}),"NEEDS_DATA");
t("R3 old T02 stale",evidenceFreshness({r3:true,t02Minutes:6,markMinutes:1,p02:true}),"STALE");
t("R3 Mark 3min stale",evidenceFreshness({r3:true,t02Minutes:1,markMinutes:3,p02:true}),"STALE");
t("R3 event invalidates fresh T02",evidenceFreshness({r3:true,t02Minutes:1,markMinutes:1,p02:true,changed:true}),"EVENT_INVALIDATED");
t("freshness alone not readiness",evidenceFreshness({r3:true,t02Minutes:1,markMinutes:1,p02:true}),"FRESHNESS_ONLY_NOT_READY");
t("H04 overrides missing history",fullRiskState({h04:true,mandatoryMissing:true}),"REJECTED");
t("hard violation overrides model unknown",fullRiskState({hard:true,modelConflict:true}),"REJECTED");
t("Cross conflict overrides missing T02",fullRiskState({modelConflict:true,mandatoryMissing:true}),"UNVERIFIED");
t("missing mandatory current data",fullRiskState({mandatoryMissing:true}),"NEEDS_DATA");
t("H02/H03 missing alone not hard block",fullRiskState(),"H02_H03_NOT_CHECKED_NOT_READY");
t("history supplied still not READY",fullRiskState({hasHistory:true}),"RISK_EVIDENCE_ONLY_NOT_READY");
t("fake 4 synthetic paths not historical Mark",hasFourStressFamilies({F:true,A:true,H:true,R:true}),"FR038_NOT_PROVED");
t("all stress flags with real Mark still not READY",hasFourStressFamilies({F:true,A:true,H:true,R:true,realMark:true}),"STRESS_FAMILY_FLAGS_ONLY_NOT_READY");
t("Bybit USDT perp exact match",exactMarket(baseline,baseline),true);
t("Binance spot rejected as exact perp",exactMarket({...baseline,exchange:"Binance",category:"spot"},baseline),false);
t("Bybit USDC differs from USDT",exactMarket({...baseline,settleCoin:"USDC"},baseline),false);
t("option comparison preserve reasons",compareReasons([{action:"WAIT",status:"SAFE_FOR_NO_NEW_RISK"},{action:"ADD",status:"REJECTED"}]),"WAIT:SAFE_FOR_NO_NEW_RISK | ADD:REJECTED");
const links=[...skillText.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/.test(x));
t("four sibling Skills linked",["data-verification","market-analysis","portfolio-analysis","risk-assessment"].every(x=>links.includes("../"+x+"/SKILL.md")),true);
t("at least fourteen internal links",links.length>=14,true);
t("all relative links exist locally",links.every(x=>existsSync(new URL(x,skillUrl))),true);
const failed=tests.filter(x=>!x.pass);
for(const f of failed)console.error("FAIL",f.id,f.label,JSON.stringify({got:f.got,expected:f.expected}));
console.log(JSON.stringify({kind:"LOCAL_SYNTHETIC_STRATEGY_PLANNING",total:tests.length,passed:tests.length-failed.length,failed:failed.length,realBybit:false,realChatGptSkillRuntime:false,realTradingReady:false}));
if(failed.length)process.exitCode=1;
