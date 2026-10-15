@echo off
setlocal
cd /d "%~dp0"

echo ====================================================
echo   Iniciando NEO Producciones - Modo Desarrollo
echo ====================================================
echo.

node scripts/gestorInstancia.mjs --verificar
if %ERRORLEVEL% EQU 2 (
    exit /b 0
)

node --watch-path=index.html --watch-path=styles.css --watch-path=script.js --watch-path=componentes --watch-path=estilos --watch scripts/iniciarDesarrollo.mjs
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================================
    echo Ocurrio un error al ejecutar el servidor.
    echo ====================================================
    pause
)
