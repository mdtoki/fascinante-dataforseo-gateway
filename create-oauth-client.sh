#!/bin/bash

# Script para crear OAuth 2.0 Client ID usando Google Cloud API
# Autor: Fascinante Digital
# Fecha: $(date)

PROJECT_ID="fascinante-digit-1698295291643"
CLIENT_NAME="fascinante-prod-main-app-oauth"

echo "🚀 Creando OAuth 2.0 Client ID: $CLIENT_NAME"

# Obtener token de acceso
ACCESS_TOKEN=$(gcloud auth application-default print-access-token)

# Crear el OAuth Client usando la API de Google Cloud
curl -X POST \
  "https://iamcredentials.googleapis.com/v1/projects/$PROJECT_ID/serviceAccounts" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "'$CLIENT_NAME'",
    "description": "OAuth 2.0 Client ID principal para aplicaciones de Fascinante Digital"
  }'

echo "✅ OAuth Client creado exitosamente"
echo "📝 Recuerda configurar los orígenes y URIs de redirección en Google Cloud Console"
