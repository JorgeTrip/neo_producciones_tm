# Optimizador de Imágenes a WebP

Herramienta de automatización desarrollada en Python para la optimización de recursos gráficos web.

* **Creador y Autor:** Jorge O. Tripodi  
* **Versión:** 1.0  
* **Idioma:** Español  

---

## 📋 Descripción del Script

Este script (`optimizar_imagenes.py`) tiene como objetivo escanear el directorio de imágenes del proyecto, identificar aquellos archivos en formatos tradicionales y pesados (`.png`, `.jpg`, `.jpeg`) y convertirlos de forma automática al formato de última generación **WebP**.

Al aplicar esta compresión, el sitio web reduce su tamaño de descarga acumulado en más de un **90%** (bajando el peso de imágenes de **~92 MB a ~8.2 MB**), lo que mejora drásticamente los tiempos de respuesta del portal (Largest Contentful Paint) y potencia el posicionamiento en motores de búsqueda (SEO).

---

## ⚙️ Características Técnicas

* **Instalación Automática de Dependencias:** Si el módulo de procesamiento de imágenes `Pillow` no se encuentra en el sistema, el script intentará instalarlo de manera autónoma mediante `pip`.
* **Portabilidad de Rutas:** Calcula las ubicaciones de forma relativa al script, permitiendo su ejecución sin importar la carpeta de origen en la consola.
* **Exclusión de Archivos Críticos:** El script ignora automáticamente favicons e íconos (`favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`) para evitar incompatibilidades en navegadores heredados.
* **Compresión Balanceada:** Utiliza un factor de calidad `quality=80` y el método de compresión de mayor nivel (`method=6`) para obtener el tamaño de archivo más pequeño posible sin pérdida perceptible de nitidez o fidelidad de color.

---

## 🚀 Requisitos e Instrucciones de Uso

### Requisitos Previos
* Tener instalado **Python 3.x** en el sistema.

### Ejecución
Abre tu consola o terminal (PowerShell en Windows, Terminal en macOS/Linux), sitúate en el directorio raíz del proyecto y ejecuta el siguiente comando:

```bash
python scripts/optimizar_imagenes.py
```

### Flujo del Proceso
1. El script imprimirá la ruta del directorio local que contiene las imágenes.
2. Verificará la instalación de `Pillow` (si no existe, la instalará de inmediato).
3. Listará cada archivo rasterizado compatible, detallando su peso original.
4. Generará el nuevo archivo `.webp` optimizado y reportará el porcentaje exacto de ahorro de ancho de banda obtenido en cada conversión.
