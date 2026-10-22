/**
 * @file PasoAdicionales.js
 * @description Componente declarativo del Paso 2: Selección de Módulos Adicionales y Barra Lateral Fija.
 */

import { crearElemento, crearElementoSvg } from '../../scripts/utilidadesDom.js';
import { listarAdicionales, obtenerServicioBase } from '../../scripts/dominio/catalogoPresupuesto.js';

/**
 * Renderiza el segundo paso del wizard: selección de módulos adicionales con scrollbar fijo.
 * @param {object} opciones
 * @param {string} opciones.servicioSeleccionado - ID del servicio base activo.
 * @param {Array<string>} opciones.adicionalesSeleccionados - Arreglo de IDs de adicionales.
 * @param {function(string): void} opciones.alAlternarAdicional - Callback para alternar adicional.
 * @param {function(): void} opciones.alRetroceder - Callback para volver al paso 1.
 * @param {function(): void} opciones.alEnviarWhatsApp - Callback para disparar el mensaje a WhatsApp.
 * @returns {HTMLElement}
 */
export function renderizarPasoAdicionales({
  servicioSeleccionado,
  adicionalesSeleccionados,
  alAlternarAdicional,
  alRetroceder,
  alEnviarWhatsApp
}) {
  const adicionales = listarAdicionales();
  const servicio = obtenerServicioBase(servicioSeleccionado);
  const nombreServicio = servicio ? servicio.titulo : servicioSeleccionado;

  const nodoThumb = crearElemento('div', { className: 'wizard-scroll-thumb' });
  const nodoTrack = crearElemento('div', { className: 'wizard-scroll-track' }, [nodoThumb]);

  function sincronizarScroll(grid) {
    if (!grid || !nodoThumb || !nodoTrack) return;
    const maxScroll = grid.scrollHeight - grid.clientHeight;
    if (maxScroll <= 0) {
      nodoTrack.style.display = 'none';
      return;
    }
    nodoTrack.style.display = 'block';
    const trackAlto = nodoTrack.clientHeight || 280;
    const altoThumb = Math.max(36, Math.round((grid.clientHeight / grid.scrollHeight) * trackAlto));
    nodoThumb.style.height = `${altoThumb}px`;
    const recorrido = trackAlto - altoThumb;
    const offset = Math.round((grid.scrollTop / maxScroll) * recorrido);
    nodoThumb.style.transform = `translateY(${offset}px)`;
  }

  const nodoGrid = crearElemento('div', {
    className: 'wizard-extras-grid',
    onscroll: (e) => sincronizarScroll(e.target)
  },
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
  );

  setTimeout(() => sincronizarScroll(nodoGrid), 50);

  const wrapperExtras = crearElemento('div', { className: 'wizard-extras-wrapper' }, [
    nodoGrid,
    nodoTrack
  ]);

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
    wrapperExtras,
    crearElemento('div', { className: 'wizard-actions-bar dual' }, [
      crearElemento('button', {
        type: 'button',
        className: 'btn-outline btn-wizard-back',
        onclick: alRetroceder
      }, ['← Volver']),
      crearElemento('button', {
        type: 'button',
        className: 'btn-primary btn-wizard-send',
        onclick: alEnviarWhatsApp
      }, [
        crearElementoSvg('svg', {
          width: '18',
          height: '18',
          fill: 'currentColor',
          viewBox: '0 0 24 24',
          style: { marginRight: '8px' }
        }, [
          crearElementoSvg('path', {
            d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'
          })
        ]),
        'Presupuesto por WhatsApp'
      ])
    ])
  ]);
}
