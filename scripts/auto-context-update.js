#!/usr/bin/env node

/**
 * 🔄 AUTOMATIZACIÓN DE ACTUALIZACIÓN DE CONTEXTO
 * 
 * Este script se ejecuta automáticamente para mantener el contexto
 * de infraestructura siempre actualizado.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoContextUpdater {
  constructor() {
    this.contextFile = path.join(__dirname, '..', 'infrastructure-context.md');
    this.memoryFile = path.join(__dirname, '..', '.context-memory.json');
    this.lastUpdateFile = path.join(__dirname, '..', '.last-context-update');
  }

  /**
   * Verifica si el contexto necesita actualización
   */
  needsUpdate() {
    try {
      if (!fs.existsSync(this.lastUpdateFile)) {
        return true;
      }

      const lastUpdate = fs.readFileSync(this.lastUpdateFile, 'utf8');
      const lastUpdateDate = new Date(lastUpdate);
      const now = new Date();
      const hoursDiff = (now - lastUpdateDate) / (1000 * 60 * 60);

      // Actualizar cada 6 horas o si hay cambios en el proyecto
      return hoursDiff > 6 || this.hasProjectChanges();
    } catch (error) {
      return true;
    }
  }

  /**
   * Verifica si hay cambios en el proyecto
   */
  hasProjectChanges() {
    try {
      // Verificar cambios en git
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        return true;
      }

      // Verificar cambios en archivos clave
      const keyFiles = [
        'package.json',
        'next.config.mjs',
        'terraform/main.tf',
        '.github/workflows/ci-cd-unified.yml'
      ];

      for (const file of keyFiles) {
        if (fs.existsSync(file)) {
          const stats = fs.statSync(file);
          const lastUpdate = new Date(stats.mtime);
          const now = new Date();
          const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);

          if (hoursDiff < 1) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Actualiza el contexto
   */
  async updateContext() {
    try {
      console.log('🔄 Actualizando contexto automáticamente...');

      // Actualizar contexto
      execSync('node scripts/update-context.js update', { stdio: 'inherit' });

      // Actualizar memoria
      execSync('node scripts/context-memory.js search "infrastructure"', { stdio: 'inherit' });

      // Marcar última actualización
      fs.writeFileSync(this.lastUpdateFile, new Date().toISOString(), 'utf8');

      console.log('✅ Contexto actualizado automáticamente');
      return true;
    } catch (error) {
      console.error('❌ Error en actualización automática:', error.message);
      return false;
    }
  }

  /**
   * Ejecuta la verificación y actualización
   */
  async run() {
    if (this.needsUpdate()) {
      await this.updateContext();
    } else {
      console.log('✅ Contexto actualizado, no se requiere actualización');
    }
  }

  /**
   * Programa la actualización automática
   */
  scheduleUpdate() {
    console.log('⏰ Programando actualización automática cada 6 horas...');
    
    // Ejecutar inmediatamente
    this.run();

    // Programar cada 6 horas
    setInterval(() => {
      this.run();
    }, 6 * 60 * 60 * 1000); // 6 horas en milisegundos
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const updater = new AutoContextUpdater();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'check':
      if (updater.needsUpdate()) {
        console.log('🔄 Contexto necesita actualización');
        process.exit(1);
      } else {
        console.log('✅ Contexto actualizado');
        process.exit(0);
      }
      break;
    case 'update':
      updater.updateContext();
      break;
    case 'run':
      updater.run();
      break;
    case 'schedule':
      updater.scheduleUpdate();
      break;
    default:
      console.log('Uso: node auto-context-update.js [check|update|run|schedule]');
      process.exit(1);
  }
}

module.exports = AutoContextUpdater;
