#!/usr/bin/env node

/**
 * 🚀 FASCINANTE DIGITAL - ELITE DOMAIN MANAGER
 * 
 * Sistema PRO ELITE para gestión automática de dominios:
 * 1. Crear repositorio GitHub
 * 2. Configurar Cloudflare DNS
 * 3. Configurar Vercel
 * 4. Configurar Terraform
 * 5. Todo en un solo comando
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class EliteDomainManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.config = this.loadConfig();
  }

  /**
   * Cargar configuración
   */
  loadConfig() {
    const configPath = path.join(this.projectRoot, '.elite-config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    
    return {
      github: {
        username: 'alexanderovie',
        organization: 'fascinante-digital'
      },
      cloudflare: {
        zoneId: '6d7328e7f3edb975ef1f52cdb29178b7',
        domain: 'fascinantedigital.com'
      },
      vercel: {
        team: 'fascinante-digital'
      },
      gcp: {
        project: 'fascinante-digit-1698295291643',
        serviceAccount: 'fascinante-prod-api-service@fascinante-digit-1698295291643.iam.gserviceaccount.com'
      }
    };
  }

  /**
   * Crear dominio completo
   */
  async createDomain(subdomain, options = {}) {
    console.log(`🚀 CREANDO DOMINIO ELITE: ${subdomain}.fascinantedigital.com`);
    console.log('=' .repeat(60));

    try {
      // 1. Crear repositorio GitHub
      await this.createGitHubRepo(subdomain, options);
      
      // 2. Configurar Cloudflare DNS
      await this.configureCloudflareDNS(subdomain);
      
      // 3. Configurar Terraform
      await this.configureTerraform(subdomain);
      
      // 4. Crear proyecto Vercel
      await this.createVercelProject(subdomain);
      
      // 5. Configurar CI/CD
      await this.setupCICD(subdomain);
      
      console.log('✅ DOMINIO CREADO EXITOSAMENTE');
      console.log(`🌐 URL: https://${subdomain}.fascinantedigital.com`);
      console.log(`📁 Repo: https://github.com/alexanderovie/${subdomain}`);
      
    } catch (error) {
      console.error('❌ Error creando dominio:', error.message);
      throw error;
    }
  }

  /**
   * Crear repositorio GitHub
   */
  async createGitHubRepo(subdomain, options) {
    console.log('📁 Creando repositorio GitHub...');
    
    const repoName = options.repoName || subdomain;
    const isPrivate = options.private !== false;
    const description = options.description || `🚀 ${subdomain} - Fascinante Digital Elite Platform`;
    
    const command = [
      'gh repo create',
      repoName,
      isPrivate ? '--private' : '--public',
      `--description "${description}"`,
      '--clone',
      '--add-readme'
    ].join(' ');
    
    execSync(command, { stdio: 'inherit' });
    
    console.log(`✅ Repositorio creado: ${repoName}`);
    return repoName;
  }

  /**
   * Configurar Cloudflare DNS
   */
  async configureCloudflareDNS(subdomain) {
    console.log('☁️ Configurando Cloudflare DNS...');
    
    const terraformDir = path.join(this.projectRoot, 'terraform');
    const terraformFile = path.join(terraformDir, `${subdomain}.tf`);
    
    const terraformConfig = `
# 🚀 ${subdomain.toUpperCase()} - FASCINANTE DIGITAL ELITE
# Generado automáticamente por Elite Domain Manager

resource "cloudflare_record" "${subdomain}_cname" {
  zone_id = var.cloudflare_zone_id
  name    = "${subdomain}"
  content = "cname.vercel-dns.com"
  type    = "CNAME"
  ttl     = 1
  proxied = true
  
  comment = "🚀 ${subdomain} - Fascinante Digital Elite Platform"
}

# Output para referencia
output "${subdomain}_url" {
  value = "https://${subdomain}.fascinantedigital.com"
  description = "URL del dominio ${subdomain}"
}
`;

    fs.writeFileSync(terraformFile, terraformConfig);
    console.log(`✅ Terraform configurado: ${terraformFile}`);
    
    // Aplicar cambios
    execSync(`cd ${terraformDir} && terraform init && terraform plan`, { stdio: 'inherit' });
    console.log('✅ Cloudflare DNS configurado');
  }

  /**
   * Configurar Terraform
   */
  async configureTerraform(subdomain) {
    console.log('🏗️ Configurando Terraform...');
    
    // Agregar al archivo principal si no existe
    const mainTfPath = path.join(this.projectRoot, 'terraform', 'main.tf');
    let mainTfContent = '';
    
    if (fs.existsSync(mainTfPath)) {
      mainTfContent = fs.readFileSync(mainTfPath, 'utf8');
    }
    
    // Verificar si ya existe la configuración
    if (!mainTfContent.includes(`"${subdomain}"`)) {
      const newRecord = `
# ${subdomain} - Fascinante Digital Elite
resource "cloudflare_record" "${subdomain}_cname" {
  zone_id = var.cloudflare_zone_id
  name    = "${subdomain}"
  content = "cname.vercel-dns.com"
  type    = "CNAME"
  ttl     = 1
  proxied = true
  
  comment = "🚀 ${subdomain} - Fascinante Digital Elite Platform"
}
`;
      
      mainTfContent += newRecord;
      fs.writeFileSync(mainTfPath, mainTfContent);
      console.log(`✅ Agregado a main.tf: ${subdomain}`);
    }
  }

  /**
   * Crear proyecto Vercel
   */
  async createVercelProject(subdomain) {
    console.log('▲ Creando proyecto Vercel...');
    
    const repoName = subdomain;
    const vercelConfig = {
      name: repoName,
      framework: 'nextjs',
      buildCommand: 'pnpm build',
      outputDirectory: '.next',
      installCommand: 'pnpm install',
      devCommand: 'pnpm dev'
    };
    
    // Crear vercel.json
    const vercelJsonPath = path.join(this.projectRoot, '..', repoName, 'vercel.json');
    fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
    
    console.log(`✅ Configuración Vercel creada para ${repoName}`);
  }

  /**
   * Configurar CI/CD
   */
  async setupCICD(subdomain) {
    console.log('🔄 Configurando CI/CD...');
    
    const repoName = subdomain;
    const workflowsDir = path.join(this.projectRoot, '..', repoName, '.github', 'workflows');
    
    // Crear directorio workflows
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir, { recursive: true });
    }
    
    const ciCdConfig = `name: 🚀 Elite CI/CD - ${subdomain}

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
`;

    const workflowPath = path.join(workflowsDir, 'ci-cd.yml');
    fs.writeFileSync(workflowPath, ciCdConfig);
    
    console.log(`✅ CI/CD configurado para ${repoName}`);
  }

  /**
   * Listar dominios existentes
   */
  listDomains() {
    console.log('📋 DOMINIOS EXISTENTES - FASCINANTE DIGITAL');
    console.log('=' .repeat(50));
    
    const terraformDir = path.join(this.projectRoot, 'terraform');
    const mainTfPath = path.join(terraformDir, 'main.tf');
    
    if (fs.existsSync(mainTfPath)) {
      const content = fs.readFileSync(mainTfPath, 'utf8');
      const domains = content.match(/name\s*=\s*"([^"]+)"/g) || [];
      
      domains.forEach(domain => {
        const domainName = domain.match(/"([^"]+)"/)[1];
        if (domainName !== 'fascinantedigital.com') {
          console.log(`🌐 ${domainName}.fascinantedigital.com`);
        }
      });
    }
    
    console.log('=' .repeat(50));
  }

  /**
   * Eliminar dominio
   */
  async deleteDomain(subdomain) {
    console.log(`🗑️ ELIMINANDO DOMINIO: ${subdomain}.fascinantedigital.com`);
    
    try {
      // 1. Eliminar de Terraform
      await this.removeFromTerraform(subdomain);
      
      // 2. Eliminar repositorio GitHub
      await this.deleteGitHubRepo(subdomain);
      
      // 3. Aplicar cambios en Cloudflare
      execSync(`cd terraform && terraform apply -auto-approve`, { stdio: 'inherit' });
      
      console.log(`✅ Dominio ${subdomain} eliminado exitosamente`);
      
    } catch (error) {
      console.error('❌ Error eliminando dominio:', error.message);
      throw error;
    }
  }

  /**
   * Eliminar de Terraform
   */
  async removeFromTerraform(subdomain) {
    const mainTfPath = path.join(this.projectRoot, 'terraform', 'main.tf');
    
    if (fs.existsSync(mainTfPath)) {
      let content = fs.readFileSync(mainTfPath, 'utf8');
      
      // Eliminar configuración del dominio
      const regex = new RegExp(`# ${subdomain}[\\s\\S]*?^}`, 'gm');
      content = content.replace(regex, '');
      
      fs.writeFileSync(mainTfPath, content);
      console.log(`✅ Eliminado de Terraform: ${subdomain}`);
    }
  }

  /**
   * Eliminar repositorio GitHub
   */
  async deleteGitHubRepo(subdomain) {
    try {
      execSync(`gh repo delete ${subdomain} --yes`, { stdio: 'inherit' });
      console.log(`✅ Repositorio eliminado: ${subdomain}`);
    } catch (error) {
      console.log(`⚠️ No se pudo eliminar repositorio: ${subdomain}`);
    }
  }
}

