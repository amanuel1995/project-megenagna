# RFC 0001: ET-NAS Milestone 1 — Open Questions and Assumptions

*Status: Open for comment | Last updated: 2026-08-24*

Milestone 1 builds the core ET-NAS address engine (`packages/core`) — see [MILESTONE_1_PLAN.md](../MILESTONE_1_PLAN.md) for the execution plan. This document is for the **open-source community**, not just the maintainers: it lists every assumption Milestone 1 is about to bake in, why it matters, and an explicit invitation to challenge it before it becomes load-bearing for everything built on top (backend, mobile, physical plaques).

If you have context on any of these — especially local knowledge of Ethiopian administrative structure, addressing conventions, or relevant open datasets — please comment. Assumptions that go unchallenged before Milestone 1 ships become expensive to unwind later, since Layer 3 (physical plaques) and Layer 2 (Fayda binding) both depend on the address format being stable.

---

## 1. Address format grammar (DRAFT v0.1)

**Assumption:** Segment order is `Country-Region-[Zone|SubCity]-Woreda-[Kebele]-House-GridCode`, joined with `-`, e.g. `ET-AA-LK-W03-H104-8FW4+9X`. No checksum or version marker beyond a `formatVersion` field in the parsed object (not in the string itself).

**Why it matters:** These addresses will be hand-copied off physical door plaques (Layer 3) — a context where OLC itself deliberately excludes visually-confusable characters (no `0`, `1`, `I`, `O`, etc. in its alphabet) specifically because transcription errors matter. Our format doesn't yet have an equivalent safeguard.

**Open question:** Should ET-NAS add an in-string checksum or visual marker to catch transcription typos, the way OLC's `+` separator aids visual parsing? Is `-` the right delimiter, or does it collide with negative-number conventions or regional typing habits?

---

## 2. Jurisdiction-aware hierarchy depth is confirmed for 2 of 12 jurisdictions

**Assumption:** `Region → Zone → Woreda → Kebele` for standard regions; `Region → Sub-City → Woreda` for Addis Ababa (Kebele's role absorbed into Woreda in the 2011 E.C. restructuring); `Region → Woreda → Kebele` for Dire Dawa.

**What's actually verified:** Addis Ababa and Dire Dawa specifically, via Wikipedia-sourced research documented in [`project_risks.md`](../project_risks.md) risk #7 (accessed 2026-08-24). Ethiopia's other 9 regions have **not** been individually verified against current zone/woreda structure.

**Why it matters:** Ethiopia's regional structure has changed materially in recent years (Sidama Region split from SNNPR in 2020; South West Ethiopia Peoples' Region formed in 2021; ongoing zone-level changes within Oromia and elsewhere). A hierarchy model correct today may be stale within a year.

**Open question:** Who in the community can confirm current zone-level structure for each of the 9 non-chartered regions? More importantly: how should ET-NAS *version* administrative-boundary changes over time, so an address encoded in 2024 doesn't silently become unparseable — or worse, silently wrong — after a 2026 boundary change?

---

## 3. No confirmed authoritative gazetteer source

**Assumption:** `packages/core` will not embed real region/zone/woreda/kebele names in Milestone 1 — it validates structure only. Real place-name data ("gazetteer") is deferred to Milestone 2's backend.

**Why it matters:** This is the actual reason Milestone 1 stays structural-only: the team does not currently have a vetted, licensable, regularly-updated source of Ethiopian administrative boundary names and codes. Shipping stale or invented data would be worse than shipping none.

**Open question:** Does anyone in the community know of a suitable open dataset — e.g., OCHA's Humanitarian Data Exchange (HDX) Common Operational Datasets for Ethiopia administrative boundaries, or an Ethiopian Statistics Service / CSA release? What's its update cadence, licensing, and how closely does it track the *current* federal structure rather than a historical snapshot?

---

## 4. House-number reliability

**Assumption:** `house` is an **optional** field in the ET-NAS data model, not a required one.

**Why it matters:** `context.md`'s own problem statement documents that most of Ethiopia lacks sequential municipal house numbering — that's precisely the gap this project exists to fill. Treating `house` as required would make the schema unusable for the majority of addresses it needs to serve.

**Open question:** Is optional-by-default the right call, or are there municipal areas (parts of Addis Ababa, other regional capitals) where house numbering is reliable enough that it should be required there specifically? Should "reliability of house numbering" become a per-jurisdiction metadata flag rather than a blanket optional field?

---

## 5. Zero-dependency constraint — runtime only?

**Assumption:** `coding_standards.md`'s zero-dependency mandate applies to runtime dependencies of shared logic (`packages/core`), not to development tooling like a test runner.

**Open question:** Is this the correct reading? If the community intended zero dependencies *at all*, including dev tooling, that changes the testing approach for Milestone 1 significantly (e.g., hand-rolled test harness vs. a standard runner).

---

## 6. Golden tests read the OLC submodule live, not a vendored copy

**Assumption:** Milestone 1's OLC golden tests (`open-location-code/test_data/*.csv`) are read directly from the submodule at its pinned commit, rather than copied into `packages/core/test-fixtures/`.

**Why it matters:** Reading live keeps tests automatically in sync with whatever OLC commit `.gitmodules` points at — but it means `npm test` requires the submodule to be initialized (`git submodule update --init`), adding a setup step that's easy to forget (this is literally the bug fixed in PR #1 of this repo).

**Open question:** Is the sync-with-upstream benefit worth the added setup friction, or should the four CSVs be copied into `packages/core` as static fixtures instead, accepting that they could drift from the submodule over time?

---

## 7. Offline-sync design exists but is unimplemented and untested

**Assumption:** Milestone 1's ET-NAS data model must not implicitly assume online-only writes, even though the actual sync logic (`apps/server`) is Milestone 2 work.

**Context:** The offline-sync conflict-resolution design (field-level Last-Write-Wins on server `updated_at`, no auto-merge on duplicate creates, immutable audit log) was already decided and documented in [`coding_standards.md`](../coding_standards.md) §4 — but has zero implementation or tests behind it yet.

**Open question:** Does anyone see a case where the ET-NAS *data model* itself (not just the sync endpoint) needs to change to support this design — for example, does `EtnasAddress` need its own `updatedAt`/`clientId` fields baked in from Milestone 1, so Milestone 2 isn't retrofitting them?

---

## How to comment

Open a GitHub Discussion or Issue referencing this RFC (`rfcs/0001-etnas-milestone-1.md`) — link TBD once this repository's Discussions are enabled. Until then, comment via Pull Request review on whichever PR introduces this document.
