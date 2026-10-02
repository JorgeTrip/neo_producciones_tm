/**
 * Módulo de Recorridos Panorámicos 360° - NEO Producciones.
 * Integra la biblioteca Pannellum para visualización esférica interactiva
 * con destrucción de recursos en memoria al cerrar.
 */

// Instancia activa del visor de Pannellum
let visorActivo = null;

/**
 * Renderiza un entorno equirrectangular interactivo de 360 grados.
 * @param {string} rutaImagen - Ubicación de la imagen panorámica.
 * @param {string} titulo - Título de la escena.
 * @returns {void}
 */
export function abrirVisorPanorama(rutaImagen, titulo) {
  const lb = document.getElementById('lightbox');
  const contenido = document.getElementById('lightboxContent');
  const contador = document.getElementById('lightboxCounter');
  const btnAnt = document.getElementById('lightboxPrev');
  const btnSig = document.getElementById('lightboxNext');

  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  contenido.replaceChildren();

  const visorEl = document.createElement('div');
  visorEl.id = 'panorama-viewer';

  const cartel = document.createElement('div');
  cartel.className = 'panorama-title-float';
  cartel.textContent = titulo;

  contenido.appendChild(visorEl);
  contenido.appendChild(cartel);

  if (contador) contador.style.display = 'none';
  if (btnAnt) btnAnt.style.display = 'none';
  if (btnSig) btnSig.style.display = 'none';

  if (typeof pannellum !== 'undefined') {
    visorActivo = pannellum.viewer('panorama-viewer', {
      type: 'equirectangular',
      panorama: rutaImagen,
      autoLoad: true,
      autoRotate: -1.5,
      compass: false,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      hotSpotDebug: false
    });
  }
}

/**
 * Destruye la instancia activa del visor panorámico para liberar memoria.
 * @returns {void}
 */
export function destruirVisorPanorama() {
  if (visorActivo) {
    try {
      visorActivo.destroy();
    } catch (e) {
      console.warn('Error al destruir visor 360:', e);
    }
    visorActivo = null;
  }
}

if (typeof window !== 'undefined') {
  window.abrirVisorPanorama = abrirVisorPanorama;
  window.openPanorama = abrirVisorPanorama;
  window.destruirVisorPanorama = destruirVisorPanorama;
}
