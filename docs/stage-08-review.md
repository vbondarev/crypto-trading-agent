# Этап 08 — интеграционная ревизия пользовательских промптов, workflows и отчётов

> **08.9: IMPLEMENTED / PENDING USER REVIEW (20.10.2026).** Пользователь принял 08.8 и разрешил выполнить только 08.9. **Этап 08: PENDING FORMAL STAGE ACCEPTANCE; этап 09: NOT STARTED.** PR #1 Open/Draft/unmerged; никаких реальных ордеров, торгового READY или merge.

## 1. Проверенный нормативный контекст

Источники: [утверждённый план](stage-08-plan.md), [AGENTS](../AGENTS.md), [все RT01–RT10 и ASK/ANALYZE/CHOOSE/RECHECK/STOP](workflows/interaction-contract.md), [AD-009/freshness](data-freshness.md), [T01–T06](input-templates.md), [FR-027–FR-040 и S0–S3](risk-management.md), [семь Skills этапа 07](stage-07-skills-contract.md), [проверка P01/P02](platforms/platform-validation.md), [Veles](platforms/veles.md), [GinArea PRO](platforms/ginarea.md), [неэквивалентность платформ](platforms/configuration-contract.md) и артефакты 08.1–08.8.

Правила FR/AGENTS и нормативных контрактов имеют приоритет над удобством примеров. URL и каталог Skills не доказывают фактического чтения тела Skill живым агентом; V8 тесты не подтверждают самостоятельную загрузку в ChatGPT. При отсутствии прочитанного Skill — NOT_LOADED/PARTIAL, не фиктивный полный R3.

## 2. Интеграционная карта RT → артефакт → граница вывода

| Route | Этап/пользовательские промпты | Допустимый вывод и обязательные входы | Запрет |
|---|---|---|---|
| **RT01** | [08.1](workflows/interaction-contract.md) + [08.8](workflows/report-templates.md) P08-36 | Образовательный ответ на обычный вопрос | Не требовать T02/P02 и не объявлять торговый статус |
| **RT02** | [08.2](prompts/market-overview.md) P08-01–05 | R1 с реальным источником/временем цены, либо ограниченный исторический контекст | Не выдумывать Last/Mark, не требовать приватный счёт |
| **RT03** | [08.3](prompts/technical-scenario.md) P08-06–11 | R2 условный Long/Short/WAIT, закрытые OHLCV, TF, gaps, warm-up и инвалидация | Не выдавать точные уровни без фактических данных, Spot ≠ Perpetual |
| **RT04** | [08.4](prompts/portfolio-recovery.md) P08-12–14/17 | Полный account-scope T02/T03/T04, S0–S3, позиции/orderIds/owner/leavesQty | Не считать только выбранную позицию всем портфелем |
| **RT05** | [08.4](prompts/portfolio-recovery.md) P08-15–17 и [08.5](prompts/risk-strategy-decision.md) P08-20 | H01/T05 linked-series net, fees/funding, L_lifecycle vs L_from_now | Не считать текущий плюс восстановлением всей серии |
| **RT06** | [08.5](prompts/risk-strategy-decision.md) P08-23 | CHOOSE сравниваемой платформы/стратегии/действия по пользовательскому запросу | Не выбирать за пользователя или выводить две финальные формы |
| **RT07** | [08.6 Veles](prompts/veles-configuration.md) P08-24–28 | R2, выбранный SIMPLE/CUSTOM/SIGNAL; actual P02 для точных UI labels | Не подменять Veles полями GinArea; Cancel ≠ биржевое close |
| **RT08** | [08.7 GinArea](prompts/ginarea-configuration.md) P08-30–34 | R2, выбранная стратегия, доступность пары/режима в селекторе P02 | Не переключать Indicator→Default без отдельного CHOOSE |
| **RT09** | [08.6 Veles](prompts/veles-configuration.md) P08-29 **или** [08.7 GinArea](prompts/ginarea-configuration.md) P08-35 и [08.8](workflows/report-templates.md) P08-40 | R3 одной выбранной платформы: реальная P02, full T02/T03/T04, Mark, FR и реальные F/A/H/R | Не выпускать «один в один» и READY из P01, локальных PASS или одного SL |
| **RT10** | [08.8 RECHECK](workflows/report-templates.md) P08-41, [08.4](prompts/portfolio-recovery.md) P08-17 | Событие AD-009 → инвалидировать зависимые прошлые выводы, пересобрать свежий scope | Не наследовать READY внутри TTL |

