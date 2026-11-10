# GinArea PRO adapter (v2 design candidate, NOT ACTIVE)

Canonical source: `docs/platforms/ginarea.md`, `.agents/skills/ginarea-configuration/SKILL.md` and `docs/platforms/configuration-contract.md`. This is a checklist, not a claim of observed current P02.

## Source and strategy availability
- User explicitly selects `GINAREA`, verify Bybit linear USDT and exact variant `Default|Auto|Dynamic|Indicator|DCA` **as actually offered** in selected market/account.
- A strategy unavailable for chosen pair is a **constraint**. Do NOT silently replace IndicatorGrid with DefaultGrid, change Long/Short direction, or copy Veles SIMPLE/CUSTOM/SIGNAL settings.

## Mapping procedure
1. Locate current GinArea P01 documentation and user's exact P02; note version/date, mode and units of every relevant field.
2. Map only actual fields with the common `mapping[]` tuple. If field not shown in P02, `verified_status=DOCUMENTED_ONLY|UNVERIFIED`; never fill a made-up field.
3. Distinguish IN order sizing and OUT rules, order step, multiplier, bounds, reserve, TP/SL, `Instop` and `Disable IN` as separate mechanisms according to actual mode/UI. Units, percentage and USDT notional cannot be interchanged.
4. Validate full reachable grid (including future fills), portfolio slots, IM, bot worst loss, margin reserve, H04, stop mechanics and actual Mark/liquidation with available evidence.
5. `Pause`, `Disable IN`, `Close` and exchange fill are distinct: always verify exchange position and orders rather than infer closure from a bot state.
6. On P02/position/equity/Mark/restart changes require AD-009 RECHECK.

## Invariants
- Missing P02/current full account ⇒ `DRAFT|NEEDS_DATA`; known new-risk hard breach ⇒ `NOT_RECOMMENDED`.
- No automatic trading or claims that a conceptual stop guarantees loss bound.
- Final proposal is a **manual-entry aid**, not exchange execution.
