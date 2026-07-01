# Experience Accordion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accordion toggle to each experience row in `src/sections/experience.js` that reveals a description, with a theme-toggle-styled chevron button.

**Architecture:** Pure vanilla JS/CSS, no build tooling changes. `experience.js` gains a `description` field per item and renders an extra toggle button + details block per row; a click handler enforces single-open accordion behavior. Styling extends the existing `.exp-*` rules in `src/style.css`, reusing CSS variables (`--btn-bg`, `--border`, `--icon-filter`) already used by `.theme-toggle`.

**Tech Stack:** Vanilla JS (ES modules), plain CSS custom properties. No new dependencies. Dev server: Vite (`npm run dev`).

## Global Constraints

- Chevron icon must be inline SVG (no new asset files) — project has no existing chevron SVG asset.
- Reuse existing CSS variables: `--btn-bg`, `--border`, `--icon-filter` (defined in `src/style.css` theme blocks, lines ~14-48).
- Accordion is single-open: opening one row's details closes all others.
- Whole `.exp-row` is clickable (not just the toggle button).
- Preserve existing mobile responsive rules for `.exp-row` (`src/style.css:933-939`).

---

### Task 1: Add descriptions to experience data and render accordion markup

**Files:**
- Modify: `src/sections/experience.js`

**Interfaces:**
- Produces: DOM structure per row — `.exp-row` (with `data-index="N"`), followed by sibling `.exp-details` (with matching `data-index="N"`) containing `.exp-details-text`. Toggle button `.exp-toggle` with child `.exp-toggle-icon` (inline `<svg>`) sits inside a new `.exp-right` wrapper alongside `.exp-period`.

- [ ] **Step 1: Update `items` array with `description` field and rewrite render template**

Replace the full contents of `src/sections/experience.js` with:

```javascript
const items = [
  {
    company: 'Study Kvo.',
    role: 'Дизайнер интерфейсов',
    period: 'март 2024 — сентябрь 2024',
    logo: '/assets/logo-studykvo.jpg',
    description: 'Проектировал интерфейсы образовательной платформы: от вайрфреймов до финальных макетов. Собирал UI-кит и следил за консистентностью компонентов в командной работе с разработчиками.',
  },
  {
    company: 'UPROCK School',
    role: 'С 0 до Middle+',
    period: 'март 2025 — май 2026',
    logo: '/assets/logo-uprock.png',
    description: 'Прошёл путь от основ UX/UI до продуктового дизайна: исследования, прототипирование, дизайн-системы. Делал учебные и пет-проекты с фокусом на реальные бизнес-задачи.',
  },
]

const CHEVRON_SVG = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`