Три оси независимы: **mode** EDUCATIONAL/R1/R2/R3_AUDIT, **dialogue step** ASK/ANALYZE/CHOOSE/RECHECK/STOP, **decision** REJECTED/UNVERIFIED/NEEDS_DATA/READY (только для проверяемого действия); CURRENT/STALE/NOT_CHECKED — качество поля, не пятый торговый статус.

## 3. Полное покрытие 41 пользовательского промпта

| Шаг | Диапазон | Количество |
|---|---|---:|
| 08.2 R1 | P08-01–P08-05 | 5 |
| 08.3 R2 | P08-06–P08-11 | 6 |
| 08.4 portfolio/H01 | P08-12–P08-17 | 6 |
| 08.5 risk/CHOOSE | P08-18–P08-23 | 6 |
| 08.6 Veles | P08-24–P08-29 | 6 |
| 08.7 GinArea | P08-30–P08-35 | 6 |
| 08.8 reports/RECHECK | P08-36–P08-41 | 6 |
| **Итого** | **P08-01–P08-41** | **41** |

08.1 задаёт RT и модель беседы, но не создаёт нового пользовательского P08 prompt. Отдельные P08 промпты — текст, а не исполняемый orchestration/agent runtime.

## 4. Доказательные и финансовые ограничения

**FR-029:** reachable IM ≤30% Equity E0; **FR-030:** доказанный максимальный net-loss бота ≤5% E0; **FR-031:** плечо ≤5×; **FR-032:** adverse Bybit Mark→liq ≥15% и доказанная Cross account MMR; **FR-033:** ≤3 одновременно достижимых exchange position slots; **FR-034:** 100% будущей IM и cost buffers. Известный H04, подтверждённый Moscow-day убыток ≥3% с началом суток 00:00 Europe/Moscow или HWM DD ≥15% блокируют NEW/ADD/RECOVER_WITH_ADD уже при равенстве. H02/H03 без достоверной истории = NOT_CHECKED, не автоматический REJECTED и не подтверждение отсутствия H04.

R1 context Last/Mark ≤15 минут при доказанном observed_at, R2 intraday ≤5 минут, R3 whole T02 ≤5 минут и фактический Bybit Mark ≤2 минуты. Текущие закрытые OHLCV, правильный инструмент/источник и происхождение обязательны для соответствующего утверждения. retrieved_at не омолаживает snapshot_at. AD-009 fill, position/order/bot/P02/margin change = немедленный RECHECK зависимых S0–S3, даже при TTL. Реальный H в F/A/H/R — датированный исторический Bybit Mark эпизод, а не синтетические пути.

**OPEN RV-02** (Cross/MMR), **RV-03** (строгий Short-loss bound), **RV-04** (actual P02 Veles/GinArea), **RV-06** (независимый Skills runtime), **TV-01–TV-04**, реальная историческая F/A/H/R FR-038. Никаких подтверждённых live READY/доступа к чужому счёту.

## 5. Сквозная синтетическая матрица W08-01–W08-14

