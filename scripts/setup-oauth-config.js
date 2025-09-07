#!/usr/bin/env node

/**
 * 🔐 FASCINANTE DIGITAL - OAUTH CONFIGURATION SETUP
 * 
 * Script para configurar variables de entorno OAuth
 * Genera claves RSA y configura variables necesarias
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class OAuthConfigSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.envLocalPath = path.join(this.projectRoot, '.env.local');
  }

  /**
   * Generar claves RSA para JWT
   */
  generateRSAKeys() {
    console.log('🔑 GENERANDO CLAVES RSA PARA JWT...');
    console.log('=' .repeat(60));

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    // Extraer componentes de la clave pública para JWKS
    const publicKeyObj = crypto.createPublicKey(publicKey);
    const jwk = publicKeyObj.export({ format: 'jwk' });
    
    const kid = crypto.randomUUID();
    
    console.log('✅ Claves RSA generadas exitosamente');
    console.log(`📋 Key ID (KID): ${kid}`);
    console.log(`📋 Modulus (n): ${jwk.n}`);
    console.log(`📋 Exponent (e): ${jwk.e}`);

    return {
      privateKey: privateKey.replace(/\n/g, '\\n'),
      publicKey: publicKey.replace(/\n/g, '\\n'),
      kid,
      n: jwk.n,
      e: jwk.e
    };
  }

  /**
   * Generar variables de entorno OAuth
   */
  generateOAuthVariables() {
    console.log('\n🔧 GENERANDO VARIABLES OAUTH...');
    console.log('=' .repeat(60));

    const keys = this.generateRSAKeys();
    
    const oauthVars = {
      // OAuth Provider Configuration
      OAUTH_ISSUER: 'https://auditoria.fascinantedigital.com',
      OAUTH_AUDIENCE: 'https://auditoria.fascinantedigital.com',
      OAUTH_CLIENT_ID: 'your_openai_client_id_here',
      OAUTH_CLIENT_SECRET: 'your_openai_client_secret_here',
      OAUTH_REDIRECT_URI: 'https://platform.openai.com/oauth/callback',
      OAUTH_SCOPES: 'openid email profile',

      // JWT Configuration
      JWT_PRIVATE_KEY: keys.privateKey,
      JWT_PUBLIC_KEY: keys.publicKey,
      JWT_KID: keys.kid,
      JWT_ALGORITHM: 'RS256',
      JWT_EXPIRES_IN: '3600',
      JWT_REFRESH_EXPIRES_IN: '86400',

      // PKCE Configuration
      PKCE_CODE_CHALLENGE_METHOD: 'S256',
      PKCE_CODE_VERIFIER_LENGTH: '128',

      // GPT Actions Specific
      GPT_ACTIONS_API_KEY: crypto.randomBytes(32).toString('hex'),
      GPT_ACTIONS_RATE_LIMIT: '100',

      // Internal Gateway Configuration
      GATEWAY_INTERNAL_KEY: crypto.randomBytes(32).toString('hex'),
      AUDITORIA_BASE_URL: 'https://auditoria.fascinantedigital.com',

      // IP Hashing for Privacy
      IP_SALT: crypto.randomBytes(16).toString('hex')
    };

    console.log('✅ Variables OAuth generadas');
    console.log(`📋 GPT Actions API Key: ${oauthVars.GPT_ACTIONS_API_KEY}`);
    console.log(`📋 Gateway Internal Key: ${oauthVars.GATEWAY_INTERNAL_KEY}`);
    console.log(`📋 IP Salt: ${oauthVars.IP_SALT}`);

    return oauthVars;
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
   * Agregar variables OAuth al archivo existente
   */
  addOAuthVariables() {
    console.log('\n📝 AGREGANDO VARIABLES OAUTH A .env.local...');
    console.log('=' .repeat(60));

    const currentConfig = this.readCurrentConfig();
    const oauthVars = this.generateOAuthVariables();

    // Verificar si ya existen variables OAuth
    if (currentConfig.includes('OAUTH_ISSUER')) {
      console.log('⚠️  Variables OAuth ya existen en .env.local');
      console.log('📋 Usando configuración existente');
      return;
    }

    // Agregar sección OAuth
    const oauthSection = `

# =============================================================================
# 🏢 GPT ACTIONS OAUTH CONFIGURATION
# =============================================================================
# Configuración OAuth 2.0 + OIDC para GPT Actions
# Siguiendo documentación oficial de OpenAI

# OAuth Provider Configuration
OAUTH_ISSUER=${oauthVars.OAUTH_ISSUER}
OAUTH_AUDIENCE=${oauthVars.OAUTH_AUDIENCE}
OAUTH_CLIENT_ID=${oauthVars.OAUTH_CLIENT_ID}
OAUTH_CLIENT_SECRET=${oauthVars.OAUTH_CLIENT_SECRET}
OAUTH_REDIRECT_URI=${oauthVars.OAUTH_REDIRECT_URI}
OAUTH_SCOPES=${oauthVars.OAUTH_SCOPES}

# JWT Configuration
JWT_PRIVATE_KEY=${oauthVars.JWT_PRIVATE_KEY}
JWT_PUBLIC_KEY=${oauthVars.JWT_PUBLIC_KEY}
JWT_KID=${oauthVars.JWT_KID}
JWT_ALGORITHM=${oauthVars.JWT_ALGORITHM}
JWT_EXPIRES_IN=${oauthVars.JWT_EXPIRES_IN}
JWT_REFRESH_EXPIRES_IN=${oauthVars.JWT_REFRESH_EXPIRES_IN}

# PKCE Configuration
PKCE_CODE_CHALLENGE_METHOD=${oauthVars.PKCE_CODE_CHALLENGE_METHOD}
PKCE_CODE_VERIFIER_LENGTH=${oauthVars.PKCE_CODE_VERIFIER_LENGTH}

# GPT Actions Specific
GPT_ACTIONS_API_KEY=${oauthVars.GPT_ACTIONS_API_KEY}
GPT_ACTIONS_RATE_LIMIT=${oauthVars.GPT_ACTIONS_RATE_LIMIT}

# Internal Gateway Configuration
GATEWAY_INTERNAL_KEY=${oauthVars.GATEWAY_INTERNAL_KEY}
AUDITORIA_BASE_URL=${oauthVars.AUDITORIA_BASE_URL}

# IP Hashing for Privacy
IP_SALT=${oauthVars.IP_SALT}`;

    // Agregar al final del archivo
    const newConfig = currentConfig + oauthSection;
    
    // Crear backup
    const backupPath = path.join(this.projectRoot, '.env.local.oauth-backup');
    fs.writeFileSync(backupPath, currentConfig);
    console.log('✅ Backup creado: .env.local.oauth-backup');

    // Escribir nueva configuración
    fs.writeFileSync(this.envLocalPath, newConfig);
    console.log('✅ Variables OAuth agregadas a .env.local');

    return oauthVars;
  }

  /**
   * Mostrar configuración para OpenAI Platform
   */
  showOpenAIConfig() {
    console.log('\n🔧 CONFIGURACIÓN PARA OPENAI PLATFORM:');
    console.log('=' .repeat(60));
    
    console.log(`
📋 Copia esta configuración en OpenAI Platform:

{
  "authorization_url": "https://auditoria.fascinantedigital.com/oauth/authorize",
  "token_url": "https://auditoria.fascinantedigital.com/oauth/token",
  "userinfo_url": "https://auditoria.fascinantedigital.com/oauth/userinfo",
  "jwks_url": "https://auditoria.fascinantedigital.com/.well-known/jwks.json",
  "scopes": ["openid", "email", "profile"],
  "audience": "https://auditoria.fascinantedigital.com"
}

🔑 CLIENT CREDENTIALS:
- Client ID: Configura en OAUTH_CLIENT_ID
- Client Secret: Configura en OAUTH_CLIENT_SECRET
- Redirect URI: https://platform.openai.com/oauth/callback

📚 PASOS EN OPENAI PLATFORM:
1. Ve a https://platform.openai.com/
2. Crea una nueva aplicación OAuth
3. Configura los endpoints arriba
4. Obtén Client ID y Client Secret
5. Actualiza .env.local con las credenciales
`);
  }

  /**
   * Mostrar comandos de prueba
   */
  showTestCommands() {
    console.log('\n🧪 COMANDOS DE PRUEBA:');
    console.log('=' .repeat(60));
    
    console.log(`
🔧 PROBAR ENDPOINTS:

# 1. Probar JWKS endpoint
curl https://auditoria.fascinantedigital.com/.well-known/jwks.json

# 2. Probar leads endpoint (API Key)
curl -X POST https://auditoria.fascinantedigital.com/api/gpt-actions/leads \\
  -H "Authorization: Bearer \${GPT_ACTIONS_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "consent": true,
    "name": "Test User"
  }'

# 3. Probar PageSpeed endpoint (API Key)
curl -X POST https://auditoria.fascinantedigital.com/api/gpt-actions/pagespeed \\
  -H "Authorization: Bearer \${GPT_ACTIONS_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://www.example.com",
    "strategy": "desktop"
  }'

# 4. Probar OAuth authorization (desde navegador)
https://auditoria.fascinantedigital.com/oauth/authorize?client_id=\${OAUTH_CLIENT_ID}&redirect_uri=\${OAUTH_REDIRECT_URI}&scope=openid%20email%20profile&state=test123&response_type=code&code_challenge=test&code_challenge_method=S256
`);
  }

  /**
   * Ejecutar configuración completa
   */
  async setup() {
    console.log('🚀 CONFIGURANDO SISTEMA OAUTH COMPLETO...');
    console.log('=' .repeat(60));

    try {
      // 1. Agregar variables OAuth
      const oauthVars = this.addOAuthVariables();
      
      // 2. Mostrar configuración OpenAI
      this.showOpenAIConfig();
      
      // 3. Mostrar comandos de prueba
      this.showTestCommands();
      
      console.log('\n✅ CONFIGURACIÓN OAUTH COMPLETADA');
      console.log('=' .repeat(60));
      console.log('📋 Próximos pasos:');
      console.log('1. Configura OAuth en OpenAI Platform');
      console.log('2. Actualiza OAUTH_CLIENT_ID y OAUTH_CLIENT_SECRET');
      console.log('3. Prueba los endpoints con los comandos arriba');
      console.log('4. Configura GPT Actions con el OpenAPI schema');
      
    } catch (error) {
      console.error('❌ Error en configuración OAuth:', error);
      process.exit(1);
    }
  }
}

// CLI Interface
if (require.main === module) {
  const setup = new OAuthConfigSetup();
  const command = process.argv[2];
  
  switch (command) {
    case 'setup':
      setup.setup();
      break;
      
    case 'keys':
      setup.generateRSAKeys();
      break;
      
    case 'openai':
      setup.showOpenAIConfig();
      break;
      
    case 'test':
      setup.showTestCommands();
      break;
      
    default:
      console.log(`
🔐 FASCINANTE DIGITAL - OAUTH CONFIGURATION SETUP

Uso:
  node scripts/setup-oauth-config.js setup    # Configuración completa
  node scripts/setup-oauth-config.js keys     # Solo generar claves RSA
  node scripts/setup-oauth-config.js openai   # Mostrar config OpenAI
  node scripts/setup-oauth-config.js test     # Mostrar comandos de prueba

Ejemplos:
  node scripts/setup-oauth-config.js setup
  node scripts/setup-oauth-config.js keys
`);
      break;
  }
}

module.exports = OAuthConfigSetup;
