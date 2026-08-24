# Project Megenagna: Architecture & Tech Stack Trade-offs

This document provides a thorough analysis of architecture, spatial indexing algorithms, and technology stack choices for **Project Megenagna (መገናኛ)** — the open-source addressing and digital spatial infrastructure for Ethiopia.

---

## 1. Spatial Grid & Addressing Algorithm Trade-offs

| System / Algorithm | Type | Resolution | Offline Capable | Open Standard & Free | Hierarchical Logic | Evaluation for Ethiopia |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Open Location Code (Plus Codes)** *(Chosen)* | 2D Rectilinear Geo-Grid | ~14m × 14m (10 chars), ~3m × 3m (11 chars) | **Yes (100% Zero-network)** | **Yes (Apache-2.0 / Public Domain)** | **High** (Shortenable relative to local reference points) | ⭐ **Winner**: Native Google Maps support, zero licensing fees, algorithmic offline conversions, proven across emerging markets. |
| **Uber H3** | Hexagonal Discrete Global Grid | Sub-meter to continent | **Yes** | **Yes (Apache-2.0)** | **Medium** (Hexagonal cells don't align with square city parcels) | Best for spatial analytics and heatmaps; suboptimal for human-facing door signs and street plaques. |
| **Google S2 Geometry** | Quad-tree Spherical Hilbert Curve | Dynamic (sub-centimeter to global) | **Yes** | **Yes (Apache-2.0)** | **High** (Bitwise 64-bit integer IDs) | Excellent for spatial indexing in databases; 64-bit integer representations are less friendly for human door signage. |
| **India DIGIPIN** | 4m × 4m Bounding Grid | 4m × 4m (10 chars alphanumeric) | **Yes** | **Yes (Government Open Standard)** | **High** (Integrated with Aadhaar) | Great conceptual inspiration for national ID binding, but OLC has wider global SDK tooling. |
| **what3words** | 3m × 3m Word Triplet | 3m × 3m | **No** (Proprietary dictionary / API) | **No (Heavy Commercial Licensing & Vendor Lock-in)** | **None** (Adjacent squares have completely unrelated words) | ❌ **Rejected**: Unusable for sovereign national public infrastructure due to proprietary lock-in and lack of geographic proximity logic. |

---

## 2. Core Engine & Multiplatform Language Trade-offs

### Option A: TypeScript / JavaScript Core with Zero Dependencies *(Chosen for Primary Web/Node Core)*
- **Pros:**
  - Runs natively in browsers (PWAs), Node.js backends, Edge runtimes (Cloudflare Workers, Deno, Bun), and Electron.
  - Huge developer community in Ethiopia and worldwide.
  - Enables instant offline interactive web applications without WebAssembly startup overhead.
- **Cons:**
  - Slightly lower raw numerical throughput than Rust/C++ for processing billions of bulk records.

### Option B: Rust Core with C-FFI / WASM Bindings *(Recommended for Enterprise High-Throughput & Native Mobile)*
- **Pros:**
  - Maximum possible performance and memory safety.
  - Compiles to native binaries for iOS, Android (via JNI/UniFFI), Python (`pyo3`), WebAssembly (`wasm-pack`), and C/C++.
  - Zero memory footprint for embedded microcontroller / IoT trackers.
- **Cons:**
  - Steeper learning curve for open-source community contributors.
  - Requires build pipelines across multiple architectures (ARM64, x86_64, WASM).

### Option C: Python-Only Core
- **Pros:**
  - Popular in GIS, academic research, and data science teams (GeoPandas, Shapely).
- **Cons:**
  - Cannot run directly in offline mobile browser clients without heavy Pyodide runtimes.

---

## 3. Web & Mobile Client Application Stack

### Option A: Vite + TypeScript + Leaflet PWA *(Current Implementation)*
- **Pros:**
  - Ultra-lightweight initial bundle (< 200 KB gzipped).
  - Fast rendering and smooth performance even on low-spec Android devices and 3G networks.
  - Easy to cache for 100% offline usage as a Progressive Web App (PWA).
- **Cons:**
  - Raster tiles require local caching or vector tile server for offline map rendering at deep zoom levels.

### Option B: Flutter (Cross-Platform Mobile: Android & iOS) *(Recommended for Mobile App)*
- **Pros:**
  - Dominant mobile development framework in Ethiopia's tech ecosystem.
  - Offline vector tile rendering with `flutter_map` or MapLibre.
  - Direct integration with camera for offline QR code door scanning.
  - Seamless offline SQLite / Hive storage for downloaded Woreda/City boundary maps.
- **Cons:**
  - Larger binary size for initial download (~15-25 MB APK).

---

## 4. Backend & API Service Architecture

### Lightweight Microservice / Edge API:
- **Framework**: Hono or Fastify (Node/Bun) or Go (Gin/Fiber).
- **Database**: PostgreSQL + PostGIS (for administrative boundaries, reverse geocoding, and municipal registry storage).
- **Containerization**: Single static Docker container with pre-baked boundary data, requiring zero external internet connection to serve millions of lookups.

---

## 5. Architectural Recommendation Summary

```
                      ┌────────────────────────────────────────┐
                      │        Project Megenagna Ecosystem     │
                      └────────────────────┬───────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
┌────────▼────────┐               ┌────────▼────────┐               ┌────────▼────────┐
│  @megenagna/    │               │  @megenagna/    │               │  @megenagna/    │
│      core       │               │     plaque      │               │       cli       │
│  (TS / Python / │               │  (SVG/Vector    │               │  (Batch Admin   │
│   Rust / Dart)  │               │   Door Plates)  │               │   Tool & POS)   │
└────────┬────────┘               └────────┬────────┘               └─────────────────┘
         │                                 │
         └────────────────┬────────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
┌────────▼────────┐               ┌────────▼────────┐
│    apps/web     │               │   Mobile Apps   │
│ (Offline PWA &  │               │  (Flutter /     │
│ Address Search) │               │   Android APK)  │
└─────────────────┘               └─────────────────┘
```
