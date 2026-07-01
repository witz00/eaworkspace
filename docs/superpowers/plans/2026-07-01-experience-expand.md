# Раскрывающийся список в разделе «Опыт» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an independent expand/collapse toggle to each item in the Experience section, revealing duties/achievements text, styled to match the existing `.theme-toggle` button.

**Architecture:** `src/sections/experience.js` gains `duties`/`achievements` fields per item and renders each item as a wrapper (`.exp-item`) containing the existing `.exp-row` plus a new toggle button and a collapsible `.exp-details` panel. A small click handler (attached once, via event delegation on the container) toggles an `.open` class per item. CSS handles the visual toggle button (matching `.theme-toggle`) and the collapse animation via `grid-template-rows: 0fr → 1fr` (no fixed max-height, no JS height calculation).

**Tech Stack:** Vanilla JS (ES modules), vanilla CSS custom properties, Vite dev server. No test framework in this repo — verification is manual via `npm run dev` + browser check at the end of each task.

## Global Constraints

- No test framework exists (`package.json` has no test script) — do not add one; verify manually in the browser per task.
- Match existing `.theme-toggle` button styling exactly: 44×44px, `border-radius: 12px`, `background: var(--btn-bg)`, `border: 1px solid var(--border)`, icon 20×20 with `filter: var(--icon-filter)`.
- Icon asset already copied to `assets/arrow-left.svg` (stroke `#636363`, viewBox 0 0 24 24, arrow pointing left).
- Each experience item expands/collapses **independently** (not an accordion — opening one does not close others).
- Follow existing code style in `src/sections/experience.js` (template literals, `.map().join('')`) and `src/style.css` (section comment headers like `/* ── Experience section ── */`).
- Content for both items (Study Kvo., UPROCK School) is final text, given below verbatim — no placeholders.

---

### Task 1: Add data fields and render the toggle button + details panel

**Files:**
- Modify: `src/sections/experience.js` (full rewrite of the `items` array and `renderExperience` template)

**Interfaces:**
- Produces: DOM structure `.exp-item[data-exp]` > `.exp-row` (existing) + `.exp-toggle` (button) + `.exp-details` (panel with `.exp-duties` paragraph and `.exp-achievements` list). No JS behavior yet — this task is pure markup/data.

- [ ] **Step 1: Replace `items` array with duties/achievements data**

Edit `src/sections/experience.js` lines 1-14, replacing the `items` array:

```javascript
const items = [
  {
    company: 'Study Kvo.',
    role: 'Дизайнер интерфейсов',
    period: 'март 2024 — сентябрь 2024',
    logo: '/assets/logo-studykvo.jpg',
    duties: 'Работал над созданием концепта мобильного приложения стоматологической клиники. Основной задачей было спроектировать интуитивно понятный интерфейс (MVP) с нуля, учитывая современные стандарты доступности.',
    achievements: [
      'Спроектировал информационную архитектуру (ИА), что позволило сократить путь пользователя до целевого действия.',
      'Разработал дизайн-систему, обеспечив единство стиля и высокую скорость сборки макетов.',
      'Сформировал две прото-персоны и на основе их потребностей адаптировал интерфейс, сделав его максимально удобным для целевой аудитории.',
    ],
  },
  {
    company: 'UPROCK School',
    role: 'С 0 до Middle+',
    period: 'март 2025 — май 2026',
    logo: '/assets/logo-uprock.png',
    duties: 'Работаю над полноценным проектом концепта мобильного приложения бронирование и оформление авиабилетов (подобие Aviasales). Основной задачей является спроектировать приложение с 50+ экранами, проработать сценарий и протестировать на реальных пользователях.',
    achievements: [
      'Провел конкурентный анализ и глубинные интервью с целевой аудиторией.',
      'Разработал интерактивный функциональный Lo-Fi прототип.',
      'Исследовал визуальную концепцию и спроектировал MVP-версию приложения.',
      'Разработал дизайн-систему, обеспечив единство стиля и высокую скорость сборки макетов.',
      'Подготовил прототип с переходами между экранами.',
    ],
  },
]
```

- [ ] **Step 2: Rewrite `renderExperience` to include toggle button and details panel**

Replace lines 16-38 (the `renderExperience` function) with:

