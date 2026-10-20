// Stage 08.7 GinArea PRO documentary + synthetic checks. Node >=18.
// node tests/stage-08-07-ginarea-handoff-synthetic.mjs
// No Bybit API, GinArea user P02, live trades, independent ChatGPT LLM or READY.
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const doc=read("docs/prompts/ginarea-configuration.md");
const skill=read(".agents/skills/ginarea-configuration/SKILL.md");
const catalogue=read("docs/platforms/ginarea.md");
const mapping=read("docs/platforms/configuration-contract.md");
const platform=read("docs/platforms/platform-validation.md");
const dialog=read("docs/workflows/interaction-contract.md");
const plan=read("docs/stage-08-plan.md");
const tests=[];
const bt=String.fromCharCode(96);
const all=(s,need)=>need.every(x=>s.includes(x));
function t(name,got,want){tests.push({name,got,want,pass:Object.is(got,want)});}
function line(body,id){return body.split("\n").find(x=>x.startsWith("| "+id+" |"))||"";}
function rowHas(body,id,words){return Boolean(line(body,id))&&words.every(x=>line(body,id).includes(x));}
function selection({platformName, strategy, pairInSelector=false, market="USDT Perpetual", p02=false}={}){
 if(platformName!=="GinArea")return "CHOOSE_PLATFORM";
 if(!["Default","Auto","Dynamic","Indicator","DCA"].includes(strategy))return "ASK_STRATEGY";
 if(market!=="USDT Perpetual")return "MARKET_NOT_SCOPE";
 if(!pairInSelector)return "NEEDS_SELECTOR";
 return p02?"P02_SCOPED_ONLY":"R2_DOC_ONLY";
}
function compat({strategy,uta=true,cross=true,positionMode="One-Way",docsConflict=false}={}){
 if(docsConflict)return "UNVERIFIED_CONFLICT";
 if(!uta)return "NEEDS_ACCOUNT_DATA";
 if(!["Default","Auto","Dynamic","Indicator","DCA"].includes(strategy))return "NEEDS_STRATEGY";
 if(!cross)return "REJECTED_NEW_CONFIGURATION";
 if(positionMode==="Hedge"&&strategy!=="Default")return "REJECTED_NEW_CONFIGURATION";
 if(!["One-Way","Hedge"].includes(positionMode))return "NEEDS_ACCOUNT_DATA";
 return "DOCUMENTED_COMPAT_ONLY";
}
function switchStrategy({wanted="Indicator",available=false,userChoseFallback=false,fallbackAvailable=false}={}){
 if(available)return wanted;
 if(!userChoseFallback)return "ASK_TO_SWITCH";
 return fallbackAvailable?"Default":"NEEDS_FALLBACK_SELECTOR";
}
function sizeLadder({base=0.1,multiplier=1.5,cap=0.3,count=4}={}){
 if(![base,multiplier,cap,count].every(Number.isFinite)||base<=0||multiplier<=0||cap<=0||count<1||!Number.isInteger(count))return null;
 let arr=[],v=base;
 for(let i=0;i<count;i++){arr.push(Math.min(v,cap));v*=multiplier;}
 return arr;
}
function nominal({number,unit}={}){return !Number.isFinite(number)||number<=0?null:unit==="USDT"?"QUOTE_NOMINAL":unit==="BASE"?"BASE_QTY":"UNKNOWN_UNIT";}
function slots({oneWay=true,longQty=0,shortQty=0,virtualOrders=0}={}){
 if(!oneWay)return "MODE_DEPENDENT";
 return longQty===shortQty?"ZERO_NET_NOT_ZERO_FUTURE":"ONE_NET_SLOT";
}
function instop(strategy){return ["Default","Dynamic"].includes(strategy)?"MAY_MERGE_IN":"NOT_VERIFIED_FOR_MODE";}
function exitState({targetHit=false,outAccepted=false,filled=false}={}){
 if(filled)return "FILL_NEEDS_EXCHANGE_RECONCILIATION";
 if(outAccepted)return "ORDER_NOT_FILL";
 return targetHit?"TRIGGER_NOT_FILL":"OPEN";
}
function disable({on=false,outOfRange=false,autoLatch=false,returnedInside=false,manualReset=false}={}){
 if(manualReset)return "RECHECK_BEFORE_NEW_IN";
 if(on||autoLatch&&outOfRange||autoLatch&&returnedInside&&on)return "STICKY_NO_NEW_IN";
 return "IN_UNRESTRICTED_BY_THIS_FLAG";
}
function lifecycle(action){return ({Pause:"NO_EXCHANGE_CLOSE",Failed:"NO_EXCHANGE_CLOSE",Close:"REQUEST_VERIFY_FILL",ManualFill:"RECHECK"})[action]||"UNKNOWN";}
function gate({h04=false,leverage=3,slots=1,imPercent=20,fullReserve=true,crossVerified=false,shortBound=false,historicalMark=false,p02=false,t02=false,mark=false,changed=false}={}){
 if(h04||leverage>5||slots>3||imPercent>30||!fullReserve)return "REJECTED";
 if(changed)return "RECHECK";
 if(!crossVerified||!shortBound||!historicalMark)return "UNVERIFIED";
 if(!p02||!t02||!mark)return "NEEDS_DATA";
 return "SYNTHETIC_ONLY_NO_LIVE_READY";
}
// 40 named fixture checks; do not call these LLM conversations.
t("GA01 platform unknown",selection({}),"CHOOSE_PLATFORM");
t("GA02 Veles selection not GinArea",selection({platformName:"Veles",strategy:"Default",pairInSelector:true}),"CHOOSE_PLATFORM");
t("GA03 strategy missing",selection({platformName:"GinArea",pairInSelector:true}),"ASK_STRATEGY");
t("GA04 Indicator unavailable",switchStrategy({wanted:"Indicator",available:false}),"ASK_TO_SWITCH");
t("GA05 fallback needs separate user approval",switchStrategy({wanted:"Indicator",userChoseFallback:true,fallbackAvailable:true}),"Default");
t("GA06 Bybit listing not GinArea selector",selection({platformName:"GinArea",strategy:"Default",pairInSelector:false}),"NEEDS_SELECTOR");
t("GA07 P01 alone no R3 exact",selection({platformName:"GinArea",strategy:"Default",pairInSelector:true,p02:false}),"R2_DOC_ONLY");
t("GA08 wrong strategy P02 cannot verify",rowHas(doc,"GA08",["UNVERIFIED"]),true);
t("GA09 nonDefault Hedge incompatible",compat({strategy:"Indicator",positionMode:"Hedge"}),"REJECTED_NEW_CONFIGURATION");
t("GA10 Default Hedge documented only",compat({strategy:"Default",positionMode:"Hedge"}),"DOCUMENTED_COMPAT_ONLY");
t("GA11 Isolated incompatible",compat({strategy:"Auto",cross:false}),"REJECTED_NEW_CONFIGURATION");
t("GA12 account modes need verification",compat({strategy:"Default",uta:false}),"NEEDS_ACCOUNT_DATA");
t("GA13 first IN USDT nominal",nominal({number:20,unit:"USDT"}),"QUOTE_NOMINAL");
t("GA14 cap is not first IN",rowHas(doc,"GA14",["Cap","одного IN"]),true);
t("GA15 spacing versus size multiplier",rowHas(doc,"GA15",["разные размерности"]),true);
t("GA16 four theoretical base orders",sizeLadder({}).join(","),"0.1,0.15000000000000002,0.22500000000000003,0.3");
t("GA17 no exact quantity without Bybit filters",rowHas(doc,"GA17",["Нет точного"]),true);
t("GA18 future IN beyond placed",rowHas(doc,"GA18",["Все reachable"]),true);
t("GA19 OneWay not two exchange slots",slots({longQty:1,shortQty:0}),"ONE_NET_SLOT");
t("GA20 zero net but future",slots({longQty:1,shortQty:1,virtualOrders:9}),"ZERO_NET_NOT_ZERO_FUTURE");
t("GA21 DCA not generic multiplier",rowHas(doc,"GA21",["Не переносить"]),true);
t("GA22 missing indicator time",rowHas(doc,"GA22",["NEEDS_DATA"]),true);
t("GA23 indicator exit not guaranteed profit",rowHas(doc,"GA23",["Не утверждать","profit"]),true);
t("GA24 Default Instop potential merged",instop("Default"),"MAY_MERGE_IN");
t("GA25 Indicator Instop not verified",instop("Indicator"),"NOT_VERIFIED_FOR_MODE");
t("GA26 OUT trigger not fill",exitState({targetHit:true}),"TRIGGER_NOT_FILL");
t("GA27 max stop not cash loss",rowHas(doc,"GA27",["Запрет смысловой"]),true);
t("GA28 stop not strict Short bound",gate({shortBound:false}),"UNVERIFIED");
t("GA29 Disable IN stops new IN only",disable({on:true}),"STICKY_NO_NEW_IN");
t("GA30 returns inside does not clear latch",disable({on:true,autoLatch:true,returnedInside:true}),"STICKY_NO_NEW_IN");
t("GA31 manual reset requires recheck",disable({manualReset:true,on:true}),"RECHECK_BEFORE_NEW_IN");
t("GA32 Pause/Failed no exchange close",lifecycle("Failed"),"NO_EXCHANGE_CLOSE");
t("GA33 Close request needs actual fill",lifecycle("Close"),"REQUEST_VERIFY_FILL");
t("GA34 manual fill invalidates",lifecycle("ManualFill"),"RECHECK");
t("GA35 edit even inside TTL",gate({changed:true}),"RECHECK");
t("GA36 unknown Cross/Short",gate({crossVerified:false,shortBound:false}),"UNVERIFIED");
t("GA37 H04 veto",gate({h04:true}),"REJECTED");
t("GA38 missing P02/T02",gate({crossVerified:true,shortBound:true,historicalMark:true,p02:false}),"NEEDS_DATA");
t("GA39 missing historical Bybit H",gate({crossVerified:true,shortBound:true,historicalMark:false,p02:true,t02:true,mark:true}),"UNVERIFIED");
t("GA40 approval not trading",rowHas(doc,"GA40",["Не выбирать GinArea","08.8"]),true);
// Additional guards for edge cases, documentation and release-safety.
t("event invalidation with otherwise nonbreaching flags",gate({changed:true,fullReserve:true}),"RECHECK");
t("all fake inputs still no live READY",gate({crossVerified:true,shortBound:true,historicalMark:true,p02:true,t02:true,mark:true}),"SYNTHETIC_ONLY_NO_LIVE_READY");
t("unknown actual P02 is only scoped draft",selection({platformName:"GinArea",strategy:"Default",pairInSelector:true,p02:true}),"P02_SCOPED_ONLY");
t("Spot not USDT perpetual",selection({platformName:"GinArea",strategy:"Default",pairInSelector:true,market:"Spot"}),"MARKET_NOT_SCOPE");
t("known incompatible account wins",compat({strategy:"Indicator",positionMode:"Hedge",docsConflict:false}),"REJECTED_NEW_CONFIGURATION");
t("contradicting P01/P02 must be UNVERIFIED",compat({strategy:"Indicator",positionMode:"Hedge",docsConflict:true}),"UNVERIFIED_CONFLICT");
t("fallback without selector not R3",switchStrategy({userChoseFallback:true,fallbackAvailable:false}),"NEEDS_FALLBACK_SELECTOR");
t("Invalid cap input cannot create ladder",sizeLadder({cap:-1}),null);
t("base quantity different from USDT nominal",nominal({number:20,unit:"BASE"}),"BASE_QTY");
t("unknown unit not converted",nominal({number:20,unit:"USD?"}),"UNKNOWN_UNIT");
t("no forced step rounding in synthetic ladder",sizeLadder({})?.length,4);
t("OUT accepted not same as filled",exitState({outAccepted:true}),"ORDER_NOT_FILL");
t("filled requires reconciliation",exitState({filled:true}),"FILL_NEEDS_EXCHANGE_RECONCILIATION");
t("DCA Instop mode not proven",instop("DCA"),"NOT_VERIFIED_FOR_MODE");
t("Dynamic Instop conditional",instop("Dynamic"),"MAY_MERGE_IN");
t("no fake reset on range reentry",disable({on:true,returnedInside:true}),"STICKY_NO_NEW_IN");
t("known H04 dominates lack P02",gate({h04:true,p02:false}),"REJECTED");
t("FR-031 leverage 8 blocks",gate({leverage:8}),"REJECTED");
t("FR-033 4 slots block",gate({slots:4}),"REJECTED");
t("FR-029 IM31 blocks",gate({imPercent:31}),"REJECTED");
t("FR-034 missing reserve blocks",gate({fullReserve:false}),"REJECTED");
t("missing account model blocks READY",gate({p02:true,t02:true,mark:true}),"UNVERIFIED");
for(let i=30;i<=35;i++){
 const id="P08-"+String(i).padStart(2,"0"),block=doc.split("### "+id+" —")[1]?.split("\n### ")[0]??"";
 t("copy-ready prompt "+id,block.includes("> ")&&block.length>110,true);
 t("route in prompt "+id,block.includes("**RT"),true);
}
for(let i=1;i<=40;i++){const id="GA"+String(i).padStart(2,"0");t("normative source case "+id,Boolean(line(doc,id)),true);}
for(let i=1;i<=40;i++){const id="GD-"+String(i).padStart(2,"0");t("GinArea P01 catalogue "+id,catalogue.includes("| "+id+" |"),true);}
for(const w of ["Indicator Grid","Default Grid","Auto Grid","Dynamic Grid","DCA","P01","P02","T02","RT07","RT09","RT10","IN","OUT","Instop","Disable IN","Sticky","positionIdx","leavesQty","One-Way","Hedge","Cross","S0","S1","S2","S3","FR-029","FR-030","FR-031","FR-032","FR-033","FR-034","FR-035/036","F/A/H/R","H04","RV-02","RV-03","RV-04","RV-06","TV-01–TV-04","READY","RECHECK","NEEDS_DATA","UNVERIFIED","REJECTED"]){
 t("source text "+w,doc.toLowerCase().includes(w.toLowerCase()),true);
}
for(const [name,body,words] of [
 ["GinArea skill",skill,["GD01–GD40","Disable IN","Indicator Grid","One-Way","Instop"]],
 ["P01 catalogue",catalogue,["GD-12","GD-13","GD-14","GD-22","GD-23","E01"]],
 ["mapping contract",mapping,["M05","M07","M08","M20","NO_DIRECT_EQUIVALENT"]],
 ["P02 contract",platform,["P01","P02","T02","VERIFIED_FOR_SCOPE"]],
 ["dialogue",dialog,["RT07","RT09","RT10","CHOOSE"]],
 ["stage08 plan",plan,["**08.7 — GinArea PRO handoff**","Indicator"]]
])t("source cross-reference "+name,all(body,words),true);
const pins={
 GA04:["NOT_AVAILABLE_FOR_SELECTED_SCOPE"],GA05:["альтернатива для отдельного выбора"],
 GA06:["NEEDS_DATA"],GA07:["NEEDS_DATA"],GA09:["REJECTED"],GA11:["REJECTED"],
 GA13:["номинала"],GA14:["Cap"],GA19:["Не считать"],GA20:["Future risk"],
 GA24:["merged"],GA25:["Не выдумывать"],GA26:["не fill"],
 GA29:["старые orders остаются"],GA30:["Sticky"],GA31:["RECHECK"],
 GA32:["CLOSE"],GA35:["RECHECK"],GA36:["UNVERIFIED"],
 GA37:["REJECTED"],GA38:["NEEDS_DATA"],GA39:["NOT_PERFORMED"],GA40:["Не выбирать"]
};
for(const [id,words] of Object.entries(pins))t("source pinned "+id,rowHas(doc,id,words),true);
const mutations=[
 ["GA04","NOT_AVAILABLE_FOR_SELECTED_SCOPE","READY"],
 ["GA05","альтернатива для отдельного выбора","автоматическая замена"],
 ["GA09","REJECTED","READY"],
 ["GA11","REJECTED","READY"],
 ["GA13","номинала","маржи"],
 ["GA14","Cap","Total"],
 ["GA24","merged","ordinary"],
 ["GA26","не fill","fill"],
 ["GA29","старые orders остаются","все ордера отменены"],
 ["GA30","Sticky","Автоматическое восстановление"],
 ["GA31","RECHECK","READY"],
 ["GA35","RECHECK","READY"],
 ["GA36","UNVERIFIED","READY"],
 ["GA37","REJECTED","READY"],
 ["GA39","NOT_PERFORMED","PASSED"],
 ["GA40","Не выбирать","Автовыбирать"]
];
for(const [id,oldWord,newWord] of mutations){
 const original=line(doc,id);if(!original.includes(oldWord))throw Error("test mutation anchor missing "+id);
 const altered=doc.replace(original,original.replace(oldWord,newWord));
 t("in-memory mutation detected "+id,rowHas(altered,id,pins[id]),false);
}
const refs=[...doc.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/i.test(x)).map(x=>x.split("#")[0]).filter(Boolean);
t("at least twelve source links",refs.length>=12,true);
t("all local source target files exist",refs.every(x=>exists("docs/prompts/"+x)),true);
t("08.7 pending",doc.includes(bt+"IMPLEMENTED / PENDING USER REVIEW"+bt),true);
t("08.8 not started",doc.includes("08.8 "+bt+"NOT STARTED"+bt),true);
// Independent self-review SR-087: stateful latch transition, not a one-shot ON flag.
function latch(state,event){
 if(event==="MANUAL_DISABLE")return "DISABLED";
 if(event==="PRICE_OUTSIDE"&&(state==="ARMED"||state==="DISABLED"))return "DISABLED";
 if(event==="PRICE_RETURNED_INSIDE")return state; // must remain DISABLED
 if(event==="MANUAL_ENABLE")return "ARMED_RECHECK_REQUIRED";
 if(event==="RISK_CHECK_CONFIRMED"&&state==="ARMED_RECHECK_REQUIRED")return "ARMED";
 return state;
}
t("latch: boundary breach disables",latch("ARMED","PRICE_OUTSIDE"),"DISABLED");
t("latch: re-enter range still disabled",latch(latch("ARMED","PRICE_OUTSIDE"),"PRICE_RETURNED_INSIDE"),"DISABLED");
t("latch: manual enable triggers review",latch("DISABLED","MANUAL_ENABLE"),"ARMED_RECHECK_REQUIRED");
t("latch: a new IN still gated until recheck",latch("ARMED_RECHECK_REQUIRED","PRICE_RETURNED_INSIDE"),"ARMED_RECHECK_REQUIRED");
t("latch: explicit risk confirmation is separate",latch("ARMED_RECHECK_REQUIRED","RISK_CHECK_CONFIRMED"),"ARMED");
// Direct normative threshold tests also catch weakening source Markdown while fixture math is unchanged.
const frLine=doc.split("\n").find(x=>x.startsWith("**FR hard gates:**"))||"";
const frPins=[
 ["FR-029≤30% E0","FR-029≤50% E0"],
 ["FR-030≤5% E0","FR-030≤15% E0"],
 ["FR-031≤5×","FR-031≤10×"],
 ["FR-032≥15%","FR-032≥5%"],
 ["FR-033≤3","FR-033≤5"],
 ["FR-034 100%","FR-034 50%"],
 ["loss ≥3%","loss ≥5%"],
 ["DD ≥15%","DD ≥25%"]
];
for(const [good,bad] of frPins){
 t("actual FR threshold source "+good,frLine.includes(good),true);
 if(!frLine.includes(good))throw Error("threshold mutation cannot be anchored "+good);
 const forged=doc.replace(frLine,frLine.replace(good,bad));
 const forgedLine=forged.split("\n").find(x=>x.startsWith("**FR hard gates:**"))||"";
 t("in-memory FR threshold mutation rejected "+good,forgedLine.includes(good),false);
}

const failed=tests.filter(x=>!x.pass);
for(const x of failed)console.error("FAIL",x.name,JSON.stringify({got:x.got,want:x.want}));
console.log(JSON.stringify({kind:"STAGE_08_07_GINAREA_HANDOFF_SYNTHETIC",total:tests.length,passed:tests.length-failed.length,failed:failed.length,normativeCases:40,copyablePrompts:6,mutations:mutations.length+frPins.length,independentLLMTests:0,actualNodeCheckout:false,liveP02:false,liveBybit:false,tradeReady:false}));
if(failed.length)process.exitCode=1;
