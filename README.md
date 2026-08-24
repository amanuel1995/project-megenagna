# Project Megenagna (መገናኛ)

<div align="center">

![Project Megenagna](https://img.shields.io/badge/ETHIOPIA-NATIONAL_ADDRESSING_GRID-009A44?style=for-the-badge&logo=google-maps&logoColor=white)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Offline First](https://img.shields.io/badge/Offline-100%25_Resilient-059669.svg)](#the-4-layer-open-hybrid-solution)
[![Fayda Ready](https://img.shields.io/badge/National_ID-Fayda_Compatible-F59E0B.svg)](#layer-2-administrative-hierarchy--fayda-national-id-binding)

**An open-source, offline-first digital addressing and spatial grid infrastructure designed to solve Ethiopia's physical location and addressing bottleneck once and for all.**

[Problem Statement](#the-problem-in-ethiopia) • [The 4-Layer Solution](#the-4-layer-open-hybrid-solution) • [Engineering & Agentic Standards](#engineering--agentic-standards) • [Roadmap](#project-roadmap) • [Contributing](#contributing)

</div>

---

## 🌍 The Problem in Ethiopia

The lack of a structured, nationwide pinpoint street addressing system in Ethiopia is a major structural bottleneck for the country's economic and civil development:

1. **The "Phone-Call-First" Delivery Model**: E-commerce couriers (Deliver Addis, BeU) and ride-hailing drivers (RIDE, Feres, Yango) must call customers repeatedly (*"Where are you standing? Turn left after the bakery behind the church..."*) or exchange live location pins on Telegram/WhatsApp. This adds severe friction, delays, and telecom costs to every transaction.
2. **Emergency Response Delays**: Ambulances, fire engines, and police dispatchers lose critical minutes trying to navigate by informal landmarks.
3. **Financial Inclusion & Civil Administration**: Proving physical residence for banking credit scoring, postal delivery (Ethio Post), tax audits, and civil process serving remains extremely challenging.
4. **Why Traditional Municipal Naming Alone Fails**: Western-style sequential house numbering took over 200 years of heavy municipal infrastructure. Emerging markets cannot wait decades—they need a digital leapfrog approach.

---

## 🏛️ The 4-Layer Open Hybrid Solution

Project Megenagna introduces a **4-Layer Open Hybrid Architecture** tailored specifically for Ethiopia's infrastructure:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 4: Open Developer APIs, Mobile Apps (iOS/And), Web & CLI         │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 3: Physical Municipal Door Plaques & Offline Scannable QR Codes  │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 2: National ID (Fayda) & Administrative Prefix Hierarchy         │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 1: Open-Standard Digital Grid (Open Location Code / Plus Codes)  │
└────────────────────────────────────────────────────────────────────────┘
```

### Layer 1: Open-Standard Digital Grid (The Foundation)
- Powered by **Open Location Code (Plus Codes)** — an open-source, royalty-free, zero-dependency algorithm.
- **100% Offline**: Converts any latitude/longitude coordinate to a digital code and back completely on-device without internet or cellular connectivity.
- **Resolution**: ~14m × 14m (10-character code) or ~3m × 3m (11-character sub-door code).

### Layer 2: Administrative Hierarchy & Fayda National ID Binding
- Structures addresses into intuitive, human-readable administrative hierarchies. Depth is **jurisdiction-aware, not fixed** — Addis Ababa's Woreda absorbed Kebele's role in the 2011 E.C. restructuring ([Addis Ababa City Administration](https://en.wikipedia.org/wiki/Addis_Ababa_City_Administration); [Borkena, 2020](https://borkena.com/2020/10/21/addis-ababa-city-administration-restructuring-new-sub-city/) — accessed 2026-08-24), but Kebele remains the lowest unit everywhere else, including Dire Dawa, Ethiopia's other chartered city ([Dire Dawa City Administration](https://en.wikipedia.org/wiki/Dire_Dawa_City_Administration) — accessed 2026-08-24), and all 10 other regions via `Region → Zone → Woreda → Kebele` ([Subdivisions of Ethiopia](https://en.wikipedia.org/wiki/Subdivisions_of_Ethiopia) — accessed 2026-08-24):
  **`ET-AA-LK-W03-H104-8FW4+9X`**
  *(Country: Ethiopia → Region: Addis Ababa → Sub-City: Lemi Kura → Woreda: 03 → House: 104 → Digital Pinpoint Grid)*

  **`ET-DD-W01-K05-8FW4+9X`**
  *(Country: Ethiopia → Region: Dire Dawa → Woreda: 01 → Kebele: 05 → Digital Pinpoint Grid)*
- Bridges physical coordinates with Ethiopia's **Fayda Biometric National Digital ID** for seamless KYC and residency verification.

### Layer 3: Physical QR-Coded Municipal Door Plaques
- Standardized high-contrast door plates (Civic Blue, Brass, Modern Dark) with bilingual English and Amharic Ge'ez typography.
- Embedded offline-scannable QR codes that instantly open navigation on any smartphone.

### Layer 4: Open Developer APIs, Shared Backend & Cross-Platform Apps
- **Shared Backend**: Unified, high-throughput REST/OpenAPI microservice with PostgreSQL/PostGIS.
- **Mobile Apps (iOS & Android)**: Built with Flutter for offline camera QR scanning and cached vector tile navigation.
- **Web App**: Lightweight Progressive Web App (PWA) with interactive pin geocoding.
- **Administrative CLI**: Batch geocoding and municipal parcel processing.

---

## 📋 Engineering & Agentic Standards

This project follows strict engineering and AI agentic guidelines to maintain production-grade software quality:

- **[AGENTS.md](./AGENTS.md)**: The authoritative single source of truth for all AI coding agents (Claude, Gemini, Cursor, Windsurf, Copilot, Antigravity).
- **[coding_standards.md](./coding_standards.md)**: Engineering playbook covering low-bandwidth resilience, Ethiopian Data Protection Proclamation No. 1321/2024 compliance, and Row Level Security (RLS).
- **[context.md](./context.md)**: In-depth research, architectural rationale, and global case studies (Dubai Makani, India DIGIPIN, GhanaPostGPS).
- **[project_risks.md](./project_risks.md)**: Living risk register tracking architectural and feasibility risks, with status and mitigation paths.
- **[MILESTONE_1_PLAN.md](./MILESTONE_1_PLAN.md)**: Execution plan for the core ET-NAS engine and OLC algorithm implementation.
- **[rfcs/0001-etnas-milestone-1.md](./rfcs/0001-etnas-milestone-1.md)**: Open questions and assumptions for the community to review before the address format stabilizes.

---

## 🗺️ Project Roadmap

- [x] **Milestone 0**: Problem formulation, case studies, and architectural RFC.
- [ ] **Milestone 1**: Core ET-NAS engine, address parser, and OLC algorithm implementation. *(Open Location Code vendored as a submodule; `packages/core` implementation not yet started.)*
- [ ] **Milestone 2**: Shared Backend API service with PostGIS boundary lookups.
- [ ] **Milestone 3**: Interactive Web PWA and live vector door plaque generator.
- [ ] **Milestone 4**: Cross-platform iOS & Android Flutter mobile app with offline camera QR scanner.
- [ ] **Milestone 5**: Fayda National ID e-KYC integration module and municipal batch CLI importer.

---

## 🤝 Contributing

We welcome contributions from software engineers, GIS architects, urban planners, and open-source contributors across Ethiopia and globally!

All development is conducted on feature branches via Pull Requests against `main`. Please read [`AGENTS.md`](./AGENTS.md) and [`coding_standards.md`](./coding_standards.md) before submitting code.

---

## 📄 License

Licensed under the [Apache License 2.0](LICENSE).
