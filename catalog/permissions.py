"""Custom permission classes for catalog application."""

from rest_framework import permissions

# =============================================================================
# Milestone 2: Define IsOwnerOrReadOnly custom permission class
# =============================================================================

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user