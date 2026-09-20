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

resource "azurerm_resource_group" "trc" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_app_service_plan" "trc" {
  name                = "trc-staff-journey-plan"
  location            = azurerm_resource_group.trc.location
  resource_group_name = azurerm_resource_group.trc.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_app_service" "backend" {
  name                = "trc-staff-journey-api"
  location            = azurerm_resource_group.trc.location
  resource_group_name = azurerm_resource_group.trc.name
  app_service_plan_id = azurerm_app_service_plan.trc.id

  site_config {
    linux_fx_version = "NODE|18-lts"
  }

  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = false
    DOCKER_REGISTRY_SERVER_URL          = ""
    PORT                                 = "5000"
    NODE_ENV                            = "production"
  }
}

resource "azurerm_app_service" "frontend" {
  name                = "trc-staff-journey-web"
  location            = azurerm_resource_group.trc.location
  resource_group_name = azurerm_resource_group.trc.name
  app_service_plan_id = azurerm_app_service_plan.trc.id

  site_config {
    linux_fx_version = "NODE|18-lts"
  }
}

resource "azurerm_postgresql_server" "trc" {
  name                = "trc-staff-journey-db"
  location            = azurerm_resource_group.trc.location
  resource_group_name = azurerm_resource_group.trc.name

  administrator_login          = var.db_admin_login
  administrator_login_password = var.db_admin_password

  sku_name   = "B_Gen5_2"
  storage_mb = 51200
  version    = "11"

  backup_retention_days            = 7
  geo_redundant_backup_enabled     = false
  auto_grow_enabled                = true
  public_network_access_enabled    = true
  ssl_enforcement_enabled          = true
  ssl_minimal_tls_version_enforced = "TLS1_2"
}

resource "azurerm_postgresql_database" "trc" {
  name                = "trc_staff_journey"
  resource_group_name = azurerm_resource_group.trc.name
  server_name         = azurerm_postgresql_server.trc.name
  charset             = "UTF8"
  collation           = "en_US.utf8"
}

resource "azurerm_postgresql_firewall_rule" "azure_services" {
  name                = "AllowAzureServices"
  resource_group_name = azurerm_resource_group.trc.name
  server_name         = azurerm_postgresql_server.trc.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

resource "azurerm_storage_account" "trc" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.trc.name
  location                 = azurerm_resource_group.trc.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
}

resource "azurerm_storage_container" "forms" {
  name                  = "forms"
  storage_account_name  = azurerm_storage_account.trc.name
  container_access_type = "private"
}
