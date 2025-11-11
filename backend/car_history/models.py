from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import ValidationError
from django.utils import timezone
from .utils import vehicle_image_path, vehicle_invoice_path, damage_image_path, default_avatar_path, user_avatar_path
import time, logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from datetime import datetime, timedelta
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from django.db.models import Count

logger = logging.getLogger(__name__)


class User(AbstractUser):
    """
    Model użytkownika systemu 
    """
    
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    joined_date = models.DateField(auto_now_add=True,null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    avatar = models.ImageField(
        upload_to=user_avatar_path,
        default=default_avatar_path,
        blank=True,
        null=True,
        verbose_name="Zdjęcie profilowe"
    )
    

    def __str__(self):
        return f"{self.username}"
    

class Discussion(models.Model):
    """
    Model dyskusji na forum 
    """

    CATEGORY_CHOICES = [
        ('OGOLNE', 'Ogólne'),
        ('TECHNICZNE', 'Techniczne pytania'),
        ('PORADY', 'Porady mechaniczne'),
        ('RECENZJE', 'Recenzje samochodów'),
        ('TUNING', 'Tuning'),
        ('ELEKTRO', 'Elektromobilność'),
        ('HISTORIA', 'Motoryzacja historyczna'),
    ]
    
    title = models.CharField(max_length=50)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OGOLNE')
    views = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_activity = models.DateTimeField(default=timezone.now)
    pinned = models.BooleanField(default=False)      
    locked = models.BooleanField(default=False)      

    class Meta:
        ordering = ['-pinned', '-last_activity']

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Sprawdzamy czy to nowy obiekt
        is_new = self.pk is None
        
        # Jeśli to nowa dyskusja, ustawiamy last_activity na teraz
        if is_new:
            self.last_activity = timezone.now()
        
        # Wywołujemy oryginalną metodę save
        super().save(*args, **kwargs)
    

    def update_last_activity(self):
        """Aktualizacja ostatniej aktywności"""
        
        Discussion.objects.filter(pk=self.pk).update(
            last_activity=timezone.now()
        )
        self.refresh_from_db(fields=['last_activity'])

    def update_comment_count(self):
        """Aktualizacja liczby komentarzy"""
        
        count = self.comment_set.aggregate(count=Count('id'))['count']
        Discussion.objects.filter(pk=self.pk).update(comments_count=count)
        self.comments_count = count

    def update_likes_count(self):
        """Aktualizacja liczby polubień"""
        
        count = self.likes.aggregate(count=Count('id'))['count']
        Discussion.objects.filter(pk=self.pk).update(likes_count=count)
        self.likes_count = count

    def increment_views(self):
        """Zwiększanie liczby wyświetleń"""

        Discussion.objects.filter(pk=self.pk).update(views=models.F('views') + 1)
        self.views += 1


class Comment(models.Model):
    """
    Model komentarza do dyskusji na forum
    """

    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes_count = models.IntegerField(default=0)
    dislikes_count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Aktualizujemy last_activity dyskusji po dodaniu komentarza
        if is_new:
            self.discussion.update_last_activity()
            self.discussion.update_comment_count()
            CommentStats.objects.create(comment=self)

    def update_votes_count(self):
        """Aktualizuje liczniki like/dislike na podstawie głosów"""
        stats = self.votes.aggregate(
            total_likes=models.Sum('likes'),
            total_dislikes=models.Sum('dislikes')
        )
        self.likes_count = stats['total_likes'] or 0
        self.dislikes_count = stats['total_dislikes'] or 0
        self.save(update_fields=['likes_count', 'dislikes_count'])

    def get_user_vote(self, user):
        """Zwraca głos użytkownika dla tego komentarza"""
        try:
            vote = self.votes.get(user=user)
            if vote.likes > 0:
                return 'like'
            elif vote.dislikes > 0:
                return 'dislike'
            return None
        except CommentStats.DoesNotExist:
            return None


class CommentStats(models.Model):
    """
    Model statystyk dla komentarzy
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="votes")
    likes = models.PositiveIntegerField(default=0)
    dislikes = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('user', 'comment')  # 1 użytkownik = 1 głos

    def save(self, *args, **kwargs):
        # Upewniamy się, że użytkownik nie może jednocześnie like i dislike
        if self.likes > 0:
            self.dislikes = 0
        elif self.dislikes > 0:
            self.likes = 0
        
        # Upewniamy się, że wartości są 0 lub 1
        self.likes = min(self.likes, 1)
        self.dislikes = min(self.dislikes, 1)
        
        super().save(*args, **kwargs)
        
        # Aktualizujemy liczniki w komentarzu
        self.comment.update_votes_count()


class VehicleMake(models.Model):
    """
    Model marki pojazdu (np. Toyota, BMW, Audi)
    """

    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Marka"
        verbose_name_plural = "Marki"

    def __str__(self):
        return self.name


class VehicleModel(models.Model):
    """
    Model pojazdu (np. Corolla, A4, Seria 3)
    """

    make = models.ForeignKey(VehicleMake, on_delete=models.CASCADE, related_name="models")
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('make', 'name')
        verbose_name = "Model"
        verbose_name_plural = "Modele"

    def __str__(self):
        return f"{self.make.name} {self.name}"


class VehicleGeneration(models.Model):
    """
    Model generacji modelu auta (np. Golf VII)
    """

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
    """
    Model pojazdu użytkownika
    """

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

    DRIVE_TYPE_CHOICES = [
        ('FWD', 'Przedni (FWD)'),
        ('RWD', 'Tylny (RWD)'),
        ('AWD', 'Na wszystkie koła (AWD)'),
        ('4x4', '4x4'),
    ]


    TRANSMISSION_CHOICES = [
        ('Manualna', 'Manualna'),
        ('Automatyczna', 'Automatyczna'),
        ('Półautomatyczna', 'Półautomatyczna'),
        ('CVT', 'CVT (bezstopniowa)'),
        ('Dwusprzęgłowa', 'Dwusprzęgłowa (DSG/DCT)'),
    ]

    FUEL_TYPES = [
        ('Benzyna', 'Benzyna'),
        ('Diesel', 'Diesel'),
        ('Hybryda', 'Hybryda'),
        ('Elektryczny', 'Elektryczny'),
        ('Benzyna+LPG', 'Benzyna+LPG'),
        ('Benzyna+CNG', 'Benzyna+CNG'),
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
    drive_type = models.CharField(default='FWD', max_length=10, choices=DRIVE_TYPE_CHOICES, verbose_name='Rodzaj napędu')
    transmission_type = models.CharField(default='Manualna', max_length=20, choices=TRANSMISSION_CHOICES, verbose_name='Skrzynia biegów')
    for_sale = models.BooleanField(default=False, verbose_name='Na sprzedaż')
    registration = models.CharField(default='', verbose_name='Nr rejestracyjny')
    fuel_type = models.CharField(max_length=20, choices=FUEL_TYPES, default='', verbose_name='Typ paliwa')
    history_pdf = models.FileField(upload_to="pdf_exports/", null=True, blank=True)

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
    """
    Model obrazu powiązanego z pojazdem
    """

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
    """
    Model odpowiedzialny za webscraping historii i danych technicznych pojazdu z portalu
    historiapojazdu.gov.pl
    """
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

    def _fill_form(self, date_str, wait):
        """Uzupełnianie formularza"""

        rejestracja_field = wait.until(EC.presence_of_element_located((By.ID, "registrationNumber")))
        vin_field = wait.until(EC.presence_of_element_located((By.ID, "VINNumber")))
        data_rejestracji = wait.until(EC.presence_of_element_located((By.ID, "firstRegistrationDate")))

        rejestracja_field.clear()
        rejestracja_field.send_keys(self.registration_plate)

        vin_field.clear()
        vin_field.send_keys(self.vin)

        data_rejestracji.clear()
        data_rejestracji.send_keys(Keys.HOME)
        data_rejestracji.send_keys(date_str)

        submit = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.nforms-button")))
        submit.click()
        time.sleep(3)

    def _extract_technical_data(self,wait):
        """Pobiera dane techniczne pojazdu"""

        try:
            # Znajdź sekcję z danymi technicznymi
            tech_section = wait.until(EC.presence_of_element_located(
                (By.XPATH, "//section[.//h2[contains(., 'Dane techniczne')]]")
            ))
            
            # Pobierz cały HTML sekcji
            tech_html = tech_section.get_attribute("outerHTML")
            logger.info("Pobrano sekcję 'Dane techniczne'.")
            soup = BeautifulSoup(tech_html, "html.parser")
            data = {}
            
            # Mapowanie polskich nazw na klucze
            field_map = {
                "Pojemność silnika": "engine_capacity",
                "Moc silnika": "engine_power",
                "Norma euro": "euro_norm",
                "Liczba miejsc ogółem": "seats_total",
                "Masa własna pojazdu": "mass_own",
                "Dopuszczalna masa całkowita": "mass_total",
                "Maks. masa całkowita przyczepy z hamulcem": "trailer_with_brake",
                "Maks. masa całkowita przyczepy bez hamulca": "trailer_without_brake"
            }

            # Szukamy wszystkich elementów app-label-value w sekcji
            label_values = soup.find_all("app-label-value")
            
            for element in label_values:
                # Pobierz label z atrybutu
                label = element.get("label", "").strip()
                
                # Jeśli nie ma w atrybucie, spróbuj pobrać z tekstu
                if not label:
                    label_elem = element.find("p", class_="label")
                    if label_elem:
                        label = label_elem.get_text(strip=True).replace(":", "")
                
                # Pobierz wartość
                value_elem = element.find("p", class_="value")
                if value_elem and label:
                    value = value_elem.get_text(strip=True)
                    
                    # Mapuj na angielskie klucze
                    if label in field_map:
                        data[field_map[label]] = value

            logger.info(f"Sparsowano {len(data)} pól danych technicznych")
            return data

        except Exception as e:
            logger.error(f"Błąd podczas pobierania danych technicznych: {e}")
            return {}

    def _extract_timeline(self, wait):
        """Pobranie 'Oś czasu'"""
        try:
            timeline_tab = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//div[@role='tab' and contains(., 'Oś czasu')]")
            ))
            timeline_tab.click()
            time.sleep(2)
            logger.info("Przełączono na zakładkę 'Oś czasu'.")

            timeline_container = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "app-axis ul")))
            return timeline_container.get_attribute("outerHTML")

        except Exception as e:
            logger.warning(f"Nie udało się pobrać osi czasu: {e}")
            return None

    def search(self):
        """Pobieranie historii i danych technicznych"""
        try:
            date_obj = datetime.strptime(str(self.production_date), "%d%m%Y")
            date_str = date_obj.strftime("%d%m%Y")
            logger.info(f"Pobieranie danych dla VIN={self.vin}, rej={self.registration_plate}, data={date_str}")

            self.driver.get(self.url)
            wait = WebDriverWait(self.driver, 10)
            self._fill_form(date_str, wait)

            # Pobranie danych technicznych
            technical_data = self._extract_technical_data(wait)

            # Pobranie osi czasu
            timeline_html = self._extract_timeline(wait)

            return {
                "vin": self.vin,
                "registration": self.registration_plate,
                "data_rejestracji": date_str,
                "technical_data": technical_data,
                "timeline_html": timeline_html
            }

        except Exception as e:
            logger.error(f"Błąd podczas scrapowania dla VIN={self.vin}: {e}")
            return None
        finally:
            self.closeBrowser()

    
class Message(models.Model):
    """
    Wiadomości między użytkownikami 
    """

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    sale = models.ForeignKey("VehicleSale", on_delete=models.CASCADE, null=True, blank=True, related_name="messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False) 

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Wiadomość od {self.sender} do {self.receiver}"
    

class ServiceEntry(models.Model):
    """
    Model wpisu serwisowego pojazdu
    """

    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='service_entries')
    date = models.DateField()
    mileage = models.PositiveIntegerField()
    description = models.TextField(max_length=1000)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    invoice_image = models.ImageField(upload_to=vehicle_invoice_path, null=True, blank=True)

    def __str__(self):
        return f"{self.vehicle} - {self.date}"


class DamageEntry(models.Model):
    """
    Model uszkodzeń pojazdu
    """

    vehicle = models.ForeignKey("Vehicle", on_delete=models.CASCADE, related_name="damage_entries")
    date = models.DateField()
    description = models.TextField(blank=True)
    photos = models.ImageField(upload_to=damage_image_path, null=True, blank=True)

    def __str__(self):
        return f"{self.vehicle.vin} - {self.date}"


class DamageMarker(models.Model):
    """
    Marker (punkt) na zdjęciu uszkodzenia
    """

    SEVERITY_CHOICES = [
        ("drobne", "Drobne"),
        ("umiarkowane", "Umiarkowane"),
        ("poważne", "Poważne"),
    ]
    damage_entry = models.ForeignKey(DamageEntry, on_delete=models.CASCADE, related_name="markers")
    x_percent = models.DecimalField(max_digits=5, decimal_places=2)
    y_percent = models.DecimalField(max_digits=5, decimal_places=2)

    severity = models.CharField(
        max_length=11,
        choices=SEVERITY_CHOICES,
        default="drobne"
    )

    def __str__(self):
        return f"Marker {self.id} ({self.severity}) - {self.x_percent}%, {self.y_percent}%"


class VehicleSale(models.Model):
    """
    Model ogłoszenia auta na sprzedaż
    """

    vehicle = models.ForeignKey("Vehicle", on_delete=models.CASCADE, related_name="sale_listings")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sale_listings")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def history(self):
        return {
            "damages": list(self.vehicle.damage_entries.values()),
            "services": list(self.vehicle.service_entries.values())
        }


class VehicleSaleStats(models.Model):
    """
    Model statystyk ogłoszenia auta
    """
    
    sale = models.OneToOneField("VehicleSale", on_delete=models.CASCADE, related_name="stats")
    views = models.PositiveIntegerField(default=0)
    messages_sent = models.PositiveIntegerField(default=0)
    favorites = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Statystyki dla ogłoszenia {self.sale.title}"
