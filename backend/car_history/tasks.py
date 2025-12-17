from celery import shared_task
import logging, asyncio, base64
from django.core.cache import cache
from .models import Discussion
from celery import shared_task
from .models import VehicleHistory
from django.db import transaction
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)
_vehicle_history_cache = {}

@shared_task()
def scrape_vehicle_history(registration, vin, production_date):
    """
    Wywołuje async scraper Playwright w synchronej powłoce Celery
    """
    # Uruchamiamy async 
    return asyncio.run(_scrape_async(registration, vin, production_date))


async def _scrape_async(registration, vin, production_date):
    """
    Funkcja async wywołująca scraper
    """
    vh = VehicleHistory(registration, vin, production_date)
    result = await vh.search()
    if result:
        _vehicle_history_cache[vin] = result  # zapis do wspólnego cache w procesie Celery
    return result


#  CACHE REFRESH TASK

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
