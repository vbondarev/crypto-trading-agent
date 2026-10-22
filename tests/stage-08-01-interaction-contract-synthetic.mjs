// Synthetic contract tests for step 08.1; Node >= 18.
// Run: node tests/stage-08-01-interaction-contract-synthetic.mjs
// No ChatGPT runtime, live Bybit/GinArea/Veles, exchange orders, or trading READY.
import {readFileSync,existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const body=read("docs/workflows/interaction-contract.md"),plan=read("docs/stage-08-plan.md");
const rtDoc=read("docs/stage-07-skills-contract.md"),agents=read("AGENTS.md");
const tick=String.fromCharCode(96),cases=[];
function t(name,actual,expected){cases.push({id:"IC-T"+String(cases.length+1).padStart(3,"0"),name,actual,expected,pass:Object.is(actual,expected)});}
const dv="data-verification",ma="market-analysis",pa="portfolio-analysis",ra="risk-assessment",sp="strategy-planning",vel="veles-configuration",gin="ginarea-configuration";
function route({intent,live=false,position=false,platform=null,event=false}={}){
 if(event)return {id:"RT10",mode:"RECHECK",skills:[dv,pa,ra,...(platform==="Veles"?[vel]:platform==="GinArea"?[gin]:[])]};
 if(intent==="education")return {id:"RT01",mode:"NONE",skills:[]};
 if(intent==="market")return {id:"RT02",mode:"R1",skills:live?[dv,ma]:[ma]};
 if(intent==="technical")return {id:"RT03",mode:"R2",skills:[dv,ma,...(position?[pa,ra]:[]),sp]};
 if(intent==="portfolio")return {id:"RT04",mode:"PORTFOLIO",skills:[dv,pa,ra]};
 if(intent==="recovery")return {id:"RT05",mode:"POSITION",skills:[dv,pa,ra,sp]};
 if(intent==="compare")return {id:"RT06",mode:"CHOOSE",skills:[sp]};
 if(intent==="configuration"||intent==="final"){
  const fin=intent==="final",missing=!["Veles","GinArea"].includes(platform);
  return {id:fin?"RT09":platform==="Veles"?"RT07":platform==="GinArea"?"RT08":"RT06",mode:fin?"R3":"R2",selectionMissing:missing,skills:[dv,pa,ra,...(fin?[]:[sp]),...(platform==="Veles"?[vel]:platform==="GinArea"?[gin]:[])]};
 }
 return {id:null,mode:"UNKNOWN",skills:[]};
}
const graph={ASK:["ANALYZE","STOP"],ANALYZE:["ASK","CHOOSE","RECHECK","STOP"],CHOOSE:["RECHECK","STOP"],RECHECK:["ANALYZE","ASK","STOP"],STOP:[]};
const can=(a,b)=>!!graph[a]?.includes(b);
function inputs({mode="R1",intent="market",position=false,recovery=false}={}){
 return mode==="R3"?["T01","T02","T03","T04","Mark","P02"]:["T01",...(["portfolio","recovery"].includes(intent)||position?["T03","T02_RELEVANT"]:[]),...(recovery?["T05"]:[])];
}
function loaded({bodyRead=false,ref=false,partial=false}={}){return !bodyRead||!ref?"NOT_LOADED":partial?"PARTIAL":"FULL";}
function decision({hard=false,critical=false,missing=false,all=false}={}){return hard?"REJECTED":critical?"UNVERIFIED":missing?"NEEDS_DATA":all?"LOCAL_ONLY_NO_READY":"NEEDS_DATA";}
function fresh({r3=false,t02=0,mark=0,event=false}={}){return !r3?"NOT_R3":event?"RECHECK":![t02,mark].every(x=>Number.isFinite(x)&&x>=0)?"CLOCK_UNKNOWN":t02>5||mark>2?"STALE_RECHECK":"TTL_ONLY";}
const has=terms=>terms.every(s=>body.includes(s));
const wants=(known,mandatory)=>known?"SKIP_EXISTING":mandatory?"ONE_TARGETED_QUESTION":"SKIP_OPTIONAL";

t("IC01 explain Short no Skill",route({intent:"education"}).skills.length,0);
t("IC02 general R1 no T02",inputs({intent:"market"}).includes("T02"),false);
t("IC03 live R1 verifies provenance",route({intent:"market",live:true}).skills[0],dv);
t("IC04 provisional technical avoids portfolio",route({intent:"technical"}).skills.includes(pa),false);
t("IC05 technical position needs risk",route({intent:"technical",position:true}).skills.includes(ra),true);
t("IC06 portfolio route RT04",route({intent:"portfolio"}).id,"RT04");
t("IC07 net recovery needs T05",inputs({intent:"recovery",recovery:true}).includes("T05"),true);
t("IC08 platform comparison has no config",route({intent:"compare"}).skills.includes(gin),false);
t("IC09 Veles only",route({intent:"configuration",platform:"Veles"}).skills.includes(gin),false);
t("IC10 GinArea only",route({intent:"configuration",platform:"GinArea"}).skills.includes(vel),false);
t("IC11 final full input",["T02","T03","T04","Mark","P02"].every(x=>inputs({mode:"R3"}).includes(x)),true);
t("IC12 missing final platform",route({intent:"final"}).selectionMissing,true);
t("IC13 fill invalidates snapshot",fresh({r3:true,t02:1,mark:1,event:true}),"RECHECK");
t("IC14 bot pause no exchange close",has(["Pause","не считать позицию закрытой"]),true);
t("IC15 GitHub denied not loaded",loaded({bodyRead:false,ref:true}),"NOT_LOADED");
t("IC16 README not body",loaded({ref:false,bodyRead:false}),"NOT_LOADED");
t("IC17 partial file not full",loaded({ref:true,bodyRead:true,partial:true}),"PARTIAL");
t("IC18 known symbol no repeat",wants(true,true),"SKIP_EXISTING");
t("IC19 missing essential horizon asks one",wants(false,true),"ONE_TARGETED_QUESTION");
t("IC20 education no T02/P02",inputs({intent:"education"}).length,1);
t("IC21 known H04 overrides missing",decision({hard:true,missing:true,critical:true}),"REJECTED");
t("IC22 optional H02/H03 never fake pass",has(["H02/H03","NOT_CHECKED","H04"]),true);
t("IC23 model conflict",decision({critical:true,all:true}),"UNVERIFIED");
t("IC24 P02 absent",decision({missing:true,all:true}),"NEEDS_DATA");
t("IC25 real history required for stress",has(["FR-038","F/A/H/R","не доказана"]),true);
t("IC26 spot not mark",has(["Binance Spot Last","Bybit Perpetual Mark"]),true);
t("IC27 Bybit 403 is not quote",has(["HTTP 403","≠ котировка"]),true);
t("IC28 intermediate approval not trade",has(["принимаю анализ","не означает согласия"]),true);
t("IC29 selection transitions through recheck",can("CHOOSE","RECHECK"),true);
t("IC30 T02 age >5",fresh({r3:true,t02:6,mark:1}),"STALE_RECHECK");
t("IC30 Mark age >2",fresh({r3:true,t02:1,mark:3}),"STALE_RECHECK");
t("IC31 user stop supported",can("ANALYZE","STOP"),true);
t("IC32 changed leverage invalidation",fresh({r3:true,t02:1,mark:1,event:true}),"RECHECK");
for(let i=1;i<=10;i++){const id="RT"+String(i).padStart(2,"0");t("route text "+id,body.includes("**"+id+"**"),true);t("route trace "+id,rtDoc.includes("| "+id+" |"),true);}
for(const s of Object.keys(graph))t("state "+s,body.includes("**"+s+"**"),true);
for(const a of Object.keys(graph))for(const b of Object.keys(graph))t("transition "+a+" -> "+b,can(a,b),graph[a].includes(b));
t("STOP cannot self reactivate",can("STOP","ANALYZE"),false);
t("CHOOSE cannot route READY",can("CHOOSE","READY"),false);
t("R1 no R3 TTL",fresh({t02:100,mark:100}),"NOT_R3");
t("R3 thresholds inclusive but not ready",fresh({r3:true,t02:5,mark:2}),"TTL_ONLY");
t("negative timestamp invalid",fresh({r3:true,t02:-1,mark:1}),"CLOCK_UNKNOWN");
t("missing clock invalid",fresh({r3:true,t02:NaN,mark:1}),"CLOCK_UNKNOWN");
t("synthetic full proof cannot READY",decision({all:true}),"LOCAL_ONLY_NO_READY");
t("all planned normative cases IC01–IC32",Array.from({length:32},(_,i)=>"| IC"+String(i+1).padStart(2,"0")+" |").every(x=>body.includes(x)),true);
t("one selected platform",has(["Veles ИЛИ GinArea","P02"]),true);
t("open RV blockers",has(["RV-02","RV-03","RV-04","RV-06"]),true);
t("TV constraints open",body.includes("TV-01–TV-04"),true);
t("no obsolete F/V/H/R",!body.includes("F/V/H/R"),true);
t("no real runtime claim",body.includes("не реализованный программный автомат"),true);
t("no background monitoring claim",body.includes("постоянного наблюдения"),true);
t("plan approved",plan.includes(tick+"PLANNED / APPROVED"+tick),true);
t("implementation not acceptance",body.includes(tick+"IMPLEMENTED / PENDING USER REVIEW"+tick),true);
t("08.2 not started",body.includes(tick+"08.2 NOT STARTED"+tick),true);
t("FR scope retained",agents.includes("FR-027–FR-040"),true);
const links=[...body.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/i.test(x)).map(x=>x.split("#")[0]).filter(Boolean);
t("at least ten references",links.length>=10,true);
t("all local references exist",links.every(x=>exists("docs/workflows/"+x)),true);
// 08.1 self-review correction: source-bound routing guards (fixture routing alone is insufficient).
function routeTableLine(text,id){return text.split("\n").find(line=>line.startsWith("| ")&&line.includes("| **"+id+"** |"))||"";}
function routeRule(text,id,required=[],forbidden=[]){
 const line=routeTableLine(text,id);
 return !!line&&required.every(x=>line.includes(x))&&forbidden.every(x=>!line.includes(x));
}
const expectedRouteLines={
 RT01:[["Skill не обязателен"],[]],
 RT02:[["R1","market-analysis"],[]],
 RT03:[["R2","data-verification","market-analysis","strategy-planning"],[]],
 RT04:[["data-verification","portfolio-analysis","risk-assessment"],[]],
 RT05:[["portfolio-analysis","risk-assessment","strategy-planning","H01/T05"],[]],
 RT06:[["strategy-planning","P01"],["veles-configuration","ginarea-configuration"]],
 RT07:[["R2","veles-configuration"],["ginarea-configuration"]],
 RT08:[["R2","ginarea-configuration"],["veles-configuration"]],
 RT09:[["R3","Veles ИЛИ GinArea Skill","T02/T03/T04"],[]],
 RT10:[["RECHECK","READY"],[]]
};
for(const [routeId,[required,forbidden]] of Object.entries(expectedRouteLines)){
 t("actual Markdown route content "+routeId,routeRule(body,routeId,required,forbidden),true);
}
t("route table exactly 10 rows",body.split("\n").filter(x=>/^\| .+\| \*\*RT\d{2}\*\* \|/.test(x)).length,10);
const stateSentence=body.split("\n").find(x=>x.startsWith("**Переходы допустимы:**"))||"";
for(const transition of ["ASK→ANALYZE/STOP","ANALYZE→ASK/CHOOSE/RECHECK/STOP","CHOOSE→RECHECK/STOP","RECHECK→ANALYZE/ASK/STOP"]){
 t("actual allowed transitions "+transition,stateSentence.includes(transition),true);
}
t("STOP documented as terminal",stateSentence.includes("Новый запрос после"),true);
t("document states READY is not dialog state",has(["READY","не состояние автомата"]),true);
t("CHOOSE cannot directly authorize trade",has(["CHOOSE","не означает согласия"]),true);
t("R3 no automatic READY on TTL",has(["не достаточное","READY"]),true);
t("R1 no blanket portfolio",has(["**R1** не требует личных T02/T03/T04/P02"]),true);
t("one question for missing mandatory data",has(["одним адресным вопросом"]),true);
// In-memory mutations must be detected by source guards even if the JS router is unchanged.
const badR3=body.replace("**Veles ИЛИ GinArea Skill**","**обе платформы одновременно**");
t("mutation dual platform in R3 caught",routeRule(badR3,"RT09",expectedRouteLines.RT09[0]),false);
const badR2=body.replace("data-verification → market-analysis → strategy-planning","market-analysis → strategy-planning");
t("mutation missing data-verification in R2 caught",routeRule(badR2,"RT03",expectedRouteLines.RT03[0]),false);
const badVeles=body.replace("**"+tick+"veles-configuration"+tick+"**","**"+tick+"ginarea-configuration"+tick+"**");
t("mutation wrong config Skill caught",routeRule(badVeles,"RT07",expectedRouteLines.RT07[0]),false);

const failures=cases.filter(x=>!x.pass);
for(const f of failures)console.error("FAIL",f.id,f.name,JSON.stringify({actual:f.actual,expected:f.expected}));
console.log(JSON.stringify({kind:"STAGE_08_01_LOCAL_DIALOG_SYNTHETIC",total:cases.length,passed:cases.length-failures.length,failed:failures.length,normativeCases:32,independentLLMTests:0,liveTrading:false,actualSkillRuntime:false}));
if(failures.length)process.exitCode=1;
