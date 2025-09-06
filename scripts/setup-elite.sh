#!/bin/bash
# 🚀 FASCINANTE DIGITAL - SETUP ELITE PRO
# Script de configuración completa para Cloudflare + Terraform + Cloudflared

set -e

# 🎨 Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 📋 Variables
DOMAIN="fascinantedigital.com"
PROJECT_DIR="$(pwd)"
TERRAFORM_DIR="$PROJECT_DIR/terraform"
CLOUDFLARED_DIR="$PROJECT_DIR/cloudflared"

echo -e "${PURPLE}🚀 FASCINANTE DIGITAL - SETUP ELITE PRO${NC}"
echo -e "${CYAN}===========================================${NC}"

# 🔍 Verificar dependencias
check_dependencies() {
    echo -e "${BLUE}🔍 Verificando dependencias...${NC}"
    
    # Verificar Terraform
    if ! command -v terraform &> /dev/null; then
        echo -e "${RED}❌ Terraform no está instalado${NC}"
        echo -e "${YELLOW}📦 Instalando Terraform...${NC}"
        brew install terraform
    else
        echo -e "${GREEN}✅ Terraform: $(terraform version | head -n1)${NC}"
    fi
    
    # Verificar Cloudflared
    if ! command -v cloudflared &> /dev/null; then
        echo -e "${RED}❌ Cloudflared no está instalado${NC}"
        echo -e "${YELLOW}📦 Instalando Cloudflared...${NC}"
        brew install cloudflare/cloudflare/cloudflared
    else
        echo -e "${GREEN}✅ Cloudflared: $(cloudflared --version)${NC}"
    fi
    
    # Verificar jq
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}📦 Instalando jq...${NC}"
        brew install jq
    else
        echo -e "${GREEN}✅ jq instalado${NC}"
    fi
}

# 🔐 Configurar credenciales
setup_credentials() {
    echo -e "${BLUE}🔐 Configurando credenciales...${NC}"
    
    # Verificar si existe terraform.tfvars
    if [ ! -f "$TERRAFORM_DIR/terraform.tfvars" ]; then
        echo -e "${YELLOW}⚠️  No se encontró terraform.tfvars${NC}"
        echo -e "${CYAN}📝 Creando archivo de configuración...${NC}"
        
        read -p "🔑 Ingresa tu Cloudflare API Token: " -s API_TOKEN
        echo
        read -p "🌐 Ingresa tu Zone ID: " ZONE_ID
        
        cat > "$TERRAFORM_DIR/terraform.tfvars" << EOF
# 🔐 CLOUDFLARE CREDENTIALS - FASCINANTE DIGITAL ELITE
cloudflare_api_token = "$API_TOKEN"
zone_id = "$ZONE_ID"
domain = "$DOMAIN"
environment = "production"
enable_workers = true
enable_zero_trust = true
cache_ttl = 3600
security_level = "medium"
EOF
        
        echo -e "${GREEN}✅ Credenciales configuradas${NC}"
    else
        echo -e "${GREEN}✅ Credenciales ya configuradas${NC}"
    fi
}

# 🏗️ Configurar Terraform
setup_terraform() {
    echo -e "${BLUE}🏗️ Configurando Terraform...${NC}"
    
    cd "$TERRAFORM_DIR"
    
    # Inicializar Terraform
    echo -e "${YELLOW}📦 Inicializando Terraform...${NC}"
    terraform init
    
    # Validar configuración
    echo -e "${YELLOW}🔍 Validando configuración...${NC}"
    terraform validate
    
    # Plan de despliegue
    echo -e "${YELLOW}📋 Generando plan de despliegue...${NC}"
    terraform plan -out=tfplan
    
    echo -e "${GREEN}✅ Terraform configurado${NC}"
}

