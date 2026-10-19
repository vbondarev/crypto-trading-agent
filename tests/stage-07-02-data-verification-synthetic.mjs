// Synthetic verification cases for actual GitHub Skill 07.2. No Bybit API, orders or live READY.
// Node >=18: node tests/stage-07-02-data-verification-synthetic.mjs
import { readFileSync, existsSync } from "node:fs";
const skillText=readFileSync(new URL("../.agents/skills/data-verification/SKILL.md",import.meta.url),"utf8");
const skillUrl=new URL("../.agents/skills/data-verification/SKILL.md",import.meta.url);

function frontmatter(s){
 const l=s.split("\n"),end=l.indexOf("---",1);
 if(l[0]!=="---"||end<2)return {ok:false,error:"NO_FRONTMATTER"};
 const props={};
 for(const line of l.slice(1,end)){
  const m=line.match(/^([a-z-]+): (.+)$/);
  if(!m)return {ok:false,error:"COMPLEX_YAML_NOT_VALIDATED"};
  if(Object.hasOwn(props,m[1]))return {ok:false,error:"DUPLICATE"};
  props[m[1]]=m[2];
 }
 const ok=props.name==="data-verification" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(props.name) && props.name.length<=64 && props.description?.length>=1 && props.description.length<=1024 && l.slice(end+1).join("\n").trim().length>0;
 return {ok,fields:props,error:ok?null:"INVALID"};
}
function dataAge({observedAt=null,responseTime=null,retrievedAt=null,snapshotAt=null},now){
 const basis=observedAt||responseTime||snapshotAt;
 if(!basis)return {status:"TIME_UNVERIFIED",minutes:null,basis:null};
 const parsed=Date.parse(basis);
 const n=Date.parse(now);
 if(!Number.isFinite(parsed)||!Number.isFinite(n))return {status:"TIME_UNVERIFIED",minutes:null,basis:null};
 if(parsed>n+30000)return {status:"CLOCK_CONFLICT",minutes:null,basis:"FUTURE"};
 return {status:"TIME_PRESENT",minutes:(n-parsed)/60000,basis:observedAt?"observed_at":responseTime?"response_time_PROXY":"snapshot_at"};
}
function correctIdentity(obs,need){
 for(const k of ["exchange","symbol","category"]){if(!obs[k])return "IDENTITY_INCOMPLETE";}
 if(obs.exchange!==need.exchange||obs.symbol!==need.symbol||obs.category!==need.category)return "MARKET_MISMATCH";
 if(need.priceKind&&obs.priceKind!==need.priceKind)return "PRICE_KIND_MISMATCH";
 return "IDENTITY_MATCH";
}
function maxAge(kind,mode,critical=true){
 const cfg={price:{R1:15,R2:5,R3:2},orderbook:{R1:.5,R2:.5,R3:.5},oi:{R1:15,R2:15,R3:critical?15:null},funding:{R1:30,R2:30,R3:critical?10:null},instrument:{R1:10080,R2:10080,R3:1440},portfolio:{R1:null,R2:null,R3:5}};
 return cfg[kind]?.[mode]??null;
}
function quality({metric,mode,source,now,mandatory=true,accountComplete=true,changed=false,market=null,requirePriceKind=null,highVol=false}){
 if(!mandatory)return "OPTIONAL_NO_READY_IMPLICATION";
 if(!source||source.value===null||source.value===undefined)return "NEEDS_DATA";
 if(market){
  const id=correctIdentity(source,{...market,priceKind:requirePriceKind});
  if(id!=="IDENTITY_MATCH")return "UNVERIFIED";
 }
 if(changed)return "STALE_EVENT_INVALIDATION";
 const age=dataAge(source,now);
 if(age.status==="CLOCK_CONFLICT")return "UNVERIFIED";
 if(age.status!=="TIME_PRESENT")return "NEEDS_DATA_TIME";
 if(metric==="portfolio"&&mode==="R3"&&!accountComplete)return "NEEDS_DATA_FULL_ACCOUNT";
 const ttl=maxAge(metric,mode,true);
 if(ttl===null)return "NO_GENERIC_TTL";
 if(age.minutes>ttl)return "STALE_TTL";
 if(highVol)return "NEEDS_ADAPTIVE_REFRESH";
 return age.basis==="response_time_PROXY"?"TIME_PROXY_CONDITIONAL":"DATA_FRESHNESS_CHECK_ONLY";
}
function closedBar({startTimeMs,intervalMin,referenceMs,expectedLastCloseMs}){
 const close=startTimeMs+intervalMin*60000;
 if(close>referenceMs)return "OPEN_BAR";
 if(expectedLastCloseMs!==null&&close<expectedLastCloseMs)return "LAST_EXPECTED_CLOSED_BAR_MISSING";
 return "CLOSED_BAR_TIME_ONLY";
}
function screenshotProof({sourceType="user_screenshot",exchangeSeen=true,marketSeen=true,snapshotAt=null,independent=false}){
 if(!exchangeSeen||!marketSeen)return "MARKET_NOT_PROVED";
 if(!snapshotAt)return "TIME_UNVERIFIED";
 if(sourceType==="user_screenshot"&&!independent)return "USER_EVIDENCE_NOT_INDEPENDENT";
 return "SOURCE_LABELED_NEEDS_OTHER_CHECKS";
}
function errorScope(code){return code===403?"ROUTE_UNAVAILABLE_NOT_GLOBAL_BYBIT_DOWN":"OTHER_ERROR";}
function fallbackAllowed(obs,requested){
 return correctIdentity(obs,requested)==="IDENTITY_MATCH"?"SAME_MARKET_CANDIDATE_NOT_PROVED_FRESH":"INCOMPATIBLE_FALLBACK";
}
function nextTemplates(task){return ({market:["T01"],position:["T01","T02","T03"],bot:["T01","T02","T03","T04"],recovery:["T01","T02","T03","T05"],r3:["T01","T02","T03","T04"],education:[]})[task]??[];}
function missingHistory(h02,h03,h04){if(h04)return "REJECTED_NEW_RISK";if(!h02||!h03)return "H02_H03_NOT_CHECKED";return "HISTORY_SUPPLIED_NOT_READY";}
function p02Check({p01=false,p02=false,version=false,selected=false}){return !p01?"P01_NOT_READ":!selected?"PLATFORM_NOT_SELECTED":!p02||!version?"P02_NEEDS_DATA":"P02_EVIDENCE_ONLY_NOT_READY";}
function classDecision({hard=false,unverified=false,missing=false,allPass=false}){return hard?"REJECTED":unverified?"UNVERIFIED":missing?"NEEDS_DATA":allPass?"DATA_CHECK_PASSED_NOT_READY":"CONTEXT_ONLY";}
function normStatus(s){return s==="DATA_CHECK_PASSED_NOT_READY"?"NOT_FINAL_READY":s;}
const now="2026-10-19T10:00:00Z";
const need={exchange:"Bybit",symbol:"SOLUSDT",category:"linear",priceKind:"Mark"};
const bybit={exchange:"Bybit",symbol:"SOLUSDT",category:"linear",priceKind:"Mark",value:100,observedAt:"2026-10-19T09:59:00Z"};
const cases=[];
function t(label,actual,expect){const id="DV"+String(cases.length+1).padStart(2,"0");cases.push({id,label,actual,expect,pass:Object.is(actual,expect)});}
t("frontmatter name and description valid",frontmatter(skillText).ok,true);
t("name exact",frontmatter(skillText).fields.name,"data-verification");
t("description mentions validation",frontmatter(skillText).fields.description.includes("Verify"),true);
t("no invented allowed tools field",frontmatter(skillText).fields["allowed-tools"],undefined);
t("when apply documented",skillText.includes("## When to use"),true);
t("when not apply documented",skillText.includes("## When *not* to use"),true);
t("R1 R2 R3 distinct",["R1","R2","R3"].every(q=>skillText.includes(q)),true);
t("approved reference docs are cited",skillText.includes("../../../docs/data-freshness.md"),true);
t("no real READY explicitly",skillText.includes("DATA_CHECK_PASSED_NOT_READY"),true);
t("avoid credentials explicitly",skillText.includes("Never:")&&skillText.includes("publish keys"),true);
t("primary Bybit Mark correct",correctIdentity(bybit,need),"IDENTITY_MATCH");
t("Binance Spot cannot substitute",correctIdentity({...bybit,exchange:"Binance",category:"spot"},need),"MARKET_MISMATCH");
t("wrong symbol rejected",correctIdentity({...bybit,symbol:"BTCUSDT"},need),"MARKET_MISMATCH");
t("Bybit Last not Mark",correctIdentity({...bybit,priceKind:"Last"},need),"PRICE_KIND_MISMATCH");
t("exchange missing",correctIdentity({...bybit,exchange:null},need),"IDENTITY_INCOMPLETE");
t("R1 price threshold 15",maxAge("price","R1"),15);
t("R2 price threshold 5",maxAge("price","R2"),5);
t("R3 price threshold 2",maxAge("price","R3"),2);
t("R3 full portfolio 5",maxAge("portfolio","R3"),5);
t("R1 no portfolio TTL",maxAge("portfolio","R1"),null);
t("funding R1 30",maxAge("funding","R1"),30);
t("funding R3 10 when material",maxAge("funding","R3",true),10);
t("funding R3 irrelevant optional",maxAge("funding","R3",false),null);
t("OI relevant R3 15",maxAge("oi","R3",true),15);
t("order book thirty seconds",maxAge("orderbook","R3"),.5);
t("instrument R3 24 hours",maxAge("instrument","R3"),1440);
t("instrument R1 conditional 7 days",maxAge("instrument","R1"),10080);
t("R3 at 1 minute passes freshness only",quality({metric:"price",mode:"R3",source:bybit,market:need,requirePriceKind:"Mark",now}),"DATA_FRESHNESS_CHECK_ONLY");
t("R3 price 3 minutes stale",quality({metric:"price",mode:"R3",source:{...bybit,observedAt:"2026-10-19T09:57:00Z"},market:need,requirePriceKind:"Mark",now}),"STALE_TTL");
t("R2 price 5 minutes inclusive",quality({metric:"price",mode:"R2",source:{...bybit,observedAt:"2026-10-19T09:55:00Z"},market:need,now}),"DATA_FRESHNESS_CHECK_ONLY");
t("R2 price 6 minutes stale",quality({metric:"price",mode:"R2",source:{...bybit,observedAt:"2026-10-19T09:54:00Z"},market:need,now}),"STALE_TTL");
t("R1 price 15 min inclusive",quality({metric:"price",mode:"R1",source:{...bybit,observedAt:"2026-10-19T09:45:00Z"},market:need,now}),"DATA_FRESHNESS_CHECK_ONLY");
t("R1 price 16 min stale for current claim",quality({metric:"price",mode:"R1",source:{...bybit,observedAt:"2026-10-19T09:44:00Z"},market:need,now}),"STALE_TTL");
t("R3 T02 five min inclusive",quality({metric:"portfolio",mode:"R3",source:{value:"synthetic",snapshotAt:"2026-10-19T09:55:00Z"},now,accountComplete:true}),"DATA_FRESHNESS_CHECK_ONLY");
t("R3 portfolio six minutes stale",quality({metric:"portfolio",mode:"R3",source:{value:"synthetic",snapshotAt:"2026-10-19T09:54:00Z"},now,accountComplete:true}),"STALE_TTL");
t("R3 account partial even recent",quality({metric:"portfolio",mode:"R3",source:{value:"synthetic",snapshotAt:"2026-10-19T09:59:00Z"},now,accountComplete:false}),"NEEDS_DATA_FULL_ACCOUNT");
t("event fill invalidates recent T02",quality({metric:"portfolio",mode:"R3",source:{value:"synthetic",snapshotAt:"2026-10-19T09:59:00Z"},now,changed:true}),"STALE_EVENT_INVALIDATION");
t("high volatility refresh earlier",quality({metric:"price",mode:"R3",source:bybit,now,highVol:true}),"NEEDS_ADAPTIVE_REFRESH");
t("price unavailable",quality({metric:"price",mode:"R3",source:null,now}),"NEEDS_DATA");
t("only retrieved_at not observed_at",quality({metric:"price",mode:"R3",source:{value:100,retrievedAt:"2026-10-19T09:59:00Z"},now}),"NEEDS_DATA_TIME");
t("retrieval doesn't rejuvenate screenshot",dataAge({snapshotAt:"2026-10-18T10:00:00Z",retrievedAt:"2026-10-19T09:59:00Z"},now).minutes,1440);
t("future timestamp clock conflict",dataAge({observedAt:"2026-10-19T10:05:00Z"},now).status,"CLOCK_CONFLICT");
t("response_time explicit proxy only",dataAge({responseTime:"2026-10-19T09:59:00Z"},now).basis,"response_time_PROXY");
t("R3 response_time not source observed",quality({metric:"price",mode:"R3",source:{value:100,responseTime:"2026-10-19T09:59:00Z"},now}),"TIME_PROXY_CONDITIONAL");
t("current bar is open",closedBar({startTimeMs:0,intervalMin:5,referenceMs:4*60000,expectedLastCloseMs:null}),"OPEN_BAR");
t("closed older bar misses latest expected close",closedBar({startTimeMs:0,intervalMin:5,referenceMs:15*60000,expectedLastCloseMs:15*60000}),"LAST_EXPECTED_CLOSED_BAR_MISSING");
t("latest expected closed",closedBar({startTimeMs:10*60000,intervalMin:5,referenceMs:15*60000,expectedLastCloseMs:15*60000}),"CLOSED_BAR_TIME_ONLY");
t("user screenshot no independent proof",screenshotProof({snapshotAt:"2026-10-19T09:59:00Z"}),"USER_EVIDENCE_NOT_INDEPENDENT");
t("undated screenshot not fresh",screenshotProof({snapshotAt:null}),"TIME_UNVERIFIED");
t("screenshot market omitted",screenshotProof({marketSeen:false,snapshotAt:"2026-10-19T09:59:00Z"}),"MARKET_NOT_PROVED");
t("403 is route scoped",errorScope(403),"ROUTE_UNAVAILABLE_NOT_GLOBAL_BYBIT_DOWN");
t("other error not 403",errorScope(503),"OTHER_ERROR");
t("Binance Spot fallback disallowed",fallbackAllowed({...bybit,exchange:"Binance",category:"spot"},need),"INCOMPATIBLE_FALLBACK");
t("proper same market fallback only candidate",fallbackAllowed(bybit,need),"SAME_MARKET_CANDIDATE_NOT_PROVED_FRESH");
t("education no templates required",nextTemplates("education").length,0);
t("market T01 only",nextTemplates("market").join(","),"T01");
t("R3 minimum T01/T02/T03/T04",nextTemplates("r3").join(","),"T01,T02,T03,T04");
t("recovery requires H01 template",nextTemplates("recovery").includes("T05"),true);
t("unavailable H02/H03 not alone hard fail",missingHistory(false,false,false),"H02_H03_NOT_CHECKED");
t("confirmed H04 stops new risk",missingHistory(false,false,true),"REJECTED_NEW_RISK");
t("P01 not loaded",p02Check({p01:false}),"P01_NOT_READ");
t("P01 help alone is not real P02",p02Check({p01:true,selected:true,p02:false}),"P02_NEEDS_DATA");
t("P02 evidence still not ready",p02Check({p01:true,p02:true,selected:true,version:true}),"P02_EVIDENCE_ONLY_NOT_READY");
t("hard violation outranks missing",classDecision({hard:true,missing:true}),"REJECTED");
t("critical conflict outranks missing",classDecision({unverified:true,missing:true}),"UNVERIFIED");
t("missing required data",classDecision({missing:true}),"NEEDS_DATA");
t("all synthetic evidence still no READY",normStatus(classDecision({allPass:true})),"NOT_FINAL_READY");
t("optional data not blanket hard fail",quality({metric:"oi",mode:"R3",source:null,mandatory:false,now}),"OPTIONAL_NO_READY_IMPLICATION");
const failures=cases.filter(c=>!c.pass);
for(const f of failures)console.error("FAIL",f.id,f.label,JSON.stringify({actual:f.actual,expected:f.expect}));
console.log(JSON.stringify({kind:"SYNTHETIC_SKILL_LOGIC_AND_CONTENT",total:cases.length,passed:cases.length-failures.length,failed:failures.length,verifiedPrivateBybit:false,realChatGPTSkillInvoked:false,realReady:false}));
if(failures.length)process.exitCode=1;
