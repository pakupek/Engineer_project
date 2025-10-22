from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import ValidationError
from django.utils import timezone
from .utils import vehicle_image_path
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from datetime import datetime, timedelta
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class User(AbstractUser):
    """ Model użytkownika systemu """
    
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    joined_date = models.DateField(auto_now_add=True,null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username}"
    

class Discussion(models.Model):
    """ Model dyskusji na forum """
    CATEGORY_CHOICES = [
        ('OGOLNE', 'Ogólne'),
        ('TECHNICZNE', 'Techniczne pytania'),
        ('PORADY', 'Porady mechaniczne'),
        ('RECENZJE', 'Recenzje samochodów'),
        ('TUNING', 'Tuning'),
        ('ELEKTRO', 'Elektromobilność'),
        ('HISTORIA', 'Motoryzacja historyczna'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OGOLNE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Comment(models.Model):
    """ Model komentarza do dyskusji na forum """
    discussion = models.ForeignKey(Discussion, related_name="comments", on_delete=models.CASCADE)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class VehicleMake(models.Model):
    """Marka pojazdu (np. Toyota, BMW, Audi)."""

    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Marka"
        verbose_name_plural = "Marki"

    def __str__(self):
        return self.name


class VehicleModel(models.Model):
    """Model pojazdu (np. Corolla, A4, 3 Series)."""

    make = models.ForeignKey(VehicleMake, on_delete=models.CASCADE, related_name="models")
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('make', 'name')
        verbose_name = "Model"
        verbose_name_plural = "Modele"

    def __str__(self):
        return f"{self.make.name} {self.name}"


class VehicleGeneration(models.Model):
    """Generacja modelu (np. Golf VII, Corolla E210)."""

    model = models.ForeignKey(VehicleModel, on_delete=models.CASCADE, related_name="generations")
    name = models.CharField(max_length=50) 
    production_start = models.PositiveIntegerField(null=True, blank=True)
    production_end = models.PositiveIntegerField(null=True, blank=True)    

    class Meta:
        unique_together = ('model', 'name')
        verbose_name = "Generacja"
        verbose_name_plural = "Generacje"

    def __str__(self):
        years = []
        if self.production_start:
            years.append(str(self.production_start))
        if self.production_end:
            years.append(str(self.production_end))
        year_range = "–".join(years) if years else "?"
        return f"{self.model.make.name} {self.model.name} {self.name} ({year_range})"

    
class Vehicle(models.Model):
    """Pojazd użytkownika."""

    BODY_COLOR_CHOICES = [
        ('Czarny', 'Czarny'),
        ('Biały', 'Biały'),
        ('Srebrny', 'Srebrny'),
        ('Szary', 'Szary'),
        ('Czerwony', 'Czerwony'),
        ('Niebieski', 'Niebieski'),
        ('Zielony', 'Zielony'),
        ('Beżowy', 'Beżowy'),
        ('Żółty', 'Żółty'),
        ('Inny', 'Inny'),
    ]

    INTERIOR_COLOR_CHOICES = [
        ('Czarny', 'Czarny'),
        ('Beżowy', 'Beżowy'),
        ('Szary', 'Szary'),
        ('Brązowy', 'Brązowy'),
        ('Biały', 'Biały'),
        ('Czerwony', 'Czerwony'),
        ('Inny', 'Inny'),
    ]

    WHEEL_SIZE_CHOICES = [
        ('15"', '15"'),
        ('16"', '16"'),
        ('17"', '17"'),
        ('18"', '18"'),
        ('19"', '19"'),
        ('20"', '20"'),
        ('21"', '21"'),
        ('22"', '22"'),
    ]

    generation = models.ForeignKey(VehicleGeneration, on_delete=models.CASCADE, related_name='vehicles', null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    vin = models.CharField(max_length=17, unique=True, primary_key=True, verbose_name='VIN')
    production_year = models.PositiveIntegerField(null=True,blank=True,verbose_name="Rok produkcji")
    odometer = models.PositiveIntegerField(verbose_name='Przebieg (km)')
    body_color = models.CharField(default='Biały', choices=BODY_COLOR_CHOICES, verbose_name='Kolor nadwozia')
    interior_color = models.CharField(default='Czarny', choices=INTERIOR_COLOR_CHOICES, verbose_name='Kolor wnętrza')
    price = models.DecimalField(max_digits=8, default=0.0, decimal_places=2, editable=True, verbose_name='Cena (PLN)')
    first_registration = models.DateField(default=timezone.now, blank=True, null=True, verbose_name='Data pierwszej rejestracji')
    location = models.CharField(default='', max_length=100, verbose_name='Lokalizacja')
    wheel_size = models.CharField(default='', max_length=10, choices=WHEEL_SIZE_CHOICES, verbose_name='Rozmiar felg')
    for_sale = models.BooleanField(default=False, verbose_name='Na sprzedaż')
    registration = models.CharField(default='', verbose_name='Nr rejestracyjny')

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Pojazd'
        verbose_name_plural = 'Pojazdy'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.generation.model.make.name} {self.generation.model.name} {self.generation.name} ({self.vin})"

    def age(self):
        from datetime import date
        if self.first_registration:
            return date.today().year - self.first_registration.year
        return None

    def save(self, *args, **kwargs):
        if len(self.vin) != 17:
            raise ValidationError("VIN musi mieć 17 znaków")
        super().save(*args, **kwargs)

class VehicleImage(models.Model):
    """Obraz powiązany z pojazdem."""

    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, related_name='images', verbose_name='Pojazd'
    )
    image = models.ImageField(upload_to=vehicle_image_path, verbose_name='Zdjęcie')
    uploaded_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = 'Zdjęcie pojazdu'
        verbose_name_plural = 'Zdjęcia pojazdów'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"Zdjęcie pojazdu {self.vehicle.vin}"
    
class VehicleHistory:
    def __init__(self, rejestracja, vin, rocznik, options=[]):
        self.registration_plate = rejestracja
        self.vin = vin
        self.production_date = rocznik

        self.url = 'https://historiapojazdu.gov.pl/'
		
        chrome_options = Options()

        for option in options:
            chrome_options.add_argument(option)

        self.driver = webdriver.Remote(
            command_executor="http://selenium:4444/wd/hub",
            options=chrome_options
        )

    def closeBrowser(self):
        if self.driver:
            self.driver.quit()

    def search(self):
        try:
            # Data produkcji
            date_obj = datetime.strptime(str(self.production_date), "%d%m%Y")
            target_year = date_obj.year
                    
            date_str = date_obj.strftime("%d%m%Y")
            print(f"Trying date: {date_str}")
            print(f"Rejestracja: {self.registration_plate}\tVIN: {self.vin}\t Data: {self.production_date}\n")
                
            self.driver.get(self.url)

            wait = WebDriverWait(self.driver, 10)

                # Wait for registration field
            rejestracja_field = wait.until(
                EC.presence_of_element_located((By.ID, "registrationNumber"))
            )
            rejestracja_field.clear()
            rejestracja_field.send_keys(self.registration_plate)

            vin_field = wait.until(
                EC.presence_of_element_located((By.ID, "VINNumber"))
            )
            vin_field.clear()
            vin_field.send_keys(self.vin)

            data_rejestracji = wait.until(
                EC.presence_of_element_located((By.ID, "firstRegistrationDate"))
            )
            data_rejestracji.clear()
            data_rejestracji.send_keys(Keys.HOME)
            data_rejestracji.send_keys(date_str)

            submit = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button.nforms-button"))
            )

            submit.click()

                # Wait for page to process
            time.sleep(3)

                # Check for error messages first
            try:
                error_message = self.driver.find_elements(By.CSS_SELECTOR, ".error-message, .alert-danger")
                if error_message:
                    print(f"Error found for date {date_str}, trying next date")
                    
            except:
                pass

                # Look for Timeline tab
            try:
                timeline_tab = wait.until(
                    EC.element_to_be_clickable(
                        (By.XPATH, "//div[@role='tab' and contains(., 'Oś czasu')]")
                    )
                )
                timeline_tab.click()  
                time.sleep(2)
                print(f"✅ Found and clicked 'Oś czasu' for date {date_str}")
            except Exception as e:
                print(f"❌ Could not find or click 'Oś czasu' for date {date_str}: {str(e)}")
              
                # Get timeline data
            try:
                timeline_container = wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "app-axis ul"))
                )
                timeline_html = timeline_container.get_attribute("outerHTML")
                    
                print(f"Successfully retrieved timeline for date: {date_str}")
                return {
                    "data_rejestracji": date_str,
                    "timeline_html": timeline_html,
                }
            except Exception as e:
                print(f"Could not get timeline content for date {date_str}: {str(e)}")
                
        except Exception as e:
            print(f"Could not scrape for timeline {date_str}: {str(e)}")
            return False

    
class Message(models.Model):
    """ Wiadomości między użytkownikami """
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False) 

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Wiadomość od {self.sender} do {self.receiver}"
