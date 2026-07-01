# Аккордеон в разделе «Опыт»

## Цель
Добавить раскрывающееся описание для каждого пункта опыта в разделе «Опыт», с кнопкой-триггером в стиле иконки смены темы (`.theme-toggle`).

## Данные
В `src/sections/experience.js`, массив `items`, каждому объекту добавляется поле:
- `description: string` — 2-3 предложения об обязанностях/достижениях на позиции.

## Разметка
Для каждого `exp-row`:
- Справа от `exp-period` добавляется кнопка `.exp-toggle` (44×44, border-radius 12px, фон `var(--btn-bg)`, border `1px solid var(--border)`), содержащая SVG chevron-down (`.exp-toggle-icon`, 18×18, `filter: var(--icon-filter)`).
- `exp-period` и `.exp-toggle` оборачиваются в `.exp-right` (flex, gap 16px).
- Сразу после `exp-row` — блок `.exp-details` с текстом `description` внутри `.exp-details-text`, изначально свёрнут.

## Поведение
- Вся строка `.exp-row` кликабельна (`cursor: pointer`).
- Клик по строке переключает класс `open` на паре `exp-row` + связанный `exp-details`.
- Аккордеон: открыт максимум один пункт одновременно — при открытии нового все остальные закрываются.
- Шеврон поворачивается на 180° (`transition: transform .3s`) когда строка открыта.
- `.exp-details` анимируется через `max-height`/`opacity` transition.
- При наведении на строку фон `.exp-toggle` подсвечивается (как `.theme-toggle:hover`).

## CSS (ориентировочно, в src/style.css рядом с `.exp-*`)
```css
.exp-row { cursor: pointer; }
.exp-right { display:flex; align-items:center; gap:16px; }
.exp-toggle { width:44px;height:44px;border-radius:12px;background:var(--btn-bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .3s; }
.exp-row:hover .exp-toggle { background: var(--border); }
.exp-toggle-icon { width:18px;height:18px;filter:var(--icon-filter);transition:transform .3s; }
.exp-row.open .exp-toggle-icon { transform: rotate(180deg); }
.exp-details { max-height:0; overflow:hidden; transition:max-height .35s ease, opacity .25s; opacity:0; }
.exp-details.open { max-height:200px; opacity:1; margin-top:16px; }
.exp-details-text { font-size:16px; color:var(--dim); line-height:1.6; }
```

## JS-логика
В `renderExperience`, после установки `innerHTML`, навесить обработчик клика на каждый `.exp-row`, переключающий класс `open` у строки и у соответствующего `.exp-details`, закрывая прочие открытые пары.

## Мобильная адаптация
Существующие мобильные правила для `.exp-row` (flex-direction: column) сохраняются; `.exp-toggle` остаётся видимым и кликабельным, `.exp-details` использует ту же логику.
