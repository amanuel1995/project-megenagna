# Project Megenagna — Engineering Playbook & Coding Standards

*Version: 1.0 | Project Megenagna (መገናኛ)*

This document serves as the single source of truth for all engineers, architects, and automated agents working on Project Megenagna. It defines our architectural principles, strict coding conventions, security protocols, and automated workflows.

---

## 1. Engineering Vision & Core Principles

1. **Sovereign, Open, and Royalty-Free:** Project Megenagna is building foundational public digital infrastructure for Ethiopia. No proprietary algorithms, closed dictionaries, or paywalled APIs.
2. **Low-Bandwidth & Offline Resilience:** Telecom coverage across Ethiopia (Ethio Telecom / Safaricom) varies widely. Core address decoding, encoding, shortening, and QR plaque resolution **must work 100% offline without cell service or internet access**.
3. **Data Residency & Privacy Compliance:** In strict adherence to Ethiopia's **Personal Data Protection Proclamation No. 1321/2024**, citizen Fayda biometric identifiers, phone numbers, and physical property ownership records must never be exposed or logged in plaintext.
4. **Bilingual & Multi-Script Support:** All user-facing interfaces, plaques, and mobile tools must natively support Ge'ez script (Amharic, Tigrinya) and Latin script (Afaan Oromoo, Somali, English).

---

## 2. Monorepo & Multiplatform Architecture

```text
                               ┌───────────────────────────────────┐
                               │     Project Megenagna Monorepo    │
                               └─────────────────┬─────────────────┘
                                                 │
            ┌────────────────────────────────────┼────────────────────────────────────┐
            │                                    │                                    │
   ┌────────▼────────┐                  ┌────────▼────────┐                  ┌────────▼────────┐
   │  Web App (PWA)  │                  │ Mobile (iOS/And)│                  │ Shared Backend  │
   │   (apps/web)    │                  │  (apps/mobile)  │                  │  (apps/server)  │
   └────────┬────────┘                  └────────┬────────┘                  └────────┬────────┘
            │                                    │                                    │
            └──────────────────┬─────────────────┴──────────────────┬─────────────────┘
                               │                                    │
                      ┌────────▼────────┐                  ┌────────▼────────┐
                      │ @megenagna/core │                  │@megenagna/plaque│
                      │  (Shared Logic) │                  │  (Vector SVG)   │
                      └─────────────────┘                  └─────────────────┘
```

- **Shared Core (`packages/core`)**: Zero-dependency pure TypeScript/JavaScript library providing the core address math, administrative boundaries, Fayda schemas, and OLC conversion.
- **Shared Backend (`apps/server`)**: Unified REST / OpenAPI & PostGIS service serving Web, iOS, Android, logistics partners (Deliver Addis, BeU, RIDE, Feres, Yango), and emergency dispatchers (911, 907, 939).
- **Web App (`apps/web`)**: Lightweight Progressive Web App with offline caching.
- **Mobile Apps (`apps/mobile`)**: Flutter / Dart cross-platform application for iOS and Android with offline vector tiles and camera QR scanning.
- **Door Plaque Generator (`packages/plaque`)**: SVG/PDF generation engine for municipal door signs.

---

## 3. Git & Branching Conventions

- Follow **Conventional Commits**:
  - `feat`: New feature or user capability
  - `fix`: Bug fix
  - `chore`: Tooling, build, or dependency updates
  - `docs`: Documentation only changes
  - `refactor`: Code refactoring without behavior change
  - `security`: Security enhancement or RLS tightening
  - `perf`: Performance improvement
- **Branch Naming**:
  - `feature/[scope]-[brief-description]` (e.g. `feature/mobile-qr-scanner`, `feature/amharic-transliteration`)
  - `bugfix/[scope]-[issue]` (e.g. `bugfix/subcity-boundary-overlap`)
  - `hotfix/[issue]`
- **Trunk-Based PRs**: Never commit directly to `main`. Open Draft PRs, complete local verification, run subagent audits, and squash-merge.

---

## 4. Backend & Database Guidelines (PostgreSQL / PostGIS / Supabase)

- **Row Level Security (RLS) Mandatory:** Every database table in `public` must explicitly enable RLS:
  ```sql
  ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
  ```
- **Explicit Access Policies:** Define explicit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies for `anon` and `authenticated` roles.
- **Zero Waterfall Queries:** Consolidate complex geospatial lookups into single PostgreSQL RPC functions or spatial PostGIS index queries (`ST_Contains`, `ST_DWithin`).
- **No Sensitive PII in Logs:** Redact phone numbers, national IDs, and exact house ownership metadata from application logs.

---

## 5. Frontend & Mobile Standards

- **Mobile-First Responsive Design:** Prioritize small screens (`< 480px`) and low-DPI displays.
- **Zero Heavy Assets:** Optimize SVG icons, inline critical styles, and compress vector map assets.
- **Strict Typing:** No `any` in TypeScript. Complete type definitions for all API payloads and models.
