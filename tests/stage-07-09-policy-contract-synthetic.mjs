// Stage 07.9 remediation: source-based policy contract checks, not a trading engine.
// Run: node tests/stage-07-09-policy-contract-synthetic.mjs (Node >=18).
// Inspect *actual* seven SKILL.md bodies and adopted route contract. No exchange calls.
import {readFileSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
export const SKILL_NAMES=["data-verification","market-analysis","portfolio-analysis","risk-assessment","strategy-planning","veles-configuration","ginarea-configuration"];
export const PATHS=[
 ...SKILL_NAMES.map(n=>".agents/skills/"+n+"/SKILL.md"),
 "docs/stage-07-skills-contract.md","docs/stage-07-plan.md",
 "docs/risk-management.md","docs/requirements.md","AGENTS.md","README.md"
];
export function loadPolicyFiles(root=ROOT) {
 return Object.fromEntries(PATHS.map(p=>[p,readFileSync(resolve(root,p),"utf8")]));
}
export function auditPolicy(files) {
 const checks=[];
 const check=(id,ok,detail)=>checks.push({id,ok:!!ok,detail});
 const file=p=>files[p]||"";
 const skill=n=>file(".agents/skills/"+n+"/SKILL.md");
 const risk=skill("risk-assessment"),lines=risk.split("\n");
 const fr=n=>lines.filter(s=>s.startsWith("| **FR-"+n+"** |"));
 const rule=(n,id,re)=>check(id,fr(n).length===1&&re.test(fr(n)[0]),"Risk Skill FR-"+n+" row");
 const contract=file("docs/stage-07-skills-contract.md");
 for(const name of SKILL_NAMES){
  const s=skill(name);
  check("SKILL_"+name,s.startsWith("---\nname: "+name+"\ndescription: ")&&s.includes("## When")&&s.includes("READY")&&s.includes("R3"),"Skill header/scope");
 }
 rule("029","LIMIT_MARGIN_30",/≤30% current Equity/);
 rule("030","LIMIT_BOT_LOSS_5",/≤5% E0/);
 rule("031","LIMIT_LEVERAGE_5",/≤5×/);
 rule("032","LIMIT_LIQ_15",/≥15%/);
 rule("033","LIMIT_SLOTS_3",/At most \*\*3 concurrent potential exchange position slots\*\*/);
 rule("034","LIMIT_RESERVE_100",/Full \*\*100% future averaging IM\*\*/);
 rule("035","LIMIT_DAY_3",/Daily loss \*\*≤3%\*\*/);
 rule("036","LIMIT_HWM_H04",/\*\*Known active H04 \/ H02 ≥15% \/ H03 ≥3%\*\* bars \*\*new risk\*\*/);
 rule("037","CORRELATION_EVIDENCE",/≥30 synchronized closed returns/);
 rule("038","STRESS_F_A_H_R",/F \(\*\*fixed shocks\*\*\), A \(\*\*adaptive volatility/);
 rule("039","MANUAL_ONLY",/manually considered/);
 rule("040","NO_UNPROVEN_READY",/Final R3 is \*\*not .READY.\*\* until all/);
 check("HISTORICAL_NO_HARD_VETO",risk.includes("Missing H02 →")&&risk.includes("NOT_CHECKED")&&risk.includes("H04 known active violation"),"History missing is NOT_CHECKED; known H04 vetoes");
 check("DATA_R3_FRESHNESS",skill("data-verification").includes("R3 handoff")&&skill("data-verification").includes("T02")&&skill("data-verification").includes("Mark")&&skill("data-verification").includes("P02"),"R3 evidence requires whole account and Mark");
 check("MARKET_NO_READY",skill("market-analysis").includes("Never assign")&&skill("market-analysis").includes("READY"),"Market analysis must not grant final READY");
 check("PORTFOLIO_FUTURE_SLOTS",skill("portfolio-analysis").includes("FR-033")&&skill("portfolio-analysis").includes("potential new position slots"),"Portfolio includes future IN slots");
 check("STRATEGY_USER_SELECTION",/Never fill out a concrete Veles\/GinArea form/.test(skill("strategy-planning"))&&/must independently choose/.test(skill("strategy-planning")),"Strategy waits for explicit user selection");
 check("VELES_ISOLATION",/Do not insert GinArea-only fields/.test(skill("veles-configuration"))&&/POSITION -1/.test(skill("veles-configuration")),"Veles-only fields and position ownership");
 check("GINAREA_NO_SILENT_SWITCH",/do not silently switch from Indicator Grid to Default/.test(skill("ginarea-configuration")),"GinArea selection cannot silently switch");
 check("GINAREA_IN_CAP",skill("ginarea-configuration").includes("Макс. размер")&&skill("ginarea-configuration").includes("Размер ордера"),"Per-IN cap differs from first order");
 check("CANONICAL_STRESS_SKILLS",!SKILL_NAMES.some(n=>skill(n).includes("F/V/H/R"))&&risk.includes("F/A/H/R"),"Current Skills must use F/A/H/R");
 check("CANONICAL_STRESS_PLAN",!file("docs/stage-07-plan.md").split("## 25.")[0].includes("F/V/H/R"),"Current plan must use F/A/H/R");
 check("CANONICAL_STRESS_README",!file("README.md").includes("F/V/H/R"),"Current README must use F/A/H/R");
 check("NO_STALE_FUTURE_LABELS",!skill("market-analysis").includes("planned later")&&!skill("market-analysis").includes("Those future Skills may not exist yet")&&!skill("portfolio-analysis").includes("those future modules may not exist yet"),"Existing seven Skills not described as future");
 check("REQUIREMENTS_UNCHANGED",Array.from({length:14},(_,i)=>"FR-"+String(i+27).padStart(3,"0")).every(s=>file("docs/requirements.md").includes(s)),"Requirements present");
 check("CONTRACT_F_A_H_R",!contract.split("## 8. Уточнение 07.9")[0].includes("F/V/H/R")&&contract.includes("F/A/H/R"),"Canonical stress contract");
 const route=(id)=>contract.split("\n").find(s=>s.startsWith("| "+id+" |"))||"";
 const needed={
  RT02:["market-analysis"],RT03:["data-verification","market-analysis","strategy-planning"],
  RT04:["data-verification","portfolio-analysis","risk-assessment"],
  RT05:["data-verification","portfolio-analysis","risk-assessment","strategy-planning"],
  RT06:["strategy-planning"],RT07:["veles-configuration"],RT08:["ginarea-configuration"],
  RT09:["data-verification","portfolio-analysis","risk-assessment"],
  RT10:["data-verification"]
 };
 check("ROUTE_RT01_EDUCATION",route("RT01").includes("никакой Skill не обязателен"),"Education without mandatory Skill");
 for(const [name,required] of Object.entries(needed)){
  check("ROUTE_"+name,required.every(s=>route(name).includes(s)),name+" expected actual Skill dependencies");
 }
 check("ROUTE_RT07_VELES_ONLY",!route("RT07").includes("ginarea-configuration"),"Veles route excludes GinArea config");
 check("ROUTE_RT08_GINAREA_ONLY",!route("RT08").includes("veles-configuration"),"GinArea route excludes Veles config");
 check("ROUTE_RT09_ONE_PLATFORM",route("RT09").includes("ИЛИ")&&route("RT09").includes("veles-configuration")&&route("RT09").includes("ginarea-configuration"),"R3 one platform only");
 check("ROUTE_RT10_INVALIDATION",route("RT10").includes("сбросить ранее присвоенный"),"AD-009 rechecks on events");
 check("AGENTS_LIMITS_NO_UNPROVEN_READY",file("AGENTS.md").includes("FR-027–FR-040")&&file("AGENTS.md").includes("READY")&&file("AGENTS.md").includes("P02"),"Root instructions retain risk restrictions");
 return checks;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const checks=auditPolicy(loadPolicyFiles());
 const failed=checks.filter(x=>!x.ok);
 for(const x of failed)console.error("FAIL",x.id,x.detail);
 console.log(JSON.stringify({kind:"STAGE_07_09_SOURCE_POLICY_CONTRACT",total:checks.length,passed:checks.length-failed.length,failed:failed.length,realSkillRuntime:false,realBybit:false,tradeReady:false}));
 if(failed.length)process.exitCode=1;
}
