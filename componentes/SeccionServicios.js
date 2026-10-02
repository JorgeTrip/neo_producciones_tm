/**
 * Componente Declarativo: Sección Servicios.
 * Renderiza el catálogo de servicios de fotografía y producción audiovisual.
 */
import { crearElemento } from '../scripts/utilidadesDom.js';

const SERVICIOS = [
  {
    num: '01',
    titulo: 'Fotografía de Eventos Sociales',
    desc: 'Cumpleaños de 15 y 18, aniversarios, casamientos, Bar/Bat Mitzvah y celebraciones familiares. Capturamos la esencia de cada momento especial.',
    claseDelay: ''
  },
  {
    num: '02',
    titulo: 'Eventos Corporativos',
    desc: 'Conferencias, lanzamientos de productos, reuniones, ferias comerciales y eventos de networking con un enfoque profesional y discreto.',
    claseDelay: 'reveal-delay-1'
  },
  {
    num: '03',
    titulo: 'Producciones Audiovisuales',
    desc: 'Videos conmemorativos, institucionales y montajes especiales. Nuestra edición profesional transforma fotografías y videos en historias memorables.',
    claseDelay: 'reveal-delay-2'
  },
  {
    num: '04',
    titulo: 'Fotografía de Producto e Inmobiliaria',
    desc: 'Imágenes de alta calidad para catálogos, publicidad y marketing inmobiliario que resaltan las mejores características de sus productos o propiedades.',
    claseDelay: 'reveal-delay-3'
  }
];

export function renderizarSeccionServicios(contenedor) {
  if (!contenedor) return;

  const nodoContenido = crearElemento('div', { className: 'container' }, [
    crearElemento('div', { className: 'servicios-intro reveal' }, [
      crearElemento('p', { className: 'section-label' }, ['Lo que hacemos']),
      crearElemento('h2', { className: 'section-title' }, [
        'Nuestros',
        crearElemento('br'),
        crearElemento('span', { className: 'grad' }, ['Servicios'])
      ]),
      crearElemento('div', { className: 'divider' })
    ]),
    crearElemento('div', { className: 'servicios-grid' }, SERVICIOS.map(s => (
      crearElemento('div', { className: `servicio-card reveal ${s.claseDelay}`.trim() }, [
        crearElemento('div', { className: 'servicio-num' }, [s.num]),
        crearElemento('div', { className: 'servicio-title' }, [s.titulo]),
        crearElemento('p', { className: 'servicio-desc' }, [s.desc])
      ])
    )))
  ]);

  contenedor.replaceChildren(nodoContenido);
}
