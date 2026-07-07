#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
============================================================================
OPTIMIZADOR DE IMÁGENES A WEBP
============================================================================
Script: optimizar_imagenes.py
Creador: Jorge O. Tripodi
Fecha: 2026
Descripción: Utilidad en Python para automatizar la conversión y compresión 
             de imágenes gigantes (PNG, JPG, JPEG) al formato WebP de alto 
             rendimiento para la web.

Este script fue diseñado para integrarse en el flujo de publicación del sitio,
permitiendo mantener el repositorio liviano y maximizar la velocidad de carga
móvil del portal.
============================================================================
"""

import os
import sys

def optimizar_imagenes():
    """
    Escanea la carpeta de imágenes del proyecto y convierte todos los archivos
    PNG, JPG y JPEG al formato optimizado WebP.
    
    Esta función se encarga de:
    1. Validar la existencia de la carpeta 'imagenes'.
    2. Comprobar e instalar la biblioteca Pillow (PIL) en tiempo de ejecución.
    3. Excluir elementos críticos del sistema (como favicons).
    4. Procesar las imágenes aplicando compresión controlada (calidad 80).
    """
    # Se define la ruta base de forma relativa a la ubicación del script
    # para asegurar la portabilidad si se ejecuta desde distintos directorios.
    directorio_base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dir_imagenes = os.path.join(directorio_base, "imagenes")
    
    print(f"Buscando imágenes en: {dir_imagenes}")
    if not os.path.exists(dir_imagenes):
        print("Error: No se encontró la carpeta 'imagenes'. Verifica la estructura del proyecto.")
        return
        
    # Se realiza una importación diferida de Pillow (PIL)
    # Si no está instalada localmente en la máquina del usuario, el script
    # intenta instalarla de forma transparente mediante pip para evitar bloqueos.
    try:
        from PIL import Image
    except ImportError:
        print("La biblioteca 'Pillow' no está instalada en el sistema.")
        print("Intentando instalar Pillow automáticamente...")
        import subprocess
        try:
            # Se ejecuta el instalador pip en un proceso secundario seguro
            subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
            from PIL import Image
            print("Pillow instalada y cargada correctamente.")
        except Exception as e:
            print(f"Error al instalar Pillow de forma automática: {e}")
            print("Por favor, ejecuta 'pip install Pillow' manualmente en tu terminal y vuelve a correr el script.")
            return

    # Lista de archivos a omitir (exclusiones de sistema)
    # Los favicons e íconos de Apple Touch deben quedarse en formato PNG nativo
    # para mantener compatibilidad absoluta con motores antiguos de navegadores.
    excluir = ["favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png"]

    # Extensiones de formato rasterizado a procesar
    extensiones_compatibles = (".png", ".jpg", ".jpeg")
    
    for filename in os.listdir(dir_imagenes):
        if filename in excluir:
            print(f"Omitiendo (exclusión de sistema): {filename}")
            continue
            
        filepath = os.path.join(dir_imagenes, filename)
        
        # Se procesan únicamente archivos que coincidan con las extensiones compatibles
        if os.path.isfile(filepath) and filename.lower().endswith(extensiones_compatibles):
            nombre_sin_ext, ext = os.path.splitext(filename)
            nuevo_filename = f"{nombre_sin_ext}.webp"
            nuevo_filepath = os.path.join(dir_imagenes, nuevo_filename)
            
            try:
                tamano_original = os.path.getsize(filepath)
                print(f"Procesando: {filename} ({tamano_original / 1024 / 1024:.2f} MB)...")
                
                # Se abre la imagen y se realiza la conversión
                with Image.open(filepath) as img:
                    # Se guarda en formato WEBP.
                    # Se utiliza quality=80 que representa el punto de equilibrio óptimo 
                    # entre reducción de peso y fidelidad cromática visual.
                    # method=6 fuerza a la biblioteca a usar la compresión WebP más lenta
                    # pero con el menor tamaño de archivo resultante posible.
                    img.save(nuevo_filepath, "WEBP", quality=80, method=6)
                    
                tamano_nuevo = os.path.getsize(nuevo_filepath)
                ahorro = (1 - (tamano_nuevo / tamano_original)) * 100
                print(f"  -> Creado: {nuevo_filename} ({tamano_nuevo / 1024 / 1024:.2f} MB) - Ahorro: {ahorro:.1f}%")
                
            except Exception as e:
                print(f"  Error al procesar la imagen {filename}: {e}")

if __name__ == "__main__":
    optimizar_imagenes()
