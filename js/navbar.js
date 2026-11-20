// Mobile navigation — no HTML fetching or duplicate templates.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); };
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded',String(open)); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click',close));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
}

// Animated header logo: types "SA." -> "SAEED ANWAR." and back. Header only.
(() => {
  const logo = document.querySelector('.site-header [data-logo-animation]');
  if (!logo || logo.dataset.logoReady === 'true') return;   // never initialise twice
  logo.dataset.logoReady = 'true';

  const typed = logo.querySelector('.logo__typed');
  if (!typed) return;

  const BASE = 'SA';
  const FULL = 'SAEED ANWAR';
  const MAX = FULL.length - BASE.length;
  const T = { holdShort: 2000, holdFull: 3200, pauseAfterErase: 500, type: 105, jitter: 30, wordGap: 150, erase: 55, typeGlide: 140, eraseGlide: 100 };

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer = null, raf = 0, count = 0, phase = 'hold-short', running = false;

  // Width of the first n characters, measured on one text node so kerning matches the full name.
  function widthFor(n) {
    const node = typed.firstChild;
    if (!node) return 0;
    const range = document.createRange();
    range.setStart(node, 0);
    range.setEnd(node, n);
    return range.getBoundingClientRect().width;
  }
  function applyWidth(animate, ms) {
    if (!animate) typed.style.transition = 'none';
    else typed.style.setProperty('--logo-ms', ms + 'ms');
    typed.style.width = widthFor(BASE.length + count).toFixed(2) + 'px';
    if (!animate) { void typed.offsetWidth; typed.style.transition = ''; }
  }

  const wait = (fn, ms) => { timer = window.setTimeout(fn, ms); };
  const typing = on => logo.classList.toggle('is-typing', on);

  function step() {
    if (phase === 'hold-short') {
      typing(false);
      phase = 'typing';
      wait(step, T.holdShort);
    } else if (phase === 'typing') {
      typing(true);
      count += 1; applyWidth(true, T.typeGlide);
      if (count >= MAX) { phase = 'hold-full'; wait(step, T.typeGlide); return; }
      const gap = FULL[BASE.length + count] === ' ' ? T.wordGap : 0;
      wait(step, T.type + gap + Math.round(Math.random() * T.jitter));
    } else if (phase === 'hold-full') {
      typing(false);
      phase = 'erasing';
      wait(step, T.holdFull);
    } else if (phase === 'erasing') {
      typing(true);
      count -= 1; applyWidth(true, T.eraseGlide);
      if (count <= 0) { phase = 'hold-short'; wait(() => { typing(false); step(); }, T.pauseAfterErase); return; }
      wait(step, T.erase);
    }
  }

  function start() {
    if (running) return;
    running = true;
    logo.classList.add('is-active');
    count = 0; phase = 'hold-short';
    typed.textContent = FULL;      // full name sits inside the clipping window...
    applyWidth(false);             // ...which is set to "SA" in the same frame (no flash)
    step();
  }
  function stop() {
    running = false;
    window.clearTimeout(timer);
    window.cancelAnimationFrame(raf);
    logo.classList.remove('is-active', 'is-typing');
    count = 0; phase = 'hold-short';
    typed.textContent = BASE;      // back to static "SA."
    typed.style.width = '';
  }
  function sync() { (motion.matches || document.hidden) ? stop() : start(); }

  // Font-size changes at breakpoints: re-measure without animating.
  window.addEventListener('resize', () => {
    if (!running) return;
    window.cancelAnimationFrame(raf);
    raf = window.requestAnimationFrame(() => applyWidth(false));
  });
  // If a web font finishes loading after we measured, re-measure so the window matches the real glyphs.
  if (document.fonts && document.fonts.addEventListener) {
    document.fonts.addEventListener('loadingdone', () => { if (running) applyWidth(false); });
  }
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);

  // Begin once web fonts are ready so measurements use final metrics.
  const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([ready, new Promise(r => window.setTimeout(r, 1500))]).then(sync);
})();

// Mobile menu: add a "Let's Talk" button under the links (hidden on desktop by CSS).
(() => {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.menu-toggle');
  if (!nav || nav.querySelector('.site-nav__cta')) return;   // never add twice
  const cta = document.createElement('a');
  cta.className = 'site-nav__cta';
  cta.href = 'contact.html';
  cta.append("Let's Talk ");
  const arrow = document.createElement('span');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '\u2197';
  cta.append(arrow);
  cta.addEventListener('click', () => {
    nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
  nav.appendChild(cta);
})();

// Navbar polish: scroll progress bar (drives --scroll on the header) and click-outside to close the mobile menu.
(() => {
  const header = document.querySelector('.site-header');
  if (!header || header.dataset.navPolish === 'true') return;   // never bind twice
  header.dataset.navPolish = 'true';

  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    header.style.setProperty('--scroll', p.toFixed(4));
  };
  const onScroll = () => { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  const nav = header.querySelector('.site-nav');
  const toggle = header.querySelector('.menu-toggle');
  if (nav && toggle) {
    document.addEventListener('click', e => {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }
})();