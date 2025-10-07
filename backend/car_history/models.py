from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

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

    
class Vehicle(models.Model):
    """ Model pojazdu przypisanego do użytkownika """
    FUEL_CHOICES = [
        ('Benzyna', 'Benzyna'),
        ('Diesel', 'Diesel'),
        ('Hybryda', 'Hybryda'),
        ('Elektryczny', 'Elektryczny'),
    ]

    TRANSMISSION_CHOICES = [
        ('Manual', 'Manual'),
        ('Automat', 'Automat'),
    ]

    DRIVE_CHOICES = [
        ('FWD', 'Napęd na przód'),
        ('RWD', 'Napęd na tył'),
        ('AWD', 'Napęd na wszystkie koła'),
        ('4WD', '4x4 / 4WD'),
    ]

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

    TIRE_SIZE_CHOICES = [
        ('195/65 R15', '195/65 R15'),
        ('205/55 R16', '205/55 R16'),
        ('225/45 R17', '225/45 R17'),
        ('235/40 R18', '235/40 R18'),
        ('245/35 R19', '245/35 R19'),
        ('255/30 R20', '255/30 R20'),
        ('265/35 R21', '265/35 R21'),
        ('275/30 R22', '275/30 R22'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    vin = models.CharField(max_length=17, unique=True, primary_key=True)
    odometer = models.IntegerField()
    body_color = models.CharField(default='Biały', choices=BODY_COLOR_CHOICES)
    interior_color = models.CharField(default='Czarny', choices=INTERIOR_COLOR_CHOICES)
    price = models.FloatField(default=0.0, editable=True)
    first_registration = models.DateField(default=timezone.now, blank=True, null=True)
    image = models.ImageField(blank=True, null=True, upload_to='images/')
    fuel_type = models.CharField(default='Diesel', max_length=20, choices=FUEL_CHOICES)
    transmission = models.CharField(default='Manual', max_length=20, choices=TRANSMISSION_CHOICES)
    drive_type = models.CharField(default='Napęd na przód', max_length=30, choices=DRIVE_CHOICES)
    location = models.CharField(default='', max_length=100)
    wheel_size = models.CharField(default='', max_length=10, choices=WHEEL_SIZE_CHOICES)
    tire_size = models.CharField(default='', max_length=15, choices=TIRE_SIZE_CHOICES)
    for_sale = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"

class ServiceHistory(models.Model):
    """ Historia serwisowa pojazdu """
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    service_center = models.ForeignKey('ServiceCenter', on_delete=models.SET_NULL, null=True)
    date = models.DateField(default=timezone.now)
    description = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Serwis {self.vehicle} - {self.date}"

class ServiceCenter(models.Model):
    """ Model serwisu wykonującego naprawy """
    name = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=15)
    
    def __str__(self):
        return self.name

class Listing(models.Model):
    """ Ogłoszenie sprzedaży pojazdu """
    seller = models.ForeignKey(User, on_delete=models.CASCADE)
    vehicle = models.OneToOneField(Vehicle, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sprzedaż: {self.vehicle} za {self.price} PLN"

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
