// Stage 09.4 — source-level regression for the R1 output-status boundary.
// Run after applying the R1 boundary fix: node tests/stage-09-04-r1-status-boundary-synthetic.mjs
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(resolve(root, p), 'utf8');
const market = read('.agents/skills/market-analysis/SKILL.md');
const verification = read('.agents/skills/data-verification/SKILL.md');
const overview = read('docs/prompts/market-overview.md');
const contract = read('docs/workflows/interaction-contract.md');
const tests = [
  ['R1 has explicit descriptive labels', market.includes('**R1 conclusion/status:**')],
  ['R1 reserved decision status prohibition', market.includes('Do not output `NEEDS_DATA`, `UNVERIFIED`, `REJECTED` or `READY` as a final R1 status')],
  ['Old ambiguous R1/R2 status formula removed', !market.includes('`R1_CONTEXT`, `R2_PRELIMINARY`, `NEEDS_DATA` or `UNVERIFIED` as *analytical labels only*')],
  ['R2 handling retained', market.includes('**R2 and downstream decisions:**')],
  ['Internal data-gate not copied into R1', market.includes('decision_impact=NEEDS_DATA')],
  ['Data verification explicitly states R1 boundary', verification.includes('**R1 presentation boundary:**')],
  ['R1 prompt avoids trade status', overview.includes('Не присваивать обычному R1 статус готовности к торговле')],
  ['Top-level dialogue contract retains R1 boundary', contract.includes('**Правило для RT02/R1:**')],
  ['Data verification retains R3 handoff', verification.includes('## R3 handoff: mandatory final recheck')],
  ['Market analysis never grants READY', market.includes('This Skill cannot grant `READY`')]
];
for (const [name, pass] of tests) {
  if (!pass) console.error('FAIL', name);
  else console.log('PASS', name);
}
assert(tests.every(([, pass]) => pass));
console.log(`STAGE09_R1_STATUS_SOURCE: ${tests.length}/${tests.length} PASS (LOCAL_JS, NOT LLM)`);
