from rest_framework import generics, permissions
from .serializers import UserRegistrationSerializer, PostSerializer
from rest_framework.permissions import AllowAny
from .models import Post
from rest_framework.permissions import IsAuthenticated


class PostListCreateAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]  # opcjonalnie, jeśli chcesz chronić endpoint

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDeleteAPIView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Można usuwać tylko własne posty
        return self.queryset.filter(author=self.request.user)


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]