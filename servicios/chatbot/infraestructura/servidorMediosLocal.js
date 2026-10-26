import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

/**
 * @fileoverview Mini servidor HTTP nativo para servir imágenes locales a los servidores de Meta.
 * Emplea utilidades estándar de Node.js (cero dependencias pesadas adicionales).
 */

const TIPOS_MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export class ServidorMediosLocal {
  constructor(directorioBase, puerto = 3000) {
    this.directorioBase = path.resolve(directorioBase);
    this.puerto = puerto;
    this.servidor = null;
  }

  /**
   * Inicia el servidor HTTP local para servir archivos estáticos.
   */
  async iniciar() {
    return new Promise((resolve) => {
      this.servidor = http.createServer((peticion, respuesta) => {
        const rutaLimpia = decodeURIComponent(peticion.url.split('?')[0]);
        const rutaArchivo = path.join(this.directorioBase, rutaLimpia);

        // Prevenir ataques de Path Traversal
        if (!rutaArchivo.startsWith(this.directorioBase)) {
          respuesta.writeHead(403, { 'Content-Type': 'text/plain' });
          respuesta.end('Acceso denegado');
          return;
        }

        if (!fs.existsSync(rutaArchivo) || fs.statSync(rutaArchivo).isDirectory()) {
          respuesta.writeHead(404, { 'Content-Type': 'text/plain' });
          respuesta.end('Archivo no encontrado');
          return;
        }

        const extension = path.extname(rutaArchivo).toLowerCase();
        const tipoMime = TIPOS_MIME[extension] || 'application/octet-stream';

        respuesta.writeHead(200, { 'Content-Type': tipoMime });
        fs.createReadStream(rutaArchivo).pipe(respuesta);
      });

      this.servidor.listen(this.puerto, () => {
        resolve(`Servidor de medios local activo en http://localhost:${this.puerto}`);
      });
    });
  }

  /**
   * Cierra el servidor HTTP liberando el puerto.
   */
  async detener() {
    return new Promise((resolve) => {
      if (this.servidor) {
        this.servidor.close(() => resolve());
      } else {
        resolve();
      }
    });
  }
}
