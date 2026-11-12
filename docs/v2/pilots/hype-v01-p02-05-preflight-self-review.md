# HYPE-V01 / P02-05 — independent-of-account documentary self-review

**Reviewed:** 2026-11-12.  
**Decision:** `P02_05_DIAGNOSTIC_PREFLIGHT_PASS_WITH_LIMITATIONS / NO_PRIVATE_ACCOUNT_EVIDENCE / USER_ACCEPTANCE_PENDING`.

## 1. Artifacts checked and source provenance

- User approved acceptance of P02-04 with limits and transition to P02-05 by **«Согласую.»**, recorded in `docs/v2/pilots/hype-v01-p02-04-acceptance.md`, initial commit `d8a1d9daad2ec065699c1be47ada4cdb4b420eaa`, Git blob `9b6b8afd0c165b66b4c7df90bf830b99a060824d`.
- Reviewed P02-05 document `docs/v2/pilots/hype-v01-p02-05-connection-balance-diagnostic.md`, initial commit `44836781e5d2b92902f69e9fbb26b3d03aa32538`, refetched Git Blob `0e43c30d011d2b2790f2b8a41a5a785fa5eb1143`.
- Public source documents reviewed: official Veles indicative balance and connection guides; official Bybit UTA collateral, available balance and asset navigation; repository's prior P02 and R3 contracts. These are **published possibilities, not authenticated user-specific account reads**.
- Author and reviewer are the same assistant: **not an independent blinded evaluator, a Veles/Bybit integration test or a credentialed account audit**.

## 2. Local documented assertions

| Check | Outcome | Boundary |
|---|---|---|
| Separate exact user acceptance of prior step | `PASS` | Not taken as live trade approval |
| Six hypothesis rows D01–D06 present | `PASS` | Unconfirmed hypotheses, not six proven causes |
| Eight gates L0–L7 present | `PASS` | Unknowns not silently passed |
| Indicative Veles 0 vs Bybit wallet/UTA Equity | `PASS` | `0` not interpreted as verified zero equity |
| Main-account-only fast connection limitation | `PASS` | Does not prove user's existing connection was fast/main |
| No secrets/private raw evidence in public GitHub | `PASS` | Read-only nonsecret classification |
| No account transfer/relink/API permission change | `PASS` | Documentation only |
| Later financial R3 separately gated | `PASS` | T02/Mark freshness and full risk limits remain |
| Single next high-value question identified | `PASS` | Selected Veles connection: main vs intended subaccount |

**9/9 local content/policy assertions PASS.** They are text/checklist validations; **no live balance, position, H04, funding or Veles runtime test** has been performed.

## 3. Adversarial findings and limitations

| ID | Severity | Finding | Correct treatment |
|---|---|---|---|
| SR-P02-05-01 | HIGH | No direct observation of which Bybit account the Veles selected connection resolves to | `ACCOUNT_LINKAGE_UNVERIFIED`; cannot assert main/sub connection or recommend launch |
| SR-P02-05-02 | HIGH | Veles `0 USDT` plus warning is not equal to verified `Equity=0` or `AvailableMargin=0` | Distinguish quote free balance, UTA collateral, reserved orders and potential sync/permission issues; actual cause `UNKNOWN` |
| SR-P02-05-03 | HIGH | Future R3 account risk cannot be calculated without complete, synchronized T02/T03/T04 and current Mark/MMR | No `READY`, bot grid, account-level liquidation or allocation recommendation |
| SR-P02-05-04 | HIGH | API relinking and account-mode/leverage changes can affect live trading or credentials | Read-only checks only, no API keys or permissions, no transfer/deposit request |
| SR-P02-05-05 | MEDIUM | Veles quick-connect main-only could suggest a wrong account, but the user's actual connection method was never established | Keep D01 a hypothesis, not diagnosis |
| SR-P02-05-06 | MEDIUM | UTA may have non-USDT collateral or an available-balance metric that differs from Veles quote-currency display | Avoid false currency conversion or balance equality |
| SR-P02-05-07 | MEDIUM | No timestamp or authenticated source for prior screenshot S7 or user mode attestations | Do not treat as current R3 input; request time for later read-only evidence |
| SR-P02-05-08 | MEDIUM | Six explanations are not mutually exclusive; documenting multiple candidates is not identifying a root cause | Record evidence for each; require confirmed value to select a cause |
| SR-P02-05-09 | LOW | The check matrix is documentation only, no independent regression harness or API access | Do not claim 9 functional PASS or live connection validation |

## 4. Scope decision

`P02_05_PREFLIGHT_DOCUMENTED / SELF_REVIEW_COMPLETE / BALANCE_CAUSE_AND_ACCOUNT_LINKAGE_UNKNOWN / USER_ACCEPTANCE_PENDING`.

Appropriate user approval would accept the **diagnostic protocol and limitations**, not claim resolution of the 0 USDT discrepancy. A later **separately reviewed evidence result** may use a minimal user statement or a redacted read-only screen. Request first: **is the existing selected Veles `Bybit Futures` connection bound to the intended subaccount, the main account or currently unknown?** No API keys, account IDs, balances, wallet actions or bot launch are needed.

**Isolation:** `feature/simplified-agent-v2` only; `main`, old agent, original HYPE pilot files, `AGENTS.md` and Draft PR #1 unchanged. `V2_NOT_ACTIVE / STAGE_06_NOT_STARTED / NO_TRADE_READY`.
