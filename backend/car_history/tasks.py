from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import logging
from django.core.cache import cache
from .models import Discussion

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_verification_email_task(self, email, code):
    """Wysyłka emaila przez SMTP Gmail"""

    logger.info(f"📧 Wysyłanie emaila do: {email} przez Gmail SMTP")

    try:
        subject = "GaraZero: Kod weryfikacyjny"
        from_email = settings.EMAIL_HOST_USER
        to = [email]

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Twój kod weryfikacyjny:</h2>
            <div style="border: 2px dashed #667eea; padding: 20px; text-align: center;">
                <h1 style="color: #667eea; font-size: 42px;">{code}</h1>
            </div>
            <p>Kod ważny przez 5 minut.</p>
        </body>
        </html>
        """

        # EmailMultiAlternatives = email z HTML
        msg = EmailMultiAlternatives(
            subject=subject,
            body="Twój kod weryfikacyjny: " + code,
            from_email=from_email,
            to=to,
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        logger.info(f"Email wysłany pomyślnie do {email}")

        return {"status": "success", "email": email}

    except Exception as e:
        logger.error(f"Błąd SMTP Gmail: {str(e)}")

        if self.request.retries < self.max_retries:
            logger.info(f"Retry za 10s... próba {self.request.retries + 1}/3")
            raise self.retry(exc=e, countdown=10)
        else:
            logger.error(f"Przekroczono limit prób dla {email}")
            raise


CACHE_KEY = "discussion_list"
CACHE_TTL = 30

@shared_task
def refresh_discussions_cache_task():
    """Odświeżenie cache listy dyskusji."""
    try:
        queryset = (
            Discussion.objects.all()
            .select_related("author")
            .prefetch_related("images")
        )
        cache.set(CACHE_KEY, queryset, CACHE_TTL)

    except Exception as e:
        print(f"❌ Failed to refresh discussion cache: {e}")
