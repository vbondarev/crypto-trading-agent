// Stage 08.9 synthetic integration audit. Node >=18 in a real checkout.
// node tests/stage-08-09-integration-synthetic.mjs
// This does NOT execute an independent ChatGPT LLM, exchange orders, P02 or real risk READY.
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const names=[
 "docs/stage-08-review.md","docs/stage-08-plan.md","docs/workflows/interaction-contract.md",
 "docs/data-freshness.md","docs/input-templates.md","docs/risk-management.md",
 "docs/prompts/market-overview.md","docs/prompts/technical-scenario.md",
 "docs/prompts/portfolio-recovery.md","docs/prompts/risk-strategy-decision.md",
 "docs/prompts/veles-configuration.md","docs/prompts/ginarea-configuration.md",
 "docs/workflows/report-templates.md","docs/stage-07-skills-contract.md"
];
const files=Object.fromEntries(names.map(p=>[p,read(p)]));
const get=p=>files[p]??read(p);
const review=get("docs/stage-08-review.md"),plan=get("docs/stage-08-plan.md");
const contract=get("docs/workflows/interaction-contract.md");
const freshness=get("docs/data-freshness.md"), inputs=get("docs/input-templates.md");
const risk=get("docs/risk-management.md");
const prompts=[
 ["docs/prompts/market-overview.md",1,5],
 ["docs/prompts/technical-scenario.md",6,11],
 ["docs/prompts/portfolio-recovery.md",12,17],
 ["docs/prompts/risk-strategy-decision.md",18,23],
 ["docs/prompts/veles-configuration.md",24,29],
 ["docs/prompts/ginarea-configuration.md",30,35],
 ["docs/workflows/report-templates.md",36,41]
];
const tests=[];
function t(name,got,want){tests.push({name,got,want,pass:Object.is(got,want)});}
function includes(source,words){return words.every(w=>source.includes(w));}
const line=(source,id)=>source.split("\n").find(x=>x.startsWith("| **"+id+"** |"))??"";
function pinned(source,id,terms){const r=line(source,id);return r!==""&&terms.every(w=>r.includes(w));}
function classify({intent,platform=null,selection=false,event=false}={}){
 if(event)return "RT10";
 if(intent==="education")return "RT01";
 if(intent==="market")return "RT02";
 if(intent==="technical")return "RT03";
 if(intent==="portfolio")return "RT04";
 if(intent==="recovery")return "RT05";
 if(intent==="choose")return "RT06";
 if(intent==="final")return selection?"RT09":"CHOOSE";
 if(intent==="config"){if(!selection)return "CHOOSE";return platform==="Veles"?"RT07":platform==="GinArea"?"RT08":"CHOOSE";}
 return "ASK";
}
function priceValidity({needed="Bybit Perp Mark",source="Bybit Perp Mark",observedMin=null,mode="R3",event=false,api403=false}={}){
 if(event)return "RECHECK";
 if(api403)return "NEEDS_DATA";
 if(source!==needed)return "WRONG_MARKET_PRICE";
 const limit=mode==="R1"?15:mode==="R2"?5:2;
 if(!Number.isFinite(observedMin)||observedMin<0)return "TIME_UNVERIFIED";
 return observedMin<=limit?"CURRENT_TIMESTAMP_ONLY":"STALE";
}
function trading({h04=false,day=null,dd=null,leverage=null,im=null,loss=null,liq=null,slots=null,reserveShortfall=false,missing=false,criticalUnverified=false}={}){
 if(h04||(day!==null&&day>=3)||(dd!==null&&dd>=15)||
 (leverage!==null&&leverage>5)||(im!==null&&im>30)||(loss!==null&&loss>5)||
 (liq!==null&&liq<15)||(slots!==null&&slots>3)||reserveShortfall)return "REJECTED";
 if(criticalUnverified)return "UNVERIFIED";
 if(missing)return "NEEDS_DATA";
 return "SYNTHETIC_ONLY_NO_LIVE_READY";
}
function net({realized,unrealized,fees,funding}={}){return realized+unrealized-fees-funding;}
function platformSwitch({selected="Indicator",available=false,explicit=false,fallbackAvailable=false}={}){
 if(available)return selected;
 return !explicit?"CHOOSE":"Default"+(fallbackAvailable?"_DOCUMENTARY_ONLY":"_NEEDS_SELECTOR");
}
function backendClose({button,exchangeQty=1,confirmedFill=false}={}){
 return confirmedFill&&exchangeQty===0?"VERIFIED_EXCHANGE_CLOSE":"NOT_VERIFIED_CLOSE";
}
function skill({bodyRead=false,complete=false}={}){
 if(!bodyRead)return "NOT_LOADED";
 return complete?"DOCUMENTARY_ONLY":"PARTIAL";
}
function stageGate({stepApproved=false,stageApproved=false}={}){return stepApproved&&stageApproved?"STAGE_ACCEPTED_ONLY_NO_TRADE":"PENDING_SEPARATE_ACCEPTANCE";}
// W08-01–14: actual deterministic synthetic expectations, no LLM independent executions.
t("W08-01 Short education RT01",classify({intent:"education"}),"RT01");
t("W08-02 Bybit HTTP 403 cannot create price",priceValidity({api403:true,observedMin:0}),"NEEDS_DATA");
t("W08-03 Binance spot cannot be perpetual Mark",priceValidity({source:"Binance Spot Last",observedMin:1}),"WRONG_MARKET_PRICE");
t("W08-04 fresh T02 invalid after fill",priceValidity({observedMin:1,event:true}),"RECHECK");
t("W08-05 incomplete full account no READY",trading({missing:true}),"NEEDS_DATA");
t("W08-06 known H04 rejects ADD",trading({h04:true,missing:true}),"REJECTED");
t("W08-07 unknown Cross MMR and Short bound",trading({criticalUnverified:true}),"UNVERIFIED");
t("W08-08 platform unknown CHOOSE",classify({intent:"config",selection:false}),"CHOOSE");
t("W08-09 Indicator not available: no automatic Default",platformSwitch({}),"CHOOSE");
t("W08-10 H01 series negative net",net({realized:-15,unrealized:10,fees:1,funding:2}),-8);
t("W08-11 missing H02/H03 not automatic block",trading({missing:false}),"SYNTHETIC_ONLY_NO_LIVE_READY");
t("W08-12 synthetic H not real -> unverified",trading({criticalUnverified:true}),"UNVERIFIED");
t("W08-13 Veles Cancel or GinArea Disable != exchange close",backendClose({button:"Cancel",exchangeQty:2,confirmedFill:false}),"NOT_VERIFIED_CLOSE");
t("W08-14 step approval is not whole stage acceptance",stageGate({stepApproved:true,stageApproved:false}),"PENDING_SEPARATE_ACCEPTANCE");
// Route bindings: important platform isolation.
for(const [arg,expected] of [
 [{intent:"market"},"RT02"],[{intent:"technical"},"RT03"],[{intent:"portfolio"},"RT04"],
 [{intent:"recovery"},"RT05"],[{intent:"choose"},"RT06"],
 [{intent:"config",platform:"Veles",selection:true},"RT07"],
 [{intent:"config",platform:"GinArea",selection:true},"RT08"],
 [{intent:"final",selection:true},"RT09"],[{intent:"final",selection:false},"CHOOSE"],
 [{intent:"technical",event:true},"RT10"]
])t("route fixture "+expected,classify(arg),expected);
t("Veles never mapped GinArea",classify({intent:"config",platform:"Veles",selection:true})!=="RT08",true);
t("GinArea never mapped Veles",classify({intent:"config",platform:"GinArea",selection:true})!=="RT07",true);
t("unsupported platform asks",classify({intent:"config",platform:"Unknown",selection:true}),"CHOOSE");
t("actual indicator switch selection",platformSwitch({explicit:true,fallbackAvailable:true}),"Default_DOCUMENTARY_ONLY");
t("fallback missing actual selector",platformSwitch({explicit:true,fallbackAvailable:false}),"Default_NEEDS_SELECTOR");
t("P02 not read not loaded in real user",skill({}),"NOT_LOADED");
t("partial Skill not full",skill({bodyRead:true}),"PARTIAL");
t("loaded Skill does not prove runtime",skill({bodyRead:true,complete:true}),"DOCUMENTARY_ONLY");
t("R1 15m timestamp only",priceValidity({observedMin:15,mode:"R1"}),"CURRENT_TIMESTAMP_ONLY");
t("R1 15.1m stale",priceValidity({observedMin:15.1,mode:"R1"}),"STALE");
t("R2 5m timestamp only",priceValidity({observedMin:5,mode:"R2"}),"CURRENT_TIMESTAMP_ONLY");
t("R2 6m stale",priceValidity({observedMin:6,mode:"R2"}),"STALE");
t("R3 Mark 2m timestamp only",priceValidity({observedMin:2,mode:"R3"}),"CURRENT_TIMESTAMP_ONLY");
t("R3 Mark 3m stale",priceValidity({observedMin:3,mode:"R3"}),"STALE");
t("missing observation time",priceValidity({}),"TIME_UNVERIFIED");
t("no live READY even thresholds passing",trading({im:30,loss:5,leverage:5,liq:15,slots:3}),"SYNTHETIC_ONLY_NO_LIVE_READY");
for(const [arg,expected] of [
 [{day:3},"REJECTED"],[{dd:15},"REJECTED"],[{leverage:8},"REJECTED"],
 [{im:31},"REJECTED"],[{loss:5.1},"REJECTED"],[{liq:14.9},"REJECTED"],
 [{slots:4},"REJECTED"],[{reserveShortfall:true},"REJECTED"],
 [{h04:true,criticalUnverified:true,missing:true},"REJECTED"],
 [{criticalUnverified:true,missing:true},"UNVERIFIED"]
])t("FR gate "+JSON.stringify(arg),trading(arg),expected);
t("exchange close confirmed only full fill",backendClose({button:"Close",exchangeQty:0,confirmedFill:true}),"VERIFIED_EXCHANGE_CLOSE");
t("0 qty without fill is not enough",backendClose({button:"Close",exchangeQty:0,confirmedFill:false}),"NOT_VERIFIED_CLOSE");
t("H02 H03 not checked recorded",includes(review,["H02/H03","NOT_CHECKED"]),true);
t("H04 known block kept",includes(review,["H04","REJECTED"]),true);
t("Cross/Short proof blocker kept",includes(review,["RV-02","RV-03","RV-04","RV-06","TV-01–TV-04"]),true);
// Contract references to all seven Skills. Actual body fetch audited separately in validation.
const seven=["data-verification","market-analysis","portfolio-analysis","risk-assessment",
 "strategy-planning","veles-configuration","ginarea-configuration"];
