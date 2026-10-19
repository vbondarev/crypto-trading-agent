// Stage 08.2: synthetic/deterministic JS fixtures and source contract checks.
// node tests/stage-08-02-market-overview-synthetic.mjs  (Node >=18)
// No API calls, live quotes, installed Skills runtime, trading bot or real READY.
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const doc=read("docs/prompts/market-overview.md"),plan=read("docs/stage-08-plan.md");
const dialogue=read("docs/workflows/interaction-contract.md"),market=read(".agents/skills/market-analysis/SKILL.md");
const verify=read(".agents/skills/data-verification/SKILL.md");
const tests=[];
function check(name,actual,expected){tests.push({name,pass:Object.is(actual,expected),actual,expected});}
function scope({intent="overview",needsBot=false,needsRisk=false,current=false}={}){
 if(intent==="definition")return {rt:"RT01",mode:"NONE",skills:[],requiresT02:false};
 if(needsBot||needsRisk)return {rt:needsBot?"RT09":"RT04",mode:needsBot?"R3":"RISK",skills:[],requiresT02:true};
 return {rt:"RT02",mode:"R1",skills:current?["market-analysis","data-verification"]:["market-analysis"],requiresT02:false};
}
function evidence({exchange,category,settleCoin,kind,observedAt,retrievedAt,now="2026-10-20T12:00:00Z",expectedExchange,expectedCategory,expectedSettleCoin,event=false,httpStatus=200}={}){
 if(httpStatus!==200)return "NO_VALUE_SOURCE_ERROR";
 if(!exchange||!category||!kind)return "MARKET_UNVERIFIED";
 if(expectedExchange&&exchange!==expectedExchange)return "OTHER_MARKET_CONTEXT_ONLY";
 if(expectedCategory&&category!==expectedCategory)return "OTHER_MARKET_CONTEXT_ONLY";
 if(expectedSettleCoin&&settleCoin!==expectedSettleCoin)return "OTHER_MARKET_CONTEXT_ONLY";
 if(!observedAt||!Number.isFinite(Date.parse(observedAt)))return "TIME_UNVERIFIED";
 const age=(Date.parse(now)-Date.parse(observedAt))/60000;
 if(age<0)return "CLOCK_CONFLICT";
 if(event)return "RECHECK";
 if(age>15)return "HISTORICAL_ONLY";
 return "AGE_PASSED_ONLY";
}
function candle({start,intervalMin,asOf,ohlc}={}){
 if(!Number.isFinite(start)||!Number.isFinite(intervalMin)||intervalMin<=0||!Number.isFinite(asOf))return "TIME_UNVERIFIED";
 if(start+intervalMin*60000>asOf)return "UNFINISHED";
 if(!ohlc||![ohlc.open,ohlc.high,ohlc.low,ohlc.close].every(Number.isFinite))return "OHLC_INVALID";
 if(ohlc.low>Math.min(ohlc.open,ohlc.close)||ohlc.high<Math.max(ohlc.open,ohlc.close)||ohlc.low>ohlc.high)return "OHLC_INVALID";
 return "CLOSED_VALID";
}
function indicator({n,bars,closed=true,warmup=false}={}){
 if(!closed||!Array.isArray(bars))return "NO_CLOSED_SERIES";
 if(!Number.isInteger(n)||n<1||bars.length<n||!warmup)return "INSUFFICIENT_WARMUP";
 return "ELIGIBLE_TO_CALCULATE_NOT_VALUE";
}
function label(userData){return userData?"USER_PROVIDED_NOT_INDEPENDENT":"PROVIDER_MUST_BE_VERIFIED";}
const BT=String.fromCharCode(96);
check("MO01 education RT01",scope({intent:"definition"}).rt,"RT01");
check("MO02 overview default R1",scope().mode,"R1");
check("MO03 Spot not Bybit perpetual",evidence({exchange:"Binance",category:"spot",settleCoin:"USDT",kind:"Last",observedAt:"2026-10-20T11:59:00Z",expectedExchange:"Bybit",expectedCategory:"linear",expectedSettleCoin:"USDT"}),"OTHER_MARKET_CONTEXT_ONLY");
check("MO04 HTTP403 is not a price",evidence({httpStatus:403}),"NO_VALUE_SOURCE_ERROR");
check("MO05 R1 age16 not current",evidence({exchange:"Bybit",category:"linear",kind:"Last",observedAt:"2026-10-20T11:44:00Z"}),"HISTORICAL_ONLY");
check("MO06 R1 age15 only TTL passes",evidence({exchange:"Bybit",category:"linear",kind:"Last",observedAt:"2026-10-20T11:45:00Z"}),"AGE_PASSED_ONLY");
check("MO07 no observed time",evidence({exchange:"Bybit",category:"linear",kind:"Last",retrievedAt:"2026-10-20T12:00:00Z"}),"TIME_UNVERIFIED");
check("MO08 screenshot only user evidence",label(true),"USER_PROVIDED_NOT_INDEPENDENT");
check("MO09 spot and perp different",evidence({exchange:"Bybit",category:"spot",kind:"Mark",observedAt:"2026-10-20T11:59:00Z",expectedExchange:"Bybit",expectedCategory:"linear"}),"OTHER_MARKET_CONTEXT_ONLY");
check("MO10 mark volume not trade",doc.includes("Mark series не содержит сопоставимого торгового volume"),true);
check("MO11 open 1h candle excluded",candle({start:Date.parse("2026-10-20T11:30:00Z"),intervalMin:60,asOf:Date.parse("2026-10-20T12:00:00Z")}),"UNFINISHED");
check("MO12 EMA20 from one bar disallowed",indicator({n:20,bars:[100],warmup:true}),"INSUFFICIENT_WARMUP");
check("MO13 screenshot no datetime",evidence({exchange:"Bybit",category:"linear",kind:"Last"}),"TIME_UNVERIFIED");
check("MO14 R1 not T02",scope().requiresT02,false);
check("MO15 4h unavailable must disclose",doc.includes("4h "+BT+"NOT_CHECKED"+BT),true);
check("MO16 funding without unit",doc.includes("Funding указан без интервала и единицы"),true);
check("MO17 one OI point not trend",doc.includes("OI текущая точка одна"),true);
check("MO18 publication not event",doc.includes("Не заявлять событие свершившимся"),true);
check("MO19 third party heatmap not orders",doc.includes("third-party estimates"),true);
check("MO20 trade config not R1",doc.includes("R1 не выдаёт торговый конфиг"),true);
check("MO21 volatility invalidates TTL",evidence({exchange:"Bybit",category:"linear",kind:"Last",observedAt:"2026-10-20T11:59:00Z",event:true}),"RECHECK");
check("MO22 Last not Mark",doc.includes("Можно сообщить **только Last**"),true);
check("MO23 Skill not loaded explicitly",doc.includes(BT+"NOT_LOADED"+BT),true);
check("MO24 risk question separate",scope({needsRisk:true}).rt,"RT04");
// More fixture behavior including negative/edge cases.
check("R1 current verifies source Skill",scope({current:true}).skills.includes("data-verification"),true);
check("R1 noncurrent does not require verifier",scope().skills.length,1);
check("Bybit linear same identity",evidence({exchange:"Bybit",category:"linear",settleCoin:"USDT",kind:"Last",observedAt:"2026-10-20T11:59:00Z",expectedExchange:"Bybit",expectedCategory:"linear",expectedSettleCoin:"USDT"}),"AGE_PASSED_ONLY");
check("wrong settle coin",evidence({exchange:"Bybit",category:"linear",settleCoin:"USDC",kind:"Last",observedAt:"2026-10-20T11:59:00Z",expectedSettleCoin:"USDT"}),"OTHER_MARKET_CONTEXT_ONLY");
check("R1 age 0 still only TTL",evidence({exchange:"Bybit",category:"linear",kind:"Last",observedAt:"2026-10-20T12:00:00Z"}),"AGE_PASSED_ONLY");
check("future observation rejected",evidence({exchange:"Bybit",category:"linear",kind:"Last",observedAt:"2026-10-20T12:01:00Z"}),"CLOCK_CONFLICT");
check("missing exchange not confirmed",evidence({category:"linear",kind:"Mark",observedAt:"2026-10-20T11:59:00Z"}),"MARKET_UNVERIFIED");
check("older historical R1 still reportable",evidence({exchange:"Bybit",category:"linear",kind:"Last",observedAt:"2026-10-19T12:00:00Z"}),"HISTORICAL_ONLY");
check("incomplete candle invalid",candle({start:0,intervalMin:60,asOf:3600000,ohlc:{open:1,high:0.5,low:0.1,close:1}}),"OHLC_INVALID");
check("proper closed candle eligible",candle({start:0,intervalMin:60,asOf:3600000,ohlc:{open:1,high:2,low:0.5,close:1.5}}),"CLOSED_VALID");
check("unknown candle timestamp invalid",candle({start:NaN,intervalMin:60,asOf:3600000}),"TIME_UNVERIFIED");
check("no indicator warmup",indicator({n:20,bars:Array(30).fill(100),warmup:false}),"INSUFFICIENT_WARMUP");
check("warmed series does not invent numeric result",indicator({n:20,bars:Array(100).fill(100),warmup:true}),"ELIGIBLE_TO_CALCULATE_NOT_VALUE");
check("quote not independent when user provided",label(true),"USER_PROVIDED_NOT_INDEPENDENT");
check("RT01 no Skills",scope({intent:"definition"}).skills.length,0);
check("RT02 never AUTO READY",doc.includes("не торговые "+BT+"READY/REJECTED"+BT),true);
check("no private account requirement",doc.includes("Не требовать T02/T03/T04/T05/P02"),true);
check("R2 requires explicit promotion",doc.includes("отдельный R2"),true);
check("no implied API availability",doc.includes("неустановленный API"),true);
check("live Mark/Last distinctions",doc.includes(BT+"Last/Mark/Index"+BT),true);
check("R1 <=15 policy matches Skill",market.includes("15-minute")&&verify.includes("R1 ≤15 min"),true);
check("closed OHLCV rule from Skill",market.includes("Exclude the current unclosed bar"),true);
check("HTTP403 fallbacks per verifier",verify.includes("HTTP 403"),true);
check("dialogue RT02 R1",dialogue.includes("**RT02**")&&dialogue.includes("**R1**"),true);
check("plan 08.2 is market overview",plan.includes("**08.2 — краткий обзор R1**"),true);
check("no out-of-scope live trading",doc.includes("08.3 "+BT+"NOT STARTED"+BT),true);
for(let i=1;i<=5;i++){
 const id="P08-0"+i;
 check("prompt heading "+id,doc.includes("### "+id+" —"),true);
 const section=doc.split("### "+id+" —")[1]?.split("\n### ")[0]??"";
 check("prompt is copy-ready "+id,section.includes("> "),true);
 check("prompt has RT02 "+id,section.includes("RT02"),true);
 check("prompt remains R1 "+id,section.includes("R1"),true);
}
// Check the real documentation matrix, not only the fixture interpreter.
for(let i=1;i<=24;i++){
 const id="MO"+String(i).padStart(2,"0");
 const line=doc.split("\n").find(x=>x.startsWith("| "+id+" |"))||"";
 check("documented negative case "+id,line.split("|").length>=4,true);
}
function guard(body,id,necessary){
 const line=body.split("\n").find(x=>x.startsWith("| "+id+" |"))||"";
 return necessary.every(x=>line.includes(x));
}
const forbiddenMutation=doc.replace("Не подменять Bybit USDT Perpetual Spot-историей","Можно подменять Bybit USDT Perpetual Spot-историей");
check("market protection text present",doc.includes("Не подменять Bybit USDT Perpetual Spot-историей"),true);
check("mutation Spot substitution guard detects",forbiddenMutation.includes("Не подменять Bybit USDT Perpetual Spot-историей"),false);
const badMO04=doc.replace("| MO04 | Bybit V5 HTTP 403 | Ни одной придуманной котировки","| MO04 | Bybit V5 HTTP 403 | Разрешить придуманную котировку");
check("mutation negative row MO04 detected",guard(badMO04,"MO04",["Ни одной придуманной котировки"]),false);
check("negative row 04 default accurate",guard(doc,"MO04",["Ни одной придуманной котировки"]),true);
const badMO14=doc.replace("| MO14 | Обзор BTC и «обязательно Equity?» | Не требовать T02/T03/P02","| MO14 | Обзор BTC и «обязательно Equity?» | Требовать T02/T03/P02");
check("mutation T02 overcollection detected",guard(badMO14,"MO14",["Не требовать T02/T03/P02"]),false);
check("negative row 14 default accurate",guard(doc,"MO14",["Не требовать T02/T03/P02"]),true);
const refs=[...doc.matchAll(/\]\(([^)\s]+)\)/g)].map(m=>m[1]).filter(url=>!/^https?:\/\//.test(url)).map(url=>url.split("#")[0]).filter(Boolean);
check("at least ten internal sources",refs.length>=10,true);
check("every local relative reference exists",refs.every(p=>exists("docs/prompts/"+p)),true);
check("open RV preserved",["RV-02","RV-03","RV-04","RV-06","TV-01–TV-04","FR-038"].every(s=>doc.includes(s)),true);
const bad=tests.filter(t=>!t.pass);
for(const t of bad)console.error("FAIL",t.name,JSON.stringify({actual:t.actual,expected:t.expected}));
console.log(JSON.stringify({kind:"STAGE_08_02_MARKET_OVERVIEW_SYNTHETIC",total:tests.length,passed:tests.length-bad.length,failed:bad.length,normativeCases:24,prompts:5,inMemoryMutations:3,independentLLMTests:0,actualSkillRuntime:false,liveMarketPrices:false,tradeReady:false}));
if(bad.length)process.exitCode=1;
