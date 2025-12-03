from celery import shared_task
from django.core.mail import send_mail
import os
from django.core.cache import cache
from .models import Discussion

@shared_task
def send_verification_email_task(email, code):
    """Wysyłka maila z kodem w tle przez Celery"""
    send_mail(
        subject="GaraZero: Kod weryfikacyjny",
        message=f"Twój kod weryfikacyjny: {code}",
        from_email=os.getenv("EMAIL_HOST_USER"),
        recipient_list=[email],
    )

CACHE_KEY = "discussion_list"
CACHE_TTL = 30  # czas życia cache w sekundach

@shared_task
def refresh_discussions_cache_task():
    """
    Asynchroniczne odświeżenie cache listy dyskusji.
    Pobiera dane z bazy i zapisuje w cache.
    """
    try:
        queryset = Discussion.objects.all().select_related('author').prefetch_related('images')

        # Prefetch dla wszystkich użytkowników nie jest możliwy,
        # więc tutaj zostawiamy tylko ogólną listę.  
        # Specyficzne prefetch dla zalogowanego użytkownika w get_queryset.
        
        # Zapis w cache
        cache.set(CACHE_KEY, queryset, CACHE_TTL)
    except Exception as e:
        # Logowanie błędów, aby nie przerywać pracy Celery
        print(f"❌ Failed to refresh discussion cache: {e}")