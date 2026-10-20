# Шаг 08.6 — протокол Veles handoff и проверки пользовательской P02

> **Текущий статус: `IMPLEMENTED / PENDING USER REVIEW` (20.10.2026).** Шаг 08.5 принят прямой командой пользователя «Принимаю. Дальше.», отдельно разрешён 08.6. Сам шаг 08.6 не принят; **08.7 `NOT STARTED`**. PR #1 Open/Draft без merge.

## 1. Результаты и нормативные источники

- [Шесть пользовательских промптов P08-24–P08-29, правила Veles P01/P02/T02, 40 VH01–VH40](prompts/veles-configuration.md).
- [Воспроизводимый синтетический JS-модуль Veles](../tests/stage-08-06-veles-handoff-synthetic.mjs).
- [Утверждённый Veles Skill](../.agents/skills/veles-configuration/SKILL.md), [каталог VL-01–VL-25 и VV01–VV34](platforms/veles.md), [контракт P01 vs P02](platforms/platform-validation.md), [риски и преобразование](platforms/configuration-contract.md), [предшествующий результат 08.5](stage-08-05-validation.md).

## 2. Область тестирования

VH01–VH40 — только документальные **нормативные ожидания**, а не 40 независимых запусков ChatGPT. Детерминированные локальные JS-фикстуры проверяют выбор платформы/стратегии, P02-gate, различие `SIMPLE/CUSTOM/SIGNAL`, 100% резерв future IN, `POSITION -1`, partially filled order, TP/SL timing, cancel/stop/close/restart, AD-009, обязательные FR-027–FR-040 и границы отсутствия настоящего READY. Source-bound guards проверяют настоящие строки Markdown и обнаруживают целевые in-memory подмены нормативных ответов.

## 3. Фактические тесты и self-review

Заполнить **только после фактического запуска** с явным указанием среды и ограничений. Команда полноценного Node.js checkout:

```bash
node tests/stage-08-06-veles-handoff-synthetic.mjs
```

## 4. Блокеры и передача на приёмку

RV-02 account-wide Cross MMR/liquidation, RV-03 Short worst bound, RV-04 фактическая пользовательская Veles P02, RV-06 independent ChatGPT Skill runtime, TV-01–TV-04, реальные датированные Bybit Mark H episodes FR-038/F/A/H/R — **OPEN**. Нет реальной полной T02/T03/T04, актуального Mark и аккаунтных P02; не выполнялись создание/редактирование/остановка Veles, Bybit orders или live R3. Никаких API secrets и пользовательских скриншотов в публичном GitHub.

**08.6 `IMPLEMENTED / PENDING USER REVIEW`, 08.7 `NOT STARTED`** до явного решения пользователя. Утверждение документа не выбирает Veles для конкретной сделки, не даёт торгового READY и не разрешает merge.
