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

def user_avatar_path(instance, filename):
    # Zwraca ścieżkę: avatars/user_<id>/<filename>
    filename_base, filename_ext = os.path.splitext(filename)
    return f"avatars/user_{instance.id}/avatar{filename_ext}"

def default_avatar_path():
    # Domyślna ścieżka do default avatar dla użytkowników
    return "avatars/default_avatar.jpg"