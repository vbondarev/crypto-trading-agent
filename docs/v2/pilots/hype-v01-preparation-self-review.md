# HYPE-V01 — preparation self-review (2026-11-11)

**Decision:** `PREPARATION_PASS_WITH_BOUNDARIES / SYNTHETIC_FIXTURE_VALIDATED / ISOLATED_MODEL_NOT_RUN / REAL_P02_NOT_OBSERVED / USER_REVIEW_PENDING / V2_INACTIVE / STAGE_06_NOT_STARTED`.

## 1. Source and scope audit

Only `feature/simplified-agent-v2` gained preparation-only artifacts. Normative v2 policy pin **unchanged**: `b7123d9cf19502bf4a890f1400027f30fa213434`. Active default/legacy agent and draft PR #1 are not scope of this test.

The existing v2 `docs/v2/bot-handoff-policy.md` Gate 0 permits a draft only for LONG/SHORT postures supported by valid evidence, and requires WAIT/NOT_RECOMMENDED to produce no numeric grid. Because R02 and R02-RECHECK returned real-world WAIT, V01 uses an **explicitly fictional** isolated `LONG` candidate to exercise only the simulated route. Fixture cannot be evidence for a real trade; known real-world gaps remain blocked.

Veles official docs (public `P01`, checked Nov 11 2026):
- https://help.veles.finance/ru/platform/settings/trading-mode/
- https://help.veles.finance/ru/platform/settings/full/
- https://help.veles.finance/ru/platform/settings/take-profit/

`Простой / Свой / Сигнал` are **DCA trading modes**. Distinct separate Veles GRID-bot documentation also exists (https://help.veles.finance/ru/platform/settings/full-grid/). Hypothetical `Свой` benchmark is not a user-selected real P02 editor. No Veles interface screenshot was provided. Without actual P02, a `DOCUMENTED_ONLY DRAFT/NEEDS_DATA` may be a valid synthetic answer; `VERIFIED_FOR_MANUAL_REVIEW` never is.

## 2. Fixture quality checks (independently run)

- Generator source `tests/v2/pilots/build_hype_v01_fixture.py`, GitHub commit `687993b23767400796160490f87e429507802158`.
- Local generator SHA-256 `6cfc13726447545c33e45a4abec7961198d40239cef74eed040152799395b4f8`, Git blob `f212b91b4487eee70ef9923537e8d20bc78fa0a1`; committed text was fetched from GitHub and Git blob matched exactly. **Re-run produces identical fixture ZIP** in two independent output folders on the same Python runtime.
- Fixture ZIP `HYPE-V01-SYNTHETIC.zip`, **42,960 bytes**, SHA-256 `9e925caddbf62206b7237d60c4ec0971ca2fc6cd91c064070bf83b3b9416a872`.
- Members: `manifest.json`, four independent 300-row timeframe CSV, and `synthetic/test-cases.json`. Manifest SHA-256/length entries **5/5 PASS**.
- 4 × 300 closed, aligned continuous bars, no dupes and no OHLCV violations. Controlled clock `2026-10-20T09:00:00Z`; no trading quotes or private Bybit data.
- Cross-timeframe exact OHLC for full-overlap aggregates: `15m→1h = 75/75`, `1h→4h = 74/74`, `4h→1d = 49/49` (total 198/198 PASS).
- Independent benchmark EMA20/50/200 and RSI14 values, copied here for reviewer only (do **not** provide as user answer in test prompt; manifest contains them for integrity comparison):

| TF | Close | EMA20 | EMA50 | EMA200 | RSI14 Wilder |
|---|---:|---:|---:|---:|---:|
| 15m | 75.000000 | 74.85115 | 74.75782 | 74.27477 | 63.534 |
| 1h | 75.000000 | 74.67871 | 74.36717 | 73.71699 | 63.284 |
| 4h | 74.851839 | 74.16862 | 73.63341 | 69.02731 | 62.277 |
| 1d | 74.932860 | 71.74017 | 66.60228 | 54.46392 | 80.927 |

The daily RSI is **overbought (~80.9)**; this is intentionally visible as a contradictory warning. A careful model **may** choose `WAIT`, in which case we record `POSITIVE_BRANCH_NOT_EXERCISED` rather than force a favorable outcome. Safe discipline overrides the test's desired positive draft.

## 3. Risks and restrictions self-review

- **HIGH / residual:** This is synthetic, NOT external real market provenance or an independent live Bybit test. Synthetic validity can't upgrade R01/R02 open provenance.
- **HIGH / residual:** This run cannot certify actual Veles form mapping, fees, margin account or exchange readiness without true P02 and synchronized T02. `DRAFT` must be visibly non-actionable.
- **HIGH / guard:** `V01-B` known synthetic H04 ACTIVE requires `REJECTED/NOT_RECOMMENDED`, even if baseline A has LONG posture. Neither P02 missing nor best technical setup may weaken this.
- **HIGH / guard:** 100 USDT test budget ≠ Equity; 4+4+4 USDT planned order margin at assumed 3× ⇒ 36 USDT nominal before cost; do not claim verified IM≤30%, worst bot loss≤5%, Mark-liq gap≥15% or isolated three-position slots.
- **MEDIUM / residual:** Positive direction cannot be mandated by fixture. Daily RSI may prompt a justified WAIT, leaving Veles positive draft untested. This is an informative result, not a failed safety boundary.
- **MEDIUM / residual:** P01 pages and legacy platform docs are official-looking docs with unknown exact current UI applicability. New screenshot validation should be a subsequent separate evidence stage.
- **MEDIUM / residual:** No authenticated original model tool trace until user runs new Temporary Chat. Matching Git blob hashes cannot prove source loading in other session.
- **LOW / caveat:** ZIP-level reproducibility was checked twice under one runtime; compression-library variations across platforms could change ZIP SHA while leaving individual manifest contents identical. Fixture byte SHA is pinned for the provided artifact.

## 4. Ready for independent pilot, not accepted model

- `docs/v2/pilots/hype-v01-instructions.md` contains complete isolated-chat prompt and explicit no-execution semantics.
- `docs/v2/pilots/hype-v01-evaluation.md` was published before the model run, with 12 objective checks and critical vetoes.
- `docs/v2/pilots/hype-v01-run-record-template.md` is empty `NOT_RUN` and does not invent response.
- User can download attached fixed archive and launch a **new** Temporary Chat with the prompt. Need actual first response to perform independent assessment.
- No Stage 06, no v2 activation, no changes to original R01/R02 responses, legacy agent or PR #1.

**Review conclusion:** `PREPARATION_PASS_WITH_BOUNDARIES`. The workflow and fixture are testable without private account access; source provenance, positive path, P02, risk and actual trading ability remain untested until appropriate evidence arrives.
