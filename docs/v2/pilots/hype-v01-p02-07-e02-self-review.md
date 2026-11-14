# HYPE-V01 / P02-07-E02 — self-review of open-position category attestation

**Reviewed:** 2026-11-14.
**Disposition:** `SELF_REVIEW_COMPLETE / OPEN_POSITIONS_USER_ATTESTED / ORDER_AND_BOT_STATUS_UNKNOWN / P02_07_IN_PROGRESS / USER_ACCEPTANCE_PENDING / NO_TRADE_READY`.

## 1. Evidence and authenticity limits

The user identified the category `«Открытые фьючерсные позиции»` when asked which of three nonexclusive categories exists on the target Bybit subaccount. The evidence report is `docs/v2/pilots/hype-v01-p02-07-e02-open-futures-positions.md`, initial commit `c01ac07522eac80865757314cba8daa70e05e4c7`, Git Blob `25d31d8b1c60d9c187148da84e15e21e6acf74d5` read back exactly.

This is a **same-assistant documentation self-review**, not direct Bybit/UTA account access, independent witness verification or an actual cross-margin stress/likelihood calculation.

## 2. Scoped checks

| Control | Result | Evidentiary boundary |
|---|---|---|
| User response retained faithfully | `PASS` | A category, not a position snapshot |
| Existence of at least one position correctly derived | `PASS` | User-attested only |
| No assumption of the number of positions | `PASS` | Counts unknown |
| Active/conditional orders remain UNKNOWN | `PASS` | Omitted does not mean absent |
| Bots remain UNKNOWN | `PASS` | Omitted does not mean absent |
| No assumption of HYPEUSDT or side/slot | `PASS` | Hedge sides still unknown |
| T03 conditional applicability noted | `PASS` | Future full R3 separately approved |
| T02 and T04 account-wide obligations preserved | `PASS` | Cannot derive empty account |
| No account numbers, real financial data or API operations | `PASS` | Public repository only safe summary |
| Next question limited to target-symbol position existence | `PASS` | No amounts, executions or bot changes |

**10/10 documentary/policy checks PASS** — not ten real functional or risk tests.

## 3. Adversarial findings

| ID | Severity | Finding | Required restriction |
|---|---|---|---|
| SR-P02-07-E02-01 | HIGH | Only position category is confirmed, other two still UNKNOWN | Do not silently mark orders/bots absent |
| SR-P02-07-E02-02 | HIGH | Existence is user-attested, no fresh complete T02/T03 | `NEEDS_DATA` for financial risk |
| SR-P02-07-E02-03 | HIGH | Exact current positions, Hedge LONG/SHORT slots, overlap with HYPE unknown | Ask one HYPE position-category question before ownership evaluation |
| SR-P02-07-E02-04 | HIGH | Cross portfolio IM/MMR/liquidation, full future-grid reserve and H04 not checked | `NO_TRADE_READY` |
| SR-P02-07-E02-05 | MEDIUM | Different instruments on same Cross portfolio may still affect HYPE risk | Require complete T02 later even if no HYPE position |
| SR-P02-07-E02-06 | MEDIUM | Existing-position-adoption UI OFF is not proof of absence of an existing position | Never infer separate ownership/position allocation from that UI |
| SR-P02-07-E02-07 | MEDIUM | No verified exchange observation time or stable same-subaccount identity | Keep `TIME_UNVERIFIED` |
| SR-P02-07-E02-08 | LOW | Review is same-author structured assessment | Not independent functional validation or acceptance |

## 4. Handoff and stop

`P02_07_E02_DOCUMENTED / SELF_REVIEW_COMPLETE / USER_ACCEPTANCE_PENDING / NO_TRADE_READY`.

Ask the user simply whether any **HYPEUSDT** future position exists on the subaccount: `нет / LONG / SHORT / обе стороны / не знаю`. They may answer without revealing sizes or account identifiers. Continue category-by-category data collection only with user cooperation and separate appropriate consent; never start Tier B/C or real R3 automatically.

The user **has not approved the completed P02-07 step** by merely providing a fact. Old agent, `AGENTS.md`, `main` and Draft PR #1 not changed; v2 not activated and Stage 06 not started.
