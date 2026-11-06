---
name: risk-assessment
description: Evaluate whole-portfolio Bybit USDT perpetual risk, mandatory FR-027–FR-040 limits, current and future margin, averaging reserves, liquidation distance, bot worst-loss bounds, Moscow-day blocks and four F/A/H/R stress families. Use for position changes, bot strategies and R3 safety gates; never mistake synthetic passes for real trading READY.
---

# Risk Assessment — Crypto Trading Agent

## When to use

- The user asks whether a new/averaged Short or Long, bot, margin allocation or recovery proposal is **within the adopted limits**; compare current S0 and projected S1/S2/S3 exposure.
- `R3` approval of one selected Veles/GinArea configuration, an existing risky position, H04 lock, portfolio stress or conditional `REDUCE / WAIT` recommendation is required.
- `R2` asks for a **clearly provisional** risk assessment; label unverifiable models and missing inputs, never return a final approval from partial prices or synthetic examples.

## When *not* to use

- Pure R1 market overview or education without account-level risk; never demand private T02/P02 for a simple definition.
- Do **not** execute, cancel, monitor or schedule orders; do not fetch user account secretly, request API credentials, promise stop fills or build autonomous bot code.
- This Skill is an **evidence-driven decision procedure, not a live Bybit risk engine**. Passing a local arithmetic check, four fabricated price paths, or this SKILL.md cannot grant real `READY`.

## Normative sources — read actual branch/commit contents as needed

- [Global operating boundaries](../../../AGENTS.md)
- [Risk requirements FR-027–FR-040, FR-050 and FR-052](../../../docs/requirements.md)
- [Adopted stage-05 risk model, S0–S3, Cross, Short and four stress families](../../../docs/risk-management.md)
- [Stage-05 validation and unresolved RV-02/RV-03](../../../docs/risk-validation.md)
- [Data age and invalidation AD-009 / R1/R2/R3](../../../docs/data-freshness.md)
- [Minimal input templates T01–T06](../../../docs/input-templates.md)
- [Data quality, source conflicts and TV-01–TV-04](../../../docs/data-validation.md)
- [Full account, orders and bot reservations in stage 06](../../../docs/platforms/platform-synthetic-tests.md)
- [Stage-06 final gaps, P01/P02 and platform boundaries](../../../docs/stage-06-review.md)
- [Stage-07 selection/priority contract](../../../docs/stage-07-skills-contract.md)
- [Cross-cutting status policy](../../../docs/agent-operating-rules.md)
- [Data Verification Skill — if actually available](../data-verification/SKILL.md)
- [Portfolio Analysis Skill — if actually available](../portfolio-analysis/SKILL.md)

These links point to approved *documents*; do not claim they automatically loaded the sibling Skill. Bybit's official [Wallet Balance](https://bybit-exchange.github.io/docs/v5/account/wallet-balance), [Position Info](https://bybit-exchange.github.io/docs/v5/position) and [Get Instruments](https://bybit-exchange.github.io/docs/v5/market/instrument) are reference documentation, **not proof of user's actual Cross, risk tier, collateral, orders or fills**.

## 1. Gate inputs and evidence, not wishful calculation

Determine `purpose` (new risk, ADD, recovery, REDUCE, R2 provisional, R3 final), Bybit `category=linear`, confirmed **USDT-settled perpetual**, account/subaccounts, One-Way/Hedge `positionIdx`, Cross/Isolated/UTA or Portfolio Margin and selected Veles/GinArea **only if user chose one**. Obtain `E0 = actual current full-scope Equity` with a **declared valuation currency**, T02/T03/T04 covering **all** active/conditional/manual/bot orders, reachable virtual IN, actual fees/funding and real Mark with source/timestamp.

