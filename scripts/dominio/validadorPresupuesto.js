/**
 * @file validadorPresupuesto.js
 * @description Validación pura de contratos de datos para la solicitud de presupuesto.
 * Aplica reglas estrictas de obligatoriedad, formatos y defensividad sin dependencias externas.
 */

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida los datos del formulario de contacto y evento.
 * @param {object} datos - Datos ingresados por el usuario.
 * @param {string} [datos.nombre] - Nombre y apellido del contacto.
 * @param {string} [datos.telefono] - Teléfono o WhatsApp.
 * @param {string} [datos.email] - Correo electrónico opcional.
 * @param {string} [datos.fechaEvento] - Fecha tentativa o confirmada del evento.
 * @param {string} [datos.zonaEvento] - Zona o localidad del evento.
 * @returns {{ esValido: boolean, errores: Record<string, string> }}
 */
export function validarDatosContacto(datos = {}) {
  const errores = {};

  const nombreLimpio = (datos.nombre || '').trim();
  if (nombreLimpio.length < 2) {
    errores.nombre = 'Por favor, ingresá tu nombre completo (mínimo 2 letras).';
  }

  const telefonoLimpio = (datos.telefono || '').replace(/\s+/g, '');
  if (telefonoLimpio.length < 6) {
    errores.telefono = 'Por favor, ingresá un teléfono o WhatsApp de contacto válido.';
  }

  const fechaLimpia = (datos.fechaEvento || '').trim();
  if (fechaLimpia.length < 4) {
    errores.fechaEvento = 'Indicá la fecha aproximada o confirmada de tu evento.';
  }

  const zonaLimpia = (datos.zonaEvento || '').trim();
  if (zonaLimpia.length < 2) {
    errores.zonaEvento = 'Indicá la zona, localidad o salón donde se realizará el evento.';
  }

  const emailLimpio = (datos.email || '').trim();
  if (emailLimpio.length > 0 && !REGEX_EMAIL.test(emailLimpio)) {
    errores.email = 'El correo electrónico ingresado no tiene un formato válido.';
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores
  };
}
