from django.core.management.base import BaseCommand
from car_history.models import VehicleMake, VehicleModel, VehicleGeneration
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Skrypt który dodaje do bazy danych marki i modele pojazdów"


    def handle(self, *args, **kwargs):
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
            "BAIC":{
                "3":[],
                "5":[],
                "7":[],
                "BJ20":[],
                "BJ30":[],
                "BJ40":[],
                "BJ60":[],
                "Senova X25":[],
                "Senova X35":[],
                "Senova X55":[],
                "Senova X65":[],
                "X75":[],
            },

            "BAW":{
                "Pony":[],
            },

            "Bentley":{
                "Arnage":[],
                "Azure":[],
                "Bentayga":[],
                "Continental GT":[],
                "Flying Spur":[],
                "Mulsanne":[],
            },

            "Bestune":{
                "B70":[],
                "T77":[],
                "T90":[],
            },

            "BMW": {
                "1M":[],
                "3 GT":[
                    {"name": "F34", "production_start": 2013, "production_end": 2021}
                ],
                "5 GT":[],
                "6 GT":[],
                "i3":[],
                "i4":[],
                "i5":[],
                "i7":[],
                "i8":[],
                "iX":[],
                "iX1":[],
                "iX2":[],
                "iX3":[],
                "M2":[],
                "M3":[],
                "M4":[],
                "M5":[],
                "M6":[],
                "M8":[],
                "Seria 1":[
                    {"name": "E81/E87", "production_start": 2004, "production_end": 2013},
                    {"name": "F20/F21", "production_start": 2011, "production_end": 2019},
                    {"name": "F40", "production_start": 2019, "production_end": None},
                    {"name": "F70", "production_start": 2024, "production_end": None},
                ],
                "Seria 2":[],
                "Seria 3": [
                    {"name": "E21", "production_start": 1975, "production_end": 1982},
                    {"name": "E30", "production_start": 1982, "production_end": 1994},
                    {"name": "E36", "production_start": 1990, "production_end": 1999},
                    {"name": "E46", "production_start": 1998, "production_end": 2007},
                    {"name": "E90/E91/E92/E93", "production_start": 2005, "production_end": 2012},
                    {"name": "F30/F31", "production_start": 2012, "production_end": 2020},
                    {"name": "G20/G21", "production_start": 2019, "production_end": None},
                ],
                "Seria 4":[
                    {"name": "F32/F33/F82", "production_start": 2015, "production_end": 2019},
                    {"name": "G22/G23/G82", "production_start": 2020, "production_end": None},
                ],
                "Seria 5":[
                    {"name": "E12", "production_start": 1972, "production_end": 1981},
                    {"name": "E28", "production_start": 1981, "production_end": 1987},
                    {"name": "E34", "production_start": 1988, "production_end": 1996},
                    {"name": "E39", "production_start": 1996, "production_end": 2003},
                    {"name": "E60/E61", "production_start": 2003, "production_end": 2010},
                    {"name": "F10/F11", "production_start": 2009, "production_end": 2017},
                    {"name": "G30/G31", "production_start": 2017, "production_end": 2023},
                    {"name": "G60", "production_start": 2023, "production_end": None},
                ],
                "Seria 6":[
                    {"name": "E24", "production_start": 1976, "production_end": 1989},
                    {"name": "E63/E64", "production_start": 2002, "production_end": 2010},
                    {"name": "F12/F13/F14", "production_start": 2011, "production_end": 2017},
                    {"name": "G32", "production_start": 2017, "production_end": None},
                ],
                "Seria 7":[
                    {"name": "E23", "production_start": 1977, "production_end": 1986},
                    {"name": "E32", "production_start": 1986, "production_end": 1994},
                    {"name": "E38", "production_start": 1994, "production_end": 2001},
                    {"name": "E65/E66", "production_start": 2001, "production_end": 2008},
                    {"name": "F01", "production_start": 2008, "production_end": 2015},
                    {"name": "G11/G12", "production_start": 2015, "production_end": 2022},
                    {"name": "G70", "production_start": 2022, "production_end": None},
                ],
                "Seria 8":[
                    {"name": "E31", "production_start": 1989, "production_end": 1999},
                    {"name": "G14/G15/G16", "production_start": 2018, "production_end": None},
                ],
                "X1":[
                    {"name": "E84", "production_start": 2009, "production_end": 2015},
                    {"name": "F48", "production_start": 2015, "production_end": 2022},
                    {"name": "U11", "production_start": 2022, "production_end": None},
                ],
                "X2":[
                    {"name": "F39", "production_start": 2017, "production_end": 2023},
                    {"name": "U10", "production_start": 2023, "production_end": None},
                ],
                "X3":[
                    {"name": "E83", "production_start": 2003, "production_end": 2010},
                    {"name": "F25", "production_start": 2010, "production_end": 2017},
                    {"name": "G01", "production_start": 2017, "production_end": 2024},
                    {"name": "G45", "production_start": 2024, "production_end": None},
                ],
                "X3 M":[
                    {"name": "F97", "production_start": 2017, "production_end": 2024},
                    {"name": "G45", "production_start": 2024, "production_end": None},
                ],
                "X4":[
                    {"name": "E89", "production_start": 2009, "production_end": 2016},
                    {"name": "F26", "production_start": 2014, "production_end": 2018},
                    {"name": "G02", "production_start": 2018, "production_end": None},
                ],
                "X4 M":[
                    {"name": "F83", "production_start": 2014, "production_end": 2018},
                    {"name": "F97", "production_start": 2019, "production_end": None},
                ],
                "X5":[
                    {"name": "E53", "production_start": 1999, "production_end": 2003},
                    {"name": "E70", "production_start": 2006, "production_end": 2013},
                    {"name": "F15", "production_start": 2013, "production_end": 2018},
                    {"name": "G05", "production_start": 2018, "production_end": None},
                ],
                "X5 M":[],
                "X6":[
                    {"name": "E71", "production_start": 2008, "production_end": 2014},
                    {"name": "F16", "production_start": 2014, "production_end": 2019},
                    {"name": "G06", "production_start": 2019, "production_end": None},
                ],
                "X6 M":[],
                "X7":[
                    {"name": "G07", "production_start": 2019, "production_end": None},
                ],
                "XM":[],
                "Z3":[],
                "Z4":[
                    {"name": "E85/E86", "production_start": 2002, "production_end": 2008},
                    {"name": "E89", "production_start": 2009, "production_end": 2016},
                    {"name": "G29", "production_start": 2018, "production_end": None},
                ],
                "Z4 M":[],
            },

            "BYD":{
                "Atto 2":[],
                "Atto 3":[],
                "Dolphin":[],
                "Dolphin Surf":[],
                "Leopard 5":[],
                "Seal":[],
                "Seal 5":[],
                "Seal 6":[],
                "Seal U":[],
                "Sealion 7":[],
            },

            "Chevrolet":{
                "Aveo":[],
                "Camaro":[],
                "Captiva":[],
                "Corvette":[],
                "Cruze":[],
                "Orlando":[],
                "Spark":[],
            },

            "Chrysler":{
                "300C":[],
                "Grand Voyager":[
                    {"name": "I", "production_start": 1990, "production_end": 1995},
                    {"name": "II", "production_start": 1995, "production_end": 2000},
                    {"name": "III", "production_start": 2001, "production_end": 2006},
                    {"name": "IV", "production_start": 2007, "production_end": 2010},
                    {"name": "V", "production_start": 2008, "production_end": 2015},
                ],
                "Pacifica":[],
                "PT Cruiser":[],
                "Town & Country":[
                    {"name": "I", "production_start": 1988, "production_end": 1990},
                    {"name": "II", "production_start": 1991, "production_end": 1995},
                    {"name": "III", "production_start": 1995, "production_end": 2001},
                    {"name": "IV", "production_start": 2001, "production_end": 2007},
                    {"name": "V", "production_start": 2007, "production_end": 2016},
                ],
                "Voyager":[
                    {"name": "I", "production_start": 1984, "production_end": 1990},
                    {"name": "II", "production_start": 1990, "production_end": 1995},
                    {"name": "III", "production_start": 1995, "production_end": 2000},
                    {"name": "IV", "production_start": 2000, "production_end": 2007},
                    {"name": "V", "production_start": 2005, "production_end": 2010},
                ],
            },

            "Citroen":{
                "Berlingo":[
                    {"name": "I", "production_start": 1996, "production_end": 2010},
                    {"name": "II", "production_start": 2008, "production_end": 2018},
                    {"name": "III", "production_start": 2018, "production_end": None},
                ],
                "C-Elysee":[],
                "C1":[
                    {"name": "I", "production_start": 2005, "production_end": 2014},
                    {"name": "II", "production_start": 2014, "production_end": None},
                ],
                "C3":[
                    {"name": "I", "production_start": 2002, "production_end": 2009},
                    {"name": "II", "production_start": 2008, "production_end": 2018},
                    {"name": "III", "production_start": 2016, "production_end": 2024},
                    {"name": "IV", "production_start": 2024, "production_end": None},
                ],
                "C3 Aircross":[],
                "C3 Picasso":[],
                "C4":[
                    {"name": "I", "production_start": 2004, "production_end": 2010},
                    {"name": "II", "production_start": 2010, "production_end": 2020},
                    {"name": "III", "production_start": 2020, "production_end": None},
                ],
                "C4 Aircross":[],
                "C4 Cactus":[],
                "C4 Grand Picasso":[
                    {"name": "I", "production_start": 2006, "production_end": 2013},
                    {"name": "II", "production_start": 2013, "production_end": None},
                ],
                "C4 Picasso":[
                    {"name": "I", "production_start": 2006, "production_end": 2013},
                    {"name": "II", "production_start": 2013, "production_end": None},
                ],
                "C5":[
                    {"name": "I", "production_start": 2001, "production_end": 2004},
                    {"name": "II", "production_start": 2004, "production_end": 2008},
                    {"name": "III", "production_start": 2008, "production_end": None},
                ],
                "C5 Aircross":[],
                "DS3":[],
                "DS4":[],
                "DS5":[],
                "DS7":[],
            },

            "Ford":{
                "Edge":[
                    {"name": "I", "production_start": 2006, "production_end": 2014},
                    {"name": "II", "production_start": 2014, "production_end": 2024},
                    {"name": "III", "production_start": 2023, "production_end": None},
                ],
            },

            "Renault":{
                "Megane":[
                    {"name": "I", "production_start": 1995, "production_end": 2003},
                    {"name": "II", "production_start": 2002, "production_end": 2009},
                    {"name": "III", "production_start": 2008, "production_end": 2016},
                    {"name": "IV", "production_start": 2016, "production_end": 2024},
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
                "Arteon":[],
                "Caddy":[
                    {"name": "I", "production_start": 1983, "production_end": 1993},
                    {"name": "II", "production_start": 1995, "production_end": 2003},
                    {"name": "III", "production_start": 2004, "production_end": 2015},
                    {"name": "IV", "production_start": 2015, "production_end": 2020},
                    {"name": "V", "production_start": 2020, "production_end": None},
                ],
                "Caravelle":[],
                "CC":[],
                "Crafter":[],

                "Golf": [
                    {"name": "I", "production_start": 1974, "production_end": 1983},
                    {"name": "II", "production_start": 1983, "production_end": 1992},
                    {"name": "III", "production_start": 1991, "production_end": 1998},
                    {"name": "IV", "production_start": 1997, "production_end": 2006},
                    {"name": "V", "production_start": 2003, "production_end": 2009},
                    {"name": "VI", "production_start": 2008, "production_end": 2013},
                    {"name": "VII", "production_start": 2012, "production_end": 2020},
                    {"name": "VIII", "production_start": 2020, "production_end": None},
                ],
                "Golf Plus":[
                    {"name": "I", "production_start": 2004, "production_end": 2008},
                    {"name": "II", "production_start": 2008, "production_end": 2012},
                ],
                "Golf Sportsvan":[],
                "ID.Buzz":[],
                "ID.3":[],
                "ID.4":[],
                "ID.5":[],
                "ID.6":[],
                "ID.7":[],
                "Jetta":[
                    {"name": "A1", "production_start": 1980, "production_end": 1984},
                    {"name": "A2", "production_start": 1984, "production_end": 1992},
                    {"name": "A5", "production_start": 2005, "production_end": 2010},
                    {"name": "A6", "production_start": 2010, "production_end": 2018},
                    {"name": "A7", "production_start": 2018, "production_end": None},
                ],
                "Multivan":[],
                "Passat Alltrack":[],
                "Polo":[
                    {"name": "I", "production_start": 1975, "production_end": 1981},
                    {"name": "II", "production_start": 1981, "production_end": 1994},
                    {"name": "III", "production_start": 1994, "production_end": 2001},
                    {"name": "IV", "production_start": 2001, "production_end": 2009},
                    {"name": "V", "production_start": 2009, "production_end": 2017},
                    {"name": "VI", "production_start": 2017, "production_end": None},
                ],
                "Scirocco":[],
                "Sharan":[
                    {"name": "I", "production_start": 1995, "production_end": 2010},
                    {"name": "II", "production_start": 2010, "production_end": None},
                ],
                "T-Cross":[],
                "T-Roc":[
                    {"name": "I", "production_start": 2017, "production_end": 2025},
                    {"name": "II", "production_start": 2025, "production_end": None},
                ],
                "Tiguan":[
                    {"name": "I", "production_start": 2007, "production_end": 2016},
                    {"name": "II", "production_start": 2016, "production_end": 2024},
                    {"name": "III", "production_start": 2024, "production_end": None},
                ],
                "Touareg":[
                    {"name": "I", "production_start": 2002, "production_end": 2010},
                    {"name": "II", "production_start": 2010, "production_end": 2018},
                    {"name": "III", "production_start": 2018, "production_end": None},
                ],
                "Touran":[
                    {"name": "I", "production_start": 2003, "production_end": 2010},
                    {"name": "II", "production_start": 2010, "production_end": 2015},
                    {"name": "III", "production_start": 2015, "production_end": None},
                ],
                "Transporter":[
                    {"name": "T1", "production_start": None, "production_end": None},
                    {"name": "T2", "production_start": None, "production_end": None},
                    {"name": "T3", "production_start": None, "production_end": None},
                    {"name": "T4", "production_start": None, "production_end": None},   # Poszukać jeszcze daty
                    {"name": "T5", "production_start": None, "production_end": None},
                    {"name": "T6", "production_start": None, "production_end": None},
                    {"name": "T7", "production_start": None, "production_end": None},
                ],
                "Passat": [
                    {"name": "B1", "production_start": 1973, "production_end": 1981},
                    {"name": "B2", "production_start": 1981, "production_end": 1987},
                    {"name": "B3", "production_start": 1988, "production_end": 1993},
                    {"name": "B4", "production_start": 1993, "production_end": 1997},
                    {"name": "B5", "production_start": 1996, "production_end": 2000},
                    {"name": "B5 FL", "production_start": 2000, "production_end": 2005},
                    {"name": "B6", "production_start": 2005, "production_end": 2010},
                    {"name": "B7", "production_start": 2010, "production_end": 2014},
                    {"name": "B8", "production_start": 2014, "production_end": 2023},
                    {"name": "B9", "production_start": 2023, "production_end": None},
                ],
                "up!":[],
            },
        }

        for make_name, models in vehicle_data.items():
            try:
                make_name_clean = make_name.strip()
                make_obj, created_make = VehicleMake.objects.get_or_create(name=make_name_clean) 

                for model_name, gens in models.items():
                    model_name_clean = model_name.strip()
                    model_obj, created_model = VehicleModel.objects.get_or_create(
                        make=make_obj,
                        name=model_name_clean
                    )
                    
                    for gen_data in gens:
                        gen_name = gen_data.get("name").strip()
                        start = gen_data.get("production_start")
                        end = gen_data.get("production_end")

                        generation_obj, created_gen = VehicleGeneration.objects.update_or_create(
                            model=model_obj,
                            name=gen_name,
                            defaults={
                                "production_start": start,
                                "production_end": end
                            }
                        )

            except Exception as e:
                logger.error(f"Błąd przy marce {make_name}: {e}")
