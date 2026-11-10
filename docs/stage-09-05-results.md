# Stage 09.5.6 — Portfolio & Recovery final audit (pending user approval)

**Audit date:** 2026-11-08. **Decision:** `AUDITED / CONTENT_COVERAGE_5_OF_5 / USER_ATTESTED / ONE_EXPLICIT_ORACLE_BACKUP_EXCEPTION / USER_ACCEPTANCE_PENDING`. This report is an **additive final-review artifact**, not a stage closeout or permission for trading. PR #1 remains OPEN / Draft; no merge.

## 1. Scope, fixed evidence and two run counters

Approved [09.5 v2 plan](stage-09-05-plan.md) requires **five distinct newly accepted scenarios S09-013–S09-017** and **one historical 09.4 reference S09-012-R01**, with no double counting. The canonical [stage 09.5 actual-run journal](../tests/fixtures/stage-09/portfolio-recovery-actual-runs.v1.json) at audit start was Git Blob `99ee5edb616cb27391c2882ff93a5ed8c75c5e93`. Its six distinct run IDs are `S09-013-R01`, `S09-014-R01`, `S09-015-R01`, `S09-016-R01`, `S09-017-R01` and `S09-015-R02`.

- **Execution count:** `STAGE_09_5_NEW_EXECUTIONS = 6` (original five first runs plus corrective R02).
- **Accepted distinct stage-09.5 scenarios:** `STAGE_09_5_NEW_CASES_ACCEPTED = 5/5`, **including one user-approved lower-assurance exception for R02**.
- **Scoped case coverage:** `P08-12..17 = 6/6` (one old S09-012 + five accepted new cases); **not** six new runs.
- **Criterion scores for five chosen accepted runs:** `50/50` substantive mandatory checks PASS (five cases × ten), but **only 4/5 meet the standard original-standalone-oracle-file rehash gate**. Across all six executed stage-09.5 runs, content score is `59/60` observed rubric items with one failed mandatory E09 in the preserved R01; the R02 10/10 is a backed-up preregistered oracle assessment accepted by documented exception, not full original-file verification.
- Historical 09.4 journal at `tests/fixtures/stage-09/r1-r2-actual-runs.v1.json` Git Blob `437014ce0861d48a82c031de2206414864989f5d`: **18** historical executions, **12** distinct accepted cases, including `S09-012-R01`. Historical S09-012 is **not** added as a new 09.5 run. The old [09.4 closeout](stage-09-04-closeout.md) remains APPROVED with its own provenance caveats.

## 2. Final case matrix, accountable outcomes

| Case and accepted attempt | Core asserted observation / audited behavior | Frozen mandatory score | Integrity / provenance |
|---|---|---:|---|
| `S09-012-R01` **historic 09.4 reference only** | T02 synthetic two positions (SOL Cross Long and BTC Isolated Short), two orders; account MMR unknown; no false proof of total account completeness or real R3 READY | 10/10 | Historical 09.4 accepted USER_ATTESTED, original private oracle verified per its report |
| `S09-013-R01` | Displayed SOL Cross liq 130 vs Mark 100: arithmetic +30% **display gap**, not verified FR-032 15% distance; incomplete T02/MMR; UNVERIFIED/NEEDS_DATA | 10/10 | 09.5 accepted USER_ATTESTED; original sealed SHA verified |
| `S09-014-R01` | S0 three positions; virtual GPS future IN creates conditional S2 fourth slot if executable; FR-033 blocks new risk **conditionally**; FILLED A leaves0, NEW B leaves2 counted once, owner unresolved; no fictitious IM | 10/10 | 09.5 accepted USER_ATTESTED; original sealed SHA verified |
| `S09-015-R02` | **Corrected** H01 conditional subtotal `-26.40 + 11.75 - 1.60 + 0.35 = -15.90 USDT` (funding received); not recovered; missing T05 identity; H02/H03 NOT_CHECKED, H04 UNKNOWN, no READY | 10/10 | **Accepted only with user-approved precommitted ZIP-backup exception**, original standalone oracle file **not rehashed**; technically unauthenticated session |
| `S09-016-R01` | Known gross-like subtotal `-18 + 5 = -13 USDT` pre additional unknown fees/funding; net unknown, WAIT/HOLD/REDUCE/CLOSE conditional, no guaranteed exit or ADD | 10/10 | 09.5 accepted USER_ATTESTED; original sealed SHA verified |
| `S09-017-R01` | T02 11:58 event-invalidated at 11:59:40 after equity 1000→920; two-point difference `-80 USDT / -8%` **not** daily realized loss, HWM drawdown or proof of breach; RECHECK/NEEDS_DATA, no inherited READY | 10/10 | 09.5 accepted USER_ATTESTED; original sealed SHA verified |

