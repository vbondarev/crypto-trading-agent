# Шаг 09.3 — проверка тестовой среды, GitHub-источников и загрузки Skills

> **Последующее решение 20.10.2026:** пользователь отдельно принял **09.3 `COMPLETED / APPROVED`** ([акт](stage-09-03-validation.md#5-формальная-приёмка-093-и-разрешение-094--20102026)) **в ограниченных source/runtime/documentary границах**. [09.4](stage-09-04-results.md) подготовлен, но **LLM_BLIND 0/12, PENDING INDEPENDENT EVIDENCE**. Auto Skill loader `NOT_VERIFIED`; 09.5–09.9 NOT STARTED. Предыдущая строка о pending 09.3 — история.

> **Статус (20.10.2026): `IMPLEMENTED / PENDING USER REVIEW`.** [09.2 формально принят](stage-09-02-validation.md#6-формальная-приёмка-092-и-разрешение-выполнить-093--20102026). Исполняется **только** 09.3; 09.4–09.9 **NOT STARTED**. **`LLM_BLIND = 0`**, реальный Bybit / GinArea / Veles / `READY = NOT_VERIFIED`. PR #1 Open/Draft/unmerged.

## 1. Предмет проверки и пять отдельных утверждений

Этот этап проверяет **доступность источников и готовность воспроизводимого стенда** перед независимыми LLM-прогонами, но не выполняет сами сценарии. Нельзя подменять «файл существует» на «агент автоматически загрузил и применил его».

| Проверяемое утверждение | Фактическое наблюдение 20.10.2026 | Итог |
|---|---|---|
| `GH_ACCESS`: получить актуальный PR ref/commit и первичные инструкции | GitHub connector прочитал рабочую ветку, PR #1 Open/Draft/unmerged, AGENTS.md, README и договоры | **VERIFIED / GITHUB_CONNECTOR** |
| `SKILL_SOURCE`: прочитать содержимое **каждого** из семи Skills с blob SHA | Отдельно получены 7/7 файлов `.agents/skills/*/SKILL.md` с настоящими body/встроенными YAML metadata; проверяются локальные Markdown-ссылки | **VERIFIED / DOCUMENT SOURCE** |
| `NODE_CHECKOUT`: запустить тесты настоящим `node` из полного Git checkout | В контейнере `node v22.16.0`, `git 2.47.3`; `git ls-remote https://github.com/vbondarev/crypto-trading-agent.git` завершился `Could not resolve host: github.com`. Полного Node checkout пока нет | **BLOCKED / NETWORK DNS**; версия Node сама по себе не доказывает checkout |
| `LLM_FRESH_SESSION`: получить независимый пустой диалог без истории разработки и скрытым oracle | Такой диалог при 09.3 не создавался; сырого transcript нет | **NOT_RUN / NOT_VERIFIED** |
| `AUTO_SKILL_LOADER`: доказать, что ChatGPT автоматически обнаруживает конкретный `SKILL.md` в GitHub | GitHub connector читает документы **по явному запросу**; это **НЕ** auto-discovery/выполнение внешнего Skill агентом | **NOT_VERIFIED (RV-06 OPEN)** |

**Итоговый статус runtime:** `PARTIAL / PENDING EVIDENCE`. Для дальнейших испытаний разрешено готовить протокол explicit-load fallback, но **запрещено** заявлять `LLM_BLIND PASS`, `AUTO_LOADED`, live `READY` или реальную торговую пригодность на основании этих проверок. Наличие локального `node` не означает, что удалённый GitHub доступен по DNS.

## 2. Фактические прочитанные тела семи Skills

Перечень ниже — **blob SHA именно тела файла GitHub**, а не SHA коммита PR, не SHA установленного Skill в ChatGPT. Все тела индивидуально возвращены GitHub connector на `feature/initial-agent-mvp`, каждый содержит `name`, `description`, текст `When to use`, ограничения, инструкции и относительные документальные ссылки.

| Skill | Файл | GitHub blob SHA, подтверждённый чтением |
|---|---|---|
| Data Verification | [SKILL.md](../.agents/skills/data-verification/SKILL.md) | `165497a0dbbb89c3932616a8a9cbb021c8ffe2fc` |
| Market Analysis | [SKILL.md](../.agents/skills/market-analysis/SKILL.md) | `7295c6c0e3e2a0b8b87954fabb33445c7e324171` |
| Portfolio Analysis | [SKILL.md](../.agents/skills/portfolio-analysis/SKILL.md) | `a46b934a07c5e3622e06449242c0c50b8763b095` |
| Risk Assessment | [SKILL.md](../.agents/skills/risk-assessment/SKILL.md) | `44661e995d2a5277eb034c8a0e97bef9223de50a` |
| Strategy Planning | [SKILL.md](../.agents/skills/strategy-planning/SKILL.md) | `ce7d5fb44ace79f5564a8c175fb0b2b6d4011ef1` |
| Veles Configuration | [SKILL.md](../.agents/skills/veles-configuration/SKILL.md) | `a2d449f7a24cbc532ebc17f0f2f7f83423784357` |
| GinArea Configuration | [SKILL.md](../.agents/skills/ginarea-configuration/SKILL.md) | `506f4ce0a53a2aba7a7513ab33e961121cda7320` |

Семь body имеют нормальный Markdown с `---` frontmatter (name совпадает с каталогом), непустым `description` и правилами безопасности. **Все относительные ссылки этих семи тел разрешаются в существующие цели** по известным путям PR, 0 missing targets при сравнении файловых путей; внешние URL и anchor fragments этим тестом не верифицируются.

**Порядок приоритета инструкций:** системные ограничения среды → утверждённые [AGENTS.md](../AGENTS.md) и [FR](requirements.md) → [общие рабочие правила](agent-operating-rules.md) → [interaction RT01–RT10](workflows/interaction-contract.md) → тело **нужного и действительно прочитанного Skill** → [пользовательские P08](stage-08-review.md), без расширения полномочий на сделки. Если тело Skill не прочитано/получено частично — `NOT_LOADED/PARTIAL`, а не вымышленный full stack.

## 3. Стандартизованная подготовка независимого тестового сеанса (НЕ выполнено при 09.3)

1. **FREEZE**: зафиксировать полный 40-символьный `commit_sha` исходников, SHA всех необходимых Skill body и `fixture_version`, источник/время тестового окружения, классификацию запуска `DOC/LOCAL_JS/LLM_IN_SESSION/LLM_BLIND`. Не считать `head` неизменным: после каждого PR-коммита требуется новый pin.
2. **PREPARE_PRIVATE_ORACLE**: отдельный оценщик создаёт oracle и хранит **вне публичного GitHub, в недоступной испытуемому агенту среде**. При отсутствии такого разделения честная отметка `oracle_isolation=NOT_VERIFIED`, запрет статуса `LLM_BLIND`.
3. **START_FRESH**: пользователь/оператор запускает действительно новый диалог без истории разработки и без oracle. Реальное состояние Memory/Project context фиксируется как `KNOWN` или `UNKNOWN`; новый чат в общем Project **сам по себе не гарантирует изоляции**. При сомнениях — `LLM_IN_SESSION/PARTIAL`, а не `LLM_BLIND`.
4. **LOAD**: сначала предоставить/прочитать [AGENTS.md](../AGENTS.md), затем исходники применимых Skill-файлов с подтверждёнными путями и blob SHA. `AGENTS.md` и Skill bodies — документы, а не исполняемый trading runtime. Если auto-loader не подтверждён, переход к `EXPLICIT_LOAD_FALLBACK` с отдельной отметкой; **не** записывать `AUTO_LOADED`.
5. **PRESENT_INPUT_ONLY**: взять единственный `case_id` из [45 INPUT-only фикстур](../tests/fixtures/stage-09/inputs.v1.json), экспортировать `user_message` и `payload` штатным [экспортёром](../tests/stage-09-02-export-agent-input.mjs); **не** передавать ожидаемый verdict, oracle, internal `family/prompt_id/case_id`, user secrets.
6. **CAPTURE_RAW**: записать неотредактированный полный ответ, `run_id`, фактический environment, модель (если известна), source SHA, ошибки чтения, реально наблюдаемые `SKILL_READ`; только затем открыть oracle отдельному оценщику и применить EV01–EV08 из [контракта 09.1](stage-09-test-contract.md).
7. **RECHECK**: при изменении source, fixture, модели, состояния счёта/платформы, инсценированном событии AD-009 сравнения становятся отдельными версиями и/или reruns. Ни пользовательская приёмка этапа, ни `git clone`, ни `LLM_BLIND` не разрешают открывать/закрывать сделки.

**Запрещённая подмена:** если LLM-диалог не исполнен — `NOT_RUN`; если тело `SKILL.md` доступно лишь через документный поиск, `SOURCE_READ`, а не `AUTO_LOADED`. Подмена чужого `Binance Spot Last` на `Bybit Perpetual Mark`, выдача фиктивной P02/T02, игнорирование H04 и декларация реального `READY` — критичные нарушения будущих тестов.

## 4. Проверка исходников и воспроизводимые команды

**Репозиторий:** `vbondarev/crypto-trading-agent`, `feature/initial-agent-mvp`. При настоящем checkout (на машине с работающим DNS/доступом к GitHub) запускать:

```bash
git clone --branch feature/initial-agent-mvp --single-branch https://github.com/vbondarev/crypto-trading-agent.git
cd crypto-trading-agent
git rev-parse HEAD
node --version
node tests/stage-09-01-test-contract-synthetic.mjs
node tests/stage-09-02-fixture-integrity-synthetic.mjs
node tests/stage-09-03-runtime-audit-synthetic.mjs
node tests/stage-09-02-export-agent-input.mjs S09-032
```

Для реального Node-подтверждения сохранить stdout/stderr и SHA HEAD, не доверять одному `PASS`. **На момент составления протокола полный checkout не был доступен из контейнера из-за DNS**; реальный запуск `node tests/...` в настоящем checkout **не заявляется**.

**Отдельная детерминированная проверка 09.3** [локальным JS-модулем](../tests/stage-09-03-runtime-audit-synthetic.mjs) подтверждает структуру документов/путей, актуальный список Skills и допустимую классификацию evidence. Это `LOCAL_JS`, не независимое LLM исполнение.

## 5. Критерии приёмки только 09.3

`PASS_SOURCE` при 7/7 отдельном прочтении и проверенных body/метаданных/путях; `PASS_PROTOCOL` при созданном воспроизводимом протоколе/реестре, честно отмеченных уровнях доказательств и отсутствии утечки закрытых oracle; `NODE_CHECKOUT=BLOCKED`, `AUTO_SKILL_LOADER=NOT_VERIFIED` и `LLM_FRESH_SESSION=NOT_RUN` **допустимы как открытые зависимости**, а не как доказанные успешные тесты. В 09.4 независимые blind-runs можно засчитывать только после фактической изоляции, полного ответа и подписанного оценщиком oracle.

**Состояние:** **09.3 `IMPLEMENTED / PENDING USER REVIEW`**, 09.4–09.9 NOT STARTED; этап 09 ещё не принят, никакого реального `READY`, API keys/сделок, merge или фонового мониторинга. RV-02/03/04/06, TV-01–TV-04 и реальный исторический FR-038 F/A/H/R — **OPEN**. Следующая граница — отдельная приёмка пользователем 09.3.
