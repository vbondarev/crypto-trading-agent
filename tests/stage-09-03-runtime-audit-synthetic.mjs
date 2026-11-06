// Step 09.3 source audit and deterministic runtime-evidence classification.
// Run: node tests/stage-09-03-runtime-audit-synthetic.mjs (Node >=18 in real checkout).
// NO LLM blind-run, NO automatic ChatGPT Skill loading, NO real Bybit, NO READY.
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(ROOT,p),"utf8");
const exists=p=>existsSync(resolve(ROOT,p));
const names=["data-verification","market-analysis","portfolio-analysis","risk-assessment","strategy-planning","veles-configuration","ginarea-configuration"];
const skills=Object.fromEntries(names.map(n=>[n,read(".agents/skills/"+n+"/SKILL.md")]));
const doc=read("docs/stage-09-runtime-validation.md");
const contract=read("docs/stage-09-test-contract.md");
const plan=read("docs/stage-09-plan.md");
const catalog=read("docs/stage-09-fixtures.md");
const stage09_02=read("docs/stage-09-02-validation.md");
const agents=read("AGENTS.md");
const tests=[];
const t=(id,value,expected=true)=>tests.push({id,value,expected,pass:Object.is(value,expected)});
const norm=p=>{const parts=[];for(const x of p.split("/")){if(x==="..")parts.pop();else if(x&&x!==".")parts.push(x)}return parts.join("/")};
const frontmatter=text=>{
 const m=/^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
 if(!m)return null;
 const entries=[...m[1].matchAll(/^([a-z_]+):\s*(.+)$/gm)];
 return Object.fromEntries(entries.map(x=>[x[1],x[2]]));
};
const evidence=({sourceRead=false,bodyComplete=false,autoLoaderObserved=false,independent=false,oracleHidden=false,rawTranscript=false}={})=>{
 if(!sourceRead)return "NOT_LOADED";
 if(!bodyComplete)return "PARTIAL";
 if(autoLoaderObserved&&independent&&oracleHidden&&rawTranscript)return "RUNTIME_OBSERVED_NOT_TRADING_READY";
 return "SOURCE_READ_ONLY";
};
const blind=({fresh=false,oracleHidden=false,input=false,raw=false,trace=false}={})=>
 fresh&&oracleHidden&&input&&raw&&trace ? "ELIGIBLE_FOR_EVALUATION" : "NOT_VERIFIED";
