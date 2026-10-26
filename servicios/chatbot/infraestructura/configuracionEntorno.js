import dotenv from 'dotenv';
import { esquemaConfiguracionEntorno } from '../aplicacion/esquemasValidacion.js';

/**
 * @fileoverview Carga y valida estrictamente las variables de entorno locales (.env).
 * Previene fallos en tiempo de ejecución validando la presencia de credenciales requeridas.
 */

dotenv.config();

export function obtenerConfiguracion() {
  const variablesCrudas = {
    INSTAGRAM_ACCOUNT_ID: process.env.INSTAGRAM_ACCOUNT_ID,
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    PUERTO_MEDIOS_LOCAL: process.env.PUERTO_MEDIOS_LOCAL,
    RUTA_FOTOS_INSUMO: process.env.RUTA_FOTOS_INSUMO,
  };

  const resultado = esquemaConfiguracionEntorno.safeParse(variablesCrudas);

  if (!resultado.success) {
    const errores = resultado.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Configuración de entorno inválida: ${errores}`);
  }

  return resultado.data;
}
