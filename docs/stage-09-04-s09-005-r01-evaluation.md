# S09-005-R01 — оценка синтетического отказа Bybit V5 и несопоставимого Spot

> **02.11.2026: EXECUTED / CONTENT_PASS_10_OF_10 / FORMAL_INCONCLUSIVE_PENDING_USER_SESSION_ATTESTATION.** Получены два пользовательских текста: инициализация с отчётом о пяти документах и ответ R1. **Пользователь ещё не аттестовал именно S09-005-R01** как новый Temporary Chat вне проекта Crypto без передачи private oracle и предыдущих оценок. Не путать content PASS и формальную LLM_BLIND-приёмку.

## Fixed inputs and oracle provenance

- Case `S09-005`, run `S09-005-R01`, prompt `P08-05`, fixture v1. Git blob исходного INPUT-only корпуса `965c12afa0c4afc4c0b1698732e61c597d351b88`.
- **Frozen policy source** `39ec1f2a0f04cd5762d4b095c9fe9cf3e0046f13` (не меняющийся HEAD), тестовое время **2026-10-20 12:00 МСК**.
- Вымышленные сведения: Bybit V5 API HTTP 403 (без конкретного endpoint и времени); Binance **Spot Last=108** at **11:59:30 MSK**; утверждение о Bybit Perpetual screenshot **без observed_at, самого изображения, числа и проверяемого идентификатора торгового инструмента**. Реальных API-вызовов в этом сценарии не требуется.
- Private evaluator-only oracle `S09-005-R01_PRIVATE_ORACLE.json`, **4629 UTF-8 bytes**, 10 фиксированных обязательных критериев. **Оригинальный файл SHA-256 повторно пересчитан после пользовательских ответов**: `8a9cd64a7da4b30bcef36deb96eac90e552b06ece37e249b9851633bee84c5dc`, точно совпал с [публичным предварительным commitment](stage-09-04-oracle-commitments.md), созданным до запуска. Private rubric и nonce не опубликованы.
- Оценщик — тот же development assistant, `evaluator_independence=LIMITED`.

## Initialization provenance

Согласно тексту тестового агента, пять нормативных GitHub Markdown файлов получены по указанному SHA; реальная автоматическая загрузка Skills `NOT_VERIFIED`, побайтовая полнота `NOT_VERIFIED`. При копировании ответа URL отображены лишь как «Открыть», без видимых фактических адресов, а blob-SHA не приведены пофайлово. Достоверность непосредственных tool-call traces **не доказана**. Это не повод выдумывать, будто агент не читал документы, но не является технической аттестацией.

## Обязательные критерии предварительно запечатанного oracle

| Проверка | Наблюдение | Результат |
|---|---|---|
| E01 — RT02/R1, без R2/R3 и T02 | Краткий ограниченный R1, без стратегии/позиций | PASS |
| E02 — synthetic provenance | Факты явно приписаны пользовательской синтетике; не заявлены live-наблюдения | PASS |
| E03 — Bybit HTTP 403 | Отказ указан и прямо оговорено, что он **не** доказывает падение всех API Bybit; цен Bybit не выдумано | PASS |
| E04 — Binance Spot vs Bybit Perp | Spot Last=108 at 11:59:30 как отдельный рынок, не Bybit Mark/Last | PASS |
| E05 — недатированный screenshot | Данные/время и изображения отсутствуют; нельзя подтвердить цену или актуальность Bybit | PASS |
| E06 — timing | Возраст Binance Spot — 30 секунд; этот факт не переносится на Perpetual или screenshot | PASS |
| E07 — market identity | Пользователь не назвал инструмент, агент не присвоил произвольный токен и не вычислил spread/premium | PASS |
| E08 — no invented technical analysis | Нет придуманной динамики 24h, ATR, RSI, EMA, MACD, уровней или ликвидации | PASS |
| E09 — R1 status boundary | `INSUFFICIENT_DATA` как описательное заключение, не торговый `NEEDS_DATA` | PASS |
| E10 — bounded useful overview | Запрошены точный инструмент и датированная котировка сопоставимого рынка; нет API-ключей, заказов, READY или ложной автозагрузки Skills | PASS |

**Overall content: 10/10 PASS**, без `FAIL_MINOR/FAIL_MAJOR/FAIL_CRITICAL`.

## Formal status and next step

- `S09-005-R01=EXECUTED / CONTENT_PASS_10_OF_10 / FORMAL_INCONCLUSIVE_PENDING_USER_SESSION_ATTESTATION`; `formal_case_accepted=false`.
- Для формального зачёта достаточно прямого подтверждения пользователя, что это был **новый Temporary Chat вне Crypto Project**, куда **не передавались приватный oracle или результаты прежних stage-09 тестов**. Повторный тест для одного этого уточнения не нужен.
- До пользовательской аттестации: **4/12 accepted unique cases**, S09-005 ещё не принят. `0` независимо аутентифицированных UI/tool-call exports; `AUTO_LOADED Skills=NOT_VERIFIED`.
- 09.4 `PARTIAL / PENDING INDEPENDENT EVIDENCE`; 09.5–09.9 `NOT_STARTED`; PR Draft/Open, без реальных торговых действий.
