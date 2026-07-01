# Свитч смены темы Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the theme-toggle button's hidden icon with a compact iOS-style switch plus a dynamic text label ("Тёмная тема" / "Светлая тема"), keeping all existing theme-persistence behavior intact.

**Architecture:** `index.html` gets new markup inside `#themeToggle` (label span + switch span + thumb span). `src/style.css` gets new rules for the label/switch/thumb and removes the now-unused `.theme-toggle-icon` rule. `src/main.js`'s existing click handler gains a small `updateThemeToggleUI()` helper, called once on load and once per click.

**Tech Stack:** Vanilla JS (ES modules), vanilla CSS. No test framework in this repo — verification is manual via `npm run dev` + browser check at the end of each task.

## Global Constraints

- No test framework exists — verify manually in the browser per task, plus `npm run build` for syntax errors.
- Only `index.html`, `src/style.css`, and `src/main.js` are touched — no other files.
- Existing theme persistence (`data-theme` attribute, `localStorage.getItem/setItem('theme', ...)`, the inline `<head>` script in `index.html` that reads `localStorage` before paint) must not be changed.
- Switch track: 44×24px, `border-radius: 12px`. Thumb: 20×20px circle, `background: #FFFFFF`, positioned with `top: 2px; left: 2px` and `transform: translateX(20px)` when on.
- Track color: `var(--border)` when off (light theme active), `var(--dot-active)` when on (dark theme active).
- Label text: exactly `"Тёмная тема"` when dark theme is active, `"Светлая тема"` when light theme is active.
- `.theme-toggle-icon` CSS rule and the `<img src="/assets/mode.svg" ...>` element are removed; the `/assets/mode.svg` file itself stays untouched in `public/assets` (out of scope to delete).
- `.theme-toggle--mobile` (separate mobile element) is not touched — out of scope.

---

### Task 1: Switch markup and styling

**Files:**
- Modify: `index.html:76-78`
- Modify: `src/style.css` (remove `.theme-toggle-icon` rule; add `.theme-toggle-label`, `.theme-switch`, `.theme-switch-thumb`, `.theme-switch.on`, `.theme-switch.on .theme-switch-thumb`; add `justify-content: space-between` and `padding: 0 16px` to `.theme-toggle`)

**Interfaces:**
- Produces: DOM structure `#themeToggle` > `#themeToggleLabel.theme-toggle-label` (text) + `#themeSwitch.theme-switch` > `.theme-switch-thumb`. Task 2 depends on these exact IDs (`themeToggleLabel`, `themeSwitch`) and the `.on` class toggle contract.

- [ ] **Step 1: Replace the button markup in `index.html`**

Find these lines (currently 76-78):

```html
      <button class="theme-toggle" id="themeToggle" aria-label="Сменить тему">
        <img src="/assets/mode.svg" alt="" class="theme-toggle-icon" />
      </button>
```

Replace with:

```html
      <button class="theme-toggle" id="themeToggle" aria-label="Сменить тему">
        <span class="theme-toggle-label" id="themeToggleLabel">Тёмная тема</span>
        <span class="theme-switch" id="themeSwitch" aria-hidden="true">
          <span class="theme-switch-thumb"></span>
        </span>
      </button>
```

- [ ] **Step 2: Remove the old icon CSS rule**

In `src/style.css`, find and delete this rule (search for `.theme-toggle-icon`):

```css
.theme-toggle-icon {
  display: none;
}
```

- [ ] **Step 3: Add `justify-content` and `padding` to `.theme-toggle`**

Find the `.theme-toggle` rule (search for `.theme-toggle {`) and add two properties inside it — the rule currently looks like:

```css
.theme-toggle {
  margin-top: 48px;
  background: rgba(255,255,255,0.02);
  border: none;
  border-radius: var(--radius-btn);
  color: var(--white);
  font-size: 20px;
  width: 320px;
  height: 56px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.5s;
  align-self: flex-start;
}
```

Replace `justify-content: center;` with `justify-content: space-between;` and add `padding: 0 16px;` right after `height: 56px;`. The rule should read:

```css
.theme-toggle {
  margin-top: 48px;
  background: rgba(255,255,255,0.02);
  border: none;
  border-radius: var(--radius-btn);
  color: var(--white);
  font-size: 20px;
  width: 320px;
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.5s;
  align-self: flex-start;
}
```

- [ ] **Step 4: Add the switch/label CSS**

Immediately after the `.theme-toggle:hover { background: var(--border); }` rule, add:

```css
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

- [ ] **Step 5: Verify with build**

Run: `npm run build` (from `C:\Claude-Projects\portfolio v2\.worktrees\exp-expand`)
Expected: Success, no errors.

- [ ] **Step 6: Verify visually in the browser**

Run: `npm run dev`, open the printed local URL.
Expected: The theme-toggle button shows "Тёмная тема" text on the left and a switch track+thumb on the right (static — clicking does nothing yet, that's Task 2). No console errors. The switch is gray (off-state color `var(--border)`) since no `.on` class is applied yet.

- [ ] **Step 7: Commit**

```bash
git add index.html src/style.css
git commit -m "feat: add theme switch markup and styles"
```

---

### Task 2: Wire up label/switch state sync

**Files:**
- Modify: `src/main.js:61-74`

**Interfaces:**
- Consumes: `#themeToggleLabel` and `#themeSwitch` (with `.theme-switch-thumb` child) from Task 1, and the existing `data-theme` attribute / `localStorage` mechanism already present in `src/main.js` and `index.html`'s inline `<head>` script.

- [ ] **Step 1: Replace the theme toggle block in `src/main.js`**

Find this block (currently lines 61-74):

```javascript
// ── Theme toggle ──
const themeToggle = document.getElementById('themeToggle')
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const prevTheme = document.documentElement.getAttribute('data-theme') || 'dark'
    const next = prevTheme === 'dark' ? 'light' : 'dark'
    const style = document.createElement('style')
    style.textContent = '* { transition: none !important; }'
    document.head.appendChild(style)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    requestAnimationFrame(() => style.remove())
  })
}
```

Replace with:

```javascript
// ── Theme toggle ──
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

- [ ] **Step 2: Verify with build**

Run: `npm run build` (from `C:\Claude-Projects\portfolio v2\.worktrees\exp-expand`)
Expected: Success, no errors.

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev`, open the printed local URL.
Manually check:
1. Page loads with dark theme (default) — label reads "Тёмная тема", switch is green with thumb on the right.
2. Click the button — theme flips to light, label reads "Светлая тема", switch turns gray (`var(--border)` color) with thumb sliding to the left.
3. Click again — flips back to dark, label and switch revert.
4. Reload the page after leaving it on light theme — label/switch show light-theme state immediately (no flash of incorrect state), matching what the inline `<head>` script already restores from `localStorage`.
5. No console errors in any of the above steps.
Expected: All 5 checks pass.

- [ ] **Step 4: Commit**

```bash
git add src/main.js
git commit -m "feat: sync theme switch label and state with active theme"
```

---

## Final Verification

- [ ] Run `npm run build` — confirm no errors: `npm run build`
- [ ] Re-run the 5 checks from Task 2 Step 3 once more after both tasks are committed, to confirm nothing regressed between tasks.
