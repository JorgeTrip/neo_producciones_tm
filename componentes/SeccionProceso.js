/**
 * Componente Declarativo: Sección Proceso de Trabajo.
 * Presenta el flujo secuencial de 4 pasos de contratación y entrega.
 */
import { crearElemento } from '../scripts/utilidadesDom.js';

const PASOS = [
  { num: '01', titulo: 'Consulta Inicial', desc: 'Conversamos sobre tus necesidades específicas y diseñamos un servicio personalizado para tu evento o proyecto fotográfico.', delay: '' },
  { num: '02', titulo: 'Planificación', desc: 'Definimos fechas para sesiones previas, coordinamos detalles técnicos y establecemos un cronograma claro para cada etapa del servicio.', delay: 'reveal-delay-1' },
  { num: '03', titulo: 'Ejecución', desc: 'Realizamos las sesiones previas, preparamos los materiales audiovisuales y garantizamos una cobertura profesional durante el evento.', delay: 'reveal-delay-2' },
  { num: '04', titulo: 'Entrega', desc: 'Seleccionamos y editamos el material. Entrega segura a través de Google Drive para fácil acceso y distribución.', delay: 'reveal-delay-3' }
];

export function renderizarSeccionProceso(contenedor) {
  if (!contenedor) return;

  const nodoContenido = crearElemento('div', { className: 'container' }, [
    crearElemento('div', { className: 'reveal', style: { maxWidth: '580px', marginBottom: '3rem' } }, [
      crearElemento('p', { className: 'section-label' }, ['Cómo trabajamos']),
      crearElemento('h2', { className: 'section-title' }, [
        'Proceso de',
        crearElemento('br'),
        crearElemento('span', { className: 'grad' }, ['Trabajo'])
      ]),
      crearElemento('div', { className: 'divider' })
    ]),
    crearElemento('div', { className: 'proceso-steps' }, PASOS.map(p => (
      crearElemento('div', { className: `proceso-step reveal ${p.delay}`.trim() }, [
        crearElemento('div', { className: 'proceso-step-num' }, [p.num]),
        crearElemento('h3', { className: 'proceso-step-title' }, [p.titulo]),
        crearElemento('p', { className: 'proceso-step-desc' }, [p.desc])
      ])
    )))
  ]);

  contenedor.replaceChildren(nodoContenido);
}
