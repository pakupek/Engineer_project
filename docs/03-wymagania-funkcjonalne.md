# 3. Wymagania funkcjonalne i przypadki użycia

## 3.1. Zarządzanie kontem

| ID | Wymaganie |
|---|---|
| FR-AUTH-001 | System musi umożliwiać rejestrację użytkownika z unikalnym e-mailem i nazwą użytkownika. |
| FR-AUTH-002 | System musi uwierzytelniać użytkownika przy użyciu access i refresh JWT. |
| FR-AUTH-003 | Użytkownik musi móc wyświetlić i zaktualizować dane profilu oraz zdjęcie. |
| FR-AUTH-004 | Użytkownik musi móc zmienić hasło po wcześniejszym uwierzytelnieniu. |
| FR-AUTH-005 | Serwer musi odrzucać operacje wymagające logowania dla tokenu nieważnego lub wygasłego. |

## 3.2. Historia pojazdu

| ID | Wymaganie |
|---|---|
| FR-VIN-001 | Właściciel musi móc utworzyć pojazd z unikalnym VIN składającym się z 17 znaków. |
| FR-VIN-002 | Pojazd musi być powiązany z właścicielem i opcjonalną marką, modelem i generacją. |
| FR-VIN-003 | Użytkownik musi móc edytować dane pojazdu oraz usuwać pojazd, którego jest właścicielem. |
| FR-VIN-004 | Właściciel musi móc dodawać, edytować i usuwać wpisy serwisowe z datą, przebiegiem i kosztami. |
| FR-VIN-005 | Właściciel musi móc dodawać wpisy uszkodzeń, zdjęcia i markery lokalizacji uszkodzenia. |
| FR-VIN-006 | System musi wygenerować PDF zawierający dane pojazdu, wpisy serwisowe i uszkodzenia. |

## 3.3. Giełda pojazdów

| ID | Wymaganie |
|---|---|
| FR-SALE-001 | Właściciel musi móc wystawić pojazd na sprzedaż z tytułem, opisem i ceną. |
| FR-SALE-002 | Właściciel musi móc zmieniać aktywność i usuwać własne ogłoszenie. |
| FR-SALE-003 | Użytkownik musi móc filtrować i przeglądać aktywne ogłoszenia. |
| FR-SALE-004 | System musi zablokować możliwość zarządzania ogłoszeniem przez użytkownika niebędącego właścicielem. |
| FR-SALE-005 | Kupujący musi móc rozpocząć rozmowę dotyczącą konkretnego ogłoszenia. |

## 3.4. Forum i wiadomości

| ID | Wymaganie |
|---|---|
| FR-FORUM-001 | Użytkownik musi móc utworzyć, przeglądać i filtrować dyskusje. |
| FR-FORUM-002 | Użytkownik musi móc dodawać komentarze do dyskusji. |
| FR-FORUM-003 | Użytkownik może oddać głos lub oznaczyć dyskusję jako ulubioną. |
| FR-FORUM-004 | Administrator lub uprawniony użytkownik może zamknąć dyskusję. |
| FR-FORUM-005 | Użytkownik musi móc wysłać wiadomość, przeglądać konwersację i oznaczać wiadomości jako przeczytane. |

## 3.5. Przypadki użycia priorytetowe

### UC-01 Dodanie pojazdu

1. Użytkownik loguje się.
2. Otwiera formularz pojazdu.
3. Podaje VIN i dane pojazdu.
4. System waliduje długość VIN i unikalność.
5. System zapisuje pojazd i pokazuje go na liście własnych pojazdów.

### UC-02 Dodanie historii serwisowej

1. Właściciel wybiera pojazd.
2. Dodaje datę, przebieg, opis i opcjonalnie fakturę.
3. System zapisuje wpis i aktualizuje widok historii.
4. W przypadku błędu system pokazuje czytelny komunikat i nie zapisuje danych częściowo.

### UC-03 Publikacja i kontakt dotyczący ogłoszenia

1. Właściciel wybiera pojazd i wystawia ogłoszenie.
2. Kupujący przegląda aktywną ofertę.
3. Kupujący wysyła wiadomość powiązaną z ogłoszeniem.
4. Sprzedawca widzi konwersację i może odpowiedzieć.

## 3.6. Edge cases

- VIN zawiera mniej lub więcej niż 17 znaków;
- VIN już istnieje w systemie;
- użytkownik próbuje edytować cudzy pojazd lub ogłoszenie;
- przeglądarka przesyła nieobsługiwany typ pliku;
- plik przekracza limit pamięci lub rozmiaru;
- token wygasł podczas żądania;
- wpis serwisowy ma przebieg niższy niż poprzedni;
- dyskusja jest zamknięta;
- wiadomość jest kierowana do użytkownika z nieistniejącym ogłoszeniem;
- PDF nie może zostać wygenerowany z powodu uszkodzonych danych lub braku zasobów.
