/**
 * @fileoverview Regla pura de dominio: Clasifica el mensaje o evento del usuario en los rubros del catálogo
 * y extrae datos clave de fecha y zona/salón.
 */

const PATRONES_RUBRO = [
  {
    rubro: 'comercial',
    subTipo: 'inmueble',
    esInmueble: true,
    expresiones: [
      /\b(inmueble|inmobiliari[ao]|departamento|depto|casa|arquitectur[ao]|local|propiedad|alquiler temporal|airbnb)\b/i
    ]
  },
  {
    rubro: 'sociales',
    subTipo: 'civil',
    esInmueble: false,
    expresiones: [/\bcivil\b/i]
  },
  {
    rubro: 'sociales',
    subTipo: 'casamiento',
    esInmueble: false,
    expresiones: [/\b(casamiento|boda|matrimonio|novi[ao]s|alianzas|casar\w*|me\s+caso|nos\s+casamos)\b/i]
  },
  {
    rubro: 'sociales',
    subTipo: 'quince',
    esInmueble: false,
    expresiones: [/\b(15\s*a[ñn]os|quince|quincea[ñn]era)\b/i]
  },
  {
    rubro: 'sociales',
    subTipo: 'bar_mitzvah',
    esInmueble: false,
    expresiones: [/\b(bar\s*mitzv[aá]|bat\s*mitzv[aá])\b/i]
  },
  {
    rubro: 'sociales',
    subTipo: 'bautismo_infantil',
    esInmueble: false,
    expresiones: [/\b(bautismo|bautizo|primer\s*a[ñn]ito|1er\s*a[ñn]ito|1\s*a[ñn]ito|comuni[oó]n|confirmaci[oó]n)\b/i]
  },
  {
    rubro: 'corporativos',
    subTipo: 'corporativo',
    esInmueble: false,
    expresiones: [/\b(corporativ[ao]|congreso|conferencia|jornada|empresa|institucional|networking)\b/i]
  },
  {
    rubro: 'sesiones',
    subTipo: 'sesion_book',
    esInmueble: false,
    expresiones: [/\b(book|sesi[oó]n|pre-boda|preboda|retrato)\b/i]
  }
];

/**
 * Clasifica el texto de una consulta en un rubro formal de dominio.
 * @param {string} textoMensaje
 * @returns {{ rubro: string, subTipo: string, esInmueble: boolean }}
 */
export function clasificarRubro(textoMensaje = '') {
  const normalizado = typeof textoMensaje === 'string' ? textoMensaje.toLowerCase().trim() : '';

  for (const patron of PATRONES_RUBRO) {
    for (const exp of patron.expresiones) {
      if (exp.test(normalizado)) {
        return {
          rubro: patron.rubro,
          subTipo: patron.subTipo,
          esInmueble: patron.esInmueble
        };
      }
    }
  }

  return {
    rubro: 'desconocido',
    subTipo: 'general',
    esInmueble: false
  };
}

/**
 * Extrae posibles fechas y zonas a partir del texto ingresado por el usuario.
 * @param {string} textoMensaje
 * @returns {{ fechaEstimada: string, zonaSalon: string }}
 */
export function extraerDatosMensaje(textoMensaje = '') {
  const texto = typeof textoMensaje === 'string' ? textoMensaje.trim() : '';
  let fechaEstimada = '';
  let zonaSalon = '';

  // Patrón para fechas (numéricas como 30/10 o en texto como '15 de noviembre')
  const matchFecha = texto.match(/\b(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?|\d{1,2}\s+de\s+[a-zA-ZáéíóúñÁÉÍÓÚÑ]+(?:\s+de\s+\d{2,4})?)\b/i);
  if (matchFecha) {
    fechaEstimada = matchFecha[1].trim();
  }

  // Patrón para zona/salón ("en [Lugar]")
  const matchZona = texto.match(/\ben\s+([^,.;\n]+)/i);
  if (matchZona) {
    zonaSalon = matchZona[1].trim();
  }

  return { fechaEstimada, zonaSalon };
}

/**
 * Detecta la intención comunicativa predominante en el mensaje del usuario.
 * @param {string} textoMensaje
 * @returns {{ esSaludo: boolean, pidePresupuesto: boolean, pideMuestras: boolean, pideContactoOCierre: boolean }}
 */
export function detectarIntencion(textoMensaje = '') {
  const texto = typeof textoMensaje === 'string' ? textoMensaje.toLowerCase().trim() : '';

  // Saludo simple (sin contenido adicional de evento)
  const esSaludo = /^(hola|buenas|buen d[ií]a|buenas tardes|buenas noches|hola qu[eé] tal|qu[eé] tal|c[oó]mo est[aá]s?)[\s!.,?]*$/i.test(texto);

  const pidePresupuesto = /\b(precio|precios|costo|costos|cu[aá]nto sale|cu[aá]nto est[aá]|cu[aá]nto cobran|paquete|paquetes|tarifa|tarifas|presupuesto|cotizaci[oó]n|valor)\b/i.test(texto);

  const pideMuestras = /\b(muestras?|ejemplos?|portfolio|fotos?|trabajos?|galer[ií]a|ver fotos|trabajo previo)\b/i.test(texto);

  const pideContactoOCierre = /\b(llamada|llamar|tel[eé]fono|hablar|coordinar|whatsapp|wsp|reuni[oó]n|agenda|disponibilidad|reservar|contratar|cerrar)\b/i.test(texto);

  return {
    esSaludo,
    pidePresupuesto,
    pideMuestras,
    pideContactoOCierre
  };
}
