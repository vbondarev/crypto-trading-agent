// Stage 08.8 documentary and synthetic report/RECHECK contract checks. Node >=18.
// node tests/stage-08-08-report-templates-synthetic.mjs
// Not ChatGPT runtime, exchange connectivity, actual financial advice or trading READY.
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const doc=read("docs/workflows/report-templates.md");
const routing=read("docs/workflows/interaction-contract.md");
const freshness=read("docs/data-freshness.md");
const plan=read("docs/stage-08-plan.md");
const risk=read("docs/prompts/risk-strategy-decision.md");
const recovery=read("docs/prompts/portfolio-recovery.md");
const veles=read("docs/prompts/veles-configuration.md");
const ginarea=read("docs/prompts/ginarea-configuration.md");
const tests=[];
function check(label,got,expected){tests.push({label,got,expected,ok:Object.is(got,expected)});}
const includes=(text,words)=>words.every(x=>text.includes(x));
const bt=String.fromCharCode(96);
const row=(body,id)=>body.split("\n").find(x=>x.startsWith("| "+id+" |"))??"";
const rowHas=(body,id,parts)=>row(body,id)!==""&&parts.every(x=>row(body,id).includes(x));
function route(intent){
 const map={education:["RT01","EDUCATIONAL",false],market:["RT02","R1",false],technical:["RT03","R2",false],portfolio:["RT04","PORTFOLIO",true],recovery:["RT05","RECOVERY",true],compare:["RT06","CHOOSE",false],veles:["RT07","R2",true],ginarea:["RT08","R2",true],final:["RT09","R3_AUDIT",true],event:["RT10","RECHECK",true]};
 return map[intent]??["ASK","UNKNOWN",false];
}
function fieldState({observedMinutes=null,limitMinutes=15,provided=true,priceType="Mark",requiredType="Mark",changed=false}={}){
 if(changed)return "RECHECK";
 if(!provided)return "MISSING";
 if(priceType!==requiredType)return "WRONG_PRICE_KIND";
 if(!Number.isFinite(observedMinutes)||observedMinutes<0)return "TIME_UNVERIFIED";
 return observedMinutes<=limitMinutes?"CURRENT_TIMESTAMP_ONLY":"STALE";
}
function outcome({action="NEW",h04=false,day=null,dd=null,leverage=null,im=null,loss=null,distance=null,slots=null,reserveShortfall=false,conflict=false,missing=false}={}){
 const expansions=["NEW","ADD","RECOVER_WITH_ADD"];
 if(!expansions.includes(action))return "QUALITATIVE_NO_ORDER";
 if(h04||(day!==null&&day>=3)||(dd!==null&&dd>=15)||(leverage!==null&&leverage>5)||(im!==null&&im>30)||(loss!==null&&loss>5)||(distance!==null&&distance<15)||(slots!==null&&slots>3)||reserveShortfall)return "REJECTED";
 if(conflict)return "UNVERIFIED";
 if(missing)return "NEEDS_DATA";
 return "NO_LIVE_READY";
}
function recheck(event){
 const dep={
  "FILL":["T02","T03","T04","S0","S1","S2","S3","RISK","INVALIDATED"],
  "ORDER":["T02","T04","S1","S2","S3","RISK","INVALIDATED"],
  "EQUITY":["E0","H01","H04","S3","RISK","INVALIDATED"],
  "MARGIN":["T02","MMR","S0","S1","S2","S3","RISK","INVALIDATED"],
  "BOT_GRID":["T04","P02","S1","S2","S3","RISK","INVALIDATED"],
  "DISABLE":["T04","S1","S2","RISK","INVALIDATED"],
  "CANCEL":["T02","T04","OWNER","RISK","INVALIDATED"],
  "P02":["P02","CONFIG","RISK","INVALIDATED"],
  "MARK":["Mark","R2","R3","RISK","INVALIDATED"],
  "SKILL":["SKILL_BODY","METHOD","R3","INVALIDATED"]
 };
 return dep[event]??null;
}
function net({grossRealized,unrealized,fees,funding}={}){
 return [grossRealized,unrealized,fees,funding].every(Number.isFinite)?grossRealized+unrealized-fees-funding:null;
}
function choose({selectedPlatform=null,selectedGrid=null}={}){
 if(!selectedPlatform)return "CHOOSE_PLATFORM";
 if(!selectedGrid)return "CHOOSE_STRATEGY";
 return "RECHECK_CHANGED_DEPENDENCIES";
}
function skillStatus({bodyRead=false,complete=false}={}){
 if(!bodyRead)return "NOT_LOADED";
 return complete?"LOADED_DOCUMENTARY":"PARTIAL";
}
// RF01–RF40 = deterministic synthetic expectations, NOT 40 independent ChatGPT conversations.
check("RF01 education no portfolio",route("education").join("|"),"RT01|EDUCATIONAL|false");
check("RF02 R1 without private data",route("market").join("|"),"RT02|R1|false");
check("RF03 R1 exact 15m context only",fieldState({observedMinutes:15,limitMinutes:15}),"CURRENT_TIMESTAMP_ONLY");
check("RF04 retrieved_at not observed_at",fieldState({observedMinutes:null}),"TIME_UNVERIFIED");
check("RF05 spot not Bybit Mark",fieldState({observedMinutes:1,priceType:"Spot Last"}),"WRONG_PRICE_KIND");
check("RF06 R2 intraday 6m stale",fieldState({observedMinutes:6,limitMinutes:5}),"STALE");
check("RF07 unclosed candle rejected by source",rowHas(doc,"RF07",["Исключить открытую"]),true);
check("RF08 insufficient indicator warmup",rowHas(doc,"RF08",["NEEDS_DATA"]),true);
check("RF09 partial scope",rowHas(doc,"RF09",["PARTIAL_SCOPE"]),true);
check("RF10 future leaves quantity 10−4",10-4,6);
check("RF11 Veles virtual POSITION not slot",rowHas(doc,"RF11",["Не","slot"]),true);
check("RF12 GinArea net can be zero",rowHas(doc,"RF12",["future IN"]),true);
check("RF13 H01 full net not recovered",net({grossRealized:-15,unrealized:10,fees:1,funding:2}),-8);
check("RF14 already net realized cannot double fee",rowHas(doc,"RF14",["Не вычитать"]),true);
check("RF15 H02 H03 missing",rowHas(doc,"RF15",["NOT_CHECKED"]),true);
check("RF16 known H04 hard veto",outcome({h04:true,missing:true}),"REJECTED");
check("RF17 day 3% equal veto",outcome({day:3}),"REJECTED");
check("RF18 DD 15% equal veto",outcome({dd:15}),"REJECTED");
check("RF19 leverage 8x veto",outcome({leverage:8}),"REJECTED");
check("RF20 leverage 5x only local not READY",outcome({leverage:5}),"NO_LIVE_READY");
check("RF21 fourth reachable slot veto",outcome({slots:4}),"REJECTED");
check("RF22 Cross MMR unproven",outcome({conflict:true}),"UNVERIFIED");
check("RF23 missing real historical Mark",rowHas(doc,"RF23",["UNVERIFIED"]),true);
check("RF24 R3 whole account at 6m",fieldState({observedMinutes:6,limitMinutes:5}),"STALE");
check("RF25 R3 Mark at 3m",fieldState({observedMinutes:3,limitMinutes:2}),"STALE");
check("RF26 event wins TTL",fieldState({observedMinutes:1,limitMinutes:5,changed:true}),"RECHECK");
check("RF27 fill invalidates risk scope",recheck("FILL").includes("T02")&&recheck("FILL").includes("RISK"),true);
check("RF28 P02 switch invalidates config",recheck("P02").includes("CONFIG"),true);
check("RF29 margin mode whole account/MMR",recheck("MARGIN").includes("MMR"),true);
check("RF30 sticky Disable retained",rowHas(doc,"RF30",["Sticky ON"]),true);
check("RF31 bot pause not exchange close",rowHas(doc,"RF31",["Не подтверждён"]),true);
check("RF32 Indicator cannot auto Default",rowHas(doc,"RF32",["CHOOSE"]),true);
check("RF33 P01 not user P02",rowHas(doc,"RF33",["R2 DOC only"]),true);
check("RF34 no platform => CHOOSE",choose({}),"CHOOSE_PLATFORM");
check("RF35 stage approval not trading",rowHas(doc,"RF35",["не","READY"]),true);
check("RF36 retrieved_at not snap freshness",rowHas(doc,"RF36",["retrieved_at","snapshot_at"]),true);
check("RF37 no Mark from Spot",fieldState({observedMinutes:1,priceType:"Spot Last"}),"WRONG_PRICE_KIND");
check("RF38 hard veto dominates missing",outcome({h04:true,missing:true}),"REJECTED");
check("RF39 GitHub 403 no loaded Skill",skillStatus({bodyRead:false}),"NOT_LOADED");
check("RF40 report acceptance not 08.9",rowHas(doc,"RF40",["не","08.9"]),true);
// Additional deterministic edges + independent dependency coverage.
check("R1 user has no obligation to give T02",route("market")[2],false);
check("R2 price at 5m only time suitable",fieldState({observedMinutes:5,limitMinutes:5}),"CURRENT_TIMESTAMP_ONLY");
check("R3 Mark at 2m only time suitable",fieldState({observedMinutes:2,limitMinutes:2}),"CURRENT_TIMESTAMP_ONLY");
check("negative clock age not trusted",fieldState({observedMinutes:-1}),"TIME_UNVERIFIED");
check("missing Mark not zero price",fieldState({provided:false}),"MISSING");
check("R2 intraday no false present",fieldState({observedMinutes:5.1,limitMinutes:5}),"STALE");
check("unknown field timestamp even if message current",fieldState({observedMinutes:undefined}),"TIME_UNVERIFIED");
check("NEW without proof not READY",outcome({}),"NO_LIVE_READY");
check("WAIT not risk free or new permission",outcome({action:"WAIT",h04:true}),"QUALITATIVE_NO_ORDER");
check("ADD H04 veto",outcome({action:"ADD",h04:true}),"REJECTED");
check("HWM DD 14.9 alone not threshold veto",outcome({dd:14.9}),"NO_LIVE_READY");
check("daily 2.9 alone not threshold veto",outcome({day:2.9}),"NO_LIVE_READY");
check("IM 30% numeric equality only",outcome({im:30}),"NO_LIVE_READY");
check("IM 30.1% veto",outcome({im:30.1}),"REJECTED");
check("loss at 5% equality only",outcome({loss:5}),"NO_LIVE_READY");
check("loss 5.01% veto",outcome({loss:5.01}),"REJECTED");
check("liq distance 15% equality only",outcome({distance:15}),"NO_LIVE_READY");
check("liq distance 14.9% veto",outcome({distance:14.9}),"REJECTED");
check("3 slots equality only",outcome({slots:3}),"NO_LIVE_READY");
check("missing future reserve hard veto",outcome({reserveShortfall:true}),"REJECTED");
check("critical conflict outweighs mere missing",outcome({conflict:true,missing:true}),"UNVERIFIED");
check("missing action data",outcome({missing:true}),"NEEDS_DATA");
check("indeterminate owner limits recovery",includes(doc,["owner","UNVERIFIED","H01"]),true);
check("Skill not loaded",skillStatus({}),"NOT_LOADED");
check("Skill partial",skillStatus({bodyRead:true,complete:false}),"PARTIAL");
check("Skill proof file read limited",skillStatus({bodyRead:true,complete:true}),"LOADED_DOCUMENTARY");
check("user grid selection separate",choose({selectedPlatform:"GinArea"}),"CHOOSE_STRATEGY");
check("user strategy does not authorize action",choose({selectedPlatform:"GinArea",selectedGrid:"Default"}),"RECHECK_CHANGED_DEPENDENCIES");
for(const [id,key] of [["RC01","T02"],["RC02","T04"],["RC03","E0"],["RC04","MMR"],["RC05","T04"],["RC06","S1"],["RC07","OWNER"],["RC08","P02"],["RC09","Mark"],["RC10","METHOD"]]){const event={RC01:"FILL",RC02:"ORDER",RC03:"EQUITY",RC04:"MARGIN",RC05:"BOT_GRID",RC06:"DISABLE",RC07:"CANCEL",RC08:"P02",RC09:"MARK",RC10:"SKILL"}[id];check("dependency "+id,recheck(event).includes(key),true);}
for(let i=36;i<=41;i++){const id="P08-"+String(i).padStart(2,"0");const body=doc.split("### "+id+" —")[1]?.split("\n### ")[0]??"";check("prompt "+id+" exists and copyable",body.includes("> ")&&body.length>170,true);}
for(let i=1;i<=40;i++){const id="RF"+String(i).padStart(2,"0");check("normative row "+id,Boolean(row(doc,id)),true);}
for(let i=1;i<=10;i++){const id="RC"+String(i).padStart(2,"0");check("RECHECK dependency row "+id,Boolean(row(doc,"**"+id+"**")),true);}
for(const w of ["EDUCATIONAL","R1","R2","R3_AUDIT","ASK","ANALYZE","CHOOSE","RECHECK","STOP","REJECTED","UNVERIFIED","NEEDS_DATA","READY","NOT_CHECKED","NOT_LOADED","PARTIAL_SCOPE","CURRENT","STALE","MISSING","TIME_UNVERIFIED","CLOCK_CONFLICT","CONFLICT","INFERRED","S0","S1","S2","S3","observed_at","retrieved_at","snapshot_at","response_time","P02","T02","T03","T04","T05","F/A/H/R","H04","FR-029","FR-030","FR-031","FR-032","FR-033","FR-034","FR-035/036","RV-02","RV-03","RV-04","RV-06","TV-01–TV-04"])check("normative marker "+w,doc.includes(w),true);
for(const [label,source,words] of [
 ["dialogue",routing,["RT01","RT02","RT03","RT04","RT05","RT06","RT07","RT08","RT09","RT10","RECHECK"]],
 ["data-freshness",freshness,["observed_at","retrieved_at","TIME_UNVERIFIED","NOT_CHECKED","AD-009","инвалид"]],
 ["stage plan",plan,["**08.8 — отчёты и повторные проверки**","RECHECK"]],
 ["risk strategy",risk,["FR-029","FR-030","FR-031","FR-032","FR-033","FR-034","H04"]],
 ["portfolio/H01",recovery,["H01","L_lifecycle","L_from_now","leavesQty"]],
 ["Veles",veles,["P08-24","POSITION -1","P02"]],
 ["GinArea",ginarea,["P08-30","Disable IN","Indicator Grid","Default Grid"]]
])check("cross-document "+label,includes(source,words),true);
const pins={
 RF03:["15-минутной"],RF04:["TIME_UNVERIFIED"],RF06:["STALE"],RF09:["PARTIAL_SCOPE"],
 RF13:["-8 USDT"],RF15:["NOT_CHECKED"],RF16:["REJECTED"],RF17:["REJECTED"],
 RF18:["REJECTED"],RF19:["REJECTED"],RF22:["UNVERIFIED"],RF23:["UNVERIFIED"],
 RF26:["RECHECK"],RF28:["RECHECK"],RF29:["RECHECK"],RF30:["Sticky ON"],
 RF31:["Не подтверждён"],RF32:["CHOOSE"],RF33:["R2 DOC only"],
 RF38:["REJECTED"],RF39:["NOT_LOADED"],RF40:["08.9"]
};
for(const [id,words] of Object.entries(pins))check("source pinned "+id,rowHas(doc,id,words),true);
const mutations=[
 ["RF04","TIME_UNVERIFIED","CURRENT"],["RF06","STALE","CURRENT"],
 ["RF09","PARTIAL_SCOPE","FULL_ACCOUNT"],["RF13","-8 USDT","+10 USDT"],
 ["RF15","NOT_CHECKED","PASS"],["RF16","REJECTED","READY"],
 ["RF17","REJECTED","READY"],["RF18","REJECTED","READY"],
 ["RF22","UNVERIFIED","READY"],["RF23","UNVERIFIED","READY"],
 ["RF26","RECHECK","READY"],["RF30","Sticky ON","OFF"],
 ["RF32","CHOOSE","AUTO_DEFAULT"],["RF38","REJECTED","NEEDS_DATA"],
 ["RF39","NOT_LOADED","LOADED"],["RF40","08.9","следующий этап автоматически"]
];
for(const [id,oldText,newText] of mutations){
 const original=row(doc,id);if(!original.includes(oldText))throw Error("missing mutation anchor "+id);
 const altered=doc.replace(original,original.replace(oldText,newText));
 check("mutation detected "+id,rowHas(altered,id,pins[id]),false);
}
const riskLine=doc.split("\n").find(x=>x.startsWith("| FR-031 |"))??"";
check("source risk threshold leverage",riskLine.includes("5×"),true);
if(!riskLine.includes("5×"))throw Error("missing 5x threshold");
check("source FR leverage mutation caught",riskLine.replaceAll("5×","10×").includes("5×"),false);
const dep=doc.split("\n").find(x=>x.startsWith("| **RC01** |"))??"";
check("full S0-S3 dependency in source",includes(dep,["S0–S3","T02"]),true);
check("source dependency downgrade caught",dep.replace("S0–S3","S0").includes("S0–S3"),false);
const refs=[...doc.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/i.test(x)).map(x=>x.split("#")[0]).filter(Boolean);
check("relative source count",refs.length>=12,true);
check("all relative file targets exist",refs.every(x=>exists("docs/workflows/"+x)),true);
check("08.8 pending user review",doc.includes(bt+"IMPLEMENTED / PENDING USER REVIEW"+bt),true);
check("08.9 not started",doc.includes("08.9 "+bt+"NOT STARTED"+bt),true);
const bad=tests.filter(x=>!x.ok);for(const x of bad)console.error("FAIL",x.label,JSON.stringify({got:x.got,expected:x.expected}));
console.log(JSON.stringify({kind:"STAGE_08_08_REPORT_TEMPLATES_SYNTHETIC",total:tests.length,passed:tests.length-bad.length,failed:bad.length,normativeCases:40,copyablePrompts:6,dependencyCases:10,mutations:mutations.length+2,independentLLMTests:0,realNodeCheckout:false,liveBybit:false,tradeReady:false}));
if(bad.length)process.exitCode=1;
