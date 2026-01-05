from celery import shared_task
import logging, asyncio, base64
from django.core.cache import cache
from .models import Discussion
from celery import shared_task
from .models import VehicleHistory
from django.db import transaction
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def scrape_vehicle_history(self, registration, vin, production_date):
    """
    Wywołuje async scraper Playwright w synchronicznej powłoce Celery
    """
    try:
        # Ustaw status na "processing"
        cache.set(f'vehicle_task_{self.request.id}', {'status': 'processing'}, timeout=3600)
        
        # Uruchom async scraper
        result = asyncio.run(_scrape_async(registration, vin, production_date))
        
        if result:
            # Zapisz wynik do cache (Redis)
            cache.set(f'vehicle_history_{vin}', result, timeout=3600)
            cache.set(f'vehicle_task_{self.request.id}', {
                'status': 'completed',
                'vin': vin
            }, timeout=3600)
            
        return result
        
    except Exception as e:
        logger.error(f"Błąd w scrape_vehicle_history: {e}")
        cache.set(f'vehicle_task_{self.request.id}', {
            'status': 'failed',
            'error': str(e)
        }, timeout=3600)
        raise


async def _scrape_async(registration, vin, production_date):
    """
    Funkcja async wywołująca scraper
    """
    vh = VehicleHistory(registration, vin, production_date)
    result = await vh.search()
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
