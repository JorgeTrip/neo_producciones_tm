import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import net from "node:net";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

/**
 * Módulo para la gestión de instancia única del entorno de desarrollo local.
 * Previene colisiones por doble clic en archivos batch y gestiona locks efímeros.
 */

/**
 * Genera la ruta determinista del archivo de bloqueo efímero para el proyecto.
 *
 * @param {string} directorioRaiz - Ruta raíz del proyecto.
 * @param {string} [prefijo="dev_lock"] - Prefijo del archivo lock.
 * @returns {string} Ruta absoluta del archivo en el directorio temporal.
 */
export function generarRutaLock(directorioRaiz, prefijo = "dev_lock") {
    const normalizada = path.resolve(directorioRaiz).toLowerCase();
    const hash = crypto.createHash("sha256").update(normalizada).digest("hex").slice(0, 8);
    const nombreBase = path.basename(directorioRaiz).replace(/[^a-zA-Z0-9_-]/g, "_");
    return path.join(os.tmpdir(), `${prefijo}_${nombreBase}_${hash}.json`);
}

/**
 * Comprueba si un proceso del sistema operativo continúa en ejecución.
 *
 * @param {number} pid - Identificador del proceso.
 * @returns {boolean} True si el proceso está activo.
 */
export function esProcesoActivo(pid) {
    if (!pid || typeof pid !== "number" || pid <= 0) return false;
    try {
        process.kill(pid, 0);
        return true;
    } catch {
        return false;
    }
}

/**
 * Comprueba si un puerto TCP está escuchando activamente conexiones.
 *
 * @param {number} puerto - Puerto a comprobar.
 * @param {string} [host="127.0.0.1"] - Dirección objetivo.
 * @returns {Promise<boolean>} True si responde al socket.
 */
export function verificarSocketEnUso(puerto, host = "127.0.0.1") {
    return new Promise((resolve) => {
        const socket = net.createConnection({ port: puerto, host, timeout: 300 });
        socket.on("connect", () => {
            socket.destroy();
            resolve(true);
        });
        socket.on("error", () => {
            socket.destroy();
            resolve(false);
        });
        socket.on("timeout", () => {
            socket.destroy();
            resolve(false);
        });
    });
}

/**
 * Lee y parsea los datos del archivo de bloqueo efímero.
 *
 * @param {string} rutaLock - Ruta del archivo lock.
 * @returns {object|null} Datos del lock o null si no existe o está corrupto.
 */
export function leerDatosLock(rutaLock) {
    try {
        if (!fs.existsSync(rutaLock)) return null;
        const contenido = fs.readFileSync(rutaLock, "utf-8");
        return JSON.parse(contenido);
    } catch {
        return null;
    }
}

/**
 * Guarda los metadatos de la sesión en el archivo de bloqueo efímero.
 *
 * @param {string} rutaLock - Ruta donde persistir el lock.
 * @param {object} datos - Objeto con pid, puerto y metadatos.
 */
export function guardarLock(rutaLock, datos) {
    try {
        fs.writeFileSync(rutaLock, JSON.stringify(datos, null, 2), "utf-8");
    } catch {
        // En caso de fallo de escritura, no se interrumpe la ejecución
    }
}

/**
 * Elimina el archivo de bloqueo efímero de forma segura e idempotente.
 *
 * @param {string} rutaLock - Ruta del archivo lock.
 */
export function eliminarLock(rutaLock) {
    try {
        if (fs.existsSync(rutaLock)) {
            fs.unlinkSync(rutaLock);
        }
    } catch {
        // Ignorar posibles condiciones de carrera en el borrado
    }
}

/**
 * Evalúa si una instancia registrada sigue viva en el sistema.
 *
 * @param {object|null} datosLock - Datos del lock almacenado.
 * @returns {boolean} True si el proceso del supervisor o worker existe.
 */
export function esInstanciaViva(datosLock) {
    if (!datosLock || typeof datosLock !== "object") return false;
    const supervisorVivo = esProcesoActivo(datosLock.pidSupervisor);
    const workerVivo = esProcesoActivo(datosLock.pid);
    return supervisorVivo || workerVivo;
}

/**
 * Comprueba si ya existe una instancia previa del mismo proyecto activa.
 * Purga de forma transparente cualquier lock obsoleto o huérfano.
 *
 * @param {object} opciones - Parámetros de configuración.
 * @param {string} opciones.directorioRaiz - Directorio del proyecto.
 * @param {number} [opciones.puertoBase=8000] - Puerto base a verificar.
 * @returns {Promise<{estaActiva: boolean, datosLock: object|null, rutaLock: string}>}
 */
export async function verificarInstanciaExistente({ directorioRaiz, puertoBase = 8000 }) {
    const rutaLock = generarRutaLock(directorioRaiz);
    const datosLock = leerDatosLock(rutaLock);

    if (datosLock) {
        const estaViva = esInstanciaViva(datosLock);
        if (!estaViva) {
            eliminarLock(rutaLock);
            return { estaActiva: false, datosLock: null, rutaLock };
        }
        return { estaActiva: true, datosLock, rutaLock };
    }

    const nombreBase = path.basename(directorioRaiz).replace(/[^a-zA-Z0-9_-]/g, "_");
    const candidatosLegacy = [
        path.join(os.tmpdir(), `iniciar_dev_${nombreBase}_${puertoBase}.lock`),
        path.join(os.tmpdir(), `iniciar_dev_${nombreBase.replace(/_tm$/, "")}_${puertoBase}.lock`)
    ];

    for (const rutaLegacy of candidatosLegacy) {
        if (fs.existsSync(rutaLegacy)) {
            const socketActivo = await verificarSocketEnUso(puertoBase);
            if (socketActivo) {
                return { estaActiva: true, datosLock: { puerto: puertoBase, legacy: true }, rutaLock: rutaLegacy };
            }
            eliminarLock(rutaLegacy);
        }
    }

    return { estaActiva: false, datosLock: null, rutaLock };
}

/**
 * Ejecuta la verificación desde la terminal antes de arrancar el servidor.
 * Si detecta una instancia duplicada, muestra aviso, espera el delay y sale.
 *
 * @param {object} opciones - Opciones de comprobación CLI.
 */
export async function ejecutarVerificacionCli(opciones = {}) {
    const directorioRaiz = opciones.directorioRaiz || path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    const puertoBase = opciones.puertoBase || Number(process.env.PORT) || 8000;
    const retrasoMs = opciones.retrasoCierreMs ?? 1500;

    const { estaActiva } = await verificarInstanciaExistente({ directorioRaiz, puertoBase });

    if (estaActiva) {
        console.log("\n====================================================");
        console.log("⚠️  El entorno de desarrollo ya se encuentra en ejecución en otra ventana.");
        console.log("⏳ Cerrando esta ventana automáticamente...");
        console.log("====================================================\n");
        await new Promise((resolve) => setTimeout(resolve, retrasoMs));
        process.exit(2);
    }
    process.exit(0);
}

// Invocación directa como CLI si se ejecuta el archivo con --verificar
const esScriptPrincipal = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (esScriptPrincipal && process.argv.includes("--verificar")) {
    ejecutarVerificacionCli();
}
