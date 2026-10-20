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

## 3. Фактические проверки и self-review — 20.10.2026

Нормативная документация, GinArea Skill, реестр GD01–GD40, стратегия/платформенная P01/P02 и JS-тесты получены из GitHub `feature/initial-agent-mvp` и проверены по **точным текущим текстам**. Тест JS реально исполнялся в изолированной **JavaScript/V8-среде с адаптером `node:fs`** и контролем путей по списку файлов PR. **Не** реальный Node.js checkout/CI, не GinArea/Bybit API, не живой P02 пользователя, не независимый ChatGPT agent runtime.

| Объём | Результат |
|---|---|
| Нормативные GA01–GA40 | **40/40** локальных fixture assertions, не отдельные LLM-диалоги |
| Шесть копируемых P08-30–P08-35 | Source checks содержания и RT07/RT09 |
| Каталог GinArea `GD-01–GD-40` | **40 пунктов найдены** в принятой P01 справочной карте; не реальные поля пользователя |
| `Default/Auto/Dynamic/Indicator/DCA`, UTA/Cross/One-Way/Hedge, typed IN/OUT/Instop/Disable | Синтетические модели и проверка реального текста контрактов |
| 16 мутаций критических строк `GAxx` и **8 подмен FR-порогов** | **24/24 detected**, включены в итог, не суммировать отдельно |
| Stateful `Disable IN` | 5 новых проверок `OUTSIDE→DISABLED→INSIDE=DISABLED→MANUAL_ENABLE→RECHECK→ARMED`, включены в итог |
| **Итог 08.7** | **268/268 локальных JS/V8 assertions PASS, 0 FAIL** |

**Первый прогон:** 240/247 PASS. Семь ошибок: пять отсутствующих явных упоминаний RV-02/RV-03/RV-04/RV-06/TV-01–TV-04 в документе и два неверных текста ожидания `GA23` (регистр) и `GA35` (при изменении снимка требуется **RECHECK**, а не REJECTED без доказанного нарушения). Поправлены исходный документ и тестовый литерал: **247/247 PASS**. Дополнительный независимый self-review нашёл, что статический ON-флаг недостаточно проверяет sticky-переход при возврате цены; добавлены state-machine проверки и **8 source-bound подмен числовых риск-порогов**: финально **268/268 PASS**.

**Ни один утверждённый FR-limit не ослаблен.** Исправлены только проверяемость требований, явные сохранённые блокеры и тестовая модель времени/состояния.

Команда для самостоятельного Node.js checkout (не запускалась в этой среде):

```bash
node tests/stage-08-07-ginarea-handoff-synthetic.mjs
```

## 3.1. Самостоятельный self-review SR-087

| Код | Независимая проверка | Вывод |
|---|---|---|
| SR-087-01 | **CHOOSE и scope:** выбор стратегии/пары/платформы делает пользователь, Indicator недоступен не означает Default выбран, P01 не доказывает P02 | **PASS DOC/SYNTHETIC** |
| SR-087-02 | **Compatibility:** Bybit UTA/Cross, One-Way для non-Default; Default Hedge как документальное исключение, account/selector отдельно | **PASS**, реальная P02 **OPEN** |
| SR-087-03 | **Typed finance:** `Размер ордера` ≠ `Макс. размер` ≠ бюджет, multiplier price-step vs size multiplier, full IN/Instop/cycles и S0–S3 | **PASS DOC/SYNTHETIC**, точная биржевая сетка **UNVERIFIED** |
| SR-087-04 | **OUT lifecycle:** `Целевой уровень прибыли` триггер, не fill; `Мин. Стоп/Макс. Стоп/Инстоп` условны, BE и бот Profit не доказывают H01/Short bound | **PASS** |
| SR-087-05 | **Sticky Disable IN:** возврат внутрь range не возобновляет новые IN, ручной сброс требует `RECHECK`, старые биржевые заявки остаются до доказанной отмены | **PASS**, stateful model усилена |
| SR-087-06 | **R3:** FR-027–FR-040; 8 threshold source-mutations; известный H04 доминирует; Cross MMR, Short max loss, real Bybit Mark historical F/A/H/R и P02 не доказаны | **PASS только document/synthetic**, real trading READY **не доказан** |
| SR-087-07 | **Ограниченность верификации:** 268 assertions, включая 24 targeted in-memory mutations, не являются 40 независимыми LLM-тестами, авто-загрузкой Skills или интеграционным тестом GinArea | **OPEN методологическое ограничение**, не готовность торговли |

**Вывод:** после исправлений в согласованном документально-синтетическом объёме **нет выявленных блокирующих дефектов**. Предъявить **08.7 на отдельную приёмку**, не начинать 08.8 и не сливать PR.

## 4. Сохраняемые ограничения и решение

**RV-02** реальная Cross MMR, **RV-03** строгая Short upper-loss bound, **RV-04** реальная GinArea P02, **RV-06** независимый Skill-runtime, **TV-01–TV-04** и реальные исторические датированные Bybit Mark H episodes FR-038 — OPEN. Никаких реальных API Bybit, пользовательских балансов/P02, биржевых ордеров, переключений GinArea, работы в фоне или торгового `READY`.

Статус **`08.7 IMPLEMENTED / PENDING USER REVIEW`** до отдельного утверждения; **08.8 `NOT STARTED`**. PR #1 Open/Draft, без merge.
