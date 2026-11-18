# GaraZero Constitution

## Core Principles

### I. User-Centered Requirements

Specifications must describe observable behavior and user outcomes without implementation details. Each feature must identify target roles, acceptance scenarios, edge cases, and non-functional requirements where relevant. Technical terminology is allowed only when it affects the design or constraint.

### II. Separation of Concerns

Keep Django REST API behavior, domain models, and persistence in `backend/`; keep Next.js UI, routing, and client-side behavior in `frontend/`. API contracts must be explicit and frontend integrations must use the existing service modules rather than duplicating HTTP setup.

### III. Test-First Delivery (NON-NEGOTIABLE)

For behavior changes, add or update an executable test before implementation and verify that it fails for the missing behavior. Django features require focused model, serializer, view, or integration tests; frontend behavior requires appropriate component or end-to-end coverage when test tooling is available.

### IV. Security and Privacy by Default

Protect authentication, authorization, uploaded media, personal data, and marketplace interactions. Never commit secrets or environment values; validate server-side inputs, enforce object-level permissions, and use parameterized ORM operations. Preserve secure defaults for cookies, CORS, JWT, file handling, and external integrations.

### V. Reliability and Maintainability

Follow existing project patterns and preserve backward compatibility unless a migration or breaking change is explicitly approved. Migrations must be complete and reviewable. Use structured logging and actionable errors; do not silently swallow failures. Keep changes small, documented, and independently verifiable.

## Technical Constraints

- Backend: Python 3.12, Django REST Framework, PostgreSQL, Celery, Redis, and Docker Compose.
- Frontend: Next.js 15, React 19, JavaScript, and existing project dependencies.
- Deployment must remain compatible with the existing Docker-based development setup and environment-variable configuration.
- Infrastructure, database, and dependency changes require corresponding run instructions or migration steps.

## Development Workflow

- Use `/speckit-specify` for requirements, `/speckit-plan` for architecture and implementation decisions, `/speckit-tasks` for executable work items, and `/speckit-implement` for implementation.
- Plans and specifications must identify affected backend and frontend areas, API contracts, data migrations, test coverage, and operational impact.
- Implement the smallest complete slice that satisfies the specification. Run the narrowest relevant test suite before broader validation.
- Before completion, review security, data migration, backward compatibility, and observability implications.

## Governance

This constitution supersedes informal implementation preferences within this repository. Amendments require updating this document, recording the rationale, and reviewing the resulting impact on specifications and plans.

**Version**: 1.0.0 | **Ratified**: 2026-11-18 | **Last Amended**: 2026-11-18
