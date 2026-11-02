"""Serializers for catalog models."""

from rest_framework import serializers

# =============================================================================
# Milestone 1: Implement CategorySerializer and ProductSerializer
# =============================================================================
#
# TODO: Import Category and Product from catalog.models
#
# TODO: Implement CategorySerializer with optional slug (required=False)
#       and auto-population in create() using slugify.
#
# TODO: Implement ProductSerializer with owner and category_name read-only fields,
#       and custom field-level validation for price (validate_price).
