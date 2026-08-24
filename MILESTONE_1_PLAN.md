# Milestone 1 Execution Plan — Core ET-NAS Engine

*Status: Planning | Last updated: 2026-08-24*

This is the internal execution plan for Milestone 1 (`README.md` roadmap): *"Core ET-NAS engine, address parser, and OLC algorithm implementation."* No implementation code exists yet — only the vendored `open-location-code` reference submodule and planning docs. This plan describes what `packages/core` needs to become.

The open questions and assumptions this milestone forces are tracked separately in **[rfcs/0001-etnas-milestone-1.md](./rfcs/0001-etnas-milestone-1.md)**, written for the open-source community to review and challenge — read that alongside this plan, not after it.

---

## 1. Scope

**In scope:** `packages/core` — a zero-dependency TypeScript package implementing:
- (a) OLC encode/decode/shorten/recoverNearest, ported from the reference implementation
- (b) An ET-NAS address parser/formatter for the jurisdiction-aware administrative hierarchy
- (c) Golden tests against the vendored OLC CSV fixtures

**Explicitly out of scope** (deferred to later milestones):
- Gazetteer / real place-name data (region, zone, woreda, kebele names) — Milestone 2 (`apps/server` + PostGIS), once an authoritative data source is vetted (see RFC item 3)
- Fayda National ID integration — Milestone 5
- Any UI — `apps/web` (Milestone 3), `apps/mobile` (Milestone 4)

`packages/core` validates address **format and structure only**. It does not know whether "Lemi Kura" is a real sub-city — that's a data-sourcing problem, not a parsing problem, and conflating the two would make this package neither zero-dependency nor trustworthy without an authoritative name source.

---

## 2. Package scaffold

- `packages/core/package.json` — zero runtime dependencies, per `coding_standards.md` §5 ("Zero Heavy Assets" / project-wide zero-dependency principle for shared logic). A devDependency test runner (e.g. Vitest) is fine — the constraint is runtime, not tooling (flagged for confirmation in the RFC, item 5).
- `packages/core/tsconfig.json` — `strict: true`, no `any`, per `coding_standards.md` §5 and `AGENTS.md` §4.
- File layout mirrors the OLC Go reference's clean separation rather than the JS monolith:
  ```
  packages/core/src/
    olc/
      constants.ts
      encode.ts
      decode.ts
      shorten.ts
      types.ts
    etnas/
      types.ts
      parser.ts
      formatter.ts
    index.ts
  ```

---

## 3. OLC engine — port, not reimplement

Port the algorithm from the vendored reference rather than designing it from scratch:
- **Primary structural reference:** `open-location-code/go/` (`olc.go`, `encode.go`, `decode.go`, `shorten.go`, ~600 lines total) — clean separation, explicit typed structs.
- **Canonical behavior/constants reference:** `open-location-code/js/src/openlocationcode.js` (720 lines) — the most commonly ported-from implementation, confirms exact constants:
  - `CODE_ALPHABET = '23456789CFGHJMPQRVWX'` (20 chars, excludes visually-confusable letters)
  - Separator `+` at position 8
  - `PAIR_CODE_LENGTH = 10` (5 lat/lng digit pairs), then a 4×5 grid refinement for characters 11+
  - `CODE_PRECISION_NORMAL = 10`, `CODE_PRECISION_EXTRA = 11`
  - **Integer arithmetic throughout** — the reference scales lat/lng to integers specifically to avoid floating-point precision bugs. This must be preserved exactly in the TS port; a naive floating-point port will produce boundary-case mismatches against the golden tests.
- **Public API surface to match:** `encode(lat, lng, codeLength)`, `decode(code) → CodeArea`, `shorten(code, lat, lng)`, `recoverNearest(shortCode, refLat, refLng)`, `isValid(code)`, `isShort(code)`, `isFull(code)`.
- **Attribution (Apache-2.0 requirement):** each ported file gets a header comment: `// Derived from Google's open-location-code (Apache-2.0), Copyright 2014 Google Inc.` `packages/core/NOTICE` or its README references the upstream `open-location-code/LICENSE`.

### Golden tests
Load CSVs directly from the submodule path at test time (not copied into `packages/core`), so tests stay pinned to whatever OLC commit `.gitmodules` points at:
| File | Columns | Used for |
|---|---|---|
| `open-location-code/test_data/encoding.csv` | `latitude,longitude,latitudeInt,longitudeInt,codeLength,code` | `encode()` |
| `open-location-code/test_data/decoding.csv` | `code,length,latLo,lngLo,latHi,lngHi` | `decode()` |
| `open-location-code/test_data/shortCodeTests.csv` | `full code,lat,lng,shortcode,test_type` (`R`=recovery, `S`=shorten, `B`=both) | `shorten()` / `recoverNearest()` |
| `open-location-code/test_data/validityTests.csv` | `code,isValid,isShort,isFull` | `isValid()` / `isShort()` / `isFull()` |

Every row in every file must pass. This is a hard gate — see Definition of Done.

---

## 4. ET-NAS address model and parser

Data model reflects the jurisdiction-aware hierarchy finding from [`project_risks.md` risk #7](./project_risks.md):

```ts
interface EtnasAddress {
  formatVersion: '0.1-draft';   // see RFC item 1 — format is not locked yet
  country: 'ET';
  region: string;
  zone?: string;                // present for standard (non-chartered-city) regions
  subCity?: string;              // present for chartered cities (Addis Ababa)
  woreda: string;
  kebele?: string;               // absent only within Addis Ababa (woreda absorbed kebele's role)
  house?: string;                // optional — see RFC item 4, most of Ethiopia lacks sequential numbering
  gridCode: string;              // OLC code, validated via the engine from §3
}
```

Documented invariant: exactly one of `zone` / `subCity` is present; `kebele` is present for every jurisdiction except Addis Ababa woredas.

The parser/formatter operate on **structure and syntax only** — segment count, delimiter (`-`), and grid-code validity (via §3's `isValid`) — never on whether a given region/zone/woreda/kebele name is real. No embedded gazetteer, per the scope decision in §1.

Round-trip requirement: `parse(format(x)) === x` for both worked examples already published in `README.md` / `context.md`:
- Addis Ababa: `ET-AA-LK-W03-H104-8FW4+9X`
- Dire Dawa: `ET-DD-W01-K05-8FW4+9X`

---

## 5. CI wiring

`.github/workflows/ci.yml` currently only verifies submodule checkout (added in PR #2, with the explicit note "Build/lint/test jobs land once a package.json exists"). Once `packages/core/package.json` exists, add a real job: install → lint → typecheck → test (including the golden-test suite from §3).

---

## 6. Definition of Done

- [ ] All four OLC golden-test CSVs pass at 100% against the TS port.
- [ ] ET-NAS parser round-trips both worked examples (Addis Ababa and Dire Dawa forms) exactly.
- [ ] `packages/core` has zero runtime dependencies and passes `strict: true` / no-`any` typecheck.
- [ ] CI job (`.github/workflows/ci.yml`) runs install/lint/typecheck/test on every PR touching `packages/core`.
- [ ] `rfcs/0001-etnas-milestone-1.md` has been open for community comment for a stated minimum window before the address format moves from `0.1-draft` toward a stable version (the window length is itself unresolved — see RFC item 1).
