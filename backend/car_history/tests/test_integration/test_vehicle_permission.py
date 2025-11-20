from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from django.utils.timezone import localdate

from car_history.models import Vehicle, VehicleGeneration, VehicleModel, VehicleMake

User = get_user_model()

class VehiclePermissionTest(APITestCase):

    def setUp(self):
        # Tworzymy dwóch użytkowników
        self.owner = User.objects.create_user(
            username="owner",
            password="password123",
            email="owner@example.com",
            phone_number="987654321"
        )
        self.other_user = User.objects.create_user(
            username="intruder",
            password="password123",
            email="intruder@example.com",
            phone_number="123123123"
        )

        # Tworzymy dane referencyjne pojazdu
        self.make = VehicleMake.objects.create(name="Ford")
        self.model = VehicleModel.objects.create(make=self.make, name="Focus")
        self.generation = VehicleGeneration.objects.create(
            model=self.model,
            name="MK3",
            production_start=2011,
            production_end=2018
        )

        # Tworzymy pojazd należący do właściciela
        self.vehicle = Vehicle.objects.create(
            vin="WF0AXXWCDA1234567",
            generation_id=self.generation.id,
            production_year=2016,
            odometer=100000,
            body_color="Czarny",
            interior_color="Czarny",
            price="20000.00",
            location="Warszawa",
            drive_type="FWD",
            transmission_type="Manualna",
            for_sale=True,
            registration="WW12345",
            fuel_type="Benzyna",
            first_registration=localdate(),
            owner=self.owner
        )

        self.client = APIClient()

    def test_other_user_cannot_edit_vehicle(self):
        """
        Test sprawdzający, że inny użytkownik nie może edytować pojazdu
        należącego do kogoś innego.
        1. Logujemy się jako inny użytkownik
        2. Próbujemy zaktualizować dane pojazdu właściciela
        3. Sprawdzamy, że dostęp jest zabroniony (403)  i dane się nie zmieniły
        """
        # Logujemy się jako inny użytkownik
        self.client.force_authenticate(user=self.other_user)

        update_url = reverse("vehicle_detail", kwargs={"vin": self.vehicle.vin})
        payload = {
            "price": "25000.00",
            "body_color": "Czerwony"
        }

        response = self.client.patch(update_url, data=payload, format="json")

        # Sprawdzenie, że dostęp jest zabroniony
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Sprawdzenie, że dane pojazdu nie zmieniły się
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.price, 20000.00)
        self.assertEqual(self.vehicle.body_color, "Czarny")

    def tearDown(self):
        super().tearDown()
    
