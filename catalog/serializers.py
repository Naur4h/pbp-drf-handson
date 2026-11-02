"""Serializers for catalog models."""

from django.utils.text import slugify
from rest_framework import serializers

# =============================================================================
# Milestone 1: Implement CategorySerializer and ProductSerializer
# =============================================================================
from catalog.models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

    def create(self, validated_data):
        if not validated_data.get('slug'):
            validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)


class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = ['id', 'owner', 'category', 'category_name', 'name', 'sku', 'price', 'stock', 'created_at']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value