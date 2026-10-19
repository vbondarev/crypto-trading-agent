---
name: portfolio-analysis
description: Reconcile the full Bybit USDT perpetual portfolio across account snapshots, One-Way/Hedge positions, Cross/Isolated collateral, active and conditional orders, partial fills, Veles/GinArea bots, future IN grids and linked trade PnL. Use for portfolio exposure reviews, averaging, recovery and R3 risk handoff, not standalone trade approval.
---

# Portfolio Analysis — Crypto Trading Agent

## When to use

- User asks to **review a Bybit futures account**, position(s), bots, active/conditional orders, used/available margin, liquidation-related inputs, manual interventions or recovery of a trading series.
- A proposed entry, averaging grid, Short/Long adjustment or final bot configuration depends on **existing portfolio exposure and future order commitments**.
- `R3` risk validation calls for a **complete, refreshed, synchronized T02/T03/T04 account snapshot**; a `data-verification` gate must precede this Skill when present.
- Bot state and exchange reality may diverge (Veles stop/cancel, GinArea Disable IN/Pause/Failed, platform restart, partial fill).

## When not to use

- Pure education, general `R1` coin overview or indicator-only `R2` market analysis without relevant positions: do not request the user's private portfolio unnecessarily.
- Do **not** claim direct account/API access, issue/cancel orders, change leverage, maintain background monitoring, compute an assured Cross liquidation/Short worst-case loss, invent account balances or assign `READY`.
- Do not replace `risk-assessment`, `strategy-planning`, `veles-configuration` or `ginarea-configuration`; those future modules may not exist yet. Provide a **verified-or-unverified portfolio handoff**, never a final bot risk permit.

## Read approved references as needed

All relative paths resolve **from this Skill directory**, not GitHub root:

- [AGENTS: security and strict limits](../../../AGENTS.md)
- [FR-018–FR-026, FR-027–FR-040, FR-050–FR-053](../../../docs/requirements.md)
- [Freshness, invalidation and R1/R2/R3](../../../docs/data-freshness.md)
- [T01–T06 snapshot requirements](../../../docs/input-templates.md)
- [Data sources and scope](../../../docs/data-sources.md)
- [Source conflicts and TV-01–TV-04](../../../docs/data-validation.md)
- [Stage 05 full-portfolio risk and H01/H02/H03/H04](../../../docs/risk-management.md)
- [Risk/account/IN cross-platform model from 06.7](../../../docs/platforms/platform-synthetic-tests.md)
- [Veles positions, cancellation and pending orders](../../../docs/platforms/veles.md)
- [GinArea PRO IN/OUT/Disable IN](../../../docs/platforms/ginarea.md)
- [P01/P02 platform scope](../../../docs/platforms/platform-validation.md)
- [07.1 Skills routing contract](../../../docs/stage-07-skills-contract.md)
- [Data Verification Skill, if actually accessible](../data-verification/SKILL.md)
- [Operating rules and final statuses](../../../docs/agent-operating-rules.md)

