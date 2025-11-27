from celery import shared_task
from django.core.mail import send_mail
import os

@shared_task
def send_verification_email_task(email, code):
    """Wysyłka maila z kodem w tle przez Celery"""
    send_mail(
        subject="GaraZero: Kod weryfikacyjny",
        message=f"Twój kod weryfikacyjny: {code}",
        from_email=os.getenv("EMAIL_HOST_USER"),
        recipient_list=[email],
    )