- The evidence chain is `data-verification → portfolio-analysis → risk-assessment → (user-selected platform configuration later)`. If a sibling Skill is absent, use approved source docs and **say no runtime execution of that Skill was confirmed**.
- **R3:** a full T02 no older than **5 minutes**, actual Bybit Mark no older than **2 minutes**, synchronized observations, no account/bot/order/fill changes after snapshots, and current actual P02 for selected platform. Strong volatility/news/events require stricter refresh via AD-009. An API 403 or stale screenshot does not supply missing equity/Mark.
- **Do not infer** unavailable Cross IM/MM, account MMR, FX/haircuts, fee tier, precision, maintenance tier or maximum Short loss from `position notional / leverage`, bot Profit, Last/Spot price or an estimated `liqPrice`.
- **USD and USDT are not interchangeable**. Normalize risk money only with verified source, rates, scope and conversion time. `E0>0` is required for percent-based tests. Unknown value → `NEEDS_DATA`; conflicting units/method → `UNVERIFIED` rather than artificial zero.
- For educational R1 and preliminary R2, narrow inputs to the decision. Never demand a private T02 for a generic market question.

## 2. State reconstruction and anti-double-counting

Maintain `S0=CURRENT_PORTFOLIO`, `S1=PENDING_ORDERS`, `S2=FILLED_LEVELS` for every **reachable** ordering of IN/OUT/SL/TP, and `S3=STRESSED_PORTFOLIO`.

1. Start from **account-scoped S0**: actual account Equity **already includes** present UPL, current Bybit margin/IM, MM, current positions/owners and reservations for existing orders where actually included.
2. At S1 include unfilled `leavesQty` for verified exchange active/conditional orders **once per verified orderId+account+slot**, plus all reachable virtual bot IN; `FILLED` IN and executed `cumExecQty` are **not future IN**. A cancelled order ceases to be future obligation only when the **exchange confirms** cancellation; partially executed exposure remains in S0.
3. S2 projects remaining fills in **coherent sequences** with order-IM release, new position-IM, fees, funding, margin tier and possible account collateral changes. Do **not** simply add every order's original IM to already occupied S0 IM. If allocation or fill synchronization is unknown, numerical outcome is `UNVERIFIED`.
4. FR-033 counts distinct active and **reachable future** exchange position slots; One-Way one slot and Hedge `positionIdx=1` Buy / `2` Sell separately. New-symbol virtual IN may create a 4th slot. Reduce-only OUT does not open a slot; ambiguous order purpose is a potential IN or `UNVERIFIED`.
5. Correlation/concentration and stress consider **all** same-account bots/manual positions, both Long and Short and shared collateral. Hedged virtual bots on one One-Way slot are **not** independent insulated positions.

## 3. Mandatory per-rule gates FR-027–FR-040

