# HYPE-V01 / P02-05-E02 — user attests positive available futures funds in Bybit UTA subaccount

**Recorded:** 2026-11-14 (chat calendar date; Bybit observation time was not supplied).  
**Disposition:** `USER_ATTESTED_POSITIVE_FUTURES_AVAILABILITY / VELES_INDICATIVE_ZERO_CONFLICT / CAUSE_UNDETERMINED / P02_05_IN_PROGRESS / USER_ACCEPTANCE_PENDING`.  
**Scope:** user-supplied qualitative evidence and documentation-based differential diagnosis; **not** authenticated Bybit account data, not an API test, not a trading or funding instruction.

## 1. Exact user evidence and source strength

The last question requested **whether the same Bybit subaccount's UTA shows available collateral for derivatives greater than zero**, without asking for numbers. The user responded:

> «В этом субаккаунте Bybit UTA есть доступные средства для торговли фьючерсами.»

Classify as `USER_ATTESTED_AVAILABLE_FUTURES_FUNDS_POSITIVE`. This answers the intended qualitative question, but it supplies **no numerical amount, currency breakdown, source screen label, native server timestamp, or independent account identity confirmation**. The statement does not prove that **free USDT**, as opposed to *cross-collateral value or USD-denominated margin*, is positive. It does not prove that Veles can access the same available funds or that Bybit API permission/synchronization is healthy.

Earlier in P02-05-E01 the user answered `«Субаккаунт»` when asked if the selected Veles connection is for a subaccount. This is user-supplied account-type information, **not an independently matched subaccount ID**.

**Prior UI S7:** Veles `БАЛАНС НА БИРЖЕ: 0 USDT` (indicative), deposit empty, insufficient-funds warning, Cross and 1× shown in an editor. These are historic UI observations with unverified screenshot timestamp; they cannot be time-synchronized automatically with the user's current qualitative Bybit statement. Therefore label the finding `APPARENT_METRIC_SCOPE_DISCREPANCY / TIME_ALIGNMENT_UNVERIFIED`, not an authenticated real-time simultaneous contradiction.

## 2. Official explanation, separated from the user's facts

- Veles official DCA settings, https://help.veles.finance/ru/platform/settings/full/ : the **indicative** exchange balance is a noneditable quote-currency amount and may display only unused assets, not the entire trading account.
- Bybit official UTA FAQ, https://www.bybit.com/en/help-center/article/FAQ-Unified-Trading-Account : in UTA Cross, supported non-USDT assets may serve as collateral; `Margin Balance` and order-placement `Available Balance` are distinct from physical USDT holdings.
- Bybit UTA asset navigation, https://www.bybit.com/en/help-center/article/Unified-Trading-Account-Asset-Page : total Equity, available balance and currency wallet balances are different measures; order-zone `Available Balance` is not the same as transfer-out availability.
- Veles official Bybit subaccounts, https://help.veles.finance/ru/exchange/bybit/subaccount/ : each subaccount may be connected by its own API key (existing connection only; do not request keys or create/relink one).

These support **plausible metric/account mismatches** but cannot diagnose the user's actual connection without more evidence. Public docs may evolve and account behavior may depend on UI version and risk settings.

## 3. Update to original P02-05 hypotheses (non-exclusive)

