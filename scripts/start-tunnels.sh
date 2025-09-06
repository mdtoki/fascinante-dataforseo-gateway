#!/bin/bash
# 🚇 FASCINANTE DIGITAL - START TUNNELS ELITE
# Script para iniciar todos los túneles de Cloudflared

set -e

# 🎨 Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🚇 INICIANDO TÚNELES ELITE - FASCINANTE DIGITAL${NC}"
echo -e "${BLUE}==============================================${NC}"

# 📋 Variables
PROJECT_DIR="$(pwd)"
CLOUDFLARED_DIR="$PROJECT_DIR/cloudflared"

# 🔍 Verificar que cloudflared esté instalado
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}❌ Cloudflared no está instalado${NC}"
    echo -e "${YELLOW}📦 Instalando...${NC}"
    brew install cloudflare/cloudflare/cloudflared
fi

# 🔍 Verificar autenticación
if ! cloudflared tunnel list &> /dev/null; then
    echo -e "${YELLOW}🔐 Autenticando con Cloudflare...${NC}"
    cloudflared login
fi

# 🚇 Función para iniciar túnel
start_tunnel() {
    local tunnel_name=$1
    local config_file=$2
    local port=$3
    
    echo -e "${YELLOW}🚇 Iniciando túnel: $tunnel_name${NC}"
    
    # Verificar si el túnel existe
    if ! cloudflared tunnel list | grep -q "$tunnel_name"; then
        echo -e "${YELLOW}📦 Creando túnel: $tunnel_name${NC}"
        cloudflared tunnel create "$tunnel_name"
    fi
    
    # Iniciar túnel en background
    nohup cloudflared tunnel run "$tunnel_name" --config "$config_file" > "logs/$tunnel_name.log" 2>&1 &
    local pid=$!
    echo $pid > "pids/$tunnel_name.pid"
    
    echo -e "${GREEN}✅ Túnel $tunnel_name iniciado (PID: $pid)${NC}"
    echo -e "${BLUE}📊 Logs: logs/$tunnel_name.log${NC}"
}

# 📁 Crear directorios necesarios
mkdir -p logs pids

# 🚇 Iniciar túneles
echo -e "${BLUE}🚇 Iniciando túneles...${NC}"

# Túnel de Auditoria
start_tunnel "auditoria-tunnel" "$CLOUDFLARED_DIR/auditoria-config.yml" "3000"

# Túnel de API
start_tunnel "api-tunnel" "$CLOUDFLARED_DIR/api-config.yml" "3001"

# ⏳ Esperar un momento para que los túneles se establezcan
echo -e "${YELLOW}⏳ Esperando que los túneles se establezcan...${NC}"
sleep 5

# 📊 Mostrar estado de túneles
echo -e "${PURPLE}📊 ESTADO DE TÚNELES:${NC}"
echo -e "${BLUE}====================${NC}"
cloudflared tunnel list

# 🧪 Probar conectividad
echo -e "${PURPLE}🧪 PROBANDO CONECTIVIDAD:${NC}"
echo -e "${BLUE}=======================${NC}"

# Probar auditoria
echo -e "${YELLOW}🔍 Probando auditoria.fascinantedigital.com...${NC}"
if curl -s -f "https://auditoria.fascinantedigital.com/health" > /dev/null; then
    echo -e "${GREEN}✅ auditoria.fascinantedigital.com - OK${NC}"
else
    echo -e "${YELLOW}⚠️  auditoria.fascinantedigital.com - No disponible${NC}"
fi

# Probar API
echo -e "${YELLOW}🔍 Probando api.fascinantedigital.com...${NC}"
if curl -s -f "https://api.fascinantedigital.com/health" > /dev/null; then
    echo -e "${GREEN}✅ api.fascinantedigital.com - OK${NC}"
else
    echo -e "${YELLOW}⚠️  api.fascinantedigital.com - No disponible${NC}"
fi

# 📋 Mostrar comandos útiles
echo -e "${PURPLE}🎯 COMANDOS ÚTILES:${NC}"
echo -e "${BLUE}==================${NC}"
echo -e "${GREEN}📊 Ver logs:${NC}"
echo -e "  tail -f logs/auditoria-tunnel.log"
echo -e "  tail -f logs/api-tunnel.log"
echo
echo -e "${GREEN}🛑 Detener túneles:${NC}"
echo -e "  ./scripts/stop-tunnels.sh"
echo
echo -e "${GREEN}📊 Estado de túneles:${NC}"
echo -e "  cloudflared tunnel list"
echo -e "  cloudflared tunnel info auditoria-tunnel"
echo
echo -e "${GREEN}🧪 Probar endpoints:${NC}"
echo -e "  curl https://auditoria.fascinantedigital.com/health"
echo -e "  curl https://api.fascinantedigital.com/health"

echo -e "${GREEN}🎉 TÚNELES INICIADOS EXITOSAMENTE${NC}"
