# Arquitectura C4: Chatbot de Captación NEO Producciones

## Nivel 1: Diagrama de Contexto del Sistema
Delimita los actores humanos, el sistema y los servicios externos involucrados.

```mermaid
flowchart TD
    Cliente([Prospecto / Cliente])
    Jorge([Jorge - Fotógrafo])
    
    subgraph SistemaNEO [Sistema Chatbot de Captación NEO]
        CoreBot[Módulo Automatizado de Mensajería y Calificación]
    end
    
    MetaAPI[Meta Graph API - Instagram & Facebook]
    WebNEO[Web NEO Producciones - Portfolio y Presupuesto]
    WhatsApp[WhatsApp API / Enlace wa.me]
    
    Cliente <-->|Envía DM / Toca Anuncio / Recibe Muestras| MetaAPI
    MetaAPI <-->|Consulta mensajes y despacha respuestas| CoreBot
    CoreBot -->|Envía links a #portfolio y #presupuesto| WebNEO
    CoreBot -->|Deriva lead calificado con ficha completa| WhatsApp
    WhatsApp -->|Recibe contacto y agenda llamada de 5 min| Jorge
```

---

## Nivel 2: Diagrama de Contenedores
Estructura de ejecución y almacenamiento del sistema en `instagram_auto`.

```mermaid
flowchart TD
    subgraph HostLocal [Entorno Local Node.js - instagram_auto]
        ServidorApp["Contenedor de Ejecución<br>(Node.js ES Modules)"]
        RepositorioEstado["Almacén de Conversaciones<br>(Persistencia JSON / Memoria)"]
    end
    
    MetaPlatform["Meta Graph API (v26.0)<br>Endpoints: /media, /conversations, /messages"]
    
    ServidorApp <-->|Consulta nuevos hilos y envía mensajes| MetaPlatform
    ServidorApp <-->|Lee y actualiza estado de leads y pausa humana| RepositorioEstado
```

---

## Nivel 3: Diagrama de Componentes (Clean Architecture)
Separación estricta en capas con dirección unidireccional de dependencias hacia el Dominio.

```mermaid
flowchart TD
    subgraph Presentacion [Capa Presentación - src/presentacion]
        McpServer[Servidor MCP / Tarea de Automatización]
    end

    subgraph Aplicacion [Capa Aplicación - src/aplicacion]
        Orquestador[OrquestadorChatbotServicio]
        DetectorIntencion[DetectorIntencionServicio]
        GeneradorRespuestas[GeneradorRespuestasServicio]
    end

    subgraph Dominio [Capa Dominio Pura - src/dominio]
        ConversacionEntidad[Entidad Conversacion]
        ProspectoEntidad[Entidad Prospecto]
        ClasificadorRubro[Regla ClasificadorRubro]
        AntiBucle[Regla DetectorRepeticionBucle]
        CatalogoMuestras[Catalogo Muestras y Textos]
    end

    subgraph Infraestructura [Capa Infraestructura - src/infraestructura]
        ClienteMeta[ClienteMetaGraphApi]
        RepositorioLocal[RepositorioConversacionesLocal]
    end

    McpServer --> Orquestador
    Orquestador --> DetectorIntencion
    Orquestador --> GeneradorRespuestas
    Orquestador --> ClienteMeta
    Orquestador --> RepositorioLocal
    
    Orquestador --> ConversacionEntidad
    DetectorIntencion --> ClasificadorRubro
    DetectorIntencion --> AntiBucle
    GeneradorRespuestas --> CatalogoMuestras
```

---

## Nivel 4: Código y Contratos de Clases

### 1. Dominio Puro (`src/dominio/`) - Cero dependencias externas
* `clasificadorRubro.js`: Identifica si el texto/evento es `sociales`, `corporativos`, `sesiones` o `comercial` (inmuebles).
* `detectorRepeticionBucle.js`: Evalúa si un botón fue presionado repetidamente en una ventana de 15 segundos.
* `conversacion.js`: Maneja la máquina de estados del embudo y la bandera `pausaHumanaHasta`.
* `catalogoMuestras.js`: Asocia cada rubro con sus 2 imágenes destacadas y sus textos en voseo.

### 2. Aplicación (`src/aplicacion/`)
* `orquestadorChatbotServicio.js`: Recibe los hilos de Facebook e Instagram, filtra mensajes nuevos, detecta intervención de Jorge, evalúa el estado y envía la respuesta correspondiente vía `ClienteMetaGraphApi`.
* `esquemasValidacionChatbot.js`: Esquemas Zod para validar cargas útiles de mensajes y parámetros.

### 3. Infraestructura (`src/infraestructura/`)
* `clienteMetaGraphApi.js`: Extendido con los métodos `obtenerConversacionesBandeja(plataforma)` y `enviarMensajeRespuesta(hiloId, texto, urlsAdjuntos)`.
* `repositorioConversacionesLocal.js`: Guarda el histórico de leads calificados y marcas de tiempo de intervención humana en `.datos/conversaciones.json`.
