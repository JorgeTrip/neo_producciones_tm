/**
 * Módulo de Animaciones al Desplazamiento (Scroll Reveal) - NEO Producciones.
 * Utiliza IntersectionObserver para revelar progresivamente elementos en pantalla
 * con alto rendimiento sin bloquear el hilo principal.
 */

/**
 * Inicializa el observador de intersección para animar elementos con la clase .reveal.
 * @returns {void}
 */
export function inicializarAnimacionesScroll() {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(elemento => {
    observador.observe(elemento);
  });
}

// Ejecutar observación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarAnimacionesScroll);
} else {
  inicializarAnimacionesScroll();
}
