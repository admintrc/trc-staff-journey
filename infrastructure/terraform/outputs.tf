output "resource_group_name" {
  value       = azurerm_resource_group.trc.name
  description = "Name of the resource group"
}

output "backend_app_service_url" {
  value       = "https://${azurerm_app_service.backend.default_site_hostname}"
  description = "URL of the backend API service"
}

output "frontend_app_service_url" {
  value       = "https://${azurerm_app_service.frontend.default_site_hostname}"
  description = "URL of the frontend web app"
}

output "database_server_fqdn" {
  value       = azurerm_postgresql_server.trc.fqdn
  description = "Fully qualified domain name of the PostgreSQL server"
}

output "database_name" {
  value       = azurerm_postgresql_database.trc.name
  description = "Name of the PostgreSQL database"
}

output "storage_account_name" {
  value       = azurerm_storage_account.trc.name
  description = "Name of the storage account"
}
