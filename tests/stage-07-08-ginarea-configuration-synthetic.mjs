// Synthetic-only Stage 07.8 checks. In actual checkout: node tests/stage-07-08-ginarea-configuration-synthetic.mjs
// Does NOT call Bybit/GinArea, discover ChatGPT Skills or create live bot parameters.
import {readFileSync,existsSync} from "node:fs";
const skillText=readFileSync(new URL("../.agents/skills/ginarea-configuration/SKILL.md",import.meta.url),"utf8");
const skillUrl=new URL("../.agents/skills/ginarea-configuration/SKILL.md",import.meta.url);
const checks=[];
function t(name,actual,expected){checks.push({id:"GA"+String(checks.length+1).padStart(2,"0"),name,actual,expected,pass:Object.is(actual,expected)});}
const ST=["Default","Auto","Dynamic","Indicator","DCA"];
function route({userPlatform=null,chosenStrategy=null,selected=false}={}){return !selected||!userPlatform?"USER_SELECTION_PENDING":userPlatform!=="GinArea"?"WRONG_PLATFORM":!ST.includes(chosenStrategy)?"STRATEGY_NOT_CONFIRMED":"GINAREA_DOCUMENTARY_NOT_READY";}
function market(x){return !x||!x.exchange||!x.category||!x.settleCoin||!x.symbol?"MISSING_IDENTITY":x.exchange==="Bybit"&&x.category==="linear"&&x.settleCoin==="USDT"?"USDT_PERPETUAL_CONTEXT":"WRONG_MARKET";}
function compatible({account="UTA",margin="Cross",mode="OneWay",strategy="Default",p02Contradiction=false}={}){return p02Contradiction?"UNVERIFIED_CONFLICT":!account||!margin||!mode||!strategy?"NEEDS_DATA":account!=="UTA"||margin!=="Cross"?"REJECTED_MODE":!ST.includes(strategy)?"UNSUPPORTED_STRATEGY":mode==="Hedge"&&strategy!=="Default"?"REJECTED_HEDGE_NON_DEFAULT":!["Hedge","OneWay"].includes(mode)?"NEEDS_DATA":"DOCUMENTARY_COMPATIBLE_P02_UNVERIFIED";}
function selector({strategy,bybitListed=false,visibleInGinArea=false}={}){return !ST.includes(strategy)?"STRATEGY_UNVERIFIED":!visibleInGinArea?"PAIR_NOT_CONFIRMED_FOR_STRATEGY":"PAIR_VISIBLE_NOT_FULL_READY";}
function fieldForStrategy(field,strategy){const special={Indicator:["Условия входа","Индикатор","Таймфрейм и период","Условия выхода"],Dynamic:["Start Offset (%)","IN Open Offset (%)"],DCA:["Периодичность сделок","Количество циклов"]};const category=Object.keys(special).find(k=>special[k].includes(field));return !ST.includes(strategy)?"UNKNOWN_STRATEGY":category&&category!==strategy?"NOT_THIS_STRATEGY":category?"CONDITIONAL_P02_REQUIRED":"GENERAL_P01_REQUIRES_P02";}
function p02(mode,exists){return mode==="R2"?"DOCUMENTARY_DRAFT_ONLY":exists?"P02_PRESENT_NOT_READY":"NEEDS_DATA_P02";}
function typeAmount(value,unit,price){return !Number.isFinite(value)||value<=0?"INVALID_AMOUNT":unit==="USDT"&&Number.isFinite(price)&&price>0?"NOMINAL_NEEDS_EXCHANGE_ROUNDING":unit==="BASE"?"BASE_QTY_NEEDS_EXCHANGE_ROUNDING":"UNIT_OR_PRICE_UNKNOWN";}
function orderCap(base,mult,max,n){if([base,mult,max,n].some(x=>!Number.isFinite(x))||base<=0||mult<=0||max<base||n<1||!Number.isInteger(n))return null;const a=[];for(let i=0;i<n;i++)a.push(Math.min(max,base*mult**i));return a;}
function gridSize(a){return Array.isArray(a)&&a.every(x=>Number.isFinite(x))?a.reduce((s,x)=>s+x,0):null;}
function stepKind(x){return x==="Множитель шага сетки"?"PRICE_DISTANCE":x==="Мультипликатор"?"ORDER_SIZE":x==="Перекрытие изменения цены"?"VELES_ONLY":"UNKNOWN";}
function disable({enabled=false,breached=false,latch=false,manualReset=false}={}){return manualReset?"NEW_IN_POSSIBLE_AFTER_NEW_RISK_CHECK":enabled||breached||latch?"NO_NEW_IN_EXISTING_EXPOSURE_PERSISTS":"NEW_IN_MAY_BE_ALLOWED_NEEDS_RISK";}
function bound({within=true,hadLatch=false,auto=true}={}){return !auto?"NO_AUTO_DISABLE":hadLatch||!within?"STICKY_DISABLE":"NO_BOUND_TRIGGER_YET";}
function lifecycle({event,bybitQty=2,fillConfirmed=false}={}){if(event==="Pause")return "PAUSE_NOT_CLOSE";if(event==="Disable IN")return "NO_NEW_IN_NOT_ZERO_RISK";if(event==="Failed")return "FAILED_NOT_ZERO_RISK";if(event==="Close"&&(!fillConfirmed||bybitQty>0))return "EXCHANGE_CLOSE_UNVERIFIED";if(event==="Close"&&fillConfirmed&&bybitQty===0)return "EXCHANGE_CLOSE_CONFIRMED";if(event==="Restart")return "INVALIDATE_AND_RECHECK";return "UNKNOWN_EVENT";}
function flow({status,qty,leaves,verifiedCancel=false}={}){if(status==="FILLED"||status==="EXCHANGE_CANCELLED"&&verifiedCancel)return 0;if(!Number.isFinite(qty)||!Number.isFinite(leaves)||leaves<0||leaves>qty)return null;return leaves;}
function dedup(orders){const ids=new Set();let n=0,amb=0;for(const o of orders){const key=o.verified&&o.id?[o.account,o.symbol,o.positionIdx,o.id].join(":"):null;if(!key)amb++;if(key&&ids.has(key))continue;if(key)ids.add(key);n++;}return {distinct:n,uncertain:amb};}
function oneWay({buy=0,sell=0,positionMode="OneWay"}={}){return positionMode==="OneWay"?{net:buy-sell,slots:buy===sell?0:1,virtualSides:(buy>0?1:0)+(sell>0?1:0)}:{net:null,slots:(buy>0?1:0)+(sell>0?1:0),virtualSides:0};}
function instop({missed,merged=false,perInCap=1}={}){return !Array.isArray(missed)||missed.some(x=>!Number.isFinite(x))?"UNKNOWN_MERGED_SIZE":merged&&gridSize(missed)>perInCap?"MERGED_MAY_EXCEED_SINGLE_CAP":merged?"MERGED_NEEDS_BYBIT_CONFIRM":"ORDERS_NOT_PROVEN";}
function status({hard=false,conflict=false,missing=false}={}){return hard?"REJECTED":conflict?"UNVERIFIED":missing?"NEEDS_DATA":"DOCUMENTARY_NOT_READY";}
function ready({p02=false,t02=false,markFresh=false,riskModel=false,realHistoricalStress=false}={}){return p02&&t02&&markFresh&&riskModel&&realHistoricalStress?"SYNTHETIC_FLAGS_NOT_REAL_READY":"NOT_READY";}
function h01({realized,unrealized,fees,funding,alreadyNet=false}){return [realized,unrealized,fees,funding].every(Number.isFinite)?realized+unrealized+(alreadyNet?0:fees+funding):null;}
const sym={exchange:"Bybit",category:"linear",settleCoin:"USDT",symbol:"GPSUSDT"};
t("actual skill YAML frontmatter",/^---\nname: ginarea-configuration\ndescription: [^\n]+\n---\n/.test(skillText),true);
t("when to use",skillText.includes("## When to use"),true);
t("when not to use",skillText.includes("## When **not** to use"),true);
t("documentary GD catalog",skillText.includes("GD01–GD40"),true);
t("5 strategies documented",["Default","Auto","Dynamic","Indicator","DCA"].every(x=>skillText.includes(x)),true);
t("risk S0-S3 and FR",["S0","S1","S2","S3","FR-029","FR-030","FR-031","FR-032","FR-033","FR-034"].every(x=>skillText.includes(x)),true);
t("P01 P02 T02 distinction",["P01","P02","T02"].every(x=>skillText.includes(x)),true);
t("no live READY",skillText.includes("does not output live READY"),true);
t("all sister skills linked",["risk-assessment","portfolio-analysis","data-verification","strategy-planning"].every(x=>skillText.includes("../"+x+"/SKILL.md")),true);
t("no platform choice",route(),"USER_SELECTION_PENDING");
t("Veles is not GinArea",route({selected:true,userPlatform:"Veles",chosenStrategy:"Default"}),"WRONG_PLATFORM");
t("chosen GinArea without exact strategy",route({selected:true,userPlatform:"GinArea"}),"STRATEGY_NOT_CONFIRMED");
t("Default documentary route",route({selected:true,userPlatform:"GinArea",chosenStrategy:"Default"}),"GINAREA_DOCUMENTARY_NOT_READY");
t("Indicator documentary route",route({selected:true,userPlatform:"GinArea",chosenStrategy:"Indicator"}),"GINAREA_DOCUMENTARY_NOT_READY");
t("Bybit USDT linear market",market(sym),"USDT_PERPETUAL_CONTEXT");
t("Binance Spot is not Bybit perp",market({...sym,exchange:"Binance",category:"spot"}),"WRONG_MARKET");
t("USDC not USDT",market({...sym,settleCoin:"USDC"}),"WRONG_MARKET");
t("missing symbol",market({...sym,symbol:null}),"MISSING_IDENTITY");
t("non-UTA cannot qualify",compatible({account:"Classic"}),"REJECTED_MODE");
t("Isolated documented incompatible for Bybit",compatible({margin:"Isolated"}),"REJECTED_MODE");
t("Default OneWay documented compatible",compatible({strategy:"Default",mode:"OneWay"}),"DOCUMENTARY_COMPATIBLE_P02_UNVERIFIED");
t("Default Hedge exception only documentary",compatible({strategy:"Default",mode:"Hedge"}),"DOCUMENTARY_COMPATIBLE_P02_UNVERIFIED");
t("Auto Hedge forbidden",compatible({strategy:"Auto",mode:"Hedge"}),"REJECTED_HEDGE_NON_DEFAULT");
t("Indicator Hedge forbidden",compatible({strategy:"Indicator",mode:"Hedge"}),"REJECTED_HEDGE_NON_DEFAULT");
t("Dynamic Hedge forbidden",compatible({strategy:"Dynamic",mode:"Hedge"}),"REJECTED_HEDGE_NON_DEFAULT");
t("DCA Hedge forbidden",compatible({strategy:"DCA",mode:"Hedge"}),"REJECTED_HEDGE_NON_DEFAULT");
t("conflicting live P02 docs is UNVERIFIED",compatible({strategy:"Auto",mode:"Hedge",p02Contradiction:true}),"UNVERIFIED_CONFLICT");
t("unknown position mode",compatible({mode:null}),"NEEDS_DATA");
t("unknown strategy",compatible({strategy:"WRONG"}),"UNSUPPORTED_STRATEGY");
t("bybit-listed but not selectable Indicator Grid",selector({strategy:"Indicator",bybitListed:true,visibleInGinArea:false}),"PAIR_NOT_CONFIRMED_FOR_STRATEGY");
t("selectable Default not final",selector({strategy:"Default",visibleInGinArea:true}),"PAIR_VISIBLE_NOT_FULL_READY");
t("unconfirmed strategy selector",selector({strategy:"Unknown",visibleInGinArea:true}),"STRATEGY_UNVERIFIED");
t("Indicator condition only Indicator",fieldForStrategy("Условия входа","Indicator"),"CONDITIONAL_P02_REQUIRED");
t("Indicator condition not Default",fieldForStrategy("Условия входа","Default"),"NOT_THIS_STRATEGY");
t("DCA period not Indicator",fieldForStrategy("Периодичность сделок","Indicator"),"NOT_THIS_STRATEGY");
t("Dynamic offset not Default",fieldForStrategy("Start Offset (%)","Default"),"NOT_THIS_STRATEGY");
t("Dynamic offset only Dynamic",fieldForStrategy("Start Offset (%)","Dynamic"),"CONDITIONAL_P02_REQUIRED");
t("DCA cycles only DCA if P02",fieldForStrategy("Количество циклов","DCA"),"CONDITIONAL_P02_REQUIRED");
t("order size common field needs actual P02",fieldForStrategy("Размер ордера","Default"),"GENERAL_P01_REQUIRES_P02");
t("R2 permits doc only",p02("R2",false),"DOCUMENTARY_DRAFT_ONLY");
t("R3 no actual form",p02("R3",false),"NEEDS_DATA_P02");
t("R3 actual form alone not READY",p02("R3",true),"P02_PRESENT_NOT_READY");
t("20 USDT first IN is nominal not 20 coins",typeAmount(20,"USDT",.1),"NOMINAL_NEEDS_EXCHANGE_ROUNDING");
t("20 BASE IN qty unit distinct",typeAmount(20,"BASE",.1),"BASE_QTY_NEEDS_EXCHANGE_ROUNDING");
t("unknown USDT-to-BASE conversion",typeAmount(20,"USDT",null),"UNIT_OR_PRICE_UNKNOWN");
t("invalid zero amount",typeAmount(0,"USDT",.1),"INVALID_AMOUNT");
t("0.1 x1.5 capped .3 first",orderCap(.1,1.5,.3,4)[0],.1);
t("0.1 x1.5 capped .3 second",orderCap(.1,1.5,.3,4)[1],.15);
t("0.1 x1.5 capped .3 third",Math.round(orderCap(.1,1.5,.3,4)[2]*1000)/1000,.225);
t("0.1 x1.5 capped .3 fourth",orderCap(.1,1.5,.3,4)[3],.3);
t("size total > per order cap",gridSize(orderCap(.1,1.5,.3,4))>.3,true);
t("order multiplier missing no exact ladder",orderCap(.1,NaN,.3,4),null);
t("max below first size invalid",orderCap(.2,1.5,.1,4),null);
t("price distance multiplier different from IN multiplier",stepKind("Множитель шага сетки"),"PRICE_DISTANCE");
t("IN multiplier affects size",stepKind("Мультипликатор"),"ORDER_SIZE");
t("Veles coverage not GinArea",stepKind("Перекрытие изменения цены"),"VELES_ONLY");
t("enabled Disable IN does not clear position",disable({enabled:true}),"NO_NEW_IN_EXISTING_EXPOSURE_PERSISTS");
t("price out of bounds auto disable",disable({breached:true}),"NO_NEW_IN_EXISTING_EXPOSURE_PERSISTS");
t("sticky disable even when inside",disable({latch:true}),"NO_NEW_IN_EXISTING_EXPOSURE_PERSISTS");
t("manual reset requires new risk check",disable({latch:true,manualReset:true}),"NEW_IN_POSSIBLE_AFTER_NEW_RISK_CHECK");
t("bound exceeded sticky",bound({within:false}),"STICKY_DISABLE");
t("back inside does not reset latch",bound({within:true,hadLatch:true}),"STICKY_DISABLE");
t("no range trigger",bound({within:true}),"NO_BOUND_TRIGGER_YET");
t("auto setting off does not latch",bound({within:false,auto:false}),"NO_AUTO_DISABLE");
t("pause not confirmed exchange close",lifecycle({event:"Pause"}),"PAUSE_NOT_CLOSE");
t("disable not confirmed zero risk",lifecycle({event:"Disable IN"}),"NO_NEW_IN_NOT_ZERO_RISK");
t("Failed does not mean flat",lifecycle({event:"Failed"}),"FAILED_NOT_ZERO_RISK");
t("requested close no fill",lifecycle({event:"Close",fillConfirmed:false}),"EXCHANGE_CLOSE_UNVERIFIED");
t("partial close position persists",lifecycle({event:"Close",fillConfirmed:true,bybitQty:1}),"EXCHANGE_CLOSE_UNVERIFIED");
t("fully closed on exchange only when verified",lifecycle({event:"Close",fillConfirmed:true,bybitQty:0}),"EXCHANGE_CLOSE_CONFIRMED");
t("restart invalidates old snapshot",lifecycle({event:"Restart"}),"INVALIDATE_AND_RECHECK");
t("fully FILLED not future obligation",flow({status:"FILLED",qty:3,leaves:2}),0);
t("confirmed exchange cancelled no future leaves",flow({status:"EXCHANGE_CANCELLED",qty:3,leaves:2,verifiedCancel:true}),0);
t("bot-only cancelled still exchange risk",flow({status:"BOT_CANCELLED",qty:3,leaves:2}),2);
t("partial fill remaining quantity",flow({status:"PARTIAL",qty:3,leaves:2}),2);
t("invalid leaves must be unknown",flow({status:"ACTIVE",qty:3,leaves:4}),null);
const ord={account:"T",symbol:"BTCUSDT",positionIdx:0,id:"X",verified:true};
t("verified same order ID counted once",dedup([ord,ord]).distinct,1);
t("two different order IDs distinct",dedup([ord,{...ord,id:"Y"}]).distinct,2);
t("unverified order ID not collapsed",dedup([{...ord,verified:false},{...ord,verified:false}]).uncertain,2);
t("OneWay virtual Long 4 vs Short 4 net zero",oneWay({buy:4,sell:4}).net,0);
t("OneWay equal sides zero occupied slots",oneWay({buy:4,sell:4}).slots,0);
t("OneWay virtual sides both present",oneWay({buy:4,sell:4}).virtualSides,2);
t("OneWay nonzero net one exchange slot",oneWay({buy:5,sell:4}).slots,1);
t("Hedge Buy and Sell occupy two exchange slots",oneWay({buy:4,sell:4,positionMode:"Hedge"}).slots,2);
t("Instop merged sum may exceed per IN cap",instop({missed:[1,1,1],merged:true,perInCap:2}),"MERGED_MAY_EXCEED_SINGLE_CAP");
t("Instop merged within per IN cap still needs Bybit confirmation",instop({missed:[1,1],merged:true,perInCap:3}),"MERGED_NEEDS_BYBIT_CONFIRM");
t("Instop not merged is not proof of multiple orders",instop({missed:[1,1],merged:false}),"ORDERS_NOT_PROVEN");
t("Instop undefined amounts cannot be computed",instop({missed:[1,NaN],merged:true}),"UNKNOWN_MERGED_SIZE");
t("known H04 rejection priority",status({hard:true,conflict:true,missing:true}),"REJECTED");
t("conflicting Cross or IN size outranks missing",status({conflict:true,missing:true}),"UNVERIFIED");
t("missing current P02 only",status({missing:true}),"NEEDS_DATA");
t("all synthetic passes not READY",status(),"DOCUMENTARY_NOT_READY");
t("missing P02 no READY",ready({t02:true,markFresh:true,riskModel:true,realHistoricalStress:true}),"NOT_READY");
t("historical F/A/H/R missing no READY",ready({p02:true,t02:true,markFresh:true,riskModel:true}),"NOT_READY");
t("all boolean flags synthetic never live READY",ready({p02:true,t02:true,markFresh:true,riskModel:true,realHistoricalStress:true}),"SYNTHETIC_FLAGS_NOT_REAL_READY");
t("H01 bot profit not series net -8",h01({realized:-15,unrealized:10,fees:-1,funding:-2}),-8);
t("H01 costs already net not double counted",h01({realized:-18,unrealized:10,fees:-1,funding:-2,alreadyNet:true}),-8);
t("missing funding cannot assert recovered",h01({realized:-15,unrealized:10,fees:-1,funding:NaN}),null);
const links=[...skillText.matchAll(/\]\(([^) \n]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/.test(x));
t("at least 17 internal reference links",links.length>=17,true);
t("all five supporting sister Skills linked",["data-verification","market-analysis","portfolio-analysis","risk-assessment","strategy-planning"].every(x=>links.includes("../"+x+"/SKILL.md")),true);
t("GinArea source linked",links.includes("../../../docs/platforms/ginarea.md"),true);
t("all internal relative targets exist in checkout",links.every(x=>existsSync(new URL(x,skillUrl))),true);
const fails=checks.filter(x=>!x.pass);
for(const f of fails)console.error("FAIL",f.id,f.name,JSON.stringify({got:f.actual,expected:f.expected}));
console.log(JSON.stringify({kind:"LOCAL_SYNTHETIC_GINAREA_ONLY",total:checks.length,passed:checks.length-fails.length,failed:fails.length,realGinAreaP02:false,realBybitT02:false,realChatGPTSkillRuntime:false,tradeReady:false}));
if(fails.length)process.exitCode=1;
