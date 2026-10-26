/**
 * @fileoverview Cliente HTTP desacoplado para la API de Meta Graph (Instagram Business).
 * Permite gestionar publicaciones y consultar métricas de @neo_producciones_tm.
 */

const URL_BASE_GRAPH = 'https://graph.facebook.com/v26.0';

export class ClienteMetaGraphApi {
  /**
   * @param {Object} configuracion
   * @param {string} configuracion.cuentaId - Instagram Business Account ID.
   * @param {string} configuracion.tokenAcceso - Token de acceso de larga duración.
   * @param {typeof fetch} [clienteHttp] - Inyección de dependencia para llamadas HTTP (facilita testing unitario).
   */
  constructor({ cuentaId, tokenAcceso }, clienteHttp = fetch) {
    if (!cuentaId || !tokenAcceso) {
      throw new Error('Configuración incompleta: se requiere cuentaId y tokenAcceso.');
    }
    this.cuentaId = cuentaId;
    this.tokenAcceso = tokenAcceso;
    this.http = clienteHttp;
  }

  /**
   * Ejecuta una petición HTTP a Meta con manejo explícito de errores.
   * @private
   */
  async ejecutarPeticion(ruta, opciones = {}) {
    const separador = ruta.includes('?') ? '&' : '?';
    const urlCompleta = `${URL_BASE_GRAPH}/${ruta}${separador}access_token=${this.tokenAcceso}`;

    const respuesta = await this.http(urlCompleta, opciones);
    const datos = await respuesta.json();

    if (!respuesta.ok || datos.error) {
      const mensaje = datos.error?.message || `Código HTTP ${respuesta.status}`;
      throw new Error(`Error en Meta Graph API: ${mensaje}`);
    }

    return datos;
  }

  /**
   * Obtiene la información del perfil comercial de NEO Producciones.
   */
  async obtenerPerfil() {
    return this.ejecutarPeticion(`${this.cuentaId}?fields=id,username,name,media_count,followers_count`);
  }

  /**
   * Publica una fotografía individual en Instagram en dos pasos obligatorios de Meta:
   * 1. Crear contenedor de medio.
   * 2. Publicar el contenedor.
   * @param {string} urlImagenPublica - URL HTTPS accesible por los servidores de Meta.
   * @param {string} textoPublicacion - Copy y hashtags de la publicación.
   */
  async publicarFoto(urlImagenPublica, textoPublicacion) {
    // Paso 1: Crear contenedor de medio
    const paramsContenedor = new URLSearchParams({
      image_url: urlImagenPublica,
      caption: textoPublicacion,
    });

    const resultadoContenedor = await this.ejecutarPeticion(
      `${this.cuentaId}/media`,
      { method: 'POST', body: paramsContenedor }
    );

    const contenedorId = resultadoContenedor.id;

    // Paso 2: Publicar contenedor
    const paramsPublicacion = new URLSearchParams({
      creation_id: contenedorId,
    });

    const resultadoPublicacion = await this.ejecutarPeticion(
      `${this.cuentaId}/media_publish`,
      { method: 'POST', body: paramsPublicacion }
    );

    return {
      exito: true,
      idPublicacion: resultadoPublicacion.id,
    };
  }

  /**
   * Publica un álbum/carrusel de 2 a 10 imágenes en Instagram.
   * Proceso oficial de Meta Graph API:
   * 1. Crear un contenedor hijo por cada imagen con is_carousel_item = true.
   * 2. Crear el contenedor padre con media_type = CAROUSEL y children = IDs de hijos.
   * 3. Publicar el contenedor padre en media_publish.
   * @param {string[]} urlsImagenes - Lista de URLs públicas accesibles por Meta.
   * @param {string} textoPublicacion - Copy y hashtags del carrusel.
   */
  async publicarCarrusel(urlsImagenes, textoPublicacion) {
    if (!Array.isArray(urlsImagenes) || urlsImagenes.length < 2) {
      throw new Error('Un carrusel requiere al menos 2 imágenes.');
    }

    // Paso 1: Crear cada contenedor hijo
    const idsHijos = [];
    for (const url of urlsImagenes) {
      const paramsHijo = new URLSearchParams({
        image_url: url,
        is_carousel_item: 'true',
      });
      const resHijo = await this.ejecutarPeticion(`${this.cuentaId}/media`, {
        method: 'POST',
        body: paramsHijo,
      });
      idsHijos.push(resHijo.id);
    }

    // Paso 2: Crear el contenedor principal de carrusel
    const paramsContenedor = new URLSearchParams({
      media_type: 'CAROUSEL',
      caption: textoPublicacion,
      children: idsHijos.join(','),
    });

    const resContenedor = await this.ejecutarPeticion(`${this.cuentaId}/media`, {
      method: 'POST',
      body: paramsContenedor,
    });

    // Paso 3: Publicar el carrusel completo
    const paramsPublicacion = new URLSearchParams({
      creation_id: resContenedor.id,
    });

    const resPublicacion = await this.ejecutarPeticion(`${this.cuentaId}/media_publish`, {
      method: 'POST',
      body: paramsPublicacion,
    });

    return {
      exito: true,
      idPublicacion: resPublicacion.id,
    };
  }

  /**
   * Obtiene publicaciones recientes con sus estadísticas de interacción y alcance.
   * @param {number} limite - Cantidad de publicaciones a consultar.
   */
  async obtenerPublicacionesRecientes(limite = 10) {
    const campos = 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count';
    const ruta = `${this.cuentaId}/media?fields=${campos}&limit=${limite}`;
    return this.ejecutarPeticion(ruta);
  }
}
