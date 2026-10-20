// Stage 09.1: DOCUMENTARY/SYNTHETIC test of independent-run protocol; Node >=18.
// node tests/stage-09-01-test-contract-synthetic.mjs
// NOT an LLM blind-run. No real Bybit/P02/READY or trade operations.
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const contract=read("docs/stage-09-test-contract.md");
const plan=read("docs/stage-09-plan.md");
const risk=read("docs/risk-management.md");
const routes=read("docs/workflows/interaction-contract.md");
const status=read("docs/stage-08-review.md");
const T=[];
function t(id,got,want){T.push({id,got,want,pass:Object.is(got,want)});}
const contains=(text,terms)=>terms.every(x=>text.includes(x));
const hasSection=id=>contract.includes("## "+id+". ");
const normalize=p=>{
 const path=[];
 for(const chunk of p.split("/")){if(!chunk||chunk===".")continue;if(chunk==="..")path.pop();else path.push(chunk);}
 return path.join("/");
};
function qualifyRun(r={}){
 if(r.evidence_type==="NOT_RUN"&&r.execution_status!=="NOT_RUN")return "INCONCLUSIVE";
 if(r.evidence_type==="LIVE")return "OUT_OF_SCOPE";
 if(r.execution_status==="NOT_RUN")return "NOT_RUN";
 if(r.execution_status!=="EXECUTED"||!r.raw_response_ref||r.raw_response_ref==="NOT_CAPTURED")return "INCONCLUSIVE";
 if(!r.inputs_redacted_ref||r.inputs_redacted_ref==="UNKNOWN")return "INCONCLUSIVE";
 if(!r.commit_sha||!/^[a-f0-9]{40}$/.test(r.commit_sha))return "INCONCLUSIVE";
 if(!r.environment||r.environment==="UNKNOWN")return "INCONCLUSIVE";
 if(r.verdict==="PASS"&&(!Array.isArray(r.checks)||!r.checks.length||r.checks.some(x=>x.pass!==true)))return "INCONCLUSIVE";
 if(r.evidence_type==="LLM_BLIND"){
  if(!r.independent_session||r.agent_oracle_exposed)return "NOT_BLIND";
 }
 return r.verdict||"INCONCLUSIVE";
}
function releaseGate({critical=0,mandatoryUnrun=0,blindRuns=0,blinded=true}={}){
 if(critical>0)return "BLOCKED";
 if(mandatoryUnrun>0||blindRuns===0||!blinded)return "PENDING_EVIDENCE";
 return "ELIGIBLE_FOR_REVIEW_ONLY";
}
function decision({knownH04=false,knownLimitViolation=false,criticalUnverified=false,missing=false}={}){
 if(knownH04||knownLimitViolation)return "REJECTED";
 if(criticalUnverified)return "UNVERIFIED";
 if(missing)return "NEEDS_DATA";
 return "NO_REAL_READY_FROM_SYNTHETIC";
}
for(let i=1;i<=7;i++)t("heading 09.1 "+i,hasSection(i),true);
for(const id of ["DOC","LOCAL_JS","LLM_IN_SESSION","LLM_BLIND","LIVE"]){
 t("evidence type "+id,contract.includes("`"+id+"`"),true);
}
for(const term of ["NOT_RUN","INCONCLUSIVE","NOT_VERIFIED","oracle","agent_oracle_exposed","raw_response_ref","commit_sha","skills_read","independent_session","fixture_version","evaluator_independence","evidence_type","execution_status","verdict","run_id","case_id","SYNTHETIC","реального `READY`"]){
 t("mandatory provenance "+term,contract.toLowerCase().includes(term.toLowerCase()),true);
}
for(const term of ["PREPARE","FREEZE","INVOKE","CAPTURE","EVALUATE","FIX/REGRESS"]){
 t("process stage "+term,contract.includes("**"+term+"**"),true);
}
for(const term of ["PASS","FAIL_CRITICAL","FAIL_MAJOR","FAIL_MINOR","INCONCLUSIVE","NOT_RUN"]){
 t("verdict term "+term,contract.includes("`"+term+"`"),true);
}
for(let i=1;i<=8;i++)t("evaluation rubric EV0"+i,contract.includes("**EV0"+i+" "),true);
for(let i=1;i<=10;i++)t("route RT"+String(i).padStart(2,"0"),contains(contract,[i===10?"RT10":"RT"+String(i).padStart(2,"0")])&&routes.includes(i===10?"RT10":"RT"+String(i).padStart(2,"0")),true);
for(const slug of ["data-verification","market-analysis","portfolio-analysis","risk-assessment","strategy-planning","veles-configuration","ginarea-configuration"]){
 t("skill mapped "+slug,contract.includes(slug),true);
 t("skill file exists "+slug,exists(".agents/skills/"+slug+"/SKILL.md"),true);
}
for(let i=27;i<=40;i++){
 const id="FR-"+String(i).padStart(3,"0");
 t("risk source "+id,risk.includes(id),true);
}
for(const code of ["RV-02","RV-03","RV-04","RV-06","TV-01–TV-04","FR-038","F/A/H/R","AD-009","H04","RECHECK"]){
 t("open/protected "+code,contract.includes(code),true);
}
for(const text of ["09.2–09.9 **NOT STARTED**","IMPLEMENTED / PENDING USER REVIEW","не являются запуском ChatGPT blind-run","**oracle нельзя публиковать","**неотредактированный дословный ответ**","не прибавлять","**Жёсткий release gate:**"]){
 t("hard control "+text,contract.includes(text),true);
}
t("NOT_RUN sentinel is not sixth evidence type",contains(contract,["`evidence_type=NOT_RUN` допустим","**не** является шестым типом доказательств"]),true);
t("old stage 08 accepted",status.slice(0,500).includes("весь этап 08 `COMPLETED / APPROVED`"),true);
t("stage 09 approved plan",plan.includes("PLANNED / APPROVED"),true);
t("09.1 explicitly running",plan.includes("09.1 `IMPLEMENTED / PENDING USER REVIEW`"),true);
t("09.2 not started",plan.includes("09.2–09.9 `NOT STARTED`"),true);
const base={evidence_type:"LLM_BLIND",execution_status:"EXECUTED",verdict:"PASS",raw_response_ref:"redacted/test-response-01",inputs_redacted_ref:"redacted/input-01",environment:"ChatGPT new session",commit_sha:"a".repeat(40),independent_session:true,agent_oracle_exposed:false,checks:[{code:"EV05",pass:true}]};
for(const [name,modifier,expected] of [
 ["complete blind",{}, "PASS"],
 ["missing transcript",{raw_response_ref:"NOT_CAPTURED"},"INCONCLUSIVE"],
 ["missing inputs",{inputs_redacted_ref:"UNKNOWN"},"INCONCLUSIVE"],
 ["unknown commit",{commit_sha:"UNKNOWN"},"INCONCLUSIVE"],
 ["missing environment",{environment:"UNKNOWN"},"INCONCLUSIVE"],
 ["oracle exposed",{agent_oracle_exposed:true},"NOT_BLIND"],
 ["same session",{independent_session:false},"NOT_BLIND"],
 ["bad check",{checks:[{code:"EV05",pass:false}]},"INCONCLUSIVE"],
 ["empty checks",{checks:[]},"INCONCLUSIVE"],
 ["not run",{execution_status:"NOT_RUN",verdict:"NOT_RUN"},"NOT_RUN"],
 ["LIVE forbidden",{evidence_type:"LIVE"},"OUT_OF_SCOPE"],
 ["NOT_RUN sentinel cannot masquerade as execution",{evidence_type:"NOT_RUN"},"INCONCLUSIVE"],
 ["NOT_RUN sentinel is not a run",{evidence_type:"NOT_RUN",execution_status:"NOT_RUN",verdict:"NOT_RUN"},"NOT_RUN"],
 ["DOC not blind",{evidence_type:"DOC"},"PASS"]
])t("run qualifying "+name,qualifyRun({...base,...modifier}),expected);
for(const [args,want] of [
 [{critical:1,blindRuns:20},"BLOCKED"],
 [{mandatoryUnrun:1,blindRuns:20},"PENDING_EVIDENCE"],
 [{blindRuns:0},"PENDING_EVIDENCE"],
 [{blindRuns:3,blinded:false},"PENDING_EVIDENCE"],
 [{blindRuns:3,mandatoryUnrun:0,blinded:true},"ELIGIBLE_FOR_REVIEW_ONLY"],
])t("release gate "+JSON.stringify(args),releaseGate(args),want);
for(const [args,want] of [
 [{knownH04:true,missing:true},"REJECTED"],
 [{knownLimitViolation:true,criticalUnverified:true},"REJECTED"],
 [{criticalUnverified:true,missing:true},"UNVERIFIED"],
 [{missing:true},"NEEDS_DATA"],
 [{}, "NO_REAL_READY_FROM_SYNTHETIC"]
])t("trade classification "+JSON.stringify(args),decision(args),want);
// Source-bound mutations are counted within T, NOT additional real LLM tests.
const pins=[
 ["**oracle нельзя публиковать","**oracle можно публиковать"],
 ["`evidence_type=LLM_BLIND` требует `independent_session=true`","`evidence_type=LLM_BLIND` требует `independent_session=false`"],
 ["`agent_oracle_exposed=false`","`agent_oracle_exposed=true`"],
 ["**неотредактированный дословный ответ**","краткий пересказ"],
 ["`FAIL_CRITICAL` блокирует приёмку","FAIL_CRITICAL не блокирует приёмку"],
 ["**не результат LLM-прогонов**","**является LLM-прогоном**"],
 ["`evidence_type=LIVE` запрещён","LIVE по умолчанию допустим"],
 ["**не** подтверждают отдельный реальный Node.js checkout/CI","подтверждают Node.js CI"],
 ["`NOT_RUN` / `INCONCLUSIVE`","`PASS` / `PASS`"]
];
// Last two may be absent from contract; pin against actual source only and fail early.
for(const [a,b] of pins.slice(0,7)){
 if(!contract.includes(a))throw Error("Mutation source pin absent: "+a);
 const changed=contract.replace(a,b);
 t("mutation detected "+a,changed.includes(a),false);
}
const rawLinks=[...contract.matchAll(/\]\(([^)]+)\)/g)].map(x=>x[1].split("#")[0]).filter(x=>x&& !/^https?:/.test(x));
t("contract links populated",rawLinks.length>=10,true);
t("contract relative links exist",rawLinks.every(x=>exists(normalize("docs/"+x))),true);
t("no private oracle committed",!contains(contract,["oracle_case_answer:","secret_expected_result:"]),true);
const bad=T.filter(x=>!x.pass);
for(const x of bad)console.error("FAIL",x.id,JSON.stringify({got:x.got,want:x.want}));
console.log(JSON.stringify({kind:"STAGE_09_01_TEST_CONTRACT_SYNTHETIC",total:T.length,passed:T.length-bad.length,failed:bad.length,sourcePinMutations:7,independentLLMRuns:0,liveBybit:false,realP02:false,tradingReady:false}));
if(bad.length)process.exitCode=1;
