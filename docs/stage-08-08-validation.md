# Шаг 08.8 — протокол отчётных шаблонов и инкрементального RECHECK

> **Статус: `IMPLEMENTED / PENDING USER REVIEW` (20.10.2026).** 08.7 принят пользователем отдельным решением «Пинимаю. Дальше.», разрешена только реализация 08.8; **08.9 `NOT STARTED`**. PR #1 Open/Draft.

## 1. Артефакты

- [Шесть шаблонов P08-36–P08-41, RC01–RC10 dependency map, RF01–RF40](workflows/report-templates.md).
- [Тесты report/RECHECK 08.8](../tests/stage-08-08-report-templates-synthetic.mjs).
- [Формальная приёмка 08.7](stage-08-07-validation.md#5-формальная-приёмка-087-и-разрешение-088--20102026).
- [RT01–RT10 и ASK/ANALYZE/CHOOSE/RECHECK/STOP](workflows/interaction-contract.md), [freshness AD-009](data-freshness.md), [T01–T06](input-templates.md), [FR gates](risk-management.md), [принятые промпты 08.2–08.7](stage-08-plan.md).

## 2. Что проверяется

Нормативная матрица **RF01–RF40** — ожидаемые результаты на вымышленных ситуациях, **не** 40 независимых запусков ChatGPT. Тесты проверяют разделение осей report mode/dialogue/decision, краткость R1 без приватного T02/P02, разделение источников и времени, R2 без выдуманных уровней, S0–S3/H01, R3 status precedence/hard gates, RC01–RC10 invalidation scope, AD-009 trigger даже внутри TTL и source-bound мутации нормативных строк. Это документально-синтетический слой, а не реальная интеграция с биржей.

## 3. Реально выполненные тесты и self-review

Заполнить только после фактического исполнения. Команда для независимого Node.js checkout ≥18:

```bash
node tests/stage-08-08-report-templates-synthetic.mjs
```

## 4. Ограничения и передача к пользовательской приёмке

OPEN: RV-02 real Cross MMR, RV-03 bounded Short maximum loss, RV-04 actual P02 Veles/GinArea, RV-06 independent Skill runtime, TV-01–TV-04, real historical Bybit Mark H/F/A/H/R FR-038. Ни реальная T02/T03/T04, ни Bybit Mark, ни UI GinArea/Veles, ни биржевые команды, ни запуск самостоятельного наблюдения не предусмотрены/не проверены.

**08.8 `IMPLEMENTED / PENDING USER REVIEW`, 08.9 `NOT STARTED`** до отдельного прямого согласия пользователя. Документ не разрешает merge PR или реальные ордера.
