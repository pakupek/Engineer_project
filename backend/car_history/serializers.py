import json, datetime
from rest_framework import serializers
from .models import (
    DamagePhoto,
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
    CommentStats,
    DiscussionFavorite,
    DiscussionStats,
    DiscussionImage,
    CommentImage,
)
from django.contrib.auth.password_validation import validate_password
from django.core.cache import cache

class ArticleSerializer(serializers.Serializer):
    """
    Serializer do artykułów motoryzacyjnych
    """

    id = serializers.CharField(allow_blank=True, required=False)
    title = serializers.CharField()
    summary = serializers.CharField(allow_blank=True, required=False)
    image_url = serializers.CharField(allow_blank=True, required=False)
    published_at = serializers.CharField(allow_blank=True, required=False)
    url = serializers.CharField(allow_blank=True, required=False)
    source = serializers.CharField(allow_blank=True, required=False)


class VehicleImageSerializer(serializers.ModelSerializer):
    """
    Serializer do zdjęć pojazdu użytkownika
    """

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
    """
    Serializer marki pojazdów
    """

    class Meta:
        model = VehicleMake
        fields = '__all__'


class VehicleModelSerializer(serializers.ModelSerializer):
    """
    Serializer modelu pojazdu
    """

    make = VehicleMakeSerializer(read_only=True)
    class Meta:
        model = VehicleModel
        fields = '__all__'


class VehicleGenerationSerializer(serializers.ModelSerializer):
    """
    Serializer do generacji modelu pojazdu
    """

    model = VehicleModelSerializer(read_only=True)
    class Meta:
        model = VehicleGeneration
        fields = '__all__'


class VehicleSerializer(serializers.ModelSerializer):
    """
    Serializer pojazdu użytkownika
    """

    generation_id = serializers.PrimaryKeyRelatedField(
        queryset=VehicleGeneration.objects.all(),
        source='generation',  # Mapuje na pole generation w modelu
        required=False,
        allow_null=True,
        write_only=True  
    )
    generation = VehicleGenerationSerializer(read_only=True) 
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
    """
    Serializer do zmiany hasła
    """

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer użytkownika
    """

    class Meta:
        model = User
        fields = ['id', 'username', 'email','phone_number', 'avatar']


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer wiadomości
    """

    sender_name = serializers.CharField(source='sender.username', read_only=True)
    receiver_name = serializers.CharField(source='receiver.username', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_name', 'receiver', 'receiver_name', 'sale',
                 'content', 'timestamp', 'is_read']
        read_only_fields = ['sender', 'timestamp', 'is_read']

    def create(self, validated_data):
        # ustal sender po stronie serwera
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            validated_data['sender'] = request.user
        return super().create(validated_data)


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['receiver', 'content']
    
    def validate_receiver(self, value):
        # Sprawdź czy użytkownik nie wysyła wiadomości do siebie
        if value == self.context['request'].user:
            raise serializers.ValidationError("Nie możesz wysłać wiadomości do siebie.")
        return value


class DiscussionImageSerializer(serializers.ModelSerializer):
    """
    Serializer zdjęcia dyskusji
    """

    class Meta:
        model = DiscussionImage
        fields = ['id', 'image']


class CommentImageSerializer(serializers.ModelSerializer):
    """
    Serializer zdjęcia komentarza
    """

    class Meta:
        model = CommentImage
        fields = ['id', 'image']


class CommentStatsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    vote_type = serializers.SerializerMethodField()

    class Meta:
        model = CommentStats
        fields = ['id', 'user', 'likes', 'dislikes', 'vote_type']
        read_only_fields = ['user']

    def get_vote_type(self, obj):
        if obj.likes > 0:
            return 'like'
        elif obj.dislikes > 0:
            return 'dislike'
        return None


