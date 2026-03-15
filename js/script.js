
// ── NAV VISIBILITY ──────────────────────────────
const nav = document.getElementById('nav');

function updateNav() {
  if (window.scrollY > window.innerHeight * 0.6) {
    nav.classList.add('visible');
  } else {
    nav.classList.remove('visible');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });

// ── ACTIVE NAV LINK ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

// ── SCROLL REVEAL ───────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ── HERO TEXT REVEAL ────────────────────────────
function initHeroReveal() {
  const CHARS    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  const STAGGER  = 80;   // ms between each character starting
  const DURATION = 600;  // ms of scrambling before resolving
  const RATE     = 40;   // ms between scramble frame updates

  const lines = document.querySelectorAll('.hero-name .line');

  lines.forEach((line, lineIdx) => {
    const text = line.textContent.trim();
    line.textContent = '';

    [...text].forEach((finalChar, charIdx) => {
      const span = document.createElement('span');
      span.classList.add('hero-char');
      span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
      line.appendChild(span);

      // Stagger start: line 2 begins after line 1 finishes
      const startDelay = (lineIdx * text.length * STAGGER) + (charIdx * STAGGER);

      setTimeout(() => {
        span.classList.add('hero-char--active');
        const endTime = performance.now() + DURATION;

        function scramble() {
          if (performance.now() < endTime) {
            span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
            setTimeout(scramble, RATE);
          } else {
            span.textContent = finalChar;
            span.classList.add('hero-char--resolved');
          }
        }

        scramble();
      }, startDelay);
    });
  });

  // Last char of NEBEL starts at (1×5×80)+(4×80) = 720ms, resolves at 720+600 = 1320ms
  const afterName = 1420;
  [
    { selector: '.hero-label',       extra: 0   },
    { selector: '.hero-sub',         extra: 120 },
    { selector: '.hero-cta',         extra: 260 },
    { selector: '.hero-coords', extra: 360, cls: 'hero-fade-up-centred' },
    { selector: '.scroll-indicator', extra: 400 },
  ].forEach(({ selector, extra, cls }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add(cls);
    el.style.animationDelay = `${afterName + extra}ms`;
  });
}

// ── COUNTER ANIMATIONS ───────────────────────────
function animateCounter(el) {
  const raw     = el.textContent.trim();
  const hasPlus = raw.includes('+');
  const target  = parseInt(raw.replace('+', ''), 10);
  if (isNaN(target)) return;

  const duration  = 1400;
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    el.textContent = Math.round(eased * target) + (hasPlus ? '+' : '');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ── CUSTOM CURSOR ────────────────────────────────
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch

  const dot  = document.createElement('div'); dot.id  = 'cursor-dot';
  const ring = document.createElement('div'); ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  });

  (function animateRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll(
    'a, button, .project-card, .achievement-card, .contact-btn, .skill-tag'
  ).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('cursor--hover');
      ring.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('cursor--hover');
      ring.classList.remove('cursor--hover');
    });
  });

  document.body.classList.add('custom-cursor-active');
}

// ── TIMELINE DRAW ────────────────────────────────
function initTimelineDraw() {
  const timeline = document.querySelector('#experience .timeline');
  if (!timeline) return;

  const progressLine = document.createElement('div');
  progressLine.classList.add('tl-draw-line');
  timeline.prepend(progressLine);

  function updateDraw() {
    const rect    = timeline.getBoundingClientRect();
    const raw     = (window.innerHeight * 0.72 - rect.top) / rect.height;
    const clamped = Math.max(0, Math.min(1, raw));
    progressLine.style.height = `${clamped * 100}%`;
  }

  window.addEventListener('scroll', updateDraw, { passive: true });
  updateDraw();
}

// ── STARFIELD CANVAS ────────────────────────────
function initStarfield(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, stars, raf;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeStars(count) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.7 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.twinkle += 0.008;
      const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
      ctx.fill();
      s.y += s.speed;
      if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
    });
    raf = requestAnimationFrame(draw);
  }

  function init() {
    resize(); stars = makeStars(160);
    cancelAnimationFrame(raf); draw();
  }

  init();
  new ResizeObserver(init).observe(canvas.parentElement || canvas);
}

// ── BOOT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeroReveal();
  initCursor();
  initTimelineDraw();
  initStarfield('starfield');
  initStarfield('contact-starfield');
  updateNav();
  updateActiveLink();
});