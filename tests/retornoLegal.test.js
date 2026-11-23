import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.cwd();
const leer = (rutaRelativa) => readFileSync(join(RAIZ, rutaRelativa), 'utf8');

/**
 * Suite TDD para efecto crossfade y retorno al fondo (footer / scroll previo)
 * desde las páginas legales, sin remitir al inicio superior del sitio.
 */
test('Archivos de crossfade, bloqueo de renderizado y retorno al pie están configurados', () => {
  assert.equal(existsSync(join(RAIZ, 'estilos/transicionPaginas.css')), true);
  assert.equal(existsSync(join(RAIZ, 'scripts/retornoLegal.js')), true);
  assert.equal(existsSync(join(RAIZ, 'scripts/paginaLegal.js')), true);

  const cssTransicion = leer('estilos/transicionPaginas.css');
  const cssPrincipal = leer('estilos/principal.css');
  const indexHtml = leer('index.html');

  assert.match(cssTransicion, /@view-transition\s*\{\s*navigation:\s*auto;\s*\}/);
  assert.match(cssTransicion, /::view-transition-old\(root\)/);
  assert.match(cssTransicion, /::view-transition-new\(root\)/);
  assert.match(cssPrincipal, /@import url\(['"]transicionPaginas\.css['"]\);/);
  assert.match(indexHtml, /<script[^>]*type="module"[^>]*src="scripts\/principal\.js"/);
  assert.match(indexHtml, /<footer\s+id="footer"/);

  for (const archivo of ['privacidad.html', 'terminos.html']) {
    const html = leer(archivo);
    assert.match(html, /href="estilos\/transicionPaginas\.css"/);
    assert.match(html, /<script[^>]*type="module"[^>]*src="scripts\/paginaLegal\.js"/);
    assert.match(html, /class="cabecera-legal-acciones"/);
    assert.match(html, /class="btn-volver"/);
    assert.match(html, /href="index\.html#footer"[^>]*class="btn-cerrar-legal"/);
    assert.match(html, /href="index\.html#footer"[^>]*class="btn-volver-pie"/);
    assert.equal(html.includes('Volver al inicio'), false, `${archivo} no debe remitir al inicio`);
  }
});

test('Funciones puras de validación y detección de enlaces legales operan de forma segura', async () => {
  const { validarScrollGuardado, resolverDestinoSeguro, esEnlacePaginaLegal } =
    await import('../scripts/retornoLegal.js');

  assert.equal(validarScrollGuardado('0'), 0);
  assert.equal(validarScrollGuardado('4250'), 4250);
  assert.equal(validarScrollGuardado('120.7'), 121);
  assert.equal(validarScrollGuardado('-5'), null);
  assert.equal(validarScrollGuardado('no-numero'), null);
  assert.equal(validarScrollGuardado(null), null);

  assert.equal(resolverDestinoSeguro('./'), './');
  assert.equal(resolverDestinoSeguro('index.html'), 'index.html');
  assert.equal(resolverDestinoSeguro('https://sitio-externo.test'), 'index.html');
  assert.equal(resolverDestinoSeguro('javascript:alert(1)'), 'index.html');

  assert.equal(esEnlacePaginaLegal('privacidad.html'), true);
  assert.equal(esEnlacePaginaLegal('./terminos.html'), true);
  assert.equal(esEnlacePaginaLegal('index.html'), false);
});

test('restaurarPosicionRetorno restaura scroll exacto o cae al fondo (#footer), nunca al inicio', async () => {
  const { CLAVE_SCROLL_RETORNO, restaurarPosicionRetorno } = await import('../scripts/retornoLegal.js');

  const llamadasScroll = [];
  const reemplazosUrl = [];
  const almacenamiento = new Map([[CLAVE_SCROLL_RETORNO, '3840']]);
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalSession = globalThis.sessionStorage;

  try {
    globalThis.sessionStorage = {
      getItem: (k) => (almacenamiento.has(k) ? almacenamiento.get(k) : null),
      setItem: (k, v) => almacenamiento.set(k, String(v)),
      removeItem: (k) => almacenamiento.delete(k)
    };
    globalThis.window = {
      location: { hash: '#footer', pathname: '/', search: '' },
      history: { replaceState: (_s, _t, u) => reemplazosUrl.push(u) },
      scrollTo: (opts) => llamadasScroll.push(opts),
      addEventListener: () => {},
      removeEventListener: () => {}
    };
    globalThis.document = {
      documentElement: { style: {}, scrollHeight: 5200 },
      getElementById: () => ({ scrollIntoView: () => llamadasScroll.push('footer-view') })
    };

    assert.equal(restaurarPosicionRetorno(), true);
    assert.deepEqual(llamadasScroll[0], { top: 3840, left: 0, behavior: 'instant' });
    assert.equal(reemplazosUrl[0], '/');

    // Sin marca guardada pero con #footer, debe ubicar al fondo del sitio
    assert.equal(restaurarPosicionRetorno(), true);
    assert.equal(llamadasScroll.includes('footer-view'), true);

    // Sin marca guardada ni #footer, no hace scroll forzado
    globalThis.window.location.hash = '';
    assert.equal(restaurarPosicionRetorno(), false);
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    globalThis.sessionStorage = originalSession;
  }
});

test('inicializarRetornoLegal dirige todos los botones de cierre/retorno hacia #footer preservando scroll', async () => {
  const { CLAVE_SCROLL_RETORNO, CLAVE_DESTINO_RETORNO, inicializarRetornoLegal } =
    await import('../scripts/retornoLegal.js');

  const almacenamiento = new Map([[CLAVE_SCROLL_RETORNO, '4120'], [CLAVE_DESTINO_RETORNO, './']]);
  const oyentes = new Map();
  const hrefs = new Map();
  const crearBoton = (clave) => ({
    setAttribute: (_k, v) => hrefs.set(clave, v),
    addEventListener: (_tipo, fn) => oyentes.set(clave, fn)
  });

  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalSession = globalThis.sessionStorage;

  try {
    globalThis.sessionStorage = {
      getItem: (k) => (almacenamiento.has(k) ? almacenamiento.get(k) : null),
      setItem: (k, v) => almacenamiento.set(k, String(v)),
      removeItem: (k) => almacenamiento.delete(k)
    };
    globalThis.window = { onpagereveal: null, location: { protocol: 'https:' } };
    globalThis.document = {
      body: null,
      querySelectorAll: (sel) =>
        sel.includes('.btn-volver-pie') ? [crearBoton('volver'), crearBoton('cerrar'), crearBoton('pie')] : []
    };

    inicializarRetornoLegal();
    oyentes.get('volver')({});
    oyentes.get('cerrar')({});
    oyentes.get('pie')({});

    assert.equal(hrefs.get('volver'), './#footer');
    assert.equal(hrefs.get('cerrar'), './#footer');
    assert.equal(hrefs.get('pie'), './#footer');
    assert.equal(almacenamiento.get(CLAVE_SCROLL_RETORNO), '4120');
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    globalThis.sessionStorage = originalSession;
  }
});
