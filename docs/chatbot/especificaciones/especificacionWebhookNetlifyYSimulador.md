# Especificación Funcional: Adaptador Webhook Netlify y Simulador Sandbox

## 1. Propósito
Especificar el contrato de integración serverless para desplegar el Chatbot de NEO Producciones en Netlify Functions (`/.netlify/functions/webhook-meta`) y el simulador interactivo de consola para pruebas previas seguras sin tráfico real.

---

## 2. Contrato Técnico del Webhook Meta (Netlify Function)

### A. Verificación de Handshake (GET)
* **Endpoint:** `GET /.netlify/functions/webhook-meta`
* **Query Params:**
  - `hub.mode`: Debe ser `'subscribe'`.
  - `hub.verify_token`: Debe coincidir con `WEBHOOK_VERIFY_TOKEN` (definido en variables de entorno).
  - `hub.challenge`: Cadena aleatoria enviada por Meta.
* **Respuesta Exitosa:** HTTP 200 con cuerpo de texto plano igual a `hub.challenge`.
* **Respuesta Fallida:** HTTP 403 Forbidden ante token inválido o modo incorrecto.

### B. Recepción de Mensajes (POST)
* **Endpoint:** `POST /.netlify/functions/webhook-meta`
* **Cuerpo:** Payload estándar de eventos de mensajería de Meta (`object: 'page'` o `'instagram'`).
* **Comportamiento:**
  1. Extrae los mensajes entrantes (`entry[].messaging[]`).
  2. Descarta mensajes emitidos por la propia página o cuenta.
  3. Procesa cada mensaje con `OrquestadorChatbotServicio`.
  4. Despacha la respuesta mediante `ClienteMensajeriaMeta`.
  5. Retorna HTTP 200 `{ status: 'EVENT_RECEIVED' }` en < 3 segundos.

---

## 3. Criterios de Aceptación Gherkin

### Escenario 1: Validación Exitosa del Reto de Verificación
* **Dado** que Meta envía una petición GET con `hub.mode=subscribe` y `hub.verify_token` correcto,
* **Cuando** la función de Netlify procesa la consulta,
* **Entonces** responde con código HTTP 200 y el texto de `hub.challenge`.

### Escenario 2: Rechazo de Verificación por Token Incorrecto
* **Dado** que llega una petición GET con un `hub.verify_token` inválido,
* **Cuando** la función evalúa la autenticidad,
* **Entonces** responde con HTTP 403 Forbidden y mensaje de rechazo.

### Escenario 3: Recepción y Respuesta de Mensaje Entrante en Netlify
* **Dado** que un usuario envía un mensaje a través de Facebook o Instagram,
* **Cuando** Meta despacha el payload POST al webhook de Netlify,
* **Entonces** la función ejecuta el flujo de calificación, despacha la respuesta con fotos y retorna HTTP 200.

### Escenario 4: Simulación Interactiva Segura en Consola
* **Dado** que Jorge ejecuta el script de simulación local,
* **Cuando** ingresa mensajes o comandos de prueba,
* **Entonces** el simulador procesa el flujo en memoria sin realizar llamadas a clientes reales ni a Meta.
