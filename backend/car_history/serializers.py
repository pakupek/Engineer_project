from rest_framework import serializers
from .models import User, Post
from django.contrib.auth.password_validation import validate_password

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ['author', 'created_at']
    author = serializers.PrimaryKeyRelatedField(read_only=True)
        

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