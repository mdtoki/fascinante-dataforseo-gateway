# 📋 VARIABLES ELITE PRO - FASCINANTE DIGITAL

variable "cloudflare_api_token" {
  description = "Cloudflare API Token con permisos de Zone:Edit, Worker:Edit"
  type        = string
  sensitive   = true
}

variable "zone_id" {
  description = "Cloudflare Zone ID para fascinantedigital.com"
  type        = string
}

variable "domain" {
  description = "Dominio principal"
  type        = string
  default     = "fascinantedigital.com"
}

variable "environment" {
  description = "Entorno de despliegue"
  type        = string
  default     = "production"
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment debe ser: development, staging, o production."
  }
}

variable "enable_workers" {
  description = "Habilitar Cloudflare Workers"
  type        = bool
  default     = true
}

variable "enable_zero_trust" {
  description = "Habilitar Zero Trust Access"
  type        = bool
  default     = true
}

variable "cache_ttl" {
  description = "TTL por defecto para cache"
  type        = number
  default     = 3600
}

variable "security_level" {
  description = "Nivel de seguridad de Cloudflare"
  type        = string
  default     = "medium"
  validation {
    condition     = contains(["essentially_off", "low", "medium", "high", "under_attack"], var.security_level)
    error_message = "Security level debe ser: essentially_off, low, medium, high, o under_attack."
  }
}
