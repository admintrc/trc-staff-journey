variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "australiaeast"
}

variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "trc-staff-journey-rg"
}

variable "db_admin_login" {
  description = "Database admin login"
  type        = string
  sensitive   = true
}

variable "db_admin_password" {
  description = "Database admin password"
  type        = string
  sensitive   = true
}

variable "storage_account_name" {
  description = "Storage account name (must be globally unique)"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}