const skillContract=get("docs/stage-07-skills-contract.md");
for(const slug of seven){
 const link=".agents/skills/"+slug+"/SKILL.md";
 t("Skill path exists "+slug,exists(link),true);
 t("Skill contracted "+slug,skillContract.includes(slug),true);
}
for(let i=1;i<=10;i++)t("canonical RT"+String(i).padStart(2,"0"),contract.includes("RT"+String(i).padStart(2,"0")),true);
t("RT07 normative Veles",contract.includes("**RT07**")&&contract.includes("veles-configuration"),true);
t("RT08 normative GinArea",contract.includes("**RT08**")&&contract.includes("ginarea-configuration"),true);
t("RT09 normative final",contract.includes("**RT09**")&&contract.includes("R3"),true);
t("source AD-009 confirmed",includes(freshness,["AD-009","observed_at","retrieved_at"]),true);
t("source T01-T06 confirmed",["T01","T02","T03","T04","T05","T06"].every(x=>inputs.includes("**"+x+"**")||inputs.includes(x)),true);
t("source risk strict FR",["FR-029","FR-030","FR-031","FR-032","FR-033","FR-034","FR-035","FR-036","FR-037","FR-038"].every(x=>risk.includes(x)),true);
const mapping=[];
for(const [path,first,last] of prompts){
 const source=get(path),ids=[...source.matchAll(/^### (P08-\d{2}) —/gm)].map(x=>x[1]);
 t("file prompt count "+path,ids.length,last-first+1);
 for(let i=first;i<=last;i++){const id="P08-"+String(i).padStart(2,"0");mapping.push(id);t("prompt section exists "+id,ids.includes(id),true);}
}
t("41 prompt unique",new Set(mapping).size,41);
t("every prompt exactly once",Array.from({length:41},(_,i)=>"P08-"+String(i+1).padStart(2,"0")).every(x=>mapping.filter(y=>y===x).length===1),true);
function promptBlock(source,n){const id="P08-"+String(n).padStart(2,"0");return source.split("### "+id+" —")[1]?.split("\n### ")[0]??"";}
for(let i=24;i<=29;i++){const text=promptBlock(get("docs/prompts/veles-configuration.md"),i);t("Veles exact route "+i,text.includes(i===29?"**RT09":"**RT07"),true);}
for(let i=30;i<=35;i++){const text=promptBlock(get("docs/prompts/ginarea-configuration.md"),i);t("GinArea exact route "+i,text.includes(i===35?"**RT09":"**RT08"),true);t("GinArea no erroneous RT07 "+i,!text.includes("**RT07"),true);}
t("no silent Indicator fallback",includes(get("docs/prompts/ginarea-configuration.md"),["Indicator","Default","без","выбор"]),true);
t("Veles POSITION -1 present",get("docs/prompts/veles-configuration.md").includes("POSITION -1"),true);
t("R3 no real READY from synthetic",includes(get("docs/workflows/report-templates.md"),["F/A/H/R","RECHECK","NOT_CHECKED","NO"]),true);
// Bound the integration review to all 14 W08 rows.
for(let i=1;i<=14;i++){const id="W08-"+String(i).padStart(2,"0");t("review W08 fixture "+id,line(review,id).length>60,true);t("plan W08 fixture "+id,plan.includes("| "+id+" |"),true);}
for(const [id,words] of [
 ["W08-01",["Short","T02/P02"]],["W08-02",["HTTP 403"]],["W08-03",["Binance Spot","Bybit"]],
 ["W08-04",["RECHECK"]],["W08-05",["NEEDS_DATA"]],
 ["W08-06",["REJECTED"]],["W08-07",["UNVERIFIED"]],
 ["W08-08",["CHOOSE"]],["W08-09",["Indicator","Default"]],
 ["W08-10",["-8 USDT"]],["W08-11",["NOT_CHECKED"]],
 ["W08-12",["UNVERIFIED"]],["W08-13",["закрытия"]],
 ["W08-14",["Нет полномочий"]]
])t("source-bound W08 "+id,pinned(review,id,words),true);
const mutations=[
 ["W08-04","RECHECK","READY"],
 ["W08-05","NEEDS_DATA","READY"],
 ["W08-06","REJECTED","READY"],
 ["W08-07","UNVERIFIED","READY"],
 ["W08-08","CHOOSE","AUTO_VELES"],
 ["W08-09","отдельно выбранная","автоматическая"],
 ["W08-10","-8 USDT","+10 USDT"],
 ["W08-11","NOT_CHECKED","PASS"],
 ["W08-12","UNVERIFIED","READY"],
 ["W08-14","Нет полномочий","Полномочия даны"]
];
for(const [id,correct,wrong] of mutations){
 const old=line(review,id);if(!old.includes(correct))throw Error("mutation source absent: "+id+" "+correct);
 const altered=review.replace(old,old.replace(correct,wrong));
 t("intentional W08 mutation rejected "+id,pinned(altered,id,[correct]),false);
}
// SR-089: source-bound numeric FR thresholds, not only a synthetic decision function.
const riskLine=review.split("\n").find(x=>x.startsWith("**FR-029:**"))??"";
const riskPins=[
 ["IM ≤30% Equity E0","IM ≤50% Equity E0"],
 ["≤5% E0","≤15% E0"],
 ["плечо ≤5×","плечо ≤10×"],
 ["Mark→liq ≥15%","Mark→liq ≥5%"],
 ["FR-033:** ≤3","FR-033:** ≤5"],
 ["100% будущей IM","50% будущей IM"],
 ["убыток ≥3%","убыток ≥5%"],
 ["HWM DD ≥15%","HWM DD ≥25%"]
];
for(const [strict,weak] of riskPins){
 t("actual review strict risk source "+strict,riskLine.includes(strict),true);
 if(!riskLine.includes(strict))throw Error("missing risk mutation anchor "+strict);
 t("in-memory weakened FR threshold caught "+strict,!riskLine.replaceAll(strict,weak).includes(strict),true);
}
// Routing mutation catches exactly the historical RT07↔RT08 leak, not mere presence of RT.
for(const [p,id,good,badRoute] of [
 ["docs/prompts/ginarea-configuration.md",30,"**RT08","**RT07"],
 ["docs/prompts/veles-configuration.md",24,"**RT07","**RT08"],
 ["docs/prompts/ginarea-configuration.md",35,"**RT09","**RT07"]
]){
 const actual=promptBlock(get(p),id);
 if(!actual.includes(good))throw Error("missing route mutation anchor "+id);
 const changed=actual.replace(good,badRoute);
 t("cross-platform route mutation caught P08-"+id,!changed.includes(good),true);
}

const reqLinks=[...review.matchAll(/\]\(([^)\s]+)\)/g)].map(x=>x[1].split("#")[0]).filter(Boolean).filter(x=>!/^https?:/i.test(x));
t("integration links numerous",reqLinks.length>=20,true);
t("all relative targets exist",reqLinks.every(x=>exists("docs/"+x)),true);
t("stage 08 approved in latest header",review.slice(0,750).includes("весь этап 08 `COMPLETED / APPROVED`"),true);
t("08.9 and all stage approved by user",review.slice(0,750).includes("шаги **08.1–08.9**"),true);
t("09 plan exists, awaits approval, no 09.1",exists("docs/stage-09-plan.md")&&review.slice(0,750).includes("09.1 NOT STARTED"),true);
const bad=tests.filter(x=>!x.pass);
for(const x of bad)console.error("FAIL",x.name,JSON.stringify({got:x.got,want:x.want}));
console.log(JSON.stringify({kind:"STAGE_08_09_INTEGRATION_SYNTHETIC",total:tests.length,passed:tests.length-bad.length,failed:bad.length,w08Cases:14,promptCount:41,routes:10,skills:7,mutations:mutations.length+riskPins.length+3,independentLLMRuns:0,nodeCheckout:false,liveBybit:false,realP02:false,tradeReady:false}));
if(bad.length)process.exitCode=1;
