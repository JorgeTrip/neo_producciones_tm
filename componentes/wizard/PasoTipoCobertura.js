/**
 * @file PasoTipoCobertura.js
 * @description Componente declarativo del Paso 1: Selección de Servicio Base / Cobertura.
 */

import { crearElemento, crearElementoSvg } from '../../scripts/utilidadesDom.js';
import { listarServiciosBase } from '../../scripts/dominio/catalogoPresupuesto.js';

/**
 * Renderiza el primer paso del wizard: selección del servicio base.
 * @param {object} opciones
 * @param {string} opciones.servicioSeleccionado - ID del servicio base activo.
 * @param {function(string): void} opciones.alSeleccionarServicio - Callback al cambiar servicio.
 * @param {function(): void} opciones.alAvanzar - Callback para ir al paso 2.
 * @returns {HTMLElement}
 */
export function renderizarPasoTipoCobertura({
  servicioSeleccionado,
  alSeleccionarServicio,
  alAvanzar
}) {
  const servicios = listarServiciosBase();

  return crearElemento('div', { className: 'wizard-step-body fade-in' }, [
    crearElemento('div', { className: 'wizard-group-header' }, [
      crearElemento('h3', { className: 'wizard-group-title' }, ['1. Elegí el tipo de cobertura']),
      crearElemento('p', { className: 'wizard-group-desc' }, [
        'Seleccioná la categoría principal que mejor define tu evento o producción.'
      ])
    ]),
    crearElemento('div', {
      className: 'wizard-services-grid',
      role: 'radiogroup',
      'aria-label': 'Servicio principal'
    },
      servicios.map((s) => {
        const esActivo = servicioSeleccionado === s.id;
        return crearElemento('div', {
          role: 'radio',
          'aria-checked': esActivo ? 'true' : 'false',
          tabindex: '0',
          className: `wizard-card-radio ${esActivo ? 'selected' : ''}`.trim(),
          onclick: () => alSeleccionarServicio(s.id),
          onkeydown: (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              alSeleccionarServicio(s.id);
            }
          }
        }, [
          crearElemento('div', { className: 'card-radio-indicator' }, [
            crearElemento('span', { className: 'radio-dot' })
          ]),
          crearElemento('div', { className: 'card-radio-content' }, [
            crearElemento('div', { className: 'card-radio-title' }, [s.titulo]),
            crearElemento('div', { className: 'card-radio-sub' }, [s.subtitulo]),
            crearElemento('p', { className: 'card-radio-desc' }, [s.descripcion])
          ])
        ]);
      })
    ),
    crearElemento('div', { className: 'wizard-actions-bar' }, [
      crearElemento('button', {
        type: 'button',
        className: 'btn-primary btn-wizard-next',
        onclick: alAvanzar
      }, [
        'Continuar a Adicionales ',
        crearElementoSvg('svg', {
          width: '18',
          height: '18',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          viewBox: '0 0 24 24'
        }, [
          crearElementoSvg('path', { d: 'M5 12h14M12 5l7 7-7 7' })
        ])
      ])
    ])
  ]);
}
