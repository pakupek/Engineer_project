from celery import shared_task
import resend
from django.conf import settings
import logging
from django.core.cache import cache
from .models import Discussion

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_verification_email_task(self, email, code):
    """Wysyłka emaila przez Resend API"""
    
    logger.info(f"📧 Wysyłanie emaila do: {email} przez Resend")
    
    # Ustaw API key
    resend.api_key = settings.RESEND_API_KEY
    
    try:
        params = {
            "from": "GaraZero <onboarding@resend.dev>",
            "to": [email],
            "subject": "GaraZero: Kod weryfikacyjny",
            "html": f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">GaraZero</h1>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333; margin-top: 0;">Witaj w GaraZero!</h2>
                    <p style="font-size: 16px;">Twój kod weryfikacyjny to:</p>
                    
                    <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                        <h1 style="color: #667eea; font-size: 48px; margin: 0; letter-spacing: 8px; font-weight: bold;">{code}</h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        ⏱️ Kod jest ważny przez <strong>5 minut</strong>.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        Jeśli to nie Ty, zignoruj tę wiadomość.<br>
                        To automatyczna wiadomość - nie odpowiadaj na nią.
                    </p>
                </div>
            </body>
            </html>
            """,
        }
        
        response = resend.Emails.send(params)
        
        logger.info(f"✅ Email wysłany pomyślnie! ID: {response.get('id')}")
        return {
            "status": "success",
            "email": email,
            "message_id": response.get('id')
        }
        
    except resend.exceptions.ResendError as e:
        logger.error(f"Resend API error: {str(e)}")
        
        if self.request.retries < self.max_retries:
            logger.info(f"Retry za 10 sekund... ({self.request.retries + 1}/{self.max_retries})")
            raise self.retry(exc=e, countdown=10)
        else:
            logger.error(f"Przekroczono limit prób dla {email}")
            raise
            
    except Exception as e:
        logger.error(f"Nieoczekiwany błąd: {str(e)}")
        logger.exception(e)
        
        if self.request.retries < self.max_retries:
            raise self.retry(exc=e, countdown=10)
        else:
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