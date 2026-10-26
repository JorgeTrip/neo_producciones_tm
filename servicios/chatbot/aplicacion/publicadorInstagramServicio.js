import { esquemaPublicarFoto, esquemaPublicarCarrusel } from './esquemasValidacion.js';

/**
 * @fileoverview Caso de uso: Publicar fotos y carruseles en Instagram con validación previa.
 */

export class PublicadorInstagramServicio {
  constructor(clienteMeta) {
    this.clienteMeta = clienteMeta;
  }

  /**
   * Valida los parámetros y publica una foto en la cuenta comercial.
   * @param {Object} parametros
   * @param {string} urlPublicaImagen - URL accesible por Meta.
   */
  async publicar(parametros, urlPublicaImagen) {
    const validado = esquemaPublicarFoto.parse(parametros);

    if (!urlPublicaImagen || !urlPublicaImagen.startsWith('http')) {
      throw new Error('Se requiere una URL pública válida (HTTP/HTTPS) para que Meta procese la imagen.');
    }

    const resultado = await this.clienteMeta.publicarFoto(urlPublicaImagen, validado.textoPublicacion);
    return {
      exito: true,
      mensaje: 'Publicación creada exitosamente en Instagram.',
      idPublicacion: resultado.idPublicacion,
    };
  }

  /**
   * Valida los parámetros y publica un carrusel de 2 a 10 fotos en Instagram.
   * @param {Object} parametros - Objeto con nombresArchivos y textoPublicacion.
   * @param {string[]} urlsPublicasImagenes - URLs públicas correspondientes a cada imagen.
   */
  async publicarCarrusel(parametros, urlsPublicasImagenes) {
    const validado = esquemaPublicarCarrusel.parse(parametros);

    if (!Array.isArray(urlsPublicasImagenes) || urlsPublicasImagenes.length !== validado.nombresArchivos.length) {
      throw new Error('La cantidad de URLs públicas debe coincidir con la cantidad de archivos.');
    }

    for (const url of urlsPublicasImagenes) {
      if (!url || !url.startsWith('http')) {
        throw new Error('Todas las URLs del carrusel deben ser direcciones HTTP/HTTPS válidas.');
      }
    }

    const resultado = await this.clienteMeta.publicarCarrusel(urlsPublicasImagenes, validado.textoPublicacion);
    return {
      exito: true,
      mensaje: 'Carrusel publicado exitosamente en Instagram.',
      idPublicacion: resultado.idPublicacion,
    };
  }
}
