/**
 * Punto de entrada para las páginas legales (privacidad.html y terminos.html).
 * Activa el retorno exacto hacia la ubicación previa del usuario en el sitio principal.
 */
import { inicializarRetornoLegal } from './retornoLegal.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarRetornoLegal);
} else {
  inicializarRetornoLegal();
}
