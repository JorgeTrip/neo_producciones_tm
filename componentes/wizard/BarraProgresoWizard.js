/**
 * @file BarraProgresoWizard.js
 * @description Componente declarativo que renderiza la barra de progreso e indicador de pasos del Wizard.
 */

import { crearElemento } from '../../scripts/utilidadesDom.js';

/**
 * Renderiza la barra de progreso del wizard con accesibilidad ARIA.
 * @param {object} opciones
 * @param {number} opciones.pasoActual - Paso activo (1 o 2).
 * @param {function(number): void} opciones.alSeleccionarPaso - Callback para saltar entre pasos.
 * @returns {HTMLElement}
 */
export function renderizarBarraProgresoWizard({ pasoActual, alSeleccionarPaso }) {
  const pasos = [
    { numero: 1, etiqueta: 'Selección de Cobertura' },
    { numero: 2, etiqueta: 'Datos del Evento y Envío' }
  ];

  return crearElemento('div', {
    className: 'wizard-progress-bar',
    role: 'navigation',
    'aria-label': 'Progreso del asistente de presupuesto'
  }, [
    crearElemento('div', { className: 'wizard-steps-track' }, pasos.map((p) => {
      const estaActivo = pasoActual === p.numero;
      const estaCompletado = pasoActual > p.numero;

      const clasesBoton = [
        'wizard-step-node',
        estaActivo ? 'active' : '',
        estaCompletado ? 'completed' : ''
      ].filter(Boolean).join(' ');

      return crearElemento('button', {
        type: 'button',
        className: clasesBoton,
        'aria-current': estaActivo ? 'step' : 'false',
        onclick: () => {
          if (p.numero <= pasoActual || estaCompletado) {
            alSeleccionarPaso(p.numero);
          }
        }
      }, [
        crearElemento('span', { className: 'step-badge' }, [
          estaCompletado ? '✓' : String(p.numero)
        ]),
        crearElemento('span', { className: 'step-label' }, [p.etiqueta])
      ]);
    }))
  ]);
}
