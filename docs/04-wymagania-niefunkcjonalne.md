# 4. Wymagania niefunkcjonalne i ograniczenia

## 4.1. Wykaz wymagań

| ID | Kategoria | Wymaganie |
|---|---|---|
| NFR-SEC-001 | Bezpieczeństwo | Wszystkie operacje tworzenia, edycji i usunięcia muszą być autoryzowane po stronie serwera. |
| NFR-SEC-002 | Bezpieczeństwo | JWT, klucze API i poświadczenia baz danych nie mogą być przechowywane w repozytorium. |
| NFR-SEC-003 | Bezpieczeństwo | Dane wejściowe muszą być walidowane w serializerach lub formularzach. |
| NFR-SEC-004 | Bezpieczeństwo | CORS musi być ograniczony do znanych originów produkcyjnych i lokalnych. |
| NFR-DATA-001 | Integralność danych | VIN jest unikalnym kluczem pojazdu. |
| NFR-DATA-002 | Integralność danych | Usunięcie właściciela lub pojazdu musi zachowywać spójne relacje i migracje. |
| NFR-PERF-001 | wydajność | Listy i formularze podstawowe powinny reagować w rozsądnym czasie przy typowym obciążeniu MVP. |
| NFR-REL-001 | niezawodność | Operacje obejmujące rekordy zależne powinny być atomowe tam, gdzie częściowy zapis oznacza niespójność. |
| NFR-AVAIL-001 | dostępność | Bazowe środowisko musi być odtwarzalne przez Docker Compose. |
| NFR-OBS-001 | obserwowalność | Błędy serwerowe muszą trafiać do logów z wystarczającym kontekstem i bez ujawniania sekretów. |
| NFR-MAIN-001 | utrzymywalność | Backend i frontend muszą mieć jasno rozdzielone katalogi odpowiedzialności i testy. |
| NFR-COMP-001 | kompatibilność | Interfejs musi działać na współczesnych przeglądarkach desktopowych i mobilnych. |

## 4.2. Ograniczenia architektoniczne

- Django 4.2/DRF i Next.js 15/React 19 są obowiązującymi technologiami bazowymi.
- Dane relacyjne są przechowywane w PostgreSQL.
- Redis i Celery obsługują zadania asynchroniczne.
- Cloudinary albo lokalne media Django mogą przechowywać pliki; wymagany jest bezpieczny i jawny wybór środowiska.
- Docker Compose jest źródłem środowiska developerskiego i integracyjnego.
- Render opisany w konfiguracji projektu jest docelowym wdrożeniem chmurowym, lecz każde wdrożenie musi zostać potwierdzoną decyzją ADR.

## 4.3. Zasady jakości

- kryteria akceptacyjne są testowalne;
- testy regresji obejmują kluczowe przepływy API i UI;
- migracje bazodanowe są testowane przed wdrożeniem;
- brak domyślnych sekretów i danych produkcyjnych;
- zmiany łamiące kontrakt API muszą być opisane i wersjonowane.
