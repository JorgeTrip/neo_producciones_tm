# Arquitectura C4: Wizard Consultivo de Presupuesto

**Proyecto**: NEO Producciones  
**Módulo**: Asistente Wizard de Presupuesto (`componentes/wizard/`, `componentes/SeccionPresupuesto.js`, `estilos/presupuesto.css`)  
**Fecha**: 2026-10-16  
**Autor**: Asistente de IA (Antigravity) / Jorge  
**Estado**: En Revisión (Esperando Aprobación de Compuerta C4)

---

## Nivel 1: Contexto del Sistema

```mermaid
flowchart TD
    Cliente["Cliente Potencial / Visitante"] -->|Configura cobertura y datos| WebNEO["Sitio Web NEO Producciones"]
    WebNEO -->|Abre mensaje estructurado| WhatsAppAPI["API WhatsApp (wa.me)"]
    WebNEO -->|Opcional: Envío asíncrono| CorreoContacto["Canal de Contacto Directo"]
```

---

## Nivel 2: Contenedores

```mermaid
flowchart TD
    subgraph NavegadorWeb["Navegador del Cliente (Desktop / Mobile)"]
        subgraph Frontend_Modular["SPA Vanilla JS (Arquitectura Modular)"]
            DOM["Árbol DOM HTML5"]
            Estilos["CSS Modular (estilos/presupuesto.css)"]
            ModulosES["Módulos ES6 (scripts/ y componentes/)"]
        end
    end
    NavegadorWeb --> Frontend_Modular
```

---

## Nivel 3: Componentes y Separación de Capas

```mermaid
flowchart TD
    subgraph CapaPresentacion["Capa de Presentación (UI)"]
        SeccionPresupuesto["componentes/SeccionPresupuesto.js"]
        BarraProgreso["componentes/wizard/BarraProgresoWizard.js"]
        PasoItems["componentes/wizard/PasoSeleccionItems.js"]
        PasoContacto["componentes/wizard/PasoContactoPresupuesto.js"]
        PresupuestoCSS["estilos/presupuesto.css"]
    end

    subgraph CapaAplicacion["Capa de Aplicación (Estado)"]
        EstadoWizard["scripts/aplicacion/estadoWizardPresupuesto.js"]
    end

    subgraph CapaDominio["Capa de Dominio (Pura / Sin DOM)"]
        Catalogo["scripts/dominio/catalogoPresupuesto.js"]
        Validador["scripts/dominio/validadorPresupuesto.js"]
        GeneradorMensaje["scripts/dominio/generadorMensajePresupuesto.js"]
    end

    SeccionPresupuesto --> BarraProgreso
    SeccionPresupuesto --> PasoItems
    SeccionPresupuesto --> PasoContacto
    PasoItems --> EstadoWizard
    PasoContacto --> EstadoWizard
    EstadoWizard --> Catalogo
    EstadoWizard --> Validador
    EstadoWizard --> GeneradorMensaje
    SeccionPresupuesto -.-> PresupuestoCSS
```

---

## Nivel 4: Flujo y Máquina de Estados del Wizard

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario
    participant UI as SeccionPresupuesto.js
    participant EW as estadoWizardPresupuesto.js
    participant VAL as validadorPresupuesto.js
    participant GEN as generadorMensajePresupuesto.js
    participant WA as WhatsApp Web/App

    U->>UI: Selecciona Servicio Base y Extras
    UI->>EW: alternarServicio(id) / alternarExtra(id)
    U->>UI: Clic en "Continuar al Paso 2"
    UI->>EW: avanzarPaso()
    EW-->>UI: Notifica cambio a Paso 2
    UI->>UI: Renderiza PasoContactoPresupuesto con resumen
    U->>UI: Completa Nombre, Teléfono, Fecha, Zona
    U->>UI: Clic en "Solicitar Presupuesto por WhatsApp"
    UI->>VAL: validarDatosContacto(datos)
    alt Datos incompletos
        VAL-->>UI: Errores de validación
        UI->>UI: Marca campos con aria-invalid y foco visual
    else Datos válidos
        VAL-->>UI: Validación exitosa
        UI->>GEN: construirEnlaceWhatsApp(servicio, extras, datos)
        GEN-->>UI: URL wa.me con texto estructurado
        UI->>WA: window.open(urlWhatsApp, '_blank')
    end
```

---

## Invariantes y Reglas de Diseño

1. **Aislamiento del Dominio**:
   - `catalogoPresupuesto.js`, `validadorPresupuesto.js` y `generadorMensajePresupuesto.js` son funciones y constantes puras sin acceso a `document`, `window` ni dependencias externas.
   - Son 100% testeables de forma determinista mediante `node --test tests/presupuesto/*.test.js`.
2. **Límite Estricto de 200 Líneas**:
   - Cada componente del wizard (`BarraProgresoWizard.js`, `PasoSeleccionItems.js`, `PasoContactoPresupuesto.js`, `SeccionPresupuesto.js`) se mantiene por debajo de 150 líneas.
3. **UX Reactiva y Accesibilidad (WCAG 2.1 AA)**:
   - Anillos de foco visibles (`focus-visible`).
   - Transiciones suaves entre pasos sin parpadeos.
   - Respaldo de navegación por teclado completa (`Tab`, `Space`, `Enter`).
