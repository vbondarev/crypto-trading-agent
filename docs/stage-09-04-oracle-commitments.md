# Этап 09.4 — публичные криптографические фиксации закрытых oracle

> **PRE-REGISTERED / COMMITMENT ONLY** — 20.10.2026. Этот документ публикует исключительно SHA-256 закрытых критериев **до нового тестового прогона**. **Ни содержание oracle, ни вердикты, ни скрытые ожидаемые ответы в GitHub НЕ публиковать до окончания соответствующего теста.** Публичная фиксация не доказывает проведение теста или доступность Skills в runtime.

## S09-001-R02 — повторный тест после первого диагностического S09-001

| Поле | Зафиксированное значение |
|---|---|
| Исходный сценарий | `S09-001`, fixture version `1`, P08-01 |
| Run identifier | `S09-001-R02` |
| Источник и политика, pinned full commit | `ac06602ca73741077d9d6396e1a2172791bc7d88` |
| Blob SHA JSON синтетических входов | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| UTC момент предварительной фиксации файла | `2026-10-20T16:05:27+00:00` |
| Приватный артефакт (не публиковать содержимое) | `S09-001-R02_PRIVATE_ORACLE.json` в отдельном рабочем контейнере оценщика; **не** в GitHub |
| Алгоритм привязки | `SHA-256` от **точных байтов UTF-8 JSON файла**, включая случайный приватный nonce |
| **SHA-256 закрытого oracle** | **`e233f619d132a49d63a19a33c7c60d406f5f130862575de44419c970b45e28fd`** |
| Test execution | `NOT_RUN` для **нового R02**; прежний user-reported R01 не является pre-registered R02 |
| Oracle isolation | Не передавать тестируемому агенту приватный файл, ссылку на него, eval rubrics и историю эксперимента |
| Independence target | **Новый** Temporary Chat, вне Crypto Project, с записанным input и полным raw ответом |
| Приёмочный критерий | Подлинные raw responses + runtime evidence + оценка после открытия заранее зафиксированного oracle; без всего комплекса `INCONCLUSIVE` |

**Обязательный порядок:** публикация SHA-коммитмента → новый изолированный запуск → сохранение полного сырого ответа → сверка исходного файла с публичным SHA-256 → раскрытие критериев оценщику и вердикт. Не сравнивать старый S09-001-R01 с этим oracle как будто его заранее зафиксировали; он остаётся post-hoc диагностикой.

**Безопасность:** все данные вымышлены. Не запрашивать API-ключи, реальные аккаунты, котировки или ордера. `LLM_BLIND PASS=0` на момент создания фиксации, этап 09.4 `PARTIAL / PENDING INDEPENDENT EVIDENCE`; шаги 09.5–09.9 `NOT STARTED`, PR Open/Draft/unmerged. Ссылки на публичный R1/R2 [тестовый набор](stage-09-04-results.md) и [первое наблюдение](stage-09-04-observations.md) не являются приватным oracle.


## S09-002-R01 — pre-registered sealed oracle до следующего Temporary Chat

| Поле | Значение |
|---|---|
| Case и версия | `S09-002`, fixture v1, `P08-02` |
| Run ID | `S09-002-R01` |
| Исходные правила / pinned commit | `ac06602ca73741077d9d6396e1a2172791bc7d88` |
| GitHub fixture blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Предварительное формирование закрытого файла | `2026-10-20T17:15:53.032247+00:00` |
| Приватный evaluator-only файл | `S09-002-R01_PRIVATE_ORACLE.json` (не коммитить в GitHub, не передавать агенту) |
| Hash algorithm | SHA-256 точных UTF-8 байтов файла; содержит скрытый криптографический nonce |
| SHA-256 **commitment** | **`6b6f46d14a89728752ca893c8cfbdd8dc38ce5c4c49b185ca6bd5318ea96dda9`** |
| Текущий тестовый статус | `NOT_RUN` — оценивается только после нового независимого ответа |
| Изоляция | Новый Temporary Chat вне Crypto Project; не передавать oracle, rubric, историю 09.4, старые результаты |

**Строгий порядок:** сначала сохранить этот публичный SHA-256, потом проводить новый независимый S09-002-R01, затем скопировать дословный ответ и оценить по приватному файлу после повторного хеширования. Содержимое oracle остаётся закрытым как минимум до момента завершения evaluation; этот публичный commitment сам по себе не предсказывает PASS и не доказывает независимость runtime. `09.5–09.9 NOT STARTED`.

## S09-002-R02 — исправленный pre-registered repeat после R01 evidence gap, 22.10.2026

**Сценарий:** тот же S09-002 / P08-02 / fixture v1, pinned `ac06602ca73741077d9d6396e1a2172791bc7d88`; вход `965c12afa0c4afc4c0b1698732e61c597d351b88`. **Новая попытка R02 ещё NOT_RUN.** Она предназначена для устранения обнаруженного отсутствия приватной oracle-preimage у R01, а не для посмертного зачёта R01.

