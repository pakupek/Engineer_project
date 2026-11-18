# 5. Architektura systemu

## 5.1. Widok kontekstowy

```text
Użytkownik przeglądarki
        |
        v
Next.js frontend
        |
        | REST/JSON + JWT
        v
Django REST API
  |       |       |
  |       |       +--> Celery/Redis
  |       |
  |       +--> Cloudinary / media
  |
  +--> PostgreSQL
```

## 5.2. Moduły aplikacyjne

| Moduł | Odpowiedzialność |
|---|---|
| Konta i profil | użytkownik, JWT, rejestracja, zmiana hasła i avatar |
| Pojazdy | marka, model, generacja, pojazd i własność |
| Historia | wpisy serwisowe, uszkodzenia, zdjęcia i markery |
| Giełda | ogłoszenia pojazdów i filtrowanie |
| Forum | dyskusje, komentarze, głosy i ulubione |
| Wiadomości | konwersacje między użytkownikami |
| Raporty | generowanie PDF historii pojazdu |
| Integracje | wiadomości, wiadomości e-mail i aktualności motoryzacyjne |

## 5.3. Backend

Backend jest modularnym projektem Django:

- `backend/backend/` — konfiguracja projektu i routing globalny;
- `backend/car_history/` — domena i REST API;
- `backend/car_history/models.py` — encje i relacje;
- `backend/car_history/serializers.py` — kontrakty wejścia i wyjścia;
- `backend/car_history/views.py` — przepływy API i uprawnienia;
- `backend/car_history/urls.py` — endpointy;
- `backend/car_history/migrations/` — ewolucja schematu;
- `backend/templates/` i `static/` — raporty i zasoby PDF.

## 5.4. Frontend

Frontend to aplikacja Next.js w `frontend/src/app/`:

- widoki `login`, `register`, `profile` i `messages`;
- moduły pojazdów i historii pojazdu;
- forum i widoki dyskusji;
- giełda i szczegół ogłoszenia;
- moduły `services/api.js` i `services/auth.js` jako warstwa HTTP i JWT;
- komponenty współdzielone i layout.

## 5.5. Kontenerowe środowisko

Docker Compose uruchamia Django, frontend, PostgreSQL, Redis, Celery, Celery Beat i Selenium. Podstawowe funkcje środowiska są zależne od zmiennych środowiskowych i `docker-compose.yml`.

## 5.6. Przepływ autoryzacji

1. Frontend uzyskuje access i refresh token.
2. Access token jest dodawany do nagłówka `Authorization: Bearer <token>`.
3. Backend weryfikuje token i identyfikuje użytkownika.
4. Widok sprawdza uprawnienie do zasobu.
5. Zwraca zasób albo błąd 403/401.
