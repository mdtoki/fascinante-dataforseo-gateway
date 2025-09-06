# 🚀 DataForSEO API Gateway PRO ELITE

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![DataForSEO](https://img.shields.io/badge/DataForSEO-API-orange?style=for-the-badge)](https://dataforseo.com/)

> **API Gateway profesional y escalable para DataForSEO con Next.js 15, TypeScript, rate limiting, caching y analytics. Listo para producción en `auditoria.fascinantedigital.com`**

## ✨ Características Principales

### 🔐 **Seguridad Avanzada**
- **Autenticación dual**: API Keys + JWT
- **Rate limiting** por IP y usuario
- **Headers de seguridad** automáticos
- **CORS** configurado
- **Validación** de requests con Zod

### ⚡ **Performance Optimizada**
- **Caching inteligente** con Redis + fallback a memoria
- **Compresión** automática
- **CDN ready** para Vercel
- **Edge Runtime** compatible
- **Response time** < 1 segundo

### 📊 **Monitoreo Profesional**
- **Analytics** en tiempo real
- **Logging estructurado** con Winston
- **Health checks** automáticos
- **Métricas** de performance y costos
- **Error tracking** completo

### 🛠️ **Stack Tecnológico**
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript 5.0
- **Styling**: Tailwind CSS
- **Caching**: Redis + Memory
- **Auth**: JWT + API Keys
- **Deploy**: Vercel + Docker
- **CI/CD**: GitHub Actions

## 🚀 Inicio Rápido

### 1. **Clonar el Repositorio**
```bash
git clone https://github.com/alexanderovie/fascinante-dataforseo-gateway.git
cd fascinante-dataforseo-gateway
```

### 2. **Instalar Dependencias**
```bash
pnpm install
```

### 3. **Configurar Variables de Entorno**
```bash
cp env.local.example .env.local
```

Editar `.env.local` con tus credenciales:
```env
# DataForSEO API Configuration
DATAFORSEO_USERNAME=your-email@example.com
DATAFORSEO_PASSWORD=your-password
DATAFORSEO_BASE_URL=https://api.dataforseo.com

# API Gateway Configuration
API_GATEWAY_SECRET=your-super-secret-api-key
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Redis Configuration (opcional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Analytics
ENABLE_ANALYTICS=true
LOG_LEVEL=info
```

### 4. **Ejecutar en Desarrollo**
```bash
pnpm dev
```

### 5. **Probar la API**
```bash
# Health check
curl http://localhost:3000/api/health

# Documentación
curl http://localhost:3000/api/docs

# Generar contenido AI
curl -H "X-API-Key: your-api-key" \
  -X POST http://localhost:3000/api/v3/ai_optimization/chat_gpt/llm_responses/live \
  -H "Content-Type: application/json" \
  -d '[{"user_prompt": "Escribe un título SEO para mi negocio", "model_name": "gpt-4o-mini"}]'
```

## 📚 Documentación de la API

### **Endpoints Principales**

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/health` | GET | Health check del sistema |
| `/api/docs` | GET | Documentación OpenAPI 3.1.0 |
| `/api/v3/ai_optimization/chat_gpt/llm_responses/models` | GET | Modelos AI disponibles |
| `/api/v3/ai_optimization/chat_gpt/llm_responses/live` | POST | Generar contenido AI |
| `/api/v3/serp/google/organic/live/advanced` | POST | Análisis SERP |
| `/api/v3/keywords_data/google_ads/search_volume/live` | POST | Volumen de búsqueda |

### **Autenticación**

#### API Key (Recomendado)
```bash
curl -H "X-API-Key: your-api-key" \
  http://localhost:3000/api/v3/ai_optimization/chat_gpt/llm_responses/models
```

#### JWT Token
```bash
curl -H "Authorization: Bearer your-jwt-token" \
  http://localhost:3000/api/v3/ai_optimization/chat_gpt/llm_responses/models
```

### **Ejemplos de Uso**

#### 1. **Generar Contenido SEO**
```bash
curl -H "X-API-Key: your-api-key" \
  -X POST http://localhost:3000/api/v3/ai_optimization/chat_gpt/llm_responses/live \
  -H "Content-Type: application/json" \
  -d '[{
    "user_prompt": "Escribe un título SEO para una empanadería llamada El Empanadazo",
    "model_name": "gpt-4o-mini",
    "max_output_tokens": 200,
    "temperature": 0.3
  }]'
