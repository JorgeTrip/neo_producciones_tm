import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * @fileoverview Repositorio de infraestructura: Persiste y recupera el estado de las conversaciones
 * y las marcas de tiempo de intervención humana en un archivo JSON local o almacenamiento efímero.
 */
export class RepositorioConversacionesLocal {
  /**
   * @param {string} [rutaArchivo] - Ruta al archivo de almacenamiento JSON.
   */
  constructor(rutaArchivo) {
    if (rutaArchivo) {
      this.rutaArchivo = rutaArchivo;
    } else if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT) {
      this.rutaArchivo = path.resolve(os.tmpdir(), 'conversaciones_meta.json');
    } else {
      this.rutaArchivo = path.resolve(process.cwd(), '.datos', 'conversaciones.json');
    }
    this.memoria = {};
    this.asegurarDirectorio();
  }

  /**
   * Garantiza la existencia del directorio contenedor de manera segura.
   * @private
   */
  asegurarDirectorio() {
    try {
      const dir = path.dirname(this.rutaArchivo);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch {
      // Continúa en memoria si el sistema de archivos no es escribible
    }
  }

  /**
   * Lee la totalidad del almacén desde el disco con fallback en memoria.
   * @private
   * @returns {Record<string, Object>}
   */
  leerTodos() {
    try {
      if (!fs.existsSync(this.rutaArchivo)) {
        return this.memoria || {};
      }
      const contenido = fs.readFileSync(this.rutaArchivo, 'utf-8');
      return { ...this.memoria, ...JSON.parse(contenido || '{}') };
    } catch {
      return this.memoria || {};
    }
  }

  /**
   * Guarda o actualiza una conversación en el registro.
   * @param {Object} datosConversacion
   * @param {string} datosConversacion.id
   */
  guardar(datosConversacion) {
    if (!datosConversacion || !datosConversacion.id) {
      return;
    }

    this.memoria[datosConversacion.id] = datosConversacion;

    try {
      const todos = this.leerTodos();
      todos[datosConversacion.id] = datosConversacion;
      fs.writeFileSync(this.rutaArchivo, JSON.stringify(todos), 'utf-8');
    } catch {
      // Mantiene en memoria si el sistema de archivos bloquea la escritura
    }
  }

  /**
   * Recupera una conversación por su identificador.
   * @param {string} id
   * @returns {Object|null}
   */
  obtenerPorId(id) {
    const todos = this.leerTodos();
    return todos[id] || this.memoria[id] || null;
  }
}
