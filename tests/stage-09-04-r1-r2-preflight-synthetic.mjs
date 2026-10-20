// Step 09.4 — PUBLIC PRE-FLIGHT ONLY. Real blind ChatGPT sessions must be conducted separately.
// node tests/stage-09-04-r1-r2-preflight-synthetic.mjs
// Verifies existing INPUT-only corpus, 12 NOT_RUN entries and stage gates.
// Does not compute hidden oracle, perform LLM runs or assert model PASS.
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const fixture=JSON.parse(read("tests/fixtures/stage-09/inputs.v1.json"));
const ledger=JSON.parse(read("tests/fixtures/stage-09/r1-r2-run-ledger.v1.json"));
const doc=read("docs/stage-09-04-results.md");
const contract=read("docs/stage-09-test-contract.md");
const runtime=read("docs/stage-09-runtime-validation.md");
const prior=read("docs/stage-09-03-validation.md");
const plan=read("docs/stage-09-plan.md");
const exporter=read("tests/stage-09-02-export-agent-input.mjs");
const review=read("docs/stage-08-review.md");
const T=[];
const t=(name,got,want=true)=>T.push({name,got,want,pass:Object.is(got,want)});
const norm=p=>{const parts=[];for(const chunk of p.split("/")){if(chunk==="..")parts.pop();else if(chunk&&chunk!==".")parts.push(chunk)}return parts.join("/")};
const required=Array.from({length:11},(_,i)=>"P08-"+String(i+1).padStart(2,"0")).concat(["P08-36"]);
const selected=fixture.cases.filter(c=>required.includes(c.prompt_id));
const allowedKeys=new Set(["case_id","prompt_id","fixture_version","execution_status","evidence_type","verdict","independent_session","agent_oracle_exposed","source_commit_sha","model","environment","input_record_ref","raw_response_ref","oracle_private_ref","evaluation_ref","issue_ids","skills_load","note"]);
const prohibited=/^(oracle|expected|golden|golden_answer|correct_answer|expected_route|expected_decision|expected_status|pass|evaluation_result|raw_response|transcript)$/i;
const validateEntry=(r)=>{
 if(!r||typeof r!=="object")return false;
 if(!/^S09-\d{3}$/.test(r.case_id)||!/^P08-\d{2}$/.test(r.prompt_id)||r.fixture_version!==1)return false;
 if(!Object.keys(r).every(k=>allowedKeys.has(k)&&!prohibited.test(k)))return false;
 return r.execution_status==="NOT_RUN"&&r.evidence_type==="NOT_RUN"&&r.verdict==="NOT_RUN"&&
 r.independent_session===false&&r.agent_oracle_exposed===false&&r.source_commit_sha===null&&
 r.raw_response_ref===null&&r.oracle_private_ref===null&&r.evaluation_ref===null&&
 r.model===null&&r.environment===null&&r.skills_load==="NOT_VERIFIED"&&
 Array.isArray(r.issue_ids)&&r.issue_ids.length===0;
};
const onlyUserInput=c=>({user_message:c.user_message,payload:c.payload});
t("v1 fixtures schema",fixture.schema,"stage09.synthetic-input-only.v1");
t("v1 fixture provenance",fixture.provenance,"AUTHOR_GENERATED_NOT_OBSERVED_ON_ANY_MARKET");
t("immutable fixture blob SHA in manifest",ledger.fixture_sha,"965c12afa0c4afc4c0b1698732e61c597d351b88");
t("manifest public metadata status",ledger.provenance,"PUBLIC_METADATA_ONLY_NO_PRIVATE_ORACLE_NO_LLM_RESPONSE");
t("ledger schema",ledger.schema,"stage09.r1r2-run-ledger.v1");
t("ledger declared step",ledger.stage,"09.4");
t("ledger declared planned count",ledger.planned_case_count,12);
t("ledger actually contains 12 placeholders",ledger.runs.length,12);
t("12 selected matching existing 45 fixtures",selected.length,12);
t("unique planned case IDs",new Set(ledger.runs.map(r=>r.case_id)).size,12);
t("exact required P08 coverage",new Set(selected.map(c=>c.prompt_id)).size,12);
t("11 R1/R2 P08 plus 1 EDU",selected.filter(c=>c.prompt_id!=="P08-36").length,11);
t("all entries NOT_RUN",ledger.runs.every(validateEntry));
t("all fixture cases synthetic",selected.every(c=>c.synthetic===true));
t("all fixture messages explicitly synthetic",selected.every(c=>c.user_message.startsWith("[SYNTHETIC TEST,")));
t("all fixture messages prohibit deals",selected.every(c=>c.user_message.includes("НЕ СОВЕРШАТЬ СДЕЛКИ")));
t("no fixture oracle fields",selected.every(c=>Object.keys(c).every(x=>!prohibited.test(x))));
t("no manifest PASS/FAIL records",ledger.runs.every(c=>c.verdict==="NOT_RUN"));
t("LLM executions zero",ledger.executed_llm_runs,0);
t("independent sessions zero",ledger.independent_llm_runs,0);
t("LLM passes zero",ledger.passed_llm_runs,0);
t("LLM failures zero",ledger.failed_llm_runs,0);
t("no oracle body in manifest",!/(?:\"expected_status\"|\"golden_answer\"|\"correct_answer\"|\"private_oracle\")\s*:/i.test(JSON.stringify(ledger)));
for(const r of ledger.runs){
 const item=selected.find(c=>c.case_id===r.case_id);
 t("linked source fixture "+r.case_id,!!item);
 if(!item)continue;
 t("correct P08 linkage "+r.case_id,r.prompt_id,item.prompt_id);
 t("fixture version "+r.case_id,r.fixture_version,item.fixture_version);
 t("synthetic reference "+r.case_id,item.synthetic,true);
 t("no implicit model evaluation "+r.case_id,r.verdict,"NOT_RUN");
 t("no private oracle prepublication "+r.case_id,r.oracle_private_ref,null);
 t("public entry schema allowed "+r.case_id,Object.keys(r).every(k=>allowedKeys.has(k)));
 t("input stripped to two fields "+r.case_id,Object.keys(onlyUserInput(item)).sort().join(","),"payload,user_message");
}
for(const p of ["S09-001","S09-002","S09-003","S09-004","S09-005","S09-006","S09-007","S09-008","S09-009","S09-010","S09-011","S09-036"])t("document lists "+p,doc.includes(p));
for(const v of ["LLM_BLIND","NOT_RUN","PENDING INDEPENDENT EVIDENCE","NOT_VERIFIED","SYNTHETIC","RT01","RT02","RT03","09.5–09.9 NOT STARTED","нет оснований отмечать","oracle"]){
 t("09.4 claims protected "+v,doc.includes(v));
}
for(const v of ["raw_response_ref","agent_oracle_exposed","oracle_private_ref","execution_status","LLM_BLIND","FAIL_CRITICAL"]){
 t("contract continues "+v,contract.includes(v));
}
t("09.3 user acceptance is recorded",prior.includes("## 5. Формальная приёмка 09.3"));
t("09.3 still has loader blocker",runtime.includes("NOT_VERIFIED (RV-06 OPEN)"));
t("09.4 authorised in plan",plan.includes("09.4"));
t("source 08 passed",review.includes("весь этап 08 `COMPLETED / APPROVED`"));
t("input exporter restricted",exporter.includes("user_message:c.user_message,payload:c.payload"));
t("document and ledger linked",doc.includes("r1-r2-run-ledger.v1.json"));
const docLinks=[...doc.matchAll(/\]\(([^)]+)\)/g)].map(x=>x[1].split("#")[0]).filter(x=>x&&!/^https?:/.test(x));
t("document relative links >=8",docLinks.length>=8);
t("all document relative file targets exist",docLinks.every(x=>exists(norm("docs/"+x))));
const mutations=[
 ["fabricated PASS",{...ledger.runs[0],verdict:"PASS"}],
 ["fabricated executed",{...ledger.runs[0],execution_status:"EXECUTED"}],
 ["fabricated blind evidence",{...ledger.runs[0],evidence_type:"LLM_BLIND"}],
 ["fake response",{...ledger.runs[0],raw_response_ref:"fabricated response"}],
 ["fake oracle",{...ledger.runs[0],oracle_private_ref:"fake-oracle"}],
 ["oracle leak",{...ledger.runs[0],agent_oracle_exposed:true}],
 ["surreptitious model",{...ledger.runs[0],model:"GPT-6"}],
 ["runtime masquerade",{...ledger.runs[0],skills_load:"FULL_AUTO"}],
 ["hidden golden",{...ledger.runs[0],expected_status:"READY"}],
 ["missing case_id",Object.fromEntries(Object.entries(ledger.runs[0]).filter(([key])=>key!=="case_id"))]
];
for(const [name,r] of mutations){
 t("mutation blocks "+name,validateEntry(r),false);
}
const bad=T.filter(x=>!x.pass);
for(const x of bad)console.error("FAIL",x.name,JSON.stringify({got:x.got,want:x.want}));
console.log(JSON.stringify({kind:"STAGE_09_04_R1_R2_PREFLIGHT_LOCAL_JS",total:T.length,passed:T.length-bad.length,failed:bad.length,plannedSyntheticCases:ledger.planned_case_count,independentLLMRuns:0,evaluatedRuns:0,mutations:mutations.length,liveReady:false,stage09_04Complete:false}));
if(bad.length)process.exitCode=1;
