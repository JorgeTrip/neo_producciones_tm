import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calcularTamanoFuenteDinamico, ajustarTamanoTituloHero } from '../scripts/ajustadorTituloHero.js';

describe('Ajustador Dinámico de Título Hero - Ciclo TDD', () => {
  it('debe calcular el tamaño de fuente proporcional al ancho libre móvil', () => {
    // Para un ancho libre de 320px
    const tamano320 = calcularTamanoFuenteDinamico({ anchoLibre: 320 });
    assert.ok(tamano320 >= 38 && tamano320 <= 44, `Esperado ~41px, obtenido ${tamano320}`);

    // Para un ancho libre de 380px debe ser mayor que para 320px
    const tamano380 = calcularTamanoFuenteDinamico({ anchoLibre: 380 });
    assert.ok(tamano380 > tamano320, 'El tamaño debe escalar al crecer el ancho libre');
  });

  it('debe respetar los límites mínimo y máximo configurados', () => {
    const tamanoMuyPequeno = calcularTamanoFuenteDinamico({ anchoLibre: 50, minimo: 22 });
    assert.equal(tamanoMuyPequeno, 22);

    const tamanoMuyGrande = calcularTamanoFuenteDinamico({ anchoLibre: 1000, maximo: 56 });
    assert.equal(tamanoMuyGrande, 56);
  });

  it('no debe intervenir el estilo en pantallas de escritorio (> 768px)', () => {
    const elementoSimulado = { style: { fontSize: '40px' } };
    const contenedorSimulado = { clientWidth: 1024 };

    const resultado = ajustarTamanoTituloHero(elementoSimulado, contenedorSimulado, 1024);
    assert.equal(resultado, null);
    assert.equal(elementoSimulado.style.fontSize, '', 'Debe limpiar fontSize inline en desktop');
  });

  it('debe aplicar fontSize dinámico en pantallas móviles (<= 768px)', () => {
    const elementoSimulado = { style: { fontSize: '' }, scrollWidth: 280 };
    const contenedorSimulado = { clientWidth: 360 };

    const resultado = ajustarTamanoTituloHero(elementoSimulado, contenedorSimulado, 360);
    assert.ok(typeof resultado === 'number');
    assert.ok(resultado > 20);
    assert.equal(elementoSimulado.style.fontSize, `${resultado}px`);
  });
});
