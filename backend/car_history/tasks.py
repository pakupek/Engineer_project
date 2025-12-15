from celery import shared_task
import logging, asyncio
from django.core.cache import cache
from .models import Discussion
from celery import shared_task
from .models import VehicleHistory

logger = logging.getLogger(__name__)

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 10},
    retry_backoff=True
)
def scrape_vehicle_history(registration, vin, production_date):
    """
    Wywołuje async scraper Playwright w synchronej powłoce Celery
    """
    # Uruchamiamy async funkcję w loopie
    return asyncio.run(_scrape_async(registration, vin, production_date))


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