// CLI Interface
if (require.main === module) {
  const manager = new EliteDomainManager();
  const command = process.argv[2];
  const subdomain = process.argv[3];
  
  switch (command) {
    case 'create':
      if (!subdomain) {
        console.error('❌ Uso: node elite-domain-manager.js create <subdomain>');
        process.exit(1);
      }
      manager.createDomain(subdomain, {
        description: process.argv[4] || `🚀 ${subdomain} - Fascinante Digital Elite Platform`,
        private: process.argv.includes('--private')
      });
      break;
      
    case 'list':
      manager.listDomains();
      break;
      
    case 'delete':
      if (!subdomain) {
        console.error('❌ Uso: node elite-domain-manager.js delete <subdomain>');
        process.exit(1);
      }
      manager.deleteDomain(subdomain);
      break;
      
    default:
      console.log(`
🚀 FASCINANTE DIGITAL - ELITE DOMAIN MANAGER

Uso:
  node elite-domain-manager.js create <subdomain> [description] [--private]
  node elite-domain-manager.js list
  node elite-domain-manager.js delete <subdomain>

Ejemplos:
  node elite-domain-manager.js create app "🚀 App Platform"
  node elite-domain-manager.js create dashboard --private
  node elite-domain-manager.js list
  node elite-domain-manager.js delete old-app
`);
      break;
  }
}

module.exports = EliteDomainManager;
