/**
 * @fileoverview Adaptador de Aplicación para Webhooks de Meta (Facebook Messenger e Instagram Direct).
 * Normaliza el reto de verificación GET (hub.challenge) y extrae los mensajes de eventos POST entrantes.
 */

export class AdaptadorWebhookMeta {
  /**
   * @param {Object} [config]
   * @param {string} [config.tokenVerificacion] - Token secreto configurado para validar la suscripción.
   */
  constructor({ tokenVerificacion = process.env.WEBHOOK_VERIFY_TOKEN || 'mock_val' } = {}) {
    this.tokenVerificacion = tokenVerificacion;
  }

  /**
   * Valida la petición GET de handshake enviada por los servidores de Meta.
   * @param {Record<string, string>} queryParams - Parámetros de la URL ('hub.mode', 'hub.verify_token', 'hub.challenge').
   * @returns {{ esValido: boolean, challenge: string|null }}
   */
  verificarSuscripcion(queryParams = {}) {
    const modo = queryParams['hub.mode'];
    const token = queryParams['hub.verify_token'];
    const challenge = queryParams['hub.challenge'];

    if (modo === 'subscribe' && token === this.tokenVerificacion && challenge) {
      return { esValido: true, challenge };
    }

    return { esValido: false, challenge: null };
  }

  /**
   * Extrae los mensajes válidos de texto a partir del payload JSON de Meta.
   * @param {Object} payload - Cuerpo del evento POST de Meta.
   * @returns {Array<{ emisorId: string, receptorId: string, texto: string, canal: string, marcaTiempo: number }>}
   */
  extraerMensajesEntrantes(payload = {}) {
    const mensajesExtraidos = [];
    if (!payload?.entry || !Array.isArray(payload.entry)) {
      return mensajesExtraidos;
    }

    const esInstagram = payload.object === 'instagram';
    const canal = esInstagram ? 'instagram' : 'facebook';

    for (const entrada of payload.entry) {
      const eventos = entrada.messaging || [];
      for (const evento of eventos) {
        const texto = evento.message?.text || evento.message?.quick_reply?.payload;
        if (!texto) continue;

        mensajesExtraidos.push({
          emisorId: evento.sender?.id,
          receptorId: evento.recipient?.id,
          texto,
          canal,
          marcaTiempo: evento.timestamp || Date.now()
        });
      }
    }

    return mensajesExtraidos;
  }
}
