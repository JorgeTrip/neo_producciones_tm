/**
 * Módulo de Animaciones al Desplazamiento (Scroll Reveal) - NEO Producciones.
 * Utiliza IntersectionObserver para revelar progresivamente elementos en pantalla
 * y orquestar la activación de skeletons y carga diferida por fila.
 */
import { activarCargaFila } from './gestorEsqueletos.js';

let observadorScroll = null;

/**
 * Inicializa el observador de intersección para animar elementos con la clase .reveal
 * y activar la carga de multimedia por filas.
 * @returns {void}
 */
export function inicializarAnimacionesScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Fallback si el navegador no soporta IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.gallery-row, .video-row').forEach(fila => activarCargaFila(fila));
    return;
  }

  // Desconectar instancia previa para evitar fugas o escuchadores redundantes
  if (observadorScroll) {
    observadorScroll.disconnect();
  }

  observadorScroll = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');

        // Si el elemento es o contiene filas multimedia, activar carga diferida y esqueleto
        if (entrada.target.matches && entrada.target.matches('.gallery-row, .video-row')) {
          activarCargaFila(entrada.target);
        } else if (typeof entrada.target.querySelectorAll === 'function') {
          activarCargaFila(entrada.target);
        }

        observadorScroll.unobserve(entrada.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.reveal').forEach(elemento => {
    observadorScroll.observe(elemento);
  });
}
