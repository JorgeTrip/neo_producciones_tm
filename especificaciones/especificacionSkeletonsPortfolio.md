# Especificación Funcional: Skeletons de Carga en Sección Portfolio

**Identificador**: SPEC-UI-001  
**Módulo**: Portafolio Multimedia (`componentes/SeccionPortafolio.js` / `estilos/portafolio.css`)  
**Fecha**: 2026-10-15  
**Autor**: Asistente de IA (Antigravity) / Jorge  
**Estado**: En Revisión (Esperando Aprobación de Compuerta)

---

## 1. Resumen Ejecutivo
Implementar pantallas y loaders esqueleto (*skeleton screens*) con efecto de brillo animado (*shimmer*) durante la carga diferida (*lazy loading*) o inicial de fotografías previas, fotografías de eventos, recorridos panorámicos 360° y miniaturas de videos en la sección Portfolio de NEO Producciones.

El objetivo es eliminar parpadeos, evitar saltos visuales de renderizado (*layout shift*) y cumplir con la Regla #4 del Protocolo de Desarrollo de Jorge (Feedback Visual y UX Reactiva), aplicando la estética "Grises Pro" en modo oscuro.

---

## 2. Alcance y Elementos Afectados
1. **Fotografía previa**: Elementos `.gallery-item` en la primera grilla.
2. **Fotografía en eventos**: Elementos `.gallery-item` en la grilla de eventos.
3. **Fotografía interactiva 360°**: Elementos `.gallery-item.panorama-item`.
4. **Miniaturas de video**: Elementos `.video-thumb` en la grilla de videos (recursos remotos de Vimeo y YouTube).

---

## 3. Criterios de Aceptación (Gherkin)

### Escenario 1: Carga progresiva exitosa de imagen o miniatura (Happy Path)
- **Dado** que un visitante ingresa o se desplaza a la sección `#portfolio`
- **Cuando** las imágenes y miniaturas de video comienzan su descarga asíncrona en el DOM
- **Entonces** cada tarjeta debe mostrar inmediatamente una animación de esqueleto (*skeleton shimmer*) utilizando los tonos oscuros de la paleta institucional (`--card`, `--card2` o variables de Grises Pro)
- **Y** la imagen en curso debe mantenerse con opacidad inicial oculta (`opacity: 0`)
- **Cuando** la imagen completa exitosamente su evento de carga (`load`)
- **Entonces** la clase de esqueleto se retira y la imagen se muestra mediante una transición suave de fundido (*fade-in*).

### Escenario 2: Elemento con imagen ya presente en memoria caché (Edge Case)
- **Dado** que un visitante navega por el sitio y las imágenes ya han sido descargadas previamente o se encuentran en la memoria caché del navegador (`img.complete === true`)
- **Cuando** se instancia o renderiza la sección `#portfolio`
- **Entonces** el sistema detecta que `img.complete` es verdadero con `naturalWidth > 0`
- **Y** omite o desactiva de inmediato el estado de skeleton sin provocar parpadeos visuales ni transiciones rotas.

### Escenario 3: Falla de red o error al cargar el recurso multimedia (Failure Mode)
- **Dado** que un recurso externo (ej. miniatura de Vimeo/YouTube o imagen) falla en su carga debido a problemas de red o enlace roto (`error`)
- **Cuando** se dispara el evento `error` en la etiqueta `img`
- **Entonces** el contenedor debe remover el efecto activo de skeleton para evitar que quede pulsando indefinidamente
- **Y** se asigna un estado visual neutral que preserva la estabilidad de la cuadrícula sin romper el diseño.

---

## 4. Requisitos de Estilo y Accesibilidad (WCAG 2.1 AA)
- **Paleta Grises Pro**: Prohibido usar negro puro `#000` o blanco puro `#fff`. Gradiente shimmer basado en `rgba(255, 255, 255, 0.03)` a `rgba(255, 255, 255, 0.08)` sobre `--card` (`#212124`).
- **Respeto a Preferencias de Movimiento (`prefers-reduced-motion`)**: Si el usuario tiene activada la reducción de movimiento en su sistema operativo, la animación de traslación del brillo debe sustituirse por una pulsación sutil o permanecer estática.
- **Mantener Proporciones Fijas (Aspect Ratio)**:
  - Fotografías y 360°: `aspect-ratio: 1 / 1`.
  - Miniaturas de video: `aspect-ratio: 16 / 9`.
