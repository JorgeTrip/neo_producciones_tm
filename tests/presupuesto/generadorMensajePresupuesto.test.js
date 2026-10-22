import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generarTextoPresupuesto,
  generarEnlaceWhatsApp
} from '../../scripts/dominio/generadorMensajePresupuesto.js';

test('Generador de Mensaje de Presupuesto - Ciclo TDD', async (t) => {
  const datosContacto = {
    nombre: 'Valeria Rossi',
    telefono: '11 6543-2109',
    email: 'valeria@example.com',
    fechaEvento: '18/12/2026',
    zonaEvento: 'Vicente López',
    comentarios: 'Cumpleaños de 15, fiesta nocturna.'
  };

  await t.test('debe generar el texto estructurado con servicio y múltiples adicionales', () => {
    const texto = generarTextoPresupuesto({
      servicioId: 'sociales',
      adicionalesIds: ['sesion_previa', 'video_homenaje'],
      datosContacto
    });

    assert.ok(texto.includes('📌 Servicio: Eventos Sociales'));
    assert.ok(texto.includes('• Sesión de Fotos Previa'));
    assert.ok(texto.includes('• Video Homenaje / Cronológico'));
    assert.ok(texto.includes('📅 Fecha estimada: 18/12/2026'));
    assert.ok(texto.includes('📍 Zona / Salón: Vicente López'));
    assert.ok(texto.includes('👤 Nombre: Valeria Rossi'));
    assert.ok(texto.includes('📱 Contacto: 11 6543-2109'));
    assert.ok(texto.includes('✉️ Email: valeria@example.com'));
    assert.ok(texto.includes('💬 Comentarios: Cumpleaños de 15, fiesta nocturna.'));
  });

  await t.test('debe indicar "Sin adicionales (Cobertura base)" cuando no hay adicionales seleccionados', () => {
    const texto = generarTextoPresupuesto({
      servicioId: 'corporativos',
      adicionalesIds: [],
      datosContacto: {
        nombre: 'Martín',
        telefono: '1199887766',
        fechaEvento: '05/11/2026',
        zonaEvento: 'Puerto Madero'
      }
    });

    assert.ok(texto.includes('📌 Servicio: Eventos Corporativos'));
    assert.ok(texto.includes('Sin adicionales (Cobertura base)'));
    assert.ok(!texto.includes('✉️ Email:')); // no se incluyó email
  });

  await t.test('debe generar un enlace https://api.whatsapp.com/send válido codificado en URL', () => {
    const enlace = generarEnlaceWhatsApp({
      servicioId: 'sesiones',
      adicionalesIds: ['fotolibro'],
      datosContacto
    });

    assert.ok(enlace.startsWith('https://api.whatsapp.com/send?phone=541140686925&text='));
    const url = new URL(enlace);
    const parametroTexto = url.searchParams.get('text');
    assert.ok(parametroTexto.includes('📌 Servicio: Sesiones & Books'));
    assert.ok(parametroTexto.includes('• Fotolibro / Photobook Impreso'));
  });

  await t.test('debe generar texto limpio sin datos de contacto cuando no se proveen (flujo directo de 2 pasos)', () => {
    const texto = generarTextoPresupuesto({
      servicioId: 'sociales',
      adicionalesIds: ['sesion_previa']
    });

    assert.ok(texto.includes('📌 Servicio: Eventos Sociales'));
    assert.ok(texto.includes('• Sesión de Fotos Previa'));
    assert.ok(!texto.includes('👤 Nombre:'));
    assert.ok(!texto.includes('📱 Contacto:'));
    assert.ok(!texto.includes('📅 Fecha estimada:'));
    assert.ok(!texto.includes('📍 Zona / Salón:'));
    assert.ok(texto.includes('Quedo a la espera de tu cotización y disponibilidad.'));
  });

  await t.test('debe permitir sobreescribir el teléfono de destino en caso de ser necesario', () => {
    const enlace = generarEnlaceWhatsApp({
      servicioId: 'sociales',
      adicionalesIds: [],
      datosContacto,
      telefonoDestino: '5491100000000'
    });

    assert.ok(enlace.startsWith('https://api.whatsapp.com/send?phone=5491100000000&text='));
  });
});
