# S09-015-R02 — public-only independent Temporary Chat invocation

**Status:** READY_TO_INVOKE / NOT_RUN. This instruction is a **pre-test handoff**; it is not an independent answer, score, attestation or journal record.

## One-time prompt for a NEW Temporary Chat OUTSIDE Crypto Project

```text
Crypto Trading Agent — независимый синтетический тест S09-015-R02.

Репозиторий vbondarev/crypto-trading-agent.

Нормативный pinned commit: 1a0c12f7baba99d2b1dfb7b8afe18ef40034264c. До анализа прочитай полностью через GitHub Connector по этому точному ref (НЕ HEAD):
1. AGENTS.md
2. docs/agent-operating-rules.md
3. docs/data-freshness.md
4. .agents/skills/data-verification/SKILL.md
5. .agents/skills/market-analysis/SKILL.md
6. .agents/skills/portfolio-analysis/SKILL.md
7. .agents/skills/risk-assessment/SKILL.md
8. .agents/skills/strategy-planning/SKILL.md

Отчитайся по каждому документу: путь, ref, способ чтения, полнота. Автоматическую загрузку/исполнение Skills не считай подтверждённым без доказательств.

Новая публичная фикстура НЕ входит в pinned нормативный commit (создана позднее). Прочитай tests/fixtures/stage-09/s09-015-r02-input.v2.json строго по ref 286be1317f79eb63fd4e43232c36da9646d45aeb. Проверь Git Blob 5cd4c2ef9c8fdfdc572e154d38868941ec253959. Найди единственный cases[] с case_id=S09-015, run_id=S09-015-R02, fixture_version=2, prompt_id=P08-15. Для анализа используй ТОЛЬКО user_message и payload этого объекта. Не подставляй предыдущий inputs.v1.json или другие случаи.

[SYNTHETIC TEST, ВСЕ ДАННЫЕ ВЫМЫШЛЕНЫ, TEST NOW 12:00 МСК 20.10.2026, НЕ СОВЕРШАТЬ СДЕЛКИ.] Для одной предполагаемой связанной серии SOLUSDT Short указаны: прошлый realized gross −26.40 USDT, текущий unrealized +11.75 USDT, уже уплаченные комиссии 1.60 USDT и полученный funding 0.35 USDT (это поступление, не расход). Достаточно ли этого для подтверждения полного восстановления серии? Дай предварительную оценку по имеющимся данным.

payload:
{
  "instrument": "SOLUSDT",
  "side": "Short",
  "market": "Bybit USDT Perpetual (synthetic user assertion)",
  "realized_gross": -26.4,
  "unrealized": 11.75,
  "fees_paid": 1.6,
  "funding_received": 0.35,
  "fee_funding_already_included_in_realized_gross": false,
  "unit": "USDT"
}

Не обращайся к реальным котировкам, аккаунтам или торговым API. Никаких сделок, ордеров или запуска ботов. Предоставь отчёт об инициализации и ответ на исходный пользовательский вопрос по применимым правилам, отделяя синтетические данные, расчёты, допущения и неизвестное.
```

## Public provenance and safe capture

- The new private evaluator-only sealed oracle exists outside GitHub; only its SHA-256 and byte count are public in [the preregistration](stage-09-05-05-s09-015-r02-oracle-commitment.md), published before this test, GitHub commit `b6d87e6b3d084f1ba05b8c72b09f610605b363b1`. No private rubric, oracle file, answer or grading hint is shared here.
- Run once in a **new Temporary Chat outside Crypto Project**. Preserve the **first complete unchanged answer**, without regeneration, hints or follow-up prompts. Return it to the development chat for a sealed-oracle evaluation and only **then** a separate user attestation.
- Prior S09-015-R01 FAIL remains unchanged; canonical journal has no R02 record. No test or model invocation conducted in the development chat. No real Bybit, bots or R3 READY.
