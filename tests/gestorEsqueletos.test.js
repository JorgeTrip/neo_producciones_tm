/**
 * Pruebas Unitarias TDD: Gestor de Esqueletos de Carga (Skeleton Screens).
 * Valida el ciclo de vida de los estados visuales en fotos y videos, asegurando
 * que el esqueleto actúe siempre como placeholder inicial antes de la revelación.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { configurarEsqueleto } from '../scripts/gestorEsqueletos.js';

/**
 * Crea un mock ligero de elemento DOM para pruebas unitarias sin dependencias pesadas.
 * @returns {object} Mock de elemento DOM con soporte de clases y eventos.
 */
function crearMockElemento() {
  const clases = new Set();
  const escuchadores = {};

  return {
    classList: {
      add: (c) => clases.add(c),
      remove: (c) => clases.delete(c),
      contains: (c) => clases.has(c),
      toArray: () => Array.from(clases)
    },
    addEventListener: (evento, callback) => {
      if (!escuchadores[evento]) escuchadores[evento] = [];
      escuchadores[evento].push(callback);
    },
    dispararEvento: (evento) => {
      if (escuchadores[evento]) {
        escuchadores[evento].forEach(fn => fn());
      }
    },
    complete: false,
    naturalWidth: 0
  };
}

describe('Gestor de Esqueletos - Ciclo TDD', () => {
  it('debe asignar clases iniciales de skeleton al contenedor y a la imagen pendiente', () => {
    const contenedor = crearMockElemento();
    const imagen = crearMockElemento();

    configurarEsqueleto(contenedor, imagen, 10);

    assert.equal(contenedor.classList.contains('esqueleto-activo'), true);
    assert.equal(imagen.classList.contains('img-cargando'), true);
  });

  it('debe remover el skeleton y activar img-cargada al completarse el evento load tras el placeholder', async () => {
    const contenedor = crearMockElemento();
    const imagen = crearMockElemento();

    configurarEsqueleto(contenedor, imagen, 10);
    imagen.dispararEvento('load');

    await new Promise(resolve => setTimeout(resolve, 25));

    assert.equal(contenedor.classList.contains('esqueleto-activo'), false);
    assert.equal(imagen.classList.contains('img-cargando'), false);
    assert.equal(imagen.classList.contains('img-cargada'), true);
  });

  it('debe mostrar el skeleton como placeholder inicial incluso si la imagen ya estaba en caché', async () => {
    const contenedor = crearMockElemento();
    const imagen = crearMockElemento();
    imagen.complete = true;
    imagen.naturalWidth = 800;

    configurarEsqueleto(contenedor, imagen, 50);

    // Inmediatamente debe mostrarse el placeholder
    assert.equal(contenedor.classList.contains('esqueleto-activo'), true);
    assert.equal(imagen.classList.contains('img-cargando'), true);

    // Tras el retardo del placeholder se revela suavemente
    await new Promise(resolve => setTimeout(resolve, 70));
    assert.equal(contenedor.classList.contains('esqueleto-activo'), false);
    assert.equal(imagen.classList.contains('img-cargada'), true);
  });

  it('debe remover el skeleton y asignar img-fallida si la imagen dispara un error', () => {
    const contenedor = crearMockElemento();
    const imagen = crearMockElemento();

    configurarEsqueleto(contenedor, imagen, 10);
    imagen.dispararEvento('error');

    assert.equal(contenedor.classList.contains('esqueleto-activo'), false);
    assert.equal(imagen.classList.contains('img-cargando'), false);
    assert.equal(imagen.classList.contains('img-fallida'), true);
  });

  it('debe manejar de forma defensiva argumentos nulos o indefinidos', () => {
    assert.doesNotThrow(() => {
      configurarEsqueleto(null, null);
    });
  });
});
