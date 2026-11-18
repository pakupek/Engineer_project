# 10. Proces Spec-Driven Development

## 10.1. Źródła wiedzy

Dokumentacja jest podzielona analogicznie do typów dokumentacji technicznej używanych w Agile:

- Product documentation: zakres, cele i interesariusze;
- System requirements: wymagania funkcjonalne i niefunkcjonalne;
- Architecture documentation: diagramy, stos i ADR;
- API and data documentation: modele i kontrakty;
- Process documentation: workflow i review;
- User/operational documentation: uruchomienie i utrzymanie;
- Test documentation: kryteria i scenariusze.

## 10.2. Flow Spec Kit

```text
/speckit-constitution
        |
        v
/speckit-specify
        |
        v
/speckit-clarify
        |
        v
/speckit-plan
        |
        v
/speckit-tasks
        |
        v
/speckit-implement
        |
        v
/speckit-analyze
```

## 10.3. Artefakty per-feature

Każda nowa funkcja powinna mieć katalog `specs/<numer>-<nazwa>/`:

```text
specs/001-feature/
├── spec.md
├── research.md
├── plan.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api.md
├── tasks.md
└── checklist.md
```

### spec.md

Opisuje problem, role, user stories, edge cases, wymagania i mierzalne kryteria sukcesu bez implementacji.

### research.md

Rejestruje decyzje potrzebne do pełnego zrozumienia problemu i alternatywy odrzucone.

### plan.md

Przekształca specyfikację na decyzje techniczne, strukturę plików, API i testy.

### data-model.md

Opisywać encje, pola, relacje, ograniczenia i konsekwencje migracji.

### contracts/

Zawiera kontrakt REST, GraphQL lub innych interfejsów zmiennych przez funkcję.

### tasks.md

Lista zadań z ID, ścieżkami plików, zależnościami i podziałem na historie użytkownika.

### checklist.md

Weryfikuje kompletność wymagań, testów i gotowości do analizy.

## 10.4. Role zespołu 3-4 osobowego

| Rola | Odpowiedzialność |
|---|---|
| Product/Requirements Lead | analiza stakeholderów, user stories i acceptance |
| Architecture Lead | plan, ADR, dane i API |
| Backend Lead | Django, migrations, security i testy API |
| Frontend/QA Lead | Next.js, UX, testy i smoke validation |

W zespole 3-osobowym można połączyć Backend i QA albo Architecture i Requirements. Prace powinny być zawsze rejestrowane przez jednego właściciela spec, jednego ownera planu i osobę weryfikującą.

## 10.5. Definition of Ready

Feature jest gotowa do planowania, gdy:

- problem i biznesowe uzasadnienie są jasne;
- role i interesariusze są zidentyfikowani;
- kryteria sukcesu są mierzalne;
- istnieją podstawowe przykłady `Given / When / Then`;
- znane ograniczenia i dependencies są zapisane;
- niepowodzenia i edge cases zostały sklasyfikowane;
- scope MVP i poza zakresem są wyznaczone.

## 10.6. Weryfikacja zgodności

Przed implementacją uruchom `/speckit-analyze`, aby sprawdzić:

- zgodność wymagań z zadaniami;
- zgodność planu z wymaganiami;
- konflikty terminologii;
- brakujące testy i kontrakty;
- niejawne założenia;
- spójność z [konstytucją](../.specify/memory/constitution.md).
