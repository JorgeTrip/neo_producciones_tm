/**
 * @fileoverview Cliente HTTP especializado en la bandeja de mensajería unificada de Meta Graph API.
 * Gestiona conversaciones de Instagram Direct y Facebook Messenger para @neo_producciones_tm.
 */

const URL_BASE_GRAPH = 'https://graph.facebook.com/v26.0';

export class ClienteMensajeriaMeta {
  /**
   * @param {Object} config
   * @param {string} config.instagramAccountId - Instagram Business Account ID.
   * @param {string} [config.facebookPageId] - ID de la Página de Facebook (defecto: '117835016903').
   * @param {string} config.tokenAcceso - Token de acceso de usuario con permisos de mensajería.
   * @param {typeof fetch} [clienteHttp] - Inyección de dependencia para llamadas HTTP.
   */
  constructor({ instagramAccountId, facebookPageId = '117835016903', tokenAcceso }, clienteHttp = fetch) {
    if (!instagramAccountId || !tokenAcceso) {
      throw new Error('Configuración incompleta: se requiere instagramAccountId y tokenAcceso.');
    }
    this.instagramAccountId = instagramAccountId;
    this.facebookPageId = facebookPageId;
    this.tokenAcceso = tokenAcceso;
    this.http = clienteHttp;
    this.cachedPageToken = null;
  }

  /**
   * Ejecuta peticiones HTTP contra la API de Meta Graph con manejo explícito de errores.
   * @private
   */
  async ejecutarPeticion(ruta, token, opciones = {}) {
    const separador = ruta.includes('?') ? '&' : '?';
    const url = `${URL_BASE_GRAPH}/${ruta}${separador}access_token=${token}`;

    const respuesta = await this.http(url, opciones);
    const datos = await respuesta.json();

    if (!respuesta.ok || datos.error) {
      const mensaje = datos.error?.message || `Código HTTP ${respuesta.status}`;
      throw new Error(`Error en Meta Graph API (${ruta}): ${mensaje}`);
    }

    return datos;
  }

  /**
   * Obtiene o reutiliza el Page Access Token necesario para la API de Messenger de la Página.
   * @private
   */
  async obtenerPageToken() {
    if (this.cachedPageToken) return this.cachedPageToken;

    const ruta = `${this.facebookPageId}?fields=access_token`;
    const res = await this.ejecutarPeticion(ruta, this.tokenAcceso);
    this.cachedPageToken = res.access_token || this.tokenAcceso;
    return this.cachedPageToken;
  }

  /**
   * Obtiene las conversaciones recientes de Instagram Direct.
   * @param {number} limite - Límite de conversaciones a consultar.
   */
  async obtenerConversacionesInstagram(limite = 20) {
    const campos = 'id,updated_time,participants,messages.limit(20){id,message,created_time,from,to}';
    const ruta = `${this.instagramAccountId}/conversations?fields=${campos}&limit=${limite}`;
    const res = await this.ejecutarPeticion(ruta, this.tokenAcceso);

    return (res.data || []).map((conv) => ({
      ...conv,
      canal: 'instagram'
    }));
  }

  /**
   * Obtiene las conversaciones recientes de Facebook Messenger.
   * @param {number} limite - Límite de conversaciones a consultar.
   */
  async obtenerConversacionesFacebook(limite = 20) {
    const pageToken = await this.obtenerPageToken();
    const campos = 'id,link,snippet,updated_time,message_count,unread_count,participants,messages.limit(20){id,message,created_time,from,to}';
    const ruta = `${this.facebookPageId}/conversations?fields=${campos}&limit=${limite}`;
    const res = await this.ejecutarPeticion(ruta, pageToken);

    return (res.data || []).map((conv) => ({
      ...conv,
      canal: 'facebook'
    }));
  }

  /**
   * Envía un mensaje de texto de respuesta a un destinatario específico.
   * @param {Object} params
   * @param {string} params.destinatarioId - ID del destinatario o hilo.
   * @param {string} params.texto - Contenido del mensaje.
   * @param {'instagram'|'facebook'} [params.canal] - Canal de destino.
   */
  async enviarMensaje({ destinatarioId, texto, canal = 'facebook' }) {
    if (!destinatarioId || !texto) {
      throw new Error('Se requiere destinatarioId y texto para enviar un mensaje.');
    }

    const token = canal === 'facebook' ? await this.obtenerPageToken() : this.tokenAcceso;
    const cuerpoPeticion = {
      recipient: { id: destinatarioId },
      message: { text: texto }
    };

    const endpoint = canal === 'facebook' ? `${this.facebookPageId}/messages` : 'me/messages';

    const res = await this.ejecutarPeticion(endpoint, token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpoPeticion)
    });

    return {
      exito: true,
      idMensaje: res.message_id || res.id
    };
  }
}
