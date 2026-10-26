import { clasificarRubro, extraerDatosMensaje, detectarIntencion } from '../dominio/clasificadorRubro.js';
import { detectarRepeticionBucle } from '../dominio/detectorRepeticionBucle.js';

/**
 * @fileoverview Servicio de Aplicación: Gestiona la máquina de estados y las transiciones
 * conversacionales del diálogo entre el prospecto y el chatbot de NEO Producciones.
 */
export class GestorDialogoServicio {
  /**
   * @param {Object} dependencias
   * @param {import('./generadorRespuestasServicio.js').GeneradorRespuestasServicio} dependencias.generadorRespuestas
   */
  constructor({ generadorRespuestas }) {
    this.generador = generadorRespuestas;
  }

  /**
   * Procesa un turno del diálogo conversacional actualizando la ficha del prospecto
   * y determinando la respuesta precisa según el embudo.
   *
   * @param {Object} params
   * @param {import('../dominio/conversacion.js').Conversacion} params.conversacion
   * @param {string} params.textoMensaje
   * @param {Array<{ texto: string, marcaTiempo: number }>} [params.historialMensajes]
   * @param {number} [params.ahora]
   * @returns {{ accion: string, respuesta: Object|null, pasoSiguiente: string }}
   */
  procesarTurno({ conversacion, textoMensaje = '', historialMensajes = [], ahora = Date.now() }) {
    if (conversacion.estaEnPausaHumana(ahora)) {
      return {
        accion: 'OMITIDO_EN_PAUSA_HUMANA',
        respuesta: null,
        pasoSiguiente: conversacion.pasoActual
      };
    }

    const bucle = detectarRepeticionBucle({
      textoNuevo: textoMensaje,
      marcaTiempoActual: ahora,
      historialMensajes
    });

    if (bucle.esBucle) {
      const escape = this.generador.generarRespuestaEscapeBucle({
        nombreCliente: conversacion.nombreCliente
      });
      return {
        accion: 'RESPUESTA_ESCAPE_BUCLE',
        respuesta: escape,
        pasoSiguiente: 'SALUDO_Y_CALIFICACION'
      };
    }

    const { rubro, subTipo, esInmueble } = clasificarRubro(textoMensaje);
    const datosExtra = extraerDatosMensaje(textoMensaje);
    const intencion = detectarIntencion(textoMensaje);

    conversacion.actualizarDatosProspecto({
      rubro: rubro !== 'desconocido' ? rubro : undefined,
      subTipo: subTipo !== 'general' ? subTipo : undefined,
      ...datosExtra
    });

    return this.determinarRespuestaPorEstado({ conversacion, intencion, esInmueble });
  }

  /**
   * Determina la respuesta adecuada según los datos acumulados y la intención detectada.
   * @private
   */
  determinarRespuestaPorEstado({ conversacion, intencion, esInmueble }) {
    const nombre = conversacion.nombreCliente;
    const rubroActual = conversacion.prospecto.rubro;
    const subTipoActual = conversacion.prospecto.subTipo;

    // 1. Pedido explícito de llamada, WhatsApp o cierre
    if (intencion.pideContactoOCierre) {
      const cierre = this.generador.generarRespuestaCierreLlamada({
        nombreCliente: nombre,
        datosProspecto: conversacion.prospecto
      });
      conversacion.actualizarPaso('DERIVADO_WHATSAPP');
      return { accion: 'RESPUESTA_CIERRE_WHATSAPP', respuesta: cierre, pasoSiguiente: 'DERIVADO_WHATSAPP' };
    }

    // 2. Fotografía comercial / Inmuebles
    if (esInmueble || rubroActual === 'comercial') {
      if (conversacion.pasoActual === 'PROPUESTA_PRESUPUESTO') {
        const cierre = this.generador.generarRespuestaCierreLlamada({
          nombreCliente: nombre,
          datosProspecto: conversacion.prospecto
        });
        conversacion.actualizarPaso('DERIVADO_WHATSAPP');
        return { accion: 'RESPUESTA_CIERRE_WHATSAPP', respuesta: cierre, pasoSiguiente: 'DERIVADO_WHATSAPP' };
      }
      const presInmueble = this.generador.generarRespuestaPresupuesto({ rubro: 'comercial', subTipo: 'inmueble' });
      conversacion.actualizarPaso('PROPUESTA_PRESUPUESTO');
      return { accion: 'RESPUESTA_PRESUPUESTO_INMUEBLE', respuesta: presInmueble, pasoSiguiente: 'PROPUESTA_PRESUPUESTO' };
    }

    // 3. Prospecto sin rubro identificado aún
    if (!rubroActual) {
      if (intencion.pidePresupuesto) {
        const aclaracion = this.generador.generarRespuestaPresupuestoSinRubro({ nombreCliente: nombre });
        return { accion: 'RESPUESTA_PRESUPUESTO_SIN_RUBRO', respuesta: aclaracion, pasoSiguiente: 'SALUDO_Y_CALIFICACION' };
      }
      const saludo = this.generador.generarRespuestaSaludoCalificacion({ nombreCliente: nombre });
      return { accion: 'RESPUESTA_SALUDO_CALIFICACION', respuesta: saludo, pasoSiguiente: 'SALUDO_Y_CALIFICACION' };
    }

    // 4. Prospecto con rubro identificado
    if (conversacion.pasoActual === 'SALUDO_Y_CALIFICACION') {
      const muestras = this.generador.generarRespuestaMuestras({
        nombreCliente: nombre,
        rubro: rubroActual,
        subTipo: subTipoActual
      });
      conversacion.actualizarPaso('ENTREGA_MUESTRAS');
      return { accion: 'RESPUESTA_MUESTRAS_PORTFOLIO', respuesta: muestras, pasoSiguiente: 'ENTREGA_MUESTRAS' };
    }

    if (conversacion.pasoActual === 'ENTREGA_MUESTRAS') {
      const pres = this.generador.generarRespuestaPresupuesto({
        rubro: rubroActual,
        subTipo: subTipoActual
      });
      conversacion.actualizarPaso('PROPUESTA_PRESUPUESTO');
      return { accion: 'RESPUESTA_PROPUESTA_PRESUPUESTO', respuesta: pres, pasoSiguiente: 'PROPUESTA_PRESUPUESTO' };
    }

    const cierre = this.generador.generarRespuestaCierreLlamada({
      nombreCliente: nombre,
      datosProspecto: conversacion.prospecto
    });
    conversacion.actualizarPaso('DERIVADO_WHATSAPP');
    return { accion: 'RESPUESTA_CIERRE_WHATSAPP', respuesta: cierre, pasoSiguiente: 'DERIVADO_WHATSAPP' };
  }
}
