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
- **Resolution**: $\sim 14\text{m} \times 14\text{m}$ (10-character code) or $\sim 3\text{m} \times 3\text{m}$ (11-character sub-door code).

### Layer 2: Administrative Hierarchy & Fayda National ID Binding
- Structures addresses into intuitive, human-readable administrative hierarchies:
  $$\mathbf{\text{ET}} - \mathbf{\text{AA}} - \mathbf{\text{LK}} - \mathbf{\text{W03}} - \mathbf{\text{H104}} - \mathbf{\text{8FW4+9X}}$$
  *(Country: Ethiopia $\rightarrow$ Region: Addis Ababa $\rightarrow$ Sub-City: Lemi Kura $\rightarrow$ Woreda: 03 $\rightarrow$ House: 104 $\rightarrow$ Digital Pinpoint Grid)*
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

---

## 🗺️ Project Roadmap

- [x] **Milestone 0**: Problem formulation, case studies, and architectural RFC.
- [x] **Milestone 1**: Core ET-NAS engine, address parser, and OLC algorithm implementation.
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
