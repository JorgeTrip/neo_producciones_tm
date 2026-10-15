/**
 * Gestor de Esqueletos y Ciclo de Vida Multimedia - NEO Producciones.
 * Administra el estado visual de carga diferida (skeleton screens) en fotografías y videos,
 * asegurando transiciones suaves (fade-in) y evitando parpadeos de interfaz.
 */

/**
 * Configura el comportamiento de esqueleto y carga progresiva en un contenedor e imagen.
 * @param {HTMLElement|object} contenedor - Elemento envolvente de la tarjeta multimedia.
 * @param {HTMLImageElement|object} imagen - Elemento gráfico que se descarga de forma asíncrona.
 * @returns {void}
 */
export function configurarEsqueleto(contenedor, imagen) {
  // Validación defensiva para evitar excepciones en caso de nodos nulos
  if (!contenedor || !imagen || !contenedor.classList || !imagen.classList) {
    return;
  }

  const alCargar = () => {
    contenedor.classList.remove('esqueleto-activo');
    imagen.classList.remove('img-cargando');
    imagen.classList.add('img-cargada');
  };

  const alFallar = () => {
    // Al ocurrir un error de red se remueve el skeleton para evitar que quede pulsando indefinidamente
    contenedor.classList.remove('esqueleto-activo');
    imagen.classList.remove('img-cargando');
    imagen.classList.add('img-fallida');
  };

  // Si la imagen ya se encuentra completamente cargada en caché del navegador
  if (imagen.complete && imagen.naturalWidth !== 0) {
    alCargar();
    return;
  }

  // Activar estado de esqueleto previo a la finalización de la carga
  contenedor.classList.add('esqueleto-activo');
  imagen.classList.add('img-cargando');

  imagen.addEventListener('load', alCargar, { once: true });
  imagen.addEventListener('error', alFallar, { once: true });
}
