#!/usr/bin/env node
/**
 * @fileoverview Servidor MCP local para la integración de Instagram y Antigravity.
 * Expone herramientas estándar que permiten al agente listar el perfil, publicar fotos y analizar pauta.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { obtenerConfiguracion } from '../infraestructura/configuracionEntorno.js';
import { ClienteMetaGraphApi } from '../infraestructura/clienteMetaGraphApi.js';
import { PublicadorInstagramServicio } from '../aplicacion/publicadorInstagramServicio.js';
import { AnaliticaMetricasServicio } from '../aplicacion/analiticaMetricasServicio.js';

async function iniciarServidorMcp() {
  const config = obtenerConfiguracion();
  const clienteMeta = new ClienteMetaGraphApi({
    cuentaId: config.INSTAGRAM_ACCOUNT_ID,
    tokenAcceso: config.INSTAGRAM_ACCESS_TOKEN,
  });

  const publicador = new PublicadorInstagramServicio(clienteMeta);
  const analitica = new AnaliticaMetricasServicio(clienteMeta);

  const servidor = new Server(
    { name: 'mcp-instagram-neo', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  // Listado de herramientas disponibles para el agente
  servidor.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'obtener_perfil_instagram',
        description: 'Obtiene el perfil comercial, seguidores y publicaciones de @neo_producciones_tm.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'consultar_metricas_y_pauta',
        description: 'Audita publicaciones recientes, engagement y detecta candidatos para Meta Ads (+30% sobre el promedio).',
        inputSchema: {
          type: 'object',
          properties: {
            limite: { type: 'number', description: 'Cantidad de publicaciones a analizar (defecto: 10).' },
          },
        },
      },
      {
        name: 'publicar_foto_instagram',
        description: 'Publica una fotografía en @neo_producciones_tm a partir de su URL pública y texto/copy.',
        inputSchema: {
          type: 'object',
          properties: {
            nombreArchivo: { type: 'string', description: 'Nombre de la imagen local.' },
            urlPublica: { type: 'string', description: 'URL pública (HTTPS) temporal de la imagen para Meta.' },
            textoPublicacion: { type: 'string', description: 'Texto del pie de foto con hashtags de NEO Producciones.' },
          },
          required: ['nombreArchivo', 'urlPublica', 'textoPublicacion'],
        },
      },
      {
        name: 'publicar_carrusel_instagram',
        description: 'Publica un carrusel (álbum) de 2 a 10 fotos en @neo_producciones_tm con texto y hashtags.',
        inputSchema: {
          type: 'object',
          properties: {
            nombresArchivos: {
              type: 'array',
              items: { type: 'string' },
              description: 'Nombres de los archivos locales incluidos en el carrusel.',
            },
            urlsPublicas: {
              type: 'array',
              items: { type: 'string' },
              description: 'URLs públicas (HTTPS) de cada imagen en orden secuencial.',
            },
            textoPublicacion: {
              type: 'string',
              description: 'Texto del pie de foto y hashtags para el carrusel.',
            },
          },
          required: ['nombresArchivos', 'urlsPublicas', 'textoPublicacion'],
        },
      },
    ],
  }));

  // Ejecución de las herramientas invocadas por el agente
  servidor.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      if (name === 'obtener_perfil_instagram') {
        const datos = await clienteMeta.obtenerPerfil();
        return { content: [{ type: 'text', text: JSON.stringify(datos, null, 2) }] };
      }

      if (name === 'consultar_metricas_y_pauta') {
        const resultado = await analitica.auditarRendimiento(args || {});
        return { content: [{ type: 'text', text: JSON.stringify(resultado, null, 2) }] };
      }

      if (name === 'publicar_foto_instagram') {
        const { nombreArchivo, textoPublicacion, urlPublica } = args;
        const resultado = await publicador.publicar({ nombreArchivo, textoPublicacion }, urlPublica);
        return { content: [{ type: 'text', text: JSON.stringify(resultado, null, 2) }] };
      }

      if (name === 'publicar_carrusel_instagram') {
        const { nombresArchivos, textoPublicacion, urlsPublicas } = args;
        const resultado = await publicador.publicarCarrusel(
          { nombresArchivos, textoPublicacion },
          urlsPublicas
        );
        return { content: [{ type: 'text', text: JSON.stringify(resultado, null, 2) }] };
      }

      throw new Error(`Herramienta no reconocida: ${name}`);
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Error al ejecutar ${name}: ${error.message}` }],
      };
    }
  });

  const transporte = new StdioServerTransport();
  await servidor.connect(transporte);
}

iniciarServidorMcp().catch((error) => {
  process.stderr.write(`Fallo crítico al iniciar servidor MCP: ${error.message}\n`);
  process.exit(1);
});
