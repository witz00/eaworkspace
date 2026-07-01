const cases = [
  {
    title: 'В разработке',
    company: 'TripTap: Cервис для покупки авиабилетов',
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
  function renderGrid() {
    container.innerHTML = `
      <div class="content-area proj-grid-area">
        <span class="section-label">Проекты</span>
        <div class="proj-grid">
          ${cases.map((_, i) => `<div class="proj-grid-card" data-index="${i}"></div>`).join('')}
        </div>
      </div>
    `

    container.querySelectorAll('.proj-grid-card').forEach(card => {
      card.addEventListener('click', () => {
        renderCase(+card.dataset.index)
      })
    })
  }

  function renderCase(i) {
    const c = cases[i]
    container.innerHTML = `
      <div class="content-area proj-grid-area">
        <div class="proj-crumb">
          <button class="proj-crumb-link" type="button">Проекты</button>
          <span class="proj-crumb-sep">/</span>
          <span class="proj-crumb-current">${c.company}</span>
        </div>
        <div class="proj-case-body">
          <p>${c.title}</p>
        </div>
      </div>
    `

    container.querySelectorAll('.proj-crumb-link').forEach(link => {
      link.addEventListener('click', renderGrid)
    })
  }

  renderGrid()
}
