export function renderIntro(container) {
  container.innerHTML = `
    <div class="content-area content-area--intro">
      <span class="section-label">Знакомство</span>
      <p class="greeting-main">
        Привет! 👋 Я Эмиль — UX/UI дизайнер.
        <span class="accent">Проектирую</span> и
        <span class="accent">разрабатываю</span> простые и удобные интерфейсы для
        <span class="accent">веб-приложений и мобильных устройств.</span>
      </p>
      <div class="greeting-footer">
        <p class="greeting-sub">
          Проживаю в городе <span class="accent">Ульяновск.</span>
          Специализируюсь в данном направлении
          <span class="accent">уже около двух лет практического опыта.</span>
        </p>
        <a class="contact-link" href="https://t.me/witz00" target="_blank">Написать мне</a>
      </div>
    </div>
  `
}
