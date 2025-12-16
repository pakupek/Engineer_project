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


@shared_task(bind=True, max_retries=3)
def process_vehicle_images(self, vehicle_id, files_data):
    """
    Asynchroniczne przetwarzanie i zapisywanie zdjęć pojazdu.
    
    Args:
        vehicle_id: ID pojazdu
        files_data: Lista dict z danymi plików:
                   [{'name': 'file.jpg', 'content': base64_encoded_data, 'content_type': 'image/jpeg'}]
    """
    from car_history.models import Vehicle, VehicleImage
    
    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)
        saved_images = []
        
        with transaction.atomic():
            for file_data in files_data:
                try:
                    # Dekoduj base64
                    content = base64.b64decode(file_data['content'])
                    
                    # Utwórz ContentFile
                    file_obj = ContentFile(content, name=file_data['name'])
                    
                    # Zapisz zdjęcie
                    vehicle_image = VehicleImage.objects.create(
                        vehicle=vehicle,
                        image=file_obj
                    )
                    saved_images.append(vehicle_image.id)
                    
                    logger.info(f"Saved image {file_data['name']} for vehicle {vehicle.vin}")
                    
                except Exception as e:
                    logger.error(f"Error saving image {file_data['name']}: {str(e)}")
                    # Kontynuuj z następnymi plikami
                    continue
            
            # Aktualizuj licznik
            from django.db.models import F
            Vehicle.objects.filter(pk=vehicle.pk).update(
                images_count=F('images_count') + len(saved_images)
            )
        
        return {
            'success': True,
            'saved_count': len(saved_images),
            'saved_ids': saved_images
        }
        
    except Vehicle.DoesNotExist:
        logger.error(f"Vehicle with id {vehicle_id} not found")
        return {'success': False, 'error': 'Vehicle not found'}
        
    except Exception as e:
        logger.error(f"Error in process_vehicle_images: {str(e)}", exc_info=True)
        # Retry po 5 sekundach
        raise self.retry(exc=e, countdown=5)


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
