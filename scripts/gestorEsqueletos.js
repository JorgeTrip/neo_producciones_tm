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

/**
 * Activa la carga diferida de imágenes y skeletons en una fila del portafolio.
 * Transfiere el atributo data-src a src e inicia el ciclo de vida del placeholder.
 * @param {HTMLElement|object} contenedorFila - Contenedor de la fila (.gallery-row o .video-row).
 * @param {object} [opciones] - Opciones de configuración de tiempos.
 * @param {number} [opciones.retardoBaseMs=250] - Tiempo base de placeholder.
 * @param {number} [opciones.desfaseColumnaMs=60] - Retardo incremental por cada columna.
 * @returns {void}
 */
export function activarCargaFila(contenedorFila, opciones = {}) {
  if (!contenedorFila || typeof contenedorFila.querySelectorAll !== 'function') {
    return;
  }

  const { retardoBaseMs = 250, desfaseColumnaMs = 60 } = opciones;
  const imagenesPendientes = contenedorFila.querySelectorAll('img[data-src]');

  imagenesPendientes.forEach((imagen, indice) => {
    const rutaOrigen = imagen.getAttribute('data-src');
    if (!rutaOrigen) return;

    imagen.removeAttribute('data-src');

    // Encontrar el contenedor de la tarjeta multimedia
    const contenedorTarjeta = (typeof imagen.closest === 'function' && imagen.closest('.gallery-item, .video-thumb'))
      || imagen.parentElement
      || contenedorFila;

    const retardoFila = retardoBaseMs + (indice * desfaseColumnaMs);

    // Asignar el origen e iniciar el ciclo de vida del esqueleto
    imagen.src = rutaOrigen;
    configurarEsqueleto(contenedorTarjeta, imagen, retardoFila);
  });
}
