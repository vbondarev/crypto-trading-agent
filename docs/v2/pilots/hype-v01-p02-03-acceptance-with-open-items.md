# HYPE-V01 / P02-03 — bounded transition decision and open evidence

**Recorded:** 2026-11-12 (conversation calendar date; exact user message time not independently authenticated).
**Decision:** `P02_03_PARTIAL_EVIDENCE_ACCEPTED_FOR_TRANSITION / USER_ATTESTED_SETTINGS_EXIST / OPEN_ACCOUNT_MODE_VALUES / NO_TRADE_READY`.

## What the user actually confirmed

Responding to the P02-03 request for a Bybit display of actual Cross/Isolated/Portfolio and One-Way/Hedge, the user wrote: **«Там эти настройки есть. Подтверждаю. Следующий шаг.»**

This explicitly attests **the existence/visibility of the relevant settings** and instructs the assistant to proceed. It does **not** state the currently selected margin mode or position mode; no new screenshot or authenticated account export was supplied. Record the message as **approval to transition with P02-03 unresolved fields**, not a full verified P02-03 completion, account certification, or permission to switch any live setting. The wording “Подтверждаю” here refers to accessible settings and transition, not actual values.

## Accepted partial evidence, not market execution

- P02-03 preflight: `docs/v2/pilots/hype-v01-p02-03-readonly-mode-audit.md`; original commit `dab7f9c61db6a4c51bc8edc63b164e89f91da71f`.
- P02-03 preflight self-review: `docs/v2/pilots/hype-v01-p02-03-preflight-self-review.md`; original commit `9f1f220ff511babbd268d7095510caf8077f81ac`.
- P02-03-E01 Veles screenshot: `docs/v2/pilots/hype-v01-p02-03-e01-veles-leverage-cross-observation.md`; original commit `2849bd397c229502e7f9aebdae03310431b2f76b`.
- E01 self-review: `docs/v2/pilots/hype-v01-p02-03-e01-self-review.md`; original commit `ff1c1730576dd748abbdf95ed6bf60ee1a11b76a`.
- Visible in S7: Veles editor leverage **1×**, margin selector **Перекрестная (Cross)**, empty deposit, indicative **0 USDT** and insufficient-funds banner. The 0 USDT figure is **not** authenticated Bybit Equity.
- Earlier approved P02-02: HYPE/USDT LONG, SIMPLE, existing-position inclusion visually OFF, no selected grid values. S7 and prior screenshots not authenticated as one concurrent/saved state.

## Explicitly NOT verified / not approved

| Field | Result |
|---|---|
| Selected actual Bybit UTA margin mode (Cross / Isolated / Portfolio) | `UNKNOWN` |
| Selected actual Bybit position mode (One-Way / Hedge) | `UNKNOWN` |
| Whether Veles editor values match currently selected Bybit account/subaccount | `NOT_VERIFIED` |
| P02 actual capture time/timezone, saved vs unsaved and whole-session provenance | `INCONCLUSIVE` |
| Full T02/T03/T04, Equity, Mark, IM/MMR, existing orders and F/A/H/R | `NOT_EVALUABLE` |
| `P02_verified_at` / `field_map_version` | `null` / `null` |
| Live bot setup, guaranteed liquidation distance, executable grid, account risk PASS | `NOT_AUTHORIZED` |

This partial milestone **does not** supersede the requirement to observe actual selected Bybit modes before declaring mode compatibility. It does not approve Stage 06, activate v2, alter the active/legacy agent or PR #1, or place trades.

## Transition

**Authorized next step P02-04:** nontrading Bybit/Veles **mode-compatibility evidence gate**, accepting a read-only screenshot **or user's explicit text of the actually selected modes** (not just that controls are present), together with a timestamp/timezone and scope. Then run scenario checks and self-review; solicit separate acceptance of the **P02-04 result**. If data remains absent, report `NEEDS_DATA` without preventing a useful preparatory review.

**Repo:** restrict changes to `feature/simplified-agent-v2`; do not rewrite accepted pilot records, `main`, legacy Skills or Draft PR #1. `STAGE_06_NOT_STARTED / V2_NOT_ACTIVE / NO_REAL_READY`.
