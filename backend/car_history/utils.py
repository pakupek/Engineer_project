import os

def vehicle_image_path(instance, filename):
    # Pliki będą w media/vehicles/<VIN>/<nazwa_pliku>
    return f"https://res.cloudinary.com/dsopzzzrl/image/upload/v123/vehicles/{instance.vehicle.vin}/{filename}"


def vehicle_invoice_path(instance, filename):
    # Pliki faktur będą w media/vehicles/<VIN>/invoice/<nazwa_pliku>
    return f"https://res.cloudinary.com/dsopzzzrl/image/upload/v123/vehicles/{instance.vehicle.vin}/invoice/{filename}"


def damage_image_path(instance, filename):
    """
    Funkcja generująca ścieżkę dla zdjęć uszkodzeń
    Format: media/vehicles/<VIN>/damage/<id>/<nazwa_pliku>
    """
    
    return f"https://res.cloudinary.com/dsopzzzrl/image/upload/v123/vehicles/{instance.damage_entry.vehicle.vin}/damage/{instance.damage_entry.id}/{filename}"


def user_avatar_path(instance, filename):
    # Zwraca ścieżkę: avatars/user_<id>/<filename>
    filename_base, filename_ext = os.path.splitext(filename)
    return f"https://res.cloudinary.com/dsopzzzrl/image/upload/v123/avatars/user_{instance.id}/avatar{filename_ext}"


def default_avatar_path():
    # Domyślna ścieżka do default avatar dla użytkowników
    return "https://res.cloudinary.com/dsopzzzrl/image/upload/v123/avatars/default_avatar.jpg"


def discussion_image_path(instance, filename):
    # Ścieżka: media/discussions/<discussion_id>/discussion_img/<filename>
    return f"https://res.cloudinary.com/dsopzzzrl/image/upload/v123/discussions/{instance.discussion.id}/discussion_img/{filename}"


def comment_image_path(instance, filename):
    # Ścieżka: media/discussions/<discussion_id>/comments/<comment_id>/<filename>
    discussion_id = instance.comment.discussion.id
    return f"https://res.cloudinary.com/dsopzzzrl/image/upload/v123/discussions/{discussion_id}/comments/{instance.comment.id}/{filename}"