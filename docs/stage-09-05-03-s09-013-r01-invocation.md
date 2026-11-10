# Stage 09.5.3 — first independent invocation handoff: S09-013-R01

> **2026-11-06 — READY_FOR_EXTERNAL_INVOCATION / NOT_RUN.**
>
> User explicitly authorized beginning 09.5.3 by saying “Переходим” after 09.5.2 acceptance. This document contains **only invocation procedure, fixed normative sources and public synthetic input**. No private oracle criteria, scoring hints, evaluator-only nonces or expected answers. **No test model session was run in the development conversation.**

## Source and integrity gates

- Pinned normative source commit: `d76434098a911b2a3cd3cc0fb45bfc5c15db8cc5`.
- Public fixture `tests/fixtures/stage-09/inputs.v1.json`, Git Blob `965c12afa0c4afc4c0b1698732e61c597d351b88`, case `S09-013`, prompt `P08-13`.
- Public pre-run SHA-256 commitment exists before invoking tested model: [stage-09-05-02-oracle-commitments.md](stage-09-05-02-oracle-commitments.md), precommit commit `fffb5008761e91b84bec5d54d6165f6a1d8da00a`.
- The private evaluator-only **original** S09-013-R01 oracle's SHA-256 was locally rechecked **before invocation** and equals the preregistered public hash. Original/backup are private and must not be given to the model.
- Source reads by the **development** agent do not prove reads by the **isolated** test agent. The test agent must obtain and report complete reads independently.

## Exact documents for independent agent to read (at the pinned source commit)

1. `AGENTS.md`
2. `docs/agent-operating-rules.md`
3. `docs/data-freshness.md`
4. `.agents/skills/data-verification/SKILL.md`
5. `.agents/skills/market-analysis/SKILL.md`
6. `.agents/skills/portfolio-analysis/SKILL.md`
7. `.agents/skills/risk-assessment/SKILL.md`

These seven are mandatory for **S09-013** (five stable baseline documents and two portfolio/risk Skills). Their pin-dependent Git Blob IDs and byte/character limitations were recorded in [09.5.1 preflight](stage-09-05-01-preflight.md). Source loading by normal/manual GitHub read must not be mislabeled as automatic Skill discovery.

## Standalone test prompt (public input only)

```text
Crypto Trading Agent — независимый синтетический тест S09-013-R01.

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

Затем используй исключительно вымышленный вход из tests/fixtures/stage-09/inputs.v1.json: S09-013, fixture v1, P08-13 (Git Blob 965c12afa0c4afc4c0b1698732e61c597d351b88).

[SYNTHETIC TEST, ВСЕ ДАННЫЕ ВЫМЫШЛЕНЫ, TEST NOW 12:00 МСК 20.10.2026, НЕ СОВЕРШАТЬ СДЕЛКИ.] Оцени Cross-риск SOL Short qty=10, mark=100, отображаемая liqPrice=130. Остальные позиции и account MMR неизвестны, полный T02 отсутствует.

Данные:
{
  "t03": {
    "symbol": "SOLUSDT",
    "side": "Sell",
    "qty": 10,
    "mark": 100,
    "displayed_liq": 130
  },
  "t02": null
}

Не обращайся к реальным котировкам, аккаунтам или торговым API. Никаких сделок, ордеров и запуска ботов. Предоставь отчёт об инициализации и ответ на пользовательский вопрос, соблюдая применимые нормативные правила. Отделяй подтверждённые данные от допущений и отсутствующей информации.
```

## Capture and provenance rules

- Open **one new Temporary Chat outside Crypto Project** and paste the complete standalone prompt **once**.
- Retain the **first full response**, including any initialization report. Do not regenerate, reprompt, correct or feed the model prior-test findings. Do not provide the private oracle or this development conversation.
- Return the unmodified full response to the development/evaluation chat as a file or text. The evaluator will compare with the locked original only **after** the response arrives. Obtain explicit post-response user attestation.
- If source access fails, preserve the honest error response; do not silently patch the tested conversation.
- **At handoff:** S09-013-R01 `NOT_RUN`; no run ID is recorded in the 09.5 actual-run ledger and no evaluation verdict is asserted. Remaining S09-014–017 `NOT_RUN`.

## Next gate

Do not claim `09.5.3 COMPLETED` until all five first full answers are actually captured. S09-013-R01 awaits a user-operated external independent Temporary Chat. No private rubric publication or autonomous ChatGPT side-thread creation.
