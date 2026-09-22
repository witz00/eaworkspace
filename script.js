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

  let shown = 0;
  const revealNext = () => {
    chars[shown++].classList.add('hero-char--on');
    if (shown < chars.length) setTimeout(revealNext, CHAR_DELAY);
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
    themeColorMeta.setAttribute("content", isDark ? "#0F0F0F" : "#FAFBF8");
  }
}

applyTheme(localStorage.getItem("theme") === "dark");

/* Смена темы. Раньше каждый элемент перекрашивался своим переходом, и у
   части из них (карточки, теги, пункты меню) переход цвета фона был
   перебит собственным transition — они меняли цвет мгновенно, пока фон
   страницы ещё плыл, отсюда вспышка. Теперь переходы на момент смены
   выключены, а плавность даёт одно общее растворение всей страницы. */
const root = document.documentElement;

function switchTheme(isDark) {
  root.classList.add("theme-switching");
  applyTheme(isDark);
  // Принудительный пересчёт стилей: новые цвета встают без переходов,
  // и только после этого переходы возвращаются.
  void root.offsetWidth;
  requestAnimationFrame(() => root.classList.remove("theme-switching"));
}

themeToggles.forEach(toggle => {
  toggle.addEventListener("click", () => {
    const isDark = !root.classList.contains("theme-dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !calm) {
      document.startViewTransition(() => switchTheme(isDark));
    } else {
      switchTheme(isDark);
    }
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

  // На телефоне переключатель темы живёт в меню, прямо под «Резюме»;
  // на широком экране возвращается в шапку рядом с бургером.
  const themeSwitch = document.getElementById("theme-toggle");
  const menuList = navLinks.querySelector(".nav-links-center");
  const navActions = document.querySelector(".nav-actions");
  const phone = window.matchMedia("(max-width: 768px)");
  const placeSwitch = () => {
    if (!themeSwitch || !menuList || !navActions) return;
    if (phone.matches) menuList.appendChild(themeSwitch);
    else navActions.prepend(themeSwitch);
  };
  placeSwitch();
  phone.addEventListener("change", placeSwitch);
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

  // Раскрывающиеся группы подпунктов. Клик по заголовку группы открывает
  // и закрывает её; при прокрутке группа открывается сама, когда активным
  // становится один из её подпунктов, — иначе подсветка пряталась бы
  // внутри свёрнутого списка.
  const groups = [...caseToc.querySelectorAll('.case-toc-group')];

  const setOpen = (group, open) => {
    const panel = document.getElementById(group.getAttribute('aria-controls'));
    if (!panel) return;
    group.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
  };

  groups.forEach(group => {
    group.addEventListener('click', () => {
      setOpen(group, group.getAttribute('aria-expanded') !== 'true');
    });
  });

  const setActive = (id) => {
    let activeLink = null;
    links.forEach(link => {
      const hit = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', hit);
      if (hit) activeLink = link;
    });

    // Подсветка группы и её раскрытие — по тому, где лежит активный пункт:
    // вошли в раздел группы — она раскрывается, ушли из него (например,
    // вернулись к «Задаче») — сворачивается.
    groups.forEach(group => {
      const panel = document.getElementById(group.getAttribute('aria-controls'));
      const inside = !!(panel && activeLink && panel.contains(activeLink));
      group.classList.toggle('is-active', inside);
      setOpen(group, inside);
    });
  };

  // Бургер оглавления на планшете и телефоне. Список раскрывается внутри
  // прилипшего островка; переход по пункту, клик мимо или Esc закрывают его.
  const caseSide = caseToc.closest('.case-side');
  const caseBurger = document.getElementById('case-burger');

  if (caseSide && caseBurger) {
    const setMenu = (open) => {
      caseSide.classList.toggle('is-open', open);
      caseBurger.classList.toggle('open', open);
      caseBurger.setAttribute('aria-expanded', String(open));
    };

    caseBurger.addEventListener('click', () => {
      setMenu(!caseSide.classList.contains('is-open'));
    });

    links.forEach(link => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('click', (e) => {
      if (caseSide.classList.contains('is-open') && !caseSide.contains(e.target)) setMenu(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });

    // На десктопе оглавление видно всегда — раскрытое состояние сбрасываем,
    // чтобы бургер не вернулся крестиком при сужении окна.
    window.matchMedia('(max-width: 1024px)').addEventListener('change', () => setMenu(false));
  }

  if (sections.length) {
    setActive(sections[0].id);

    // Наблюдатель сообщает только об изменившихся карточках, поэтому
    // видимые копятся здесь: иначе при быстрой прокрутке активной
    // оставалась карточка, которая уже ушла из полосы.
    const inBand = new Set();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) inBand.add(e.target);
        else inBand.delete(e.target);
      });
      // Видимых карточек может быть несколько — берём верхнюю по порядку.
      const top = sections.find(section => inBand.has(section));
      if (top) setActive(top.id);
    }, {
      // Полоса внимания: от 100px под шапкой до нижней трети экрана.
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }
}

// Переключатель состояний экрана на странице кейса. Имя картинки
// собирается из экрана, состояния и темы: images/states/results-error-dark.webp.
// Тема берётся у сайта: переключил сайт в тёмную — экран тоже тёмный.
// Если файла ещё нет, вместо картинки показывается его ожидаемое имя —
// так видно, что положить в папку, не заглядывая в код.
const stateDemos = document.querySelectorAll('.state-demo');

stateDemos.forEach(demo => {
  const img = demo.querySelector('.state-demo-img');
  const missing = demo.querySelector('.state-demo-missing');
  const tabs = [...demo.querySelectorAll('.state-tab')];

  const render = () => {
    const { screen, state } = demo.dataset;
    const theme = document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
    const file = 'images/states/' + screen + '-' + state + '-' + theme + '.webp';
    img.hidden = true;
    missing.textContent = '';
    img.onload = () => { img.hidden = false; missing.textContent = ''; };
    img.onerror = () => { img.hidden = true; missing.textContent = 'Нет файла: ' + file; };
    img.src = file;
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      demo.dataset.state = tab.dataset.state;
      tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      render();
    });
  });

  // Переключатель темы сайта уже обработан выше; здесь только перерисовка.
  themeToggles.forEach(toggle => toggle.addEventListener('click', render));

  render();
});

