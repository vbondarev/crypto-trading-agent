# Stage 09.5.3 — independent invocation handoff: S09-014-R01

> **2026-11-06 — READY_FOR_EXTERNAL_INVOCATION / NOT_RUN**. The user specifically authorized preparing S09-014-R01 and prohibited running it in the working/development chat. No tested model response is reported by this file.

## Pre-invocation integrity and sources

- Repository: `vbondarev/crypto-trading-agent`; immutable **normative source SHA**: `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`. Do **not** use default-branch HEAD.
- Frozen public input: `tests/fixtures/stage-09/inputs.v1.json`, Git Blob `965c12afa0c4afc4c0b1698732e61c597d351b88`, `case_id=S09-014`, `prompt_id=P08-14`, fixture v1, all inputs synthetic.
- Public oracle SHA-256: `f64b4e352d50bbe5d3d283d6bead4bf2bd52948a001212656839c82dc028c985`; original private evaluator-only file `S09-014-R01_PRIVATE_ORACLE.json`, 3140 raw UTF-8 bytes, 10 sealed mandatory criteria. The [public precommitment](stage-09-05-02-oracle-commitments.md) was recorded at commit `fffb5008761e91b84bec5d54d6165f6a1d8da00a` **before any independent model invocation**.
- Integrity rechecked on the original local private bytes, separate local backup and saved private ZIP archive: all three SHA-256 values identical to the public commitment. **The private criteria/nonce are not published here and must never be supplied to tested agent.**
- Stage 09.5 current accepted count: **1/5 new cases** (`S09-013-R01` accepted USER_ATTESTED). `S09-014-R01` remains `NOT_RUN`; other cases `S09-015`–`S09-017` likewise `NOT_RUN`.
- [Approved 09.5.1 manifest](stage-09-05-01-preflight.md): seven source documents/Skills are mandatory for this scenario, as for S09-013. Their complete content must be read independently in the new test session. Explicit GitHub reads are distinct from automated Skills runtime loading.

## Standalone public-only prompt for new Temporary Chat

Copy the following text **exactly once** into a **new Temporary Chat outside Crypto Project**, without copying this document's surrounding integrity/scoring sections:

```text
Crypto Trading Agent — независимый синтетический тест S09-014-R01.

Используй репозиторий vbondarev/crypto-trading-agent и ТОЛЬКО зафиксированный commit SHA d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5 (не HEAD).

До анализа явно прочитай полностью:
1. AGENTS.md
2. docs/agent-operating-rules.md
3. docs/data-freshness.md
4. .agents/skills/data-verification/SKILL.md
5. .agents/skills/market-analysis/SKILL.md
6. .agents/skills/portfolio-analysis/SKILL.md
7. .agents/skills/risk-assessment/SKILL.md

Для каждого документа укажи путь, ref, способ чтения и полноту. Если полный текст недоступен, честно укажи это; не утверждай, что Skill загрузился автоматически, если такого подтверждения нет.

Затем используй исключительно вымышленный вход из tests/fixtures/stage-09/inputs.v1.json: S09-014, fixture v1, P08-14 (Git Blob 965c12afa0c4afc4c0b1698732e61c597d351b88).

[SYNTHETIC TEST, ВСЕ ДАННЫЕ ВЫМЫШЛЕНЫ, TEST NOW 12:00 МСК 20.10.2026, НЕ СОВЕРШАТЬ СДЕЛКИ.] Три действующих position slots BTC/ETH/SOL и виртуальный будущий IN GPS (новый четвёртый slot). У SOL order A FILLED leaves=0 и другой order B NEW leaves=2. Проверь будущие IN.

Данные:
{
  "slots": ["BTCUSDT:0", "ETHUSDT:0", "SOLUSDT:0"],
  "virtual_in": "GPSUSDT:0",
  "orders": [
    {"id": "A", "status": "Filled", "leavesQty": 0},
    {"id": "B", "status": "New", "leavesQty": 2}
  ]
}

Не обращайся к реальным котировкам, аккаунтам или торговым API. Никаких сделок, ордеров и запуска ботов. Предоставь отчёт об инициализации и ответ на пользовательский вопрос, соблюдая применимые нормативные правила. Отделяй подтверждённые данные от допущений и отсутствующей информации.
```

## Capture requirements — not a test result

1. In an entirely fresh **Temporary Chat outside Crypto Project**, paste only the complete fenced prompt above (without the backtick fences).
2. Preserve the **first complete answer** including source initialization report; do not regenerate, reprompt or supply prior test outputs, the private oracle, evaluator materials, rubric or expected result.
3. Return the complete first unchanged answer to this development/evaluation conversation. Its provenance will be separately user-attested **after** the response arrives and private original rehash is verified.
4. A failed mandatory GitHub read must be reported, not silently replaced with branch HEAD or prior memory. If source loading cannot be established, treat outcome as restricted/inconclusive and retain the original response.
5. Until a real answer arrives, `S09-014-R01=NOT_RUN`; **no verdict** and **no new accepted ledger entry**. No real trading and no automatic stage completion.

**Next action:** the user executes the provided prompt in a new Temporary Chat and supplies the first response. Stage 09.5.3 remains `IN_PROGRESS`, PR #1 Draft/Open.
