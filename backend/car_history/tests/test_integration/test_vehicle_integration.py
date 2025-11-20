from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.timezone import localdate
from PIL import Image
from io import BytesIO
import os, shutil
from django.conf import settings

from car_history.models import (
    Vehicle, VehicleImage,
    VehicleMake, VehicleModel, VehicleGeneration
)

User = get_user_model()

class VehicleIntegrationTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="tester",
            password="password123",
            email="tester@example.com",
            phone_number="123456789"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # dane referencyjne
        self.make = VehicleMake.objects.create(name="Ford")
        self.model = VehicleModel.objects.create(make=self.make, name="Focus")
        self.generation = VehicleGeneration.objects.create(
            model=self.model,
            name="MK3",
            production_start=2011,
            production_end=2018
        )

    def generate_image(self, i):
        img_bytes = BytesIO()
        Image.new("RGB", (5,5), (255,0,0)).save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        return SimpleUploadedFile(f"test_{i}.jpg", img_bytes.read(), content_type="image/jpeg")

    def test_full_vehicle_flow(self):
        """
        Test integracyjny tworzenie pojazdu + dodawanie zdjęć + pobieranie
        """

        # tworzenie pojazdu
        payload = {
            "vin": "WF0AXXWCDA1234567",
            "generation_id": self.generation.id,
            "production_year": 2016,
            "odometer": 180000,
            "body_color": "Czarny",
            "interior_color": "Czarny",
            "price": "25000.00",
            "location": "Warszawa",
            "drive_type": "FWD",
            "transmission_type": "Manualna",
            "for_sale": False,
            "registration": "WW12345",
            "fuel_type": "Benzyna",
            "first_registration": localdate(),
        }

        create_url = reverse("create_car")

        r = self.client.post(create_url, payload, format="json")
        self.assertEqual(r.status_code, 201)

        self.vehicle = Vehicle.objects.get(vin=payload["vin"])

        images_url = reverse('vehicle_images', kwargs={"vin": self.vehicle.vin})
        

        # dodawanie zdjęć
        for i in range(30):
            image = self.generate_image(i)
            
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

        # zachowany limit 30
        saved = VehicleImage.objects.filter(vehicle__vin=payload["vin"]).count()
        self.assertEqual(saved, 30)

        # pobieramy pojazd — integracja z serializerem GET
        detail_url = reverse("vehicle_detail", kwargs={"vin": payload["vin"]})
        r3 = self.client.get(detail_url)

        self.assertEqual(r3.status_code, 200)
        self.assertIn("images", r3.data)
        self.assertEqual(len(r3.data["images"]), 30)

        # Dodatkowe asercje integracyjne:
    
        # Sprawdź czy właściciel jest poprawny
        self.assertEqual(self.vehicle.owner, self.user)
        
        # Sprawdź relacje między modelami
        self.assertEqual(self.vehicle.generation.name, self.generation.name)
        self.assertEqual(self.vehicle.generation.model.name, self.model.name)
        self.assertEqual(self.vehicle.generation.model.make.name, self.make.name)
        
        # Sprawdź strukturę odpowiedzi
        self.assertEqual(r3.data['vin'], payload['vin'])
        self.assertEqual(r3.data['generation']['name'], 'MK3')
        self.assertEqual(r3.data['generation']['model']['name'], 'Focus')
        self.assertEqual(r3.data['generation']['model']['make']['name'], 'Ford')
        
        # Sprawdź czy zdjęcia mają poprawne URL
        for image_data in r3.data['images']:
            self.assertIn('image', image_data)
            self.assertIn('uploaded_at', image_data)
            self.assertTrue(image_data['image'].startswith('http') or image_data['image'].startswith('/media/'))

    def tearDown(self):
        # Usuń wszystkie pliki powiązane z VehicleImage w tym teście
        for image in VehicleImage.objects.all():
            if image.image and os.path.isfile(image.image.path):
                os.remove(image.image.path)

        # Usuń folder pojazdu: media/vehicles/<vin>
        if hasattr(self, 'vehicle'):
            vehicle_dir = os.path.join(settings.MEDIA_ROOT, 'vehicles', self.vehicle.vin)
            if os.path.exists(vehicle_dir):
                shutil.rmtree(vehicle_dir, ignore_errors=True)
        super().tearDown()

