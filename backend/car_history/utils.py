import os, random

def generate_verification_code(length=6):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])

def vehicle_image_path(instance, filename):
    # Pliki będą w media/vehicles/<VIN>/<nazwa_pliku>
    return f"vehicles/{instance.vehicle.vin}/{filename}"


def vehicle_invoice_path(instance, filename):
    # Pliki faktur będą w media/vehicles/<VIN>/invoice/<nazwa_pliku>
    return f"vehicles/{instance.vehicle.vin}/invoice/{filename}"


def damage_image_path(instance, filename):
    """
    Funkcja generująca ścieżkę dla zdjęć uszkodzeń
    Format: media/vehicles/<VIN>/damage/<id>/<nazwa_pliku>
    """
    
    return f"vehicles/{instance.damage_entry.vehicle.vin}/damage/{instance.damage_entry.id}/{filename}"


def user_avatar_path(instance, filename):
    # Zwraca ścieżkę: avatars/user_<id>/<filename>
    filename_base, filename_ext = os.path.splitext(filename)
    return f"avatars/user_{instance.id}/avatar{filename_ext}"


def default_avatar_path():
    # Domyślna ścieżka do default avatar dla użytkowników
    return "avatars/default_avatar.jpg"


def discussion_image_path(instance, filename):
    # Ścieżka: media/discussions/<discussion_id>/discussion_img/<filename>
    return f"discussions/{instance.discussion.id}/discussion_img/{filename}"


def comment_image_path(instance, filename):
    # Ścieżka: media/discussions/<discussion_id>/comments/<comment_id>/<filename>
    discussion_id = instance.comment.discussion.id
    return f"discussions/{discussion_id}/comments/{instance.comment.id}/{filename}"