# NEO Producciones — Sitio Web Oficial

Portal web oficial de **NEO Producciones**, estudio de fotografía profesional y producción audiovisual en Buenos Aires, liderado por Jorge O. Tripodi.

---

## 🏛️ Arquitectura Modular del Proyecto

El proyecto está diseñado bajo principios estrictos de modularización y desacoplamiento, garantizando que ningún archivo exceda el límite de **200 líneas de código**.

```text
/
├── index.html                  ← Orquestador declarativo principal (<150 líneas)
├── styles.css                  ← Punto de entrada global de estilos
├── script.js                   ← Punto de entrada de scripts para navegadores
│
├── estilos/                    ← Submódulos de CSS desacoplados (<200 líneas c/u)
│   ├── variablesYBase.css      ← Variables de tema, reset y tipografías
│   ├── navegacion.css          ← Menú de cabecera y versión móvil
│   ├── hero.css                ← Sección inicial y llamadas a la acción
│   ├── nosotrosYServicios.css  ← Historia, filosofía y servicios
│   ├── eventosYProceso.css     ← Coberturas sociales/corporativas y flujo
│   ├── portafolio.css          ← Grillas de fotos y miniaturas de video
│   ├── visorMultimedia.css     ← Modal lightbox y controles
│   ├── condicionesYContacto.css← Términos y canales de comunicación
│   ├── pieDePagina.css         ← Copyright, redes sociales y scroll reveal
│   ├── responsivo.css          ← Reglas adaptativas para tabletas y móviles
│   └── principal.css           ← Orquestador central de hojas de estilo
│
├── componentes/                ← Componentes declarativos en JavaScript
│   ├── SeccionNosotros.js      ← Vista de quiénes somos y contadores
│   ├── SeccionServicios.js     ← Catálogo de servicios profesionales
│   ├── SeccionEventos.js       ← Detalles de eventos sociales y empresas
│   ├── SeccionProceso.js       ← Pasos secuenciales de trabajo
│   ├── SeccionPortafolio.js    ← Renderizado reactivo de la galería
│   ├── SeccionCondiciones.js   ← Condiciones de contratación
│   └── SeccionContacto.js      ← Tarjetas de contacto y WhatsApp
│
├── scripts/                    ← Módulos de lógica y utilidades
│   ├── utilidadesDom.js        ← Creación segura de nodos (Cero innerHTML)
│   ├── datosPortafolio.js      ← Datos de imágenes, panoramas 360 y videos
│   ├── inicializarComponentes.js ← Montaje declarativo en el DOM
│   ├── menuNavegacion.js       ← Interactividad del menú y scroll spy
│   ├── visorMultimedia.js      ← Lightbox seguro para imágenes y videos
│   ├── visorPanoramico.js      ← Integración del visor 360° con Pannellum
│   ├── animacionesScroll.js    ← Observador de intersección para reveal
│   ├── principal.js            ← Punto de entrada de módulos ES6
│   ├── optimizarImagenes.py    ← Script en Python de compresión a WebP
│   └── README.md               ← Documentación técnica del optimizador
│
└── images/                     ← Recursos gráficos optimizados en WebP/SVG
    ├── logo/                   ← Identidad visual y favicons
    ├── secciones/              ← Fotografías de apoyo de secciones
    ├── portfolio/              ← Galería de fotos (previas, eventos, 360)
    └── social/                 ← Iconografía de redes sociales
```

---

## 🔒 Auditoría de Seguridad y Calidad

El proyecto cumple al 100% con la suite centralizada de auditoría:
- **Regla de Hierro**: 0 archivos que superen las 200 líneas.
- **Análisis SAST**: 0 vulnerabilidades (cero uso de `innerHTML` directo).
- **Nomenclatura**: 100% en español con PascalCase para componentes y camelCase para funciones y estilos.

---

## 🚀 Despliegue en Netlify

1. El repositorio está listo para despliegue estático continuo.
2. Configuración predeterminada:
   - **Publish directory:** `.`
   - **Build command:** *(sin comando de compilación requerido)*
