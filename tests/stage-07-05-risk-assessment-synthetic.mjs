// Stage 07.5 Risk Assessment Skill: synthetic local checks, NOT an exchange risk engine.
// Node >=18: node tests/stage-07-05-risk-assessment-synthetic.mjs
import { readFileSync, existsSync } from "node:fs";
const body=readFileSync(new URL("../.agents/skills/risk-assessment/SKILL.md", import.meta.url),"utf8");
const base=new URL("../.agents/skills/risk-assessment/SKILL.md", import.meta.url);
const tests=[];
function t(title,actual,expected){tests.push({id:"RA"+String(tests.length+1).padStart(2,"0"),title,actual,expected,pass:Object.is(actual,expected)});}
function metaOk(s){let match=s.match(/^---\nname: ([^\n]+)\ndescription: ([^\n]+)\n---\n/);return !!match&&match[1]==="risk-assessment"&&match[2].length>0&&match[2].length<=1024;}
function pct(n,d){return Number.isFinite(n)&&Number.isFinite(d)&&d>0?n/d*100:null;}
function marginGate(E0,reachableIm,verified=true){if(!verified||!Array.isArray(reachableIm))return "UNVERIFIED";if(!Number.isFinite(E0)||E0<=0||reachableIm.some(x=>!Number.isFinite(x)))return "NEEDS_DATA";return Math.max(...reachableIm)/E0>0.3+1e-12?"REJECTED":"PASSED_SUBSET";}
function leverageGate(values){if(!Array.isArray(values)||!values.length||values.some(x=>x==null||!Number.isFinite(x)))return "UNVERIFIED";return values.some(x=>x>5)?"REJECTED":"PASSED_SUBSET";}
function slotsGate(current,reachable){if(!Number.isInteger(current)||!Number.isInteger(reachable)||current<0||reachable<current)return "UNVERIFIED";return reachable>3?"REJECTED":"PASSED_SUBSET";}
function reserveGate(available,futureIm,costBuffer){if([available,futureIm,costBuffer].some(v=>!Number.isFinite(v)||v<0))return "UNVERIFIED";return available+1e-9<futureIm+costBuffer?"REJECTED":"PASSED_SUBSET";}
function liquidationGate(side,mark,lp,{proven=true,mode="Isolated",crossModel=false}={}){if(!proven||mode==="Cross"&&!crossModel)return "UNVERIFIED";if([mark,lp].some(x=>!Number.isFinite(x)||x<=0)||!["Long","Short"].includes(side))return "NEEDS_DATA";let dist=side==="Long"?(mark-lp)/mark:(lp-mark)/mark;return dist+1e-12<.15?"REJECTED":"PASSED_SUBSET";}
function botLossGate(equity,loss,{upperProof=false}={}){if(!upperProof)return "UNVERIFIED";if(!Number.isFinite(equity)||equity<=0||!Number.isFinite(loss)||loss<0)return "NEEDS_DATA";return loss/equity>0.05+1e-12?"REJECTED":"PASSED_SUBSET";}
function equityDD(hwm,eq,{verified=false}={}){if(!verified)return "NOT_CHECKED";if(!Number.isFinite(hwm)||hwm<=0||!Number.isFinite(eq))return "UNVERIFIED";return (hwm-eq)/hwm>=.15-1e-12?"BLOCK_ACTIVE":"NO_KNOWN_BREACH";}
function dayLoss(base,nowEquity,flow,{verified=false}={}){if(!verified)return "NOT_CHECKED";if(!Number.isFinite(base)||base<=0||!Number.isFinite(nowEquity)||!Number.isFinite(flow))return "UNVERIFIED";return (base+flow-nowEquity)/base>=.03-1e-12?"BLOCK_ACTIVE":"NO_KNOWN_BREACH";}
function moscowDay(iso){const d=new Date(iso);return Number.isNaN(d.getTime())?null:new Date(d.getTime()+3*3600000).toISOString().slice(0,10);}
function hBlock({h04=false,h02="NOT_CHECKED",h03="NOT_CHECKED",newRisk=true}={}){return newRisk&&(h04||h02==="BLOCK_ACTIVE"||h03==="BLOCK_ACTIVE")?"REJECTED":"NO_CONFIRMED_ACTIVE_BLOCK";}
function wrongCurrency(a,b,proof){return a===b?"SAME_CURRENCY":proof?"PROVED_CONVERSION_REQUIRED":"UNVERIFIED";}
function validStress(e){const families=["F","A","H","R"];if(!e||families.some(f=>!e[f]?.performed))return "INCOMPLETE";if(!e.H.realMark||!e.H.observed||!e.H.validHistory)return "HISTORY_NOT_PROVED";if(!e.A.volatilityEvidence||!e.A.liquidityEvidence)return "ADAPTIVE_NOT_PROVED";if(!e.R.limitsProved)return "REVERSE_NOT_PROVED";if(!e.F.portfolioComplete)return "FIXED_NOT_FULL_PORTFOLIO";return "FAMILIES_EVIDENCED_NOT_READY";}
function inputGate({t02Age=null,markAge=null,full=false,event=false,p02=false}={}){if(event)return "INVALIDATED";if(!full||t02Age===null||markAge===null||!p02)return "NEEDS_DATA";if(t02Age>5||markAge>2||t02Age<0||markAge<0)return "STALE";return "FRESHNESS_ONLY_NOT_READY";}
function coLoss({longQty,shortQty,oldPrice,newPrice}){return (longQty-shortQty)*(newPrice-oldPrice);}
function corrQuality(n,stdA,stdB){return n>=30&&stdA>0&&stdB>0?"QUALITY_GATE_ONLY":"INSUFFICIENT";}
function reverseFirst(threshold,lossFn,maxT=1){if(!Number.isFinite(threshold)||threshold<0||!Number.isFinite(maxT)||maxT<=0)return null;let a=0,b=maxT;if(lossFn(a)>threshold)return 0;if(!(lossFn(b)>threshold))return null;for(let i=0;i<48;i++){let m=(a+b)/2;if(lossFn(m)>threshold)b=m;else a=m;}return b;}
function finalStatus({hard=false,critical=false,missing=false,allVerified=false}={}){return hard?"REJECTED":critical?"UNVERIFIED":missing?"NEEDS_DATA":allVerified?"LOCAL_PASS_NOT_READY":"NEEDS_DATA";}
const all={F:{performed:true,portfolioComplete:true},A:{performed:true,volatilityEvidence:true,liquidityEvidence:true},H:{performed:true,realMark:true,observed:true,validHistory:true},R:{performed:true,limitsProved:true}};
t("actual skill frontmatter",metaOk(body),true);
t("positive trigger",body.includes("## When to use"),true);
t("negative trigger",body.includes("## When *not* to use"),true);
t("FR-027 through FR-040 all stated",Array.from({length:14},(_,i)=>String(i+27).padStart(3,"0")).every(n=>body.includes("FR-"+n)),true);
t("S0 to S3 are included",["S0","S1","S2","S3"].every(k=>body.includes(k)),true);
t("FR-029 limit 30",body.includes("≤30%"),true);
t("FR-030 limit five",body.includes("≤5% E0"),true);
t("FR-031 cap five leverage",body.includes("≤5×"),true);
t("FR-032 distance fifteen",body.includes("≥15%"),true);
t("FR-033 slots three",body.includes("3 concurrent"),true);
t("FR-034 full grid 100",body.includes("100% future"),true);
t("history FR-038 F/A/H/R",body.includes("F (**fixed shocks**)")&&body.includes("H (**actual dated historical"),true);
t("no readiness from partial data",body.includes("does not")&&body.includes("READY"),true);
t("no live execution",body.includes("do not execute")||body.includes("Do **not** execute"),true);
t("ratio 300/1000 30%",pct(300,1000),30);
t("ratio missing denominator",pct(20,0),null);
t("FR029 at boundary",marginGate(1000,[200,300]),"PASSED_SUBSET");
t("FR029 future worst 301",marginGate(1000,[200,301]),"REJECTED");
t("FR029 already accounted 250-40+42+38 =290",marginGate(1000,[250,250-40+42,250-40+42+38]),"PASSED_SUBSET");
t("FR029 projected > threshold",marginGate(1000,[250,310]),"REJECTED");
t("FR029 no verified IM model",marginGate(1000,[300],false),"UNVERIFIED");
t("FR029 no equity denominator",marginGate(null,[200]),"NEEDS_DATA");
t("FR031 5 permitted subset",leverageGate([2,5]),"PASSED_SUBSET");
t("FR031 8 fails",leverageGate([5,8]),"REJECTED");
t("FR031 unknown PM leverage",leverageGate([undefined]),"UNVERIFIED");
t("FR033 current three still three",slotsGate(3,3),"PASSED_SUBSET");
t("FR033 reachable fourth",slotsGate(3,4),"REJECTED");
t("FR033 invalid future slot count",slotsGate(2,1),"UNVERIFIED");
t("FR034 exactly full cover",reserveGate(45,40,5),"PASSED_SUBSET");
t("FR034 shortfall one",reserveGate(44,40,5),"REJECTED");
t("FR034 zero buffer allowed numeric but not realistic coverage proof",reserveGate(40,40,0),"PASSED_SUBSET");
t("FR034 unknown future margin",reserveGate(100,NaN,5),"UNVERIFIED");
t("FR032 Long exactly 15%",liquidationGate("Long",100,85),"PASSED_SUBSET");
t("FR032 Long 14.99%",liquidationGate("Long",100,85.01),"REJECTED");
t("FR032 Short exactly 15%",liquidationGate("Short",100,115),"PASSED_SUBSET");
t("FR032 Short 14.99%",liquidationGate("Short",100,114.99),"REJECTED");
t("FR032 Cross position LP not account proof",liquidationGate("Short",100,115,{mode:"Cross"}),"UNVERIFIED");
t("FR032 Cross model synthetic verified subset",liquidationGate("Short",100,115,{mode:"Cross",crossModel:true}),"PASSED_SUBSET");
t("FR032 unknown LP",liquidationGate("Short",100,null),"NEEDS_DATA");
t("FR030 bot loss 50 at E0 1000",botLossGate(1000,50,{upperProof:true}),"PASSED_SUBSET");
t("FR030 bot loss 51 fails",botLossGate(1000,51,{upperProof:true}),"REJECTED");
t("FR030 49 scenario not proven upper bound",botLossGate(1000,49),"UNVERIFIED");
t("FR030 Short model not verified",botLossGate(1000,10),"UNVERIFIED");
t("FR030 missing equity",botLossGate(0,10,{upperProof:true}),"NEEDS_DATA");
t("H02 without historical equity",equityDD(1000,800),"NOT_CHECKED");
t("H02 drawdown 14.9%",equityDD(1000,851,{verified:true}),"NO_KNOWN_BREACH");
t("H02 drawdown at 15% activates",equityDD(1000,850,{verified:true}),"BLOCK_ACTIVE");
t("H02 drawdown 15.1% activates",equityDD(1000,849,{verified:true}),"BLOCK_ACTIVE");
t("H03 without start-of-day",dayLoss(1000,900,0),"NOT_CHECKED");
t("H03 cash deposit not income",dayLoss(1000,1500,500,{verified:true}),"NO_KNOWN_BREACH");
t("H03 cash withdrawal not loss",dayLoss(1000,800,-200,{verified:true}),"NO_KNOWN_BREACH");
t("H03 2.9% no block",dayLoss(1000,971,0,{verified:true}),"NO_KNOWN_BREACH");
t("H03 exactly 3% block",dayLoss(1000,970,0,{verified:true}),"BLOCK_ACTIVE");
t("H03 3.4% block",dayLoss(1000,966,0,{verified:true}),"BLOCK_ACTIVE");
t("Moscow trading day 20:59:59Z old date",moscowDay("2026-10-18T20:59:59Z"),"2026-10-18");
t("Moscow trading day 21:00Z new date",moscowDay("2026-10-18T21:00:00Z"),"2026-10-19");
t("active H04 veto even missing H02/H03",hBlock({h04:true}),"REJECTED");
t("verified H02 block veto",hBlock({h02:"BLOCK_ACTIVE"}),"REJECTED");
t("verified H03 block veto",hBlock({h03:"BLOCK_ACTIVE"}),"REJECTED");
t("missing H02 H03 alone not veto",hBlock(),"NO_CONFIRMED_ACTIVE_BLOCK");
t("known H04 does not veto risk reduction",hBlock({h04:true,newRisk:false}),"NO_CONFIRMED_ACTIVE_BLOCK");
t("USD vs USDT without verified FX",wrongCurrency("USD","USDT",false),"UNVERIFIED");
t("USD to USD needs no FX",wrongCurrency("USD","USD",false),"SAME_CURRENCY");
t("cross currency proof prerequisite only",wrongCurrency("USD","USDT",true),"PROVED_CONVERSION_REQUIRED");
t("F A H R all synthetic evidence flags",validStress(all),"FAMILIES_EVIDENCED_NOT_READY");
t("no H family is not four tests",validStress({...all,H:{performed:false}}),"INCOMPLETE");
t("H fictional date cannot replace real Mark",validStress({...all,H:{performed:true,realMark:false,observed:true,validHistory:true}}),"HISTORY_NOT_PROVED");
t("Adaptive volatility missing",validStress({...all,A:{performed:true,volatilityEvidence:false,liquidityEvidence:true}}),"ADAPTIVE_NOT_PROVED");
t("Reverse limits unknown",validStress({...all,R:{performed:true,limitsProved:false}}),"REVERSE_NOT_PROVED");
t("Fixed test only one bot, not full portfolio",validStress({...all,F:{performed:true,portfolioComplete:false}}),"FIXED_NOT_FULL_PORTFOLIO");
t("R3 full & current T02/Mark and P02 only freshness",inputGate({t02Age:3,markAge:1,full:true,p02:true}),"FRESHNESS_ONLY_NOT_READY");
t("R3 missing P02",inputGate({t02Age:3,markAge:1,full:true,p02:false}),"NEEDS_DATA");
t("R3 missing whole T02",inputGate({t02Age:3,markAge:1,full:false,p02:true}),"NEEDS_DATA");
t("R3 6min T02 stale",inputGate({t02Age:6,markAge:1,full:true,p02:true}),"STALE");
t("R3 3min Mark stale",inputGate({t02Age:1,markAge:3,full:true,p02:true}),"STALE");
t("R3 fresh but fill invalidates",inputGate({t02Age:1,markAge:1,full:true,p02:true,event:true}),"INVALIDATED");
t("coLoss Long and Short same price change",coLoss({longQty:1,shortQty:1,oldPrice:100,newPrice:90}),0);
t("coLoss Long 2 Short 1 down 10",coLoss({longQty:2,shortQty:1,oldPrice:100,newPrice:90}),-10);
t("correlation n29 insufficient",corrQuality(29,1,1),"INSUFFICIENT");
t("correlation constant series invalid",corrQuality(30,0,1),"INSUFFICIENT");
t("correlation n30 valid only quality",corrQuality(30,1,1),"QUALITY_GATE_ONLY");
t("reverse stress loss 70t−7 crosses 50",Math.abs(reverseFirst(50,t=>70*t-7)-57/70)<1e-11,true);
t("reverse stress threshold not yet crossed",reverseFirst(100,t=>70*t-7),null);
t("hard risk veto priority",finalStatus({hard:true,critical:true,missing:true}),"REJECTED");
t("critical Cross unknown outranks missing",finalStatus({critical:true,missing:true}),"UNVERIFIED");
t("missing T02 alone",finalStatus({missing:true}),"NEEDS_DATA");
t("synthetic all flags never REAL READY",finalStatus({allVerified:true}),"LOCAL_PASS_NOT_READY");
const links=[...body.matchAll(/\]\(([^) \n]+)\)/g)].map(m=>m[1]).filter(x=>!/^https?:/.test(x));
t("at least thirteen approved reference files",links.length>=13,true);
t("portfolio Skill as sibling reference",links.includes("../portfolio-analysis/SKILL.md"),true);
t("data verifier Skill as sibling reference",links.includes("../data-verification/SKILL.md"),true);
t("all relative link targets exist",links.every(x=>existsSync(new URL(x,base))),true);
const fail=tests.filter(x=>!x.pass);
for(const f of fail)console.error("FAIL",f.id,f.title,JSON.stringify({actual:f.actual,expected:f.expected}));
console.log(JSON.stringify({kind:"LOCAL_SYNTHETIC_RISK",total:tests.length,passed:tests.length-fail.length,failed:fail.length,realBybit:false,realSkillRuntime:false,realFahr:false,ready:false}));
if(fail.length)process.exitCode=1;
