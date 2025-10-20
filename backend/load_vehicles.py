#!/usr/bin/env python
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # <- dostosuj ścieżkę do settings
django.setup()

from car_history.models import VehicleMake, VehicleModel, VehicleGeneration

def load_vehicle_data():
    vehicle_data = {

        "Abarth":{
            "500": [],
            "500e": [],
            "595": [],
            "595C": [],
            "600e": [],
            "695": [],
            "Grande Punto": [],
            "Punto Evo": [],
        },

        "Acura":{
            "MDX": [],
            "RDX": [],
            "RL": [],
            "TL": [],
        },

        "Aito":{
            "M9": [],
        },

        "Aixam":{
            "City": [],
            "Coupe": [],
            "Crossline": [],
            "Crossover": [],
            "GTO": [],
        },

        "Alfa Romeo":{
            "147": [],
            "156": [],
            "159": [],
            "166": [],
            "4C": [],
            "Brera": [],
            "Giulia": [],
            "Giulietta": [],
            "GT": [],
            "GTV": [],
            "Junior": [],
            "Mito": [],
            "Spider": [],
            "Stelvio": [],
            "Tonale": [],
        },

        "Alpine":{
            "A110": [],
            "A290": [],
        },

        "Aston Martin":{
            "DB11": [],
            "DB12": [],
            "DB7": [],
            "DB9": [],
            "DBS": [],
            "DBX": [],
            "DBX707": [],
            "Rapide": [],
            "V12 Vanquish": [],
            "V8": [],
            "V8 Vantage": [],
            "Vanquish": [],
            "Vantage": [],
        },

        "Audi":{
            "100":[
                {"name": "C1", "production_start": 1968,"production_end": 1976},
                {"name": "C2", "production_start": 1976,"production_end": 1982},
                {"name": "C3", "production_start": 1982,"production_end": 1991},
                {"name": "C4", "production_start": 1991,"production_end": 1994},
            ],
            "80":[
                {"name": "B1", "production_start": 1972,"production_end": 1978},
                {"name": "B2", "production_start": 1978,"production_end": 1986},
                {"name": "B3", "production_start": 1986,"production_end": 1991},
                {"name": "B4", "production_start": 1991,"production_end": 1995},
            ],
            "90":[
                {"name": "B2", "production_start": 1984,"production_end": 1986},
                {"name": "B3", "production_start": 1986,"production_end": 1991},
            ],
            "A1":[
                {"name": "8X", "production_start": 2010,"production_end": 2018},
            ],
            "A1 Sportback":[
                {"name": "8X", "production_start": 2010,"production_end": 2018},
                {"name": "GB", "production_start": 2019,"production_end": None},
            ],
            "A2": [],
            "A3":[
                {"name": "8L", "production_start": 1996,"production_end": 2003},
                {"name": "8P", "production_start": 2003,"production_end": 2012},
                {"name": "8V", "production_start": 2012,"production_end": 2020},
                {"name": "8Y", "production_start": 2020,"production_end": None},
            ],
            "A3 Limousine":[
                {"name": "8P", "production_start": 2003,"production_end": 2012},
                {"name": "8V", "production_start": 2012,"production_end": 2020},
                {"name": "8Y", "production_start": 2020,"production_end": None},
            ],
            "A3 Sportback":[
                {"name": "8P", "production_start": 2003,"production_end": 2012},
                {"name": "8V", "production_start": 2012,"production_end": 2020},
                {"name": "8Y", "production_start": 2020,"production_end": None},
            ],
            "A4":[
                {"name": "B5", "production_start": 1995,"production_end": 2001},
                {"name": "B6", "production_start": 2000,"production_end": 2004},
                {"name": "B7", "production_start": 2004,"production_end": 2007},
                {"name": "B8", "production_start": 2007,"production_end": 2015},
                {"name": "B9", "production_start": 2025,"production_end": None},
            ],
            "A4 Allroad":[
                {"name": "B8", "production_start": 2007,"production_end": 2015},
                {"name": "B9", "production_start": 2025,"production_end": None},
            ],
            "A4 Avant":[
                {"name": "B5", "production_start": 1995,"production_end": 2001},
                {"name": "B6", "production_start": 2000,"production_end": 2004},
                {"name": "B7", "production_start": 2004,"production_end": 2007},
                {"name": "B8", "production_start": 2007,"production_end": 2015},
                {"name": "B9", "production_start": 2025,"production_end": None},
            ],
            "A4 Cabrio":[
                {"name": "B6", "production_start": 2000,"production_end": 2004},
                {"name": "B7", "production_start": 2004,"production_end": 2007},
                {"name": "B8", "production_start": 2007,"production_end": 2015},
                {"name": "B9", "production_start": 2025,"production_end": None},
            ],
            "A4 Limousine":[
                {"name": "B5", "production_start": 1995,"production_end": 2001},
                {"name": "B6", "production_start": 2000,"production_end": 2004},
                {"name": "B7", "production_start": 2004,"production_end": 2007},
                {"name": "B8", "production_start": 2007,"production_end": 2015},
                {"name": "B9", "production_start": 2025,"production_end": None},
            ],
            "A5":[
                {"name": "8T", "production_start": 2007,"production_end": 2016},
                {"name": "B10", "production_start": 2024,"production_end": None},
                {"name": "F5", "production_start": 2016,"production_end": 2024},
            ],
            "A5 Avant":[
                {"name": "B10", "production_start": 2024,"production_end": None},
            ],
            "A5 Cabrio":[
                {"name": "8T", "production_start": 2007,"production_end": 2016},
                {"name": "F5", "production_start": 2016,"production_end": 2024},
            ],
            "A5 Coupe":[
                {"name": "8T", "production_start": 2007,"production_end": 2016},
                {"name": "F5", "production_start": 2016,"production_end": 2024},
            ],
            "A5 Limousine":[
                {"name": "B10", "production_start": 2024,"production_end": None},
            ],
            "A5 Sportback":[
                {"name": "8T", "production_start": 2007,"production_end": 2016},
                {"name": "F5", "production_start": 2016,"production_end": 2024},
            ],
            "A6":[
                {"name": "C4", "production_start": 1994,"production_end": 1997},
                {"name": "C5", "production_start": 1997,"production_end": 2004},
                {"name": "C6", "production_start": 2004,"production_end": 2011},
                {"name": "C7", "production_start": 2011,"production_end": 2018},
                {"name": "C8", "production_start": 2018,"production_end": 2025},
                {"name": "C9", "production_start": 2025,"production_end": None},
            ],
            "A6 Allroad":[
                {"name": "C4", "production_start": 1994,"production_end": 1997},
                {"name": "C5", "production_start": 1997,"production_end": 2004},
                {"name": "C6", "production_start": 2004,"production_end": 2011},
                {"name": "C7", "production_start": 2011,"production_end": 2018},
                {"name": "C8", "production_start": 2018,"production_end": 2025},
                {"name": "C9", "production_start": 2025,"production_end": None},
            ],
            "A6 Avant":[
                {"name": "C4", "production_start": 1994,"production_end": 1997},
                {"name": "C5", "production_start": 1997,"production_end": 2004},
                {"name": "C6", "production_start": 2004,"production_end": 2011},
                {"name": "C7", "production_start": 2011,"production_end": 2018},
                {"name": "C8", "production_start": 2018,"production_end": 2025},
                {"name": "C9", "production_start": 2025,"production_end": None},
            ],
            "A6 Avant e-tron": [],
            "A6 Limousine":[
                {"name": "C4", "production_start": 1994,"production_end": 1997},
                {"name": "C5", "production_start": 1997,"production_end": 2004},
                {"name": "C6", "production_start": 2004,"production_end": 2011},
                {"name": "C7", "production_start": 2011,"production_end": 2018},
                {"name": "C8", "production_start": 2018,"production_end": 2025},
                {"name": "C9", "production_start": 2025,"production_end": None},
            ],
            "A6 Sportback e-tron": [],
            "A7 Sportback":[
                {"name": "C7", "production_start": 2011,"production_end": 2018},
                {"name": "C8", "production_start": 2018,"production_end": 2025},
            ],
            "A8":[
                {"name": "D2", "production_start": 1994,"production_end": 2002},
                {"name": "D3", "production_start": 2002,"production_end": 2010},
                {"name": "D4", "production_start": 2010,"production_end": 2017},
                {"name": "D5", "production_start": 2017,"production_end": None},
            ],
            "e-tron": [],
            "e-tron GT": [],
            "Q2": [],
            "Q3":[
                {"name": "I", "production_start": 2011,"production_end": 2018},
                {"name": "II", "production_start": 2018,"production_end": 2025},
                {"name": "III", "production_start": 2025,"production_end": None},
            ],
            "Q3 Sportback":[
                {"name": "I", "production_start": 2019,"production_end": 2025},
                {"name": "II", "production_start": 2025,"production_end": None},
            ],
            "Q4 e-tron": [],
            "Q4 Sportback e-tron": [],
            "Q5":[
                {"name": "8R", "production_start": 2008,"production_end": 2016},
                {"name": "FY", "production_start": 2017,"production_end": 2024},
                {"name": "F5", "production_start": 2024,"production_end": None},
            ],
            "Q5 Sportback":[
                {"name": "I", "production_start": 2020,"production_end": 2025},
                {"name": "II", "production_start": 2025,"production_end": None},
            ],
            "Q6 e-tron": [],
            "Q6 Sportback e-tron": [],
            "Q7":[
                {"name": "I", "production_start": 2005,"production_end": 2015},
                {"name": "II", "production_start": 2015,"production_end": None},
            ],
            "Q8": [],
            "Q8 e-tron": [],
            "Q8 Sportback e-tron": [],
            "R8 Coupe":[
                {"name": "I", "production_start": 2005,"production_end": 2015},
                {"name": "II", "production_start": 2015,"production_end": None},
            ],
            "R8 Spyder":[
                {"name": "I", "production_start": 2005,"production_end": 2015},
                {"name": "II", "production_start": 2015,"production_end": None},
            ],
            "RS e-tron GT": [],
            "RS Q3": [],
            "RS Q3 Sportback": [],
            "RS Q8": [],
            "RS3 Limousine": [],
            "RS3 Sportback": [],
            "RS4 Avant": [],
            "RS4 Limousine": [],
            "RS5 Coupe": [],
            "RS5 Sportback": [],
            "RS6":[
                {"name": "C5", "production_start": 1997,"production_end": 2004},
                {"name": "C6", "production_start": 2004,"production_end": 2011},
                {"name": "C7", "production_start": 2011,"production_end": 2018},
                {"name": "C8", "production_start": 2018,"production_end": 2025},
            ],
            "RS6 Avant":[
                {"name": "C5", "production_start": 1997,"production_end": 2004},
                {"name": "C6", "production_start": 2004,"production_end": 2011},
                {"name": "C7", "production_start": 2011,"production_end": 2018},
                {"name": "C8", "production_start": 2018,"production_end": 2025},
            ],
            "RS7 Sportback":[
                {"name": "4G8", "production_start": 2010,"production_end": 2018},
                {"name": "4K8", "production_start": 2018,"production_end": None},
            ],
            "S1": [],
            "S1 Sportback": [],
            "S2": [],
            "S3":[
                {"name": "8L", "production_start": 1996,"production_end": 2003},
                {"name": "8P", "production_start": 2003,"production_end": 2012},
                {"name": "8V", "production_start": 2012,"production_end": 2020},
                {"name": "8Y", "production_start": 2020,"production_end": None},
            ],
            "S3 Limousine": [],
            "S3 Sportback": [],
            "S4 Avant": [],
            "S4 Limousine":[
                {"name": "B5", "production_start": 1995,"production_end": 2001},
                {"name": "B6", "production_start": 2000,"production_end": 2004},
                {"name": "B7", "production_start": 2004,"production_end": 2007},
                {"name": "B8", "production_start": 2007,"production_end": 2015},
                {"name": "B9", "production_start": 2025,"production_end": None},
            ],
            "S5 Avant": [],
            "S5 Cabrio": [],
            "S5 Coupe": [],
            "S5 Limousine": [],
            "S5 Sportback": [],
            "S6 Avant":[
                {"name": "C4", "production_start": 1994,"production_end": 1997},
                {"name": "C5", "production_start": 1997,"production_end": 2004},
                {"name": "C6", "production_start": 2004,"production_end": 2011},
                {"name": "C7", "production_start": 2011,"production_end": 2018},
                {"name": "C8", "production_start": 2018,"production_end": 2025},
            ],
            "S6 Limousine":[
                {"name": "C4", "production_start": 1994,"production_end": 1997},
                {"name": "C5", "production_start": 1997,"production_end": 2004},
                {"name": "C6", "production_start": 2004,"production_end": 2011},
                {"name": "C7", "production_start": 2011,"production_end": 2018},
                {"name": "C8", "production_start": 2018,"production_end": 2025},
            ],
            "S7 Sportback":[
                {"name": "C7", "production_start": 2011,"production_end": 2018},
                {"name": "C8", "production_start": 2018,"production_end": 2025},
            ],
            "S8":[
                {"name": "D2", "production_start": 1994,"production_end": 2002},
                {"name": "D3", "production_start": 2002,"production_end": 2010},
                {"name": "D4", "production_start": 2010,"production_end": 2017},
                {"name": "D5", "production_start": 2017,"production_end": None},
            ],
            "SQ5": [],
            "SQ5 Sportback": [],
            "SQ7": [],
            "SQ8": [],
            "TT Coupe":[
                {"name": "8N", "production_start": 1998,"production_end": 2006},
                {"name": "8J", "production_start": 2006,"production_end": 2013},
                {"name": "8S", "production_start": 2014,"production_end": None},
            ],
            "TT Roadster":[
                {"name": "8N", "production_start": 1998,"production_end": 2006},
                {"name": "8J", "production_start": 2006,"production_end": 2013},
                {"name": "8S", "production_start": 2014,"production_end": None},
            ],
            "TT RS Coupe":[
                {"name": "8N", "production_start": 1998,"production_end": 2006},
                {"name": "8J", "production_start": 2006,"production_end": 2013},
                {"name": "8S", "production_start": 2014,"production_end": None},
            ],
            "TT RS Roadster":[
                {"name": "8N", "production_start": 1998,"production_end": 2006},
                {"name": "8J", "production_start": 2006,"production_end": 2013},
                {"name": "8S", "production_start": 2014,"production_end": None},
            ],
            "TT S Coupe":[
                {"name": "8N", "production_start": 1998,"production_end": 2006},
                {"name": "8J", "production_start": 2006,"production_end": 2013},
                {"name": "8S", "production_start": 2014,"production_end": None},
            ],
        },

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
        try:
            make_obj, created_make = VehicleMake.objects.get_or_create(name=make_name)
            if created_make:
                print(f"Utworzono markę: {make_name}")
            for model_name, gens in models.items():
                model_obj, created_model = VehicleModel.objects.get_or_create(make=make_obj, name=model_name)
                if created_model:
                    print(f"  Utworzono model: {make_name} {model_name}")
                for gen_data in gens:
                    try:
                        gen_name = gen_data.get("name")
                        start = gen_data.get("production_start")
                        end = gen_data.get("production_end")
                        generation_obj, created_gen = VehicleGeneration.objects.get_or_create(
                            model=model_obj,
                            name=gen_name,
                            defaults={
                                "production_start": start,
                                "production_end": end
                            }
                        )
                        if created_gen:
                            print(f"    Utworzono generację: {make_name} {model_name} {gen_name} ({start}–{end})")
                    except Exception as e:
                        print(f"    ❌ Błąd przy generacji {make_name} {model_name}: {e}")
        except Exception as e:
            print(f"❌ Błąd przy marce {make_name}: {e}")


if __name__ == "__main__":
    load_vehicle_data()
