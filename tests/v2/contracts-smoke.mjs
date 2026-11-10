// Crypto Trading Agent v2 Stage 03: deterministic structural/safety smoke tests.
// Run from repository root: node tests/v2/contracts-smoke.mjs
// This is a dependency-free subset validator for the schema features used here.
// NOT a replacement for Draft 2020-12 validation, semantic review, or independent LLM tests.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=(p)=>JSON.parse(readFileSync(p,"utf8"));
const specs=["request-context","evidence-record","market-evidence","technical-evidence","coin-profile","strategy-proposal","bot-configuration"];
const schemas=Object.fromEntries(specs.map(n=>[n,read(`docs/v2/contracts/${n}.schema.json`)]));
const fixture=read("tests/v2/fixtures/incomplete-hype.v1.json");

function check(schema,value,path="$") {
  if (schema.type) {
    const types=Array.isArray(schema.type)?schema.type:[schema.type];
    const actual=value===null?"null":Array.isArray(value)?"array":Number.isInteger(value)?"integer":typeof value;
    assert(types.some(t=>t===actual||(t==="number"&&actual==="integer")), `${path}: unexpected type ${actual}`);
  }
  if("const" in schema)assert.deepEqual(value,schema.const,`${path}: const`);
  if(schema.enum)assert(schema.enum.includes(value),`${path}: enum ${String(value)}`);
  if(typeof value==="string"&&schema.minLength!==undefined)assert(value.length>=schema.minLength,`${path}: minLength`);
  if(typeof value==="number"&&schema.minimum!==undefined)assert(value>=schema.minimum,`${path}: minimum`);
  if(Array.isArray(value)&&schema.minItems!==undefined)assert(value.length>=schema.minItems,`${path}: minItems`);
  if(Array.isArray(value)&&schema.maxItems!==undefined)assert(value.length<=schema.maxItems,`${path}: maxItems`);
  if(Array.isArray(value)&&schema.items)for(const [i,v] of value.entries())check(schema.items,v,`${path}[${i}]`);
  for(const branch of schema.allOf??[]) {
    let applies=true;
    if(branch.if){try{check(branch.if,value,path+".if")}catch{applies=false}}
    if(applies&&branch.then)check(branch.then,value,path+".then");
  }
  if(value&&typeof value==="object"&&!Array.isArray(value)) {
    for(const prop of schema.required??[]) assert(Object.hasOwn(value,prop),`${path}: missing ${prop}`);
    if(schema.additionalProperties===false)for(const key of Object.keys(value)) assert(Object.hasOwn(schema.properties??{},key),`${path}: unexpected ${key}`);
    for(const [key,s] of Object.entries(schema.properties??{}))if(Object.hasOwn(value,key))check(s,value[key],`${path}.${key}`);
  }
}
let checks=0;
for(const [name,schema] of Object.entries(schemas)){assert.equal(schema.$schema,"https://json-schema.org/draft/2020-12/schema");assert.equal(schema.type,"object");assert(schema.required.length>0);checks++}
const mapping={request_context:"request-context",market_evidence:"market-evidence",technical_evidence:"technical-evidence",coin_profile:"coin-profile",strategy_proposal:"strategy-proposal",bot_configuration:"bot-configuration"};
for(const [key,name] of Object.entries(mapping)){check(schemas[name],fixture[key]);checks++}
for(const item of fixture.evidence_records){check(schemas["evidence-record"],item);checks++}
const ids=new Set(fixture.evidence_records.map(e=>e.evidence_id));
assert.equal(ids.size,fixture.evidence_records.length);checks++;
for(const id of [...fixture.market_evidence.evidence_ids,...fixture.coin_profile.evidence_refs])assert(ids.has(id));checks++;
assert.equal(fixture.synthetic,true);checks++;
assert.equal(fixture.coin_profile.trend_decision.direction,"UNKNOWN");checks++;
assert.equal(fixture.strategy_proposal.posture,"WAIT");checks++;
assert.equal(fixture.bot_configuration.readiness,"NEEDS_DATA");checks++;
assert.equal(fixture.bot_configuration.form_evidence.P02_verified_at,null);checks++;
assert.equal(fixture.bot_configuration.forbidden_automated_execution,true);checks++;
assert.equal(fixture.evidence_records[0].access_status,"ACCESS_UNAVAILABLE");checks++;
// Mutations must be rejected by schema shape/enum/const.
for (const [schema,datum] of [
 [schemas["strategy-proposal"],{...fixture.strategy_proposal,posture:"BUY_NOW"}],
 [schemas["bot-configuration"],{...fixture.bot_configuration,forbidden_automated_execution:false}],
 [schemas["request-context"],{...fixture.request_context,preferred_platform:"UNKNOWN_BOT"}],
 [schemas["evidence-record"],{...fixture.evidence_records[0],access_status:"SCRAPED_FOR_SURE"}],
 [schemas["bot-configuration"],{...fixture.bot_configuration,readiness:"VERIFIED_FOR_MANUAL_REVIEW"}],
]){assert.throws(()=>check(schema,datum));checks++}
// Semantic non-trading invariants (schema alone cannot enforce these).
const forbidden=(f)=>f.bot_configuration.readiness==="VERIFIED_FOR_MANUAL_REVIEW"&&(!f.bot_configuration.form_evidence.P02_verified_at||f.bot_configuration.risk_checks.model_status!=="PASS");
assert.equal(forbidden(fixture),false);checks++;
const invalid={...fixture,bot_configuration:{...fixture.bot_configuration,readiness:"VERIFIED_FOR_MANUAL_REVIEW"}};
assert.equal(forbidden(invalid),true);checks++;
assert.equal(Object.keys(schemas).length,7);checks++;
console.log(`PASS ${checks} dependency-free v2 structural/negative smoke assertions; NOT live/LLM trading validation`);
