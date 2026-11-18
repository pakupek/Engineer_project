# 9. Jakość, testy i definicje gotowości

## 9.1. Piramida testów

| Poziom | Backend | Frontend |
|---|---|---|
| Unit | modele, walidatory i funkcje pomocnicze | komponenty i formatowanie |
| Contract/API | serializer i endpoint DRF | odwołania do API i obsługa odpowiedzi |
| Integration | przepływ JWT, pojazd-historia-giełda | scenariusze formularzy i routingu |
| E2E | Docker Compose + Selenium/Playwright | logowanie, dodanie pojazdu i publikacja oferty |

## 9.2. Kryteria acceptance

Każda historyjka musi:

- mieć jednoznaczne założenia i przypadki niepowodzenia;
- przejść przez testy najpierw niepowodujący wdrożenia;
- spełnić wszystkie kryteria `Given / When / Then`;
- zachować uprawnienia i prywatność danych;
- nie tworzyć nowych migracji bez weryfikacji;
- być udokumentowana w `spec.md`, `plan.md`, `tasks.md` i ewentualnym API contract.

## 9.3. Scenariusze krytyczne

- rejestracja i logowanie;
- wygaszenie access tokenu i odświeżenie;
- dodanie pojazdu z poprawnym i niepoprawnym VIN;
- przypisanie wpisu serwisowego do właściwego pojazdu;
- próba edycji cudzego pojazdu i ogłoszenia;
- przesłanie i pobranie zdjęcia;
- wygenerowanie PDF;
- publikacja i usunięcie ogłoszenia;
- zamknięcie dyskusji i komentarz;
- wysłanie i przeczytanie wiadomości;
- uruchomienie migracji na pustej i istniejącej bazie.

## 9.4. Definition of Done

Funkcja jest ukończona dopiero wtedy, gdy:

- [ ] requirements i user stories są zatwierdzone;
- [ ] plan i ADR nie mają nierozwiązanego konfliktu z konstytucją;
- [ ] testy zostały dodane przed implementacją i przechodzą;
- [ ] uprawnienia i walidacja są wdrożone po stronie serwera;
- [ ] endpointy i dane są opisane w dokumentacji;
- [ ] migracje są bezpieczne i odwracalne lub ich niemożliwość jest udokumentowana;
- [ ] konfiguracja i instrukcja uruchomienia są aktualne;
- [ ] wykonano minimalny smoke test;
- [ ] brak nowych sekretów i wrażliwego contentu w logach;
- [ ] zmiany zebrano w przeglądanym i testowalnym zestawie.
