# Fascinante Digital - DataForSEO API Gateway

API Gateway PRO ELITE para acceder a las herramientas de DataForSEO, con funcionalidades avanzadas de rate limiting, caching y autenticación.

## 🚀 Características

- **Proxy completo** para todas las APIs de DataForSEO
- **Rate Limiting** por IP y usuario
- **Caching inteligente** con Redis y fallback a memoria
- **Autenticación** con API Keys y JWT
- **Analytics** detallados de uso
- **Logging** profesional con Winston
- **Documentación OpenAPI** automática
- **Docker** y **Vercel** ready

## 📋 Requisitos

- Node.js 18+
- pnpm 8+
- Redis (opcional, para caching y rate limiting)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd fascinante-dataforseo-gateway
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.local.example .env.local
   # Editar .env.local con tus credenciales
   ```

4. **Ejecutar en desarrollo**
   ```bash
   pnpm dev
   ```

## 🔧 Configuración

### Variables de Entorno

```env
# DataForSEO API
DATAFORSEO_USERNAME=tu-usuario
DATAFORSEO_PASSWORD=tu-password
DATAFORSEO_BASE_URL=https://api.dataforseo.com

# API Gateway
API_GATEWAY_SECRET=tu-secret-super-seguro
JWT_SECRET=tu-jwt-secret
JWT_EXPIRES_IN=24h

# Rate Limiting
API_RATE_LIMIT_PER_MINUTE=1000

# Redis (opcional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Analytics
ENABLE_ANALYTICS=true

# Logging
LOG_LEVEL=info
NODE_ENV=development
```

## 📚 Uso

### Autenticación

#### API Key
```bash
curl -H "X-API-Key: tu-api-key" \
     -H "Content-Type: application/json" \
     -X POST https://auditoria.fascinantedigital.com/api/v3/serp/google/organic/live/advanced
```

#### JWT Token
```bash
curl -H "Authorization: Bearer tu-jwt-token" \
     -H "Content-Type: application/json" \
     -X POST https://auditoria.fascinantedigital.com/api/v3/serp/google/organic/live/advanced
```

### Ejemplos de Uso

#### 1. Análisis de SERP
```bash
curl -X POST https://auditoria.fascinantedigital.com/api/v3/serp/google/organic/live/advanced \
  -H "X-API-Key: tu-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "El Empanadazo",
    "location_name": "United States",
    "language_code": "en",
    "depth": 10
  }'
```

#### 2. Generación de Contenido AI
```bash
curl -X POST https://auditoria.fascinantedigital.com/api/v3/ai_optimization/chat_gpt/llm_responses/live \
  -H "X-API-Key: tu-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "user_prompt": "Escribe un título SEO para una empanadería llamada El Empanadazo",
    "model_name": "gpt-4o-mini",
    "max_output_tokens": 200,
    "temperature": 0.3
  }'
```

#### 3. Análisis de Keywords
```bash
curl -X POST https://auditoria.fascinantedigital.com/api/v3/keywords_data/google_ads/search_volume/live \
  -H "X-API-Key: tu-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["empanadas", "empanadazo", "comida colombiana"],
    "location_name": "United States",
    "language_code": "en"
  }'
```

## 🏗️ Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   ├── docs/           # Documentación OpenAPI
│   │   ├── health/         # Health check
│   │   └── v3/            # Proxy DataForSEO
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── analytics.ts        # Sistema de analytics
│   ├── auth.ts            # Autenticación
│   ├── cache.ts           # Sistema de cache
│   ├── dataforseo-client.ts # Cliente DataForSEO
│   ├── logger.ts          # Sistema de logging
│   └── rate-limiter.ts    # Rate limiting
├── middleware.ts          # Middleware Next.js
├── next.config.mjs        # Configuración Next.js
├── package.json
├── tailwind.config.js     # Configuración Tailwind
├── tsconfig.json          # Configuración TypeScript
└── vercel.json           # Configuración Vercel
```

## 🚀 Despliegue

### Vercel

1. **Conectar repositorio** en Vercel
2. **Configurar variables de entorno** en el dashboard
3. **Desplegar** automáticamente

### Docker

```bash
# Construir imagen
docker build -t fascinante-dataforseo-gateway .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e DATAFORSEO_USERNAME=tu-usuario \
  -e DATAFORSEO_PASSWORD=tu-password \
  -e API_GATEWAY_SECRET=tu-secret \
  fascinante-dataforseo-gateway
```

## 📊 Monitoreo

### Health Check
```bash
curl https://auditoria.fascinantedigital.com/api/health
```

### Analytics
```bash
curl https://auditoria.fascinantedigital.com/api/analytics \
  -H "X-API-Key: tu-api-key"
```

### Logs
Los logs se almacenan en:
- **Desarrollo**: Consola
- **Producción**: Archivos en `logs/`

## 🔒 Seguridad

- **Rate Limiting** por IP y usuario
- **Autenticación** con API Keys y JWT
- **Headers de seguridad** automáticos
- **Validación** de entrada
- **Logging** de todas las requests

## 📈 Performance

- **Caching** inteligente con Redis
- **Compresión** automática
- **CDN** ready para Vercel
- **Monitoreo** de performance

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte, contacta a:
- **Email**: info@fascinantedigital.com
- **Website**: https://fascinantedigital.com

---

**Desarrollado con ❤️ por Fascinante Digital**