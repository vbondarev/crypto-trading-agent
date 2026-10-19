---
name: strategy-planning
description: Compare evidence-based NEW, ADD, HOLD, WAIT, REDUCE, CLOSE and RECOVER scenarios for Bybit USDT perpetual trades, including Long/Short direction, full portfolio risk, net PnL recovery and user choice. Use for R2 preliminary planning and post-risk-gate strategy selection; never silently select a bot platform or grant READY.
---

# Strategy Planning — Crypto Trading Agent

## When to use

- The user asks **what to do next** with a crypto asset, an existing Long/Short position, a bot or an underwater series: `NEW / ADD / HOLD / WAIT / REDUCE / CLOSE / RECOVER`.
- There is a need to **compare several materially different options**, Long vs Short vs neutral, manual exit vs averaging, continuing vs recovery, or whether to use a bot at all.
- The user is preparing a strategy before explicitly choosing **one platform** (Veles or GinArea PRO), and risk/data/market evidence must be converted into explainable alternatives.

## When not to use

- Straightforward education or descriptive R1 trend questions without a strategy decision: do not demand private T02/P02 or invent an action.
- Do not fabricate candles, funding, probability, exact entry/exit/SL, grid, budget or expected yield to make an option look attractive. Do not trade, place/cancel orders, watch the market asynchronously or require keys.
- **Never fill out a concrete Veles/GinArea form here**. The user must independently choose a strategy and platform; only later steps 07.7/07.8 may produce verified platform fields. A suggested scenario is not `READY`.

## Approved references — read relevant actual bodies, not just links

All relative paths below resolve **from this Skill folder**:

- [Global project policy and hard safety limits](../../../AGENTS.md)
- [FR-041–FR-046 plus requirements for market, risk and platform selection](../../../docs/requirements.md)
- [Market facts and alternatives FR-001–FR-017](../../../docs/agent-operating-rules.md)
- [Data quality and mode-specific R1/R2/R3 freshness](../../../docs/data-freshness.md)
- [Minimal T01–T06 input templates](../../../docs/input-templates.md)
- [Risk S0–S3, H01 series, Cross/Short and stress families](../../../docs/risk-management.md)
- [Documented unresolved risk limitations after stage 05](../../../docs/risk-validation.md)
- [Platform 06.7 ownership, remaining IN and projected slot checks](../../../docs/platforms/platform-synthetic-tests.md)
- [Actual P01 documentation vs personal P02 form](../../../docs/platforms/platform-validation.md)
- [Stage 07 contract and decision routes](../../../docs/stage-07-skills-contract.md)
- [Data Verification Skill — only if actually accessible](../data-verification/SKILL.md)
- [Market Analysis Skill — only if actually accessible](../market-analysis/SKILL.md)
- [Portfolio Analysis Skill — only if actually accessible](../portfolio-analysis/SKILL.md)
- [Risk Assessment Skill — only if actually accessible](../risk-assessment/SKILL.md)

A sibling link does not demonstrate that ChatGPT actually loaded or invoked that Skill. If inaccessible, follow the approved policy documents and disclose the missing integration. Do not change FR/RV/TV rules.

## Traceability of approved strategy requirements

- **FR-041:** record the actual user's goal, restrictions, direction, budget and horizon rather than inventing preferences.
- **FR-042:** compare relevant WAIT/HOLD/NEW/ADD/REDUCE/CLOSE/RECOVER options and explain rejected alternatives.
- **FR-043:** justify direction, strategy type, conditional entry/exit context and invalidation from sourced market facts; no profit promise.
- **FR-044:** adapt to horizon, budget, existing exposure and strict risk limits; never soften FR-027–FR-040 for a preferred trade.
- **FR-045:** calculate recovery only from the complete verified linked H01 net lifecycle including past losses, fees and funding.
- **FR-046:** obtain the user's own strategy choice before moving to a platform-specific bot configuration; platform selection is independently required by FR-047.

## 1. Establish the user's *actual* choice and evidence mode

Capture `goal` (new trade, existing position management, partial exit, series recovery, risk reduction), `asset / exact exchange-market`, horizon, intended direction **only if stated**, current position/owner, portfolio exposure, available budget and acceptable actions, and explicit user choice **if already made**.

- Only for trade-critical proposals, verify **Bybit USDT perpetual `category=linear` and USDT settlement**. Spot/other exchange data can be contextual but never silently substitute Bybit Mark or account T02.
- `R1` context/education: do not solicit portfolio or force strategy selection.
- `R2` preliminary: use truly available verified price/closed OHLCV, method and horizon; a conditional comparison can be useful with explicitly missing information, without pretending risk checks passed.
- `R3` final risk/configuration: demand **full current synchronized T02/T03/T04**, user's actual selected P02, Mark, S0–S3, FR-027–FR-040, F/A/H/R and relevant 07.2–07.5 evidence. **This Skill cannot grant READY** by itself.
- Verify provenance: `source; observed_at; retrieved_at; market category; price kind; interval; unit; account scope; completeness`. For R3 T02 ≤5min and Mark ≤2min **and** event validity, tighter by AD-009. A fill, bot edit, order cancellation or margin/collateral change invalidates an earlier snapshot despite TTL.