| Rule | Mandatory test / safe decision |
|---|---|
| **FR-027** | Apply **user's strict limits** and any stricter adopted ones. Never increase a cap to make a bot pass. |
| **FR-028** | Base current/forecast on whole-portfolio `E0`; **H02** historical adjusted high-watermark drawdown 15% is conditional on authentic history. Missing H02 → `NOT_CHECKED`, not fake pass/fail. Known drawdown breach **≥15%** vetoes new risk until approved unlock. |
| **FR-029** | For each reachable S0/S1/S2, with **verified margin model**, `planned_margin_load = max(IM_s) / E0`; cap **≤30% current Equity** including bots and full grids, no double counting. State worst branch and compare separately `IM_s / E_s` for stress; do not silently substitute stressed Equity into contractual E0 denominator. |
| **FR-030** | Bound **total worst net loss for each bot ≤5% E0**, across all reachable fills, stop execution slippage/gaps, fees/funding, cross-collateral effects and already realized bot-series costs when applicable. Report **`L_from_now` vs `L_lifecycle`** distinctly, don't double-charge historical losses already in current E0. An ordinary stop at price X **does not bound execution at X**; unbounded Short loss without proven upper exit bound → `UNVERIFIED` (RV-03), not pass. |
| **FR-031** | Recommended **leverage ≤5×**, for every relevant proposed/modified bot/position; Portfolio Margin without comparable leverage is `UNVERIFIED` if verification required, never “zero leverage.” |
| **FR-032** | Distance from **actual current Mark** to reliable liquidation threshold in adverse direction **≥15%**: Long `(Mark−LP)/Mark`, Short `(LP−Mark)/Mark`. At equality only this numeric test may pass. Account-wide Cross liquidation **cannot** be proved by one position `liqPrice`, and other positions' shocks can cause earlier liquidation. RV-02 remains open. |
| **FR-033** | At most **3 concurrent potential exchange position slots** after reachable pending/virtual IN; Hedge opposing nonzero slots separate. A demonstrated 4th potential opening → `REJECTED` for adding risk. |
| **FR-034** | Full **100% future averaging IM** plus positive cost/funding/slippage buffers covered by demonstrably available reserve in compatible currency **for every reachable branch**. Cross “reserve” is an **account planning designation, not segregated collateral**; IM order reservations already inside baseline must not be added twice. |
| **FR-035** | Daily loss **≤3%** of adjusted Moscow-day baseline starting `00:00 Europe/Moscow`, accounting for realized/unrealized PnL **without double counting**, external flows and verified Equity chronology. Historical H03 missing → `NOT_CHECKED` conditional check, not automatic block. Verified **≥3% loss** triggers block. |
| **FR-036** | **Known active H04 / H02 ≥15% / H03 ≥3%** bars **new risk**. Daily block persists until next Moscow 00:00 **and verified normalization**; drawdown requires explicit additional user confirmation and demonstrated normalization. **Do not clear a block on a new chat, deposit, or missing history**. Risk reduction is separately discussable. |
| **FR-037** | Evaluate concentration, common collateral and multi-asset co-loss with matched timestamp/source/currency; numeric correlation needs **≥30 synchronized closed returns** and nonzero variance under the accepted methodology. An absent or constant series → `NOT_CHECKED` for numeric correlation, not invented zero; a qualitative concentration map still required. |
| **FR-038** | **Four distinct stress families mandatory for R3:** F (**fixed shocks**), A (**adaptive volatility/liquidity and correlated jumps**), H (**actual dated historical Mark-market episodes**), R (**reverse stress to constraint breach**). Simulate S0–S3, all orders, execution sequencing, costs, changing Equity/IM/MM and collateral. No real Mark history → H **NOT PERFORMED**, thus **not READY**. Four arbitrary synthetic price paths do **not** count. |
| **FR-039** | If over limits: `WAIT / REDUCE / CLOSE / DISABLE NEW IN` as **manually considered** safer alternatives, including exchange confirmation of existing orders; do not place orders or claim live monitoring. |
| **FR-040** | Final R3 is **not `READY`** until all *mandatory current and projected* risk proofs + real platform P02 and freshness pass. Absence of **only H02/H03** may stay `NOT_CHECKED` and is **not by itself** a veto; unknown Cross, max Short loss, T02, stress history or P02 **is** a blocker as applicable. |

**Exact thresholds:** `>30% IM`, `>5% bot loss`, `>5×`, `<15% adverse distance`, `>3 slots`, `available reserve < required` violate their respective numeric inequalities. **Historically detected drawdown ≥15% and daily loss ≥3%** activate FR-036 blocks **at equality**, per the adopted H02/H03 policy. All calculated numbers require **trusted inputs and method** before classification as a proven violation.

## 4. Cross/Isolated and Short loss — no manufactured assurances

- For **Isolated**, use approved [§6–§7](../../../docs/risk-management.md) with verified tier, exact quantities, fees, Mark, maintenance, margin addition and exchange contract. Stop trigger price **does not guarantee exit price**; liquidation threshold can change.
- For **Cross/UTA**, the **whole account** contributes margin/collateral/liabilities. Require explicit account context, actual MMR/IMR, shared losses, tier rules and coherent adverse paths. A displayed `liqPrice` is only estimated. Without verified full account and scenario-specific account MMR, **FR-032 and FR-030 remain `UNVERIFIED`**; RV-02 cannot be waived by documentation.
- A Short position has **no simple finite gross upward price bound**. Claiming a hard bot-loss bound needs credible and verifiable bounds on full Buy-to-cover execution, gap/slippage, remaining IN, fees/funding and Cross interaction. **RV-03 OPEN** unless evidence closes it; synthetic adverse prices only provide *scenario losses*, not a guaranteed maximum.
- `L_bot` is not initial order margin, not displayed bot "Profit" and not a generic stop distance. Verify `bot_alias`, execution/allocation, current and complete future grid, fees, funding, exit types, own vs other bots, and net conversion.
- Do **not** use positive correlation as guaranteed hedge or assume independent losses. A model can pass current IM 30% against `E0` while stressed `IM_s/E_s` becomes unsafe; report both rather than falsely applying one threshold to the other.

## 5. Stress-test evidence protocol F/A/H/R

