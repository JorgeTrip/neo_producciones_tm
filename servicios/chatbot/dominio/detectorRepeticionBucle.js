/**
 * @fileoverview Regla pura de dominio: Detecta si un usuario está atrapado en un bucle de preguntas predefinidas (Icebreakers).
 * Si presiona el mismo botón varias veces en una ventana de tiempo corta, se activa la respuesta de escape.
 */

/**
 * Evalúa si el mensaje recibido constituye una repetición en bucle de un botón previo.
 * @param {Object} parametros
 * @param {string} parametros.textoNuevo - Contenido textual del mensaje entrante.
 * @param {number} parametros.marcaTiempoActual - Epoch en milisegundos del mensaje actual.
 * @param {Array<{ texto: string, marcaTiempo: number }>} [parametros.historialMensajes] - Historial reciente del usuario.
 * @param {number} [parametros.ventanaSegundos] - Ventana de sensibilidad en segundos (defecto: 15).
 * @returns {{ esBucle: boolean, conteoRepeticiones: number }}
 */
export function detectarRepeticionBucle({
  textoNuevo = '',
  marcaTiempoActual = Date.now(),
  historialMensajes = [],
  ventanaSegundos = 15
}) {
  const textoLimpio = typeof textoNuevo === 'string' ? textoNuevo.trim().toLowerCase() : '';
  if (!textoLimpio) {
    return { esBucle: false, conteoRepeticiones: 1 };
  }

  const ventanaMs = ventanaSegundos * 1000;
  let repeticionesPrevias = 0;

  for (const item of historialMensajes) {
    const textoPrevio = (item.texto || '').trim().toLowerCase();
    const diferenciaMs = Math.abs(marcaTiempoActual - item.marcaTiempo);

    if (textoPrevio === textoLimpio && diferenciaMs <= ventanaMs) {
      repeticionesPrevias += 1;
    }
  }

  return {
    esBucle: repeticionesPrevias >= 1,
    conteoRepeticiones: repeticionesPrevias + 1
  };
}
