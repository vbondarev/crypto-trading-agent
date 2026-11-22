# HYPE-V01 / P02-03-E01 — visual read-only evidence: leverage, Cross margin and indicative Veles balance

**Review date:** 2026-11-12 (calendar date of this chat turn).  
**Status:** `PARTIAL_VISUAL_PASS / Veles_CROSS_SELECTED / LEVERAGE_1X_DISPLAYED / Veles_BALANCE_0_DISPLAYED / P02-03_IN_PROGRESS / USER_ACCEPTANCE_PENDING`.  
**Scope:** supplemental user-provided screenshot of a Veles editor; this is a **read-only visual observation**, not proof of authenticated Bybit UTA/account status, complete P02 verification, financial safety or trade permission.

## 1. Evidence source and custody

| Attribute | Value |
|---|---|
| Screenshot label | `S7` |
| User conversation upload | `image(6).png` |
| Dimensions | 868 × 343 px |
| Actual uploaded bytes | 49,513 |
| SHA-256 | `769885427392c471e9b1f674e7c2915be113d71d8d97c3c0398ab2ee71887a09` |
| EXIF | Empty |
| Screenshot taken at/timezone | `UNKNOWN`: no capture time/timezone evidenced inside uploaded screenshot |
| Same session as S4–S6 | `USER_ATTESTATION_NOT_RECEIVED` |
| Raw image committed publicly | **NO** — hashes and sanitized UI facts only |

The upload/review date is **not** `captured_at` and not market-source `observed_at`. No API key, private balance snapshot, real account login trace, Bybit wallet T02 or live order history was read.

## 2. What is actually visible in S7

| ID | Exact visible Veles UI | Displayed state | Evidence interpretation |
|---|---|---|---|
| `S7-01` | `Депозит` / `Введите сумму депозита` | Input empty, with USDT icon | **No bot budget entered**, even if previous user had a trading budget in another discussion |
| `S7-02` | `БАЛАНС НА БИРЖЕ` | **0 USDT** | **Veles indicative balance only**, *not* verified wallet, Equity, portfolio availability or proof of zero funds on Bybit |
| `S7-03` | Orange warning | `На вашем биржевом балансе нет средств для запуска торгового бота. Читайте статью, как пополнить баланс на бирже.` | Platform reports **insufficient funds for bot launch** in this view; no evidence about *why* or actual user account balance |
| `S7-04` | `Плечо` | Slider's value box shows **1**, lower bound text `1x`, right end shows `75` | **Displayed 1× leverage** in the Veles editor. The printed 75 is a visible scale endpoint, *not* independent proof that 75× is permitted for this instrument/account |
| `S7-05` | `ТИП МАРЖИ` | `Перекрестная` | Veles editor **Cross** selected; **not** evidence of actual Bybit UTA/account margin mode or successful application to an exchange position |
| `S7-06` | `РЕИНВЕСТ` | Grey switch/handle left, visually **OFF** | UI appearance only; does not prove a saved or running bot state |

Previous accepted P02-02/E02–E04 screenshots, viewed separately, showed Veles `Bybit Futures` connection label, `HYPE/USDT`, direction `LONG`, orders mode `Простой/SIMPLE`, no selected preset, and position inclusion switched to visually OFF in the last S6. **S7 does not show the pair, direction or connection header** and cannot authenticate that all images belong to a single synchronized editor session without user attestation.

## 3. Documentation cross-check and precise limits

