# Dokumentacja GaraZero i Spec-Driven Development

Dokumentacja opisuje system GaraZero oraz sposób prowadzenia dalszych prac zgodnie z podejściem Spec-Driven Development (SDD). Jest przeznaczona do migracji do Confluence albo do pracy zespołowej w Microsoft 365 / Google Workspace.

## Poradnik poruszania się

1. [Charakterystyka i zakres produktu](./01-charakterystyka-i-zakres.md)
2. [Analiza interesariuszy i stakeholderów](./02-analiza-interesariuszy.md)
3. [Wymagania funkcjonalne i przypadki użycia](./03-wymagania-funkcjonalne.md)
4. [Wymagania niefunkcjonalne i ograniczenia](./04-wymagania-niefunkcjonalne.md)
5. [Architektura systemu](./05-architektura-systemu.md)
6. [Stos technologiczny i decyzje ADR](./06-stos-technologiczny-i-adr.md)
7. [Kontrakt danych i API](./07-kontrakt-danych-i-api.md)
8. [Dokumentacja operacyjna i wdrożeniowa](./08-operacje-wdrozenie-i-utrzymanie.md)
9. [Testy, jakości i definicje gotowości](./09-jakosc-testy-i-gotowosc.md)
10. [Proces Spec-Driven Development](./10-proces-spec-driven-development.md)

## Podział dokumentów według typu

| Typ dokumentacji Agile | Zastosowanie w projekcie | Lokalizacja |
|---|---|---|
| Product requirements / backlog | Cele, zakres i priorytety funkcji | 01, 02, 03 |
| System and software requirements | Precyzyjne wymagania funkcjonalne i niefunkcjonalne | 03, 04 |
| Architecture / solution design | Diagramy, moduły, przepływy i decyzje | 05, 06 |
| API / data documentation | Modele, relacje i kontrakty REST | 07 |
| End-user / operational documentation | Uruchomienie, konfiguracja i utrzymanie | 08 |
| Test documentation | Strategie, kryteria i raportowanie jakości | 09 |
| SDD process documentation | Workflow spec -> plan -> tasks -> implement | 10 |

## Status i właściciel

- Projekt: GaraZero
- Dokument bazowy: wersja 1.0
- Data: 18 listopada 2026
- Właściciel: zespół projektowy
- Źródła: kod repozytorium, README, Docker Compose i zainicjalizowana konstytucja Spec Kit

## Aktualizowanie dokumentacji

Dokumenty bazowe opisują stan systemu i zasady wspólne. Każdą nową funkcję prowadź w katalogu `specs/<numer>-<nazwa-funkcji>/` z plikami `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` i `tasks.md`. Zmiana architektury musi prowadzić do aktualizacji odpowiedniego ADR. Zmiana wymagania musi prowadzić do aktualizacji wymagań i kryteriów weryfikacji.
