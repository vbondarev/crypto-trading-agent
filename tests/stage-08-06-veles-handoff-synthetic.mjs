// Stage 08.6: deterministic/documentary tests, Node >=18.
// node tests/stage-08-06-veles-handoff-synthetic.mjs
// No live Bybit, Veles controls, real P02, trading orders, ChatGPT runtime or READY.
import {readFileSync,existsSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const doc=read("docs/prompts/veles-configuration.md");
const plan=read("docs/stage-08-plan.md");
const skill=read(".agents/skills/veles-configuration/SKILL.md");
const veles=read("docs/platforms/veles.md");
const p02doc=read("docs/platforms/platform-validation.md");
const config=read("docs/platforms/configuration-contract.md");
const risk=read("docs/prompts/risk-strategy-decision.md");
const conversation=read("docs/workflows/interaction-contract.md");
const tick=String.fromCharCode(96),tests=[];
function t(name,actual,expected){tests.push({name,actual,expected,pass:Object.is(actual,expected)});}
const contains=(body,parts)=>parts.every(x=>body.includes(x));
function route({platform=null,mode=null,p02=false,action="draft",market=true}={}){
 if(platform!=="Veles")return {state:"CHOOSE",result:"NO_VELES",exact:false};
 if(!["SIMPLE","CUSTOM","SIGNAL"].includes(mode))return {state:"ASK",result:"MISSING_STRATEGY",exact:false};
 if(!market)return {state:"ASK",result:"MARKET_UNVERIFIED",exact:false};
 if(action==="final"&&!p02)return {state:"ASK",result:"NEEDS_DATA",exact:false};
 return {state:"ANALYZE",result:action==="final"?"R3_EVIDENCE_CHECK":"R2_DOCUMENTARY",exact:action==="final"&&p02};
}
function screen({actual=false,rightVersion=false,visible=false,units=false}={}){
 return actual&&rightVersion&&visible&&units?"P02_SCOPED":"P02_UNVERIFIED";
}
function planned({deposit,leverage}={}){return Number.isFinite(deposit)&&deposit>0&&Number.isFinite(leverage)&&leverage>0?deposit*leverage:null;}
function futureOrders({created,waiting,partialPlacement=false}={}){
 if(![created,waiting].every(x=>Number.isInteger(x)&&x>=0))return null;
 return {reachable:created+waiting,placedOnly:created,partial:partialPlacement};
}
function custom({pct,base}={}){return Number.isFinite(pct)&&Number.isFinite(base)&&base>0?base*pct/100:null;}
function sl({regular=false,signal=false,lastFilled=false,signalBasis=null,bybitOrder=false}={}){
 if(bybitOrder)return "EXCHANGE_EVIDENCE_REQUIRED";
 if(signal&&signalBasis==="average")return "POTENTIALLY_EARLIER_UNVERIFIED";
 if(regular&&!lastFilled)return "NOT_PROVEN_ON_EXCHANGE";
 if(regular&&lastFilled)return "EXPECTED_ORDER_CHECK_BYBIT";
 return "NOT_VERIFIED";
}
function adopt({currentSlots=1,positionMinusOne=false,ownerKnown=true}={}){
 return ownerKnown?currentSlots:"UNVERIFIED_OWNER";
}
function futureFill({qty,cumExecQty,leavesQty}={}){
 if(![qty,cumExecQty,leavesQty].every(Number.isFinite)||qty<0||cumExecQty<0||leavesQty<0||Math.abs(qty-cumExecQty-leavesQty)>1e-8)return null;
 return leavesQty;
}
function lifecycle(action){
 const m={stop:"WAIT_POSSIBLE",cancel:"BOT_CANCEL_NOT_EXCHANGE_CLOSE",marketClose:"INTENT_VERIFY_FILLED",restart:"RECHECK_FULL_S0_S3",editNext:"NOT_CURRENT_DEAL"};
 return m[action]||"UNKNOWN";
}
function riskGate({h04=false,lev=3,slots=1,im=20,reserve=true,lossBound=true,liqProof=true,crossProof=true,realH=true,p02=true,t02=true,mark=true,changed=false}={}){
 if(h04||lev>5||slots>3||im>30||reserve===false)return "REJECTED";
 if(changed)return "RECHECK";
 if(!crossProof||!lossBound||!liqProof||!realH)return "UNVERIFIED";
 if(!p02||!t02||!mark)return "NEEDS_DATA";
 return "SYNTHETIC_ONLY_NO_READY";
}
function row(body,id){return body.split("\n").find(x=>x.startsWith("| "+id+" |"))||"";}
function pinned(body,id,terms){return !!row(body,id)&&terms.every(x=>row(body,id).includes(x));}
// VH01–VH40: one synthetic assertion per normative scenario, never 40 LLM runs.
t("VH01 platform missing",route({}).state,"CHOOSE");
t("VH02 GinArea cannot route to Veles",route({platform:"GinArea",mode:"SIMPLE"}).result,"NO_VELES");
t("VH03 strategy missing",route({platform:"Veles"}).result,"MISSING_STRATEGY");
t("VH04 side differs from mode",pinned(doc,"VH04",["Long/Short","Режим торговли"]),true);
t("VH05 Bybit listing not Veles selector",pinned(doc,"VH05",["NOT_VERIFIED"]),true);
t("VH06 P01 only cannot exact R3",route({platform:"Veles",mode:"SIMPLE",action:"final"}).exact,false);
t("VH07 P02 wrong scope",screen({actual:true,rightVersion:false,visible:true,units:true}),"P02_UNVERIFIED");
t("VH08 never need secret",pinned(doc,"VH08",["не публиковать ключ"]),true);
t("VH09 planned notional synthetic",planned({deposit:50,leverage:3}),150);
t("VH10 martingale not GinArea multiplier",pinned(doc,"VH10",["Не считать равными"]),true);
t("VH11 full 3+7 grid",futureOrders({created:3,waiting:7,partialPlacement:true}).reachable,10);
t("VH12 partial placement still reserves",contains(doc,["100% future reserve","Частичное выставление"]),true);
t("VH13 custom percent unknown base",custom({pct:30}),null);
t("VH14 signal 2% no fill price",pinned(doc,"VH14",["Нет гарантированной"]),true);
t("VH15 missing P02 indicator",pinned(doc,"VH15",["Не выдумывать"]),true);
t("VH16 Bybit qty/tick filter",pinned(doc,"VH16",["NEEDS_DATA/UNVERIFIED"]),true);
t("VH17 TP% not net PnL",pinned(doc,"VH17",["Не обещать"]),true);
t("VH18 changed average recheck TP order IDs",pinned(doc,"VH18",["orderId"]),true);
t("VH19 BE can have negative net",pinned(doc,"VH19",["отрицательный net"]),true);
t("VH20 SL before final grid",sl({regular:true,lastFilled:false}),"NOT_PROVEN_ON_EXCHANGE");
t("VH21 SL after final fill still verify",sl({regular:true,lastFilled:true}),"EXPECTED_ORDER_CHECK_BYBIT");
t("VH22 signal SL different",sl({signal:true,signalBasis:"average"}),"POTENTIALLY_EARLIER_UNVERIFIED");
t("VH23 Short stop not strict upper loss",riskGate({lossBound:false}),"UNVERIFIED");
t("VH24 Cross liq price not account safety",riskGate({crossProof:false}),"UNVERIFIED");
t("VH25 Bybit TP trailing unverified",pinned(doc,"VH25",["NOT_VERIFIED"]),true);
t("VH26 position minus one no new slot",adopt({currentSlots:1,positionMinusOne:true}),1);
t("VH27 two bots do not create two slots",pinned(doc,"VH27",["Не два"]),true);
t("VH28 partially filled future remainder",futureFill({qty:10,cumExecQty:4,leavesQty:6}),6);
t("VH29 cancel does not close Bybit",lifecycle("cancel"),"BOT_CANCEL_NOT_EXCHANGE_CLOSE");
t("VH30 stop may wait",lifecycle("stop"),"WAIT_POSSIBLE");
t("VH31 close button not filled",lifecycle("marketClose"),"INTENT_VERIFY_FILLED");
t("VH32 restart recheck all risks",lifecycle("restart"),"RECHECK_FULL_S0_S3");
t("VH33 edit next bot not current deal",lifecycle("editNext"),"NOT_CURRENT_DEAL");
t("VH34 historic H01 cannot be ignored",pinned(doc,"VH34",["RECOVERED"]),true);
t("VH35 lack full reserve can't approve",riskGate({reserve:false}),"REJECTED");
t("VH36 leverage 8 rejected",riskGate({lev:8}),"REJECTED");
t("VH37 known H04 blocks new risk",riskGate({h04:true}),"REJECTED");
t("VH38 changed fill invalidates result",riskGate({changed:true}),"RECHECK");
t("VH39 synthetic history not real H",riskGate({realH:false}),"UNVERIFIED");
t("VH40 project acceptance not trade",pinned(doc,"VH40",["Не считать","08.7"]),true);
// Fixture-specific edge cases.
t("R2 without actual P02 still draft",route({platform:"Veles",mode:"SIMPLE"}).result,"R2_DOCUMENTARY");
t("R3 with actual P02 still only evidence check",route({platform:"Veles",mode:"CUSTOM",p02:true,action:"final"}).result,"R3_EVIDENCE_CHECK");
t("SIGNAL separately selectable",route({platform:"Veles",mode:"SIGNAL"}).result,"R2_DOCUMENTARY");
t("unsupported strategy not silently defaulted",route({platform:"Veles",mode:"DEFAULT"}).result,"MISSING_STRATEGY");
t("market unverified not selectable",route({platform:"Veles",mode:"SIGNAL",market:false}).result,"MARKET_UNVERIFIED");
t("P02 only scoped when all dimensions present",screen({actual:true,rightVersion:true,visible:true,units:true}),"P02_SCOPED");
t("hidden field not confirmed",screen({actual:true,rightVersion:true,visible:false,units:true}),"P02_UNVERIFIED");
t("unknown P02 units not confirmed",screen({actual:true,rightVersion:true,visible:true,units:false}),"P02_UNVERIFIED");
t("deposit not first-IN amount",planned({deposit:50,leverage:3})===50,false);
t("invalid deposit not nominal",planned({deposit:-50,leverage:3}),null);
t("invalid partial future order inconsistent",futureFill({qty:10,cumExecQty:4,leavesQty:7}),null);
t("full fill leaves zero",futureFill({qty:10,cumExecQty:10,leavesQty:0}),0);
t("Cross unknown MMR no READY",riskGate({crossProof:false,p02:true}),"UNVERIFIED");
t("Short strict loss unknown no READY",riskGate({lossBound:false,p02:true}),"UNVERIFIED");
t("missing P02 no READY",riskGate({p02:false}),"NEEDS_DATA");
t("missing Mark no READY",riskGate({mark:false}),"NEEDS_DATA");
t("re-invest needs risk reconfirmation",contains(doc,["Реинвест","увеличение риска","S0–S3"])||contains(doc,["Реинвест","S0–S3","FR-027–FR-040"]),true);
t("self-contained synthetic never READY",riskGate({}),"SYNTHETIC_ONLY_NO_READY");
// Read actual source, not fixture only.
for(let i=24;i<=29;i++){const id="P08-"+String(i).padStart(2,"0"),section=doc.split("### "+id+" —")[1]?.split("\n### ")[0]||"";t("prompt copyable "+id,section.includes("> ")&&section.length>110,true);t("prompt route "+id,section.includes("**RT"),true);}
for(let i=1;i<=40;i++){const id="VH"+String(i).padStart(2,"0");t("source case exists "+id,!!row(doc,id),true);}
for(let i=1;i<=25;i++){const id="VL-"+String(i).padStart(2,"0");t("Veles whitelist catalogue "+id,veles.includes("| "+id+" |"),true);}
for(const term of ["P01","P02","T02","R2","R3","SIMPLE","CUSTOM","SIGNAL","RT07","RT09","RT10","CHOOSE","POSITION -1","T03","T04","S0","S1","S2","S3","100%","FR-029","FR-030","FR-031","FR-032","FR-033","FR-034","F/A/H/R","H04","NOT_CHECKED","RECHECK","UNVERIFIED","NEEDS_DATA","REJECTED","READY","One-Way","Hedge","Mark","Last"]){t("normative content "+term,doc.includes(term),true);}
for(const [name,s,terms] of [
 ["Veles Skill",skill,["SIMPLE","CUSTOM","SIGNAL","POSITION -1","P02","STOP ≠ CANCEL","FR-030","NOT_VERIFIED"]],
 ["P02 contract",p02doc,["P01","P02","T02","VERIFIED_FOR_SCOPE"]],
 ["configuration mapping",config,["M18","M20","NO_DIRECT_EQUIVALENT","Veles","GinArea"]],
 ["risk strategy",risk,["FR-029","FR-034","H04","F/A/H/R"]],
 ["dialogue",conversation,["RT07","RT09","RT10","CHOOSE"]],
 ["approved plan",plan,["**08.6 — Veles handoff**","SIMPLE/CUSTOM/SIGNAL"]]
])t("source cross-ref "+name,contains(s,terms),true);
const pins={
 VH01:["CHOOSE"],VH02:["Не выводить Veles"],VH03:["не выбор за пользователя"],
 VH06:["no one-to-one R3"],VH09:["не first IN/Equity/IM/loss bound"],VH10:["Не считать равными"],
 VH11:["10 потенциальных IN"],VH12:["100% future reserve"],VH13:["UNVERIFIED"],
 VH20:["Нет доказанного биржевого SL"],VH23:["upper loss bound"],VH24:["account-wide MMR"],
 VH26:["не новый exchange slot"],VH29:["остаётся открытой"],VH32:["RECHECK"],
 VH35:["FR-029/FR-034"],VH36:["REJECTED"],VH37:["REJECTED"],VH38:["RECHECK"],
 VH39:["не доказана"],VH40:["Не считать"]
};
for(const [id,terms] of Object.entries(pins))t("actual source pinned "+id,pinned(doc,id,terms),true);
const mutations=[
 ["VH01","CHOOSE","AUTO_SELECT"],["VH06","no one-to-one R3","READY R3"],
 ["VH11","10 потенциальных IN","3 потенциальных IN"],
 ["VH12","100% future reserve","30% future reserve"],
 ["VH13","UNVERIFIED","VERIFIED"],
 ["VH20","Нет доказанного биржевого SL","Есть доказанный биржевой SL"],
 ["VH23","upper loss bound","guaranteed stop bound"],
 ["VH24","account-wide MMR","single liqPrice enough"],
 ["VH26","не новый exchange slot","новый exchange slot"],
 ["VH29","остаётся открытой","закрыта"],
 ["VH36","REJECTED","READY"],["VH37","REJECTED","READY"],
 ["VH38","RECHECK","READY"],["VH39","не доказана","доказана"]
];
for(const [id,correct,malicious] of mutations){
 const source=row(doc,id);if(!source.includes(correct))throw Error("missing mutation anchor "+id);
 const altered=doc.replace(source,source.replace(correct,malicious));
 t("in-memory policy mutation detected "+id,pinned(altered,id,pins[id]),false);
}
const links=[...doc.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/i.test(x)).map(x=>x.split("#")[0]).filter(Boolean);
t("enough normative links",links.length>=12,true);
t("normative file link targets exist",links.every(x=>exists("docs/prompts/"+x)),true);
t("plan 08.5 approved current",plan.includes("08.5")&&plan.includes("PLANNED / APPROVED"),true);
t("08.6 pending review",doc.includes(tick+"IMPLEMENTED / PENDING USER REVIEW"+tick),true);
t("08.7 not started",doc.includes("08.7 "+tick+"NOT STARTED"+tick),true);
t("open blockers",["RV-02","RV-03","RV-04","RV-06","TV-01–TV-04"].every(x=>doc.includes(x)),true);
const bad=tests.filter(x=>!x.pass);
for(const x of bad)console.error("FAIL",x.name,JSON.stringify({actual:x.actual,expected:x.expected}));
console.log(JSON.stringify({kind:"STAGE_08_06_VELES_HANDOFF_SYNTHETIC",total:tests.length,passed:tests.length-bad.length,failed:bad.length,normativeCases:40,copyablePrompts:6,mutations:mutations.length,independentLLMRuns:0,realNodeCheckoutVerified:false,realP02:false,liveBybit:false,tradeReady:false}));
if(bad.length)process.exitCode=1;
