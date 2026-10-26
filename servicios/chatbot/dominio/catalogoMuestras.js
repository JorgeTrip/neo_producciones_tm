/**
 * @fileoverview Catálogo puro de dominio con muestras visuales de la web, textos en voseo y enlaces directos.
 */

const URL_BASE_WEB = 'https://neoproduccionestm.netlify.app';

export const CONTENIDO_POR_RUBRO = Object.freeze({
  casamiento: {
    fotos: [
      `${URL_BASE_WEB}/images/portfolio/boda_01.jpg`,
      `${URL_BASE_WEB}/images/portfolio/boda_02.jpg`
    ],
    textoMuestras: '¡Felicitaciones por el casamiento! ✨ Te comparto dos fotos de cobertura reciente de bodas:',
    textoPresupuesto: 'Tenemos 3 paquetes promocionales (Esencial, Clásico con video emotivo y Premium con fotolibro encuadernado). Podés ver los valores y armarlo a medida en:',
    esInmueble: false
  },
  quince: {
    fotos: [
      `${URL_BASE_WEB}/images/portfolio/quince_01.jpg`,
      `${URL_BASE_WEB}/images/portfolio/quince_02.jpg`
    ],
    textoMuestras: '¡Qué lindo celebrar los 15! 👑 Te comparto un par de fotos de book y fiesta reciente:',
    textoPresupuesto: 'Ofrecemos paquetes para fiesta y sesión previa con fotolibro de firmas. Podés consultar y armar a tu gusto en:',
    esInmueble: false
  },
  inmueble: {
    fotos: [
      `${URL_BASE_WEB}/images/portfolio/inmuebles_01.jpg`,
      `${URL_BASE_WEB}/images/portfolio/inmuebles_02.jpg`
    ],
    textoMuestras: 'Producimos fotografía arquitectónica y de espacios con iluminación cuidada y gran angular:',
    textoPresupuesto: 'La fotografía de inmuebles se cotiza a medida según la cantidad de ambientes, metraje y zona. ¿De cuántos ambientes es la propiedad?',
    esInmueble: true
  },
  general: {
    fotos: [
      `${URL_BASE_WEB}/images/portfolio/general_01.jpg`,
      `${URL_BASE_WEB}/images/portfolio/general_02.jpg`
    ],
    textoMuestras: 'En NEO Producciones cuidamos cada detalle con casi dos décadas de trayectoria en Buenos Aires. Mirá algunas fotos:',
    textoPresupuesto: 'Podés conocer todas nuestras opciones y calcular el presupuesto a medida en:',
    esInmueble: false
  }
});

/**
 * Obtiene los enlaces, textos y fotos de referencia para un rubro y subtipo específico.
 * @param {string} rubro - 'sociales', 'corporativos', 'sesiones', 'comercial', 'desconocido'.
 * @param {string} subTipo - 'casamiento', 'civil', 'quince', 'inmueble', etc.
 * @returns {Object}
 */
export function obtenerContenidoPorRubro(rubro = 'desconocido', subTipo = 'general') {
  const clave = subTipo in CONTENIDO_POR_RUBRO ? subTipo : (rubro === 'comercial' ? 'inmueble' : 'general');
  const contenido = CONTENIDO_POR_RUBRO[clave] || CONTENIDO_POR_RUBRO.general;

  return {
    ...contenido,
    enlacePortfolio: `${URL_BASE_WEB}/#portfolio`,
    enlacePresupuesto: `${URL_BASE_WEB}/#presupuesto`,
    enlaceWhatsApp: 'https://wa.me/541140686925'
  };
}
