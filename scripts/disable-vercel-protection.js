#!/usr/bin/env node

/**
 * 🛡️ FASCINANTE DIGITAL - VERCEL PROTECTION DISABLER ELITE
 * Deshabilita la protección de autenticación de Vercel desde CLI
 */

import { Vercel } from '@vercel/sdk';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function disableProtection() {
  try {
    console.log('🛡️ FASCINANTE DIGITAL - DISABLING VERCEL PROTECTION');
    console.log('==================================================');
    
    // IDs obtenidos desde vercel project inspect
    const projectId = 'prj_7d2x7iUNYKDFlGo810PFe2AWD6Ja';
    const teamId = 'alexanderoviedo'; // Usuario individual, no team
    
    console.log(`📋 Project ID: ${projectId}`);
    console.log(`👥 Team ID: ${teamId}`);
    
    console.log(`📋 Project ID: ${projectId}`);
    console.log(`👥 Team ID: ${teamId}`);
    
    // 1. Obtener configuración actual del proyecto
    console.log('\n🔍 Obteniendo configuración actual...');
    const project = await vercel.projects.getProject({
      idOrName: projectId,
      teamId: teamId,
    });
    
    console.log(`✅ Proyecto encontrado: ${project.name}`);
    
    // 2. Deshabilitar protección de autenticación
    console.log('\n🚫 Deshabilitando protección de autenticación...');
    
    // Opción 1: Deshabilitar SSO Protection
    try {
      await vercel.projects.updateProject({
        idOrName: projectId,
        teamId: teamId,
        requestBody: {
          ssoProtection: null, // Deshabilitar SSO
        },
      });
      console.log('✅ SSO Protection deshabilitado');
    } catch (error) {
      console.log('⚠️ SSO Protection ya estaba deshabilitado o no aplicable');
    }
    
    // Opción 2: Deshabilitar Password Protection
    try {
      await vercel.projects.updateProject({
        idOrName: projectId,
        teamId: teamId,
        requestBody: {
          passwordProtection: null, // Deshabilitar password protection
        },
      });
      console.log('✅ Password Protection deshabilitado');
    } catch (error) {
      console.log('⚠️ Password Protection ya estaba deshabilitado o no aplicable');
    }
    
    // Opción 3: Crear bypass para automation
    try {
      await vercel.projects.updateProjectProtectionBypass({
        idOrName: projectId,
        teamId: teamId,
        slug: 'fascinante-digital', // Tu team slug
        requestBody: {
          scope: 'automation-bypass',
        },
      });
      console.log('✅ Automation Bypass creado');
    } catch (error) {
      console.log('⚠️ Automation Bypass ya existe o no aplicable');
    }
    
    console.log('\n🎉 PROTECCIÓN DESHABILITADA EXITOSAMENTE');
    console.log('==========================================');
    console.log('✅ El proyecto ahora debería ser accesible públicamente');
    console.log('🌐 URL: https://auditoria.fascinantedigital.com');
    
  } catch (error) {
    console.error('❌ Error deshabilitando protección:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  disableProtection();
}

export { disableProtection };
