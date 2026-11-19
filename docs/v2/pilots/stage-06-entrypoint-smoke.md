# Stage 06 entrypoint smoke test

2026-11-19. Tested branch `feature/simplified-agent-v2` at `6a1cdbbd94038c2e21cfb7c14ae7385000a275fa`. Result `ENTRYPOINT_SMOKE_PASS / SYNTHETIC_ONLY / NO_TRADE_READY`.

The two independent temporary ChatGPT sessions each received a single request to resolve the branch HEAD using GitHub, read `AGENTS.md` and follow its route. The requests supplied only the scenario data and desired analysis. They listed no downstream modules or expected verdicts. Each session resolved the expected commit and selected the v2 route. This tests explicit entrypoint loading.

| Case | Synthetic input | First response |
| --- | --- | --- |
| S-BARS / S-STRUCT / S-MKT | HYPEUSDT Bybit USDT Perpetual, Veles SIMPLE. Closed 1h/4h/1d summaries, bullish structure and supporting synthetic market context. Current Mark, account and editor evidence absent. | `LONG / RECOMMENDED_CONDITIONAL` → Veles SIMPLE `NEEDS_DATA`. Proposal `HYPE-SYN-20261020-C01` links to `HYPE-SYN-20261020-S01`. Four documented controls have null values, no leverage, order amounts, grid steps or price bounds. Risk `NOT_EVALUABLE`, automated execution forbidden. |
| S-PARTIAL | Same instrument and platform, synthetic price 100 USDT and reported 1h EMA50 of 98 without bars or method. No higher-timeframe or market, account or editor evidence. | `WAIT`, Veles `NOT_RECOMMENDED`. No numeric grid, executable orders, leverage, TP or SL. Risk `NOT_EVALUABLE`. |

In S-PARTIAL the initial read of the handoff policy failed with a connection error. The retry on the same commit succeeded. Both sessions reported reading the historical pilot report linked from `AGENTS.md`, so the results demonstrate the new entrypoint and observable behavior with that documentation available. They do not constitute an evaluation blinded to earlier examples.

## Reported file provenance

All reported blob prefixes matched an independent read by pinned commit. The supported-input response listed 24 files. The partial-input response listed the same 17 non-schema files.

| Path | Blob prefix |
| --- | --- |
| `AGENTS.md` | `9cc0075b` |
| `docs/v2/analytical-workflow.md` | `2d2dde8d` |
| `docs/v2/source-acquisition-policy.md` | `bb465998` |
| `docs/v2/coin-report-template.md` | `5344a5c5` |
| `docs/v2/bot-handoff-policy.md` | `b73308b3` |
| `.agents/skills/market-research-v2/SKILL.md` | `de45204b` |
| `.agents/skills/technical-analysis-v2/SKILL.md` | `e7f1c7e6` |
| `.agents/skills/strategy-synthesis-v2/SKILL.md` | `d81b0449` |
| `.agents/skills/bot-configuration-v2/SKILL.md` | `c0acdeaa` |
| `docs/v2/adapters/veles.md` | `e19cb8b3` |
| `docs/v2/contracts/request-context.schema.json` | `bc67252b` |
| `docs/v2/contracts/evidence-record.schema.json` | `0631087d` |
| `docs/v2/contracts/market-evidence.schema.json` | `61189577` |
| `docs/v2/contracts/technical-evidence.schema.json` | `bdc59680` |
| `docs/v2/contracts/coin-profile.schema.json` | `31d49a56` |
| `docs/v2/contracts/strategy-proposal.schema.json` | `59db0de1` |
| `docs/v2/contracts/bot-configuration.schema.json` | `0fb510fd` |
| `docs/v2/pilots/veles-simple-independent-replay.md` | `6a94bc3f` |
| `docs/platforms/configuration-contract.md` | `31a4ab98` |
| `docs/agent-operating-rules.md` | `62c33c1c` |
| `docs/data-freshness.md` | `2a2cc811` |
| `docs/requirements.md` | `7298e118` |
| `docs/risk-management.md` | `741e53f2` |
| `docs/platforms/veles.md` | `01f79630` |

The smoke test compared the visible first responses and strategy linkage. Formal repeatable Python validation, regression cases and the final Stage 06 closeout remain separate work. This run establishes no automatic loading without an explicit request and no real execution readiness.
