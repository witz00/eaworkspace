import './style.css'

const preloader = document.getElementById('preloader')
if (preloader) {
  preloader.style.opacity = '0'
  setTimeout(() => preloader.remove(), 400)
}
import { renderIntro }        from './sections/intro.js'
import { renderExperience }   from './sections/experience.js'
import { renderProjects }     from './sections/projects.js'
import { renderContacts }     from './sections/contacts.js'
import { renderAchievements } from './sections/achievements.js'
import { sfx } from './sounds.js'

const renders = [renderIntro, renderExperience, renderProjects, renderContacts, renderAchievements]
const PROJECTS_INDEX  = renders.indexOf(renderProjects)
const DISABLED_INDEXES = new Set([renders.indexOf(renderAchievements)])

const navBtns     = Array.from(document.querySelectorAll('.nav-btn'))
const contentSlot = document.getElementById('contentSlot')
const cardRight   = document.querySelector('.card-right')

let current = 0

const panels = renders.map((render, i) => {
  const el = document.createElement('div')
  el.style.display = i === current ? 'contents' : 'none'
  render(el)
  contentSlot.appendChild(el)
  return el
})

function setActive(i) {
  if (DISABLED_INDEXES.has(i)) return
  panels[current].style.display = 'none'
  navBtns[current].classList.remove('active')
  current = i

  const panel = panels[i]
  panel.style.display = 'contents'
  navBtns[i].classList.add('active')
  cardRight.classList.toggle('projects-active', i === PROJECTS_INDEX)
}

navBtns.forEach((btn, i) => {
  btn.addEventListener('mouseenter', () => sfx.hover())
  btn.addEventListener('click', () => setActive(i))
})

function nextActive(dir) {
  let i = current
  do { i = (i + dir + panels.length) % panels.length } while (DISABLED_INDEXES.has(i))
  return i
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp')   { e.preventDefault(); sfx.click(); setActive(nextActive(-1)) }
  if (e.key === 'ArrowDown') { e.preventDefault(); sfx.click(); setActive(nextActive( 1)) }
})

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

// ── Mobile burger menu ──
const mBurger       = document.getElementById('mBurger')
const mOverlay      = document.getElementById('mOverlay')
const mOverlayPanel = document.getElementById('mOverlayPanel')

const NAV_DATA = [
  { primary: 'Знакомство', secondary: 'Обо мне',        color: 'var(--dot-active)' },
  { primary: 'Опыт',       secondary: 'Работа & Учеба',  color: 'var(--dot-exp)'   },
  { primary: 'Проекты',    secondary: 'Веб & Мобилки',   color: 'var(--dot-proj)'  },
  { primary: 'Коммуникация', secondary: 'Соц.сети',      color: 'var(--dot-comm)'  },
  { primary: 'Достижения', secondary: 'Скоро',           color: 'var(--dot-ach)'   },
]

mOverlayPanel.innerHTML = NAV_DATA.map((d, i) => `
  <div class="m-nav-item ${i === current ? 'active' : ''}" data-index="${i}">
    <div class="dot" style="background:${d.color}"></div>
    <div class="nav-labels">
      <span class="nav-primary">${d.primary}</span>
      <span class="nav-secondary">${d.secondary}</span>
    </div>
  </div>
`).join('')

mOverlayPanel.querySelectorAll('.m-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    toggleMobileNav(false)
    setActive(+item.dataset.index)
  })
})

function toggleMobileNav(open) {
  mBurger.classList.toggle('open', open)
  mOverlay.classList.toggle('open', open)
}

mBurger.addEventListener('click', () => {
  toggleMobileNav(!mOverlay.classList.contains('open'))
})

mOverlay.addEventListener('click', e => {
  if (e.target === mOverlay) toggleMobileNav(false)
})

// Touch swipe — вертикальная навигация между разделами
let _tx = 0, _ty = 0
document.addEventListener('touchstart', e => {
  _tx = e.touches[0].clientX
  _ty = e.touches[0].clientY
}, { passive: true })

document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - _tx
  const dy = e.changedTouches[0].clientY - _ty
  if (Math.abs(dx) < 40 && Math.abs(dy) < 40) return
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
    sfx.click()
    setActive(nextActive(dy < 0 ? 1 : -1))
  }
}, { passive: true })
