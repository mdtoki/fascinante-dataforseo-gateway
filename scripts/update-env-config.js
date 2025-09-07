#!/usr/bin/env node

/**
 * 🔧 FASCINANTE DIGITAL - ENV CONFIG UPDATER
 * 
 * Script para actualizar .env.local de manera segura
 * Sin romper configuraciones existentes
 * Basado en mejores prácticas de Context7
 */

const fs = require('fs');
const path = require('path');

class EnvConfigUpdater {
  constructor() {
    this.projectRoot = process.cwd();
    this.envLocalPath = path.join(this.projectRoot, '.env.local');
    this.backupPath = path.join(this.projectRoot, '.env.local.backup');
  }

  /**
   * Crear backup del archivo actual
   */
  createBackup() {
    if (fs.existsSync(this.envLocalPath)) {
      const currentContent = fs.readFileSync(this.envLocalPath, 'utf8');
      fs.writeFileSync(this.backupPath, currentContent);
      console.log('✅ Backup creado: .env.local.backup');
      return currentContent;
    }
    return null;
  }

  /**
   * Leer configuración actual
   */
  readCurrentConfig() {
    if (fs.existsSync(this.envLocalPath)) {
      return fs.readFileSync(this.envLocalPath, 'utf8');
    }
    return '';
  }

  /**
   * Generar configuración organizada
   */
  generateOrganizedConfig() {
    return `# =============================================================================
# 🚀 FASCINANTE DIGITAL - API GATEWAY CONFIGURATION
# =============================================================================
# Archivo de configuración de variables de entorno
# Organizado según mejores prácticas de Context7 y env-var
# =============================================================================

# =============================================================================
# 📊 DATAFORSEO API CONFIGURATION
# =============================================================================
# Configuración para la integración con DataForSEO API
# Usado para análisis SEO, SERP, y datos de dominio
DATAFORSEO_USERNAME=info@fascinantedigital.com
DATAFORSEO_PASSWORD=1dca310be03b7a87
DATAFORSEO_BASE_URL=https://api.dataforseo.com

# =============================================================================
# 🏢 META BUSINESS MANAGEMENT API CONFIGURATION
# =============================================================================
# Configuración para Meta Business Manager, Marketing API y Ad Library
# Obtén estas credenciales desde: https://developers.facebook.com/
# 
# 🔑 REQUERIDO: Configura estas variables para usar Meta APIs
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here
META_ACCESS_TOKEN=your_meta_access_token_here
META_BUSINESS_ID=your_meta_business_id_here
META_AD_ACCOUNT_ID=act_your_ad_account_id_here
META_PAGE_ID=your_meta_page_id_here
META_INSTAGRAM_ACCOUNT_ID=your_meta_instagram_account_id_here

# =============================================================================
# 🔐 API GATEWAY SECURITY CONFIGURATION
# =============================================================================
# Configuración de seguridad para el API Gateway
# Generados con OpenSSL para máxima seguridad
API_GATEWAY_SECRET=8j4MnwSipqIm1ZuFAteV+DAGkHmbZhwegmZZfCc8l2Q=
JWT_SECRET=7QchzRmHId5pXWcYLkUTVCvUdcv+vzTF5HNa+GdDGjI=
JWT_EXPIRES_IN=24h

# =============================================================================
# ⚡ RATE LIMITING CONFIGURATION
# =============================================================================
# Configuración de límites de velocidad para APIs
# Ajustado bajo en desarrollo para pruebas
API_RATE_LIMIT_PER_MINUTE=200

# =============================================================================
# 🗄️ REDIS CONFIGURATION
# =============================================================================
# Configuración de Redis para cache y sesiones
# Comenta estas líneas si no usas Redis local
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# =============================================================================
# 📈 ANALYTICS CONFIGURATION
# =============================================================================
# Configuración de analytics y monitoreo
# En desarrollo es mejor tenerlo desactivado
ENABLE_ANALYTICS=false

# =============================================================================
# 📝 LOGGING CONFIGURATION
# =============================================================================
# Configuración de logging y niveles de debug
LOG_LEVEL=debug
NODE_ENV=development

# =============================================================================
# 🌐 NEXT.JS CONFIGURATION
# =============================================================================
# Configuración específica de Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# =============================================================================
# 🔧 GOOGLE CLOUD CONFIGURATION (OPCIONAL)
# =============================================================================
# Configuración para Google Cloud APIs
# Descomenta y configura si usas Google Cloud
# GOOGLE_CLOUD_PROJECT_ID=your_project_id
# GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY=path/to/service-account.json
# GOOGLE_PAGESPEED_API_KEY=your_pagespeed_api_key

# =============================================================================
# 📱 GOOGLE MY BUSINESS CONFIGURATION (OPCIONAL)
# =============================================================================
# Configuración para Google My Business API
# Descomenta y configura si usas Google My Business
# GOOGLE_MY_BUSINESS_API_KEY=your_gmb_api_key
# GOOGLE_MY_BUSINESS_ACCOUNT_ID=your_gmb_account_id

# =============================================================================
# 🚀 VERCEL CONFIGURATION (PRODUCCIÓN)
# =============================================================================
# Configuración para despliegue en Vercel
# Estas variables se configuran automáticamente en Vercel
# VERCEL_URL=your_vercel_url
# VERCEL_ENV=production

# =============================================================================
# 📊 MONITORING & HEALTH CHECKS
# =============================================================================
# Configuración para monitoreo y health checks
# HEALTH_CHECK_ENDPOINT=/api/health
# MONITORING_ENABLED=true

# =============================================================================
# 🔒 SECURITY HEADERS
# =============================================================================
# Configuración de headers de seguridad
# SECURITY_HEADERS_ENABLED=true
# CORS_ORIGIN=http://localhost:3000

# =============================================================================
# 📚 DOCUMENTACIÓN
# =============================================================================
# Para más información sobre configuración:
# - Meta APIs: https://developers.facebook.com/docs/graph-api/
# - DataForSEO: https://docs.dataforseo.com/
# - Google Cloud: https://cloud.google.com/docs
# - Next.js: https://nextjs.org/docs
# =============================================================================`;
  }

