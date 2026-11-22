# HYPE-P01-R02 — verified-OHLCV and conditional Veles pilot (PREPARED, NOT RUN)

**Date:** 2026-11-10.
**Status:** `R01_ARCHIVED / R02_PROMPT_PREPARED / R02_DATA_NOT_COLLECTED / INDEPENDENT_SESSION_NOT_RUN / V2_INACTIVE / STAGE_06_NOT_STARTED`.

## 1. Experiment boundaries and identity

- Distinct run `HYPE-P01-R02`, **not** a correction/replacement of `HYPE-P01-R01`. R01 unchanged at `docs/v2/pilots/hype-p01-r01-first-answer-unaltered.txt`.
- Repository `vbondarev/crypto-trading-agent`.
- Immutable **v2 normative policy commit**: `b7123d9cf19502bf4a890f1400027f30fa213434` (same as R01; do not use HEAD or the later test-preparation commits as normative policy).
- Target market **Bybit HYPEUSDT, category=linear, contractType=LinearPerpetual, quoteCoin=USDT, settleCoin=USDT**. Not Hyperliquid exchange, Bybit spot or Binance spot.
- Source data must be **real** historical HYPEUSDT linear OHLCV with UTC timestamp, raw original Bybit API response, data integrity checks and recorded observation time. No synthetic prices or inherited R01 prices.
- Test-only budget `100 USDT` is an **illustrative scenario budget**, NOT proof of user equity, free margin, bot allocation, existing orders, or permission to trade.
- No P02 Veles live editor, full T02 account, actual account liquidation/MMR, F/A/H/R stress or API keys expected. No numeric executable bot or `VERIFIED_FOR_MANUAL_REVIEW`/READY.

## 2. Data acquisition preflight (must complete before separate R02 execution)

Official API reference: https://bybit-exchange.github.io/docs/v5/market/kline

1. Run the read-only public collector `tests/v2/pilots/collect_hype_r02_ohlcv.py` on a user-controlled computer with permitted HTTPS access.
2. Command: `python collect_hype_r02_ohlcv.py --out HYPE-P01-R02-data` (Windows may use `py -3`).
3. Script queries `/v5/market/time`, `/v5/market/instruments-info` and `/v5/market/kline` for 15m, 1h, 4h and 1d; outputs `HYPE-P01-R02-data.zip`.
4. **Do not mark data verified solely from the script's success string.** Inspect the bundle `manifest.json`, all `raw/*.json`, `candles/*.csv`, SHA-256, category/symbol, no duplicate/gap, closed bars and retrieved timestamps. Verify manifest against raw original Bybit replies independently in the review session.
5. 250 minimum fully closed **continuous** candles per timeframe; collector attempts newest 300. Confirm all relevant EMA200 calculations have warm-up; from 250 bars EMA200 may depend on seed, report methodology, do not present as authoritative beyond its data.
6. If Bybit inaccessible (403, geo block, DNS, rate limit) or CSV continuity/identity check fails ⇒ `R02_BLOCKED_DATA / NOT_RUN`. **Never** substitute another exchange or forge candle continuity. A user-exported alternative is permissible only if independently attributable to the exact Bybit linear instrument, timestamps and raw provenance; otherwise classify as unverified.
7. Record ZIP SHA-256, snapshot source times, final closed-bar end per interval, acquisition machine operator's own attestation and any request error. No secrets.
8. If technical data become stale before the independent session, use them as a historical timestamped snapshot and explicitly re-check AD-009 before any current-market recommendation. Old candles do **not** prove current Mark or liquidation.

**Current fact:** in the preparation session public Bybit market API access was unavailable, and no real data bundle was obtained. This is not an R02 model test and no candle values are prefilled.

## 3. Separate-session launch

Create a **new isolated Temporary Chat outside Crypto Project** only after a real R02 data ZIP is obtained. Attach the ZIP directly. Do **not** attach R01 answer, pilot rubric or R01 self-review to the model under test. Paste this entire self-contained prompt:

### COPY PROMPT START

**PILOT HYPE-P01-R02 — REAL BYBIT OHLCV / CONDITIONAL STRATEGY / NO TRADE**

Репозиторий: `vbondarev/crypto-trading-agent`.
Pinned policy commit: `b7123d9cf19502bf4a890f1400027f30fa213434`.

Прочитай через GitHub Connector строго с `ref=b7123d9cf19502bf4a890f1400027f30fa213434` в полном объёме девять обязательных файлов:

1. `.agents/skills/market-research-v2/SKILL.md`
2. `.agents/skills/technical-analysis-v2/SKILL.md`
3. `.agents/skills/strategy-synthesis-v2/SKILL.md`
4. `.agents/skills/bot-configuration-v2/SKILL.md`
5. `docs/v2/analytical-workflow.md`
6. `docs/v2/source-acquisition-policy.md`
7. `docs/v2/bot-handoff-policy.md`
8. `docs/v2/coin-report-template.md`
9. `docs/v2/adapters/veles.md`

При материальных рисковых и платформенных утверждениях читай релевантные разделы по тому же ref: `docs/risk-management.md`, `docs/data-freshness.md`, `docs/data-sources.md`, `docs/platforms/veles.md`, `docs/platforms/configuration-contract.md`.

Если реальная загрузка девяти обязательных документов невозможна, верни `INCONCLUSIVE_SOURCE_LOAD` и не выдумывай прочтение. Не используй старый `AGENTS.md` вместо v2. В начале покажи матрицу файлов, ref, метода, результата и Git Blob SHA.

