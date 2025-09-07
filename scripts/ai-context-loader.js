#!/usr/bin/env node

/**
 * 🤖 CARGADOR DE CONTEXTO PARA ASISTENTES DE IA
 * 
 * Este script carga y proporciona el contexto completo de infraestructura
 * para que los asistentes de IA tengan acceso inmediato a toda la información.
 */

const fs = require('fs');
const path = require('path');
const ContextMemory = require('./context-memory');

class AIContextLoader {
  constructor() {
    this.memory = new ContextMemory();
    this.contextFile = path.join(__dirname, '..', 'infrastructure-context.md');
  }

  /**
   * Carga el contexto completo para el asistente
   */
  loadFullContext() {
    const context = {
      timestamp: new Date().toISOString(),
      infrastructure: this.memory.getInfrastructureContext(),
      apis: this.memory.getAPIContext(),
      deployment: this.memory.getDeploymentContext(),
      quickAccess: this.getQuickAccessInfo(),
      commands: this.getCommandReference(),
      status: this.getSystemStatus()
    };

    return context;
  }

  /**
   * Obtiene información de acceso rápido
   */
  getQuickAccessInfo() {
    return {
      domain: 'auditoria.fascinantedigital.com',
      vercelUrl: 'https://sistema-4bo95edrr-alexanderoviedo.vercel.app',
      githubRepo: 'https://github.com/alexanderovie/fascinante-dataforseo-gateway',
      cloudflareZone: '6d7328e7f3edb975ef1f52cdb29178b7',
      gcpProject: 'fascinante-dataforseo-gateway',
      dataforseoUser: 'alexanderoviedo@fascinantedigital.com',
      repositories: {
        main: 'fascinante-dataforseo-gateway',
        public: ['fascinante-dataforseo-gateway', 'fascinante-digital'],
        private: ['sistema', 'CleanandBrilliantPRO', 'arlenysoviedo', 'platform-fascinante', 'infra', 'apps', 'internalizacion', 'fascinante-digital-platform']
      }
    };
  }

  /**
   * Obtiene referencia de comandos
   */
  getCommandReference() {
    return {
      deploy: {
        vercel: 'vercel --prod --yes',
        dns: 'cd terraform && terraform apply -auto-approve',
        test: 'curl -X POST https://auditoria.fascinantedigital.com/api/health'
      },
      development: {
        install: 'pnpm install',
        dev: 'pnpm dev',
        lint: 'pnpm lint',
        format: 'pnpm format'
      },
      testing: {
        pagespeed: `curl -X POST https://auditoria.fascinantedigital.com/api/v1/pagespeed/summary \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: $API_GATEWAY_SECRET" \\
  -d '{"url": "https://www.fascinantedigital.com", "strategy": "desktop"}'`,
        onpage: `curl -X POST https://auditoria.fascinantedigital.com/api/v3/on_page/instant_pages \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: $API_GATEWAY_SECRET" \\
  -d '{"url": "https://www.fascinantedigital.com"}'`
      },
      context: {
        update: 'node scripts/update-context.js update',
        validate: 'node scripts/update-context.js validate',
        memory: 'node scripts/context-memory.js context'
      }
    };
  }

