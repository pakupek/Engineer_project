from django.urls import path
from .views import DiscussionListCreateView, DiscussionDetailView, CommentListCreateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('discussions/', DiscussionListCreateView.as_view(), name='discussion-list'),
    path('discussions/<int:pk>/', DiscussionDetailView.as_view(), name='discussion-detail'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list'),
]