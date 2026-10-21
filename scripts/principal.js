/**
 * Punto de Entrada Principal de Scripts - NEO Producciones.
 * Orquesta la inicialización de módulos interactivos y componentes del sitio.
 */
import './menuNavegacion.js';
import './visorMultimedia.js';
import './visorPanoramico.js';
import './inicializarComponentes.js';
import { inicializarAjustadorTituloHero } from './ajustadorTituloHero.js';
import '../componentes/ModalAcercaDe.js';

inicializarAjustadorTituloHero();
