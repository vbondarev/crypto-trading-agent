# HYPE-V01 / P02-05 — read-only Bybit subaccount binding and Veles 0-USDT evidence diagnostic

**Prepared:** 2026-11-12.  
**Authorization:** `docs/v2/pilots/hype-v01-p02-04-acceptance.md` (user «Согласую.»).  
**State:** `P02_05_EVIDENCE_PLAN_IMPLEMENTED / PRIVATE_ACCOUNT_NOT_ACCESSED / BALANCE_CAUSE_UNKNOWN / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING`.  
**Branch:** `feature/simplified-agent-v2`. This is **not** final account risk analysis, a proposed deposit, a trade, an active-bot edit, or Stage 06.

## 1. Scope and previously established facts

Accepted partial P02-02..P02-04 evidence:
- Veles DCA editor shows connection label `Bybit Futures`, `HYPE/USDT`, `LONG`, order mode `Простой/SIMPLE`; previous hypothetical HYPE-V01 `CUSTOM` is a separate synthetic test.
- Veles editor displays `Плечо=1×`, `Тип маржи=Перекрестная`, a **blank bot deposit**, and indicative `БАЛАНС НА БИРЖЕ: 0 USDT` with an insufficient-funds banner.
- User stated actual Bybit margin mode `Cross`, position mode `Hedge`, classified `USER_REPORTED_CURRENT_SETTINGS`. No authenticated account or exact timestamp.
- The user does **not** intend to adopt an existing exchange position; Veles `ВКЛЮЧАТЬ ПОЗИЦИЮ НА БИРЖЕ В СДЕЛКУ` was later visually OFF in an unsaved editor screenshot, not proof of persistent bot state.

**Critical interpretation:** Veles `0 USDT` is a **read-only UI indicator**, not necessarily the Bybit wallet balance, UTA Equity, USD margin balance or whole-account available margin. A banner about insufficient funds is a Veles-side observation; no evidence determines its exact cause. Do not suggest deposits or infer that the user is insolvent, has zero funds, or needs a margin-mode change.

## 2. Primary documented sources and provenance limits

| Reference | Public documented fact | What remains unverified |
|---|---|---|
| https://help.veles.finance/ru/platform/settings/full/ | Veles `Баланс на бирже (индикатив)` is noneditable and may show only **unused/available part** of quote currency | Actual included accounts, wallet amount, user-specific calculation and refresh behavior |
| https://help.veles.finance/ru/exchange/bybit/connect/ | Veles `быстрое подключение` is **main-account only**; manual connection option is documented | Whether user used quick/manual connection or linked intended subaccount; never demand an API secret |
| https://help.veles.finance/ru/exchange/bybit/prepare/ | Veles documentation describes Bybit account/funding preparation | It does **not** prove that this user's UTA lacks collateral or needs a transfer |
| https://www.bybit.com/ru-RU/help-center/article/FAQ-Unified-Trading-Account | Bybit UTA uses eligible collateral, margin balance and separate available balance; USDT holdings are **not** equal to all possible USD collateral | Actual user account Equity, eligible collateral, available balance, orders, loans or MMR |
| https://www.bybit.com/ru-RU/help-center/article/Unified-Trading-Account-Asset-Page | UTA assets page separates Total Equity, wallet balance, collateral, and available balance on trading page | Actual live balances, asset restrictions or current subaccount |
| `docs/input-templates.md`, `docs/data-freshness.md` | Whole-account T02 required only for later R3; Mark ≤2min and T02 ≤5min + no-change confirmation for final approval | Such live private snapshots are **not requested in this diagnostic** |
| `docs/platforms/veles.md`, `docs/v2/bot-handoff-policy.md` | Future total grid reserve, bot loss, leverage, position conflicts and hard-veto precedence | No real grid or full account risk screen yet |

**Note on sources:** public official help was read on 2026-11-12; contents describe platform possibilities, not an authenticated user account or service outage. We neither logged into Veles nor Bybit nor inspected private API connector results.

