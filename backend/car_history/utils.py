from django.utils import timezone
import os

def vehicle_image_path(instance, filename):
    # Pliki będą w media/vehicles/<VIN>/<nazwa_pliku>
    return f"vehicles/{instance.vehicle.vin}/{filename}"