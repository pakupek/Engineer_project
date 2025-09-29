from django.urls import path
from .views import DiscussionListCreateView, DiscussionDetailView, CommentListCreateView, MessageListCreateView, ConversationListView, UnreadMessagesCountView, MarkAsReadView, UserListView, check_auth_status
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('discussions/', DiscussionListCreateView.as_view(), name='discussion-list'),
    path('discussions/<int:pk>/', DiscussionDetailView.as_view(), name='discussion-detail'),
    path('discussions/<int:discussion_id>/comments/', CommentListCreateView.as_view(), name='comment-list'),
    path('messages/', MessageListCreateView.as_view(), name='message-list'),
    path('messages/conversation/<int:user_id>/', ConversationListView.as_view(), name='conversation'),
    path('messages/unread-count/', UnreadMessagesCountView.as_view(), name='unread-count'),
    path('messages/<int:pk>/mark-read/', MarkAsReadView.as_view(), name='mark-read'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('auth/check/', check_auth_status, name='auth-check'),
]