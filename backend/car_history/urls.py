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
    VehicleGenerationListAPI,
    VehicleImageListCreateView,
    vehicle_history,
    ServiceEntryView,
    DamageEntryView,
    VehicleDeleteView,
    VehicleSaleView,
    VehicleSaleDetailView,
    VehicleHistoryPDFView,
    AutomotiveNewsView,
    LockDiscussionView,
    CommentStatsUpdateAPIView,
    DiscussionStatsView,
    DiscussionFavoriteView,
    SendVerificationCodeView,
    VehicleImageDetailView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('send-verification-code/', SendVerificationCodeView.as_view(), name='send_verification_code'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    path('discussions/', DiscussionListCreateView.as_view(), name='discussion_list'),
    path('discussions/<int:discussion_id>/vote/', DiscussionStatsView.as_view(), name='discussion_vote'),
    path('discussions/<int:discussion_id>/favorite/', DiscussionFavoriteView.as_view(), name='discussion_favorite'),
    path('discussions/<int:pk>/', DiscussionDetailView.as_view(), name='discussion_detail'),
    path('discussions/<int:discussion_id>/comments/', CommentListCreateView.as_view(), name='comment_list'),
    path('discussions/<int:pk>/close/', LockDiscussionView.as_view(), name='close_discussion'),
    path("comments/<int:comment_id>/vote/", CommentStatsUpdateAPIView.as_view(), name="comment_vote"),
    


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
    path("vehicles/<str:vin>/history/pdf/", VehicleHistoryPDFView.as_view(), name="vehicle_history_pdf"),
    path('vehicles/<str:vin>/delete/', VehicleDeleteView.as_view(), name='vehicle_delete'),
    path('vehicles/<str:vin>/images/', VehicleImageListCreateView.as_view(), name='vehicle_images'),
    path("vehicles/<str:vin>/images/<int:pk>/", VehicleImageDetailView.as_view()),
    path('vehicle-history/<str:vin>/', vehicle_history, name='vehicle_history_by_vin'),


    path('makes/', VehicleMakeListAPI.as_view(), name='vehicle_makes'),
    path('models/', VehicleModelListAPI.as_view(), name='vehicle_models'),
    path('generations/', VehicleGenerationListAPI.as_view(), name='vehicle_generations'),
    
    
    path('service-entry/<str:vin>/', ServiceEntryView.as_view(), name='service_entry'),
    path('service-entry/<str:vin>/<int:entry_id>/', ServiceEntryView.as_view(), name='service_entry_detail'),


    path("damage-entry/<str:vin>/", DamageEntryView.as_view(), name="damage_entry_list"),
    path("damage-entry/<str:vin>/<int:entry_id>/", DamageEntryView.as_view(), name="damage_entry_detail"),
    

    path('sales/', VehicleSaleView.as_view(), name='vehicle_sale'),
    path("sales/<int:pk>/", VehicleSaleDetailView.as_view(), name="vehicle_sale_detail"),
    

    path("automotive-news/", AutomotiveNewsView.as_view(), name="automotive_news"),
]