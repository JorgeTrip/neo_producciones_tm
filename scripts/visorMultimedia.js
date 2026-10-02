/**
 * Módulo de Visor Multimedia Seguro (Lightbox) - NEO Producciones.
 * Gestiona la visualización inmersiva de fotos y videos mediante DOM seguro.
 */
import { destruirVisorPanorama } from './visorPanoramico.js';

let indiceActual = -1;
let imagenes = [];
let esModoVideo = false;

/**
 * Escanea los elementos del portafolio y recopila las imágenes.
 */
export function recolectarImagenesGaleria() {
  imagenes = [];
  document.querySelectorAll('.gallery-item').forEach(item => {
    const clickAttr = item.getAttribute('onclick');
    if (clickAttr && (clickAttr.includes('openLightbox') || clickAttr.includes('abrirVisorImagen'))) {
      const match = clickAttr.match(/(?:openLightbox|abrirVisorImagen)\('([^']+)'\)/);
      if (match) imagenes.push(match[1]);
    }
  });
}

function prepararModal() {
  const lb = document.getElementById('lightbox');
  const contenido = document.getElementById('lightboxContent');
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  contenido.replaceChildren();
  return {
    contenido,
    contador: document.getElementById('lightboxCounter'),
    btnAnt: document.getElementById('lightboxPrev'),
    btnSig: document.getElementById('lightboxNext')
  };
}

/**
 * Abre el visor modal para renderizar una imagen seleccionada.
 * @param {string} ruta - Ruta de la imagen a desplegar.
 */
export function abrirVisorImagen(ruta) {
  esModoVideo = false;
  const normalizada = ruta.replace(/\.(jpe?g|png|JPG|PNG)$/, '.webp');
  indiceActual = imagenes.indexOf(ruta);
  if (indiceActual === -1) indiceActual = imagenes.indexOf(normalizada);

  const { contenido, contador, btnAnt, btnSig } = prepararModal();
  const img = document.createElement('img');
  img.src = normalizada;
  img.alt = 'Fotografía NEO Producciones';
  contenido.appendChild(img);

  if (indiceActual >= 0) {
    contador.style.display = 'block';
    contador.textContent = `${indiceActual + 1} / ${imagenes.length}`;
    btnAnt.style.display = indiceActual > 0 ? 'flex' : 'none';
    btnSig.style.display = indiceActual < imagenes.length - 1 ? 'flex' : 'none';
  } else {
    contador.style.display = 'none';
    btnAnt.style.display = 'none';
    btnSig.style.display = 'none';
  }
}

/**
 * Navega hacia adelante o atrás en el carrusel de fotografías.
 * @param {number} dir - Desplazamiento (-1 o 1).
 */
export function navegarVisor(dir) {
  if (esModoVideo || indiceActual < 0) return;
  const nuevo = indiceActual + dir;
  if (nuevo >= 0 && nuevo < imagenes.length) {
    indiceActual = nuevo;
    const { contenido, contador, btnAnt, btnSig } = prepararModal();
    const ruta = imagenes[indiceActual].replace(/\.(jpe?g|png|JPG|PNG)$/, '.webp');
    const img = document.createElement('img');
    img.src = ruta;
    img.alt = 'Fotografía de la galería';
    contenido.appendChild(img);

    contador.style.display = 'block';
    contador.textContent = `${indiceActual + 1} / ${imagenes.length}`;
    btnAnt.style.display = indiceActual > 0 ? 'flex' : 'none';
    btnSig.style.display = indiceActual < imagenes.length - 1 ? 'flex' : 'none';
  }
}

/**
 * Abre el visor para reproducir un video de Vimeo.
 * @param {string} url - URL del video.
 */
export function abrirVisorVideo(url) {
  esModoVideo = true;
  const { contenido, contador, btnAnt, btnSig } = prepararModal();
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.setAttribute('allow', 'autoplay; fullscreen');
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.style.border = '0';
  contenido.appendChild(iframe);
  contador.style.display = 'none';
  btnAnt.style.display = 'none';
  btnSig.style.display = 'none';
}

/**
 * Abre el visor modal para reproducir un video de YouTube.
 * @param {string} url - URL incrustable de YouTube.
 */
export function abrirVisorYouTube(url) {
  esModoVideo = true;
  const { contenido, contador, btnAnt, btnSig } = prepararModal();
  const id = url.split('/embed/')[1]?.split('?')[0] || url;
  const cont = document.createElement('div');
  cont.style.cssText = 'width: 90vw; max-width: 1200px; aspect-ratio: 16/9; position: relative;';

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'width: 100%; height: 100%; border: 0; border-radius: 8px;';
  iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('allowfullscreen', 'true');

  cont.appendChild(iframe);
  contenido.appendChild(cont);
  contador.style.display = 'none';
  btnAnt.style.display = 'none';
  btnSig.style.display = 'none';
}

/**
 * Cierra el visor y resetea el estado del modal.
 * @param {Event} [e] - Evento de clic en backdrop.
 */
export function cerrarVisor(e) {
  const lb = document.getElementById('lightbox');
  if (e && e.target !== lb) return;
  destruirVisorPanorama();
  lb.classList.remove('active');
  document.getElementById('lightboxContent').replaceChildren();
  document.body.style.overflow = '';
  indiceActual = -1;
  esModoVideo = false;
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('active')) return;
  if (e.key === 'Escape') cerrarVisor();
  else if (e.key === 'ArrowLeft') navegarVisor(-1);
  else if (e.key === 'ArrowRight') navegarVisor(1);
});

if (typeof window !== 'undefined') {
  window.abrirVisorImagen = abrirVisorImagen;
  window.openLightbox = abrirVisorImagen;
  window.navegarVisor = navegarVisor;
  window.navigateLightbox = navegarVisor;
  window.abrirVisorVideo = abrirVisorVideo;
  window.openVideo = abrirVisorVideo;
  window.abrirVisorYouTube = abrirVisorYouTube;
  window.openYouTube = abrirVisorYouTube;
  window.cerrarVisor = cerrarVisor;
  window.closeLightbox = cerrarVisor;
  window.recolectarImagenesGaleria = recolectarImagenesGaleria;
}

recolectarImagenesGaleria();
