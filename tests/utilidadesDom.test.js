/**
 * Pruebas Unitarias TDD: Utilidades DOM y Agrupación de Filas.
 * Valida la partición de elementos del portafolio en bloques de fila para animaciones reveal.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { dividirEnFilas } from '../scripts/utilidadesDom.js';

describe('Utilidades DOM - Agrupación en Filas (TDD)', () => {
  it('debe dividir una lista en bloques exactos según el tamaño de fila', () => {
    const elementos = [1, 2, 3, 4, 5, 6, 7, 8];
    const filas = dividirEnFilas(elementos, 4);

    assert.equal(filas.length, 2);
    assert.deepEqual(filas[0], [1, 2, 3, 4]);
    assert.deepEqual(filas[1], [5, 6, 7, 8]);
  });

  it('debe manejar listas cuya longitud no es múltiplo exacto del tamaño de fila', () => {
    const videos = ['v1', 'v2', 'v3', 'v4', 'v5'];
    const filas = dividirEnFilas(videos, 3);

    assert.equal(filas.length, 2);
    assert.deepEqual(filas[0], ['v1', 'v2', 'v3']);
    assert.deepEqual(filas[1], ['v4', 'v5']);
  });

  it('debe retornar un arreglo vacío si la lista de entrada está vacía o es nula', () => {
    assert.deepEqual(dividirEnFilas([], 4), []);
    assert.deepEqual(dividirEnFilas(null, 4), []);
  });

  it('debe devolver la lista completa en una sola fila si el tamaño es menor o igual a 0', () => {
    const lista = ['a', 'b'];
    assert.deepEqual(dividirEnFilas(lista, 0), [lista]);
  });
});
