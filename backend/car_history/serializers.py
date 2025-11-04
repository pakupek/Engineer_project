import json
from rest_framework import serializers
from .models import (
    User, 
    Comment, 
    Discussion, 
    Message, 
    Vehicle, 
    VehicleModel, 
    VehicleMake, 
    VehicleGeneration, 
    VehicleImage,
    ServiceEntry,
    DamageEntry,
    DamageMarker,
    VehicleSale,
)
from django.contrib.auth.password_validation import validate_password
import datetime

class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ['id', 'vehicle', 'image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at', 'vehicle']

    def validate(self, attrs):
        vehicle = self.context.get('vehicle')
        if vehicle and vehicle.images.count() >= 30:
            raise serializers.ValidationError(
                "Można dodać maksymalnie 30 zdjęć do pojazdu"
            )
        return attrs


class VehicleMakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleMake
        fields = '__all__'


class VehicleModelSerializer(serializers.ModelSerializer):
    make = VehicleMakeSerializer(read_only=True)
    class Meta:
        model = VehicleModel
        fields = '__all__'


class VehicleGenerationSerializer(serializers.ModelSerializer):
    model = VehicleModelSerializer(read_only=True)
    class Meta:
        model = VehicleGeneration
        fields = '__all__'


class VehicleSerializer(serializers.ModelSerializer):
    generation_id = serializers.PrimaryKeyRelatedField(
        queryset=VehicleGeneration.objects.all(),
        source='generation',  # Mapuje na pole generation w modelu
        required=False,
        allow_null=True,
        write_only=True  # Tylko do zapisu
    )
    generation = VehicleGenerationSerializer(read_only=True)  # Tylko do odczytu
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    images = VehicleImageSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'
    
class VehicleDeleteSerializer(serializers.Serializer):
    """
    Serializer dla odpowiedzi po usunięciu pojazdu
    """
    message = serializers.CharField()
    deleted_vehicle = serializers.CharField()
    deleted_images_count = serializers.IntegerField()
    deleted_service_entries_count = serializers.IntegerField()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    receiver_name = serializers.CharField(source='receiver.username', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_name', 'receiver', 'receiver_name', 
                 'content', 'timestamp', 'is_read']
        read_only_fields = ['sender', 'timestamp', 'is_read']


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['receiver', 'content']
    
    def validate_receiver(self, value):
        # Sprawdź czy użytkownik nie wysyła wiadomości do siebie
        if value == self.context['request'].user:
            raise serializers.ValidationError("Nie możesz wysłać wiadomości do siebie.")
        return value


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'author_name', 'created_at']
        read_only_fields = ['author', 'created_at']


class DiscussionSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    comment_count = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    created_at = serializers.DateTimeField(source='created', read_only=True)
    updated_at = serializers.DateTimeField(source='updated', read_only=True)
    
    class Meta:
        model = Discussion
        fields = ['id', 'title', 'content', 'author', 'author_name', 'category', 
                 'created_at', 'updated_at', 'views', 'comments', 'comment_count']
        read_only_fields = ['author', 'views', 'created_at', 'updated_at']
    
    def get_comment_count(self, obj):
        return obj.comments.count()
        

class DiscussionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discussion
        fields = ['title', 'content', 'category']
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'phone_number', 'password', 'password2')
        extra_kwargs = {
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Hasła nie są identyczne."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Użytkownik z tym adresem email już istnieje."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class ServiceEntrySerializer(serializers.ModelSerializer):
    """
    Serializer dla wpisów serwisowych 
    """

    class Meta:
        model = ServiceEntry
        fields = ['id','date','mileage','description','cost','invoice_image']
        

    def validate_date(self, value):
        if value > datetime.date.today():
            raise serializers.ValidationError("Data nie może być z przyszłości")
        return value

    def validate_mileage(self, value):
        if value < 0:
            raise serializers.ValidationError("Przebieg nie może być ujemny")
        return value

    def validate_cost(self, value):
        if value and value < 0:
            raise serializers.ValidationError("Koszt nie może być ujemny")
        return value
    

class DamageMarkerSerializer(serializers.ModelSerializer):
    """
    Serializer do markerów (punktów) do zaznaczania
    """
    class Meta:
        model = DamageMarker
        fields = ['id', 'x_percent', 'y_percent', 'severity']


class DamageEntrySerializer(serializers.ModelSerializer):
    """
    Serializer do uszkodzeń auta
    """
    
    markers = DamageMarkerSerializer(many=True, read_only=True)
    class Meta:
        model = DamageEntry
        fields = ['id','date','description','photos','markers']

    def create(self, validated_data):
        # Pobieramy vehicle z kontekstu
        vehicle = self.context['vehicle']

        # Tworzymy DamageEntry
        damage_entry = DamageEntry.objects.create(vehicle=vehicle, **validated_data)

        # Tworzymy markery
        markers_data = self.context['request'].data.get('markers', '[]')
        try:
            markers_list = json.loads(markers_data)
        except json.JSONDecodeError:
            markers_list = []

        for marker in markers_list:
            DamageMarker.objects.create(damage_entry=damage_entry, **marker)

        return damage_entry
    

class VehicleSaleSerializer(serializers.ModelSerializer):
    vehicle_info = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()

    class Meta:
        model = VehicleSale
        fields = [
            "id", "vehicle", "vehicle_info", "owner",
            "title", "description", "price", "is_active", "created_at", "history"
        ]
        read_only_fields = ["owner", "created_at", "history"]

    def get_vehicle_info(self, obj):
        vehicle = obj.vehicle
        generation = vehicle.generation

        # Pobieramy listę URL-i zdjęć pojazdu
        images = [
            f"http://localhost:8000{img.image.url}"  # dodaj host, żeby frontend mógł pobrać
            for img in vehicle.images.all()
        ]

        return {
            "vin": vehicle.vin,
            "make": generation.model.make.name if generation and generation.model and generation.model.make else None,
            "model": generation.model.name if generation and generation.model else None,
            "generation": generation.name if generation else None,
            "production_year": vehicle.production_year or (generation.production_start if generation else None),
            "odometer": vehicle.odometer,
            "body_color": vehicle.body_color,
            "interior_color": vehicle.interior_color,
            "fuel_type": vehicle.fuel_type,
            "wheel_size": vehicle.wheel_size,
            "location": vehicle.location,
            "registration": vehicle.registration,
            "first_registration": vehicle.first_registration.isoformat() if vehicle.first_registration else None,
            "images": images,
        }


    def get_history(self, obj):
        vehicle = obj.vehicle
        damages = [
            {
                "id": d.id,
                "date": d.date.isoformat() if d.date else None,
                "description": d.description,
                "photos": d.photos.url if d.photos else None,
            }
            for d in vehicle.damage_entries.all().order_by("-date")
        ]
        services = [
            {
                "id": s.id,
                "date": s.date.isoformat() if s.date else None,
                "mileage": s.mileage,
                "description": s.description,
                "cost": float(s.cost) if s.cost else None,
                "invoice_image": s.invoice_image.url if s.invoice_image else None,
            }
            for s in vehicle.service_entries.all().order_by("-date")
        ]
        return {"damages": damages, "services": services}

    