/**
 * Componente Declarativo: Barra de Navegación Inferior Móvil.
 * Provee cuatro accesos rápidos táctiles (Inicio, Portfolio, Presupuesto, WhatsApp)
 * optimizados para uso con una mano en pantallas <= 768px.
 */
import { crearElemento, crearElementoSvg } from '../scripts/utilidadesDom.js';

const ACCESOS_BARRA_MOVIL = [
  {
    id: 'inicio',
    etiqueta: 'Inicio',
    href: '#inicio',
    ariaLabel: 'Ir al inicio',
    esStroke: true,
    paths: ['M3 9.75L12 3l9 6.75V20.25a.75.75 0 01-.75.75H15v-6.75h-6V21H3.75a.75.75 0 01-.75-.75V9.75z']
  },
  {
    id: 'portfolio',
    etiqueta: 'Portfolio',
    href: '#portfolio',
    ariaLabel: 'Ir al portfolio',
    esStroke: true,
    paths: [
      'M3.75 5.25h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z',
      'M7.5 15l3.75-3.75 3 3 2.25-2.25L19.5 15'
    ]
  },
  {
    id: 'presupuesto',
    etiqueta: 'Presupuesto',
    href: '#presupuesto',
    ariaLabel: 'Ir al presupuestador',
    esStroke: true,
    paths: [
      'M9 6.75h6M9 10.5h6M9 14.25h3.75',
      'M5.25 3.75h13.5a1.5 1.5 0 011.5 1.5v13.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5z'
    ]
  },
  {
    id: 'whatsapp',
    etiqueta: 'WhatsApp',
    href: 'https://wa.me/541140686925',
    ariaLabel: 'Consultar por WhatsApp',
    esExterna: true,
    esStroke: false,
    paths: ['M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z']
  }
];

function crearIconoAcceso(acceso) {
  const attrsSvg = acceso.esStroke
    ? { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', viewBox: '0 0 24 24', 'aria-hidden': 'true' }
    : { fill: 'currentColor', viewBox: '0 0 24 24', 'aria-hidden': 'true' };

  return crearElementoSvg('svg', attrsSvg, acceso.paths.map(d => crearElementoSvg('path', { d })));
}

/**
 * Construye el elemento DOM de la barra de navegación inferior móvil.
 * @returns {HTMLElement} Elemento `<nav>` con los 4 accesos rápidos táctiles.
 */
export function crearBarraInferiorMovil() {
  const enlaces = ACCESOS_BARRA_MOVIL.map(acceso => {
    const attrs = {
      href: acceso.href,
      className: `barra-movil-item${acceso.id === 'whatsapp' ? ' barra-movil-item--wa' : ''}${acceso.id === 'inicio' ? ' activo' : ''}`,
      'data-seccion-movil': acceso.id,
      'aria-label': acceso.ariaLabel
    };

    if (acceso.esExterna) {
      attrs.target = '_blank';
      attrs.rel = 'noopener noreferrer';
    }

    return crearElemento('a', attrs, [
      crearIconoAcceso(acceso),
      crearElemento('span', {}, [acceso.etiqueta])
    ]);
  });

  return crearElemento('nav', {
    id: 'barraInferiorMovil',
    className: 'barra-inferior-movil',
    'aria-label': 'Accesos rápidos móviles'
  }, enlaces);
}

/**
 * Monta la barra inferior móvil al final del documento de forma idempotente.
 */
export function montarBarraInferiorMovil() {
  if (typeof document === 'undefined' || !document.body) return;
  const existente = document.getElementById('barraInferiorMovil');
  if (existente) return;
  document.body.appendChild(crearBarraInferiorMovil());
}
