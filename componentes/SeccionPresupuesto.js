/**
 * @file SeccionPresupuesto.js
 * @description Componente Orquestador de la Sección de Presupuesto con Asistente Wizard en 2 Pasos.
 * Permite seleccionar Cobertura Base, Adicionales Opcionales y enviar directamente la consulta a WhatsApp.
 */

import { crearElemento } from '../scripts/utilidadesDom.js';
import { crearEstadoWizard } from '../scripts/aplicacion/estadoWizardPresupuesto.js';
import { generarEnlaceWhatsApp } from '../scripts/dominio/generadorMensajePresupuesto.js';
import { renderizarBarraProgresoWizard } from './wizard/BarraProgresoWizard.js';
import { renderizarPasoTipoCobertura } from './wizard/PasoTipoCobertura.js';
import { renderizarPasoAdicionales } from './wizard/PasoAdicionales.js';

/**
 * Renderiza la sección completa de presupuesto en el contenedor provisto.
 * @param {HTMLElement} contenedor - Elemento del DOM donde se montará la sección.
 */
export function renderizarSeccionPresupuesto(contenedor) {
  if (!contenedor) return;

  const store = crearEstadoWizard({ pasoInicial: 1, servicioInicial: 'sociales' });

  const nodoContenido = crearElemento('div', { className: 'container' }, [
    crearElemento('div', { className: 'presupuesto-intro reveal' }, [
      crearElemento('p', { className: 'section-label' }, ['Presupuesto']),
      crearElemento('h2', { className: 'section-title' }, [
        'Cotizá tu ',
        crearElemento('span', { className: 'grad' }, ['Cobertura'])
      ]),
      crearElemento('div', { className: 'divider' }),
      crearElemento('p', { className: 'presupuesto-lead' }, [
        'Elegí el servicio y los adicionales que necesitás para tu evento o producción. Te responderemos a la brevedad con una cotización personalizada.'
      ])
    ]),
    crearElemento('div', { className: 'wizard-card reveal reveal-delay-1', id: 'contenedorWizard' })
  ]);

  contenedor.replaceChildren(nodoContenido);

  const contenedorWizard = nodoContenido.querySelector('#contenedorWizard');

  function dispararWhatsApp(estado) {
    const enlace = generarEnlaceWhatsApp({
      servicioId: estado.servicioSeleccionado,
      adicionalesIds: estado.adicionalesSeleccionados
    });

    window.open(enlace, '_blank');
  }

  function renderizarPasoPorNumero(estado) {
    if (estado.pasoActual === 1) {
      return renderizarPasoTipoCobertura({
        servicioSeleccionado: estado.servicioSeleccionado,
        alSeleccionarServicio: (id) => store.seleccionarServicio(id),
        alAvanzar: () => store.avanzarPaso()
      });
    }

    return renderizarPasoAdicionales({
      servicioSeleccionado: estado.servicioSeleccionado,
      adicionalesSeleccionados: estado.adicionalesSeleccionados,
      alAlternarAdicional: (id) => store.alternarAdicional(id),
      alRetroceder: () => store.retrocederPaso(),
      alEnviarWhatsApp: () => dispararWhatsApp(estado)
    });
  }

  function actualizarVista() {
    const estado = store.obtenerEstado();

    const barraProgreso = renderizarBarraProgresoWizard({
      pasoActual: estado.pasoActual,
      alSeleccionarPaso: (paso) => store.irAPaso(paso)
    });

    const pasoNodo = renderizarPasoPorNumero(estado);
    contenedorWizard.replaceChildren(barraProgreso, pasoNodo);
  }

  // Suscribirse a los cambios del store para re-renderizar reactivamente el wizard
  store.suscribir(() => {
    actualizarVista();
  });

  actualizarVista();
}
