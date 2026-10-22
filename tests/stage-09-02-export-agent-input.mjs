// Stage 09.2 INPUT-ONLY exporter. Node >=18.
// Usage: node tests/stage-09-02-export-agent-input.mjs S09-001
// Prints only user_message + payload. No metadata, oracle, expected route or verdict.
// Never contacts any model, network, exchange or account.
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const id=process.argv[2];
if(!/^S09-\d{3}$/.test(id||"")){console.error("Provide a case ID such as S09-001");process.exitCode=2;}
else {
 const doc=JSON.parse(readFileSync(resolve(ROOT,"tests/fixtures/stage-09/inputs.v1.json"),"utf8"));
 const c=doc.cases.find(x=>x.case_id===id);
 if(!c){console.error("Unknown case ID");process.exitCode=2;}
 else if(c.synthetic!==true){console.error("Not a synthetic fixture");process.exitCode=2;}
 else console.log(JSON.stringify({user_message:c.user_message,payload:c.payload},null,2));
}
