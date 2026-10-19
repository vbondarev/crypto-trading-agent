# Crypto Trading Agent

**Crypto Trading Agent** — персональный ИИ-аналитик криптовалютного рынка, фьючерсного портфеля Bybit и отдельных торговых позиций. Он исследует доступные внешние данные, определяет тренд, проводит технический анализ и риск-менеджмент, предлагает стратегию и готовит проверяемую конфигурацию **Veles или GinArea для ручного применения**.

Если исходных данных недостаточно либо обязательные ограничения риска не соблюдены, результатом будет запрос недостающих сведений, предварительный анализ или аргументированный отказ.

## Принцип работы

- **Интерфейс:** диалог с ChatGPT. Каждый шаг утверждённого многоэтапного сценария запускается пользователем.
- **Инструкции:** публичный репозиторий GitHub с правилами и документацией.
- **Рыночная информация:** действительно доступные публичные источники; время и происхождение значимых данных указываются при анализе.
- **Портфель:** приватные сведения Bybit пользователь предоставляет в чате, если этого требует задача. Они не публикуются в GitHub.
- **Результат:** аналитический отчёт, сценарии, стратегия и конфигурация Veles/GinArea либо обоснованный отказ.
- **Исполнение:** пользователь самостоятельно применяет настройки в торговой платформе. MVP не требует собственной серверной или торговой инфраструктуры.

Первый охват — Bybit USDT Perpetual: Long/Short, Cross/Isolated. Для обзора монеты данные личного портфеля не обязательны; для финального подтверждения конфигурации необходима проверка **всего фьючерсного портфеля** и строгих лимитов риска.

## Документация

