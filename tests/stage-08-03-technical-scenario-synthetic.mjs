// Stage 08.3: Node >=18; node tests/stage-08-03-technical-scenario-synthetic.mjs
// Synthetic, deterministic examples and checks against *actual* Markdown contract.
// No live quotes, Bybit API, ChatGPT Skill auto-loading, bot execution or trading READY.
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const doc=read("docs/prompts/technical-scenario.md");
const plan=read("docs/stage-08-plan.md");
const market=read(".agents/skills/market-analysis/SKILL.md");
const verify=read(".agents/skills/data-verification/SKILL.md");
const strategy=read(".agents/skills/strategy-planning/SKILL.md");
const dialogue=read("docs/workflows/interaction-contract.md");
const tick=String.fromCharCode(96),checks=[];
function t(label,actual,want){checks.push({id:"TS-T"+String(checks.length+1).padStart(3,"0"),label,actual,want,pass:Object.is(actual,want)});}
const has=(s,parts)=>parts.every(x=>s.includes(x));
function route({intent="technical",position=false,averaging=false,risk=false,final=false}={}){
 if(final)return {rt:"RT09",mode:"R3",skills:["data-verification","portfolio-analysis","risk-assessment"],needsPortfolio:true};
 if(intent==="overview")return {rt:"RT02",mode:"R1",skills:["market-analysis"],needsPortfolio:false};
 const needs=position||averaging||risk;
 return {rt:"RT03",mode:"R2",skills:["data-verification","market-analysis",...(needs?["portfolio-analysis","risk-assessment"]:[]),"strategy-planning"],needsPortfolio:needs};
}
function price({expectedExchange="Bybit",expectedCategory="linear",expectedSettleCoin="USDT",exchange,category,settleCoin,kind,observedAt,retrievedAt,now="2026-10-20T12:00:00Z",event=false,httpStatus=200}={}){
 if(httpStatus!==200)return "NO_PRICE_HTTP_ERROR";
 if(exchange!==expectedExchange||category!==expectedCategory||settleCoin!==expectedSettleCoin)return "WRONG_MARKET";
 if(!["Last","Mark","Index"].includes(kind))return "WRONG_PRICE_KIND";
 if(!observedAt||!Number.isFinite(Date.parse(observedAt)))return "TIME_UNVERIFIED";
 const delta=(Date.parse(now)-Date.parse(observedAt))/60000;
 if(delta<0)return "CLOCK_CONFLICT";
 if(event)return "RECHECK_AD009";
 return delta>5?"STALE_R2":"TTL_ONLY";
}
const quote={exchange:"Bybit",category:"linear",settleCoin:"USDT",kind:"Last",observedAt:"2026-10-20T11:56:00Z"};
const bar=(start,open=100,high=104,low=98,close=102)=>({start,open,high,low,close,volume:50,turnover:5000});
function candles({rows=[],intervalMs=3600000,asOf=Date.parse("2026-10-20T12:10:00Z"),minClosed=1}={}){
 if(!Number.isFinite(intervalMs)||intervalMs<=0||!Number.isFinite(asOf))return {state:"TIME_UNVERIFIED",closed:0};
 const sorted=[...rows].sort((a,b)=>a.start-b.start);
 const seen=new Set();
 for(const b of sorted){
  if(!Number.isFinite(b.start)||b.start<0)return {state:"TIME_UNVERIFIED",closed:0};
  if(seen.has(b.start))return {state:"DUPLICATE",closed:0};
  seen.add(b.start);
  if(![b.open,b.high,b.low,b.close,b.volume,b.turnover].every(Number.isFinite)||b.open<=0||b.close<=0||b.low<=0||b.high<=0||b.volume<0||b.turnover<0||b.low>Math.min(b.open,b.close)||b.high<Math.max(b.open,b.close))return {state:"OHLC_INVALID",closed:0};
  if(b.start%intervalMs!==0)return {state:"MISALIGNED",closed:0};
 }
 const closed=sorted.filter(b=>b.start+intervalMs<=asOf);
 const expected=Math.floor(asOf/intervalMs)*intervalMs-intervalMs;
 if(!closed.length||closed.at(-1).start!==expected)return {state:"MISSING_LAST_CLOSED",closed:closed.length};
 if(closed.some((b,i)=>i>0&&b.start-closed[i-1].start!==intervalMs))return {state:"GAP",closed:closed.length};
 if(closed.length<minClosed)return {state:"INSUFFICIENT_HISTORY",closed:closed.length};
 return {state:"CLOSED_VALID",closed:closed.length,excluded:sorted.length-closed.length};
}
function indicator({type="EMA",period=20,count=0,warmup=false,method=false,closed=true,prevClose=true}={}){
 if(!closed)return "OPEN_BAR_NOT_ALLOWED";
 if(type==="ATR"&&!prevClose)return "PREV_CLOSE_REQUIRED";
 if(!Number.isInteger(period)||period<2||count<period||!warmup||!method)return "NOT_CHECKED";
 return "INPUT_ELIGIBLE_NO_DERIVED_VALUE";
}
function outcome({confirmedOHLCV=false,fresh=false,marketOk=false,knownH04=false,increasesRisk=false}={}){
 if(knownH04&&increasesRisk)return "REJECTED_NEW_RISK";
 if(!confirmedOHLCV||!fresh||!marketOk)return "QUALITATIVE_ONLY_NO_LEVELS";
 return "CONDITIONAL_LEVELS_ONLY_NO_READY";
}
const base=Date.parse("2026-10-20T10:00:00Z"),ms=3600000;
const rows=[bar(base+ms),bar(base),bar(base+2*ms)];
// TS01–TS36 directly correspond to normative cases; these are only fixture checks, NOT LLM runs.
t("TS01 RT03 R2",route().rt+" "+route().mode,"RT03 R2");
t("TS02 T01 provided not required again",has(doc,["не перепрашивать","T01"] ),true);
t("TS03 no unconditional T02",route().needsPortfolio,false);
t("TS04 position/ADD adds risk",route({position:true,averaging:true}).skills.includes("risk-assessment"),true);
t("TS05 HTTP403 no price",price({...quote,httpStatus:403}),"NO_PRICE_HTTP_ERROR");
t("TS06 Spot substituted",price({...quote,exchange:"Binance",category:"spot"}),"WRONG_MARKET");
t("TS07 user-supplied source not independent",has(doc,["USER_PROVIDED / NOT_INDEPENDENTLY_VERIFIED"]),true);
t("TS08 latest unfinished excluded",candles({rows,minClosed:2}).excluded,1);
t("TS09 Bybit reverse chronological sorts",candles({rows,minClosed:2}).state,"CLOSED_VALID");
t("TS10 duplicates invalid",candles({rows:[bar(base),bar(base),bar(base+ms)],minClosed:2}).state,"DUPLICATE");
t("TS11 impossible OHLC",candles({rows:[bar(base),bar(base+ms,100,104,103,102)]}).state,"OHLC_INVALID");
t("TS12 missing expected closed",candles({rows:[bar(base)]}).state,"MISSING_LAST_CLOSED");
t("TS13 gap",candles({rows:[bar(base-ms),bar(base+ms)],minClosed:2}).state,"GAP");
t("TS14 EMA warmup insufficient",indicator({type:"EMA",period:20,count:5,warmup:true,method:true}),"NOT_CHECKED");
t("TS15 RSI method required",indicator({type:"RSI",period:14,count:60,warmup:true,method:false}),"NOT_CHECKED");
t("TS16 ATR prevClose required",indicator({type:"ATR",period:14,count:100,warmup:true,method:true,prevClose:false}),"PREV_CLOSE_REQUIRED");
t("TS17 divergent timeframes MIXED",doc.includes("**конфликт таймфреймов**"),true);
t("TS18 missing 4h NOT_CHECKED",doc.includes("4h "+tick+"NOT_CHECKED"+tick),true);
t("TS19 no candles no exact levels",outcome({}),"QUALITATIVE_ONLY_NO_LEVELS");
t("TS20 false precision forbidden",doc.includes("никакой ложной точности"),true);
t("TS21 Long must specify invalidation",doc.includes("**Инвалидация**"),true);
t("TS22 adverse Short path",doc.includes("**Неблагоприятное развитие**"),true);
t("TS23 no indicators from Last alone",indicator({count:1,period:14,warmup:false,method:false}),"NOT_CHECKED");
t("TS24 price age6 stale",price({...quote,observedAt:"2026-10-20T11:54:00Z"}),"STALE_R2");
t("TS25 price age5 only TTL",price({...quote,observedAt:"2026-10-20T11:55:00Z"}),"TTL_ONLY");
t("TS26 event invalidates",price({...quote,event:true}),"RECHECK_AD009");
t("TS27 retrieval not observation",price({...quote,observedAt:null,retrievedAt:"2026-10-20T12:00:00Z"}),"TIME_UNVERIFIED");
t("TS28 Mark volume not traded",doc.includes("Mark-price Kline")&&doc.includes("не даёт сопоставимого биржевого объёма"),true);
t("TS29 funding unit",doc.includes("funding interval + unit"),true);
t("TS30 OI single observation",doc.includes("OI timestamp + definition"),true);
t("TS31 BTC matched windows",doc.includes("BTC сравнивают по разным окнам"),true);
t("TS32 chosen Short not auto Long",doc.includes("Не выдавать Long как автоматически выбранную сделку"),true);
t("TS33 known H04 veto",outcome({confirmedOHLCV:true,fresh:true,marketOk:true,knownH04:true,increasesRisk:true}),"REJECTED_NEW_RISK");
t("TS34 no bot commands",doc.includes("Не совершать сделки/бота"),true);
t("TS35 don't invent 1d",doc.includes("запрошенные/полученные TF"),true);
t("TS36 project acceptance not trading",doc.includes("Не считать выбором платформы/сделки"),true);
// Additional verification of source *text* and edge cases, not independent live execution.
for(let i=6;i<=11;i++){
 const id="P08-"+String(i).padStart(2,"0"),section=doc.split("### "+id+" —")[1]?.split("\n### ")[0]||"";
 t("prompt "+id+" exists",section.length>90,true);
 t("prompt "+id+" user message",section.includes("> "),true);
 t("prompt "+id+" routing",section.includes("**Маршрут:**"),true);
}
for(let i=1;i<=36;i++)t("normative row TS"+String(i).padStart(2,"0"),doc.split("\n").some(s=>s.startsWith("| TS"+String(i).padStart(2,"0")+" |")),true);
for(const item of ["data-verification","market-analysis","strategy-planning"])t("RT03 source dependency "+item,has(doc,["RT03",item]),true);
for(const x of ["FR-012–FR-017","FR-041–FR-046","R2","15m","1h","4h","1d","F/A/H/R","RT03","RT10","RECHECK","NOT_LOADED","PARTIAL","OHLCV","Wilder","ATR","startTime","observed_at","retrieved_at","WAIT","H04","READY","08.4 "+tick+"NOT STARTED"+tick])t("contract source "+x,doc.includes(x),true);
for(const [p,body,words] of [
 ["market skill",market,["Exclude the current unclosed bar","reverse-sorted","SMA","RSI","ATR","warm-up"]],
 ["data verification skill",verify,["HTTP 403","R2 ≤5 min","data-verification"]],
 ["strategy skill",strategy,["R2","WAIT","H04","FR-027–FR-040"]],
 ["dialogue contract",dialogue,["RT03","RT10","data-verification","strategy-planning"]]
])t("trace to "+p,has(body,words),true);
t("plan identifies 08.3",plan.includes("**08.3 — предварительный сценарий R2**"),true);
t("5m boundary but not proof",outcome({confirmedOHLCV:true,fresh:true,marketOk:true}),"CONDITIONAL_LEVELS_ONLY_NO_READY");
t("cannot extend 5m with retrieval",price({...quote,observedAt:"2026-10-20T11:50:00Z",retrievedAt:"2026-10-20T12:00:00Z"}),"STALE_R2");
t("price from future clock rejected",price({...quote,observedAt:"2026-10-20T12:01:00Z"}),"CLOCK_CONFLICT");
t("wrong settle coin rejected",price({...quote,settleCoin:"USDC"}),"WRONG_MARKET");
t("different price kind rejected",price({...quote,kind:"SpotLast"}),"WRONG_PRICE_KIND");
t("not enough closed count",candles({rows,minClosed:3}).state,"INSUFFICIENT_HISTORY");
t("still open 1h row excluded",candles({rows,minClosed:2}).closed,2);
t("incorrect start alignment",candles({rows:[bar(base+1000),bar(base+ms)]}).state,"MISALIGNED");
t("valid series not numerical indicators",indicator({period:20,count:80,method:true,warmup:true}),"INPUT_ELIGIBLE_NO_DERIVED_VALUE");
t("open bar invalid for EMA",indicator({period:20,count:100,method:true,warmup:true,closed:false}),"OPEN_BAR_NOT_ALLOWED");
t("no excess T02",doc.includes("не требует автоматически полного приватного T02/P02"),true);
t("no future bot configuration",doc.includes("**не** торговый движок")||doc.includes("без допуска сделки"),true);
// Hard source-bound row contracts: mutations must fail even when test fixture functions stay unchanged.
function row(body,id){return body.split("\n").find(x=>x.startsWith("| "+id+" |"))||"";}
const pinned={
 TS03:["Не требовать полный приватный T02/P02"],
 TS05:["Не придумывать Bybit Last/Mark/OHLCV"],
 TS06:["Не подменять spot и perp"],
 TS08:["Исключить unclosed candle"],
 TS12:["NEEDS_DATA"],
 TS17:["MIXED"],
 TS19:["Нет числовых entry/SL/TP/IN/grid"],
 TS24:["STALE"],
 TS25:["только age gate"],
 TS26:["RECHECK"],
 TS27:["TIME_UNVERIFIED"],
 TS33:["REJECTED"],
 TS34:["Не совершать сделки/бота"],
 TS36:["Не считать выбором платформы/сделки"]
};
for(const [id,parts] of Object.entries(pinned))t("source exact "+id,has(row(doc,id),parts),true);
const mutations=[
 ["TS05", "Не придумывать Bybit Last/Mark/OHLCV","Разрешено придумывать Bybit Last/Mark/OHLCV"],
 ["TS06", "Не подменять spot и perp","Можно подменять spot и perp"],
 ["TS19", "Нет числовых entry/SL/TP/IN/grid","Есть числовые entry/SL/TP/IN/grid без OHLCV"],
 ["TS33", "REJECTED","READY"],
 ["TS34", "Не совершать сделки/бота","Разрешено совершать сделки/бота"]
];
for(const [id,needle,repl] of mutations){
 const old=row(doc,id);
 if(!old.includes(needle))throw Error("Mutation fixture missing expected source "+id);
 const candidate=doc.replace(old,old.replace(needle,repl));
 t("in-memory mutation detected "+id,has(row(candidate,id),pinned[id]),false);
}
const links=[...doc.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/i.test(x)).map(x=>x.split("#")[0]).filter(Boolean);
t("source reference count sufficient",links.length>=12,true);
t("all relative source targets exist",links.every(x=>exists("docs/prompts/"+x)),true);
t("status pending",doc.includes(tick+"IMPLEMENTED / PENDING USER REVIEW"+tick),true);
t("no real READY proof claimed",doc.includes("R2 ≠ R3"),true);
const failed=checks.filter(x=>!x.pass);
for(const x of failed)console.error("FAIL",x.id,x.label,JSON.stringify({actual:x.actual,want:x.want}));
console.log(JSON.stringify({kind:"STAGE_08_03_R2_TECHNICAL_SYNTHETIC",total:checks.length,passed:checks.length-failed.length,failed:failed.length,normativeScenarios:36,copyablePrompts:6,inMemoryMutations:mutations.length,independentLLMTests:0,nodeCheckoutVerified:false,liveBybit:false,ready:false}));
if(failed.length)process.exitCode=1;
