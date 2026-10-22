# Arquitectura C4: Wizard Consultivo de Presupuesto

**Proyecto**: NEO Producciones  
**Módulo**: Asistente Wizard de Presupuesto (`componentes/wizard/`, `componentes/SeccionPresupuesto.js`, `estilos/presupuesto.css`)  
**Fecha**: 2026-10-22  
**Autor**: Asistente de IA (Antigravity) / Jorge  
**Estado**: Aprobado por el Usuario  

---

## Nivel 1: Contexto del Sistema

```mermaid
flowchart TD
    Cliente["Cliente Potencial / Visitante"] -->|Configura cobertura y adicionales| WebNEO["Sitio Web NEO Producciones"]
    WebNEO -->|Abre mensaje estructurado directamente| WhatsAppAPI["API WhatsApp (api.whatsapp.com/send)"]
    WhatsAppAPI -->|Recepción directa| Profesional["Jorge (NEO Producciones)"]
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
        BarraProgreso["componentes/wizard/BarraProgresoWizard.js (2 pasos)"]
        PasoTipoCobertura["componentes/wizard/PasoTipoCobertura.js (Paso 1)"]
        PasoAdicionales["componentes/wizard/PasoAdicionales.js (Paso 2 con CTA WhatsApp)"]
        PresupuestoCSS["estilos/presupuesto.css"]
    end

    subgraph CapaAplicacion["Capa de Aplicación (Estado)"]
        EstadoWizard["scripts/aplicacion/estadoWizardPresupuesto.js (TOTAL_PASOS = 2)"]
    end

    subgraph CapaDominio["Capa de Dominio (Pura / Sin DOM)"]
        Catalogo["scripts/dominio/catalogoPresupuesto.js"]
        GeneradorMensaje["scripts/dominio/generadorMensajePresupuesto.js"]
    end

    SeccionPresupuesto --> BarraProgreso
    SeccionPresupuesto --> PasoTipoCobertura
    SeccionPresupuesto --> PasoAdicionales
    PasoTipoCobertura --> EstadoWizard
    PasoAdicionales --> EstadoWizard
    PasoAdicionales --> GeneradorMensaje
    EstadoWizard --> Catalogo
    SeccionPresupuesto -.-> PresupuestoCSS
```

---

## Nivel 4: Flujo y Máquina de Estados del Wizard (2 Pasos)

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario
    participant UI as SeccionPresupuesto.js / PasoAdicionales.js
    participant EW as estadoWizardPresupuesto.js
    participant GEN as generadorMensajePresupuesto.js
    participant WA as WhatsApp Web/App

    U->>UI: 1. Selecciona Servicio Base (Paso 1)
    UI->>EW: seleccionarServicio(id)
    U->>UI: Clic en "Continuar a Adicionales"
    UI->>EW: avanzarPaso()
    EW-->>UI: Notifica pasoActual = 2
    UI->>UI: Renderiza PasoAdicionales
    U->>UI: 2. Tilda adicionales deseados (opcional)
    UI->>EW: alternarAdicional(id)
    U->>UI: 3. Clic en "Solicitar Presupuesto por WhatsApp"
    UI->>GEN: generarEnlaceWhatsApp({ servicioId, adicionalesIds })
    GEN-->>UI: URL api.whatsapp.com/send con texto estructurado
    UI->>WA: window.open(enlaceWhatsApp, '_blank')
```
