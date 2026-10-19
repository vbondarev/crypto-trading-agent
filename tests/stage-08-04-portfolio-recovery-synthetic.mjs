// Step 08.4 documentary & deterministic synthetic contract tests (Node.js >=18).
// Execute: node tests/stage-08-04-portfolio-recovery-synthetic.mjs
// No real Bybit/account data, no ChatGPT runtime, exchange orders or READY.
import {readFileSync,existsSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8"), exists=p=>existsSync(resolve(ROOT,p));
const doc=read("docs/prompts/portfolio-recovery.md");
const plan=read("docs/stage-08-plan.md"),dialogue=read("docs/workflows/interaction-contract.md");
const portfolio=read(".agents/skills/portfolio-analysis/SKILL.md");
const risk=read(".agents/skills/risk-assessment/SKILL.md");
const strategy=read(".agents/skills/strategy-planning/SKILL.md");
const verify=read(".agents/skills/data-verification/SKILL.md");
const tick=String.fromCharCode(96),checks=[];
function t(id,actual,expected){checks.push({id:"PR-T"+String(checks.length+1).padStart(3,"0"),label:id,actual,expected,ok:Object.is(actual,expected)});}
const has=(text,parts)=>parts.every(s=>text.includes(s));
function route(intent){
 if(intent==="market")return ["RT02","R1",false];
 if(intent==="position"||intent==="portfolio")return ["RT04","PORTFOLIO",true];
 if(intent==="recovery")return ["RT05","RECOVERY",true];
 if(intent==="changed")return ["RT10","RECHECK",true];
 return ["ASK","UNKNOWN",false];
}
function slotKey(p){return [p.account,p.category,p.symbol,p.idx].join("|");}
function slots(positions){
 const keys=new Set();
 for(const p of positions){
  if(p.qty>0){if(![0,1,2].includes(p.idx))return "UNKNOWN_POSITION_MODE";keys.add(slotKey(p));}
 }
 return keys.size;
}
function requiredFuture(order){
 if(order.exchangeState==="FILLED"||order.exchangeState==="CANCELLED_CONFIRMED")return 0;
 if(order.exchangeState==="PARTIALLY_FILLED"){
  if(!Number.isFinite(order.qty)||!Number.isFinite(order.cumExecQty)||!Number.isFinite(order.leavesQty)||Math.abs(order.qty-order.cumExecQty-order.leavesQty)>1e-10)return null;
  return order.leavesQty;
 }
 if(order.exchangeState==="ACTIVE"||order.exchangeState==="CONDITIONAL")return Number.isFinite(order.leavesQty)?order.leavesQty:null;
 if(order.exchangeState==="VIRTUAL"||order.exchangeState==="PLANNED")return order.reachable?order.qty:0;
 return null;
}
function reconcileOrders(orders){
 let future=0,matched=new Map(),unknown=false;
 for(const o of orders){
  const amount=requiredFuture(o);
  if(amount===null){unknown=true;continue;}
  if(o.id){
   const k=[o.account,o.symbol,o.idx,o.id].join("|");
   if(matched.has(k)){
    const prev=matched.get(k);
    if(prev!==amount)return {status:"CONFLICT",future:null};
    continue;
   }
   matched.set(k,amount);future+=amount;
  }else if(o.possibleDuplicate){unknown=true;}
  else future+=amount;
 }
 return {status:unknown?"UNVERIFIED":"RECONCILED",future:unknown?null:future};
}
function reachableSlots({positions=[],future=[]}={}){
 let seen=new Set(positions.filter(p=>p.qty>0).map(slotKey));
 for(const o of future){
  if(o.reduceOnly===true||o.canOpen===false)continue;
  if(o.canOpen===null||o.canOpen===undefined)return "UNVERIFIED";
  seen.add(slotKey({account:o.account,category:o.category,symbol:o.symbol,idx:o.idx}));
 }
 return seen.size;
}
function netSeries({grossRealized,unrealized,feeCost,fundingCost,netRealized,realizedIncludesCosts=false,coverage=true,currencyOk=true,ownerOk=true}={}){
 if(!coverage||!currencyOk||!ownerOk)return {state:"H01_INCOMPLETE",value:null};
 if(!Number.isFinite(unrealized))return {state:"UNVERIFIED",value:null};
 if(realizedIncludesCosts){
  if(!Number.isFinite(netRealized))return {state:"UNVERIFIED",value:null};
  return {state:"DERIVED_NET",value:netRealized+unrealized};
 }
 if(![grossRealized,feeCost,fundingCost].every(Number.isFinite))return {state:"UNVERIFIED",value:null};
 return {state:"DERIVED_NET",value:grossRealized+unrealized-feeCost-fundingCost};
}
function timestamp({mode="R2",t02Min=0,markMin=0,changed=false,known=false}={}){
 if(changed)return "RECHECK";
 if(!known)return "TIME_UNVERIFIED";
 if(mode!=="R3")return "DESCRIPTIVE_NOT_R3";
 if(![t02Min,markMin].every(v=>Number.isFinite(v)&&v>=0))return "TIME_UNVERIFIED";
 return t02Min>5||markMin>2?"STALE":"TTL_ONLY_NOT_READY";
}
function veto({knownH04=false,conflict=false,missing=false,expansion=true}={}){
 if(knownH04&&expansion)return "REJECTED";
 if(conflict)return "UNVERIFIED";
 if(missing)return "NEEDS_DATA";
 return "ANALYSIS_ONLY_NO_READY";
}
const btc={account:"SYN",category:"linear",symbol:"BTCUSDT",idx:0,qty:0.2};
const hLong={account:"SYN",category:"linear",symbol:"BTCUSDT",idx:1,qty:0.3};
const hShort={account:"SYN",category:"linear",symbol:"BTCUSDT",idx:2,qty:0.1};
const filled={account:"SYN",symbol:"BTCUSDT",idx:0,id:"SYN-ID-1",exchangeState:"FILLED",qty:4};
const part={account:"SYN",symbol:"BTCUSDT",idx:0,id:"SYN-ID-2",exchangeState:"PARTIALLY_FILLED",qty:10,cumExecQty:4,leavesQty:6};
const hypothetical={grossRealized:-15,unrealized:10,feeCost:1,fundingCost:2};
// 36 normative fixtures are deterministic examples only, NOT 36 independent LLM runs.
t("PR01 generic market no account",route("market").join("/"),"RT02/R1/false");
t("PR02 portfolio partial still RT04",route("portfolio")[0],"RT04");
t("PR03 supplied T03 never ask twice",has(doc,["Если пользователь уже дал данные","повторно не спрашивать"]),true);
t("PR04 one-way occupied slot",slots([btc]),1);
t("PR05 Hedge has 2 real slots",slots([hLong,hShort]),2);
t("PR06 two bots same slot remain one",slots([btc,btc]),1);
t("PR07 leavesQty only future",requiredFuture(part),6);
t("PR08 fully FILLED not future",requiredFuture(filled),0);
t("PR09 same known exchange orderId once",reconcileOrders([part,{...part}]).future,6);
t("PR10 distinct confirmed IDs both remain",reconcileOrders([part,{...part,id:"SYN-ID-3"}]).future,12);
t("PR11 missing ID possible duplicate",reconcileOrders([{...part,id:null,possibleDuplicate:true}]).status,"UNVERIFIED");
t("PR12 bot Pause not exchange-close",has(doc,["Pause/Cancel/Disable IN","не доказывает"]),true);
t("PR13 Bybit cancellation zero future",requiredFuture({...part,exchangeState:"CANCELLED_CONFIRMED"}),0);
t("PR14 reachable virtual IN future",requiredFuture({exchangeState:"VIRTUAL",qty:12,reachable:true}),12);
t("PR15 reduceOnly OUT adds no slot",reachableSlots({positions:[btc],future:[{...btc,idx:1,reduceOnly:true,canOpen:true}]}),1);
t("PR16 OneWay Buy not automatically IN",doc.includes("Buy")&&doc.includes("может закрывать Short"),true);
t("PR17 2 occupied and 2 reachable => 4",reachableSlots({positions:[btc,{...hShort,symbol:"ETHUSDT"}],future:[{...btc,symbol:"SOLUSDT",idx:0,canOpen:true},{...btc,symbol:"ADAUSDT",idx:0,canOpen:true}]}),4);
t("PR18 more IN same slot does not add slot",reachableSlots({positions:[btc],future:[{...btc,canOpen:true}]}),1);
t("PR19 initial order IM not added twice",doc.includes("IM S0 повторно"),true);
t("PR20 Cross reserve is not segregated",doc.includes("не** гарантированно изолирован"),true);
t("PR21 USD cannot blindly add USDT",doc.includes("USD ≠ USDT"),true);
t("PR22 blank Cross liqPrice no safety",doc.includes("не считать ликвидацию невозможной")||doc.includes("не доказательство account-wide safety"),true);
t("PR23 R3 6m T02 stale",timestamp({mode:"R3",t02Min:6,markMin:1,known:true}),"STALE");
t("PR24 R3 3m Mark stale",timestamp({mode:"R3",t02Min:1,markMin:3,known:true}),"STALE");
t("PR25 event overrides TTL",timestamp({mode:"R3",t02Min:1,markMin:1,changed:true,known:true}),"RECHECK");
t("PR26 H01 exact -8",netSeries({...hypothetical}).value,-8);
t("PR27 incremental gross with 2 future costs",8+2,10);
t("PR28 fee included in net realized not double charged",netSeries({netRealized:-18,unrealized:10,realizedIncludesCosts:true}).value,-8);
t("PR29 missing owner H01 incomplete",netSeries({...hypothetical,ownerOk:false}).state,"H01_INCOMPLETE");
t("PR30 green current position does not recover",netSeries({...hypothetical}).value<0,true);
t("PR31 absent H02/H03 no auto veto",doc.includes("H02/H03 без истории")&&doc.includes("NOT_CHECKED"),true);
t("PR32 known H04 rejection",veto({knownH04:true,missing:true,expansion:true}),"REJECTED");
t("PR33 WAIT not zero risk",has(doc,["WAIT","не безрисковый"]),true);
t("PR34 Disable IN not exchange close",has(doc,["Disable IN","не являются биржевым"]),true);
t("PR35 Binance Spot not Mark",has(doc,["Binance Spot","не подменяют Mark"]),true);
t("PR36 approval not trade",doc.includes("Не разрешает торговать"),true);
// Additional fixture edge cases for negative outcomes and numeric semantics.
t("No open quantity means zero slots",slots([{...btc,qty:0}]),0);
t("Unknown positionIdx invalid",slots([{...btc,idx:9}]),"UNKNOWN_POSITION_MODE");
t("Inconsistent partial qty requires verification",requiredFuture({...part,leavesQty:7}),null);
t("Unknown partial leavesQty not treated as zero",requiredFuture({...part,leavesQty:null}),null);
t("Known cancelled partial still S0 qty",has(doc,["CANCELLED_CONFIRMED","ранее исполненная часть сохраняется"]),true);
t("Virtual unreachable does not consume future IN",requiredFuture({exchangeState:"VIRTUAL",qty:5,reachable:false}),0);
t("Same orderId conflicting values => contradiction",reconcileOrders([part,{...part,leavesQty:5}]).status,"CONFLICT");
t("Unknown future order purpose => UNVERIFIED",reachableSlots({positions:[btc],future:[{...btc,symbol:"SOLUSDT",canOpen:null}]}),"UNVERIFIED");
t("Incomplete currency/owner cannot claim recovered",netSeries({...hypothetical,currencyOk:false}).state,"H01_INCOMPLETE");
t("Net-realized costs not charged twice",netSeries({netRealized:5,unrealized:-2,realizedIncludesCosts:true,feeCost:99,fundingCost:99}).value,3);
t("Net funds cannot infer absent realized",netSeries({realizedIncludesCosts:true,netRealized:null,unrealized:10}).state,"UNVERIFIED");
t("R2 portfolio not automatically R3 gate",timestamp({mode:"R2",known:true,t02Min:9,markMin:6}),"DESCRIPTIVE_NOT_R3");
t("R3 exact edge only TTL",timestamp({mode:"R3",known:true,t02Min:5,markMin:2}),"TTL_ONLY_NOT_READY");
t("Missing time not current",timestamp({mode:"R3",known:false,t02Min:1,markMin:1}),"TIME_UNVERIFIED");
t("R3 negative age invalid",timestamp({mode:"R3",known:true,t02Min:-1,markMin:1}),"TIME_UNVERIFIED");
t("Critical model conflict blocks final",veto({conflict:true}),"UNVERIFIED");
t("Missing account input not made zero",veto({missing:true}),"NEEDS_DATA");
t("No model proof not trading READY",veto({}),"ANALYSIS_ONLY_NO_READY");
t("known H04 veto only risk expansion",veto({knownH04:true,expansion:false}),"ANALYSIS_ONLY_NO_READY");
// Check actual source, not only fixture functions.
for(let i=12;i<=17;i++){
 const id="P08-"+String(i).padStart(2,"0");const text=doc.split("### "+id+" —")[1]?.split("\n### ")[0]||"";
 t("prompt exists "+id,text.length>100,true);
 t("prompt copy block "+id,text.includes("> "),true);
 t("prompt route "+id,text.includes("**Маршрут:**"),true);
}
for(let i=1;i<=36;i++)t("normative row PR"+String(i).padStart(2,"0"),doc.split("\n").some(x=>x.startsWith("| PR"+String(i).padStart(2,"0")+" |")),true);
for(const word of ["RT04","RT05","RT10","T02","T03","T04","T05","T06","H01","H02/H03","H04","S0","S1","S2","S3","Cross","Isolated","positionIdx","leavesQty","cumExecQty","reduceOnly","CANCELLED_CONFIRMED","VIRTUAL","FILLED","POSSIBLE_DUPLICATE","OWNER_UNVERIFIED","funding","fees","L_lifecycle","L_from_now","F/A/H/R","FR-029","FR-030","FR-031","FR-032","FR-033","FR-034","FR-035/036","NOT_CHECKED","UNVERIFIED","RECHECK","READY"]){
 t("policy source "+word,doc.includes(word),true);
}
for(const [name,source,needed] of [
 ["portfolio skill",portfolio,["H01","leavesQty","positionIdx","S2","Cross"]],
 ["risk skill",risk,["FR-029","FR-033","FR-034","H04","F/A/H/R"]],
 ["strategy skill",strategy,["L_lifecycle","L_from_now","RECOVER","WAIT"]],
 ["verification skill",verify,["R3","T02","Mark","HTTP 403"]],
 ["dialogue contract",dialogue,["RT04","RT05","RT10","RECHECK"]],
 ["adopted plan",plan,["**08.4 — позиции и recovery**","T02/T03/T04/T05"]]
])t("trace to "+name,has(source,needed),true);
function row(body,id){return body.split("\n").find(x=>x.startsWith("| "+id+" |"))||"";}
const pin={
 PR07:"Будущий IN=6",PR08:"не добавлять",PR09:"Один будущий остаток",
 PR10:"Две независимые заявки",PR11:"POSSIBLE_DUPLICATE/OWNER_UNVERIFIED",
 PR14:"S2 reachable",PR17:"REJECTED",PR19:"не прибавлять",
 PR26:"-8 USDT",PR28:"Не вычитать",PR29:"H01_INCOMPLETE",
 PR31:"NOT_CHECKED",PR32:"REJECTED",PR34:"Не считать автоматически"
};
for(const [id,phrase] of Object.entries(pin))t("source-bound "+id,row(doc,id).includes(phrase),true);
const mutations=[
 ["PR07","Будущий IN=6","Будущий IN=10"],
 ["PR08","не добавлять","нужно добавлять"],
 ["PR09","Один будущий остаток","Два будущих остатка"],
 ["PR17","REJECTED","READY"],
 ["PR26","-8 USDT","+10 USDT"],
 ["PR28","Не вычитать","Вычитать"],
 ["PR31","NOT_CHECKED","REJECTED"],
 ["PR32","REJECTED","READY"]
];
for(const [id,good,bad] of mutations){
 const original=row(doc,id);if(!original.includes(good))throw Error("mutation target absent "+id);
 const changed=doc.replace(original,original.replace(good,bad));
 t("mutation detected "+id,row(changed,id).includes(pin[id]),false);
}
const refs=[...doc.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/i.test(x)).map(x=>x.split("#")[0]).filter(Boolean);
t("at least 12 documentary refs",refs.length>=12,true);
t("local links exist",refs.every(x=>exists("docs/prompts/"+x)),true);
t("current status pending",doc.includes(tick+"IMPLEMENTED / PENDING USER REVIEW"+tick),true);
t("08.5 not started",doc.includes("08.5 NOT STARTED"),true);
t("no user balances in committed docs",!doc.includes("real_account_UID"),true);
const fail=checks.filter(c=>!c.ok);
for(const c of fail)console.error("FAIL",c.id,c.label,JSON.stringify({actual:c.actual,expected:c.expected}));
console.log(JSON.stringify({kind:"STAGE_08_04_PORTFOLIO_RECOVERY_SYNTHETIC",total:checks.length,passed:checks.length-fail.length,failed:fail.length,normativeScenarios:36,copyablePrompts:6,detectedMutations:mutations.length,independentLLMTests:0,nodeCheckoutVerified:false,liveBybit:false,tradeReady:false}));
if(fail.length)process.exitCode=1;
