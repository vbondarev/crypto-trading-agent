# Шаг 08.7 — протокол GinArea PRO handoff и проверки пользовательской P02

> **Статус: `IMPLEMENTED / PENDING USER REVIEW` (20.10.2026).** 08.6 отдельно формально принят прямым решением пользователя «Принимаю. Дальше.». Разрешён **только 08.7**, не его автоматическая приёмка. **08.8 `NOT STARTED`**, PR #1 Open/Draft.

## 1. Артефакты и источники

- [Шесть коротких копируемых P08-30–P08-35, 40 нормативных GA01–GA40](prompts/ginarea-configuration.md).
- [Синтетический JS test suite 08.7](../tests/stage-08-07-ginarea-handoff-synthetic.mjs).
- [Пользовательская формальная приёмка 08.6](stage-08-06-validation.md#5-формальная-приёмка-086-и-разрешение-087--20102026).
- [GinArea Skill](../.agents/skills/ginarea-configuration/SKILL.md), [P01 каталог GD01–GD40](platforms/ginarea.md), [P01/P02 vs T02](platforms/platform-validation.md), [неэквивалентность Veles/GinArea](platforms/configuration-contract.md), [риск](risk-management.md).

Независимо проверены публичные официальные страницы GinArea 20.10.2026: [Bybit UTA/Cross/One-Way/Default-Hedge](https://help.ginarea.org/connection/exchangesetup/), [sticky Disable IN](https://help.ginarea.org/ru/settings/disablein/), [Indicator Grid условия](https://help.ginarea.org/ru/strategies/indicatorgrid/), [шаг и множитель](https://help.ginarea.org/ru/settings/gridsettings/). Это **P01 публичные сведения**, **не** P02 конкретного пользователя.

## 2. Что реально можно проверить

**GA01–GA40** — нормативные негативные эталоны, не 40 отдельных вызовов LLM. Синтетические тесты проверяют отдельные условия route/strategy selection, compatibility UTA/Cross/One-Way/Default Hedge, typed IN/cap, простую теоретическую последовательность, source guards для фактических Markdown-строк, sticky disable, отсутствие автоматического копирования Indicator → Default, R3 свежесть и сохранение строгого veto.

## 3. Фактический журнал и self-review

Заполнить по **фактически исполненным** тестам с указанием среды, фейковых fixtures и найденных ошибок. Команда для настоящего Node.js checkout ≥18:

```bash
node tests/stage-08-07-ginarea-handoff-synthetic.mjs
```

## 4. Сохраняемые ограничения и решение

**RV-02** реальная Cross MMR, **RV-03** строгая Short upper-loss bound, **RV-04** реальная GinArea P02, **RV-06** независимый Skill-runtime, **TV-01–TV-04** и реальные исторические датированные Bybit Mark H episodes FR-038 — OPEN. Никаких реальных API Bybit, пользовательских балансов/P02, биржевых ордеров, переключений GinArea, работы в фоне или торгового `READY`.

Статус **`08.7 IMPLEMENTED / PENDING USER REVIEW`** до отдельного утверждения; **08.8 `NOT STARTED`**. PR #1 Open/Draft, без merge.
