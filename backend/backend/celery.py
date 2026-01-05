from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  

app = Celery(
    'backend',
    broker=os.environ.get("CELERY_BROKER_URL"),
    backend=os.environ.get("CELERY_RESULT_BACKEND"),) 
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()