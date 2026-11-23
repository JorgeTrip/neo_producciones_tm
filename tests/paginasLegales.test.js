import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.cwd();
const leer = (rutaRelativa) => readFileSync(join(RAIZ, rutaRelativa), 'utf8');

/**
 * Suite de contratos estructurales para las páginas legales del sitio.
 */
test('Archivos legales y hoja de estilos compartida existen', () => {
  assert.equal(existsSync(join(RAIZ, 'privacidad.html')), true);
  assert.equal(existsSync(join(RAIZ, 'terminos.html')), true);
  assert.equal(existsSync(join(RAIZ, 'estilos/paginasLegales.css')), true);
});

test('Ambas páginas legales comparten CSS, canonical, retorno y enlace cruzado', () => {
  const paginas = [
    {
      archivo: 'privacidad.html',
      canonical: 'https://neoproduccionestm.netlify.app/privacidad.html',
      enlaceCruzado: 'href="terminos.html"'
    },
    {
      archivo: 'terminos.html',
      canonical: 'https://neoproduccionestm.netlify.app/terminos.html',
      enlaceCruzado: 'href="privacidad.html"'
    }
  ];

  for (const pagina of paginas) {
    const html = leer(pagina.archivo);
    assert.match(html, /href="estilos\/paginasLegales\.css"/, `${pagina.archivo} debe enlazar estilos/paginasLegales.css`);
    assert.match(html, /href="index\.html"/, `${pagina.archivo} debe enlazar a index.html`);
    assert.ok(html.includes(pagina.canonical), `${pagina.archivo} debe declarar su URL canonical`);
    assert.ok(html.includes(pagina.enlaceCruzado), `${pagina.archivo} debe enlazar a la otra página legal`);
  }
});

test('privacidad.html declara eliminación de datos, GA4 y canales Meta', () => {
  const privacidadHtml = leer('privacidad.html');

  assert.match(privacidadHtml, /id="eliminacion-datos"/);
  assert.match(privacidadHtml, /Google Analytics 4/i);
  assert.match(privacidadHtml, /Facebook Messenger/i);
  assert.match(privacidadHtml, /Instagram Direct/i);
  assert.match(privacidadHtml, /25\.326/);
});

test('terminos.html contempla reservas, entregas y jurisdicción', () => {
  const terminosHtml = leer('terminos.html');

  assert.match(terminosHtml, /50%/);
  assert.match(terminosHtml, /Google Drive/);
  assert.match(terminosHtml, /Buenos Aires/);
});

test('index.html enlaza ambas páginas legales en el footer y sitemap.xml las indexa', () => {
  const indexHtml = leer('index.html');
  const sitemapXml = leer('sitemap.xml');
  const coincidenciaFooter = indexHtml.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/);

  assert.ok(coincidenciaFooter, 'index.html debe contener elemento <footer>');
  const footerHtml = coincidenciaFooter[0];

  assert.match(footerHtml, /id="footer"/);
  assert.match(footerHtml, /href="privacidad\.html"/);
  assert.match(footerHtml, /href="terminos\.html"/);
  assert.match(footerHtml, /https:\/\/wa\.me\/541140686925/);
  assert.match(footerHtml, /mailto:jorgeotripodi@hotmail\.com/);
  assert.match(footerHtml, /todos los derechos reservados/i);
  assert.ok(sitemapXml.includes('https://neoproduccionestm.netlify.app/privacidad.html'));
  assert.ok(sitemapXml.includes('https://neoproduccionestm.netlify.app/terminos.html'));
});

test('pieDePagina.css mantiene footer nav.footer-legal en flujo normal (sin position fixed del nav superior)', () => {
  const pieCss = leer('estilos/pieDePagina.css');

  assert.match(pieCss, /footer\s+nav\.footer-legal\s*\{[\s\S]*position:\s*static;/);
  assert.match(pieCss, /footer\s+nav\.footer-legal\s*\{[\s\S]*height:\s*auto;/);
});

test('Móviles ocultan .footer-social y compactan la altura del footer', () => {
  const movilCss = leer('estilos/movilExperiencia.css');
  const barraCss = leer('estilos/barraInferiorMovil.css');

  assert.match(movilCss, /@media\s*\(max-width:\s*768px\)[\s\S]*\.footer-social\s*\{\s*display:\s*none;\s*\}/);
  assert.match(movilCss, /@media\s*\(max-width:\s*768px\)[\s\S]*\.footer-copy-sep\s*\{\s*display:\s*none;\s*\}/);
  assert.match(movilCss, /@media\s*\(max-width:\s*768px\)[\s\S]*\.footer-derechos\s*\{\s*display:\s*block;\s*\}/);
  assert.match(movilCss, /\.footer-inner\s*\{[\s\S]*flex-direction:\s*column;/);
  assert.equal(barraCss.includes('5.5rem'), false, 'No debe dejar 5.5rem de padding-bottom en footer móvil');
  assert.match(barraCss, /footer\s*\{\s*padding-bottom:\s*calc\(4\.05rem/);
});
