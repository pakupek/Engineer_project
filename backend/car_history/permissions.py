from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Pozwala edytować pojazd tylko jego właścicielowi.
    """

    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS (GET, HEAD, OPTIONS) są dozwolone dla wszystkich zalogowanych
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
