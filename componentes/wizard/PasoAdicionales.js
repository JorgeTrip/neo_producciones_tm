/**
 * @file PasoAdicionales.js
 * @description Componente declarativo del Paso 2: Selección de Módulos Adicionales Opcionales.
 */

import { crearElemento, crearElementoSvg } from '../../scripts/utilidadesDom.js';
import { listarAdicionales, obtenerServicioBase } from '../../scripts/dominio/catalogoPresupuesto.js';

/**
 * Renderiza el segundo paso del wizard: selección de módulos adicionales.
 * @param {object} opciones
 * @param {string} opciones.servicioSeleccionado - ID del servicio base activo.
 * @param {Array<string>} opciones.adicionalesSeleccionados - Arreglo de IDs de adicionales.
 * @param {function(string): void} opciones.alAlternarAdicional - Callback para alternar adicional.
 * @param {function(): void} opciones.alRetroceder - Callback para volver al paso 1.
 * @param {function(): void} opciones.alAvanzar - Callback para ir al paso 3.
 * @returns {HTMLElement}
 */
export function renderizarPasoAdicionales({
  servicioSeleccionado,
  adicionalesSeleccionados,
  alAlternarAdicional,
  alRetroceder,
  alAvanzar
}) {
  const adicionales = listarAdicionales();
  const servicio = obtenerServicioBase(servicioSeleccionado);
  const nombreServicio = servicio ? servicio.titulo : servicioSeleccionado;

  return crearElemento('div', { className: 'wizard-step-body fade-in' }, [
    crearElemento('div', { className: 'wizard-group-header' }, [
      crearElemento('div', { className: 'wizard-context-pill' }, [
        crearElemento('span', {}, ['📌 Cobertura seleccionada: ']),
        crearElemento('strong', {}, [nombreServicio])
      ]),
      crearElemento('h3', { className: 'wizard-group-title' }, ['2. Adicionales opcionales']),
      crearElemento('p', { className: 'wizard-group-desc' }, [
        'Sumá servicios complementarios para una experiencia integral a tu medida (opcional).'
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
    crearElemento('div', { className: 'wizard-actions-bar dual' }, [
      crearElemento('button', {
        type: 'button',
        className: 'btn-outline btn-wizard-back',
        onclick: alRetroceder
      }, ['← Volver a Cobertura']),
      crearElemento('button', {
        type: 'button',
        className: 'btn-primary btn-wizard-next',
        onclick: alAvanzar
      }, [
        'Continuar a Contacto ',
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
