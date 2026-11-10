# v2 Pilot P01 — Instructions for isolated HYPEUSDT live public-source research (NOT EXECUTED)

**Status:** `PREPARED / PILOT_NOT_RUN / V2_NOT_ACTIVE`. Preparation after user's acceptance of the **limited** Stage 05 synthetic regression. This is a prospective independent-session instruction, not proof of access to any public source, to private exchange account, or to Veles.

## Fixed test identity and rules

- Repository `vbondarev/crypto-trading-agent`.
- **Pinned v2 policy commit:** `b7123d9cf19502bf4a890f1400027f30fa213434` (Stage 05 closeout/self-review snapshot *before* pilot preparation). **Fetch the actual files using this exact commit**, not the current branch head. The new pilot documents are outside this test normative pin.
- Test market: **Bybit HYPEUSDT USDT Perpetual (linear)**. Do not substitute HYPE spot, Binance derivatives, index or exchange-specific Mark with last price.
- Only **publicly reachable** sources may be queried. No source data is pre-seeded; **this pilot is not a synthetic market simulation**. No Bybit account/API key, real P02 platform screenshot, or trading portfolio supplied by default.
- Test evaluates an **analytical Coin Profile and a safe preliminary Veles draft**, **not** permission to create an executable bot or to trade. No automatic actions; no stage 06 activation.

## Load and source-attest v2 Skills before answering

Open a **new Temporary Chat outside the active Crypto Project**, or another truly isolated new chat without previous agent/context; do not use the existing project's legacy `AGENTS.md` as normative agent routing. Instruct the test agent to explicitly fetch/read full contents through the connected GitHub tool (or cite the concrete inability) **at the pinned commit**:

1. `.agents/skills/market-research-v2/SKILL.md`
2. `.agents/skills/technical-analysis-v2/SKILL.md`
3. `.agents/skills/strategy-synthesis-v2/SKILL.md`
4. `.agents/skills/bot-configuration-v2/SKILL.md`
5. `docs/v2/analytical-workflow.md`
6. `docs/v2/source-acquisition-policy.md`
7. `docs/v2/bot-handoff-policy.md`
8. `docs/v2/coin-report-template.md`
9. `docs/v2/adapters/veles.md`
10. `docs/risk-management.md`, `docs/data-freshness.md`, `docs/data-sources.md`, `docs/platforms/veles.md` and `docs/platforms/configuration-contract.md` when referenced for material decisions.

Document each actual source read with `path`, `ref`, `fetch status`, and (if returned) Git Blob SHA. **Do not silently claim an auto-loader worked**. If GitHub Connector cannot access the full source bodies at the fixed ref, stop with `INCONCLUSIVE_SOURCE_LOAD`; do not claim a v2 independent pilot happened.

## Copy/paste this exact prompt into the new isolated session

> **PILOT P01 — LIVE PUBLIC SOURCES / NO REAL TRADING.**
>
> Repository: `vbondarev/crypto-trading-agent`.
>
> Pinned policy commit SHA: `b7123d9cf19502bf4a890f1400027f30fa213434`.
>
> Работай только по **новым v2 Skills** и документам, перечисленным в `docs/v2/pilots/hype-p01-instructions.md`? **Нет:** этот файл создан позднее pinned commit, поэтому перечень необходимых 14 файлов приведён непосредственно в инструкции, сопровождающей этот запрос; используй список файлов, доступный в сообщении целиком. Если списка нет в новой сессии, запроси его до исследования.
>
> Проведи **реальный, актуальный на момент запроса** анализ `HYPEUSDT` на **Bybit USDT Perpetual (linear)**. Обязательно попытайся проверить доступные публичные биржевые рыночные данные, состояние BTC/ETH, новости и первичные источники проекта, открытые публикации X/Twitter, публичные Telegram-источники и деривативные агрегаторы (например CoinGlass/CoinAnk), **только если фактически доступен просмотр**.
>
> Дай `Coin Profile`: рыночный режим, подтверждённые новости и слухи с источниками и временем, глобальный/локальный технический тренд на доступных закрытых OHLCV, индикаторы, волатильность, уровни, funding/OI при наличии, противоречия, уверенность, BULL/BASE/BEAR-сценарии и итог `LONG/SHORT/WAIT`. Не выдумывай цены, социальные публикации, охват, время или технические значения. Недоступные источники обозначай `ACCESS_UNAVAILABLE`, непроверенные данные — отдельно.
>
> Подготовь **только предварительный проект Veles** под проверенные действительные параметры выбранного режима, если это обосновано. **Не изобретай поля формы, размер ордера, сетку или прибыльность.** У меня **нет предоставленных тебе P02, T02 и подтверждённого депозита**; потому итог `DRAFT / NEEDS_DATA / NOT_RECOMMENDED`, **не `VERIFIED_FOR_MANUAL_REVIEW` и не `READY`**. Если данных недостаточно для направления — `WAIT`. Никаких сделок, запусков бота, запросов API-ключей.
>
> В начале результата дай короткую **матрицу реально прочитанных нормативных документов** с pinned SHA и методами чтения. Для каждого существенного внешнего факта укажи конкретный источник и время публикации/наблюдения либо честно пометь отсутствие. В конце отдели критически недостающие данные от необязательных и обозначь один ближайший пользовательский шаг.

**Operator note:** when pasting the pilot, paste the file manifest from the previous section **together** with the prompt. The test policy pin intentionally predates this pilot document. The pilot should not fetch its own later test documents as v2 normative source.

## Capture and assessment process

1. Before invoking the new chat, record the fixed policy SHA above, the actual user-local time (with timezone), test platform/model if visible, `P02=NOT_PROVIDED`, `T02=NOT_PROVIDED`, and the exact prompt (including the 14-file manifest).
2. After answering, copy the **first complete answer unchanged** and list which public sources were actually reached; keep direct URLs or tool provider references and real observed time. A model's own assertion that it loaded a Skill is **not** independent authentication.
3. Evaluate against the **public, non-sealed** rubric `docs/v2/pilots/hype-p01-evaluation.md`. This pilot is transparent, **not blind/sealed-oracle**; give evidence for every outcome.
4. If GitHub source loading fails, classify `INCONCLUSIVE_SOURCE_LOAD`. If live public sources fail, report `PARTIAL/INCONCLUSIVE_DATA` rather than invent evidence. Incomplete P02/T02 is **expected** and must not be treated as a failure if the agent correctly declines executable settings.
5. Preserve the first answer; any corrected run needs a new run ID `HYPE-P01-R02` and explicit post-test notation. Do not overwrite prior answer or call reruns independent originals.
6. **Do not conduct this pilot in the preparation chat; the user starts it explicitly in a separate session.**

## Outcome

`PILOT_PREPARED / P01-R01_NOT_RUN / STAGE_06_NOT_STARTED`; current active agent, old Skills and PR #1 unchanged.
