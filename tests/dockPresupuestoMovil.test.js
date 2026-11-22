import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.cwd();
const leer = (rutaRelativa) => readFileSync(join(RAIZ, rutaRelativa), 'utf8');

/**
 * Suite TDD: Acoplamiento Magnético ("Dock") de Presupuesto Móvil (SPEC-UI-005 Rev. 2).
 */
test('Dock Presupuesto: exporta funciones cinemáticas y controlador', async () => {
  const modulo = await import('../scripts/gestorDockPresupuesto.js');

  assert.equal(typeof modulo.calcularPuntoDock, 'function', 'calcularPuntoDock debe ser una función');
  assert.equal(typeof modulo.calcularFraccionVisible, 'function', 'calcularFraccionVisible debe ser una función');
  assert.equal(typeof modulo.debeRearmarIman, 'function', 'debeRearmarIman debe ser una función');
  assert.equal(typeof modulo.evaluarDisparoEntrada, 'function', 'evaluarDisparoEntrada debe ser una función');
  assert.equal(typeof modulo.inicializarDockPresupuesto, 'function', 'inicializarDockPresupuesto debe ser una función');
});

test('Dock Presupuesto - calcularPuntoDock: calcula el scrollY exacto para apoyar la tarjeta en la barra inferior', async () => {
  const { calcularPuntoDock } = await import('../scripts/gestorDockPresupuesto.js');

  const scrollObjetivo = calcularPuntoDock({
    rectInferiorAbsoluto: 3200,
    windowHeight: 844,
    alturaBarraInferior: 50
  });

  assert.equal(scrollObjetivo, 2406, 'Debe dar 2406px exactos');
  assert.equal(calcularPuntoDock(null), 0, 'Debe devolver 0 si los parámetros son nulos');
  assert.equal(calcularPuntoDock({ rectInferiorAbsoluto: NaN }), 0, 'Debe manejar NaN defensivamente');
});

test('Dock Presupuesto - calcularFraccionVisible: calcula la visibilidad real en viewport entre 0 y 1', async () => {
  const { calcularFraccionVisible } = await import('../scripts/gestorDockPresupuesto.js');

  assert.equal(calcularFraccionVisible({ top: 900, bottom: 1500, height: 600 }, 844), 0);
  assert.equal(calcularFraccionVisible({ top: -700, bottom: -100, height: 600 }, 844), 0);
  assert.equal(Number(calcularFraccionVisible({ top: 724, bottom: 1324, height: 600 }, 844).toFixed(2)), 0.2);
  assert.equal(calcularFraccionVisible({ top: 100, bottom: 600, height: 500 }, 844), 1);
  assert.equal(calcularFraccionVisible(null, 844), 0);
  assert.equal(calcularFraccionVisible({ top: 0, bottom: 0, height: 0 }, 844), 0);
  assert.equal(calcularFraccionVisible({ top: NaN, bottom: 500, height: 500 }, 844), 0);
});

test('Dock Presupuesto - debeRearmarIman: rearma únicamente cuando la sección sale por completo de pantalla', async () => {
  const { debeRearmarIman } = await import('../scripts/gestorDockPresupuesto.js');

  assert.equal(debeRearmarIman(0), true);
  assert.equal(debeRearmarIman(-0.1), true);
  assert.equal(debeRearmarIman(0.05), false);
  assert.equal(debeRearmarIman(0.5), false);
  assert.equal(debeRearmarIman(NaN), false);
});

test('Dock Presupuesto - evaluarDisparoEntrada: disparo descendente one-shot y resguardo de escritorio/fling', async () => {
  const { evaluarDisparoEntrada } = await import('../scripts/gestorDockPresupuesto.js');

  const base = {
    anchoVentana: 390,
    barraPresente: true,
    fraccionVisible: 0.2,
    direccionDescendente: true,
    yaDisparadoEnEntrada: false,
    velocidadPxMs: 0.3
  };

  assert.equal(evaluarDisparoEntrada(base), true, 'Debe disparar al entrar >=15% bajando en móvil');
  assert.equal(evaluarDisparoEntrada({ ...base, fraccionVisible: 0.10 }), false, 'No dispara bajo 15%');
  assert.equal(evaluarDisparoEntrada({ ...base, yaDisparadoEnEntrada: true }), false, 'One-shot por entrada');
  assert.equal(evaluarDisparoEntrada({ ...base, direccionDescendente: false }), false, 'No dispara subiendo');
  assert.equal(evaluarDisparoEntrada({ ...base, anchoVentana: 1024 }), false, 'No dispara en escritorio');
  assert.equal(evaluarDisparoEntrada({ ...base, barraPresente: false }), false, 'Requiere barra inferior');
  assert.equal(evaluarDisparoEntrada({ ...base, velocidadPxMs: 2.2 }), false, 'Respeta swipes rápidos');
});

test('Dock Presupuesto - Integración: montaje en inicializarComponentes y orquestación', () => {
  const initJs = leer('scripts/inicializarComponentes.js');
  assert.match(initJs, /inicializarDockPresupuesto/);
});

test('Paso 1 Móvil: oculta únicamente .card-radio-desc en <=768px conservando subtítulo y vista escritorio', () => {
  const cssFormulario = leer('estilos/presupuestoFormulario.css');
  const cssPresupuesto = leer('estilos/presupuesto.css');
  const bloqueMovil = cssFormulario.split('@media (max-width: 768px)')[1] || '';

  assert.match(
    bloqueMovil,
    /\.card-radio-desc\s*\{[^}]*display:\s*none/,
    'En móvil (<= 768px) debe ocultarse el párrafo explicativo .card-radio-desc'
  );
  assert.equal(
    /\.card-radio-sub\s*\{[^}]*display:\s*none/.test(bloqueMovil),
    false,
    'El subtítulo breve .card-radio-sub debe permanecer visible en móvil'
  );
  assert.equal(
    /\.card-radio-desc\s*\{[^}]*display:\s*none/.test(cssPresupuesto),
    false,
    'En escritorio (> 768px) la descripción .card-radio-desc debe mantenerse visible'
  );
});
