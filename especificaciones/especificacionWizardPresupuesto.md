# Especificación Funcional: Wizard Consultivo de Presupuesto

**Identificador**: SPEC-UI-002  
**Módulo**: Asistente de Presupuesto Consultivo (`componentes/wizard/`, `componentes/SeccionPresupuesto.js`, `estilos/presupuesto.css`)  
**Fecha**: 2026-10-16  
**Autor**: Asistente de IA (Antigravity) / Jorge  
**Estado**: En Revisión (Esperando Aprobación de Compuerta SDD)

---

## 1. Resumen Ejecutivo y Propósito
Implementar una sección interactiva de presupuesto bajo el patrón de diseño Wizard (Asistente en 2 pasos) para NEO Producciones. Permite a potenciales clientes configurar su requerimiento de cobertura audiovisual y solicitar cotización formal de manera estructurada y consultiva, sin mostrar montos monetarios en pantalla (los precios se cotizan de forma personalizada vía WhatsApp).

La experiencia visual y de interacción debe seguir el estándar de alta fidelidad estilo "Apple" (paleta "Grises Pro", animaciones fluidas, feedback táctil y cumplimiento estricto de WCAG 2.1 AA).

---

## 2. Definición del Catálogo del Wizard (Paso 1)

### 2.1. Servicios Base (Selección Única / Radio)
- `sociales`: **Eventos Sociales** (Cumpleaños de 15, Bodas, Aniversarios, Fiestas familiares).
- `corporativos`: **Eventos Corporativos** (Conferencias, Congresos, Lanzamientos, Jornadas de networking).
- `sesiones`: **Sesiones & Books** (Book de 15 en exteriores/estudio, Pre-Boda, Retratos personales o ejecutivos).
- `comercial`: **Fotografía Comercial & Inmobiliaria** (Catálogos de producto, fotografía arquitectónica y espacios).

### 2.2. Módulos Adicionales (Selección Múltiple / Checkboxes)
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

## 3. Definición del Formulario y Contacto (Paso 2)

### 3.1. Campos de Entrada
- `nombre`: Nombre y apellido del contacto (*Obligatorio*).
- `telefono`: Teléfono o WhatsApp de contacto (*Obligatorio*).
- `email`: Correo electrónico (*Opcional, validación sintáctica si se completa*).
- `fechaEvento`: Fecha estimada o confirmada del evento (*Obligatorio, selector de fecha o formato dd/mm/aaaa*).
- `zonaEvento`: Localidad, zona o salón del evento (*Obligatorio, ej: CABA, Zona Norte, Pilar, etc.*).
- `comentarios`: Comentarios adicionales o detalles específicos (*Opcional, textarea*).

### 3.2. Formato del Mensaje Estructurado para WhatsApp
El botón de acción principal genera un enlace `https://wa.me/541140686925?text=...` con el siguiente esquema de mensaje codificado:
```text
¡Hola Jorge! Estuve armando una solicitud de presupuesto en la web de NEO Producciones:

📌 Servicio: Eventos Sociales
📦 Adicionales seleccionados:
   • Sesión de Fotos Previa
   • Video Homenaje / Cronológico
   • Cobertura en Video / Reels

📅 Fecha estimada: 15/11/2026
📍 Zona / Salón: San Isidro, Zona Norte
👤 Nombre: Mariana Gómez
📱 Contacto: 11-1234-5678
💬 Mensaje adicional: Queremos coordinar una reunión para ver opciones de photobook.

Quedo a la espera de tu cotización y disponibilidad. ¡Muchas gracias!
```

---

## 4. Criterios de Aceptación (Gherkin)

### Escenario 1: Flujo Completo Exitoso (Happy Path)
- **Dado** que un usuario ingresa a la sección `#presupuesto` en el Paso 1 (Selección de Ítems)
- **Cuando** selecciona un servicio base (ej. "Eventos Sociales") y marca dos adicionales (ej. "Sesión de Fotos Previa" y "Video Homenaje")
- **Y** hace clic en "Continuar al Paso 2"
- **Entonces** el wizard transiciona suavemente al Paso 2 mostrando una barra de resumen con los ítems elegidos
- **Cuando** completa su Nombre, Teléfono, Fecha estimada, Zona y hace clic en "Solicitar Presupuesto por WhatsApp"
- **Entonces** se valida la completitud de los campos obligatorios
- **Y** se abre una nueva pestaña hacia WhatsApp con el mensaje preformateado y legible.

### Escenario 2: Navegación Bidireccional sin Pérdida de Estado
- **Dado** que el usuario avanzó al Paso 2 y completó parcialmente sus datos personales
- **Cuando** hace clic en el botón "Volver" o en el indicador del Paso 1 en la barra de progreso
- **Entonces** el wizard regresa a la vista de selección de ítems
- **Y** preserva intactas las selecciones previas (servicio base y adicionales tildados)
- **Y** al volver al Paso 2, los datos ya escritos en el formulario se mantienen sin resetearse.

### Escenario 3: Validación de Campos Obligatorios en Paso 2 (Edge Case / Failure Mode)
- **Dado** que el usuario está en el Paso 2
- **Cuando** intenta enviar el formulario o abrir WhatsApp sin haber completado su Nombre, Teléfono, Fecha o Zona
- **Entonces** la acción se detiene
- **Y** se resaltan los campos incompletos con borde de advertencia accesible y mensaje de error descriptivo, sin recargar la página.

### Escenario 4: Envío sin Adicionales Opcionales (Edge Case)
- **Dado** que el usuario sólo seleccionó un servicio base sin marcar ningún adicional
- **Cuando** avanza al Paso 2 y envía la consulta
- **Entonces** en la sección de adicionales del mensaje de WhatsApp se indica claramente "Sin adicionales (Cobertura base)".

---

## 5. Requisitos No Funcionales y de Accesibilidad (WCAG 2.1 AA)
1. **Límite de Líneas**: Ningún archivo excederá las 200 líneas de código (modularización estricta).
2. **Navegación por Teclado**: Todo el wizard (`Tab`, `Space`, `Enter`) debe ser operable sin mouse, con anillos de foco visibles (`focus-visible`).
3. **Semántica ARIA**: Contenedor con `role="region"`, `aria-live="polite"` en pasos de resumen y atributos `aria-invalid` en campos con error.
4. **Paleta Grises Pro**: Fondo oscuro institucional (`#18181b` / `#212124`), acentos dorados (`#f4c067` / degradé institucional) y textos legibles con contraste superior a 4.5:1.
