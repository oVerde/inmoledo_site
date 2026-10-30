/** Alternância PT/EN simples (extensível). */
const dict = {
  en: {
    '.header__nav a:nth-child(1)': 'Home',
    '.header__nav a:nth-child(2)': 'About',
    '.header__nav a:nth-child(3)': 'Contact',
    '.hero__title': 'A little<br>about us!',
    '.hero__text': 'We are a company offering bakery, café and tobacconist services. Based in Moledo do Minho, waiting for you!',
    '.where h2': 'Where can<br>you find us?',
    '.where p': 'We are in the heart of Moledo do Minho, a few steps from the beach. Drop by for a coffee, a house pastry or your daily paper.',
    '.invite__cta span': 'You will be very welcome!',
    '.footer__title': 'Thank you<br>for visiting!',
  },
};

export function initLang() {
  const btn = document.getElementById('langToggle');
  const original = {};
  let lang = 'pt';

  btn.addEventListener('click', () => {
    lang = lang === 'pt' ? 'en' : 'pt';
    document.documentElement.lang = lang;
    btn.innerHTML = lang === 'pt' ? '<b>PT</b>/EN' : 'PT/<b>EN</b>';
    Object.entries(dict.en).forEach(([sel, text]) => {
      const el = document.querySelector(sel);
      if (!el) return;
      original[sel] ??= el.innerHTML;
      el.innerHTML = lang === 'en' ? text : original[sel];
    });
  });
}
