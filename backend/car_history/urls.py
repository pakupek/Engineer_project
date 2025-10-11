from django.urls import path
from .views import (
    DiscussionListCreateView, 
    DiscussionDetailView, 
    CommentListCreateView, 
    MessageListCreateView, 
    ConversationListView, 
    UnreadMessagesCountView, 
    MarkAsReadView, 
    UserListView, 
    check_auth_status,
    UserProfileView,
    change_password,
    VehicleCreateView,
    UserVehicleListView,
    VehicleListView,
    VehiclesForSaleListView,
    VehicleDetailAPI,
    UserRegistrationView,
    VehicleMakeListAPI,
    VehicleModelListAPI,
    VehicleGenerationListAPI
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('discussions/', DiscussionListCreateView.as_view(), name='discussion_list'),
    path('discussions/<int:pk>/', DiscussionDetailView.as_view(), name='discussion_detail'),
    path('discussions/<int:discussion_id>/comments/', CommentListCreateView.as_view(), name='comment_list'),
    path('messages/', MessageListCreateView.as_view(), name='message_list'),
    path('messages/conversation/<int:user_id>/', ConversationListView.as_view(), name='conversation'),
    path('messages/unread-count/', UnreadMessagesCountView.as_view(), name='unread_count'),
    path('messages/<int:pk>/mark-read/', MarkAsReadView.as_view(), name='mark_read'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('auth/check/', check_auth_status, name='auth_check'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('change-password/', change_password, name='change_password'),


    path('vehicles/create/', VehicleCreateView.as_view(), name='create_car'),
    path('vehicles/', VehicleListView.as_view(),name='vehicle_list'),
    path('vehicles/my-vehicles/', UserVehicleListView.as_view(),name='user_vehicles'),
    path('vehicles/for-sale/', VehiclesForSaleListView.as_view(), name='vehicles_for_sale'),
    path('vehicles/<str:vin>/', VehicleDetailAPI.as_view(), name='vehicle_detail'),
    path('makes/', VehicleMakeListAPI.as_view(), name='vehicle_makes'),
    path('models/', VehicleModelListAPI.as_view(), name='vehicle_models'),
    path('generations/', VehicleGenerationListAPI.as_view(), name='vehicle-generations'),
]