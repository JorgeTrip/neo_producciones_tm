/**
 * Componente Declarativo: Modal Acerca de y Visor de Changelog.
 * Muestra información del titular, copyright, versión y el historial de cambios CI/CD.
 */
import { crearElemento } from '../scripts/utilidadesDom.js';
import { obtenerInformacionVersion, obtenerHistorialCambios } from '../scripts/gestorVersion.js';

let modalBackdrop = null;
let cuerpoModal = null;
let tituloModal = null;

export function inicializarModalAcercaDe() {
  if (document.getElementById('modalAcercaDeBackdrop')) return;

  tituloModal = crearElemento('h3', { className: 'modal-acerca-titulo' }, ['Acerca de NEO Producciones']);
  const btnCerrar = crearElemento('button', {
    className: 'modal-acerca-cerrar',
    'aria-label': 'Cerrar ventana modal',
    onclick: cerrarModalAcercaDe
  }, ['×']);

  const cabecera = crearElemento('div', { className: 'modal-acerca-header' }, [tituloModal, btnCerrar]);
  cuerpoModal = crearElemento('div', { className: 'modal-acerca-cuerpo' });

  const tarjeta = crearElemento('div', { className: 'modal-acerca-tarjeta' }, [cabecera, cuerpoModal]);

  modalBackdrop = crearElemento('div', {
    id: 'modalAcercaDeBackdrop',
    className: 'modal-acerca-backdrop',
    onclick: (e) => { if (e.target === modalBackdrop) cerrarModalAcercaDe(); }
  }, [tarjeta]);

  document.body.appendChild(modalBackdrop);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('activo')) {
      cerrarModalAcercaDe();
    }
  });
}

export async function abrirModalAcercaDe() {
  inicializarModalAcercaDe();
  modalBackdrop.classList.add('activo');
  document.body.style.overflow = 'hidden';
  await renderizarVistaAcercaDe();
}

export function cerrarModalAcercaDe() {
  if (modalBackdrop) {
    modalBackdrop.classList.remove('activo');
    document.body.style.overflow = '';
  }
}

async function renderizarVistaAcercaDe() {
  tituloModal.textContent = 'Acerca de NEO Producciones';
  const info = await obtenerInformacionVersion();

  const vista = crearElemento('div', {}, [
    crearElemento('div', { style: { marginBottom: '1rem' } }, [
      crearElemento('h4', { style: { fontSize: '1.25rem', color: 'var(--gold)' } }, ['NEO Producciones™']),
      crearElemento('div', { className: 'modal-acerca-badge-version' }, [`Versión ${info.version}`])
    ]),
    crearElemento('p', { style: { marginBottom: '0.8rem' } }, [
      'Emprendimiento profesional de fotografía y producciones audiovisuales fundado en 2006, especializado en capturar eventos sociales, corporativos y recorridos interactivos 360° en Buenos Aires.'
    ]),
    crearElemento('p', { style: { color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.4rem' } }, [
      `Titular y Fotógrafo Principal: `,
      crearElemento('strong', { style: { color: 'var(--text)' } }, [info.autor])
    ]),
    crearElemento('p', { style: { color: 'var(--text-muted)', fontSize: '0.85rem' } }, [
      `© ${new Date().getFullYear()} NEO Producciones · Todos los derechos reservados.`
    ]),
    crearElemento('div', { className: 'modal-acerca-acciones' }, [
      crearElemento('button', {
        className: 'btn-secundario',
        onclick: renderizarVistaChangelog
      }, ['📜 Ver historial de cambios']),
      crearElemento('button', {
        className: 'btn-secundario',
        onclick: cerrarModalAcercaDe
      }, ['Cerrar'])
    ])
  ]);

  cuerpoModal.replaceChildren(vista);
}

async function renderizarVistaChangelog() {
  tituloModal.textContent = 'Historial de Cambios (Changelog)';

  // Skeleton screen inmediato (La Tríada de Jorge - Regla #4)
  const esqueleto = crearElemento('div', {}, [
    crearElemento('div', { className: 'skeleton-tarjeta' }),
    crearElemento('div', { className: 'skeleton-tarjeta' }),
    crearElemento('div', { className: 'skeleton-tarjeta' })
  ]);
  cuerpoModal.replaceChildren(esqueleto);

  // Ilusión de progreso elegante para sensación de solidez
  const [commits] = await Promise.all([
    obtenerHistorialCambios(),
    new Promise(resolver => setTimeout(resolver, 350))
  ]);

  const botonVolver = crearElemento('button', {
    className: 'btn-secundario',
    style: { marginBottom: '1rem' },
    onclick: renderizarVistaAcercaDe
  }, ['← Volver a Acerca de']);

  if (commits.length === 0) {
    const vacio = crearElemento('p', { style: { color: 'var(--text-muted)', fontSize: '0.9rem' } }, [
      'No se pudo recuperar el historial de cambios en este momento. La versión actual es 1.1.0.'
    ]);
    cuerpoModal.replaceChildren(botonVolver, vacio);
    return;
  }

  const contenedorLista = crearElemento('div', { className: 'lista-cambios' }, commits.map(c => {
    let prefijoVisual = '📌 ';
    if (c.tipo === 'feat') prefijoVisual = '🚀 ';
    else if (c.tipo === 'fix') prefijoVisual = '🔧 ';
    else if (c.tipo === 'refactor') prefijoVisual = '♻️ ';
    else if (c.tipo === 'breaking') prefijoVisual = '💥 ';

    return crearElemento('div', { className: 'item-cambio' }, [
      crearElemento('div', { className: 'item-cambio-cabecera' }, [
        crearElemento('span', { className: 'item-cambio-hash' }, [`#${c.hash}`]),
        crearElemento('span', {}, [c.fecha])
      ]),
      crearElemento('div', { className: 'item-cambio-msg' }, [`${prefijoVisual}${c.mensaje}`])
    ]);
  }));

  cuerpoModal.replaceChildren(botonVolver, contenedorLista);
}

if (typeof window !== 'undefined') {
  window.abrirModalAcercaDe = abrirModalAcercaDe;
  window.cerrarModalAcercaDe = cerrarModalAcercaDe;
}
