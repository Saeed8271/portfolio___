// Homepage About: the timeline line and square markers fill as you scroll.
// Without JS (or with reduced motion) everything simply shows filled.
(() => {
  const list = document.querySelector('[data-story-timeline]');
  if (!list) return;
  const items = [...list.querySelectorAll('.milestone')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!items.length || reduce) return;

  document.documentElement.classList.add('js');

  let ticking = false;
  const update = () => {
    ticking = false;
    const trigger = window.innerHeight * 0.68;       // point on screen that "fills" the line
    const rect = list.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (trigger - rect.top) / rect.height));
    list.style.setProperty('--tl', progress.toFixed(3));
    items.forEach((li) => {
      li.classList.toggle('is-active', li.getBoundingClientRect().top + 30 < trigger);
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
