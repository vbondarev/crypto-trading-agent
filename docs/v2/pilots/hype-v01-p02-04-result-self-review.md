# HYPE-V01 / P02-04 — self-review of user-attested Cross + Hedge result

**Reviewed:** 2026-11-12.  
**Status:** `SELF_REVIEW_COMPLETE / CONDITIONAL_MODE_ALIGNMENT_WITH_LIMITATIONS / P02_04_USER_APPROVAL_PENDING / NO_TRADE_READY`.  
**Scope:** one evidence-based input classification and safe handoff, not real exchange execution or a blinded independent agent assessment.

## 1. Exact object and boundaries

Result file: `docs/v2/pilots/hype-v01-p02-04-user-reported-cross-hedge-result.md`, created at commit `ffd7501962378608a8211335f56c8f57a83325a8`. GitHub connector readback at that exact commit produced Git Blob SHA `c73111145bfb0d33cfd172b2327e53912753c01a`; bytes matched the authored report.

Primary human evidence: the user wrote `Режим маржи: Cross` and `Режим позиции: Hedge` when asked for selected Bybit HYPEUSDT settings. No screenshot, subaccount linkage, capture time/timezone or authenticated private Bybit data was supplied. Previous Veles Cross + 1× + LONG SIMPLE was visual-only, with a **nonzero unknown real wallet**, displayed `0 USDT` in Veles and no saved-state proof. This reviewer is **the same assistant who authored the report**, so the assessment must not be misrepresented as a blind independent human or real Bybit/Veles platform test.

## 2. Verified structural/policy checks

| Check | Result | Limitation |
|---|---|---|
| User's exact two selected modes retained | `PASS` | Text user-attestation, not verified current exchange state |
| Prespecified C04 selection | `PASS` | `CONDITIONAL_MODE_ALIGNMENT`, not operational compatibility proof |
| Prespecified C12 limitation | `PASS` | Account risk remains `NOT_EVALUABLE / NO_TRADE_READY` |
| Eight gates B0–B7 separately evaluated | `PASS` | Several are inconclusive, not all PASS |
| Cross and Hedge source boundaries | `PASS` | Official docs support possible modes but don't authenticate account |
| Veles 1× vs actual Bybit leverage separated | `PASS` | Numeric upper bound only for visible draft value |
| Veles indicative 0 USDT vs Equity separated | `PASS` | No assertion user funds are zero or deposit needed |
| H04 and actual account/Mark/future grid not silently passed | `PASS` | No T02 or validated liquidation model |
| No execution, modified account, secrets, public raw screenshots | `PASS` | Only report authored |
| Future P02-05 and Stage 06 not auto-authorized | `PASS` | Explicit new approval required |

**10/10 targeted documentation and policy checks PASS.** These are local review assertions, **not** ten functional or integration tests. Exact body readback succeeded.

## 3. Adversarial issues and severities

| ID | Severity | Issue | Disposition |
|---|---|---|---|
| SR-P02-04-01 | **HIGH** | Cross/Hedge were supplied by user, not verified independently, and may refer to another account or contract | `USER_ATTESTED_ONLY`, require current scoped evidence for actual deployment |
| SR-P02-04-02 | **HIGH** | User supplied no timestamp/timezone and Veles fragments have no session provenance | `B1 INCONCLUSIVE`, never call mode evidence independently current |
| SR-P02-04-03 | **HIGH** | Bybit Cross/Hedge may fit Veles mode but actual margin/maintenance risk is account-wide; no T02/Mark/MMR | `RISK_NOT_EVALUABLE`, no R3 or `READY` |
| SR-P02-04-04 | **HIGH** | Same symbol/side bots or positions may share exchange exposure even under Hedge; OFF position-inclusion is a screenshot state | Ownership and no-existing-position checks remain open |
| SR-P02-04-05 | **MEDIUM** | Veles displayed 1× is not account leverage, instrument risk tier or evidence of saved configuration | Never claim financial risk or HYPE instrument limits satisfied |
| SR-P02-04-06 | **MEDIUM** | Veles displayed 0 USDT and warning; status may be stale, incomplete or account binding mismatch | No deposit advice or conclusion about actual Bybit balance |
| SR-P02-04-07 | **MEDIUM** | C04/C12 classify one case; other 10 scenarios only predeclared hypothetical expectations | No 12/12 success or independent live scenario count |
| SR-P02-04-08 | **MEDIUM** | Original synthetic HYPE-V01 `CUSTOM` mode differs from observed `SIMPLE` | No transfer of numerical or field-mapping results |
| SR-P02-04-09 | **LOW** | Self-review is authored by same model; independent live integration not tested | Label this explicitly; do not overstate assurance |

## 4. Acceptance boundary and stop

**Self-review verdict:** `P02_04_RESULT_DOCUMENTED / CONDITIONAL_MODE_ALIGNMENT / HIGH_ASSURANCE_GAPS / SELF_REVIEW_COMPLETE / USER_APPROVAL_PENDING`.

The user can accept the **conditional compatibility comparison** with the above limitations. Such acceptance must not imply confirmed account linkage, current collateral, full Veles field mapping, proof a Hedge LONG bot can be deployed, financial limits PASS, real trading, or permission to activate v2.

**Only next proposed step, not started:** `P02-05` data-gap and financial-input readiness plan (not live R3); require **separate authorization**. `feature/simplified-agent-v2` only; old agent, `AGENTS.md`, `main`, original HYPE records and Draft PR #1 unchanged; `STAGE_06_NOT_STARTED / V2_NOT_ACTIVE`.
