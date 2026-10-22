import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEstadoWizard } from '../../scripts/aplicacion/estadoWizardPresupuesto.js';

test('Estado del Wizard de Presupuesto - Ciclo TDD', async (t) => {
  await t.test('debe inicializarse en el Paso 1 con servicio por defecto "sociales" y 2 pasos totales', () => {
    const store = crearEstadoWizard();
    const estado = store.obtenerEstado();

    assert.equal(estado.pasoActual, 1);
    assert.equal(estado.totalPasos, 2);
    assert.equal(estado.servicioSeleccionado, 'sociales');
    assert.deepEqual(estado.adicionalesSeleccionados, []);
  });

  await t.test('debe permitir cambiar el servicio seleccionado', () => {
    const store = crearEstadoWizard();
    store.seleccionarServicio('corporativos');
    assert.equal(store.obtenerEstado().servicioSeleccionado, 'corporativos');
  });

  await t.test('debe alternar la selección de módulos adicionales (toggle)', () => {
    const store = crearEstadoWizard();
    store.alternarAdicional('sesion_previa');
    assert.deepEqual(store.obtenerEstado().adicionalesSeleccionados, ['sesion_previa']);

    store.alternarAdicional('video_homenaje');
    assert.deepEqual(store.obtenerEstado().adicionalesSeleccionados, ['sesion_previa', 'video_homenaje']);

    store.alternarAdicional('sesion_previa');
    assert.deepEqual(store.obtenerEstado().adicionalesSeleccionados, ['video_homenaje']);
  });

  await t.test('debe avanzar a través de los 2 pasos y retroceder conservando todas las selecciones', () => {
    const store = crearEstadoWizard();
    assert.equal(store.obtenerEstado().totalPasos, 2);

    store.seleccionarServicio('sesiones');
    store.avanzarPaso(); // Paso 1 -> 2 (Adicionales y Envío)
    assert.equal(store.obtenerEstado().pasoActual, 2);

    store.alternarAdicional('fotolibro');

    // No debe avanzar más allá del paso 2
    store.avanzarPaso();
    assert.equal(store.obtenerEstado().pasoActual, 2);

    store.retrocederPaso(); // Paso 2 -> 1
    assert.equal(store.obtenerEstado().pasoActual, 1);
    assert.equal(store.obtenerEstado().servicioSeleccionado, 'sesiones');
    assert.deepEqual(store.obtenerEstado().adicionalesSeleccionados, ['fotolibro']);

    // No debe retroceder más allá del paso 1
    store.retrocederPaso();
    assert.equal(store.obtenerEstado().pasoActual, 1);

    // Al saltar al paso 2, los adicionales deben seguir intactos
    store.irAPaso(2);
    assert.equal(store.obtenerEstado().pasoActual, 2);
    assert.deepEqual(store.obtenerEstado().adicionalesSeleccionados, ['fotolibro']);

    // Salto inválido (ej: paso 3 o 5) no debe mutar
    store.irAPaso(3);
    assert.equal(store.obtenerEstado().pasoActual, 2);
    store.irAPaso(5);
    assert.equal(store.obtenerEstado().pasoActual, 2);
  });

  await t.test('debe notificar a los suscriptores cuando el estado cambia', () => {
    const store = crearEstadoWizard();
    let llamadas = 0;
    let ultimoEstado = null;

    const desuscribir = store.suscribir((estado) => {
      llamadas++;
      ultimoEstado = estado;
    });

    store.seleccionarServicio('comercial');
    assert.equal(llamadas, 1);
    assert.equal(ultimoEstado.servicioSeleccionado, 'comercial');

    desuscribir();
    store.seleccionarServicio('sociales');
    assert.equal(llamadas, 1); // no se vuelve a invocar tras desuscribir
  });

  await t.test('debe validar los datos de contacto y registrar los errores en el estado', () => {
    const store = crearEstadoWizard();
    const resultado = store.validarPasoContacto();

    assert.equal(resultado.esValido, false);
    assert.ok(resultado.errores.nombre);
    assert.ok(store.obtenerEstado().erroresValidacion.nombre);

    store.actualizarDatosContacto('nombre', 'Santiago');
    assert.equal(store.obtenerEstado().erroresValidacion.nombre, undefined);
  });
});
