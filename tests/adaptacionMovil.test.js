import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.cwd();
const leer = (rutaRelativa) => readFileSync(join(RAIZ, rutaRelativa), 'utf8');

/**
 * Suite TDD de contratos de adaptación móvil (SPEC-UI-004).
 */
test('Portafolio móvil: sin estilo inline rígido repeat(4,1fr) y con accesibilidad de teclado', () => {
  const portafolioJs = leer('componentes/SeccionPortafolio.js');

  assert.equal(
    /gridTemplateColumns\s*:\s*['"]repeat\(4\s*,\s*1fr\)['"]/.test(portafolioJs),
    false,
    'No debe forzar 4 columnas inline sobre .gallery-row'
  );
  assert.match(portafolioJs, /role:\s*['"]button['"]/);
  assert.match(portafolioJs, /tabIndex:\s*0|tabindex:\s*['"]?0['"]?/);
  assert.match(portafolioJs, /onkeydown:/);
  assert.match(portafolioJs, /aria-label|['"]aria-label['"]/);
});

test('Wizard Paso 2: preserva texto requerido y elimina marginRight duplicado del SVG WhatsApp', () => {
  const paso2Js = leer('componentes/wizard/PasoAdicionales.js');

  assert.match(paso2Js, /'Presupuesto por WhatsApp'/);
  assert.match(paso2Js, /'← Volver'/);
  assert.equal(
    /marginRight:\s*['"]8px['"]/.test(paso2Js),
    false,
    'El SVG de WhatsApp no debe duplicar marginRight inline junto al gap flex'
  );
});

test('Navegación móvil: hamburguesa semántica <button>, backdrop táctil y sincronía aria-expanded', () => {
  const indexHtml = leer('index.html');
  const menuJs = leer('scripts/menuNavegacion.js');

  assert.match(indexHtml, /<button[^>]*class="nav-hamburger"/);
  assert.match(indexHtml, /aria-expanded="/);
  assert.match(indexHtml, /id="mobileMenuBackdrop"/);
  assert.match(menuJs, /mobileMenuBackdrop/);
  assert.match(menuJs, /aria-expanded/);
});

test('Barra inferior móvil: componente declarativo con 4 accesos, montaje y hoja CSS <=768px', () => {
  const rutaComp = join(RAIZ, 'componentes/BarraInferiorMovil.js');
  const rutaCss = join(RAIZ, 'estilos/barraInferiorMovil.css');

  assert.equal(existsSync(rutaComp), true, 'Debe existir componentes/BarraInferiorMovil.js');
  assert.equal(existsSync(rutaCss), true, 'Debe existir estilos/barraInferiorMovil.css');

  const compJs = leer('componentes/BarraInferiorMovil.js');
  const initJs = leer('scripts/inicializarComponentes.js');
  const cssBar = leer('estilos/barraInferiorMovil.css');
  const cssPrincipal = leer('estilos/principal.css');

  assert.match(compJs, /export function crearBarraInferiorMovil/);
  assert.match(compJs, /Inicio/);
  assert.match(compJs, /Portfolio/);
  assert.match(compJs, /Presupuesto/);
  assert.match(compJs, /WhatsApp/);
  assert.match(initJs, /montarBarraInferiorMovil/);
  assert.match(cssPrincipal, /@import url\(['"]barraInferiorMovil\.css['"]\);/);
  assert.match(cssBar, /@media\s*\(max-width:\s*768px\)/);
  assert.match(cssBar, /top:\s*auto/);
  assert.match(cssBar, /height:\s*auto/);
  assert.match(cssBar, /env\(safe-area-inset-bottom/);
  assert.match(cssBar, /min-height:\s*44px/);

  const coincidenciaZ = cssBar.match(/z-index:\s*(\d+)/);
  assert.ok(coincidenciaZ && Number(coincidenciaZ[1]) < 1000, 'z-index debe ser menor a 1000');
});

test('Experiencia móvil CSS y Bottom Sheet: targets >=44px, 360°, compacto 360px y landscape', () => {
  const rutaCssExp = join(RAIZ, 'estilos/movilExperiencia.css');
  assert.equal(existsSync(rutaCssExp), true, 'Debe existir estilos/movilExperiencia.css');

  const cssPrincipal = leer('estilos/principal.css');
  const cssExp = leer('estilos/movilExperiencia.css');
  const modalJs = leer('componentes/ModalAcercaDe.js');

  assert.match(cssPrincipal, /@import url\(['"]movilExperiencia\.css['"]\);/);
  assert.match(modalJs, /modal-acerca-handle/);
  assert.match(cssExp, /\.lightbox-close/);
  assert.match(cssExp, /\.lightbox-nav/);
  assert.match(cssExp, /\.modal-acerca-cerrar/);
  assert.match(cssExp, /\.footer-social\s+a/);
  assert.match(cssExp, /\.wizard-step-node/);
  assert.match(cssExp, /min-width:\s*44px/);
  assert.match(cssExp, /min-height:\s*44px/);
  assert.match(cssExp, /\.panorama-title-float/);
  assert.match(cssExp, /\.panorama-badge/);
  assert.match(cssExp, /@media\s*\(max-width:\s*600px\)/);
  assert.match(cssExp, /@media\s*\(max-width:\s*400px\)/);
  assert.match(cssExp, /@media\s*\(max-height:\s*500px\)/);
  assert.match(cssExp, /\.modal-acerca-tarjeta/);
  assert.match(cssExp, /\.contacto-cta/);
});

test('Privacidad: alineación Grises Pro y botón táctil de retorno >=44px hacia index.html', () => {
  const privacidadHtml = leer('privacidad.html');

  assert.equal(privacidadHtml.includes('#D4AF37'), false, 'No debe usar dorado heredado #D4AF37');
  assert.match(privacidadHtml, /#141416/);
  assert.match(privacidadHtml, /#D8C5B8/i);
  assert.match(privacidadHtml, /href="index\.html"/);
  assert.match(privacidadHtml, /Volver al sitio/);
  assert.match(privacidadHtml, /min-height:\s*44px/);
});
