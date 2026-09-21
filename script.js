// Приветствие набирается по символу. Раньше это делали три @keyframes с
// зашитым числом знаков в строке — такой приём держится только на тексте,
// который не переносится. Абзац переносится, поэтому набор считается здесь.
const heroTyped = document.querySelector('.hero-typed');
if (heroTyped && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const CHAR_DELAY = 26;
  const START_DELAY = 500;
  // Каждый символ — отдельный span: текст занимает финальную ширину сразу,
  // поэтому переносы не пересчитываются и каретка не дёргает строку.
  // Обход рекурсивный: внутри строки есть обёртки вроде выделенной фразы,
  // и их содержимое должно набираться посимвольно, а не появляться разом.
  const chars = [];

  const splitChars = (parent) => {
    [...parent.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        [...node.textContent].forEach(char => {
          const span = document.createElement('span');
          span.className = 'hero-char';
          span.textContent = char;
          fragment.appendChild(span);
          chars.push(span);
        });
        // Заменяем текст на месте, чтобы не потерять обёртки вокруг него.
        parent.replaceChild(fragment, node);
      } else {
        splitChars(node);
      }
    });
  };

  splitChars(heroTyped);

  // Выделение фразы появляется только после набора: пока текста нет,
  // подсвечивать нечего — подложка и ручки висели бы в пустоте.
  const mark = heroTyped.querySelector('.hero-mark');

  let shown = 0;
  const revealNext = () => {
    chars[shown++].classList.add('hero-char--on');
    if (shown < chars.length) {
      setTimeout(revealNext, CHAR_DELAY);
    } else if (mark) {
      // Пауза после последней буквы: выделение читается как отдельный жест,
      // а не как продолжение набора.
      setTimeout(() => mark.classList.add('is-selected'), 350);
    }
  };
  setTimeout(revealNext, START_DELAY);
}

const themeToggles = document.querySelectorAll('#theme-toggle');

const themeColorMeta = document.getElementById('theme-color-meta');

/* Основная тема светлая, переключатель включает тёмную. */
function applyTheme(isDark) {
  document.documentElement.classList.toggle("theme-dark", isDark);
  themeToggles.forEach(t => {
    t.setAttribute("aria-checked", String(isDark));
  });
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", isDark ? "#0F0F0F" : "#FFFFFF");
  }
}

applyTheme(localStorage.getItem("theme") === "dark");

