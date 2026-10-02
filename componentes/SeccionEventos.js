/**
 * Componente Declarativo: Sección Eventos Sociales y Corporativos.
 * Detalla las etapas de cobertura fotográfica para celebraciones y empresas.
 */
import { crearElemento } from '../scripts/utilidadesDom.js';

export function renderizarSeccionEventos(contenedor) {
  if (!contenedor) return;

  const social = crearBloqueEvento({
    esInvertido: false,
    imagen: 'images/secciones/eventos.webp',
    alt: 'Fiesta y fotografía en Eventos Sociales - NEO Producciones',
    etiqueta: 'Celebraciones',
    titulo: 'Sociales',
    botonTexto: 'Consultar disponibilidad',
    pasos: [
      { num: '1', titulo: 'Fotografía Previa', desc: 'Sesión en locaciones especiales que reflejen la personalidad del homenajeado o pareja. Ideal para crear recuerdos únicos antes del gran día.' },
      { num: '2', titulo: 'Video Homenaje', desc: 'Nuestra "especialidad de la casa". Montajes emotivos con fotos y videos desde la infancia hasta la actualidad, creando un momento inolvidable durante el festejo.' },
      { num: '3', titulo: 'Cobertura Total', desc: 'Capturamos cada instante de manera ilimitada durante 6 horas. Incluye fotografías y fragmentos de video de los momentos clave del evento.' }
    ]
  });

  const corporativo = crearBloqueEvento({
    esInvertido: true,
    imagen: 'images/secciones/eventoCorporativo.webp',
    alt: 'Fotografía Corporativa Profesional - NEO Producciones',
    etiqueta: 'Empresas',
    titulo: 'Corporativos',
    botonTexto: 'Solicitar presupuesto',
    pasos: [
      { num: '1', titulo: 'Sesión Previa Corporativa', desc: 'Coordinamos fotografías profesionales en sus instalaciones o locación relevante. Ideal para material promocional, presentaciones y perfiles corporativos.' },
      { num: '2', titulo: 'Video Corporativo Profesional', desc: 'Producimos videos que destacan la historia, logros y visión de su empresa. Adaptados para proyección durante el evento o uso en redes sociales.' },
      { num: '3', titulo: 'Cobertura Integral', desc: 'Documentación fotográfica completa y captación de video de discursos, demostraciones y networking durante todo el evento.' }
    ]
  });

  contenedor.replaceChildren(social, corporativo);
}

function crearBloqueEvento({ esInvertido, imagen, alt, etiqueta, titulo, botonTexto, pasos }) {
  return crearElemento('section', { className: 'evento-section' }, [
    crearElemento('div', { className: 'container' }, [
      crearElemento('div', { className: `evento-grid ${esInvertido ? 'reverse' : ''}`.trim() }, [
        crearElemento('div', { className: 'evento-img reveal' }, [
          crearElemento('img', { src: imagen, alt })
        ]),
        crearElemento('div', { className: 'reveal reveal-delay-2' }, [
          crearElemento('p', { className: 'section-label' }, [etiqueta]),
          crearElemento('h2', { className: 'section-title' }, [
            'Eventos',
            crearElemento('br'),
            crearElemento('span', { className: 'grad' }, [titulo])
          ]),
          crearElemento('div', { className: 'divider' }),
          crearElemento('div', { className: 'event-items' }, pasos.map(p => (
            crearElemento('div', { className: 'event-item' }, [
              crearElemento('div', { className: 'event-item-num' }, [p.num]),
              crearElemento('div', {}, [
                crearElemento('h3', { className: 'event-item-title' }, [p.titulo]),
                crearElemento('p', { className: 'event-item-desc' }, [p.desc])
              ])
            ])
          ))),
          crearElemento('div', { style: { marginTop: '2.5rem' } }, [
            crearElemento('a', { href: '#contacto', className: 'btn-primary' }, [botonTexto])
          ])
        ])
      ])
    ])
  ]);
}
