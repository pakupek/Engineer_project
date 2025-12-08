from celery import shared_task
from django.conf import settings
import logging
import requests
from django.core.cache import cache
from .models import Discussion

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_verification_email_task(self, email, code):
    """Wysyłanie emaila przez Brevo API (Sendinblue)"""

    logger.info(f"📧 Wysyłanie emaila do: {email} przez Brevo API")

    subject = "GaraZero: Kod weryfikacyjny"

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

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    payload = {
        "sender": {
            "name": "GaraZero",
            "email": "no-reply@brevo.com"
        },
        "to": [{"email": email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        if response.status_code not in (200, 201):
            logger.error(f"❌ Brevo error: {response.status_code} -> {response.text}")
            if self.request.retries < self.max_retries:
                logger.info(f"Retry za 10s... próba {self.request.retries + 1}/3")
                raise self.retry(exc=Exception(response.text), countdown=10)
            else:
                raise Exception("Przekroczono limit prób wysyłki przez Brevo")

        message_id = data.get("messageId", "unknown")
        logger.info(f"✅ Email wysłany pomyślnie! Brevo ID: {message_id}")
        return {"status": "success", "email": email, "message_id": message_id}

    except Exception as e:
        logger.error(f"Błąd połączenia z Brevo: {str(e)}")
        if self.request.retries < self.max_retries:
            logger.info(f"Retry za 10s... próba {self.request.retries + 1}/3")
            raise self.retry(exc=e, countdown=10)
        else:
            logger.error(f"Przekroczono limit prób dla {email}")
            raise


# -------------------------------
#  CACHE REFRESH TASK
# -------------------------------

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
