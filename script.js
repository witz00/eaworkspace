const projectsCount = document.getElementById('projects-count');
if (projectsCount) {
  projectsCount.textContent = '(' + document.querySelectorAll('.project-item').length + ')';
}

const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-footer');

function applyTheme(isLight) {
  document.documentElement.classList.toggle('light-theme', isLight);
  themeToggles.forEach(t => {
    t.classList.toggle('on', isLight);
    t.setAttribute('aria-pressed', String(isLight));
  });
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

// Custom eased smooth scroll (softer than the native scroll-behavior easing)
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetY, duration = 900) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Custom cursor: a single ring that eases toward the pointer with an invert (negative) blend
const cursorRing = document.getElementById('cursor-ring');

if (cursorRing && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('hover');
      playHoverSound();
    });
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
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

document.querySelectorAll('a[href*="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const url = new URL(link.href, window.location.href);
    const hash = url.hash;
    if (!hash) return;
    const isSamePage = url.pathname === window.location.pathname;
    const target = document.querySelector(hash);
    if (isSamePage && target) {
      e.preventDefault();
      smoothScrollTo(target.getBoundingClientRect().top + window.scrollY);
    }
  });
});