## 2. Create an option set according to the user's purpose (FR-041/FR-042)

| Strategy | What it means | Essential constraint |
|---|---|---|
| **WAIT** | No incremental exposure; await verifiable market/portfolio condition or better evidence | Not a claim of zero risk if an open position already exists; recommend risk review when exposure persists |
| **HOLD** | Maintain a **known existing** position under current risk exposure, possibly with monitoring by user/platform | Not an automatic default for underwater positions; current liquidation/cross/stop risk matters |
| **NEW LONG / NEW SHORT** | Additional new exposure only when direction, position slot, complete margin and FR gates support the scenario | A favorable market pattern never overrides `REJECTED`, `UNVERIFIED` or `NEEDS_DATA` R3 |
| **ADD** | Reachable additional IN to an existing position; distinguish reducing average entry from **increasing nominal exposure/risk** | ALL planned IN levels, projected new slots, reserve, fees/funding and S0–S3 risk need recheck; unknown Cross/mmr or Short bound blocks final readiness |
| **REDUCE** | Consider manual partial risk reduction, including bot stop/Disable IN followed by **exchange-confirmed order/position inspection** | Reducing one leg can alter hedge and worsen Cross risk; never assume reduced position from bot UI alone |
| **CLOSE** | Consider full exchange position exit subject to execution/liquidity/order side/reduceOnly and updated snapshot | A platform ‘Stopped’, ‘Cancel Deal’, ‘Disable IN’ or theoretical stop is not an executed close |
| **RECOVER** | Plan how a **well-defined linked H01 trade series** could reach nonnegative net PnL (not necessarily by adding risk) | Requires execution IDs/fees/funding, separate `L_lifecycle` vs `L_from_now`; recovery is a **goal, not guaranteed outcome** |

Include only options meaningful for the user and market structure. If the user is already Short, a new Long may **reduce, reverse or create a Hedge slot depending on actual position mode and reduceOnly**, not invariably open a separate hedge. A change of coin, side, exchange, risk mode or bot must reopen compatibility and risk checks. An option to wait with an open high-risk position **must not conceal existing exposure**.

## 3. Evaluate candidates **without weakening hard gates**

1. Receive **data-verification** evidence, **market-analysis** (trend, timeframe, last *closed* candle, ATR/volume/news when relevant), **portfolio-analysis** (all exchange slots and future IN/OUT/orders/bots, identity/owner, equity/IM) and **risk-assessment** outputs when needed. Carry exact source/time/unit and `verified / derived / hypothesis / missing` classification.
2. Separate **desirable trade conditions** (market regime, horizon, invalidation, liquidity, reward/risk hypotheses) from **mandatory risk feasibility** (portfolio margin and worst branch, bot loss, leverage, liquidation, slots, full reserve, known H04 and stress).
3. Apply **FR-027–FR-040 unchanged**: portfolio IM ≤30% Equity, each bot worst loss bound ≤5% Equity, leverage ≤5×, trustworthy adverse Mark-to-liquidation distance ≥15%, ≤3 reachable exchange slots, 100% all future IN margin+cost buffers; known ≥3% daily loss / ≥15% HWM DD block **new risk**; F/A/H/R actual historical Mark needed for R3. Missing H02/H03 alone is `NOT_CHECKED` but does not erase known H04.
4. **No risk expansion in a confirmed block**: `NEW`, `ADD` and `RECOVER` **when it adds risk** → `REJECTED`. `WAIT`, `REDUCE` or `CLOSE` remain discussable as possible risk-management directions, **subject to careful check that the action really reduces exposure**; not an exemption from execution rules.
5. No **fake risk PASS**: uncertain Cross/UTA MMR, RV-02, upper bound for Short loss RV-03, bot/platform P02 (RV-04), live runtime independence (RV-06), TV-01–TV-04 or required historical Bybit Mark F/A/H/R → `UNVERIFIED`/ `NEEDS_DATA` as warranted, not final `READY`. A modelled favorable PnL or stop trigger does **not** cap execution loss.
6. Preserve canonical priority for each risk-expanding candidate: **proven hard violation `REJECTED` > material source/model conflict `UNVERIFIED` > missing mandatory current data `NEEDS_DATA`**. `WAIT/HOLD/REDUCE/CLOSE` may be *discussion options*, never direct orders or unconditional guarantees. A conditional R2 illustration is **not** a successful R3 gate.

## 4. Recovery maths: a **net lifecycle**, not a green position (FR-024/045)

First establish the identity and window of the H01 linked series: `account, bot_id/alias, symbol/positionIdx, orderId/executionId, started_at, partial closed/open, realized field semantics, funding, trading fees, external transfers`. A bot PnL card is not enough when several bots share one exchange slot. T05/H01 is **mandatory when asserting actual recovery**; H02/H03 Equity history is a separate conditional check.

