#!/usr/bin/env node

/**
 * 📁 GESTIÓN DE CONTEXTO DE REPOSITORIOS
 * 
 * Este script mantiene actualizada la información de repositorios
 * en el sistema de memoria persistente.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ContextMemory = require('./context-memory');

class RepoContextManager {
  constructor() {
    this.memory = new ContextMemory();
  }

  /**
   * Obtiene información de todos los repositorios
   */
  async getRepositories() {
    try {
      const output = execSync('gh repo list --limit 50 --json name,description,url,updatedAt,isPrivate,primaryLanguage', { 
        encoding: 'utf8' 
      });
      return JSON.parse(output);
    } catch (error) {
      console.error('❌ Error obteniendo repositorios:', error.message);
      return [];
    }
  }

  /**
   * Actualiza el contexto de repositorios
   */
  async updateRepoContext() {
    console.log('📁 Actualizando contexto de repositorios...');
    
    const repos = await this.getRepositories();
    
    // Limpiar memorias antiguas de repositorios
    this.cleanupOldRepoMemories();
    
    // Agregar información de repositorios principales
    const mainRepos = repos.filter(repo => 
      repo.name === 'fascinante-dataforseo-gateway' || 
      repo.name === 'fascinante-digital' ||
      repo.name === 'sistema'
    );
    
    for (const repo of mainRepos) {
      this.addRepoMemory(repo);
    }
    
    // Agregar resumen de todos los repositorios
    this.addRepositoriesSummary(repos);
    
    console.log('✅ Contexto de repositorios actualizado');
  }

  /**
   * Agrega memoria de un repositorio específico
   */
  addRepoMemory(repo) {
    const description = repo.description || 'Sin descripción';
    const visibility = repo.isPrivate ? 'privado' : 'público';
    const language = repo.primaryLanguage || 'Sin especificar';
    
    const content = `Repositorio ${visibility}: ${repo.name} - ${description}. Lenguaje: ${language}. URL: ${repo.url}`;
    
    this.memory.addMemory(content, {
      type: 'repository',
      importance: 'high',
      tags: ['github', 'repo', repo.name, visibility, language]
    });
  }

  /**
   * Agrega resumen de todos los repositorios
   */
  addRepositoriesSummary(repos) {
    const publicRepos = repos.filter(repo => !repo.isPrivate);
    const privateRepos = repos.filter(repo => repo.isPrivate);
    
    const summary = `Resumen de repositorios: ${repos.length} total (${publicRepos.length} públicos, ${privateRepos.length} privados). Principales: fascinante-dataforseo-gateway (API Gateway), fascinante-digital (Platform), sistema (privado)`;
    
    this.memory.addMemory(summary, {
      type: 'repository-summary',
      importance: 'medium',
      tags: ['github', 'repos', 'summary', 'overview']
    });
  }

  /**
   * Limpia memorias antiguas de repositorios
   */
  cleanupOldRepoMemories() {
    // Esta funcionalidad se puede implementar si es necesario
    // Por ahora, las memorias se mantienen para referencia histórica
  }

  /**
   * Busca información de repositorios
   */
  searchRepositories(query) {
    return this.memory.searchMemories(query, { type: 'repository' });
  }

  /**
   * Obtiene el contexto de repositorios para el asistente
   */
  getRepositoriesContext() {
    const repoMemories = this.memory.searchMemories('repository', { type: 'repository' });
    const summaryMemories = this.memory.searchMemories('summary', { type: 'repository-summary' });
    
    return {
      repositories: repoMemories,
      summary: summaryMemories,
      quickAccess: {
        mainRepo: 'alexanderovie/fascinante-dataforseo-gateway',
        publicRepos: ['fascinante-dataforseo-gateway', 'fascinante-digital'],
        privateRepos: ['sistema', 'CleanandBrilliantPRO', 'arlenysoviedo', 'platform-fascinante', 'infra', 'apps', 'internalizacion', 'fascinante-digital-platform']
      }
    };
  }

  /**
   * Genera resumen ejecutivo de repositorios
   */
  generateRepositoriesSummary() {
    const context = this.getRepositoriesContext();
    
    return `
# 📁 REPOSITORIOS - FASCINANTE DIGITAL

## 🎯 **REPOSITORIO PRINCIPAL**
- **fascinante-dataforseo-gateway** (Público)
  - Descripción: DataForSEO API Gateway PRO ELITE
  - Tecnología: Next.js 15, TypeScript, Rate Limiting, Caching
  - Estado: Producción en auditoria.fascinantedigital.com
  - URL: https://github.com/alexanderovie/fascinante-dataforseo-gateway

## 🌐 **REPOSITORIOS PÚBLICOS**
- **fascinante-digital** (Público)
  - Descripción: Fascinante Digital Platform
  - Tecnología: Next.js 15, TypeScript, App Router, Tailwind CSS
  - URL: https://github.com/alexanderovie/fascinante-digital

## 🔒 **REPOSITORIOS PRIVADOS**
- **sistema** - Proyecto actual
- **CleanandBrilliantPRO** - Proyecto de limpieza
- **arlenysoviedo** - Proyecto personal
- **platform-fascinante** - Plataforma Fascinante
- **infra** - Infraestructura
- **apps** - Aplicaciones
- **internalizacion** - Proyecto de internalización
- **fascinante-digital-platform** - Plataforma digital

## 🔧 **COMANDOS ÚTILES**
\`\`\`bash
# Ver todos los repositorios
gh repo list

# Ver repositorio específico
gh repo view fascinante-dataforseo-gateway

# Clonar repositorio
gh repo clone fascinante-dataforseo-gateway

# Crear nuevo repositorio
gh repo create nombre-repo --public/--private
\`\`\`

## 📊 **ESTADÍSTICAS**
- **Total:** 10 repositorios
- **Públicos:** 2 repositorios
- **Privados:** 8 repositorios
- **Última actualización:** ${new Date().toISOString()}
`;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const repoManager = new RepoContextManager();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'update':
      repoManager.updateRepoContext();
      break;
    case 'search':
      const query = process.argv[3] || '';
      const results = repoManager.searchRepositories(query);
      console.log('🔍 Resultados:', results);
      break;
    case 'context':
      const context = repoManager.getRepositoriesContext();
      console.log(JSON.stringify(context, null, 2));
      break;
    case 'summary':
      console.log(repoManager.generateRepositoriesSummary());
      break;
    default:
      console.log('Uso: node repo-context.js [update|search|context|summary]');
      process.exit(1);
  }
}

module.exports = RepoContextManager;