**Preserved failed attempt:** `S09-015-R01` = **9/10 FAIL E09**, `formal_case_accepted=false` forever. Its initial answer correctly computed conditional `-15+10-1-2=-8 USDT` but omitted an explicit H02/H03 NOT_CHECKED diagnostic. [Adversarial review](stage-09-05-05-s09-015-r01-adversarial-review.md) found the earlier characterization of missing literal `H04=UNKNOWN` overly broad: this absence was not an independent conclusively proved failure. The original grade is **not** retroactively altered; the corrected R02 is a different input and policy pin.

## 3. Oracle commitments, version pins and integrity limitations

- R01 set `S09-013..017`: fixed policy source commit `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`, original public input Git Blob `965c12afa0c4afc4c0b1698732e61c597d351b88`; five original sealed SHA256 commitments publicly preregistered at `fffb5008761e91b84bec5d54d6165f6a1d8da00a` (see [commitment table](stage-09-05-02-oracle-commitments.md)). The five archived original R01 oracle byte payloads currently rehashed from a private archive match the five published digests, preserving public commitment identity. Their **standalone original-file rehashes were established during the individual evaluations**, not claimed afresh in this final session.
- R02 uses **different, explicit prospective** policy SHA `1a0c12f7baba99d2b1dfb7b8afe18ef40034264c` after approved RT05/H01 Option B changes; v2 fixture `tests/fixtures/stage-09/s09-015-r02-input.v2.json` Git Blob `5cd4c2ef9c8fdfdc572e154d38868941ec253959`, committed `286be1317f79eb63fd4e43232c36da9646d45aeb`; its precommitted private oracle SHA-256 `a2f563e0eec0228f9c4a7c8895ebb0f4533b0c6b040e3c99296184aca929718c` was published in commit `b6d87e6b3d084f1ba05b8c72b09f610605b363b1` **before the first R02 answer**.
- **R02 exception is mandatory to disclose:** distinct original standalone file is unavailable after test; private ZIP archive member `S09-015-R02_PRIVATE_ORACLE.json` is **4318 bytes** with exactly matching published SHA. The actual original-file requirement from the v2 plan was NOT met. The user explicitly chose the separate, narrowly scoped [backup exception](stage-09-05-05-s09-015-r02-backup-exception-approval.md) on 2026-11-08; acceptance was appended as an audit event with `oracle_sha256_verified_against_original_private_file=false`, `oracle_backup_zip_hash_verified=true`, `user_approved_procedural_exception=true` and `formal_case_accepted=true`. This is **not** proof that the original standalone file was reverified, and should never be generalized to other runs or described as strict-standard original-integrity PASS.
- Six 09.5 run entries are distinct and preserve five original first attempts plus corrective R02; original first-answer claims were user-attested. No authenticated Temporary Chat session export, tested-model ID or tool trace; test agents' reported full GitHub reads are **self-reported**, `AUTO_LOADED=NOT_VERIFIED`. Same development assistant prepared/evaluated; `evaluator_independence=LIMITED`.
- Historical `S09-012-R01` uses **its own** 09.4 normative commit `ea12ab9ae3c865bddd1455b01dae47357e6dc9cc`; it does not inherit either 09.5 source pin.

## 4. Cross-case invariant audit

