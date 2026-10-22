// Stage 07.4: synthetic-only portfolio test harness, not a Bybit API client or trading program.
// On a checked-out branch (Node >=18): node tests/stage-07-04-portfolio-analysis-synthetic.mjs
import { readFileSync, existsSync } from "node:fs";
const skillText=readFileSync(new URL("../.agents/skills/portfolio-analysis/SKILL.md",import.meta.url),"utf8");
const skillUrl=new URL("../.agents/skills/portfolio-analysis/SKILL.md",import.meta.url);
const tests=[];
function t(name,actual,expected){tests.push({id:"PA"+String(tests.length+1).padStart(2,"0"),name,actual,expected,pass:Object.is(actual,expected)});}
function slot(p){if(!p||!p.account||p.category!=="linear"||!p.symbol||![0,1,2].includes(p.idx))return null;return [p.account,p.category,p.symbol,p.idx].join("|");}
function direction(p){if(!slot(p))return "UNKNOWN";if(p.idx===1&&p.side!=="Buy"||p.idx===2&&p.side!=="Sell")return "SIDE_CONFLICT";return p.side==="Buy"?"LONG":p.side==="Sell"?"SHORT":"UNKNOWN";}
function current(a){return new Set(a.filter(p=>p.qty>0).map(slot).filter(Boolean)).size;}
function contradictory(a){const seen=new Map();for(const p of a){const id=slot(p);if(!id)return "UNKNOWN_ID";if(seen.has(id)&&JSON.stringify(seen.get(id))!==JSON.stringify([p.qty,p.side]))return "CONFLICT";seen.set(id,[p.qty,p.side]);}return "CONSISTENT";}
function orderId(o){return o.verified&&o.id&&o.account&&o.symbol&&[0,1,2].includes(o.idx)?[o.account,o.symbol,o.idx,o.id].join("|"):null;}
function kind(o){return o.reduceOnly===true||o.intent==="OUT"?"OUT":o.intent==="IN"?"IN":"POSSIBLE_IN";}
function remainder(o){if(["Filled","Cancelled","Rejected"].includes(o.state))return 0;if(["Planned","Virtual"].includes(o.state))return Number.isFinite(o.qty)&&o.qty>=0?o.qty:null;if(!["New","PartiallyFilled","Untriggered"].includes(o.state))return null;return Number.isFinite(o.leaves)&&o.leaves>=0&&Number.isFinite(o.qty)&&o.leaves<=o.qty?o.leaves:null;}
function mergeOrders(a){const seen=new Map(),out=[],warnings=new Set();for(const o of a){const id=orderId(o),r=remainder(o),k=kind(o);if(id&&seen.has(id)){const p=seen.get(id);if(p.rem!==r||p.kind!==k)warnings.add("ID_CONFLICT");continue;}if(!id)warnings.add("ID_MISSING");if(r===null)warnings.add("REMAINDER_UNVERIFIED");const item={o,id,rem:r,kind:k};out.push(item);if(id)seen.set(id,item);}return {out,warnings:[...warnings]};}
function potential(a,orders){const keys=new Set(a.filter(x=>x.qty>0).map(slot).filter(Boolean)),flags=[];for(const o of orders){const r=remainder(o);if(r===null){flags.push("REMAINDER_UNVERIFIED");continue;}if(r<=0||kind(o)==="OUT")continue;const k=slot({account:o.account,category:"linear",symbol:o.symbol,idx:o.idx});if(!k)flags.push("SLOT_UNKNOWN");else keys.add(k);if(kind(o)==="POSSIBLE_IN")flags.push("PURPOSE_UNKNOWN");}return {count:keys.size,flags};}
function reserve(a,buffer){let v=buffer;for(const i of a){if(i.rem===null||!Number.isFinite(i.o.imUsd))return null;if(i.rem>0&&i.kind!=="OUT")v+=i.o.imUsd;}return v;}
function futureIM(base,a,buffer){let v=base+buffer;for(const i of a){if(i.rem===null||!Number.isFinite(i.o.imUsd))return null;if(i.rem>0&&i.kind!=="OUT"&&!i.o.inBaseline)v+=i.o.imUsd;}return v;}
function pnl({realized,unrealized,fee,funding,feeIncluded=false,fundingIncluded=false}){if([realized,unrealized,fee,funding].some(x=>!Number.isFinite(x)))return null;return realized+unrealized+(feeIncluded?0:fee)+(fundingIncluded?0:funding);}
function ttl({age=null,event=false,whole=false}={}){return event?"INVALIDATED":!whole?"INCOMPLETE":age===null||age<0||age>5?"STALE":"TTL_ONLY";}
function cross({mode,liq,mmr=false}){return mode!=="Cross"?"NOT_CROSS":!mmr?"CROSS_UNVERIFIED":!Number.isFinite(liq)?"LIQ_UNKNOWN":"NOT_READY";}
function status({hard=false,conflict=false,missing=false}={}){return hard?"REJECTED":conflict?"UNVERIFIED":missing?"NEEDS_DATA":"EVIDENCE_NOT_READY";}
function bot({state,exchangeQty}){return exchangeQty>0?"POSITION_PRESENT":state==="Stopped"?"EXCHANGE_UNVERIFIED":"UNKNOWN";}
const p={account:"TEST",category:"linear",symbol:"BTCUSDT",idx:0,side:"Sell",qty:2},h1={...p,idx:1,side:"Buy"},h2={...p,idx:2,side:"Sell"};
const o={account:"TEST",symbol:"BTCUSDT",idx:0,id:"A",verified:true,qty:3,leaves:2,state:"PartiallyFilled",intent:"IN",imUsd:20,inBaseline:true};
const virtual={...o,id:"B",state:"Virtual",qty:4,leaves:undefined,imUsd:30,inBaseline:false};
t("frontmatter matches actual Skill",/^---\nname: portfolio-analysis\ndescription: [^\n]+\n---\n/.test(skillText),true);
t("when to use present",skillText.includes("## When to use"),true);
t("when not to use present",skillText.includes("## When not to use"),true);
t("full T02 scope",skillText.includes("T02 whole-account"),true);
t("positionIdx 0 and Hedge 1/2 semantics",skillText.includes("positionIdx=0")&&skillText.includes("Hedge **Buy/Long** slot"),true);
t("T03/T04",skillText.includes("T03")&&skillText.includes("T04"),true);
t("all bot types",skillText.includes("Veles")&&skillText.includes("GinArea"),true);
t("H01 fee/funding",skillText.includes("H01")&&skillText.includes("funding"),true);
t("no independent trade approval",skillText.includes("never grant READY"),true);
t("Cross estimated liquidation",skillText.includes("estimated/dynamic"),true);
t("OneWay slot key",slot(p),"TEST|linear|BTCUSDT|0");
t("Hedge long slot key",slot(h1),"TEST|linear|BTCUSDT|1");
t("Hedge short slot key",slot(h2),"TEST|linear|BTCUSDT|2");
t("null account no key",slot({...p,account:null}),null);
t("Spot not USDT linear",slot({...p,category:"spot"}),null);
t("OneWay Sell Short",direction(p),"SHORT");
t("Hedge Buy Long",direction(h1),"LONG");
t("Hedge Sell Short",direction(h2),"SHORT");
t("wrong side for Hedge",direction({...h1,side:"Sell"}),"SIDE_CONFLICT");
t("zero size no position",current([{...p,qty:0}]),0);
t("two bots share OneWay",current([p,{...p}]),1);
t("Hedge opposite two slots",current([h1,h2]),2);
t("three distinct slot keys",current([p,h1,h2]),3);
t("duplicate conflicting position",contradictory([p,{...p,qty:3}]),"CONFLICT");
t("duplicate consistent position",contradictory([p,{...p}]),"CONSISTENT");
t("confirmed order ID",orderId(o),"TEST|BTCUSDT|0|A");
t("unverified order ID not matched",orderId({...o,verified:false}),null);
t("partial fill uses leaves",remainder(o),2);
t("fully FILLED no future qty",remainder({...o,state:"Filled"}),0);
t("cancelled no future qty",remainder({...o,state:"Cancelled"}),0);
t("partial then cancelled future qty zero",remainder({...o,state:"Cancelled",cumExecQty:1}),0);
t("virtual future IN",remainder(virtual),4);
t("missing leaves on New unknown",remainder({...o,state:"New",leaves:undefined}),null);
t("leaves cannot exceed qty",remainder({...o,leaves:4}),null);
t("negative leaves invalid",remainder({...o,leaves:-1}),null);
t("unknown state not zero",remainder({...o,state:"UNKNOWN"}),null);
t("reduceOnly is OUT",kind({...o,reduceOnly:true,intent:undefined}),"OUT");
t("Buy alone is not known IN",kind({...o,intent:undefined}),"POSSIBLE_IN");
t("explicit IN retained",kind(o),"IN");
t("duplicate exchange+bot order one commitment",mergeOrders([o,{...o,view:"bot"}]).out.length,1);
t("distinct IDs same quantity remain separate",mergeOrders([o,{...o,id:"Z"}]).out.length,2);
t("same ID different state conflict",mergeOrders([o,{...o,leaves:1}]).warnings.includes("ID_CONFLICT"),true);
t("unknown ID no automatic merge",mergeOrders([{...o,verified:false},{...o,verified:false}]).out.length,2);
t("unknown leaves warning",mergeOrders([{...o,leaves:undefined}]).warnings.includes("REMAINDER_UNVERIFIED"),true);
t("one active slot forecast",potential([p],[]).count,1);
t("future second symbol slot",potential([p],[{...virtual,symbol:"SOLUSDT"}]).count,2);
t("future hedge slot",potential([p],[{...virtual,idx:1}]).count,2);
t("four projected slots risk",potential([p],["SOL","ADA","ETH"].map((x,i)=>({...virtual,symbol:x+"USDT",id:"N"+i}))).count,4);
t("reduce-only OUT no projected slot",potential([p],[{...o,symbol:"SOLUSDT",reduceOnly:true}]).count,1);
t("FILLED IN no projected slot",potential([p],[{...o,symbol:"SOLUSDT",state:"Filled"}]).count,1);
t("unknown purpose flagged",potential([p],[{...virtual,symbol:"SOLUSDT",intent:null}]).flags.includes("PURPOSE_UNKNOWN"),true);
t("unknown position slot flagged",potential([p],[{...virtual,symbol:"SOLUSDT",idx:null}]).flags.includes("SLOT_UNKNOWN"),true);
const planned=mergeOrders([o,virtual]).out;
t("reserve includes all future IN",reserve(planned,10),60);
t("baseline IM not added twice",futureIM(100,planned,10),140);
t("missing future IM unknown",reserve([{...planned[0],o:{...o,imUsd:null}}],10),null);
t("OUT not counted in IN reserve",reserve(mergeOrders([{...o,reduceOnly:true,intent:"OUT"}]).out,10),10);
t("Cross liqPrice not reliable without MMR",cross({mode:"Cross",liq:120}),"CROSS_UNVERIFIED");
t("Cross empty liqPrice not safety",cross({mode:"Cross",liq:null,mmr:true}),"LIQ_UNKNOWN");
t("Isolated separate",cross({mode:"Isolated",liq:120}),"NOT_CROSS");
t("timely T02 only passes TTL",ttl({age:1,whole:true}),"TTL_ONLY");
t("partial account despite time",ttl({age:1,whole:false}),"INCOMPLETE");
t("fill immediately invalidates",ttl({age:1,whole:true,event:true}),"INVALIDATED");
t("older than five minute T02",ttl({age:6,whole:true}),"STALE");
t("missing time",ttl({age:null,whole:true}),"STALE");
t("H01 -15+10-1-2=-8",pnl({realized:-15,unrealized:10,fee:-1,funding:-2}),-8);
t("H01 fee included not double deducted",pnl({realized:-16,unrealized:10,fee:-1,funding:-2,feeIncluded:true}),-8);
t("missing H01 funding cannot conclude recovery",pnl({realized:-15,unrealized:10,fee:-1,funding:NaN}),null);
t("Stopped bot still open on exchange",bot({state:"Stopped",exchangeQty:2}),"POSITION_PRESENT");
t("Disable IN still exchange position",bot({state:"Disable IN",exchangeQty:2}),"POSITION_PRESENT");
t("stopped bot alone not confirmed closed",bot({state:"Stopped",exchangeQty:0}),"EXCHANGE_UNVERIFIED");
t("known hard veto overrides missing",status({hard:true,missing:true}),"REJECTED");
t("conflict overrides missing",status({conflict:true,missing:true}),"UNVERIFIED");
t("missing T02",status({missing:true}),"NEEDS_DATA");
t("local tests never READY",status(),"EVIDENCE_NOT_READY");
const links=[...skillText.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/.test(x));
t("at least 14 internal references",links.length>=14,true);
t("sibling data verification link",links.includes("../data-verification/SKILL.md"),true);
t("all internal links resolve",links.every(x=>existsSync(new URL(x,skillUrl))),true);
const failed=tests.filter(x=>!x.pass);
for(const v of failed)console.error("FAIL",v.id,v.name,JSON.stringify({actual:v.actual,expected:v.expected}));
console.log(JSON.stringify({kind:"LOCAL_SYNTHETIC_PORTFOLIO_ONLY",total:tests.length,passed:tests.length-failed.length,failed:failed.length,bybitAccount:false,liveSkill:false,ready:false}));
if(failed.length)process.exitCode=1;
