# HYPE-V01 / P02-02 — observational Veles DCA editor mapping

**Opened:** 2026-11-11 (Europe/Moscow date).  
**Status:** `IN_PROGRESS / WAITING_FOR_USER_P02_SCREENSHOTS / NO_UI_READ / NO_FIELD_MAPPING / NO_TRADE_READY`.  
**Authority:** explicit user acceptance of P02-01; see `docs/v2/pilots/hype-v01-p02-01-acceptance.md`.  
**Scope:** read-only observation of user's actual Veles **DCA** editor. Do not treat screenshots of an active trade or a distinct GRID product as interchangeable.

## 1. Requested observations (redacted same-session images)

Please supply **screenshots** (or one readable multi-section PDF) of the same editor state, with the **observation date, local clock and timezone**. Screen content should show, only where exposed:

1. **Top/header:** Veles DCA identity, editor type `new_bot` or `edit_bot`, selected binding/exchange (Bybit), market (linear USDT perpetual if displayed), symbol HYPEUSDT, `Long/Short`, strategy mode `Простой/Свой/Сигнал`, margin mode and leverage if shown.
2. **Budget and IN section:** deposit and **unit**, first order settings; `Свой` mode all manual IN rows/offsets/volumes **with displayed units** or `Простой`/ `Сигнал` mode's **actual** alternative controls. Include upper/lower limits, errors and validation hints only if visible. **No edits necessary.**
3. **Entry filters:** the full expanded `Условия открытия сделки` controls including indicator/timeframe/logic only if actually present.
4. **Exits:** expanded TP, SL and conditional exit (including trailing/BE) sections if exposed; note unavailable settings as missing, not zero.
5. **Optional:** partial grid placement, pull-up, existing-position inclusion, preview warnings; screenshot only if already present. No backtest, bot creation, save, leverage or position-mode change.

If some UI section cannot be shown, state that fact without inventing values.

**Privacy first:** hide API keys, full account identifiers, email, subaccount ID/name, precise wallet balances, private positions and unrelated bots. Keep only nonsecret form labels, relevant market identity and nonsecret configuration values. Do not upload secrets, and do not commit private user screenshots to this public GitHub repository.

## 2. Processing once actual screenshots arrive

- G0 check observation timestamp, screenshot set, scope and redaction.
- G1 verify **DCA vs GRID**, platform/exchange identity, symbol, direction, selected mode; do not assume actual current Bybit position state.
- G2 map exactly visible P02 labels, chosen options, units, constraints. Keep unobserved/hidden features `UNVERIFIED`, and legacy doc-only labels `DOCUMENTED_ONLY`.
- G3 separate Veles budget from Bybit Equity, nominal, IM and quantity; never infer `Свой` row % denominator from name alone.
- G4 check entry filters/TP/SL semantics and distinction of buttons, preview and exchange execution.
- G5 preserve all known hard-risk vetoes; unverified account risk is not PASS.
- G6 produce read-only `P02-02` mapping with per-field evidence references, limitation list, independent self-review and explicit **new user acceptance request**.

**Required result record for every P02 entry:** `ui_label`, `observed_value`, `unit`, `visible_selected_mode`, `screenshot_ref`, `observed_at`, `source_ref`, `verified_status`, `form_key_if_verified` (null if unknown). Do not make it a live, validated `BotConfigurationProposal` until other prerequisites are met.

**Negative tests:** absent/mixed/outdated screenshots ⇒ `P02_INCONCLUSIVE`; known incompatible Spot/GRID mapping ⇒ `REJECTED` for a claimed DCA USDT perpetual handoff. No account/Mark/MMR/T02 ⇒ no `VERIFIED_FOR_MANUAL_REVIEW` even if P02 labels become known. No numeric entry/grid or stop values from the earlier synthetic HYPE-V01 fixture.

## 3. Current execution record (not a fabricated test run)

- Images: `NOT_RECEIVED`.
- UI field inspection: `NOT_RUN`.
- Mapping: `NOT_STARTED`.
- Runtime/source provenance: `NO_PRIVATE_UI_ACCESS`.
- Self-review for P02-02: `PENDING_ACTUAL_OUTPUT`.
- User acceptance of P02-02: `NOT_REQUESTED_YET`.
- Next event: user uploads redacted, same-session Veles DCA editor screenshots and observation timestamp.

**Do not create, save, update, test or run a trading bot; do not modify active agent, legacy branch or PR #1; no Stage 06 or v2 activation.**
