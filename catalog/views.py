"""API views and viewsets for catalog application."""

from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response

from catalog.models import Category, Product
from catalog.serializers import CategorySerializer, ProductSerializer
from catalog.permissions import IsOwnerOrReadOnly

# =============================================================================
# Milestone 2: Implement CategoryViewSet and ProductViewSet
# =============================================================================

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('owner', 'category').order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    # =========================================================================
    # Milestone 3: Attach Filtering and Search to ProductViewSet
    # =========================================================================
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'sku']
    ordering_fields = ['price', 'created_at']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def restock(self, request, pk=None):
        product = self.get_object()
        try:
            amount = int(request.data.get('amount', 0))
        except (TypeError, ValueError):
            return Response({'amount': 'Amount must be an integer.'}, status=status.HTTP_400_BAD_REQUEST)
        if amount <= 0:
            return Response({'amount': 'Amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)
        product.stock += amount
        product.save()
        return Response(self.get_serializer(product).data)

# =============================================================================
# Milestone 4: Frontend View
# =============================================================================

def product_list_page(request):
    return render(request, 'catalog/product_list.html')