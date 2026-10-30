import { initNav } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initScrollEffects } from './modules/scroll-effects.js';
import { initCounters } from './modules/counters.js';
import { initLang } from './modules/lang.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initNav();
initReveal();
initCounters(reduceMotion);
initLang();
if (!reduceMotion) initScrollEffects();
