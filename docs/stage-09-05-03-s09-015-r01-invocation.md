# Stage 09.5.3 — independent invocation handoff: S09-015-R01

> **2026-11-06 — READY_FOR_EXTERNAL_INVOCATION / NOT_RUN.** Authorized task is only to verify the original sealed oracle, public commitment and prepare a public-only test prompt. **Do not execute this model test in the development chat.**

## 1. Source identity and pre-committed integrity

- Repository: `vbondarev/crypto-trading-agent`; fixed source **commit** `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5` (never HEAD).
- Fixed public input: `tests/fixtures/stage-09/inputs.v1.json`, Git Blob SHA `965c12afa0c4afc4c0b1698732e61c597d351b88`; case `S09-015`, prompt `P08-15`, fixture v1, entirely synthetic, clock `2026-10-20T12:00:00+03:00`.
- Private original: `S09-015-R01_PRIVATE_ORACLE.json`, 2982 raw UTF-8 bytes; SHA-256 `a3a038bc243645f1c162edfc2ff82012778ae7bcb09708a6677d4e18f02ad3c2`; original, separate backup and private ZIP entry rehashed locally and **all match**.
- Public preregistration: [oracle SHA-256 commitments](stage-09-05-02-oracle-commitments.md) from GitHub commit `fffb5008761e91b84bec5d54d6165f6a1d8da00a`, **before** any S09-015 independent model execution.
- Evaluator-only criteria, expected answers and nonce **must never** be shared with tested ChatGPT. This document contains the user's public synthetic fixture input only.
- Current independent runs accepted in [canonical journal](../tests/fixtures/stage-09/portfolio-recovery-actual-runs.v1.json): `S09-013-R01` and `S09-014-R01` (2/5, USER_ATTESTED). `S09-015-R01` is **NOT_RUN**.

## 2. Mandatory pinned source manifest

Read the **complete** bodies of these eight paths in the **new** test chat at the exact immutable source commit:
1. `AGENTS.md`
2. `docs/agent-operating-rules.md`
3. `docs/data-freshness.md`
4. `.agents/skills/data-verification/SKILL.md`
5. `.agents/skills/market-analysis/SKILL.md`
6. `.agents/skills/portfolio-analysis/SKILL.md`
7. `.agents/skills/risk-assessment/SKILL.md`
8. `.agents/skills/strategy-planning/SKILL.md`

These are five stable baseline documents and the three RT05-relevant Skills recorded in [approved 09.5.1 preflight](stage-09-05-01-preflight.md). Development-context reads do not prove tested-session loads. Explicit GitHub reads do not prove automatic Skill runtime discovery.

## 3. Standalone public-only prompt

Copy **only** the text inside the block, without the Markdown fence or the surrounding sections, to a **new Temporary Chat outside Crypto Project**, once:

```text
Crypto Trading Agent — независимый синтетический тест S09-015-R01.

Используй репозиторий vbondarev/crypto-trading-agent и ТОЛЬКО зафиксированный commit SHA d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5 (не HEAD).

До анализа явно прочитай полностью:
1. AGENTS.md
2. docs/agent-operating-rules.md
3. docs/data-freshness.md
4. .agents/skills/data-verification/SKILL.md
5. .agents/skills/market-analysis/SKILL.md
6. .agents/skills/portfolio-analysis/SKILL.md
7. .agents/skills/risk-assessment/SKILL.md
8. .agents/skills/strategy-planning/SKILL.md

Для каждого документа укажи путь, ref, способ чтения и полноту. Если полный текст недоступен, честно укажи это; не утверждай, что Skill загрузился автоматически, если такого подтверждения нет.

Затем используй исключительно вымышленный вход из tests/fixtures/stage-09/inputs.v1.json: S09-015, fixture v1, P08-15 (Git Blob 965c12afa0c4afc4c0b1698732e61c597d351b88).

[SYNTHETIC TEST, ВСЕ ДАННЫЕ ВЫМЫШЛЕНЫ, TEST NOW 12:00 МСК 20.10.2026, НЕ СОВЕРШАТЬ СДЕЛКИ.] Результат связанной серии: realized gross -15 USDT, unrealized +10, fees 1, funding cost 2. Восстановлена ли серия?

Данные:
{
  "realized_gross": -15,
  "unrealized": 10,
  "fees": 1,
  "funding_cost": 2,
  "unit": "USDT"
}

Не обращайся к реальным котировкам, аккаунтам или торговым API. Никаких сделок, ордеров и запуска ботов. Предоставь отчёт об инициализации и ответ на пользовательский вопрос, соблюдая применимые нормативные правила. Отделяй подтверждённые данные от допущений и отсутствующей информации.
```

## 4. Evidence capture and stop conditions

1. Use **one new Temporary Chat outside Crypto Project**. Paste exactly the complete public prompt above, with no prior test history, oracle, scoring checklist or hint.
2. Preserve the **first full original response**, including initialization report. Do not regenerate, edit, reprompt or correct the tested agent after seeing the first answer.
3. Return the complete unchanged response to the development chat. Evaluator will **rehash original private oracle before grading** and request **separate post-run user attestation** of isolation, first unedited answer and no rubric leakage.
4. If mandatory source reads fail, retain and report the failure; never substitute branch HEAD or claim automatic Skill loading without evidence.
5. No actual H01 trades, production portfolio accesses, live R3 READY, stage 09.5.4 aggregate evaluation, or automatic advancement is implied.

**Status:** `S09-015-R01 NOT_RUN`; `09.5.3 IN_PROGRESS (2/5 accepted)`; PR #1 Draft/Open.
