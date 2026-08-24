# Project Megenagna: System Architecture

Project Megenagna (መገናኛ) is organized as a 4-layer open hybrid system engineered to provide offline-first, sovereign digital addressing for Ethiopia.

```
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Open Developer APIs, CLI, Mobile & Web Apps    │
├─────────────────────────────────────────────────────────┤
│ Layer 3: Physical Municipal Door Plaques & QR Vectors   │
├─────────────────────────────────────────────────────────┤
│ Layer 2: Administrative Hierarchy & Fayda ID Binding    │
├─────────────────────────────────────────────────────────┤
│ Layer 1: Open-Standard Digital Grid (Open Location Code)│
└─────────────────────────────────────────────────────────┘
```

---

## Layer-by-Layer Architectural Breakdown

### 1. Layer 1: The Spatial Grid (`@megenagna/core`)
- **Algorithm**: Open Location Code (OLC / Plus Codes).
- **Properties**:
  - 100% Offline computation (pure trigonometric and base-20 spatial partitioning).
  - No database required for forward (coordinate $\rightarrow$ code) or reverse (code $\rightarrow$ coordinate) conversions.
  - Spatial resolution: 10-character code yields a $\sim 14\text{m} \times 14\text{m}$ area; 11-character code yields a $\sim 3.5\text{m} \times 2.8\text{m}$ sub-door area.

### 2. Layer 2: Administrative Division & National ID Binding
- Integrates Ethiopia's 12 Regional States and 2 Chartered Cities (Addis Ababa & Dire Dawa), Sub-cities, Zones, and Woredas.
- Generates the standard `ET-AA-LK-W03-8FW4+9X` address format.
- Links directly to **Fayda National Digital ID** schema for biometric address verification and e-KYC compliance.

### 3. Layer 3: Physical Municipal Door Plaques (`@megenagna/plaque`)
- Generates precision SVG vectors and printable PDFs for door-side installation.
- Features:
  - High-contrast visual hierarchy (Civic Blue, Brass, Modern Dark, Clean White).
  - Bilingual labeling (English & Amharic Ge'ez script).
  - Offline-scannable QR code matrix linking directly to offline mapping applications.

### 4. Layer 4: Client Apps, APIs, and Ecosystem SDKs
- **Interactive Web App (`apps/web`)**: Real-time map, address generator, Fayda JSON export, and vector plaque download.
- **Developer CLI (`packages/cli`)**: Batch conversion tools for telecom billing, postal logistics, and administrative bulk geocoding.
- **REST / OpenAPI Services**: High-throughput microservice endpoints for ride-hailing and e-commerce integrations.
