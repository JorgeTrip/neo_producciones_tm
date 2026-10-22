# Especificación Funcional: Wizard Consultivo de Presupuesto

**Identificador**: SPEC-UI-003  
**Módulo**: Asistente de Presupuesto Consultivo (`componentes/wizard/`, `componentes/SeccionPresupuesto.js`, `estilos/presupuesto.css`)  
**Fecha**: 2026-10-22  
**Autor**: Asistente de IA (Antigravity) / Jorge  
**Estado**: Aprobado por el Usuario  

---

## 1. Resumen Ejecutivo y Propósito
Implementar una sección interactiva de presupuesto bajo el patrón de diseño Wizard en 2 pasos para NEO Producciones. Permite a potenciales clientes configurar su requerimiento de cobertura audiovisual y solicitar cotización formal directamente a WhatsApp de manera ágil, sin fricción de formularios extensos. La información faltante (fecha, nombre, salón) es gestionada de manera consultiva y personalizada por WhatsApp.

---

## 2. Definición del Catálogo del Wizard

### 2.1. Servicios Base (Paso 1 - Selección Única)
- `sociales`: **Eventos Sociales** (Cumpleaños de 15, Bodas, Aniversarios, Fiestas familiares).
- `corporativos`: **Eventos Corporativos** (Conferencias, Congresos, Lanzamientos, Jornadas de networking).
- `sesiones`: **Sesiones & Books** (Book de 15 en exteriores/estudio, Pre-Boda, Retratos personales o ejecutivos).
- `comercial`: **Fotografía Comercial & Inmobiliaria** (Catálogos de producto, fotografía arquitectónica y espacios).

### 2.2. Módulos Adicionales (Paso 2 - Selección Múltiple)
- `sesion_previa`: **Sesión de Fotos Previa** (Exteriores o locación para banners, invitaciones y firmas).
- `video_homenaje`: **Video Homenaje / Cronológico** (Montaje emotivo con fotos y videos de infancia a actualidad).
- `cobertura_video`: **Cobertura en Video / Reels** (Registro dinámico del evento y cortes verticales para redes sociales).
- `fotolibro`: **Fotolibro / Photobook Impreso** (Álbum encuadernado de calidad fotográfica premium).
- `cuaderno_firmas`: **Cuaderno de Firmas Fotográfico** (Libro encuadernado exclusivo con fotos previas para firmas y dedicatorias).
- `foto_mural`: **Foto-Mural de Bienvenida** (Gigantografía de alta resolución montada para el ingreso o ambientación).
- `foto_souvenirs`: **Foto-Souvenirs Personalizados** (Recuerdos fotográficos listos para entregar a los invitados en la fiesta).
- `invitaciones_animadas`: **Invitaciones Digitales Animadas** (Video dinámico con música y fotos para enviar por WhatsApp).
- `panoramica_360`: **Tour Virtual / Fotografía 360°** (Registro panorámico inmersivo del salón o espacio).
- `entrega_expres`: **Entrega Exprés de Fotos** (Adelanto de 15-20 fotografías editadas en 24/48 hs para redes).

---

## 3. Envío y Formato del Mensaje Estructurado para WhatsApp

Al presionar el botón "Solicitar Presupuesto por WhatsApp" en el Paso 2, se genera y abre una URL `https://api.whatsapp.com/send?phone=541140686925&text=...` con el siguiente esquema:

```text
¡Hola Jorge! Estuve armando una solicitud de presupuesto en la web de NEO Producciones:

📌 Servicio: Eventos Sociales
📦 Adicionales seleccionados:
   • Sesión de Fotos Previa
   • Video Homenaje / Cronológico

Quedo a la espera de tu cotización y disponibilidad. ¡Muchas gracias!
```

Si no se seleccionó ningún adicional:
```text
¡Hola Jorge! Estuve armando una solicitud de presupuesto en la web de NEO Producciones:

📌 Servicio: Eventos Corporativos
📦 Adicionales seleccionados:
   • Sin adicionales (Cobertura base)

Quedo a la espera de tu cotización y disponibilidad. ¡Muchas gracias!
```

---

## 4. Criterios de Aceptación (Gherkin)

### Escenario 1: Flujo Directo Exitoso con Adicionales (Happy Path)
- **Dado** que un usuario ingresa al asistente en el Paso 1 (Tipo de Cobertura)
- **Cuando** selecciona un servicio base (ej. "Eventos Sociales")
- **Y** hace clic en "Continuar a Adicionales"
- **Entonces** el wizard transiciona al Paso 2 mostrando el contexto del servicio elegido
- **Cuando** tilda uno o más adicionales y presiona "Solicitar Presupuesto por WhatsApp"
- **Entonces** se abre WhatsApp directamente con el detalle estructurado.

### Escenario 2: Navegación Bidireccional sin Pérdida de Selecciones
- **Dado** que el usuario está en el Paso 2 con adicionales marcados
- **Cuando** hace clic en "← Volver a Cobertura" o en el botón "1 Cobertura" de la barra de progreso
- **Entonces** regresa al Paso 1 con el servicio conservado
- **Y** al avanzar nuevamente al Paso 2, los adicionales seleccionados permanecen tildados.

### Escenario 3: Envío sin Adicionales Opcionales (Edge Case)
- **Dado** que el usuario avanza al Paso 2 sin marcar ningún adicional
- **Cuando** hace clic en "Solicitar Presupuesto por WhatsApp"
- **Entonces** el mensaje se abre indicando "Sin adicionales (Cobertura base)".

---

## 5. Requisitos No Funcionales y Accesibilidad (WCAG 2.1 AA)
1. **Límite de Líneas**: Ningún archivo excede las 200 líneas de código.
2. **Navegación por Teclado**: Todo el wizard (`Tab`, `Space`, `Enter`) es operable sin mouse.
3. **Semántica ARIA**: Indicador de pasos con `role="navigation"`, estados `aria-current="step"`.
4. **Paleta Grises Pro**: Fondo oscuro por defecto (`#18181b` / `#212124`) y contraste superior a 4.5:1.
