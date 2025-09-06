#!/bin/bash
# 🔐 FASCINANTE DIGITAL - SETUP GITHUB SECRETS ELITE
# Script para configurar todos los secrets necesarios para CI/CD

set -e

# 🎨 Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🔐 CONFIGURANDO GITHUB SECRETS ELITE${NC}"
echo -e "${BLUE}=====================================${NC}"

# 📋 Variables
REPO_OWNER="alexanderoviedo"
REPO_NAME="fascinante-dataforseo-gateway"

# 🔍 Verificar que gh CLI esté instalado
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI no está instalado${NC}"
    echo -e "${YELLOW}📦 Instalando...${NC}"
    brew install gh
fi

# 🔐 Verificar autenticación
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}🔐 Autenticando con GitHub...${NC}"
    gh auth login
fi

echo -e "${BLUE}🔐 Configurando secrets para CI/CD...${NC}"

# 🔑 DataForSEO Credentials
echo -e "${YELLOW}📝 Configurando DataForSEO credentials...${NC}"
gh secret set DATAFORSEO_USERNAME --body "info@fascinantedigital.com" --repo "$REPO_OWNER/$REPO_NAME"
gh secret set DATAFORSEO_PASSWORD --body "1dca310be03b7a87" --repo "$REPO_OWNER/$REPO_NAME"

# 🌐 Cloudflare Credentials
echo -e "${YELLOW}📝 Configurando Cloudflare credentials...${NC}"
gh secret set CLOUDFLARE_API_TOKEN --body "WMRYGThMc0sqAc4PJRsgt-C9D6oMLzri3uBZ7F8k" --repo "$REPO_OWNER/$REPO_NAME"
gh secret set CLOUDFLARE_ZONE_ID --body "6d7328e7f3edb975ef1f52cdb29178b7" --repo "$REPO_OWNER/$REPO_NAME"

# 🚀 Vercel Credentials (necesitarás obtener estos)
echo -e "${YELLOW}📝 Configurando Vercel credentials...${NC}"
echo -e "${BLUE}⚠️  Necesitas obtener estos valores de Vercel:${NC}"
echo -e "   1. Ve a: https://vercel.com/account/tokens"
echo -e "   2. Crea un token"
echo -e "   3. Ve a tu proyecto en Vercel"
echo -e "   4. Copia el Project ID y Org ID"
echo

read -p "🔑 Ingresa tu Vercel Token: " -s VERCEL_TOKEN
echo
read -p "🏢 Ingresa tu Vercel Org ID: " VERCEL_ORG_ID
read -p "📁 Ingresa tu Vercel Project ID: " VERCEL_PROJECT_ID

gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN" --repo "$REPO_OWNER/$REPO_NAME"
gh secret set VERCEL_ORG_ID --body "$VERCEL_ORG_ID" --repo "$REPO_OWNER/$REPO_NAME"
gh secret set VERCEL_PROJECT_ID --body "$VERCEL_PROJECT_ID" --repo "$REPO_OWNER/$REPO_NAME"

# 🔐 API Gateway Secrets
echo -e "${YELLOW}📝 Configurando API Gateway secrets...${NC}"
gh secret set API_GATEWAY_SECRET --body "$(openssl rand -hex 32)" --repo "$REPO_OWNER/$REPO_NAME"
gh secret set JWT_SECRET --body "$(openssl rand -hex 32)" --repo "$REPO_OWNER/$REPO_NAME"

# 📊 Verificar secrets configurados
echo -e "${BLUE}📊 Verificando secrets configurados...${NC}"
gh secret list --repo "$REPO_OWNER/$REPO_NAME"

echo -e "${GREEN}🎉 SECRETS CONFIGURADOS EXITOSAMENTE${NC}"
echo -e "${CYAN}===============================${NC}"
echo -e "${GREEN}✅ DataForSEO credentials${NC}"
echo -e "${GREEN}✅ Cloudflare credentials${NC}"
echo -e "${GREEN}✅ Vercel credentials${NC}"
echo -e "${GREEN}✅ API Gateway secrets${NC}"
echo
echo -e "${PURPLE}🎯 PRÓXIMOS PASOS:${NC}"
echo -e "${BLUE}==================${NC}"
echo -e "1. Haz commit y push de tus cambios"
echo -e "2. El CI/CD se ejecutará automáticamente"
echo -e "3. Tu API estará disponible en auditoria.fascinantedigital.com"
echo
echo -e "${GREEN}🚀 ¡Workflow ELITE configurado!${NC}"
