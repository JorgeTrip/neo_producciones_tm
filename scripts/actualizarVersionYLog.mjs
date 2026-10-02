/**
 * Utilidad de Automatización CI/CD: Versionado Semántico y Registro de Cambios.
 * Analiza el último commit, determina el bump correspondiente (major, minor, patch),
 * actualiza version.json y reconstruye git-log.txt para consumo público en la app.
 */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const rutaRaiz = process.cwd();
const rutaVersion = path.join(rutaRaiz, 'version.json');
const rutaGitLog = path.join(rutaRaiz, 'git-log.txt');

/**
 * Ejecuta un comando en la consola de forma síncrona y segura mediante spawnSync.
 * @param {string} comando - Binario o ejecutable a correr.
 * @param {string[]} argumentos - Lista de argumentos del comando.
 * @returns {string} Salida en texto plano.
 */
function ejecutar(comando, argumentos) {
  try {
    const res = spawnSync(comando, argumentos, { encoding: 'utf-8', cwd: rutaRaiz });
    return (res.stdout || '').trim();
  } catch (error) {
    console.error(`Error al ejecutar "${comando}":`, error.message);
    return '';
  }
}

/**
 * Incrementa la versión semántica según el tipo de cambio detectado.
 * @param {string} versionActual - Versión en formato "X.Y.Z".
 * @param {'major' | 'minor' | 'patch'} tipoBump - Nivel de incremento.
 * @returns {string} Nueva versión semántica.
 */
function calcularNuevaVersion(versionActual, tipoBump) {
  const partes = versionActual.split('.').map(n => parseInt(n, 10) || 0);
  let [mayor = 1, menor = 0, parche = 0] = partes;

  if (tipoBump === 'major') {
    mayor += 1;
    menor = 0;
    parche = 0;
  } else if (tipoBump === 'minor') {
    menor += 1;
    parche = 0;
  } else {
    parche += 1;
  }

  return `${mayor}.${menor}.${parche}`;
}

/**
 * Función principal del flujo de versionado automatizado.
 */
function procesarVersionado() {
  const ultimoMensaje = ejecutar('git', ['log', '-1', '--pretty=%B']);
  console.log(`Último commit analizado: "${ultimoMensaje}"`);

  if (ultimoMensaje.includes('[skip ci]')) {
    console.log('El commit incluye [skip ci]. Se omite el proceso de versionado.');
    return;
  }

  // Determinación de bump semántico (Regla #7)
  let tipoBump = 'patch';
  if (/BREAKING[:\s]/i.test(ultimoMensaje)) {
    tipoBump = 'major';
  } else if (/^(feat[:\s]|🚀)/i.test(ultimoMensaje)) {
    tipoBump = 'minor';
  } else if (/^(fix[:\s]|🔧)/i.test(ultimoMensaje)) {
    tipoBump = 'patch';
  }

  // Leer y actualizar version.json
  let datosVersion = { version: '1.0.0', autor: 'Jorge O. Tripodi' };
  if (fs.existsSync(rutaVersion)) {
    try {
      datosVersion = JSON.parse(fs.readFileSync(rutaVersion, 'utf-8'));
    } catch (e) {
      console.warn('Error al leer version.json existente:', e.message);
    }
  }

  const versionAnterior = datosVersion.version || '1.0.0';
  const versionNueva = calcularNuevaVersion(versionAnterior, tipoBump);
  datosVersion.version = versionNueva;
  datosVersion.fechaActualizacion = new Date().toISOString().split('T')[0];

  fs.writeFileSync(rutaVersion, JSON.stringify(datosVersion, null, 2) + '\n', 'utf-8');
  console.log(`Versión actualizada: ${versionAnterior} ➔ ${versionNueva} (${tipoBump})`);

  // Regenerar git-log.txt con todo el historial de commits
  const logFormateado = ejecutar('git', ['log', '--pretty=format:* %ad [%h] %s (%an)', '--date=short']);
  fs.writeFileSync(rutaGitLog, logFormateado + '\n', 'utf-8');
  console.log('Archivo git-log.txt actualizado correctamente.');
}

procesarVersionado();
