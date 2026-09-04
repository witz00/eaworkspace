// Приветствие набирается по символу. Раньше это делали три @keyframes с
// зашитым числом знаков в строке — такой приём держится только на тексте,
// который не переносится. Абзац переносится, поэтому набор считается здесь.
const heroTyped = document.querySelector('.hero-typed');
if (heroTyped && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const CHAR_DELAY = 26;
  const START_DELAY = 500;
  // Каждый символ — отдельный span: текст занимает финальную ширину сразу,
  // поэтому переносы не пересчитываются и каретка не дёргает строку.
  // Готовые элементы внутри (эмодзи) проявляются как один символ.
  const chars = [];
  [...heroTyped.childNodes].forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      [...node.textContent].forEach(char => {
        const span = document.createElement('span');
        span.className = 'hero-char';
        span.textContent = char;
        chars.push(span);
      });
    } else {
      node.classList.add('hero-char');
      chars.push(node);
    }
  });
  heroTyped.textContent = '';
  chars.forEach(span => heroTyped.appendChild(span));

  let shown = 0;
  const revealNext = () => {
    chars[shown++].classList.add('hero-char--on');
    if (shown < chars.length) setTimeout(revealNext, CHAR_DELAY);
  };
  setTimeout(revealNext, START_DELAY);
}

const navBar = document.querySelector('.nav-bar');
if (navBar) {
  // Два разных порога: островок собирается на 32px и разбирается только на 8px.
  // При одном пороге дрожание трекпада вокруг него гоняло анимацию туда-обратно.
  const COLLAPSE_AT = 32;
  const EXPAND_AT = 8;
  let isScrolled = false;
  let ticking = false;

  const updateNavBarScrolled = () => {
    ticking = false;
    const y = window.scrollY;
    const next = isScrolled ? y > EXPAND_AT : y > COLLAPSE_AT;
    if (next === isScrolled) return;
    isScrolled = next;
    navBar.classList.toggle('nav-bar--scrolled', next);
  };

  // Состояние считается раз в кадр, а не на каждое событие скролла.
  const requestNavBarUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateNavBarScrolled);
  };

  updateNavBarScrolled();
  window.addEventListener('scroll', requestNavBarUpdate, { passive: true });
}

const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-footer');

const themeColorMeta = document.getElementById('theme-color-meta');

function applyTheme(isLight) {
  document.documentElement.classList.toggle('light-theme', isLight);
  themeToggles.forEach(t => {
    t.classList.toggle('on', isLight);
    t.setAttribute('aria-pressed', String(isLight));
  });
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', isLight ? '#FFFFFF' : '#000000');
  }
}

applyTheme(localStorage.getItem('theme') === 'light');

themeToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const isLight = !document.documentElement.classList.contains('light-theme');
    applyTheme(isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
});

const navBurger = document.getElementById('nav-burger');
const navLinks = document.querySelector('.nav-links');

if (navBurger && navLinks) {
  const navLinksPlaceholder = document.createComment('nav-links-anchor');
  navLinks.after(navLinksPlaceholder);

  const closeMenu = () => {
    navBurger.classList.remove('open');
    navLinks.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    navLinksPlaceholder.after(navLinks);
  };

  navBurger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navBurger.classList.toggle('open', isOpen);
    navBurger.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      document.body.appendChild(navLinks);
    } else {
      navLinksPlaceholder.after(navLinks);
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

// Click / hover sounds (real audio files, kept quiet and non-blocking)
const clickAudio = new Audio('sounds/click.wav');
const hoverAudio = new Audio('sounds/hover.wav');
clickAudio.volume = 0.4;
hoverAudio.volume = 0.25;

function playClickSound() {
  clickAudio.currentTime = 0;
  clickAudio.play().catch(() => {});
}

function playHoverSound() {
  hoverAudio.currentTime = 0;
  hoverAudio.play().catch(() => {});
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
  if (target && !target.contains(e.relatedTarget)) playHoverSound();
});

