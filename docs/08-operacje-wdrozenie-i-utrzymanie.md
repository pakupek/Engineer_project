# 8. Dokumentacja operacyjna i wdrożeniowa

## 8.1. Uruchomienie lokalne

W katalogu repozytorium:

```bash
docker compose up --build
```

Usługi:

- frontend: `http://localhost:3000`;
- backend: `http://localhost:8000`;
- PostgreSQL: port `5432`;
- Redis: port `6379`;
- Selenium: port `4444`.

## 8.2. Zmienne środowiskowe

Konfiguracja `.env` musi zawierać co najmniej parametry bazy i integracji. Nie należy commitować wartości sekretów.

Minimum dla środowiska Docker:

- `POSTGRES_DB`;
- `POSTGRES_USER`;
- `POSTGRES_PASSWORD`;
- `POSTGRES_HOST`;
- `POSTGRES_PORT`;
- `CELERY_BROKER_URL`;
- `CELERY_RESULT_BACKEND`;
- klucze integracji dla poczty, Cloudinary i aktualności.

## 8.3. Migracje i start backendu

```bash
docker compose exec django python manage.py migrate
docker compose exec django python manage.py createsuperuser
docker compose exec django python manage.py test
```

Każdą zmianę modelu należy poprzedzić utworzeniem i sprawdzeniem migracji. W produkcji migracje muszą być uruchamiane przed statycznym wdrożeniem nowej wersji API lub jako część kontrolowanego release'u.

## 8.4. Backup i media

- regularnie archiwizuj bazę PostgreSQL;
- podczas backupu zapisz strategię odtwarzania plików i mediów;
- jeśli Cloudinary jest włączony, nie traktuj lokalnego katalogu `media/` jako jednego źródła danych produkcyjnych;
- każda procedura restore musi zostać przetestowana na środowisku nienazzytnym.

## 8.5. Monitoring i troubleshooting

Sprawdź kolejno:

1. status kontenerów;
2. logi Django i Celery;
3. dostępność PostgreSQL i Redis;
4. zmienne `.env`;
5. CORS i origin frontendu;
6. ważność oraz odświeżanie JWT;
7. dostępność Cloudinary i limitów pamięci uploadu.

## 8.6. Runbook incydentu

- zatrzymaj wdrożenie w przypadku niezgodności migracji;
- odtwórz ostatni znany stan aplikacji i danych;
- zarejestruj czas, wpływ i endpoint lub użytkowników dotkniętych incydentem;
- usuń sekret z logów i zmiennych, a następnie obróć poświadczenia;
- po naprawie wykonaj test regresji i potwierdź integralność danych.
