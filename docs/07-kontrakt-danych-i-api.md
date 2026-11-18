# 7. Kontrakt danych i API

## 7.1. Główne encje

| Encja | Kluczowe pola i relacje |
|---|---|
| User | e-mail, nazwa, telefon, avatar, relacje pojazdów i wiadomości |
| Vehicle | VIN jako klucz główny, właściciel, generacja, przebieg, data rejestracji, cena |
| VehicleMake | nazwa marki |
| VehicleModel | marka, nazwa modelu |
| VehicleGeneration | model, nazwa, lata produkcji |
| ServiceEntry | pojazd, data, przebieg, opis, koszt, faktura |
| DamageEntry | pojazd, data, opis |
| DamagePhoto | wpis uszkodzenia, obraz |
| DamageMarker | wpis uszkodzenia, współrzędne procentowe, stopień |
| VehicleSale | pojazd, właściciel, tytuł, opis, cena, aktywność |
| Discussion | autor, tytuł, treść, kategoria, liczniki i statusy |
| Comment | dyskusja, autor, treść i reakcje |
| Message | nadawca, odbiorca, ogłoszenie opcjonalne i status odczytu |

## 7.2. Kluczowe endpointy

| Metoda i ścieżka | Funkcja |
|---|---|
| POST `/api/register/` | rejestracja |
| POST `/api/login/` | uzyskanie pary JWT |
| POST `/api/token/refresh/` | odświeżenie tokenu |
| GET/PATCH `/api/profile/` | profil użytkownika |
| GET/POST `/api/vehicles/` | lista i tworzenie pojazdów |
| GET/PATCH/DELETE `/api/vehicles/<vin>/` | szczegóły i zmiana pojazdu |
| GET/POST `/api/service-entry/<vin>/` | historia serwisowa |
| GET/POST `/api/damage-entry/<vin>/` | uszkodzenia |
| GET/POST `/api/sales/` | lista i tworzenie ogłoszeń |
| GET/POST `/api/discussions/` | lista i tworzenie dyskusji |
| GET/POST `/api/discussions/<id>/comments/` | komentarze |
| GET/POST `/api/messages/` | konwersacje i wiadomości |

## 7.3. Zasady kontraktu

- endpointy przyjmują i zwracają JSON, wyjątkiem są przesyłanie plików i raport PDF;
- błąd walidacji zawiera nazwę pola i czytelny komunikat;
- 401 oznacza brak lub nieważność uwierzytelnienia;
- 403 oznacza brak uprawnienia do zasobu;
- 404 nie ujawnia istnienia zasobu, do którego użytkownik nie ma dostępu;
- nieodwracalne usunięcie musi być poprzedzone komunikatem i potwierdzonym wymaganiem;
- DTO/serializery muszą ograniczać pola odczytu i zapisu do wymaganych danych.

## 7.4. Reguły danych

- VIN musi mieć dokładnie 17 znaków i być unikalny;
- pierwszy rekord pojazdu jest własnością użytkownika tworzącego;
- przebieg jest nieujemny i może być porównywany z wpisami serwisowymi;
- cena i koszt używają wartości dziesiętnych;
- wpis serwisowy i uszkodzenie muszą być powiązane z istniejącym pojazdem;
- ogłoszenie może być aktywne tylko dla pojazdu należącego do autora;
- wiadomość może być powiązana z ogłoszeniem albo z użytkownikiem, ale nie może być utworzona bez odbiorcy.
