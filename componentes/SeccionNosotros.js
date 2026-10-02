/**
 * Componente Declarativo: Sección Quiénes Somos y Filosofía.
 * Renderiza la historia del estudio fotográfico y los principios de trabajo.
 */
import { crearElemento } from '../scripts/utilidadesDom.js';

export function renderizarSeccionNosotros(contenedor) {
  if (!contenedor) return;

  const nodoContenido = crearElemento('div', { className: 'container' }, [
    // Bloque 1: Historia
    crearElemento('div', { className: 'historia-grid' }, [
      crearElemento('div', { className: 'reveal' }, [
        crearElemento('p', { className: 'section-label' }, ['Quiénes somos']),
        crearElemento('h2', { className: 'section-title' }, [
          'Nuestra',
          crearElemento('br'),
          crearElemento('span', { className: 'grad' }, ['Historia'])
        ]),
        crearElemento('div', { className: 'divider' }),
        crearElemento('div', { className: 'historia-text' }, [
          crearElemento('p', {}, [
            'Desde 2006, NEO Producciones ha sido testigo de los momentos más significativos en la vida de nuestros clientes. Con casi dos décadas de experiencia, hemos perfeccionado el arte de transformar instantes fugaces en memorias tangibles que perduran por generaciones.'
          ]),
          crearElemento('p', {}, [
            'Es un emprendimiento personal de fotografía de Jorge O. Tripodi, con un equipo dedicado que brinda servicios para eventos, books, fotografía comercial, de inmuebles y muchos más, siempre acordes a tus necesidades.'
          ])
        ]),
        crearElemento('div', { className: 'stat-row' }, [
          crearEstadistica('+20', 'Años de trayectoria'),
          crearEstadistica('4K', 'Calidad de video'),
          crearEstadistica('6h', 'Cobertura ilimitada')
        ])
      ]),
      crearElemento('div', { className: 'historia-img reveal reveal-delay-2' }, [
        crearElemento('img', {
          src: 'images/secciones/acerca.webp',
          alt: 'Jorge O. Tripodi - Fotógrafo de NEO Producciones'
        })
      ])
    ]),

    // Bloque 2: Filosofía
    crearElemento('div', { className: 'filosofia-grid' }, [
      crearElemento('div', { className: 'filosofia-img reveal' }, [
        crearElemento('img', {
          src: 'images/secciones/filosofia.webp',
          alt: 'Filosofía de trabajo y equipamiento de NEO Producciones'
        })
      ]),
      crearElemento('div', { className: 'reveal reveal-delay-2' }, [
        crearElemento('p', { className: 'section-label' }, ['Nuestra visión']),
        crearElemento('h2', { className: 'section-title' }, [
          'Nuestra',
          crearElemento('br'),
          crearElemento('span', { className: 'grad' }, ['Filosofía'])
        ]),
        crearElemento('div', { className: 'divider' }),
        crearElemento('div', { className: 'filosofia-text' }, [
          crearElemento('p', {}, [
            'En NEO Producciones creemos que cada fotografía cuenta una historia única. El fotógrafo experto no solo captura imágenes; inmortaliza emociones, gestos y miradas que definen los momentos especiales de tu vida.'
          ]),
          crearElemento('p', {}, [
            'Trabajamos con pasión y dedicación, convirtiendo cada sesión fotográfica en una experiencia memorable por sí misma.'
          ])
        ])
      ])
    ])
  ]);

  contenedor.replaceChildren(nodoContenido);
}

function crearEstadistica(numero, etiqueta) {
  return crearElemento('div', { className: 'stat-item' }, [
    crearElemento('div', { className: 'stat-num' }, [numero]),
    crearElemento('div', { className: 'stat-label' }, [etiqueta])
  ]);
}
