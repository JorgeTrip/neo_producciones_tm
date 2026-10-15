# Diseño de Arquitectura C4: Detección de Instancia Única en Lanzador de Desarrollo

## 1. Contexto del Sistema (Nivel 1)

```mermaid
flowchart TD
    Usuario["Desarrollador (Jorge)"]
    subgraph SistemaLanzador["Sistema Lanzador de Entorno de Desarrollo"]
        Bat["iniciarDesarrollo.bat"]
        GestorInstancia["gestorInstancia.mjs"]
        ServidorDev["iniciarDesarrollo.mjs"]
    end
    SO["Sistema Operativo Windows"]
    FS["Sistema de Archivos (os.tmpdir)"]
    Navegador["Navegador Web"]

    Usuario -->|Doble clic| Bat
    Bat -->|1. Pre-flight check| GestorInstancia
    GestorInstancia -->|Consulta lock y PID| FS
    GestorInstancia -->|Verifica si proceso vive| SO
    Bat -->|2. Si no hay duplicado, inicia| ServidorDev
    ServidorDev -->|Abre página| Navegador
```

---

## 2. Diagrama de Contenedores y Componentes (Nivel 2 y 3)

```mermaid
flowchart TD
    subgraph Terminal2["Segunda Ventana (Duplicada por Error)"]
        Bat2["iniciarDesarrollo.bat (Instancia 2)"]
        Check2["gestorInstancia.mjs (--verificar)"]
    end

    subgraph Terminal1["Primera Ventana (Activa)"]
        Bat1["iniciarDesarrollo.bat (Instancia 1)"]
        NodeSupervisor["node --watch (Supervisor)"]
        NodeWorker["iniciarDesarrollo.mjs (Worker)"]
        ServidorHTTP["HTTP Server (Puerto 8000)"]
    end

    LockFile[("Lock Efímero JSON\n(os.tmpdir)")]

    Bat1 --> NodeSupervisor --> NodeWorker --> ServidorHTTP
    NodeWorker -.->|Registra PID y Puerto| LockFile

    Bat2 -->|Ejecuta check| Check2
    Check2 -->|Lee PID y Puerto| LockFile
    Check2 -->|process.kill PID, 0: ALIVE| NodeSupervisor
    Check2 -->|TCP Socket Check: Conectado| ServidorHTTP
    Check2 -->|Imprime aviso y espera 1.5s| Bat2
    Bat2 -->|exit /b 0| Cerrar["Ventana 2 se cierra automáticamente"]
```

---

## 3. Diagrama de Secuencia: Detección y Cierre Automático

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Desarrollador
    participant Win2 as Ventana 2 (CMD)
    participant Gestor as gestorInstancia.mjs
    participant Lock as Lock File (TEMP)
    participant Win1 as Ventana 1 (Servidor Activo)

    Note over Win1: Servidor activo en puerto 8000 (PID 26044)
    Dev->>Win2: Doble clic accidental en iniciarDesarrollo.bat
    Win2->>Gestor: node scripts/gestorInstancia.mjs --verificar
    Gestor->>Lock: Leer archivo dev_lock_neo_producciones.json
    Lock-->>Gestor: { pid: 26044, puerto: 8000 }
    Gestor->>Win1: Liveness check: process.kill(26044, 0) + TCP Ping
    Win1-->>Gestor: Proceso y puerto activos
    Gestor->>Win2: Imprime advertencia en pantalla
    Note over Win2: "⚠️ El entorno ya se encuentra en ejecución... Cerrando..."
    Gestor->>Gestor: Espera delay visual (~1.5s)
    Gestor-->>Win2: exit code 2
    Win2->>Win2: Detecta código 2 y ejecuta exit /b 0
    Note over Win2: Ventana 2 se cierra automáticamente
    Note over Win1: Ventana 1 permanece 100% activa
```

---

## 4. Invariantes Arquitectónicos
1. **Regla de Hierro (< 200 líneas)**: `gestorInstancia.mjs` y `iniciarDesarrollo.mjs` se mantienen modularizados por debajo de las 200 líneas.
2. **Resiliencia ante Locks Obsoletos**: Si el proceso registrado en el lock murió bruscamente, el lock se purga de inmediato y se arranca sin trabas.
3. **Cierre sin Errores**: La salida de la ventana duplicada usa `exit /b 0` en el `.bat`, evitando entrar en bloques de error o disparar `pause`.
