/** Efeitos ligados ao scroll: parallax, marquee das frases e rotação da tampa. */
export function initScrollEffects() {
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const rows = [...document.querySelectorAll('[data-marquee]')];
  const spin = document.querySelector('[data-spin]');
  const invite = document.querySelector('.invite');

  // Suaviza o valor alvo (lerp) para movimento fluido
  let target = window.scrollY;
  let current = target;
  let ticking = false;

  const onScroll = () => {
    target = window.scrollY;
    if (!ticking) { ticking = true; requestAnimationFrame(render); }
  };

  function render() {
    current += (target - current) * 0.12;
    const vh = window.innerHeight;

    parallax.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax);
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      el.style.setProperty('--py', `${(current - target + (rect.top - vh / 2)) * -speed * 0.6}px`);
    });

    if (invite) {
      const r = invite.getBoundingClientRect();
      const p = (vh - r.top) / (vh + r.height); // 0 → 1 ao atravessar a secção
      if (p > -0.1 && p < 1.1) {
        rows.forEach((row) => {
          const dir = parseFloat(row.dataset.marquee);
          row.style.transform = `translate3d(${dir * (p - 0.5) * 38}vw, 0, 0)`;
        });
        if (spin) spin.style.transform = `rotate(${p * 200 - 40}deg) scale(${0.85 + Math.sin(p * Math.PI) * 0.2})`;
      }
    }

    ticking = Math.abs(target - current) > 0.5;
    if (ticking) requestAnimationFrame(render);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  render();
}
