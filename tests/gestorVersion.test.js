import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Pruebas unitarias para el parser de historial Git (`gestorVersion.js`).
 * Valida la tolerancia a saltos de línea Windows (CRLF) y Unix (LF).
 */
test('gestorVersion: exporta parsearLogGit y parsea entradas CRLF sin caer en fallback', async () => {
  const modulo = await import('../scripts/gestorVersion.js');
  assert.equal(typeof modulo.parsearLogGit, 'function', 'parsearLogGit debe estar exportada');

  const logSimuladoCrlf = [
    '* 2026-11-11 [a1b2c3d] feat: Se adapta experiencia móvil (Jorge O. Tripodi)',
    '* 2026-11-10 [9e8f7d6] fix: Se corrige contraste en visor 360',
    '   ',
    ''
  ].join('\r\n');

  const entradas = modulo.parsearLogGit(logSimuladoCrlf);

  assert.equal(entradas.length, 2, 'Debe extraer las dos entradas válidas ignorando líneas vacías');
  assert.deepEqual(entradas[0], {
    fecha: '2026-11-11',
    hash: 'a1b2c3d',
    mensaje: 'feat: Se adapta experiencia móvil',
    autor: 'Jorge O. Tripodi',
    tipo: 'feat'
  });
  assert.deepEqual(entradas[1], {
    fecha: '2026-11-10',
    hash: '9e8f7d6',
    mensaje: 'fix: Se corrige contraste en visor 360',
    autor: 'Jorge O. Tripodi',
    tipo: 'fix'
  });
});

test('gestorVersion: conserva fallback legible ante texto sin formato git log válido', async () => {
  const modulo = await import('../scripts/gestorVersion.js');
  assert.equal(typeof modulo.parsearLogGit, 'function', 'parsearLogGit debe estar exportada');

  const entradas = modulo.parsearLogGit('Línea informativa sin hash ni fecha\r\n');
  assert.equal(entradas.length, 1);
  assert.equal(entradas[0].fecha, 'Reciente');
  assert.equal(entradas[0].hash, 'commit');
  assert.equal(entradas[0].mensaje, 'Línea informativa sin hash ni fecha');
});