## 3. Differential diagnostic: hypotheses are NOT findings

| Code | Hypothesis to distinguish | Safe nonsecret observation | What would support it | Present classification |
|---|---|---|---|---|
| D01 | Veles is linked to **main account instead of intended subaccount** | In Veles **existing connection details**, is it labeled main/subaccount and which connection was selected? User can report without UID/key | Clear read-only account-kind label contradicts intended subaccount; the fast-connection limitation makes this worth checking but does **not** prove it | `UNKNOWN` |
| D02 | Funds are in **Funding account or another account**, not in target UTA | Bybit account type/source, preferably only whether **target subaccount's UTA** has available collateral; no figures required now | User confirms positive elsewhere but none in target UTA | `UNKNOWN` |
| D03 | Veles quotes **free USDT** while Bybit shows value in other collateral currencies / USD Margin Balance | Compare metric labels `free USDT` vs `margin balance USD` (qualitative only) | Equity/collateral exists while quote-currency free USDT shows zero; arithmetic requires verified units and details later | `UNKNOWN` |
| D04 | All available margin is reserved by positions, orders or other bots | Read-only yes/no whether there are active/open/pending obligations in **the intended trading subaccount** | User confirms obligations and exchange available margin low/zero | `UNKNOWN` |
| D05 | Veles binding data is stale, has wrong scope/permissions, or is not synchronized | Read-only connection health/status / last synchronization / displayed warnings, if present; no refresh or re-auth required | Explicit Veles/API status warning, not merely `0` | `UNKNOWN` |
| D06 | The target UTA is genuinely unfunded or unavailable for this market | Read-only account/source labeling and non-sensitive yes/no `available collateral >0?` | User directly confirms no eligible collateral in target UTA with suitable timestamp; Veles indicator alone insufficient | `UNKNOWN` |

**No ranking into an actual diagnosis** is possible yet. D01 is a particularly relevant check given the documented main-only fast connection and the intended subaccount; it is **not** an assertion of misconnection.

## 4. P02-05 minimum read-only workflow (do not demand full financial data)

**Step A — establish connection identity, highest information value:**
- In Veles, view the *already selected* `Bybit Futures` connection's existing type, if shown. Ask: **is it connected to the same intended Bybit subaccount or to the main account?** A brief text response `Субаккаунт / Основной / Не могу проверить` is enough. Avoid connection IDs, names, UID, keys, email, account URLs with tokens. Do not create/relink/revoke an API key.

**Step B — separate UI concepts, only after Step A or if it is unknowable:**
- In Bybit switch **no account settings**; in the already selected target account, read-only determine whether it is UTA, whether `available collateral >0` (yes/no/unknown), and whether wallet value is mostly in USD/other margin currencies rather than free USDT (yes/no/unknown). Do not demand balances; do not infer that margin availability is the same as wallet value.
- Read-only report whether account has any active positions/orders/other bots (yes/no/unknown, without IDs or sizes); details only if a later separately approved financial-risk step requires them.
- If Veles shows a connection-warning or stale status, report only text/status and approximate time; **do not** rotate permissions, press recalculate/test or relink live accounts for this evidence step.

**Step C — time and independent criteria:**
- For every visible statement record user-observed date, local time, timezone and which existing account/connection it applies to. The assistant cannot independently prove source timestamp from text; record `USER_ATTESTED` and `UNKNOWN` where absent.
- Distinguish `confirmed` (user-supplied screenshots/text), `inferred` (hypothesis only), `not checked` and `incompatible`. The UI label `Bybit Futures` is **not** enough to prove subaccount ownership.
- If connection identity remains unknowable without an account-setting change, mark `ACCOUNT_LINKAGE_UNVERIFIED`, do not block documentary completion with a hazardous workaround.

## 5. Decision rubric and negative controls