| Поле | Результат |
|---|---|
| `run_id` | `S09-002-R02` |
| Приватная evaluator-only карточка | `/mnt/data/S09-002-R02_PRIVATE_ORACLE.json` — действительно создана и доступна в текущем evaluator container; не передавать tested agent и не коммитить |
| `sealed_at_utc` в закрытом файле | `2026-10-22T17:26:22.684247+00:00` |
| Длина локального оригинала | **4114 bytes** UTF-8 JSON, включая 32-byte nonce и 10 приватных критериев |
| SHA-256 original exact bytes (проверен локально перед публикацией) | **`be2b785ede8ca3450a419e362ab2ca782d7eca7f7fdaa292c324b2cd2a12cffe`** |
| Статус на момент публикации | **NOT_RUN**; публично доступен **только commitment**, не содержимое приватного oracle |
| Public note R01 | [S09-002-R01 evidence gap](stage-09-04-s09-002-r01-observation.md) — у предыдущего preimage не обнаружена, вердикт R01 `INCONCLUSIVE` |

Новый запуск разрешён **только после публикации этой записи**, в новом Temporary Chat вне Crypto Project с той же pinned policy. Сохранить оба ответа дословно, после выполнения проверить SHA-256 всё того же evaluator-only файла перед оценкой. **Не переписывать** старый `S09-002-R01` oracle и не применять новую карточку ретроактивно. Состояние 09.4 остаётся `PARTIAL / PENDING INDEPENDENT EVIDENCE`, 09.5–09.9 NOT STARTED, без live торговых операций.


## S09-003-R01 — pre-registered oracle for BTC/SOL comparison (31.10.2026)

**Only a SHA-256 commitment is published; the oracle body and evaluation rubric remain private.**

| Field | Pre-registered value |
|---|---|
| `case_id` / `run_id` | `S09-003` / `S09-003-R01` |
| `prompt_id` / fixture | `P08-03` / fixture v1 |
| Fixed policy source commit | `ac06602ca73741077d9d6396e1a2172791bc7d88` |
| Public synthetic fixture JSON blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Private oracle filename | `S09-003-R01_PRIVATE_ORACLE.json`; evaluator-only, **not** part of GitHub repository |
| Exact byte length | `4379` UTF-8 bytes |
| Private nonce | 32 securely generated random bytes, included in hashed source (not disclosed) |
| sealed_at_utc | `2026-10-31T19:20:59+00:00` |
| SHA-256 **commitment** | **`42154dec9538dfdb4855c36b97c1a4829d5f8e1d46934a0edc4fce2cf03de843`** |
| Repeatability | Evaluator keeps private file; user should separately retain a private copy if file durability is uncertain; **never** send private oracle to tested agent |
| Execution state when committed | `NOT_RUN`; no output or verdict can be inferred from the hash |

**Run order:** commit only this digest before the separate new Temporary Chat invocation; run the unchanged S09-003 user input with 2026-10-20 12:00 MSK synthetic test clock; paste full unedited init-report and market answer; check private file SHA-256 against this committed digest **before opening/checking rubric**. Distinguish user-attested isolation from technically authenticated runtime and do not count response regeneration as multiple independent runs. Prior S09-002 R02 private preimage is absent from the current evaluator environment; its historical SHA check is not reconducted or implied by this S09-003 commitment.



## S09-003-R02 — repeat after R01 EV07 `FAIL_MINOR`, 31.10.2026

**Only sealed SHA-256 metadata is public; do not give the private oracle, previous result, defect, or explicit expectations to test agent.** The prior R01 was received and scored as [`FAIL_MINOR`](stage-09-04-s09-003-r01-evaluation.md). The R02 fixture, original policy commit and all 10 scoring checks are unchanged; private random nonce is newly generated.

| Field | Sealed value |
|---|---|
| `case_id`, `run_id` | `S09-003`, `S09-003-R02` |
| Pinned policy source | `ac06602ca73741077d9d6396e1a2172791bc7d88` |
| Synthetic fixture JSON blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Evaluator-only file | `/mnt/data/S09-003-R02_PRIVATE_ORACLE.json` (do not commit or give to agent) |
| Exact JSON UTF-8 bytes | **4459** |
| `sealed_at_utc` | `2026-10-31T19:58:19.792308+00:00` |
| Cryptographic nonce | fresh 32-byte secret, included in digest |
| SHA-256 of exact private bytes | **`1188c7f5b300b11fb92f9d920a28fd7a7617c9446ba7184b2b384e310766d2e7`** |
| Status at publication | **`NOT_RUN`**; result and session isolation unknown until separate Temporary Chat |
| Procedure | New Temporary Chat outside Crypto Project, exact original input with test clock, user copies complete init+answer, evaluator verifies original file hash before scoring |