For every family record `family; source; market/Mark chronology; time interval; scenario assumptions; positions and reachable IN/OUT branches; costs; E0/E_s; IM0/IM_s; MM_s or MMR_s; worst bot loss; adverse Mark liquidation distance; violations; confidence; checked/NOT_PERFORMED`.

- **F:** explicitly stated simultaneous single- and multi-asset **fixed shocks** in adverse directions, with fills/order interleaving and fees. Synthetic F is an arithmetic demonstration only.
- **A:** **volatility-adjusted** sizes using aligned observed realized σ and liquidity/gap evidence, with correlation/co-loss direction where warranted; unknown σ/liquidity → `UNVERIFIED`.
- **H:** replay **verified real historical Bybit Mark price episodes**, synchronized by instrument/account and respecting intrabar ordering uncertainty, exchange limits and fills. Fictional bars labelled “2026-01-01” are **not** historical evidence.
- **R:** calculate **how far the scenario moves before first mandatory risk limit fails** or account liquidation constraint occurs (reverse stress). If model/threshold unknown, present incomplete reverse stress, not a precise trigger.
- Distinguish *test family performed* from *pass*, from *performed on real Mark*, and from *fully verified scenario engine*. A passing F/A/R subset with H missing still cannot establish FR-038 R3 pass. Never infer actual liquidation from synthetic static MM ratio.

## 6. Review H02/H03/H04 without fictitious history

- **H02 15% HWM drawdown:** use historical full-account Equity snapshots plus correctly classified external flows/currency effects to maintain **adjusted** HWM. `drawdown=(adj_HWM−adj_Equity)/adj_HWM`, not naïve PnL of one bot. Verified reach **15%** activates drawdown block; no trustworthy history → `NOT_CHECKED`.
- **H03 3% daily loss:** `B0` based on Equity at Moscow 00:00, including correct net external flows `F`; adjusted PnL `E_current−B0−F` in common currency, with unit/method and no double count. `loss=max(0,−adjusted_pnl)/B0` (where baseline method has been established); reach **3%** triggers daily lock. Missing trustworthy start balance/flows → `NOT_CHECKED`.
- **H04 known active violation** has priority even with H02/H03 missing. Never clear daily block purely because the calendar date rolled; require the agreed reset and normalization verification. A known serious breach after HWM needs user approval for unblocking. **No background monitoring is promised.**

## 7. Status precedence and output handoff

1. **`REJECTED`:** proven violation of any hard requirement or confirmed active H04 blocking new risk, even with other missing fields. Show evidence/FR/threshold, and separately list unknowns.
2. **`UNVERIFIED`:** material source or currency conflict, unknown necessary Cross MMR/Short upper bound, unreliable required risk model or essential risk/scenario applicability.
3. **`NEEDS_DATA`:** genuinely absent required fresh account/Mark/order/P02 inputs with no already demonstrated violation or critical model conflict.
4. **`READY`:** *not available from this Skill alone*. Only the future **full** R3 handoff with verified mandatory current/projected FR, F/A/H/R on real data, fresh T02/Mark and actual user P02 could consider this classification; unresolved RV/TV currently prevent it.

Return `decision; task/mode; as_of; precise source+unit scope; S0/S1/S2/S3 summary; per-FR status with numerator/denominator and proof/confidence; projected worst margins, slots and reserves; bot lifecycle/from-now loss; F/A/H/R family evidence; H02/H03 NOT_CHECKED vs H04 active; all hard blockers and missing/conflicts; safer manual alternatives; next required data`.

**Diagnostics** `PASSED_FOR_SUBSET`, `SCENARIO_ONLY`, `NOT_PROVABLE`, `NOT_CHECKED` and `LOCAL_PASS_NOT_READY` are not additional trading statuses. Stop/Disable IN/Cancel Bot is not confirmed exchange closure. Invalidate risk checks after fills, bot edits, margin/collateral/position change or materially updated market conditions; request fresh synchronized snapshots before new risk approval.

**Hard boundary:** this repository's Risk Skill does **not** execute real trades and cannot truthfully declare real account `READY` without real independently verified models and evidence. The outstanding RV-02/RV-03, RV-04/RV-06, TV-01–TV-04 and FR-038 real-history blockers remain in force.
