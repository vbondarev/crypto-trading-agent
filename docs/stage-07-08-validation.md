# Этап 07.8 — GinArea Configuration Skill: протокол документально-синтетической проверки

> **Статус `COMPLETED / APPROVED` (приёмка пользователя 19.10.2026).** По команде «Принимаю. Дальше.» пользователь формально [принял 07.7](stage-07-07-validation.md#6-формальная-приёмка-077-и-разрешение-078--19102026) и отдельно разрешил создать 07.8. Созданы **седьмой настоящий Skill** [`.agents/skills/ginarea-configuration/SKILL.md`](../.agents/skills/ginarea-configuration/SKILL.md) и [синтетические JS-проверки](../tests/stage-07-08-ginarea-configuration-synthetic.mjs): **102/102 фактически исполненных локальных проверок GA01–GA102 PASS**, 0 FAIL последнего прогона. Дополнительно документированы **36 нормативных сценариев GC01–GC36**, не независимые обращения ChatGPT. **07.8 принят пользователем 19.10.2026; 07.9 отдельно разрешён к реализации**. [PR #1](https://github.com/vbondarev/crypto-trading-agent/pull/1) Open/Draft, не сливать.

## 1. Исходные требования, источники и доказательные ограничения

**Внутренние источники:** [официальная P01-карта GinArea](platforms/ginarea.md) (GD01–GD40, C-G01–C-G10, E01–E18, GE01–GE40), [акты этапа 06.4](platform-06-04-validation.md) и [06.5](platform-06-05-validation.md), [контракт непереносимых настроек](platforms/configuration-contract.md), [P01 vs P02](platforms/platform-validation.md), [FR-047–FR-053](requirements.md), [риск FR-027–FR-040](risk-management.md), [AD-009](data-freshness.md), [07.1 маршрутизация](stage-07-skills-contract.md), предыдущие [Risk](../.agents/skills/risk-assessment/SKILL.md), [Strategy](../.agents/skills/strategy-planning/SKILL.md), [Portfolio](../.agents/skills/portfolio-analysis/SKILL.md).

**Официальные GinArea Help страницы проверены 19.10.2026:**
- [Bybit Exchange Setup](https://help.ginarea.org/connection/exchangesetup/) — UTA, Cross, One-Way, только Default Grid допускает Hedge.
- [Order Details](https://help.ginarea.org/ru/settings/orderdetails/) — базовый IN размер/номинал, отдельный `Макс. размер` и `Мультипликатор`, округление вниз по биржевому лоту.
- [Disable IN](https://help.ginarea.org/ru/settings/disablein/) — запрет новых IN, продолжение OUT и sticky-блокировка после выхода цены за границы.
- [Grid Settings](https://help.ginarea.org/ru/settings/gridsettings/), [Position Settings](https://help.ginarea.org/ru/settings/positionset/), [One-Way](https://help.ginarea.org/ru/onewaymode/), [Auto Grid](https://help.ginarea.org/ru/strategies/autogrid/), [Default Grid](https://help.ginarea.org/ru/strategies/default/), [Bybit errors](https://help.ginarea.org/botmanagement/connecting-telegram/excherrors/).

**Важная граница:** публичная P01 не является реальной формой **P02** пользователя, справочный бот Profit — не полный **T02** Bybit и не H01 net. Здесь не проверяли личный GinArea PRO, выбранную пользователем торговую пару/тариф, реальные ордера, Mark, живые API/параметры кабинета, работу реального чат-Skill или фактическую доступность Indicator Grid для монеты. Скрипт/Skill не размещают ордера и не требуют API секретов.

## 2. Матрица реализации и ограничения совместимости

| Задача | Реализованное правило в Skill | Что НЕ доказано |
|---|---|---|
| FR-047: платформа и стратегия | Только **пользователем выбранная GinArea PRO** и одна конкретная стратегия; не копировать поля Veles, не переключать Indicator→Default автоматически | Выбор платформы/стратегии для конкретной сделки |
| FR-048: точная форма | Условная карта GD01–GD40 с `visible_if`, unit, user P02 и exact labels | Что все 40 полей присутствуют одновременно в живой PRO форме |
| Bybit режим и пара | UTA/Cross, One-Way для non-Default, **Default Hedge** только в подтверждённом режиме; символ должен быть виден в GinArea selector | Реальный счёт/пара/entitlement, поддержка конкретной стратегии |
| Grid | `Размер ордера` ≠ `Макс. размер` ≠ депозит; `Мультипликатор` размера ≠ `Множитель шага сетки`, qty/step/min lot типизированы | Точные fills/неявные reset и округление в live PRO |
| Особые стратегии | Auto/One-Way виртуальные стороны; Dynamic offsets, Indicator вход/выход, DCA fixed IN и циклы, всё условно по фактическому P02 | Наличие точных полей/доступность выбранной стратегии/пары |
| Lifecycle | Триггер IN/OUT vs принятый ордер/fill, merged Instop, multi-cycle IN, sticky Disable IN, Pause/Close/Failed | Подтверждение фактической отмены Bybit IN или закрытия позиции |
| TP/SL и H01 | `Целевой уровень прибыли` — отступ OUT; bot TP/SL и P&L trailing не гарантируют net recovery и Short-loss | Реальные funding, fees, исполненные exit и related H01 series |
| FR-029–040 | Совокупная IM≤30% Equity, bot worst loss≤5%, leverage≤5×, Mark adverse liquidation distance≥15%, ≤3 слота, полный 100% future-IN reserve + buffers, 3% daily/H04, real F/A/H/R | Cross account MMR RV-02, Short upper bound RV-03, real F/A/H/R FR-038 |
| FR-050–053 | AD-009, T02≤5 минут и Mark≤2 минуты при отсутствии изменений, полный повторный риск после edit/Fill/Disable reset/restart | Реальные account snapshots, auto ChatGPT Skill routing, private P02 |

**Приоритет отказа:** доказанное несовместимое состояние или известный H04 → `REJECTED` нового риска, даже если иных данных нет; конфликт важного метода/маржи/owner/реального P02 → `UNVERIFIED`; обязательное отсутствующее P02/T02/Mark или selector → `NEEDS_DATA`. **READY невозможен из одного справочника, вымышленного риска или 102/102 учебных проверок.** Отсутствие исторических H02/H03 Equity само по себе не veto, но **исторические реальные Bybit Mark** обязательны для H-семейства FR-038.

## 3. Фактически исполненные проверки GA01–GA102

[Воспроизводимый JS-файл](../tests/stage-07-08-ginarea-configuration-synthetic.mjs) предназначен для `node tests/stage-07-08-ginarea-configuration-synthetic.mjs` (Node ≥18, checkout той же ветки). Во время разработки **сохранённый исходник был повторно прочитан из GitHub** и исполнен в изолированном JavaScript/V8 с **реальным текстом созданного Skill из GitHub**, а existence относительных ссылок проверен по GitHub списку файлов. **102/102 PASS, 0 FAIL** в итоговом прогоне.

Первый прогон показал **101/102**: учебное значение `0.1×1.5` в обычном JS Number представилось как `0.15000000000000002` вместо точного `0.15`. В механическую проверку добавлено нормализованное округление; **торговая математика и принятые риск-лимиты не менялись**. Для боевого пересчёта нужен Decimal и реальные qtyStep/tickSize, обычный JS Number здесь не является production decimal engine.

| Диапазон | Проверяемое в синтетике |
|---|---|
| GA01–GA09 | Реальное тело Skill, YAML frontmatter (простой regex), документы GD/FR/соседние Skills |
| GA10–GA18 | Выбор GinArea vs Veles, стратегия, market identity Bybit linear USDT |
| GA19–GA29 | UTA/Cross/OneWay, Default Hedge, non-Default Hedge `REJECTED`, спорная P02 и неверный режим |
| GA30–GA42 | Пара в выбранном селекторе, conditional Indicator/Dynamic/DCA поля и отсутствие P02 |
| GA43–GA55 | Типизированные BASE/USDT значения, first IN/cap/multiplier, цена и объём — разные множители |
| GA56–GA63 | Disable IN и sticky защёлка, разрешение только после ручного решения/risk gate |
| GA64–GA70 | Pause/Close/Failed/restart ≠ биржевое закрытие без Fill |
| GA71–GA78 | Filled/Cancelled/Partial, дедуп orderId, One-Way net Zero vs bot virtual sides |
| GA79–GA89 | Hedge slots, Instop merged IN/cap, приоритет `REJECTED`/`UNVERIFIED`/`NEEDS_DATA` |
| GA90–GA98 | Никакого реального READY по флагам; net H01 с funding/fees |
| GA99–GA102 | 17 внутренних ссылок, пять существующих других Skills, реальные относительные пути |

**Это не проверка** реального GinArea PRO или Bybit, не испытание последовательности actual bot fills, не подтверждение платформенной точности множителя/слотов/Instop, не исторический F/A/H/R, не независимый ChatGPT blind-run, не реальное автоматическое discovery Skills и не Node/CI execution на checkout. В JS `compatible`/модели orders — заведомо упрощённые учебные предикаты.

## 4. Нормативные документальные сценарии GC01–GC36

**Эти сценарии являются планом будущего независимого тестирования, а не дополнительно исполненными обращениями к модели.**

| ID | Вымышленная ситуация | Ожидаемое поведение |
|---|---|---|
| GC01 | GinArea не выбрана пользователем | Не запускать ветвь конфигурации |
| GC02 | Пользователь выбрал Veles, в форме предлагаются GinArea поля | Вернуть к Veles, не смешивать поля |
| GC03 | Выбрана GinArea, но стратегия/пара не названа | NEEDS_DATA для конкретной P02 |
| GC04 | Доступна монета на Bybit, но нет Indicator Grid в селекторе | Не утверждать поддержку; Default только после выбора пользователя |
| GC05 | Indicator Grid выбран, но недоступен для этой пары | Не создавать фиктивный Indicator Grid-конфиг |
| GC06 | Bybit USDT perpetual заменили Spot/USDC | Не считать эквивалентной рыночную идентичность |
| GC07 | Bybit non-Default при подтверждённом Hedge | REJECTED новой конфигурации по действующей документальной матрице |
| GC08 | Default Grid при Hedge | Допускается по справке, но P02/биржевой режим отдельно проверить |
| GC09 | Подтверждённый Isolated для Bybit GinArea | Документальный запрет; конфликт P02/справки → UNVERIFIED |
| GC10 | Для DCA скопирован Индикатор/вход EMA | Неприменимое поле, не выводить как реальное |
| GC11 | Для Default скопированы Start Offset и IN Open Offset Dynamic | Не переносить без подтверждённого режима |
| GC12 | Размер ордера=20 USDT, Макс. размер=100 USDT | Первый IN номинально 20 USDT, cap 100 USDT на отдельный IN |
| GC13 | Размер ордера=20 USDT, но система считает 20 монет | Неверные единицы, запросить цену/конвертацию |
| GC14 | Множитель IN=1.5, первый=0.1, cap=0.3 BTC | Условная геометрия 0.1/0.15/0.225/0.3, не фактический fill |
| GC15 | Неизвестен qtyStep/лот/минимальный номинал | Нет готового числа Bybit qty |
| GC16 | Множитель шага сетки трактуется как множитель объёма | Разделить price spacing и IN size |
| GC17 | % Режим выключен, вводится число 2 | Не трактовать без цены/денежной/процентной единицы |
| GC18 | Auto Grid внутренние Long=4, Short=4, Bybit One-Way net=0 | Нет отдельной Hedge позиции, но есть возможные IN/OUT |
| GC19 | Default Grid двух направлений в One-Way при двух ботах | Биржевой слот и ownership по реальному T02, не по числу ботов |
| GC20 | В сетке уже FILLED частичный IN | Filled отражается в S0 один раз, leaves в S1 |
| GC21 | Один биржевой orderId дублирован в UI бота | Дедуп только при доказанной идентичности |
| GC22 | Два биржевых ID на одной цене/qty | Не схлопывать в один заказ |
| GC23 | Instop объединяет три пропущенных IN | Один большой IN возможен, не терять суммарный будущий резерв |
| GC24 | Instop Indicator Grid не показан в P02 | Не добавлять неподтверждённое поле |
| GC25 | Пользователь просит гарантированный OUT после достижения Profit Target | Триггер ≠ принятый ордер ≠ исполнение |
| GC26 | Отрицательный Indicator Grid exit | Закрытие возможно в минус, не обещать прибыль |
| GC27 | Disable IN включён при открытой позиции | Новых IN нет, OUT/позиция/маржа остаются |
| GC28 | После выхода за границы цена вернулась внутрь | Sticky Disable IN не отключается без ручного действия |
| GC29 | После Disable IN всё ещё висит IN с Bybit orderId | Пока биржа не подтвердила отмену, риск исполнений сохраняется |
| GC30 | Disable-IN возник из-за нехватки маржи | Не возобновлять IN без полного повторного риска |
| GC31 | Pause выбран, позиция на Bybit активна | Не считать Pause закрытием |
| GC32 | После Pause закрытие только запрошено, fill отсутствует | Не заявлять qty=0 |
| GC33 | Failed после ручного Bybit вмешательства | Не считать нулевым риск/позицию, пересверить owner и ордера |
| GC34 | TP обновлён после цикла или P&L trailing | Проверить funding/fee/realized H01 и будущие IN |
| GC35 | Пользователь просит GinArea Short при active H04 | REJECTED нового риска даже если P02 неполна |
| GC36 | 102/102 локальных PASS, но нет real P02/T02/Mark/F-A-H-R | Никакого live READY, 07.9 только после отдельной приёмки 07.8 |

## 5. Приёмочные критерии и незакрытые зависимости

| Критерий | Подтверждённый результат |
|---|---|
| A01 — седьмой настоящий Skill | Создан `ginarea-configuration/SKILL.md`, базовый name/description, WHEN/WHEN NOT |
| A02 — только GinArea/не смешивать платформы | Veles-only поля исключены; пользователь должен отдельно выбрать бота |
| A03 — реально подтверждаемые P02 поля | GD01–GD40 — **документальная**, не утверждаемая одновременно UI матрица |
| A04 — compatibility | Bybit UTA/Cross/OneWay, Default Hedge, ограничение non-Default, actual selector |
| A05 — IN/OUT и плановый номинал | per-IN size vs cap, units/qtyStep, multiplier/step, все будущие IN |
| A06 — lifecycle | Instop, Disable latch, OUT triggers, Pause/Close/Failed и ownership |
| A07 — TP/SL/H01 | Profit Bot не приравнивается к net series и Short worst bound |
| A08 — полный риск/R3 | Нормативные FR/RV/TV и no-real-READY сохранены |
| A09 — тесты и нормативы | **102/102 локальных PASS**, 36 документальных GC01–GC36 |
| A10 — workflow | **07.8 `COMPLETED / APPROVED`; 07.9 отдельно разрешён**, PR #1 Open/Draft |

**Незакрытые блокеры:** реальная GinArea P02, поддержка данной пары/стратегии в PRO, private Bybit T02/T03/T04/Mark, доказанное Cross account MMR **RV-02**, ограниченный максимальный убыток Short **RV-03**, подтверждённая P02 **RV-04**, независимый runtime **RV-06**, TV-01–TV-04 и реальный исторический Mark F/A/H/R **FR-038**. Полная спецификационная YAML/CI/настоящая маршрутизация Skills ещё не испытаны.

**Рекомендуемая приёмка:** принять **07.8 только в документальных/синтетических границах**: седьмой настоящий GinArea Skill, 102/102 локальных PASS, 36 нормативных сценариев. **07.9 — итоговая композиционная ревизия — разрешён решением пользователя 19.10.2026; результаты требуют собственной приёмки, до неё этап 07 не закрыт.** PR #1 Open/Draft, не сливать.


## 6. Формальная приёмка 07.8 и разрешение 07.9 — 19.10.2026

**Прямое решение пользователя «Принимаю. Дальше.»:** шаг **07.8 `COMPLETED / APPROVED`** в строго документально-синтетических границах: седьмой созданный Skill, 102/102 локальных синтетических тестов и 36 отдельно документированных сценариев. «Дальше» **разрешает шаг 07.9** — итоговую композиционную ревизию и отчёт; не принимает его заранее, **не завершает весь этап 07**, не разрешает слияние PR и тем более реальные торговые действия. Сохраняются RV-02/RV-03, RV-04/RV-06, TV-01–TV-04, отсутствие реального P02/T02/Mark, полный FR-038 F/A/H/R и запрет необоснованного READY. [PR #1](https://github.com/vbondarev/crypto-trading-agent/pull/1) Open/Draft.
