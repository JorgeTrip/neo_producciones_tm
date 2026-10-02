/**
 * Utilidades de Manipulación Segura del DOM - NEO Producciones.
 * Proporciona funciones puras para crear elementos HTML sin incurrir en
 * riesgos de inyección estática (SEC-004).
 */

/**
 * Crea un elemento del DOM con atributos y nodos hijos de forma segura.
 * @param {string} etiqueta - Nombre de la etiqueta HTML (ej. 'div', 'img').
 * @param {Record<string, string>} [atributos] - Mapa de atributos clave-valor.
 * @param {Array<HTMLElement | string>} [hijos] - Elementos o textos secundarios.
 * @returns {HTMLElement} El elemento HTML generado.
 */
export function crearElemento(etiqueta, atributos = {}, hijos = []) {
  const el = document.createElement(etiqueta);

  for (const [clave, valor] of Object.entries(atributos)) {
    if (clave === 'className') {
      el.className = valor;
    } else if (clave === 'style' && typeof valor === 'object') {
      Object.assign(el.style, valor);
    } else if (clave.startsWith('on') && typeof valor === 'function') {
      el.addEventListener(clave.substring(2).toLowerCase(), valor);
    } else {
      el.setAttribute(clave, valor);
    }
  }

  for (const hijo of hijos) {
    if (typeof hijo === 'string') {
      el.appendChild(document.createTextNode(hijo));
    } else if (hijo instanceof Node) {
      el.appendChild(hijo);
    }
  }

  return el;
}

/**
 * Crea un elemento SVG con el espacio de nombres adecuado.
 * @param {string} etiqueta - Nombre de la etiqueta SVG (ej. 'svg', 'path').
 * @param {Record<string, string>} [atributos] - Atributos SVG.
 * @param {Array<SVGElement>} [hijos] - Nodos SVG hijos.
 * @returns {SVGElement}
 */
export function crearElementoSvg(etiqueta, atributos = {}, hijos = []) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', etiqueta);
  for (const [clave, valor] of Object.entries(atributos)) {
    el.setAttribute(clave, valor);
  }
  for (const hijo of hijos) {
    if (hijo instanceof Node) el.appendChild(hijo);
  }
  return el;
}