**Вход:** приложенный ZIP `HYPE-P01-R02-data.zip`, предположительно содержащий публичные данные Bybit HYPEUSDT USDT Perpetual linear. ZIP НЕ является автоматически доверенным. Бюджет 100 USDT — только условная тестовая величина, не проверенное Equity. Реальная P02 Veles и T02 Bybit отсутствуют. Не запрашивай API-ключи.

**Этап A — верификация OHLCV.** Самостоятельно распакуй ZIP, проверь `manifest.json` и SHA-256 всех файлов, происхождение и реальные тела `raw/kline-*.json`, категорию/контракт, 15m/1h/4h/1d, закрытие каждой свечи относительно server-time anchor, возрастание UTC, непрерывность, OHLCV-инварианты и минимальную длину 250 свечей. Проверь, что CSV точно получаются из raw. Выведи counts, first/last timestamps, SHA и реальные дефекты. Откажись от вычислений при провале. Не называй закрытые торговые OHLCV свечи Mark OHLCV.

**Этап B — технический анализ.** На проверенных закрытых свечах самостоятельно рассчитай EMA20/50/200, RSI14 (Wilder), MACD12/26/9 и ATR14 (Wilder) там, где хватает истории. Покажи формулы/seed-метод, последний закрытый бар, значения и используемый временной ряд. Проанализируй объёмы, HH/HL или LH/LL, поддержку и сопротивление и согласованность 15m/1h/4h/1d. Не подставляй отчёт R01, сторонние индикаторы или незакрытые свечи. Если расчёт невозможен, укажи `NOT_COMPUTED`, а не предположение.

**Этап C — актуальность и исследование.** Укажи временной разрыв между снимком CSV и временем анализа. Собери новые, фактически доступные, подтверждённые публичные Bybit/BTC/ETH, новости, X, Telegram, funding/OI при возможности. Отдели snapshot-данные от свежих. Источник `ACCESS_UNAVAILABLE` не подтверждает рыночное значение. При устаревании AD-009 — `RECHECK`, избегай текущей торговой рекомендации из одного старого ZIP.

**Этап D — Coin Profile и решение.** Построй Coin Profile с глобальным/локальным трендом `UP/DOWN/RANGE/MIXED/UNKNOWN`, аргументами, противоречиями, уверенность, BULL/BASE/BEAR, условиями и инвалидациями. Дай отдельно обоснованное `LONG/SHORT/WAIT`; наличие свечей само по себе не заставляет торговать.

**Этап E — условный сценарий Veles.** Платформа явно выбрана VELES. Покажи **условный LONG или SHORT сценарий на основе проверенных технических уровней**, только если данные его оправдывают. Если фактическое решение `WAIT`, оставь основной Veles `NOT_RECOMMENDED`, но опиши отдельный `WHAT_IF_ONLY` будущий триггер и инвалидацию, **без числовой сетки**. Если решение LONG/SHORT и факты достаточны, допускается математически обоснованный НЕИСПОЛНЯЕМЫЙ проект `DRAFT/NEEDS_DATA`: distinguish USDT notional vs margin; 100 USDT is `TEST_BUDGET_NOT_VERIFIED_EQUITY`, leverage not above 5×; no fabricated exact P02 fields, quantities or absolute account loss; all future IN, fee/funding/slippage buffers and short-loss risk must be acknowledged. If form, account or market inputs missing, stop at skeleton and calculation methodology. `VERIFIED_FOR_MANUAL_REVIEW` and `READY` запрещены.

**Этап F — риск и отчет.** Перечисли проверенные/непроверенные risk gates: плечо ≤5×, IM≤30% verified Equity, бот worst loss≤5% verified Equity, не более 3 потенциальных позиций, полный резерв сетки, Mark adverse liquidation distance≥15% при доказанной модели, московский дневной убыток≥3%, HWM DD≥15%, H04, Cross MMR/Short bounds и F/A/H/R. `NOT_EVALUABLE` не равен PASS. Без реальных T02/P02/Mark/stress не повышай готовность. Не выполняй сделок, не активируй v2 и ничего не изменяй в GitHub.

**Финал:** источник + provenance, проверенные OHLCV, воспроизводимые индикаторы, Coin Profile, LONG/SHORT/WAIT, отдельный условный Veles или отказ, риски, критические пробелы, один следующий шаг. Сохрани вывод как самостоятельный первый ответ нового R02; не исправляй R01.

### COPY PROMPT END

## 4. Pre-registered evaluation and preservation

- Evaluation rubric: `docs/v2/pilots/hype-p01-r02-evaluation.md`.
- Original first answer of R02 goes in **new** `hype-p01-r02-first-answer-unaltered.txt` only **after** user supplies the actual response (never invent/pre-populate).
- Keep raw ZIP and SHA identity of input evidence separately; never include personal account secrets or pretend a test budget is account Equity.
- Source trace attestation: if no actual session tool log, record `SESSION_PROVENANCE_UNVERIFIED` even when all Git Blob SHA match.
- Do not use Stage 06 activation, v2 cutover or user bot API activity as a workaround.

## 5. Status

`R01_ARCHIVED / R01_INDEPENDENT_PROVENANCE_UNVERIFIED / R02_PREPARED / R02_NOT_RUN / BYBIT_REAL_OHLCV_NOT_YET_VERIFIED / V2_INACTIVE`.
