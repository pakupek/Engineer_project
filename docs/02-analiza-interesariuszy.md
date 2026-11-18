# 2. Analiza interesariuszy

## 2.1. Rejestr interesariuszy

| Interesariusz | Potrzeby | Oczekiwania | Kanał weryfikacji |
|---|---|---|---|
| Właściciel pojazdu | centralna historia pojazdu | kompletność, kontrola danych i prywatność | testy użytkowe, akceptacja |
| Kupujący | wiarygodne informacje o pojeździe | przejrzysta oferta i historia | przegląd ofert i formularz kontaktu |
| Sprzedawca | skuteczne wystawienie pojazdu | łatwa publikacja i informacje o zainteresowaniu | testy procesu dodawania oferty |
| Forum user | wymiana wiedzy i dyskusja | moderacja, powiadomienia i czytelne wątki | scenariusze forum |
| Administrator | utrzymanie jakości i bezpieczeństwa | zarządzanie treściami i kontami | dostęp Django Admin i raporty |
| Zespół developerski | czytelne wymagania i architektura | braki jednoznacznie określone i testowalne | spec/plan/tasks |
| Eksploatator | stabilne środowisko i diagnostyka | konfiguracja, logi i możliwości odtworzenia błędu | dokumentacja operacyjna |

## 2.2. Persony

### Właściciel — Adam

Adam ma kilka pojazdów i chce dodać datę przeglądu, przebieg, zdjęcia i koszty naprawy. Oczekuje, że dane z pierwszego pojazdu nie będą dostępne innym użytkownikom i że może wygenerować PDF.

### Kupujący — Marta

Marta porównuje kilka ofert i chce szybko sprawdzić bazowe dane pojazdu, przebieg, uszkodzenia i wpisy serwisowe. Jej ograniczenie to brak zaufania do ogłoszeń bez informacji o historii.

### Moderator — Jan

Jan potrzebuje zamykać wątek, usuwać nieodpowiednie treści i monitorować zgłoszenia. W wymaganiach MVP mechanizmy kontroli muszą być jednoznacznie powiązane z rolą i uprawnieniem.

## 2.3. Analiza ryzyka interesariuszy

- konflikt wymagania prywatności z potrzebą kupującego pełnej historii;
- niekompletne dane z dokumentów serwisowych;
- możliwość przesłania nieprawdziwych obrazów lub danych;
- nadużywanie funkcji komentarzy i wiadomości;
- utrata danych przy błędnej migracji;
- nieprzewidziane koszty przechowywania plików i mediów.
