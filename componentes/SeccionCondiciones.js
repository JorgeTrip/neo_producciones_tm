/**
 * Componente Declarativo: Sección Condiciones de Contratación.
 * Expone las pautas de reserva, pago y entregas para clientes.
 */
import { crearElemento, crearElementoSvg } from '../scripts/utilidadesDom.js';

const CONDICIONES = [
  {
    titulo: 'Reserva y Pago',
    desc: 'Para confirmar tu fecha, se requiere un depósito del 50% del presupuesto total. El saldo restante debe abonarse antes de la entrega final del material editado.',
    delay: '',
    pathSvg: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75'
  },
  {
    titulo: 'Entrega del Material',
    desc: 'Todas las fotografías y videos seleccionados se entregan en alta resolución a través de un enlace seguro en Google Drive, listo para compartir o imprimir.',
    delay: 'reveal-delay-1',
    pathSvg: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
  },
  {
    titulo: 'Servicios Adicionales',
    desc: 'Ofrecemos opciones como alquiler de proyector, impresiones en diversos formatos, souvenirs personalizados y tiempo extra de cobertura durante el evento.',
    delay: 'reveal-delay-2',
    pathSvg: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
  }
];

export function renderizarSeccionCondiciones(contenedor) {
  if (!contenedor) return;

  const nodoContenido = crearElemento('div', { className: 'container' }, [
    crearElemento('div', { className: 'reveal', style: { maxWidth: '540px', marginBottom: '0.5rem' } }, [
      crearElemento('p', { className: 'section-label' }, ['Lo que debés saber']),
      crearElemento('h2', { className: 'section-title' }, [
        'Condiciones de',
        crearElemento('br'),
        crearElemento('span', { className: 'grad' }, ['Contratación'])
      ]),
      crearElemento('div', { className: 'divider' })
    ]),
    crearElemento('div', { className: 'condiciones-grid' }, CONDICIONES.map(c => (
      crearElemento('div', { className: `condicion-card reveal ${c.delay}`.trim() }, [
        crearElemento('div', { className: 'condicion-icon' }, [
          crearElementoSvg('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
            crearElementoSvg('path', { d: c.pathSvg })
          ])
        ]),
        crearElemento('h3', { className: 'condicion-title' }, [c.titulo]),
        crearElemento('p', { className: 'condicion-desc' }, [c.desc])
      ])
    )))
  ]);

  contenedor.replaceChildren(nodoContenido);
}
