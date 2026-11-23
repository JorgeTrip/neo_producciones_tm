/**
 * Módulo de Retorno al Pie y Transición Crossfade - NEO Producciones.
 * Al volver desde páginas legales regresa al scroll exacto guardado o al #footer,
 * evitando remitir al inicio del sitio, con crossfade nativo o fallback por opacidad.
 */

export const CLAVE_SCROLL_RETORNO = 'neo_retorno_scroll_y';
export const CLAVE_DESTINO_RETORNO = 'neo_retorno_destino';
export const CLAVE_FADE_ENTRADA = 'neo_transicion_fade_entrada';

let salidaRegistrada = false;

function obtenerStorageSeguro() {
  try {
    return typeof sessionStorage !== 'undefined' ? sessionStorage : null;
  } catch {
    return null;
  }
}

function soportaViewTransitionNativo() {
  return (
    typeof window !== 'undefined' &&
    'onpagereveal' in window &&
    window.location?.protocol !== 'file:'
  );
}

/** Valida que el scroll recuperado sea un entero finito no negativo. */
export function validarScrollGuardado(valorCrudo) {
  if (typeof valorCrudo !== 'string' || !valorCrudo.trim()) return null;
  const numero = Number(valorCrudo);
  if (!Number.isFinite(numero) || numero < 0) return null;
  return Math.round(numero);
}

/** Restringe el destino de retorno a una lista blanca local para evitar Open Redirect. */
export function resolverDestinoSeguro(valorCrudo) {
  return valorCrudo === './' ? './' : 'index.html';
}

function resolverEnlaceLegalSeguro(href) {
  if (typeof href !== 'string') return null;
  const rutaBase = href.split('#')[0].split('?')[0].trim().toLowerCase();
  if (!rutaBase || rutaBase.startsWith('http://') || rutaBase.startsWith('https://')) {
    return null;
  }
  if (rutaBase === 'privacidad.html' || rutaBase.endsWith('/privacidad.html')) return 'privacidad.html';
  if (rutaBase === 'terminos.html' || rutaBase.endsWith('/terminos.html')) return 'terminos.html';
  return null;
}

/** Determina si un href apunta a alguna de las páginas legales internas del sitio. */
export function esEnlacePaginaLegal(href) {
  return resolverEnlaceLegalSeguro(href) !== null;
}

function aplicarScrollInstantaneo(scrollY) {
  if (typeof window === 'undefined' || typeof window.scrollTo !== 'function') return;
  try {
    window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
  } catch {
    const raiz = typeof document !== 'undefined' ? document.documentElement : null;
    const previo = raiz ? raiz.style.scrollBehavior : '';
    if (raiz) raiz.style.scrollBehavior = 'auto';
    window.scrollTo(0, scrollY);
    if (raiz) raiz.style.scrollBehavior = previo;
  }
}

function irAlFondoFooter() {
  const pie = typeof document !== 'undefined' ? document.getElementById('footer') : null;
  if (pie && typeof pie.scrollIntoView === 'function') {
    try {
      pie.scrollIntoView({ behavior: 'instant', block: 'end' });
      return;
    } catch {
      pie.scrollIntoView(false);
      return;
    }
  }
  const altura = typeof document !== 'undefined' ? document.documentElement?.scrollHeight || 0 : 0;
  aplicarScrollInstantaneo(altura);
}

function navegarConFadeFallback(evento, urlDestino, storage) {
  if (!urlDestino || typeof window === 'undefined') return;
  evento?.preventDefault?.();
  storage?.setItem(CLAVE_FADE_ENTRADA, '1');
  if (typeof document !== 'undefined' && document.body) {
    document.body.classList?.add('transicion-fade-activa');
    document.documentElement?.classList?.add('transicion-fade-oculta');
    setTimeout(() => window.location.assign(urlDestino), 220);
  } else {
    window.location.assign(urlDestino);
  }
}

function aplicarFadeEntradaSiCorresponde(storage) {
  if (typeof document === 'undefined' || !storage || storage.getItem(CLAVE_FADE_ENTRADA) !== '1') {
    return;
  }
  storage.removeItem(CLAVE_FADE_ENTRADA);
  const raiz = document.documentElement;
  if (raiz?.classList && document.body?.classList) {
    raiz.classList.add('transicion-fade-oculta');
    document.body.classList.add('transicion-fade-activa');
    const revelar = () => raiz.classList.remove('transicion-fade-oculta');
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(revelar);
    else setTimeout(revelar, 16);
  }
}

