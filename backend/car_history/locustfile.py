import datetime
from locust import HttpUser, task, between
import string, io, random, time
from PIL import Image
from collections import defaultdict

def random_vin():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=17))

def random_id():
    return random.randint(1, 10)

def random_phone():
    return "+48123" + "".join([str(random.randint(0, 9)) for _ in range(6)])

CATEGORY_CHOICES = [
    'OGOLNE', 'TECHNICZNE'
]
BODY_COLOR_CHOICES = ['Czarny', 'Biały', 'Srebrny', 'Szary', 'Czerwony', 'Niebieski', 'Zielony', 'Beżowy', 'Żółty']
INTERIOR_COLOR_CHOICES = ['Czarny', 'Beżowy', 'Szary', 'Brązowy', 'Biały', 'Czerwony']
DRIVE_TYPE_CHOICES = ['FWD', 'RWD', 'AWD', '4x4']
TRANSMISSION_CHOICES = ['Manualna', 'Automatyczna', 'Półautomatyczna', 'CVT', 'Dwusprzęgłowa']
FUEL_TYPES = ['Benzyna', 'Diesel', 'Hybryda', 'Elektryczny', 'Benzyna+LPG', 'Benzyna+CNG']
LOCATIONS = ['Warszawa', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk', 'Łódź', 'Katowice', 'Szczecin']

class CarHistoryUser(HttpUser):
    wait_time = between(2, 5)
    token = None
    token_expiry = 0
    discussions_cache = []
    created_categories = set()
    vehicle_created = False
    host = "http://localhost:8000"
    

    def on_start(self):
        """Rejestracja i logowanie użytkownika przy starcie"""
        self.username = ""
        self.password =""
        self.email = ""
        self.phone_number = ""
        self.register_user()
        self.login_user()
        self.comments_count = defaultdict(int)
        self.created_categories = set()

    def register_user(self):
        """Rejestracja nowego użytkownika"""
        rand_suffix = str(random.randint(1000, 9999))
        self.email = f"user_{rand_suffix}@example.com"
        self.username = f"user_{rand_suffix}"
        self.phone_number = "+48123" + "".join([str(random.randint(0, 9)) for _ in range(6)])
        self.password = "testpassword"

        # Wysłanie kodu weryfikacyjnego
        send_code_response = self.client.post("/api/send-verification-code/", json={"email": self.email})
        
        if send_code_response.status_code not in [200, 201]:
            print(f"❌ Failed to send verification code: {send_code_response.text}")
            return False

        verification_code = "123456"

        # Rejestracja
        response = self.client.post("/api/register/", json={
            "username": self.username,
            "email": self.email,
            "phone_number": self.phone_number,
            "password": self.password,
            "password2": self.password,
            "verification_code": verification_code
        })

        if response.status_code == 201:
            print(f"✅ User registered: {self.username}")
            return True
        else:
            print(f"❌ REGISTRATION FAILED: {response.status_code}, {response.text}")
            return False

    def login_user(self):
        """Logowanie użytkownika i ustawienie tokenu"""
        # Sprawdź czy mamy dane do logowania
        if not self.username or not self.password:
            print("❌ No credentials available for login")
            return False

        response = self.client.post("/api/login/", json={
            "username": self.username,
            "password": self.password
        })

        if response.status_code == 200:
            try:
                data = response.json()
                self.token = data["access"]
                self.client.headers.update({"Authorization": f"Bearer {self.token}"})
                self.token_expiry = time.time() + 20 * 60
                print(f"✅ Logged in: {self.username}")
                return True
            except Exception as e:
                print(f"❌ Failed to parse login response: {e}")
                return False
        else:
            print(f"❌ LOGIN FAILED ({response.status_code}): {response.text}")
            # Jeśli logowanie nie powiodło się, spróbuj ponownej rejestracji
            print("🔄 Attempting to re-register user...")
            if self.register_user():
                return self.login_user()
            return False


    def ensure_token_valid(self):
        """Sprawdza, czy token wygasł, jeśli tak – logowanie ponownie"""
        if not self.token or time.time() >= self.token_expiry:
            print("⏳ Token wygasł – ponowne logowanie")
            self.login_user()

    def refresh_discussions(self):
        """Pobiera aktualną listę dyskusji z API — bezpiecznie."""
        self.ensure_token_valid()
        response = self.client.get("/api/discussions/")

        if response.status_code == 401:
            self.login_user()
            return

        try:
            data = response.json()
        except Exception:
            print(f"❌ Invalid JSON from /api/discussions/: {response.text}")
            return

        # --- Obsługa paginacji / results / listy ---
        if isinstance(data, list):
            self.discussions_cache = [d["id"] for d in data if "id" in d]
            return

        if isinstance(data, dict):
            # API paginowane przez DRF (results)
            if "results" in data and isinstance(data["results"], list):
                self.discussions_cache = [d["id"] for d in data["results"] if "id" in d]
                return

            print(f"❌ Unexpected dict response: {data}")
            return

        print(f"❌ Unexpected response type from discussions: {type(data)} -> {data}")



    @task()
    def create_vehicle(self):
        """Tworzenie pojazdu oraz dodawanie zdjęć przez osobny endpoint"""
        if self.vehicle_created:
            return
        self.ensure_token_valid()

        vin = random_vin()
        rand_suffix = str(random.randint(1000, 9999))

        # -----------------------------
        # 1️⃣ Tworzenie pojazdu
        # -----------------------------
        data = {
            "vin": vin,
            "brand": f"Marka{rand_suffix}",
            "model": f"Model{rand_suffix}",
            "odometer": random.randint(5000, 300000),
            "year": random.randint(1995, 2024),
            "mileage": random.randint(5000, 320000),
            "engine_capacity": round(random.uniform(1.0, 5.0), 1),
            "engine_power": random.randint(70, 400),
            "fuel_type": random.choice(FUEL_TYPES),
            "transmission": random.choice(TRANSMISSION_CHOICES),
            "drive_type": random.choice(DRIVE_TYPE_CHOICES),
            "body_color": random.choice(BODY_COLOR_CHOICES),
            "interior_color": random.choice(INTERIOR_COLOR_CHOICES),
            "location": random.choice(LOCATIONS),
            "description": f"Testowy opis pojazdu {rand_suffix}"
        }

        response = self.client.post("/api/vehicles/create/", json=data)

        if response.status_code not in [200, 201]:
            print(f"❌ Failed to create vehicle {vin}: {response.status_code}, {response.text}")
            return

        print(f"🚗 Vehicle created: {vin}")
        self.vehicle_created = True
        # -----------------------------
        # 2️⃣ Dodawanie zdjęć przez /api/vehicle/<vin>/images/
        # -----------------------------
        num_images = random.randint(1, 3)  # min. 1 żeby przetestować endpoint
        files = []

        for i in range(num_images):
            img = Image.new("RGB", (200, 200),
                            color=(random.randint(0, 255),
                                   random.randint(0, 255),
                                   random.randint(0, 255)))
            img_bytes = io.BytesIO()
            img.save(img_bytes, format="JPEG")
            img_bytes.seek(0)

            files.append(("images", (f"car_img_{i}.jpg", img_bytes, "image/jpeg")))

        img_response = self.client.post(
            f"/api/vehicles/{vin}/images/",
            files=files
        )

        if img_response.status_code in [200, 201]:
            print(f"🖼️ Added {num_images} images for vehicle {vin}")
        else:
            print(f"❌ Failed to upload images for {vin}: {img_response.status_code}, {img_response.text}")




    @task()
    def create_discussion_with_images(self):
        self.refresh_discussions()  # odświeżenie bazy przy każdej próbie
        remaining_categories = [c for c in CATEGORY_CHOICES if c not in self.created_categories]
        if not remaining_categories:
            return

        category = random.choice(remaining_categories)
        rand_suffix = str(random.randint(1000, 9999))
        title = f"{category.capitalize()} Discussion {rand_suffix}"
        content = f"Treść testowej dyskusji {rand_suffix} w kategorii {category}"
        num_images = random.randint(0, 3)

        files = []
        for i in range(num_images):
            img = Image.new("RGB", (100, 100),
                            color=(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)))
            img_bytes = io.BytesIO()
            img.save(img_bytes, format="JPEG")
            img_bytes.seek(0)
            files.append(("images", (f"image_{i}.jpg", img_bytes, "image/jpeg")))

        data = {
            "title": title,
            "content": content,
            "category": category
        }

        response = self.client.post("/api/discussions/", data=data, files=files)
        if response.status_code in [200, 201]:
            print(f"✅ Created discussion in category {category}")
            self.created_categories.add(category)
        elif response.status_code == 401:
            self.login_user()
        else:
            print(f"❌ Failed to create discussion: {response.status_code}, {response.text}")

    @task()
    def create_comment(self):
        self.refresh_discussions()  # odświeżenie bazy przy każdej próbie
        if not self.discussions_cache:
            return

        # wybierz dyskusję, w której jeszcze nie dodano komentarza przez tego użytkownika
        available_discussions = [d for d in self.discussions_cache if self.comments_count[d] == 0]
        if not available_discussions:
            return

        discussion_id = random.choice(available_discussions)
        rand_suffix = str(random.randint(1000, 9999))
        content = f"Testowy komentarz {rand_suffix}"

        num_images = random.randint(0, 3)
        files = []
        for i in range(num_images):
            img = Image.new("RGB", (100, 100),
                            color=(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)))
            img_bytes = io.BytesIO()
            img.save(img_bytes, format="JPEG")
            img_bytes.seek(0)
            files.append(("images", (f"comment_img_{i}.jpg", img_bytes, "image/jpeg")))

        response = self.client.post(
            f"/api/discussions/{discussion_id}/comments/",
            data={"content": content, "discussion": discussion_id},
            files=files
        )

        if response.status_code in [200, 201]:
            self.comments_count[discussion_id] = 1
            print(f"✅ Comment created for discussion {discussion_id} ({num_images} images)")
        elif response.status_code == 401:
            self.login_user()
        else:
            print(f"❌ Failed to create comment: {response.status_code}, {response.text}")