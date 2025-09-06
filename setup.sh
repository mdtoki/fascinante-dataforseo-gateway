#!/bin/bash

# Fascinante Digital - DataForSEO API Gateway Setup
# Script de configuración automática

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando configuración del API Gateway DataForSEO...${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado. Por favor instala Node.js 18+${NC}"
    exit 1
fi

# Verificar pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm no está instalado. Instalando...${NC}"
    npm install -g pnpm
fi

# Verificar versiones
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
PNPM_VERSION=$(pnpm -v | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js versión $NODE_VERSION detectada. Se requiere versión 18+${NC}"
    exit 1
fi

if [ "$PNPM_VERSION" -lt 8 ]; then
    echo -e "${RED}❌ pnpm versión $PNPM_VERSION detectada. Se requiere versión 8+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) y pnpm $(pnpm -v) detectados${NC}"

# Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
pnpm install

# Crear archivo .env.local si no existe
if [ ! -f .env.local ]; then
    echo -e "${BLUE}📝 Creando archivo .env.local...${NC}"
    cp env.local.example .env.local
    echo -e "${YELLOW}⚠️  Por favor edita .env.local con tus credenciales de DataForSEO${NC}"
fi

# Crear directorio de logs
mkdir -p logs

# Verificar configuración
echo -e "${BLUE}🔍 Verificando configuración...${NC}"

# Verificar variables de entorno
if [ -f .env.local ]; then
    source .env.local
    if [ -z "$DATAFORSEO_USERNAME" ] || [ -z "$DATAFORSEO_PASSWORD" ]; then
        echo -e "${YELLOW}⚠️  Variables de entorno de DataForSEO no configuradas${NC}"
        echo -e "${YELLOW}   Edita .env.local con tus credenciales${NC}"
    else
        echo -e "${GREEN}✅ Variables de entorno configuradas${NC}"
    fi
fi

# Verificar TypeScript
echo -e "${BLUE}🔧 Verificando TypeScript...${NC}"
pnpm run type-check

# Verificar ESLint
echo -e "${BLUE}🔧 Verificando ESLint...${NC}"
pnpm run lint

# Build de prueba
echo -e "${BLUE}🏗️  Construyendo aplicación...${NC}"
pnpm run build

echo -e "${GREEN}🎉 Configuración completada exitosamente!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo -e "1. ${YELLOW}Edita .env.local con tus credenciales de DataForSEO${NC}"
echo -e "2. ${YELLOW}Ejecuta 'pnpm dev' para iniciar en desarrollo${NC}"
echo -e "3. ${YELLOW}Visita http://localhost:3000/api/health para verificar${NC}"
echo -e "4. ${YELLOW}Visita http://localhost:3000/api/docs para ver la documentación${NC}"
echo ""
echo -e "${BLUE}🚀 Comandos útiles:${NC}"
echo -e "• ${GREEN}pnpm dev${NC} - Iniciar en desarrollo"
echo -e "• ${GREEN}pnpm build${NC} - Construir para producción"
echo -e "• ${GREEN}pnpm start${NC} - Iniciar en producción"
echo -e "• ${GREEN}pnpm lint${NC} - Verificar código"
echo -e "• ${GREEN}pnpm type-check${NC} - Verificar tipos"
echo ""
echo -e "${BLUE}📚 Documentación:${NC}"
echo -e "• README.md - Documentación completa"
echo -e "• domain-setup.md - Configuración de dominio"
echo -e "• http://localhost:3000/api/docs - API Documentation"
echo ""
echo -e "${GREEN}¡API Gateway DataForSEO listo para usar! 🎉${NC}"