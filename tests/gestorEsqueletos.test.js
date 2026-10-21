/**
 * Pruebas Unitarias TDD: Gestor de Esqueletos de Carga (Skeleton Screens).
 * Valida el ciclo de vida de los estados visuales en fotos y videos, asegurando
 * que el esqueleto actúe siempre como placeholder inicial antes de la revelación.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { configurarEsqueleto, activarCargaFila } from '../scripts/gestorEsqueletos.js';

/**
 * Crea un mock ligero de elemento DOM para pruebas unitarias sin dependencias pesadas.
 * @param {string} [etiqueta='div'] - Nombre de etiqueta HTML simulada.
 * @returns {object} Mock de elemento DOM con soporte de atributos, clases y eventos.
 */
function crearMockElemento(etiqueta = 'div') {
  const clases = new Set();
  const escuchadores = {};
  const atributos = {};
  let padre = null;

  return {
    tagName: etiqueta.toUpperCase(),
    classList: {
      add: (c) => clases.add(c),
      remove: (c) => clases.delete(c),
      contains: (c) => clases.has(c),
      toArray: () => Array.from(clases)
    },
    getAttribute: (attr) => atributos[attr] ?? null,
    setAttribute: (attr, val) => { atributos[attr] = String(val); },
    removeAttribute: (attr) => { delete atributos[attr]; },
    addEventListener: (evento, callback) => {
      if (!escuchadores[evento]) escuchadores[evento] = [];
      escuchadores[evento].push(callback);
    },
    dispararEvento: (evento) => {
      if (escuchadores[evento]) {
        escuchadores[evento].forEach(fn => fn());
      }
    },
    closest: () => padre,
    set parentElement(p) { padre = p; },
    get parentElement() { return padre; },
    complete: false,
    naturalWidth: 0,
    src: ''
  };
}

describe('Gestor de Esqueletos - Ciclo TDD', () => {
  it('debe asignar clases iniciales de skeleton al contenedor y a la imagen pendiente', () => {
    const contenedor = crearMockElemento();
    const imagen = crearMockElemento('img');

    configurarEsqueleto(contenedor, imagen, 10);

    assert.equal(contenedor.classList.contains('esqueleto-activo'), true);
    assert.equal(imagen.classList.contains('img-cargando'), true);
  });

  it('debe remover el skeleton y activar img-cargada al completarse el evento load tras el placeholder', async () => {
    const contenedor = crearMockElemento();
    const imagen = crearMockElemento('img');

    configurarEsqueleto(contenedor, imagen, 10);
    imagen.dispararEvento('load');

    await new Promise(resolve => setTimeout(resolve, 25));

    assert.equal(contenedor.classList.contains('esqueleto-activo'), false);
    assert.equal(imagen.classList.contains('img-cargando'), false);
    assert.equal(imagen.classList.contains('img-cargada'), true);
  });

  it('debe mostrar el skeleton como placeholder inicial incluso si la imagen ya estaba en caché', async () => {
    const contenedor = crearMockElemento();
    const imagen = crearMockElemento('img');
    imagen.complete = true;
    imagen.naturalWidth = 800;

    configurarEsqueleto(contenedor, imagen, 50);

    assert.equal(contenedor.classList.contains('esqueleto-activo'), true);
    assert.equal(imagen.classList.contains('img-cargando'), true);

    await new Promise(resolve => setTimeout(resolve, 70));
    assert.equal(contenedor.classList.contains('esqueleto-activo'), false);
    assert.equal(imagen.classList.contains('img-cargada'), true);
  });

  it('debe remover el skeleton y asignar img-fallida si la imagen dispara un error', () => {
    const contenedor = crearMockElemento();
    const imagen = crearMockElemento('img');

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

  it('activarCargaFila debe transferir data-src a src y remover data-src de cada imagen en la fila', () => {
    const tarjeta = crearMockElemento();
    const img1 = crearMockElemento('img');
    img1.setAttribute('data-src', 'images/portfolio/foto1.webp');
    img1.parentElement = tarjeta;

    const filaMock = {
      querySelectorAll: (sel) => sel === 'img[data-src]' ? [img1] : []
    };

    activarCargaFila(filaMock, { retardoBaseMs: 10, desfaseColumnaMs: 5 });

    assert.equal(img1.src, 'images/portfolio/foto1.webp');
    assert.equal(img1.getAttribute('data-src'), null);
    assert.equal(tarjeta.classList.contains('esqueleto-activo'), true);
  });

  it('activarCargaFila debe escalonar tiempos de placeholder según columna y revelar imagen tras load', async () => {
    const tarjeta1 = crearMockElemento();
    const img1 = crearMockElemento('img');
    img1.setAttribute('data-src', 'images/portfolio/col1.webp');
    img1.parentElement = tarjeta1;

    const tarjeta2 = crearMockElemento();
    const img2 = crearMockElemento('img');
    img2.setAttribute('data-src', 'images/portfolio/col2.webp');
    img2.parentElement = tarjeta2;

    const filaMock = {
      querySelectorAll: (sel) => sel === 'img[data-src]' ? [img1, img2] : []
    };

    activarCargaFila(filaMock, { retardoBaseMs: 20, desfaseColumnaMs: 40 });

    img1.dispararEvento('load');
    img2.dispararEvento('load');

    // A los 35ms, la columna 1 (20ms) ya reveló, pero la columna 2 (60ms) sigue en esqueleto
    await new Promise(r => setTimeout(r, 35));
    assert.equal(tarjeta1.classList.contains('esqueleto-activo'), false);
    assert.equal(tarjeta2.classList.contains('esqueleto-activo'), true);

    // A los 80ms, ambas columnas ya revelaron
    await new Promise(r => setTimeout(r, 45));
    assert.equal(tarjeta2.classList.contains('esqueleto-activo'), false);
    assert.equal(img2.classList.contains('img-cargada'), true);
  });

  it('activarCargaFila debe operar de forma segura con argumentos nulos o sin imágenes pendientes', () => {
    assert.doesNotThrow(() => {
      activarCargaFila(null);
      activarCargaFila({});
      activarCargaFila({ querySelectorAll: () => [] });
    });
  });
});
