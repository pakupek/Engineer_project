# 1. Charakterystyka i zakres produktu

## 1.1. Cel systemu

GaraZero jest aplikacją webową służącą do prowadzenia cyfrowej historii pojazdów, publikowania i wyszukiwania ofert sprzedaży oraz prowadzenia forum społecznościowego dla użytkowników motoryzacyjnych.

## 1.2. Problem biznesowy

Historia pojazdu, napraw i uszkodzeń jest często rozproszona pomiędzy dokumentami, warsztatami i notatkami właściciela. Kupujący mają ograniczony dostęp do rzetelnych danych pojazdu, a sprzedawcy nie mają jednego miejsca do przedstawienia historii i kontaktu z kupującymi.

## 1.3. Zakres MVP

MVP obejmuje:

- rejestrację, logowanie i zarządzanie profilem;
- dodawanie pojazdów z numerem VIN i danymi technicznymi;
- wpisy serwisowe, uszkodzenia i zdjęcia;
- publiczny lub ograniczony do właściciela dostęp do szczegółów pojazdu;
- wystawienie pojazdu na sprzedaż i przeglądanie giełdy;
- wiadomości pomiędzy kupującym a sprzedawcą;
- dyskusje, komentarze, głosy i ulubione wątków;
- generowanie raportu PDF historii pojazdu.

## 1.4. Poza zakresem wersji bazowej

- integracja z państwowymi rejestrami pojazdów;
- płatności i usługi premium;
- pełna moderacja treści oparta o system polityk i eskalacji;
- oceny i reputacja użytkowników;
- powiadomienia push i mobilna aplikacja natywna;
- zaawansowana analityka i rekomendacje sprzedażowe.

## 1.5. Modele użytkowników

| Rola | Zakres |
|---|---|
| Gość | przeglądanie wybranych danych, rejestracja i logowanie |
| Użytkownik | prowadzenie historii pojazdu i uczestnictwo w forum |
| Sprzedawca | publikowanie i zarządzanie ofertami |
| Kupujący | wyszukiwanie ofert i kontakt ze sprzedawcą |
| Administrator | zarządzanie użytkownikami i moderacja treści |

## 1.6. Cele projektowe i wskaźniki sukcesu

- użytkownik może dodać pojazd i pierwszy wpis serwisowy bez pracy technicznej pośrednika;
- 90% testowanych użytkowników kończy dodanie pojazdu bez błędu krytycznego;
- raport PDF pojazdu jest dostępny po co najmniej podstawowych danych serwisowych i uszkodzeniowych;
- funkcje giełdy i forum są dostępne po zalogowaniu zgodnie z polityką uprawnień;
- zmiany API i danych są objęte testami przed wdrożeniem.
