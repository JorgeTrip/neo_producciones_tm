/**
 * Orquestador de Componentes Visuales - NEO Producciones.
 * Vincula e inicializa cada submódulo declarativo en sus contenedores del DOM.
 */
import { renderizarSeccionNosotros } from '../componentes/SeccionNosotros.js';
import { renderizarSeccionServicios } from '../componentes/SeccionServicios.js';
import { renderizarSeccionEventos } from '../componentes/SeccionEventos.js';
import { renderizarSeccionProceso } from '../componentes/SeccionProceso.js';
import { renderizarSeccionPortafolio } from '../componentes/SeccionPortafolio.js';
import { renderizarSeccionCondiciones } from '../componentes/SeccionCondiciones.js';
import { renderizarSeccionContacto } from '../componentes/SeccionContacto.js';
import { inicializarAnimacionesScroll } from './animacionesScroll.js';

export function montarAplicacion() {
  renderizarSeccionNosotros(document.getElementById('nosotros'));
  renderizarSeccionServicios(document.getElementById('servicios'));
  renderizarSeccionEventos(document.getElementById('contenedor-eventos'));
  renderizarSeccionProceso(document.getElementById('proceso'));
  renderizarSeccionPortafolio(document.getElementById('portfolio'));
  renderizarSeccionCondiciones(document.getElementById('condiciones'));
  renderizarSeccionContacto(document.getElementById('contacto'));

  // Disparar las animaciones de scroll para los nuevos nodos generados
  inicializarAnimacionesScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', montarAplicacion);
} else {
  montarAplicacion();
}