```javascript
export function renderExperience(container) {
  container.innerHTML = `
    <div class="content-area">
      <span class="section-label">Опыт</span>
      <div class="exp-list">
        ${items.map((item, i) => `
          <div class="exp-item" data-exp="${i}">
            <div class="exp-row">
              <div class="exp-left">
                <div class="exp-logo">
                  ${item.logo ? `<img src="${item.logo}" alt="${item.company}" />` : ''}
                </div>
                <div class="exp-info">
                  <span class="exp-company">${item.company}</span>
                  <span class="exp-role">${item.role}</span>
                </div>
              </div>
              <span class="exp-period">${item.period}</span>
              <button class="exp-toggle" type="button" aria-expanded="false" aria-label="Показать подробности">
                <img src="/assets/arrow-left.svg" alt="" class="exp-toggle-icon" />
              </button>
            </div>
            <div class="exp-details">
              <div class="exp-details-inner">
                <p class="exp-duties">${item.duties}</p>
                <ul class="exp-achievements">
                  ${item.achievements.map(a => `<li>${a}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}
```

- [ ] **Step 3: Verify markup renders without errors**

Run: `npm run dev` (from `C:\Claude-Projects\portfolio v2`), open the printed local URL in a browser, navigate to the Experience section.
Expected: Both experience rows render exactly as before (toggle button appears as an unstyled button with a tiny broken/plain icon next to the period — this is expected since CSS/behavior come in later tasks). No console errors.

- [ ] **Step 4: Commit**

```bash
git add "src/sections/experience.js"
git commit -m "feat: add duties/achievements data and expand markup to experience items"
```

---

### Task 2: Style the toggle button and layout to match `.theme-toggle`

**Files:**
- Modify: `src/style.css` (Experience section, starting at the `/* ── Experience section ── */` comment, currently around line 682)

**Interfaces:**
- Consumes: DOM classes from Task 1 (`.exp-item`, `.exp-row`, `.exp-toggle`, `.exp-toggle-icon`, `.exp-details`, `.exp-details-inner`, `.exp-duties`, `.exp-achievements`).
- Produces: Visual styling only. No `.open` behavior yet (that's Task 3) — the panel is visually collapsed by default via `grid-template-rows: 0fr`.

- [ ] **Step 1: Update `.exp-list` gap and add `.exp-item` wrapper styles**

In `src/style.css`, find the existing block:

```css
/* ── Experience section ── */
.exp-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.exp-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

Replace it with:

```css
/* ── Experience section ── */
.exp-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exp-item {
  display: flex;
  flex-direction: column;
}

.exp-item + .exp-item {
  margin-top: 32px;
}

.exp-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
```

- [ ] **Step 2: Add toggle button styles (matching `.theme-toggle`)**

After the `.exp-period` block (currently ending around line 747, right before the trailing blank line at the end of the file), add:

```css
.exp-toggle {
  background: var(--btn-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.5s;
}

.exp-toggle:hover { background: var(--border); }

.exp-toggle-icon {
  width: 20px;
  height: 20px;
  filter: var(--icon-filter);
  transform: rotate(-90deg);
  transition: transform 0.3s;
}

.exp-item.open .exp-toggle-icon {
  transform: rotate(90deg);
}
```

- [ ] **Step 3: Add collapsible details panel styles (grid-based, no JS height calc)**

Immediately after the toggle styles from Step 2, add:

```css
.exp-details {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.exp-item.open .exp-details {
  grid-template-rows: 1fr;
}

.exp-details-inner {
  overflow: hidden;
  min-height: 0;
}

.exp-duties {
  padding-top: 20px;
  font-size: 18px;
  line-height: 1.6;
  color: var(--body-text);
}

.exp-achievements {
  margin-top: 12px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exp-achievements li {
  font-size: 18px;
  line-height: 1.6;
  color: var(--body-text);
}
```

- [ ] **Step 4: Add mobile adjustments**

Find the mobile media query block (around line 932-939):

```css
  /* ── Experience ── */
  .exp-list { gap: 24px; }
  .exp-row  { flex-direction: column; align-items: flex-start; gap: 8px; }
  .exp-left { gap: 14px; }
  .exp-logo { width: 48px; height: 48px; }
  .exp-company { font-size: 18px; }
  .exp-role    { font-size: 15px; }
```

Replace with (adds toggle positioning for the column layout, and slightly smaller detail text):

```css
  /* ── Experience ── */
  .exp-list { gap: 24px; }
  .exp-item + .exp-item { margin-top: 24px; }
  .exp-row  { flex-direction: column; align-items: flex-start; gap: 8px; position: relative; }
  .exp-left { gap: 14px; }
  .exp-logo { width: 48px; height: 48px; }
  .exp-company { font-size: 18px; }
  .exp-role    { font-size: 15px; }
  .exp-toggle  { position: absolute; top: 0; right: 0; }
  .exp-duties, .exp-achievements li { font-size: 15px; }
```

Note: `.exp-period` already has `font-size: 14px; white-space: normal;` from the existing mobile block below (line ~939) — leave that line as-is, it's outside the range being replaced.

- [ ] **Step 5: Verify styling in the browser**

Run: `npm run dev`, open the browser, go to Experience section.
Expected: Toggle button looks visually identical in style to the theme-toggle button (rounded square, dark background, border). Icon points down by default. Details panel is invisible/collapsed (0 height) since no `.open` class exists yet. Resize to mobile width (< 768px, check the breakpoint value used in the existing media query) and confirm the toggle sits top-right of the row without overlapping text.

- [ ] **Step 6: Commit**

```bash
git add "src/style.css"
git commit -m "style: add toggle button and collapsible panel styles to experience items"
```

---

### Task 3: Wire up independent expand/collapse behavior

**Files:**
- Modify: `src/sections/experience.js` (add a click handler inside `renderExperience`)

**Interfaces:**
- Consumes: `.exp-item`, `.exp-toggle` classes from Task 1; `.exp-item.open` CSS state from Task 2.
- Produces: Working toggle behavior. No other module depends on this.

- [ ] **Step 1: Add event delegation for the toggle buttons**

In `src/sections/experience.js`, after the `container.innerHTML = ...` assignment inside `renderExperience` (i.e., right before the closing `}` of the function), add:

```javascript
  container.querySelectorAll('.exp-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.exp-item')
      const isOpen = item.classList.toggle('open')
      btn.setAttribute('aria-expanded', String(isOpen))
    })
  })
```

The full function should now read:

```javascript
export function renderExperience(container) {
  container.innerHTML = `
    <div class="content-area">
      <span class="section-label">Опыт</span>
      <div class="exp-list">
        ${items.map((item, i) => `
          <div class="exp-item" data-exp="${i}">
            <div class="exp-row">
              <div class="exp-left">
                <div class="exp-logo">
                  ${item.logo ? `<img src="${item.logo}" alt="${item.company}" />` : ''}
                </div>
                <div class="exp-info">
                  <span class="exp-company">${item.company}</span>
                  <span class="exp-role">${item.role}</span>
                </div>
              </div>
              <span class="exp-period">${item.period}</span>
              <button class="exp-toggle" type="button" aria-expanded="false" aria-label="Показать подробности">
                <img src="/assets/arrow-left.svg" alt="" class="exp-toggle-icon" />
              </button>
            </div>
            <div class="exp-details">
              <div class="exp-details-inner">
                <p class="exp-duties">${item.duties}</p>
                <ul class="exp-achievements">
                  ${item.achievements.map(a => `<li>${a}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `

  container.querySelectorAll('.exp-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.exp-item')
      const isOpen = item.classList.toggle('open')
      btn.setAttribute('aria-expanded', String(isOpen))
    })
  })
}
```

- [ ] **Step 2: Verify independent toggle behavior in the browser**

Run: `npm run dev`, open the Experience section in the browser.
Manually check:
1. Click the toggle on "Study Kvo." — panel expands smoothly, icon rotates to point up, text shows the correct duties/achievements.
2. Click the toggle on "UPROCK School" while Study Kvo. is still open — both are open simultaneously (confirms independence, not an accordion).
3. Click the Study Kvo. toggle again — it collapses, UPROCK stays open.
4. Reload the page — both start collapsed.
Expected: All four checks pass with no console errors.

- [ ] **Step 3: Commit**

```bash
git add "src/sections/experience.js"
git commit -m "feat: wire up independent expand/collapse behavior for experience items"
```

---

## Final Verification

- [ ] Run `npm run dev`, navigate through Experience section on both desktop and mobile widths (resize browser or use device toolbar), confirm:
  - Toggle button visually matches `.theme-toggle` (same background/border/radius/icon size)
  - Both items expand/collapse independently
  - Text content matches the spec verbatim for both companies
  - No layout shift/overlap issues on mobile
- [ ] Run `npm run build` to confirm no build errors: `npm run build`
