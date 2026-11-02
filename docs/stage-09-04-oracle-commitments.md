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
