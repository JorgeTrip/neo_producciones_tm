/**
 * @fileoverview Función Serverless de Netlify para Webhooks de Meta (Facebook Messenger e Instagram Direct).
 * Procesa el reto de suscripción GET y despacha mensajes entrantes POST en tiempo real 24/7.
 */

import { AdaptadorWebhookMeta } from '../../servicios/chatbot/aplicacion/adaptadorWebhookMeta.js';
import { OrquestadorChatbotServicio } from '../../servicios/chatbot/aplicacion/orquestadorChatbotServicio.js';
import { ClienteMensajeriaMeta } from '../../servicios/chatbot/infraestructura/clienteMensajeriaMeta.js';
import { GeneradorRespuestasServicio } from '../../servicios/chatbot/aplicacion/generadorRespuestasServicio.js';
import { RepositorioConversacionesLocal } from '../../servicios/chatbot/infraestructura/repositorioConversacionesLocal.js';

/**
 * Manejador principal desacoplado para facilitar testing unitario y ejecución en Netlify.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function manejarPeticionWebhook(request) {
  const url = new URL(request.url);
  const tokenEsperado = process.env.WEBHOOK_VERIFY_TOKEN || 'mock_val';
  const adaptador = new AdaptadorWebhookMeta({ tokenVerificacion: tokenEsperado });

  // 1. Handshake de Verificación (GET)
  if (request.method === 'GET') {
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const validacion = adaptador.verificarSuscripcion(queryParams);

    if (validacion.esValido) {
      return new Response(validacion.challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    return new Response('Verificación rechazada.', { status: 403 });
  }

  // 2. Recepción de Eventos de Mensajería (POST)
  if (request.method === 'POST') {
    try {
      const payload = await request.json();
      const mensajes = adaptador.extraerMensajesEntrantes(payload);

      if (mensajes.length > 0) {
        const token = process.env.INSTAGRAM_ACCESS_TOKEN;
        const igId = process.env.INSTAGRAM_ACCOUNT_ID || '17841449181096804';
        const pageId = process.env.FACEBOOK_PAGE_ID || '117835016903';

        if (token) {
          const cliente = new ClienteMensajeriaMeta({
            instagramAccountId: igId,
            facebookPageId: pageId,
            tokenAcceso: token
          });
          const generador = new GeneradorRespuestasServicio();
          const repositorio = new RepositorioConversacionesLocal();
          const orquestador = new OrquestadorChatbotServicio({
            clienteMensajeria: cliente,
            generadorRespuestas: generador,
            repositorio,
            facebookPageId: pageId,
            instagramAccountId: igId
          });

          // Procesa en segundo plano los mensajes sin bloquear la respuesta HTTP
          orquestador.procesarMensajesNuevos({ canal: 'ambos', enviarRespuestasReales: true }).catch((err) => {
            console.error('Error al procesar eventos en segundo plano:', err.message);
          });
        }
      }

      return new Response(JSON.stringify({ status: 'EVENT_RECEIVED' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error en webhook POST:', error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Método no permitido', { status: 405 });
}

export default async (req) => manejarPeticionWebhook(req);
