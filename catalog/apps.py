"""Catalog application configuration."""

from django.apps import AppConfig


class CatalogConfig(AppConfig):
    """Configuration class for catalog application."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'catalog'
