# HYPE-V01 / P02-04 — user-reported Cross + Hedge compatibility assessment

**Report date:** 2026-11-12 (conversation date, not account observation time).  
**Decision:** `P02_04_CONDITIONAL_MODE_ALIGNMENT / USER_REPORTED_ONLY / RISK_NOT_EVALUABLE / USER_ACCEPTANCE_PENDING`.  
**Scope:** read-only documentary comparison with the preregistered P02-04 matrix, no account modification or live trade.

## 1. Exact evidence, source tier and what is unknown

In response to a request for *currently selected* Bybit settings relevant to HYPEUSDT, the user stated:

- `Режим маржи: Cross`
- `Режим позиции: Hedge`

This is `USER_REPORTED_CURRENT_SETTINGS`, **not** a Bybit API/account connector observation or independently authenticated screenshot. Capture date/time/timezone, proof these modes apply specifically to the connected HYPEUSDT contract, and evidence of the **same actual Bybit subaccount** as Veles were not provided. The chat message time is not the account's `observed_at` or `snapshot_at`.

Previously observed Veles screenshots, already accepted with limitations under P02-02 / P02-03:
- `Bybit Futures` connection label and `HYPE/USDT` pair, `LONG`, `Простой/SIMPLE` strategy;
- displayed `Тип маржи=Перекрестная/Cross` and `Плечо=1×` in S7 (different screenshot fragment);
- `Включать позицию на бирже в сделку` visually **OFF** in S6, consistent with user's explicit refusal to adopt a preexisting position, but **not proof of saved form state**;
- no selected grid preset, deposit input blank, indicative Veles balance `0 USDT` and insufficient-funds warning. **0 USDT is not verified actual Bybit Equity or a reason to tell the user to deposit.**

These fragments have no authenticated single-session provenance. Current actual Bybit leverage, full positions, collateral, account MMR and instrument specifications remain unknown.

## 2. Mode compatibility matrix based on input, not real execution

| Dimension | Observed Veles | User-reported Bybit | Result |
|---|---|---|---|
| Margin | UI Cross | Cross | `CONDITIONAL_MARGIN_MATCH`; no source-verified live account |
| Position mode | Veles LONG bot, SIMPLE; needs account-compatible Hedge mode | Hedge | `DOCUMENTED_MODE_COMPATIBILITY`, no live runtime verification |
| Leverage | UI 1× (below canonical maximum 5×) | Actual account leverage not supplied | `VISIBLE_VALUE_ONLY`; do not assume current Bybit leverage |
| Contract/account identity | UI HYPE/USDT, Bybit Futures | No specific subaccount/instrument IDs supplied | `USER_CONTEXT_MATCH_UNVERIFIED` |
| Risk/active exposure | No authenticated T02/T03/T04, Mark, IM/MMR, fees or stress | Not provided | `NOT_EVALUABLE` |

**Official sources verified at review:**
- Veles https://help.veles.finance/ru/exchange/general/position-mode/ states most futures bots use Hedge, but bots on the **same instrument and direction** can conflict, and Hedge alone does not prove an isolated trading position.
- Bybit https://www.bybit.com/en/help-center/article/Difference-Between-Position-Modes-One-Way-Mode-and-Hedge-Mode explains distinct One-Way/Hedge behaviors, and that Hedge+Cross margin calculations can be account-level.
- Bybit https://www.bybit.com/ru-RU/help-center/article/Differences-Between-the-Margin-Modes-Under-the-Unified-Trading-Account (updated 2026-08-04) documents account-wide UTA Cross vs Isolated vs Portfolio, and the Cross/Hedge combination.

Public documentation confirms that the combination is **allowed in principle**, not that this particular user's configuration is safe or that Veles actually accepted it.

## 3. Prespecified case selection

From `docs/v2/pilots/hype-v01-p02-04-bybit-mode-compatibility-plan.md`:
- **C04**: User-reported `Cross + Hedge`, Veles `Cross 1× SIMPLE` ⇒ **`CONDITIONAL_MODE_ALIGNMENT`**.
- **C12**: The same mode combination but no complete T02/Mark ⇒ `MODE_ONLY_PASS / NO_TRADE_READY` with account risk `NOT_EVALUABLE`.

The 12-case matrix was *predeclared as synthetic expectations*; this report **classifies user-supplied inputs** against two cases. It does **not** claim 12 live tests, runtime bot execution, that H04 is clear, a verified account connection, a complete P02, or any actionable entry/exit/grid.

## 4. B0–B7 gates

| Gate | Verdict | Reason |
|---|---|---|
| B0 selected values | `PASS_USER_REPORTED` | User explicitly states current Cross and Hedge |
| B1 date, provenance, same account | `INCONCLUSIVE` | No capture timestamp/timezone or verified Veles→Bybit subaccount association |
| B2 UTA mode vs Veles dropdown | `CONDITIONAL_MATCH` | Text Cross and UI Cross agree in concept only |
| B3 Hedge with LONG SIMPLE | `DOCUMENTED_COMPATIBLE_WITH_LIMITS` | No live HYPEUSDT mode or absence of other same-side bots proven |
| B4 leverage and H04 | `VISIBLE_1X_WITHIN_CAP / H04_NOT_CHECKED` | Bybit leverage, hard-veto status and exposure unknown |
| B5 financial/account risk | `NOT_EVALUABLE` | No T02/Equity/Mark/MMR/future grid and stress F/A/H/R |
| B6 source and actions | `PASS_NO_ACTION` | No secrets, API access, changes, orders or screenshots published |
| B7 results handoff | `REPORT_PREPARED / USER_ACCEPTANCE_PENDING` | Separate self-review and separate approval needed |

**Result:** `P02_04_CONDITIONAL_MODE_ALIGNMENT / USER_ATTESTED_ONLY / RISK_NOT_EVALUABLE / NO_TRADE_READY`.

## 5. Decision boundaries and potential next controlled step

- `P02_verified_at=null` and `field_map_version=null` remain correct for *complete authenticated form/account readiness*. No full `BotConfigurationProposal` or `VERIFIED_FOR_MANUAL_REVIEW` is generated.
- Still missing: actual subaccount linkage, source timestamps, current portfolio and H04, actual Bybit leverage, real instrument specs, Veles displayed 0 USDT discrepancy, full IN plan and projected margin/short-loss bounds.
- Never change Veles leverage, Bybit account margin/position mode, exchange settings or existing bots merely for this check. `READY` and automated trading are out of scope.
- **Proposed but NOT STARTED:** `P02-05` as a separate limited *data-gap readiness plan* (not a live risk evaluation): identify the reason for Veles indicative balance warning, define a private non-secret account-linkage check, distinguish actual budget from equity and detail what evidence a future independently authorized R3 risk review requires. No new deposit required or recommended.
- All writes only to `feature/simplified-agent-v2`; original files, `main`, old agent, original Skills, Draft PR #1 untouched; `STAGE_06_NOT_STARTED / V2_NOT_ACTIVE`.
