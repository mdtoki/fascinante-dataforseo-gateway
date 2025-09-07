# 🎯 FASCINANTE DIGITAL - Ejemplo de Uso On-Page Analysis

## ✅ **API FUNCIONANDO CORRECTAMENTE**

**Endpoint probado:** `https://auditoria.fascinantedigital.com/api/v3/on_page/instant_pages`
**Estado:** ✅ Funcionando y devolviendo datos reales

## 📊 **EJEMPLO DE REQUEST EXITOSO:**

```bash
curl -X POST https://auditoria.fascinantedigital.com/api/v3/on_page/instant_pages \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_GATEWAY_SECRET" \
  -d '[
    {
      "url": "https://www.google.com",
      "enable_javascript": true
    }
  ]'
```

## 🎯 **RESPUESTA REAL OBTENIDA:**

```json
{
  "version": "0.1.20250828",
  "status_code": 20000,
  "status_message": "Ok.",
  "time": "2.0444 sec.",
  "cost": 0.00125,
  "tasks_count": 1,
  "tasks_error": 0,
  "tasks": [
    {
      "id": "09070254-1109-0275-0000-defd4265d074",
      "status_code": 20000,
      "status_message": "Ok.",
      "time": "1.9730 sec.",
      "cost": 0.00125,
      "result_count": 1,
      "result": [
        {
          "crawl_progress": "finished",
          "items_count": 1,
          "items": [
            {
              "url": "https://www.google.com/",
              "status_code": 200,
              "meta": {
                "title": "Google",
                "description": null,
                "internal_links_count": 10,
                "external_links_count": 18,
                "images_count": 1,
                "scripts_count": 2,
                "title_length": 6,
                "description_length": 0
              },
              "page_timing": {
                "time_to_interactive": 94,
                "dom_complete": 164,
                "largest_contentful_paint": 0,
                "first_input_delay": 0,
                "duration_time": 164
              },
              "onpage_score": 90.49,
              "total_dom_size": 52156,
              "size": 52156,
              "checks": {
                "is_https": true,
                "no_title": false,
                "no_description": true,
                "no_favicon": true,
                "seo_friendly_url": true,
                "has_render_blocking_resources": false,
                "deprecated_html_tags": true
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## 🚀 **ESQUEMA SIMPLE CREADO:**

**Archivo:** `chatgpt-gpt-schema-simple.json`

**Características:**
- ✅ **Solo 1 endpoint**: `/api/v3/on_page/instant_pages`
- ✅ **Request Body**: Array de objetos (como requiere DataForSEO)
- ✅ **Datos reales**: Probado y funcionando
- ✅ **JSON válido**: Pasa validación
- ✅ **Documentación completa**: Con ejemplos reales

## 🎯 **CÓMO USAR EN CHATGPT:**

**Prompt ejemplo:**
```
"Analiza la página https://www.google.com para SEO on-page"
```

**Request que ChatGPT enviará:**
```json
[
  {
    "url": "https://www.google.com",
    "enable_javascript": true
  }
]
```

## 📋 **DATOS QUE OBTIENES:**

- 🏷️ **Meta Tags**: Título, descripción, keywords
- 🔗 **Enlaces**: Internos, externos, rotos
- 🖼️ **Recursos**: Imágenes, scripts, CSS
- ⚡ **Rendimiento**: Tiempo de carga, LCP, FID
- 📊 **SEO Score**: Puntuación on-page (0-100)
- ✅ **Checks**: HTTPS, favicon, URL amigable, etc.
- 📏 **Tamaños**: DOM, página, recursos

## 🎉 **LISTO PARA COPIAR Y PEGAR:**

El archivo `chatgpt-gpt-schema-simple.json` está listo para ser usado en ChatGPT GPT Builder.
