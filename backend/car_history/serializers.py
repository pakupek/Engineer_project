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
    ServiceEntry
)
from django.contrib.auth.password_validation import validate_password
import datetime

class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ['id', 'vehicle', 'image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at', 'vehicle']


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
    generation = serializers.PrimaryKeyRelatedField(
        queryset=VehicleGeneration.objects.all()
    )
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    images = VehicleImageSerializer(many=True, read_only=True)
    class Meta:
        model = Vehicle
        fields = '__all__'


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