import { esquemaParametrosMetricas } from './esquemasValidacion.js';
import { evaluarCandidatoPauta } from '../dominio/criterioGanadorPauta.js';

/**
 * @fileoverview Caso de uso: Consultar estadísticas de posts y detectar candidatos a pauta publicitaria.
 */

export class AnaliticaMetricasServicio {
  constructor(clienteMeta) {
    this.clienteMeta = clienteMeta;
  }

  /**
   * Obtiene publicaciones recientes, analiza su engagement y determina recomendaciones de pauta.
   * @param {Object} parametros
   */
  async auditarRendimiento(parametros = {}) {
    const { limite } = esquemaParametrosMetricas.parse(parametros);
    const respuestaMeta = await this.clienteMeta.obtenerPublicacionesRecientes(limite);
    const publicaciones = respuestaMeta.data || [];

    if (publicaciones.length === 0) {
      return {
        totalAnalizadas: 0,
        publicaciones: [],
        resumenPauta: 'No se encontraron publicaciones recientes para auditar.',
      };
    }

    // Adaptamos las publicaciones al modelo de dominio
    const adaptadas = publicaciones.map((post) => ({
      id: post.id,
      texto: post.caption || '',
      enlace: post.permalink,
      fecha: post.timestamp,
      meGusta: post.like_count || 0,
      comentarios: post.comments_count || 0,
      guardados: post.saved || 0,
      compartidos: post.shares || 0,
    }));

    // Evaluamos candidatos a pauta comparando contra el histórico auditado
    const evaluadas = adaptadas.map((post) => {
      const evaluacion = evaluarCandidatoPauta(post, adaptadas);
      return {
        ...post,
        analisisPauta: evaluacion,
      };
    });

    const candidatas = evaluadas.filter((p) => p.analisisPauta.esCandidato);

    return {
      totalAnalizadas: evaluadas.length,
      candidatasParaPauta: candidatas.length,
      publicaciones: evaluadas,
      resumenPauta:
        candidatas.length > 0
          ? `Se identificaron ${candidatas.length} publicaciones con interacción destacada recomendadas para Meta Ads.`
          : 'Ninguna publicación supera actualmente el umbral de +30% de interacción sobre la media.',
    };
  }
}