| Code | Original possibility | New evidence evaluation | Current status |
|---|---|---|---|
| D01 | Veles connected to main instead of intended subaccount | User said `Субаккаунт`; exact Veles→Bybit account correspondence remains unauthenticated | `LESS_LIKELY_USER_ATTESTED / NOT_FULLY_EXCLUDED` |
| D02 | Funds in Funding account/another account rather than intended UTA | User explicitly states **available trading funds in target subaccount's UTA**; 'all funds only in Funding' is less likely, but mixed holdings possible | `WEAKENED / NOT_FULLY_EXCLUDED` |
| D03 | Veles quote-currency free USDT vs Bybit multicurrency available collateral | **Directly consistent with the qualitative discrepancy**, but asset mix/USDT free balance not known | `PLAUSIBLE / NOT_CONFIRMED` |
| D04 | All free margin consumed by positions, orders or other bots | A positive user-reported available balance weighs against **zero total free margin** at user's observation; some reservation can still exist | `ZERO_FREE_MARGIN_LESS_LIKELY / EXPOSURE_UNKNOWN` |
| D05 | Veles stale/mis-scoped API balance, permission/synchronization or binding health | Unresolved; zero display plus positive UTA availability could motivate a read-only connection status check | `POSSIBLE / NOT_CONFIRMED` |
| D06 | No usable collateral in intended subaccount UTA | **Less likely** if user correctly reads derivatives-available funds; amount/time/metric still unauthenticated | `LESS_LIKELY_USER_ATTESTED / NOT_FULLY_EXCLUDED` |

**No categorical conclusion** (e.g. 'Veles bug', 'wrong API', 'USDT balance is zero', 'no need for funds', 'funding required') is justified yet.

## 4. L0–L7 evidence gates after E02

| Gate | Result | Limit |
|---|---|---|
| L0 target account | `USER_INTENT_SUBACCOUNT` | Established earlier, independent identity not proven |
| L1 actual Veles binding | `USER_ATTESTED_SUBACCOUNT_TYPE / EXACT_LINKAGE_UNVERIFIED` | No independent subaccount match |
| L2 Veles 0 USDT | `INDICATIVE_ZERO_SCREENSHOT / TIME_UNVERIFIED` | Historic UI value not actual Equity or verified current free quote balance |
| L3 Bybit UTA available derivatives funds | `USER_ATTESTED_POSITIVE / NOT_SOURCE_VERIFIED` | No currency composition or independent current timestamp |
| L4 other exposures | `NOT_CHECKED` | May impact free currency and overall risk |
| L5 freshness and temporal comparison | `INCONCLUSIVE` | Screenshot and verbal response were not proven simultaneous |
| L6 privacy/read-only | `PASS_NO_ACTION` | No account tools, keys, sync changes or transfers |
| L7 financial readiness | `NOT_EVALUABLE / NO_TRADE_READY` | No full T02, Mark/MMR, grid reserve, H04 or F/A/H/R |

## 5. Single most informative next safe question

**Are the funds available for derivatives in the subaccount held as freely available USDT, or mainly as other collateral assets under UTA Cross?** Ask user to choose `USDT`, `Другая валюта/обеспечение`, `И то и другое`, or `Не знаю`. No amount, wallet screenshot, account identifier or API key needed. Do **not** infer answer from earlier `0 USDT` screen.

- If **mainly other collateral**: the quote-currency-vs-cross-collateral scope hypothesis D03 becomes more plausible but is not uniquely proven.
- If **free USDT is positive in same target subaccount**: D03 alone is less explanatory; prioritize read-only Veles connection status and time-aligned currency-free balance without a key rotation or reconnection.
- If **unknown**: explain that Bybit asset holdings and order-zone available funds are distinct, suggest only passive viewing of current assets/available values.

Future checks must still establish exact same account and observation times; no live risk calculation or bot activation may follow automatically.

## 6. Status and strict isolation

`P02_05_E02_USER_AVAILABLE_FUNDS_RECORDED / BALANCE_DISCREPANCY_UNRESOLVED / SELF_REVIEW_PENDING / USER_ACCEPTANCE_PENDING`.

No new bot configuration, trade, deposit/fund transfer, API-key disclosure, account settings edit, private screenshots in public GitHub or migration of the synthetic `HYPE-V01 CUSTOM` bot setup. `P02_verified_at=null`, `field_map_version=null`, `STAGE_06_NOT_STARTED`, `V2_NOT_ACTIVE`. Work restricted to `feature/simplified-agent-v2`; legacy agent, `main`, `AGENTS.md`, prior pilot files and PR #1 untouched.
