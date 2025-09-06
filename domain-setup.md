# Configuración de Dominio Personalizado

## 🎯 Objetivo

Configurar `auditoria.fascinantedigital.com` como dominio personalizado para el API Gateway de DataForSEO.

## 📋 Pasos para Vercel

### 1. Configurar Dominio en Vercel

```bash
# Instalar Vercel CLI si no está instalado
npm i -g vercel

# Login en Vercel
vercel login

# Configurar proyecto
vercel link

# Agregar dominio personalizado
vercel domains add auditoria.fascinantedigital.com
```

### 2. Configurar DNS en Cloudflare

#### Opción A: CNAME (Recomendado)

```
Tipo: CNAME
Nombre: auditoria
Contenido: cname.vercel-dns.com
Proxy: ✅ (Habilitado)
TTL: Auto
```

#### Opción B: A Record

```
Tipo: A
Nombre: auditoria
Contenido: 76.76.19.61
Proxy: ✅ (Habilitado)
TTL: Auto
```

### 3. Verificar Configuración

```bash
# Verificar DNS
dig auditoria.fascinantedigital.com

# Verificar SSL
curl -I https://auditoria.fascinantedigital.com/api/health
```

## 🔧 Configuración Adicional

### Variables de Entorno en Vercel

```bash
vercel env add DATAFORSEO_USERNAME
vercel env add DATAFORSEO_PASSWORD
vercel env add DATAFORSEO_BASE_URL
vercel env add API_GATEWAY_SECRET
vercel env add JWT_SECRET
vercel env add REDIS_URL
vercel env add REDIS_PASSWORD
```

### Configuración de CORS

El dominio personalizado ya está configurado en `vercel.json` para permitir CORS desde cualquier origen.

## 🚀 Despliegue

```bash
# Desplegar a producción
vercel --prod

# Verificar despliegue
vercel ls
```

## 🔍 Verificación

### 1. Health Check

```bash
curl https://auditoria.fascinantedigital.com/api/health
```

### 2. Documentación API

```bash
curl https://auditoria.fascinantedigital.com/api/docs
```

### 3. Test de DataForSEO

```bash
curl -X POST https://auditoria.fascinantedigital.com/api/v3/ai_optimization/chat_gpt/llm_responses/models \
  -H "X-API-Key: tu-api-key"
```

## 📊 Monitoreo

### Vercel Analytics

- Acceder al dashboard de Vercel
- Ver métricas de performance
- Monitorear errores

### Logs

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de una función específica
vercel logs --follow --function=api/v3/[...path]
```

## 🔒 Seguridad

### SSL/TLS

- Vercel maneja automáticamente el SSL
- Certificado renovado automáticamente
- HTTP/2 habilitado por defecto

### Rate Limiting

- Configurado en `lib/rate-limiter.ts`
- Límites por IP y usuario
- Bloqueo temporal en caso de exceso

## 🆘 Troubleshooting

### Problema: Dominio no resuelve

```bash
# Verificar DNS
nslookup auditoria.fascinantedigital.com

# Verificar en Vercel
vercel domains ls
```

### Problema: SSL no funciona

```bash
# Verificar certificado
openssl s_client -connect auditoria.fascinantedigital.com:443

# Re-generar certificado en Vercel
vercel domains remove auditoria.fascinantedigital.com
vercel domains add auditoria.fascinantedigital.com
```

### Problema: CORS errors

- Verificar configuración en `vercel.json`
- Verificar headers en `middleware.ts`
- Verificar configuración de Cloudflare

## 📈 Optimización

### Performance

- CDN automático de Vercel
- Compresión gzip/brotli
- Caching inteligente

### Escalabilidad

- Auto-scaling de Vercel
- Rate limiting configurado
- Monitoreo de recursos

---

**Configuración completada para auditoria.fascinantedigital.com** 🎉
