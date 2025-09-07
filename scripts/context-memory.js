#!/usr/bin/env node

/**
 * 🧠 SISTEMA DE MEMORIA PERSISTENTE PARA CONTEXTO
 * 
 * Este script implementa un sistema de memoria persistente basado en Mem0
 * para mantener el contexto de infraestructura y proyectos.
 */

const fs = require('fs');
const path = require('path');

class ContextMemory {
  constructor() {
    this.memoryFile = path.join(__dirname, '..', '.context-memory.json');
    this.contextFile = path.join(__dirname, '..', 'infrastructure-context.md');
    this.memories = this.loadMemories();
  }

  /**
   * Carga las memorias desde el archivo persistente
   */
  loadMemories() {
    try {
      if (fs.existsSync(this.memoryFile)) {
        const data = fs.readFileSync(this.memoryFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('⚠️ No se pudo cargar la memoria persistente:', error.message);
    }
    return {
      memories: [],
      lastUpdate: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  /**
   * Guarda las memorias en el archivo persistente
   */
  saveMemories() {
    try {
      fs.writeFileSync(this.memoryFile, JSON.stringify(this.memories, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('❌ Error guardando memoria:', error.message);
      return false;
    }
  }

  /**
   * Agrega una nueva memoria al contexto
   */
  addMemory(content, metadata = {}) {
    const memory = {
      id: this.generateId(),
      content,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        type: metadata.type || 'general'
      },
      tags: metadata.tags || [],
      importance: metadata.importance || 'medium'
    };

    this.memories.memories.push(memory);
    this.memories.lastUpdate = new Date().toISOString();
    
    this.saveMemories();
    return memory;
  }

  /**
   * Busca memorias relevantes basado en una consulta
   */
  searchMemories(query, options = {}) {
    const { limit = 10, type = null, tags = [] } = options;
    
    let results = this.memories.memories.filter(memory => {
      // Filtro por tipo si se especifica
      if (type && memory.metadata.type !== type) {
        return false;
      }
      
      // Filtro por tags si se especifican
      if (tags.length > 0 && !tags.some(tag => memory.tags.includes(tag))) {
        return false;
      }
      
      // Búsqueda por contenido
      const content = memory.content.toLowerCase();
      const queryLower = query.toLowerCase();
      
      return content.includes(queryLower) || 
             memory.tags.some(tag => String(tag).toLowerCase().includes(queryLower));
    });

    // Ordenar por importancia y timestamp
    results.sort((a, b) => {
      const importanceOrder = { high: 3, medium: 2, low: 1 };
      const aImportance = importanceOrder[a.importance] || 2;
      const bImportance = importanceOrder[b.importance] || 2;
      
      if (aImportance !== bImportance) {
        return bImportance - aImportance;
      }
      
      return new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp);
    });

    return results.slice(0, limit);
  }

  /**
   * Obtiene el contexto completo para el asistente
   */
  getContextForAssistant() {
    const context = {
      infrastructure: this.getInfrastructureContext(),
      apis: this.getAPIContext(),
      deployment: this.getDeploymentContext(),
      recent: this.getRecentMemories()
    };

    return context;
  }

  /**
   * Obtiene el contexto de infraestructura
   */
  getInfrastructureContext() {
    const infraMemories = this.searchMemories('infrastructure', { type: 'infrastructure' });
    const gcpMemories = this.searchMemories('google cloud', { type: 'gcp' });
    const vercelMemories = this.searchMemories('vercel', { type: 'deployment' });
    const cloudflareMemories = this.searchMemories('cloudflare', { type: 'dns' });

    return {
      gcp: {
        projectId: 'fascinante-dataforseo-gateway',
        serviceAccount: 'fascinante-dataforseo-sa@fascinante-dataforseo-gateway.iam.gserviceaccount.com',
        apis: ['PageSpeed Insights', 'Cloud APIs'],
        region: 'us-central1',
        status: 'active'
      },
      vercel: {
        project: 'sistema',
        url: 'https://sistema-4bo95edrr-alexanderoviedo.vercel.app',
        domain: 'auditoria.fascinantedigital.com',
        status: 'deployed'
      },
      cloudflare: {
        zone: 'fascinantedigital.com',
        zoneId: '6d7328e7f3edb975ef1f52cdb29178b7',
        subdomains: {
          auditoria: 'sistema-4bo95edrr-alexanderoviedo.vercel.app',
          api: 'fascinantedigital.com',
          analytics: 'fascinantedigital.com',
          tools: 'fascinantedigital.com'
        },
        status: 'configured'
      },
      github: {
        repo: 'alexanderovie/fascinante-dataforseo-gateway',
        url: 'https://github.com/alexanderovie/fascinante-dataforseo-gateway',
        status: 'active'
      }
    };
  }

  /**
   * Obtiene el contexto de APIs
   */
  getAPIContext() {
    return {
      dataforseo: {
        username: 'alexanderoviedo@fascinantedigital.com',
        status: 'active',
        endpoints: [
          '/api/v3/on_page/instant_pages',
          '/api/v3/serp/google/organic/live/advanced',
          '/api/v3/domain_analytics/technologies/domain_technologies/live'
        ]
      },
      pagespeed: {
        apiKey: 'configured',
        status: 'active',
        endpoints: [
          '/api/v1/pagespeed/summary',
          '/api/v1/pagespeed/core-web-vitals'
        ]
      },
      gateway: {
        domain: 'auditoria.fascinantedigital.com',
        status: 'active',
        endpoints: [
          '/api/health',
          '/api/v1/pagespeed/summary',
          '/api/v1/pagespeed/core-web-vitals',
          '/api/v3/on_page/instant_pages',
          '/api/v3/serp/google/organic/live/advanced',
          '/api/v3/domain_analytics/technologies/domain_technologies/live'
        ]
      }
    };
  }

  /**
   * Obtiene el contexto de deployment
   */
  getDeploymentContext() {
    return {
      vercel: {
        project: 'sistema',
        url: 'https://sistema-4bo95edrr-alexanderoviedo.vercel.app',
        domain: 'auditoria.fascinantedigital.com',
        status: 'deployed',
        lastDeploy: new Date().toISOString()
      },
      dns: {
        provider: 'cloudflare',
        zone: 'fascinantedigital.com',
        records: {
          auditoria: 'CNAME → sistema-4bo95edrr-alexanderoviedo.vercel.app'
        },
        status: 'configured'
      },
      cicd: {
        provider: 'github-actions',
        workflow: 'ci-cd-unified.yml',
        status: 'active'
      }
    };
  }

  /**
   * Obtiene las memorias más recientes
   */
  getRecentMemories(limit = 5) {
    return this.memories.memories
      .sort((a, b) => new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp))
      .slice(0, limit);
  }

  /**
   * Genera un ID único para la memoria
   */
  generateId() {
    return 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Inicializa el sistema con memorias básicas
   */
  initialize() {
    console.log('🧠 Inicializando sistema de memoria persistente...');
    
    // Memorias de infraestructura
    this.addMemory(
      'Proyecto Fascinante Digital API Gateway con Next.js 15, Vercel, Cloudflare y Google Cloud',
      { type: 'infrastructure', importance: 'high', tags: ['project', 'overview'] }
    );

    this.addMemory(
      'Google Cloud Platform configurado con proyecto fascinante-dataforseo-gateway y service account activo',
      { type: 'gcp', importance: 'high', tags: ['google-cloud', 'credentials'] }
    );

    this.addMemory(
      'Vercel deployado en sistema-4bo95edrr-alexanderoviedo.vercel.app con dominio auditoria.fascinantedigital.com',
      { type: 'deployment', importance: 'high', tags: ['vercel', 'deployment'] }
    );

    this.addMemory(
      'Cloudflare DNS configurado via Terraform con subdominios auditoria, api, analytics, tools',
      { type: 'dns', importance: 'high', tags: ['cloudflare', 'dns', 'terraform'] }
    );

    this.addMemory(
      'DataForSEO API integrado con username alexanderoviedo@fascinantedigital.com y todos los endpoints funcionando',
      { type: 'api', importance: 'high', tags: ['dataforseo', 'seo', 'api'] }
    );

    this.addMemory(
      'Google PageSpeed Insights API integrado con endpoints optimizados para ChatGPT',
      { type: 'api', importance: 'high', tags: ['pagespeed', 'performance', 'api'] }
    );

    this.addMemory(
      'GitHub Actions CI/CD configurado con workflow ci-cd-unified.yml para deploy automático',
      { type: 'cicd', importance: 'medium', tags: ['github', 'ci-cd', 'automation'] }
    );

    this.addMemory(
      'Esquemas OpenAPI creados para ChatGPT GPTs: chatgpt-gpt-schema-minimalista.json recomendado',
      { type: 'documentation', importance: 'medium', tags: ['openapi', 'chatgpt', 'documentation'] }
    );

    console.log('✅ Sistema de memoria inicializado con', this.memories.memories.length, 'memorias');
  }

  /**
   * Exporta el contexto para uso en otros sistemas
   */
  exportContext() {
    const context = this.getContextForAssistant();
    const exportFile = path.join(__dirname, '..', '.context-export.json');
    
    fs.writeFileSync(exportFile, JSON.stringify(context, null, 2), 'utf8');
    console.log('📤 Contexto exportado a', exportFile);
    
    return context;
  }

  /**
   * Limpia memorias antiguas
   */
  cleanup(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const originalCount = this.memories.memories.length;
    
    this.memories.memories = this.memories.memories.filter(memory => {
      const memoryDate = new Date(memory.metadata.timestamp);
      return memoryDate > cutoffDate || memory.importance === 'high';
    });
    
    const removedCount = originalCount - this.memories.memories.length;
    
    if (removedCount > 0) {
      this.saveMemories();
      console.log(`🧹 Limpieza completada: ${removedCount} memorias removidas`);
    } else {
      console.log('✅ No hay memorias antiguas para limpiar');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const memory = new ContextMemory();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'init':
      memory.initialize();
      break;
    case 'search':
      const query = process.argv[3] || '';
      const results = memory.searchMemories(query);
      console.log('🔍 Resultados de búsqueda:', results);
      break;
    case 'add':
      const content = process.argv[3] || '';
      const type = process.argv[4] || 'general';
      if (content) {
        memory.addMemory(content, { type });
        console.log('✅ Memoria agregada');
      } else {
        console.log('❌ Proporciona contenido para la memoria');
      }
      break;
    case 'export':
      memory.exportContext();
      break;
    case 'cleanup':
      const days = parseInt(process.argv[3]) || 30;
      memory.cleanup(days);
      break;
    case 'context':
      const context = memory.getContextForAssistant();
      console.log(JSON.stringify(context, null, 2));
      break;
    default:
      console.log('Uso: node context-memory.js [init|search|add|export|cleanup|context]');
      process.exit(1);
  }
}

module.exports = ContextMemory;
