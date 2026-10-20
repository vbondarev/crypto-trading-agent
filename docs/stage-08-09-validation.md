# Шаг 08.9 — протокол сквозной интеграционной ревизии этапа 08

> **Статус: IMPLEMENTED / PENDING USER REVIEW (20.10.2026).** Шаг 08.8 отдельно формально принят пользователем. Выполняется только интеграционная ревизия 08.9; **весь этап 08 ещё не принят**, этап 09 NOT STARTED. PR #1 Open/Draft.

## 1. Артефакты

- [Интеграционная ревизия и карта 41 промпта / RT01–RT10](stage-08-review.md).
- [Синтетические сквозные проверки W08-01–W08-14](../tests/stage-08-09-integration-synthetic.mjs).
- [Приёмка 08.8 и разрешение 08.9](stage-08-08-validation.md#5-формальная-приёмка-088-и-разрешение-089--20102026).
- [Исходные контракты RT, AD-009, risk FR](workflows/interaction-contract.md), [план этапа](stage-08-plan.md), [07 Skills](stage-07-skills-contract.md).

## 2. Метод и границы

W08-01–W08-14 — **нормативные синтетические ожидания**, не 14 независимых ChatGPT blind-runs. Сквозной JS проверяет реальные Markdown-источники из GitHub и детерминированные вымышленные сценарии, разделение режимов, выбор платформы/стратегии, R3 только по P02/Bybit/FR-risk, AD-009, H01, H04, маршрут RT07/RT08/RT09. Нельзя считать PASS от одного заголовка реальным применением этих правил в LLM, реальной торговлей или доказанным auto Skill runtime.

## 3. Выполненные тесты и self-review

Заполнить после исполнения на настоящих актуальных GitHub-файлах. Команда полноценного независимого Node.js checkout:

```bash
node tests/stage-08-09-integration-synthetic.mjs
```

## 4. Блокеры и ожидаемое решение

OPEN: RV-02 Cross MMR, RV-03 strict Short upper loss, RV-04 actual user P02, RV-06 independent Skills runtime, TV-01–TV-04, исторический реальный Bybit Mark в FR-038 F/A/H/R. Секреты/данные живого пользователя и аккаунт в GitHub не публиковались; реальные API и торговые команды не исполняются. Проверка частного runtime, Node CI и LLM blind-run — отдельная задача и не может быть ложно заявлена.

**08.9 IMPLEMENTED / PENDING USER REVIEW; этап 08 PENDING FORMAL STAGE ACCEPTANCE; этап 09 NOT STARTED**, PR #1 Open/Draft, no merge.
