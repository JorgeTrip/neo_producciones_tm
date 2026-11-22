# Especificación Funcional: Acoplamiento Magnético ("Dock") de Presupuesto Móvil

**Identificador**: SPEC-UI-005 (Rev. 2 — Disparo por Entrada en Viewport)  
**Módulo**: Navegación y Cinemática de Viewport Móvil (`componentes/`, `scripts/`, `estilos/`)  
**Fecha**: 2026-11-22  
**Autor**: Asistente de IA (Antigravity) / Jorge  
**Estado**: Aprobado por el Usuario

---

## 1. Resumen Ejecutivo y Propósito

En dispositivos móviles (`<= 768px`), cuando el usuario desciende desde la sección anterior (`#portfolio`) y la sección **Presupuesto** (`#presupuesto`) ingresa al viewport con visibilidad real (`>= 15%`), la pantalla debe activar un **efecto imán ("docking")** al soltar o desacelerar el gesto táctil.

El desplazamiento se ajusta suavemente para apoyar la arista inferior de `.wizard-card` sobre el borde superior de la barra inferior fija (`#barraInferiorMovil`), enmarcando todo el Paso 1 (compactado sin párrafo explicativo) entre ambas barras de navegación. El imán actúa **una sola vez por entrada** para no atrapar al usuario cuando desee continuar hacia `#condiciones` o volver a `#portfolio`, y se reactiva únicamente cuando `#presupuesto` sale por completo de pantalla.

---

## 2. Alcance Funcional y Reglas de Comportamiento

1. **Activación Exclusiva en Móvil (`<= 768px`)**:
   - Activo solo cuando el ancho de ventana es `<= 768px` y `#barraInferiorMovil` está visible.
   - En escritorio (`> 768px`), el desplazamiento permanece 100% nativo.

2. **Disparo Descendente One-Shot por Entrada en Viewport**:
   - Se activa únicamente al bajar desde `#portfolio` (`direccionDescendente === true`) cuando `#presupuesto` alcanza al menos un **15% de visibilidad** en el viewport (`fraccionVisible >= 0.15`) y el usuario suelta el dedo o desacelera el gesto (sin interrumpir *swipes* rápidos).
   - Se dispara **una sola vez por entrada** (`yaDisparadoEnEntrada = true`), dejando libre al usuario para seguir bajando a `#condiciones` o regresar a `#portfolio`.
   - Se **rearma** únicamente cuando `#presupuesto` sale por completo de pantalla (`fraccionVisible === 0`).

3. **Cálculo del Punto de Anclaje ("Dock Point")**:
   - La arista inferior de `.wizard-card` queda apoyada sobre el borde superior de `#barraInferiorMovil`:
     $$\text{scrollY\_dock} = \text{rectInferiorTarjetaAbsoluto} - \text{window.innerHeight} + \text{alturaBarraInferior}$$

4. **Dinamismo entre Pasos 1 y 2**:
   - Al cambiar de paso dentro del asistente mientras está acoplado, el dock recalcula y reajusta suavemente la posición a la nueva altura de `.wizard-card`.

5. **Compactación Vertical del Paso 1 en Móviles (`<= 768px`)**:
   - En móvil (`<= 768px`) se oculta `.card-radio-desc`, conservando `.card-radio-title` y `.card-radio-sub`. En escritorio (`> 768px`), `.card-radio-desc` permanece visible sin cambios.

---

## 3. Criterios de Aceptación (Gherkin)

### Escenario 1: Disparo al bajar desde Portfolio con >= 15% visible (Happy Path)
- **Dado** un usuario en móvil (`<= 768px`) navegando hacia abajo desde `#portfolio`,
- **Cuando** `#presupuesto` entra al viewport alcanzando `>= 15%` de visibilidad y el usuario suelta o desacelera el gesto,
- **Entonces** el scroll se acopla suavemente apoyando la base de `.wizard-card` sobre el borde superior de `#barraInferiorMovil`,
- **Y** el estado queda marcado como disparado para esta entrada.

### Escenario 2: Libre salida sin atrapamiento de scroll
- **Dado** que el imán ya disparó el acople para la entrada actual en `#presupuesto`,
- **Cuando** el usuario desliza hacia abajo rumbo a `#condiciones` o hacia arriba rumbo a `#portfolio`,
- **Entonces** el imán no vuelve a jalar la pantalla hacia `#presupuesto`.

### Escenario 3: Rearme tras salir completamente y volver a entrar bajando
- **Dado** que el usuario se desplazó hasta que `#presupuesto` salió por completo del viewport (`0%` visible),
- **Cuando** vuelve a entrar bajando desde `#portfolio` alcanzando `>= 15%` de visibilidad,
- **Entonces** el imán se dispara de nuevo y vuelve a acoplar la tarjeta.

### Escenario 4: Sin disparo al subir desde Condiciones ni en Escritorio
- **Dado** un usuario subiendo desde `#condiciones` hacia `#presupuesto` o navegando en escritorio (`> 768px`),
- **Cuando** `#presupuesto` ingresa al viewport,
- **Entonces** el imán no interviene y el desplazamiento permanece 100% libre.