```

#### 2. **Análisis SERP**
```bash
curl -H "X-API-Key: your-api-key" \
  -X POST http://localhost:3000/api/v3/serp/google/organic/live/advanced \
  -H "Content-Type: application/json" \
  -d '[{
    "keyword": "empanadas artesanales",
    "location_name": "United States",
    "language_code": "en",
    "depth": 10
  }]'
```

#### 3. **Volumen de Búsqueda**
```bash
curl -H "X-API-Key: your-api-key" \
  -X POST http://localhost:3000/api/v3/keywords_data/google_ads/search_volume/live \
  -H "Content-Type: application/json" \
  -d '[{
    "keywords": ["empanadas", "empanadas artesanales", "empanadas caseras"],
    "location_name": "United States",
    "language_code": "en"
  }]'
```

## 🚀 Despliegue

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### **Docker**
```bash
# Construir imagen
docker build -t fascinante-dataforseo-gateway .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e DATAFORSEO_USERNAME=your-email \
  -e DATAFORSEO_PASSWORD=your-password \
  -e API_GATEWAY_SECRET=your-secret \
  fascinante-dataforseo-gateway
```

### **Configuración de Dominio**
1. Configurar DNS para `auditoria.fascinantedigital.com`
2. Actualizar `vercel.json` con el dominio
3. Configurar SSL automático

## 📊 Monitoreo y Analytics

### **Métricas Disponibles**
- **Requests por minuto/hora**
- **Costo total de DataForSEO**
- **Tiempo de respuesta promedio**
- **Rate limiting hits**
- **Cache hit ratio**
- **Errores por endpoint**

### **Logs Estructurados**
```json
{
  "level": "info",
  "message": "DataForSEO Request: POST /v3/ai_optimization/chat_gpt/llm_responses/live",
  "timestamp": "2025-09-06T22:00:43.000Z",
  "service": "fascinante-dataforseo-gateway",
  "userId": "user-123",
  "endpoint": "/v3/ai_optimization/chat_gpt/llm_responses/live",
  "responseTime": 992,
  "cost": 0.0006177
}
```

## 🧪 Testing

### **Ejecutar Tests**
```bash
# Test completo del gateway
./test-gateway.sh

# Test específico de endpoints
curl -H "X-API-Key: your-api-key" \
  http://localhost:3000/api/health | jq .
```

### **Resultados de Pruebas**
- ✅ **Health Check**: 200 OK
- ✅ **Documentación**: OpenAPI disponible
- ✅ **AI Models**: 33 modelos disponibles
- ✅ **AI Generation**: Contenido generado correctamente
- ✅ **SERP Analysis**: Análisis funcionando
- ✅ **Rate Limiting**: Configurado y activo
- ✅ **Caching**: Redis + Memory funcionando

## 🔧 Configuración Avanzada

### **Rate Limiting**
```env
API_RATE_LIMIT_PER_MINUTE=200
API_RATE_LIMIT_BURST=50
```

### **Caching**
```env
REDIS_URL=redis://localhost:6379
CACHE_TTL_DEFAULT=3600
CACHE_TTL_AI=1800
CACHE_TTL_SERP=7200
```

### **Logging**
```env
LOG_LEVEL=debug
ENABLE_ANALYTICS=true
```

## 📈 Roadmap

- [ ] **Webhook support** para notificaciones
- [ ] **Dashboard** de métricas en tiempo real
- [ ] **Multi-tenant** support
- [ ] **API versioning** automático
- [ ] **GraphQL** endpoint
- [ ] **WebSocket** para updates en tiempo real

## 🤝 Contribuir

1. Fork el repositorio
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Documentación**: [OpenAPI Docs](http://localhost:3000/api/docs)
- **Issues**: [GitHub Issues](https://github.com/alexanderovie/fascinante-dataforseo-gateway/issues)
- **Email**: info@fascinantedigital.com

---

**Desarrollado con ❤️ por [Fascinante Digital](https://fascinantedigital.com)**

*API Gateway PRO ELITE para DataForSEO - Next.js 15, TypeScript, Rate Limiting, Caching, Analytics*