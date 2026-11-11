# HYPE-V01 / P02-01 — Veles DCA editor evidence preflight (READ-ONLY)

**Prepared:** 2026-11-11 (Europe/Moscow).  
**Status:** `PREPARED / P02_NOT_RECEIVED / NO_UI_VERIFICATION / USER_ACCEPTANCE_PENDING`.  
**Branch:** `feature/simplified-agent-v2`; base HEAD before this step: `ed4e2388260093a932a05663037cc22baa173ec4`.  
**Normative v2 policy pin for prior synthetic pilot:** `b7123d9cf19502bf4a890f1400027f30fa213434`. This preflight does **not** rewrite the pinned synthetic test or change v2 normative schemas/Skills.

## 1. Scope, explicit boundary and rationale

This is **a preparation-only P02 evidence intake protocol**, following the `HYPE-V01-R02` typed contract test. It is not completion of P02 mapping, stage 06, a final strategy, risk approval, bot configuration or instruction to trade.

Target for future observational check: user-selected **Veles DCA** editor, **Bybit HYPEUSDT linear USDT perpetual**, only where both platform mode and instrument are actually displayed. `CUSTOM / Свой` was a **hypothetical assumption** in the synthetic V01 test, not a verified user selection. Never silently select that mode in the real form or switch from DCA to a separate GRID product.

Before an actual screenshot / recording of UI state arrives: `P02_observed=false`, `P02_verified_at=null`, `field_map_version=null`, `instrument.identity_status=UNVERIFIED` (for this workflow), all candidate labels `DOCUMENTED_ONLY`; no `form_key_if_verified`, order amounts, grid steps, trigger values, TP/SL, price or `VERIFIED_FOR_MANUAL_REVIEW`. A documented label is not a confirmed P02 field.

## 2. Evidence actually read for this preflight

| ID | Source | Scope | Evidence tier |
|---|---|---|---|
| V2-A | `docs/v2/adapters/veles.md` at pre-step v2 HEAD | Chosen-mode mapping, P01/P02 separation | Repo contract; not screenshot |
| V2-B | `docs/v2/bot-handoff-policy.md` at pre-step v2 HEAD | Gate 0–3, risk precedence, no fabricated handoff | Repo contract |
| V2-C | `docs/v2/contracts/bot-configuration.schema.json` at pre-step v2 HEAD | Shape and `readiness` values | Repo typed contract |
| V2-D | `docs/v2/pilots/hype-v01-r02-independent-review.md` at pre-step v2 HEAD | 11 PASS / 1 INCONCLUSIVE, P02/T02 open | Limited synthetic review |
| V-01 | https://help.veles.finance/ru/platform/settings/full/ | Public **DCA** settings guide; observed 2026-11-11; publication/version unknown | Official P01 docs only |
| V-02 | https://help.veles.finance/ru/platform/settings/trading-mode/ | Modes Simple/Custom/Signal; per-order `Свой` offset and volume | Official P01 docs only |
| V-06 | https://help.veles.finance/ru/platform/settings/stop-loss/ | General stop behavior; **not** guaranteed loss cap | Official P01 docs only |
| LEGACY | `docs/platforms/veles.md` and `docs/platforms/configuration-contract.md` | Historical catalog VL-01..VL-25 and platform/risk distinctions | Repo P01 contract |

Official public docs were reachable on 2026-11-11 but contain no authenticated observation of the user's editor/account, so their contents do not raise `P02_observed` above false.

## 3. Minimal redacted user evidence for P02-02 (not received)

Capture only the read-only DCA editor state (new bot / edit bot explicitly identified); **do not click Create, Update, Test, Run, Save**, change leverage/margin/position modes, or interact with a live position. Screenshots may be split by sections, but must refer to the same editor session. Record local observation time **with timezone**. If a field is hidden behind a selector, provide that state separately and label it; do not infer options not displayed.

Required visual coverage, where the UI actually exposes it:
1. Editor origin: **DCA vs GRID**, new/edit vs active-trade editor, web/mobile and visible version/build (or UNKNOWN).
2. Selected exchange binding type (Bybit futures linear USDT), instrument selector **HYPEUSDT**, `Long/Short`, margin mode if visible, trading-mode selector (`Простой/Свой/Сигнал`). Do not assume current account Hedge/One-Way from labels.
3. Budget/deposit with **unit**, leverage and any visible minimum/maximum/validation hints; distinguish illustrative V01's 100 USDT from actual user budget and account Equity.
4. Entire selected-mode IN section: first order, all future orders, number of orders, offsets, volumes and their **displayed units**, whether the grid is automatic or manual, partial placement/pull-up as available.
5. Opening conditions (filters), TP, SL, breakeven/trailing if actually exposed; expanded state as necessary; leave unknowns UNKNOWN.
6. Preview if already visible (not proof of exchange placement), warnings and any displayed validation errors; **no test or save needed**.