class CommentStatsUpdateSerializer(serializers.ModelSerializer):
    action = serializers.ChoiceField(choices=['like', 'dislike', 'remove'], write_only=True)
    
    class Meta:
        model = CommentStats
        fields = ['action']


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer komentarza wpisu na forum
    """

    author_name = serializers.CharField(source="author.username", read_only=True)
    author_avatar = serializers.ImageField(source="author.avatar", read_only=True)
    user_vote = serializers.SerializerMethodField()
    votes = CommentStatsSerializer(many=True, read_only=True)
    images = CommentImageSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "discussion",
            "author",
            "author_name",
            "author_avatar",
            "content",
            "likes_count", 
            "dislikes_count",
            "created_at",
            "user_vote",
            "votes",
            "images"
        ]
        read_only_fields = ["author", "created_at", 'likes_count', 'dislikes_count']

    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.get_user_vote(request.user)
        return None

    def create(self, validated_data):
        validated_data["author"] = self.context['request'].user

        comment = super().create(validated_data)

        # Tworzymy statystyki komentarza
        CommentStats.objects.create(
            comment=comment,
            user=comment.author
        )

        # Aktualizacja statystyk dyskusji
        discussion = comment.discussion
        discussion.comments_count = Comment.objects.filter(discussion=discussion).count()
        discussion.update_last_activity()
        discussion.save(update_fields=["comments_count", "last_activity"])

        return comment

class DiscussionStatsSerializer(serializers.ModelSerializer):
    """
    Serializer dla like i dislike dyskusji
    """

    action = serializers.ChoiceField(choices=['like', 'dislike', 'remove'], write_only=True)
    
    class Meta:
        model = DiscussionStats
        fields = ['action']


class DiscussionFavoriteSerializer(serializers.ModelSerializer):
    """
    Serializer dla ulubionych dyskusji
    """

    class Meta:
        model = DiscussionFavorite
        fields = ['id', 'user', 'discussion', 'created_at']
        read_only_fields = ['user', 'created_at']


class DiscussionSerializer(serializers.ModelSerializer):
    """
    Serializer wpisu na forum 
    """

    author_name = serializers.CharField(source="author.username", read_only=True)
    author_avatar = serializers.ImageField(source="author.avatar", read_only=True)
    user_vote = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    images = DiscussionImageSerializer(many=True, read_only=True)

    class Meta:
        model = Discussion
        fields = [
            "id",
            "title",
            "content",
            "author",
            "author_name",
            "author_avatar",
            "category",
            "views",
            "comments_count",
            "likes_count",
            "dislikes_count",
            "favorites_count",
            "created_at",
            "updated_at",
            "last_activity",
            "user_vote",
            "is_favorited",
            "images",
            "locked",
        ]
        read_only_fields = [
            "views",
            "comments_count",
            "likes_count",
            "dislikes_count",
            "favorites_count",
            "created_at",
            "updated_at",
            "last_activity",
            "author",
        ]

    def get_images(self, obj):
        return [img.image.url for img in obj.images.all()]

    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.get_user_vote(request.user)
        return None

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_favorited_by_user(request.user)
        return False

    def create(self, validated_data):
        """
        Przypisanie autora
        """
        
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)
    

class DiscussionLockSerializer(serializers.ModelSerializer):
    """
    Serializer do zamykania wpisu na forum
    """
    
    class Meta:
        model = Discussion
        fields = ['locked']
        read_only_fields = []


class EmailSerializer(serializers.Serializer):
    """
    Serializer wysyłki kod weryfikacyjnego na email
    """
    
    email = serializers.EmailField(required=True)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer rejestracji użytkownika
    """

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    verification_code = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'phone_number', 'password', 'password2', 'verification_code')
        extra_kwargs = {
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Hasła nie są identyczne."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Użytkownik z tym adresem email już istnieje."})

        # Weryfikacja kodu
        cached_code = cache.get(f'verification_code_{attrs["email"]}')
        if cached_code != attrs['verification_code']:
            raise serializers.ValidationError({"verification_code": "Niepoprawny kod weryfikacyjny."})
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


class DamagePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DamagePhoto
        fields = ['id', 'image']
        

class DamageEntrySerializer(serializers.ModelSerializer):
    """
    Serializer do uszkodzeń auta
    """
    
    markers = DamageMarkerSerializer(many=True, read_only=True)
    photos = DamagePhotoSerializer(many=True, read_only=True)  
    new_photos = serializers.ListField(
        child=serializers.ImageField(max_length=None, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = DamageEntry
        fields = ['id','date','description','photos','new_photos','markers']

    def validate_new_photos(self, value):
        if len(value) > 10:
            raise serializers.ValidationError("Nie można dodać więcej niż 10 zdjęć")
        return value

    def create(self, validated_data):
        # Pobieramy vehicle z kontekstu
        vehicle = self.context['vehicle']
        new_photos = validated_data.pop('new_photos', [])

        # Tworzymy DamageEntry
        damage_entry = DamageEntry.objects.create(vehicle=vehicle, **validated_data)

        # Tworzenie zdjęć
        for photo in new_photos:
            DamagePhoto.objects.create(damage_entry=damage_entry, image=photo)

        # Tworzymy markery
        markers_data = self.context['request'].data.get('markers', '[]')
        try:
            markers_list = json.loads(markers_data)
        except json.JSONDecodeError:
            markers_list = []

        for marker in markers_list:
            DamageMarker.objects.create(damage_entry=damage_entry, **marker)

        return damage_entry
    
    def update(self, instance, validated_data):
        # Aktualizacja pól podstawowych
        instance.date = validated_data.get('date', instance.date)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        # Dodawanie nowych zdjęć
        new_photos = validated_data.pop('new_photos', [])
        if new_photos:
            if instance.photos.count() + len(new_photos) > 10:
                raise serializers.ValidationError("Nie można mieć więcej niż 10 zdjęć")
            for photo in new_photos:
                DamagePhoto.objects.create(damage_entry=instance, image=photo)

        # Obsługa markerów - możesz tu dopisać podobnie jak w create()

        return instance
    

class VehicleSaleSerializer(serializers.ModelSerializer):
    vehicle_info = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()
    owner_info = serializers.SerializerMethodField()
    current_user = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()
    history_pdf = serializers.SerializerMethodField()

    class Meta:
        model = VehicleSale
        fields = [
            "id", "vehicle", "vehicle_info", "history_pdf","owner_info","owner","current_user","stats",
            "title", "description", "price", "is_active", "created_at", "history"
        ]
        read_only_fields = ["owner", "created_at", "history"]

    

    def get_history_pdf(self, obj):
        if obj.vehicle.history_pdf:
            return obj.vehicle.history_pdf.url
        return None



    def get_stats(self, obj):
        stats = getattr(obj, "stats", None)
        if not stats:
            return {"views": 0, "messages_sent": 0, "favorites": 0}
        return {
            "views": stats.views,
            "messages_sent": stats.messages_sent,
            "favorites": stats.favorites,
        }

    
    def get_current_user(self, obj):
        """Zwróć ID aktualnie zalogowanego użytkownika"""
        user = self.context["request"].user
        return user.id if user.is_authenticated else None

    def get_owner_info(self, obj):
        """Zwraca dane właściciela pojazdu."""
        owner = obj.owner
        if not owner:
            return None

        # Zakładamy, że model użytkownika ma pola: username, avatar, phone_number, email
        avatar_url = None
        if hasattr(owner, "avatar") and owner.avatar:
            avatar_url = f"http://localhost:8000{owner.avatar.url}"

        return {
            "username": owner.username,
            "email": owner.email,
            "phone_number": getattr(owner, "phone_number", None),
            "avatar": avatar_url,
        }

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
            "drive_type": vehicle.drive_type,
            "transmission_type": vehicle.transmission_type,
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
    

    