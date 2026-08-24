# Project Megenagna — Risk Register

*Last reviewed: 2026-08-24*

This document tracks the architectural and feasibility risks identified for the 4-Layer Open Hybrid Model described in [`README.md`](./README.md) and [`context.md`](./context.md). It is a living document — update status and mitigation as the project progresses, do not let it silently go stale.

| # | Risk | Layer | Severity | Status |
|---|------|-------|----------|--------|
| 1 | Fayda ID integration is an external institutional dependency | 2 | Critical | Open |
| 2 | Physical plaque rollout requires municipal enforcement/funding | 3 | High | Open |
| 3 | Adoption is chicken-and-egg without an anchor partner or mandate | 3/4 | High | Open |
| 4 | Roadmap overstated implementation status vs. actual repo state | Docs | Low | **Resolved** |
| 5 | Offline-sync conflict resolution was undesigned | 4 | Medium | **Resolved** |
| 6 | Multilingual/Ge'ez script scope is non-trivial and unbudgeted | 3/4 | Medium | Open |

---

## 1. Fayda National ID Integration (Critical, Open)

**Risk:** The entire Layer 2 design assumes API/data access to Ethiopia's Fayda biometric national ID system, operated externally under active Proclamation No. 1321/2024 constraints. No engineering effort within this repository de-risks this — it is a partnership and data-access question, not a technical one.

**Why it matters:** Without Fayda binding, addresses lose their legal-identity anchor and Layer 2 of the architecture cannot ship as designed.

**Mitigation path:** Not resolvable in-repo. Requires confirmation of institutional access (a signed data-sharing agreement or sandbox API access with Ethiopia's National ID Program) before Milestone 5 work begins. Track this as a go/no-go gate, not a backlog item.

---

## 2. Physical Plaque Rollout Requires Municipal Enforcement (High, Open)

**Risk:** `context.md` §3 documents GhanaPostGPS's failure mode: a digital grid without top-down installation enforcement sees poor adoption. Makani (Dubai) succeeded because the government mandated and funded installation. No public-sector sponsor or funding path is currently named for Layer 3 rollout.

**Why it matters:** Without a named installer/funder (a city administration, Ethio Post, or similar), Layer 3 risks becoming a spec with no path to physical reality.

**Mitigation path:** Identify and confirm a municipal or postal partner before committing engineering resources to `packages/plaque` beyond a working generator. Consider a pilot-neighborhood approach (e.g. one sub-city in Addis Ababa) before national rollout claims.

---

## 3. Adoption Is Chicken-and-Egg (High, Open)

**Risk:** Value only appears once addresses exist (plaques + grid) *and* logistics/dispatch platforms (Deliver Addis, BeU, RIDE, Feres, Yango, emergency dispatch) integrate the Layer 4 APIs. Without a mandate or an anchor adopter, this repeats the adoption problem the project's own docs use to critique what3words for civic use.

**Mitigation path:** Secure at least one committed anchor integration partner (a delivery/ride-hailing company or a dispatch service) before or alongside Milestone 3, so Layer 4 APIs have a real consumer from day one instead of shipping into a vacuum.

---

## 4. Roadmap/Reality Gap — RESOLVED

**Risk:** `README.md`'s roadmap marked Milestone 1 ("Core ET-NAS engine, address parser, and OLC algorithm implementation") as complete, but no `packages/core` implementation exists in the repository — only the vendored `open-location-code` reference submodule and planning docs.

**Resolution:** Milestone 1 checkbox corrected to unchecked in `README.md`, with a note clarifying that only the OLC submodule is in place and the core engine implementation has not started. Roadmap now reflects actual repo state.

---

## 5. Offline-Sync Conflict Resolution — RESOLVED

**Risk:** `coding_standards.md` referenced "offline-sync endpoints" without defining what happens when a mobile client edits an address offline and the PostGIS backend has a conflicting edit — a real design gap given address records carry legal-identity weight via Fayda binding.

**Resolution:** Design decision documented in `coding_standards.md` §4 ("Offline-Sync Conflict Resolution"):
- Field-level edits resolve via **Last-Write-Wins on server-authoritative `updated_at`** (wall-clock sufficient; no HLC needed given low edit concurrency).
- Duplicate creates (same physical location registered twice while offline) are **never auto-merged** — a `(grid_code, house_number)` uniqueness constraint routes collisions to manual review.
- Every rejected write and manual resolution is appended to an **immutable audit log**, satisfying Proclamation No. 1321/2024's requirement that legal address data is never silently lost or overwritten.

This is a design decision, not yet implemented code — re-verify it against the real `apps/server` implementation once Milestone 2 begins.

---

## 6. Multilingual / Ge'ez Script Scope (Medium, Open)

**Risk:** UI, plaques (laser-cut/print), and mobile apps must natively support Ge'ez script (Amharic, Tigrinya) alongside Latin script (Afaan Oromoo, Somali, English). This is real font-rendering, translation, and print-production scope — not a standard i18n pass — especially for low-end Android devices and physical signage production.

**Mitigation path:** Budget explicit design/localization effort for Ge'ez typography (web font selection, print-safe vector fonts for `packages/plaque`, and professional translation) rather than treating it as a string-table exercise during Milestone 3/4.
