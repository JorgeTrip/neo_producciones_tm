/**
 * @file gestorDockPresupuesto.js
 * @description Controlador cinemático para el acoplamiento magnético ("dock") one-shot
 * de la sección Presupuesto al entrar al viewport en móviles (SPEC-UI-005 Rev. 2).
 */

/** Calcula el scrollY para apoyar la base de .wizard-card sobre #barraInferiorMovil. */
export function calcularPuntoDock(params) {
  if (!params || typeof params !== 'object') return 0;
  const { rectInferiorAbsoluto, windowHeight, alturaBarraInferior } = params;
  if (!Number.isFinite(rectInferiorAbsoluto) || !Number.isFinite(windowHeight) || !Number.isFinite(alturaBarraInferior)) {
    return 0;
  }
  return Math.max(0, Math.round(rectInferiorAbsoluto - windowHeight + alturaBarraInferior));
}

/** Calcula qué fracción (0 a 1) de un rectángulo DOM es visible en el viewport. */
export function calcularFraccionVisible(rectSeccion, windowHeight) {
  if (!rectSeccion || typeof rectSeccion !== 'object') return 0;
  const { top, bottom, height } = rectSeccion;
  if (!Number.isFinite(top) || !Number.isFinite(bottom) || !Number.isFinite(height) || !Number.isFinite(windowHeight) || height <= 0 || windowHeight <= 0) {
    return 0;
  }
  const alturaVisible = Math.max(0, Math.min(bottom, windowHeight) - Math.max(top, 0));
  return Math.min(1, alturaVisible / height);
}

/** Determina si el imán debe rearmarse al salir la sección por completo de pantalla. */
export function debeRearmarIman(fraccionVisible) {
  return Number.isFinite(fraccionVisible) && fraccionVisible <= 0;
}

/** Evalúa si se cumplen las condiciones de entrada descendente one-shot en móvil. */
export function evaluarDisparoEntrada({
  anchoVentana,
  barraPresente,
  fraccionVisible,
  direccionDescendente,
  yaDisparadoEnEntrada,
  velocidadPxMs,
  umbralEntrada = 0.15,
  umbralVelocidad = 1.8
}) {
  if (typeof anchoVentana === 'number' && anchoVentana > 768) return false;
  if (!barraPresente || !direccionDescendente || yaDisparadoEnEntrada) return false;
  if (typeof velocidadPxMs === 'number' && Math.abs(velocidadPxMs) > umbralVelocidad) return false;
  if (!Number.isFinite(fraccionVisible)) return false;
  return fraccionVisible >= umbralEntrada;
}

function obtenerElementosDock() {
  const seccion = document.getElementById('presupuesto');
  const tarjeta = document.querySelector('#presupuesto .wizard-card');
  const barra = document.getElementById('barraInferiorMovil');
  return seccion && tarjeta && barra ? { seccion, tarjeta, barra } : null;
}

function obtenerBottomLayout(elemento) {
  let top = 0;
  let actual = elemento;
  while (actual) {
    top += actual.offsetTop + (actual.offsetParent ? actual.offsetParent.clientTop : 0);
    actual = actual.offsetParent;
  }
  return top + elemento.offsetHeight;
}

function calcularObjetivoDesdeNodos(nodos) {
  const rectBarra = nodos.barra.getBoundingClientRect();
  const bottomLayout = obtenerBottomLayout(nodos.tarjeta);
  const scrollYObjetivo = calcularPuntoDock({
    rectInferiorAbsoluto: bottomLayout,
    windowHeight: window.innerHeight,
    alturaBarraInferior: rectBarra.height
  });
  return { bottomVisual: bottomLayout - window.scrollY, rectBarra, scrollYObjetivo };
}

/**
 * Inicializa el controlador magnético de entrada en viewport para pantallas <= 768px.
 * @returns {Function} Función de limpieza de oyentes y observadores.
 */