- `L_lifecycle_now` is the **net** sum of the linked series: realized price components, current attributed unrealized PnL, **fees and funding once each**, with proper treatment of exchange-provided *net* realized values. `L_from_now` separately measures future deterioration from current account state; don't deduct past fees/realized losses again from today's `E0`.
- Example **synthetic**: realized **−15 USDT**, current uPnL **+10 USDT**, fees **−1 USDT**, funding **−2 USDT** (all separate and *not* already incorporated) ⇒ series `net_now = −8 USDT`. A profitable current position **does not mean recovery**; to reach zero net series needs **+8 USDT of additional net improvement** *assuming no new fees/funding*. If estimated additional closing and funding costs are **2 USDT**, *required additional favorable price PnL* is **10 USDT**, and the larger exposure may be disallowed by the Risk Skill. Show both cases, not a guaranteed target or executable exact exit price.
- Formal conditional relation `net_at_exit = net_now + incremental_price_PnL − incremental_fees − incremental_funding − other_verified_costs`. **Only compare compatible currency and matched exposure allocation**. If some costs already reflected in `net_now`, do not subtract them again. A partially closed position or one winning later deal does not erase historical realized loss.
- Distinguish `RECOVER_BY_REDUCING` (cut exposure and accept known remaining loss), `RECOVER_WITH_EXISTING_POSITION` (conditional market path, no added risk) and `RECOVER_WITH_ADD` (**new risk** subject to full hard gates). Do not portray averaging/martingale as necessary to recoup losses; no guarantee the market revisits a profitable exit.
- If H01 evidence, owner mapping, future costs or timeframe are unavailable, give a **data request and qualitative alternatives**. Do **not** invent a recovery price, probability, profit amount or claim `RECOVERED`.

## 5. Compare options and give a reasoned choice *without executing it*

For each meaningful candidate prepare a concise comparison with:

`option/action/direction; prerequisite and activation conditions; sourced market rationale by actually checked timeframe; assumptions; additional notional and margin reserve if verified; loss/liq/slot effect or its uncertainty; net series consequences; how the option fails or is invalidated; impact on existing bots; risk decision and missing proof; why accepted/rejected/secondary`.

- Prefer **no new risk** when mandatory current/prospective risk is blocked or unverifiable. If user's **stated** goal is reduction, compare realistic REDUCE and CLOSE before proposing additional exposure.
- An **existing position with material liquidation danger** cannot be safely ignored by simply saying WAIT. Explicitly describe urgent risks, potentially protective manual options and the need to verify the Bybit order/position state.
- Use **conditional** prices/levels only from verified OHLCV or explicitly dated user-provided same-market information; never report synthetic numbers as current market values. For R2 with limited evidence, provide qualitative option order or parameters tagged `PRELIMINARY`, not final parameters.
- No probability of profit, expected % return, precision entry, grid spacing or stop-profit claim without method, actual input sample and uncertainty. Show scenarios *both* for a favorable and adverse market move. Mark the option comparison as `PROVISIONAL` if a critical R2 data item is absent.
- Do not unilaterally choose **Veles** vs **GinArea**, or Default/Indicator/Auto/etc where current symbol availability is unverified. Describing platform tradeoffs is permitted; issuing platform-specific P02 fields before explicit selection **is not**.

## 6. Explicit user decision required before config (FR-046/047)

The strategy decision includes two independently grounded confirmations:

1. **Strategy choice:** the user explicitly selects `NEW LONG / NEW SHORT / ADD / WAIT / HOLD / REDUCE / CLOSE / RECOVER` or asks for a particular option. A recommendation does **not** count as their assent, and accepting the *analysis document* doesn't authorize a real trade.
2. **Platform choice**, if moving to a bot: the user explicitly specifies or confirms **Veles OR GinArea** and relevant pair/strategy. If not chosen, stay at options; the selected `strategy-planning` output does not become an arbitrary `veles-configuration` or `ginarea-configuration` request.

After an explicit choice, rerun relevant verification/risk with new up-to-date T02/Mark and actual **P02** before **final** bot parameter validation; ensure symbol/strategy supported by the *real current form*. `READY` could only arise from separately proven complete R3, **not** this Skill alone. Any suggested setup is for **manual application** by the user; no order placement or claimed continuous monitoring.

## Response format

Summarize `goal; R1/R2/R3; market/exchange/type; as_of; sources/limits; current positions and H01 scope; applicable market conditions; candidate comparison; preferred *conditional* plan and alternatives; reasons for rejection; risk gates (known breach vs missing vs model uncertainty); invalidation triggers; minimal new inputs; next user choice`.

Use only the allowed top-level trade decision vocabulary `REJECTED / UNVERIFIED / NEEDS_DATA / READY` in the **full risk/config context**, and internal strategy labels `OPTION_CONDITIONAL / NO_NEW_RISK / NEEDS_H01 / USER_SELECTION_PENDING` for planning. `NOT_CHECKED` is diagnostic only, **not** a false fifth trading status. **No live READY, no automatic move to 07.7/07.8, no order execution, no promise of returns.**
