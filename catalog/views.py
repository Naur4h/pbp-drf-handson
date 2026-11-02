"""API views and viewsets for catalog application."""

from django.shortcuts import render
from rest_framework import viewsets, permissions

# =============================================================================
# Milestone 2: Implement CategoryViewSet and ProductViewSet
# =============================================================================
#
# TODO: Implement CategoryViewSet(viewsets.ModelViewSet) for Category model.
# TODO: Implement ProductViewSet(viewsets.ModelViewSet) for Product model with
#       perform_create() associating owner=self.request.user.

# =============================================================================
# Milestone 3: Attach Filtering and Search to ProductViewSet 
# =============================================================================
#
# TODO: Add filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
#       Add filterset_fields = ['category']
#       Add search_fields = ['name', 'sku']
#       Add ordering_fields = ['price', 'created_at']
#       Add custom @action restock()

# =============================================================================
# Milestone 4: Frontend View
# =============================================================================
#
# TODO: Implement product_list_page(request) rendering 'catalog/product_list.html'.
