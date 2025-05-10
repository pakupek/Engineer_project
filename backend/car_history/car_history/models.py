from django.contrib.auth.models import AbstractUser
from django.db import models
from rolepermissions.roles import assign_role

class User(AbstractUser):
    """ Model użytkownika systemu """
    ROLE_CHOICES = [
        ('owner', 'Właściciel pojazdu'),
        ('service', 'Serwis'),
        ('buyer', 'Kupujący'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    first_name = models.CharField(max_length=20, blank=False, null=False)
    last_name = models.CharField(max_length=50, blank=False, null=False)
    login = models.CharField(max_length=50,blank=False, null=False,unique=True,editable=True)
    password = models.CharField(max_length=20,blank=False, null=False,editable=True)
    mail = models.EmailField() 

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        assign_role(self, self.role)  # Automatycznie przypisuje rolę po zapisie użytkownika
    
class Vehicle(models.Model):
    """ Model pojazdu przypisanego do użytkownika """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    vin = models.CharField(max_length=17, unique=True)
    odometer = models.IntegerField()
    color = models.CharField()
    
    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"

class ServiceHistory(models.Model):
    """ Historia serwisowa pojazdu """
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    service_center = models.ForeignKey('ServiceCenter', on_delete=models.SET_NULL, null=True)
    date = models.DateField()
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

    def __str__(self):
        return f"Wiadomość od {self.sender} do {self.receiver}"