| ID | Источники/маршруты | Вымышленное условие | Ожидаемый итог |
|---|---|---|---|
| **W08-01** | 08.1/08.8 RT01 | «Что такое Short?» | Ответ без приватных T02/P02 и без READY |
| **W08-02** | 08.2/08.3 RT02/03 | Bybit V5 вернул HTTP 403 | Не выдумывать цену, только проверенный датированный ограниченный обзор |
| **W08-03** | 08.2/08.3 RT02/03 | Binance Spot Last вместо Bybit Perp Mark | Не использовать Spot для Mark/liquidation |
| **W08-04** | 08.4/08.8 RT04/10 | T02 свежий, после снимка исполнен IN | RECHECK и пересборка зависимых T02/S0–S3 |
| **W08-05** | 08.4/08.5 RT04/09 | Полный T02 отсутствует, просят READY | NEEDS_DATA, нет READY |
| **W08-06** | 08.5/08.8 RT03/RT04/RT07–RT09 (согласно запросу) | Active H04 и просьба ADD | REJECTED увеличения риска; варианты без исполнения |
| **W08-07** | 08.5/08.6/08.7 RT09 | Cross MMR и Short bound не доказаны | UNVERIFIED, нельзя выдавать READY по стопу |
| **W08-08** | 08.1/08.5 RT06 | Veles/GinArea не выбрана | CHOOSE, никакой финальной формы |
| **W08-09** | 08.7/08.8 RT08 | Indicator Grid недоступен | Default — только отдельно выбранная альтернатива |
| **W08-10** | 08.4/08.8 RT05 | H01 SYNTHETIC realized -15, current +10, fee 1, funding 2 USDT | Net -8 USDT, не RECOVERED |
| **W08-11** | 08.4/08.5 RT04/05 | Нет H02/H03 и неизвестен H04 | NOT_CHECKED history, не автоматический REJECTED |
| **W08-12** | 08.5/08.8 RT09 | F/A/H/R названы без real historical Mark H | UNVERIFIED, нет READY |
| **W08-13** | 08.6/08.7 RT07/08 | Veles Cancel / GinArea Pause / Disable IN | Факт закрытия биржевой позиции не доказан |
| **W08-14** | 08.1/08.8 CHOOSE/STOP | Пользователь принял отчёт | Нет полномочий на ордер, 08.9/09 или merge |

**Уточнение W08-06 (повторный self-review, 20.10.2026):** активный H04 — сквозной запрет на увеличение риска при любом применимом маршруте, а не отдельный тип запроса `RT04`. Для предварительного сценария применяется `RT03` с проверкой рисков; для оценки портфеля — `RT04`; для выбранных Veles/GinArea и финального аудита — `RT07`/`RT08`/`RT09` соответственно. Уточнение маршрутизации не отменяет `REJECTED` и не создаёт полномочий на торговлю.

W08-01–W08-14 — **нормативные синтетические фикстуры**, а не 14 независимых LLM blind-run. Их фактический тестовый результат фиксируется в [протоколе 08.9](stage-08-09-validation.md) и [модуле](../tests/stage-08-09-integration-synthetic.mjs).

## 6. Исправления, ограничения и полнота тестов

Во время 08.8 найден маршрутный дефект в принятом ранее 08.7: пять P08-30–P08-34 ошибочно использовали RT07 (Veles). Это исправлено на **RT08 (GinArea)**, и тест 08.7 проверяет exact route. P08-35 — RT09. [Протокол 08.7](stage-08-07-validation.md), [протокол 08.8](stage-08-08-validation.md).

При 08.9 требуется отдельно указать фактически выполненные синтетические наборы 08.1–08.8 (ранее **1514/1514 V8 PASS**), новый W08 integration suite, аудит относительных ссылок, provenance и сколько независимых ChatGPT blind-runs реально выполнено (**пока 0**, не выдумывать). Локальные V8 assertions не означают реальный Node checkout/CI/Skills auto-discovery или реальный Bybit/Veles/GinArea.

## 7. Приёмка — решение пользователя требуется отдельно

**08.9 IMPLEMENTED / PENDING USER REVIEW, этап 08 PENDING FORMAL STAGE ACCEPTANCE, 09 NOT STARTED.** Принятие 08.9 и закрытие **всего** этапа 08 — разные решения; пользователь может одобрить оба явно. До этого PR #1 Open/Draft, без merge, торговых действий и фонового мониторинга.