// Стрелка «от руки» от приветствия к кнопке «написать мне». Слова
// переносятся по-разному на каждой ширине экрана, поэтому кривая строится
// по их реальному положению и перестраивается при изменении размера окна.
// Начало — под «продукты», если слово стоит в последней строке (планшет,
// десктоп); иначе под «на основе», которое там стоит всегда.
const scribble = document.querySelector('.hero-scribble');
const scribbleAnchor = document.querySelector('.hero-anchor');
const scribbleAnchorWide = document.querySelector('.hero-anchor-wide');
const scribbleTarget = document.querySelector('.hero-cta');
const scribbleStatus = document.querySelector('.hero-status');

if (scribble && scribbleAnchor && scribbleTarget) {
  const line = scribble.querySelector('.hero-scribble-line');
  const head = scribble.querySelector('.hero-scribble-head');
  const section = scribble.parentElement;
  const GAP = 3;          // видимый зазор от острия до кнопки
  const CAP = 1;          // скругление штриха выступает за точку на 1px
  const EDGE = 16;        // ближе к краю экрана кривая не подходит

  const drawScribble = () => {
    const base = section.getBoundingClientRect();
    // После посимвольного набора каждая буква — отдельный блок, поэтому
    // собираем их по строкам и берём нижнюю строку слова.
    const lastRow = (el) => {
      const pieces = el ? [...el.getClientRects()].filter(r => r.width > 0) : [];
      if (!pieces.length) return null;
      const bottom = Math.max(...pieces.map(r => r.bottom));
      const row = pieces.filter(r => Math.abs(r.bottom - bottom) < 4);
      return { left: Math.min(...row.map(r => r.left)), bottom };
    };
    const near = lastRow(scribbleAnchor);
    if (!near) return;
    const wide = lastRow(scribbleAnchorWide);
    // «продукты» годится, только если стоит в той же, последней строке.
    const word = wide && Math.abs(wide.bottom - near.bottom) < 4 ? wide : near;
    const btn = scribbleTarget.getBoundingClientRect();
    const status = scribbleStatus ? scribbleStatus.getBoundingClientRect() : null;

    // Острие: середина кнопки по высоте, 3px видимого зазора слева.
    const tx = btn.left - base.left - GAP - CAP;
    const ty = btn.top + btn.height / 2 - base.top;

    // Начало: под первой буквой фразы, чуть ниже строки.
    const sx = word.left - base.left + 6;
    const sy = word.bottom - base.top + 5;

    // Сначала дуга идёт влево почти горизонтально — по просвету между
    // приветствием и строкой статуса, не перечёркивая «Открыт к
    // предложениям», — затем опускается и горизонтально входит в кнопку.
    // Ширина изгиба растёт с высотой, но не ближе EDGE к краю экрана.
    const minX = EDGE - base.left;
    const leftOf = status ? Math.min(status.left - base.left, tx) : tx;
    const bulge = Math.max(36, Math.min(64, ty - sy));
    const c1x = Math.max(minX, Math.min(sx, leftOf) - bulge);
    const c1y = sy + 2;
    const c2x = Math.max(minX, Math.min(sx, leftOf) - bulge * 0.6);
    const c2y = ty;

    // Конец линии чуть не доходит до острия: его накрывает наконечник.
    line.setAttribute('d', `M${sx} ${sy}C${c1x} ${c1y} ${c2x} ${c2y} ${tx - 1.5} ${ty}`);
    // Наконечник постоянного размера: линия у острия горизонтальна.
    head.setAttribute('d', `M${tx - 10} ${ty - 6.5}c3.5 2.2 6.7 4.3 10 6.5-3.3 2.1-6.5 4.3-9.6 7`);
  };

  drawScribble();
  // Шрифт догружается позже и меняет переносы — перерисовываем после него.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawScribble);

  let scribbleFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(scribbleFrame);
    scribbleFrame = requestAnimationFrame(drawScribble);
  });
}
