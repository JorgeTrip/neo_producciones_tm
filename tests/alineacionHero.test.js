import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Alineación y Adaptabilidad Vertical del Hero (TDD)', async (t) => {
  const rutaHeroCss = path.resolve('estilos/hero.css');
  const rutaResponsivoCss = path.resolve('estilos/responsivo.css');

  const cssHero = fs.readFileSync(rutaHeroCss, 'utf8');
  const cssResponsivo = fs.readFileSync(rutaResponsivoCss, 'utf8');

  await t.test('debe configurar #inicio con padding vertical cero para centrado exacto en viewport', () => {
    // #inicio no debe tener padding-top de 70px que desplace el centro vertical hacia abajo
    const patronInicioSinSesgo = /#inicio\s*\{[^}]*padding:\s*0(;|\s)/;
    assert.match(
      cssHero,
      patronInicioSinSesgo,
      '#inicio debe definir padding: 0 para permitir centrado vertical simétrico'
    );
    assert.doesNotMatch(
      cssHero,
      /#inicio\s*\{[^}]*padding:\s*70px/,
      '#inicio no debe contener padding superior de 70px'
    );
  });

  await t.test('debe definir reglas para viewports de altura reducida (max-height: 800px)', () => {
    assert.ok(
      cssResponsivo.includes('max-height: 800px') || cssResponsivo.includes('max-height: 820px'),
      'Debe contener una media query para pantallas con altura reducida'
    );
  });

  await t.test('debe compactar padding y márgenes de hero-content en pantallas de baja altura', () => {
    const patronHeroContentCompacto = /@media[^{]*max-height:\s*8[0-2]0px[^{]*\{[\s\S]*?\.hero-content\s*\{[^}]*padding:\s*1/i;
    assert.match(
      cssResponsivo,
      patronHeroContentCompacto,
      'hero-content debe compactar su padding a ~1rem en pantallas de baja altura'
    );
  });

  await t.test('debe compactar la distancia de hero-scroll para evitar colisión con botones CTA', () => {
    const patronHeroScrollCompacto = /@media[^{]*max-height:\s*8[0-2]0px[^{]*\{[\s\S]*?\.hero-scroll\s*\{[^}]*bottom:\s*1\./i;
    assert.match(
      cssResponsivo,
      patronHeroScrollCompacto,
      'hero-scroll debe reducir su posición bottom a ~1.25rem o menos en baja altura'
    );
  });

  await t.test('debe ajustar proporcionalmente el tamaño del título hero en pantallas de baja altura', () => {
    const patronTituloCompacto = /@media[^{]*max-height:\s*8[0-2]0px[^{]*\{[\s\S]*?\.hero-title\s*\{[^}]*font-size:/i;
    assert.match(
      cssResponsivo,
      patronTituloCompacto,
      'hero-title debe ajustar font-size para optimizar espacio vertical en monitores de baja altura'
    );
  });
});