export function inicializarDockPresupuesto() {
  if (typeof window === 'undefined' || typeof document === 'undefined' || window.innerWidth > 768) {
    return () => {};
  }

  let temporizadorAsentamiento = null;
  let ultimoScrollY = window.scrollY;
  let ultimoTiempo = Date.now();
  let velocidadActual = 0;
  let direccionDescendente = false;
  let usuarioTocando = false;
  let animandoDock = false;
  let yaDisparadoEnEntrada = false;
  let estabaAcoplado = false;
  let scrollYUltimoDock = 0;

  const ejecutarSnap = (scrollYObjetivo) => {
    animandoDock = true;
    scrollYUltimoDock = scrollYObjetivo;
    window.scrollTo({ top: scrollYObjetivo, behavior: 'smooth' });
    setTimeout(() => { animandoDock = false; estabaAcoplado = true; }, 420);
  };

  const rearmarSiSalio = (seccion) => {
    const fraccion = calcularFraccionVisible(seccion.getBoundingClientRect(), window.innerHeight);
    if (debeRearmarIman(fraccion)) { yaDisparadoEnEntrada = false; estabaAcoplado = false; }
    return fraccion;
  };

  const registrarMovimiento = () => {
    const ahora = Date.now();
    const deltaY = window.scrollY - ultimoScrollY;
    velocidadActual = deltaY / Math.max(1, ahora - ultimoTiempo);
    ultimoScrollY = window.scrollY;
    ultimoTiempo = ahora;
    if (!animandoDock && deltaY !== 0) direccionDescendente = deltaY > 0;
    if (estabaAcoplado && !animandoDock && Math.abs(window.scrollY - scrollYUltimoDock) > 80) estabaAcoplado = false;
    const seccion = document.getElementById('presupuesto');
    if (seccion) rearmarSiSalio(seccion);
  };

  const intentarAcoplamiento = () => {
    if (usuarioTocando || animandoDock || window.innerWidth > 768) return;
    const nodos = obtenerElementosDock();
    if (!nodos) return;

    const fraccionVisible = rearmarSiSalio(nodos.seccion);
    if (yaDisparadoEnEntrada) return;

    const { bottomVisual, rectBarra, scrollYObjetivo } = calcularObjetivoDesdeNodos(nodos);
    if (bottomVisual <= rectBarra.top + 2) return;

    const barraPresente = rectBarra.height > 0 && window.getComputedStyle(nodos.barra).display !== 'none';
    const velocidadEfectiva = (Date.now() - ultimoTiempo > 120) ? 0 : velocidadActual;
    const debeDisparar = evaluarDisparoEntrada({
      anchoVentana: window.innerWidth, barraPresente, fraccionVisible,
      direccionDescendente, yaDisparadoEnEntrada, velocidadPxMs: velocidadEfectiva
    });
    if (!debeDisparar) return;

    yaDisparadoEnEntrada = true;
    if (Math.abs(window.scrollY - scrollYObjetivo) > 2) ejecutarSnap(scrollYObjetivo);
    else { estabaAcoplado = true; scrollYUltimoDock = scrollYObjetivo; }
  };

  const programarAcoplamiento = (demoraMs) => {
    if (temporizadorAsentamiento) clearTimeout(temporizadorAsentamiento);
    temporizadorAsentamiento = setTimeout(intentarAcoplamiento, demoraMs);
  };

  const alScrollear = () => { registrarMovimiento(); programarAcoplamiento(80); };
  const alIniciarToque = () => { usuarioTocando = true; animandoDock = false; };
  const alFinalizarToque = () => { usuarioTocando = false; programarAcoplamiento(60); };

  window.addEventListener('scroll', alScrollear, { passive: true });
  window.addEventListener('touchstart', alIniciarToque, { passive: true });
  window.addEventListener('touchend', alFinalizarToque, { passive: true });

  const contenedorWizard = document.getElementById('contenedorWizard');
  let observerMutacion = null;
  if (contenedorWizard && typeof MutationObserver !== 'undefined') {
    observerMutacion = new MutationObserver(() => {
      if (!estabaAcoplado || window.innerWidth > 768) return;
      setTimeout(() => {
        if (!estabaAcoplado || window.innerWidth > 768) return;
        const nodos = obtenerElementosDock();
        if (nodos) ejecutarSnap(calcularObjetivoDesdeNodos(nodos).scrollYObjetivo);
      }, 60);
    });
    observerMutacion.observe(contenedorWizard, { childList: true, subtree: true });
  }

  return () => {
    if (temporizadorAsentamiento) clearTimeout(temporizadorAsentamiento);
    window.removeEventListener('scroll', alScrollear);
    window.removeEventListener('touchstart', alIniciarToque);
    window.removeEventListener('touchend', alFinalizarToque);
    if (observerMutacion) observerMutacion.disconnect();
  };
}
