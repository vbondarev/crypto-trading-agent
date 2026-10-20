# Шаг 09.1 — протокол реализации и self-review контракта независимых испытаний

> **Статус 20.10.2026: `IMPLEMENTED / PENDING USER REVIEW`.** План 09.1–09.9 утверждён пользователем, шаг 09.1 выполнен по отдельному разрешению «Принимаю. Дальше.». **09.2–09.9 NOT STARTED**. Это документальный/синтетический шаг: independent LLM_BLIND runs **0**.

## 1. Результаты шага

- [Контракт независимого тестирования](stage-09-test-contract.md) — типы доказательств, изоляция oracle от тестируемого агента, `PREPARE → FREEZE → INVOKE → CAPTURE → EVALUATE → FIX/REGRESS`, mandatory run ledger, трассировка RT01–RT10/FR/Skills/P08, правила `PASS/FAIL_*/INCONCLUSIVE/NOT_RUN`, приоритет критичных нарушений.
- [Воспроизводимый тест](../tests/stage-09-01-test-contract-synthetic.mjs) — source-bound нормативные проверки и детерминированные вымышленные записи, включая **7/7** выявляемых in-memory source mutation (считаются **внутри** общего числа).
- [Утверждённый план 09](stage-09-plan.md) и актуальная [ревизия принятого этапа 08](stage-08-review.md). Остальные действия 09.2–09.9 **не запускались**.

**Ключевое нововведение относительно этапа 08:** требование к `LLM_BLIND` как к действительному отдельному диалогу с исходным prompt/source SHA, полным неизменённым ответом и oracle, закрытым от модели **до** завершения ответа. Публичный GitHub — не безопасное место для заранее опубликованного ожидаемого ответа теста.

## 2. Методика исполнения и фактический журнал

Получены через GitHub connector точные актуальные содержимые `stage-09-test-contract.md`, `stage-09-plan.md`, `risk-management.md`, `interaction-contract.md`, `stage-08-review.md` и тестовый `.mjs` из ветки `feature/initial-agent-mvp`. Список путей получен из PR #1. Тестовый JS-код выполнялся **в изолированном JavaScript/V8** с моделированием `readFileSync`, `existsSync`, `resolve`; относительные пути нормализованы. **Это НЕ настоящий Node.js checkout/CI**.

| Фаза | Фактический исход | Причина/исправление |
|---|---|---|
| Первый прогон | **139/141 PASS** | Два чрезмерно буквальных текстовых source-проверки ожидали иное склонение/слово, чем утверждённый смысл |
| После поправки точных тестовых якорей | **141/141 PASS** | Финансовые правила и evidence contract не ослаблялись |
| Дополнительный self-review журнала | Обнаружена семантическая неоднозначность `evidence_type=NOT_RUN` | Служебный `NOT_RUN` явно отделён от пяти типов evidence и счётчиков execution |
| Итоговый прогон усиленного теста | **144/144 PASS, 0 FAIL** | 7/7 bounded in-memory source mutations включены в 144 |

**Команда реального Node checkout (не запускалась здесь):**

```bash
node tests/stage-09-01-test-contract-synthetic.mjs
```

**Граница доказательности:** тест подтверждает документ и упрощённый валидатор записей, **не фактическое поведение агента** в независимых сессиях. 7 мутаций выявляют подмену отдельных текстовых якорей, не доказывают произвольную семантическую корректность. В журнале нет записей реальных blind-runs этапа 09.

## 3. Self-review SR-091

| Код | Контроль | Итог |
|---|---|---|
| SR-091-01 | Контракт покрывает DOC/LOCAL_JS/LLM_IN_SESSION/LLM_BLIND/LIVE и не прибавляет исторические 1746 JS к blind-runs 09 | PASS DOC/SYNTHETIC |
| SR-091-02 | Oracle не загружается в публичный GitHub/контекст агента до blind-run, включая скрытые Markdown секции | PASS DOC; реальный изолированный runtime NOT_VERIFIED |
| SR-091-03 | Run ledger содержит исходный input, SHA, env, фактические Skill read flags, raw response, отдельного оценщика и oracle private ref | PASS DOC/SYNTHETIC |
| SR-091-04 | `NOT_RUN` не является evidence, `PASS` недопустим без выполненного прогона и сохранённого ответа; 144/144 итоговых локальных тестов | PASS |
| SR-091-05 | RT01–RT10, семь Skill-slugs, FR-027–FR-040, R1/R2/R3, AD-009, H01/H04, Veles/GinArea и RECHECK имеют rubric/coverage | PASS DOC |
| SR-091-06 | Critical failure, known H04, leakage, fake READY и попытка сделки блокируют этап, а недостаток independent LLM — PENDING EVIDENCE | PASS DOC |
| SR-091-07 | RV-02/03/04/06, TV-01–TV-04, FR-038 real historical Mark H остаются OPEN, синтетика не закрывает | PASS DOC |
| SR-091-08 | Только 09.1 реализован; 09.2+ и PR merge не разрешены | PASS |

## 4. Открытые ограничения и решение для пользователя

**OPEN:** RV-02 Cross account MMR; RV-03 strict Short worst loss; RV-04 actual user P02 Veles/GinArea; RV-06 independent ChatGPT Skill runtime; TV-01–TV-04; FR-038 real dated Bybit Mark F/A/H/R. Без реального доказательного комплекса нет торгового `READY`, автоматических биржевых действий или приватного портфеля в GitHub.

**Итог:** 09.1 `IMPLEMENTED / PENDING USER REVIEW`, 09.2 `NOT STARTED`, этап 09 ещё не принят, PR #1 Open/Draft/unmerged. Следующее действие — **отдельная пользовательская приёмка 09.1**; только после неё отдельное разрешение для реализации 09.2 (каталог синтетических фикстур).
