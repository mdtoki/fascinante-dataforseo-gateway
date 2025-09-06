#!/usr/bin/env node

/**
 * 🚀 FASCINANTE DIGITAL - VERCEL PROJECT SETUP ELITE
 * Automatiza completamente la configuración de proyectos Vercel
 */

import { Vercel } from '@vercel/sdk';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

// Configuración del proyecto
const PROJECT_CONFIG = {
  name: 'sistema',
  framework: 'nextjs',
  domains: ['auditoria.fascinantedigital.com'],
  environmentVariables: [
    {
      key: 'DATAFORSEO_USERNAME',
      value: process.env.DATAFORSEO_USERNAME,
      type: 'plain',
      target: ['production', 'preview', 'development'],
    },
    {
      key: 'DATAFORSEO_PASSWORD',
      value: process.env.DATAFORSEO_PASSWORD,
      type: 'secret',
      target: ['production', 'preview', 'development'],
    },
    {
      key: 'API_GATEWAY_SECRET',
      value: process.env.API_GATEWAY_SECRET,
      type: 'secret',
      target: ['production', 'preview', 'development'],
    },
    {
      key: 'JWT_SECRET',
      value: process.env.JWT_SECRET,
      type: 'secret',
      target: ['production', 'preview', 'development'],
    },
  ],
};

async function setupVercelProject() {
  try {
    console.log('🚀 FASCINANTE DIGITAL - VERCEL PROJECT SETUP ELITE');
    console.log('==================================================');

    // 1. Crear proyecto
    console.log('\n📋 1. Creando proyecto...');
    const project = await vercel.projects.createProject({
      requestBody: {
        name: PROJECT_CONFIG.name,
        framework: PROJECT_CONFIG.framework,
        gitRepository: {
          type: 'github',
          repo: 'alexanderoviedo/sistema',
        },
      },
    });

    console.log(`✅ Proyecto creado: ${project.id}`);

    // 2. Configurar variables de entorno
    console.log('\n🔑 2. Configurando variables de entorno...');
    for (const envVar of PROJECT_CONFIG.environmentVariables) {
      await vercel.projects.createProjectEnv({
        idOrName: project.id,
        requestBody: envVar,
      });
      console.log(`✅ Variable configurada: ${envVar.key}`);
    }

    // 3. Agregar dominios
    console.log('\n🌐 3. Configurando dominios...');
    for (const domain of PROJECT_CONFIG.domains) {
      await vercel.projects.addProjectDomain({
        idOrName: project.id,
        requestBody: {
          name: domain,
        },
      });
      console.log(`✅ Dominio agregado: ${domain}`);
    }

    // 4. Configurar vercel.json
    console.log('\n⚙️ 4. Configurando vercel.json...');
    const vercelConfig = {
      version: 2,
      framework: 'nextjs',
      buildCommand: 'pnpm build',
      outputDirectory: '.next',
      installCommand: 'pnpm install',
      devCommand: 'pnpm dev',
      env: PROJECT_CONFIG.environmentVariables.reduce((acc, env) => {
        acc[env.key] = env.value;
        return acc;
      }, {}),
    };

    console.log('✅ Configuración de vercel.json generada');

    console.log('\n🎉 ¡CONFIGURACIÓN COMPLETA!');
    console.log(`📋 Project ID: ${project.id}`);
    console.log(`🌐 URL: https://${PROJECT_CONFIG.domains[0]}`);

    return project;
  } catch (error) {
    console.error('❌ Error en la configuración:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupVercelProject();
}

export { setupVercelProject, PROJECT_CONFIG };
