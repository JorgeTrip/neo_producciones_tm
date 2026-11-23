/**
 * Módulo de Recorridos Panorámicos 360° - NEO Producciones.
 * Integra la biblioteca Pannellum para visualización esférica interactiva
 * con destrucción de recursos en memoria al cerrar.
 */

// Instancia activa del visor de Pannellum y promesa de carga diferida
let visorActivo = null;
let promesaPannellum = null;

const PANNELLUM_CSS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
const PANNELLUM_JS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';

/**
 * Carga Pannellum (CSS + JS) bajo demanda la primera vez que se solicita un 360°.
 * Evita bloquear el renderizado inicial del sitio en el primer pintado.
 * @returns {Promise<object>} Instancia global `window.pannellum`.
 */
function cargarPannellumBajoDemanda() {
  if (typeof window !== 'undefined' && typeof window.pannellum !== 'undefined') {
    return Promise.resolve(window.pannellum);
  }
  if (promesaPannellum) return promesaPannellum;

  promesaPannellum = new Promise((resolver, rechazar) => {
    if (!document.querySelector(`link[href="${PANNELLUM_CSS}"]`)) {
      const hoja = document.createElement('link');
      hoja.rel = 'stylesheet';
      hoja.href = PANNELLUM_CSS;
      document.head.appendChild(hoja);
    }
    const script = document.createElement('script');
    script.src = PANNELLUM_JS;
    script.async = true;
    script.onload = () => resolver(window.pannellum);
    script.onerror = () => {
      promesaPannellum = null;
      rechazar(new Error('No se pudo cargar Pannellum'));
    };
    document.head.appendChild(script);
  });

  return promesaPannellum;
}

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

  cargarPannellumBajoDemanda()
    .then((lib) => {
      if (!lb.classList.contains('active') || !document.getElementById('panorama-viewer')) return;
      visorActivo = lib.viewer('panorama-viewer', {
        type: 'equirectangular',
        panorama: rutaImagen,
        autoLoad: true,
        autoRotate: -1.5,
        compass: false,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
        hotSpotDebug: false
      });
    })
    .catch((err) => console.warn('Error al cargar visor 360:', err));
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
