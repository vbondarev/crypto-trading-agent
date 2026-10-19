// Stage 07.9 mutation regression: each harmful textual change MUST trigger its source-policy guard.
// Run: node tests/stage-07-09-mutation-synthetic.mjs (Node >=18).
// All mutations exist ONLY in memory, never modify SKILL.md or send exchange orders.
import {auditPolicy,loadPolicyFiles} from "./stage-07-09-policy-contract-synthetic.mjs";

const baseline=loadPolicyFiles();
const risk=".agents/skills/risk-assessment/SKILL.md";
const market=".agents/skills/market-analysis/SKILL.md";
const veles=".agents/skills/veles-configuration/SKILL.md";
const ginarea=".agents/skills/ginarea-configuration/SKILL.md";
const contract="docs/stage-07-skills-contract.md";
function replaceOnce(text,needle,replacement){
 if(!text.includes(needle))throw new Error("Fixture missing literal: "+needle);
 return text.replace(needle,replacement);
}
function editRow(text,number,needle,replacement){
 const lines=text.split("\n");
 const key="| **FR-"+number+"** |";
 const idx=lines.findIndex(x=>x.startsWith(key));
 if(idx<0)throw new Error("Fixture FR missing: "+number);
 lines[idx]=replaceOnce(lines[idx],needle,replacement);
 return lines.join("\n");
}
const cases=[
 ["leverage >5","LIMIT_LEVERAGE_5",risk,s=>editRow(s,"031","≤5×","≤8×")],
 ["margin load >30","LIMIT_MARGIN_30",risk,s=>editRow(s,"029","≤30% current Equity","≤50% current Equity")],
 ["bot loss >5","LIMIT_BOT_LOSS_5",risk,s=>editRow(s,"030","≤5% E0","≤10% E0")],
 ["liquidation distance <15","LIMIT_LIQ_15",risk,s=>editRow(s,"032","≥15%","≥10%")],
 ["fourth position permitted","LIMIT_SLOTS_3",risk,s=>editRow(s,"033","At most **3 concurrent","At most **99 concurrent")],
 ["reserve halved","LIMIT_RESERVE_100",risk,s=>editRow(s,"034","Full **100% future","Full **50% future")],
 ["daily loss relaxed","LIMIT_DAY_3",risk,s=>editRow(s,"035","≤3%","≤5%")],
 ["drawdown relaxed","LIMIT_HWM_H04",risk,s=>editRow(s,"036","H02 ≥15%","H02 ≥20%")],
 ["known H04 ignored","LIMIT_HWM_H04",risk,s=>editRow(s,"036","Known active H04","Ignore active H04")],
 ["adaptive stress removed","STRESS_F_A_H_R",risk,s=>editRow(s,"038","A (**adaptive","V (**adaptive")],
 ["risk READY before evidence","NO_UNPROVEN_READY",risk,s=>editRow(s,"040","**not "+String.fromCharCode(96)+"READY"+String.fromCharCode(96)+"** until","**"+String.fromCharCode(96)+"READY"+String.fromCharCode(96)+"** without")],
 ["market introduces obsolete stress family","CANONICAL_STRESS_SKILLS",market,s=>replaceOnce(s,"F/A/H/R","F/V/H/R")],
 ["GinArea auto-switch allowed","GINAREA_NO_SILENT_SWITCH",ginarea,s=>replaceOnce(s,"do not silently switch from Indicator Grid to Default","silently switch from Indicator Grid to Default")],
 ["Veles accepts foreign fields","VELES_ISOLATION",veles,s=>replaceOnce(s,"Do not insert GinArea-only fields","Insert GinArea-only fields")],
 ["portfolio risk route omitted","ROUTE_RT04",contract,s=>replaceOnce(s,"data-verification → portfolio-analysis → risk-assessment","data-verification → portfolio-analysis")],
 ["historical-only stress instead of four","STRESS_F_A_H_R",risk,s=>editRow(s,"038","A (**adaptive volatility","V (**adaptive volatility")],
 ["conflicting position permission in separate paragraph","LIMIT_SLOTS_3",risk,s=>s+"\nAdditional policy: allow 4 concurrent positions.\n"],
 ["contradictory READY permission in separate paragraph","NO_UNPROVEN_READY",risk,s=>s+"\nAdditional policy: allow READY without T02.\n"]
];
const initial=auditPolicy(baseline);
if(initial.some(x=>!x.ok))throw new Error("Unmutated source policy must pass before mutation suite");
const results=[];
for(const [label,expectedId,path,edit] of cases){
 const changed=edit(baseline[path]);
 if(changed===baseline[path])throw new Error("No-op mutation "+label);
 const candidate={...baseline,[path]:changed};
 const audit=auditPolicy(candidate),broken=audit.filter(x=>!x.ok).map(x=>x.id);
 const detected=broken.includes(expectedId);
 results.push({label,expectedId,detected,broken});
 if(!detected)console.error("MISS",label,"required guard",expectedId,"actual failing checks",JSON.stringify(broken));
}
const undetected=results.filter(x=>!x.detected);
console.log(JSON.stringify({kind:"STAGE_07_09_IN_MEMORY_MUTATION",cases:results.length,detected:results.length-undetected.length,missed:undetected.length,baseline:initial.length,repoModifiedByTests:false,realBybit:false,tradeReady:false}));
if(undetected.length)process.exitCode=1;
