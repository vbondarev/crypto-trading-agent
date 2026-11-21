# Crypto Trading Agent v2

Агент оценивает состояние крипторынка, поведение монеты и направление тренда, оформляет вывод в Coin Profile и при достаточных данных готовит черновик настроек для Veles или GinArea.

## Текущий режим

**`V2_ACTIVE / SYNTHETIC_ONLY / NO_TRADE_READY`**

Агент поддерживает анализ синтетических данных, воспроизведение закреплённых исторических срезов и подготовку неисполняемых черновиков. Подключение реального счёта, размещение ордеров и запуск ботов требуют отдельной приёмки.

## Как начать работу с инструкциями

1. Открой новый сеанс Codex Cloud с доступом к репозиторию `vbondarev/crypto-trading-agent` на ветке `feature/simplified-agent-v2` до слияния v2 или на `main` после слияния.
2. Попроси агента явно прочитать [AGENTS.md](AGENTS.md), зафиксировать SHA коммита и читать остальные инструкции с того же коммита.
3. Укажи биржу, инструмент, горизонт анализа и приложи синтетические данные или закреплённый исторический срез с временем UTC. Для черновика добавь название платформы и тип бота.

> Прочитай `AGENTS.md` репозитория `vbondarev/crypto-trading-agent` из `feature/simplified-agent-v2` до слияния v2 или из `main` после слияния и зафиксируй коммит. По приложенным синтетическим данным оцени рынок и HYPEUSDT (Bybit USDT Perpetual, горизонт 1–3 дня). Составь Coin Profile. Если данных достаточно, добавь черновик Veles SIMPLE. Укажи SHA, прочитанные инструкции и недостающие данные.

## Документация

- [Порядок анализа](docs/v2/analytical-workflow.md).
- [Правила подготовки и передачи черновика](docs/v2/bot-handoff-policy.md).
- [Проверенный порядок запуска и протокол приёмки v2](docs/v2/pilots/stage-09-portfolio-risk-verification.md#шаг-3-инструкция-аналитического-выпуска-v2).

Не публикуй в репозитории API-ключи, пароли, снимки счёта и реальные торговые отчёты.

## Разработка и испытания

Для разработки и проверок v2 используй Python. Команды выполняются из корня репозитория.

```powershell
python -m pip install -r tests/v2/requirements.txt
python tests/v2/workflow_smoke.py
python tests/v2/pilots/test_stage09_portfolio_risk.py
```

[Итоги этапа 06 v2](docs/v2/stage-06-closeout.md), [история первоначального MVP](docs/development-roadmap.md) и [предыдущая редакция README](https://github.com/vbondarev/crypto-trading-agent/blob/c724f7f066e130ccc2257f85e4330497a61c7b21/README.md).

Архив прежних JS-скриптов и тестовых данных доступен в [снимке `b554dd9`](https://github.com/vbondarev/crypto-trading-agent/tree/b554dd967a6a83ba85f0c1c95484e2c4f48c9670).

## Лицензия

[Apache License 2.0](LICENSE).
