/**
 * @file generadorMensajePresupuesto.js
 * @description Construcción determinista y formateo del mensaje de presupuesto para WhatsApp.
 * Transforma las entidades de dominio y datos de contacto en texto legible y URL codificada.
 */

import { obtenerServicioBase, obtenerAdicional } from './catalogoPresupuesto.js';

const TELEFONO_WHATSAPP_DEFECTO = '541140686925';

/**
 * Genera el cuerpo de texto del presupuesto para el mensaje de WhatsApp.
 * @param {object} parametros
 * @param {string} parametros.servicioId - Identificador del servicio base.
 * @param {Array<string>} [parametros.adicionalesIds] - Arreglo de identificadores de adicionales.
 * @param {object} parametros.datosContacto - Datos ingresados por el usuario.
 * @returns {string}
 */
export function generarTextoPresupuesto({ servicioId, adicionalesIds = [], datosContacto = {} }) {
  const servicio = obtenerServicioBase(servicioId);
  const nombreServicio = servicio ? servicio.titulo : servicioId;

  const bloquesAdicionales = (adicionalesIds || [])
    .map((id) => {
      const extra = obtenerAdicional(id);
      return extra ? `   • ${extra.titulo}` : `   • ${id}`;
    });

  const seccionExtras = bloquesAdicionales.length > 0
    ? `📦 Adicionales seleccionados:\n${bloquesAdicionales.join('\n')}`
    : '📦 Adicionales seleccionados:\n   • Sin adicionales (Cobertura base)';

  const lineas = [
    '¡Hola Jorge! Estuve armando una solicitud de presupuesto en la web de NEO Producciones:',
    '',
    `📌 Servicio: ${nombreServicio}`,
    seccionExtras,
    '',
    `📅 Fecha estimada: ${datosContacto.fechaEvento || 'A convenir'}`,
    `📍 Zona / Salón: ${datosContacto.zonaEvento || 'A convenir'}`,
    `👤 Nombre: ${datosContacto.nombre || ''}`,
    `📱 Contacto: ${datosContacto.telefono || ''}`
  ];

  if (datosContacto.email && datosContacto.email.trim().length > 0) {
    lineas.push(`✉️ Email: ${datosContacto.email.trim()}`);
  }

  if (datosContacto.comentarios && datosContacto.comentarios.trim().length > 0) {
    lineas.push(`💬 Comentarios: ${datosContacto.comentarios.trim()}`);
  }

  lineas.push('');
  lineas.push('Quedo a la espera de tu cotización y disponibilidad. ¡Muchas gracias!');

  return lineas.join('\n');
}

/**
 * Genera el enlace directo a WhatsApp con el mensaje codificado en URL.
 * @param {object} parametros
 * @param {string} parametros.servicioId - Identificador del servicio base.
 * @param {Array<string>} [parametros.adicionalesIds] - Arreglo de identificadores de adicionales.
 * @param {object} parametros.datosContacto - Datos ingresados por el usuario.
 * @param {string} [parametros.telefonoDestino] - Teléfono opcional de destino en formato internacional.
 * @returns {string}
 */
export function generarEnlaceWhatsApp({
  servicioId,
  adicionalesIds = [],
  datosContacto = {},
  telefonoDestino = TELEFONO_WHATSAPP_DEFECTO
}) {
  const texto = generarTextoPresupuesto({ servicioId, adicionalesIds, datosContacto });
  return `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(texto)}`;
}
