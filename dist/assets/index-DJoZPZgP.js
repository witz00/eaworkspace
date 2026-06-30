(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){e.innerHTML=`
    <div class="content-area">
      <span class="section-label">Знакомство</span>
      <p class="greeting-main">
        Привет! 👋 Я Эмиль — UX/UI дизайнер.
        <span class="accent">Проектирую</span> и
        <span class="accent">разрабатываю</span> простые и удобные интерфейсы для
        <span class="accent">веб-приложений и мобильных устройств.</span>
      </p>
      <p class="greeting-sub">
        Проживаю в городе <span class="accent">Ульяновск</span>.
        Специализируюсь в данном направлении
        <span class="accent">уже около двух лет практического опыта.</span>
      </p>
      <a class="contact-link" href="#">Связаться со мной!</a>
    </div>
  `}var t=[{company:`Study Kvo.`,role:`Дизайнер интерфейсов`,period:`март 2024 — сентябрь 2024`},{company:`UPROCK School`,role:`С 0 до Middle+`,period:`март 2025 — май 2026`}];function n(e){e.innerHTML=`
    <div class="content-area">
      <span class="section-label">Опыт</span>
      <div class="exp-list">
        ${t.map(e=>`
          <div class="exp-row">
            <div class="exp-left">
              <div class="exp-logo"></div>
              <div class="exp-info">
                <span class="exp-company">${e.company}</span>
                <span class="exp-role">${e.role}</span>
              </div>
            </div>
            <span class="exp-period">${e.period}</span>
          </div>
        `).join(``)}
      </div>
    </div>
  `}var r=[{company:`Ozon Bank`,title:`Instruction for QES`,description:`At the business account opening flow, the conversion rate dropped sharply because users had to sign the agreement with a qualified e-signature.`,image:null}],i=0,a=null;function o(e,{onMenu:t}={}){a=t??null,i=0,s(e)}function s(e){let t=r.length,n=r[i];e.innerHTML=`
    <div class="proj-wrap">

      <!-- Left: image area -->
      <div class="proj-preview">
        <div class="proj-preview-inner">
          <span class="proj-no-image"></span>
          <button class="proj-open-btn" id="projOpenBtn">Открыть полностью</button>
          <div class="proj-dots">
            ${Array.from({length:t},(e,t)=>`<span class="proj-dot ${t===i?`active`:``}"></span>`).join(``)}
          </div>
        </div>
      </div>

      <!-- Right: info -->
      <div class="proj-info">
        <div class="proj-title-row">
          <span class="proj-company">${n.company}</span>
          <span class="proj-case-title">${n.title}</span>
        </div>
        <p class="proj-desc">${n.description}</p>
      </div>

      <!-- Bottom bar -->
      <div class="proj-bar">
        <div class="proj-bar-left">
          <button class="proj-tag active" id="projTagProjects">Проекты</button>
          <button class="proj-tag" id="projTagMenu">Меню</button>
        </div>
        <div class="proj-bar-right">
          <span class="hint-text">Используй</span>
          <div class="hint-keys">
            <div class="key-btn" id="projKeyLeft">←</div>
            <div class="key-btn" id="projKeyRight">→</div>
          </div>
          <span class="hint-text">для навигации</span>
        </div>
      </div>

    </div>

    <!-- Modal -->
    <div class="proj-modal-overlay" id="projModalOverlay" style="display:none">
      <div class="proj-modal">
        <div class="proj-modal-header">
          <span>${n.company} — ${n.title}</span>
          <button class="proj-modal-close" id="projModalClose">✕</button>
        </div>
        <div class="proj-modal-body">
          <p>${n.description}</p>
        </div>
      </div>
    </div>
  `,c(e)}function c(e){e.querySelector(`#projOpenBtn`).addEventListener(`click`,()=>{e.querySelector(`#projModalOverlay`).style.display=`flex`}),e.querySelector(`#projModalClose`).addEventListener(`click`,l.bind(null,e)),e.querySelector(`#projModalOverlay`).addEventListener(`click`,t=>{t.target===t.currentTarget&&l(e)}),e.querySelector(`#projTagMenu`).addEventListener(`click`,()=>{a?.()}),e.querySelector(`#projKeyLeft`).addEventListener(`click`,()=>d(e,-1)),e.querySelector(`#projKeyRight`).addEventListener(`click`,()=>d(e,1))}function l(e){e.querySelector(`#projModalOverlay`).style.display=`none`}function u(e,t){d(e,t)}function d(e,t){let n=r.length;i=(i+t+n)%n,s(e)}function f(e){e.innerHTML=`
    <div class="content-area">
      <span class="section-label">Коммуникация</span>
      <p class="greeting-main">Раздел в разработке.</p>
    </div>
  `}function p(e){e.innerHTML=`
    <div class="content-area">
      <span class="section-label">Достижения</span>
      <p class="greeting-main">Скоро.</p>
    </div>
  `}var m=2,h=Array.from(document.querySelectorAll(`.nav-btn`)),g=document.getElementById(`keyUp`),_=document.getElementById(`keyDown`),v=document.getElementById(`contentSlot`),y=document.querySelector(`.layout`),b=document.querySelector(`.card-left`),x=document.querySelector(`.card-right`),S=0,C=!1,w=[e,n,null,f,p].map((e,t)=>{let n=document.createElement(`div`);return n.style.display=t===0?`contents`:`none`,e&&e(n),v.appendChild(n),n});function T(){C=!0,b.style.display=`none`,x.style.flex=`1`,y.style.maxWidth=`1400px`,o(w[m],{onMenu:E}),w[m].style.display=`contents`}function E(){C=!1,b.style.display=``,x.style.flex=``,y.style.maxWidth=``,w[m].style.display=`none`,D(m),D(0)}function D(e){if(w[S].style.display=`none`,h[S].classList.remove(`active`),S=e,e===m){h[e].classList.add(`active`),T();return}C&&(C=!1,b.style.display=``,x.style.flex=``,y.style.maxWidth=``);let t=w[e];t.querySelectorAll(`.content-area > *`).forEach(e=>{e.style.animation=`none`,e.offsetHeight,e.style.animation=``}),t.style.display=`contents`,h[e].classList.add(`active`)}function O(e){e.classList.add(`press`),setTimeout(()=>e.classList.remove(`press`),130)}h.forEach((e,t)=>e.addEventListener(`click`,()=>D(t))),g.addEventListener(`click`,()=>{D((S-1+w.length)%w.length),O(g)}),_.addEventListener(`click`,()=>{D((S+1)%w.length),O(_)}),document.addEventListener(`keydown`,e=>{if(C){e.key===`ArrowLeft`&&(e.preventDefault(),u(w[m],-1)),e.key===`ArrowRight`&&(e.preventDefault(),u(w[m],1));return}e.key===`ArrowUp`&&(e.preventDefault(),D((S-1+w.length)%w.length),O(g)),e.key===`ArrowDown`&&(e.preventDefault(),D((S+1)%w.length),O(_))});