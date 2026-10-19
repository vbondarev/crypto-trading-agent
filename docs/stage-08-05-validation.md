# Шаг 08.5 — протокол риск-решения и пользовательского выбора стратегии

> **Статус: `IMPLEMENTED / PENDING USER REVIEW` (20.10.2026).** Пользователь формально принял 08.4 с незавершённой на момент приёмки общей регрессией, разрешив реализацию **08.5**, но не его автоматическую приёмку. **08.6 `NOT STARTED`**, PR #1 Open/Draft.

## 1. Артефакты

- [Шесть копируемых промптов P08-18–P08-23, сравнительная матрица и 40 нормативных RD01–RD40](prompts/risk-strategy-decision.md).
- [Воспроизводимые синтетические JS-проверки](../tests/stage-08-05-risk-strategy-synthetic.mjs).
- [Формальная приёмка 08.4 и запись о переносе регрессии](stage-08-04-validation.md#6-формальная-приёмка-084-и-разрешение-085--20102026).
- [Источники FR-027–FR-040](risk-management.md), [risk-assessment Skill](../.agents/skills/risk-assessment/SKILL.md), [strategy-planning Skill](../.agents/skills/strategy-planning/SKILL.md), [portfolio-analysis Skill](../.agents/skills/portfolio-analysis/SKILL.md), [RT01–RT10](workflows/interaction-contract.md).

## 2. Методика и обязательные ограничения

**RD01–RD40 — нормативные тестовые ожидания, а не 40 отдельных ChatGPT-запусков.** Проверяются отдельные числовые неравенства, равенства границ, приоритет активного H04 и неполных данных, условия R2/R3, затронутые FR-027–FR-040, пользовательский CHOOSE и отсутствие автоматических торговых действий. Значения синтетические, не Bybit quotes/account.

Предшествующая оговорка 08.4: надо повторно запустить все 08.1–08.4 тесты после последних изменений и проверить ссылки. Исполненные результаты записывать только после настоящего запуска. Запуск из checkout Node.js ≥18:

```bash
node tests/stage-08-01-interaction-contract-synthetic.mjs
node tests/stage-08-02-market-overview-synthetic.mjs
node tests/stage-08-03-technical-scenario-synthetic.mjs
node tests/stage-08-04-portfolio-recovery-synthetic.mjs
node tests/stage-08-05-risk-strategy-synthetic.mjs
```

## 3. Фактические результаты и self-review

Заполняется после проверок. Нельзя автоматически переносить прежние PASS как свежий запуск, заявлять полноценный Node.js/CI, реальные Bybit P02/T02/F/A/H/R или независимый ChatGPT Skills runtime.

## 4. Сохраняемые блокеры и приёмка

- RV-02 (Cross MMR/ликвидация), RV-03 (максимальный Short-loss), RV-04 (фактическая форма P02), RV-06 (независимое исполнение Skills), TV-01–TV-04 и реальные датированные Bybit historical Mark H из FR-038 — **OPEN**.
- H02/H03 без достоверной истории — `NOT_CHECKED`, не автоматическая блокировка и не доказанное отсутствие H04. **Доказанный активный H04** запрещает увеличение риска.
- **08.5 `IMPLEMENTED / PENDING USER REVIEW`** до отдельной приёмки; **08.6 `NOT STARTED`**. Никаких приватных данных в публичном GitHub, самостоятельных ордеров/бота/`READY`, без merge.