t("seven declared Skill slugs",names.length,7);
t("seven complete individual source texts",Object.values(skills).every(x=>typeof x==="string"&&x.length>3000));
for(const n of names){
 const text=skills[n], fm=frontmatter(text), plain=text.replace(/\*/g,"");
 t("frontmatter present "+n,fm!==null);
 t("frontmatter name "+n,fm?.name,n);
 t("frontmatter description "+n,(fm?.description||"").length>40);
 t("When to use "+n,/## When to use/i.test(plain));
 t("When not to use "+n,/## When not to use/i.test(plain));
 t("live safety negative "+n,/(?:do not|never|not|нет|не доказан)/i.test(text)&&text.includes("READY"));
 t("runtime doc path "+n,doc.includes("../.agents/skills/"+n+"/SKILL.md"));
 const links=[...text.matchAll(/\]\(([^)]+)\)/g)].map(x=>x[1].split("#")[0]).filter(x=>x&&!/^(?:https?:|mailto:)/i.test(x));
 t("has linked source refs "+n,links.length>=3);
 t("relative links exist "+n,links.every(link=>exists(norm(".agents/skills/"+n+"/"+link))));
}
const shaList=[...doc.matchAll(/\`([a-f0-9]{40})\`/g)].map(m=>m[1]);
t("exactly 7 displayed blob SHAs",shaList.length,7);
t("seven unique blob SHAs",new Set(shaList).size,7);
for(const name of names){
 const index=doc.indexOf("../.agents/skills/"+name+"/SKILL.md");
 t("blob SHA attributed to path "+name,index>=0&&/\`[a-f0-9]{40}\`/.test(doc.slice(index,index+190)));
}
for(const term of ["GH_ACCESS","SKILL_SOURCE","NODE_CHECKOUT","LLM_FRESH_SESSION","AUTO_SKILL_LOADER","EXPLICIT_LOAD_FALLBACK","BLOCKED / NETWORK DNS","NOT_VERIFIED (RV-06 OPEN)","PARTIAL / PENDING EVIDENCE","LLM_BLIND = 0","09.4–09.9","NOT STARTED"]){
 t("runtime evidence boundary "+term,doc.includes(term));
}
for(const term of ["FREEZE","PREPARE_PRIVATE_ORACLE","START_FRESH","LOAD","PRESENT_INPUT_ONLY","CAPTURE_RAW","RECHECK"]){
 t("reproducible procedure "+term,doc.includes("**"+term+"**"));
}
for(const term of ["LLM_BLIND","INCONCLUSIVE","NOT_RUN","PASS","FAIL_CRITICAL"]){
 t("09.1 contract cross-check "+term,contract.includes(term));
}
for(const term of ["09.2 `COMPLETED / APPROVED`","09.3","09.4–09.9"]){
 t("09.3 authorization "+term,plan.includes(term)||stage09_02.includes(term));
}
t("09.2 accepted explicitly",stage09_02.includes("## 6. Формальная приёмка 09.2"));
t("09.2 fixture corpus available",exists("tests/fixtures/stage-09/inputs.v1.json"));
t("input-only exporter exists",exists("tests/stage-09-02-export-agent-input.mjs"));
t("catalog confirms oracle absent",catalog.includes("НЕТ закрытых oracle"));
t("root operating rules present",agents.includes("Crypto Trading Agent"));
for(const [label,params,expected] of [
 ["nothing loaded",{}, "NOT_LOADED"],
 ["source partial",{sourceRead:true},"PARTIAL"],
 ["source body complete",{sourceRead:true,bodyComplete:true},"SOURCE_READ_ONLY"],
 ["auto not observed",{sourceRead:true,bodyComplete:true,independent:true,oracleHidden:true,rawTranscript:true},"SOURCE_READ_ONLY"],
 ["auto observed but transcript missing",{sourceRead:true,bodyComplete:true,autoLoaderObserved:true,independent:true,oracleHidden:true},"SOURCE_READ_ONLY"],
 ["auto observed but oracle visible",{sourceRead:true,bodyComplete:true,autoLoaderObserved:true,independent:true,rawTranscript:true},"SOURCE_READ_ONLY"],
 ["independence observed and full",{sourceRead:true,bodyComplete:true,autoLoaderObserved:true,independent:true,oracleHidden:true,rawTranscript:true},"RUNTIME_OBSERVED_NOT_TRADING_READY"]
])t("evidence separation "+label,evidence(params),expected);
for(const [label,args,want] of [
 ["no run",{},"NOT_VERIFIED"],
 ["same chat",{oracleHidden:true,input:true,raw:true,trace:true},"NOT_VERIFIED"],
 ["visible oracle",{fresh:true,input:true,raw:true,trace:true},"NOT_VERIFIED"],
 ["missing raw answer",{fresh:true,oracleHidden:true,input:true,trace:true},"NOT_VERIFIED"],
 ["missing trace",{fresh:true,oracleHidden:true,input:true,raw:true},"NOT_VERIFIED"],
 ["complete blind evidence",{fresh:true,oracleHidden:true,input:true,raw:true,trace:true},"ELIGIBLE_FOR_EVALUATION"]
])t("blind evidence gate "+label,blind(args),want);
const pins=[
 ["`LLM_BLIND = 0`","`LLM_BLIND = 10`"],
 ["**NOT_VERIFIED (RV-06 OPEN)**","**VERIFIED (RV-06 CLOSED)**"],
 ["**BLOCKED / NETWORK DNS**","**PASS / NODE CI**"],
 ["**НЕ** auto-discovery","**AUTO_LOADED**"],
 ["09.4–09.9 **NOT STARTED**","09.4–09.9 APPROVED"],
 ["**не** передавать ожидаемый verdict","передавать expected verdict"],
 ["`SOURCE_READ`, а не `AUTO_LOADED`","`AUTO_LOADED`, а не `SOURCE_READ`"]
];
for(const [correct,bad] of pins){
 if(!doc.includes(correct))throw Error("missing normative mutation anchor "+correct);
 t("source mutation "+correct,!doc.replace(correct,bad).includes(correct));
}
const docLinks=[...doc.matchAll(/\]\(([^)]+)\)/g)].map(x=>x[1].split("#")[0]).filter(x=>x&&!/^https?:/i.test(x));
t("runtime doc links numerous",docLinks.length>=10);
t("runtime doc relative targets exist",docLinks.every(p=>exists(norm("docs/"+p))));
const bad=tests.filter(x=>!x.pass);
for(const x of bad)console.error("FAIL",x.id,JSON.stringify({got:x.value,want:x.expected}));
console.log(JSON.stringify({kind:"STAGE_09_03_RUNTIME_SOURCE_AUDIT_LOCAL_JS",total:tests.length,passed:tests.length-bad.length,failed:bad.length,skills:7,sourceMutations:pins.length,independentLLMRuns:0,autoLoaderVerified:false,fullNodeCheckoutVerified:false,liveTradingReady:false}));
if(bad.length)process.exitCode=1;
