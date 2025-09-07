#!/usr/bin/env node

/**
 * 🧹 FASCINANTE DIGITAL - CLEANUP OBSOLETE FILES
 * 
 * Script para limpiar archivos obsoletos, de prueba o que no funcionan
 */

const fs = require('fs');
const path = require('path');

class CleanupManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.filesToDelete = [];
    this.directoriesToDelete = [];
  }

  /**
   * Identificar archivos obsoletos
   */
  identifyObsoleteFiles() {
    console.log('🔍 IDENTIFICANDO ARCHIVOS OBSOLETOS...');
    console.log('=' .repeat(50));

    // Archivos de prueba obsoletos
    const testFiles = [
      'test-dataforseo-python.py',
      'test-dataforseo.sh',
      'test-gateway.sh',
      'test-simple.sh',
      'test-secrets.sh',
      'dataforseo-automation.py',
      'dataforseo-httpie-scripts.sh',
      'setup.sh'
    ];

    // Archivos de configuración obsoletos
    const configFiles = [
      'dataforseo-config.example.json',
      'dataforseo-config.json',
      'env.local.example',
      'env.production.example',
      'vercel.json.backup'
    ];

    // Archivos de documentación obsoletos
    const docFiles = [
      'ejemplo-fascinante-digital-serp.md',
      'ejemplo-on-page-uso.md',
      'ejemplo-request-body-correcto.md',
      'esquema-corregido-resumen.md',
      'esquema-final-funcionando.md',
      'esquema-minimalista-resumen.md',
      'esquemas-finales-resumen.md',
      'pagespeed-insights-resumen.md',
      'solucion-chatgpt-optimizada.md',
      'endpoints-funcionando-resumen.md'
    ];

    // Esquemas ChatGPT obsoletos (mantener solo el minimalista)
    const chatgptSchemas = [
      'chatgpt-gpt-schema-completo.json',
      'chatgpt-gpt-schema-funcionando.json',
      'chatgpt-gpt-schema-optimizado.json',
      'chatgpt-gpt-schema-pagespeed.json',
      'chatgpt-gpt-schema-simple.json',
      'chatgpt-gpt-schema.json'
    ];

    // Directorios obsoletos
    const obsoleteDirs = [
      'dataforseo-env',
      'app/api/debug',
      'app/api/test-dataforseo'
    ];

    // Scripts obsoletos
    const obsoleteScripts = [
      'scripts/start-tunnels.sh',
      'scripts/stop-tunnels.sh',
      'scripts/setup-elite.sh',
      'scripts/deploy-elite.sh',
      'scripts/setup-github-secrets.sh',
      'scripts/disable-protection-curl.sh',
      'scripts/disable-vercel-protection.js',
      'scripts/setup-vercel-project.js',
      'scripts/auto-setup.sh'
    ];

    // Agregar archivos a la lista
    [...testFiles, ...configFiles, ...docFiles, ...chatgptSchemas, ...obsoleteScripts].forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        this.filesToDelete.push(filePath);
        console.log(`📄 ${file}`);
      }
    });

    // Agregar directorios a la lista
    obsoleteDirs.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        this.directoriesToDelete.push(dirPath);
        console.log(`📁 ${dir}/`);
      }
    });

    console.log('=' .repeat(50));
    console.log(`📊 TOTAL: ${this.filesToDelete.length} archivos, ${this.directoriesToDelete.length} directorios`);
  }

  /**
   * Mostrar resumen de limpieza
   */
  showCleanupSummary() {
    console.log('\n🧹 RESUMEN DE LIMPIEZA');
    console.log('=' .repeat(50));
    
    if (this.filesToDelete.length === 0 && this.directoriesToDelete.length === 0) {
      console.log('✅ No hay archivos obsoletos para eliminar');
      return;
    }

    console.log(`📄 Archivos a eliminar: ${this.filesToDelete.length}`);
    this.filesToDelete.forEach(file => {
      console.log(`   - ${path.relative(this.projectRoot, file)}`);
    });

    console.log(`\n📁 Directorios a eliminar: ${this.directoriesToDelete.length}`);
    this.directoriesToDelete.forEach(dir => {
      console.log(`   - ${path.relative(this.projectRoot, dir)}/`);
    });

    console.log('\n⚠️  ADVERTENCIA: Esta acción no se puede deshacer');
  }

  /**
   * Ejecutar limpieza
   */
  async executeCleanup(dryRun = true) {
    if (dryRun) {
      console.log('\n🔍 MODO DRY RUN - No se eliminarán archivos');
      this.showCleanupSummary();
      return;
    }

    console.log('\n🗑️ EJECUTANDO LIMPIEZA...');
    console.log('=' .repeat(50));

    let deletedFiles = 0;
    let deletedDirs = 0;

    // Eliminar archivos
    this.filesToDelete.forEach(file => {
      try {
        fs.unlinkSync(file);
        console.log(`✅ Eliminado: ${path.relative(this.projectRoot, file)}`);
        deletedFiles++;
      } catch (error) {
        console.log(`❌ Error eliminando: ${path.relative(this.projectRoot, file)} - ${error.message}`);
      }
    });

    // Eliminar directorios
    this.directoriesToDelete.forEach(dir => {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✅ Eliminado: ${path.relative(this.projectRoot, dir)}/`);
        deletedDirs++;
      } catch (error) {
        console.log(`❌ Error eliminando: ${path.relative(this.projectRoot, dir)}/ - ${error.message}`);
      }
    });

    console.log('=' .repeat(50));
    console.log(`🎉 LIMPIEZA COMPLETADA`);
    console.log(`📄 Archivos eliminados: ${deletedFiles}`);
    console.log(`📁 Directorios eliminados: ${deletedDirs}`);
  }

  /**
   * Limpiar archivos de configuración obsoletos
   */
  cleanupConfigFiles() {
    console.log('\n🔧 LIMPIANDO ARCHIVOS DE CONFIGURACIÓN...');
    
    const configFiles = [
      'dataforseo-config.example.json',
      'dataforseo-config.json',
      'env.local.example',
      'env.production.example'
    ];

    configFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`✅ Eliminado: ${file}`);
        } catch (error) {
          console.log(`❌ Error: ${file} - ${error.message}`);
        }
      }
    });
  }

  /**
   * Optimizar estructura de directorios
   */
  optimizeDirectoryStructure() {
    console.log('\n📁 OPTIMIZANDO ESTRUCTURA DE DIRECTORIOS...');
    
    // Crear directorios necesarios
    const requiredDirs = [
      'docs',
      'scripts/elite',
      'terraform/domains'
    ];

    requiredDirs.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Creado: ${dir}/`);
      }
    });

    // Mover archivos de documentación
    const docFiles = [
      'PROJECT_SUMMARY.md',
      'TEST_RESULTS.md',
      'CONTRIBUTING.md',
      'LICENSE'
    ];

    docFiles.forEach(file => {
      const sourcePath = path.join(this.projectRoot, file);
      const destPath = path.join(this.projectRoot, 'docs', file);
      
      if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
        try {
          fs.renameSync(sourcePath, destPath);
          console.log(`✅ Movido: ${file} → docs/${file}`);
        } catch (error) {
          console.log(`❌ Error moviendo: ${file} - ${error.message}`);
        }
      }
    });
  }

  /**
   * Crear archivo de configuración elite
   */
  createEliteConfig() {
    console.log('\n⚙️ CREANDO CONFIGURACIÓN ELITE...');
    
    const eliteConfig = {
      version: "1.0.0",
      project: "fascinante-dataforseo-gateway",
      domain: "auditoria.fascinantedigital.com",
      github: {
        username: "alexanderovie",
        organization: "fascinante-digital"
      },
      cloudflare: {
        zoneId: "6d7328e7f3edb975ef1f52cdb29178b7",
        domain: "fascinantedigital.com"
      },
      vercel: {
        team: "fascinante-digital"
      },
      gcp: {
        project: "fascinante-digit-1698295291643",
        serviceAccount: "fascinante-prod-api-service@fascinante-digit-1698295291643.iam.gserviceaccount.com"
      },
      apis: {
        dataforseo: {
          username: "alexanderoviedo@fascinantedigital.com",
          baseUrl: "https://api.dataforseo.com"
        },
        pagespeed: {
          apiKey: "AIzaSyDgVdbR_BN3lyBoSm51lmduVkzuD0z4JKU"
        }
      },
      endpoints: {
        working: [
          "/api/health",
          "/api/v1/pagespeed/summary",
          "/api/v1/pagespeed/core-web-vitals",
          "/api/v3/on_page/instant_pages",
          "/api/v3/serp/google/organic/live/advanced",
          "/api/v3/domain_analytics/technologies/domain_technologies/live"
        ]
      }
    };

    const configPath = path.join(this.projectRoot, '.elite-config.json');
    fs.writeFileSync(configPath, JSON.stringify(eliteConfig, null, 2));
    console.log(`✅ Configuración elite creada: .elite-config.json`);
  }
}

// CLI Interface
if (require.main === module) {
  const cleanup = new CleanupManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'identify':
      cleanup.identifyObsoleteFiles();
      cleanup.showCleanupSummary();
      break;
      
    case 'clean':
      cleanup.identifyObsoleteFiles();
      const dryRun = !process.argv.includes('--execute');
      cleanup.executeCleanup(dryRun);
      break;
      
    case 'optimize':
      cleanup.optimizeDirectoryStructure();
      cleanup.createEliteConfig();
      break;
      
    case 'config':
      cleanup.createEliteConfig();
      break;
      
    default:
      console.log(`
🧹 FASCINANTE DIGITAL - CLEANUP OBSOLETE FILES

Uso:
  node cleanup-obsolete.js identify          # Identificar archivos obsoletos
  node cleanup-obsolete.js clean             # Limpieza en modo dry-run
  node cleanup-obsolete.js clean --execute   # Ejecutar limpieza real
  node cleanup-obsolete.js optimize          # Optimizar estructura
  node cleanup-obsolete.js config            # Crear configuración elite

Ejemplos:
  node cleanup-obsolete.js identify
  node cleanup-obsolete.js clean --execute
  node cleanup-obsolete.js optimize
`);
      break;
  }
}

module.exports = CleanupManager;
