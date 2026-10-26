import { z } from 'zod';

/**
 * @fileoverview Esquemas de validación en frontera (Zod) para la capa de aplicación.
 * Cumple con el Principio de Gobernanza de Jorge: todo dato del exterior o del agente
 * debe ser validado y parseado estrictamente antes de alcanzar las entidades de dominio.
 */

// Extensiones de imagen soportadas por Instagram Graph API
const EXTENSIONES_PERMITIDAS = /\.(jpe?g|png|webp)$/i;

/**
 * Esquema para validar los parámetros de publicación de una fotografía individual.
 */
export const esquemaPublicarFoto = z.object({
  nombreArchivo: z
    .string()
    .min(1, 'El nombre de archivo no puede estar vacío.')
    .regex(EXTENSIONES_PERMITIDAS, 'La imagen debe tener extensión .jpg, .jpeg, .png o .webp'),
  textoPublicacion: z
    .string()
    .min(1, 'El texto de la publicación no puede estar vacío.')
    .max(2200, 'Instagram no permite textos superiores a 2200 caracteres.'),
});

/**
 * Esquema para validar los parámetros de publicación de un carrusel (álbum) de 2 a 10 fotos.
 */
export const esquemaPublicarCarrusel = z.object({
  nombresArchivos: z
    .array(
      z
        .string()
        .min(1, 'El nombre de archivo no puede estar vacío.')
        .regex(EXTENSIONES_PERMITIDAS, 'La imagen debe tener extensión .jpg, .jpeg, .png o .webp')
    )
    .min(2, 'Un carrusel requiere al menos 2 imágenes.')
    .max(10, 'Instagram permite un máximo de 10 imágenes por carrusel.'),
  textoPublicacion: z
    .string()
    .min(1, 'El texto de la publicación no puede estar vacío.')
    .max(2200, 'Instagram no permite textos superiores a 2200 caracteres.'),
});

/**
 * Esquema para validar los parámetros de consulta de métricas.
 */
export const esquemaParametrosMetricas = z.object({
  limite: z.number().int().min(1).max(50).default(10),
});

/**
 * Esquema para validar variables de entorno obligatorias del sistema.
 */
export const esquemaConfiguracionEntorno = z.object({
  INSTAGRAM_ACCOUNT_ID: z.string().min(1, 'Se requiere el ID de la cuenta de Instagram.'),
  INSTAGRAM_ACCESS_TOKEN: z.string().min(1, 'Se requiere el Token de acceso de Instagram.'),
  PUERTO_MEDIOS_LOCAL: z.coerce.number().default(3000),
  RUTA_FOTOS_INSUMO: z.string().default('./fotos_insumo'),
});
