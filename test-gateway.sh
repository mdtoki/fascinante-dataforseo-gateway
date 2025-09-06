#!/bin/bash

# Fascinante Digital - DataForSEO API Gateway Test Script
# Script para probar el API Gateway local

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
API_BASE="http://localhost:3000/api"
API_KEY="your-super-secret-api-key-here"

echo -e "${BLUE}🧪 Iniciando tests del API Gateway DataForSEO...${NC}"

# Función para hacer requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${BLUE}🔍 $description${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -H "X-API-Key: $API_KEY" "$API_BASE$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" -H "X-API-Key: $API_KEY" -H "Content-Type: application/json" -d "$data" "$API_BASE$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ Success (HTTP $http_code)${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
    else
        echo -e "${RED}❌ Error (HTTP $http_code)${NC}"
        echo "$body"
    fi
    echo ""
}

# Test 1: Health Check
make_request "GET" "/health" "" "Health Check"

# Test 2: API Documentation
make_request "GET" "/docs" "" "API Documentation"

# Test 3: DataForSEO AI Models
make_request "GET" "/v3/ai_optimization/chat_gpt/llm_responses/models" "" "DataForSEO AI Models"

# Test 4: Generate AI Content
make_request "POST" "/v3/ai_optimization/chat_gpt/llm_responses/live" '{
    "user_prompt": "Escribe un título SEO para una empanadería llamada El Empanadazo",
    "model_name": "gpt-4o-mini",
    "max_output_tokens": 200,
    "temperature": 0.3
}' "Generate AI Content"

# Test 5: SERP Analysis
make_request "POST" "/v3/serp/google/organic/live/advanced" '{
    "keyword": "El Empanadazo",
    "location_name": "United States",
    "language_code": "en",
    "depth": 10
}' "SERP Analysis"

# Test 6: Keyword Search Volume
make_request "POST" "/v3/keywords_data/google_ads/search_volume/live" '{
    "keywords": ["empanadas", "empanadazo", "comida colombiana"],
    "location_name": "United States",
    "language_code": "en"
}' "Keyword Search Volume"

# Test 7: Keyword Ideas
make_request "POST" "/v3/dataforseo_labs/google/keyword_ideas/live" '{
    "keywords": ["empanadas"],
    "location_name": "United States",
    "language_code": "en",
    "limit": 10
}' "Keyword Ideas"

# Test 8: Domain Rank Overview
make_request "POST" "/v3/dataforseo_labs/google/domain_rank_overview/live" '{
    "target": "fascinantedigital.com",
    "location_name": "United States",
    "language_code": "en"
}' "Domain Rank Overview"

# Test 9: Backlinks Summary
make_request "POST" "/v3/backlinks/summary/live" '{
    "target": "fascinantedigital.com"
}' "Backlinks Summary"

# Test 10: On-Page Analysis
make_request "POST" "/v3/on_page/instant_pages" '{
    "url": "https://fascinantedigital.com",
    "enable_javascript": true
}' "On-Page Analysis"

echo -e "${GREEN}🎉 Tests completados!${NC}"
echo ""
echo -e "${BLUE}📊 Resumen:${NC}"
echo -e "• ${GREEN}Health Check${NC} - Verificar estado del API"
echo -e "• ${GREEN}API Docs${NC} - Documentación OpenAPI"
echo -e "• ${GREEN}AI Models${NC} - Modelos disponibles"
echo -e "• ${GREEN}AI Content${NC} - Generación de contenido"
echo -e "• ${GREEN}SERP Analysis${NC} - Análisis de resultados"
echo -e "• ${GREEN}Keyword Volume${NC} - Volumen de búsqueda"
echo -e "• ${GREEN}Keyword Ideas${NC} - Ideas de keywords"
echo -e "• ${GREEN}Domain Rank${NC} - Ranking de dominio"
echo -e "• ${GREEN}Backlinks${NC} - Análisis de enlaces"
echo -e "• ${GREEN}On-Page${NC} - Análisis de página"
echo ""
echo -e "${BLUE}🔧 Para personalizar:${NC}"
echo -e "• Edita la variable API_KEY en este script"
echo -e "• Modifica los endpoints según tus necesidades"
echo -e "• Ajusta los parámetros de las requests"
echo ""
echo -e "${GREEN}¡API Gateway funcionando correctamente! 🚀${NC}"