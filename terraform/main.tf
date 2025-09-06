# 🚀 FASCINANTE DIGITAL - TERRAFORM ELITE PRO
# Infrastructure as Code para Cloudflare

terraform {
  required_version = ">= 1.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  
  # Backend para estado remoto (opcional)
  # backend "s3" {
  #   bucket = "fascinante-terraform-state"
  #   key    = "cloudflare/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

# 🔐 Provider Cloudflare
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# 📊 Variables (definidas en variables.tf)

# 🌐 Data Sources
data "cloudflare_zone" "main" {
  zone_id = var.zone_id
}

# 🎯 Subdominios Elite
locals {
  subdomains = {
    auditoria = {
      name    = "auditoria"
      type    = "CNAME"
      content = "fascinantedigital.com"  # CNAME al dominio principal
      ttl     = 1
      proxied = true
    }
    api = {
      name    = "api"
      type    = "CNAME"
      content = "fascinantedigital.com"
      ttl     = 1
      proxied = true
    }
    tools = {
      name    = "tools"
      type    = "CNAME"
      content = "fascinantedigital.com"
      ttl     = 1
      proxied = true
    }
    analytics = {
      name    = "analytics"
      type    = "CNAME"
      content = "fascinantedigital.com"
      ttl     = 1
      proxied = true
    }
  }
}

# 📝 DNS Records para Subdominios
resource "cloudflare_record" "subdomains" {
  for_each = local.subdomains
  
  zone_id = var.zone_id
  name    = each.value.name
  type    = each.value.type
  content = each.value.content
  ttl     = each.value.ttl
  proxied = each.value.proxied
  
  comment = "Subdominio ${each.value.name} - Fascinante Digital Elite"
}

# 🛡️ Page Rules para Optimización
resource "cloudflare_page_rule" "auditoria_cache" {
  zone_id = var.zone_id
  target  = "auditoria.${var.domain}/*"
  priority = 1
  status  = "active"
  
  actions {
    cache_level = "aggressive"
    edge_cache_ttl = 86400
    browser_cache_ttl = 3600
  }
}

resource "cloudflare_page_rule" "api_security" {
  zone_id = var.zone_id
  target  = "api.${var.domain}/*"
  priority = 2
  status  = "active"
  
  actions {
    security_level = "high"
    ssl = "strict"
  }
}

# 🔒 Zero Trust Access Application (Comentado por ahora - requiere configuración adicional)
# resource "cloudflare_zero_trust_access_application" "auditoria_app" {
#   zone_id                   = var.zone_id
#   name                      = "Auditoria App"
#   domain                    = "auditoria.${var.domain}"
#   type                      = "self_hosted"
#   session_duration          = "24h"
#   auto_redirect_to_identity = false
#   
#   cors_headers {
#     allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
#     allowed_origins = ["https://${var.domain}"]
#     allow_credentials = true
#     max_age = 86400
#   }
# }

# 🚀 Cloudflare Worker para API Gateway (Comentado por ahora)
# resource "cloudflare_worker_script" "api_gateway" {
#   name      = "api-gateway"
#   content   = file("${path.module}/workers/api-gateway.js")
#   account_id = var.account_id
# }

# 💾 KV Namespace para Cache (Comentado por ahora)
# resource "cloudflare_workers_kv_namespace" "cache" {
#   title     = "fascinante-cache"
#   account_id = var.account_id
# }

# 📊 Outputs
output "zone_id" {
  description = "Zone ID de Cloudflare"
  value       = data.cloudflare_zone.main.id
}

output "subdomain_records" {
  description = "Registros DNS creados"
  value = {
    for k, v in cloudflare_record.subdomains : k => {
      name    = v.name
      type    = v.type
      content = v.content
      proxied = v.proxied
    }
  }
}

# output "access_app_id" {
#   description = "ID de la aplicación de acceso"
#   value       = cloudflare_zero_trust_access_application.auditoria_app.id
# }
