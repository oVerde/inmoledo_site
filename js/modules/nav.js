/** Header: esconde ao descer, mostra ao subir, destaca secção ativa e controla o menu mobile. */
export function initNav() {
  const header = document.getElementById('header');
  const menu = document.getElementById('mobileMenu');
  const openBtn = document.getElementById('menuOpen');
  const closeBtn = document.getElementById('menuClose');

  // Esconder/mostrar header
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('is-hidden', y > lastY && y > 300 && !document.body.classList.contains('menu-open'));
    lastY = y;
  }, { passive: true });

  // Menu mobile
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  openBtn.addEventListener('click', () => setMenu(true));
  closeBtn.addEventListener('click', () => setMenu(false));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  // Link ativo conforme secção visível
  const links = [...document.querySelectorAll('.header__nav a')];
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.remove('is-active'));
      map.get(entry.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['home', 'onde'].forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
}
