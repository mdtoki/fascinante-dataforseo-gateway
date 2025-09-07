#!/usr/bin/env node

/**
 * 🚀 FASCINANTE DIGITAL - META BUSINESS MANAGER ELITE
 * 
 * Sistema PRO ELITE para gestión completa de Meta Business Management
 * Minimiza el uso de dashboards web y UI de Meta
 * Todo desde CLI con consistencia con el ecosistema Google
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class MetaBusinessManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.config = this.loadConfig();
    this.metaConfig = this.loadMetaConfig();
  }

  /**
   * Cargar configuración principal
   */
  loadConfig() {
    const configPath = path.join(this.projectRoot, '.elite-config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {};
  }

  /**
   * Cargar configuración de Meta
   */
  loadMetaConfig() {
    const metaConfigPath = path.join(this.projectRoot, '.meta-config.json');
    if (fs.existsSync(metaConfigPath)) {
      return JSON.parse(fs.readFileSync(metaConfigPath, 'utf8'));
    }
    
    return {
      appId: process.env.META_APP_ID,
      appSecret: process.env.META_APP_SECRET,
      accessToken: process.env.META_ACCESS_TOKEN,
      businessId: process.env.META_BUSINESS_ID,
      adAccountId: process.env.META_AD_ACCOUNT_ID,
      pageId: process.env.META_PAGE_ID,
      instagramAccountId: process.env.META_INSTAGRAM_ACCOUNT_ID
    };
  }

  /**
   * Verificar configuración de Meta
   */
  verifyMetaConfig() {
    console.log('🔍 VERIFICANDO CONFIGURACIÓN META...');
    console.log('=' .repeat(50));

    const required = ['appId', 'appSecret', 'accessToken'];
    const missing = required.filter(key => !this.metaConfig[key]);

    if (missing.length > 0) {
      console.log('❌ Configuración faltante:');
      missing.forEach(key => {
        console.log(`   - META_${key.toUpperCase()}`);
      });
      console.log('\n📝 Configura las variables de entorno:');
      console.log('export META_APP_ID="your_app_id"');
      console.log('export META_APP_SECRET="your_app_secret"');
      console.log('export META_ACCESS_TOKEN="your_access_token"');
      return false;
    }

    console.log('✅ Configuración Meta verificada');
    console.log(`📱 App ID: ${this.metaConfig.appId}`);
    console.log(`🔑 Access Token: ${this.metaConfig.accessToken.substring(0, 20)}...`);
    return true;
  }

  /**
   * Obtener información de Business Manager
   */
  async getBusinessManagerInfo() {
    console.log('🏢 OBTENIENDO INFORMACIÓN DE BUSINESS MANAGER...');
    
    if (!this.verifyMetaConfig()) {
      throw new Error('Configuración Meta incompleta');
    }

    try {
      const url = `https://graph.facebook.com/v18.0/${this.metaConfig.businessId || 'me'}`;
      const params = new URLSearchParams({
        access_token: this.metaConfig.accessToken,
        fields: 'id,name,primary_page,timezone_id,created_time,updated_time'
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
      }

      console.log('✅ Información de Business Manager obtenida');
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo información de Business Manager:', error.message);
      throw error;
    }
  }

  /**
   * Obtener cuentas publicitarias
   */
  async getAdAccounts() {
    console.log('📊 OBTENIENDO CUENTAS PUBLICITARIAS...');
    
    try {
      const url = `https://graph.facebook.com/v18.0/${this.metaConfig.businessId || 'me'}/adaccounts`;
      const params = new URLSearchParams({
        access_token: this.metaConfig.accessToken,
        fields: 'id,name,account_status,currency,timezone_name,amount_spent,balance,created_time'
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
      }

      console.log(`✅ ${data.data?.length || 0} cuentas publicitarias encontradas`);
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo cuentas publicitarias:', error.message);
      throw error;
    }
  }

  /**
   * Obtener páginas de Facebook
   */
  async getFacebookPages() {
    console.log('📄 OBTENIENDO PÁGINAS DE FACEBOOK...');
    
    try {
      const url = 'https://graph.facebook.com/v18.0/me/accounts';
      const params = new URLSearchParams({
        access_token: this.metaConfig.accessToken,
        fields: 'id,name,category,fan_count,access_token,instagram_business_account'
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
      }

      console.log(`✅ ${data.data?.length || 0} páginas de Facebook encontradas`);
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo páginas de Facebook:', error.message);
      throw error;
    }
  }

  /**
   * Obtener cuentas de Instagram Business
   */
  async getInstagramAccounts() {
    console.log('📸 OBTENIENDO CUENTAS DE INSTAGRAM BUSINESS...');
    
    try {
      const pages = await this.getFacebookPages();
      const instagramAccounts = [];

      for (const page of pages.data || []) {
        if (page.instagram_business_account) {
          const url = `https://graph.facebook.com/v18.0/${page.instagram_business_account.id}`;
          const params = new URLSearchParams({
            access_token: this.metaConfig.accessToken,
            fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count'
          });

          const response = await fetch(`${url}?${params}`);
          const data = await response.json();

          if (response.ok) {
            instagramAccounts.push({
              ...data,
              page_id: page.id,
              page_name: page.name
            });
          }
        }
      }

      console.log(`✅ ${instagramAccounts.length} cuentas de Instagram Business encontradas`);
      return { data: instagramAccounts };
    } catch (error) {
      console.error('❌ Error obteniendo cuentas de Instagram:', error.message);
      throw error;
    }
  }

  /**
   * Obtener campañas publicitarias
   */
  async getCampaigns(adAccountId = null) {
    console.log('🎯 OBTENIENDO CAMPAÑAS PUBLICITARIAS...');
    
    const accountId = adAccountId || this.metaConfig.adAccountId;
    if (!accountId) {
      throw new Error('ID de cuenta publicitaria requerido');
    }

    try {
      const url = `https://graph.facebook.com/v18.0/${accountId}/campaigns`;
      const params = new URLSearchParams({
        access_token: this.metaConfig.accessToken,
        fields: 'id,name,status,objective,created_time,updated_time,start_time,end_time,daily_budget,lifetime_budget'
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
      }

      console.log(`✅ ${data.data?.length || 0} campañas encontradas`);
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo campañas:', error.message);
      throw error;
    }
  }

  /**
   * Obtener insights de campaña
   */
  async getCampaignInsights(campaignId, dateRange = 'last_30d') {
    console.log(`📈 OBTENIENDO INSIGHTS DE CAMPAÑA: ${campaignId}...`);
    
    try {
      const url = `https://graph.facebook.com/v18.0/${campaignId}/insights`;
      const params = new URLSearchParams({
        access_token: this.metaConfig.accessToken,
        fields: 'impressions,clicks,spend,reach,frequency,cpm,cpc,ctr,cpp,actions',
        date_preset: dateRange
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
      }

      console.log('✅ Insights de campaña obtenidos');
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo insights:', error.message);
      throw error;
    }
  }

  /**
   * Crear campaña publicitaria
   */
  async createCampaign(campaignData) {
    console.log('🎯 CREANDO CAMPAÑA PUBLICITARIA...');
    
    const accountId = campaignData.adAccountId || this.metaConfig.adAccountId;
    if (!accountId) {
      throw new Error('ID de cuenta publicitaria requerido');
    }

    try {
      const url = `https://graph.facebook.com/v18.0/${accountId}/campaigns`;
      const params = new URLSearchParams({
        access_token: this.metaConfig.accessToken,
        name: campaignData.name,
        status: campaignData.status || 'PAUSED',
        objective: campaignData.objective,
        daily_budget: campaignData.dailyBudget,
        start_time: campaignData.startTime,
        end_time: campaignData.endTime
      });

      const response = await fetch(url, {
        method: 'POST',
        body: params
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
      }

      console.log(`✅ Campaña creada: ${data.id}`);
      return data;
    } catch (error) {
      console.error('❌ Error creando campaña:', error.message);
      throw error;
    }
  }

  /**
   * Obtener información completa del ecosistema Meta
   */
  async getEcosystemInfo() {
    console.log('🌐 OBTENIENDO INFORMACIÓN COMPLETA DEL ECOSISTEMA META...');
    console.log('=' .repeat(60));

    try {
      const [businessInfo, adAccounts, pages, instagramAccounts] = await Promise.all([
        this.getBusinessManagerInfo(),
        this.getAdAccounts(),
        this.getFacebookPages(),
        this.getInstagramAccounts()
      ]);

      const ecosystemInfo = {
        business_manager: businessInfo,
        ad_accounts: adAccounts,
        facebook_pages: pages,
        instagram_accounts: instagramAccounts,
        summary: {
          total_ad_accounts: adAccounts.data?.length || 0,
          total_facebook_pages: pages.data?.length || 0,
          total_instagram_accounts: instagramAccounts.data?.length || 0,
          total_followers: instagramAccounts.data?.reduce((sum, acc) => sum + (acc.followers_count || 0), 0) || 0
        }
      };

      console.log('✅ Información del ecosistema Meta obtenida');
      return ecosystemInfo;
    } catch (error) {
      console.error('❌ Error obteniendo información del ecosistema:', error.message);
      throw error;
    }
  }

  /**
   * Generar reporte ejecutivo
   */
  generateExecutiveReport(ecosystemInfo) {
    console.log('\n📊 REPORTE EJECUTIVO - META BUSINESS ECOSYSTEM');
    console.log('=' .repeat(60));
    
    const { business_manager, summary } = ecosystemInfo;
    
    console.log(`🏢 Business Manager: ${business_manager.name || 'N/A'}`);
    console.log(`🆔 ID: ${business_manager.id || 'N/A'}`);
    console.log(`⏰ Creado: ${business_manager.created_time || 'N/A'}`);
    console.log(`🌍 Zona Horaria: ${business_manager.timezone_id || 'N/A'}`);
    
    console.log('\n📊 RESUMEN DE ACTIVOS:');
    console.log(`📈 Cuentas Publicitarias: ${summary.total_ad_accounts}`);
    console.log(`📄 Páginas de Facebook: ${summary.total_facebook_pages}`);
    console.log(`📸 Cuentas de Instagram: ${summary.total_instagram_accounts}`);
    console.log(`👥 Total Seguidores: ${summary.total_followers.toLocaleString()}`);
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. Configurar campañas publicitarias');
    console.log('2. Optimizar contenido para Instagram');
    console.log('3. Analizar métricas de rendimiento');
    console.log('4. Implementar automatización');
  }

  /**
   * Configurar variables de entorno
   */
  setupEnvironment() {
    console.log('⚙️ CONFIGURANDO VARIABLES DE ENTORNO META...');
    
    const envExample = `
# Meta Business Management API
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here
META_ACCESS_TOKEN=your_access_token_here
META_BUSINESS_ID=your_business_id_here
META_AD_ACCOUNT_ID=act_your_ad_account_id_here
META_PAGE_ID=your_page_id_here
META_INSTAGRAM_ACCOUNT_ID=your_instagram_account_id_here

# Meta API Configuration
META_API_VERSION=v18.0
META_GRAPH_API_URL=https://graph.facebook.com
`;

    const envPath = path.join(this.projectRoot, '.env.meta.example');
    fs.writeFileSync(envPath, envExample);
    
    console.log('✅ Archivo .env.meta.example creado');
    console.log('📝 Configura las variables de entorno:');
    console.log('cp .env.meta.example .env.meta');
    console.log('source .env.meta');
  }
}

// CLI Interface
if (require.main === module) {
  const manager = new MetaBusinessManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'verify':
      manager.verifyMetaConfig();
      break;
      
    case 'business':
      manager.getBusinessManagerInfo().then(console.log);
      break;
      
    case 'adaccounts':
      manager.getAdAccounts().then(console.log);
      break;
      
    case 'pages':
      manager.getFacebookPages().then(console.log);
      break;
      
    case 'instagram':
      manager.getInstagramAccounts().then(console.log);
      break;
      
    case 'campaigns':
      const adAccountId = process.argv[3];
      manager.getCampaigns(adAccountId).then(console.log);
      break;
      
    case 'ecosystem':
      manager.getEcosystemInfo().then(info => {
        manager.generateExecutiveReport(info);
        console.log('\n📄 Datos completos:');
        console.log(JSON.stringify(info, null, 2));
      });
      break;
      
    case 'setup':
      manager.setupEnvironment();
      break;
      
    default:
      console.log(`
🚀 FASCINANTE DIGITAL - META BUSINESS MANAGER ELITE

Uso:
  node meta-business-manager.js verify          # Verificar configuración
  node meta-business-manager.js business        # Información Business Manager
  node meta-business-manager.js adaccounts      # Cuentas publicitarias
  node meta-business-manager.js pages           # Páginas de Facebook
  node meta-business-manager.js instagram       # Cuentas de Instagram
  node meta-business-manager.js campaigns [id]  # Campañas publicitarias
  node meta-business-manager.js ecosystem       # Información completa
  node meta-business-manager.js setup           # Configurar entorno

Ejemplos:
  node meta-business-manager.js verify
  node meta-business-manager.js ecosystem
  node meta-business-manager.js campaigns act_123456789
`);
      break;
  }
}

module.exports = MetaBusinessManager;
