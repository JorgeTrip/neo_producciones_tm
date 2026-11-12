# Especificación Funcional: Adaptación Integral Mobile-First y Accesibilidad Táctil

**Identificador**: SPEC-UI-004  
**Módulo**: Experiencia Móvil Transversal (`index.html`, `privacidad.html`, `componentes/`, `scripts/`, `estilos/`)  
**Fecha**: 2026-11-11  
**Autor**: Asistente de IA (Antigravity) / Jorge  
**Estado**: Aprobado por el Usuario

---

## 1. Resumen Ejecutivo y Propósito
Resolver los hallazgos visuales, ergonómicos y de accesibilidad detectados en la auditoría `/movil` (31 escenas en viewports `390×844`, `360×740` y `844×390`), aplicando patrones **Mobile-First** y **Apple-style** ("Grises Pro", *glassmorphism*, *Bottom Sheet*, barra inferior al alcance del pulgar y áreas táctiles mínimas de `44×44px`) sin romper la estética de escritorio ni los contratos de pruebas existentes.

---

## 2. Alcance Funcional de Requerimientos

### Bloque A — Correcciones Estructurales y Responsivas
1. **Grilla uniforme de 2 columnas en Portafolio móvil (`<= 900px`)**: Eliminar el estilo inline `gridTemplateColumns: 'repeat(4,1fr)'` en *Fotografía en eventos* dentro de `componentes/SeccionPortafolio.js` para que responda a `estilos/responsivo.css` (2 columnas en móvil, 4 en escritorio).
2. **Visor 360° despejado y legible**:
   - Compactar `.panorama-title-float` en móvil (máximo 1–2 líneas, ancho acotado con `max-width: calc(100% - 110px)` o anclado en la zona inferior del visor) evitando todo solapamiento con los controles `+ / - / fullscreen` de Pannellum y el botón cerrar `✕`.
   - Dar contraste WCAG AA al badge `.panorama-badge` (`360°`) sobre fotografías luminosas mediante fondo oscuro traslúcido (`rgba(20, 20, 22, 0.78)`) con `backdrop-filter: blur(8px)`.
3. **Wizard de Presupuesto sin recorte en `360×740` ni Landscape (`844×390`)**:
   - Mantener los textos `"← Volver"` y `"Presupuesto por WhatsApp"` en una sola fila sin recorte lateral ni desbordamiento en `360px` (eliminando espaciado duplicado en el ícono y ajustando paddings/tipografía compacta en `<= 400px`).
   - Aplicar layout compacto y contenedor scrolleable de adicionales también en `@media (max-height: 500px)` (landscape móvil), manteniendo visibles los botones de acción inferiores.
4. **Espaciado de Contacto y Condiciones en móvil (`<= 600px`)**: Reducir el padding interno de `.contacto-cta` y `.condicion-card` para que el CTA `"Escribinos por WhatsApp"` se muestre en una sola línea en `360px`.
5. **Menú móvil y Modal en Landscape + Backdrop**:
   - Agregar `max-height: calc(100dvh - 70px); overflow-y: auto;` a `.mobile-menu` para evitar el recorte del último ítem en `844×390`.
   - Incorporar un telón de fondo (*backdrop*) que cierre el menú al tocar fuera y transición visual del ícono hamburguesa a `✕`.
   - Compactar cabecera/paddings de `.modal-acerca-tarjeta` cuando `max-height: 500px` para garantizar acceso visible a sus botones.

### Bloque B — Ergonomía Táctil (`>= 44×44px`), Semántica y Patrones Apple-Style
6. **Objetivos táctiles `>= 44×44px`**: Elevar a un mínimo de `44×44px` los elementos `.modal-acerca-cerrar`, `.btn-secundario`, `.lightbox-close`, `.lightbox-nav`, `.footer-social a`, `.wizard-step-node`, botones del wizard (`btn-wizard-*`) y enlace principal de `privacidad.html`.
7. **Semántica HTML y Navegación por Teclado**:
   - Reemplazar `<div class="nav-hamburger">` por `<button type="button" class="nav-hamburger" aria-expanded="..." aria-controls="mobileMenu">`.
   - Dotar a las tarjetas interactivas del portafolio (`.gallery-item`, `.video-thumb`) de `role="button"`, `tabindex="0"` y soporte de teclado (`Enter` / `Space`), además de `aria-label` descriptivo.
