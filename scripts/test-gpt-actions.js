#!/usr/bin/env node

/**
 * 🧪 FASCINANTE DIGITAL - GPT ACTIONS TESTING
 * 
 * Script para probar endpoints GPT Actions
 * Verifica que todo el sistema funciona correctamente
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');

class GPTActionsTester {
  constructor() {
    this.baseUrl = 'https://auditoria.fascinantedigital.com';
    this.apiKey = process.env.GPT_ACTIONS_API_KEY;
  }

  /**
   * Hacer request HTTP/HTTPS
   */
  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const isHttps = url.startsWith('https://');
      const client = isHttps ? https : http;
      
      const req = client.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
          } catch (error) {
            resolve({ status: res.statusCode, data: data, headers: res.headers });
          }
        });
      });
      
      req.on('error', reject);
      
      if (options.body) {
        req.write(options.body);
      }
      
      req.end();
    });
  }

  /**
   * Probar JWKS endpoint
   */
  async testJWKS() {
    console.log('🔑 PROBANDO JWKS ENDPOINT...');
    console.log('=' .repeat(50));
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/.well-known/jwks.json`);
      
      if (response.status === 200) {
        console.log('✅ JWKS endpoint funcionando');
        console.log(`📋 Status: ${response.status}`);
        console.log(`📋 Keys count: ${response.data.keys?.length || 0}`);
        if (response.data.keys?.[0]) {
          console.log(`📋 Key ID: ${response.data.keys[0].kid}`);
          console.log(`📋 Key Type: ${response.data.keys[0].kty}`);
        }
      } else {
        console.log('❌ JWKS endpoint error');
        console.log(`📋 Status: ${response.status}`);
        console.log(`📋 Response: ${JSON.stringify(response.data, null, 2)}`);
      }
    } catch (error) {
      console.log('❌ Error en JWKS endpoint:', error.message);
    }
  }

  /**
   * Probar leads endpoint
   */
  async testLeadsEndpoint() {
    console.log('\n📊 PROBANDO LEADS ENDPOINT...');
    console.log('=' .repeat(50));
    
    if (!this.apiKey) {
      console.log('⚠️  GPT_ACTIONS_API_KEY no configurada');
      return;
    }

    const testData = {
      email: 'test@example.com',
      consent: true,
      name: 'Test User',
      notes: 'Test desde script'
    };

    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/gpt-actions/leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      if (response.status === 201) {
        console.log('✅ Leads endpoint funcionando');
        console.log(`📋 Status: ${response.status}`);
        console.log(`📋 Lead ID: ${response.data.id}`);
        console.log(`📋 Email: ${response.data.email}`);
        console.log(`📋 Consent: ${response.data.consent}`);
        console.log(`📋 Created: ${response.data.created_at}`);
      } else {
        console.log('❌ Leads endpoint error');
        console.log(`📋 Status: ${response.status}`);
        console.log(`📋 Response: ${JSON.stringify(response.data, null, 2)}`);
      }
    } catch (error) {
      console.log('❌ Error en leads endpoint:', error.message);
    }
  }

  /**
   * Probar PageSpeed endpoint
   */
  async testPageSpeedEndpoint() {
    console.log('\n🚀 PROBANDO PAGESPEED ENDPOINT...');
    console.log('=' .repeat(50));
    
    if (!this.apiKey) {
      console.log('⚠️  GPT_ACTIONS_API_KEY no configurada');
      return;
    }

    const testData = {
      url: 'https://www.example.com',
      strategy: 'desktop'
    };

    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/gpt-actions/pagespeed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      if (response.status === 200) {
        console.log('✅ PageSpeed endpoint funcionando');
        console.log(`📋 Status: ${response.status}`);
        console.log(`📋 Performance Score: ${response.data.performance_score}`);
        if (response.data.core_web_vitals) {
          console.log(`📋 LCP: ${response.data.core_web_vitals.lcp}`);
          console.log(`📋 FCP: ${response.data.core_web_vitals.fcp}`);
          console.log(`📋 CLS: ${response.data.core_web_vitals.cls}`);
        }
      } else {
        console.log('❌ PageSpeed endpoint error');
        console.log(`📋 Status: ${response.status}`);
        console.log(`📋 Response: ${JSON.stringify(response.data, null, 2)}`);
      }
    } catch (error) {
      console.log('❌ Error en PageSpeed endpoint:', error.message);
    }
  }

  /**
   * Probar autenticación sin token
   */
  async testUnauthorized() {
    console.log('\n🔒 PROBANDO AUTENTICACIÓN (SIN TOKEN)...');
    console.log('=' .repeat(50));

    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/gpt-actions/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          consent: true
        })
      });

      if (response.status === 401) {
        console.log('✅ Autenticación funcionando (rechaza sin token)');
        console.log(`📋 Status: ${response.status}`);
        console.log(`📋 Error: ${response.data.error}`);
      } else {
        console.log('❌ Autenticación no funcionando');
        console.log(`📋 Status: ${response.status}`);
        console.log(`📋 Response: ${JSON.stringify(response.data, null, 2)}`);
      }
    } catch (error) {
      console.log('❌ Error en test de autenticación:', error.message);
    }
  }

  /**
   * Probar validación de consent
   */
  async testConsentValidation() {
    console.log('\n📋 PROBANDO VALIDACIÓN DE CONSENT...');
    console.log('=' .repeat(50));
    
    if (!this.apiKey) {
      console.log('⚠️  GPT_ACTIONS_API_KEY no configurada');
      return;
    }

    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/gpt-actions/leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          consent: false // Sin consent
        })
      });

      if (response.status === 400) {
        console.log('✅ Validación de consent funcionando');
        console.log(`📋 Status: ${response.status}`);
        console.log(`📋 Error: ${response.data.error}`);
        if (response.data.details) {
          console.log(`📋 Details: ${JSON.stringify(response.data.details, null, 2)}`);
        }
      } else {
        console.log('❌ Validación de consent no funcionando');
        console.log(`📋 Status: ${response.status}`);
        console.log(`📋 Response: ${JSON.stringify(response.data, null, 2)}`);
      }
    } catch (error) {
      console.log('❌ Error en test de consent:', error.message);
    }
  }

  /**
   * Ejecutar todos los tests
   */
  async runAllTests() {
    console.log('🧪 EJECUTANDO TESTS COMPLETOS DE GPT ACTIONS...');
    console.log('=' .repeat(60));
    console.log(`🌐 Base URL: ${this.baseUrl}`);
    console.log(`🔑 API Key: ${this.apiKey ? 'Configurada' : 'No configurada'}`);
    console.log('=' .repeat(60));

    await this.testJWKS();
    await this.testLeadsEndpoint();
    await this.testPageSpeedEndpoint();
    await this.testUnauthorized();
    await this.testConsentValidation();

    console.log('\n✅ TESTS COMPLETADOS');
    console.log('=' .repeat(60));
    console.log('📋 Si todos los tests pasaron, el sistema está funcionando correctamente');
    console.log('📋 Si hay errores, revisa la configuración y logs');
  }
}

// CLI Interface
if (require.main === module) {
  const tester = new GPTActionsTester();
  const command = process.argv[2];
  
  switch (command) {
    case 'all':
      tester.runAllTests();
      break;
      
    case 'jwks':
      tester.testJWKS();
      break;
      
    case 'leads':
      tester.testLeadsEndpoint();
      break;
      
    case 'pagespeed':
      tester.testPageSpeedEndpoint();
      break;
      
    case 'auth':
      tester.testUnauthorized();
      break;
      
    case 'consent':
      tester.testConsentValidation();
      break;
      
    default:
      console.log(`
🧪 FASCINANTE DIGITAL - GPT ACTIONS TESTING

Uso:
  node scripts/test-gpt-actions.js all        # Todos los tests
  node scripts/test-gpt-actions.js jwks       # Test JWKS endpoint
  node scripts/test-gpt-actions.js leads      # Test leads endpoint
  node scripts/test-gpt-actions.js pagespeed  # Test PageSpeed endpoint
  node scripts/test-gpt-actions.js auth       # Test autenticación
  node scripts/test-gpt-actions.js consent    # Test validación consent

Ejemplos:
  node scripts/test-gpt-actions.js all
  node scripts/test-gpt-actions.js leads
`);
      break;
  }
}

module.exports = GPTActionsTester;
