(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){e.innerHTML=`
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
  `}var t=[{company:`Study Kvo.`,role:`Дизайнер интерфейсов`,period:`март 2024 — сентябрь 2024`,logo:`/assets/logo-studykvo.jpg`,duties:`Работал над созданием концепта мобильного приложения стоматологической клиники. Основной задачей было спроектировать интуитивно понятный интерфейс (MVP) с нуля, учитывая современные стандарты доступности.`,achievements:[`Спроектировал информационную архитектуру (ИА), что позволило сократить путь пользователя до целевого действия.`,`Разработал дизайн-систему, обеспечив единство стиля и высокую скорость сборки макетов.`,`Сформировал две прото-персоны и на основе их потребностей адаптировал интерфейс, сделав его максимально удобным для целевой аудитории.`]},{company:`UPROCK School`,role:`С 0 до Middle+`,period:`март 2025 — май 2026`,logo:`/assets/logo-uprock.png`,duties:`Работаю над полноценным проектом концепта мобильного приложения бронирование и оформление авиабилетов (подобие Aviasales). Основной задачей является спроектировать приложение с 50+ экранами, проработать сценарий и протестировать на реальных пользователях.`,achievements:[`Провел конкурентный анализ и глубинные интервью с целевой аудиторией.`,`Разработал интерактивный функциональный Lo-Fi прототип.`,`Исследовал визуальную концепцию и спроектировал MVP-версию приложения.`,`Разработал дизайн-систему, обеспечив единство стиля и высокую скорость сборки макетов.`,`Подготовил прототип с переходами между экранами.`]}];function n(e){e.innerHTML=`
    <div class="content-area">
      <span class="section-label">Опыт</span>
      <div class="exp-list">
        ${t.map((e,t)=>`
          <div class="exp-item" data-exp="${t}">
            <div class="exp-row">
              <div class="exp-left">
                <div class="exp-logo">
                  ${e.logo?`<img src="${e.logo}" alt="${e.company}" />`:``}
                </div>
                <div class="exp-info">
                  <span class="exp-company">${e.company}</span>
                  <span class="exp-role">${e.role}</span>
                </div>
              </div>
              <span class="exp-period">${e.period}</span>
            </div>
            <div class="exp-details">
              <div class="exp-details-inner">
                <p class="exp-duties">${e.duties}</p>
                <ul class="exp-achievements">
                  ${e.achievements.map(e=>`<li>${e}</li>`).join(``)}
                </ul>
              </div>
            </div>
          </div>
        `).join(``)}
      </div>
    </div>
  `,e.querySelectorAll(`.exp-row`).forEach(e=>{e.addEventListener(`click`,()=>{e.closest(`.exp-item`).classList.toggle(`open`)})})}var r=[{title:`В разработке`,company:`TripTap: Cервис для покупки авиабилетов`,description:``,wip:!0},{title:`В разработке`,company:`Кейс 2`,description:``,wip:!0}];function i(e){function t(){e.innerHTML=`
      <div class="content-area proj-grid-area">
        <span class="section-label">Проекты</span>
        <div class="proj-grid">
          ${r.map((e,t)=>`<div class="proj-grid-card" data-index="${t}"></div>`).join(``)}
        </div>
      </div>
    `,e.querySelectorAll(`.proj-grid-card`).forEach(e=>{e.addEventListener(`click`,()=>{n(+e.dataset.index)})})}function n(n){let i=r[n];e.innerHTML=`
      <div class="content-area proj-grid-area">
        <div class="proj-crumb">
          <button class="proj-crumb-link" type="button">Проекты</button>
          <span class="proj-crumb-sep">/</span>
          <span class="proj-crumb-current">${i.company}</span>
        </div>
        <div class="proj-case-body">
          <p>${i.title}</p>
        </div>
      </div>
    `,e.querySelectorAll(`.proj-crumb-link`).forEach(e=>{e.addEventListener(`click`,t)})}t()}function a(e){e.innerHTML=`
    <div class="content-area">
      <span class="section-label">Коммуникация</span>
      <p class="greeting-main">Раздел в разработке.</p>
    </div>
  `}function o(e){e.innerHTML=`
    <div class="content-area">
      <span class="section-label">Достижения</span>
      <p class="greeting-main">Скоро.</p>
    </div>
  `}var s={};function c(e){s[e]||(s[e]=new Audio(`/assets/${e}.wav`),s[e].volume=.3);let t=s[e].cloneNode();t.volume=s[e].volume,t.play().catch(()=>{})}var l={hover:()=>c(`hover`),click:()=>c(`click`),pop:()=>c(`pop`)},u=document.getElementById(`preloader`);u&&(u.style.opacity=`0`,setTimeout(()=>u.remove(),400));var d=[e,n,i,a,o],f=d.indexOf(i),p=new Set([d.indexOf(o)]),m=Array.from(document.querySelectorAll(`.nav-btn`)),h=document.getElementById(`contentSlot`),g=document.querySelector(`.card-right`),_=0,v=d.map((e,t)=>{let n=document.createElement(`div`);return n.style.display=t===_?`contents`:`none`,e(n),h.appendChild(n),n});function y(e){if(p.has(e))return;v[_].style.display=`none`,m[_].classList.remove(`active`),_=e;let t=v[e];t.style.display=`contents`,m[e].classList.add(`active`),g.classList.toggle(`projects-active`,e===f)}m.forEach((e,t)=>{e.addEventListener(`mouseenter`,()=>l.hover()),e.addEventListener(`click`,()=>y(t))});function b(e){let t=_;do t=(t+e+v.length)%v.length;while(p.has(t));return t}document.addEventListener(`keydown`,e=>{e.key===`ArrowUp`&&(e.preventDefault(),l.click(),y(b(-1))),e.key===`ArrowDown`&&(e.preventDefault(),l.click(),y(b(1)))});var x=document.getElementById(`themeToggle`),S=document.getElementById(`themeToggleLabel`),C=document.getElementById(`themeSwitch`);function w(e){let t=e!==`light`;S.textContent=t?`Тёмная тема`:`Светлая тема`,C.classList.toggle(`on`,t)}x&&(w(document.documentElement.getAttribute(`data-theme`)||`dark`),x.addEventListener(`click`,()=>{let e=(document.documentElement.getAttribute(`data-theme`)||`dark`)===`dark`?`light`:`dark`,t=document.createElement(`style`);t.textContent=`* { transition: none !important; }`,document.head.appendChild(t),document.documentElement.setAttribute(`data-theme`,e),localStorage.setItem(`theme`,e),w(e),requestAnimationFrame(()=>t.remove())}));var T=document.getElementById(`mBurger`),E=document.getElementById(`mOverlay`),D=document.getElementById(`mOverlayPanel`);D.innerHTML=[{primary:`Знакомство`,secondary:`Обо мне`,color:`var(--dot-active)`},{primary:`Опыт`,secondary:`Работа & Учеба`,color:`var(--dot-exp)`},{primary:`Проекты`,secondary:`Веб & Мобилки`,color:`var(--dot-proj)`},{primary:`Коммуникация`,secondary:`Соц.сети`,color:`var(--dot-comm)`},{primary:`Достижения`,secondary:`Скоро`,color:`var(--dot-ach)`}].map((e,t)=>`
  <div class="m-nav-item ${t===_?`active`:``}" data-index="${t}">
    <div class="dot" style="background:${e.color}"></div>
    <div class="nav-labels">
      <span class="nav-primary">${e.primary}</span>
      <span class="nav-secondary">${e.secondary}</span>
    </div>
  </div>
`).join(``),D.querySelectorAll(`.m-nav-item`).forEach(e=>{e.addEventListener(`click`,()=>{O(!1),y(+e.dataset.index)})});function O(e){T.classList.toggle(`open`,e),E.classList.toggle(`open`,e)}T.addEventListener(`click`,()=>{O(!E.classList.contains(`open`))}),E.addEventListener(`click`,e=>{e.target===E&&O(!1)});var k=0,A=0;document.addEventListener(`touchstart`,e=>{k=e.touches[0].clientX,A=e.touches[0].clientY},{passive:!0}),document.addEventListener(`touchend`,e=>{let t=e.changedTouches[0].clientX-k,n=e.changedTouches[0].clientY-A;Math.abs(t)<40&&Math.abs(n)<40||Math.abs(n)>Math.abs(t)&&Math.abs(n)>40&&(l.click(),y(b(n<0?1:-1)))},{passive:!0});