| Requirement / invariant | Finding | Evidence bound |
|---|---|---|
| RT04 / S0 account/position identity, Cross vs Isolated | PASS for **stated** two position/two order reference, and identified incomplete account scope | No independent full UTA subaccount completeness |
| FR-032 Cross/MMR and display-price liquidations | PASS as **safe refusal** to treat 30% display gap as certified 15% liquidation safety | Actual Cross account MMR / real liquidation model RV-02 OPEN |
| FR-033 reachable position slots | PASS: 3 current, reachable conditional 4th GPS slot treated as prohibited new risk if executable | No claim fourth is already filled |
| FR-034 order residuals and reserve | PASS: A FILLED leaves0 excluded; B NEW leaves2 counted once; no invented B-to-GPS ownership | No verified currency/order price, actual future IM or 100% monetary reserve |
| RT05 / H01 signed lifecycle vs unrealized | PASS: R02 `-15.90` and S09-016 `-13` pre-cost; original failed -8 preserved | No authenticated full H01 T05 trade ledger, final realized recovery or execution proceeds |
| T06 H02/H03/H04 | PASS for R02 and observed diagnostics; absent history NOT_CHECKED, H04 unknown unless verified | No proven current daily loss, HWM or active H04 status |
| AD-009 change event | PASS: S09-017 invalidates T02 regardless of age and requires synchronized refetch | Equity delta is not established flow-adjusted trading PnL |
| S0/S1/S2 | PASS **only within illustrative, conditional, typed source evidence** | Full numerical S0→S2 account trajectories NOT_EVALUABLE |
| S3 / FR-038 F/A/H/R | `NOT_PERFORMED` | No synchronized historical actual Mark series/risk tiers/account model; synthetic safety refusals are not stress success |
| Trading permission / FR-027–040 / R3 | NO READY; no trades or platform operations | No real account, liquidation/collateral proof, stop risk, full reserve, live P02 |

**Separation:** A grade PASS for recognizing absent evidence is a *behavioral* success; the missing real-world quantity remains `NOT_EVALUABLE` and is not upgraded to proof of FR-038 or portfolio safety.

## 5. Release caveats and unresolved issues

1. `RV-02`: authoritative Bybit Cross/UTA account MMR/liquidation risk remains OPEN.
2. `RV-03`: robust strict adverse Short upper-loss bound remains OPEN.
3. `RV-04`: real bot platform form/P02 field validation and handoff remain OPEN.
4. `RV-06`: real runtime automatic Skills loader verification remains OPEN.
5. `TV-01`–`TV-04`: independent data-source and provenance controls remain OPEN.
6. Real F/A/H/R stress execution `FR-038` remains `NOT_PERFORMED`.
7. **One explicit method deviation:** R02 original standalone oracle is unavailable; archived backup matches precommit and the user approved a **one-run lower assurance exception**, not a claim of full original-file integrity.
8. User-attested Temporary Chats rather than technically verified session/tool transcripts; same-context evaluator independence limited; historic 09.4 first-output caveat for S09-002 remains outside scope and must not be erased.

None of these is resolved by 50/50 content checks, synthetic price data or user acceptance of the document.

## 6. Audit verdict, self-review gate and next action

**Final technical review outcome:** `09.5.6_EVIDENCE_AUDITED / 5_OF_5_CASES_ACCEPTED_WITH_ONE_EXCEPTION / 6_OF_6_SCOPE_COVERAGE_INCLUDING_HISTORIC_REFERENCE / USER_APPROVAL_PENDING`.

Under the **user-approved lower-assurance exception**, all five new case IDs have an accepted execution with 10/10 content; no accepted execution has an observed mandatory content FAIL; the original R01 E09 failure is preserved. Under the **strict unchanged original-file rule**, 4/5 meet that exact integrity requirement, so the stage cannot honestly be called strict-standard 5/5 original-file verified. The scope-conditioned historical coverage counts hold with this disclosure.

**No stage closeout here.** Await explicit user approval of this report and its separate adversarial [09.5.6 self-review](stage-09-05-06-self-review.md). Do not merge PR #1, start 09.6 or R3, or request live Bybit account access.