export function renderExperience(container) {
  container.innerHTML = `
    <div class="content-area">
      <span class="section-label">Опыт</span>
      <div class="exp-list">
        ${items.map((item, i) => `
          <div class="exp-row" data-index="${i}">
            <div class="exp-left">
              <div class="exp-logo">
                ${item.logo ? `<img src="${item.logo}" alt="${item.company}" />` : ''}
              </div>
              <div class="exp-info">
                <span class="exp-company">${item.company}</span>
                <span class="exp-role">${item.role}</span>
              </div>
            </div>
            <div class="exp-right">
              <span class="exp-period">${item.period}</span>
              <button class="exp-toggle" type="button" aria-label="Показать описание" aria-expanded="false">
                <span class="exp-toggle-icon">${CHEVRON_SVG}</span>
              </button>
            </div>
          </div>
          <div class="exp-details" data-index="${i}">
            <p class="exp-details-text">${item.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `

  const rows = Array.from(container.querySelectorAll('.exp-row'))
  rows.forEach(row => {
    row.addEventListener('click', () => {
      const index = row.dataset.index
      const details = container.querySelector(`.exp-details[data-index="${index}"]`)
      const isOpen = row.classList.contains('open')

      rows.forEach(r => {
        r.classList.remove('open')
        r.querySelector('.exp-toggle').setAttribute('aria-expanded', 'false')
      })
      container.querySelectorAll('.exp-details').forEach(d => d.classList.remove('open'))

      if (!isOpen) {
        row.classList.add('open')
        row.querySelector('.exp-toggle').setAttribute('aria-expanded', 'true')
        details.classList.add('open')
      }
    })
  })
}
```

- [ ] **Step 2: Verify markup renders**

Run: `npm run dev` (from project root), open the printed local URL in a browser, navigate to the "Опыт" section.
Expected: Two experience rows render, each showing a chevron button to the right of the period text. No console errors.

- [ ] **Step 3: Commit**

```bash
git add src/sections/experience.js
git commit -m "feat: add accordion markup and data to experience section"
```

---

### Task 2: Style the accordion (toggle button, chevron rotation, details panel)

**Files:**
- Modify: `src/style.css` (extend the `/* ── Experience section ── */` block, currently at lines 682-747)

**Interfaces:**
- Consumes: CSS variables `--btn-bg`, `--border`, `--icon-filter`, `--dim`, `--white` (defined in theme blocks near top of `src/style.css`). Consumes class names produced by Task 1: `.exp-row`, `.exp-right`, `.exp-toggle`, `.exp-toggle-icon`, `.exp-details`, `.exp-details-text`, and state class `.open`.

- [ ] **Step 1: Add accordion styles after the existing `.exp-period` rule**

In `src/style.css`, find this block (around line 742-747):

```css
.exp-period {
  font-size: 20px;
  font-weight: 400;
  color: var(--dim);
  white-space: nowrap;
}

```

Replace it with:

```css
.exp-period {
  font-size: 20px;
  font-weight: 400;
  color: var(--dim);
  white-space: nowrap;
}

.exp-row { cursor: pointer; }

.exp-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.exp-toggle {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--btn-bg);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 0.3s;
}

.exp-row:hover .exp-toggle { background: var(--border); }

.exp-toggle-icon {
  width: 18px;
  height: 18px;
  color: var(--white);
  filter: var(--icon-filter);
  display: flex;
  transition: transform 0.3s;
}

.exp-row.open .exp-toggle-icon { transform: rotate(180deg); }

.exp-details {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.35s ease, opacity 0.25s ease, margin-top 0.35s ease;
}

.exp-details.open {
  max-height: 200px;
  opacity: 1;
  margin-top: 16px;
}

.exp-details-text {
  font-size: 16px;
  color: var(--dim);
  line-height: 1.6;
}

```

- [ ] **Step 2: Add mobile adjustment**

In `src/style.css`, find the mobile block containing (around line 933-939):

```css
  .exp-list { gap: 24px; }
  .exp-row  { flex-direction: column; align-items: flex-start; gap: 8px; }
  .exp-left { gap: 14px; }
  .exp-logo { width: 48px; height: 48px; }
  .exp-company { font-size: 18px; }
  .exp-role    { font-size: 15px; }
  .exp-period  { font-size: 14px; white-space: normal; }
```

Replace it with:

```css
  .exp-list { gap: 24px; }
  .exp-row  { flex-direction: column; align-items: flex-start; gap: 8px; }
  .exp-left { gap: 14px; }
  .exp-logo { width: 48px; height: 48px; }
  .exp-company { font-size: 18px; }
  .exp-role    { font-size: 15px; }
  .exp-period  { font-size: 14px; white-space: normal; }
  .exp-right   { width: 100%; justify-content: space-between; }
```

- [ ] **Step 3: Verify styling and behavior in browser**

Run: `npm run dev`, open local URL, go to "Опыт" section.
Expected:
- Chevron button matches `.theme-toggle` visual style (44×44, rounded corners, same background).
- Clicking anywhere on a row opens its details panel below with smooth height/opacity transition; chevron rotates 180°.
- Clicking a second row closes the first and opens the second (only one open at a time).
- Clicking the open row again closes it.
- Resize to mobile width (< the project's mobile breakpoint) — row stacks vertically, toggle still right-aligned within its own line and functional.

- [ ] **Step 4: Commit**

```bash
git add src/style.css
git commit -m "style: add accordion styling to experience section"
```

---

## Self-Review Notes

- Spec coverage: description field ✓ (Task 1), toggle button styled like theme-toggle ✓ (Task 2), chevron rotate 180° ✓ (Task 2), single-open accordion ✓ (Task 1 JS), whole-row clickable ✓ (Task 1), hover highlight ✓ (Task 2), mobile adaptation ✓ (Task 2 Step 2).
- No placeholders — all code blocks are complete and copy-pasteable.
- Type/class-name consistency verified: `.exp-row`, `.exp-details`, `.exp-toggle`, `.exp-toggle-icon`, `data-index` used consistently between Task 1 (JS) and Task 2 (CSS).
