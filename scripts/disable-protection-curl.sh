#!/bin/bash

echo "🛡️ FASCINANTE DIGITAL - DISABLING VERCEL PROTECTION VIA CURL"
echo "============================================================"

# Cargar variables de entorno
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

PROJECT_ID="prj_7d2x7iUNYKDFlGo810PFe2AWD6Ja"
TEAM_ID="alexanderoviedo"

echo "📋 Project ID: $PROJECT_ID"
echo "👥 Team ID: $TEAM_ID"

# Verificar que tenemos el token
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN no encontrado en .env.local"
  echo "💡 Ejecuta: vercel login"
  exit 1
fi

echo "🔑 Token encontrado (longitud: ${#VERCEL_TOKEN})"

# 1. Obtener configuración actual del proyecto
echo ""
echo "🔍 Obteniendo configuración actual del proyecto..."
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects/$PROJECT_ID?teamId=$TEAM_ID" | jq '.'

# 2. Deshabilitar protección de autenticación
echo ""
echo "🚫 Deshabilitando protección de autenticación..."

# Deshabilitar SSO Protection
echo "📝 Deshabilitando SSO Protection..."
curl -s -X PATCH \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ssoProtection": null}' \
  "https://api.vercel.com/v9/projects/$PROJECT_ID?teamId=$TEAM_ID" | jq '.'

# Deshabilitar Password Protection
echo "📝 Deshabilitando Password Protection..."
curl -s -X PATCH \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"passwordProtection": null}' \
  "https://api.vercel.com/v9/projects/$PROJECT_ID?teamId=$TEAM_ID" | jq '.'

echo ""
echo "🎉 PROTECCIÓN DESHABILITADA EXITOSAMENTE"
echo "=========================================="
echo "✅ El proyecto ahora debería ser accesible públicamente"
echo "🌐 URL: https://auditoria.fascinantedigital.com"
echo ""
echo "🧪 Probando acceso..."
curl -s -I https://auditoria.fascinantedigital.com/ | head -5
