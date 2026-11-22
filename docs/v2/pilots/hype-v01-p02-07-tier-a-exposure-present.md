# HYPE-V01 / P02-07-E01 — Tier A existential evidence of Bybit subaccount exposure

**Recorded:** 2026-11-14 (chat date; exchange observation time and timezone NOT provided).
**Disposition:** `TIER_A_EXPOSURE_PRESENT_USER_ATTESTED / EXPOSURE_CATEGORIES_UNKNOWN / PORTFOLIO_COVERAGE_UNVERIFIED / P02_07_IN_PROGRESS / NO_TRADE_READY`.
**Scope:** nontrading follow-up authorized by prior P02-06 acceptance; this is an evidence-only report, **not** full T02 collection, real R3, financial analysis or P02-07 user approval.

## 1. Authority and literal user evidence

P02-06 accepted in `docs/v2/pilots/hype-v01-p02-06-acceptance.md`, accepted Git Blob `62ce72357abb0eeda1e119add63bd485a4aba07b`. Its §4 authorizes the **single Tier A question** about presence of any open futures positions, active/conditional orders or running/paused bots on the intended Bybit UTA subaccount.

The user was asked whether at least one of these three types existed. Their response was:

> «На этом субаккаунте Bybit есть открытые фьючерсные позиции, активные/условные заявки или боты.»

**Logic:** this answer is a categorical *existential OR*: `P ∨ O ∨ B = TRUE` **by user attestation**, where P = any open futures position, O = any active/conditional futures order, B = any running/paused bot. It **does not separately verify P, O or B**, nor require all three to be true. Mark each category `UNKNOWN`, with aggregate `AT_LEAST_ONE_CATEGORY_PRESENT_USER_REPORTED`.

This is not an authenticated Bybit API account snapshot, and it supplies no numeric exposure, exact symbols, side/positionIdx, ownership, bot grid, current timestamp, or confirmation that account/connection state is unchanged. The reply does not approve P02-07 as completed or authorize Tier B/C financial data collection.

## 2. Tier A classification

| Question element | Evidence | Interpretation |
|---|---|---|
| Intended account | User previously stated selected Veles binding is to a subaccount, with Bybit UTA Cross/Hedge | `ACCOUNT_TYPE_USER_ATTESTED / EXACT_IDENTITY_NOT_AUTHENTICATED` |
| At least one obligation category | This user reply | `YES_USER_ATTESTED` |
| Open positions (P) | Included as option in existential OR, not individually selected | `UNKNOWN` |
| Open/conditional/trigger orders (O) | Included as option in existential OR, not individually selected | `UNKNOWN` |
| Running/paused bots (B) | Included as option in existential OR, not individually selected | `UNKNOWN` |
| Account-wide full coverage and no material changes | No dated authenticated exchange snapshot | `NOT_VERIFIED` |
| Existing position adoption by proposed HYPE bot | Prior user intent OFF and visual Veles toggle OFF; live state unverified | `DO_NOT_ADOPT` for future proposal, no actual config proof |

**Exposure status:** `EXPOSURE_PRESENT_USER_ATTESTED / COMPOSITION_UNKNOWN / ALL_SIZES_UNKNOWN`.

No position count can be inferred; cannot infer an actual H04/risk breach, that HYPE is already open, that any specific bot runs, or that every possible category exists.

## 3. Consequences for the existing P02-06 risk protocol

- Future **complete T02** must inspect *all* collateral-sharing futures positions, active/conditional/trigger orders, paused/running bots and their **entire reachable future IN grid**, with explicit confirmed-empty sections for categories that are actually absent.
- **T03** is applicable **only if an open position is confirmed**; **T04** includes all bots and planned IN if present, as well as the proposed new Veles bot when designing it. Do not fabricate a T03 or an existing bot if user only confirmed the OR.
- For Hedge, each genuinely open LONG and SHORT position side counts separately; same underlying bot/exchange order should be reconciled to prevent double-counting. Existing Veles adoption OFF does **not** prove no exchange position.
- Tier A remains a **qualitative discovery** only. Numeric account IM ≤30% Equity, bot loss ≤5%, leverage ≤5×, liquidation adverse buffer ≥15% Mark, ≤3 positions, 100% future-IN reserves, H04/daily/HWM and F/A/H/R **NOT_EVALUABLE** with this data.
- Known H04 ACTIVE or a proven hard breach blocks new/add risk even if other data missing. No such violation was reported or established here. Real Cross liquidation model RV-02 remains OPEN.
- Before any *later separately approved* R3, AD-009 requires fresh whole-account T02 ≤5 min plus no material changes, Mark ≤2 min, and applicable current P02 and instrument specs; none are obtained here.
- No actual Bybit account connector call, private balance, position/order IDs, API keys, screenshots, operations, account-mode switching, Veles saved config or order execution. `READY` forbidden.

## 4. Next minimal clarification before financial inputs

Ask **one narrow question** listing all applicable types, using plain text (one or more):

> «Что именно сейчас есть на субаккаунте: **позиции**, **активные/условные ордера**, **боты**? Можно назвать несколько категорий. Если пока не знаете — так и напишите.»

Do **not** request amounts, instruments, positions, order IDs or screenshots yet, and do not infer a complete account from this category-only answer. After receipt make a separate source-tagged evidence record, re-evaluate needed T03/T04 scope, self-review and ask approval before initiating Tier B/C or actual R3.

**Repo isolation:** only `feature/simplified-agent-v2`; `main`, `AGENTS.md`, previous pilot reports, legacy agent and open Draft PR #1 unchanged. `P02_verified_at=null`, `field_map_version=null`, `STAGE_06_NOT_STARTED`, `V2_NOT_ACTIVE`.

**Result:** `P02_07_TIER_A_ANSWER_RECORDED / COMPOSITION_NEEDS_DATA / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING / NO_TRADE_READY`.
