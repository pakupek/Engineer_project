from django.urls import path
from .views import UserRegistrationView, login, HomeView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', login, name='login'),
]