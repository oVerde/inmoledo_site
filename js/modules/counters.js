/** Contadores animados nas estatísticas do hero. */
export function initCounters(reduceMotion) {
  const els = document.querySelectorAll('[data-count]');
  if (reduceMotion) return;

  const run = (el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const start = performance.now();
    const duration = 1800;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = (end * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach((el) => { el.textContent = '0'; io.observe(el); });
}
