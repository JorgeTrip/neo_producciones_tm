import test from 'node:test';
import assert from 'node:assert/strict';
import { validarDatosContacto } from '../../scripts/dominio/validadorPresupuesto.js';

test('Validador de Presupuesto - Ciclo TDD', async (t) => {
  await t.test('debe validar exitosamente cuando todos los datos obligatorios son correctos', () => {
    const datos = {
      nombre: 'Mariana Gómez',
      telefono: '11 4068-6925',
      fechaEvento: '2026-12-15',
      zonaEvento: 'San Isidro, Buenos Aires',
      email: 'mariana@example.com',
      comentarios: 'Quisiera presupuesto para 120 personas.'
    };

    const resultado = validarDatosContacto(datos);
    assert.equal(resultado.esValido, true);
    assert.deepEqual(resultado.errores, {});
  });

  await t.test('debe permitir email vacío ya que es un campo opcional', () => {
    const datos = {
      nombre: 'Carlos López',
      telefono: '1155443322',
      fechaEvento: '10/11/2026',
      zonaEvento: 'Pilar',
      email: ''
    };

    const resultado = validarDatosContacto(datos);
    assert.equal(resultado.esValido, true);
    assert.deepEqual(resultado.errores, {});
  });

  await t.test('debe fallar si el nombre está vacío o tiene menos de 2 caracteres', () => {
    const resultado = validarDatosContacto({
      nombre: '  ',
      telefono: '1140686925',
      fechaEvento: '2026-11-20',
      zonaEvento: 'CABA'
    });

    assert.equal(resultado.esValido, false);
    assert.ok(resultado.errores.nombre);
  });

  await t.test('debe fallar si el teléfono tiene menos de 6 caracteres', () => {
    const resultado = validarDatosContacto({
      nombre: 'Juan',
      telefono: '123',
      fechaEvento: '2026-11-20',
      zonaEvento: 'CABA'
    });

    assert.equal(resultado.esValido, false);
    assert.ok(resultado.errores.telefono);
  });

  await t.test('debe fallar si la fecha o la zona están vacías', () => {
    const resultado = validarDatosContacto({
      nombre: 'Juan Pérez',
      telefono: '1140686925',
      fechaEvento: '',
      zonaEvento: '   '
    });

    assert.equal(resultado.esValido, false);
    assert.ok(resultado.errores.fechaEvento);
    assert.ok(resultado.errores.zonaEvento);
  });

  await t.test('debe fallar si el email provisto no tiene formato válido', () => {
    const resultado = validarDatosContacto({
      nombre: 'Ana Torres',
      telefono: '1140686925',
      fechaEvento: '2026-12-01',
      zonaEvento: 'Belgrano',
      email: 'correo-invalido'
    });

    assert.equal(resultado.esValido, false);
    assert.ok(resultado.errores.email);
  });
});
