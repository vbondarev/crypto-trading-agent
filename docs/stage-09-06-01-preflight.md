# Stage 09.6.1 — Strategy & Risk Gates preflight and immutable source freeze

**Date:** 2026-11-08. **State:** `PREFLIGHT_COMPLETED / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING / 09.6.2_NOT_STARTED`.

## 1. Authorization, baseline and scope

The user approved [the 09.6.1–09.6.6 plan](stage-09-06-plan.md) and explicitly authorized **only 09.6.1**: a read-only preflight/source manifest and documentary self-review. Creating a new sealed oracle, publishing an oracle commitment, invoking fresh model sessions, starting 09.6.2 or modifying trading/risk norms is **not authorized**.

Repository: `vbondarev/crypto-trading-agent`, development branch `feature/initial-agent-mvp`, PR #1 **OPEN / DRAFT / NOT_MERGED** at preflight start.

**Frozen normative/source commit (preflight pin):** `d8a162342cba57803ddbd0efdb1e53c373e9406e`, the confirmed PR HEAD immediately **before** this report is added. This immutable pin is to be used in all future 09.6 independent tests unless a **separately approved** prospective change explicitly establishes a new pin. Do not use current branch HEAD implicitly: this preflight report commit advances the branch but does not change the immutable policy pin.

The approved [stage 09.5 closeout](stage-09-05-closeout.md) remains `CLOSED/APPROVED`, with one explicit user-approved lower-assurance backup exception for `S09-015-R02` and no changes to its historical run data. Older status paragraphs in the master stage 09 plan are historical checkpoint snapshots, not authority to revert 09.5 closure.

## 2. Complete-source fetch manifest (GitHub Connector, pinned ref)

Every **existing** file below was fetched by GitHub Connector `fetch_file` with explicit full `ref=d8a162342cba57803ddbd0efdb1e53c373e9406e`, no line-range truncation, and UTF-8 string content. Lengths are JavaScript string UTF-16 units, **not UTF-8 bytes**. SHA values are provider-reported **Git Blob hashes**, not locally recomputed Git objects. Reading source text does **not** prove an agent auto-loaded or executed a Skill.

| Source path | Git Blob SHA | UTF-16 length |
|---|---|---:|
| `AGENTS.md` | `4e96077337e550448eb262599089fba9eb879d81` | 34393 |
| `docs/agent-operating-rules.md` | `62c33c1c6de5fbedbe16945b175a4ce1d98f5cba` | 15451 |
| `docs/data-freshness.md` | `2a2cc811340ba8414777fc2019ac41ceb6273a78` | 45131 |
| `docs/risk-management.md` | `741e53f25baa77cd49a46e562858f8faf502acee` | 147005 |
| `docs/stage-09-test-contract.md` | `16b450ccd5081909cc586ad53121432321dc4672` | 14392 |
| `docs/input-templates.md` | `fc1ff48c794d15982648bc745f632b4a3952a8e2` | 40863 |
| `docs/stage-09-plan.md` | `ad7977ce878a38be8c65be25a4a052cbeeddef6a` | 21295 |
| `docs/stage-09-06-plan.md` | `2623767197289d6d0da5e6d9abb5c4358564397d` | 9664 |
| `docs/stage-09-05-closeout.md` | `16e5939aa09a58041c7a483ee25352aaa6ebe85d` | 6645 |
| `docs/prompts/portfolio-recovery.md` | `6cf7824ed6c6425edaa12d8e1961b9295d74cded` | 20112 |
| `.agents/skills/data-verification/SKILL.md` | `6815b433d91135738210ce5993af30b2bf2c74fa` | 12523 |
| `.agents/skills/market-analysis/SKILL.md` | `f458dbd67c4d26642f5ea46b3ed310c5fb5a1c02` | 15012 |
| `.agents/skills/portfolio-analysis/SKILL.md` | `15d4d476e772a681e719c16dc9845251d22d7036` | 15281 |
| `.agents/skills/risk-assessment/SKILL.md` | `44661e995d2a5277eb034c8a0e97bef9223de50a` | 17432 |
| `.agents/skills/strategy-planning/SKILL.md` | `ce7d5fb44ace79f5564a8c175fb0b2b6d4011ef1` | 15986 |

