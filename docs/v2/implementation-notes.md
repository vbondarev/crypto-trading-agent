# v2 Stage 03 — implementation notes (candidate branch only)

**Stage 03 scope:** create four new **inactive** Skills with `-v2` suffix, seven JSON Schema contracts, two platform reference adapters, one Coin Profile report template, one synthetic deterministic sample and contract regression scripts. User-facing runtime routing **not activated**.

**Origin:** `docs/v2-stage-02-architecture.md` at accepted commit `0333a6a34f2c9d0537ed080ebaf91af4261fc63c` and frozen existing first-party normative material. Original `AGENTS.md`, `README.md`, seven old Skills, old report/closeout and PR #1 stay unchanged.

**Model:** four logical phases; `EvidenceRecord` is typed and linked by `evidence_id`; missing sources retain `ACCESS_UNAVAILABLE`; `CoinProfile` preserves global/local trend distinct from `StrategyProposal.posture`; `BotConfigurationProposal` only for one selected platform. Reference standard JSON Schema 2020-12.

**Implementation-only precautions:** the formal JSON Schemas enforce shapes/enums, but cannot by themselves prove timestamps are fresh, sources genuine, sufficient OHLCV history, that dependencies exist, numeric risk math, or correct account position mapping. Those require semantic validation and independent real-data evidence. The prospective `VERIFIED_FOR_MANUAL_REVIEW` must never be inferred from schema validation.

**Preview paths:** `.agents/skills/{market-research-v2,technical-analysis-v2,strategy-synthesis-v2,bot-configuration-v2}/SKILL.md`, `docs/v2/contracts/*.schema.json`, `docs/v2/adapters/{veles,ginarea}.md`, `docs/v2/coin-report-template.md`.

**Status:** `IMPLEMENTED_IN_ISOLATED_BRANCH / NOT_ACTIVE / USER_REVIEW_PENDING`. No account access, real quotes, bot API, auto-load verification or live trade behavior.

## Language policy for new development

**User decision, 2026-11-19:** Python is the sole implementation language for future project code, including data collectors, validation and audit utilities, workflow guards, and automated tests. Implement new tools and functional changes in Python. Migrate any existing JavaScript utility or test that future work needs to extend to Python before extending it, and verify equivalent behavior before switching the documented run path.

Existing Node.js scripts and test records are retained for historical reproducibility. The next AN-02 implementation change should extend the existing Python Bybit collector and verify parity with the current AN-02 checks before changing the pilot runbook.

The agent itself continues to run in ChatGPT using GitHub-hosted instructions. Python is required only when running the supporting tools or tests. Markdown instructions and JSON contracts remain part of the project.

## Reproducing the Stage 06 handoff checks

From the repository root, install the test dependency in the Python environment and run:

```text
python -m pip install -r tests/v2/requirements.txt
python tests/v2/workflow_smoke.py
python docs/v2/workflow_guard.py tests/v2/fixtures/conditional-long-draft.v1.json
```

The Python regression suite validates both existing fixtures against the seven Draft 2020-12 schemas and exercises the original handoff cases. New cases reject a numeric grid on WAIT, an unsupported readiness claim and a mismatched strategy reference. The standalone validator accepts a JSON handoff bundle in the same format as the fixtures. Exit code 0 means the schemas and handoff checks accepted the bundle. Exit code 1 signals schema or handoff violations, and 2 signals invalid input or usage. A valid draft can still report evidence gaps. All checks use supplied data and execution is disabled.