# 🚇 Configurar Cloudflared
setup_cloudflared() {
    echo -e "${BLUE}🚇 Configurando Cloudflared...${NC}"
    
    # Verificar autenticación
    if ! cloudflared tunnel list &> /dev/null; then
        echo -e "${YELLOW}🔐 Autenticando con Cloudflare...${NC}"
        cloudflared login
    fi
    
    # Crear túneles
    echo -e "${YELLOW}🚇 Creando túneles...${NC}"
    
    # Túnel para auditoria
    if ! cloudflared tunnel list | grep -q "auditoria-tunnel"; then
        cloudflared tunnel create auditoria-tunnel
        echo -e "${GREEN}✅ Túnel auditoria-tunnel creado${NC}"
    else
        echo -e "${GREEN}✅ Túnel auditoria-tunnel ya existe${NC}"
    fi
    
    # Túnel para API
    if ! cloudflared tunnel list | grep -q "api-tunnel"; then
        cloudflared tunnel create api-tunnel
        echo -e "${GREEN}✅ Túnel api-tunnel creado${NC}"
    else
        echo -e "${GREEN}✅ Túnel api-tunnel ya existe${NC}"
    fi
    
    # Configurar DNS
    echo -e "${YELLOW}🌐 Configurando DNS...${NC}"
    cloudflared tunnel route dns auditoria-tunnel auditoria.$DOMAIN --overwrite
    cloudflared tunnel route dns api-tunnel api.$DOMAIN --overwrite
    
    echo -e "${GREEN}✅ Cloudflared configurado${NC}"
}

# 🚀 Desplegar infraestructura
deploy_infrastructure() {
    echo -e "${BLUE}🚀 Desplegando infraestructura...${NC}"
    
    cd "$TERRAFORM_DIR"
    
    # Aplicar cambios
    echo -e "${YELLOW}📦 Aplicando cambios de Terraform...${NC}"
    terraform apply -auto-approve
    
    echo -e "${GREEN}✅ Infraestructura desplegada${NC}"
}

# 🧪 Probar configuración
test_setup() {
    echo -e "${BLUE}🧪 Probando configuración...${NC}"
    
    # Probar health check
    echo -e "${YELLOW}🔍 Probando health check...${NC}"
    if curl -s -f "https://auditoria.$DOMAIN/health" > /dev/null; then
        echo -e "${GREEN}✅ Health check exitoso${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check no disponible (normal si el túnel no está corriendo)${NC}"
    fi
    
    # Mostrar información de túneles
    echo -e "${YELLOW}📊 Información de túneles:${NC}"
    cloudflared tunnel list
}

# 📋 Mostrar comandos útiles
show_commands() {
    echo -e "${PURPLE}🎯 COMANDOS ÚTILES ELITE:${NC}"
    echo -e "${CYAN}========================${NC}"
    echo
    echo -e "${GREEN}🚇 Iniciar túneles:${NC}"
    echo -e "  cloudflared tunnel run auditoria-tunnel --config cloudflared/auditoria-config.yml"
    echo -e "  cloudflared tunnel run api-tunnel --config cloudflared/api-config.yml"
    echo
    echo -e "${GREEN}🏗️ Gestión de Terraform:${NC}"
    echo -e "  cd terraform && terraform plan"
    echo -e "  cd terraform && terraform apply"
    echo -e "  cd terraform && terraform destroy"
    echo
    echo -e "${GREEN}📊 Monitoreo:${NC}"
    echo -e "  cloudflared tunnel list"
    echo -e "  cloudflared tunnel info auditoria-tunnel"
    echo -e "  curl https://auditoria.$DOMAIN/health"
    echo
    echo -e "${GREEN}🔧 Desarrollo:${NC}"
    echo -e "  pnpm dev  # Iniciar API Gateway local"
    echo -e "  ./scripts/start-tunnels.sh  # Iniciar todos los túneles"
    echo
}

# 🎯 Función principal
main() {
    check_dependencies
    setup_credentials
    setup_terraform
    setup_cloudflared
    
    echo -e "${PURPLE}🎯 ¿Deseas desplegar la infraestructura ahora? (y/n)${NC}"
    read -p "> " deploy_now
    
    if [[ $deploy_now == "y" || $deploy_now == "Y" ]]; then
        deploy_infrastructure
        test_setup
    fi
    
    show_commands
    
    echo -e "${GREEN}🎉 SETUP ELITE PRO COMPLETADO${NC}"
    echo -e "${CYAN}===============================${NC}"
}

# 🚀 Ejecutar
main "$@"