| Документ | Назначение |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Точка входа: правила загрузки документации и базовое поведение агента |
| [`docs/mvp-scope.md`](docs/mvp-scope.md) | Утверждённые назначение и границы MVP — шаг 03.1 |
| [`docs/requirements.md`](docs/requirements.md) | 53 функциональных требования FR-001–FR-053 — шаг 03.2 |
| [`docs/agent-operating-rules.md`](docs/agent-operating-rules.md) | Общие правила анализа, данных, рисков и формирования конфигураций — шаг 03.3 |
| [`docs/architecture-decisions.md`](docs/architecture-decisions.md) | 9 решений AD-001–AD-009 — шаг 03.4 |
| [`docs/stage-03-review.md`](docs/stage-03-review.md) | Ревизия шага 03.5; RV-01 и RV-05 закрыты, RV-02–RV-04 и RV-06 остаются открытыми |
| [`docs/development-roadmap.md`](docs/development-roadmap.md) | Дорожная карта и фактический прогресс |
| [`docs/chatgpt-github-validation.md`](docs/chatgpt-github-validation.md) | Проверка чтения файлов через GitHub |
| [`docs/stage-04-plan.md`](docs/stage-04-plan.md) | Согласованный план этапа 04 и последовательность шагов 04.1–04.8 |
| [`docs/data-sources.md`](docs/data-sources.md) | 40 категорий данных, 20 групп источников и резервные маршруты — шаги 04.1–04.3 |
| [`docs/data-validation.md`](docs/data-validation.md) | Испытания источников (04.3) и [приёмка 04.7](docs/data-validation.md#168-приёмка-шага-047--утверждено-пользователем-15102026) с TV-01–TV-04 |
| [`docs/data-freshness.md`](docs/data-freshness.md) | Правила R1–R3 и свежести данных — шаг 04.4 утверждён, RV-05 закрыт |
| [`docs/input-templates.md`](docs/input-templates.md) | Шесть шаблонов T01–T06 — шаг 04.5 завершён и утверждён пользователем |
| [`docs/stage-04-07-synthetic-tests.md`](docs/stage-04-07-synthetic-tests.md) | 32 формализованных синтетических сценария, принятых на 04.7 |
| [`docs/stage-04-07-blind-run.md`](docs/stage-04-07-blind-run.md) | Журнал 8/8 выборочных ответов отдельного ChatGPT, с ограничением TV-01 |
| [`docs/stage-04-08-review.md`](docs/stage-04-08-review.md) | Итоговая [приёмка шага 04.8 и этапа 04](docs/stage-04-08-review.md#7-формальная-приёмка-шага-048-и-завершение-этапа-04--15102026), с TV-01–TV-04 |
| [`docs/stage-05-plan.md`](docs/stage-05-plan.md) | Утверждённый план этапа 05, шаги 05.1–05.8 |
| [`docs/stage-06-plan.md`](docs/stage-06-plan.md) | Утверждённый план 06.1–06.8 (15.10.2026), 06.1 принят; 06.2 принят; 06.3 принят 16.10.2026; 06.4 принят; 06.5 принят 16.10.2026; 06.1–06.8 и этап 06 приняты 16.10.2026; проект плана этапа 07 ожидает утверждения |
| [`docs/platforms/platform-validation.md`](docs/platforms/platform-validation.md) | Контракт P01/P02, реестр официальных источников, матрица C01–C14 и 28 нормативных сценариев шага 06.1 — принят 15.10.2026 |
| [`docs/platform-06-01-validation.md`](docs/platform-06-01-validation.md) | Протокол и приёмка 06.1 (15.10.2026): 24/24 локальных синтетических проверок, без подтверждения реальной формы |
| [`docs/platforms/veles.md`](docs/platforms/veles.md) | 06.2 принят; **06.3 принят 16.10.2026:** статусы Veles/Bybit, сетки, TP/SL/BE, ручная отмена и restart, 34 нормативных сценария |
| [`docs/platform-06-02-validation.md`](docs/platform-06-02-validation.md) | Протокол и приёмка 06.2 (16.10.2026): 7 официальных источников, 30 нормативных сценариев и 32/32 локальных синтетических проверок |
| [`docs/platform-06-03-validation.md`](docs/platform-06-03-validation.md) | **Шаг 06.3 (принят 16.10.2026):** 50/50 локальных тестов, 34 документальных сценария, восемь публичных справочных источников |
| [`docs/platforms/ginarea.md`](docs/platforms/ginarea.md) | **06.4 и 06.5 приняты 16.10.2026:** GinArea PRO, GD-01–GD-40, стратегии Default/Auto/Dynamic/Indicator/DCA, режимы Bybit, 36 нормативных сценариев |
| [`docs/platform-06-04-validation.md`](docs/platform-06-04-validation.md) | Протокол GinArea PRO 06.4: **48/48 локальных синтетических проверок**, 14 официальных справочных источников |
| [`docs/platform-06-05-validation.md`](docs/platform-06-05-validation.md) | **06.5 принят 16.10.2026:** 66/66 локальных проверок, 40 нормативных сценариев, 18 переходов IN/OUT/Disable IN |
| [`docs/platforms/configuration-contract.md`](docs/platforms/configuration-contract.md) | **06.6 принят 16.10.2026:** 24 сопоставления Veles/GinArea, typed money, Bybit quantity/price filters, P02/ownership и запрет ложного READY |
| [`docs/platform-06-06-validation.md`](docs/platform-06-06-validation.md) | Протокол 06.6: 65/65 локальных JS-проверок, 32 нормативных сценария и 6 учебных примеров |
| [`docs/platforms/platform-synthetic-tests.md`](docs/platforms/platform-synthetic-tests.md) | **06.7 и 06.8 приняты 16.10.2026:** 40 негативных эталонов, портфельные стресс-требования F/A/H/R и незакрытые риски |
| [`docs/platform-06-07-validation.md`](docs/platform-06-07-validation.md) | Протокол 06.7: **57/57 первоначально; после ревизии 06.8 — 64/64 локальных теста**, не реальные стресс-протоколы F/A/H/R |
| [`tests/stage-06-07-synthetic.mjs`](tests/stage-06-07-synthetic.mjs) | Воспроизводимый синтетический JS-модуль: **64/64 PASS после 06.8**; не код торгового агента |
| [`docs/stage-06-review.md`](docs/stage-06-review.md) | **06.8 и этап 06 приняты 16.10.2026:** ревизия FR-047–FR-053, исправления 7 регрессий, открытые RV/TV/F/A/H/R |
| [`docs/stage-07-plan.md`](docs/stage-07-plan.md) | **План этапа 07 принят 16.10.2026** — 9 шагов, 7 созданных Skills; 07.1–07.9 и весь этап 07 приняты 19.10.2026 в документально-синтетических границах; 08 планируется |
| [`docs/stage-07-skills-contract.md`](docs/stage-07-skills-contract.md) | **07.1 принят 19.10.2026:** контракт frontmatter, маршрутов R1/R2/R3, реестра семи Skills, 32 нормативных сценариев |
| [`docs/stage-07-01-validation.md`](docs/stage-07-01-validation.md) | Протокол 07.1: **52/52 выполненных локальных проверок**, без фактического runtime Skills |
| [`tests/stage-07-01-contract-synthetic.mjs`](tests/stage-07-01-contract-synthetic.mjs) | Воспроизводимая синтетическая проверка маршрутизатора и простого YAML-frontmatter; не реальный Skill |
| [`.agents/skills/data-verification/SKILL.md`](.agents/skills/data-verification/SKILL.md) | **Первый Skill, 07.2 принят 19.10.2026** — проверка источников и актуальности для R1/R2/R3 |
| [`docs/stage-07-02-validation.md`](docs/stage-07-02-validation.md) | **07.2 принят: 80/80 локальных проверок**, 32 нормативных сценария, реальная загрузка в ChatGPT не проверена |
| [`tests/stage-07-02-data-verification-synthetic.mjs`](tests/stage-07-02-data-verification-synthetic.mjs) | Воспроизводимая синтетическая проверка входных данных и тела первого Skill, без реального Bybit API |
| [`.agents/skills/market-analysis/SKILL.md`](.agents/skills/market-analysis/SKILL.md) | **Второй Skill, шаг 07.3 принят 19.10.2026:** BTC/альткоины, OHLCV, EMA/SMA/RSI/ATR, OI/funding, сценарии R1/R2 |
| [`docs/stage-07-03-validation.md`](docs/stage-07-03-validation.md) | Протокол 07.3: **61/61 локальных синтетических проверок**, 32 документальных ожидания, не live Bybit |
| [`tests/stage-07-03-market-analysis-synthetic.mjs`](tests/stage-07-03-market-analysis-synthetic.mjs) | Воспроизводимый учебный тест Skill/свечей/индикаторов без реальных сделок |
| [`.agents/skills/portfolio-analysis/SKILL.md`](.agents/skills/portfolio-analysis/SKILL.md) | **Третий Skill, шаг 07.4 принят 19.10.2026:** полный T02/T03/T04, реальные слоты Bybit, все IN/OUT, боты, Cross/Isolated, H01 |
| [`docs/stage-07-04-validation.md`](docs/stage-07-04-validation.md) | Протокол 07.4: **77/77 локальных синтетических тестов**, 34 нормативных случая и все недоказанные границы |
| [`tests/stage-07-04-portfolio-analysis-synthetic.mjs`](tests/stage-07-04-portfolio-analysis-synthetic.mjs) | Воспроизводимый синтетический модуль по текущим/будущим позициям, дедуп и H01, не настоящий Bybit API |
| [`.agents/skills/risk-assessment/SKILL.md`](.agents/skills/risk-assessment/SKILL.md) | **Четвёртый Skill, 07.5 принят 19.10.2026:** FR-027–040, full margin, Cross/Short bounds и F/A/H/R без ложного READY |
| [`docs/stage-07-05-validation.md`](docs/stage-07-05-validation.md) | Протокол 07.5: **91/91 локальный синтетический тест**, 36 нормативных случаев, real FR-038/RV открыты |
| [`tests/stage-07-05-risk-assessment-synthetic.mjs`](tests/stage-07-05-risk-assessment-synthetic.mjs) | Воспроизводимая синтетическая проверка лимитов/блокировок/порогов, не реальный risk engine |
| [`.agents/skills/strategy-planning/SKILL.md`](.agents/skills/strategy-planning/SKILL.md) | **Пятый Skill, 07.6 принят 19.10.2026:** NEW/ADD/HOLD/WAIT/REDUCE/CLOSE/RECOVER, H01 net и пользовательский выбор до платформы |
| [`docs/stage-07-06-validation.md`](docs/stage-07-06-validation.md) | Протокол 07.6: **99/99 локальных синтетических тестов**, 36 нормативных сценариев, никакого настоящего READY |
| [`tests/stage-07-06-strategy-planning-synthetic.mjs`](tests/stage-07-06-strategy-planning-synthetic.mjs) | Воспроизводимые сценарии выбора, H01 recovery и запрета автоматического перехода к боту |
| [`.agents/skills/veles-configuration/SKILL.md`](.agents/skills/veles-configuration/SKILL.md) | **Шестой Skill, 07.7 принят 19.10.2026:** только Veles P01/P02, SIMPLE/CUSTOM/SIGNAL, полная сетка, TP/SL/BE, `POSITION -1`, остановка/отмена/закрытие |
| [`docs/stage-07-07-validation.md`](docs/stage-07-07-validation.md) | Протокол 07.7: **92/92 локальных синтетических теста**, 36 нормативных сценариев, реальные P02/T02 и READY не подтверждены |
| [`tests/stage-07-07-veles-configuration-synthetic.mjs`](tests/stage-07-07-veles-configuration-synthetic.mjs) | Воспроизводимые проверки Veles полей, будущих IN, SL/TP, Position −1, отказов при неполноте данных |
| [`.agents/skills/ginarea-configuration/SKILL.md`](.agents/skills/ginarea-configuration/SKILL.md) | **Седьмой Skill, 07.8 принят 19.10.2026:** GinArea PRO, Default/Auto/Dynamic/Indicator/DCA, UTA/Cross, IN/OUT/Instop/Disable IN, P02 и полный риск |
| [`docs/stage-07-08-validation.md`](docs/stage-07-08-validation.md) | Протокол 07.8: **102/102 локальных синтетических проверок**, 36 нормативных сценариев и открытые реальные RV/TV |
| [`tests/stage-07-08-ginarea-configuration-synthetic.mjs`](tests/stage-07-08-ginarea-configuration-synthetic.mjs) | Воспроизводимые синтетические тесты GinArea совместимости, размеров IN, Disable IN, Instop и учёта позиции |
| [`docs/stage-07-review.md`](docs/stage-07-review.md) | **07.9 и весь этап 07 приняты 19.10.2026:** первоначально 796/796, после устранения SR-079-01–04 — 844/844 локальных assertions и 18/18 обнаруженных мутаций; без runtime/реального READY |
| [`tests/stage-07-09-composition-synthetic.mjs`](tests/stage-07-09-composition-synthetic.mjs) | **190/190 локальных композиционных assertions** (142 исходных + 48 прямых policy-guards), 17 route-вариантов; не независимый ChatGPT runtime |
| [`tests/stage-07-09-policy-contract-synthetic.mjs`](tests/stage-07-09-policy-contract-synthetic.mjs) | **48/48 проверок по фактическому тексту 7 Skills/контракту**; тесты также встроены в композиционный модуль, не складывать дважды |
| [`tests/stage-07-09-mutation-synthetic.mjs`](tests/stage-07-09-mutation-synthetic.mjs) | **18/18 in-memory мутаций обнаружены**; ввод критических ошибок намеренно не записывался в репозиторий |
| [`docs/stage-08-plan.md`](docs/stage-08-plan.md) | **План 08.1–08.9 утверждён 19.10.2026:** 08.1 реализован и ожидает отдельной приёмки; 08.2 не начат, RV-02/RV-03/RV-04/RV-06 OPEN |
| [`docs/workflows/interaction-contract.md`](docs/workflows/interaction-contract.md) | **08.1 — контракт диалогов:** R1/R2/R3, RT01–RT10, T01–T06, ASK/ANALYZE/CHOOSE/RECHECK/STOP, проверка фактической загрузки Skills и правила RECHECK |
| [`docs/stage-08-01-validation.md`](docs/stage-08-01-validation.md) | **08.1 реализован, ожидает приёмки:** 32 нормативных IC01–IC32 и 103/103 локальных синтетических проверок, без независимого LLM/runtime |
| [`tests/stage-08-01-interaction-contract-synthetic.mjs`](tests/stage-08-01-interaction-contract-synthetic.mjs) | Воспроизводимый JS-модуль 08.1: маршруты, состояния и ключевые негативные условия; не исполняющий торговый агент |


| [`docs/risk-management.md`](docs/risk-management.md) | **Этап 05 (05.1–05.8) принят 15.10.2026:** контракт данных, IM/сетки, Isolated (§6–§7), Cross (§8–§9), убыток бота (§10–§11), стрессы (§12–§13), HWM (§14–§15), сквозная ревизия FR-027–FR-040 |
| [`docs/risk-05-01-validation.md`](docs/risk-05-01-validation.md) | **Приёмка 05.1:** 12/12 механических проверок и 20 нормативных синтетических ожиданий (не внешние LLM-прогоны) |
| [`docs/risk-05-02-validation.md`](docs/risk-05-02-validation.md) | **Приёмка 05.2 от 15.10.2026:** 24/24 локальных арифметических/логических проверки и 26 синтетических ожиданий |
| [`docs/risk-05-03-validation.md`](docs/risk-05-03-validation.md) | **Шаг 05.3 принят 15.10.2026:** методика Isolated Long/Short, 28/28 локальных проверок и 24 нормативных случая |
| [`docs/risk-05-04-validation.md`](docs/risk-05-04-validation.md) | **Шаг 05.4 принят 15.10.2026:** UTA Cross Account MMR/IMR, 28/28 механических и 28 нормативных проверок; **RV-02 OPEN** |
| [`docs/risk-05-05-validation.md`](docs/risk-05-05-validation.md) | **Шаг 05.5 принят 15.10.2026:** сценарный убыток и предел FR-030, 36/36 проверок Python Decimal и 30 нормативных случаев; **RV-03 OPEN** |
| [`docs/risk-05-06-validation.md`](docs/risk-05-06-validation.md) | **Приёмка 05.6 от 15.10.2026:** корреляция и четыре стресса, 47/47 локальных проверок, 36 нормативных ожиданий; реальные Mark-эпизоды не проверены |
| [`docs/risk-05-07-validation.md`](docs/risk-05-07-validation.md) | **Шаг 05.7 принят 15.10.2026:** HWM, дневные 3%, H04, 48/48 локальных проверок и 34 нормативных эталона |
| [`docs/risk-validation.md`](docs/risk-validation.md) | **Шаг 05.8:** интеграционная ревизия 14/14 FR-027–FR-040 и 109/109 локальных синтетических проверок, **принят с этапом 05 15.10.2026**; реальные Cross/Short остаются открытыми |

**Этапы 03 и 04 завершены. План этапа 05 утверждён; шаг 05.1 принят пользователем 15.10.2026:** шаги 04.1–04.6 завершены и утверждены (14.10.2026); приняты [правила неполноты данных](docs/data-freshness.md#118-приёмка-046--утверждено-пользователем) и [запросы по шаблонам](docs/input-templates.md#144-приёмка-дополнения-046). **04.7 утверждён пользователем 15.10.2026** ([решение о приёмке](docs/data-validation.md#168-приёмка-шага-047--утверждено-пользователем-15102026)) с ограничениями **TV-01–TV-04**: [32 синтетических кейса](docs/stage-04-07-synthetic-tests.md), 32/32 совпадений формализованных решений, 12/12 механических проверок и [8/8 PASS ответов отдельного ChatGPT](docs/stage-04-07-blind-run.md). Фактическое чтение всех GitHub-инструкций в отдельном тестовом чате независимо не доказано (TV-01), реальные модели риска и готовность бота не подтверждены. **04.8 и весь этап 04 утверждены пользователем 15.10.2026** ([запись о приёмке](docs/stage-04-08-review.md#7-формальная-приёмка-шага-048-и-завершение-этапа-04--15102026)) с TV-01–TV-04. [План этапа 05](docs/stage-05-plan.md#7-приёмка-плана-этапа-05--утверждено-пользователем-15102026) утверждён пользователем 15.10.2026; [шаг 05.1](docs/risk-management.md) выполнен и [официально принят](docs/risk-05-01-validation.md#6-приёмка-шага-051--утверждено-пользователем-15102026); [Шаг 05.2](docs/risk-management.md#4-экспозиция-маржинальная-загрузка-и-число-позиций-шаг-052) **принят 15.10.2026** ([акт приёмки](docs/risk-05-02-validation.md#6-приёмка-шага-052--утверждено-пользователем-15102026)); **05.3 принят пользователем** ([акт](docs/risk-05-03-validation.md#5-формальная-приёмка-шага-053--15102026)); **05.4 утверждён пользователем** ([акт](docs/risk-05-04-validation.md#6-приёмка-054--утверждено-пользователем-15102026)), **RV-02 OPEN**; **05.5 принят пользователем** ([акт](docs/risk-05-05-validation.md#6-приёмка-шага-055--решение-пользователя-от-15102026)), **RV-03 OPEN**; **05.6 утверждён пользователем** ([акт](docs/risk-05-06-validation.md#6-формальная-приёмка-шага-056--15102026)); **05.7 утверждён пользователем** ([акт](docs/risk-05-07-validation.md#6-формальная-приёмка-шага-057--15102026)); **05.8 и весь этап 05 приняты 15.10.2026** ([акт](docs/risk-validation.md#7-формальная-приёмка-058-и-завершение-этапа-05--15102026)), документально, без подтверждения реального READY. RV-02/RV-03 открыты, PR #1 Draft. TV-01–TV-04 остаются действующими. PR #1 остаётся Draft. RV-01 и RV-05 закрыты на уровне согласованных правил. Следующие этапы включают методики оценки рисков, подтверждение интерфейсов Veles/GinArea, Skills, пользовательские сценарии и испытания. Спецификация описывает **целевой MVP**; документы не доказывают доступность всех источников или готовность реальной торговой конфигурации.

## Как начать работу с инструкциями

При запуске нового сценария укажи репозиторий, актуальную ветку и задачу. Во время разработки используется ветка `feature/initial-agent-mvp` в рамках [Draft PR #1](https://github.com/vbondarev/crypto-trading-agent/pull/1); до слияния изменения могут отсутствовать в `main`.

> Открой через подключение GitHub репозиторий `vbondarev/crypto-trading-agent`, ветка `feature/initial-agent-mvp`. Прочитай `AGENTS.md` и необходимые для моей задачи утверждённые документы. Назови реально прочитанные файлы и ветку. Не считай отсутствующие инструкции существующими и не переходи к следующему шагу без моего запроса.

Наличие `AGENTS.md` и созданных Skills в GitHub **не гарантирует автоматического применения** их содержимого ChatGPT. Требуется фактическое чтение актуальных файлов.

## Разработка и испытания

Первоначальная версия создаётся в одном Draft PR по [дорожной карте](docs/development-roadmap.md). Следующие этапы согласуются отдельно. Первым практическим кейсом будет анализ убыточной позиции TREEUSDT и возможных действий через Veles, без обещания выхода в прибыль.

## Важно

Агент не гарантирует прибыль или защиту от ликвидации. `READY` допустим лишь при достаточных свежих данных всего портфеля, проверенных расчётах текущего и прогнозируемого риска, соблюдении действующих обязательных ограничений и подтверждённых параметрах платформы. **Полная история Equity не обязательна**: историческую просадку 15% и дневной убыток 3% проверяем только при достоверных данных; если их нет, обе проверки помечаются `NOT_CHECKED` и сами по себе не блокируют `READY`. Доказанное превышение этих лимитов блокирует увеличение риска. Не помещай API-ключи, пароли, снимки счёта и реальные торговые отчёты в публичный GitHub.

## Лицензия

[Apache License 2.0](LICENSE).
