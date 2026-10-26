import { obtenerContenidoPorRubro } from '../dominio/catalogoMuestras.js';

/**
 * @fileoverview Servicio de Aplicación: Genera copys persuasivos en voseo rioplatense,
 * enlaces directos a secciones de la web y URLs de WhatsApp estructuradas.
 */

export class GeneradorRespuestasServicio {
  /**
   * Genera el saludo inicial cálido orientando al prospecto a definir su evento.
   * @param {Object} params
   * @param {string} [params.nombreCliente]
   * @returns {{ texto: string, fotos: string[] }}
   */
  generarRespuestaSaludoCalificacion({ nombreCliente = '' } = {}) {
    const vocativo = nombreCliente ? ` ${nombreCliente}` : '';
    const texto = `¡Hola${vocativo}! 👋 Qué alegría que pienses en NEO Producciones para tus recuerdos.\n\nPara orientarte con la mejor propuesta y mostrarte fotos de referencia: ¿qué tipo de evento o proyecto estás organizando? (Casamiento, 15 años, Bar/Bat Mitzvah, bautismo/comunión, evento corporativo, o fotos de inmuebles/comercial) 😊`;
    return { texto, fotos: [] };
  }

  /**
   * Genera aclaración cuando el prospecto pregunta precios sin haber especificado qué evento es.
   * @param {Object} params
   * @param {string} [params.nombreCliente]
   * @returns {{ texto: string }}
   */
  generarRespuestaPresupuestoSinRubro({ nombreCliente = '' } = {}) {
    const vocativo = nombreCliente ? ` ${nombreCliente}` : '';
    const texto = `¡Hola${vocativo}! Con gusto te paso toda la info. En NEO adaptamos las coberturas según el tipo de proyecto (sociales, corporativos o inmuebles).\n\nContame brevemente: ¿es para un casamiento, 15 años, evento empresarial o fotografía de inmuebles? Así te comparto las opciones exactas y el cotizador interactivo.`;
    return { texto };
  }

  /**
   * Genera mensaje para romper bucles cuando el usuario presiona repetidamente los botones de FAQ.
   * @param {Object} params
   * @param {string} [params.nombreCliente]
   * @returns {{ texto: string, fotos: string[] }}
   */
  generarRespuestaEscapeBucle({ nombreCliente = '' } = {}) {
    const vocativo = nombreCliente ? ` ${nombreCliente}` : '';
    const texto = `¡Hola${vocativo}! Veo que seleccionaste las opciones automáticas. Para asesorarte de verdad sin dar vueltas: ¿qué evento están organizando, en qué fecha estimada y en qué zona o salón? Escribinos acá abajo 👇`;
    return { texto, fotos: [] };
  }

  /**
   * Genera el mensaje con 2 fotos de muestra de la web y el enlace a la sección #portfolio.
   * @param {Object} params
   * @param {string} [params.nombreCliente]
   * @param {string} [params.rubro]
   * @param {string} [params.subTipo]
   * @returns {{ texto: string, fotos: string[], enlacePortfolio: string }}
   */
  generarRespuestaMuestras({ nombreCliente = '', rubro = 'sociales', subTipo = 'casamiento' } = {}) {
    const vocativo = nombreCliente ? ` ${nombreCliente}` : '';
    const contenido = obtenerContenidoPorRubro(rubro, subTipo);

    const texto = `¡Hola${vocativo}! ${contenido.textoMuestras}\n\nPodés ver más galerías y videos en nuestra web:\n${contenido.enlacePortfolio}\n\n¿Ya tienen fecha tentativa o lugar previsto?`;

    return {
      texto,
      fotos: contenido.fotos,
      enlacePortfolio: contenido.enlacePortfolio
    };
  }

  /**
   * Presenta las opciones de presupuesto respetando la regla especial de inmuebles.
   * @param {Object} params
   * @param {string} [params.rubro]
   * @param {string} [params.subTipo]
   * @returns {{ texto: string, esInmueble: boolean, enlacePresupuesto: string }}
   */
  generarRespuestaPresupuesto({ rubro = 'sociales', subTipo = 'casamiento' } = {}) {
    const contenido = obtenerContenidoPorRubro(rubro, subTipo);

    if (contenido.esInmueble) {
      return {
        texto: `${contenido.textoPresupuesto}\n${contenido.enlacePresupuesto}`,
        esInmueble: true,
        enlacePresupuesto: contenido.enlacePresupuesto
      };
    }

    const texto = `${contenido.textoPresupuesto}\n${contenido.enlacePresupuesto}\n\nAllí podés tildar los adicionales que desees (fotolibro, video, previa) y ver el total al instante.`;

    return {
      texto,
      esInmueble: false,
      enlacePresupuesto: contenido.enlacePresupuesto
    };
  }

  /**
   * Genera el cierre invitando a una llamada de 5 min o derivando a WhatsApp con los datos del lead pre-cargados.
   * @param {Object} params
   * @param {string} [params.nombreCliente]
   * @param {Object} [params.datosProspecto]
   * @returns {{ texto: string, enlaceWhatsApp: string }}
   */
  generarRespuestaCierreLlamada({ nombreCliente = '', datosProspecto = {} } = {}) {
    let detalleEvento = '';
    const partes = [];
    if (datosProspecto.subTipo) partes.push(datosProspecto.subTipo);
    if (datosProspecto.zonaSalon) partes.push(`en ${datosProspecto.zonaSalon}`);
    if (datosProspecto.fechaEstimada) partes.push(`el ${datosProspecto.fechaEstimada}`);

    if (partes.length > 0) {
      detalleEvento = ` para mi ${partes.join(' ')}`;
    }

    const mensajeWhatsApp = `¡Hola Jorge! Estuve consultando en NEO Producciones${detalleEvento}. Quisiera coordinar una llamada de 5 minutos o cotización final.`;
    const enlaceWhatsApp = `https://wa.me/541140686925?text=${encodeURIComponent(mensajeWhatsApp)}`;

    const texto = `¿Te gustaría que tengamos una llamada rápida de 5 minutos o coordinamos directamente por WhatsApp para congelar la fecha y ver disponibilidad?\n\n📲 Hacé clic acá para escribirnos directo: ${enlaceWhatsApp}`;

    return { texto, enlaceWhatsApp };
  }

  /**
   * Genera mensaje de reactivación silenciosa a las 24 horas de inactividad.
   * @param {Object} params
   * @param {string} [params.nombreCliente]
   * @returns {{ texto: string }}
   */
  generarMensajeSeguimiento({ nombreCliente = '' } = {}) {
    const vocativo = nombreCliente ? ` ${nombreCliente}` : '';
    const texto = `¡Hola${vocativo}! ¿Pudiste ver las fotos de la web? Contame si te quedó alguna duda o si querés que te reservemos la fecha tentativamente en agenda. ¡Un abrazo!`;
    return { texto };
  }
}