| Gate | Required conservative behavior | Current state |
|---|---|---|
| L0 intended target | Identify user intent **subaccount** vs main | `USER_INTENT_SUBACCOUNT` |
| L1 actual binding | No authenticated current account/subaccount mapping yet | `NEEDS_DATA` |
| L2 Veles 0 USDT | Preserve `INDICATIVE_ONLY`; no actual Equity=0 inference | `PASS_FOR_INTERPRETATION` |
| L3 UTA & collateral | No wallet/available/margin evidence in the target account | `NEEDS_DATA` |
| L4 exposure | All positions/orders/bots currently unknown | `NOT_CHECKED` |
| L5 freshness | Screenshots not time-anchored; old image upload ≠ fresh observation | `UNVERIFIED` |
| L6 privacy/action safety | No raw images or account figures in public GitHub; no credential, API, transfer or bot operations | `PASS_NO_ACTION` |
| L7 separation from risk | Actual R3 always separately approved; H04 hard veto precedes data gaps | `NO_RISK_PASS` |

**Negative tests (design checks, not live executions):**
- If Veles `0 USDT` and Bybit UTA non-USDT eligible collateral is reported, do **not** conclude wallet empty or account unsafe purely from that difference; report `METRIC_SCOPE_CONFLICT/NEEDS_DATA`.
- If Veles main connection vs intended subaccount: `ACCOUNT_LINKAGE_MISMATCH` → no configuration or launch; do **not** auto-connect a different account.
- If user reports no available collateral in actual subaccount, note this as `USER_ATTESTED_NO_AVAILABLE_MARGIN`, still not an independently authenticated risk figure and no deposit recommendation.
- If API/permission status `UNKNOWN`, do not invent a Veles error code or advise widening key privileges.
- If account state changes, AD-009 requires fresh dependent data before any later final risk review.

## 6. Future separately approved R3 data readiness, not collected now

When/if a future R3 review is approved, obtain securely **in the conversation, not public GitHub**: full T02 account coverage at a common snapshot (Equity and currency valuation, IM/MM, actual cross collateral, open & conditional positions/orders/bots, all planned IN including external strategies), T03 per relevant position and T04 complete bot configuration; target instrument rules (tick/qty/min notional/risk tiers), Bybit Mark, fees/funding, HWM/day/H04, and F/A/H/R stress.

Risk constraints remain: leverage ≤5×, account planned IM ≤30% Equity, worst bot loss ≤5%, no more than 3 positions, full future-grid reserve, liquidation safety margin ≥15% from Mark, daily loss limit 3%, drawdown HWM 15%. **None** can be declared passed in P02-05. Before a hypothetical R3 final assessment the repo requires `Mark ≤2min`, `full T02 ≤5min + no material change`, and event-triggered stricter updates.

No numerical strategy/grid, actual liquidation estimate, bot save, account transfer, funding recommendation or auto-launch. `P02_verified_at=null`, `field_map_version=null`, `STAGE_06_NOT_STARTED`, `V2_NOT_ACTIVE`.

## 7. Current result and handoff

- Source review and diagnostic tree **IMPLEMENTED**, with six mutually nonexclusive **possible explanations** and 8 L0–L7 source/action gates.
- Private Veles connection/account and Bybit wallet **NOT_ACCESSED**; no actual differential diagnosis can yet be confirmed.
- P02-05 **preparatory** self-review to be recorded separately.
- Actual next evidence event: user's **single answer** about whether the *selected Veles Bybit Futures connection* belongs to **the intended Bybit subaccount or the main account**; optional read-only evidence only if readily available.
- **Await separate acceptance of the completed P02-05 preflight after self-review**; do not conflate with final account-risk evaluation.

**Current disposition:** `P02_05_DIAGNOSTIC_PROTOCOL_PREPARED / USER_ACCOUNT_LINKAGE_UNVERIFIED / USER_ACCEPTANCE_PENDING / NO_TRADE_READY`.
