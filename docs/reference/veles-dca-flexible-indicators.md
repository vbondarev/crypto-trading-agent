# Гибкие индикаторы Veles DCA

Справочник описывает конструктор условий для Veles DCA в сценариях Bybit USDT Perpetual. Официальная справка прочитана 23.11.2026. Наличие конкретных настроек у выбранной пары и поведение сигналов на реальном счёте требуют самостоятельного подтверждения.

## Вкладка и область настройки

**«Гибкие индикаторы»** — вкладка конструктора фильтров. Режим торговли «Простой / Свой / Сигнал» задаёт ордера отдельно. Согласно подписи в наблюдавшейся форме, вкладка индикаторов общая для входа, ордеров и выхода. Публичная справка Veles описывает переход со стандартных индикаторов на гибкие в одну сторону и советует экспериментировать на копии бота. Из двух видимых вкладок нельзя вывести возможность обратного перехода или сохранение заполненных условий при переключении. [Гибкие индикаторы](https://help.veles.finance/ru/platform/settings/flexible-indicators/) · [Режим торговли](https://help.veles.finance/ru/platform/settings/trading-mode/) · [Простые индикаторы](veles-dca-simple-indicators.md)

## Из чего состоит условие

Обычная строка содержит **Аргумент 1**, **оператор** и **Аргумент 2**. Внутри группы требуется совпадение всех условий (**И**). Между группами достаточно истинности одной группы (**ИЛИ**). Например, `(A И B) ИЛИ C`. Разнесённые по группам пробой и ретест могли бы разрешить вход каждый по отдельности. Порядок строк и групп сам по себе не задаёт хронологию. [Конструктор Veles](https://help.veles.finance/ru/platform/settings/flexible-indicators/#как-работает)

### Выпадающий список фильтров

В разделе «Условия открытия сделки» список открывается по имени выбранного аргумента. В нём можно найти готовое сравнение, выбрать значение для своего сравнения или добавить самостоятельный сигнал. Конкретный пункт и его параметры в черновике указывай с источником. Для шаблона отдельно называй оператор и направление пересечения.

| Пункт или вкладка | Что подтверждает официальная справка | Что видно на предоставленном скриншоте |
|---|---|---|
| **Все** | В справке описаны типы доступных фильтров и аргументов. Полного списка этой вкладки и порядка элементов в прочитанных статьях нет. | Активная вкладка «Все» и поле «Поиск». |
| **Шаблоны** | Встроенные условия. Справка отсылает к редактору за подробностями о доступных шаблонах. [Гибкие индикаторы](https://help.veles.finance/ru/platform/settings/flexible-indicators/#типы-аргументов) | Верхние четыре карточки показывают аргументы, пороги и стрелку пересечения. Их значения приведены ниже. |
| **Индикаторы** | Числовые значения для сравнения с другим индикатором, константой или значением со сдвигом. Документированы, например, Candle, полосы Боллинджера, RSI, MFI и CCI. Интервал, период, длина и коэффициенты зависят от выбранного аргумента. [Candle](https://help.veles.finance/ru/filters/candle/) · [Полосы Боллинджера](https://help.veles.finance/ru/filters/bb/) · [Каталог Veles](https://veles.finance/ru/best-crypto-trading-bots/) | Вкладка «Индикаторы». В поле открытого списка выбран `Bollinger Bands (Upper)`. Содержимое вкладки на скриншоте не раскрыто. |
| **Сигналы** | Самостоятельные условия. Для такого пункта второй аргумент не заполняется. [Типы аргументов](https://help.veles.finance/ru/platform/settings/flexible-indicators/#типы-аргументов) | Название вкладки. Отдельные сигналы не показаны. |
| **TradingView** | Подключаемые внешние сигналы и стратегии. Наличие этого типа в справке не подтверждает доставку конкретного сигнала. [TradingView](https://help.veles.finance/ru/filters/tradingview/) | Название вкладки. Источники и настройки подключения не показаны. |
| **Другие** | Справка прямо помещает сюда **«Константу»**. Это фиксированное число. Для ценового порога XRPUSDT единица сравнения — USDT. [Типы аргументов](https://help.veles.finance/ru/platform/settings/flexible-indicators/#типы-аргументов) · [Константа](https://help.veles.finance/ru/filters/constant/) | Правая часть меню обрезана. Видно начало подписи «Др…». |

**Партнёрские сигналы.** Общая статья перечисляет сигналы из маркетплейса среди источников. Отдельная статья о подписках уточняет, что при активных «Гибких индикаторах» подписочные пункты скрыты в списке редактора. Описанный Veles порядок — добавить подписочный сигнал в стандартном режиме, затем при необходимости переключиться на гибкий. [Типы аргументов](https://help.veles.finance/ru/platform/settings/flexible-indicators/#типы-аргументов) · [Сигналы по подписке](https://help.veles.finance/ru/filters/subscription/#где-найти-сигналы-в-боте)

**Временные условия.** «Час дня» и «День недели» документированы для гибкого режима. Их можно сравнить с константой и включить в группы И/ИЛИ. Расчёт идёт по UTC. Точное расположение этих пунктов по вкладкам на скриншоте не показано. [Расписание](https://help.veles.finance/ru/filters/schedule/#гибкие-индикаторы)

#### Шаблоны, видимые на скриншоте

В таблице приведены видимые значения конкретных карточек. Они не устанавливают универсальные настройки для любого направления или всех версий редактора. Справка описывает соответствующие индикаторы, характерные уровни и направление пересечения. Полный поимённый список шаблонов именно этого меню в прочитанных статьях не найден.

| Подпись карточки | Сравнение, видимое на скриншоте | Что подтверждает справка |
|---|---|---|
| **RSI - уровни** | `RSI (14)` и `Константа (70)`, стрелка вниз | Стандартный период 14. Для варианта «Уровни RSI» описано нисходящее пересечение 70 и восходящее пересечение 30. [RSI](https://help.veles.finance/ru/filters/rsi/) |
| **MFI - уровни** | `MFI (14)` и `Константа (80)`, стрелка вниз | Уровни 20 и 80. Возврат из зоны выше 80 описан для Short, возврат снизу через 20 — для Long. [MFI](https://help.veles.finance/ru/filters/mfi/) |
| **MFI пересечение середины диапазона** | `MFI (14)` и `Константа (50)`, стрелка вниз | Середина диапазона — 50. Справка различает восходящее и нисходящее пересечения этого уровня. [MFI](https://help.veles.finance/ru/filters/mfi/) |
| **CCI - уровни** | `CCI (20)` и `Константа (100)`, стрелка вниз | Стандартный период 20. Для «Уровней CCI» описано нисходящее пересечение +100 и восходящее пересечение −100. [CCI](https://help.veles.finance/ru/filters/cci/) |

### Операторы сравнения

| Оператор | Что проверяет |
|---|---|
| «Больше» / «Меньше» | Строгое сравнение двух значений. Условие может выполняться на нескольких свечах подряд. |
| «Пересекает вверх» / «Пересекает вниз» | Переход через границу. Правило сравнения при равенстве на предыдущем или текущем баре для конкретного случая требует подтверждения. |

В перечне операторов Veles отдельные `≤` и `≥` не приведены. Для ряда с подтверждённым шагом цены `tick` условие `Low ≤ L` математически равно `Low < L + tick`, если уровень и все значения ряда лежат на одной ценовой сетке и константа сохраняет нужную точность. При непроверенной точности или другом источнике цен такое отображение остаётся гипотезой. Оператор пересечения сам по себе не воспроизводит касание минимума с возвратом на закрытии той же свечи. [Операторы Veles](https://help.veles.finance/ru/platform/settings/flexible-indicators/#операторы-сравнения)

## Каталог фильтров гибкого режима

Проверены 49 отдельных статей из раздела Veles «Фильтры и индикаторы». В перечне ниже наличие в гибком режиме подтверждает профильная статья или справка о конструкторе. Названия приведены по документации. Когда статья описывает реализацию, но не приводит точное написание пункта или его вкладку, это отдельно отмечено. Полного снимка актуального селектора у конкретного бота эти сведения не дают. [Указатель статей](https://help.veles.finance/ru/filters/general/) · [Гибкие индикаторы](https://help.veles.finance/ru/platform/settings/flexible-indicators/)

### Подтверждённые позиции и варианты

| Позиция или группа | Что подтверждено для гибкого режима | Источники Veles |
|---|---|---|
| Скользящие средние | EMA, SMA, WMA, SMMA, ALMA, Hull MA, Hull Volume MA, LSMA, VWMA, Ehlers SuperSmoother. | [EMA](https://help.veles.finance/ru/filters/ema/) · [SMA](https://help.veles.finance/ru/filters/sma/) · [WMA](https://help.veles.finance/ru/filters/wma/) · [SMMA](https://help.veles.finance/ru/filters/smma/) · [ALMA](https://help.veles.finance/ru/filters/alma/) · [Hull MA](https://help.veles.finance/ru/filters/hma/) · [Hull Volume MA](https://help.veles.finance/ru/filters/hma-volume/) · [LSMA](https://help.veles.finance/ru/filters/lsma/) · [VWMA](https://help.veles.finance/ru/filters/vwma/) · [SuperSmoother](https://help.veles.finance/ru/filters/ehlers-supersmoother/) |
| Канальные аргументы | **Bollinger Bands**, **Keltner Channel**, **Mean Reversion Channel** и **Turtle Zone**. У каждого подтверждены **Lower**, **Middle**, **Upper**. | [Bollinger Bands](https://help.veles.finance/ru/filters/bb/) · [Keltner Channel](https://help.veles.finance/ru/filters/kc/) · [Mean Reversion Channel](https://help.veles.finance/ru/filters/mrc/) · [Turtle Zone](https://help.veles.finance/ru/filters/turtlezone/) |
| Другие трендовые аргументы | Donchian Channel, SuperTrend и Parabolic SAR. Для Donchian в пилоте проекта наблюдался пункт `Donchian Channel (Lower)`. | [Donchian Channel](https://help.veles.finance/ru/filters/dc/) · [SuperTrend](https://help.veles.finance/ru/filters/supertrend/) · [Parabolic SAR](https://help.veles.finance/ru/filters/psar/) · [Наблюдение редактора](../v2/pilots/stage-09-portfolio-risk-verification.md#проверка-конструктора-гибких-индикаторов) |
| **Ichimoku Cloud** | Числовые аргументы **Senkou Span A**, **Senkou Span B**, **Tenkan-sen** (`Conversion Line`) и **Kijun-sen** (`Base Line`). Также документированы сигналы **«Прорыв Kumo»**, **«Изменение цвета»** и **«Пересечение Tenkan и Kijun»**. | [Ichimoku Cloud](https://help.veles.finance/ru/filters/ichimoku-cloud/) |
| Осцилляторы и импульс | RSI, Connors RSI, CCI, MFI, Williams %R, Awesome Oscillator, Chaikin Oscillator, Chande Momentum Oscillator, Balance of Power и Rate of Change. | [RSI](https://help.veles.finance/ru/filters/rsi/) · [Connors RSI](https://help.veles.finance/ru/filters/crsi/) · [CCI](https://help.veles.finance/ru/filters/cci/) · [MFI](https://help.veles.finance/ru/filters/mfi/) · [Williams %R](https://help.veles.finance/ru/filters/williams-r/) · [Awesome Oscillator](https://help.veles.finance/ru/filters/awesome/) · [Chaikin](https://help.veles.finance/ru/filters/chaikin/) · [CMO](https://help.veles.finance/ru/filters/cmo/) · [Balance of Power](https://help.veles.finance/ru/filters/bop/) · [RoC](https://help.veles.finance/ru/filters/roc/) |
| Раздельные линии осцилляторов | **Stochastic RSI (%K)**, **Stochastic RSI (%D)**, **Stochastic (%K)** и **Stochastic (%D)**. | [Stochastic RSI](https://help.veles.finance/ru/filters/srsi/) · [Stochastic](https://help.veles.finance/ru/filters/stochastic/) |
| Сила тренда, волатильность и линии MACD | ADX, ATR, ATR%, Relative Volatility Index (RVI), **Vortex (+)** и **Vortex (−)**, **MACD**, **MACD (Signal)** и **MACD (Trend)**. | [ADX](https://help.veles.finance/ru/filters/adx/) · [ATR и ATR%](https://help.veles.finance/ru/filters/atr/) · [RVI](https://help.veles.finance/ru/filters/rvi/) · [Vortex](https://help.veles.finance/ru/filters/vortex/) · [MACD](https://help.veles.finance/ru/filters/macd/) |
| Свечи и объём | **Candle** с источниками `OPEN`, `HIGH`, `LOW`, `CLOSE`, `VOLUME`. **Nominal Volume** — оборот в валюте котировки. **Volume Spike Detector** — отдельный фильтр, для которого статья описывает настройки гибкого режима. | [Candle](https://help.veles.finance/ru/filters/candle/) · [Объём](https://help.veles.finance/ru/filters/volume/) · [Volume Spike Detector](https://help.veles.finance/ru/filters/volume-spike/) |
| Сигналы по свечам и объёму | Three Candles, Candles Trend, SrgArt DiverX и Liquidation Heatmap. В гибком режиме для них документировано направление `Buy` или `Sell`. | [Three Candles](https://help.veles.finance/ru/filters/3s/) · [Candles Trend](https://help.veles.finance/ru/filters/candles/) · [SrgArt DiverX](https://help.veles.finance/ru/filters/srgart-diverx/) · [Liquidation Heatmap](https://help.veles.finance/ru/filters/liquidation-heatmap/) |
| **VuManChu** | Три самостоятельных сигнала — **VMC Wave Trend**, **VMC Divergence**, **VMC Money Flow**. | [VuManChu](https://help.veles.finance/ru/filters/vumanchu/) |
| Расписание и константа | День недели, час дня и день месяца в UTC. **«Другие → Константа»** задаёт фиксированное число для сравнения. | [Расписание](https://help.veles.finance/ru/filters/schedule/) · [Константа](https://help.veles.finance/ru/filters/constant/) · [Типы аргументов](https://help.veles.finance/ru/platform/settings/flexible-indicators/#типы-аргументов) |
| **TradingView** | Сигнал TradingView и стратегия TradingView. Оба источника требуют настройки подключения. | [TradingView](https://help.veles.finance/ru/filters/tradingview/) · [Типы аргументов](https://help.veles.finance/ru/platform/settings/flexible-indicators/#типы-аргументов) |

### Эквиваленты условий из общего каталога

| Условие | Как его задаёт справка для гибкого режима | Источник Veles |
|---|---|---|
| «Цена» | `Candle → CLOSE` с константой. Для аналога минутного фильтра «Цена» статья использует интервал 1 минута. Candle позволяет выбрать другой доступный интервал. | [Цена](https://help.veles.finance/ru/filters/price/) |
| «Процент изменения цены» | Rate of Change и константа. Справка указывает период `1` для базового варианта и `N+1` для варианта за N свечей. Это сопоставление относится к реализации, описанной Veles. | [Процент изменения цены](https://help.veles.finance/ru/filters/ppc/) |
| Базовый объём | `Candle → VOLUME` для объёма в единицах базового актива. Для оборота в котируемой валюте используется `Nominal Volume`. | [Фильтр объёма](https://help.veles.finance/ru/filters/volume/) |

### Спорные и неполные позиции

| Позиция | Что остаётся уточнить | Источники |
|---|---|---|
| **Ichimoku Lagging Span** | Раздел о гибких компонентах поимённо описывает четыре линии. `Lagging Span` упомянут в сводке настроек периода и в общем описании. Наличие отдельного пункта селектора по этой статье однозначно не установлено. | [Ichimoku Cloud](https://help.veles.finance/ru/filters/ichimoku-cloud/) |
| **Bollinger Bands Width (BBW)** | Статья подтверждает отдельный фильтр в селекторе условий и описывает его настройки. Вкладка и наличие BBW именно в гибком селекторе отдельно не указаны. | [BBW](https://help.veles.finance/ru/filters/bb/#ширина-полос-боллинджера-bbw) |
| **Donchian Channel (Upper / Middle)** | Справка описывает верхнюю и среднюю линии канала и гибкий режим в целом. В пилоте редактора подтверждён `Donchian Channel (Lower)`. Для двух остальных линий точные отдельные названия в селекторе не подтверждены. | [Donchian Channel](https://help.veles.finance/ru/filters/dc/) · [Наблюдение редактора](../v2/pilots/stage-09-portfolio-risk-verification.md#проверка-конструктора-гибких-индикаторов) |
| **Volume Spike Detector** | Применение в гибком режиме документировано. Профильная статья не уточняет названия вкладки селектора и наличие второго аргумента для этого пункта. | [Volume Spike Detector](https://help.veles.finance/ru/filters/volume-spike/) |
| **Партнёрские сигналы** | Общая справка перечисляет этот тип. Профильная статья указывает, что подписочные сигналы скрыты из списка уже включённого гибкого режима. Для добавления сервис описывает переход из стандартного режима. | [Типы аргументов](https://help.veles.finance/ru/platform/settings/flexible-indicators/#типы-аргументов) · [Сигналы по подписке](https://help.veles.finance/ru/filters/subscription/) |
| **Полный перечень шаблонов** | Четыре карточки описаны в [наблюдениях по скриншоту](#шаблоны-видимые-на-скриншоте). Справка по автоподбору публикует 34 варианта для своего инструмента. Состав вкладки «Шаблоны» и соответствие этих вариантов отдельным карточкам редактора там не указаны. | [Гибкие индикаторы](https://help.veles.finance/ru/platform/settings/flexible-indicators/) · [Подбор индикаторов](https://help.veles.finance/ru/platform/settings/indicator-selection/) |

## Свечи, интервалы и момент сигнала

- **Candle** предоставляет `Open`, `High`, `Low`, `Close` и `Volume`. Для ретеста сверяй `Low` и `Close` одной и той же свечи с одинаковыми интервалом, методом и сдвигом.
- **На закрытии бара** значение рассчитывается по закрытой свече. Для стратегии на закрытиях используй этот метод. Сдвиг `0` читает свечу, на которой считается сигнал, а `1` — предыдущую свечу этого интервала. Сдвиг не является таймером от произвольного события. Для смешанных интервалов отдельно проверяй, какие свечи конструктор сопоставляет в общем закрытии и на следующих барах.
- **Раз в минуту** проверяет условия внутри формирующейся свечи. Значения со сдвигом `0` могут измениться до конца интервала. Описанная Veles модель бэктеста поддерживает фильтры на закрытии бара. Метка сигнала и цена фактического исполнения проверяются отдельно.
- **Интервал** определяет длительность свечи. **Период** задаёт число свечей для вычисления индикатора. «Мои интервалы» позволяет добавлять пользовательские таймфреймы, но их наличие не доказывает выравнивание различных серий или сохранение сигнала старшего интервала.

[Candle и сдвиги](https://help.veles.finance/ru/filters/candle/) · [Фильтры и методы расчёта](https://help.veles.finance/ru/filters/general/) · [Мои интервалы](https://help.veles.finance/ru/platform/settings/custom-timeframes/) · [Бэктесты](https://help.veles.finance/ru/platform/components/backtests/)

## Разбор запроса агентом

1. Зафиксируй сторону, пару, цель условия и выбранную вкладку. Для каждой строки покажи группу, оба аргумента, источник значения, интервал, метод, сдвиг, оператор, число и его единицу по применимости. Для самостоятельных сигналов второй аргумент отсутствует.
2. Для последовательного входа сначала сформулируй правило вне редактора. Укажи, какое событие открывает ожидание, какие свечи после него допустимы и что сбрасывает сценарий. Добавляй срок только если он входит в стратегию. Затем сравни это правило с тем, что подтверждено в Veles.
3. Фильтры на 4ч и 1ч с общей константой описывают отдельные проверки. Для автоматического входа после ретеста нужно подтвердить, что используемая 1ч свеча относится к периоду после конкретного закрытия 4ч и что промежуточное нарушение отменяет сигнал. Сдвиги или дополнительные группы могут быть гипотезой для ограниченного набора свечей. Подтверждай её сравнением меток с эталонным правилом на положительных и отрицательных примерах.
4. Когда документация описывает отдельные поля, помечай их как документированные. Совместимость полной последовательности отмечай отдельно. Если она не подтверждена, покажи ручную проверку закрытых свечей или условия воспроизведения в предпросмотре либо бэктесте. При рыночном `WAIT` сохраняй `NOT_RECOMMENDED` без числовой конфигурации запуска.

[Контрольный разбор XRPUSDT](../v2/pilots/xrpusdt-veles-flexible-entry-review.md) · [Предыдущая проверка смешанных интервалов](../v2/pilots/stage-09-portfolio-risk-verification.md#проверка-конструктора-гибких-индикаторов)
