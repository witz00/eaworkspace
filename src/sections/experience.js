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