Official Bybit API references for interpreting **actual returned fields** (documentation is not user data): [UTA wallet balance](https://bybit-exchange.github.io/docs/v5/account/wallet-balance), [position list](https://bybit-exchange.github.io/docs/v5/position), [active/conditional and recent closed orders](https://bybit-exchange.github.io/docs/v5/order/open-order), [order history](https://bybit-exchange.github.io/docs/v5/order/order-list), [execution list](https://bybit-exchange.github.io/docs/v5/execution/list). Public documentation does **not** establish that a private endpoint was called, the user has permissions, or the result covers every account/subaccount.

## 1. Scope the task and declare evidence

- Identify `R1 / R2 / R3`, exact `exchange=Bybit`, product `category=linear`, **confirmed USDT-settled perpetuals**, desired account(s)/subaccounts, portfolio purpose and `snapshot_at`. Do not silently mix Spot, USDC contracts, other exchanges or funding wallet with USDT perpetual exposure.
- For account analysis use **T02 whole-account** (wallet/account equity, mode, positions, orders, active bots), **T03** position details, **T04** bot configs and all **future planned IN** (placed, conditional, virtual, not yet placed), and **T05/H01** linked execution series when asked about recovery.
- For R3: T02 is **at most 5 minutes old**, consistent across endpoints and explicitly **unchanged since capture**; price used for liquidation needs actual **Bybit Mark** at most 2 minutes old, or tighter under AD-009. Material activity invalidates a still-within-TTL snapshot.
- Use verified accessible tools or user-provided exports/screenshots without asking for API secrets. Record `source; retrieved_at; observed_at/response_time/snapshot_at; timezone; account ID alias; market; pagination cursor/coverage; provenance; unresolved fields`. Account alias must not disclose user identifiers in public repository.
- In Bybit V5, account `totalEquity`, `totalInitialMargin`, `totalMaintenanceMargin`, `totalAvailableBalance` are **account-wide USD** values in documented applicable UTA modes. USDT is **not silently USD**; retain USD/USDT and FX/haircuts and **do not apply Cross account fields as if available for Isolated**.
- Check **all pages and each applicable account/subaccount**, not just the first `limit=20` page or one symbol. Verify endpoint returns empty rows/zero sizes meaningfully and coverage of conditional orders, bot virtual grids, orders entered outside bots. Absence from one UI tab is not proof of no orders.

## 2. Normalize current positions (S0)

Record for each **exchange position slot**:
`account; category; settleCoin; symbol; positionIdx; position_mode; margin_mode; side; qty_base; avgEntry; Mark; leverage; positionIM; positionMM; uPnL; cumRealisedPnl; fees/funding evidence; liqPrice; source; captured_at`.

- Bybit `positionIdx=0`: **One-Way**; `1`: Hedge **Buy/Long** slot; `2`: Hedge **Sell/Short** slot. Key slots by `(account, category, symbol, positionIdx)` **only after identity confirmation**. A One-Way slot is not two positions just because two bots target opposing directions. In Hedge Mode opposite non-zero slots may be **two** positions. `size` is nonnegative; determine direction from confirmed `side` / slot. `size=0` is not an active position.
- Count **current occupied slots** and identify bots/strategies that manage each one; ownership (bot ID ↔ exchange slot/position order) must be **demonstrated**, not inferred from similar sizes, entry prices or coin names. Preserve manual and other-bot positions. Unknown `owner` → `OWNER_UNVERIFIED`, not zero exposure.
- Keep **Cross, Isolated and Portfolio Margin distinct**. In UTA Cross/Portfolio Margin, liability/liquidation is account-wide: **Cross `liqPrice` is estimated/dynamic, and may be empty**. Blank/0/unavailable is *not* guaranteed immunity. The deprecated position `tradeMode` is not a reliable UTA margin-mode source; verify with actual account context.
- Do not recalculate Bybit IM/MM, liquidation or available USD by the naive `notional/leverage` shortcut. Separate `Equity`, occupied IM, projected incremental IM, MM, account MMR, available balance and **user-designated reserve**; reserve in Cross is **planning**, not ring-fenced collateral. Leave unknown FX/risk tiers unresolved.

## 3. Reconcile exchange orders and bot-intended actions (S1)

Normalize every order as:
`account; category; symbol; positionIdx; orderId; orderLinkId; owner; side; reduceOnly; closeOnTrigger; orderFilter/stopOrderType; orderStatus; orderType; triggerBy; triggerPrice; price; qty; cumExecQty; leavesQty; intendedPurpose (IN/OUT/TP/SL/UNKNOWN); state (PLACED/CONDITIONAL/VIRTUAL/PLANNED/FILLED/CANCELLED_CONFIRMED/UNKNOWN); source_and_time`.

- For exchange-documented `New/PartiallyFilled`, **remaining commitment uses `leavesQty`**, not original `qty`; `cumExecQty` is already part of executions/position S0 **only when the new account snapshot actually reflects it**. If S0 and order fill times cannot be reconciled, **invalidate and request synchronized T02/T03/T04**, rather than adding executed quantity twice or dropping it.
- A fully `Filled` order is **not still a future IN**; include its effect via position/execution/realized PnL. A **Bybit-confirmed `Cancelled`** order has no unfilled remainder; cancellation claimed only by Veles/GinArea/UI is insufficient to remove exchange commitment. A partially filled then cancelled order leaves already executed exposure.
- **Never deduplicate** two distinct confirmed `orderId` values merely because price/qty match. If exactly the same verified exchange `orderId` appears in Bybit and in a bot view, count that obligation **once**. For unconfirmed/missing IDs, record `POSSIBLE_DUPLICATE / UNVERIFIED` and obtain proof; do not automatically collapse or sum as guaranteed truth.
- Confirm **IN/OUT intent** using side **plus actual One-Way/Hedge position mode, reduceOnly/closeOnTrigger, positionIdx, linked bot instructions and existing exposure**. `Buy` is not necessarily Long IN; in One-Way it may reduce Short. An OUT reduceOnly cannot open a new position; an unknown or non-reduceOnly order might open or reverse—**model conservatively** and flag uncertain purpose.
- Include *all possible future IN commitments*, including **not-yet-placed virtual bot steps**, conditional triggers, inactive-but-restartable bot actions and custom grid future levels when reachable; an order not currently occupying exchange IM may still require full **planned reserve**. Do **not** add the same already occupied IM again when projecting future margin.
- To forecast **potential new position slots** (FR-033, limit 3), take current nonzero slots **plus all reachable IN orders that can create another slot**, including on new symbols; ignore proven reduce-only OUT for opening count. Mutually exclusive paths can be collapsed **only with proven sequencing**. Unclear mapping/hedge state → `UNVERIFIED`.
- Document order pagination, which statuses/filters were queried, asynchronous updates, and unknown owner states. `positionIdx` in Bybit orders can differ by mode; do not match only `symbol`.

## 4. Reconcile bot state with Bybit exposure

- **Veles:** bot `Stopped` / `Waiting to stop`, `Cancel deal`, `POSITION -1` or unfilled grid level **does not** prove exchange position closed. Ordinary Bybit stop-loss may only be placed **after last IN** in the applicable Veles mechanism. Check actual exchange position, order placement and pending grid independently.
- **GinArea PRO:** `Disable IN` means no *new* IN under that mechanism; it **does not itself cancel old active exchange orders** or close an existing position. `Pause / Failed / Out of bounds` do not prove zero position. Multiple virtual strategy legs can share **one actual One-Way exchange slot**. Default/Hedge compatibility cannot be guessed from bot labels.
- **Manual Bybit actions**, other bots, new fills, cancellation, Stop/TP, edit/restart, mode/leverage/margin change and price/collateral shock invalidate stale S0/S1 ownership and projections. Refresh before R3.
- Retain an **owner matrix** `account+slot → bot(s)+manual/unknown; linked orderIds; latest event; conflicts`. If attribution is unresolved, state the full exposure and label individual bot risk **UNVERIFIED**; do not pretend each virtual bot has an independent isolated position.

## 5. Compute linked trade-series H01 without fake recovery

- Define the **exact closed/open linked series**, time window and associated `executionId/orderId` list. Separate **realized trading PnL**, **unrealized current PnL**, **trading fees**, **funding cash flows**, and deposit/withdrawal/transfer if present; distinguish **net realized** fields that already include fees/funding from gross fields to avoid double subtraction.
- An example with **gross realized −15, current unrealized +10, fee −1, funding −2 = net −8 USDT** is still a **net loss**, *not* full recovery. Do not equate a bot dashboard's displayed “Profit”, a new position's green uPnL or partially closed take-profit with recovered prior realized loss.
- Repeated/partial fills must be associated with unique **execution IDs** and suitable Bybit history; current `cumRealisedPnl` may reflect a broader lifetime than one bot series. Unknown series ownership/fees/funding → `H01_INCOMPLETE` / `UNVERIFIED`, never “recovered”.
- **H02/H03** historical Equity (if absent) → `NOT_CHECKED`, not automatic rejection; a **known H04** strict-limit violation → forward a `REJECTED` veto to the risk gate for new risk.

## 6. Hand off to risk assessment (S2/S3) — never grant READY

Return a structured, source-labelled portfolio report:

1. `snapshot_id; as_of; mode; exchange; category; settleCoin; account/subaccount coverage; pagination completeness; time conflicts`.
2. **Equity and margin** in typed currencies, total available, IM/MM, Cross account MMR where applicable, true Mark sources; display unknowns rather than zeros.
3. **Current exchange slots** with `positionIdx`, direction, qty, avg, Mark/uPnL and any estimated `liqPrice`; **current slot count** vs **projected maximum slots** from reachable IN.
4. **Orders** classified by `exchange confirmed active/conditional/filled/cancelled` vs `bot virtual/planned`; normalized `leavesQty`, execution sync state, dedup and owner conflicts.
5. **S0/S1/S2:** current exposure; all reachable future IN/OUT and reserves; consequences after potential fills, costs and ownership changes. **S3 adverse price paths, Cross MMR stress and final FR-029/030/031/032/033/034/038** belong to the separate **risk-assessment** stage, *not this Skill*.
6. **H01 net series** with realized/unrealized/fees/funding, possible uncertain duplicates, missing T05.
7. `required_missing_input; critical_conflicts; invalidation_events; next_refresh`; explicitly note the decision impact.

**Output label (internal only):** `PORTFOLIO_SNAPSHOT_INCOMPLETE`, `PORTFOLIO_UNVERIFIED`, or `PORTFOLIO_EVIDENCE_COLLECTED_NOT_READY`. These are **not** new trading statuses; if the caller needs an actual final decision, approved statuses are `NEEDS_DATA`, `UNVERIFIED`, `REJECTED`, `READY` only after the full separate risk/platform verification.

**Always preserve open blockers:** RV-02 (Cross/account MMR + adverse-path liquidation), RV-03 (strict upper Short loss), RV-04 (real platform P02), RV-06 (independent execution), TV-01–TV-04 and missing real F/V/H/R FR-038. No real `READY` based on a local synthetic check.
