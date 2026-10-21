/**
 * Pruebas Unitarias TDD: Catálogo de Datos del Portafolio.
 * Valida la integridad estructural de las colecciones y la presencia de miniaturas optimizadas.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ENTORNOS_360, FOTOS_PREVIA, FOTOS_EVENTOS, VIDEOS } from '../scripts/datosPortafolio.js';

describe('Catálogo de Datos del Portafolio - Integridad y Miniaturas', () => {
  it('todos los entornos 360 deben definir ruta, thumb, alt y titulo', () => {
    assert.ok(ENTORNOS_360.length > 0, 'Debe haber al menos un entorno 360');

    ENTORNOS_360.forEach((item, index) => {
      assert.ok(item.ruta, `El entorno 360 en índice ${index} debe tener 'ruta'`);
      assert.ok(item.thumb, `El entorno 360 en índice ${index} debe tener 'thumb' optimizado`);
      assert.ok(item.alt, `El entorno 360 en índice ${index} debe tener 'alt'`);
      assert.ok(item.titulo, `El entorno 360 en índice ${index} debe tener 'titulo'`);
    });
  });

  it('los archivos de miniaturas (thumb) y rutas de 360 deben existir físicamente en el disco', () => {
    const rutaBase = process.cwd();

    ENTORNOS_360.forEach((item) => {
      const archivoRuta = path.join(rutaBase, item.ruta);
      const archivoThumb = path.join(rutaBase, item.thumb);

      assert.ok(fs.existsSync(archivoRuta), `El archivo panorámico no existe: ${item.ruta}`);
      assert.ok(fs.existsSync(archivoThumb), `El archivo de miniatura no existe: ${item.thumb}`);
    });
  });

  it('todos los videos deben tener url, thumb y titulo', () => {
    assert.ok(VIDEOS.length > 0);
    VIDEOS.forEach((item, index) => {
      assert.ok(item.url, `El video ${index} debe tener url`);
      assert.ok(item.thumb, `El video ${index} debe tener thumb`);
      assert.ok(item.titulo, `El video ${index} debe tener titulo`);
    });
  });
});
