#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
============================================================================
OPTIMIZADOR RECURSIVO DE IMÁGENES A WEBP
============================================================================
Script: optimizarImagenes.py
Creador: Adaptado para NEO Producciones
Descripción: Utilidad en Python para escanear recursivamente el directorio de
             imágenes y convertirlas al formato WebP optimizado para web,
             reduciendo el peso de la página y mejorando el LCP.
============================================================================
"""

import os
import sys

def optimizarImagenes():
    """
    Escanea la carpeta de imágenes de manera recursiva y convierte
    archivos PNG, JPG y JPEG al formato WebP.
    """
    # Se define la ruta de la carpeta 'images' relativa al directorio de este script.
    directorio_base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dir_imagenes = os.path.join(directorio_base, "images")
    
    print(f"Buscando imágenes de forma recursiva en: {dir_imagenes}")
    if not os.path.exists(dir_imagenes):
        print("Error: No se encontró la carpeta 'images'. Verifica la estructura del proyecto.")
        return
        
    # Se realiza la importación diferida de Pillow (PIL).
    # Si no está instalada, se intenta instalar a través de pip automáticamente.
    try:
        from PIL import Image
    except ImportError:
        print("La biblioteca 'Pillow' no está instalada en el sistema.")
        print("Intentando instalar Pillow automáticamente...")
        import subprocess
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
            from PIL import Image
            print("Pillow se instaló y cargó correctamente.")
        except Exception as errorInstalacion:
            print(f"Error al instalar Pillow automáticamente: {errorInstalacion}")
            print("Por favor, ejecuta 'pip install Pillow' manualmente y vuelve a correr el script.")
            return

    # Exclusiones de imágenes del sistema que deben conservarse en su formato original
    exclusiones = ["favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png"]
    formatosCompatibles = (".png", ".jpg", ".jpeg")
    
    # Recorrido recursivo utilizando os.walk para escanear todas las subcarpetas del proyecto
    for root, _, archivos in os.walk(dir_imagenes):
        for nombreArchivo in archivos:
            if nombreArchivo in exclusiones:
                print(f"Omitiendo (exclusión de sistema): {nombreArchivo}")
                continue
                
            rutaArchivo = os.path.join(root, nombreArchivo)
            
            # Se procesan las extensiones compatibles ignorando mayúsculas/minúsculas
            if nombreArchivo.lower().endswith(formatosCompatibles):
                nombreSinExt, _ = os.path.splitext(nombreArchivo)
                nuevoNombreArchivo = f"{nombreSinExt}.webp"
                nuevaRutaArchivo = os.path.join(root, nuevoNombreArchivo)
                
                try:
                    tamanoOriginal = os.path.getsize(rutaArchivo)
                    print(f"Procesando: {nombreArchivo} ({tamanoOriginal / 1024 / 1024:.2f} MB)...")
                    
                    with Image.open(rutaArchivo) as imagenOriginal:
                        # Se guarda la imagen en formato WebP.
                        # Calidad 80: Excelente balance entre compresión y calidad visual.
                        # method=6: Compresión más lenta para lograr el menor tamaño de archivo.
                        imagenOriginal.save(nuevaRutaArchivo, "WEBP", quality=80, method=6)
                        
                    tamanoNuevo = os.path.getsize(nuevaRutaArchivo)
                    ahorro = (1 - (tamanoNuevo / tamanoOriginal)) * 100
                    print(f"  -> Creado: {nuevoNombreArchivo} ({tamanoNuevo / 1024 / 1024:.2f} MB) - Ahorro: {ahorro:.1f}%")
                    
                except Exception as errorProcesamiento:
                    print(f"  Error al procesar la imagen {nombreArchivo}: {errorProcesamiento}")

if __name__ == "__main__":
    optimizarImagenes()
