# Arquitectura C4: Sistema de Skeletons y Portafolio Multimedia

**Proyecto**: NEO Producciones  
**Módulo**: Portafolio Multimedia & Skeletons de Carga  
**Fecha**: 2026-10-15  

---

## Nivel 1: Contexto del Sistema

```mermaid
flowchart TD
    Usuario["Visitante / Cliente Potencial"] -->|Navega en la web| WebNeo["Sitio Web NEO Producciones"]
    WebNeo -->|Consume miniaturas y videos| CDN["CDNs Externos (Vimeo / YouTube)"]
    WebNeo -->|Carga activos locales| ServidorEstatico["Servidor Web Local / Netlify"]
```

---

## Nivel 2: Contenedores

```mermaid
flowchart TD
    Navegador["Navegador Web (Cliente)"]
    subgraph SPA_Vanilla["Aplicación Web Estática Modular"]
        DOM["Árbol DOM HTML5"]
        ModuloEstilos["Hojas de Estilo CSS (@import)"]
        ModuloScripts["Módulos ES6 (JavaScript)"]
    end
    Navegador --> SPA_Vanilla
```

---

## Nivel 3: Componentes

```mermaid
flowchart TD
    subgraph CapaPresentacion["Capa de Presentación"]
        SeccionPortafolio["componentes/SeccionPortafolio.js"]
        PortafolioCSS["estilos/portafolio.css"]
    end

    subgraph CapaLogica["Capa de Lógica y Utilidades"]
        GestorEsqueletos["scripts/gestorEsqueletos.js (Nuevo)"]
        UtilidadesDom["scripts/utilidadesDom.js"]
    end

    subgraph CapaDatos["Capa de Datos"]
        DatosPortafolio["scripts/datosPortafolio.js"]
    end

    SeccionPortafolio -->|Solicita datos| DatosPortafolio
    SeccionPortafolio -->|Crea nodos DOM seguros| UtilidadesDom
    SeccionPortafolio -->|Aplica ciclo de carga y eventos| GestorEsqueletos
    GestorEsqueletos -.->|Activa / remueve clases CSS| PortafolioCSS
```

---

## Nivel 4: Código y Flujo Detallado

```mermaid
sequenceDiagram
    autonumber
    actor V as Visitante
    participant SP as SeccionPortafolio.js
    participant GE as gestorEsqueletos.js
    participant DOM as Elemento (img / tarjeta)
    participant CSS as estilos/portafolio.css

    V->>SP: Renderizar Portafolio
    SP->>DOM: Crear tarjeta con clase 'skeleton-activo'
    SP->>GE: adjuntarControladorEsqueleto(img, contenedor)
    GE->>DOM: Escuchar 'load' y 'error' (o evaluar img.complete)
    alt Imagen ya cargada en caché
        GE->>DOM: Quitar clase 'skeleton-activo'
        GE->>DOM: Añadir clase 'img-cargada' (fade-in)
    else Carga en proceso
        CSS->>DOM: Renderiza animación Shimmer Grises Pro
        DOM-->>GE: Evento 'load' disparado
        GE->>DOM: Quitar clase 'skeleton-activo'
        GE->>DOM: Añadir clase 'img-cargada'
    else Falla de carga
        DOM-->>GE: Evento 'error' disparado
        GE->>DOM: Quitar clase 'skeleton-activo'
        GE->>DOM: Añadir clase 'img-fallida'
    end
```

---

## Decisiones Técnicas y Modularización
1. **Nuevo submódulo `scripts/gestorEsqueletos.js`**:
   - Mantendrá la lógica de suscripción de eventos `load` y `error`, y la detección de `img.complete` de manera pura y reutilizable.
   - Garantiza que `SeccionPortafolio.js` se mantenga por debajo del límite estricto de 200 líneas (actualmente tiene 113 líneas; modularizar la lógica de carga evita inflarlo).
2. **Estilos en `estilos/portafolio.css`**:
   - Variables de color Grises Pro integradas.
   - Clases `.esqueleto-activo`, `.img-cargada`, `@keyframes esqueletoBrillo` con soporte `prefers-reduced-motion`.
