/**
 * Componente Declarativo: Sección Portafolio Multimedia.
 * Renderiza dinámicamente las grillas de fotografías previas, eventos, 360 y videos.
 */
import { crearElemento, crearElementoSvg } from '../scripts/utilidadesDom.js';
import { FOTOS_PREVIA, FOTOS_EVENTOS, ENTORNOS_360, VIDEOS } from '../scripts/datosPortafolio.js';

export function renderizarSeccionPortafolio(contenedor) {
  if (!contenedor) return;

  const nodoContenido = crearElemento('div', { className: 'container' }, [
    crearElemento('div', { className: 'portfolio-intro reveal' }, [
      crearElemento('p', { className: 'section-label' }, ['Nuestro trabajo']),
      crearElemento('h2', { className: 'section-title' }, [
        crearElemento('span', { className: 'grad' }, ['Portfolio'])
      ]),
      crearElemento('div', { className: 'divider' }),
      crearElemento('p', { style: { color: 'var(--text-muted)', fontSize: '1rem' } }, [
        'Cada imagen cuenta una historia. Nuestro compromiso es capturar la esencia y emoción de cada evento, con un estilo que combina elegancia y naturalidad.'
      ])
    ]),

    // 1. Fotografía previa
    crearElemento('div', { className: 'portfolio-section-title reveal' }, ['Fotografía previa']),
    crearElemento('div', { className: 'gallery-grid reveal' }, FOTOS_PREVIA.map(crearItemFoto)),

    // 2. Fotografía en eventos
    crearElemento('div', { className: 'portfolio-section-title reveal', style: { marginTop: '3rem' } }, ['Fotografía en eventos']),
    crearElemento('div', { className: 'gallery-grid reveal', style: { gridTemplateColumns: 'repeat(4,1fr)' } }, FOTOS_EVENTOS.map(crearItemFoto)),

    // 3. Recorridos 360
    crearElemento('div', { className: 'portfolio-section-title reveal', style: { marginTop: '3rem' } }, ['Fotografía Interactiva & Recorridos 360°']),
    crearElemento('p', { className: 'reveal', style: { color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' } }, [
      'Experiencias inmersivas capturadas con tecnología Insta360 X4. Esta técnica es ideal tanto para recorridos virtuales de arquitectura e inmobiliaria como para registrar la escala y la energía de eventos masivos, capturando salones completos y grandes multitudes de forma interactiva.'
    ]),
    crearElemento('div', { className: 'gallery-grid reveal' }, ENTORNOS_360.map(crearItemPanorama)),

    // 4. Videos
    crearElemento('div', { className: 'portfolio-section-title reveal', style: { marginTop: '3rem' } }, ['Video montaje con música & corporativos']),
    crearElemento('div', { className: 'video-grid reveal' }, VIDEOS.map(crearItemVideo))
  ]);

  contenedor.replaceChildren(nodoContenido);

  // Notificar al visor multimedia que indexe las nuevas imágenes
  if (typeof window !== 'undefined' && typeof window.recolectarImagenesGaleria === 'function') {
    window.recolectarImagenesGaleria();
  }
}

function crearItemFoto(item) {
  const el = crearElemento('div', {
    className: 'gallery-item',
    onclick: `abrirVisorImagen('${item.ruta}')`
  }, [
    crearElemento('img', { src: item.ruta, alt: item.alt, loading: 'lazy' }),
    crearElemento('div', { className: 'gallery-item-overlay' }, [
      crearElementoSvg('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
        crearElementoSvg('path', { d: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6' })
      ])
    ])
  ]);
  el.addEventListener('click', () => {
    if (typeof window.abrirVisorImagen === 'function') window.abrirVisorImagen(item.ruta);
  });
  return el;
}

function crearItemPanorama(item) {
  const el = crearElemento('div', {
    className: 'gallery-item panorama-item',
    onclick: `abrirVisorPanorama('${item.ruta}', '${item.titulo}')`
  }, [
    crearElemento('img', { src: item.ruta, alt: item.alt, loading: 'lazy' }),
    crearElemento('div', { className: 'panorama-badge' }, [
      crearElementoSvg('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
        crearElementoSvg('circle', { cx: '12', cy: '12', r: '10' }),
        crearElementoSvg('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
      ]),
      ' 360°'
    ]),
    crearElemento('div', { className: 'gallery-item-overlay' }, [
      crearElementoSvg('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
        crearElementoSvg('path', { d: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' })
      ])
    ])
  ]);
  el.addEventListener('click', () => {
    if (typeof window.abrirVisorPanorama === 'function') window.abrirVisorPanorama(item.ruta, item.titulo);
  });
  return el;
}

function crearItemVideo(item) {
  const accion = item.tipo === 'vimeo'
    ? () => { if (typeof window.abrirVisorVideo === 'function') window.abrirVisorVideo(item.url); }
    : () => { window.open(item.url, '_blank'); };

  const el = crearElemento('div', { className: 'video-thumb' }, [
    crearElemento('img', { src: item.thumb, alt: item.titulo, loading: 'lazy' }),
    crearElemento('div', { className: 'video-thumb-overlay' }, [
      crearElemento('div', { className: 'play-btn' }, [
        crearElementoSvg('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
          crearElementoSvg('path', { d: 'M8 5v14l11-7z' })
        ])
      ])
    ]),
    crearElemento('div', { className: 'video-title' }, [item.titulo])
  ]);
  el.addEventListener('click', accion);
  return el;
}
