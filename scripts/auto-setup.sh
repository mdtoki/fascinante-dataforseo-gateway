#!/bin/bash

echo "🚀 FASCINANTE DIGITAL - AUTO SETUP ELITE"
echo "========================================"

# Cargar variables de entorno
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# Verificar que tenemos todas las variables necesarias
REQUIRED_VARS=("VERCEL_TOKEN" "DATAFORSEO_USERNAME" "DATAFORSEO_PASSWORD" "API_GATEWAY_SECRET" "JWT_SECRET")

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Variable $var no encontrada en .env.local"
    exit 1
  fi
done

echo "✅ Todas las variables de entorno están configuradas"

# 1. Crear proyecto Vercel automáticamente
echo ""
echo "📋 1. Creando proyecto Vercel..."
vercel project create sistema --yes

# 2. Configurar variables de entorno automáticamente
echo ""
echo "🔑 2. Configurando variables de entorno..."
vercel env add DATAFORSEO_USERNAME production --value "$DATAFORSEO_USERNAME" --yes
vercel env add DATAFORSEO_PASSWORD production --value "$DATAFORSEO_PASSWORD" --yes
vercel env add API_GATEWAY_SECRET production --value "$API_GATEWAY_SECRET" --yes
vercel env add JWT_SECRET production --value "$JWT_SECRET" --yes

# 3. Agregar dominio automáticamente
echo ""
echo "🌐 3. Agregando dominio..."
vercel domains add auditoria.fascinantedigital.com --yes

# 4. Hacer deploy automático
echo ""
echo "🚀 4. Deployando proyecto..."
vercel --prod --yes

echo ""
echo "🎉 ¡SETUP AUTOMÁTICO COMPLETADO!"
echo "🌐 URL: https://auditoria.fascinantedigital.com"
