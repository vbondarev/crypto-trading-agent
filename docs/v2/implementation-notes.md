# v2 Stage 03 — implementation notes (candidate branch only)

**Stage 03 scope:** create four new **inactive** Skills with `-v2` suffix, seven JSON Schema contracts, two platform reference adapters, one Coin Profile report template, one synthetic deterministic sample and contract regression scripts. User-facing runtime routing **not activated**.

**Origin:** `docs/v2-stage-02-architecture.md` at accepted commit `0333a6a34f2c9d0537ed080ebaf91af4261fc63c` and frozen existing first-party normative material. Original `AGENTS.md`, `README.md`, seven old Skills, old report/closeout and PR #1 stay unchanged.

**Model:** four logical phases; `EvidenceRecord` is typed and linked by `evidence_id`; missing sources retain `ACCESS_UNAVAILABLE`; `CoinProfile` preserves global/local trend distinct from `StrategyProposal.posture`; `BotConfigurationProposal` only for one selected platform. Reference standard JSON Schema 2020-12.

**Implementation-only precautions:** the formal JSON Schemas enforce shapes/enums, but cannot by themselves prove timestamps are fresh, sources genuine, sufficient OHLCV history, that dependencies exist, numeric risk math, or correct account position mapping. Those require semantic validation and independent real-data evidence. The prospective `VERIFIED_FOR_MANUAL_REVIEW` must never be inferred from schema validation.

**Preview paths:** `.agents/skills/{market-research-v2,technical-analysis-v2,strategy-synthesis-v2,bot-configuration-v2}/SKILL.md`, `docs/v2/contracts/*.schema.json`, `docs/v2/adapters/{veles,ginarea}.md`, `docs/v2/coin-report-template.md`.

**Status:** `IMPLEMENTED_IN_ISOLATED_BRANCH / NOT_ACTIVE / USER_REVIEW_PENDING`. No account access, real quotes, bot API, auto-load verification or live trade behavior.
