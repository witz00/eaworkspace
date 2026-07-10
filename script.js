const projectsCount = document.getElementById('projects-count');
if (projectsCount) {
  projectsCount.textContent = '(' + document.querySelectorAll('.project-item').length + ')';
}

// Live ticking clock showing the visitor's own local time and UTC offset
const siteClock = document.getElementById('site-clock');
if (siteClock) {
  function updateSiteClock() {
    const time = new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
    siteClock.textContent = time;
  }

  updateSiteClock();
  setInterval(updateSiteClock, 1000);
}

// Snap only when close (30-40px) to the page-overlay boundary, otherwise scroll stays free
let isProgrammaticScroll = false;
let programmaticScrollTimeout;
const pageOverlay = document.querySelector('.page-overlay');
if (pageOverlay && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const SNAP_THRESHOLD = 40;
  let snapScrollTimeout;

  window.addEventListener('scroll', () => {
    if (isProgrammaticScroll) return;
    clearTimeout(snapScrollTimeout);
    snapScrollTimeout = setTimeout(() => {
      if (isProgrammaticScroll) return;
      const overlayTop = pageOverlay.getBoundingClientRect().top;
      if (overlayTop !== 0 && Math.abs(overlayTop) < SNAP_THRESHOLD) {
        window.scrollBy({ top: overlayTop, behavior: 'smooth' });
      }
    }, 120);
  }, { passive: true });
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

// Custom cursor: a single dot that follows the pointer precisely
const cursorDot = document.getElementById('cursor-dot');

if (cursorDot && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hover');
      playHoverSound();
    });
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
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

document.addEventListener('click', (e) => {
  if (e.target.closest('a, button')) playClickSound();
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    isProgrammaticScroll = true;
    clearTimeout(programmaticScrollTimeout);
    programmaticScrollTimeout = setTimeout(() => {
      isProgrammaticScroll = false;
    }, 900);
  });
});
