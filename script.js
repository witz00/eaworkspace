const projectsCount = document.getElementById('projects-count');
if (projectsCount) {
  projectsCount.textContent = '(' + document.querySelectorAll('.project-item').length + ')';
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

// "ПЕРЕЙТИ" label that follows the pointer when hovering a project card
const cursorLabel = document.getElementById('cursor-label');

if (cursorLabel && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorLabel.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mouseenter', () => cursorLabel.classList.add('visible'));
    card.addEventListener('mouseleave', () => cursorLabel.classList.remove('visible'));
  });
}

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => playHoverSound());
});

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

// Curtain transition on full-page navigations: logo back to home, project cards into a case
const pageCurtain = document.getElementById('page-curtain');
if (pageCurtain) {
  const CURTAIN_DURATION = 1100; // one half's rise/exit transition
  const CURTAIN_STAGGER = 300;   // delay before the second half follows the first
  const CURTAIN_HOLD = 500;      // both halves held together, fully covering, before exiting
  const CURTAIN_RISE_TOTAL = CURTAIN_DURATION + CURTAIN_STAGGER;

  // Entrance: page loads already covered (continuing where the previous page left off),
  // then both halves exit upward, staggered, same as the rise.
  pageCurtain.classList.add('curtain-in');
  void pageCurtain.offsetWidth; // force the covered, transition-less state to commit before enabling transitions
  pageCurtain.classList.add('curtain-animate');
  void pageCurtain.offsetWidth; // force the layer promotion (will-change) to settle before the transform change starts
  requestAnimationFrame(() => {
    pageCurtain.classList.remove('curtain-in');
    pageCurtain.classList.add('curtain-out');
  });

  document.querySelectorAll('.nav-logo, .proj-card').forEach(curtainLink => {
    if (curtainLink.tagName !== 'A') return;
    curtainLink.addEventListener('click', (e) => {
      const href = curtainLink.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      // Snap back below the viewport (no transition) so the rise always starts from the bottom
      pageCurtain.classList.remove('curtain-animate', 'curtain-in', 'curtain-out');
      void pageCurtain.offsetWidth;
      pageCurtain.classList.add('curtain-animate');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => pageCurtain.classList.add('curtain-in'));
      });
      // Navigate once both halves have arrived and held together for CURTAIN_HOLD
      setTimeout(() => {
        window.location.href = href;
      }, CURTAIN_RISE_TOTAL + CURTAIN_HOLD);
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    isProgrammaticScroll = true;
    clearTimeout(programmaticScrollTimeout);
    programmaticScrollTimeout = setTimeout(() => {
      isProgrammaticScroll = false;
    }, 900);
  });
});