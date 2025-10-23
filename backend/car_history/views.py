from rest_framework import generics, permissions, status
from .serializers import (
    UserRegistrationSerializer, 
    DiscussionSerializer, 
    CommentSerializer, 
    DiscussionCreateSerializer, 
    MessageSerializer, 
    MessageCreateSerializer, 
    UserSerializer,
    ChangePasswordSerializer,
    VehicleSerializer,
    VehicleMakeSerializer,
    VehicleModelSerializer,
    VehicleGenerationSerializer,
    VehicleImageSerializer,
    ServiceEntrySerializer
)
from rest_framework.permissions import AllowAny
from .models import (
    Comment, 
    Discussion, 
    Message, 
    User, 
    Vehicle, 
    VehicleMake, 
    VehicleModel, 
    VehicleGeneration, 
    VehicleImage,
    VehicleHistory,
    ServiceEntry
)
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser, FormParser
import logging

logger = logging.getLogger(__name__)


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


# Lista marek
class VehicleMakeListAPI(generics.ListAPIView):
    queryset = VehicleMake.objects.all().order_by('name')
    serializer_class = VehicleMakeSerializer
    permission_classes = [permissions.AllowAny]

# Lista modeli dla danej marki
class VehicleModelListAPI(generics.ListAPIView):
    serializer_class = VehicleModelSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        make_id = self.request.query_params.get('make')
        if make_id:
            return VehicleModel.objects.filter(make_id=make_id).order_by('name')
        return VehicleModel.objects.all().order_by('name')
    
class VehicleGenerationListAPI(generics.ListAPIView):
    serializer_class = VehicleGenerationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = VehicleGeneration.objects.all().order_by('name')
        model_id = self.request.query_params.get('model')  # spodziewa się ID
        if model_id:
            queryset = queryset.filter(model_id=model_id)
        return queryset

class VehicleImageListCreateView(generics.ListCreateAPIView):
    """
    GET  -> pobiera wszystkie zdjęcia danego pojazdu
    POST -> dodaje nowe zdjęcia dla danego pojazdu
    """
    serializer_class = VehicleImageSerializer

    def get_queryset(self):
        vin = self.kwargs['vin']
        return VehicleImage.objects.filter(vehicle__vin=vin)

    def post(self, request, *args, **kwargs):
        vin = self.kwargs['vin']
        vehicle = get_object_or_404(Vehicle, vin=vin)

        files = request.FILES.getlist('images')
        if not files:
            return Response({"detail": "Nie wybrano żadnych plików."}, status=status.HTTP_400_BAD_REQUEST)

        created_images = []
        errors = []

        for file in files:
            serializer = self.get_serializer(data={'image': file})
            if serializer.is_valid():
                
                serializer.save(vehicle=vehicle)
                created_images.append(serializer.data)
            else:
                print(serializer.errors)

                errors.append(serializer.errors)

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(created_images, status=status.HTTP_201_CREATED)


class VehicleCreateView(generics.CreateAPIView):
    """
    Endpoint do tworzenia nowego pojazdu (/api/vehicles/create/)
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class VehicleListView(generics.ListAPIView):
    """
    Endpoint do pobierania listy wszystkich pojazdów (/api/vehicles/)
    """
    queryset = Vehicle.objects.select_related('generation', 'generation__model', 'generation__model__make').order_by('-generation__production_start')
    serializer_class = VehicleSerializer
    permission_classes = [permissions.AllowAny]

class UserVehicleListView(generics.ListAPIView):
    """
    Endpoint do pobierania listy pojazdów zalogowanego użytkownika (/api/vehicles/my-vehicles/)
    """
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(owner=self.request.user).select_related('generation', 'generation__model', 'generation__model__make').order_by('-generation__production_start')
    
class VehiclesForSaleListView(generics.ListAPIView):
    """
    Endpoint do pobierania listy pojazdów wystawionych na sprzedaż (/api/vehicles/for-sale/)
    """
    serializer_class = VehicleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Zwraca pojazdy, które mają for_sale=True
        return Vehicle.objects.filter(for_sale=True).select_related('generation', 'generation__model', 'generation__model__make').order_by('-generation__production_start')
    
class VehicleDetailAPI(generics.RetrieveAPIView):
    """
    Endpoint do pobierania danych konkretnego pojazdu (api/vehicles/id/)
    """
    permission_classes = [IsAuthenticated]
    queryset = Vehicle.objects.select_related('generation', 'generation__model', 'generation__model__make')
    serializer_class = VehicleSerializer
    lookup_field = 'vin'

_vehicle_history_cache = {}

def get_vehicle_history(rejestracja, vin, rocznik):
    if vin in _vehicle_history_cache:
        return _vehicle_history_cache[vin]

    historia = VehicleHistory(rejestracja, vin, rocznik, ['--headless', '--no-sandbox'])
    result = historia.search()
    historia.closeBrowser()

    if result:
        _vehicle_history_cache[vin] = result
        return result
    return None

def vehicle_history(request,vin):
    """
    Endpoint który zwraca oś czasu dla pojazdu
    """
    try:
        # Szukanie pojazdu po VIN
        vehicle = Vehicle.objects.filter(vin=vin).first()
        if not vehicle:
            return JsonResponse({"success": False, "message": "Nie znaleziono pojazdu o podanym VIN."})

        timeline_data = get_vehicle_history(
            rejestracja=vehicle.registration,
            vin=vehicle.vin,
            rocznik=vehicle.first_registration.strftime("%d%m%Y")
        )

        if timeline_data:
            return JsonResponse({
                "success": True,
                "vin": vin,
                "timeline_html": timeline_data.get("timeline_html"),
            })
        else:
            return JsonResponse({"success": False, "message": "Brak danych dla tego pojazdu."})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})
    

class ServiceEntryListView(generics.ListAPIView):
    """
    Widok do pobierania listy wpisów serwisowych
    """

    serializer_class = ServiceEntrySerializer
    
    def get_queryset(self):
        vin = self.kwargs.get("vin")
        return ServiceEntry.objects.filter(vehicle__vin=vin).order_by('-date')


class ServiceEntryCreateView(generics.CreateAPIView):
    """
    Widok do tworzenia wpisów serwisowych
    """

    serializer_class = ServiceEntrySerializer
    parser_classes = (MultiPartParser, FormParser)


    def create(self, request, *args, **kwargs):
        vin = self.kwargs.get("vin")
        logger.info(f"Creating service entry for VIN: {vin}")
        
        try:
            vehicle = Vehicle.objects.get(vin=vin)
        except Vehicle.DoesNotExist:
            return Response(
                {"success": False, "message": "Nie znaleziono pojazdu o podanym VIN"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Zapisujemy z vehicle
            service_entry = serializer.save(vehicle=vehicle)
            
            return Response({
                "success": True,
                "message": "Wpis serwisowy został dodany pomyślnie",
                "data": ServiceEntrySerializer(service_entry).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success": False,
                "message": "Błąd walidacji danych",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)