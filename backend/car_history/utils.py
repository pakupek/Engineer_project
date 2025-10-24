from django.utils import timezone
import os

def vehicle_image_path(instance, filename):
    # Pliki będą w media/vehicles/<VIN>/<nazwa_pliku>
    return f"vehicles/{instance.vehicle.vin}/{filename}"

def vehicle_invoice_path(instance, filename):
    # Pliki faktur będą w media/vehicles/<VIN>/invoice/<nazwa_pliku>
    return f"vehicles/{instance.vehicle.vin}/invoice/{filename}"

def damage_image_path(instance, filename):
    # Pliki zdjęć uszkodzeń będą w media/vehicles/<VIN>/damage/<nazwa_pliku>
    return f"vehicles/{instance.vehicle.vin}/damage/{filename}"