from rest_framework import generics, permissions, status
from .serializers import (
    UserRegistrationSerializer, 
    DiscussionSerializer, 
    CommentSerializer, 
    DiscussionCreateSerializer, 
    MessageSerializer, 
    MessageCreateSerializer, 
    UserSerializer,
    ChangePasswordSerializer
)
from rest_framework.permissions import AllowAny
from .models import Comment, Discussion, Message, User
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model, update_session_auth_hash


User = get_user_model()

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"old_password": ["Nieprawidłowe hasło"]}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        update_session_auth_hash(request, user)
        return Response({"message": "Hasło zostało zmienione"})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_auth_status(request):
    """Sprawdza czy użytkownik jest zalogowany i zwraca jego dane"""
    user = request.user
    return Response({
        'is_authenticated': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }, status=status.HTTP_200_OK)


class MessageListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MessageCreateSerializer
        return MessageSerializer
    
    def get_queryset(self):
        # Pokaż tylko wiadomości gdzie użytkownik jest nadawcą lub odbiorcą
        return Message.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        ).select_related('sender', 'receiver')
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class ConversationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        other_user_id = self.kwargs['user_id']
        # Pobierz konwersację między dwoma użytkownikami
        return Message.objects.filter(
            Q(sender=self.request.user, receiver_id=other_user_id) |
            Q(sender_id=other_user_id, receiver=self.request.user)
        ).select_related('sender', 'receiver').order_by('timestamp')

class UnreadMessagesCountView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        count = Message.objects.filter(
            receiver=request.user, 
            is_read=False
        ).count()
        return Response({'unread_count': count})

class MarkAsReadView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Message.objects.all()
    
    def update(self, request, *args, **kwargs):
        message = self.get_object()
        # Tylko odbiorca może oznaczyć wiadomość jako przeczytaną
        if message.receiver == request.user:
            message.is_read = True
            message.save()
            return Response({'status': 'marked as read'})
        return Response(
            {'error': 'Nie masz uprawnień do tej operacji'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    

class UserListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    def get_queryset(self):
        # Wyklucz aktualnego użytkownika z listy
        return User.objects.exclude(id=self.request.user.id)


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