  /**
   * Obtiene el estado del sistema
   */
  getSystemStatus() {
    return {
      infrastructure: 'active',
      apis: 'configured',
      deployment: 'production',
      monitoring: 'active',
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Genera un resumen ejecutivo para el asistente
   */
  generateExecutiveSummary() {
    return `
# 🚀 CONTEXTO DE INFRAESTRUCTURA - FASCINANTE DIGITAL

## 📋 RESUMEN EJECUTIVO
- **Proyecto:** API Gateway con DataForSEO + PageSpeed Insights
- **Dominio:** auditoria.fascinantedigital.com
- **Estado:** ✅ PRODUCCIÓN ACTIVA
- **Arquitectura:** Next.js 15 + Vercel + Cloudflare + Google Cloud

## 🔑 ACCESOS DISPONIBLES
- **Google Cloud:** fascinante-dataforseo-gateway (ACTIVO)
- **DataForSEO:** alexanderoviedo@fascinantedigital.com (CONFIGURADO)
- **Vercel:** sistema (DEPLOYADO)
- **Cloudflare:** fascinantedigital.com (DNS CONFIGURADO)
- **GitHub:** alexanderovie/fascinante-dataforseo-gateway (CI/CD ACTIVO)

## 📁 REPOSITORIOS DISPONIBLES
- **Principal:** fascinante-dataforseo-gateway (Público) - API Gateway actual
- **Públicos:** fascinante-digital (Platform)
- **Privados:** sistema, CleanandBrilliantPRO, arlenysoviedo, platform-fascinante, infra, apps, internalizacion, fascinante-digital-platform

## 🚀 ENDPOINTS FUNCIONANDO
- /api/health - Health check
- /api/v1/pagespeed/summary - PageSpeed optimizado para ChatGPT
- /api/v1/pagespeed/core-web-vitals - Core Web Vitals
- /api/v3/on_page/instant_pages - Análisis on-page DataForSEO
- /api/v3/serp/google/organic/live/advanced - SERP Google
- /api/v3/domain_analytics/technologies/domain_technologies/live - Tecnologías

## 🔧 COMANDOS CLAVE
- Deploy: vercel --prod --yes
- DNS: cd terraform && terraform apply -auto-approve
- Test: curl -X POST https://auditoria.fascinantedigital.com/api/health
- Repos: gh repo list
- Ver repo: gh repo view fascinante-dataforseo-gateway

## 📊 ESTADO ACTUAL
- ✅ API Gateway funcionando
- ✅ Todos los endpoints probados
- ✅ DNS configurado correctamente
- ✅ CI/CD automatizado
- ✅ Esquemas OpenAPI para ChatGPT
- ✅ 10 repositorios disponibles (2 públicos, 8 privados)

**⚠️ IMPORTANTE:** Siempre consulta este contexto antes de crear nuevas APIs o hacer cambios en la infraestructura.
`;
  }

  /**
   * Valida que el contexto esté actualizado
   */
  validateContext() {
    const context = this.loadFullContext();
    const memory = this.memory.loadMemories();
    
    if (!memory || !memory.lastUpdate) {
      console.log('❌ Memoria persistente no encontrada');
      return false;
    }

    const lastUpdate = new Date(memory.lastUpdate);
    const now = new Date();
    const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      console.log(`⚠️ Contexto desactualizado (${Math.round(hoursDiff)} horas)`);
      return false;
    }

    console.log('✅ Contexto actualizado y válido');
    return true;
  }

  /**
   * Actualiza el contexto si es necesario
   */
  async updateContextIfNeeded() {
    if (!this.validateContext()) {
      console.log('🔄 Actualizando contexto...');
      const { execSync } = require('child_process');
      
      try {
        execSync('node scripts/update-context.js update', { stdio: 'inherit' });
        console.log('✅ Contexto actualizado');
      } catch (error) {
        console.error('❌ Error actualizando contexto:', error.message);
      }
    }
  }

  /**
   * Exporta el contexto para uso en otros sistemas
   */
  exportContext() {
    const context = this.loadFullContext();
    const exportFile = path.join(__dirname, '..', '.ai-context.json');
    
    fs.writeFileSync(exportFile, JSON.stringify(context, null, 2), 'utf8');
    console.log('📤 Contexto exportado a', exportFile);
    
    return context;
  }

  /**
   * Carga el contexto y lo muestra en formato legible
   */
  displayContext() {
    const context = this.loadFullContext();
    const summary = this.generateExecutiveSummary();
    
    console.log(summary);
    console.log('\n📊 CONTEXTO DETALLADO:');
    console.log(JSON.stringify(context, null, 2));
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const loader = new AIContextLoader();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'load':
      loader.displayContext();
      break;
    case 'export':
      loader.exportContext();
      break;
    case 'validate':
      loader.validateContext();
      break;
    case 'update':
      loader.updateContextIfNeeded();
      break;
    case 'summary':
      console.log(loader.generateExecutiveSummary());
      break;
    default:
      console.log('Uso: node ai-context-loader.js [load|export|validate|update|summary]');
      process.exit(1);
  }
}

module.exports = AIContextLoader;
