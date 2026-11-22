# HYPE-V01 / P02-05-E01 — user attests that Veles Bybit Futures connection is to a subaccount

**Recorded:** 2026-11-14 (conversation calendar date; original connection status observation time not supplied).  
**Result:** `SUBACCOUNT_LINKAGE_USER_ATTESTED / EXACT_ACCOUNT_IDENTITY_NOT_VERIFIED / ZERO_USDT_CAUSE_UNKNOWN / P02_05_IN_PROGRESS / USER_ACCEPTANCE_PENDING`.  
**Scope:** new user-supplied nonsecret clarification within the already authorized P02-05 diagnosis. No live connection/account/API verification.

## 1. Literal evidence and source classification

Previously the assistant specifically asked:
> «Выбранное в Veles подключение “Bybit Futures” относится к вашему субаккаунту Bybit или к основному аккаунту?»

User answered:
> «Субаккаунт»

Interpret narrowly as: the user identifies the **selected Veles Bybit Futures binding** as connected to **a Bybit subaccount**, rather than the main account. This is `USER_ATTESTED_SUBACCOUNT`, **not** `INDEPENDENTLY_VERIFIED_BINDING`. The message does not include any account identifiers or prove the same exact target subaccount at both services, read-only connection health, API scopes, login session, account balances, or the time this connection was actually checked.

**Data handling:** only the account **type** and source tier are recorded in this public repository. No UID, API key, login, account or subaccount names/IDs, private balances, positions, screenshot binaries or connector credentials are stored.

## 2. Update the six diagnostic hypotheses from the approved P02-05 protocol

Original checklist: `docs/v2/pilots/hype-v01-p02-05-connection-balance-diagnostic.md`. These are non-exclusive candidate explanations for Veles showing an *indicative* `0 USDT`, not confirmed causes.

| Code | Hypothesis | Status after user's answer | Justification |
|---|---|---|---|
| D01 | Connected to **main** rather than intended **subaccount** | `LESS_LIKELY_BY_USER_REPORT / NOT_INDEPENDENTLY_EXCLUDED` | User states selected Veles binding is subaccount; exact identity still not authenticated |
| D02 | Funds are in another account/Bybit Funding account rather than target UTA | `UNKNOWN` | No UTA vs Funding availability evidence |
| D03 | Free quote USDT differs from eligible UTA collateral / margin balance | `UNKNOWN` | No current Bybit metric or currency evidence |
| D04 | Margin availability is reserved by positions, orders or other bots | `UNKNOWN` | No open/pending exposure evidence |
| D05 | Stale synchronization, permissions or connection issue | `UNKNOWN` | No explicit connection-health warning or status |
| D06 | Actual target subaccount UTA has no usable trading collateral | `UNKNOWN` | Veles indicative 0 alone is not a current Bybit available-balance measurement |

**Do not conclude D01 is fully closed**: claiming 'subaccount' as a category does not cryptographically match two accounts or prove the connected exchange identity. Equally, do not imply that the answer is evidence of positive collateral or financial availability.

## 3. L0–L7 gates after new user evidence

| Gate | Updated result | Boundary |
|---|---|---|
| L0 intended target | `USER_INTENT_SUBACCOUNT` | Previously established project target |
| L1 actual binding | `USER_ATTESTED_SUBACCOUNT_TYPE / EXACT_LINKAGE_UNVERIFIED` | No authenticated identity match |
| L2 Veles 0 USDT | `INDICATIVE_ONLY` | No conclusion actual Bybit balance/Equity is zero |
| L3 UTA collateral | `NEEDS_DATA` | No available-collateral status |
| L4 current exposure | `NOT_CHECKED` | No account-level positions/orders/bots |
| L5 timestamps | `UNVERIFIED` | The chat date does not establish connection status or screenshot capture time |
| L6 privacy/actions | `PASS_NO_ACTION` | No secrets, API calls, changes or deposits |
| L7 risk release | `NO_RISK_PASS` | No fresh full T02, Mark, IM/MMR, stress or executable bot configuration |

## 4. Next minimum non-trading question (one datum)

Ask: **On the same Bybit subaccount, within the Unified Trading Account (UTA), is the *available collateral / available margin for derivative trading* greater than zero?** Accept a qualitative answer `Да / Нет / Не знаю`; ask **no amounts** and no API keys/screenshots unless the user prefers. Clarify that total Equity, Funding wallet balance and an unrelated main account are **not** substitutes for available margin **in this trading subaccount**.

- If **YES**: report `USER_ATTESTED_AVAILABLE_COLLATERAL_POSITIVE` and investigate *metric/scope/connection-sync mismatch*, without guessing cause.
- If **NO**: report `USER_ATTESTED_NO_AVAILABLE_COLLATERAL`; distinguish no free margin from absence of Equity; do not advise depositing.
- If **UNKNOWN**: mark `NEEDS_DATA` and provide read-only orientation only, no account-setting changes.

A specific hypothesis diagnosis requires additional bounded evidence and new result review. This is **not** an R3 financial risk check. Actual final R3 would require fresh complete T02 and Mark by `docs/data-freshness.md` and all risk constraints; no action now.

## 5. Status and isolation

`P02-05-E01 ACCOUNT_TYPE_USER_ATTESTED / DIAGNOSTIC_NOT_RESOLVED / SELF_REVIEW_PENDING / P02_05_USER_ACCEPTANCE_PENDING / NO_TRADE_READY`.

No bot Save/Create/Update/Test/Run, account switch, API credential request, capital transfer, simulated market price or completed readiness claim. `P02_verified_at=null`, `field_map_version=null`, `STAGE_06_NOT_STARTED`, `V2_NOT_ACTIVE`. Only `feature/simplified-agent-v2` may change. All previously accepted pilots, `main`, legacy agent and Draft PR #1 remain untouched.
