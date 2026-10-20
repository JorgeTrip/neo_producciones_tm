/**
 * @file PasoSeleccionItems.js
 * @description Componente declarativo del Paso 1: Selección de Servicio Base y Adicionales Opcionales.
 */

import { crearElemento, crearElementoSvg } from '../../scripts/utilidadesDom.js';
import { listarServiciosBase, listarAdicionales } from '../../scripts/dominio/catalogoPresupuesto.js';

/**
 * Renderiza el primer paso del wizard de presupuesto.
 * @param {object} opciones
 * @param {string} opciones.servicioSeleccionado - ID del servicio base activo.
 * @param {Array<string>} opciones.adicionalesSeleccionados - Arreglo de IDs de adicionales marcados.
 * @param {function(string): void} opciones.alSeleccionarServicio - Callback al cambiar servicio base.
 * @param {function(string): void} opciones.alAlternarAdicional - Callback al marcar/desmarcar adicional.
 * @param {function(): void} opciones.alAvanzar - Callback para ir al paso 2.
 * @returns {HTMLElement}
 */
export function renderizarPasoSeleccionItems({
  servicioSeleccionado,
  adicionalesSeleccionados,
  alSeleccionarServicio,
  alAlternarAdicional,
  alAvanzar
}) {
  const servicios = listarServiciosBase();
  const adicionales = listarAdicionales();

  return crearElemento('div', { className: 'wizard-step-body fade-in' }, [
    // Subtítulo y selector de Servicio Base
    crearElemento('div', { className: 'wizard-group-header' }, [
      crearElemento('h3', { className: 'wizard-group-title' }, ['1. Elegí el tipo de cobertura']),
      crearElemento('p', { className: 'wizard-group-desc' }, [
        'Seleccioná la categoría principal que mejor define tu evento o producción.'
      ])
    ]),
    crearElemento('div', { className: 'wizard-services-grid', role: 'radiogroup', 'aria-label': 'Servicio principal' },
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

    // Subtítulo y selector de Módulos Adicionales
    crearElemento('div', { className: 'wizard-group-header', style: { marginTop: '2.5rem' } }, [
      crearElemento('h3', { className: 'wizard-group-title' }, ['2. Adicionales opcionales']),
      crearElemento('p', { className: 'wizard-group-desc' }, [
        'Sumá servicios complementarios para una experiencia integral a tu medida.'
      ])
    ]),
    crearElemento('div', { className: 'wizard-extras-grid' },
      adicionales.map((extra) => {
        const estaMarcado = adicionalesSeleccionados.includes(extra.id);
        return crearElemento('label', {
          className: `wizard-card-checkbox ${estaMarcado ? 'checked' : ''}`.trim()
        }, [
          crearElemento('input', {
            type: 'checkbox',
            checked: estaMarcado ? 'checked' : '',
            onchange: () => alAlternarAdicional(extra.id)
          }),
          crearElemento('div', { className: 'checkbox-box' }, [
            estaMarcado ? '✓' : ''
          ]),
          crearElemento('div', { className: 'checkbox-info' }, [
            crearElemento('div', { className: 'checkbox-title' }, [extra.titulo]),
            crearElemento('p', { className: 'checkbox-desc' }, [extra.descripcion])
          ])
        ]);
      })
    ),

    // Barra de acciones inferior
    crearElemento('div', { className: 'wizard-actions-bar' }, [
      crearElemento('button', {
        type: 'button',
        className: 'btn-primary btn-wizard-next',
        onclick: alAvanzar
      }, [
        'Continuar al Paso 2 ',
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
