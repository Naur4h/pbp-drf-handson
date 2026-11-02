"""Custom permission classes for catalog application."""

from rest_framework import permissions

# =============================================================================
# Milestone 2: Define IsOwnerOrReadOnly custom permission class
# =============================================================================
#
# TODO: Implement IsOwnerOrReadOnly extending permissions.BasePermission.
#       Allow SAFE_METHODS (GET, HEAD, OPTIONS) for any user,
#       and restrict mutating requests to obj.owner == request.user.
