/**
 * @file ajustadorTituloHero.js
 * @description Ajusta dinámicamente el tamaño de fuente del título del Hero
 * para que ocupe el máximo espacio horizontal disponible en pantallas móviles sin desbordar.
 */

/**
 * Calcula el tamaño de fuente ideal en píxeles para que el título ocupe el ancho objetivo.
 * @param {object} opciones
 * @param {number} opciones.anchoLibre - Ancho disponible en píxeles del contenedor.
 * @param {number} [opciones.factorProporcion=7.2] - Relación estimada caracteres/ancho en fuente Syne.
 * @param {number} [opciones.porcentajeOcupacion=0.92] - Fracción del ancho a ocupar (0.90 a 0.95).
 * @param {number} [opciones.minimo=22] - Tamaño mínimo de fuente en px.
 * @param {number} [opciones.maximo=56] - Tamaño máximo de fuente en px para móviles.
 * @returns {number}
 */
export function calcularTamanoFuenteDinamico({
  anchoLibre,
  factorProporcion = 7.2,
  porcentajeOcupacion = 0.92,
  minimo = 22,
  maximo = 56
}) {
  if (!anchoLibre || anchoLibre <= 0) return minimo;
  const anchoObjetivo = anchoLibre * porcentajeOcupacion;
  const tamanoCalculado = anchoObjetivo / factorProporcion;
  return Math.min(Math.max(tamanoCalculado, minimo), maximo);
}

/**
 * Ajusta el estilo fontSize del elemento título para adaptarlo dinámicamente al viewport móvil.
 * @param {HTMLElement} elementoTitulo
 * @param {HTMLElement} contenedor
 * @param {number} [anchoVentana]
 * @returns {number|null}
 */
export function ajustarTamanoTituloHero(
  elementoTitulo,
  contenedor,
  anchoVentana = (typeof window !== 'undefined' ? window.innerWidth : 1024)
) {
  if (!elementoTitulo || !contenedor) return null;

  // En pantallas grandes se preserva el estilo CSS natural sin intervenir
  if (anchoVentana > 768) {
    elementoTitulo.style.fontSize = '';
    return null;
  }

  const estiloContenedor = typeof window !== 'undefined' && window.getComputedStyle
    ? window.getComputedStyle(contenedor)
    : null;
  const paddingIzq = estiloContenedor ? (parseFloat(estiloContenedor.paddingLeft) || 16) : 16;
  const paddingDer = estiloContenedor ? (parseFloat(estiloContenedor.paddingRight) || 16) : 16;
  const anchoLibre = (contenedor.clientWidth || anchoVentana) - (paddingIzq + paddingDer);

  let tamano = Math.round(calcularTamanoFuenteDinamico({ anchoLibre }));
  elementoTitulo.style.fontSize = `${tamano}px`;

  // Ajuste fino reactivo para garantizar cero desbordamiento horizontal
  if (elementoTitulo.scrollWidth && anchoLibre > 0) {
    while (elementoTitulo.scrollWidth > anchoLibre && tamano > 18) {
      tamano -= 1;
      elementoTitulo.style.fontSize = `${tamano}px`;
    }
  }

  return tamano;
}

/**
 * Inicializa el observador dinámico de redimensionamiento del título del Hero.
 */
export function inicializarAjustadorTituloHero() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const elementoTitulo = document.querySelector('.hero-title');
  const contenedor = document.querySelector('.hero-content') || document.querySelector('#inicio');

  if (!elementoTitulo || !contenedor) return;

  const ejecutarAjuste = () => ajustarTamanoTituloHero(elementoTitulo, contenedor, window.innerWidth);

  ejecutarAjuste();
  window.addEventListener('resize', ejecutarAjuste, { passive: true });
  window.addEventListener('orientationchange', ejecutarAjuste, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(ejecutarAjuste).catch(() => {});
  }
}
