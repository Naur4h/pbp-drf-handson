"""Database models for catalog application."""

from django.db import models
from django.contrib.auth.models import User

# =============================================================================
# Milestone 1: Define Category and Product models
# =============================================================================
#
# TODO: Implement Category model with name and blank=True slug, including
#       save() method using slugify for auto-slug generation.
#
# TODO: Implement Product model with owner, category, name, sku, price, stock,
#       and created_at fields.
