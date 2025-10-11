#!/usr/bin/env python
import os
import django

# Ustawienie środowiska Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # <- zmień na swoją ścieżkę do settings
django.setup()

from car_history.models import Vehicle

def delete_invalid_vehicles():
    invalid_vehicles = Vehicle.objects.filter(generation__isnull=True)
    count = invalid_vehicles.count()
    if count == 0:
        print("Brak wadliwych pojazdów do usunięcia.")
        return

    print(f"Znaleziono {count} wadliwych pojazdów. Usuwanie...")
    invalid_vehicles.delete()
    print("Usunięto wszystkie wadliwe pojazdy.")

if __name__ == "__main__":
    delete_invalid_vehicles()
