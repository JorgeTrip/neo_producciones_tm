/**
 * @file estadoWizardPresupuesto.js
 * @description Gestor de estado (Store) desacoplado para el Wizard de Presupuesto.
 * Administra el paso actual (1: Cobertura, 2: Adicionales, 3: Contacto),
 * ítems seleccionados, datos del formulario y observadores reactivos.
 */

import { validarDatosContacto } from '../dominio/validadorPresupuesto.js';

const TOTAL_PASOS = 3;

/**
 * Crea una nueva instancia del gestor de estado para el wizard de presupuesto.
 * @param {object} [configuracionInicial]
 * @param {number} [configuracionInicial.pasoInicial=1]
 * @param {string} [configuracionInicial.servicioInicial='sociales']
 * @returns {object} Métodos de consulta y mutación del estado.
 */
export function crearEstadoWizard(configuracionInicial = {}) {
  let estado = {
    pasoActual: configuracionInicial.pasoInicial || 1,
    servicioSeleccionado: configuracionInicial.servicioInicial || 'sociales',
    adicionalesSeleccionados: [],
    datosContacto: {
      nombre: '',
      telefono: '',
      email: '',
      fechaEvento: '',
      zonaEvento: '',
      comentarios: ''
    },
    erroresValidacion: {}
  };

  const suscriptores = new Set();

  function notificar() {
    const estadoCopia = obtenerEstado();
    suscriptores.forEach((fn) => fn(estadoCopia));
  }

  function obtenerEstado() {
    return {
      pasoActual: estado.pasoActual,
      totalPasos: TOTAL_PASOS,
      servicioSeleccionado: estado.servicioSeleccionado,
      adicionalesSeleccionados: [...estado.adicionalesSeleccionados],
      datosContacto: { ...estado.datosContacto },
      erroresValidacion: { ...estado.erroresValidacion }
    };
  }

  function seleccionarServicio(id) {
    if (estado.servicioSeleccionado !== id) {
      estado.servicioSeleccionado = id;
      notificar();
    }
  }

  function alternarAdicional(id) {
    if (estado.adicionalesSeleccionados.includes(id)) {
      estado.adicionalesSeleccionados = estado.adicionalesSeleccionados.filter((x) => x !== id);
    } else {
      estado.adicionalesSeleccionados = [...estado.adicionalesSeleccionados, id];
    }
    notificar();
  }

  function actualizarDatosContacto(campo, valor) {
    estado.datosContacto = {
      ...estado.datosContacto,
      [campo]: valor
    };

    if (estado.erroresValidacion[campo]) {
      const nuevosErrores = { ...estado.erroresValidacion };
      delete nuevosErrores[campo];
      estado.erroresValidacion = nuevosErrores;
    }

    notificar();
  }

  function avanzarPaso() {
    if (estado.pasoActual < TOTAL_PASOS) {
      estado.pasoActual += 1;
      notificar();
    }
  }

  function retrocederPaso() {
    if (estado.pasoActual > 1) {
      estado.pasoActual -= 1;
      notificar();
    }
  }

  function irAPaso(paso) {
    if (paso >= 1 && paso <= TOTAL_PASOS && estado.pasoActual !== paso) {
      estado.pasoActual = paso;
      notificar();
    }
  }

  function validarPasoContacto() {
    const resultado = validarDatosContacto(estado.datosContacto);
    estado.erroresValidacion = resultado.errores;
    notificar();
    return resultado;
  }

  function suscribir(observador) {
    suscriptores.add(observador);
    return () => suscriptores.delete(observador);
  }

  return {
    obtenerEstado,
    seleccionarServicio,
    alternarAdicional,
    actualizarDatosContacto,
    avanzarPaso,
    retrocederPaso,
    irAPaso,
    validarPasoContacto,
    suscribir
  };
}