The private preimage was explicitly created in the active evaluator container **before** this commitment and should be backed up outside the test chat for repeatability. The previous R01 outcome remains `FAIL_MINOR` and cannot be reclassified retroactively by the R02 grade. No live trading and no change to PR Draft status.


## S09-003-R03 — sealed oracle for post-fix BTC/SOL R1 regression (02.11.2026)

> **PRE-REGISTERED / NOT_RUN.** The evaluator created and verified the original private oracle **before** publishing this SHA and **before** the independent model is invoked. Only the commitment is public; the private rubric, nonce and expected outputs must not be given to the test agent. This run tests **NEW fixed instructions**, not old R01/R02.

| Property | Frozen value |
|---|---|
| Case, run, prompt | `S09-003`, `S09-003-R03`, `P08-03` |
| **Tested source commit** | **`39ec1f2a0f04cd5762d4b095c9fe9cf3e0046f13`** (the post-fix HEAD captured before this commitment; do not substitute later branch HEAD) |
| Test fixture version/blob | `1` / `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Synthetic test clock | 2026-10-20 12:00 Europe/Moscow; Bybit BTC and SOL Mark snapshots 11:59, OHLCV unavailable |
| Original evaluator-only oracle | `S09-003-R03_PRIVATE_ORACLE.json`; local path `/mnt/data/S09-003-R03_PRIVATE_ORACLE.json` |
| `sealed_at_utc` | `2026-11-02T15:59:26Z` |
| Exact oracle bytes | 5998 bytes, UTF-8 JSON with a fresh private 256-bit random nonce |
| **SHA-256 of original private file bytes** | **`175a20c135382dccafff45360e4d3477d1f346cbfd34d0bbe9d2ec7f007ba7df`** |
| Scoring checks | 10 mandatory frozen checks, **contents withheld** |
| Initial verdict | `NOT_RUN`; no independent model output has been received |
| Evaluator/source limits | The same assistant prepared and will evaluate oracle: `evaluator_independence=LIMITED`. Actual new Temporary Chat / runtime still must be separately attested. |

**Protocol:** retain the original private oracle outside the test chat (the user may store a backup); open a **fresh Temporary Chat outside Crypto Project**; ask it to explicitly read only the five normative GitHub Markdown documents at **the exact source commit above**, not documents containing stage-09 scoring/results; send the unchanged S09-003 synthetic prompt; copy full responses. **After** receiving the model reply, recompute the original private oracle file's SHA-256 and compare to this precommit, *then* evaluate. Do not change the original pinned inputs or reclassify S09-003-R01/R02 historical `FAIL_MINOR`. This is a content/synthetic test, not live-trading authorisation. 09.4 still `PARTIAL / PENDING INDEPENDENT EVIDENCE`; 09.5–09.9 `NOT STARTED`.


## S09-004-R01 — pre-registered sealed oracle (02.11.2026)

> **NOT_RUN at time of publication.** Only the SHA-256 commitment is published here before the test. The independent test agent must never receive the evaluator-only private oracle, criteria or previous evaluation results.

| Property | Pre-registered immutable value |
|---|---|
| Case / run / prompt | `S09-004` / `S09-004-R01` / `P08-04`, fixture version 1 |
| Tested source commit | **`39ec1f2a0f04cd5762d4b095c9fe9cf3e0046f13`** (fixed post-R1-status-correction source; do NOT substitute branch HEAD) |
| Input fixture JSON Git blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Private original file | `/mnt/data/S09-004-R01_PRIVATE_ORACLE.json` (evaluator-only; NEVER commit or send to tested agent) |
| Exact private JSON bytes | **5880 UTF-8 bytes**, secret 32-byte random nonce included |
| Sealed at UTC | `2026-11-02T16:24:54.746881+00:00` |
| SHA-256 of exact private bytes | **`509987294553263b447adad19a90aac136979c4ca71ea94cd9912c896970b242`** |
| Scoring | 10 frozen mandatory private criteria, not published here |
| Start state | **NOT_RUN**. Public commitment is not evidence of execution, model PASS or confirmed Skill autoload. |

**Procedure:** Save a private backup of the original oracle outside the test chat. Conduct S09-004 in a **new Temporary Chat outside Crypto Project** with only the five permitted source Markdown documents from the tested commit, without stage-09 reports/oracle. Then send the unchanged P08-04 fixture and copy both complete model responses. Upon receiving them, verify the original oracle SHA against this public precommit **before reading the private criteria to evaluate**. Explicitly attest separate-session isolation and no oracle leakage. Do not edit S09-003-R01/R02 historical FAIL_MINOR or S09-003-R03 user-attested PASS. All market inputs are fictional; no live orders. 09.4 remains PARTIAL, 09.5–09.9 NOT STARTED.


## S09-005-R01 — pre-registered oracle for Bybit V5 403 / Binance Spot / undated screenshot (02.11.2026)

> **PRE-REGISTERED / NOT_RUN.** This SHA-256 commitment was recorded **before** invoking the next independent model run. Private content, grading rubric, and random nonce remain outside GitHub and must never be given to the tested agent.

| Item | Sealed value |
|---|---|
| Run | `S09-005-R01` |
| Case / prompt / fixture | `S09-005` / `P08-05` / v1 |
| Tested source commit | **`39ec1f2a0f04cd5762d4b095c9fe9cf3e0046f13`** (fixed policy source; do not use moving HEAD) |
| INPUT-only fixture Git blob SHA | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Fixed synthetic test time | `2026-10-20T12:00:00+03:00` Moscow time |
| Private evaluator-only file | `/mnt/data/S09-005-R01_PRIVATE_ORACLE.json` |
| Bytes | **4629 UTF-8 bytes** (including private random 256-bit nonce) |
| sealed_at_utc | `2026-11-02T16:56:31.743710+00:00` |
| **SHA-256 of exact private file bytes** | **`8a9cd64a7da4b30bcef36deb96eac90e552b06ece37e249b9851633bee84c5dc`** |
| Mandatory checks | 10; their contents are withheld |
| Status at commitment | **`NOT_RUN`**, no observed answer/grade/session evidence |

**Blind protocol:** user opens a NEW Temporary Chat outside Crypto Project, sends no stage-09 documents, old evaluation results or private oracle, explicitly loads only five designated policy Markdown files from the **fixed source commit**. Then sends the original S09-005 input. Capture the full initialization and R1 source-failure response, user attests separate isolated Temporary Chat; evaluator rehashes original private JSON byte-for-byte before evaluating the content. Do not retroactively edit earlier run outcomes. All inputs are fictional, no real market API calls or trades. 09.4 `PARTIAL`; 09.5–09.9 `NOT_STARTED`.


## S09-006-R01 — pre-registered closed 1h/4h OHLCV evaluation (02.11.2026)

> **NOT_RUN / PRECOMMITTED.** The evaluator generated the private 10-criterion oracle on local disk and computed its SHA-256 **before the tested model is invoked**. Publish the commitment only, never the private rubric or nonce.

| Item | Immutable pre-registered value |
|---|---|
| Case / run / prompt | `S09-006` / `S09-006-R01` / `P08-06` (fixture v1) |
| Original immutable source commit | **`39ec1f2a0f04cd5762d4b095c9fe9cf3e0046f13`** (fixed instructions; NOT moving Git branch HEAD) |
| Canonical fixture Git blob | `965c12afa0c4afc4c0b1698732e61c597d351b88` |
| Public input-only one-case blob | `cd2257345742bb28bc1352c304dc3226eeefab6d` (file: `tests/public-inputs/S09-006.v1.json`, created before this precommit) |
| Public input-only file source commit | `672cbe20afec65d9fd9e1a1edb37b48e07af6031` (input-only resource pinned separately from agent instructions) |
| Synthetic test clock | `2026-10-20T12:00:00+03:00` Moscow time |
| Private oracle original filename | `/mnt/data/S09-006-R01_PRIVATE_ORACLE.json` (evaluator-only, not in GitHub) |
| Private oracle exact bytes | **6176 bytes** UTF-8 JSON including a fresh secret 256-bit random nonce |
| sealed_at_utc | `2026-11-02T17:42:53.258289+00:00` |
| **SHA-256 exact original private file** | **`feb8d8e2470e4e691e164fb04256bc4f4172f2b4534e3fcfcfd0464f34f86769`** |
| Mandatory frozen checks | 10; contents withheld from test agent and public repository |
| Status at SHA publication | **`NOT_RUN`**; no model output or grade yet |

**Isolation procedure:** Open a new Temporary Chat outside Crypto Project and explicitly load only five policy Markdown documents from the fixed **source commit** above. Do not read stage-09 evaluator/rubric files or previous tests. The one-case **PUBLIC INPUT-ONLY** file above is explicitly permitted as scenario data (not a policy/rubric document); provide all its original fields and both complete OHLCV arrays unmodified (via attached downloaded file or a pinned URL to this exact file). Do not ask the agent to read the larger stage-09 fixture corpus. No real market lookups or trades. Capture the full init report and analysis, then user attests separate-session isolation without oracle leak. The evaluator must rehash the original private oracle from disk before grading. The existing S09-005-R01 `PASS/USER_ATTESTED` remains accepted; 09.4 still PARTIAL, 09.5–09.9 NOT STARTED.
