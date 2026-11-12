import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import net from "node:net";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

/**
 * Genera la ruta determinista del archivo de bloqueo efímero mediante SHA-256.
 * @param {string} directorioRaiz - Ruta raíz del proyecto.
 * @param {string} [prefijo="dev_lock"] - Prefijo del archivo lock.
 * @returns {string}
 */
export function generarRutaLock(directorioRaiz, prefijo = "dev_lock") {
  const normalizada = path.resolve(directorioRaiz).toLowerCase();
  const hash = crypto.createHash("sha256").update(normalizada).digest("hex").slice(0, 8);
  const nombreBase = path.basename(directorioRaiz).replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(os.tmpdir(), `${prefijo}_${nombreBase}_${hash}.json`);
}

/** Comprueba si un proceso sigue activo en el SO mediante señal 0. */
export function esProcesoActivo(pid) {
  if (!pid || typeof pid !== "number" || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err?.code === "EPERM";
  }
}

/** Determina si el proceso actual corre bajo `node --watch`. */
export function esEjecucionWatch(env = process.env, execArgv = process.execArgv) {
  return Boolean(
    env?.WATCH_REPORT_DEPENDENCIES ||
      env?.DEV_WATCH_ACTIVO === "1" ||
      (Array.isArray(execArgv) && execArgv.some((arg) => arg.startsWith("--watch")))
  );
}

/** Comprueba si un puerto TCP responde activamente. */
export function verificarSocketEnUso(puerto, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port: puerto, host, timeout: 300 });
    socket.on("connect", () => { socket.destroy(); resolve(true); });
    socket.on("error", () => { socket.destroy(); resolve(false); });
    socket.on("timeout", () => { socket.destroy(); resolve(false); });
  });
}

function probarPuertoDisponible(puerto) {
  return new Promise((resolve) => {
    const servidor = net.createServer();
    servidor.once("error", () => resolve(false));
    servidor.once("listening", () => servidor.close(() => resolve(true)));
    servidor.listen(puerto, "0.0.0.0");
  });
}

/** Negocia secuencialmente el primer puerto libre desde el puerto base. */
export async function negociarPuertoLibre(puertoBase = 8000) {
  let puertoActual = puertoBase;
  while (!(await probarPuertoDisponible(puertoActual))) {
    console.log(`⚠️ Puerto ${puertoActual} en uso por otro proceso. Asignando automáticamente puerto ${puertoActual + 1}.`);
    puertoActual += 1;
  }
  return puertoActual;
}

export function leerDatosLock(rutaLock) {
  try {
    if (!fs.existsSync(rutaLock)) return null;
    return JSON.parse(fs.readFileSync(rutaLock, "utf-8"));
  } catch {
    return null;
  }
}

export function guardarLock(rutaLock, datos) {
  try {
    fs.writeFileSync(rutaLock, JSON.stringify(datos, null, 2), "utf-8");
  } catch {}
}

export function eliminarLock(rutaLock) {
  try {
    if (fs.existsSync(rutaLock)) fs.unlinkSync(rutaLock);
  } catch {}
}

export function esInstanciaViva(datosLock) {
  if (!datosLock || typeof datosLock !== "object") return false;
  const supervisorVivo = esProcesoActivo(datosLock.pidSupervisor);
  const workerVivo = esProcesoActivo(datosLock.pidWorker || datosLock.pid);
  return supervisorVivo || workerVivo;
}

/** Evalúa el estado de sesión distinguiendo hot-reload vs instancia externa. */
export async function verificarInstanciaExistente({
  directorioRaiz,
  puertoBase = 8000,
  pidSupervisorActual = process.ppid
}) {
  const rutaLock = generarRutaLock(directorioRaiz);
  const datosLock = leerDatosLock(rutaLock);

  if (datosLock) {
    const supervisorVivo = esProcesoActivo(datosLock.pidSupervisor);
    if (
      datosLock.esModoWatch !== false &&
      supervisorVivo &&
      datosLock.pidSupervisor &&
      pidSupervisorActual &&
      datosLock.pidSupervisor === pidSupervisorActual
    ) {
      return { estaActiva: false, esReinicioEnCaliente: true, datosLock, rutaLock };
    }
    if (!esInstanciaViva(datosLock)) {
      eliminarLock(rutaLock);
      return { estaActiva: false, esReinicioEnCaliente: false, datosLock: null, rutaLock };
    }
    return { estaActiva: true, esReinicioEnCaliente: false, datosLock, rutaLock };
  }

  const nombreBase = path.basename(directorioRaiz).replace(/[^a-zA-Z0-9_-]/g, "_");
  const candidatosLegacy = [
    path.join(os.tmpdir(), `iniciar_dev_${nombreBase}_${puertoBase}.lock`),
    path.join(os.tmpdir(), `iniciar_dev_${nombreBase.replace(/_tm$/, "")}_${puertoBase}.lock`)
  ];

  for (const rutaLegacy of candidatosLegacy) {
    if (fs.existsSync(rutaLegacy)) {
      if (await verificarSocketEnUso(puertoBase)) {
        return { estaActiva: true, esReinicioEnCaliente: false, datosLock: { puerto: puertoBase, legacy: true }, rutaLock: rutaLegacy };
      }
      eliminarLock(rutaLegacy);
    }
  }

  return { estaActiva: false, esReinicioEnCaliente: false, datosLock: null, rutaLock };
}

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

const esScriptPrincipal = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (esScriptPrincipal && process.argv.includes("--verificar")) {
  ejecutarVerificacionCli();
}
