const items = [
  {
    company: 'Study Kvo.',
    role: 'Дизайнер интерфейсов',
    period: 'март 2024 — сентябрь 2024',
    logo: '/assets/logo-studykvo.jpg',
  },
  {
    company: 'UPROCK School',
    role: 'С 0 до Middle+',
    period: 'март 2025 — май 2026',
    logo: '/assets/logo-uprock.png',
  },
]

export function renderExperience(container) {
  container.innerHTML = `
    <div class="content-area">
      <span class="section-label">Опыт</span>
      <div class="exp-list">
        ${items.map(item => `
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
          </div>
        `).join('')}
      </div>
    </div>
  `
}
