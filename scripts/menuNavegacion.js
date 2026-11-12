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
function establecerEstadoMenu(abierto) {
  const menuMovil = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('mobileMenuBackdrop');
  const boton = document.getElementById('navHamburger');

  if (menuMovil) menuMovil.classList.toggle('open', abierto);
  if (backdrop) backdrop.classList.toggle('open', abierto);
  if (boton) {
    boton.classList.toggle('abierto', abierto);
    boton.setAttribute('aria-expanded', String(abierto));
    boton.setAttribute('aria-label', abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  }
}

export function conmutarMenu() {
  const menuMovil = document.getElementById('mobileMenu');
  const estaAbierto = Boolean(menuMovil && menuMovil.classList.contains('open'));
  establecerEstadoMenu(!estaAbierto);
}

// Compatibilidad global para eventos vinculados en el HTML
if (typeof window !== 'undefined') {
  window.toggleMenu = conmutarMenu;
  window.conmutarMenu = conmutarMenu;
}

// Cierre automático del menú móvil al seleccionar enlace, backdrop o Escape
document.querySelectorAll('nav .nav-links a, .mobile-menu a').forEach(enlace => {
  enlace.addEventListener('click', () => establecerEstadoMenu(false));
});

const backdropMovil = document.getElementById('mobileMenuBackdrop');
if (backdropMovil) {
  backdropMovil.addEventListener('click', () => establecerEstadoMenu(false));
}

document.addEventListener('keydown', (e) => {
  const menuMovil = document.getElementById('mobileMenu');
  if (e.key === 'Escape' && menuMovil && menuMovil.classList.contains('open')) {
    establecerEstadoMenu(false);
    document.getElementById('navHamburger')?.focus();
  }
});

// Resaltado reactivo del enlace activo en barra superior e inferior al desplazarse
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

  document.querySelectorAll('.barra-movil-item[data-seccion-movil]').forEach(item => {
    const seccionItem = item.getAttribute('data-seccion-movil');
    item.classList.toggle('activo', seccionItem === (seccionActual || 'inicio'));
  });
}, { passive: true });
