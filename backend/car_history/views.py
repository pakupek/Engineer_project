from rest_framework import generics, permissions
from .serializers import UserRegistrationSerializer, DiscussionSerializer, CommentSerializer, DiscussionCreateSerializer
from rest_framework.permissions import AllowAny
from .models import Comment, Discussion
from rest_framework.permissions import IsAuthenticated


class DiscussionListCreateView(generics.ListCreateAPIView):
    queryset = Discussion.objects.all().order_by("-created_at")
    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Discussion.objects.all().select_related('author')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DiscussionCreateSerializer
        return DiscussionSerializer
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class DiscussionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        return super().retrieve(request, *args, **kwargs)

class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all().order_by("-created_at")
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(
            discussion_id=self.kwargs['discussion_id']
        ).select_related('author')
    
    def perform_create(self, serializer):
        discussion = Discussion.objects.get(id=self.kwargs['discussion_id'])
        serializer.save(author=self.request.user, discussion=discussion)


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]