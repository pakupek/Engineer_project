from django.utils import timezone
from rest_framework import generics, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import (
    UserRegistrationSerializer, 
    DiscussionSerializer, 
    CommentSerializer,  
    MessageSerializer, 
    MessageCreateSerializer, 
    UserSerializer,
    ChangePasswordSerializer,
    VehicleSerializer,
    VehicleMakeSerializer,
    VehicleModelSerializer,
    VehicleGenerationSerializer,
    VehicleImageSerializer,
    ServiceEntrySerializer,
    DamageEntrySerializer,
    VehicleDeleteSerializer,
    VehicleSaleSerializer,
    ArticleSerializer,
    DiscussionLockSerializer,
    CommentStatsUpdateSerializer,
    DiscussionStatsSerializer,
    EmailSerializer,
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
    ServiceEntry,
    DamageEntry,
    VehicleSale,
    VehicleSaleStats,
    CommentStats,
    DiscussionFavorite,
    DiscussionStats,
    DiscussionImage,
    CommentImage,
)
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.shortcuts import get_object_or_404
from django.http import Http404, JsonResponse, HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import logging, shutil, os, json, requests, django_filters
from rest_framework.exceptions import ValidationError
from django.conf import settings
from bs4 import BeautifulSoup
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from io import BytesIO
from rest_framework.throttling import UserRateThrottle
from django.core.cache import cache
from .pagination import DiscussionPagination
from .filters import DiscussionFilter
from .utils import generate_verification_code
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


User = get_user_model()

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
# Rate limit do 5 zapytań na minute    
class AutomotiveNewsThrottle(UserRateThrottle):
    rate = '5/min'

