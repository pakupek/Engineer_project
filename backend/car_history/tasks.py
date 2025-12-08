from celery import shared_task
from django.core.mail import send_mail
import os
from django.core.cache import cache
from .models import Discussion
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_verification_email_task(self, email, code):
    """Wysyłka maila z kodem w tle przez Celery"""

    
    try:
        result = send_mail(
            subject="GaraZero: Kod weryfikacyjny",
            message=f"Twój kod weryfikacyjny: {code}\n\nKod jest ważny przez 5 minut.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False, 
        )
        
        if result == 1:
            logger.info(f"Email wysłany pomyślnie do: {email}")
            return {"status": "success", "email": email}
        else:
            logger.error(f"Email nie został wysłany")
            raise Exception("Email nie został wysłany")
            
    except Exception as e:
        logger.error(f"Błąd wysyłania emaila do {email}: {str(e)}")
        logger.exception(e)  
        
        # Retry po 10 sekundach, maksymalnie 3 razy
        try:
            raise self.retry(exc=e, countdown=10)
        except self.MaxRetriesExceededError:
            logger.error(f"Przekroczono maksymalną liczbę prób dla {email}")
            raise

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