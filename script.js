const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

/* hero name: one span per letter so they can rise in sequence */
const heroName = document.getElementById('heroName');
heroName.innerHTML = [...heroName.textContent.trim()]
  .map((c, i) => `<span class="ch" aria-hidden="true" style="--d:${60 + i * 40}ms">${c}</span>`)
  .join('');

/* marquees: duplicate the items once so the -50% loop is seamless */
document.querySelectorAll('[data-marquee]').forEach((track) => {
  [...track.children].forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((img) => (img.alt = ''));
    track.appendChild(clone);
  });
});

/* preloader */
const preloader = document.getElementById('preloader');
const plNum = document.getElementById('plNum');
function start() {
  preloader.classList.add('done');
  root.classList.add('go');
}
if (reduceMotion || getComputedStyle(preloader).display === 'none') {
  start();
} else {
  const t0 = performance.now();
  const dur = 900;
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    plNum.textContent = Math.round(p * 100);
    if (p < 1) requestAnimationFrame(tick);
    else start();
  })(t0);
  setTimeout(start, 2500);
}

/* mobile menu */
const burger = document.getElementById('burger');
const mmenu = document.getElementById('mmenu');
function setMenu(open) {
  burger.classList.toggle('open', open);
  mmenu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  mmenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}
burger.addEventListener('click', () => setMenu(!mmenu.classList.contains('open')));
mmenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

/* smooth anchor scrolling */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

/* count-up for the stats */
function countUp(el) {
  const to = Number(el.dataset.count);
  if (reduceMotion) return;
  const t0 = performance.now();
  const dur = 1300;
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * to);
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

/* scroll reveals */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      entry.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
);
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
