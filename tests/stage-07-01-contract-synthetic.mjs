// Stage 07.1: synthetic contract tests only, not full YAML parsing or actual ChatGPT Skill discovery.
// Run: node tests/stage-07-01-contract-synthetic.mjs
const skills=["data-verification","market-analysis","portfolio-analysis","risk-assessment","strategy-planning","veles-configuration","ginarea-configuration"];
function validName(x){return typeof x==="string"&&x.length>=1&&x.length<=64&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x);}
function lintFrontmatter(s,dir){
 if(!s.startsWith("---\n"))return "BAD_FRONTMATTER";
 const ls=s.split("\n"),end=ls.indexOf("---",1);
 if(end<2)return "BAD_FRONTMATTER";
 const values=new Map();
 for(const line of ls.slice(1,end)){
  const m=line.match(/^([a-z-]+):\s*(.*)$/);
  if(!m)return "NEEDS_FULL_YAML_PARSER";
  if(values.has(m[1]))return "DUPLICATE_FIELD";
  values.set(m[1],m[2].trim().replace(/^['"]|['"]$/g,""));
 }
 if(!values.has("name")||!values.has("description"))return "MISSING_REQUIRED";
 if(!validName(values.get("name"))||values.get("name")!==dir)return "INVALID_NAME";
 const desc=values.get("description");
 if(!desc.length||desc.length>1024)return "INVALID_DESCRIPTION";
 if(!ls.slice(end+1).join("\n").trim())return "EMPTY_BODY";
 return "LEXICAL_PREFLIGHT_PASS_NOT_FULL_YAML";
}
function router({task,platform=null,selected=false,position=false,live=false}){
 const data=["data-verification"],m=["market-analysis"],p=["portfolio-analysis"],risk=["risk-assessment"],st=["strategy-planning"];
 const uniq=a=>[...new Set(a)];
 if(task==="education")return [];
 if(task==="market")return [...(live?data:[]),...m];
 if(task==="technical")return uniq([...data,...m,...(position?[...p,...risk]:[]),...st]);
 if(task==="portfolio")return [...data,...p,...risk];
 if(task==="recovery")return [...data,...p,...risk,...st];
 if(task==="compare")return st;
 if(task==="configuration"||task==="r3"){
  const r=[...data,...p,...risk];
  if(!selected||!["Veles","GinArea"].includes(platform))return [...r,...st];
  return [...r,...(task==="configuration"?st:[]),platform==="Veles"?"veles-configuration":"ginarea-configuration"];
 }
 return [];
}
function labelAllowed(platform,label){const labels={Veles:["Депозит","% Мартингейла","Стоп-лосс"],GinArea:["Размер ордера","Макс. размер","Disable IN"]};return labels[platform]?.includes(label)===true;}
function decision({hard=false,unknown=false,missing=false,verified=false}={}){return hard?"REJECTED":unknown?"UNVERIFIED":missing||!verified?"NEEDS_DATA":"LOCAL_ONLY_NOT_READY";}
function loading({expected,actual,body,ref}){return expected===actual&&body&&ref?"READ_EVIDENCE_NOT_AUTO_ACTIVATION":"NOT_LOADED";}
function pathFromSkill(name,file){const tokens=[".agents","skills",name];for(const x of("../../../docs/"+file).split("/"))x===".."?tokens.pop():tokens.push(x);return tokens.join("/");}
function freshness({mode,t02=null,mark=null,changed=false}){return mode!=="R3"?"NOT_R3":changed||t02===null||mark===null||t02>5||mark>2?"INVALIDATE_R3":"TTL_ONLY_NOT_READY";}
const testCases=[];
function test(title,actual,expected){const i=testCases.length+1;testCases.push({id:"T"+String(i).padStart(2,"0"),title,passed:Object.is(actual,expected),actual,expected});}
const good="---\nname: data-verification\ndescription: Check provenance and freshness of crypto market observations.\n---\n# Данные\n";
test("valid metadata lexical only",lintFrontmatter(good,"data-verification"),"LEXICAL_PREFLIGHT_PASS_NOT_FULL_YAML");
test("frontmatter header absent",lintFrontmatter("name: x\n---\n#","x"),"BAD_FRONTMATTER");
test("frontmatter closing absent",lintFrontmatter("---\nname: x\n","x"),"BAD_FRONTMATTER");
test("name required",lintFrontmatter("---\ndescription: text\n---\n#","x"),"MISSING_REQUIRED");
test("description required",lintFrontmatter("---\nname: x\n---\n#","x"),"MISSING_REQUIRED");
test("name must match directory",lintFrontmatter(good,"market-analysis"),"INVALID_NAME");
test("upper case name banned",validName("Market-Analysis"),false);
test("double hyphen name banned",validName("market--analysis"),false);
test("leading dash banned",validName("-market"),false);
test("trailing dash banned",validName("market-"),false);
test("64-char name valid",validName("a".repeat(64)),true);
test("65-char name invalid",validName("a".repeat(65)),false);
test("empty description rejected",lintFrontmatter("---\nname: x\ndescription: \n---\n#","x"),"INVALID_DESCRIPTION");
test("1024-char description accepted",lintFrontmatter("---\nname: x\ndescription: "+"z".repeat(1024)+"\n---\n#","x"),"LEXICAL_PREFLIGHT_PASS_NOT_FULL_YAML");
test("1025-char description rejected",lintFrontmatter("---\nname: x\ndescription: "+"z".repeat(1025)+"\n---\n#","x"),"INVALID_DESCRIPTION");
test("body cannot be empty",lintFrontmatter("---\nname: x\ndescription: ok\n---\n","x"),"EMPTY_BODY");
test("duplicate keys rejected",lintFrontmatter("---\nname: x\nname: x\ndescription: ok\n---\n#","x"),"DUPLICATE_FIELD");
test("complex YAML not supported by lexical preflight",lintFrontmatter("---\nname: x\ndescription: |\n  multiline\n---\n#","x"),"NEEDS_FULL_YAML_PARSER");
test("exactly 7 distinct Skills",new Set(skills).size,7);
test("7 names conform to spec",skills.every(validName),true);
test("education does not mandate Skills",router({task:"education"}).length,0);
test("R1 context market no live values",router({task:"market"}).join(","),"market-analysis");
test("R1 current market needs verifier",router({task:"market",live:true}).join(","),"data-verification,market-analysis");
test("R2 technical no position",router({task:"technical"}).join(","),"data-verification,market-analysis,strategy-planning");
test("R2 technical with position",router({task:"technical",position:true}).join(","),"data-verification,market-analysis,portfolio-analysis,risk-assessment,strategy-planning");
test("portfolio includes risk",router({task:"portfolio"}).includes("risk-assessment"),true);
test("recovery includes risk and strategy",router({task:"recovery"}).join(","),"data-verification,portfolio-analysis,risk-assessment,strategy-planning");
test("comparison needs no final platform config",router({task:"compare"}).join(","),"strategy-planning");
test("no platform selection -> no platform Skill",router({task:"configuration"}).some(s=>s.endsWith("-configuration")),false);
test("Veles R2 config exact chain",router({task:"configuration",selected:true,platform:"Veles"}).join(","),"data-verification,portfolio-analysis,risk-assessment,strategy-planning,veles-configuration");
test("GinArea R2 config selected",router({task:"configuration",selected:true,platform:"GinArea"}).at(-1),"ginarea-configuration");
test("Veles R3 minimal chain",router({task:"r3",selected:true,platform:"Veles"}).join(","),"data-verification,portfolio-analysis,risk-assessment,veles-configuration");
test("GinArea R3 excludes Veles",router({task:"r3",selected:true,platform:"GinArea"}).includes("veles-configuration"),false);
test("unknown target cannot generate config Skill",router({task:"r3",selected:true,platform:"Other"}).some(s=>s.endsWith("-configuration")),false);
test("Veles cannot use GinArea Disable IN",labelAllowed("Veles","Disable IN"),false);
test("GinArea cannot use Veles Deposit",labelAllowed("GinArea","Депозит"),false);
test("Veles documented example field",labelAllowed("Veles","Депозит"),true);
test("GinArea documented example field",labelAllowed("GinArea","Размер ордера"),true);
test("main branch read does not satisfy feature branch",loading({expected:"feature/initial-agent-mvp",actual:"main",body:true,ref:"abc"}),"NOT_LOADED");
test("metadata read is not body read",loading({expected:"feature/initial-agent-mvp",actual:"feature/initial-agent-mvp",body:false,ref:"abc"}),"NOT_LOADED");
test("body read does not prove runtime activation",loading({expected:"feature/initial-agent-mvp",actual:"feature/initial-agent-mvp",body:true,ref:"abc"}),"READ_EVIDENCE_NOT_AUTO_ACTIVATION");
test("correct relative path to docs",pathFromSkill("data-verification","data-freshness.md"),"docs/data-freshness.md");
test("correct relative path to nested docs",pathFromSkill("ginarea-configuration","platforms/ginarea.md"),"docs/platforms/ginarea.md");
test("hard H04 outranks missing",decision({hard:true,missing:true}),"REJECTED");
test("critical conflict outranks missing",decision({unknown:true,missing:true}),"UNVERIFIED");
test("missing portfolio blocks READY",decision({missing:true}),"NEEDS_DATA");
test("synthetic full proof never READY",decision({verified:true}),"LOCAL_ONLY_NOT_READY");
test("R1 no R3 TTL",freshness({mode:"R1"}),"NOT_R3");
test("R3 old T02",freshness({mode:"R3",t02:6,mark:1}),"INVALIDATE_R3");
test("R3 old Mark",freshness({mode:"R3",t02:1,mark:3}),"INVALIDATE_R3");
test("R3 fill event invalidates",freshness({mode:"R3",t02:1,mark:1,changed:true}),"INVALIDATE_R3");
test("R3 TTL pass alone is not READY",freshness({mode:"R3",t02:1,mark:1}),"TTL_ONLY_NOT_READY");
const failures=testCases.filter(t=>!t.passed);
for(const fail of failures)console.error("FAIL",fail.id,fail.title,fail.expected,fail.actual);
console.log(JSON.stringify({kind:"SYNTHETIC_CONTRACT_PREFLIGHT",total:testCases.length,passed:testCases.length-failures.length,failed:failures.length,realSkillsCreated:false,realAutoDiscoveryProved:false,realReady:false}));
if(failures.length)process.exitCode=1;
