/**
 * Gestor de Versión y Changelog - NEO Producciones.
 * Servicio desacoplado para consultar metadatos de versión y registros de commits
 * generados por el pipeline automatizado de CI/CD.
 */

let versionEnCache = null;
let historialEnCache = null;

const VERSION_POR_DEFECTO = {
  version: '1.1.0',
  autor: 'Jorge O. Tripodi',
  fechaActualizacion: '2026-10-02',
  descripcion: 'Sitio oficial de fotografía profesional y producciones audiovisuales.'
};

/**
 * Obtiene la información de versión del proyecto desde version.json o caché local.
 * @returns {Promise<{ version: string, autor: string, fechaActualizacion: string, descripcion: string }>}
 */
export async function obtenerInformacionVersion() {
  if (versionEnCache) return versionEnCache;

  try {
    const respuesta = await fetch('version.json?t=' + Date.now());
    if (respuesta.ok) {
      versionEnCache = await respuesta.json();
      return versionEnCache;
    }
  } catch (error) {
    console.warn('No se pudo cargar version.json remoto, usando respaldo local:', error);
  }

  versionEnCache = VERSION_POR_DEFECTO;
  return versionEnCache;
}

/**
 * Consulta y parsea el archivo de historial git-log.txt generado por CI/CD.
 * @returns {Promise<Array<{ hash: string, fecha: string, autor: string, mensaje: string, tipo: string }>>}
 */
export async function obtenerHistorialCambios() {
  if (historialEnCache) return historialEnCache;

  try {
    const respuesta = await fetch('git-log.txt?t=' + Date.now());
    if (respuesta.ok) {
      const texto = await respuesta.text();
      historialEnCache = parsearLogGit(texto);
      return historialEnCache;
    }
  } catch (error) {
    console.warn('No se pudo cargar git-log.txt:', error);
  }

  return [];
}

/**
 * Parsea el texto del log generado por git log a un listado estructurado de cambios.
 * Formato esperado: * YYYY-MM-DD [hash] mensaje (autor)
 * @param {string} textoLog - Contenido textual de git-log.txt.
 * @returns {Array<{ hash: string, fecha: string, autor: string, mensaje: string, tipo: string }>}
 */
function parsearLogGit(textoLog) {
  const lineas = textoLog.split('\n').filter(l => l.trim().length > 0);
  const entradas = [];

  for (const linea of lineas) {
    const regex = /^\*\s+(\d{4}-\d{2}-\d{2})\s+\[([a-f0-9]+)\]\s+(.*?)(?:\s+\((.*?)\))?$/;
    const coincidencia = linea.match(regex);

    if (coincidencia) {
      const [, fecha, hash, mensaje, autor] = coincidencia;
      let tipo = 'general';
      if (/^feat[:\s]|🚀/i.test(mensaje)) tipo = 'feat';
      else if (/^fix[:\s]|🔧/i.test(mensaje)) tipo = 'fix';
      else if (/^refactor[:\s]/i.test(mensaje)) tipo = 'refactor';
      else if (/^breaking[:\s]/i.test(mensaje)) tipo = 'breaking';

      entradas.push({
        fecha,
        hash,
        mensaje: mensaje.trim(),
        autor: autor || 'Jorge O. Tripodi',
        tipo
      });
    } else {
      // Línea de formato alternativo
      entradas.push({
        fecha: 'Reciente',
        hash: 'commit',
        mensaje: linea.replace(/^\*\s*/, '').trim(),
        autor: 'Jorge O. Tripodi',
        tipo: 'general'
      });
    }
  }

  return entradas;
}