**Privacy:** mask API keys, IDs, account identifiers, subaccount names, full wallet balances/Equity, UID, QR codes, URLs with tokens, and unrelated orders/positions. Do not commit raw screenshots or private T02/T03/T04 to this public repo. If redaction destroys necessary context, mark it `INCONCLUSIVE` rather than reconstructing details.

## 4. Mapping matrix to be populated only after P02 arrives

| Group | Documentary candidate / control | Required P02 observation | Current result |
|---|---|---|---|
| Identity | DCA editor, Bybit linear USDT, symbol, Long/Short | Actual selector and selected value | `NOT_OBSERVED` |
| Modes | `Простой/Свой/Сигнал`, Cross/Isolated if visible | Chosen mode; do not confuse margin vs strategy mode | `NOT_OBSERVED` |
| Budget | `Депозит`, `Плечо` | Exact field label/value/units; no `Equity` substitution | `NOT_OBSERVED` |
| IN, Custom | Per-order offset and volume, add/remove order | Selected `Свой` state, each row and denominator of displayed `%` | `NOT_OBSERVED` |
| IN, Simple | Coverage, grid count, martingale, first offset, distribution | Only if **Простой** actually selected | `NOT_OBSERVED` |
| IN, Signal | Signal conditions, min offset | Only if **Сигнал** actually selected; no false limit grid | `NOT_OBSERVED` |
| Lifecycle | Partial placement, pull-up, adoption `POSITION -1` if shown | Visibility, state, actual implications | `NOT_OBSERVED` |
| Entry/exit | Open filters, TP, SL, BE/trailing if shown | Exact UI copy, units, selected variants | `NOT_OBSERVED` |
| Controls | Preview, backtest, save/create/update | Identify **actions**, never map as order fields | `NOT_OBSERVED` |

For every observed item create `{ui_label, displayed_value, unit, selected_mode, screenshot_ref, observed_at, source_ref, verified_status, form_key_if_verified}`. If a label is only in public documentation use `DOCUMENTED_ONLY` and `form_key_if_verified=null`. For ambiguous/hidden UI use `UNVERIFIED` and record an explicit gap, not guessed internal keys. Public screenshots, if user-provided, prove the displayed state only and not Bybit fill behavior.

## 5. Decision gates and acceptance criteria for the next substep

- **G0** File provenance: screenshot timestamp, session consistency, redaction; unavailable/mixed screenshots ⇒ `P02_INCONCLUSIVE`.
- **G1** Identity: DCA vs GRID, Bybit linear USDT, symbol, direction and selected strategy mode observed. A spot/other market mismatch ⇒ reject that mapping.
- **G2** Field-level accuracy: exact visible labels, units, mode-dependent presence/absence. P01-only items must never be upgraded to P02.
- **G3** No financial assumptions: Veles deposit, planned notional, order nominal, margin, account Equity and available collateral are distinct; `Свой` volume `%` denominator must be verified.
- **G4** Safe lifecycle: no UI interactions, secrets, invented stop efficacy, implicit automatic launch or equivalence with Bybit execution.
- **G5** Risk precedence: known H04/other hard veto ⇒ `REJECTED / NOT_RECOMMENDED` for new/ADD exposure regardless of missing P02; otherwise missing T02/Mark/MMR/worst Short loss/F/A/H/R ⇒ no risk `PASS`.
- **G6** Release: completing **P02 visual mapping** alone never upgrades `BotConfigurationProposal.readiness` to `VERIFIED_FOR_MANUAL_REVIEW`, never `READY`; the latter is not even a schema value. All actual account/market/risk gates are separate.

Outcomes for **P02-02**: `VISUAL_MAP_PASS_WITH_LIMITATIONS` only for exact observed fields, `PARTIAL` if coverage insufficient, `BLOCKED` if no actual screenshot, `REJECTED` for known incompatible market/contradictions. In all cases continue to distinguish evidence coverage from trading readiness. No completion claim before actual screenshots.

## 6. Preflight self-check and handoff

- Prepared **one read-only intake checklist**, mode-separated matrix, six evidence fields and seven G0–G6 gates.
- No P02 input was supplied at the time of writing: every mapping result stays `NOT_OBSERVED`.
- No live account, Bybit API, Veles private editor, market price, historical backtest or real bot was queried; no orders placed.
- No `AGENTS.md`, legacy Skills, original pilots, Draft PR #1, `main` or original pinned test record changed.
- No temporary assumption of HYPE market direction; synthetic `V01-A` and `V01-B` remain a training test only.

**Result of P02-01:** `PREFLIGHT_DOCUMENTED / NO_P02_VERIFICATION / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING`.  
**Stop here.** After a separate review and user acceptance of P02-01, request redacted screenshots and conduct **P02-02 observational mapping** as its own separately reviewed deliverable. **Stage 06 NOT STARTED; v2 NOT ACTIVE.**
