#!/bin/bash
# 🚀 FASCINANTE DIGITAL - DEPLOY ELITE
# Script para deployment automático

set -e

# 🎨 Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🚀 DEPLOY ELITE - FASCINANTE DIGITAL${NC}"
echo -e "${BLUE}====================================${NC}"

# 📋 Variables
BRANCH=$(git branch --show-current)
COMMIT_MSG="$1"

# 🔍 Verificar que estamos en main/master
if [[ "$BRANCH" != "main" && "$BRANCH" != "master" ]]; then
    echo -e "${YELLOW}⚠️  No estás en la rama main/master${NC}"
    echo -e "${BLUE}Cambiando a main...${NC}"
    git checkout main
fi

# 📦 Verificar que no hay cambios sin commitear
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}📦 Hay cambios sin commitear${NC}"
    
    if [[ -z "$COMMIT_MSG" ]]; then
        read -p "💬 Mensaje de commit: " COMMIT_MSG
    fi
    
    # Agregar todos los cambios
    git add .
    
    # Commit
    git commit -m "$COMMIT_MSG"
    
    echo -e "${GREEN}✅ Cambios commiteados${NC}"
fi

# 🚀 Push a GitHub
echo -e "${BLUE}🚀 Haciendo push a GitHub...${NC}"
git push origin main

echo -e "${GREEN}🎉 DEPLOY INICIADO${NC}"
echo -e "${CYAN}=================${NC}"
echo -e "${GREEN}✅ Código enviado a GitHub${NC}"
echo -e "${GREEN}✅ CI/CD ejecutándose automáticamente${NC}"
echo -e "${GREEN}✅ Deploy a Vercel en progreso${NC}"
echo -e "${GREEN}✅ DNS actualizándose${NC}"
echo
echo -e "${PURPLE}🌐 Tu API estará disponible en:${NC}"
echo -e "${BLUE}   https://auditoria.fascinantedigital.com${NC}"
echo
echo -e "${YELLOW}📊 Puedes monitorear el progreso en:${NC}"
echo -e "${BLUE}   https://github.com/alexanderoviedo/fascinante-dataforseo-gateway/actions${NC}"
echo -e "${BLUE}   https://vercel.com/dashboard${NC}"