themeToggles.forEach(toggle => {
  toggle.addEventListener("click", () => {
    const isDark = !document.documentElement.classList.contains("theme-dark");
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});

// Бургер-меню телефона. Панель показывается классом, поэтому на десктопе,
// где она не нужна, скрипт ничего не делает — правило @media держит её
// скрытой независимо от классов.
const navBurger = document.getElementById("nav-burger");
const navLinks = document.getElementById("nav-links");

if (navBurger && navLinks) {
  const closeMenu = () => {
    navBurger.classList.remove("open");
    navLinks.classList.remove("open");
    navBurger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  navBurger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navBurger.classList.toggle("open", isOpen);
    navBurger.setAttribute("aria-expanded", String(isOpen));
    // Меню занимает весь экран — страница под ним прокручиваться не должна.
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Переход по пункту закрывает панель: якорь ведёт на этой же странице,
  // и открытое меню перекрывало бы то, к чему только что перешли.
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Клик мимо панели закрывает её.
  document.addEventListener("click", (e) => {
    if (!navLinks.classList.contains("open")) return;
    if (navBurger.contains(e.target) || navLinks.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // При переходе на широкий экран панель прячется правилом, но классы
  // остались бы, и бургер вернулся бы уже раскрытым.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

// Звуки интерфейса синтезируются на месте, файлов больше нет: щелчок — это
// всплеск шума длиной несколько миллисекунд, пропущенный через полосовой
// фильтр. Так звук весит ноль байт, не требует загрузки и звучит сухо и
// коротко, без «мультяшного» хвоста, который слышен у готовых сэмплов.
let audioCtx = null;

function playNoiseBurst({ freq, duration = 0.004, decay = 20, q = 8, gain = 1 }) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    // Контекст засыпает, если вкладка была неактивной.
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const length = Math.round(audioCtx.sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    // Белый шум, гаснущий по экспоненте: чем больше decay, тем резче обрыв.
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / decay);
    }

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    // Частоту слегка разбрасываем: одинаковые щелчки подряд звучат машинно.
    filter.frequency.value = freq * (1 + (Math.random() - 0.5) * 0.1);
    filter.Q.value = q;

    const volume = audioCtx.createGain();
    volume.gain.value = gain;

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(filter).connect(volume).connect(audioCtx.destination);
    source.start();
    // Узлы живут только на время щелчка, иначе они копятся в графе.
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      volume.disconnect();
    };
  } catch {
    // Аудио может быть недоступно — звук не критичен, молча пропускаем.
  }
}

function playClickSound() {
  playNoiseBurst({ freq: 4000, decay: 25, gain: 3.2 });
}

function playHoverSound() {
  playNoiseBurst({ freq: 2000, duration: 0.003, decay: 15, q: 4, gain: 0.42 });
}

// Delegated so links and buttons added later are covered too
document.addEventListener('click', (e) => {
  const target = e.target.closest('a, button');
  if (!target) return;
  playClickSound();
  // Клик мышью оставляет фокус на пункте, и подсветка держится после ухода
  // курсора. Клавиатурный фокус не трогаем: там подсветка нужна.
  if (e.detail > 0 && target.matches('.touch-link')) target.blur();
});

document.addEventListener('mouseover', (e) => {
  const target = e.target.closest('a, button');
  if (!target || target.contains(e.relatedTarget)) return;
  // Карточка кейса занимает пол-экрана, и курсор задевает её по пути к чему
  // угодно: звук на такой площади срабатывает случайно, а не в ответ на жест.
  if (target.matches('.proj-item')) return;
  playHoverSound();
});


// Просмотр макетов кейса. Клик открывает изображение поверх страницы,
// колесо и двойной клик меняют масштаб, перетаскивание двигает картинку.
// Слой один на страницу и создаётся только там, где есть что открывать.
const caseImages = document.querySelectorAll('.case-image-static-img');

if (caseImages.length) {
  const MAX_SCALE = 5;
  const MIN_SCALE = 1;
  const ZOOM_STEP = 1.6;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Просмотр изображения');
  lightbox.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="Закрыть просмотр">' +
      '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16"/></svg>' +
    '</button>' +
    '<div class="lightbox-stage"><img class="lightbox-img" alt=""></div>' +
    '<p class="lightbox-hint">Колесо или двойной клик — масштаб, перетаскивание — сдвиг</p>';
  document.body.appendChild(lightbox);

  const stage = lightbox.querySelector('.lightbox-stage');
  const view = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  let scale = 1;
  let x = 0;
  let y = 0;
  let opener = null;
  // Пальцы и курсор ведём одним кодом: pointer-события покрывают и то и другое.
  const pointers = new Map();
  let pinchStart = 0;
  let scaleStart = 1;
  let panFrom = null;

  const draw = () => {
    view.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
    lightbox.classList.toggle('is-zoomed', scale > 1.01);
  };

  // Сдвиг ограничен размером картинки: иначе её можно утащить за край экрана
  // и потерять из виду.
  const clamp = () => {
    if (scale <= 1) {
      x = 0;
      y = 0;
      return;
    }
    const limitX = Math.max(0, (view.offsetWidth * scale - window.innerWidth) / 2);
    const limitY = Math.max(0, (view.offsetHeight * scale - window.innerHeight) / 2);
    x = Math.min(limitX, Math.max(-limitX, x));
    y = Math.min(limitY, Math.max(-limitY, y));
  };

  // Масштаб растёт вокруг точки под курсором, а не вокруг центра: иначе
  // приближение уводит от места, на которое смотришь.
  const zoomAt = (nextScale, clientX, clientY) => {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
    const rect = view.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const ratio = next / scale;
    x = clientX - ratio * (clientX - cx) - (cx - x);
    y = clientY - ratio * (clientY - cy) - (cy - y);
    scale = next;
    clamp();
    draw();
  };

  const reset = () => {
    scale = 1;
    x = 0;
    y = 0;
    draw();
  };

  const open = (img) => {
    opener = img;
    view.src = img.currentSrc || img.src;
    view.alt = img.alt;
    reset();
    lightbox.classList.add('is-open');
    // Фон не должен прокручиваться под открытым слоем.
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    pointers.clear();
    if (opener) {
      opener.focus({ preventScroll: true });
      opener = null;
    }
  };

  caseImages.forEach(img => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Открыть изображение: ' + img.alt);
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(img);
      }
    });
  });

  closeBtn.addEventListener('click', close);

  // Клик мимо картинки закрывает, по самой картинке — переключает масштаб.
  stage.addEventListener('click', (e) => {
    if (e.target !== view) close();
  });

  view.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (scale > 1.01) reset();
    else zoomAt(2.5, e.clientX, e.clientY);
  });

  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(scale * (e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP), e.clientX, e.clientY);
  }, { passive: false });

  stage.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchStart = Math.hypot(a.x - b.x, a.y - b.y);
      scaleStart = scale;
    } else if (scale > 1.01 && e.target === view) {
      panFrom = { x: e.clientX - x, y: e.clientY - y };
      lightbox.classList.add('is-panning');
      stage.setPointerCapture(e.pointerId);
    }
  });

  stage.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2 && pinchStart) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(scaleStart * (dist / pinchStart), (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }

    if (panFrom) {
      x = e.clientX - panFrom.x;
      y = e.clientY - panFrom.y;
      clamp();
      draw();
    }
  });

  const endPointer = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStart = 0;
    if (!pointers.size) {
      panFrom = null;
      lightbox.classList.remove('is-panning');
    }
  };

  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === '+' || e.key === '=') zoomAt(scale * ZOOM_STEP, innerWidth / 2, innerHeight / 2);
    if (e.key === '-') zoomAt(scale / ZOOM_STEP, innerWidth / 2, innerHeight / 2);
    if (e.key === '0') reset();
  });

  window.addEventListener('resize', () => {
    clamp();
    draw();
  });
}

// Оглавление кейса: подсвечивает раздел, который сейчас на экране.
// Наблюдатель дешевле обработчика прокрутки — браузер сам сообщает,
// когда карточка пересекает полосу чуть ниже шапки.
const caseToc = document.querySelector('.case-toc');

if (caseToc) {
  const links = [...caseToc.querySelectorAll('.case-toc-link')];
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  };

  if (sections.length) {
    setActive(sections[0].id);

    const observer = new IntersectionObserver((entries) => {
      // Видимых карточек может быть несколько — берём верхнюю из них.
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    }, {
      // Полоса внимания: от 100px под шапкой до нижней трети экрана.
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }
}
