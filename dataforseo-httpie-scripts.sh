#!/bin/bash
# DataForSEO HTTPie Scripts - Pro Elite Automation
# Minimiza el uso de web dashboards mediante CLI

# Configuración
API_BASE="https://api.dataforseo.com/v3"
USERNAME="YOUR_DATAFORSEO_USERNAME"
PASSWORD="YOUR_DATAFORSEO_PASSWORD"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}DataForSEO HTTPie Scripts - Pro Elite${NC}"
    echo "=========================================="
    echo "Uso: $0 [comando] [opciones]"
    echo ""
    echo "Comandos disponibles:"
    echo "  test-connection     - Probar conexión con API"
    echo "  get-models          - Obtener modelos AI disponibles"
    echo "  analyze-keyword     - Analizar palabra clave"
    echo "  generate-content    - Generar contenido con AI"
    echo "  get-task-status     - Verificar estado de tarea"
    echo "  batch-analyze       - Analizar múltiples keywords"
    echo "  help                - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 test-connection"
    echo "  $0 analyze-keyword 'marketing digital'"
    echo "  $0 generate-content 'Escribe un título SEO'"
}

# Función para probar conexión
test_connection() {
    echo -e "${YELLOW}🔍 Probando conexión con DataForSEO API...${NC}"
    
    response=$(http -a "$USERNAME:$PASSWORD" GET "$API_BASE/ai_optimization/chat_gpt/llm_responses/models" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Conexión exitosa${NC}"
        echo "Respuesta: $response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}❌ Error de conexión${NC}"
        echo "Verifica tus credenciales en el script"
    fi
}

# Función para obtener modelos AI
get_models() {
    echo -e "${YELLOW}📋 Obteniendo modelos AI disponibles...${NC}"
    
    # ChatGPT Models
    echo -e "${BLUE}ChatGPT Models:${NC}"
    http -a "$USERNAME:$PASSWORD" GET "$API_BASE/ai_optimization/chat_gpt/llm_responses/models" | jq '.tasks[].result[]' 2>/dev/null
    
    # Claude Models
    echo -e "${BLUE}Claude Models:${NC}"
    http -a "$USERNAME:$PASSWORD" GET "$API_BASE/ai_optimization/claude/llm_responses/models" | jq '.tasks[].result[]' 2>/dev/null
    
    # Gemini Models
    echo -e "${BLUE}Gemini Models:${NC}"
    http -a "$USERNAME:$PASSWORD" GET "$API_BASE/ai_optimization/gemini/llm_responses/models" | jq '.tasks[].result[]' 2>/dev/null
}

# Función para analizar palabra clave
analyze_keyword() {
    local keyword="$1"
    
    if [ -z "$keyword" ]; then
        echo -e "${RED}❌ Error: Proporciona una palabra clave${NC}"
        echo "Uso: $0 analyze-keyword 'palabra clave'"
        return 1
    fi
    
    echo -e "${YELLOW}🔍 Analizando palabra clave: $keyword${NC}"
    
    # Crear tarea SERP
    response=$(http -a "$USERNAME:$PASSWORD" POST "$API_BASE/serp/google/organic/task_post" \
        keyword="$keyword" \
        location_name="United States" \
        language_name="English" \
        depth=100 \
        priority=1 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        task_id=$(echo "$response" | jq -r '.tasks[0].id' 2>/dev/null)
        echo -e "${GREEN}✅ Tarea creada: $task_id${NC}"
        echo "Respuesta: $response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}❌ Error creando tarea${NC}"
    fi
}

# Función para generar contenido con AI
generate_content() {
    local prompt="$1"
    
    if [ -z "$prompt" ]; then
        echo -e "${RED}❌ Error: Proporciona un prompt${NC}"
        echo "Uso: $0 generate-content 'tu prompt aquí'"
        return 1
    fi
    
    echo -e "${YELLOW}🤖 Generando contenido: $prompt${NC}"
    
    response=$(http -a "$USERNAME:$PASSWORD" POST "$API_BASE/ai_optimization/chat_gpt/llm_responses/live" \
        user_prompt="$prompt" \
        model_name="gpt-4.1-mini" \
        max_output_tokens=1024 \
        temperature=0.3 \
        top_p=0.5 \
        web_search=true 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Contenido generado${NC}"
        echo "Respuesta: $response" | jq '.tasks[0].result[0].ai_response' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}❌ Error generando contenido${NC}"
    fi
}

# Función para verificar estado de tarea
get_task_status() {
    local task_id="$1"
    
    if [ -z "$task_id" ]; then
        echo -e "${RED}❌ Error: Proporciona un task_id${NC}"
        echo "Uso: $0 get-task-status 'task_id'"
        return 1
    fi
    
    echo -e "${YELLOW}📊 Verificando estado de tarea: $task_id${NC}"
    
    response=$(http -a "$USERNAME:$PASSWORD" GET "$API_BASE/serp/google/organic/task_get/advanced/$task_id" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Estado obtenido${NC}"
        echo "Respuesta: $response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}❌ Error obteniendo estado${NC}"
    fi
}

# Función para análisis en lote
batch_analyze() {
    local keywords_file="$1"
    
    if [ -z "$keywords_file" ] || [ ! -f "$keywords_file" ]; then
        echo -e "${RED}❌ Error: Archivo de keywords no encontrado${NC}"
        echo "Uso: $0 batch-analyze 'keywords.txt'"
        echo "Formato del archivo: una palabra clave por línea"
        return 1
    fi
    
    echo -e "${YELLOW}📊 Analizando keywords en lote desde: $keywords_file${NC}"
    
    while IFS= read -r keyword; do
        if [ -n "$keyword" ]; then
            echo -e "${BLUE}🔍 Analizando: $keyword${NC}"
            analyze_keyword "$keyword"
            sleep 2  # Rate limiting
        fi
    done < "$keywords_file"
    
    echo -e "${GREEN}✅ Análisis en lote completado${NC}"
}

# Función para crear archivo de ejemplo
create_example_file() {
    echo -e "${YELLOW}📝 Creando archivo de ejemplo...${NC}"
    
    cat > keywords-example.txt << EOF
marketing digital
seo optimization
content marketing
social media marketing
email marketing
digital advertising
web analytics
conversion optimization
user experience
mobile marketing
EOF
    
    echo -e "${GREEN}✅ Archivo creado: keywords-example.txt${NC}"
    echo "Puedes editarlo y usar: $0 batch-analyze keywords-example.txt"
}

# Verificar dependencias
check_dependencies() {
    if ! command -v http &> /dev/null; then
        echo -e "${RED}❌ HTTPie no está instalado${NC}"
        echo "Instala con: brew install httpie"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}⚠️  jq no está instalado (recomendado para formateo JSON)${NC}"
        echo "Instala con: brew install jq"
    fi
}

# Función principal
main() {
    check_dependencies
    
    case "${1:-help}" in
        "test-connection")
            test_connection
            ;;
        "get-models")
            get_models
            ;;
        "analyze-keyword")
            analyze_keyword "$2"
            ;;
        "generate-content")
            generate_content "$2"
            ;;
        "get-task-status")
            get_task_status "$2"
            ;;
        "batch-analyze")
            batch_analyze "$2"
            ;;
        "create-example")
            create_example_file
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal
main "$@"
