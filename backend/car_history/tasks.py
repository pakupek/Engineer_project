from celery import shared_task
from django.conf import settings
import logging
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from django.core.cache import cache
from .models import Discussion

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_verification_email_task(self, email, code):
    """Wysyłka emaila przez Brevo API (sib_api_v3_sdk)"""

    logger.info(f"📧 Wysyłanie emaila do: {email} przez Brevo API")

    # Konfiguracja klienta Brevo
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = settings.BREVO_API_KEY
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

    # Treść wiadomości
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

    sender = {"name": "GaraZero", "email": "no-reply@brevo.com"}  # bez własnej domeny

    to = [{"email": email}]

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        sender=sender,
        subject=subject,
        html_content=html_content
    )

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        logger.info(f"✅ Email wysłany pomyślnie! Brevo ID: {api_response['messageId']}")
        return {"status": "success", "email": email, "message_id": api_response['messageId']}

    except ApiException as e:
        logger.error(f"❌ Brevo API Exception: {e}")

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
