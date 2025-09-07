# 🚀 FASCINANTE DIGITAL - Ejemplo de Uso SERP

## 📋 Endpoint Principal
```
POST https://auditoria.fascinantedigital.com/api/v3/serp/{search_engine}/organic/live/advanced
```

## 🔑 Autenticación
```bash
X-API-Key: tu_api_gateway_secret_aqui
```

## 📊 Ejemplo de Request
```json
[
  {
    "keyword": "SEO tools",
    "location_name": "United States",
    "language_code": "en",
    "depth": 10,
    "device": "desktop",
    "max_crawl_pages": 1
  }
]
```

## 🎯 Ejemplo de Uso en ChatGPT
```
"Analiza el SERP para 'SEO tools' en Estados Unidos usando el motor de búsqueda Google"
```

## 📈 Respuesta Esperada
- ✅ Resultados orgánicos
- ✅ AI Overview (si disponible)
- ✅ People Also Ask
- ✅ Featured Snippets
- ✅ Datos de competencia
- ✅ Métricas de posicionamiento

## 🔍 Casos de Uso Fascinante Digital
1. **Análisis de Competencia**: Ver qué competidores rankean para keywords clave
2. **Research de Mercado**: Entender el panorama SERP para nuevas estrategias
3. **Optimización SEO**: Identificar oportunidades de posicionamiento
4. **Content Strategy**: Ver qué tipo de contenido rankea mejor
