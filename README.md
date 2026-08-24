# Project Megenagna (መገናኛ)

<div align="center">

![Project Megenagna Banner](https://img.shields.io/badge/ETHIOPIA-NATIONAL_ADDRESSING_GRID-009A44?style=for-the-badge&logo=google-maps&logoColor=white)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Offline First](https://img.shields.io/badge/Offline-100%25_Resilient-059669.svg)](#key-features)
[![Fayda Ready](https://img.shields.io/badge/National_ID-Fayda_Compatible-F59E0B.svg)](#layer-2-fayda-national-id-integration)

**An open-source, offline-first digital addressing and spatial grid infrastructure designed to solve Ethiopia's location and physical addressing bottleneck once and for all.**

[Live Web Demo](#quick-start--demo) • [Architecture](docs/ARCHITECTURE.md) • [Tech Stack Trade-offs](docs/TECH_STACK_TRADEOFFS.md) • [ET-NAS Specification](docs/SPECIFICATION_RFC.md) • [Contributing](#contributing)

</div>

---

## 🌍 The Problem

Ethiopia has long suffered from the lack of a structured, nationwide pinpoint street addressing system. Today:
- **E-commerce & Logistics**: Couriers call customers repeatedly (*"Where are you standing? Turn at the bakery..."*) or trade Telegram/WhatsApp pins, inflating delivery times and fuel expenses.
- **Emergency Dispatch**: Ambulances and fire trucks lose critical minutes navigating by vague landmarks.
- **Banking & Civil Identity**: Proof of physical residence for credit scoring and KYC is difficult or subjective.

Traditional municipal street-naming can take decades. **Project Megenagna** solves this by establishing a **4-Layer Open Hybrid Model** combining open digital geo-grids, administrative hierarchies, national ID (Fayda) binding, and physical QR door signage.

---

## 🏛️ The 4-Layer Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 4: Open Developer APIs, CLI, Mobile SDKs & Web Apps             │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 3: Physical Municipal Door Plaques & Scannable QR Codes          │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 2: National ID (Fayda) & Administrative Prefix Hierarchy         │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 1: Open-Standard Digital Grid (Open Location Code / Plus Codes)  │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Layer 1 (Open-Standard Digital Grid)**: Royalty-free, zero-network spatial coordinate math powered by Open Location Code (Plus Codes).
2. **Layer 2 (Administrative & Fayda Binding)**: Human-readable hierarchical prefixes linked to administrative divisions and national identity:
   $$\mathbf{\text{ET}} - \mathbf{\text{AA}} - \mathbf{\text{LK}} - \mathbf{\text{W03}} - \mathbf{\text{H104}} - \mathbf{\text{8FW4+9X}}$$
   *(Country: Ethiopia $\rightarrow$ Region: Addis Ababa $\rightarrow$ Sub-City: Lemi Kura $\rightarrow$ Woreda: 03 $\rightarrow$ House: 104 $\rightarrow$ Digital Pinpoint Grid)*
3. **Layer 3 (Physical Door Plaques)**: Standardized municipal door plates with high-contrast finishes (Civic Blue, Brass, Modern Dark), bilingual English/Amharic typography, and offline-scannable QR codes.
4. **Layer 4 (Ecosystem Tools & APIs)**: Lightweight, offline-first SDKs, command-line utilities, and interactive web maps for logistics, ride-hailing, and emergency dispatch.

---

## 📦 Monorepo Structure

```text
project-megenagna/
├── packages/
│   ├── core/               # @megenagna/core: Zero-dependency TS addressing & OLC engine
│   ├── plaque/             # @megenagna/plaque: SVG & Vector door plaque generator
│   └── cli/                # @megenagna/cli: Command-line tool for encoding & plaques
├── apps/
│   └── web/                # @megenagna/web: Interactive Leaflet map & PWA generator
├── docs/
│   ├── ARCHITECTURE.md     # In-depth system architecture blueprint
│   ├── TECH_STACK_TRADEOFFS.md # Pros and cons of languages, algorithms & databases
│   └── SPECIFICATION_RFC.md    # Ethiopian National Addressing Standard (ET-NAS) v1.0
└── context.md              # Background research, case studies (Dubai, India, Ghana)
```

---

## 🚀 Quick Start & Demo

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/project-megenagna.git
cd project-megenagna

# Install all workspace dependencies
npm install

# Build all packages
npm run build

# Run unit tests
npm test
```

### 2. Launch Interactive Map & Plaque Builder

```bash
npm run dev:web
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Drag the pin across Addis Ababa, Adama, Hawassa, Dire Dawa, Bahir Dar, or Mekelle to see real-time digital address calculation and live SVG plaque preview.

---

## 💻 Command Line Interface (CLI)

```bash
# Encode coordinates to a Megenagna Address
node packages/cli/dist/index.js encode 9.0203 38.8020 --woreda 03 --house 104

# Generate a printable SVG door plaque
node packages/cli/dist/index.js plaque 9.0108 38.7618 --theme civic-blue --output meskel_square.svg

# Generate a Fayda National ID compatible JSON payload
node packages/cli/dist/index.js fayda 8.9778 38.7993

# Parse an existing ET-NAS address string
node packages/cli/dist/index.js parse ET-AA-LK-W03-8FW4+9X
```

---

## ⚡ Tech Stack & Architecture Trade-offs

| Domain | Selected Technology | Why It Was Chosen | Pros & Cons Analysis |
| :--- | :--- | :--- | :--- |
| **Spatial Grid** | **Open Location Code (Plus Codes)** | Open standard, 100% offline, zero royalty fees, native Google Maps compatibility. | [Read Full Analysis](docs/TECH_STACK_TRADEOFFS.md#1-spatial-grid--addressing-algorithm-trade-offs) |
| **Core Engine** | **TypeScript (Zero-dep)** | Runs seamlessly in Browser PWAs, Node, Bun, and Edge runtimes. | [Read Full Analysis](docs/TECH_STACK_TRADEOFFS.md#2-core-engine--multiplatform-language-trade-offs) |
| **Web Client** | **Vite + Leaflet PWA** | Lightweight (<200KB bundle), instant load on 3G mobile devices in Ethiopia. | [Read Full Analysis](docs/TECH_STACK_TRADEOFFS.md#3-web--mobile-client-application-stack) |
| **Door Plaque** | **Pure Vector SVG + QR Code** | Scalable, resolution-independent vector output ready for laser-cutting or printing. | [Read Full Analysis](docs/TECH_STACK_TRADEOFFS.md) |

---

## 🤝 Contributing

We welcome contributions from developers, GIS specialists, civil administrators, and open-source enthusiasts across Ethiopia and around the world!

1. Fork the repo & create your feature branch: `git checkout -b feat/my-new-feature`
2. Commit your changes: `git commit -m "feat: add oromo language transliteration"`
3. Run tests: `npm test`
4. Push to your branch and submit a Pull Request.

---

## 📄 License

This project is licensed under the [Apache License 2.0](LICENSE).
