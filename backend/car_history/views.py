from car_history.permissions import IsOwner
from django.utils import timezone
from rest_framework import generics, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import (
    UserRegistrationSerializer, 
    DiscussionSerializer, 
    CommentSerializer,  
    MessageSerializer,  
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
    DamagePhoto,
)
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.shortcuts import get_object_or_404
from django.http import Http404, JsonResponse, HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import logging, shutil, os, json, requests, django_filters, base64
from rest_framework.exceptions import ValidationError
from django.conf import settings
from bs4 import BeautifulSoup
from django.template.loader import render_to_string
from rest_framework.throttling import UserRateThrottle
from django.core.cache import cache
from .pagination import CommentPagination, DiscussionPagination, TenPerPagePagination
from .filters import DiscussionFilter
from django.db.models import F, Prefetch
from .tasks import scrape_vehicle_history, refresh_discussions_cache_task
from celery.result import AsyncResult
from cloudinary.uploader import upload

from django.contrib.staticfiles import finders

logger = logging.getLogger(__name__)


User = get_user_model()

@api_view(["GET"])
def get_verification_code(request):
    email = request.GET.get("email")
    code = cache.get(f'verification_code_{email}')
    return Response({"code": code})

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
            from weasyprint import HTML, CSS
            # Pobierz pojazd
            try:
                vehicle = Vehicle.objects.get(vin=vin)
            except Vehicle.DoesNotExist:
                return Response({"error": "Pojazd nie istnieje"}, status=404)

            # Powiązane dane
            service_entries = ServiceEntry.objects.filter(vehicle=vehicle).order_by("-date")
            damage_entries = DamageEntry.objects.filter(vehicle=vehicle).order_by("-date")

            # Render HTML
            html_string = render_to_string("vehicle_history_pdf.html", {
                "vehicle": vehicle,
                "service_entries": service_entries,
                "damage_entries": damage_entries,
            })

            # CSS dla PDF
            css_path = finders.find("css/pdf_styles.css")

            # Tworzenie PDF
            pdf_file = HTML(string=html_string, base_url=request.build_absolute_uri("")).write_pdf(
                stylesheets=[CSS(filename=css_path)]
            )

            # Zapis PDF do MEDIA
            export_dir = os.path.join(settings.MEDIA_ROOT, "pdf_exports")
            os.makedirs(export_dir, exist_ok=True)

            pdf_filename = f"{vin}_historia.pdf"
            pdf_path = os.path.join(export_dir, pdf_filename)

            with open(pdf_path, "wb") as f:
                f.write(pdf_file)

            vehicle.history_pdf = f"pdf_exports/{pdf_filename}"
            vehicle.save(update_fields=["history_pdf"])

            # Odpowiedź z PDF
            response = HttpResponse(pdf_file, content_type="application/pdf")
            response["Content-Disposition"] = f'attachment; filename=\"{pdf_filename}\""'
            return response

        except Exception as e:
            logger.exception("Unexpected server error")
            return Response({"error": str(e)}, status=500)


class MessageListCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        receiver = self.request.data.get("receiver")
        sale_id = self.request.data.get("sale") 

        # Blokada wysyłania wiadomości do siebie
        if str(self.request.user.id) == str(receiver):
            raise ValidationError("Nie możesz wysłać wiadomości do samego siebie.")
        
        # Zapisz wiadomość z przypisanym ogłoszeniem
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

    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = DiscussionPagination
    filterset_class = DiscussionFilter
    parser_classes = [MultiPartParser, FormParser]

    CACHE_KEY = "discussion_list"
    CACHE_TTL = 30  # czas życia cache w sekundach

    def _fetch_from_db(self):
        """
        Pobiera ogólny queryset z bazy danych (bez prefetch dla użytkownika)
        """
        queryset = Discussion.objects.all().select_related('author').prefetch_related('images')
        return queryset

    def get_queryset(self):
        """
        Pobiera queryset z cache lub z bazy jeśli cache nie istnieje.
        Jeśli cache istnieje, odświeża go w tle.
        Dodaje prefetch specyficzny dla zalogowanego użytkownika.
        """
        cached_queryset = cache.get(self.CACHE_KEY)
        if cached_queryset:
            # Odświeżanie cache w tle
            try:
                refresh_discussions_cache_task.delay()
            except Exception:
                pass
            queryset = cached_queryset
        else:
            # Pobranie danych z bazy i zapis w cache
            queryset = self._fetch_from_db()
            cache.set(self.CACHE_KEY, queryset, self.CACHE_TTL)

        # Prefetch dla zalogowanego użytkownika (votes i favorites)
        request_user = self.request.user
        if request_user.is_authenticated:
            votes_prefetch = Prefetch(
                'comments__votes',
                queryset=CommentStats.objects.filter(user=request_user),
                to_attr='user_votes'
            )
            favorites_prefetch = Prefetch(
                'favorites',
                queryset=DiscussionFavorite.objects.filter(user=request_user),
                to_attr='user_favorites'
            )
            queryset = queryset.prefetch_related(votes_prefetch, favorites_prefetch)

        return queryset

    def perform_create(self, serializer):
        """
        Tworzenie dyskusji wraz z dodawaniem zdjęć
        """
        discussion = serializer.save(author=self.request.user)
        images = self.request.FILES.getlist('images')
        if images:
            images_to_create = [
                DiscussionImage(discussion=discussion, image=img)
                for img in images[:5]
            ]
            DiscussionImage.objects.bulk_create(images_to_create)

        # Po dodaniu nowej dyskusji odśwież cache w tle
        try:
            refresh_discussions_cache_task.delay()
        except Exception:
            pass



    
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
    pagination_class = CommentPagination

    def get_queryset(self):
        discussion_id = self.kwargs["discussion_id"]
        sort = self.request.query_params.get("sort", "recent")

        qs = Comment.objects.filter(discussion_id=discussion_id) \
        .select_related('author') \
        .prefetch_related('votes')

        # FILTRY SORTOWANIA
        if sort == "recent":
            qs = qs.order_by("-created_at")         # najnowsze
        elif sort == "liked":
            qs = qs.order_by("-likes_count")              # najwięcej polubień
        elif sort == "longest":
            qs = qs.order_by('-content_length')              # najdłuższe
        elif sort == "shortest":
            qs = qs.order_by('content_length')             # najkrótsze
        else:
            qs = qs.order_by("-created_at")         # default

        return qs
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        discussion = get_object_or_404(
            Discussion, pk=self.kwargs["discussion_id"]
        )

        if discussion.locked:
            raise ValidationError("Dyskusja jest zamknięta")

        comment = serializer.save(
            author=self.request.user,
            discussion=discussion
        )

        images = self.request.FILES.getlist("images")[:5]
        CommentImage.objects.bulk_create([
            CommentImage(comment=comment, image=img) for img in images
        ])


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
    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        vin = self.kwargs['vin']
        return VehicleImage.objects.filter(vehicle__vin=vin)

    def post(self, request, *args, **kwargs):
        vin = self.kwargs["vin"]
        vehicle = get_object_or_404(Vehicle, vin=vin)

        files = request.FILES.getlist("image")

        if not files:
            return Response(
                {"detail": "Nie wybrano żadnych plików."},
                status=status.HTTP_400_BAD_REQUEST
            )

        current_count = vehicle.images.count()
        remaining = self.MAX_IMAGES - current_count

        if remaining <= 0:
            return Response(
                {"detail": f"Limit {self.MAX_IMAGES} zdjęć został osiągnięty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        uploaded = []

        for file in files[:remaining]:
            if file.size > self.MAX_FILE_SIZE:
                return Response(
                    {"detail": f"{file.name} przekracza 50MB"},
                    status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
                )

            # UPLOAD DO CLOUDINARY
            result = upload(
                file,
                folder=f"vehicles/{vehicle.vin}",
                resource_type="image"
            )

            img = VehicleImage.objects.create(
                vehicle=vehicle,
                image=result["secure_url"]
            )

            uploaded.append(img)

        serializer = self.get_serializer(uploaded, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
     

class VehicleImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    -> pobiera dane zdjęcia pojazdu
    PUT    -> aktualizuje zdjęcie pojazdu
    DELETE -> usuwa zdjęcie pojazdu
    """
    
    serializer_class = VehicleImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Zwracamy tylko zdjęcia należące do wskazanego VIN.
        """
        vin = self.kwargs["vin"]
        return VehicleImage.objects.filter(vehicle__vin=vin)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        new_file = request.FILES.get("image")
        if not new_file:
            return Response(
                {"detail": "Brak pliku 'image'."},
                status=400
            )

        # usuń fizyczny plik
        if instance.image:
            instance.image.delete(save=False)

        instance.image = new_file
        instance.save()

        return Response(self.get_serializer(instance).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # usuń fizyczny plik
        if instance.image:
            instance.image.delete(save=False)

        instance.delete()
        return Response(status=204)




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
    pagination_class = TenPerPagePagination

    def get_queryset(self):
        user = self.request.user
        qs = Vehicle.objects.filter(owner=user).select_related(
            'generation',
            'generation__model',
            'generation__model__make'
        )

        # Pobieranie parametrów GET 
        search = self.request.GET.get("search")
        brand = self.request.GET.get("brand")
        model = self.request.GET.get("model")

        min_price = self.request.GET.get("minPrice")
        max_price = self.request.GET.get("maxPrice")

        min_year = self.request.GET.get("minYear")
        max_year = self.request.GET.get("maxYear")

        sort = self.request.GET.get("sort", "newest")

        # Filtry tekstowe
        if search:
            qs = qs.filter(
                Q(generation__model__make__name__icontains=search) |
                Q(generation__model__name__icontains=search) |
                Q(vin__icontains=search)
            )

        if brand:
            qs = qs.filter(generation__model__make__name__icontains=brand)

        if model:
            qs = qs.filter(generation__model__name__icontains=model)

        # Filtry liczbowe: cena 
        if min_price:
            qs = qs.filter(price__gte=min_price)

        if max_price:
            qs = qs.filter(price__lte=max_price)

        # Filtry lat produkcji 
        if min_year:
            qs = qs.filter(generation__production_start__gte=min_year)

        if max_year:
            qs = qs.filter(generation__production_end__lte=max_year)

        # Sortowanie
        if sort == "newest":
            qs = qs.order_by("-generation__production_start")
        elif sort == "oldest":
            qs = qs.order_by("generation__production_start")
        elif sort == "priceHigh":
            qs = qs.order_by("-price")
        elif sort == "priceLow":
            qs = qs.order_by("price")

        return qs

class VehiclesForSaleListView(generics.ListAPIView):
    """
    Endpoint do pobierania listy pojazdów wystawionych na sprzedaż (/api/vehicles/for-sale/)
    """
    serializer_class = VehicleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Zwraca pojazdy, które mają for_sale=True
        return Vehicle.objects.filter(for_sale=True).select_related('generation', 'generation__model', 'generation__model__make').order_by('-generation__production_start')
    

class VehicleDetailAPI(generics.RetrieveUpdateAPIView):
    """
    Endpoint: /api/vehicles/<vin>/
    
    GET  → pobranie danych pojazdu
    PATCH → częściowa aktualizacja danych pojazdu
    PUT → pełna aktualizacja (opcjonalne)
    """
    permission_classes = [IsAuthenticated, IsOwner]

    serializer_class = VehicleSerializer
    lookup_field = 'vin'

    def get_queryset(self):
        # Tylko pojazdy należące do zalogowanego użytkownika
        return Vehicle.objects.filter(owner=self.request.user).select_related(
            'generation', 'generation__model', 'generation__model__make'
        )

    def patch(self, request, *args, **kwargs):
        """
        Częściowa aktualizacja danych pojazdu
        """
        vehicle = self.get_object()
        serializer = VehicleSerializer(vehicle, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        vehicle = Vehicle.objects.get(vin=vin)
    except Vehicle.DoesNotExist:
        return JsonResponse({"error": "Pojazd nie istnieje"}, status=404)
    
    registration = vehicle.registration
    year = vehicle.first_registration
    if not vin or not year or not registration:
        return JsonResponse({"error": "Brak wymaganych parametrów: vin, year, registration"}, status=400)
    
    # enqueue zadania Celery
    task = scrape_vehicle_history.delay(registration, vin, year)

    return JsonResponse({"status": "queued", "task_id": task.id})
    

def vehicle_history_status(request, task_id):
    """
    Sprawdza status zadania Celery i zwraca dane jeśli gotowe
    """
    task_result = AsyncResult(task_id)

    if task_result.state == "PENDING":
        return JsonResponse({"status": "pending"})
    elif task_result.state == "FAILURE":
        return JsonResponse({"status": "failure", "error": str(task_result.result)}, status=500)
    elif task_result.state == "SUCCESS":
        result = task_result.result
        if not result:
            return JsonResponse({"status": "failure", "error": "Brak wyników"}, status=500)

        timeline = parse_timeline_html(result.get("timeline_html"))
        return JsonResponse({
            "status": "success",
            "vin": result.get("vin"),
            "registration": result.get("registration"),
            "data_rejestracji": result.get("data_rejestracji"),
            "technical_data": result.get("technical_data"),
            "timeline": timeline
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
            entry = ServiceEntry.objects.get(
                id=entry_id,
                vehicle__vin=vin
            )
        except ServiceEntry.DoesNotExist:
            return Response(
                {"success": False, "message": "Nie znaleziono wpisu"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 🔹 Jeśli użytkownik wysyła NOWE zdjęcie → usuń stare
        if "invoice_image" in request.FILES and entry.invoice_image:
            entry.invoice_image.delete(save=False)

        serializer = self.get_serializer(
            entry,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)

        return Response( {"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


    # DELETE
    def delete(self, request, *args, **kwargs):
        vin = self.kwargs.get("vin")
        entry_id = self.kwargs.get("entry_id")

        try:
            entry = ServiceEntry.objects.get(
                id=entry_id,
                vehicle__vin=vin
            )
        except ServiceEntry.DoesNotExist:
            return Response(
                {"success": False, "message": "Nie znaleziono wpisu serwisowego"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 🔹 Usuń plik przez storage (Cloudinary / S3 / local)
        if entry.invoice_image:
            entry.invoice_image.delete(save=False)

        # 🔹 Usuń rekord
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
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # POST – utwórz nowy wpis
    def post(self, request, *args, **kwargs):
        vin = self.kwargs.get("vin")
        vehicle = get_object_or_404(Vehicle, vin=vin)

        serializer = self.get_serializer(data=request.data, context={"vehicle": vehicle, "request": request})
        if serializer.is_valid():
            damage_entry = serializer.save()

            return Response({
                "success": True,
                "message": "Wpis o szkodzie dodany pomyślnie",
                "data": self.get_serializer(damage_entry).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH – aktualizuj wpis
    def patch(self, request, *args, **kwargs):
        entry_id = kwargs.get("entry_id")
        entry = get_object_or_404(DamageEntry, id=entry_id)

        # MARKERY
        markers_data = None
        if "markers" in request.data:
            try:
                markers_data = json.loads(request.data["markers"])
            except json.JSONDecodeError:
                markers_data = []

        # ISTNIEJĄCE ZDJĘCIA
        if "existingPhotos" in request.data:
            try:
                existing_photos_data = request.data["existingPhotos"]
                existing_photos = (
                    json.loads(existing_photos_data)
                    if isinstance(existing_photos_data, str)
                    else existing_photos_data
                )
            except (json.JSONDecodeError, TypeError):
                existing_photos = []
        else:
            existing_photos = list(entry.photos.values("id"))

        existing_photo_ids = [
            p.get("id") for p in existing_photos if p.get("id")
        ]

        serializer = self.get_serializer(entry, data=request.data, partial=True, context={"vehicle": entry.vehicle, "request": request},)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        photos_to_delete = entry.photos.exclude(id__in=existing_photo_ids)

        for photo in photos_to_delete:
            if photo.image:
                photo.image.delete(save=False)

        photos_to_delete.delete()

        # DODAJ NOWE ZDJĘCIA
        for file in request.FILES.getlist("new_photos"):
            DamagePhoto.objects.create(damage_entry=entry, image=file)

        entry = serializer.save()

        # AKTUALIZACJA MARKERÓW
        if markers_data is not None:
            entry.markers.all().delete()
            for marker in markers_data:
                if marker.get("x_percent") is not None and marker.get("y_percent") is not None:
                    entry.markers.create(
                        x_percent=marker["x_percent"],
                        y_percent=marker["y_percent"],
                        severity=marker.get("severity", "drobne"),
                    )

        return Response({
                "success": True,
                "message": "Wpis został zaktualizowany",
                "data": self.get_serializer(entry).data,
            },
            status=status.HTTP_200_OK,
        )


    # DELETE – usuń wpis
    def delete(self, request, *args, **kwargs):
        entry_id = kwargs.get("entry_id")
        entry = get_object_or_404(DamageEntry, id=entry_id)

        try:
            for photo in entry.photos.all():
                if photo.image:
                    photo.image.delete(save=False)

            entry.photos.all().delete()
            entry.delete()

            return Response(
                {
                    "success": True,
                    "message": "Wpis o szkodzie został usunięty",
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error deleting damage entry {entry_id}: {e}", exc_info=True)
            return Response({
                    "success": False,
                    "message": "Błąd podczas usuwania wpisu",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


    


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
