/**
 * @fileoverview Reglas de dominio para evaluar publicaciones candidatas a pauta publicitaria (Meta Ads).
 * Permite a NEO Producciones maximizar el retorno de inversión identificando publicaciones
 * cuyo rendimiento orgánico en interacción clave (guardados y compartidos) supera el promedio habitual.
 */

/**
 * Evalúa si una publicación debe ser impulsada con presupuesto publicitario en función del histórico.
 * @param {Object} publicacion - Métricas de la publicación a evaluar.
 * @param {number} publicacion.guardados - Cantidad de guardados orgánicos.
 * @param {number} publicacion.compartidos - Cantidad de veces compartida.
 * @param {Array<Object>} historico - Colección de publicaciones previas de referencia.
 * @returns {{ esCandidato: boolean, motivo: string, tipoPublicoRecomendado?: 'FRIO' | 'TIBIO' }}
 */
export function evaluarCandidatoPauta(publicacion, historico = []) {
  if (!historico || historico.length === 0) {
    return {
      esCandidato: false,
      motivo: 'No hay suficiente histórico de publicaciones para establecer una línea base.',
    };
  }

  // Calculamos promedios históricos
  const totalGuardados = historico.reduce((acumulado, post) => acumulado + (post.guardados || 0), 0);
  const totalCompartidos = historico.reduce((acumulado, post) => acumulado + (post.compartidos || 0), 0);

  const promedioGuardados = totalGuardados / historico.length;
  const promedioCompartidos = totalCompartidos / historico.length;

  // Umbral del 30% superior al promedio
  const umbralGuardados = promedioGuardados * 1.3;
  const umbralCompartidos = promedioCompartidos * 1.3;

  const superaGuardados = publicacion.guardados >= umbralGuardados;
  const superaCompartidos = publicacion.compartidos >= umbralCompartidos;

  if (superaGuardados || superaCompartidos) {
    return {
      esCandidato: true,
      motivo: `Supera el umbral de alto rendimiento orgánico (+30% sobre el promedio histórico). Guardados: ${publicacion.guardados} (promedio: ${promedioGuardados.toFixed(1)}).`,
      tipoPublicoRecomendado: 'FRIO',
    };
  }

  return {
    esCandidato: false,
    motivo: 'El rendimiento se encuentra dentro de los parámetros habituales de la cuenta.',
  };
}