8. **Bottom Sheet para Modal "Acerca de / Changelog" en Portrait (`<= 600px`)**: Anclar el modal en el borde inferior (`border-radius: 20px 20px 0 0`) con indicador superior visual (*handle*) y desplazamiento interno fluido, facilitando el cierre con el pulgar.
9. **Barra Inferior Rápida Móvil (*Bottom Tab Bar*) (`<= 768px`)**: Dock fijo inferior estilo *glassmorphism* respetando `env(safe-area-inset-bottom)` con 4 accesos directos de `>= 44×44px`: **Inicio**, **Portfolio**, **Presupuesto** y **WhatsApp** (ubicada de forma que el *footer* disponga de margen inferior para no quedar oculto).
10. **Corrección del Parser de Changelog (`git-log.txt` con CRLF)**: Normalizar saltos de línea `\r?\n` en `scripts/gestorVersion.js` para parsear correctamente fecha (`YYYY-MM-DD`), hash de commit y autor en lugar de mostrar `#commit` y `Reciente`.
11. **Unificación de `privacidad.html`**: Adoptar la paleta "Grises Pro" (`#141416`, `#212124`, `--gold2`), tipografía coherente y un enlace/botón visible `"← Volver al sitio"` con área táctil `>= 44px`.

---

## 3. Criterios de Aceptación (Gherkin)

### Escenarios Positivos (Happy Path)
1. **Grilla Portafolio Móvil**:
   - **Dado** que el usuario navega a `#portfolio` en móvil (`390×844` o `360×740`),
   - **Cuando** visualiza *Fotografía previa*, *Fotografía en eventos* y *Recorridos 360°*,
   - **Entonces** todas las grillas de fotos renderizan exactamente en 2 columnas simétricas y los badges `360°` mantienen contraste legible sobre fondos claros.
2. **Visor 360° Táctil**:
   - **Dado** que el usuario abre un recorrido 360° en móvil,
   - **Cuando** visualiza el visor y desliza el dedo horizontalmente,
   - **Entonces** el título de la escena no superpone los controles `+`/`-`/`✕`, y el paneo rota la escena sin desplazar el scroll de la página.
3. **Wizard Paso 2 en `360×740` y Landscape `844×390`**:
   - **Dado** que el usuario avanza al Paso 2 del Wizard en `360×740` o `844×390`,
   - **Cuando** visualiza la lista de adicionales y la barra de acciones inferior,
   - **Entonces** `"← Volver"` y `"Presupuesto por WhatsApp"` permanecen en una fila, miden `>= 44px` de alto, no sufren recorte lateral de texto y permanecen accesibles dentro del card.
4. **Menú Móvil, Bottom Sheet y Changelog**:
   - **Dado** que el usuario abre el menú hamburguesa en landscape o abre *Acerca de* en portrait,
   - **Cuando** inspecciona los ítems y navega al *Changelog*,
   - **Entonces** el menú es scrolleable sin cortar ítems, el modal se presenta como *Bottom Sheet* en portrait y el *Changelog* muestra la fecha real y hash `#xxxxxxx` de cada commit.
5. **Barra Inferior Móvil y Política de Privacidad**:
   - **Dado** que el usuario navega en móvil (`<= 768px`),
   - **Cuando** utiliza la barra inferior fija o visita `privacidad.html`,
   - **Entonces** cada acceso de la barra inferior mide `>= 44×44px` y `privacidad.html` presenta estética "Grises Pro" con retorno directo a `index.html`.

### Escenarios de Borde (Edge Cases)
- **Redimensionamiento / Cambio de Orientación**: Al girar de portrait (`390×844`) a landscape (`844×390`), el menú abierto y el modal activo adaptan su alto máximo (`dvh`) sin desbordar ni dejar elementos fuera de pantalla.
- **Operación por Teclado**: Todo control interactivo (`.nav-hamburger`, `.gallery-item`, `.video-thumb`, cierre de modales) responde a `Enter`/`Space` y `Escape` con foco visible.
- **Preferencia `prefers-reduced-motion`**: Las transiciones del *Bottom Sheet*, barra inferior y menú respetan la reducción de movimiento.

### Escenarios de Error y Resiliencia (Failure Modes)
- **Fallo o formato inesperado en `git-log.txt`**: Si una línea no coincide con el formato `* YYYY-MM-DD [hash] mensaje (autor)`, `parsearLogGit` recurre limpiamente a los valores de respaldo sin lanzar excepciones.
- **Toque fuera de menús/modales**: Tocar el backdrop del menú móvil o del *Bottom Sheet* cierra inmediatamente la capa activa y restaura `document.body.style.overflow`.
- **Modales activos sobre Barra Inferior**: Al abrir `#lightbox` o `#modalAcercaDeBackdrop` (`z-index: 1000`), la barra inferior rápida queda por debajo (`z-index < 1000`) sin interferir con el visor o las acciones del modal.

---

## 4. Requisitos No Funcionales y Verificación
1. **Modularidad**: Ningún archivo nuevo o modificado supera las **200 líneas** de código.
2. **TDD Estricto**: Pruebas unitarias/estructurales nuevas en `tests/` escritas en Rojo antes de implementar cada módulo.
3. **Auditoría Centralizada y Re-validación `/movil`**: Aprobación limpia de `node C:\Users\Jorge\.gemini\tools\auditarProyecto.mjs`, `npm test` al 100%, y re-ejecución completa con Playwright en `390×844`, `360×740` y `844×390` verificando `0` recortes, `0` errores de consola y reducción de objetivos `< 44px` en los controles cubiertos.
