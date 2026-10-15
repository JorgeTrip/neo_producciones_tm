/**
 * Gestor de Esqueletos y Ciclo de Vida Multimedia - NEO Producciones.
 * Administra el estado visual de carga diferida (skeleton screens) en fotografías y videos,
 * asegurando que el esqueleto actúe como placeholder visual inicial antes de la revelación suave.
 */

/**
 * Configura el comportamiento de esqueleto y carga progresiva en un contenedor e imagen.
 * @param {HTMLElement|object} contenedor - Elemento envolvente de la tarjeta multimedia.
 * @param {HTMLImageElement|object} imagen - Elemento gráfico que se descarga de forma asíncrona.
 * @param {number} [retardoMinimoMs=250] - Tiempo mínimo en milisegundos para mostrar el placeholder.
 * @returns {void}
 */
export function configurarEsqueleto(contenedor, imagen, retardoMinimoMs = 250) {
  // Validación defensiva para evitar excepciones en caso de nodos nulos
  if (!contenedor || !imagen || !contenedor.classList || !imagen.classList) {
    return;
  }

  // Activar inmediatamente el estado de esqueleto como placeholder inicial
  contenedor.classList.add('esqueleto-activo');
  imagen.classList.add('img-cargando');

  const marcaInicio = Date.now();

  const revelarImagen = () => {
    contenedor.classList.remove('esqueleto-activo');
    imagen.classList.remove('img-cargando');
    imagen.classList.add('img-cargada');
  };

  const alCargar = () => {
    // Garantizar que el skeleton se aprecie como placeholder antes del fundido suave
    const tiempoTranscurrido = Date.now() - marcaInicio;
    const tiempoEspera = Math.max(0, retardoMinimoMs - tiempoTranscurrido);

    if (tiempoEspera > 0) {
      setTimeout(revelarImagen, tiempoEspera);
    } else {
      revelarImagen();
    }
  };

  const alFallar = () => {
    // Al ocurrir un error de red se remueve el skeleton para evitar que quede pulsando indefinidamente
    contenedor.classList.remove('esqueleto-activo');
    imagen.classList.remove('img-cargando');
    imagen.classList.add('img-fallida');
  };

  // Si la imagen ya se encuentra en caché de memoria, dar un tiempo de placeholder visible y revelar
  if (imagen.complete && imagen.naturalWidth !== 0) {
    alCargar();
  } else {
    imagen.addEventListener('load', alCargar, { once: true });
    imagen.addEventListener('error', alFallar, { once: true });
  }
}
