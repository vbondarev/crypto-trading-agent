# Stage 09.5.5 — S09-015-R02 sealed oracle commitment (PUBLIC)

> **PRE-REGISTERED BEFORE ANY S09-015-R02 INDEPENDENT TEST — 2026-11-06.** Status: `COMMITTED / R02_NOT_RUN`.

This file contains **only non-secret public metadata, version pins, and a cryptographic commitment**. It contains **no private grading criteria, expected answers, nonce, or private oracle text**. A future test agent must never receive the private original, backup, or ZIP.

## Immutable normative source and fixture

- Repository: `vbondarev/crypto-trading-agent`, branch `feature/initial-agent-mvp` (development only).
- **NEW normative source pinned commit:** `1a0c12f7baba99d2b1dfb7b8afe18ef40034264c`, after approved Option B changes and the documentary self-review. Future source reads for R02 use **this exact commit**, not branch HEAD and **not** the old R01 source commit.
- Mandatory full normative source Git Blob manifest at the new pinned commit:

| Source | Git Blob SHA |
|---|---|
| `AGENTS.md` | `4e96077337e550448eb262599089fba9eb879d81` |
| `docs/agent-operating-rules.md` | `62c33c1c6de5fbedbe16945b175a4ce1d98f5cba` |
| `docs/data-freshness.md` | `2a2cc811340ba8414777fc2019ac41ceb6273a78` |
| `.agents/skills/data-verification/SKILL.md` | `6815b433d91135738210ce5993af30b2bf2c74fa` |
| `.agents/skills/market-analysis/SKILL.md` | `f458dbd67c4d26642f5ea46b3ed310c5fb5a1c02` |
| `.agents/skills/portfolio-analysis/SKILL.md` | `15d4d476e772a681e719c16dc9845251d22d7036` |
| `.agents/skills/risk-assessment/SKILL.md` | `44661e995d2a5277eb034c8a0e97bef9223de50a` |
| `.agents/skills/strategy-planning/SKILL.md` | `ce7d5fb44ace79f5564a8c175fb0b2b6d4011ef1` |

- **NEW public fixture:** `tests/fixtures/stage-09/s09-015-r02-input.v2.json`, Git Blob SHA `5cd4c2ef9c8fdfdc572e154d38868941ec253959`. Exactly one case `S09-015`, unique `run_id=S09-015-R02`, `fixture_version=2`, prompt `P08-15`, synthetic test time `2026-10-20T12:00:00+03:00`.
- Fixture was committed at `286be1317f79eb63fd4e43232c36da9646d45aeb`, **before** this oracle commitment and **before** any tested first response. User data only; no private oracles.
- The original frozen `tests/fixtures/stage-09/inputs.v1.json` remains Git Blob `965c12afa0c4afc4c0b1698732e61c597d351b88` and is NOT the input for R02.

## Sealed evaluator-only original oracle — public commitment

| Run ID | Private original basename (not publicly stored) | Original UTF-8 bytes | Mandatory checks | SHA-256 |
|---|---|---:|---:|---|
| `S09-015-R02` | `S09-015-R02_PRIVATE_ORACLE.json` | **4318** | **10** | `a2f563e0eec0228f9c4a7c8895ebb0f4533b0c6b040e3c99296184aca929718c` |

**Creation and integrity:** A fresh evaluator-only original JSON was created before any R02 independent model response, with new random nonce, 10 frozen mandatory grading conditions, exact new normative pin and new fixture Git Blob, stored outside GitHub. A separate byte-identical private backup and a separate ZIP archive member were verified against original bytes; all three compute the SHA-256 above. Neither the private oracle, its precise criteria nor its expected answers may be added to the public repository or passed to the tested model.

## Blind-execution gate — no test authorized in this step

1. This document **precommits** the original sealed evaluator-only oracle; it is **not** an independent test, an answer, a PASS, or a new actual-run journal entry.
2. Before any future S09-015-R02 invocation, independently verify this commitment exists at a GitHub commit that strictly precedes model invocation; rehash the same private original file and private backup. Missing file, hash mismatch, unreadable mandatory source, altered input or response provenance ⇒ fail closed.
3. In a **fresh Temporary Chat outside Crypto Project**, read all eight required files from the **new pinned normative SHA**, and read precisely the selected input `user_message` and `payload` from the new v2 fixture, by its exact blob; no other cases, private oracle, rubric or evaluation hints.
4. Capture only the **first complete unmodified model response**; obtain separate post-response user attestation; no automatic Skills loader may be assumed. Grade only against the original frozen private oracle, after its hash is reverified, with mandatory criterion no-waiver policy. R01 is not rescored.
5. No real Bybit API, account, positions, orders, bots, live prices, actual stress or R3 READY.

**State:** `R02_PREPARED_NOT_INVOKED`; original `S09-015-R01 = 9/10 FAIL / NOT_ACCEPTED` remains unchanged, 09.5 currently **4/5 distinct accepted cases**, and PR #1 remains OPEN / Draft. Execution requires separate explicit user authorization.
