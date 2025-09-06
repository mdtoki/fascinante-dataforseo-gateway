#!/bin/bash
# 🛑 FASCINANTE DIGITAL - STOP TUNNELS ELITE
# Script para detener todos los túneles de Cloudflared

set -e

# 🎨 Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🛑 DETENIENDO TÚNELES ELITE - FASCINANTE DIGITAL${NC}"
echo -e "${BLUE}===============================================${NC}"

# 📋 Variables
PROJECT_DIR="$(pwd)"

# 🛑 Función para detener túnel
stop_tunnel() {
    local tunnel_name=$1
    local pid_file="pids/$tunnel_name.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        echo -e "${YELLOW}🛑 Deteniendo túnel: $tunnel_name (PID: $pid)${NC}"
        
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            echo -e "${GREEN}✅ Túnel $tunnel_name detenido${NC}"
        else
            echo -e "${YELLOW}⚠️  Túnel $tunnel_name ya estaba detenido${NC}"
        fi
        
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠️  No se encontró PID para $tunnel_name${NC}"
    fi
}

# 🛑 Detener túneles
echo -e "${BLUE}🛑 Deteniendo túneles...${NC}"

stop_tunnel "auditoria-tunnel"
stop_tunnel "api-tunnel"

# 🧹 Limpiar procesos de cloudflared
echo -e "${YELLOW}🧹 Limpiando procesos de cloudflared...${NC}"
pkill -f "cloudflared tunnel run" || true

# 📊 Verificar que no queden procesos
echo -e "${YELLOW}📊 Verificando procesos restantes...${NC}"
if pgrep -f "cloudflared tunnel run" > /dev/null; then
    echo -e "${RED}⚠️  Aún hay procesos de cloudflared ejecutándose${NC}"
    echo -e "${YELLOW}🔍 Procesos encontrados:${NC}"
    pgrep -f "cloudflared tunnel run"
else
    echo -e "${GREEN}✅ Todos los túneles detenidos${NC}"
fi

# 🧹 Limpiar archivos temporales
echo -e "${YELLOW}🧹 Limpiando archivos temporales...${NC}"
rm -rf pids/
mkdir -p pids

echo -e "${GREEN}🎉 TÚNELES DETENIDOS EXITOSAMENTE${NC}"
