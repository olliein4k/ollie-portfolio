/* ═══════════════════════════════════════════════
   OLLIE NEBEL — PORTFOLIO · PHASE 1
   script.js — nav, scroll reveals, starfield
════════════════════════════════════════════════ */

// // ── NAV VISIBILITY ──────────────────────────────
// const nav = document.getElementById('nav');

// function updateNav() {
//   if (window.scrollY > window.innerHeight * 0.6) {
//     nav.classList.add('visible');
//   } else {
//     nav.classList.remove('visible');
//   }
// }

// window.addEventListener('scroll', updateNav, { passive: true });

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
      revealObserver.unobserve(entry.target); // fire once only
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// // ── STARFIELD CANVAS ────────────────────────────
// function initStarfield(canvasId) {
//   const canvas = document.getElementById(canvasId);
//   if (!canvas) return;

//   const ctx    = canvas.getContext('2d');
//   let   W, H, stars;

//   function resize() {
//     W = canvas.width  = canvas.offsetWidth;
//     H = canvas.height = canvas.offsetHeight;
//   }

//   function makeStars(count) {
//     return Array.from({ length: count }, () => ({
//       x:       Math.random() * W,
//       y:       Math.random() * H,
//       r:       Math.random() * 1.2 + 0.2,
//       speed:   Math.random() * 0.25 + 0.05,
//       opacity: Math.random() * 0.7 + 0.15,
//       twinkle: Math.random() * Math.PI * 2,
//     }));
//   }

//   let raf;

//   function draw(ts) {
//     ctx.clearRect(0, 0, W, H);

//     stars.forEach(s => {
//       s.twinkle += 0.008;
//       const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle));

//       ctx.beginPath();
//       ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
//       ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
//       ctx.fill();

//       // very slow drift downward
//       s.y += s.speed;
//       if (s.y > H + 2) {
//         s.y = -2;
//         s.x = Math.random() * W;
//       }
//     });

//     raf = requestAnimationFrame(draw);
//   }

//   function init() {
//     resize();
//     stars = makeStars(160);
//     cancelAnimationFrame(raf);
//     draw(0);
//   }

//   init();

//   const ro = new ResizeObserver(init);
//   ro.observe(canvas.parentElement || canvas);
// }

// // Boot both starfields
// document.addEventListener('DOMContentLoaded', () => {
//   initStarfield('starfield');
//   initStarfield('contact-starfield');

//   // Run nav state on load
//   updateNav();
//   updateActiveLink();
// });