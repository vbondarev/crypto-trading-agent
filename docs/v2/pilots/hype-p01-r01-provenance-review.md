# HYPE-P01-R01 — immutable-answer custody and provenance assessment

**Assessment date:** 2026-11-10.
**Run ID:** `HYPE-P01-R01`.
**Status:** `FIRST_ANSWER_ARCHIVED / BYTES_VERIFIED / SESSION_PROVENANCE_UNVERIFIED / NO_OPERATIONAL_APPROVAL`.

## 1. First-answer custody (do not modify)
- Original input: user-supplied text file `Вставленный текст(5).txt` attached to the development conversation after the separate-session pilot.
- Canonical archive: `docs/v2/pilots/hype-p01-r01-first-answer-unaltered.txt`.
- Exact original size: **38,533 bytes**, UTF-8 with CRLF (last line has no terminal CRLF).
- SHA-256 original and archived bytes: `a1b53d520b68e0ecd1d538efec90ead598a7ba1e3916d863b57d116d24ad799f`.
- Git blob SHA computed from uploaded original bytes: `bd4a8cce0ee87a9b49e355883c84562358e1c39d`.
- GitHub re-fetch of archived file at archive commit `4fc791ed85a16db15e7de57e333defd823bf7e5e` yielded **the same Git blob SHA**: exact byte preservation confirmed.
- Do NOT append findings to the archived answer, repair broken image URLs/links, edit its formatting or re-score its history as an independent model trace. Any correction belongs in a separate document.

## 2. Independently verified policy identity
Pinned policy commit: `b7123d9cf19502bf4a890f1400027f30fa213434`.

All nine v2 mandatory paths in the first answer were independently fetched from the pinned commit in the review conversation and **all nine reported Git Blob SHAs matched GitHub** (9/9). All five listed legacy supporting paths exist at that commit.

This verifies document identity and that the reported hashes correspond to real Git objects. It **does not** independently prove the other session read each file, that auto-loading worked or that the four v2 Skills were invoked in the claimed order.

## 3. What the answer establishes, and what it cannot establish
- Attached response reports `GitHub Connector/fetch_file`, nine successful reads, 12 public source rows, a partial HYPE Coin Profile, uncomputed OHLCV indicators, `WAIT`, `Veles NOT_RECOMMENDED`, no credentials/orders.
- The user provided the response text, not an authenticated execution log, tool call IDs, original chat export, isolated chat metadata or timestamped API response bodies. These are **NOT_OBSERVED**, not silently inferred.
- Reports of public X/TG/Bybit/aggregator access remain **MODEL_REPORTED** except independent spot-checks. Matching source URLs or Git hashes cannot prove the actual historical tool calls.
- No exact Bybit closed-candle array, technical indicator calculation, complete P02 form, full T02 account, actual Cross MMR or F/A/H/R real stress results were supplied.
- User sharing this text is evidence of the text received, **not** a technical attestation of independent tool provenance.

## 4. Rubric and source-loading gate
- `P01-01 = INCONCLUSIVE`: policy hashes real; live read trace unavailable.
- Content and refusal behavior: `REVIEW_PASS_WITH_LIMITATIONS` (11/12 content criteria, subject to the previously recorded external fact sampling and missing tool trace).
- Definitive full separate-session pilot acceptance: **`PILOT_INCONCLUSIVE / INCONCLUSIVE_SOURCE_LOAD`** under the original HYPE-P01 rubric. No claim of `PILOT_PASS_WITH_LIMITATIONS` for the *technical execution* until source provenance is demonstrated.
- No critical fabricated source or trading action was established by the evidence reviewed. This is not proof that none occurred.
- Preserve R01 permanently; **R02 is a distinct run**, not a retrospective correction or relabeling.

## 5. Evidence that could upgrade provenance later
Preserve separately (without rewriting R01):
1. Exact original isolated-chat link/export or model/platform and run start/end with timezone.
2. Actual GitHub tool invocation evidence per path and fixed ref, including status, and original public URL/method/results where available.
3. Verifiable Bybit/market data timestamps and full raw response or original source URL, distinct from an LLM's self-report.
4. Explicit user attestation to whether the uploaded text is the unmodified first answer; record that as `USER_ATTESTED`, **not** `TECHNICALLY_VERIFIED`.

## 6. Isolation
Only new records on `feature/simplified-agent-v2`. Active legacy instructions, original seven Skills, default branch and Draft PR #1 remain out of scope. v2 not activated; Stage 06 not started.
