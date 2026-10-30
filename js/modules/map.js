/**
 * Mapa vetorial de Moledo (MapLibre + OpenFreeMap).
 * Linhas na cor --milky, fundo transparente.
 * Animação: o mapa abre em círculo a partir do pin ao entrar no ecrã
 * e fecha de volta ao pin quando sai.
 */
const COORDS = [-8.864169241759338, 41.84750830512818]; // [lng, lat]

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${COORDS[1]},${COORDS[0]}`;

/** Garante que o pin abre o Google Maps, seja um <a> ou um <span>. */
function initPinLink(pin) {
  pin.style.cursor = 'pointer';
  pin.style.zIndex = '2';
  if (pin.tagName === 'A') {
    pin.href = MAPS_URL;
    pin.target = '_blank';
    pin.rel = 'noopener';
    return;
  }
  pin.setAttribute('role', 'link');
  pin.setAttribute('tabindex', '0');
  pin.removeAttribute('aria-hidden');
  pin.setAttribute('aria-label', 'Visite-nos: abrir localização no Google Maps');
  const open = () => window.open(MAPS_URL, '_blank', 'noopener');
  pin.addEventListener('click', open);
  pin.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open()));
}

export function initMap() {
  const el = document.getElementById('mapaMoledo');
  const pin = document.querySelector('.where__pin');
  if (pin) initPinLink(pin);
  if (!el || !pin || !window.maplibregl) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const milky =
    getComputedStyle(document.documentElement).getPropertyValue('--milky').trim() || '#edd99f';

  const line = (id, layer, paint, extra = {}) => ({
    id,
    type: 'line',
    source: 'omt',
    'source-layer': layer,
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': milky, ...paint },
    ...extra,
  });

  const style = {
    version: 8,
    sources: { omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } },
    layers: [
      // sem layer "background" => fundo transparente
      line('agua', 'water', { 'line-width': 1.5 }),
      line('rios', 'waterway', { 'line-width': 1.2 }),
      line('edificios', 'building', { 'line-width': 0.8, 'line-opacity': 0.6 }, { minzoom: 14 }),
      line(
        'estradas',
        'transportation',
        {
          'line-width': [
            'match', ['get', 'class'],
            ['motorway', 'trunk', 'primary'], 3,
            ['secondary', 'tertiary'], 2.2,
            1.3,
          ],
        },
        { filter: ['!in', 'class', 'rail', 'transit', 'path'] }
      ),
      line(
        'caminhos',
        'transportation',
        { 'line-width': 0.8, 'line-dasharray': [2, 2] },
        { filter: ['==', 'class', 'path'] }
      ),
    ],
  };

  const map = new maplibregl.Map({
    container: el,
    style,
    center: COORDS,
    zoom: 16,
    interactive: false,
    attributionControl: false,
  });

  map.addControl(
    new maplibregl.AttributionControl({
      compact: true,
      customAttribution:
        '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }),
    'bottom-right'
  );

  // Centro do pin existente = coordenadas; e origem da máscara de abertura
  const align = () => {
    map.resize();
    map.jumpTo({ center: COORDS });
    const p = map.project(COORDS);
    const m = el.getBoundingClientRect();
    const r = pin.getBoundingClientRect();
    const cx = r.left + r.width / 2 - m.left;
    const cy = r.top + r.height / 2 - m.top;
    map.panBy([p.x - cx, p.y - cy], { animate: false });
    el.style.setProperty('--mx', `${cx}px`);
    el.style.setProperty('--my', `${cy}px`);
  };

  map.on('load', align);
  window.addEventListener('resize', align);

  // Entrada / saída: a máscara só é ligada aqui (se este JS não correr, o mapa fica sempre visível)
  if (reduceMotion) return;
  el.classList.add('has-reveal');

  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
        el.classList.add('is-revealed');
      } else if (!entry.isIntersecting) {
        el.classList.remove('is-revealed');
      }
    },
    { threshold: [0, 0.25] }
  ).observe(el);
}
