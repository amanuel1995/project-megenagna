# Project Megenagna (መገናኛ)

**Project Megenagna** is an open, modern addressing and spatial grid initiative designed to solve the physical addressing bottleneck in Ethiopia. 

By combining an open-standard digital grid (Google Open Location Code / Plus Codes) with existing administrative hierarchies, national digital identity (Fayda), and physical door plaques, Project Megenagna provides a nationwide, offline-capable, and pinpoint digital address for every doorstep.

---

## The Problem

Ethiopia currently lacks a structured, nationwide pinpoint street addressing system. As a consequence:
- E-commerce and logistics rely on manual phone calls ("Where are you standing?") and live chat location pins.
- Emergency services (ambulances, firefighting) face critical delays navigating by vague landmarks.
- Financial KYC, postal delivery, civil records, and utility dispatch face high friction and operational cost.

---

## The 4-Layer Hybrid Model

```
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Open Developer APIs & Offline Mobile SDKs      │
├─────────────────────────────────────────────────────────┤
│ Layer 3: Physical Municipal Door Plaques (QR + Short ID)│
├─────────────────────────────────────────────────────────┤
│ Layer 2: National ID (Fayda) & Administrative Prefix    │
├─────────────────────────────────────────────────────────┤
│ Layer 1: Open-Standard Digital Grid (Plus Codes / OLC)  │
└─────────────────────────────────────────────────────────┘
```

1. **Layer 1 (Open-Standard Digital Grid)**: Royalty-free, offline-computable spatial coordinates powered by Open Location Code (Plus Codes).
2. **Layer 2 (Administrative & Fayda Binding)**: Human-readable hierarchical prefixes linked to administrative divisions and national identity:
   $$\text{AA} - \text{LK} - \text{W03} - \text{8FW4+9X}$$
   *(Region: Addis Ababa $\rightarrow$ Sub-City: Lemi Kura $\rightarrow$ Woreda: 03 $\rightarrow$ Precise Grid Code)*
3. **Layer 3 (Physical Door Plaques)**: Standardized door plates with Woreda/House numbers, short codes, and offline-scannable QR codes.
4. **Layer 4 (Ecosystem APIs & Tools)**: Open APIs, developer SDKs, and mobile utilities for ride-hailing, e-commerce, banking KYC, and emergency dispatch.

---

## Workspace Structure

- `context.md`: Architectural vision, international case studies, and Ethiopian addressing context.
- `open-location-code/`: Core Google Open Location Code library and multi-language implementations.
