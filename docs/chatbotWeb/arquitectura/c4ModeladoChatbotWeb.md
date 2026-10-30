# Arquitectura C4: Asistente y Chatbot Web NEO Producciones

## Nivel 1: Contexto del Sistema
Delimita los actores humanos, el sistema web y las integraciones externas.

```mermaid
flowchart TD
    Visitante([Visitante Web / Prospecto])
    Jorge([Jorge - Fotógrafo])
    
    subgraph SistemaWebNEO [Sitio Web NEO Producciones]
        WidgetChat[Widget FAB y Drawer de Asistente]
        Landing[Landing Page - Portafolio y Presupuesto]
    end

    subgraph BackendServerless [Netlify Serverless]
        FuncionAsistente[Netlify Function: asistente-web.js]
        ProveedorLLM[(Futuro Proveedor LLM - Gemini/OpenAI)]
    end

    WhatsApp[WhatsApp - wa.me]

    Visitante <-->|Interactúa mediante FAB y Chat| WidgetChat
    WidgetChat -->|Navega o hace scroll interactivo| Landing
    WidgetChat <-->|Peticiones HTTP POST JSON stateless| FuncionAsistente
    FuncionAsistente -.->|Consultas de lenguaje natural| ProveedorLLM
    WidgetChat -->|Deriva prospecto calificado| WhatsApp
    WhatsApp -->|Recibe contacto con ficha armada| Jorge
```

---

## Nivel 2: Contenedores
Estructura de ejecución y despliegue del asistente web en Netlify.

```mermaid
flowchart TD
    subgraph ClienteNavegador [Frontend SPA - Vanilla JS]
        FAB[BotonFlotanteAsistente.js]
        Drawer[VentanaChatAsistente.js]
        AlmacenSesion[(sessionStorage: Historial y Estado)]
    end

    subgraph PlataformaNetlify [Netlify Serverless Infrastructure]
        EndpointWeb["Endpoint: /.netlify/functions/asistente-web"]
        ModuloServicios["Capa de Servicios: servicios/chatbotWeb/"]
    end

    FAB <-->|Abre / Cierra| Drawer
    Drawer <-->|Persiste estado efímero| AlmacenSesion
    Drawer <-->|POST JSON { mensaje, historial, prospecto }| EndpointWeb
    EndpointWeb -->|Invoca| ModuloServicios
```

---

## Nivel 3: Componentes (Clean Architecture en servicios/chatbotWeb/)

```mermaid
flowchart TD
    subgraph InfraNetlify [Netlify Function Handler]
        Handler[asistente-web.js]
    end

    subgraph CapaAplicacion [Capa Aplicación - servicios/chatbotWeb/aplicacion]
        OrquestadorWeb[OrquestadorChatbotWebServicio]
        EsquemaValidador[ValidadorPayloadWeb]
    end

    subgraph CapaDominio [Capa Dominio Pura - servicios/chatbotWeb/dominio]
        Clasificador[ClasificadorIntencionWeb]
        Generador[GeneradorRespuestasWeb]
        Catalogo[CatalogoSugerenciasYAcciones]
    end

    Handler --> EsquemaValidador
    Handler --> OrquestadorWeb
    OrquestadorWeb --> Clasificador
    OrquestadorWeb --> Generador
    Generador --> Catalogo
```

---

## Nivel 4: Código y Contratos

### 1. Contrato de Entrada (POST a `/.netlify/functions/asistente-web`)
```json
{
  "textoMensaje": "Hola, cuánto sale un casamiento?",
  "historial": [
    { "rol": "asistente", "texto": "¡Hola! ¿Qué evento estás planeando?" }
  ],
  "prospecto": {
    "rubro": "",
    "subTipo": "",
    "fechaEstimada": "",
    "zonaSalon": ""
  }
}
```

### 2. Contrato de Salida (Respuesta JSON)
```json
{
  "texto": "¡Hola! Para casamientos tenemos coberturas completas...",
  "sugerencias": ["Ver fotos de casamientos", "Calcular presupuesto", "Hablar por WhatsApp"],
  "prospecto": {
    "rubro": "sociales",
    "subTipo": "casamiento"
  },
  "accionUi": {
    "tipo": "SCROLL_A_SECCION",
    "destino": "#presupuesto"
  }
}
```
