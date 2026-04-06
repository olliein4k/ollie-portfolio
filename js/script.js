
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
  document.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

// ── HAMBURGER MENU ───────────────────────────────
function initHamburger() {
  const btn   = document.getElementById('nav-hamburger');
  const panel = document.getElementById('nav-mobile-panel');
  if (!btn || !panel) return;

  function closeMenu() {
    btn.classList.remove('open');
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      btn.classList.add('open');
      panel.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close menu when a link is tapped
  panel.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#nav')) closeMenu();
  });
}

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
  const STAGGER  = 100;   // ms between each character starting
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

// ── TAP FEEDBACK ─────────────────────────────────
function initTapFeedback() {
  const HOLD_MS = 300; // how long the tapped state stays visible

  const targets = document.querySelectorAll(
    '.project-card, .achievement-card, .contact-btn, .btn-primary, .btn-ghost'
  );

  targets.forEach(el => {
    el.addEventListener('touchstart', () => {
      el.classList.add('tapped');
    }, { passive: true });

    el.addEventListener('touchend', () => {
      // Keep the tapped state briefly so the user sees it
      setTimeout(() => el.classList.remove('tapped'), HOLD_MS);
    }, { passive: true });

    el.addEventListener('touchcancel', () => {
      el.classList.remove('tapped');
    }, { passive: true });
  });
}

// ── NEWS TICKER ──────────────────────────────────
async function initTicker() {
  const track        = document.getElementById('ticker-track');
  if (!track) return;

  const CACHE_KEY    = 'ticker_cache';
  const CACHE_TTL    = 30 * 60 * 1000;             // 30 minutes in ms
  const FEED_URL     = 'https://www.space.com/feeds.xml';
  const PROXY     = 'https://go.x2u.in/proxy?email=ollie.nebel@caterhamschool.co.uk&apiKey=34ae6a39&url=';
  const BLOCKED_CATS = ['entertainment'];
  const SCROLL_PPS   = 50;                          // pixels per second — lower = slower

  // ── 1. Read cache ──
  let headlines = [];
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      headlines = cached.data;
    }
  } catch (_) {}

  // ── 2. Fetch if cache is stale ──
  if (!headlines.length) {
    try {
      const res  = await fetch(PROXY + encodeURIComponent(FEED_URL));
      const text = await res.text();
      const xml  = new DOMParser().parseFromString(text, 'text/xml');      const items = [...xml.querySelectorAll('item')];

      headlines = items
        .filter(item => {
          const cats = [...item.querySelectorAll('category')]
            .map(c => c.textContent.trim().toLowerCase());
          return !cats.some(c => BLOCKED_CATS.includes(c));
        })
        .slice(0, 20)
        .map(item => ({
          title: item.querySelector('title')?.textContent?.trim() || '',
          link:  item.querySelector('link')?.textContent?.trim()  || '#',
        }))
        .filter(h => h.title);

      // ── 3. Save to cache ──
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: headlines }));
    } catch (err) {
      console.warn('Ticker fetch failed:', err);
      return;
    }
  }

  if (!headlines.length) return;

  // ── 4. Build one copy of all headlines ──
  function buildCopy() {
    const copy = document.createElement('span');
    copy.className = 'ticker-copy';
    headlines.forEach((h, i) => {
      const span = document.createElement('span');
      span.className = 'ticker-headline';
      const a = document.createElement('a');
      a.href        = h.link;
      a.target      = '_blank';
      a.rel         = 'noopener noreferrer';
      a.textContent = h.title;
      span.appendChild(a);
      copy.appendChild(span);
      if (i < headlines.length - 1) {
        const sep = document.createElement('span');
        sep.className   = 'ticker-sep';
        sep.textContent = '✦';
        copy.appendChild(sep);
      }
    });
    return copy;
  }

  // ── 5. Inject two identical copies for seamless loop ──
  const copyA     = buildCopy();
  const bridgeSep = document.createElement('span');
  bridgeSep.className   = 'ticker-sep';
  bridgeSep.textContent = '✦';
  const copyB = buildCopy();

  track.appendChild(copyA);
  track.appendChild(bridgeSep);
  track.appendChild(copyB);

  // ── 6. Calculate duration from content width then start ──
  requestAnimationFrame(() => {
    const totalWidth = copyA.offsetWidth + bridgeSep.offsetWidth;
    const duration   = Math.round(totalWidth / SCROLL_PPS);
    track.style.setProperty('--ticker-duration', `${duration}s`);
    track.classList.add('running');
  });
}

// ── TICKER COLLAPSE ──────────────────────────────
function initTickerToggle() {
  const ticker = document.getElementById('news-ticker');
  const btn    = document.getElementById('ticker-toggle');
  const nav    = document.getElementById('nav');
  if (!ticker || !btn || !nav) return;

  const STORAGE_KEY = 'ticker_collapsed';

  function syncTickerHeight() {
    document.body.style.setProperty('--ticker-height', `${ticker.offsetHeight}px`);
  }

  function setCollapsed(collapsed) {
    ticker.classList.toggle('collapsed', collapsed);
    nav.classList.toggle('ticker-collapsed', collapsed);
    btn.classList.toggle('ticker-collapsed', collapsed);
    document.body.classList.toggle('ticker-collapsed', collapsed);
    syncTickerHeight();
    btn.setAttribute('aria-label', collapsed ? 'Expand news ticker' : 'Collapse news ticker');
    localStorage.setItem(STORAGE_KEY, collapsed);
  }

  syncTickerHeight();

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(syncTickerHeight);
    resizeObserver.observe(ticker);
  } else {
    window.addEventListener('resize', syncTickerHeight, { passive: true });
  }

  // Restore saved state
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    setCollapsed(true);
  } else {
    syncTickerHeight();
  }

  btn.addEventListener('click', () => {
    setCollapsed(!ticker.classList.contains('collapsed'));
  });
}

// ── BOOT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTicker();
  initTickerToggle();
  initHeroReveal();
  initCursor();
  initTimelineDraw();
  initStarfield('starfield');
  initStarfield('contact-starfield');
  initHamburger();
  initTapFeedback();
  updateNav();
  updateActiveLink();
});