@echo off
REM ============================================================================
REM Script para lanzar el servidor local de desarrollo y permitir conexion movil
REM NEO Producciones
REM ============================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ===================================================
echo   Iniciando NEO Producciones - Servidor Local
echo ===================================================
echo.

REM Verificar si Python esta disponible en el sistema
where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] No se encontro Python en el sistema.
    echo Por favor asegurese de tener Python instalado y agregado al PATH.
    echo.
    pause
    exit /b 1
)

set PUERTO=8000

REM Obtener la direccion IP local en la red (Wi-Fi o LAN) mediante script auxiliar
set IP_LOCAL=
for /f %%A in ('python scripts\obtenerIpLocal.py 2^>nul') do (
    set "IP_LOCAL=%%A"
)

set URL_LOCAL=http://localhost:%PUERTO%

echo [INFO] Directorio raiz: %CD%
echo.
echo ===================================================
echo   ACCESOS AL ENTORNO DE DESARROLLO
echo ===================================================
echo   - Desde esta PC:        %URL_LOCAL%
if not "%IP_LOCAL%"=="" (
    echo   - Desde tu Celular:     http://%IP_LOCAL%:%PUERTO%
) else (
    echo   - Desde tu Celular:     http://TU_IP_LOCAL:%PUERTO%
)
echo ===================================================
echo.
echo [INSTRUCCIONES PARA TU CELULAR]:
echo   1. Asegurate de que el celular este conectado a la misma red Wi-Fi que esta PC.
echo   2. Abre el navegador del celular e ingresa:
if not "%IP_LOCAL%"=="" (
    echo      http://%IP_LOCAL%:%PUERTO%
) else (
    echo      http://TU_IP_LOCAL:%PUERTO%
)
echo   3. Si no carga, verifica que el Firewall de Windows permita conexiones entrantes
echo      en el puerto %PUERTO% o para la aplicacion Python.
echo.
echo Presione Ctrl+C en esta consola para detener el servidor.
echo ---------------------------------------------------

REM Abrir navegador en la PC local
start "" "%URL_LOCAL%"

REM Iniciar servidor HTTP escuchando en todas las interfaces de red (0.0.0.0)
python -m http.server %PUERTO% --bind 0.0.0.0

endlocal
