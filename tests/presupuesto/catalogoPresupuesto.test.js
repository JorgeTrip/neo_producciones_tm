import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SERVICIOS_BASE,
  ADICIONALES_PRESUPUESTO,
  obtenerServicioBase,
  obtenerAdicional,
  listarServiciosBase,
  listarAdicionales
} from '../../scripts/dominio/catalogoPresupuesto.js';

test('Catálogo de Presupuesto - Inmutabilidad y Contratos', async (t) => {
  await t.test('debe contener los 4 servicios base obligatorios', () => {
    const servicios = listarServiciosBase();
    assert.equal(servicios.length, 4);
    assert.ok(SERVICIOS_BASE.sociales);
    assert.ok(SERVICIOS_BASE.corporativos);
    assert.ok(SERVICIOS_BASE.sesiones);
    assert.ok(SERVICIOS_BASE.comercial);
  });

  await t.test('debe contener los 10 adicionales definidos en la especificación y no contener los removidos', () => {
    const adicionales = listarAdicionales();
    assert.equal(adicionales.length, 10);
    const ids = adicionales.map((a) => a.id);
    assert.ok(ids.includes('sesion_previa'));
    assert.ok(ids.includes('video_homenaje'));
    assert.ok(ids.includes('cobertura_video'));
    assert.ok(ids.includes('fotolibro'));
    assert.ok(ids.includes('cuaderno_firmas'));
    assert.ok(ids.includes('foto_mural'));
    assert.ok(ids.includes('foto_souvenirs'));
    assert.ok(ids.includes('invitaciones_animadas'));
    assert.ok(ids.includes('panoramica_360'));
    assert.ok(ids.includes('entrega_expres'));
    // Verificar que los removidos no existan
    assert.equal(ids.includes('segundo_fotografo'), false);
    assert.equal(ids.includes('drone'), false);
  });

  await t.test('debe recuperar un servicio base por id o null si no existe', () => {
    const social = obtenerServicioBase('sociales');
    assert.equal(social.id, 'sociales');
    assert.equal(social.titulo, 'Eventos Sociales');

    const inexistente = obtenerServicioBase('inexistente');
    assert.equal(inexistente, null);
  });

  await t.test('debe recuperar un adicional por id o null si no existe', () => {
    const fotoMural = obtenerAdicional('foto_mural');
    assert.equal(fotoMural.id, 'foto_mural');
    assert.equal(fotoMural.titulo, 'Foto-Mural de Bienvenida');

    const inexistente = obtenerAdicional('drone');
    assert.equal(inexistente, null);
  });

  await t.test('el catálogo debe ser inmutable (Object.freeze)', () => {
    assert.throws(() => {
      SERVICIOS_BASE.nuevo = { id: 'hack' };
    });
    assert.throws(() => {
      ADICIONALES_PRESUPUESTO.nuevo = { id: 'hack' };
    });
  });
});
