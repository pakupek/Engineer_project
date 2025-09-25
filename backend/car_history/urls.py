from django.urls import path
from .views import PostListCreateAPIView, PostDeleteAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('posts/', PostListCreateAPIView.as_view(), name='posts-list'),
    path('posts/<int:pk>/delete/', PostDeleteAPIView.as_view(), name='post-delete'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]