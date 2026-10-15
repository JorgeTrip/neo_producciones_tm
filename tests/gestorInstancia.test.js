/**
 * Pruebas Unitarias TDD: Gestor de Instancia Única del Entorno de Desarrollo.
 * Valida la detección de procesos activos, gestión de locks efímeros y cierre defensivo.
 */
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
    generarRutaLock,
    esProcesoActivo,
    leerDatosLock,
    guardarLock,
    eliminarLock,
    esInstanciaViva,
    verificarInstanciaExistente
} from "../scripts/gestorInstancia.mjs";

const DIRECTORIO_PRUEBA = path.join(os.tmpdir(), "proyecto_prueba_tdd");
const RUTA_LOCK_PRUEBA = generarRutaLock(DIRECTORIO_PRUEBA);

describe("Gestor de Instancia Única - Ciclo TDD", () => {
    beforeEach(() => {
        if (fs.existsSync(RUTA_LOCK_PRUEBA)) {
            fs.unlinkSync(RUTA_LOCK_PRUEBA);
        }
    });

    afterEach(() => {
        if (fs.existsSync(RUTA_LOCK_PRUEBA)) {
            fs.unlinkSync(RUTA_LOCK_PRUEBA);
        }
    });

    it("debe generar una ruta de lock determinista basada en el directorio del proyecto", () => {
        const ruta1 = generarRutaLock(DIRECTORIO_PRUEBA);
        const ruta2 = generarRutaLock(DIRECTORIO_PRUEBA);
        assert.equal(ruta1, ruta2);
        assert.equal(path.dirname(ruta1), os.tmpdir());
        assert.match(path.basename(ruta1), /^dev_lock_/);
    });

    it("debe detectar correctamente si un proceso del SO está vivo o no", () => {
        // El proceso actual de test siempre está vivo
        assert.equal(esProcesoActivo(process.pid), true);
        // Un PID ridículamente alto no existe
        assert.equal(esProcesoActivo(99999999), false);
        // Argumentos inválidos deben retornar false
        assert.equal(esProcesoActivo(null), false);
        assert.equal(esProcesoActivo(0), false);
    });

    it("debe guardar y leer los datos del lock efímero en formato JSON", () => {
        const datos = {
            pid: process.pid,
            pidSupervisor: process.ppid || process.pid,
            puerto: 8000,
            directorio: DIRECTORIO_PRUEBA,
            iniciadoEn: Date.now()
        };

        guardarLock(RUTA_LOCK_PRUEBA, datos);
        const leido = leerDatosLock(RUTA_LOCK_PRUEBA);

        assert.ok(leido);
        assert.equal(leido.pid, process.pid);
        assert.equal(leido.puerto, 8000);
        assert.equal(leido.directorio, DIRECTORIO_PRUEBA);
    });

    it("debe retornar null al leer un archivo de lock inexistente o corrupto", () => {
        assert.equal(leerDatosLock(path.join(os.tmpdir(), "archivo_inexistente.lock")), null);

        // Archivo corrupto
        fs.writeFileSync(RUTA_LOCK_PRUEBA, "no-es-json{");
        assert.equal(leerDatosLock(RUTA_LOCK_PRUEBA), null);
    });

    it("debe eliminar el archivo de lock efímero sin lanzar errores si no existe", () => {
        guardarLock(RUTA_LOCK_PRUEBA, { pid: process.pid });
        assert.equal(fs.existsSync(RUTA_LOCK_PRUEBA), true);

        eliminarLock(RUTA_LOCK_PRUEBA);
        assert.equal(fs.existsSync(RUTA_LOCK_PRUEBA), false);

        // Llamada repetida idempotente
        assert.doesNotThrow(() => eliminarLock(RUTA_LOCK_PRUEBA));
    });

    it("debe identificar si una instancia está viva según su PID registrado", () => {
        const lockVivo = { pid: process.pid, puerto: 8000 };
        const lockMuerto = { pid: 99999999, puerto: 8000 };

        assert.equal(esInstanciaViva(lockVivo), true);
        assert.equal(esInstanciaViva(lockMuerto), false);
        assert.equal(esInstanciaViva(null), false);
    });

    it("debe purgar un lock huérfano cuando el proceso ya no existe", async () => {
        guardarLock(RUTA_LOCK_PRUEBA, {
            pid: 99999999,
            puerto: 8000,
            directorio: DIRECTORIO_PRUEBA
        });

        const resultado = await verificarInstanciaExistente({
            directorioRaiz: DIRECTORIO_PRUEBA,
            puertoBase: 8000
        });

        assert.equal(resultado.estaActiva, false);
        assert.equal(fs.existsSync(RUTA_LOCK_PRUEBA), false);
    });

    it("debe reportar instancia activa cuando el lock corresponde a un proceso vivo", async () => {
        guardarLock(RUTA_LOCK_PRUEBA, {
            pid: process.pid,
            puerto: 8000,
            directorio: DIRECTORIO_PRUEBA
        });

        const resultado = await verificarInstanciaExistente({
            directorioRaiz: DIRECTORIO_PRUEBA,
            puertoBase: 8000
        });

        assert.equal(resultado.estaActiva, true);
        assert.equal(resultado.datosLock?.pid, process.pid);
    });
});
