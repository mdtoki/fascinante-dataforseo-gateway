# 🚀 FASCINANTE DIGITAL - CLOUDFLARE ELITE SETUP

## 🎯 **Estrategia Híbrida Elite**

Este setup implementa la **estrategia híbrida elite** que usan los desarrolladores profesionales:

- **🏗️ Terraform**: Infraestructura como código, DNS, Workers, seguridad
- **🚇 Cloudflared**: Túneles seguros, conectividad, desarrollo local

## 📋 **Prerrequisitos**

### 🔧 **Herramientas Requeridas**
```bash
# Instalar dependencias
brew install terraform cloudflare/cloudflare/cloudflared jq

# Verificar instalación
terraform --version
cloudflared --version
jq --version
```

### 🔐 **Credenciales Necesarias**

1. **Cloudflare API Token**
   - Ve a: https://dash.cloudflare.com/profile/api-tokens
   - Crea un token con permisos:
     - `Zone:Edit`
     - `Worker:Edit` 
     - `Account:Read`

2. **Zone ID**
   - Ve a: https://dash.cloudflare.com/
   - Selecciona tu dominio
   - Copia el Zone ID del panel Overview

## 🚀 **Setup Rápido**

### **1. Configuración Automática**
```bash
# Ejecutar setup completo
./scripts/setup-elite.sh
```

### **2. Configuración Manual**

#### **🏗️ Terraform**
```bash
# 1. Configurar credenciales
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# Editar terraform.tfvars con tus credenciales

# 2. Inicializar y desplegar
cd terraform
terraform init
terraform plan
terraform apply
```

#### **🚇 Cloudflared**
```bash
# 1. Autenticar
cloudflared login

# 2. Crear túneles
cloudflared tunnel create auditoria-tunnel
cloudflared tunnel create api-tunnel

# 3. Configurar DNS
cloudflared tunnel route dns auditoria-tunnel auditoria.fascinantedigital.com
cloudflared tunnel route dns api-tunnel api.fascinantedigital.com
```

## 🌐 **Subdominios Configurados**

| Subdominio | Propósito | Puerto Local | Configuración |
|------------|-----------|--------------|---------------|
| `auditoria.fascinantedigital.com` | Dashboard principal | 3000 | `auditoria-config.yml` |
| `api.auditoria.fascinantedigital.com` | API Gateway | 3001 | `auditoria-config.yml` |
| `tools.auditoria.fascinantedigital.com` | Herramientas | 3002 | `auditoria-config.yml` |
| `analytics.auditoria.fascinantedigital.com` | Analytics | 3003 | `auditoria-config.yml` |
| `api.fascinantedigital.com` | API Principal | 3001 | `api-config.yml` |

## 🎯 **Comandos Elite**

### **🚇 Gestión de Túneles**
```bash
# Iniciar todos los túneles
./scripts/start-tunnels.sh

# Detener todos los túneles
./scripts/stop-tunnels.sh

# Iniciar túnel específico
cloudflared tunnel run auditoria-tunnel --config cloudflared/auditoria-config.yml

# Ver estado de túneles
cloudflared tunnel list
cloudflared tunnel info auditoria-tunnel
```

### **🏗️ Gestión de Terraform**
```bash
# Planificar cambios
cd terraform && terraform plan

# Aplicar cambios
cd terraform && terraform apply

# Destruir infraestructura
cd terraform && terraform destroy
```

### **🧪 Testing**
```bash
# Health checks
curl https://auditoria.fascinantedigital.com/health
curl https://api.fascinantedigital.com/health

# API Gateway
curl -H "X-API-Key: tu-api-key" \
  https://api.fascinantedigital.com/api/v3/ai_optimization/chat_gpt/llm_responses/models
```

## 📊 **Monitoreo**

### **📈 Métricas**
- **Terraform**: Estado en `terraform/terraform.tfstate`
- **Cloudflared**: Logs en `logs/`
- **Túneles**: PIDs en `pids/`

### **🔍 Logs**
```bash
# Ver logs de túneles
tail -f logs/auditoria-tunnel.log
tail -f logs/api-tunnel.log

# Ver métricas de cloudflared
curl http://localhost:8080/metrics
```

## 🛡️ **Seguridad**

### **🔐 Autenticación**
- **API Keys**: Requeridas para endpoints
- **Zero Trust**: Configurado para auditoria
- **CORS**: Configurado para dominios permitidos

### **🛡️ Protecciones**
- **Rate Limiting**: 100 requests/minuto por IP
- **Caching**: Redis + Memory fallback
- **SSL**: Forzado en todos los endpoints

## 🚀 **Despliegue en Producción**

### **1. Preparar Servidor**
```bash
# Instalar dependencias
sudo apt update
sudo apt install curl jq

# Instalar cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### **2. Configurar Servicio**
```bash
# Crear servicio systemd
sudo cp cloudflared/cloudflared.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

### **3. Monitoreo**
```bash
# Ver estado del servicio
sudo systemctl status cloudflared

# Ver logs
sudo journalctl -u cloudflared -f
```

## 🔧 **Troubleshooting**

### **❌ Problemas Comunes**

#### **Túnel no se conecta**
```bash
# Verificar autenticación
cloudflared tunnel list

# Verificar configuración
cloudflared tunnel ingress validate cloudflared/auditoria-config.yml

# Ver logs detallados
cloudflared tunnel run auditoria-tunnel --config cloudflared/auditoria-config.yml --loglevel debug
```

#### **DNS no resuelve**
```bash
# Verificar registros DNS
dig auditoria.fascinantedigital.com

# Verificar configuración de túnel
cloudflared tunnel route list auditoria-tunnel
```

#### **Terraform falla**
```bash
# Verificar credenciales
terraform plan

# Verificar estado
terraform show

# Limpiar estado si es necesario
terraform refresh
```

## 📚 **Recursos Adicionales**

- **Documentación Cloudflare**: https://developers.cloudflare.com/
- **Terraform Provider**: https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs
- **Cloudflared Docs**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

## 🎯 **Próximos Pasos**

1. **🔧 Configurar CI/CD** con GitHub Actions
2. **📊 Implementar monitoreo** con Prometheus/Grafana
3. **🛡️ Configurar WAF** y reglas de seguridad
4. **🚀 Optimizar performance** con Page Rules
5. **📱 Crear dashboard** de administración

---

**🎉 ¡Setup Elite Pro completado! Tu infraestructura está lista para producción.**
