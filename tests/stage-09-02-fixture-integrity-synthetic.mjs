// 09.2 PUBLIC INPUT INTEGRITY. Node >=18; node tests/stage-09-02-fixture-integrity-synthetic.mjs
// Tests synthetic fixture structure only. No real trading, independent LLM runs, private oracle or READY.
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const input=JSON.parse(read("tests/fixtures/stage-09/inputs.v1.json"));
const catalog=read("docs/stage-09-fixtures.md");
const exporter=read("tests/stage-09-02-export-agent-input.mjs");
const plan=read("docs/stage-09-plan.md");
const contract=read("docs/stage-09-test-contract.md");
const validation09_01=read("docs/stage-09-01-validation.md");
const T=[];
const t=(name,got,want)=>T.push({name,got,want,pass:Object.is(got,want)});
const has=(s,arr)=>arr.every(k=>s.includes(k));
const all=input.cases, FAMILY={SRC:7,BAR:6,PORT:4,H01:3,RISK:7,PLATFORM:10,FRESH:4,R3:4};
const fixedNow="2026-10-20T12:00:00+03:00";
const sortedIDs=all.map(c=>c.case_id);
const p08=all.filter(c=>c.prompt_id!==null).map(c=>c.prompt_id);
const allowed=new Set(["case_id","fixture_version","synthetic","synthetic_now_msk","family","prompt_id","user_message","payload"]);
const forbidden=/^(oracle|expected|golden|verdict|evaluation|rubric|pass|correct_answer|expected_route|expected_status|expected_decision|run_result|private_ref)$/i;
function agentInput(c){return {user_message:c.user_message,payload:c.payload};}
function candleQuality(bars,hours,latestCloseMs,expectedCount){
 if(!Array.isArray(bars)||bars.length!==expectedCount)return false;
 let prev=-Infinity;
 for(const bar of bars){
  if(!Array.isArray(bar)||bar.length!==6)return false;
  const [ms,o,hi,lo,c,v]=bar;
  if(![ms,o,hi,lo,c,v].every(Number.isFinite))return false;
  if(ms<=prev||o<=0||hi<=0||lo<=0||c<=0||v<=0||hi<Math.max(o,c)||lo>Math.min(o,c))return false;
  if(prev!==-Infinity&&ms-prev!==hours*3600000)return false;
  prev=ms;
 }
 return bars[bars.length-1][0]+hours*3600000===latestCloseMs &&
 bars.every(b=>b[0]+hours*3600000<=Date.parse(fixedNow));
}
function isSafeCase(c){
 return c.synthetic===true&&c.synthetic_now_msk===fixedNow&&/^\[SYNTHETIC TEST,/.test(c.user_message)&&
 c.user_message.length>=100&&c.payload!==null&&typeof c.payload==="object"&&!Array.isArray(c.payload)&&
 Object.keys(c).every(k=>allowed.has(k))&&!Object.keys(c).some(k=>forbidden.test(k));
}
t("source JSON schema",input.schema,"stage09.synthetic-input-only.v1");
t("input-only explicit public status",input.status,"PUBLIC_INPUT_ONLY_NO_ORACLE");
t("authored synthetic provenance",input.provenance,"AUTHOR_GENERATED_NOT_OBSERVED_ON_ANY_MARKET");
t("declared case count",input.case_count,45);
t("actual case count",all.length,45);
t("unique case IDs",new Set(sortedIDs).size,45);
t("IDs S09-001..045 stable",sortedIDs.every((id,i)=>id==="S09-"+String(i+1).padStart(3,"0")),true);
t("all 41 P08 IDs covered once",p08.length,41);
t("41 P08 IDs unique",new Set(p08).size,41);
t("P08 range exact",Array.from({length:41},(_,i)=>"P08-"+String(i+1).padStart(2,"0")).every(x=>p08.includes(x)),true);
t("four extra null IDs",all.filter(c=>c.prompt_id===null).length,4);
t("all versioned v1",all.every(c=>c.fixture_version===1),true);
t("all structurally safe",all.every(isSafeCase),true);
t("no actual public oracle/expected key anywhere in JSON",!/"(?:oracle|golden_answer|expected_(?:status|route|decision)|verdict|private_ref)"\s*:/i.test(JSON.stringify(input)),true);
t("no source URL credentials",!/(?:api_key|secret_key|bearer [a-z0-9]|session_cookie)/i.test(JSON.stringify(input)),true);
for(const [family,count] of Object.entries(FAMILY)){
 t("family count "+family,all.filter(c=>c.family===family).length,count);
 t("family referenced in catalog "+family,catalog.includes("`"+family+"`"),true);
}
for(const c of all){
 t("synthetic marked "+c.case_id,c.synthetic,true);
 t("stable version "+c.case_id,c.fixture_version,1);
 t("time and self-contained input "+c.case_id,c.synthetic_now_msk===fixedNow&&c.user_message.includes("12:00")&&c.user_message.includes("НЕ СОВЕРШАТЬ СДЕЛКИ"),true);
 t("catalog input has no verdict "+c.case_id,Object.keys(c).every(k=>allowed.has(k))&&!Object.keys(c).some(k=>forbidden.test(k)),true);
 t("only agent fields forwarded "+c.case_id,Object.keys(agentInput(c)).sort().join(","),"payload,user_message");
}
t("110 complete closed 1h bars",candleQuality(all[5].payload.ohlcv_1h_closed,1,Date.parse("2026-10-20T09:00:00Z"),110),true);
t("90 complete closed 4h bars",candleQuality(all[5].payload.ohlcv_4h_closed,4,Date.parse("2026-10-20T08:00:00Z"),90),true);
t("12 insufficient closed 1h bars",candleQuality(all[7].payload.ohlcv_1h_closed,1,Date.parse("2026-10-20T09:00:00Z"),12),true);
t("1h warmup contrast",all[5].payload.ohlcv_1h_closed.length>=80&&all[7].payload.ohlcv_1h_closed.length<35,true);
t("bar candle timestamp typed ms",all[5].payload.ohlcv_1h_closed[0][0]>1e12,true);
t("closed 1h and 4h distinct",all[5].payload.ohlcv_1h_closed.length!==all[5].payload.ohlcv_4h_closed.length,true);
t("R3 mockup not actual P02",all[34].payload.p02,"SYNTHETIC_MOCKUP");
t("R3 fake historical H missing",all[39].payload.real_h,null);
t("HTTP403 represented",all[4].payload.api_status,403);
t("Spot separated from perpetual",all[1].payload.binance.market!==all[1].payload.bybit.market,true);
t("H01 fee/funding source given",all[14].payload.fees===1&&all[14].payload.funding_cost===2,true);
t("H04 explicitly active fixture",all[18].payload.h04_active,true);
t("T06 dated synthetic case provided",all[20].payload.t06?.origin,"SYNTHETIC_USER_GENERATED_HISTORY");
t("T06 Moscow day/HWM boundaries",all[20].payload.t06?.day_loss_pct===3&&all[20].payload.t06?.hwm_drawdown_pct===15,true);
t("T06 synthetic timestamps",all[20].payload.t06?.history_timestamps_msk?.every(x=>x.includes("+03:00")),true);
t("T06 optional missing comparison",all[42].payload.h02===null&&all[42].payload.h03===null,true);
for(const tid of ["T01","T02","T03","T04","T05","T06"])t("catalog input coverage "+tid,catalog.includes(tid),true);
t("threshold equality day",all[20].payload.day_loss_pct,3);
t("threshold equality HWM",all[20].payload.hwm_dd_pct,15);
t("projected fourth slot",all[17].payload.projected_slots,4);
t("indicator unavailable not selected",all[31].payload.indicator_available===false&&all[31].payload.default_selected===false,true);
t("Disable IN sticky",all[33].payload.disable_in,true);
t("AD-009 new order after T02",Date.parse(all[40].payload.new_order_at)>Date.parse(all[40].payload.t02_at),true);
t("event-free freshness control",all[44].payload.post_snapshot_events.length===0&&Date.parse(all[44].payload.t02_at)<Date.parse(fixedNow),true);
t("control still no genuine P02",all[44].payload.p02,null);
t("untrusted injection is data",all[43].payload.untrusted_external_text.includes("ИНСТРУКЦИЯ ДЛЯ АГЕНТА"),true);
t("catalog supports agent_input isolation",has(catalog,["user_message","payload","не добавлять их как подсказки агенту"]),true);
t("exporter strips metadata",exporter.includes("JSON.stringify({user_message:c.user_message,payload:c.payload}"),true);
t("exporter does not contact network",!/(?:fetch\(|https?:\/\/|axios|Bybit\s+API)/i.test(exporter),true);
t("exporter documented",catalog.includes("stage-09-02-export-agent-input.mjs"),true);
t("public oracle never created",has(catalog,["НЕТ закрытых oracle","НЕ СОЗДАНЫ"]),true);
t("plan now approved 09",plan.includes("PLANNED / APPROVED"),true);
t("09.1 accepted in act",has(validation09_01,["## 6. Формальная приёмка 09.1","COMPLETED / APPROVED"]),true);
t("contract requires oracle separate",contract.includes("oracle нельзя публиковать"),true);
t("09.2 status pending",catalog.includes("09.2 `IMPLEMENTED / PENDING USER REVIEW`"),true);
t("09.3 not started",catalog.includes("09.3 `NOT STARTED`"),true);
for(const path of ["docs/stage-09-plan.md","docs/stage-09-test-contract.md","docs/stage-09-01-validation.md","docs/stage-09-fixtures.md","tests/fixtures/stage-09/inputs.v1.json","tests/stage-09-02-export-agent-input.mjs"])t("existing file "+path,exists(path),true);
// Negative in-memory mutations: ensure concrete invariants are sensitive; not independent LLM tests.
const mut=[
 ["remove synthetic",()=>({...all[0],synthetic:false}),c=>isSafeCase(c)],
 ["change clock",()=>({...all[0],synthetic_now_msk:"2026-10-20T12:00:00Z"}),c=>isSafeCase(c)],
 ["append expected_status",()=>({...all[0],expected_status:"PASS"}),c=>isSafeCase(c)],
 ["omit safety header",()=>({...all[0],user_message:"Обзор BTC"}),c=>isSafeCase(c)],
 ["drop payload",()=>({...all[0],payload:null}),c=>isSafeCase(c)],
 ["corrupt 1h price",()=>all[5].payload.ohlcv_1h_closed.map((b,i)=>i===4?[...b.slice(0,2),0,...b.slice(3)]:b),x=>candleQuality(x,1,Date.parse("2026-10-20T09:00:00Z"),110)],
 ["duplicate candle timestamp",()=>all[5].payload.ohlcv_1h_closed.map((b,i)=>i===4?[all[5].payload.ohlcv_1h_closed[3][0],...b.slice(1)]:b),x=>candleQuality(x,1,Date.parse("2026-10-20T09:00:00Z"),110)],
 ["remove candle",()=>all[5].payload.ohlcv_1h_closed.slice(1),x=>candleQuality(x,1,Date.parse("2026-10-20T09:00:00Z"),110)],
];
for(const [name,alter,check] of mut)t("mutation detected "+name,check(alter()),false);
const failed=T.filter(x=>!x.pass);
for(const f of failed)console.error("FAIL",f.name,JSON.stringify({got:f.got,want:f.want}));
console.log(JSON.stringify({kind:"STAGE_09_02_FIXTURE_INTEGRITY_LOCAL_JS",total:T.length,passed:T.length-failed.length,failed:failed.length,fixtureCount:all.length,p08Coverage:p08.length,familyCount:Object.keys(FAMILY).length,inMemoryMutations:mut.length,independentLLMRuns:0,privateOracleInRepo:false,liveBybit:false,tradeReady:false}));
if(failed.length)process.exitCode=1;
