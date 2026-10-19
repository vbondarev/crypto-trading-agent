// Stage 07.9 composition regression: deterministic SYNTHETIC tests of the accepted Skill-routing contract.
// Run on a checked-out feature branch with Node >=18:
//   node tests/stage-07-09-composition-synthetic.mjs
// Does not invoke ChatGPT Skill runtime, Bybit, Veles, GinArea, live stress engines or exchange orders.
import {readFileSync,existsSync} from "node:fs";
import {auditPolicy,loadPolicyFiles} from "./stage-07-09-policy-contract-synthetic.mjs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const fileExists=p=>existsSync(resolve(ROOT,p));

const slugs=["data-verification","market-analysis","portfolio-analysis","risk-assessment","strategy-planning","veles-configuration","ginarea-configuration"];
const skill=Object.fromEntries(slugs.map(x=>[x,read(".agents/skills/"+x+"/SKILL.md")]));
const doc={
 contract:read("docs/stage-07-skills-contract.md"),
 plan:read("docs/stage-07-plan.md"),
 risk:read("docs/risk-management.md"),
 requirements:read("docs/requirements.md"),
 agents:read("AGENTS.md"),
 ginarea:read("docs/platforms/ginarea.md"),
 veles:read("docs/platforms/veles.md"),
 stage08:read("docs/stage-07-08-validation.md")
};
const checks=[];
function t(name,actual,expected){checks.push({id:"RC"+String(checks.length+1).padStart(3,"0"),name,actual,expected,pass:Object.is(actual,expected)});}
function validHeader(name,s){const m=s.match(/^---\nname:\s*([^\n]+)\ndescription:\s*([^\n]+)\n---\n/);return !!m&&m[1]===name&&m[2].length>0&&m[2].length<=1024&&s.length>300;}
function relative(from,rel){const parts=[];for(const s of(from.slice(0,from.lastIndexOf("/")+1)+rel).split("/")){if(s==="..")parts.pop();else if(s&&s!==".")parts.push(s);}return parts.join("/");}
function internalLinks(file,body){return [...body.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1].split("#")[0]).filter(x=>x&&!/^[a-z]+:\/\//i.test(x)).map(u=>relative(file,u));}
function route(type,{platform=null,selected=false,live=false,hasPosition=false,needsConfig=false}={}){
 const dv="data-verification",ma="market-analysis",pa="portfolio-analysis",ra="risk-assessment",sp="strategy-planning";
 if(type==="education")return [];
 if(type==="market")return live?[dv,ma]:[ma];
 if(type==="technical")return [dv,ma,...(hasPosition?[pa,ra]:[]),sp];
 if(type==="portfolio")return [dv,pa,ra];
 if(type==="recovery")return [dv,pa,ra,sp];
 if(type==="compare")return [sp];
 if(type==="configuration"||type==="r3"){
   const before=[dv,pa,ra];
   if(!selected||!["Veles","GinArea"].includes(platform))return [...before,sp];
   return [...before,...(type==="configuration"?[sp]:[]),platform==="Veles"?"veles-configuration":"ginarea-configuration"];
 }
 if(type==="resnapshot")return [dv,pa,ra,...(needsConfig&&selected&&["Veles","GinArea"].includes(platform)?[platform==="Veles"?"veles-configuration":"ginarea-configuration"]:[])];
 return [];
}
function status({hard=false,critical=false,missing=false,realEvidence=false}={}){
 return hard?"REJECTED":critical?"UNVERIFIED":missing?"NEEDS_DATA":realEvidence?"CANDIDATE_ONLY_NOT_LIVE_READY":"LOCAL_CHECK_NOT_READY";
}
function evidence({r3=false,p02=false,t02=false,markAge=null,t02Age=null,changed=false,actualMarket=false,realHistory=false,mmr=false,shortBound=false}={}){
 if(!r3)return "PRELIMINARY";
 if(changed)return "INVALIDATED";
 if(!p02||!t02||markAge===null||t02Age===null||!actualMarket)return "NEEDS_DATA";
 if(markAge>2||t02Age>5||markAge<0||t02Age<0)return "STALE";
 if(!realHistory||!mmr||!shortBound)return "UNVERIFIED";
 return "EVIDENCE_FLAGS_ONLY_NOT_LIVE_READY";
}
function platformField(platform,label){
 const V=new Set(["Депозит","% Мартингейла","Перекрытие изменения цены","POSITION -1"]);
 const G=new Set(["Размер ордера","Макс. размер","Мультипликатор","Disable IN","Инстоп","Шаг сетки"]);
 return platform==="Veles"?V.has(label):platform==="GinArea"?G.has(label):false;
}
function gridSelector({platform,chosen=false,strategy=null,pairAvailable=false}={}){
 if(!chosen)return "USER_SELECTION_PENDING";
 if(!["Veles","GinArea"].includes(platform))return "PLATFORM_UNVERIFIED";
 if(!strategy)return "STRATEGY_NOT_CHOSEN";
 return !pairAvailable?"PAIR_UNVERIFIED":"DOCUMENTARY_ONLY_P02_REQUIRED";
}
function compatibleGinarea({strategy="Default",mode="OneWay",margin="Cross",account="UTA",p02Conflict=false}={}){
 if(p02Conflict)return "UNVERIFIED";
 if(account!=="UTA"||margin!=="Cross")return "REJECTED";
 if(mode==="Hedge"&&strategy!=="Default")return "REJECTED";
 return "P01_ONLY";
}
function positionCount(a){return new Set(a.filter(p=>p.qty>0).map(p=>[p.account,p.symbol,p.idx].join("|"))).size;}
function botRisk({event,exchangeSize=1,confirmed=false}={}){
 if(event==="Disable IN")return "IN_DISABLED_POSITION_UNCHANGED";
 if(event==="Pause"||event==="Failed")return "BOT_STATE_NOT_EXCHANGE_CLOSE";
 if(event==="Cancel deal")return "CANCEL_UNFILLED_NOT_POSITION_CLOSE";
 if(event==="Close"&&confirmed&&exchangeSize===0)return "CLOSED_ON_EXCHANGE";
 return "POSITION_MUST_BE_RECONCILED";
}
function futureOrder({state,leaves}){if(["FILLED","EXCHANGE_CANCELLED_CONFIRMED"].includes(state))return 0;return Number.isFinite(leaves)&&leaves>=0?leaves:null;}
function lossSeries({r,u,fee,funding}){return [r,u,fee,funding].every(Number.isFinite)?r+u+fee+funding:null;}
function stress({F=false,A=false,H=false,R=false,historyReal=false}={}){return F&&A&&H&&R&&historyReal?"FOUR_FAMILY_FLAGS_NOT_FULL_R3":"FR038_NOT_PROVED";}
function hBlock({h02="NOT_CHECKED",h03="NOT_CHECKED",h04=false}={}){return h04||h02==="BLOCK_ACTIVE"||h03==="BLOCK_ACTIVE"?"REJECTED_NEW_RISK":"HISTORICAL_STATUS_NOT_AUTOMATIC_VETO";}
t("seven registered Skill folders",slugs.length,7);
for(const name of slugs){
 const p=".agents/skills/"+name+"/SKILL.md",s=skill[name];
 t(name+" exists on disk",fileExists(p),true);
 t(name+" valid basic frontmatter",validHeader(name,s),true);
 t(name+" has positive trigger",/## When to use/.test(s),true);
 t(name+" negative trigger",/## When[^\n]*(?:not|NOT)/.test(s),true);
 t(name+" confirms R1/R2/R3 scoping",s.includes("R3")&&s.includes("R2"),true);
 t(name+" blocks unsupported live READY",s.includes("READY")&&(/not|never|cannot|не|No live|нет/.test(s)),true);
 t(name+" all local markdown targets resolve",internalLinks(p,s).every(fileExists),true);
}
t("contract names exactly seven",slugs.every(n=>doc.contract.includes("\`"+n+"\`")),true);
t("contract contains RT01 through RT10",Array.from({length:10},(_,i)=>"RT"+String(i+1).padStart(2,"0")).every(x=>doc.contract.includes(x)),true);
t("strategy-planning rejects implicit platform",skill["strategy-planning"].includes("platform choice")||skill["strategy-planning"].includes("Platform choice"),true);
t("market R1 not demand private T02",skill["market-analysis"].includes("do not")||skill["market-analysis"].includes("Do not"),true);
t("actual risk protocol F/A/H/R",doc.risk.includes("F/A/H/R"),true);
t("corrected Skills contract F/A/H/R",doc.contract.includes("F/A/H/R"),true);
t("no outdated F/V/H/R in normative contract before erratum",!doc.contract.split("## 8. Уточнение 07.9")[0].includes("F/V/H/R"),true);
t("AGENTS current rules use F/A/H/R; old notation only described historically",!doc.agents.split("**Шаг 07.9")[0].includes("F/V/H/R")&&doc.agents.includes("F/A/H/R"),true);
t("FR-027-040 distinct risk standards",Array.from({length:14},(_,i)=>"FR-"+String(i+27).padStart(3,"0")).every(x=>doc.requirements.includes(x)),true);
t("stages 07.1-07.9 planned",doc.plan.includes("07.1–07.9"),true);
t("stage 07.8 formally approved",doc.stage08.includes("## 6. Формальная приёмка 07.8"),true);
t("07.9 implemented but pending user approval",doc.plan.includes("07.9 реализован")&&doc.plan.includes("отдельной приёмки"),true);
const expected=[
 ["education",{},[]],
 ["market",{},["market-analysis"]],
 ["market",{live:true},["data-verification","market-analysis"]],
 ["technical",{},["data-verification","market-analysis","strategy-planning"]],
 ["technical",{hasPosition:true},["data-verification","market-analysis","portfolio-analysis","risk-assessment","strategy-planning"]],
 ["portfolio",{},["data-verification","portfolio-analysis","risk-assessment"]],
 ["recovery",{},["data-verification","portfolio-analysis","risk-assessment","strategy-planning"]],
 ["compare",{},["strategy-planning"]],
 ["configuration",{selected:false},["data-verification","portfolio-analysis","risk-assessment","strategy-planning"]],
 ["configuration",{selected:true,platform:"Veles"},["data-verification","portfolio-analysis","risk-assessment","strategy-planning","veles-configuration"]],
 ["configuration",{selected:true,platform:"GinArea"},["data-verification","portfolio-analysis","risk-assessment","strategy-planning","ginarea-configuration"]],
 ["r3",{selected:true,platform:"Veles"},["data-verification","portfolio-analysis","risk-assessment","veles-configuration"]],
 ["r3",{selected:true,platform:"GinArea"},["data-verification","portfolio-analysis","risk-assessment","ginarea-configuration"]],
 ["r3",{selected:false},["data-verification","portfolio-analysis","risk-assessment","strategy-planning"]],
 ["resnapshot",{},["data-verification","portfolio-analysis","risk-assessment"]],
 ["resnapshot",{selected:true,platform:"GinArea",needsConfig:true},["data-verification","portfolio-analysis","risk-assessment","ginarea-configuration"]],
 ["resnapshot",{selected:true,platform:"Veles",needsConfig:true},["data-verification","portfolio-analysis","risk-assessment","veles-configuration"]]
];
for(const [task,args,expect] of expected)t("routing "+task+"/"+JSON.stringify(args),JSON.stringify(route(task,args)),JSON.stringify(expect));
t("no Veles and GinArea in same route",expected.every(([a,b])=>{const x=route(a,b);return !(x.includes("veles-configuration")&&x.includes("ginarea-configuration"));}),true);
t("route never duplicate modules",expected.every(([a,b])=>{const x=route(a,b);return new Set(x).size===x.length;}),true);
t("route only known Skills",expected.every(([a,b])=>route(a,b).every(x=>slugs.includes(x))),true);
t("unknown route does not force private T02",route("define-grid").length,0);
t("Veles deposit not GinArea field",platformField("GinArea","Депозит"),false);
t("GinArea Disable IN not Veles field",platformField("Veles","Disable IN"),false);
t("GinArea Instop not Veles field",platformField("Veles","Инстоп"),false);
t("GinArea order size not Veles deposit",platformField("Veles","Размер ордера"),false);
t("each Veles field only in Veles",platformField("Veles","% Мартингейла"),true);
t("each GinArea field only in GinArea",platformField("GinArea","Макс. размер"),true);
t("user must choose config platform",gridSelector(),"USER_SELECTION_PENDING");
t("must choose strategy separately",gridSelector({chosen:true,platform:"GinArea"}),"STRATEGY_NOT_CHOSEN");
t("GinArea pair not in Indicator selector",gridSelector({chosen:true,platform:"GinArea",strategy:"Indicator"}),"PAIR_UNVERIFIED");
t("valid platform selected only P02 provisional",gridSelector({chosen:true,platform:"GinArea",strategy:"Default",pairAvailable:true}),"DOCUMENTARY_ONLY_P02_REQUIRED");
t("GinArea non-Default + Hedge rejected",compatibleGinarea({strategy:"Auto",mode:"Hedge"}),"REJECTED");
t("GinArea Default Hedge only documentary",compatibleGinarea({strategy:"Default",mode:"Hedge"}),"P01_ONLY");
t("GinArea Isolated rejected for documented current scope",compatibleGinarea({margin:"Isolated"}),"REJECTED");
t("contradictory P02 raises conflict",compatibleGinarea({strategy:"Auto",mode:"Hedge",p02Conflict:true}),"UNVERIFIED");
t("2 bots in one OneWay slot still 1 position",positionCount([{account:"A",symbol:"BTCUSDT",idx:0,qty:1},{account:"A",symbol:"BTCUSDT",idx:0,qty:1}]),1);
t("two Hedge position sides two slots",positionCount([{account:"A",symbol:"BTCUSDT",idx:1,qty:1},{account:"A",symbol:"BTCUSDT",idx:2,qty:1}]),2);
t("zero position not counted as open",positionCount([{account:"A",symbol:"BTCUSDT",idx:0,qty:0}]),0);
t("potential 4th position count",positionCount(["BTC","ETH","SOL","ADA"].map(x=>({account:"A",symbol:x,idx:0,qty:1}))),4);
t("filled IN excluded from future",futureOrder({state:"FILLED",leaves:10}),0);
t("exchange-confirmed cancellation excluded",futureOrder({state:"EXCHANGE_CANCELLED_CONFIRMED",leaves:3}),0);
t("bot-only cancellation not excluded",futureOrder({state:"CANCELLED_IN_BOT",leaves:3}),3);
t("unknown remaining cannot be zero",futureOrder({state:"ACTIVE",leaves:null}),null);
t("Veles Cancel deal leaves actual exposure",botRisk({event:"Cancel deal"}),"CANCEL_UNFILLED_NOT_POSITION_CLOSE");
t("GinArea Pause not exchange close",botRisk({event:"Pause"}),"BOT_STATE_NOT_EXCHANGE_CLOSE");
t("GinArea Failed not exchange close",botRisk({event:"Failed"}),"BOT_STATE_NOT_EXCHANGE_CLOSE");
t("Disable IN no new risk not flat",botRisk({event:"Disable IN"}),"IN_DISABLED_POSITION_UNCHANGED");
t("click close not fill",botRisk({event:"Close",exchangeSize:1}),"POSITION_MUST_BE_RECONCILED");
t("confirmed fill + flat can be closed",botRisk({event:"Close",exchangeSize:0,confirmed:true}),"CLOSED_ON_EXCHANGE");
t("H01 −15+10−1−2 = −8",lossSeries({r:-15,u:10,fee:-1,funding:-2}),-8);
t("H01 missing funding not recovered",lossSeries({r:-15,u:10,fee:-1,funding:NaN}),null);
t("hard breach overrides critical/missing",status({hard:true,critical:true,missing:true}),"REJECTED");
t("critical risk model overrides missing",status({critical:true,missing:true}),"UNVERIFIED");
t("missing P02 current account",status({missing:true}),"NEEDS_DATA");
t("local pass never actual READY",status({realEvidence:true}),"CANDIDATE_ONLY_NOT_LIVE_READY");
t("R2 market context preliminary",evidence({r3:false}),"PRELIMINARY");
t("R3 missing actual P02",evidence({r3:true,t02:true,actualMarket:true,markAge:1,t02Age:1}),"NEEDS_DATA");
t("R3 missing full T02",evidence({r3:true,p02:true,actualMarket:true,markAge:1,t02Age:1}),"NEEDS_DATA");
t("R3 3m Mark stale",evidence({r3:true,p02:true,t02:true,actualMarket:true,markAge:3,t02Age:1}),"STALE");
t("R3 event invalidates 1m snapshot",evidence({r3:true,changed:true,p02:true,t02:true,actualMarket:true,markAge:1,t02Age:1}),"INVALIDATED");
t("R3 P02+T02+Mark but no F/A/H/R",evidence({r3:true,p02:true,t02:true,actualMarket:true,markAge:1,t02Age:1}),"UNVERIFIED");
t("R3 all fabricated booleans still not real READY",evidence({r3:true,p02:true,t02:true,actualMarket:true,markAge:1,t02Age:1,realHistory:true,mmr:true,shortBound:true}),"EVIDENCE_FLAGS_ONLY_NOT_LIVE_READY");
t("missing H02/H03 no automatic block",hBlock(),"HISTORICAL_STATUS_NOT_AUTOMATIC_VETO");
t("known H04 blocks new risk",hBlock({h04:true}),"REJECTED_NEW_RISK");
t("confirmed 15% HWM block",hBlock({h02:"BLOCK_ACTIVE"}),"REJECTED_NEW_RISK");
t("confirmed 3% daily block",hBlock({h03:"BLOCK_ACTIVE"}),"REJECTED_NEW_RISK");
t("fake price paths not history",stress({F:true,A:true,H:true,R:true}),"FR038_NOT_PROVED");
t("all stress flags still no real R3 proof",stress({F:true,A:true,H:true,R:true,historyReal:true}),"FOUR_FAMILY_FLAGS_NOT_FULL_R3");
t("contract distinguishes P01/P02/T02",["P01","P02","T02"].every(x=>doc.contract.includes(x)),true);
t("strict leverage 5x in risk Skill",skill["risk-assessment"].includes("5×"),true);
t("margin utilization 30% in risk Skill",skill["risk-assessment"].includes("30%"),true);
t("bot loss upper limit 5% in risk Skill",skill["risk-assessment"].includes("≤5%"),true);
t("liq distance 15% in risk Skill",skill["risk-assessment"].includes("15%"),true);
t("no false 4th position in portfolio Skill",skill["portfolio-analysis"].includes("FR-033"),true);
t("recovery full H01 in strategy Skill",skill["strategy-planning"].includes("H01"),true);
t("cross liquidation RV-02 not closed",skill["risk-assessment"].includes("RV-02"),true);
t("Short upper bound RV-03 not closed",skill["risk-assessment"].includes("RV-03"),true);
t("GinArea sticky Disable IN",skill["ginarea-configuration"].includes("sticky"),true);
t("Veles POSITION -1 accounted",skill["veles-configuration"].includes("POSITION -1"),true);
t("no tested Skill claims actual API access",slugs.every(x=>!/^.*(?:we executed live Bybit|we placed order)/im.test(skill[x])),true);
// Source-contract checks complement (never replace) the existing deterministic route fixture.
// A malicious edit to an actual SKILL.md must fail here even if the fixture router remains unchanged.
const sourceContracts=auditPolicy(loadPolicyFiles(ROOT));
for(const p of sourceContracts)t("actual source "+p.id,p.ok,true);
const fails=checks.filter(x=>!x.pass);
for(const f of fails)console.error("FAIL",f.id,f.name,JSON.stringify({actual:f.actual,expected:f.expected}));
console.log(JSON.stringify({kind:"STAGE_07_09_LOCAL_COMPOSITION_SYNTHETIC",total:checks.length,passed:checks.length-fails.length,failed:fails.length,routes:expected.length,actualSkillAutoDiscovery:false,realBybit:false,realVelesP02:false,realGinAreaP02:false,independentLLMBlindRuns:0,tradeReady:false}));
if(fails.length)process.exitCode=1;
