import { sfx } from '../sounds.js'

const cases = [
  {
    title: 'В разработке',
    company: 'Кейс 1',
    description: '',
    wip: true,
  },
  {
    title: 'В разработке',
    company: 'Кейс 2',
    description: '',
    wip: true,
  },
]

export function renderProjects(container) {
  container.innerHTML = `
    <div class="content-area proj-grid-area">
      <span class="section-label">Проекты</span>
      <div class="proj-grid">
        ${cases.map((_, i) => `<div class="proj-grid-card" data-index="${i}"></div>`).join('')}
      </div>
    </div>
  `

  const overlay = document.createElement('div')
  overlay.className = 'proj-modal-overlay'
  overlay.style.display = 'none'
  overlay.innerHTML = `
    <div class="proj-modal">
      <div class="proj-modal-header">
        <div class="proj-modal-titles">
          <span id="projModalTitle"></span>
          <span id="projModalSubtitle"></span>
        </div>
        <button class="proj-modal-close" id="projModalClose">
          <img src="/assets/close.svg" alt="Закрыть" class="theme-toggle-icon" />
        </button>
      </div>
      <div class="proj-modal-body" id="projModalBody"></div>
    </div>
  `
  document.body.appendChild(overlay)

  const modalTitle    = overlay.querySelector('#projModalTitle')
  const modalSubtitle = overlay.querySelector('#projModalSubtitle')
  const modalBody     = overlay.querySelector('#projModalBody')

  overlay.querySelector('#projModalClose').addEventListener('click', () => {
    overlay.style.display = 'none'
  })
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.style.display = 'none'
  })

  container.querySelectorAll('.proj-grid-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      const c = cases[i]
      sfx.pop()
      modalTitle.textContent = c.company
      modalSubtitle.textContent = c.title
      modalBody.innerHTML = c.description ? `<p>${c.description}</p>` : ''
      overlay.style.display = 'flex'
    })
  })
}