- `docs/platforms/veles.md` documented VL-05 Deposit, VL-06 Indicative Exchange Balance, VL-07 Leverage, VL-08 Margin Type and VL-09 Reinvest; current screenshot verifies that these **labels/controls are visible**, not that any order can be placed.
- Official Veles DCA settings help: https://help.veles.finance/ru/platform/settings/full/ describes the indicative balance as potentially **not the entire amount** and warns that changing leverage for a symbol can affect an existing position, even before position-lock checks.
- Bybit official UTA FAQ: https://www.bybit.com/en/help-center/article/FAQ-Unified-Trading-Account separates wallet/equity/margin/available balance. A Veles 0 USDT indicator does not substitute for Bybit T02.
- Official UTA risk guide: https://www.bybit.com/en/help-center/article/UTA-Trading-Rules-Liquidation-Process describes account-level Cross/Portfolio liquidation context; no actual Bybit MMR is present.
- Bybit `Cross` **must not be certified** simply because the Veles form currently displays `Перекрестная`. Confirmation from Bybit UI/actual account mode remains missing.
- A displayed editor leverage **1× is at/below the existing proposed cap 5×**, but only the *visible draft setting* meets that one numerical upper bound. This is not a portfolio-risks pass nor evidence that Bybit will safely set/retain 1×.

**Critical caution:** do not toggle leverage, switch margin type or click Save/Create/Update/Run to resolve evidence gaps. Veles documentation warns those changes may affect existing positions or the account, even if the new bot does not open a trade.

## 4. P02-03 gates M0–M7 after S7

| Gate | Result | Evidence and blocker |
|---|---|---|
| M0 SOURCE | `VISUAL_EVIDENCE_RECEIVED` | S7 screenshot bytes/hash inspected; actual capture time absent |
| M1 IDENTITY | `PARTIAL` | Bybit Futures/HYPE/USDT/LONG/SIMPLE from S4–S6; S7 section lacks headers and same-session attestation |
| M2 LEVERAGE | `VISUAL_1X_ONLY` | Veles editor value shown 1×; Bybit real position/account leverage not verified |
| M3 MARGIN | `VELES_CROSS_VISIBLE / BYBIT_MODE_UNVERIFIED` | Cross shown in form; actual UTA mode, One-Way/Hedge and portfolio margin state unknown |
| M4 TIME | `INCONCLUSIVE` | No image capture timestamp, timezone, or user same-session attestation; upload date not substituted |
| M5 SIDE EFFECT | `SAFE_READ_ONLY` | No Veles/Bybit UI action performed by agent; neither leverage nor margin changed by this review |
| M6 RISK | `NOT_EVALUABLE` | Balance is indicative, no full T02/T03/T04, actual Equity, Mark, IM/MMR, complete future orders, H04 status, or F/A/H/R |
| M7 REPORT | `PARTIAL_ONLY / USER_ACCEPTANCE_PENDING` | Separate E01 observation plus self-review required, not complete P02-03 sign-off |

**No executable `BotConfigurationProposal` from S7.** `P02_verified_at=null`, `field_map_version=null`, `VERIFIED_FOR_MANUAL_REVIEW` forbidden; no numeric Veles grid, entry conditions, TP/SL, real risk PASS or trade execution.

## 5. Evidence needed to close P02-03

A **read-only** and **redacted** Bybit settings screenshot or direct text of the **currently selected UTA margin mode** (`Cross/Isolated/Portfolio`) and **position mode** (`One-Way/Hedge`) if safely visible; the capture date/time and timezone, plus a brief user confirmation whether the screenshots correspond to the **same Veles draft/account context**. **Do not** navigate into or confirm a mode-change dialog merely to get evidence.

If these cannot be observed safely, mark `NOT_SAFELY_OBSERVABLE` and preserve `P02-03 PARTIAL` rather than invent values. The complete private T02/portfolio snapshot is **not requested in this substep**; later financial risk checks must separately obtain it with AD-009 freshness criteria.

**Result:** `P02-03-E01 PARTIAL_VISUAL_OBSERVATION / NEW_UI_VALUES_RECORDED / BYBIT_ACCOUNT_MODE_UNVERIFIED / SELF_REVIEW_PENDING / P02-03_PENDING_ACCEPTANCE`.

**Isolation:** `feature/simplified-agent-v2` only, previous pilot artifacts immutable, legacy agent/`AGENTS.md`/`main`/Draft PR #1 untouched; `Stage 06 NOT_STARTED`, `v2 NOT_ACTIVE`.
