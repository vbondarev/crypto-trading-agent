# Veles adapter (v2 design candidate, NOT ACTIVE)

Canonical source: `docs/platforms/veles.md`, `.agents/skills/veles-configuration/SKILL.md` and `docs/platforms/configuration-contract.md`. This document is a **routing/checklist** and does not claim that user-specific P02 UI has been observed.

## Source and mode
- Platform must be **explicitly selected VELES**, Bybit linear USDT contract verified.
- Modes `SIMPLE`, `CUSTOM` and `SIGNAL` differ. Use only actual selected mode supported by verified P01/P02.
- Never convert GinArea `Disable IN`, `Instop` or its grid-mode values into Veles fields.

## Mapping procedure
1. Read actual P01 official documentation for chosen Veles mode, record version/date and `form_evidence.P01_source`.
2. For proposed manual implementation request **actual user P02** screenshot/text of the same editor mode and market. Without P02, configuration must be `DRAFT/NEEDS_DATA`, never VERIFIED_FOR_MANUAL_REVIEW.
3. For each supported UI input map `ui_label`, `form_key_if_verified`, `value`, `unit`, `source_ref`, `verified_status`. Keep price/percent/USDT notional/margin units distinct.
4. Derive range, first and future IN, grid steps, averaging budget, TP and optional SL/BE from data available, and check all future fills vs portfolio hard caps; funding, fees and slippage matter.
5. A documented stop/cancel bot action is **not** exchange-close/fill. Existing position adoption and `POSITION -1` require independent evidence; avoid fictitious liquidation safety and automatic risk coverage.
6. If active portfolio/mark/form changed apply AD-009 RECHECK before use.

## Invariants
- No imaginary P02 fields, no automatic order, no secrets.
- Known H04/hard violation ⇒ `NOT_RECOMMENDED`; unknown Cross MMR/Short bound ⇒ `NEEDS_DATA/UNVERIFIED`.
- Final configuration is for **manual review and manual input only**.
