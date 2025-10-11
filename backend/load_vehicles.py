#!/usr/bin/env python
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # <- dostosuj ścieżkę do settings
django.setup()

from car_history.models import VehicleMake, VehicleModel, VehicleGeneration

def load_vehicle_data():
    vehicle_data = {
        "Toyota": {
            "Corolla": [
                {"name": "E150", "production_start": 2006, "production_end": 2013},
                {"name": "E170", "production_start": 2013, "production_end": 2019},
                {"name": "E210", "production_start": 2019, "production_end": None},
            ],
            "Yaris": [
                {"name": "XP130", "production_start": 2011, "production_end": 2020},
                {"name": "XP210", "production_start": 2020, "production_end": None},
            ],
        },
        "Volkswagen": {
            "Golf": [
                {"name": "VI", "production_start": 2008, "production_end": 2012},
                {"name": "VII", "production_start": 2012, "production_end": 2019},
                {"name": "VIII", "production_start": 2019, "production_end": None},
            ],
            "Passat": [
                {"name": "B7", "production_start": 2010, "production_end": 2015},
                {"name": "B8", "production_start": 2015, "production_end": None},
            ],
        },
        "BMW": {
            "3 Series": [
                {"name": "E90", "production_start": 2005, "production_end": 2013},
                {"name": "F30", "production_start": 2011, "production_end": 2019},
                {"name": "G20", "production_start": 2018, "production_end": None},
            ],
        },
    }

    for make_name, models in vehicle_data.items():
        make_obj, created_make = VehicleMake.objects.get_or_create(name=make_name)
        if created_make:
            print(f"Utworzono markę: {make_name}")
        for model_name, gens in models.items():
            model_obj, created_model = VehicleModel.objects.get_or_create(make=make_obj, name=model_name)
            if created_model:
                print(f"  Utworzono model: {make_name} {model_name}")
            for gen_data in gens:
                gen_name = gen_data.get("name")
                start = gen_data.get("production_start")
                end = gen_data.get("production_end")
                generation_obj, created_gen = VehicleGeneration.objects.get_or_create(
                    model = model_obj,
                    name = gen_name,
                    defaults = {
                        "production_start": start,
                        "production_end": end
                    }
                )
                if created_gen:
                    print(f"    Utworzono generację: {make_name} {model_name} {gen_name} ({start}–{end})")
                else:
                    # Jeśli już istnieje, można też zaktualizować lata produkcji, jeśli dane się zmieniły
                    changed = False
                    if start is not None and generation_obj.production_start != start:
                        generation_obj.production_start = start
                        changed = True
                    if end is not None and generation_obj.production_end != end:
                        generation_obj.production_end = end
                        changed = True
                    if changed:
                        generation_obj.save()
                        print(f"    Zaktualizowano generację: {make_name} {model_name} {gen_name}")

    print("✅ Wstawianie modeli i generacji zakończone.")

if __name__ == "__main__":
    load_vehicle_data()
