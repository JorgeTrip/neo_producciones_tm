/**
 * Módulo de Control de Navegación y Menú Móvil - NEO Producciones.
 * Gestiona la interactividad del menú hamburguesa, la navegación fluida
 * y la actualización del año de copyright en el pie de página.
 */

// Actualización automática del año corriente en el copyright del pie de página
const elementoAnio = document.getElementById('year');
if (elementoAnio) {
  elementoAnio.textContent = new Date().getFullYear();
}

/**
 * Alterna el estado de visualización del menú de navegación móvil.
 * @returns {void}
 */
export function conmutarMenu() {
  const menuMovil = document.getElementById('mobileMenu');
  if (menuMovil) {
    menuMovil.classList.toggle('open');
  }
}

// Compatibilidad global para eventos vinculados en el HTML
if (typeof window !== 'undefined') {
  window.toggleMenu = conmutarMenu;
  window.conmutarMenu = conmutarMenu;
}

// Cierre automático del menú móvil al seleccionar cualquier enlace
document.querySelectorAll('nav .nav-links a, .mobile-menu a').forEach(enlace => {
  enlace.addEventListener('click', () => {
    const menuMovil = document.getElementById('mobileMenu');
    if (menuMovil) {
      menuMovil.classList.remove('open');
    }
  });
});

// Resaltado reactivo del enlace activo en la barra de navegación al desplazarse
const seccionesConId = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let seccionActual = '';
  seccionesConId.forEach(seccion => {
    if (window.scrollY >= seccion.offsetTop - 120) {
      seccionActual = seccion.id;
    }
  });

  document.querySelectorAll('.nav-links a').forEach(enlace => {
    const coincide = enlace.getAttribute('href') === `#${seccionActual}`;
    enlace.style.color = coincide ? 'var(--gold)' : '';
  });
}, { passive: true });
