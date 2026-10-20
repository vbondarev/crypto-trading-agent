# Шаг 08.8 — единые форматы ответов, доказательность и RECHECK

> **Текущий статус: `COMPLETED / APPROVED` (20.10.2026)** по [формальной приёмке 08.8](../stage-08-08-validation.md#5-формальная-приёмка-088-и-разрешение-089--20102026). По отдельной команде реализован **08.9**, ожидающий приёмки. Историческое `PENDING USER REVIEW` ниже отражает раннее состояние 08.8, а не актуальный статус.

> **Статус: `IMPLEMENTED / PENDING USER REVIEW` (20.10.2026).** Пользователь отдельно принял 08.7 и разрешил **только** 08.8. Шаг 08.9 `NOT STARTED`. Документ задаёт копируемые шаблоны и нормативный контракт — **не** runtime отчётного движка, не независимый запуск Skills и не готовность к торговле. PR #1 Open/Draft.

## 1. Назначение, ссылки и терминология

Предоставить **однообразные, короткие по смыслу** ответы для образования/обзора `RT01/RT02 R1`, условной техники `RT03 R2`, портфеля и восстановления `RT04/RT05`, сравнения `RT06/08.5`, Veles `RT07`, GinArea PRO `RT08`, выбранной **одной** платформы в финальном аудите `RT09 R3` и `RT10 RECHECK`. Шаблоны не разрешают эскалацию R1→R2→R3 сами по себе; цель и степень доказанности определяются **запросом пользователя и реально полученными данными**.

Нормативные источники: [AGENTS](../../AGENTS.md), [утверждённые RT01–RT10 и машина состояний](interaction-contract.md), [freshness и AD-009](../data-freshness.md), [T01–T06](../input-templates.md), [R1 обзор](../prompts/market-overview.md), [R2 технические сценарии](../prompts/technical-scenario.md), [портфель/H01](../prompts/portfolio-recovery.md), [risk/CHOOSE](../prompts/risk-strategy-decision.md), [Veles 08.6](../prompts/veles-configuration.md), [GinArea 08.7](../prompts/ginarea-configuration.md), [риски FR-027–FR-040/S0–S3](../risk-management.md), [P01/P02/T02](../platforms/platform-validation.md), [08.8 в согласованном плане](../stage-08-plan.md). Применимость Skill из `.agents/skills` доказывать **фактическим чтением тела**, а не ссылкой/README; его `body_read=false` или `PARTIAL` нельзя скрывать. Не требовать личный T02/P02 для образовательного RT01 или R1 общего обзора.

**Три разные оси состояния, не смешивать в один статус:**

| Ось | Допустимые значения | Смысл |
|---|---|---|
| `analysis_mode` | `EDUCATIONAL / R1 / R2 / R3_AUDIT` | Какой ответ запрошен, **не** результат торговли |
| `dialogue_step` | `ASK / ANALYZE / CHOOSE / RECHECK / STOP` | Следующее действие в беседе; **RECHECK не результат биржевой операции** |
| `decision` **только когда уместна оценка действия** | `REJECTED / UNVERIFIED / NEEDS_DATA / READY` | Исход доказательной проверки торгового действия/конфигурации, а **не** оценка качества R1-обзора |

Отдельно для **полей** использовать `CURRENT / STALE / MISSING / TIME_UNVERIFIED / CLOCK_CONFLICT / CONFLICT / INFERRED / NOT_CHECKED`; для недоступного Skill — `NOT_LOADED/PARTIAL`; для области `PARTIAL_SCOPE`; для предварительного отчёта `DOCUMENTARY / PRELIMINARY`. **Не выдавать `NOT_CHECKED` за пятый торговый статус**, а `CURRENT` за доказанный риск. Для R1/чисто описательного R2 **не приписывать READY/REJECTED без запроса торговой проверки**.

## 2. Общая минимальная «оболочка» ответа

Показывать **только применимые** строки и без машинного мусора. Конкретный источник/время — только если он действительно указан пользователем или фактически получен; не выдумывать даты, URL, цены, версии UI, SHA, уровень полноты и положительные статусы.

1. **Задача/охват:** `route, mode, symbol, exact_market (Bybit USDT Perpetual | иное с оговоркой), timeframe/horizon, account_scope, bot/platform/mode если выбран`.
2. **Факты/источники:** каждое критичное наблюдение как `metric, value, unit, price_kind(Last|Mark|Index|OHLCV), source, observed_at|snapshot_at|response_time_proxy, retrieved_at, coverage, provenance(USER_PROVIDED|INDEPENDENT|UNKNOWN)`. Если важный timestamp неизвестен — `UNKNOWN_TIME/TIME_UNVERIFIED`, не писать «сейчас».
3. **Метод и известное:** разделять **FACT / CALCULATED (с входами и методикой) / HYPOTHESIS / NOT_CHECKED / MISSING / UNVERIFIED**; отдельно объяснять качество свечей, source conflicts, выбранные параметры индикатора, fee/funding и Decimal rounding при применимости.
4. **Результат:** один прямой ответ или структурированное сравнение применимых вариантов, что именно было/не было доказано. Для R2 Long/Short/WAIT — условные триггеры, инвалидации, альтернативный неблагоприятный путь, **не приказ**. Для портфеля — S0/S1/S2/S3 с owner/позиционным режимом и `L_lifecycle/L_from_now` для H01.
5. **Риски/ограничения:** только релевантные `FR-027–FR-040` с `evidence/value/threshold/status` и **отдельные открытые блокеры**; доказанный breach/известный H04 не скрывать за неполнотой иных полей.
6. **Следующий шаг:** **один** наименьший нужный запрос `ASK`, либо `CHOOSE` только нужной оси (платформа, стратегия, действие), `RECHECK` по изменившимся зависимостям, либо `STOP`. Не просить все T01–T06, если вопрос прост.

В документальных образцах запрещено записывать реальные UID, ключи, балансы, адреса, персональные позиции или скриншоты пользователя. **Все числовые примеры ниже вымышлены и помечены SYNTHETIC**, без утверждений о рынке.

## 3. Шесть компактных копируемых шаблонов

### P08-36 — образовательный/R1 краткий обзор рынка

> Ответь кратко по {ТЕМА или ПАРА}: сначала итог, затем факты с точным рынком/источником/временем, затем существенная неопределённость. Если котировка не проверена — не называй её текущей. Не спрашивай T02, P02, депозит или API-ключи и не выдавай торговый READY.

**Выход `RT01/RT02`, `EDUCATIONAL/R1`:**

- `Обзор:` 2–4 предложения — только подтверждённые наблюдения или честно маркированный исторический контекст.
- `Данные:` пара, рынок, Last/Mark/Index не путать, источник, `observed_at/snapshot_at` или `UNKNOWN_TIME`.
- `Граница:` чего нет/что устарело; для текущего R1 контекста цена имеет ориентир **≤15 минут** при надёжном timestamp, но это не подтверждает «прямо сейчас».
- `Следующий шаг:` один необязательный вопрос только если пользователь просит конкретный аспект. **Без торгового статуса**.

### P08-37 — условный R2 технический Long/Short/WAIT

> Составь предварительные сценарии Long/Short/WAIT для {ПАРА, TF, ГОРИЗОНТ}. Отдельно укажи проверенные закрытые OHLCV, источник и время Last/Mark, индикаторные расчёты/достаточность warm-up, сигналы и условия отмены. Если данных нет — не придумывай уровни и не выдавай READY.

**Выход `RT03/R2`:** `market identity → closed OHLCV (startTime, gaps, timeframe, warmup) → indicators with method → Long/Short/WAIT conditional → invalidation/adverse path → missing data → CHOOSE/STOP`. Для внутридневного R2 цена ≤**5 минут** при доказанном наблюдении, даже при меньшем возрасте AD-009 может ужесточить свежесть. Не переносить Binance Spot Last в Bybit USDT Perpetual Mark. Незакрытая свеча не должна становиться последней закрытой.

### P08-38 — портфель/позиция/серия H01

> Проверь мои {ПАРА или ВЕСЬ ФЬЮЧЕРСНЫЙ ПОРТФЕЛЬ} по доступным T02/T03/T04 и, если требуется результат восстановления, T05. Покажи подтверждённый охват, S0/S1/S2/S3, реальные позиции и будущие IN, отдельные fees/funding и чистый H01. Не заполняй отсутствующие разделы нулями.

**Выход `RT04/RT05`:** `account_scope/coverage/pages/at → E0, actual Cross/Isolated/UTA/positionIdx → S0 positions/IM/MM → S1 active & conditional orderId/leavesQty → S2 reachable future IN bot/virtual/owner → S3 model/stress uncertainty → H01 net (realized/unrealized/fees/funding once) → L_lifecycle vs L_from_now → limitations → ASK`. **PARTIAL_SCOPE** или неполные T02 — полезный ограниченный вывод **не** полный риск-чек/READY; `POSITION -1` Veles не добавляет exchange slot; GinArea One-Way virtual Long/Short не становятся двумя hedge-слотами.

### P08-39 — сравнение действий и risk gate

> Для {СИТУАЦИЯ} сравни только применимые WAIT/HOLD/NEW/ADD/REDUCE/CLOSE/RECOVER и укажи доказанные FR-нарушения и недостающие проверки. Известный H04 и доказанные жёсткие лимиты должны блокировать расширение риска. Предложи выбор, но не исполняй его и не выдавай финальную P02 без отдельного подтверждения.

**Выход `RT04/RT05/RT06, R2 or R3_AUDIT only when explicitly requested`:** таблица `action; prerequisite; evidence; beneficial branch; adverse branch; fees/funding; effect-on-S0..S3; FR-state; next-user-choice`. Допустимые исходы **не смешивать**: известный **H04**, day loss **≥3%**, HWM DD **≥15%**, leverage >5×, projected IM >30% E0, bot worst net loss >5% E0, adverse liq distance <15%, >3 reachable slots, full future reserve shortfall ⇒ **REJECTED новой нагрузки** при доказанности, даже если P02 отсутствует; существенный неизвестный Cross/Short/owner/family H ⇒ `UNVERIFIED`; отсутствующий T02/Mark/P02 для финального входа ⇒ `NEEDS_DATA`. Отсутствие H02/H03 ⇒ `NOT_CHECKED`, **не** автоматически REJECTED. `WAIT` при действующей опасной позиции не risk-free.

### P08-40 — черновик P02 Veles/GinArea и финальный R3 audit

> Я отдельно выбрал {Veles SIMPLE/CUSTOM/SIGNAL или GinArea PRO Default/Auto/Dynamic/Indicator/DCA}, {ПАРА}, {НАПРАВЛЕНИЕ}. Для R2 дай только предварительный документальный проект. Если я прошу финальную сверку R3, используй исключительно мою актуальную фактическую P02 и полный свежий T02/T03/T04 Bybit; покажи реальные поля, единицы, весь риск/FR-матрицу и не выводи READY при открытых доказательных блокерах.

**Выход `RT07 Veles / RT08 GinArea; финальный RT09 для одной выбранной платформы`:**
- **R2**: `DOCUMENTARY/PRELIMINARY`, документированные P01-категории с `P02_UNKNOWN`, без мнимых min/max/default и готовых торговых значений, без настройки обеих платформ сразу.
- **R3**: `exact P02 label | chosen strategy/mode/version | visible_if | unit | input & rounding | source/time/provenance | exchange order constraints | all planned IN/OUT | S0–S3 exposure | mandatory FR gate`.
- Пример обязан проверять **GinArea Indicator Grid→Default только после отдельного явного CHOOSE**; Veles `Stop/Cancel` и GinArea `Pause/Disable IN` **не** подтверждают биржевой close. Для R3 T02 **≤5 минут**, настоящий Bybit Mark **≤2 минуты** и проверка *отсутствия AD-009 событий*, actual P02 и все F/A/H/**реальные historical Bybit Mark**/R, Cross MMR и строгий Short-loss bound. При известных RV-02/RV-03/RV-04/RV-06, TV-01–TV-04 нельзя синтетикой объявить реальный `READY`.

### P08-41 — инкрементальный RECHECK после события

> После {FILL/частичного FILL/нового ордера/изменения Equity/сетки/P02/Disable IN/restart} перепроверь только затронутые зависимости моего предыдущего вывода {ОБЪЕКТ и время}. Покажи, что стало недействительным, какие свежие T02/T03/T04/Mark/P02 нужны и что можно сохранить. Не повторяй старый READY и не выполняй биржевых действий.

**Выход `RT10 RECHECK`:** `event observed_at/received_at (known/unknown); invalidated_fields/scope; old conclusion INVALIDATED; any durable background facts retained; fresh evidence required; recalculated FR/outcome only when verifiable; one ASK/CHOOSE/STOP`. Ниже — строгая **матрица зависимостей**, а не полная перезагрузка всех данных при любом событии. Если событие меняет общий риск Cross, необходимо обновить whole T02 и все связанные S0–S3, **не** только экран позиции.

## 4. RECHECK: зависимости и порядок

**AD-009 приоритетнее TTL**: материальное событие сразу инвалидирует зависимый вывод, даже если `now-snapshot_at<5m`, `now-Mark.observed_at<2m` и последний ответ был READY. `retrieved_at` при пересылке не омолаживает наблюдение, отсутствие timestamp не превращается в свежесть.

| ID | Событие / изменённый объект | Что обязательно инвалидировать | Что может остаться пригодным при доказанном scope |
|---|---|---|---|
| **RC01** | Fill/partial fill, вручную или ботом, новый `execId` | T02 позиции, active/conditional order set, `cumExecQty/leavesQty`, T03 average/qty, ownership, S0–S3 IM/MM/slotted risk, dependent PnL, risk decision | Старая датированная свеча/официальные правила P01, **не** старый риск READY |
| **RC02** | Создан/отменён ордер, replace, trigger, confirmed cancel | T02 pending orders, bot T04 IN/OUT obligations, future reserve, S1/S2/S3 and action outcome | Закрытые исторические свечи, если не изменялись и актуальны для своего периода |
| **RC03** | Equity deposit/withdrawal, realized PnL, funding, fee, portfolio exposure | E0/flow-adjusted metrics, current IM%, bot-loss%, H01 where applicable, daily/HWM, S3 and affected risk decision | Версия P02, если форма отдельно не изменена, но **не** гарантирует старый риск |
| **RC04** | Cross/Isolated, leverage, position mode, risk tier, account/collateral changes | Full T02, account MMR, all positions/owners, Mark→liq, all S0–S3, FR-029–FR-034, H04 applicability | Документальные значения P01 как исторический контекст |
| **RC05** | Bot grid/multiplier/size/cap/IN/OUT, Veles restart, GinArea strategy change | T04, reachable IN/OUT, P02 selected mode, bot ownership, full future reserve, S1/S2/S3, decision | Ранее закрытые исторические бары вне новой задачи |
| **RC06** | GinArea Disable IN toggled, out-of-bounds latch, manual reset | Новая IN-доступность, existing orders unknown until Bybit confirm, S1/S2 reserve, bot/risk decision; **sticky** flag сохраняется на возврате цены | Реальная уже открытая биржевая позиция сохраняется, пока не подтверждён закрывающий fill |
| **RC07** | Veles Stop/Cancel, GinArea Pause/Failed/Close request | Управление ботом и предполагаемое закрытие; независимая биржевая позиция/orderIds/owner обязательны к сверке | Факт нажатия кнопки как действие пользователя, **не** подтверждение close |
| **RC08** | P02 version, mode, pair selector, visibility, strategy or UI changes | Exact labels/fields/units/min-max, selected algorithm and all dependent R3 config rows | P01 общая справка при её актуальности; **не** прежняя P02 |
| **RC09** | Bybit Last/Mark change, волатильность, пропуск closed OHLCV | Зависимые price-based triggers, indicator confirmations, Mark→liq, R2 levels and R3 risk | Нерелевантная нетронутая H01 realised history; текущее рыночное заключение заново |
| **RC10** | Тест P01 изменился/Skill недоступен/конфликт источников или HTTP 403 | Claims of source proof / runtime completeness; critical R3 method may be `UNVERIFIED` | Отдельно датированный пользовательский факт при правильной подписи; не обозначать independent |

**Порядок `RECHECK`:** (1) отметить источник события и точное время *или UNKNOWN*, (2) сбросить **все зависимые** утверждения о торговом допуске, (3) вычислить scope по таблице RC01–RC10 и трассировке source/owner, (4) запросить **минимальную недостающую свежую** часть данных, при Cross/общем счёте пересобрать complete T02/T03/T04 и Mark; при UI изменении перечитать P02, (5) повторить необходимые S0–S3/FR gate F/A/H/R только при надёжных данных, (6) пользовательский выбор не равен приказу; результат может быть `REJECTED/UNVERIFIED/NEEDS_DATA`, а не автоматически `READY`.

**Состояние готовности не наследуется:** даже когда вычисления повторно совпали, новый R3 требует самостоятельного доказательства актуальной P02, T02/Mark и отсутствия других неучтённых изменений. Не подтверждённый event timestamp ⇒ `TIME_UNVERIFIED`. **Нет самостоятельного фонового мониторинга**: события приходят из текущего запроса/подтверждённых данных, не выдумывать наблюдение.

## 5. R3 audit: обязательные строки без ложной готовности

| Гейт | Сведения и состояние | Блокирующее условие для **нового риска** |
|---|---|---|
| Identity & source | Bybit `category=linear/settleCoin=USDT`, selected pair, selected one-platform P02, фактическое чтение Skills | Unknown/missing P02/Skill ⇒ `NEEDS_DATA/UNVERIFIED` |
| Sync & freshness | full T02/T03/T04 ≤5 min, actual Bybit Mark ≤2 min, no AD-009 event, timestamp provenance | Older/MISSING ⇒ `NEEDS_DATA`; model/clock conflict ⇒ `UNVERIFIED` |
| S0–S3 | Equity E0>0, Cross/Isolated, positionIdx, orderId/leavesQty, all bot/manual virtual future IN, IM/MM, H01 and owners | Missing entire account pages or reachable obligations ⇒ `NEEDS_DATA/UNVERIFIED` |
| FR-029 | max reachable IM ≤**30% E0** | >30% ⇒ `REJECTED` |
| FR-030 | bot strict worst-case net loss ≤**5% E0** with Short gap/slippage, fees/funding | >5% ⇒ `REJECTED`; cannot bound ⇒ `UNVERIFIED` |
| FR-031 | leverage ≤**5×** | >5× ⇒ `REJECTED` |
| FR-032 | adverse Bybit Mark→liq distance ≥**15%**, Cross account MMR | <15% ⇒ `REJECTED`; unproven Cross safety ⇒ `UNVERIFIED` |
| FR-033 | ≤**3** simultaneously reachable exchange position slots | >3 ⇒ `REJECTED` |
| FR-034 | **100%** required future IM + fees/funding/slippage buffers | shortfall ⇒ `REJECTED`; unbounded cycles ⇒ `UNVERIFIED` |
| FR-035/036 | Known H04, verified Moscow day loss **≥3%**, HWM drawdown **≥15%** | Active H04/boundaries trigger `REJECTED`; H02/H03 missing ⇒ `NOT_CHECKED` |
| FR-037/038 | correlation/concentration; **F/A/H/R**, real dated Bybit Mark historical **H** | No true H stress/other mandatory proof ⇒ `UNVERIFIED`, no live READY |
| FR-039/040 | STOP new IN when veto; user controls next manual choice; independent evidence for safe action | Discussion or acceptance of a report ≠ execution |

Decision priority for an action: **confirmed hard veto ⇒ `REJECTED`** even when other inputs `NEEDS_DATA`; critical conflict/unprovable model ⇒ `UNVERIFIED`; mandatory but obtainable missing data ⇒ `NEEDS_DATA`; **`READY` only after all required independent checks**, which this document **does not** establish. Include **all accompanying unknowns**, not just highest priority outcome.

**Known unresolved RV-02 (Cross MMR), RV-03 (Short finite loss), RV-04 (actual Veles/GinArea P02), RV-06 (independent Skills runtime), TV-01–TV-04 and real dated Bybit Mark FR-038 F/A/H/R** cannot be closed by synthetic checks, user acceptance of stage 08 or template formatting. **Do not print actual READY in fabricated examples.**

## 6. Normative synthetic reporting cases RF01–RF40

| ID | Вымышленное условие | Ожидаемый результат |
|---|---|---|
| RF01 | RT01: «Что такое Short?» | Обычный ответ без P02/T02/READY |
| RF02 | RT02: общий BTC обзор, данных счёта нет | R1 краткий отчёт, без запроса T02 |
| RF03 | R1 Bybit Last в 12:00, observed 11:45, точный источник | На 15-минутной границе допустима **датированная** контекстная отметка |
| RF04 | R1 observed_at отсутствует, retrieved_at свежий | `TIME_UNVERIFIED`, не «актуальная» цена |
| RF05 | R2 на Bybit, Binance Spot Last вместо Bybit Mark | Нет Mark-ликуидации, `NEEDS_DATA` для зависимого расчёта |
| RF06 | R2 price observed 6m назад | `STALE`, не публиковать точные текущие уровни |
| RF07 | R2 незакрытая свеча в качестве последней закрытой | Исключить открытую и перепроверить индикаторы |
| RF08 | 2D техника/EMA без warmup или gaps | Обозначить метод и `NEEDS_DATA`, не выдумывать |
| RF09 | RT04: известен только один символ счёта | `PARTIAL_SCOPE`, не выдавать полный FR-risk |
| RF10 | Partial fill IN qty=10, executed=4 | Future leavesQty=6, executed в синхронном S0 один раз |
| RF11 | Veles POSITION −1 | Не второй биржевой slot |
| RF12 | GinArea One-Way 2 виртуальных side, netQty=0 | Может остаться future IN и 0 текущих exchange slots |
| RF13 | H01 gross realized=-15, uPnL=+10, fees=1, funding=2 | Net **-8 USDT**, не `RECOVERED` |
| RF14 | H01 netRealized уже net комиссий/funding | Не вычитать fees/funding повторно |
| RF15 | Equity история H02/H03 отсутствует, H04 неизвестен | `NOT_CHECKED`, не автоматический REJECTED |
| RF16 | Достоверно активен H04 | `REJECTED` расширения риска |
| RF17 | Дневной убыток ровно 3% от корректной E0 baseline | `REJECTED` новой нагрузки |
| RF18 | Drawdown HWM ровно 15% доказан | `REJECTED` новой нагрузки |
| RF19 | Leverage=8× при максимуме 5× | `REJECTED` |
| RF20 | Leverage=5×, другие FR неизвестны | Отдельный numeric PASS **не** общий READY |
| RF21 | Новый будущий slot четвёртый | `REJECTED`, нельзя считать только текущие позиции |
| RF22 | Cross liqPrice есть, account MMR недоказан | `UNVERIFIED`, не READY |
| RF23 | Synthetic 4 price paths вместо Bybit historical Mark | F/A/H/R не пройдена, `UNVERIFIED` |
| RF24 | R3 полный T02 возрастом 6 минут | `NEEDS_DATA` новый снимок; no READY |
| RF25 | R3 Mark возрастом 3 минуты | `NEEDS_DATA` новый Bybit Mark; no READY |
| RF26 | R3 T02 1m, Mark 1m, но произошёл fill | `RECHECK`; прежнее решение INVALIDATED |
| RF27 | Новая позиция + несвязанные свечи | Пересчитать T02/S0–S3, не обязательно переобрабатывать все старые bars |
| RF28 | P02 интерфейс сменился, T02 ещё свежий | `RECHECK` P02 и зависящий конфиг |
| RF29 | Сменился режим маржи в Cross | `RECHECK` **всего** счёта/MMR/S3, не один экран |
| RF30 | GinArea Disable IN out-of-bounds и возврат inside | Sticky ON; не авто-ENABLE и не qty=0 |
| RF31 | GinArea Pause или Veles Cancel | Не подтверждён Bybit CLOSE |
| RF32 | Indicator недоступен, Default вариант существует | Только отдельный пользовательский CHOOSE |
| RF33 | P01 официальный, P02 реальный неизвестен | R2 DOC only, не copy-ready exact R3 |
| RF34 | Стратегия/платформа не выбрана | `CHOOSE` нужной оси, не настройки двух ботов |
| RF35 | 08.7 принят, пользователь не одобрял сделку | Не действие с биржей, не `READY` |
| RF36 | Пользователь прислал вчерашний скрин сейчас | `retrieved_at` не меняет `snapshot_at` |
| RF37 | Mark отсутствует, есть только spot/Last | Price_kind mismatch, `NEEDS_DATA` |
| RF38 | Подтверждён hard veto + P02 отсутствует | Итог `REJECTED` с дополнительным `NEEDS_DATA` |
| RF39 | GitHub 403, нужный Skill не прочитан | `NOT_LOADED`, partial fallback, не фиктивный R3 |
| RF40 | Пользователь согласовал отчёт 08.8 | Это не разрешение на 08.9, real orders или PR merge |

RF01–RF40 — **нормативные ожидания, не 40 независимых прогонов ChatGPT**. В [JS-синтетических тестах](../../tests/stage-08-08-report-templates-synthetic.mjs) используются вымышленные сценарии и source-bound проверки. Фактические результаты фиксирует [протокол/self-review 08.8](../stage-08-08-validation.md).

## 7. Приёмка и дальнейшие этапы

Подтвердить шесть применимых форматов P08-36–P08-41, отсутствие лишнего T02/P02 для R1, честную маркировку трёх осей, provenance/time/units и неопределённости, настоящие R1/R2/R3 границы, S0–S3/H01, корректный приоритет рисков и RECHECK-карту RC01–RC10; фактические JS-тесты, self-review, ссылки; не переносить исторический READY после fill. **У пользователя отдельно спросить приёмку 08.8**, затем только с разрешения начинать **08.9 — интеграционный аудит**. Весь этап 08 не принимать автоматически.

**08.8 `IMPLEMENTED / PENDING USER REVIEW`; 08.9 `NOT STARTED`**, PR #1 Open/Draft; никаких ордеров, live мониторинга, фонового исполнения и merge.
