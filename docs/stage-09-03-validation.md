# Шаг 09.3 — протокол проверки runtime, GitHub и семи Skills

> **Актуально 20.10.2026: шаг 09.3 `COMPLETED / APPROVED`** по отдельному решению пользователя «Принимаю. Дальше.» после предъявления self-review. Это принятие **ограниченной документально-инфраструктурной проверки**, не подтверждение независимой загрузки Skills. Разрешена реализация **только 09.4**; 09.5–09.9 NOT STARTED. Сведения ниже о PENDING — история.


> **Статус (20.10.2026): `IMPLEMENTED / PENDING USER REVIEW`.** Пользователь отдельно принял 09.2 и разрешил только 09.3 ([акт 09.2](stage-09-02-validation.md#6-формальная-приёмка-092-и-разрешение-выполнить-093--20102026)). 09.4–09.9 `NOT STARTED`, этап 09 не принят; PR #1 Open/Draft/unmerged.

## 1. Фактически проверенные результаты

| Элемент | Проверка | Подтверждённый результат |
|---|---|---|
| [Runtime source audit](stage-09-runtime-validation.md) | Доступ к `feature/initial-agent-mvp`, metadata и body SHA каждого `SKILL.md` | **7/7 source bodies явно прочитаны через GitHub connector**; SHA приведены в [§2](stage-09-runtime-validation.md#2-фактические-прочитанные-тела-семи-skills) |
| Seven Skill frontmatter | `---`, `name/description`, разделы use/not use, запрет ложного READY, связанные документы | **PASS DOC / LOCAL_JS** |
| Relative Skill links | Файловые относительные ссылки семи body проверены против текущего известного набора PR-путей | **0 missing file targets**. Внешние URL, anchors и semantically correct targets не подтверждались |
| [Node.js environment](stage-09-runtime-validation.md#1-предмет-проверки-и-пять-отдельных-утверждений) | Контейнерные `node --version`, `git --version`, `git ls-remote ...` | **Node v22.16.0, Git 2.47.3 доступны**, но `git ls-remote` завершился `Could not resolve host: github.com`; **Node checkout/CI NOT_RUN** |
| [Test script](../tests/stage-09-03-runtime-audit-synthetic.mjs) | Реально исполненный JS в изолированном V8 с adapter reads, known PR paths | **128/128 PASS, 0 FAIL**; **7** source-pin mutations уже входят в 128 |
| Independent ChatGPT session | Новый независимый диалог, отсутствие истории разработки, закрытый oracle, raw transcript | **NOT_RUN (0)** |
| Automatic Skills discovery | Агент сам обнаружил `.agents/skills/*/SKILL.md` без ручной загрузки | **NOT_VERIFIED**; явное прочтение GitHub не равно автоматической загрузке |
| Real data/trading | Bybit/P02/T02, Cross/MMR, Short loss, historical Mark, actual `READY` | **NOT_RUN / NOT_VERIFIED** |

**Source-bound тестирование 09.3:** фактический новый тест прочитал те же семь body и нормативные договоры через GitHub connector и применил адаптер `readFileSync/existsSync` в изолированном JS/V8. Отчёт **128/128** не является реальным Node.js checkout/CI. Точечные мутации проверяют, что изменение семи критичных текстовых маркеров документа замечается, но не доказывают семантическую правильность произвольного текста, работоспособность рынков или ChatGPT auto-load.

## 2. Self-review SR-093

| ID | Независимый контроль | Итог |
|---|---|---|
| **SR-093-01** | Не подменять 7 source-read фактом `auto_loaded` или семью отдельными LLM вызовами | **PASS**, `AUTO_SKILL_LOADER=NOT_VERIFIED` |
| **SR-093-02** | SHA семи GitHub blob доступны и зафиксированы в актуальном source manifest | **PASS DOC**; SHA содержимого получены от GitHub, криптографическая перепроверка локальным Git checkout ещё недоступна |
| **SR-093-03** | Перед первым blind-run закрытый oracle должен быть недоступен в публичном GitHub/Project context, новый диалог без истории разработки | **PASS PROTOCOL**, фактический fresh session **NOT_RUN** |
| **SR-093-04** | Условия передачи `user_message/payload` без `expected_status/oracle/family` | **PASS PROTOCOL**, действительные LLM inputs **NOT_SENT** |
| **SR-093-05** | Действующая версия Node vs реальный git clone/CI различаются; сетевую ошибку не скрывать | **PASS**, Node установлен, GitHub DNS блокирует полноценный checkout |
| **SR-093-06** | Сохраняется `NOT_LOADED/PARTIAL` fallback, а не ложный `FULL/AUTO_LOADED`; без transcript нет `PASS LLM_BLIND` | **PASS DOC/LOCAL_JS** |
| **SR-093-07** | RV-02/03/04/06, TV-01–TV-04 и real Bybit Mark FR-038 F/A/H/R OPEN | **PASS DOC** |
| **SR-093-08** | Формальная приёмка 09.2 и запрет исполнения 09.4–09.9 и merge | **PASS DOC** |

**Замечание:** ни один из указанных `PASS` не снимает `PARTIAL / PENDING EVIDENCE` у runtime. Для дальнейшего настоящего независимого LLM-теста необходимы: отдельный чистый чат/контекст без доступа к oracle, подтверждённое прочтение применимых исходников и raw transcript. Если такой изоляции нет, протокол требует честную категорию `LLM_IN_SESSION` либо `NOT_RUN`, а не `LLM_BLIND`.

## 3. Отдельная локальная регрессия и статус приёмки

**Фактический прогон 09.3:** **128/128 PASS** по точным GitHub-источникам, `sourceMutations=7`, `independentLLMRuns=0`, `autoLoaderVerified=false`, `fullNodeCheckoutVerified=false`, `liveTradingReady=false`. Команда для реального checkout (в текущей среде НЕ запускалась из клона):

```bash
node tests/stage-09-03-runtime-audit-synthetic.mjs
```

**Итоговое предложение:** шаг **09.3 `IMPLEMENTED / PENDING USER REVIEW`**, в пределах задокументированной частичной инфраструктурной проверки без независимых LLM-прогонов. Нет оснований утверждать реалистичную торговую готовность, автоматическую загрузку Skills или способность выполнить Stage 09 blind-runs без отдельной среды. **09.4–09.9 `NOT STARTED`, этап 09 не принят, PR Open/Draft/unmerged.** Для начала 09.4 потребуется отдельная пользовательская приёмка 09.3 и разрешение на следующий шаг.

## 4. Итоговая постсинхронизационная регрессия 09.1–09.3 — 20.10.2026

После формальной приёмки 09.2, актуализации status guards в двух ранних JS-модулях и синхронизации `stage-09-plan.md`, `stage-09-fixtures.md`, `stage-09-test-contract.md`, `README.md`, `AGENTS.md` и roadmap **заново фактически выполнены все три локальных набора на текущих GitHub-текстах**:

| Локальный JS/V8 набор | Результат | Включённые в это число in-memory mutations |
|---|---:|---:|
| 09.1 — [test contract](../tests/stage-09-01-test-contract-synthetic.mjs) | **144/144 PASS** | 7 |
| 09.2 — [fixture integrity](../tests/stage-09-02-fixture-integrity-synthetic.mjs) | **311/311 PASS** | 8 |
| 09.3 — [runtime source audit](../tests/stage-09-03-runtime-audit-synthetic.mjs) | **128/128 PASS** | 7 |
| **Итого** | **583/583 PASS, 0 FAIL** | 22 внутри 583; не суммировать отдельно |

В каждом прогоне исходный `.mjs` выполнялся в изолированном JavaScript/V8 с read/exists адаптером, предоставляющим **точные тексты фактически прочитанных файлов GitHub** и проверенные пути по списку изменённых файлов PR. Это не `node` в полноценном checkout, не independent LLM test. Первый пробный повторный вызов 09.1 оказался неполным по содержимому файлов адаптера (`docs/stage-09-01-validation.md` не был загружен), а не провалом normative assertions; при полном списке реально пройдено **144/144**. Это дополнительно подчёркивает, что корректная эмуляция не является самостоятельным подтверждением Node CI.

**Вывод:** 09.1–09.3 устойчивы в локальном документально-синтетическом контуре. Статус реального независимого агента без изменения: `LLM_BLIND 0`, `AUTO_SKILL_LOADER NOT_VERIFIED`, `NODE_CHECKOUT BLOCKED DNS`, `LIVE READY NOT_VERIFIED`. Шаг 09.3 ожидает **отдельной пользовательской приёмки**; 09.4 `NOT STARTED`; PR #1 Open/Draft/unmerged.

## 5. Формальная приёмка 09.3 и разрешение 09.4 — 20.10.2026

**Решение пользователя:** «Принимаю. Дальше.» после предъявления итоговой проверки 09.3 и 583/583 локальной регрессии. **09.3 `COMPLETED / APPROVED`** исключительно в пределах чтения семи исходных GitHub Skill bodies с blob SHA, документальных проверок runtime и локальных `128/128 LOCAL_JS PASS` (постсинхронизационная регрессия 09.1–09.3 — `583/583 PASS`).

Отдельно разрешено **выполнить только 09.4**: проверить R1/R2 и RT01–RT03 на вымышленных сценариях, предъявить фактические результаты и блокеры независимых LLM-прогонов. **09.5–09.9 NOT STARTED**; пользовательская приёмка 09.3 не является заявлением о `LLM_BLIND`, авто-загрузке Skills, настоящем Node checkout, реальном `READY` либо разрешением совершить сделки. `RV-02/03/04/06`, `TV-01–TV-04` и real FR-038 F/A/H/R OPEN. PR #1 Open/Draft/unmerged.
