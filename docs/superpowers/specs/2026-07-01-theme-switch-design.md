# Свитч смены темы

## Цель
Заменить кнопку смены темы (`.theme-toggle`, сейчас 320×56px, иконка внутри скрыта `display:none`) на компактный свитч с динамическим текстовым лейблом, сохранив текущее поведение переключения темы (`main.js`, `data-theme`, `localStorage`).

## Layout
Кнопка `.theme-toggle` (320×56px, фон `rgba(255,255,255,0.02)`, `border-radius: var(--radius-btn)`, без `border`) содержит два дочерних элемента, расположенных по горизонтали:

```
[Тёмная тема / Светлая тема]              [ ⚪──○ ]
```

- Текст слева, вертикально центрирован.
- Свитч справа, `margin-left: auto` прижимает его к правому краю кнопки.

## Разметка
Заменить содержимое кнопки в `index.html` (сейчас строки 76-78):

```html
<button class="theme-toggle" id="themeToggle" aria-label="Сменить тему">
  <span class="theme-toggle-label" id="themeToggleLabel">Тёмная тема</span>
  <span class="theme-switch" id="themeSwitch" aria-hidden="true">
    <span class="theme-switch-thumb"></span>
  </span>
</button>
```

Старый `<img src="/assets/mode.svg" ... class="theme-toggle-icon" />` и класс `.theme-toggle-icon` в CSS удаляются полностью (больше не используются нигде в проекте).

## Состояния и цвета
Определяются атрибутом `data-theme` на `<html>` (уже существующий механизм):

- **Тёмная тема активна** (`data-theme="dark"` или отсутствует, т.к. `dark` — значение по умолчанию): свитч в состоянии ON, лейбл = `"Тёмная тема"`.
- **Светлая тема активна** (`data-theme="light"`): свитч в состоянии OFF, лейбл = `"Светлая тема"`.

Визуально ON/OFF задаётся классом `.theme-switch.on` на `#themeSwitch`, который выставляется/убирается в JS при клике (а не через CSS-селектор по `[data-theme]`, т.к. свитч отражает "включена тёмная тема", что не всегда совпадает по CSS-специфичности с текущими темами — проще управлять явным классом).

## Стили (`src/style.css`)

Удалить правило `.theme-toggle-icon` (сейчас `display: none;`, единственное использование — в этом же файле).

Добавить:

```css
.theme-toggle {
  justify-content: space-between;
  padding: 0 16px;
}

.theme-toggle-label {
  font-size: 16px;
  font-weight: 400;
  color: var(--white);
}

.theme-switch {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: var(--border);
  flex-shrink: 0;
  transition: background 0.3s;
}

.theme-switch.on {
  background: var(--dot-active);
}

.theme-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FFFFFF;
  transition: transform 0.3s;
}

.theme-switch.on .theme-switch-thumb {
  transform: translateX(20px);
}
```

`.theme-toggle` уже задаёт `display: flex; align-items: center;` — этого достаточно вместе с `justify-content: space-between` для нужного лейаута (текст слева, свитч справа, без явного `margin-left: auto` на свитче, т.к. `space-between` между двумя единственными детьми даёт тот же эффект).

## Поведение (`src/main.js`)

В существующем обработчике клика по `themeToggle` (сейчас переключает `data-theme` и transition-заглушку) добавить обновление лейбла и класса свитча:

```javascript
const themeToggle = document.getElementById('themeToggle')
const themeToggleLabel = document.getElementById('themeToggleLabel')
const themeSwitch = document.getElementById('themeSwitch')

function updateThemeToggleUI(theme) {
  const isDark = theme !== 'light'
  themeToggleLabel.textContent = isDark ? 'Тёмная тема' : 'Светлая тема'
  themeSwitch.classList.toggle('on', isDark)
}

if (themeToggle) {
  updateThemeToggleUI(document.documentElement.getAttribute('data-theme') || 'dark')

  themeToggle.addEventListener('click', () => {
    const prevTheme = document.documentElement.getAttribute('data-theme') || 'dark'
    const next = prevTheme === 'dark' ? 'light' : 'dark'
    const style = document.createElement('style')
    style.textContent = '* { transition: none !important; }'
    document.head.appendChild(style)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    updateThemeToggleUI(next)
    requestAnimationFrame(() => style.remove())
  })
}
```

`updateThemeToggleUI` вызывается один раз при инициализации (чтобы лейбл/свитч совпадали с темой, восстановленной из `localStorage` через инлайн-скрипт в `<head>` до рендера `main.js`), и повторно при каждом клике.

## Мобильная версия
Кнопка `.theme-toggle` скрыта на мобильном (`display: none` в существующей медиа-выборке) — есть отдельная `.theme-toggle--mobile`, которая не затрагивается этой спекой (вне её текущего скоупа — если понадобится такой же свитч в мобильной версии, это отдельная задача).

## Что не меняется
- Логика хранения темы (`localStorage`, атрибут `data-theme`) — без изменений.
- Файл `/assets/mode.svg` можно оставить в `public/assets` неиспользуемым (не участвует в новой разметке) — не удаляется, чтобы не трогать остальные ассеты вне скоупа задачи.

## Тестирование
Ручная проверка в браузере: клик по кнопке переключает тему, лейбл и положение/цвет ползунка синхронно обновляются; перезагрузка страницы после переключения показывает корректное стартовое состояние свитча (согласно `localStorage`); наведение/фокус не ломает анимацию.
