/**
 * @fileoverview Entidad de dominio: Representa el estado y ciclo de vida de una conversación comercial.
 * Gestiona el progreso en el embudo, la calificación progresiva del prospecto y la pausa ante intervención humana.
 */

export class Conversacion {
  /**
   * @param {Object} parametros
   * @param {string} parametros.id - Identificador único del hilo o conversación.
   * @param {string} [parametros.nombreCliente] - Nombre del prospecto.
   * @param {string} [parametros.canal] - Canal de origen ('instagram' o 'facebook').
   * @param {string} [parametros.pasoActual] - Paso del embudo.
   * @param {number} [parametros.pausaHumanaHasta] - Timestamp epoch hasta el cual el bot está silenciado.
   * @param {Object} [parametros.prospecto] - Datos acumulados del prospecto.
   */
  constructor({
    id,
    nombreCliente = '',
    canal = 'facebook',
    pasoActual = 'SALUDO_Y_CALIFICACION',
    pausaHumanaHasta = 0,
    prospecto = {}
  }) {
    if (!id) {
      throw new Error('La conversación requiere un identificador único.');
    }
    this.id = id;
    this.nombreCliente = nombreCliente;
    this.canal = canal;
    this.pasoActual = pasoActual;
    this.pausaHumanaHasta = pausaHumanaHasta;
    this.prospecto = {
      rubro: prospecto.rubro || '',
      subTipo: prospecto.subTipo || '',
      fechaEstimada: prospecto.fechaEstimada || '',
      zonaSalon: prospecto.zonaSalon || '',
      telefono: prospecto.telefono || ''
    };
  }

  /**
   * Actualiza el paso del embudo conversacional.
   * @param {string} nuevoPaso
   */
  actualizarPaso(nuevoPaso) {
    this.pasoActual = nuevoPaso;
  }

  /**
   * Registra una intervención manual de Jorge y pausa el bot por un tiempo determinado.
   * @param {number} duracionHoras - Cantidad de horas a pausar (defecto: 24).
   * @param {number} ahora - Epoch en milisegundos del momento de la intervención.
   */
  registrarIntervencionHumana(duracionHoras = 24, ahora = Date.now()) {
    const duracionMs = duracionHoras * 60 * 60 * 1000;
    this.pausaHumanaHasta = ahora + duracionMs;
  }

  /**
   * Determina si la conversación está actualmente pausada por intervención humana.
   * @param {number} ahora - Epoch en milisegundos a evaluar.
   * @returns {boolean}
   */
  estaEnPausaHumana(ahora = Date.now()) {
    return this.pausaHumanaHasta > ahora;
  }

  /**
   * Agrega o complementa datos del prospecto sin sobreescribir lo ya existente con valores vacíos.
   * @param {Object} datos
   */
  actualizarDatosProspecto(datos = {}) {
    if (datos.rubro) this.prospecto.rubro = datos.rubro;
    if (datos.subTipo) this.prospecto.subTipo = datos.subTipo;
    if (datos.fechaEstimada) this.prospecto.fechaEstimada = datos.fechaEstimada;
    if (datos.zonaSalon) this.prospecto.zonaSalon = datos.zonaSalon;
    if (datos.telefono) this.prospecto.telefono = datos.telefono;
  }

  /**
   * Computa el nivel de calificación alcanzado por el prospecto.
   * @returns {'NO_CALIFICADO' | 'CALIFICADO_PARCIAL' | 'CALIFICADO_COMPLETO' | 'DERIVADO'}
   */
  obtenerEstadoCalificacion() {
    if (this.pasoActual === 'DERIVADO_WHATSAPP') {
      return 'DERIVADO';
    }

    const tieneEvento = Boolean(this.prospecto.rubro || this.prospecto.subTipo);
    const tieneDetalles = Boolean(this.prospecto.fechaEstimada || this.prospecto.zonaSalon);

    if (tieneEvento && tieneDetalles) {
      return 'CALIFICADO_COMPLETO';
    }
    if (tieneEvento || tieneDetalles) {
      return 'CALIFICADO_PARCIAL';
    }
    return 'NO_CALIFICADO';
  }
}
