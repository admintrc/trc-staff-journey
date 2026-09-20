terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "azure_subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# Resource Group
resource "azurerm_resource_group" "trc" {
  name     = "rg-trc-staff-journey-${var.environment}"
  location = "australiaeast"

  tags = {
    Environment = var.environment
    Project     = "TRC Staff Journey"
  }
}

# PostgreSQL Server
resource "azurerm_postgresql_server" "trc" {
  name                = "trc-staff-journey-db-${var.environment}"
  location            = azurerm_resource_group.trc.location
  resource_group_name = azurerm_resource_group.trc.name

  administrator_login          = "trcadmin"
  administrator_login_password = random_password.db_password.result

  sku_name   = "B_Gen5_1"
  storage_mb = 51200
  version    = "11"

  backup_retention_days            = 7
  geo_redundant_backup_enabled     = false
  auto_grow_enabled                = true
  public_network_access_enabled    = true
  ssl_enforcement_enabled          = true
  ssl_minimal_tls_version_enforced = "TLS1_2"

  tags = {
    Environment = var.environment
  }
}

resource "azurerm_postgresql_database" "trc" {
  name                = "trc_staff_journey"
  resource_group_name = azurerm_resource_group.trc.name
  server_name         = azurerm_postgresql_server.trc.name
  charset             = "UTF8"
  collation           = "en_US.utf8"
}

resource "azurerm_postgresql_firewall_rule" "allow_azure" {
  name                = "AllowAzureServices"
  resource_group_name = azurerm_resource_group.trc.name
  server_name         = azurerm_postgresql_server.trc.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

# App Service Plan
resource "azurerm_app_service_plan" "trc" {
  name                = "asp-trc-staff-journey-${var.environment}"
  location            = azurerm_resource_group.trc.location
  resource_group_name = azurerm_resource_group.trc.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Basic"
    size = "B1"
  }

  tags = {
    Environment = var.environment
  }
}

# App Service (Backend API)
resource "azurerm_app_service" "api" {
  name                = "trc-staff-journey-api-${var.environment}"
  location            = azurerm_resource_group.trc.location
  resource_group_name = azurerm_resource_group.trc.name
  app_service_plan_id = azurerm_app_service_plan.trc.id

  site_config {
    linux_fx_version = "NODE|18-lts"
    use_32_bit_worker_process = false
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "WEBSITE_NODE_DEFAULT_VERSION"        = "18-lts"
    "DB_HOST"                             = azurerm_postgresql_server.trc.fqdn
    "DB_PORT"                             = "5432"
    "DB_NAME"                             = azurerm_postgresql_database.trc.name
    "DB_USER"                             = "${azurerm_postgresql_server.trc.administrator_login}@${azurerm_postgresql_server.trc.name}"
    "DB_PASSWORD"                         = random_password.db_password.result
    "NODE_ENV"                            = "production"
    "JWT_SECRET"                          = random_password.jwt_secret.result
  }

  connection_string {
    name             = "DefaultConnection"
    type             = "PostgreSQL"
    connection_string = "Server=${azurerm_postgresql_server.trc.fqdn};Port=5432;Database=${azurerm_postgresql_database.trc.name};User Id=${azurerm_postgresql_server.trc.administrator_login}@${azurerm_postgresql_server.trc.name};Password=${random_password.db_password.result};"
  }

  tags = {
    Environment = var.environment
  }
}

# Static Web App (Frontend)
resource "azurerm_static_site" "frontend" {
  name                = "trc-staff-journey-web-${var.environment}"
  location            = "eastus" # Static Web Apps location
  resource_group_name = azurerm_resource_group.trc.name
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = {
    Environment = var.environment
  }
}

# Storage Account (optional, for file uploads)
resource "azurerm_storage_account" "files" {
  name                     = "trcstaffjourney${replace(var.environment, "-", "")}"
  location                 = azurerm_resource_group.trc.location
  resource_group_name      = azurerm_resource_group.trc.name
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    Environment = var.environment
  }
}

resource "azurerm_storage_container" "uploads" {
  name                  = "uploads"
  storage_account_name  = azurerm_storage_account.files.name
  container_access_type = "private"
}

# Random Passwords
resource "random_password" "db_password" {
  length  = 16
  special = true
}

resource "random_password" "jwt_secret" {
  length  = 32
  special = true
}

# Outputs
output "resource_group_name" {
  value = azurerm_resource_group.trc.name
}

output "app_service_url" {
  value = azurerm_app_service.api.default_site_hostname
}

output "static_web_app_url" {
  value = azurerm_static_site.frontend.default_host_name
}

output "database_connection_string" {
  value     = "postgresql://${azurerm_postgresql_server.trc.administrator_login}@${azurerm_postgresql_server.trc.name}:${random_password.db_password.result}@${azurerm_postgresql_server.trc.fqdn}:5432/${azurerm_postgresql_database.trc.name}"
  sensitive = true
}

output "api_base_url" {
  value = "https://${azurerm_app_service.api.default_site_hostname}"
}

output "frontend_url" {
  value = "https://${azurerm_static_site.frontend.default_host_name}"
}
