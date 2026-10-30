# Especificación de Requerimientos (SDD): Asistente y Chatbot Web NEO Producciones

## 1. Visión General
El **Asistente Web de NEO Producciones** es un módulo interactivo accesible mediante un Botón Flotante de Acción (FAB) en el sitio web de NEO Producciones (`neo_producciones_tm`).
Se concibe de forma desacoplada del chatbot de Meta (Facebook/Instagram), implementado en su propia carpeta `servicios/chatbotWeb/` y servido mediante la función serverless independiente `netlify/functions/asistente-web.js`.

Su propósito es guiar al visitante en la calificación de su evento, presentar muestras fotográficas, brindar presupuestos orientativos interactivos, sugerir acciones en la página y derivar al prospecto a WhatsApp con Jorge con la ficha precargada.
Además, su arquitectura está diseñada con contratos desacoplados para admitir la integración transparente de un modelo de lenguaje grande (LLM / Gemini) en el futuro.

---

## 2. Casos de Uso y Criterios de Aceptación (Gherkin)

### CU-01: Apertura y saludo inicial desde el FAB
**Dado** que un usuario ingresa a la página web de NEO Producciones,
**Cuando** pulsa el FAB flotante del asistente,
**Entonces** se despliega el widget de chat con animación fluida,
**Y** el asistente muestra un saludo cálido en voseo rioplatense junto a botones de sugerencia rápida (chips) para guiar la conversación (ej: "Cotizar casamiento", "Ver portfolio", "Consultar por WhatsApp").

### CU-02: Consulta sin estado en el servidor (Stateless Request / Response)
**Dado** que el usuario envía un mensaje de texto o selecciona una opción rápida,
**Cuando** el frontend realiza una petición `POST` a `/.netlify/functions/asistente-web`,
**Entonces** el payload incluye el `textoMensaje`, el `historialMensajes` reciente y los `datosProspecto` acumulados en la sesión del cliente,
**Y** la función serverless responde en menos de 1000ms con el mensaje generado, nuevas opciones de sugerencia, el estado actualizado del prospecto y metadatos de acción de UI opcionales (`accionUi`).

### CU-03: Asistencia y acciones interactivas en la Web (`accionUi`)
**Dado** que el visitante pregunta por muestras de un evento (ej. "Quiero ver fotos de casamiento") o solicita presupuesto,
**Cuando** el orquestador web procesa la intención,
**Entonces** además del texto en voseo, la respuesta incluye una acción de interfaz (ej. `{ tipo: 'SCROLL_A_SECCION', destino: '#portfolio' }` o `#presupuesto`),
**Y** el frontend ofrece un botón interactivo para navegar directamente a la sección correspondiente del sitio web.

### CU-04: Derivación fluida a WhatsApp
**Dado** que el visitante completó los datos de su evento (rubro, zona/fecha estimada) o pide expresamente hablar con Jorge,
**Cuando** el asistente alcanza el paso `DERIVADO_WHATSAPP`,
**Entonces** genera un enlace directo a `https://wa.me/541140686925` con el mensaje estructurado que resume el tipo de evento y detalles consultados,
**Y** presenta un botón destacado para abrir WhatsApp Web o la app móvil en una pestaña nueva.

### CU-05: Estrategia de IA Preparada para Futuro LLM (Fallback Híbrido)
**Dado** el diseño del orquestador web en `servicios/chatbotWeb/`,
**Cuando** no existe variable de entorno para API de LLM (`GEMINI_API_KEY` o equivalente),
**Entonces** el servicio opera en modo heurístico determinista (reglas de clasificación y plantillas de respuesta a costo $0),
**Y** cuando se configure una clave de API, el orquestador podrá delegar la generación contextual en el proveedor LLM sin alterar los contratos del cliente ni la UI del widget.

---

## 3. Matriz de Escenarios Edge y Manejo de Errores
1. **Petición con payload corrupto o vacío**: La función serverless valida con Zod y devuelve `400 Bad Request` con mensaje descriptivo sin interrumpir el proceso.
2. **Caída de red o timeout**: El widget de chat muestra un mensaje amigable con opción de "Reintentar" o botón directo a WhatsApp.
3. **Persistencia de sesión**: Si el usuario recarga la página, el historial de la conversación se preserva en `sessionStorage` para no reiniciar el diálogo abruptamente.
