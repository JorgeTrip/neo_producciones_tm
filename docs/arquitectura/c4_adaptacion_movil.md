# Arquitectura C4: Adaptación Mobile-First y Experiencia Táctil (`SPEC-UI-004`)

**Estado:** Aprobado por el Usuario  
**Trazabilidad:** `especificaciones/especificacionAdaptacionMovil.md` (`SPEC-UI-004`)

---

## 1. Nivel 1 — Diagrama de Contexto del Sistema

Muestra la interacción del usuario móvil (orientación vertical estándar `390x844`, compacto `360x740` y horizontal `844x390`) con la plataforma estática de NEO Producciones y sus canales externos.

```mermaid
flowchart LR
    Usuario["Visitante Móvil (Táctil / Lector de Pantalla)"]
    Web["NEO Producciones Web (SPA Estática ES Modules)"]
    WA["WhatsApp Web / App (Canal de Contacto y Presupuesto)"]
    Pannellum["Librería Pannellum CDN (Renderizado 360°)"]

    Usuario -->|"Navega, abre galería y cotiza"| Web
    Web -->|"Envía presupuesto o consulta"| WA
    Web -->|"Renderiza tours inmersivos"| Pannellum
```

---

## 2. Nivel 2 — Diagrama de Contenedores

La solución evita añadir frameworks o dependencias externas pesadas. Toda la lógica de interfaz, navegación y responsividad se organiza en contenedores estáticos HTML, hojas CSS modulares y módulos ES nativos del navegador.

```mermaid
flowchart TD
    HTML["index.html y privacidad.html (Estructura Semántica WCAG)"]
    CSS["estilos/principal.css (Orquestador de Tokens Grises Pro y Breakpoints)"]
    JS_Init["scripts/inicializarComponentes.js (Orquestador de Montaje DOM)"]
    JS_Nav["scripts/menuNavegacion.js (Menú Hamburguesa, Backdrop y Scroll Activo)"]
    JS_Ver["scripts/gestorVersion.js (Lector y Parser de Changelog CRLF/LF)"]
    UI_Mod["componentes/* (Secciones, Wizard, Bottom Sheet y BarraInferiorMovil)"]

    HTML --> CSS
    HTML --> JS_Init
    JS_Init --> UI_Mod
    JS_Init --> JS_Nav
    UI_Mod --> JS_Ver
```

---

## 3. Nivel 3 — Diagrama de Componentes (Módulos Nuevos y Modificados)

Para respetar la **Regla de Hierro (< 200 líneas/archivo)** dado que `visorMultimedia.css` (195L), `presupuesto.css` (195L), `modalAcercaDe.css` (194L) y `responsivo.css` (154L) están cerca del límite, las mejoras responsivas y la barra inferior móvil se aíslan en módulos CSS y JS dedicados al final de la cascada.

```mermaid
flowchart LR
    subgraph Capa_Presentacion_JS["Componentes JS Declarativos (< 200L)"]
        BIM["BarraInferiorMovil.js (Inicio, Portfolio, Presupuesto, WhatsApp)"]
        Port["SeccionPortafolio.js (Sin estilos inline rígidos + teclado A11y)"]
        Paso2["wizard/PasoAdicionales.js (CTA Presupuesto por WhatsApp fluido)"]
        Modal["ModalAcercaDe.js (Bottom Sheet móvil con tirador táctil)"]
    end

    subgraph Capa_Controladores_JS["Scripts y Utilidades"]
        DOM["utilidadesDom.js (crearElemento / crearElementoSvg sin innerHTML)"]
        Init["inicializarComponentes.js (Montaje en main / body)"]
        Nav["menuNavegacion.js (aria-expanded, animación X, cierre por backdrop)"]
        Ver["gestorVersion.js (parsearLogGit normalizando CRLF)"]
    end

    subgraph Capa_Estilos_CSS["Hojas CSS Modulares (< 200L)"]
        Prin["principal.css (Importa al final para cascada limpia)"]
        MovExp["movilExperiencia.css (Targets >=44px, 360°, Bottom Sheet, Landscape <=500px)"]
        MovBar["barraInferiorMovil.css (Barra fija <=768px, z-index <1000, safe-area)"]
    end

    Init --> BIM
    BIM --> DOM
    Port --> DOM
    Paso2 --> DOM
    Modal --> DOM
    Modal --> Ver
    Prin --> MovExp
    Prin --> MovBar
```

---

## 4. Nivel 4 — Código, Contratos e Interfaces de Módulos

```mermaid
classDiagram
    class BarraInferiorMovil {
        +crearBarraInferiorMovil() HTMLElement
        +accesos: Inicio, Portfolio, Presupuesto, WhatsApp
    }
    class SeccionPortafolio {
        +crearSeccionPortafolio() HTMLElement
        -crearItemFoto(foto) HTMLElement
        -crearItemPanorama(pano) HTMLElement
        -crearItemVideo(video) HTMLElement
        +atributosA11y: role button, tabindex 0, onkeydown Enter/Space
    }
    class PasoAdicionales {
        +crearPasoAdicionales(props) HTMLElement
        +textoBotonPreservado: "Presupuesto por WhatsApp"
    }
    class ModalAcercaDe {
        +abrirModalAcercaDe() void
        +cerrarModalAcercaDe() void
        +renderizarHandleBottomSheet() HTMLElement
    }
    class GestorVersion {
        +parsearLogGit(textoLog) Array
        +cargarDatosVersion() Promise
    }
    class MenuNavegacion {
        +conmutarMenu() void
        +cerrarMenuDesdeBackdrop() void
    }

    BarraInferiorMovil --> UtilidadesDOM : usa crearElemento / Svg
    ModalAcercaDe --> GestorVersion : consume parsearLogGit
```

---

## 5. Fronteras Arquitectónicas y Cumplimiento de Invariantes

1. **Límite de Líneas (`<= 200` líneas por archivo):** Ningún archivo JS, CSS, HTML o MD superará las 200 líneas tras la implementación. Los estilos de `SPEC-UI-004` se distribuyen entre `estilos/movilExperiencia.css` y `estilos/barraInferiorMovil.css` al final de `estilos/principal.css`.
2. **Invariantes del Contrato de Tests Existente (`tests/presupuesto/vistaPresupuestoMovil.test.js`):**
   - Se conserva literal el texto `'Presupuesto por WhatsApp'` y `'← Volver'` en `componentes/wizard/PasoAdicionales.js`.
   - Se mantienen `.wizard-actions-bar.dual { flex-direction: row }`, `.wizard-services-grid { grid-template-columns: 1fr }` y `.wizard-extras-grid` con `overflow-y: auto`.
3. **Jerarquía de Capas (`z-index`) y Safe Area:**
   - `BarraInferiorMovil` visible solo en `@media (max-width: 768px)` con `z-index` inferior a `1000` (por debajo de `.mobile-menu`, `#lightbox` y `#modal-acerca-de`) y padding inferior con `env(safe-area-inset-bottom)`.
4. **Seguridad y Cero Suposiciones:** Uso exclusivo de `crearElemento` / `crearElementoSvg` (0 usos de `innerHTML`), `<button type="button">` nativos en disparadores interactivos y parsing seguro CRLF/LF en `parsearLogGit`.