**Source-path issue — `PATH_NOT_FOUND`, not an invented source:** the previously proposed candidate paths `docs/prompts/strategy-planning.md` and `docs/prompts/strategy-recommendation.md` both returned GitHub `404 NOT_FOUND` at the pinned ref. They are **not** listed as successfully loaded sources, and are not required by the already observed case inputs. The verified `strategy-planning/SKILL.md`, `risk-assessment/SKILL.md`, `docs/risk-management.md`, `docs/agent-operating-rules.md` and existing `docs/prompts/portfolio-recovery.md` provide the applicable strategy/risk semantics. During 09.6.2 **do not add either nonexistent prompt to a mandatory-source manifest**. If a distinct strategy prompt is required, discover its actual path and verify its Git Blob by exact immutable commit before the next step; do not fabricate a file or claim it was read.

**No runtime verification:** `AUTO_SKILLS_LOADER=NOT_VERIFIED`, `TEST_AGENT_SOURCE_READS=NOT_RUN`, `PRODUCTION_BYBIT=NOT_USED`.

## 3. Frozen synthetic fixture integrity and six-case inventory

Input `tests/fixtures/stage-09/inputs.v1.json`, original Git Blob **`965c12afa0c4afc4c0b1698732e61c597d351b88`**, `schema=stage09.synthetic-input-only.v1`, total **45** entries; exactly one instance of each case `S09-018` through `S09-023`. Each case is `fixture_version=1`, `synthetic=true`, `synthetic_now_msk=2026-10-20T12:00:00+03:00`, with sequential `prompt_id=P08-18..P08-23`. **No fixture mutation** and no use of real market inputs.

| Case/prompt | Exact fixture evidence | Route/Skill focus | Expected observable risk boundary |
|---|---|---|---|
| `S09-018/P08-18` | `current_slots=3`; `projected_slots=4` for reachable GPS NEW | RT06/RT09 as applicable; portfolio-analysis + risk-assessment + strategy-planning | NEW would exceed FR-033; **REJECTED** new risk if reachability as supplied; fourth position is prospective, not filled; no fake READY |
| `S09-019/P08-19` | `h04_active=true`, `p02=null`, `mark=null` | RT06; risk-assessment + strategy-planning, portfolio context | Known H04 hard veto on risk-expanding ADD ⇒ **REJECTED**, ahead of unrelated P02/Mark `NEEDS_DATA`; protective reduction discussed conditionally |
| `S09-020/P08-20` | Gross realized -8, unrealized +15, fees 1, funding **cost** 1, H02/H03 missing, H04 UNKNOWN | RT05/RT06; portfolio-analysis + risk-assessment + strategy-planning | Arithmetic **+5 USDT conditional** only; T05/owner/event history missing => never verified `RECOVERED`; H02/H03 `NOT_CHECKED`, H04 unknown, no R3 READY |
| `S09-021/P08-21` | Synthetic user-attested daily loss **3.0% at Moscow 00:00**, HWM DD **15.0%**, T06 history timestamps and H04 ACTIVE | RT06/RT09; risk-assessment + strategy-planning | Equality triggers hard-limit block for NEW: **≥3% and ≥15%**, confirmed H04 ⇒ `REJECTED`, not only `NEEDS_DATA`; do not present user-generated history as independently observed live |
| `S09-022/P08-22` | UTA Cross SOL Short; Mark 100, displayed liq 130, stop trigger 110, MMR/strict Short upper loss UNKNOWN | RT09 R3 audit; data-verification + portfolio-analysis + risk-assessment + strategy-planning as needed | Display difference 30% **not proven Cross account liquidation distance** or exit loss cap; `UNVERIFIED / NEEDS_DATA`; missing account model, stop execution/slippage, real F/A/H/R; no READY |
| `S09-023/P08-23` | `selected_platform=null`, `selected_strategy=null`, `t02=null`; user forbids final settings | RT06; strategy-planning + risk-assessment | Provisional WAIT/NEW/ADD comparison, user `CHOOSE` not bypassed; no invented Veles/GinArea config, risk approval or definitive NEW |

