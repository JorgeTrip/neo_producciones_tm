import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Vista Presupuesto Móvil - Columna Única y Botones Lado a Lado (TDD)', async (t) => {
  const rutaPresupuestoCss = path.resolve('estilos/presupuesto.css');
  const rutaFormularioCss = path.resolve('estilos/presupuestoFormulario.css');
  const rutaPasoCobertura = path.resolve('componentes/wizard/PasoTipoCobertura.js');
  const rutaPasoAdicionales = path.resolve('componentes/wizard/PasoAdicionales.js');

  const cssPresupuesto = fs.readFileSync(rutaPresupuestoCss, 'utf8');
  const cssFormulario = fs.readFileSync(rutaFormularioCss, 'utf8');
  const codigoPasoCobertura = fs.readFileSync(rutaPasoCobertura, 'utf8');
  const codigoPasoAdicionales = fs.readFileSync(rutaPasoAdicionales, 'utf8');
  const cssTotal = cssPresupuesto + '\n' + cssFormulario;

  await t.test('debe configurar servicios base en columna única (1fr) en móviles', () => {
    const patronServicios1Col = /\.wizard-services-grid\s*\{[^}]*grid-template-columns:\s*1fr/;
    assert.match(
      cssFormulario,
      patronServicios1Col,
      'Servicios base deben mostrarse en 1 columna en móvil'
    );
  });

  await t.test('debe configurar adicionales en columna única (1fr) con scroll vertical interno', () => {
    const patronExtras1Col = /\.wizard-extras-grid\s*\{[^}]*grid-template-columns:\s*1fr[^}]*overflow-y:\s*auto/;
    assert.match(
      cssFormulario,
      patronExtras1Col,
      'Los adicionales deben mostrarse en 1 columna con overflow-y auto en móvil'
    );
  });

  await t.test('debe mantener botones de acción en una fila horizontal (flex-direction: row)', () => {
    const patronAccionesFila = /\.wizard-actions-bar\.dual\s*\{[^}]*flex-direction:\s*row/;
    assert.match(
      cssFormulario,
      patronAccionesFila,
      'Botones de acción deben mantenerse horizontales en móvil'
    );
  });

  await t.test('PasoAdicionales debe renderizar botones con textos exactos "← Volver" y "Presupuesto por WhatsApp"', () => {
    assert.ok(
      codigoPasoAdicionales.includes("'← Volver'") || codigoPasoAdicionales.includes('"← Volver"'),
      'Debe incluir texto exacto "← Volver"'
    );
    assert.ok(
      codigoPasoAdicionales.includes('Presupuesto por WhatsApp'),
      'Debe incluir texto exacto "Presupuesto por WhatsApp"'
    );
  });

  await t.test('debe destacar las casillas clickeables con borde luminoso y fondo diferenciado', () => {
    assert.ok(
      cssTotal.includes('.checkbox-box') &&
      (cssTotal.includes('rgba(244, 192, 103') || cssTotal.includes('var(--gold2)') || cssTotal.includes('var(--gold)')),
      'Las casillas .checkbox-box deben tener borde con acento dorado/luminoso'
    );
  });

  await t.test('debe configurar scrollbar dorado personalizado en el contenedor de adicionales', () => {
    assert.ok(
      cssTotal.includes('.wizard-scroll-track') || cssTotal.includes('::-webkit-scrollbar'),
      'Debe definir track de scrollbar personalizado'
    );
    assert.ok(
      cssTotal.includes('.wizard-scroll-thumb') || cssTotal.includes('scrollbar-thumb'),
      'Debe tener thumb estilizado en scrollbar'
    );
  });

  await t.test('debe compactar verticalmente el encabezado de presupuesto', () => {
    assert.ok(
      cssPresupuesto.includes('.presupuesto-intro') &&
      (cssPresupuesto.includes('margin-bottom: 1.25rem') || cssPresupuesto.includes('margin-bottom: 1.5rem')),
      'El margen inferior de .presupuesto-intro debe estar reducido para elevar el wizard'
    );
  });

  await t.test('PasoTipoCobertura debe alinear el bullet delante del título en una cabecera de fila', () => {
    assert.ok(
      codigoPasoCobertura.includes('card-radio-header'),
      'PasoTipoCobertura debe contener contenedor .card-radio-header'
    );
    assert.ok(
      cssTotal.includes('.card-radio-header') && cssTotal.includes('display: flex') && cssTotal.includes('align-items: center'),
      '.card-radio-header debe ser flex con alineación centrada'
    );
  });

  await t.test('PasoAdicionales debe incluir barra lateral visual fija e independiente del OS', () => {
    assert.ok(
      codigoPasoAdicionales.includes('wizard-scroll-track'),
      'PasoAdicionales debe contener .wizard-scroll-track'
    );
    assert.ok(
      codigoPasoAdicionales.includes('wizard-scroll-thumb'),
      'PasoAdicionales debe contener .wizard-scroll-thumb'
    );
  });
});