  /**
   * Extraer variables existentes
   */
  extractExistingVariables(content) {
    const variables = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          variables[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
    
    return variables;
  }

  /**
   * Actualizar configuración preservando valores existentes
   */
  updateConfig() {
    console.log('🔧 ACTUALIZANDO CONFIGURACIÓN .env.local...');
    console.log('=' .repeat(60));

    // Crear backup
    const currentContent = this.createBackup();
    
    if (!currentContent) {
      console.log('❌ No se encontró archivo .env.local');
      return false;
    }

    // Extraer variables existentes
    const existingVars = this.extractExistingVariables(currentContent);
    console.log(`📊 Variables existentes encontradas: ${Object.keys(existingVars).length}`);

    // Generar nueva configuración
    const newConfig = this.generateOrganizedConfig();
    
    // Reemplazar valores placeholder con valores existentes
    let updatedConfig = newConfig;
    
    for (const [key, value] of Object.entries(existingVars)) {
      // Buscar y reemplazar valores placeholder
      const placeholderPattern = new RegExp(`${key}=[^\\n]*`, 'g');
      const replacement = `${key}=${value}`;
      
      if (updatedConfig.includes(key + '=')) {
        updatedConfig = updatedConfig.replace(placeholderPattern, replacement);
        console.log(`✅ Preservado: ${key}`);
      } else {
        // Agregar variable que no estaba en el template
        updatedConfig += `\n# Variable adicional encontrada\n${key}=${value}`;
        console.log(`➕ Agregado: ${key}`);
      }
    }

    // Escribir nueva configuración
    fs.writeFileSync(this.envLocalPath, updatedConfig);
    console.log('✅ Archivo .env.local actualizado exitosamente');
    
    return true;
  }

  /**
   * Mostrar resumen de cambios
   */
  showSummary() {
    console.log('\n📋 RESUMEN DE CAMBIOS:');
    console.log('=' .repeat(60));
    console.log('✅ Backup creado: .env.local.backup');
    console.log('✅ Archivo organizado con mejores prácticas');
    console.log('✅ Variables existentes preservadas');
    console.log('✅ Variables de Meta agregadas');
    console.log('✅ Documentación mejorada');
    
    console.log('\n🔑 VARIABLES DE META AGREGADAS:');
    console.log('- META_APP_ID');
    console.log('- META_APP_SECRET');
    console.log('- META_ACCESS_TOKEN');
    console.log('- META_BUSINESS_ID');
    console.log('- META_AD_ACCOUNT_ID');
    console.log('- META_PAGE_ID');
    console.log('- META_INSTAGRAM_ACCOUNT_ID');
    
    console.log('\n📚 PRÓXIMOS PASOS:');
    console.log('1. Configura las variables de Meta con tus credenciales');
    console.log('2. Ejecuta: node scripts/meta-business-manager.js verify');
    console.log('3. Prueba el sistema Meta');
  }
}

// CLI Interface
if (require.main === module) {
  const updater = new EnvConfigUpdater();
  const command = process.argv[2];
  
  switch (command) {
    case 'update':
      if (updater.updateConfig()) {
        updater.showSummary();
      }
      break;
      
    case 'backup':
      updater.createBackup();
      console.log('✅ Backup creado');
      break;
      
    case 'show':
      const current = updater.readCurrentConfig();
      console.log('📄 CONFIGURACIÓN ACTUAL:');
      console.log('=' .repeat(60));
      console.log(current);
      break;
      
    default:
      console.log(`
🔧 FASCINANTE DIGITAL - ENV CONFIG UPDATER

Uso:
  node scripts/update-env-config.js update    # Actualizar .env.local
  node scripts/update-env-config.js backup    # Crear backup
  node scripts/update-env-config.js show      # Mostrar configuración actual

Ejemplos:
  node scripts/update-env-config.js update
  node scripts/update-env-config.js backup
`);
      break;
  }
}

module.exports = EnvConfigUpdater;
