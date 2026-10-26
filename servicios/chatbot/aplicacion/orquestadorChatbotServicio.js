import { Conversacion } from '../dominio/conversacion.js';
import { GestorDialogoServicio } from './gestorDialogoServicio.js';

/**
 * @fileoverview Orquestador de Aplicación: Coordina la inspección de bandejas de Meta,
 * el respeto a la pausa por intervención humana, el diálogo y el seguimiento a inactivos.
 */
export class OrquestadorChatbotServicio {
  constructor({
    clienteMensajeria,
    generadorRespuestas,
    gestorDialogo,
    repositorio,
    facebookPageId = '117835016903',
    instagramAccountId = '17841449181096804'
  }) {
    this.cliente = clienteMensajeria;
    this.generador = generadorRespuestas;
    this.gestorDialogo = gestorDialogo || new GestorDialogoServicio({ generadorRespuestas });
    this.repo = repositorio;
    this.pageId = facebookPageId;
    this.igId = instagramAccountId;
  }

  /**
   * Obtiene la lista combinada de conversaciones según el canal solicitado.
   * @private
   */
  async obtenerTodasLasConversaciones(canal) {
    const conversaciones = [];
    if (canal === 'facebook' || canal === 'ambos') {
      const fbConvs = await this.cliente.obtenerConversacionesFacebook(15);
      conversaciones.push(...fbConvs);
    }
    if (canal === 'instagram' || canal === 'ambos') {
      const igConvs = await this.cliente.obtenerConversacionesInstagram(15);
      conversaciones.push(...igConvs);
    }
    return conversaciones;
  }

  /**
   * Procesa conversaciones recientes y genera respuestas a mensajes de clientes entrantes.
   */
  async procesarMensajesNuevos({ canal = 'ambos', enviarRespuestasReales = false } = {}) {
    const conversaciones = await this.obtenerTodasLasConversaciones(canal);
    const accionesTomadas = [];

    for (const convData of conversaciones) {
      const resultado = await this.procesarConversacionIndividual(convData, enviarRespuestasReales);
      if (resultado) accionesTomadas.push(resultado);
    }

    return { totalProcesadas: conversaciones.length, accionesTomadas };
  }

  /**
   * Evalúa y procesa una conversación individual.
   * @private
   */
  async procesarConversacionIndividual(convData, enviarRespuestasReales) {
    const hiloId = convData.id;
    const esFb = convData.canal === 'facebook';
    const miId = esFb ? this.pageId : this.igId;

    const participantes = convData.participants?.data || [];
    const otro = participantes.find((p) => p.id !== miId);
    const nombreCliente = otro?.name || otro?.username || 'Cliente';
    const destinatarioId = otro?.id;

    const mensajes = (convData.messages?.data || []).sort(
      (a, b) => new Date(a.created_time) - new Date(b.created_time)
    );
    if (mensajes.length === 0) return null;

    const ultimoMensaje = mensajes[mensajes.length - 1];
    const ultimoEsMio = ultimoMensaje.from?.id === miId;

    const datosGuardados = this.repo.obtenerPorId(hiloId) || {};
    const conv = new Conversacion({
      id: hiloId,
      nombreCliente,
      canal: convData.canal,
      pasoActual: datosGuardados.pasoActual || 'SALUDO_Y_CALIFICACION',
      pausaHumanaHasta: datosGuardados.pausaHumanaHasta || 0,
      prospecto: datosGuardados.prospecto || {}
    });

    if (ultimoEsMio) {
      conv.registrarIntervencionHumana(24, Date.now());
      this.repo.guardar({ ...conv, pausaHumanaHasta: conv.pausaHumanaHasta });
      return { hiloId, cliente: nombreCliente, accion: 'PAUSA_HUMANA_REGISTRADA' };
    }

    if (conv.estaEnPausaHumana()) {
      return { hiloId, cliente: nombreCliente, accion: 'OMITIDO_EN_PAUSA_HUMANA' };
    }

    const historial = mensajes.slice(0, -1).map((m) => ({
      texto: m.message || '',
      marcaTiempo: new Date(m.created_time).getTime()
    }));

    const resultadoTurno = this.gestorDialogo.procesarTurno({
      conversacion: conv,
      textoMensaje: ultimoMensaje.message || '',
      historialMensajes: historial,
      ahora: new Date(ultimoMensaje.created_time).getTime()
    });

    if (resultadoTurno.accion === 'OMITIDO_EN_PAUSA_HUMANA') {
      return { hiloId, cliente: nombreCliente, accion: 'OMITIDO_EN_PAUSA_HUMANA' };
    }

    const respuestaTexto = resultadoTurno.respuesta?.texto || '';

    if (enviarRespuestasReales && destinatarioId && respuestaTexto) {
      await this.cliente.enviarMensaje({ destinatarioId, texto: respuestaTexto, canal: convData.canal });
    }

    this.repo.guardar({ ...conv, actualizadoEn: Date.now() });

    return { hiloId, cliente: nombreCliente, accion: resultadoTurno.accion, respuestaSugerida: respuestaTexto };
  }

  /**
   * Revisa conversaciones inactivas por más de 24 horas tras un mensaje nuestro y propone reactivación.
   */
  async procesarSeguimientosInactivos({ canal = 'ambos', enviarRespuestasReales = false } = {}) {
    const conversaciones = await this.obtenerTodasLasConversaciones(canal);
    const seguimientosSugeridos = [];
    const umbralInactividadMs = 24 * 60 * 60 * 1000;
    const ahora = Date.now();

    for (const convData of conversaciones) {
      const esFb = convData.canal === 'facebook';
      const miId = esFb ? this.pageId : this.igId;
      const participantes = convData.participants?.data || [];
      const otro = participantes.find((p) => p.id !== miId);
      const nombreCliente = otro?.name || otro?.username || 'Cliente';
      const destinatarioId = otro?.id;

      const mensajes = (convData.messages?.data || []).sort(
        (a, b) => new Date(a.created_time) - new Date(b.created_time)
      );
      if (mensajes.length === 0) continue;

      const ultimoMensaje = mensajes[mensajes.length - 1];
      const ultimoEsMio = ultimoMensaje.from?.id === miId;
      const tiempoDesdeUltimoMs = ahora - new Date(ultimoMensaje.created_time).getTime();

      if (ultimoEsMio && tiempoDesdeUltimoMs >= umbralInactividadMs) {
        const mensajeFollowUp = this.generador.generarMensajeSeguimiento({ nombreCliente }).texto;

        if (enviarRespuestasReales && destinatarioId) {
          await this.cliente.enviarMensaje({ destinatarioId, texto: mensajeFollowUp, canal: convData.canal });
        }

        seguimientosSugeridos.push({
          hiloId: convData.id,
          cliente: nombreCliente,
          horasInactivo: Math.round(tiempoDesdeUltimoMs / (1000 * 60 * 60)),
          mensajeSeguimiento: mensajeFollowUp
        });
      }
    }

    return { totalInactivas: seguimientosSugeridos.length, seguimientosSugeridos };
  }
}
