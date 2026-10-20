/**
 * @file catalogoPresupuesto.js
 * @description Catálogo inmutable de servicios base y módulos adicionales para el presupuesto consultivo.
 * Define la estructura pura de ítems disponibles sin dependencias del DOM ni frameworks.
 */

export const SERVICIOS_BASE = Object.freeze({
  sociales: Object.freeze({
    id: 'sociales',
    titulo: 'Eventos Sociales',
    subtitulo: '15 años, Bodas, Aniversarios y Celebraciones',
    descripcion: 'Cobertura fotográfica profesional para capturar momentos únicos y emotivos de tu festejo.',
    icono: 'fiesta'
  }),
  corporativos: Object.freeze({
    id: 'corporativos',
    titulo: 'Eventos Corporativos',
    subtitulo: 'Conferencias, Congresos y Jornadas Empresariales',
    descripcion: 'Registro integral con enfoque institucional, discreto y de máxima calidad visual.',
    icono: 'maletin'
  }),
  sesiones: Object.freeze({
    id: 'sesiones',
    titulo: 'Sesiones & Books',
    subtitulo: 'Books de 15, Pre-Boda y Retratos Personales',
    descripcion: 'Sesiones fotográficas personalizadas en exteriores, locaciones especiales o estudio.',
    icono: 'camara'
  }),
  comercial: Object.freeze({
    id: 'comercial',
    titulo: 'Fotografía Comercial & Inmobiliaria',
    subtitulo: 'Productos, Inmuebles y Espacios',
    descripcion: 'Producción de imágenes de alto impacto para catálogos comerciales, publicidad y arquitectura.',
    icono: 'tienda'
  })
});

export const ADICIONALES_PRESUPUESTO = Object.freeze({
  sesion_previa: Object.freeze({
    id: 'sesion_previa',
    titulo: 'Sesión de Fotos Previa',
    descripcion: 'Sesión previa en locación para banners, invitaciones, cuadros y libro de firmas.'
  }),
  video_homenaje: Object.freeze({
    id: 'video_homenaje',
    titulo: 'Video Homenaje / Cronológico',
    descripcion: 'Montaje emotivo proyectable con fotos y videos desde la infancia a la actualidad.'
  }),
  cobertura_video: Object.freeze({
    id: 'cobertura_video',
    titulo: 'Cobertura en Video / Reels',
    descripcion: 'Video resumen del evento y piezas dinámicas en formato vertical para redes sociales.'
  }),
  fotolibro: Object.freeze({
    id: 'fotolibro',
    titulo: 'Fotolibro / Photobook Impreso',
    descripcion: 'Álbum encuadernado de calidad fotográfica premium para firmas o recuerdo.'
  }),
  cuaderno_firmas: Object.freeze({
    id: 'cuaderno_firmas',
    titulo: 'Cuaderno de Firmas Fotográfico',
    descripcion: 'Libro encuadernado exclusivo con fotos previas para firmas y dedicatorias.'
  }),
  foto_mural: Object.freeze({
    id: 'foto_mural',
    titulo: 'Foto-Mural de Bienvenida',
    descripcion: 'Gigantografía de alta resolución montada para el ingreso o ambientación.'
  }),
  foto_souvenirs: Object.freeze({
    id: 'foto_souvenirs',
    titulo: 'Foto-Souvenirs Personalizados',
    descripcion: 'Recuerdos fotográficos listos para entregar a los invitados en la fiesta.'
  }),
  invitaciones_animadas: Object.freeze({
    id: 'invitaciones_animadas',
    titulo: 'Invitaciones Digitales Animadas',
    descripcion: 'Video dinámico con música y fotos para enviar por WhatsApp.'
  }),
  panoramica_360: Object.freeze({
    id: 'panoramica_360',
    titulo: 'Tour Virtual / Fotografía 360°',
    descripcion: 'Registro inmersivo e interactivo del salón o locación con tecnología panorámica.'
  }),
  entrega_expres: Object.freeze({
    id: 'entrega_expres',
    titulo: 'Entrega Exprés de Fotos',
    descripcion: 'Selección y edición de fotos destacadas en 24/48 horas para publicar en redes.'
  })
});

/**
 * Obtiene un servicio base por su identificador.
 * @param {string} id - Identificador del servicio base.
 * @returns {object|null}
 */
export function obtenerServicioBase(id) {
  return SERVICIOS_BASE[id] || null;
}

/**
 * Obtiene un adicional por su identificador.
 * @param {string} id - Identificador del adicional.
 * @returns {object|null}
 */
export function obtenerAdicional(id) {
  return ADICIONALES_PRESUPUESTO[id] || null;
}

/**
 * Lista todos los servicios base disponibles.
 * @returns {Array<object>}
 */
export function listarServiciosBase() {
  return Object.values(SERVICIOS_BASE);
}

/**
 * Lista todos los módulos adicionales disponibles.
 * @returns {Array<object>}
 */
export function listarAdicionales() {
  return Object.values(ADICIONALES_PRESUPUESTO);
}
