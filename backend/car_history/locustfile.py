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

class CarHistoryUser(HttpUser):
    wait_time = between(1, 3)
    token = None
    token_expiry = 0
    discussions_cache = []
    created_categories = set()
    host = "http://localhost:8000"

    def on_start(self):
        """Rejestracja i logowanie użytkownika przy starcie"""
        self.login_user()
        self.comments_count = defaultdict(int)
        self.created_categories = set()

    def login_user(self):
        """Rejestracja/logowanie użytkownika i ustawienie tokenu"""
        rand_suffix = str(random.randint(1000, 9999))
        email = f"user_{rand_suffix}@example.com"
        username = f"user_{rand_suffix}"
        phone_number = "+48123" + "".join([str(random.randint(0, 9)) for _ in range(6)])
        password = "testpassword"

        self.client.post("/api/send-verification-code/", json={"email": email})
        verification_code = "123456"

        self.client.post("/api/register/", json={
            "username": username,
            "email": email,
            "phone_number": phone_number,
            "password": password,
            "password2": password,
            "verification_code": verification_code
        })

        response = self.client.post("/api/login/", json={"username": username, "password": password})
        if response.status_code == 200:
            self.token = response.json()["access"]
            self.client.headers.update({"Authorization": f"Bearer {self.token}"})
            self.token_expiry = time.time() + 20 * 60
            print("✅ Logged in")
        else:
            print("❌ LOGIN FAILED:", response.text)
            self.token = None


    def ensure_token_valid(self):
        """Sprawdza, czy token wygasł, jeśli tak – logowanie ponownie"""
        if not self.token or time.time() >= self.token_expiry:
            print("⏳ Token wygasł – ponowne logowanie")
            self.login_user()

    def refresh_discussions(self):
        """Pobiera aktualną listę dyskusji z API"""
        self.ensure_token_valid()
        response = self.client.get("/api/discussions/")
        if response.status_code == 200:
            self.discussions_cache = [d["id"] for d in response.json().get("results", [])]
        elif response.status_code == 401:
            self.login_user()
        else:
            print(f"❌ Failed to refresh discussions: {response.status_code}, {response.text}")


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

    

    

"""

    @task
    def some_task(self):
        # przykładowy endpoint testowy
        self.client.get("/api/profile/")

    @task()
    def list_discussions(self):
        self.client.get("/api/discussions/")

    @task(1)
        def logout(self):
            if self.token:
                self.client.headers.pop("Authorization", None)
                self.token = None
                print("🔒 User logged out")
    @task
    def refresh_token(self):
        if self.token:
            self.client.post("/token/refresh/", json={"refresh": self.token})

    @task
    def check_auth(self):
        self.client.get("/auth/check/")

    @task
    def profile(self):
        self.client.get("/profile/")

    @task
    def list_users(self):
        self.client.get("/users/")


    

    @task
    def discussion_detail(self):
        self.client.get(f"/discussions/{random_id()}/")

    @task
    def vote_discussion(self):
        self.client.post(f"/discussions/{random_id()}/vote/", json={"vote": "up"})

    @task
    def favorite_discussion(self):
        self.client.post(f"/discussions/{random_id()}/favorite/")

    @task
    def discussion_comments(self):
        self.client.get(f"/discussions/{random_id()}/comments/")

    @task
    def close_discussion(self):
        self.client.post(f"/discussions/{random_id()}/close/")

  
    @task
    def vote_comment(self):
        self.client.post(f"/comments/{random_id()}/vote/", json={"vote": "up"})

  
    @task
    def list_messages(self):
        self.client.get("/messages/")

    @task
    def unread_messages(self):
        self.client.get("/messages/unread-count/")

    @task
    def conversation(self):
        self.client.get(f"/messages/conversation/{random_id()}/")

    @task
    def mark_as_read(self):
        self.client.post(f"/messages/{random_id()}/mark-read/")

 
    @task
    def create_vehicle(self):
        vin = random_vin()
        self.client.post("/vehicles/create/", json={
            "vin": vin,
            "make": "Test",
            "model": "Model",
            "year": 2020
        })

    @task
    def list_vehicles(self):
        self.client.get("/vehicles/")

    @task
    def my_vehicles(self):
        self.client.get("/vehicles/my-vehicles/")

    @task
    def vehicles_for_sale(self):
        self.client.get("/vehicles/for-sale/")

    @task
    def vehicle_detail(self):
        vin = random_vin()
        self.client.get(f"/vehicles/{vin}/")

    @task
    def vehicle_history_pdf(self):
        vin = random_vin()
        self.client.get(f"/vehicles/{vin}/history/pdf/")

    @task
    def delete_vehicle(self):
        vin = random_vin()
        self.client.delete(f"/vehicles/{vin}/delete/")

    @task
    def vehicle_images(self):
        vin = random_vin()
        self.client.get(f"/vehicles/{vin}/images/")

    @task
    def vehicle_history(self):
        vin = random_vin()
        self.client.get(f"/vehicle-history/{vin}/")

    @task
    def makes(self):
        self.client.get("/makes/")

    @task
    def models(self):
        self.client.get("/models/")

    @task
    def generations(self):
        self.client.get("/generations/")

  
    @task
    def service_entry(self):
        self.client.get(f"/service-entry/{random_vin()}/")

    @task
    def service_entry_detail(self):
        self.client.get(f"/service-entry/{random_vin()}/{random_id()}/")

    
    @task
    def damage_entry(self):
        self.client.get(f"/damage-entry/{random_vin()}/")

    @task
    def damage_entry_detail(self):
        self.client.get(f"/damage-entry/{random_vin()}/{random_id()}/")


    @task
    def sales(self):
        self.client.get("/sales/")

    @task
    def sale_detail(self):
        self.client.get(f"/sales/{random_id()}/")


    @task
    def automotive_news(self):
        self.client.get("/automotive-news/")"""