/** Registra la posición antes de abrir una página legal y aplica fade si falta View Transition. */
export function inicializarRegistroSalidaLegal() {
  if (typeof document === 'undefined' || typeof window === 'undefined' || salidaRegistrada) return;
  salidaRegistrada = true;

  document.addEventListener('click', (evento) => {
    const enlace = evento.target?.closest?.('a[href]');
    const destinoLegal = enlace ? resolverEnlaceLegalSeguro(enlace.getAttribute('href')) : null;
    if (!destinoLegal) return;

    const storage = obtenerStorageSeguro();
    if (storage) {
      const rutaActual = window.location?.pathname || '';
      storage.setItem(CLAVE_SCROLL_RETORNO, String(Math.round(window.scrollY || 0)));
      storage.setItem(CLAVE_DESTINO_RETORNO, rutaActual.endsWith('/') ? './' : 'index.html');
    }
    if (!soportaViewTransitionNativo()) {
      navegarConFadeFallback(evento, destinoLegal, storage);
    }
  });
}

/** Restaura el scroll exacto o ubica el viewport en #footer antes del primer pintado. */
export function restaurarPosicionRetorno() {
  if (typeof window === 'undefined') return false;
  const storage = obtenerStorageSeguro();
  aplicarFadeEntradaSiCorresponde(storage);

  const scrollObjetivo = validarScrollGuardado(storage?.getItem(CLAVE_SCROLL_RETORNO) ?? null);
  storage?.removeItem(CLAVE_SCROLL_RETORNO);
  const esRetornoFooter = window.location?.hash === '#footer';
  if (scrollObjetivo === null && !esRetornoFooter) return false;

  const aplicarPosicion = () => {
    if (scrollObjetivo !== null) aplicarScrollInstantaneo(scrollObjetivo);
    else irAlFondoFooter();
  };

  let usuarioInteractuo = false;
  const marcarInteraccion = () => { usuarioInteractuo = true; };
  aplicarPosicion();

  if (esRetornoFooter && typeof window.history?.replaceState === 'function') {
    const limpia = `${window.location.pathname || ''}${window.location.search || ''}`;
    window.history.replaceState(null, '', limpia);
  }

  if (typeof window.addEventListener === 'function') {
    window.addEventListener('wheel', marcarInteraccion, { once: true, passive: true });
    window.addEventListener('touchstart', marcarInteraccion, { once: true, passive: true });
    window.addEventListener('pageshow', (ev) => {
      document.documentElement?.classList?.remove('transicion-fade-oculta');
      if (ev?.persisted) marcarInteraccion();
    }, { once: true });
    window.addEventListener('pagereveal', () => { if (!usuarioInteractuo) aplicarPosicion(); }, { once: true });
    window.addEventListener('load', () => { if (!usuarioInteractuo) aplicarPosicion(); }, { once: true });
  }
  return true;
}

/** Configura todos los botones de cierre/retorno de las páginas legales hacia el fondo del sitio. */
export function inicializarRetornoLegal() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const storage = obtenerStorageSeguro();
  aplicarFadeEntradaSiCorresponde(storage);

  document.querySelectorAll('.btn-volver, .btn-cerrar-legal, .btn-volver-pie').forEach((boton) => {
    boton.addEventListener('click', (evento) => {
      const destinoBase = resolverDestinoSeguro(storage?.getItem(CLAVE_DESTINO_RETORNO) ?? null);
      const urlRetorno = `${destinoBase}#footer`;
      if (soportaViewTransitionNativo()) {
        boton.setAttribute('href', urlRetorno);
      } else {
        navegarConFadeFallback(evento, urlRetorno, storage);
      }
    });
  });

  document.querySelectorAll('.nav-legal a').forEach((enlaceLegal) => {
    const destinoLegal = resolverEnlaceLegalSeguro(enlaceLegal.getAttribute('href'));
    if (!destinoLegal) return;
    enlaceLegal.addEventListener('click', (evento) => {
      if (!soportaViewTransitionNativo()) navegarConFadeFallback(evento, destinoLegal, storage);
    });
  });
}
