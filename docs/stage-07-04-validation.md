# Этап 07.4 — Portfolio Analysis Skill: протокол приёмки

> **Статус `IMPLEMENTED / PENDING USER REVIEW` (19.10.2026).** Пользователь **«Принимаю. Дальше.»** формально [принял 07.3](stage-07-03-validation.md#7-формальная-приёмка-073-и-разрешение-074--19102026), разрешив реализацию **07.4**. Созданы [третий реальный Skill `.agents/skills/portfolio-analysis/SKILL.md`](../.agents/skills/portfolio-analysis/SKILL.md) и [воспроизводимый синтетический JS-файл](../tests/stage-07-04-portfolio-analysis-synthetic.mjs); его **77/77 локальных тестов PA01–PA77 фактически выполнены, 0 FAIL** на точном исходнике, повторно полученном из GitHub. **07.4 ещё не принят пользователем. 07.5 `NOT STARTED`** до новой приёмки и команды; PR #1 остаётся Open/Draft, не сливать.

## 1. Основания, реальные документы и границы наблюдений

Внутренние принятые источники: [план 07](stage-07-plan.md), [контракт Skills 07.1](stage-07-skills-contract.md), [FR-018–FR-026](requirements.md), [полный риск FR-027–FR-040](risk-management.md), [Bybit, Veles/GinArea и 06.7](platforms/platform-synthetic-tests.md), [свежесть R1/R2/R3 и AD-009](data-freshness.md), [шаблоны T01–T06](input-templates.md), [открытые ограничения этапа 06](stage-06-review.md) и [Data Verification Skill](../.agents/skills/data-verification/SKILL.md).

**Официальная документация Bybit, изученная 19.10.2026** (это не реальные данные пользователя):

- [UTA Wallet Balance](https://bybit-exchange.github.io/docs/v5/account/wallet-balance): `totalEquity`, `totalInitialMargin`, `totalMaintenanceMargin`, `totalAvailableBalance` в USD, отдельные условия для Cross/Portfolio и Isolated, особенности обработки collateral.
- [Get Position Info](https://bybit-exchange.github.io/docs/v5/position): `positionIdx=0` One-Way, `1` Hedge Buy, `2` Hedge Sell; `size` положителен; Cross `liqPrice` оценочен и может быть пустым; `tradeMode` deprecated для UTA; запрос страниц `limit`/`nextPageCursor`.
- [Get Open & Closed Orders](https://bybit-exchange.github.io/docs/v5/order/open-order): `orderId`, `positionIdx`, `qty`, `leavesQty`, `cumExecQty`, `orderStatus`, `reduceOnly`, `orderFilter`, `openOnly` и страницы; `Filled/Cancelled` могут требовать order history после рестарта сервера.
- [Order History](https://bybit-exchange.github.io/docs/v5/order/order-list) и [Execution List](https://bybit-exchange.github.io/docs/v5/execution/list): восстановление исполнений, fees, связанных сделок требует реальных идентификаторов.

**Сфера реализации:** только инструкции/Markdown и синтетические JavaScript-тесты. Нет API-ключей, реального T02, пользовательских P02, настоящего Bybit запроса, реальных размещённых ордеров или жизненного цикла исполнения. Никаких личных данных в GitHub не публиковалось.

## 2. Созданный Skill и трассировка FR

| Требование | Что документировано в третьем `SKILL.md` | Что НЕ доказано реальными наблюдениями |
|---|---|---|
| FR-018, FR-026 | Полный счёт и применимые субсчета, T02, источник/snapshot/time/покрытие пагинации, минимальный запрос приватных данных | Фактический полный доступ, полнота реальных T02/приватных вкладок |
| FR-019, FR-023 | Active/conditional/VIRTUAL/PLANNED IN и OUT, полная будущая сетка, уже исполненные, dedup биржевых ID и owner | Живое соответствие bot order↔exchange ID, фактическое выставление условных ордеров |
| FR-020–FR-021 | Поля `positionIdx`, Long/Short, qty/avg/Mark/uPnL, One-Way/Hedge, Cross/Isolated, динамическая `liqPrice` | Cross account MMR/liquidation (RV-02) и индивидуальная биржевая модель IM/MM |
| FR-022 | Equity/IM/MM/available typed USD, collateral FX и разделение planning reserve от подтверждённой биржевой маржи | Реальный USD/USDT FX, haircut, risk tier, валютные переоценки |
| FR-024 | Связанный H01, realized/unrealized, fees/funding, исполнение и предотвращение двойного вычета | Реальные PnL серии, корректность cross-bot allocation, живой funding history |
| FR-025 | Список всех направленных позиций как вход для оценки совместного co-loss/корреляции | Корреляционный расчёт и stress F/V/H/R — отдельный Risk Skill 07.5 |

**Ключевые запреты:**

1. **Бот ≠ биржевая позиция**: два бота в One-Way могут делить один биржевой слот, две стороны Hedge занимают два слота. Статусы Veles `Stopped/Cancel deal`, GinArea `Disable IN/Pause/Failed` не доказывают закрытие позиции Bybit.
2. **Исполненная часть ≠ будущая заявка**: `cumExecQty` при последующем снимке должна быть отражена в S0, а `leavesQty` — будущий остаток. `FILLED` не добавлять повторно, `Cancelled` без биржевого подтверждения не считать исполненной отменой.
3. **Известный orderId ≠ похожий ордер**: одно подтверждённое `orderId` у Bybit и бота можно считать один раз; разные ID одинаковой цены/qty — разные заявки. Нет надёжного ID/owner → недоказанное сопоставление и `UNVERIFIED`.
4. **Прогнозируемые позиции**: FR-033 требует считать **потенциальный** новый слот от ещё не размещённого IN. Нельзя считать весь набор сетки одной действующей позицией; при доказанных четырёх слотах новая нагрузка блокируется последующей Risk-проверкой.
5. **Cross не Isolated**: `liqPrice` не подтверждает границу 15% для полного Cross аккаунта. `totalEquity` и `totalInitialMargin` из UTA — USD; USDT не считать автоматически USD без доказанного FX.
6. **H01 net profit ≠ bot Profit**: −15 realized +10 unrealized −1 fee −2 funding = **−8** при соответствующей непересекающейся модели полей. Предварительное снижение плавающего убытка не равно восстановлению реализованного.
7. **R3**: T02 ≤5 минут, фактическая неизменность с момента снимка, Mark ≤2 минуты для финального риска; любое fill/отмена/изменение бота/маржи/другой позиции требует повторного контрольного снимка. H02/H03 `NOT_CHECKED` без истории; известный H04 → запрет нового риска.

## 3. Фактически выполненные тесты PA01–PA77

Файл [`tests/stage-07-04-portfolio-analysis-synthetic.mjs`](../tests/stage-07-04-portfolio-analysis-synthetic.mjs) предназначен для Node.js ≥18 (`node tests/stage-07-04-portfolio-analysis-synthetic.mjs`) и **читает настоящий Skill при наличии клона репозитория**. Во время разработки его **сохранённый в GitHub исходник повторно прочитан и выполнен в изолированном V8** с подстановкой фактического содержимого созданного `SKILL.md`, а относительные пути проверены по структуре GitHub (не реальной файловой системе checkout). **77/77 PASS, 0 FAIL**, `bybitAccount=false`, `liveSkill=false`, `ready=false`.

**Эти тесты НЕ проверяют** полноту настоящего T02, реальную семантику всех статусов/очередностей Bybit, actual post-fill ledger, liquidation, fee conversion, полноценное H01 сопоставление нескольких аккаунтов, биржевую точность Decimal или работу настоящего ChatGPT Skill runtime. Функции из JS — специально упрощённые учебные модели.

| Группа проверок | Тематика | Состояние |
|---|---|---|
| PA01–PA10 | Содержимое Skill, positive/negative triggers, One-Way/Hedge, риск-блокеры | PASS в локальной модели |
| PA11–PA25 | Slot identity, side/qty, Cross/Hedge, дубли/конфликты T03 | PASS |
| PA26–PA44 | OrderId, статус `Filled/Cancelled/PartiallyFilled`, `leaves`, `reduceOnly`, дедуп подтверждённых биржевых ID | PASS |
| PA45–PA52 | Будущие IN на новых символах и Hedge, четвертая позиция, OUT/FILLED, неизвестный purpose/slot | PASS |
| PA53–PA56 | Учебные IM и полный резерв будущих IN, отсутствие двойного счёта IM | PASS |
| PA57–PA59 | Cross liq неопределена, пустая цена, отдельный Isolated | PASS |
| PA60–PA64 | T02 ≤5 минут, event invalidation, неполнота счёта | PASS |
| PA65–PA67 | H01 net и отсутствие двойного вычета fee, missing funding | PASS |
| PA68–PA70 | Остановленный бот/Disable IN и фактическая биржевая позиция | PASS |
| PA71–PA74 | Приоритет REJECTED/UNVERIFIED/NEEDS_DATA, невозможность локального READY | PASS |
| PA75–PA77 | Относительные ссылки на утверждённые документы и Data Verification | PASS |

## 4. Нормативные негативные случаи PC01–PC34

**34 документальных эталона ниже не исполнялись независимой моделью.** Их нельзя складывать с 77 исполненными тестами и выдавать сумму за 111 реальных испытаний.

| ID | Сценарий | Ожидаемая реакция |
|---|---|---|
| PC01 | Пользователь просит «что такое шорт?» | Не запрашивать T02 и приватный счёт |
| PC02 | Предоставлена только BTC-позиция, есть другие боты | Полный портфель `NEEDS_DATA` для R3 |
| PC03 | Счёт UTA содержит USD Equity и USDT баланс | Разные единицы, не смешивать без FX |
| PC04 | API вернул первую из нескольких страниц T03 | Не считать остальные позиции отсутствующими |
| PC05 | `positionIdx=0`, один One-Way Short, два бота | Один биржевой слот; owner конфликт выявить |
| PC06 | Hedge `1` Buy и `2` Sell ненулевые | Два биржевых слота |
| PC07 | `size=0` без действующей позиции | Не считать текущим занятым слотом |
| PC08 | Неконсистентные qty двух источников одного слота | `UNVERIFIED`, не брать удобную величину |
| PC09 | Пустой Cross `liqPrice` | Не считать отсутствием ликвидационного риска |
| PC10 | Cross позиция, но `tradeMode=0` | Deprecated поле не доказывает Isolated |
| PC11 | Номинал/плечо подставлены как точная UTA IM | Запрет самодельной Cross-маржинальной модели |
| PC12 | `PartiallyFilled`: qty3, cumExec1, leaves2 | Будущая заявка 2, исполненную 1 сверить с S0 |
| PC13 | Fill произошёл позже T02 | Инвалидировать T02, повторить снимок |
| PC14 | `Filled` после включения в позицию | Не резервировать его ещё раз |
| PC15 | `Cancelled` биржа подтвердила; исполненная часть осталась | Будущий остаток убрать, экспозицию сохранить |
| PC16 | GinArea UI сказал «отмена», биржа ещё видит Active | Не снимать резерв без подтверждения |
| PC17 | Два `orderId` одинаковых price/qty | Два обязательства, не схлопывать |
| PC18 | Один verified `orderId` в Bybit и Veles | Одна биржевая заявка |
| PC19 | Order ID отсутствует в bot-only IN | `UNVERIFIED`, не угадывать дедуп |
| PC20 | One-Way Buy на существующем Short | Не классифицировать автоматически Long IN |
| PC21 | `reduceOnly=true` OUT | Не считать как потенциально новый слот |
| PC22 | Условный ещё не разместивший IM IN | Будущий резерв всё равно требуется |
| PC23 | Виртуальные 7 уровней Veles ещё не выставлены | Включить достижимые IN в планирование |
| PC24 | Veles `Cancel deal` при оставшемся Short | Позиция Bybit не закрыта |
| PC25 | GinArea `Disable IN` при живом Bybit ордере | Не считать ордер отменённым |
| PC26 | Вручную изменили leverage/positionMode | Новые T02/T03 и проверка owner |
| PC27 | Три позиции + будущий IN на новом symbol | Четвёртый слот прогнозируется, Risk блокирует |
| PC28 | Взаимоисключающие IN не доказаны | Не занижать прогноз; `UNVERIFIED` |
| PC29 | Equity $1000, IM baseline $100, future IM $30, buffer $10 | Projected IM $140 в синтетике, не считать уже занятую IM дважды |
| PC30 | Short realized −15, unrealized +10, fee−1, funding−2 | H01 net−8, не заявлять recovery |
| PC31 | PnL поля уже net of fees | Не вычитать комиссии повторно |
| PC32 | H01 нет истории исполнений/fee | `H01_INCOMPLETE`, не заявлять чистую прибыль |
| PC33 | H02/H03 отсутствуют; известен H04 | История `NOT_CHECKED`; новый риск `REJECTED` |
| PC34 | 77/77 синтетических тестов PASS, нет полного живого T02 | Никакого торгового `READY` |

## 5. Критерии приёмки

| Условие | Что подтверждено |
|---|---|
| A01. Третий реальный Skill и формат | `SKILL.md` создан с `name`/`description`/body; полный YAML spec-validator отдельно не запускался |
| A02. Полные T02/T03/T04 с временем/пагинацией | Процедура документирована; **реальных личных данных нет** |
| A03. Режимы и позиции | One-Way/Hedge, Cross/Isolated, owner/unknown, текущие и потенциальные слоты разделены |
| A04. Orders и partial fill | `leavesQty`, статусы/тип/дедуп, будущее vs текущее, условные/виртуальные |
| A05. Резерв/маржа | Отдельно baseline IM, incremental IM, будущие IN; live UTA метод не реализован |
| A06. Боты и вмешательство | Veles, GinArea, manual, restart/stop/Disable IN, инвалидаторы |
| A07. H01, fee/funding | Серия документирована и на вымышленных числах проверена; реальные execution IDs не исследованы |
| A08. Риск-переход | FR-029–040 и F/V/H/R передаются отдельному будущему `risk-assessment`, никаких торговых `READY` |
| A09. Позитивные/негативные проверки | **77/77 локальных синтетических**, 34 нормативных PC01–PC34 — **отдельные количества** |
| A10. Статус/переход | **07.4 `IMPLEMENTED / PENDING USER REVIEW`; 07.5 `NOT STARTED`**, PR #1 Open/Draft |

## 6. Остаточные ограничения

**S704-01** Реальное `SKILL.md` в GitHub не доказывает автообнаружение/выполнение в обычном ChatGPT/Codex; никакой независимый blind-run или полномасштабный Node/CI запуск не выполнен. Простой YAML frontmatter не прогонялся полноценным `skills-ref validate`.

**S704-02** Синтетика не реконструирует event-by-event торговый ledger, реальные partial fill races, Bybit USD haircuts/risk tiers и Cross/MMR. Поэтому RV-02/RV-03 остаются OPEN, `position.liqPrice` недопустимо считать гарантийной ценой. Нет настоящих P02 (RV-04) и независимого исполнения (RV-06).

**S704-03** Для атрибуции нескольких ботов и H01 нужны реальные bot IDs/execution IDs, net field semantics и funding с проверенной историей; в синтетическом примере маржа `imUsd` и ownership гипотетические. Дедуп по ID требует полной подтверждённой комбинации account/symbol/slot.

**S704-04** TV-01–TV-04, реальные Mark-истории, исторический F/V/H/R по полному портфелю FR-038 и live R3 по-прежнему не закрыты. Приёмка шага 07.4 не станет признанием торговой готовности.

**Предлагаемая приёмка:** принять **07.4 только как третий настоящий документальный Skill и 77/77 локальных синтетических проверок**, сохранив список недоказанных функций и соответствующие риск-блокеры. **07.5 Risk Assessment Skill** реализовать **только после отдельной приёмки 07.4 и прямой команды**. PR #1 оставить Open/Draft, не сливать.
