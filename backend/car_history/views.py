from rest_framework import generics, permissions
from .serializers import UserRegistrationSerializer, DiscussionSerializer, CommentSerializer
from rest_framework.permissions import AllowAny
from .models import Comment, Discussion
from rest_framework.permissions import IsAuthenticated


class DiscussionListCreateView(generics.ListCreateAPIView):
    queryset = Discussion.objects.all().order_by("-created")
    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class DiscussionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all().order_by("-created")
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]