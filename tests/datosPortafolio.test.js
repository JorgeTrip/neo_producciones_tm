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
  it('todos los elementos de FOTOS_PREVIA deben tener ruta, thumb y alt válidos', () => {
    assert.ok(FOTOS_PREVIA.length > 0);
    const rutaBase = process.cwd();

    FOTOS_PREVIA.forEach((item, index) => {
      assert.ok(item.ruta, `FOTO_PREVIA ${index} debe tener ruta`);
      assert.ok(item.thumb, `FOTO_PREVIA ${index} debe tener thumb`);
      assert.ok(item.alt, `FOTO_PREVIA ${index} debe tener alt`);
      assert.ok(fs.existsSync(path.join(rutaBase, item.ruta)), `No existe: ${item.ruta}`);
      assert.ok(fs.existsSync(path.join(rutaBase, item.thumb)), `No existe thumb: ${item.thumb}`);
    });
  });

  it('todos los elementos de FOTOS_EVENTOS deben tener ruta, thumb y alt válidos', () => {
    assert.ok(FOTOS_EVENTOS.length > 0);
    const rutaBase = process.cwd();

    FOTOS_EVENTOS.forEach((item, index) => {
      assert.ok(item.ruta, `FOTO_EVENTO ${index} debe tener ruta`);
      assert.ok(item.thumb, `FOTO_EVENTO ${index} debe tener thumb`);
      assert.ok(item.alt, `FOTO_EVENTO ${index} debe tener alt`);
      assert.ok(fs.existsSync(path.join(rutaBase, item.ruta)), `No existe: ${item.ruta}`);
      assert.ok(fs.existsSync(path.join(rutaBase, item.thumb)), `No existe thumb: ${item.thumb}`);
    });
  });

  it('todos los entornos 360 deben definir ruta, thumb, alt y titulo con archivos existentes', () => {
    assert.ok(ENTORNOS_360.length > 0);
    const rutaBase = process.cwd();

    ENTORNOS_360.forEach((item, index) => {
      assert.ok(item.ruta, `El entorno 360 en índice ${index} debe tener 'ruta'`);
      assert.ok(item.thumb, `El entorno 360 en índice ${index} debe tener 'thumb'`);
      assert.ok(item.alt, `El entorno 360 en índice ${index} debe tener 'alt'`);
      assert.ok(item.titulo, `El entorno 360 en índice ${index} debe tener 'titulo'`);
      assert.ok(fs.existsSync(path.join(rutaBase, item.ruta)), `No existe 360: ${item.ruta}`);
      assert.ok(fs.existsSync(path.join(rutaBase, item.thumb)), `No existe thumb 360: ${item.thumb}`);
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
