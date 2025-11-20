from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from ...models import VehicleMake, VehicleModel, VehicleGeneration, Vehicle, VehicleImage
from django.utils.timezone import localdate
from PIL import Image
from io import BytesIO
import os

User = get_user_model()

class VehicleCreationTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password="password123",
            phone_number="123456789"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.make = VehicleMake.objects.create(name="Ford")
        self.model = VehicleModel.objects.create(make=self.make, name="Focus")
        self.generation = VehicleGeneration.objects.create(
            model=self.model,
            name="MK3",
            production_start=2011,
            production_end=2018
        )

    def generate_test_image(self, index):
        img_io = BytesIO()
        image = Image.new("RGB", (100, 100), color=(255, 0, 0))
        image.save(img_io, format='JPEG', quality=95)
        img_io.seek(0)

        return SimpleUploadedFile(
            f"test_{index}.jpg",
            img_io.read(),
            content_type="image/jpeg"
        )

    def test_vehicle_image_limit_working_approach(self):
        """
        Test który DZIAŁA - dodawanie zdjęć pojedynczo i sprawdzenie limitu
        """
        # 1. Tworzymy pojazd
        vehicle_payload = {
            "vin": "1HGBH41JXMN109186",  # 17 znaków
            "generation": self.generation.id,
            "production_year": 2016,
            "odometer": 150000,
            "body_color": "Czarny",
            "interior_color": "Czarny",
            "price": "25000.00",
            "location": "Warszawa",
            "drive_type": "FWD",
            "transmission_type": "Manualna",
            "for_sale": False,
            "registration": "WW12345",
            "fuel_type": "Benzyna",
            "first_registration": localdate().strftime('%Y-%m-%d'),
        }

        create_vehicle_url = reverse('create_car')
        response = self.client.post(create_vehicle_url, data=vehicle_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        vin = vehicle_payload["vin"]
        vehicle = Vehicle.objects.get(vin=vin)
        images_url = reverse('vehicle_images', kwargs={"vin": vin})

        # 2. Dodajemy 30 zdjęć pojedynczo
        for i in range(30):
            image = self.generate_test_image(i)
            
            response = self.client.post(
                images_url,
                data={'images': image},  
                format='multipart'
            )
            
            self.assertEqual(
                response.status_code, 
                status.HTTP_201_CREATED,
                f"Zdjęcie {i+1} powinno zostać zapisane. Błąd: {response.data}"
            )

        # 3. Sprawdzamy czy zapisano 30 zdjęć
        saved_count = VehicleImage.objects.filter(vehicle=vehicle).count()
        self.assertEqual(saved_count, 30, f"Powinno być 30 zdjęć, a jest {saved_count}")

        # 4. Próbujemy dodać 31. zdjęcie - powinno się nie udać
        extra_image = self.generate_test_image(31)
        response = self.client.post(
            images_url,
            data={'images': extra_image},
            format='multipart'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("limit", str(response.data).lower())

        print("✓ Test limitu 30 zdjęć przeszedł pomyślnie")