# Widok do pobrania artykułów motoryzacyjnych
# Cache: 5 minut (300 sek)
CACHE_TIME = 60 * 15
MAX_SUMMARY_LENGTH = 200
class AutomotiveNewsView(generics.GenericAPIView):
    throttle_classes = [AutomotiveNewsThrottle]
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        cache_key = "automotive_news_articles"
        cached_articles = cache.get(cache_key)
        if cached_articles:
            return Response({"articles": cached_articles})

        api_key = getattr(settings, "APITUBE_KEY", None)
        if not api_key:
            return Response(
                {"error": "API key missing"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        url = (
            "https://api.apitube.io/v1/news/everything"
            "?topic.id=industry.automotive_news"
            "&sort.order=desc"
            "&per_page=4"
            "&page=1"
            f"&api_key={api_key}"
        )

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json().get("results", [])
        except requests.RequestException as e:
            # Jeśli API zawiedzie, sprawdzamy cache
            if cached_articles:
                return Response(
                    {"articles": cached_articles, "warning": "Serving cached articles due to API error."}
                )
            return Response(
                {"error": "APITube error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        articles = [
            {
                "id": item.get("id"),
                "title": item.get("title"),
                "summary": item.get("description")[:MAX_SUMMARY_LENGTH] + "..." or item.get("summary")[:MAX_SUMMARY_LENGTH] + "...",
                "image_url": item.get("image") or item.get("thumbnail"),
                "published_at": item.get("published_at") or item.get("published"),
                "url": item.get("href"),
                "source": item.get("source"),
            }
            for item in data
        ]

        serializer = ArticleSerializer(articles, many=True)
        cache.set(cache_key, serializer.data, CACHE_TIME)
        return Response({"articles": serializer.data})

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


class VehicleHistoryPDFView(generics.RetrieveAPIView):
    lookup_field = "vin"
    queryset = Vehicle.objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request, vin, *args, **kwargs):
        try:
            try:
                vehicle = Vehicle.objects.get(vin=vin)
            except Vehicle.DoesNotExist:
                return Response({"error": "Pojazd nie istnieje"}, status=404)

            # Pobierz wpisy serwisowe i uszkodzenia
            service_entries = ServiceEntry.objects.filter(vehicle=vehicle).order_by("-date")
            damage_entries = DamageEntry.objects.filter(vehicle=vehicle).order_by("-date")

            html_string = render_to_string("vehicle_history_pdf.html", {
                "vehicle": vehicle,
                "service_entries": service_entries,
                "damage_entries": damage_entries,
            })

            # Tworzenie PDF w pamięci
            pdf_memory = BytesIO()
            pisa_status = pisa.CreatePDF(
                html_string,
                dest=pdf_memory,
                encoding="UTF-8",
                link_callback=self._link_callback
            )

            if pisa_status.err:
                logger.error("PDF generation error")
                return Response({"error": "Błąd generowania PDF"}, status=500)

            # Zapis PDF do MEDIA/pdf_exports/
            export_dir = os.path.join(settings.MEDIA_ROOT, "pdf_exports")
            os.makedirs(export_dir, exist_ok=True)

            pdf_filename = f"{vin}_historia.pdf"
            pdf_path = os.path.join(export_dir, pdf_filename)

            with open(pdf_path, "wb") as f:
                f.write(pdf_memory.getvalue())

            # Zapis ścieżki PDF do modelu
            vehicle.history_pdf = f"pdf_exports/{pdf_filename}"
            vehicle.save(update_fields=["history_pdf"])

            # Zwracanie PDF użytkownikowi
            pdf_memory.seek(0)
            response = HttpResponse(pdf_memory.getvalue(), content_type="application/pdf")
            response["Content-Disposition"] = f'attachment; filename="{pdf_filename}"'
            return response

        except Exception as e:
            logger.exception("Unexpected server error")
            return Response({"error": str(e)}, status=500)

    def _link_callback(self, uri, rel):
        """
        Callback do obsługi fontów w xhtml2pdf
        """
        # Jeśli to font, zwróć ścieżkę do fonta z polskimi znakami
        if uri.endswith('.ttf'):
            font_path = self._get_polish_font_path()
            if font_path:
                return font_path
        return uri

    def _get_polish_font_path(self):
        """
        Zwraca ścieżkę do fonta z polskimi znakami
        """
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
            "C:/Windows/Fonts/arial.ttf",
            "/Library/Fonts/Arial Unicode.ttf",
        ]
        
        for path in font_paths:
            if os.path.exists(path):
                return path
        return None


class MessageListCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        receiver = self.request.data.get("receiver")
        sale_id = self.request.data.get("sale")  # ← pobieramy ID ogłoszenia

        # 1️Blokada wysyłania wiadomości do siebie
        if str(self.request.user.id) == str(receiver):
            raise ValidationError("Nie możesz wysłać wiadomości do samego siebie.")
        
        # Zapisz wiadomość z przypisanym ogłoszeniem (jeśli istnieje)
        sale_instance = None
        if sale_id:
            try:
                sale_instance = VehicleSale.objects.get(id=sale_id)
            except VehicleSale.DoesNotExist:
                raise ValidationError("Nie znaleziono ogłoszenia o podanym ID.")

        message = serializer.save(sender=self.request.user, sale=sale_instance)

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
    """
    Widok tworzenia dyskusji na forum
    """

    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = DiscussionPagination
    filterset_class = DiscussionFilter
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        discussion = serializer.save(author=self.request.user)
        images = self.request.FILES.getlist('images')
        for img in images[:5]:  # max 5 zdjęć
            DiscussionImage.objects.create(discussion=discussion, image=img)

    
class DiscussionDetailView(generics.RetrieveAPIView):
    """
    Widok pojedynczego wpisu na forum
    """

    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Zwiększanie liczby wyświetleń
        instance.increment_views()
        instance.refresh_from_db(fields=["views"])

        return super().retrieve(request, *args, **kwargs)
    

class LockDiscussionView(generics.UpdateAPIView):
    """
    Widok do zamknięcia dyskusji na forum
    """

    queryset = Discussion.objects.all()
    serializer_class = DiscussionLockSerializer
    permission_classes = [permissions.IsAuthenticated] 
    

    def update(self, request, *args, **kwargs):
        discussion = self.get_object()

        # Tylko autor lub admin może zamknąć dyskusję
        if request.user != discussion.author and not request.user.is_staff:
            return Response({"detail": "Not allowed"}, status=403)

        discussion.locked = True
        discussion.save(update_fields=['locked'])

        serializer = self.get_serializer(discussion)
        return Response(serializer.data)
    

class DiscussionStatsView(generics.UpdateAPIView):
    """
    Widok do głosowania na dyskusje
    """
    serializer_class = DiscussionStatsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        discussion_id = self.kwargs['discussion_id']
        discussion = get_object_or_404(Discussion, id=discussion_id)
        
        vote, created = DiscussionStats.objects.get_or_create(
            discussion=discussion,
            user=self.request.user,
            defaults={'likes': 0, 'dislikes': 0}
        )
        return vote

   
    def patch(self, request, *args, **kwargs):
        vote = self.get_object()
        action = request.data.get('action')
        
        if action not in ['like', 'dislike', 'remove']:
            return Response(
                {"error": "Invalid action. Use 'like', 'dislike' or 'remove'."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if action == 'like':
            vote.likes = 1
            vote.dislikes = 0
        elif action == 'dislike':
            vote.likes = 0
            vote.dislikes = 1
        elif action == 'remove':
            vote.likes = 0
            vote.dislikes = 0

        vote.save()

        discussion = vote.discussion
        discussion.refresh_from_db()

        return Response({
            "success": True,
            "action": action,
            "user_vote": discussion.get_user_vote(request.user),
            "likes_count": discussion.likes_count,
            "dislikes_count": discussion.dislikes_count
        })


class DiscussionFavoriteView(generics.GenericAPIView):
    """
    Widok do dodawania/usuwania z ulubionych
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, discussion_id):
        discussion = get_object_or_404(Discussion, id=discussion_id)
        
        favorite, created = DiscussionFavorite.objects.get_or_create(
            user=request.user,
            discussion=discussion
        )
        
        if not created:
            favorite.delete()
            is_favorited = False
        else:
            is_favorited = True
        
        discussion.refresh_from_db()

        return Response({
            "success": True,
            "is_favorited": is_favorited,
            "favorites_count": discussion.favorites_count
        })


class CommentListCreateView(generics.ListCreateAPIView):
    """
    Widok listy komentarzy i dodawania
    """

    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        discussion_id = self.kwargs["discussion_id"]
        return Comment.objects.filter(discussion_id=discussion_id).order_by("created_at")
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        discussion_id = self.kwargs.get("discussion_id")
        comment = serializer.save(
            author=self.request.user,
            discussion_id=discussion_id  
        )

        # Obsługa zdjęć (maks. 5)
        images = self.request.FILES.getlist('images')
        for img in images[:5]:
            CommentImage.objects.create(comment=comment, image=img)

         # Tworzymy statystyki komentarza, jeśli wymagane
        if not CommentStats.objects.filter(comment=comment, user=self.request.user).exists():
            CommentStats.objects.create(comment=comment, user=self.request.user)

        # Aktualizacja statystyk dyskusji
        discussion = comment.discussion
        discussion.comments_count = Comment.objects.filter(discussion=discussion).count()
        discussion.update_last_activity()
        discussion.save(update_fields=["comments_count", "last_activity"])


class CommentStatsUpdateAPIView(generics.UpdateAPIView):
    """
    Widok do aktualizacja statystyk komentarza
    """

    queryset = CommentStats.objects.all()
    serializer_class = CommentStatsUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'comment_id'


    def get_object(self):
        """
        Pobiera lub tworzy obiekt CommentStats dla użytkownika i komentarza
        """
        comment_id = self.kwargs['comment_id']
        user = self.request.user
        comment = get_object_or_404(Comment, id=comment_id)
        
        stats, created = CommentStats.objects.get_or_create(
            comment=comment,
            user=user,
            defaults={'likes': 0, 'dislikes': 0}
        )
        return stats

    def patch(self, request, *args, **kwargs):
        """
        Obsługa głosowania like/dislike/remove
        """
        stats = self.get_object()
        action = request.data.get('action')
        
        if action not in ['like', 'dislike', 'remove']:
            return Response(
                {"error": "Invalid action. Use 'like', 'dislike' or 'remove'."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Resetujemy oba liczniki przed zastosowaniem nowej akcji
        if action == 'like':
            stats.likes = 1
            stats.dislikes = 0
        elif action == 'dislike':
            stats.likes = 0
            stats.dislikes = 1
        elif action == 'remove':
            stats.likes = 0
            stats.dislikes = 0

        stats.save()

        # Pobieramy zaktualizowany komentarz
        comment = stats.comment
        comment.refresh_from_db()

        return Response({
            "success": True,
            "action": action,
            "user_vote": comment.get_user_vote(request.user),
            "likes_count": comment.likes_count,
            "dislikes_count": comment.dislikes_count,
            "stats": {
                "likes": stats.likes,
                "dislikes": stats.dislikes
            }
        }, status=status.HTTP_200_OK)


class SendVerificationCodeView(generics.CreateAPIView):
    """
    Widok wysyłania kodu weryfikacyjnego
    """

    serializer_class = EmailSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = generate_verification_code()

        # zapis kodu w cache na 5 minut
        cache.set(f'verification_code_{email}', code, 300)

        # wysyłka maila
        send_mail(
            subject="GaraZero: Kod weryfikacyjny",
            message=f"Twój kod weryfikacyjny: {code}",
            from_email=os.getenv("EMAIL_HOST_USER"),
            recipient_list=[email],
        )

        return Response({"message": "Kod weryfikacyjny wysłany"}, status=status.HTTP_200_OK)

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
        model_id = self.request.query_params.get('model')  
        if model_id:
            queryset = queryset.filter(model_id=model_id)
        return queryset

class VehicleImageListCreateView(generics.ListCreateAPIView):
    """
    GET  -> pobiera wszystkie zdjęcia danego pojazdu
    POST -> dodaje nowe zdjęcia dla danego pojazdu
    """
    serializer_class = VehicleImageSerializer
    MAX_IMAGES = 30

    def get_queryset(self):
        vin = self.kwargs['vin']
        return VehicleImage.objects.filter(vehicle__vin=vin)

    def post(self, request, *args, **kwargs):
        vin = self.kwargs['vin']
        vehicle = get_object_or_404(Vehicle, vin=vin)

        files = request.FILES.getlist('images')
        if not files:
            return Response({"detail": "Nie wybrano żadnych plików."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Sprawdź czy nie przekracza limitu
        current_image_count = vehicle.images.count()
        if current_image_count >= self.MAX_IMAGES:
            return Response(
                {"detail": f"Osiągnięto limit {self.MAX_IMAGES} zdjęć dla tego pojazdu."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Sprawdź czy dodanie nowych zdjęć nie przekroczy limitu
        if current_image_count + len(files) > self.MAX_IMAGES:
            available_slots = self.MAX_IMAGES - current_image_count
            return Response(
                {"detail": f"Możesz dodać tylko {available_slots} więcej zdjęć (limit: {self.MAX_IMAGES})."},
                status=status.HTTP_400_BAD_REQUEST
            )

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

    def create(self, request, *args, **kwargs):
        # Sprawdź czy generation jest pustym stringiem i zamień na None
        data = request.data.copy()
        generation_value = data.get('generation')
        
        if generation_value == '' or generation_value == 'null':
            data['generation'] = None
            print("Converted empty generation to None")
        
        # Przekaż poprawione dane do serializera
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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

class VehicleDeleteView(generics.DestroyAPIView):
    """
    DELETE -> usuwa pojazd i wszystkie powiązane dane
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleDeleteSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'vin'

    def get_object(self):
        vin = self.kwargs.get('vin')
        try:
            return Vehicle.objects.get(vin=vin)
        except Vehicle.DoesNotExist:
            raise Http404

    
    def destroy(self, request, *args, **kwargs):
        try:
            vehicle = self.get_object()
            
            # Sprawdź czy użytkownik ma uprawnienia (opcjonalnie)
            if vehicle.owner != request.user:
                return Response(
                    {"error": "Nie masz uprawnień do usunięcia tego pojazdu"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Zbierz informacje przed usunięciem
            vehicle_vin = vehicle.vin
            images_count = vehicle.images.count()
            service_entries_count = vehicle.service_entries.count()
            folder_path = os.path.join(settings.MEDIA_ROOT, 'vehicles', vehicle_vin)
            
            # usuń folder, jeśli istnieje
            if os.path.exists(folder_path):
                shutil.rmtree(folder_path)
            
            # Usuń pojazd (automatycznie usunie powiązane dane przez CASCADE)
            vehicle.delete()
            
            # Zwróć informację o usuniętych danych
            return Response(
                {
                    "message": "Pojazd został pomyślnie usunięty",
                    "deleted_vehicle": vehicle_vin,
                    "deleted_images_count": images_count,
                    "deleted_service_entries_count": service_entries_count,
                    "deleted_at": timezone.now().isoformat()
                },
                status=status.HTTP_200_OK
            )
            
        except Http404:
            return Response(
                {"error": "Nie znaleziono pojazdu o podanym VIN"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Błąd podczas usuwania pojazdu: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

_vehicle_history_cache = {}

def get_vehicle_history(rejestracja, vin, rocznik):
    """
    Zwraca dane historii i danych technicznych pojazdu — z cache lub scrapując.
    """
    if vin in _vehicle_history_cache:
        logger.debug(f"Dane VIN={vin} pobrane z cache.")
        return _vehicle_history_cache[vin]

    historia = VehicleHistory(rejestracja, vin, rocznik, ['--headless', '--no-sandbox'])
    result = historia.search()

    if result:
        _vehicle_history_cache[vin] = result
        logger.debug(f"Zapisano dane VIN={vin} do cache.")
        return result

    logger.warning(f"Nie udało się pobrać danych dla VIN={vin}")
    return None


def parse_timeline_html(html):
    """
    Parsuje HTML osi czasu
    """
    if not html:
        return []

    soup = BeautifulSoup(html, "html.parser")
    timeline = []

    items = soup.select("app-axis-item .item")
    for item in items:
        date_elem = item.select_one(".item-timestamp-text")
        title_elem = item.select_one(".item-content-header")
        detail_elems = item.select(".item-content-details-row")

        date = date_elem.get_text(strip=True) if date_elem else ""
        title = title_elem.get_text(strip=True) if title_elem else ""
        details = {}

        for d in detail_elems:
            key_elem = d.select_one(".item-content-details-row-key")
            value_elem = d.select_one(".item-content-details-row-value")
            if key_elem and value_elem:
                key = key_elem.get_text(strip=True)
                value = value_elem.get_text(strip=True)
                details[key] = value

        timeline.append({
            "date": date,
            "title": title,
            "details": details
        })

    logger.info(f"Sparsowano {len(timeline)} elementów osi czasu.")
    return timeline


def vehicle_history(request, vin):
    """
    Endpoint zwraca dane techniczne i oś czasu pojazdu w JSON.
    """
    try:
        vehicle = Vehicle.objects.filter(vin=vin).first()
        if not vehicle:
            return JsonResponse({
                "success": False,
                "message": "Nie znaleziono pojazdu o podanym VIN."
            })

        # Sprawdź cache lub pobierz 
        data = get_vehicle_history(
            rejestracja=vehicle.registration,
            vin=vehicle.vin,
            rocznik=vehicle.first_registration.strftime("%d%m%Y")
        )

        if not data:
            return JsonResponse({
                "success": False,
                "message": "Nie udało się pobrać danych pojazdu."
            })

        # Parsowanie osi czasu
        timeline = parse_timeline_html(data.get("timeline_html"))
        

        return JsonResponse({
            "success": True,
            "vin": vin,
            "technical_data": data.get("technical_data",{}),
            "timeline": timeline
        })

    except Exception as e:
        logger.error(f"Błąd w endpointcie vehicle_history: {e}", exc_info=True)
        return JsonResponse({
            "success": False,
            "error": str(e)
        })
    

class ServiceEntryView(generics.GenericAPIView):
    """
    - GET: pobranie listy wpisów serwisowych dla danego VIN
    - POST: dodanie nowego wpisu
    - PATCH: edycję istniejącego wpisu
    - DELETE: usunięcie wpisu
    """

    serializer_class = ServiceEntrySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        vin = self.kwargs.get("vin")
        return ServiceEntry.objects.filter(vehicle__vin=vin).order_by("-date")

    # GET
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # POST
    def post(self, request, *args, **kwargs):
        vin = self.kwargs.get("vin")
        logger.info(f"Creating service entry for VIN: {vin}")

        vehicle = get_object_or_404(Vehicle, vin=vin)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
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

    # PATCH
    def patch(self, request, *args, **kwargs):
        vin = self.kwargs.get("vin")
        entry_id = self.kwargs.get("entry_id")

        try:
            entry = ServiceEntry.objects.get(id=entry_id, vehicle__vin=vin)
        except ServiceEntry.DoesNotExist:
            return Response({"success": False, "message": "Nie znaleziono wpisu"}, status=status.HTTP_404_NOT_FOUND)

        old_image_path = None

        if "invoice_image" in request.data:
            if entry.invoice_image:
                old_image_path = entry.invoice_image.path

        serializer = self.get_serializer(entry, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            if old_image_path:
                import os
                if os.path.isfile(old_image_path):
                    os.remove(old_image_path)
                    
            return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)

        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    def delete(self, request, *args, **kwargs):
        vin = self.kwargs.get("vin")
        entry_id = self.kwargs.get("entry_id")

        try:
            entry = ServiceEntry.objects.get(id=entry_id, vehicle__vin=vin)
        except ServiceEntry.DoesNotExist:
            return Response(
                {"success": False, "message": "Nie znaleziono wpisu serwisowego dla podanego VIN i ID"},
                status=status.HTTP_404_NOT_FOUND
            )

       
        if entry.invoice_image:
            image_path = entry.invoice_image.path  

            if os.path.isfile(image_path):
                os.remove(image_path)

        entry.delete()
        return Response(
            {"success": True, "message": "Wpis serwisowy został usunięty"},
            status=status.HTTP_200_OK
        )

        
class DamageEntryView(generics.GenericAPIView):
    """
    Widok obsługujący listę, tworzenie, edycję i usuwanie wpisów o szkodach pojazdu
    """

    serializer_class = DamageEntrySerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        vin = self.kwargs.get("vin")
        return DamageEntry.objects.filter(vehicle__vin=vin).order_by('-date')

    # GET – pobierz listę szkód
    def get(self, request, *args, **kwargs):
        vin = self.kwargs.get("vin")
        entries = self.get_queryset()
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)

    # POST – utwórz nowy wpis
    def post(self, request, *args, **kwargs):
        vin = self.kwargs.get("vin")
        try:
            vehicle = Vehicle.objects.get(vin=vin)
        except Vehicle.DoesNotExist:
            return Response({"error": "Pojazd nie istnieje"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data, context={"vehicle": vehicle, "request": request})
        if serializer.is_valid():
            damage_entry = serializer.save()
            return Response({
                "success": True,
                "message": "Wpis o szkodzie dodany pomyślnie",
                "data": DamageEntrySerializer(damage_entry).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH – aktualizuj wpis
    def patch(self, request, *args, **kwargs):

        entry_id = kwargs.get("entry_id")
        entry = get_object_or_404(DamageEntry, id=entry_id)
        data = request.data.copy()


        markers_data = None
        if "markers" in data:
            try:
                markers_data = json.loads(data["markers"])
            except json.JSONDecodeError:
                pass

        serializer = self.get_serializer(entry, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()

            # Aktualizacja markerów
            if markers_data is not None:
                entry.markers.all().delete()  # usuń stare
                for marker in markers_data:
                    entry.markers.create(
                        x_percent=marker.get("x_percent"),
                        y_percent=marker.get("y_percent"),
                        severity=marker.get("severity"),
                    )
               

            return Response({
                "success": True,
                "message": "Wpis został zaktualizowany",
                "data": self.get_serializer(entry).data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # DELETE – usuń wpis
    def delete(self, request, *args, **kwargs):
        entry_id = kwargs.get("entry_id")
        entry = get_object_or_404(DamageEntry, id=entry_id)
        entry.delete()
        return Response({"success": True, "message": "Wpis o szkodzie został usunięty"}, status=status.HTTP_204_NO_CONTENT)
    


class VehicleSaleFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    make = django_filters.CharFilter(field_name="vehicle__generation__model__make__name", lookup_expr="icontains")
    model = django_filters.CharFilter(field_name="vehicle__generation__model__name", lookup_expr="icontains")

    class Meta:
        model = VehicleSale
        fields = ["price_min", "price_max", "make", "model"]


class VehicleSaleView(generics.ListCreateAPIView):
    queryset = VehicleSale.objects.all().order_by('-created_at')
    serializer_class = VehicleSaleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = VehicleSaleFilter

    def perform_create(self, serializer):
        # Tworzymy ogłoszenie i przypisujemy właściciela
        serializer.save(owner=self.request.user)

        # Oznaczamy pojazd jako wystawiony na sprzedaż
        vehicle = serializer.instance.vehicle
        vehicle.for_sale = True
        vehicle.save()


class VehicleSaleDetailView(generics.RetrieveDestroyAPIView):
    """
    Endpoint do pobierania i usuwania ogłoszenia sprzedaży auta.
    """

    queryset = VehicleSale.objects.all()
    serializer_class = VehicleSaleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # inkrementacja statystyk oglądalności
        stats, created = VehicleSaleStats.objects.get_or_create(sale=instance)
        stats.views += 1
        stats.last_viewed = timezone.now()
        stats.save()

        return super().retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()

        # sprawdzamy, czy użytkownik jest właścicielem ogłoszenia
        if instance.owner != request.user:
            return Response(
                {"detail": "Nie masz uprawnień do usunięcia tego ogłoszenia."},
                status=status.HTTP_403_FORBIDDEN
            )

        # zmieniamy status pojazdu
        vehicle = instance.vehicle
        vehicle.for_sale = False
        vehicle.save()

        instance.delete()
        return Response(
            {"detail": "Ogłoszenie zostało usunięte."},
            status=status.HTTP_204_NO_CONTENT
        )
