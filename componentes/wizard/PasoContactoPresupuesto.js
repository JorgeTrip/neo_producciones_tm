/**
 * @file PasoContactoPresupuesto.js
 * @description Componente declarativo del Paso 2: Resumen, formulario de contacto, evento y envío a WhatsApp.
 */

import { crearElemento, crearElementoSvg } from '../../scripts/utilidadesDom.js';
import { obtenerServicioBase } from '../../scripts/dominio/catalogoPresupuesto.js';
import { generarEnlaceWhatsApp } from '../../scripts/dominio/generadorMensajePresupuesto.js';

/**
 * Renderiza el segundo paso del wizard de presupuesto.
 * @param {object} opciones
 * @param {string} opciones.servicioSeleccionado - ID del servicio base activo.
 * @param {Array<string>} opciones.adicionalesSeleccionados - IDs de los adicionales.
 * @param {object} opciones.datosContacto - Datos ingresados.
 * @param {object} opciones.erroresValidacion - Errores de validación actuales.
 * @param {function(string, string): void} opciones.alModificarDato - Callback al cambiar un campo.
 * @param {function(): void} opciones.alRetroceder - Callback para volver al paso 1.
 * @param {function(): boolean} opciones.alValidar - Función que valida y retorna si es válido.
 * @returns {HTMLElement}
 */
export function renderizarPasoContactoPresupuesto({
  servicioSeleccionado,
  adicionalesSeleccionados,
  datosContacto,
  erroresValidacion,
  alModificarDato,
  alRetroceder,
  alValidar
}) {
  const servicio = obtenerServicioBase(servicioSeleccionado);
  const nombreServicio = servicio ? servicio.titulo : servicioSeleccionado;
  const cantidadExtras = adicionalesSeleccionados.length;

  function manejarEnvioWhatsApp() {
    const esValido = alValidar();
    if (!esValido) return;

    const enlace = generarEnlaceWhatsApp({
      servicioId: servicioSeleccionado,
      adicionalesIds: adicionalesSeleccionados,
      datosContacto
    });

    window.open(enlace, '_blank');
  }

  return crearElemento('div', { className: 'wizard-step-body fade-in' }, [
    // Resumen sintético superior
    crearElemento('div', { className: 'wizard-summary-pills' }, [
      crearElemento('div', { className: 'summary-pill' }, [
        crearElemento('span', { className: 'pill-icon' }, ['📌']),
        crearElemento('span', {}, [nombreServicio])
      ]),
      crearElemento('div', { className: 'summary-pill' }, [
        crearElemento('span', { className: 'pill-icon' }, ['📦']),
        crearElemento('span', {}, [
          cantidadExtras === 0 ? 'Sin adicionales (Base)' : `${cantidadExtras} adicional(es)`
        ])
      ])
    ]),

    // Formulario de datos
    crearElemento('div', { className: 'wizard-form-grid' }, [
      crearCampoInput({
        id: 'nombre',
        etiqueta: 'Tu Nombre y Apellido *',
        tipo: 'text',
        valor: datosContacto.nombre,
        placeholder: 'Ej. Martina Rossi',
        error: erroresValidacion.nombre,
        onChange: (val) => alModificarDato('nombre', val)
      }),
      crearCampoInput({
        id: 'telefono',
        etiqueta: 'WhatsApp / Teléfono *',
        tipo: 'tel',
        valor: datosContacto.telefono,
        placeholder: 'Ej. 11 4068-6925',
        error: erroresValidacion.telefono,
        onChange: (val) => alModificarDato('telefono', val)
      }),
      crearCampoInput({
        id: 'fechaEvento',
        etiqueta: 'Fecha Estimada del Evento *',
        tipo: 'text',
        valor: datosContacto.fechaEvento,
        placeholder: 'Ej. 18/12/2026 o Diciembre 2026',
        error: erroresValidacion.fechaEvento,
        onChange: (val) => alModificarDato('fechaEvento', val)
      }),
      crearCampoInput({
        id: 'zonaEvento',
        etiqueta: 'Zona / Localidad o Salón *',
        tipo: 'text',
        valor: datosContacto.zonaEvento,
        placeholder: 'Ej. San Isidro, CABA, Pilar...',
        error: erroresValidacion.zonaEvento,
        onChange: (val) => alModificarDato('zonaEvento', val)
      }),
      crearCampoInput({
        id: 'email',
        etiqueta: 'Correo Electrónico (Opcional)',
        tipo: 'email',
        valor: datosContacto.email,
        placeholder: 'tu-email@ejemplo.com',
        error: erroresValidacion.email,
        anchoCompleto: true,
        onChange: (val) => alModificarDato('email', val)
      }),
      crearCampoTextarea({
        id: 'comentarios',
        etiqueta: 'Comentarios Adicionales o Detalles del Evento',
        valor: datosContacto.comentarios,
        placeholder: 'Contanos cantidad de invitados, horarios previstos o ideas especiales...',
        onChange: (val) => alModificarDato('comentarios', val)
      })
    ]),

    // Acciones inferiores
    crearElemento('div', { className: 'wizard-actions-bar dual' }, [
      crearElemento('button', {
        type: 'button',
        className: 'btn-outline btn-wizard-back',
        onclick: alRetroceder
      }, ['← Volver al Paso 1']),

      crearElemento('button', {
        type: 'button',
        className: 'btn-primary btn-wizard-send',
        onclick: manejarEnvioWhatsApp
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
        'Solicitar Presupuesto por WhatsApp'
      ])
    ])
  ]);
}

function crearCampoInput({ id, etiqueta, tipo, valor, placeholder, error, anchoCompleto, onChange }) {
  const clasesContenedor = `wizard-input-group ${anchoCompleto ? 'full-width' : ''} ${error ? 'has-error' : ''}`.trim();

  return crearElemento('div', { className: clasesContenedor }, [
    crearElemento('label', { htmlFor: id, className: 'wizard-input-label' }, [etiqueta]),
    crearElemento('input', {
      id,
      name: id,
      type: tipo,
      value: valor || '',
      placeholder,
      className: 'wizard-input-control',
      'aria-invalid': error ? 'true' : 'false',
      oninput: (e) => onChange(e.target.value)
    }),
    error ? crearElemento('span', { className: 'wizard-input-error' }, [error]) : null
  ].filter(Boolean));
}

function crearCampoTextarea({ id, etiqueta, valor, placeholder, onChange }) {
  return crearElemento('div', { className: 'wizard-input-group full-width' }, [
    crearElemento('label', { htmlFor: id, className: 'wizard-input-label' }, [etiqueta]),
    crearElemento('textarea', {
      id,
      name: id,
      rows: '3',
      placeholder,
      className: 'wizard-input-control textarea',
      oninput: (e) => onChange(e.target.value)
    }, [valor || ''])
  ]);
}
