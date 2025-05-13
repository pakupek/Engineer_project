from django.urls import path
from .views import UserRegistrationView, login

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', login, name='login'),
]