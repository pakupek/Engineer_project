from celery import shared_task
import logging
from django.core.cache import cache
from .models import Discussion
from celery import shared_task
from .models import VehicleHistory

logger = logging.getLogger(__name__)

@shared_task
def scrape_vehicle_history(registration, vin, production_date):
    vh = VehicleHistory(registration, vin, production_date)
    return vh.search()


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
