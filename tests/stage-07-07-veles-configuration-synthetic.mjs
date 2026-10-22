// Stage 07.7 Veles Skill synthetic tests (Node.js >=18):
// node tests/stage-07-07-veles-configuration-synthetic.mjs
// All market/account/form states are FICTIONAL; no live Bybit, Veles or trading.
import {readFileSync,existsSync} from "node:fs";
const textSkill=readFileSync(new URL("../.agents/skills/veles-configuration/SKILL.md",import.meta.url),"utf8");
const skillUrl=new URL("../.agents/skills/veles-configuration/SKILL.md",import.meta.url);
const checks=[];
function t(title,value,expected){checks.push({id:"VE"+String(checks.length+1).padStart(2,"0"),title,value,expected,pass:Object.is(value,expected)});}
function frontmatter(s){const x=s.match(/^---\nname:\s*([^\n]+)\ndescription:\s*([^\n]+)\n---\n/);return !!x&&x[1]==="veles-configuration"&&x[2].length>0&&x[2].length<=1024;}
function market(p){return !p||!p.exchange||!p.category||!p.settleCoin||!p.symbol?"MISSING_IDENTITY":p.exchange==="Bybit"&&p.category==="linear"&&p.settleCoin==="USDT"?"BYBIT_USDT_LINEAR":"MARKET_MISMATCH";}
function route({platform=null,strategy=null,selected=false}={}){if(!selected||!platform)return "SELECTION_PENDING";if(platform!=="Veles")return "WRONG_PLATFORM";if(!["SIMPLE","CUSTOM","SIGNAL"].includes(strategy))return "STRATEGY_NOT_CONFIRMED";return "VELES_INSTRUCTION_ALLOWED_NOT_READY";}
function p02({mode="R3",observed=false,actualField=false}={}){if(mode==="R2")return "DOCUMENTARY_DRAFT_ONLY";if(!observed)return "NEEDS_P02";return actualField?"FIELD_IN_ACTUAL_P02":"FIELD_NOT_VERIFIED";}
function field(name){const allowed=["Название бота","API-ключ (Привязка)","Тип торговли","Торговая пара","Депозит","Плечо","Тип маржи","Реинвест","Режим торговли","Перекрытие изменения цены","Сетка ордеров","% Мартингейла","Отступ первого ордера","Логарифмическое распределение цен","Частичное выставление сетки","Подтяжка сетки ордеров","Остановить бота после N сделок","Включать позицию на бирже в сделку","Условия открытия сделки","Тейк-профит","Стоп-лосс"];return allowed.includes(name)?"DOCUMENTARY_ONLY":"NO_VELES_P01_PROOF";}
function modeRule({tradeMode,marginMode,accountPositionMode}={}){if(!["SIMPLE","CUSTOM","SIGNAL"].includes(tradeMode))return "INVALID_STRATEGY";if(!["Cross","Isolated"].includes(marginMode))return "MARGIN_UNKNOWN";if(!["Hedge","OneWay"].includes(accountPositionMode))return "POSITION_MODE_UNKNOWN";return "CHECK_BYBIT_COMPATIBILITY_NOT_READY";}
function nominal(deposit,leverage){return Number.isFinite(deposit)&&deposit>=0&&Number.isFinite(leverage)&&leverage>0?deposit*leverage:null;}
function countSlot(positions){return new Set(positions.filter(p=>p.qty>0&&p.exchangeVerified).map(p=>p.account+"/"+p.symbol+"/"+p.positionIdx)).size;}
function positionAdopt({existingQty,include=false,additionalIN=0}={}){if(!Number.isFinite(existingQty)||!Number.isFinite(additionalIN)||existingQty<0||additionalIN<0)return null;return existingQty+additionalIN;}
function keepFuture(o){if(o.state==="FILLED"||o.state==="CANCELLED_BYBIT_CONFIRMED")return 0;if(!Number.isFinite(o.remaining)||o.remaining<0)return null;return o.remaining;}
function plannedGrid(grid){let sum=0;for(const x of grid){const rem=keepFuture(x);if(rem===null)return null;sum+=rem;}return sum;}
function exchangeDedupe(orders){const ids=new Set(),ambiguous=[];let qty=0;for(const x of orders){if(!x.provedId){ambiguous.push("POSSIBLE_DUPLICATE");qty+=x.remaining;continue;}const key=[x.account,x.symbol,x.positionIdx,x.id].join(":");if(ids.has(key))continue;ids.add(key);qty+=x.remaining;}return {qty,ambiguous:ambiguous.length};}
function stopAvailability({kind="ordinary",lastGridINFilled=false,basis=null,triggerConfirmed=false}={}){
 if(kind==="ordinary"&&!lastGridINFilled)return "NO_ORDINARY_SL_YET";
 if(kind==="signal"&&basis==="last-IN"&&!lastGridINFilled)return "WAIT_LAST_IN";
 if(kind==="signal"&&basis==="average-entry")return triggerConfirmed?"SIGNAL_CAN_TRIGGER_EARLY":"SIGNAL_CONDITION_UNKNOWN";
 if(!triggerConfirmed)return "TRIGGER_NOT_CONFIRMED";
 return "TRIGGER_PRESENT_NOT_EXECUTION";
}
function stopRisk({stopSet=false,short=true,cross=false,mmrProof=false,upperLossProof=false}={}){if(cross&&!mmrProof)return "CROSS_MMR_UNVERIFIED";if(short&&!upperLossProof)return "SHORT_UPPER_LOSS_UNVERIFIED";return stopSet?"STOP_SET_NOT_EXECUTED":"NO_STOP_PROOF";}
function lifecycle(action,{exchangeQty=2,allOrdersCancelled=false,filled=false}={}){
 if(action==="STOP")return exchangeQty>0?"PENDING_STOP_POSITION_OPEN":"STOP_STATUS_NOT_POSITION_PROOF";
 if(action==="CANCEL")return exchangeQty>0?"CANCEL_BOT_POSITION_OPEN":"CANCEL_NOT_PROOF_CLOSED";
 if(action==="CLOSE")return filled&&exchangeQty===0?"CLOSED_CONFIRMED":"CLOSE_EXECUTION_NOT_PROVED";
 if(action==="RESTART")return "FRESH_ACCOUNT_AND_RISK_REQUIRED";
 return "ACTION_UNKNOWN";
}
function riskChoice({hard=false,conflict=false,missing=false}={}){return hard?"REJECTED":conflict?"UNVERIFIED":missing?"NEEDS_DATA":"DOCUMENTARY_R2_NOT_READY";}
function takeover({positionKnown=false,ownerKnown=false,p02=false,fullT02=false}={}){return !positionKnown||!fullT02?"NEEDS_T02":!ownerKnown?"OWNER_UNVERIFIED":!p02?"NEEDS_P02":"POSITION_MINUS_ONE_NO_NEW_ORDER";}
function activation({strategy=false,veles=false,p02=false,wholeT02=false,markAge=null,event=false,hard=false,modelVerified=false,stressReal=false}={}){
 if(hard)return "REJECTED";
 if(event)return "INVALIDATED";
 if(!strategy||!veles||!p02||!wholeT02||markAge===null)return "NEEDS_DATA";
 if(markAge<0||markAge>2)return "STALE";
 if(!modelVerified||!stressReal)return "UNVERIFIED";
 return "ALL_FLAGS_SYNTHETIC_NOT_READY";
}
function h01({realized,unrealized,fees,funding,netCostsAlreadyIncluded=false}={}){
 if([realized,unrealized,fees,funding].some(x=>!Number.isFinite(x)))return null;
 return realized+unrealized+(netCostsAlreadyIncluded?0:fees+funding);
}
const k={exchange:"Bybit",category:"linear",settleCoin:"USDT",symbol:"BTCUSDT"};
t("actual skill has valid frontmatter",frontmatter(textSkill),true);
t("positive trigger",textSkill.includes("## When to use"),true);
t("negative trigger",textSkill.includes("## When NOT to use"),true);
t("approved VL reference",textSkill.includes("VL-01–VL-25"),true);
t("approved VV reference",textSkill.includes("VV01–VV34"),true);
t("has P01/P02/T02 separation",["P01","P02","T02"].every(x=>textSkill.includes(x)),true);
t("3 trade mode names",["SIMPLE","CUSTOM","SIGNAL"].every(x=>textSkill.includes(x)),true);
t("Stop/Cancel/Close/Restart distinct",["STOP","CANCEL","CLOSE","RESTART"].every(x=>textSkill.includes(x)),true);
t("stop after full grid warning",textSkill.includes("last grid IN fills"),true);
t("signal SL average-price possibility",textSkill.includes("may act earlier"),true);
t("Bybit TP trailing not presumed",textSkill.includes("NOT_VERIFIED"),true);
t("does not declare live READY",textSkill.includes("cannot actually create/activate"),true);
t("Bybit linear USDT accepted",market(k),"BYBIT_USDT_LINEAR");
t("Binance spot rejected",market({...k,exchange:"Binance",category:"spot"}),"MARKET_MISMATCH");
t("Bybit inverse rejected",market({...k,category:"inverse"}),"MARKET_MISMATCH");
t("Bybit USDC distinct",market({...k,settleCoin:"USDC"}),"MARKET_MISMATCH");
t("unknown settlement rejected",market({...k,settleCoin:null}),"MISSING_IDENTITY");
t("no selected platform",route(),"SELECTION_PENDING");
t("GinArea must not be treated as Veles",route({selected:true,platform:"GinArea",strategy:"SIMPLE"}),"WRONG_PLATFORM");
t("Veles not concrete strategy",route({selected:true,platform:"Veles"}),"STRATEGY_NOT_CONFIRMED");
t("Veles SIMPLE selected doc route",route({selected:true,platform:"Veles",strategy:"SIMPLE"}),"VELES_INSTRUCTION_ALLOWED_NOT_READY");
t("Veles CUSTOM selected doc route",route({selected:true,platform:"Veles",strategy:"CUSTOM"}),"VELES_INSTRUCTION_ALLOWED_NOT_READY");
t("Veles SIGNAL selected doc route",route({selected:true,platform:"Veles",strategy:"SIGNAL"}),"VELES_INSTRUCTION_ALLOWED_NOT_READY");
t("R2 draft no exact form proof",p02({mode:"R2"}),"DOCUMENTARY_DRAFT_ONLY");
t("R3 missing screenshot",p02(),"NEEDS_P02");
t("R3 observed field accepted as observed only",p02({observed:true,actualField:true}),"FIELD_IN_ACTUAL_P02");
t("P01 exists P02 field absent",p02({observed:true,actualField:false}),"FIELD_NOT_VERIFIED");
t("Veles Deposit is documented",field("Депозит"),"DOCUMENTARY_ONLY");
t("Veles percent martingale documented",field("% Мартингейла"),"DOCUMENTARY_ONLY");
t("Veles coverage documented",field("Перекрытие изменения цены"),"DOCUMENTARY_ONLY");
t("GinArea Disable IN not Veles",field("Disable IN"),"NO_VELES_P01_PROOF");
t("GinArea Max order size not Veles",field("Макс. размер"),"NO_VELES_P01_PROOF");
t("GinArea Instop not Veles",field("Instop"),"NO_VELES_P01_PROOF");
t("unsupported trade mode",modeRule({tradeMode:"Indicator Grid",marginMode:"Cross",accountPositionMode:"Hedge"}),"INVALID_STRATEGY");
t("unknown exchange margin",modeRule({tradeMode:"SIMPLE",accountPositionMode:"Hedge"}),"MARGIN_UNKNOWN");
t("unknown Bybit position mode",modeRule({tradeMode:"SIMPLE",marginMode:"Cross"}),"POSITION_MODE_UNKNOWN");
t("Hedge Veles still Bybit compatibility check",modeRule({tradeMode:"SIMPLE",marginMode:"Cross",accountPositionMode:"Hedge"}),"CHECK_BYBIT_COMPATIBILITY_NOT_READY");
t("OneWay cannot be assumed compatible",modeRule({tradeMode:"SIGNAL",marginMode:"Isolated",accountPositionMode:"OneWay"}),"CHECK_BYBIT_COMPATIBILITY_NOT_READY");
t("synthetic deposit 50 x3 planned notional",nominal(50,3),150);
t("synthetic deposit not exact IM",nominal(25,5),125);
t("invalid deposit unknown",nominal(NaN,3),null);
t("existing position virtual record no extra order",positionAdopt({existingQty:2,include:true,additionalIN:0}),2);
t("adoption with future 0.5 IN raises exposure only 0.5",positionAdopt({existingQty:2,include:true,additionalIN:.5}),2.5);
t("two bot views one confirmed OneWay slot",countSlot([{account:"A",symbol:"BTC",positionIdx:0,qty:2,exchangeVerified:true},{account:"A",symbol:"BTC",positionIdx:0,qty:2,exchangeVerified:true}]),1);
t("Hedge long+short separate slots",countSlot([{account:"A",symbol:"BTC",positionIdx:1,qty:2,exchangeVerified:true},{account:"A",symbol:"BTC",positionIdx:2,qty:2,exchangeVerified:true}]),2);
t("empty slot not counted",countSlot([{account:"A",symbol:"BTC",positionIdx:0,qty:0,exchangeVerified:true}]),0);
t("filled order not future",keepFuture({state:"FILLED",remaining:4}),0);
t("cancelled confirmed on exchange not future",keepFuture({state:"CANCELLED_BYBIT_CONFIRMED",remaining:4}),0);
t("bot claimed cancellation not exchange confirmation",keepFuture({state:"CANCELLED_BY_BOT",remaining:4}),4);
t("partial fill counts leaves not total",keepFuture({state:"PARTIALLY_FILLED",remaining:2}),2);
t("unknown remaining cannot become zero",keepFuture({state:"PENDING",remaining:null}),null);
t("grid planned+partial+filled",plannedGrid([{state:"VIRTUAL",remaining:6},{state:"PARTIALLY_FILLED",remaining:2},{state:"FILLED",remaining:9}]),8);
t("grid including unknown remainder cannot be exact",plannedGrid([{state:"VIRTUAL",remaining:6},{state:"PENDING",remaining:null}]),null);
const sampleOrders=[{account:"A",symbol:"BTC",positionIdx:0,provedId:true,id:"X",remaining:2},{account:"A",symbol:"BTC",positionIdx:0,provedId:true,id:"X",remaining:2}];
t("verified Bybit ID duplicated in bot counted once",exchangeDedupe(sampleOrders).qty,2);
t("different exchange IDs same quantity counted both",exchangeDedupe([sampleOrders[0],{...sampleOrders[1],id:"Y"}]).qty,4);
t("unproved ID not auto collapsed",exchangeDedupe([{...sampleOrders[0],provedId:false},{...sampleOrders[0],provedId:false}]).ambiguous,2);
t("ordinary SL before last IN absent",stopAvailability({kind:"ordinary",lastGridINFilled:false}),"NO_ORDINARY_SL_YET");
t("ordinary SL after all fills still needs trigger proof",stopAvailability({kind:"ordinary",lastGridINFilled:true}),"TRIGGER_NOT_CONFIRMED");
t("ordinary SL exchange trigger is not fill",stopAvailability({kind:"ordinary",lastGridINFilled:true,triggerConfirmed:true}),"TRIGGER_PRESENT_NOT_EXECUTION");
t("signal SL last-IN basis waits full grid",stopAvailability({kind:"signal",basis:"last-IN",lastGridINFilled:false}),"WAIT_LAST_IN");
t("signal SL average-price can act before last grid",stopAvailability({kind:"signal",basis:"average-entry",lastGridINFilled:false,triggerConfirmed:true}),"SIGNAL_CAN_TRIGGER_EARLY");
t("signal SL average-price trigger unknown",stopAvailability({kind:"signal",basis:"average-entry",lastGridINFilled:false}),"SIGNAL_CONDITION_UNKNOWN");
t("set stop does not bound Short maximum loss",stopRisk({stopSet:true,short:true}),"SHORT_UPPER_LOSS_UNVERIFIED");
t("Cross stop does not prove account liquidation",stopRisk({stopSet:true,short:true,cross:true,mmrProof:false}),"CROSS_MMR_UNVERIFIED");
t("fully synthetic upper-proof remains stop, not fill",stopRisk({stopSet:true,short:true,upperLossProof:true}),"STOP_SET_NOT_EXECUTED");
t("Stop button with active trade remains open",lifecycle("STOP"),"PENDING_STOP_POSITION_OPEN");
t("Cancel bot with active futures position remains open",lifecycle("CANCEL"),"CANCEL_BOT_POSITION_OPEN");
t("Close button not filled does not guarantee closed",lifecycle("CLOSE"),"CLOSE_EXECUTION_NOT_PROVED");
t("Close partial leaves position live",lifecycle("CLOSE",{filled:true,exchangeQty:1}),"CLOSE_EXECUTION_NOT_PROVED");
t("Close verified fill with zero position",lifecycle("CLOSE",{filled:true,exchangeQty:0}),"CLOSED_CONFIRMED");
t("Restart requires fresh account/risk",lifecycle("RESTART"),"FRESH_ACCOUNT_AND_RISK_REQUIRED");
t("known hard breach wins",riskChoice({hard:true,conflict:true,missing:true}),"REJECTED");
t("unknown Cross proof wins over missing",riskChoice({conflict:true,missing:true}),"UNVERIFIED");
t("missing P02 alone means NEEDS_DATA",riskChoice({missing:true}),"NEEDS_DATA");
t("documentary config never READY",riskChoice(),"DOCUMENTARY_R2_NOT_READY");
t("takeover without Bybit T02",takeover({positionKnown:true,ownerKnown:true,p02:true}),"NEEDS_T02");
t("takeover with unknown owner",takeover({positionKnown:true,fullT02:true,p02:true}),"OWNER_UNVERIFIED");
t("takeover missing P02",takeover({positionKnown:true,fullT02:true,ownerKnown:true}),"NEEDS_P02");
t("takeover complete flags only virtual Position -1",takeover({positionKnown:true,fullT02:true,ownerKnown:true,p02:true}),"POSITION_MINUS_ONE_NO_NEW_ORDER");
t("R3 active violation blocks even if no P02",activation({hard:true}),"REJECTED");
t("R3 event invalidation",activation({event:true}),"INVALIDATED");
t("R3 no P02 blocks",activation({strategy:true,veles:true,wholeT02:true,markAge:1}),"NEEDS_DATA");
t("R3 Mark older than 2 minutes",activation({strategy:true,veles:true,p02:true,wholeT02:true,markAge:3}),"STALE");
t("R3 Cross/Short model unknown",activation({strategy:true,veles:true,p02:true,wholeT02:true,markAge:1}),"UNVERIFIED");
t("R3 synthetic complete flags not a trade permit",activation({strategy:true,veles:true,p02:true,wholeT02:true,markAge:1,modelVerified:true,stressReal:true}),"ALL_FLAGS_SYNTHETIC_NOT_READY");
t("H01 -15+10-1-2=-8",h01({realized:-15,unrealized:10,fees:-1,funding:-2}),-8);
t("H01 net fields already included avoid double fee subtraction",h01({realized:-18,unrealized:10,fees:-1,funding:-2,netCostsAlreadyIncluded:true}),-8);
t("H01 fee missing cannot prove recovery",h01({realized:-15,unrealized:10,fees:NaN,funding:-2}),null);
const refs=[...textSkill.matchAll(/\]\(([^) \n]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:/.test(x));
t("17 approved internal links",refs.length,17);
t("all five existing sibling Skills linked",["data-verification","market-analysis","portfolio-analysis","risk-assessment","strategy-planning"].every(x=>refs.includes("../"+x+"/SKILL.md")),true);
t("source veles.md linked",refs.includes("../../../docs/platforms/veles.md"),true);
t("all relative source paths exist",refs.every(x=>existsSync(new URL(x,skillUrl))),true);
const failed=checks.filter(x=>!x.pass);
for(const f of failed)console.error("FAIL",f.id,f.title,JSON.stringify({actual:f.value,expected:f.expected}));
console.log(JSON.stringify({kind:"LOCAL_VELES_SYNTHETIC_ONLY",total:checks.length,passed:checks.length-failed.length,failed:failed.length,realVelesP02:false,realBybitT02:false,realSkillRuntime:false,tradeReady:false}));
if(failed.length)process.exitCode=1;
