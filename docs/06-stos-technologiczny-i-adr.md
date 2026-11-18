# 6. Stos technologiczny i decyzje architektoniczne

## 6.1. Stos

| Warstwa | Technologia | Rationale |
|---|---|---|
| Backend | Python 3.12, Django 4.2, DRF | szybka budowa REST API i modelowane relacje |
| Frontend | Next.js 15, React 19, JavaScript | routing aplikacyjny i renderowanie interfejsu |
| Baza danych | PostgreSQL 16 | integralność relacyjna i migracje |
| Kolejki | Celery i Redis | zadania asynchroniczne i planowanie |
| Media | Cloudinary lub Django Media | obsługa zdjęć i plików |
| PDF | Django templates/xHTML2PDF lub WeasyPrint | raport historii pojazdu |
| Testy UI | Selenium/Playwright | testy przeglądarkowe i integracyjne |
| Kontenery | Docker/Docker Compose | powtarzalne środowisko developerskie |

## 6.2. ADR-001: Django REST Framework jako backend

- Status: zaakceptowana
- Kontekst: system potrzebuje API dla Next.js, panelu i integracji testowych.
- Decyzja: wykorzystać Django REST Framework.
- Konsekwencje: istniejące modele Django i migracje zapewniają minimalny koszt integracji. DRF wymaga jawnego projektowania uprawnień i serializerów.

## 6.3. ADR-002: PostgreSQL jako baza relacyjna

- Status: zaakceptowana
- Kontekst: pojazdy, użytkownicy, ogłoszenia i historia wymagają spójnych relacji.
- Decyzja: PostgreSQL jest jedyną bazą produkcyjną i bazą developerską.
- Konsekwencje: migracje Django muszą być atomowe i testowane.

## 6.4. ADR-003: Next.js jako warstwa prezentacji

- Status: zaakceptowana
- Kontekst: interfejs ma routing, formularze i integrację REST.
- Decyzja: Next.js pozostaje aplikacją kliencką komunikującą się z Django REST.
- Konsekwencje: zmiana kontraktu API wymaga synchronizacji frontendowych usług i testów.

## 6.5. ADR-004: JWT dla sesji API

- Status: zaakceptowana
- Kontekst: frontend i backend są osobnymi aplikacjami.
- Decyzja: access i refresh JWT są używane przez DRF Simple JWT.
- Konsekwencje: frontend musi obsługiwać odświeżenie i wygaśnięcie tokenu; serwer musi chronić zasoby uprawnieniami.

## 6.6. Proponowane ADR do rozstrzygnięcia

- wybór jednej warstwy przechowywania mediów dla lokalnego i produkcyjnego środowiska;
- strategia zewnętrznego dostawcy e-mail;
- polityka retencji danych i usuwania kont;
- formalizacja limitów API i ochrony przed nadużyciami;
- strategia wersjonowania endpointów;
- standard logowania i monitoringu.
