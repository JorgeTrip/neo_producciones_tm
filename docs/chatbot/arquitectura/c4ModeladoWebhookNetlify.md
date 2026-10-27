# Arquitectura C4: Webhook Netlify y Simulador de Pruebas

## Nivel 1: Contexto de Despliegue en la Nube
El sistema opera 24/7 en la infraestructura serverless de Netlify sin depender de la PC encendida.

```mermaid
flowchart TD
    Cliente([Cliente en Instagram / Facebook])
    Jorge([Jorge - Fotógrafo])
    
    subgraph MetaCloud [Infraestructura de Meta]
        MessengerAPI[Meta Graph API & Webhooks]
    end
    
    subgraph NetlifyPlatform [Plataforma Netlify - neoproduccionestm]
        WebhookFn["Netlify Function 24/7<br>(webhook-meta.js)"]
    end
    
    subgraph EntornoLocal [PC Local de Jorge]
        SimuladorLocal["Simulador Sandbox de Pruebas<br>(simularChat.mjs)"]
    end
    
    Cliente <-->|Chatea en IG / FB| MessengerAPI
    MessengerAPI <-->|Petición POST en tiempo real| WebhookFn
    WebhookFn -->|Deriva lead a WhatsApp con ficha armada| Jorge
    Jorge <-->|Prueba diálogos de forma aislada sin internet| SimuladorLocal
```

---

## Nivel 2: Contenedores y Componentes del Webhook
Estructura modular del endpoint en `netlify/functions/webhook-meta.js`.

```mermaid
flowchart TD
    RequestHTTP[Petición HTTP Entrante] --> Router{Método HTTP}
    
    Router -- GET --> ValidadorHandshake[ValidadorHandshakeMeta]
    ValidadorHandshake --> ResponseChallenge[Retorna hub.challenge]
    
    Router -- POST --> AdaptadorPayload[AdaptadorPayloadWebhook]
    AdaptadorPayload --> Orquestador[OrquestadorChatbotServicio]
    Orquestador --> Despachador[ClienteMensajeriaMeta]
    Despachador --> MetaAPI[Envío de Respuesta a Meta]
    AdaptadorPayload --> ResponseOK[Retorna HTTP 200]
```

---

## Nivel 3: Componentes y Contratos de Código

1. **`src/aplicacion/adaptadorWebhookMeta.js`**:
   - `verificarSuscripcion(queryParams, tokenEsperado)`: Valida `hub.mode` y `hub.verify_token`.
   - `extraerMensajesEntrantes(payload)`: Normaliza el JSON complejo de Meta a una estructura limpia `{ emisorId, receptorId, texto, marcaTiempo, canal }`.

2. **`netlify/functions/webhook-meta.js`**:
   - Función serverless estándar de Netlify (`export default async (req, context) => ...`).
   - Responde inmediatamente para cumplir el SLA de Meta (< 3 segundos).

3. **`scripts/simularChat.mjs`**:
   - Arnés interactivo de terminal para simular prospectos, botones FAQ, clics repetidos y pausa humana.