**Evidence boundary:** a nominal `+5` synthetic H01 is not confirmation of realized recovery; `S09-021` 3% and 15% are explicitly supplied as verified **inside a synthetic exercise**, not a user-linked real account; `S09-022` Mark/liq/stop cannot substitute real MMR or FR-038 stress.

## 4. Cross-source risk rules and precedence review

- Strategy Skill and Risk Skill agree on `FR-029` planned portfolio IM ≤30% Equity, `FR-030` bot worst loss ≤5% Equity, `FR-031` leverage ≤5×, `FR-032` adverse Mark liquidation distance ≥15% **only with a valid applicable model**, `FR-033` max 3 reachable exchange slots and `FR-034` complete future IN reserve plus costs. The sparse six-case fixture does not provide all corresponding balance/market/tier data; unsupported numeric compliance remains `NOT_EVALUABLE`.
- For verified historical evidence, `FR-028` known H02 adjusted HWM DD **≥15%**, `FR-035` known H03 Moscow-day loss **≥3%** trigger new-risk veto; `FR-036` known active H04 prevents NEW/ADD. Exact equality triggers the block. Missing H02/H03 individually are `NOT_CHECKED`, **not an automatic breach**. H04 active takes precedence over missing Mark/P02, with the missing information still disclosed. Protective risk-reducing actions are not automatically banned.
- R3 full real trade approval requires synchronized complete T02/T03/T04/P02 where applicable, verified source identity and freshness, account-wide Cross MMR, strict Short upper-risk model, fully financed staged margin, and actual F/A/H/R stress where mandatory. This exercise has none of that. Status decisions are scoped to the user's requested proposed action, never a real `READY`.
- 09.5 overlap references: `S09-014-R01` previously passed projected fourth-slot risk, `S09-015-R02` passed arithmetic and historical diagnostic outputs under a user-approved exception. These are regression references **only**, do not become 09.6 executions and their original grades/pins are not altered.
- All `RV-02/03/04/06`, `TV-01..TV-04`, and real `FR-038 F/A/H/R` remain OPEN. Never silently close them with a synthetic answer.

## 5. Preflight acceptance gates and exact next boundary

| Gate | Preflight finding |
|---|---|
| Authorized scope only | PASS — documentary review, exact source read, six-case mapping |
| Unique existing case IDs and P08 mapping | PASS — 6/6, original v1 fixture unchanged |
| Source identity and timestamp | PASS — explicit immutable `d8a162342cba57803ddbd0efdb1e53c373e9406e` and provider Git Blobs |
| No contradicting hard-limit equality semantics | PASS — ≥3% day and ≥15% HWM, active H04 new-risk block |
| All intended prompt paths independently verified | **CAVEAT** — two candidate strategy prompt filenames `404`, **not** misrepresented as loaded |
| Original stage 09.5 evidence unchanged | PASS — historical approved closeout preserved |
| Private original oracle created | **NOT_RUN — prohibited until 09.6.2** |
| New sealed SHA commitment published | **NOT_RUN — prohibited until 09.6.2** |
| Independent LLM/TChat run performed | **NOT_RUN — prohibited until 09.6.3** |
| Any trading operation / live Bybit API | **NOT_USED** |

**Preflight disposition:** `09.6.1 IMPLEMENTED / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING`. Path naming caveat is **nonblocking for documentary preflight** but must remain explicit and be resolved before any mandatory-source list references a strategy prompt. **09.6.2 is NOT_STARTED / NOT_AUTHORIZED** until the user explicitly approves preflight results and separately authorizes 09.6.2.
