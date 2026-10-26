import fs from 'fs';
import path from 'path';

/**
 * @fileoverview Repositorio de infraestructura: Persiste y recupera el estado de las conversaciones
 * y las marcas de tiempo de intervención humana en un archivo JSON local.
 */

export class RepositorioConversacionesLocal {
  /**
   * @param {string} [rutaArchivo] - Ruta al archivo de almacenamiento JSON.
   */
  constructor(rutaArchivo) {
    this.rutaArchivo = rutaArchivo || path.resolve(process.cwd(), '.datos', 'conversaciones.json');
    this.asegurarDirectorio();
  }

  /**
   * Garantiza la existencia del directorio contenedor.
   * @private
   */
  asegurarDirectorio() {
    const dir = path.dirname(this.rutaArchivo);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Lee la totalidad del almacén desde el disco.
   * @private
   * @returns {Record<string, Object>}
   */
  leerTodos() {
    if (!fs.existsSync(this.rutaArchivo)) {
      return {};
    }
    try {
      const contenido = fs.readFileSync(this.rutaArchivo, 'utf-8');
      return JSON.parse(contenido || '{}');
    } catch {
      return {};
    }
  }

  /**
   * Guarda o actualiza una conversación en el registro.
   * @param {Object} datosConversacion
   * @param {string} datosConversacion.id
   */
  guardar(datosConversacion) {
    if (!datosConversacion?.id) return;

    const todos = this.leerTodos();
    todos[datosConversacion.id] = {
      ...todos[datosConversacion.id],
      ...datosConversacion,
      actualizadoEn: Date.now()
    };

    fs.writeFileSync(this.rutaArchivo, JSON.stringify(todos), 'utf-8');
  }

  /**
   * Obtiene los datos persistidos de una conversación por su identificador.
   * @param {string} id
   * @returns {Object|null}
   */
  obtenerPorId(id) {
    const todos = this.leerTodos();
    return todos[id] || null;
  }
}
