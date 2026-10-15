# Especificación Funcional: Detección de Instancia Única y Cierre Automático en Lanzador de Desarrollo

## 1. Identificación y Propósito
- **Módulo**: Lanzador de Entorno de Desarrollo Local (`iniciarDesarrollo.bat` y `scripts/iniciarDesarrollo.mjs`).
- **Problema**: Al abrir por error una segunda ventana ejecutando el archivo `.bat`, se producía una excepción no controlada `EADDRINUSE` en Node.js, dejando la ventana de terminal colgada e inactiva.
- **Objetivo**: Detectar si ya existe una instancia activa del mismo proyecto; de ser así, informar al usuario y cerrar automáticamente la última ventana tras ~1.5 segundos, preservando intacta la primera.

---

## 2. Criterios de Aceptación (Gherkin)

### Escenario 1: Lanzamiento Inicial Exitoso (Happy Path)
- **Dado** que no hay ninguna instancia previa en ejecución para el proyecto actual.
- **Cuando** el usuario ejecuta `iniciarDesarrollo.bat` (o el script de desarrollo).
- **Entonces** el sistema registra un lock efímero en el directorio temporal con su PID, puerto y ruta del proyecto.
- **Y** el servidor HTTP inicia normalmente, muestra la información en consola y abre el navegador.

### Escenario 2: Detección de Instancia Duplicada del Mismo Proyecto
- **Dado** que ya existe una instancia activa y respondiendo para el proyecto actual.
- **Cuando** el usuario ejecuta por error una segunda vez `iniciarDesarrollo.bat`.
- **Entonces** el detector de pre-flight determina que el mismo proyecto ya está activo.
- **Y** muestra un mensaje explicativo en consola:
  ```text
  ⚠️  El entorno de desarrollo ya se encuentra en ejecución en otra ventana.
  ⏳ Cerrando esta ventana automáticamente...
  ```
- **Y** tras una espera de ~1.5 segundos, la nueva ventana se cierra automáticamente con código de salida limpio (sin error ni `pause`).
- **Y** la primera ventana continúa operando sin interrupción.

### Escenario 3: Recuperación ante Bloqueo Huérfano (Stale Lock)
- **Dado** que existe un archivo de lock en disco debido a un cierre abrupto anterior (ej. cerrar la ventana con 'X').
- **Pero** el PID registrado ya no existe en el sistema operativo y el puerto está libre.
- **Cuando** el usuario ejecuta `iniciarDesarrollo.bat`.
- **Entonces** el sistema detecta que el proceso está inactivo, descarta y elimina el lock obsoleto.
- **Y** procede a iniciar el servidor con normalidad.

### Escenario 4: Puerto Ocupado por Otro Proceso Distinto
- **Dado** que el puerto objetivo está ocupado por otra aplicación o proyecto diferente.
- **Cuando** se ejecuta el lanzador.
- **Entonces** negocia dinámicamente el siguiente puerto disponible (ej. 8001), notifica la reasignación en consola y continúa la ejecución sin cerrarse.

---

## 3. Contratos de Datos del Lock Efímero
El archivo de bloqueo se ubicará en `os.tmpdir()` con el formato `dev_lock_[hashProyecto].json` y contendrá:
```json
{
  "pid": 12345,
  "pidSupervisor": 12344,
  "puerto": 8000,
  "directorio": "E:\\@Documentos\\OneDrive\\IT\\Proyectos\\NEO Producciones (web)\\neo_producciones_tm",
  "iniciadoEn": 1728000000000
}
```
