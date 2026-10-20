/**
 * @file SeccionPresupuesto.js
 * @description Componente Orquestador de la Sección de Presupuesto con Asistente Wizard en 2 Pasos.
 * Vincula el gestor de estado con los componentes visuales de presentación.
 */

import { crearElemento } from '../scripts/utilidadesDom.js';
import { crearEstadoWizard } from '../scripts/aplicacion/estadoWizardPresupuesto.js';
import { renderizarBarraProgresoWizard } from './wizard/BarraProgresoWizard.js';
import { renderizarPasoSeleccionItems } from './wizard/PasoSeleccionItems.js';
import { renderizarPasoContactoPresupuesto } from './wizard/PasoContactoPresupuesto.js';

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
        'Cotizá tu',
        crearElemento('br'),
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

  function actualizarVista() {
    const estado = store.obtenerEstado();

    const barraProgreso = renderizarBarraProgresoWizard({
      pasoActual: estado.pasoActual,
      alSeleccionarPaso: (paso) => store.irAPaso(paso)
    });

    const pasoNodo = estado.pasoActual === 1
      ? renderizarPasoSeleccionItems({
          servicioSeleccionado: estado.servicioSeleccionado,
          adicionalesSeleccionados: estado.adicionalesSeleccionados,
          alSeleccionarServicio: (id) => store.seleccionarServicio(id),
          alAlternarAdicional: (id) => store.alternarAdicional(id),
          alAvanzar: () => store.avanzarPaso()
        })
      : renderizarPasoContactoPresupuesto({
          servicioSeleccionado: estado.servicioSeleccionado,
          adicionalesSeleccionados: estado.adicionalesSeleccionados,
          datosContacto: estado.datosContacto,
          erroresValidacion: estado.erroresValidacion,
          alModificarDato: (campo, valor) => store.actualizarDatosContacto(campo, valor),
          alRetroceder: () => store.retrocederPaso(),
          alValidar: () => store.validarPasoContacto().esValido
        });

    contenedorWizard.replaceChildren(barraProgreso, pasoNodo);
  }

  // Suscribirse a los cambios del store para re-renderizar reactivamente el wizard
  store.suscribir(() => {
    actualizarVista();
  });

  actualizarVista();
}
