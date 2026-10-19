// 08.5 deterministic risk-decision and source-policy test. Node >=18.
// node tests/stage-08-05-risk-strategy-synthetic.mjs
// Pure synthetic fixture models only: never Bybit API, orders, real READY, LLM runtime.
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const doc=read("docs/prompts/risk-strategy-decision.md");
const plan=read("docs/stage-08-plan.md");
const risk=read(".agents/skills/risk-assessment/SKILL.md");
const strategy=read(".agents/skills/strategy-planning/SKILL.md");
const portfolio=read(".agents/skills/portfolio-analysis/SKILL.md");
const dialogue=read("docs/workflows/interaction-contract.md");
const prompts4=read("docs/prompts/portfolio-recovery.md");
const tick=String.fromCharCode(96);
const tests=[];
function t(name,actual,want){tests.push({id:"RD-T"+String(tests.length+1).padStart(3,"0"),name,actual,want,pass:Object.is(actual,want)});}
const has=(source,need)=>need.every(x=>source.includes(x));
function expands(s){return ["NEW","NEW_LONG","NEW_SHORT","ADD","RECOVER_WITH_ADD"].includes(s);}
function gate({action="NEW",h04=false,day=null,dd=null,im=null,bot=null,lev=null,liq=null,slots=null,reserve=null,required=null,conflict=false,missing=false,allModelsVerified=false}={}){
 if(!expands(action))return "QUALITATIVE_ONLY_NO_EXECUTION";
 if(h04||(day!==null&&day>=3)||(dd!==null&&dd>=15)||
  (im!==null&&im>30)||(bot!==null&&bot>5)||(lev!==null&&lev>5)||
  (liq!==null&&liq<15)||(slots!==null&&slots>3)||
  (reserve!==null&&required!==null&&reserve<required))return "REJECTED";
 if(conflict)return "UNVERIFIED";
 if(missing)return "NEEDS_DATA";
 return allModelsVerified?"LOCAL_NUMERIC_PASS_NOT_READY":"UNVERIFIED";
}
function fullRisk(){
 return {im:30,bot:5,lev:5,liq:15,slots:3,reserve:12,required:12,day:2,dd:14,allModelsVerified:true};
}
function route({intent,existing=false,changed=false}={}){
 if(changed)return "RT10_RECHECK";
 if(intent==="market")return "RT02_R1";
 if(intent==="recovery")return "RT05";
 if(intent==="risk"||intent==="choice")return existing?"RT04_RT05":"RT04";
 return "ASK";
}
function historical({h02=false,h03=false,h04=false}={}){return {h02:h02?"EVALUATE":"NOT_CHECKED",h03:h03?"EVALUATE":"NOT_CHECKED",knownBlock:h04?"REJECTED_NEW_RISK":"UNKNOWN"};}
function proof({isR3=false,t02=null,mark=null,p02=false,fam=["F","A","R"],historicalReal=false,changed=false,accountModels=false,needsRead=false}={}){
 if(changed)return "RECHECK";
 if(!isR3)return "PRELIMINARY_ONLY";
 if(t02===null||mark===null||!p02)return "NEEDS_DATA";
 if(t02<0||mark<0)return "TIME_UNVERIFIED";
 if(t02>5||mark>2)return "STALE";
 if(needsRead||!accountModels||!historicalReal||!["F","A","H","R"].every(x=>fam.includes(x)))return "UNVERIFIED";
 return "PREREQUISITES_MODELLED_ONLY_NO_LIVE_READY";
}
function available(action,{position=false,h01=false}={}){
 if(action==="HOLD"&&!position)return false;
 if(action==="RECOVER"&&!h01)return false;
 return true;
}
function ringFence(mode){return mode==="Cross"?"NOT_RING_FENCED":"CHECK_REAL_ACCOUNT";}
function correlation({count,varianceA,varianceB}={}){return count>=30&&varianceA>0&&varianceB>0?"METHOD_ELIGIBLE_NO_REAL_COEFF":"NOT_CHECKED";}
function net({realized,unrealized,fees,funding}={}){return [realized,unrealized,fees,funding].every(Number.isFinite)?realized+unrealized-fees-funding:null;}
function conditionRows(body,id,fragments){const row=body.split("\n").find(x=>x.startsWith("| "+id+" |"))||"";return !!row&&fragments.every(x=>row.includes(x));}
const F=fullRisk();
// 40 synthetic normative targets are not 40 independent GPT runs.
t("RD01 market scope",route({intent:"market"}),"RT02_R1");
t("RD02 incomplete portfolio RT04",route({intent:"risk",existing:true}),"RT04_RT05");
t("RD03 no P02/T02 no READY",proof({isR3:true}),"NEEDS_DATA");
t("RD04 user selection separate",has(doc,["выбор стратегии","выбранной одной","CHOOSE"]),true);
t("RD05 4 slots strict violation",gate({...F,slots:4}),"REJECTED");
t("RD06 ADD to existing slot bound 3",gate({...F,action:"ADD",slots:3}),"LOCAL_NUMERIC_PASS_NOT_READY");
t("RD07 leverage 8",gate({...F,lev:8}),"REJECTED");
t("RD08 leverage at 5",gate({...F,lev:5}),"LOCAL_NUMERIC_PASS_NOT_READY");
t("RD09 IM 31%",gate({...F,im:31}),"REJECTED");
t("RD10 IM 30% boundary",gate({...F,im:30}),"LOCAL_NUMERIC_PASS_NOT_READY");
t("RD11 bot 5.1%",gate({...F,bot:5.1}),"REJECTED");
t("RD12 bot 5% boundary",gate({...F,bot:5}),"LOCAL_NUMERIC_PASS_NOT_READY");
t("RD13 liq 14.9%",gate({...F,liq:14.9}),"REJECTED");
t("RD14 liq 15% boundary",gate({...F,liq:15}),"LOCAL_NUMERIC_PASS_NOT_READY");
t("RD15 incomplete reserve",gate({...F,reserve:11,required:12}),"REJECTED");
t("RD16 Cross reserve not ring-fenced",ringFence("Cross"),"NOT_RING_FENCED");
t("RD17 S0 order IM once",doc.includes("IM order уже в S0 **не** прибавлять второй раз"),true);
t("RD18 Hedge positionIdx separate",doc.includes("positionIdx")&&portfolio.includes("Hedge"),true);
t("RD19 3% daily activates",gate({...F,day:3}),"REJECTED");
t("RD20 2.9% daily alone not fail",gate({...F,day:2.9}),"LOCAL_NUMERIC_PASS_NOT_READY");
t("RD21 15% HWM activates",gate({...F,dd:15}),"REJECTED");
t("RD22 no historical fake pass",historical({}).h02+" "+historical({}).h03,"NOT_CHECKED NOT_CHECKED");
t("RD23 known H04 overrides missing",gate({h04:true,missing:true,conflict:true}),"REJECTED");
t("RD24 midnight requires verified reset",doc.includes("Сброс только после проверенной нормализации"),true);
t("RD25 deposit does not clear block",doc.includes("Депозит не сбрасывает H04"),true);
t("RD26 Cross model conflict",gate({...F,conflict:true}),"UNVERIFIED");
t("RD27 Short cap not verified",gate({...F,conflict:true,action:"NEW_SHORT"}),"UNVERIFIED");
t("RD28 H historical synthetic not enough",proof({isR3:true,t02:1,mark:1,p02:true,fam:["F","A","H","R"],accountModels:true,historicalReal:false}),"UNVERIFIED");
t("RD29 family names without actual evidence",proof({isR3:true,t02:1,mark:1,p02:true,fam:["F","A","H","R"],historicalReal:false}),"UNVERIFIED");
t("RD30 only 2 returns",correlation({count:2,varianceA:1,varianceB:1}),"NOT_CHECKED");
t("RD31 zero variance 30 returns",correlation({count:30,varianceA:0,varianceB:1}),"NOT_CHECKED");
t("RD32 WAIT not risk free",gate({action:"WAIT",h04:true}),"QUALITATIVE_ONLY_NO_EXECUTION");
t("RD33 HOLD no position",available("HOLD",{position:false}),false);
t("RD34 reduce hedge can increase risk",conditionRows(doc,"RD34",["портфельная переоценка"]),true);
t("RD35 Pause != exchange close",conditionRows(doc,"RD35",["CLOSE не доказан"]),true);
t("RD36 green PnL not recovered",net({realized:-15,unrealized:10,fees:1,funding:2}),-8);
t("RD37 RECOVER_WITH_ADD with H04",gate({...F,action:"RECOVER_WITH_ADD",h04:true}),"REJECTED");
t("RD38 event invalidates valid R3",proof({isR3:true,t02:1,mark:1,p02:true,fam:["F","A","H","R"],historicalReal:true,accountModels:true,changed:true}),"RECHECK");
t("RD39 H04 dominates missing P02",gate({h04:true,missing:true}),"REJECTED");
t("RD40 approval not execution",conditionRows(doc,"RD40",["Не является приказом"]),true);
// More deterministic threshold and precedence tests
for(const a of ["NEW","NEW_LONG","NEW_SHORT","ADD","RECOVER_WITH_ADD"])t("expansion recognized "+a,expands(a),true);
for(const a of ["WAIT","HOLD","REDUCE","CLOSE","RECOVER"])t("non-expansion qualitative "+a,expands(a),false);
t("R2 not R3 automatically",proof({}),"PRELIMINARY_ONLY");
t("R3 time border inclusive, not READY",proof({isR3:true,t02:5,mark:2,p02:true,fam:["F","A","H","R"],historicalReal:true,accountModels:true}),"PREREQUISITES_MODELLED_ONLY_NO_LIVE_READY");
t("R3 6m T02 stale",proof({isR3:true,t02:6,mark:1,p02:true}),"STALE");
t("R3 3m Mark stale",proof({isR3:true,t02:1,mark:3,p02:true}),"STALE");
t("R3 time negative invalid",proof({isR3:true,t02:-1,mark:1,p02:true}),"TIME_UNVERIFIED");
t("R3 missing P02",proof({isR3:true,t02:1,mark:1,p02:false}),"NEEDS_DATA");
t("R3 missing actual F/A/H/R",proof({isR3:true,t02:1,mark:1,p02:true,fam:["F","A","R"],historicalReal:true,accountModels:true}),"UNVERIFIED");
t("H04 expansion veto 08.5",gate({action:"ADD",h04:true,missing:true}),"REJECTED");
t("Known 4 slots over uncertainty",gate({slots:4,conflict:true,missing:true}),"REJECTED");
t("Known 3% day over missing",gate({day:3,missing:true}),"REJECTED");
t("Known 15% dd over conflict",gate({dd:15,conflict:true}),"REJECTED");
t("Unknown model before missing data",gate({conflict:true,missing:true}),"UNVERIFIED");
t("Only missing required data",gate({missing:true}),"NEEDS_DATA");
t("No numerical proof means UNVERIFIED",gate({}),"UNVERIFIED");
t("Negative numbers not proof of reserve",gate({...F,reserve:-1}),"REJECTED");
t("Unknown currency FX not fabricated",has(doc,["USD **не** USDT","unit"]),true);
t("R2 no automatic full P02",has(doc,["R2 качественного сравнения","не требовать","P02"]),true);
t("No automatic user strategy pick",has(doc,["Не выбирай сделку за меня","явный выбор"]),true);
t("H01 recovery separate bases",has(doc,["L_lifecycle","L_from_now","net recovery"]),true);
t("User choice cannot authorize order",has(doc,["CHOOSE","не исполняет","не запускать бота"]),true);
t("H04 lock not reset on deposit",conditionRows(doc,"RD25",["не сбрасывает H04"]),true);
t("Historical H02/H03 no fake PASS",conditionRows(doc,"RD22",["NOT_CHECKED","не","PASS"]),true);
t("Correlation equal 30 valid method only",correlation({count:30,varianceA:1,varianceB:2}),"METHOD_ELIGIBLE_NO_REAL_COEFF");
// Traceability FR-027–FR-040 in source: ranges must be explicit; 028 shares row.
for(const i of Array.from({length:14},(_,i)=>i+27)){
 const id="FR-"+String(i).padStart(3,"0");const line=doc.split("\n").find(line=>line.startsWith("| **FR-")&&line.includes(id))||"";
 t("risk requirement source "+id,line.length>60,true);
}
for(let i=18;i<=23;i++){
 const id="P08-"+String(i).padStart(2,"0");const segment=doc.split("### "+id+" —")[1]?.split("\n### ")[0]??"";
 t("copy-ready "+id,segment.includes("> ")&&segment.length>120,true);
 t("route defined "+id,segment.includes("**RT")||segment.includes("**RT04"),true);
}
for(let i=1;i<=40;i++){
 const id="RD"+String(i).padStart(2,"0");
 t("normative row "+id,doc.split("\n").some(line=>line.startsWith("| "+id+" |")),true);
}
const pins={
 RD05:["REJECTED"], RD07:["REJECTED"],RD09:["REJECTED"],RD11:["REJECTED"],
 RD13:["REJECTED"],RD15:["REJECTED"],RD19:["REJECTED"],RD21:["REJECTED"],
 RD22:["NOT_CHECKED"],RD23:["REJECTED"],RD26:["UNVERIFIED"],RD27:["UNVERIFIED"],
 RD28:["NOT_PERFORMED"],RD32:["NOT_RISK_FREE"],RD35:["CLOSE не доказан"],
 RD37:["REJECTED"],RD38:["RECHECK"],RD39:["REJECTED","NEEDS_DATA"],RD40:["Не является приказом"]
};
for(const [id,parts] of Object.entries(pins))t("source-bound row "+id,conditionRows(doc,id,parts),true);
const mutations=[
 ["RD05","REJECTED","READY"],["RD07","REJECTED","READY"],
 ["RD19","REJECTED","READY"],["RD22","NOT_CHECKED","PASS"],
 ["RD23","REJECTED","READY"],["RD27","UNVERIFIED","READY"],
 ["RD28","NOT_PERFORMED","PASSED"],["RD38","RECHECK","READY"],
 ["RD39","REJECTED","NEEDS_DATA"],["RD40","Не является приказом","Является приказом"]
];
for(const [id,needle,replacement] of mutations){
 const line=doc.split("\n").find(s=>s.startsWith("| "+id+" |"))||"";
 if(!line.includes(needle))throw Error("Mutation source absent "+id);
 const mutated=doc.replace(line,line.replace(needle,replacement));
 t("adversarial mutation detected "+id,conditionRows(mutated,id,pins[id]),false);
}
for(const [name,source,terms] of [
 ["risk Skill",risk,["FR-029","FR-030","FR-031","FR-032","FR-033","FR-034","FR-035","FR-036","FR-037","FR-038","FR-039","FR-040","H04","F/A/H/R"]],
 ["strategy Skill",strategy,["WAIT","HOLD","NEW","ADD","REDUCE","CLOSE","RECOVER","user"]],
 ["portfolio Skill",portfolio,["positionIdx","leavesQty","owner","T02"]],
 ["dialogue contract",dialogue,["RT03","RT04","RT05","RT09","RT10","CHOOSE"]],
 ["08.4 prompt",prompts4,["L_lifecycle","L_from_now","H01","S0","S1","S2"]],
 ["stage08 plan",plan,["**08.5 — риски и выбор стратегии**","FR-gates"]]
])t("traceability "+name,has(source,terms),true);
const refs=[...doc.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/i.test(x)).map(x=>x.split("#")[0]).filter(Boolean);
t("normative links enough",refs.length>=12,true);
t("all norm links resolve",refs.every(x=>exists("docs/prompts/"+x)),true);
t("correct pending result status",doc.includes(tick+"IMPLEMENTED / PENDING USER REVIEW"+tick),true);
t("08.6 unstarted",doc.includes("08.6 "+tick+"NOT STARTED"+tick),true);
t("RV/TV not closed",["RV-02","RV-03","RV-04","RV-06","TV-01–TV-04","FR-038"].every(x=>doc.includes(x)),true);
const bad=tests.filter(x=>!x.pass);
for(const x of bad)console.error("FAIL",x.id,x.name,JSON.stringify({actual:x.actual,want:x.want}));
console.log(JSON.stringify({kind:"STAGE_08_05_RISK_STRATEGY_SYNTHETIC",total:tests.length,passed:tests.length-bad.length,failed:bad.length,normativeCases:40,copyablePrompts:6,mutations:mutations.length,independentLLMRuns:0,realNodeCheckoutVerified:false,liveBybit:false,tradeReady:false}));
if(bad.length)process.exitCode=1;
