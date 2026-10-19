# Шаг 08.4 — валидация промптов портфеля и H01 recovery

> **Статус: `IMPLEMENTED / PENDING USER REVIEW` (20.10.2026).** 08.3 принят пользователем командой «Принимаю. Дальше.»; отдельно разрешён 08.4, но он ещё не принят. **08.5 `NOT STARTED`**, PR #1 Open/Draft.

## 1. Проверяемые артефакты

- [Шесть копируемых промптов P08-12–P08-17 и 36 нормативных PR01–PR36](prompts/portfolio-recovery.md).
- [Локальный синтетический JS-тест](../tests/stage-08-04-portfolio-recovery-synthetic.mjs).
- [Приёмка предыдущего шага 08.3](stage-08-03-validation.md#6-формальная-приёмка-083-и-разрешение-084--20102026).
- [Принятые Skills](../.agents/skills/portfolio-analysis/SKILL.md), [risk-assessment](../.agents/skills/risk-assessment/SKILL.md), [strategy-planning](../.agents/skills/strategy-planning/SKILL.md), [data-verification](../.agents/skills/data-verification/SKILL.md), [правила S0–S3 / H01](risk-management.md) и [контракт диалога](workflows/interaction-contract.md).

## 2. Сценарии и методика

**PR01–PR36** являются нормативными ожиданиями, не 36 запусками настоящего агента. Локальные проверки моделируют биржевые position slots, `leavesQty`, статусы FILLED/CANCELLED/partiallyFilled, владельцев и подтверждённые совпадения `orderId`, S0/S1/S2 future IN, нетто H01 с отдельно посчитанными fees/funding, границы `R2 vs R3`, H02/H03/H04 и timestamp. Прямые проверки исходного Markdown нужны, чтобы модель безошибочных тестов не маскировала правки нормативного текста. Чувствительные аккаунтные данные и live котировки не использовать.

## 3. Фактическая проверка и self-review

Заполняется после исполнения. Команда для Node.js ≥18 при полном checkout:

```bash
node tests/stage-08-04-portfolio-recovery-synthetic.mjs
```

## 4. Открытые вопросы и приёмка

- **RV-02** Cross account-wide MMR/ликвидация, **RV-03** доказанная верхняя Short-loss bound, **RV-04** текущая реальная P02, **RV-06** независимый Skills runtime; также TV-01–TV-04 и реальные F/A/H/R FR-038.
- Никакие тестовые скриншоты/числа не являются состоянием личного счёта. Риски `FR-029 ≤30%`, `FR-030 ≤5%`, `FR-031 ≤5×`, `FR-032 ≥15%`, `FR-033 ≤3 slots`, `FR-034 100% future reserve` не доказаны реальной средой.
- Статус **`08.4 IMPLEMENTED / PENDING USER REVIEW`**, 08.5 **`NOT STARTED`**. Отдельное решение пользователя требуется для закрытия 08.4 и начала 08.5.
