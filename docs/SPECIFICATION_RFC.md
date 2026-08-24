# ET-NAS v1.0: Ethiopian National Addressing Standard
**RFC Specification Document**  
**Status**: Draft Standard Proposal  
**Authors**: Project Megenagna Working Group

---

## 1. Abstract

This RFC defines the syntax, encoding rules, and administrative hierarchy integration for the **Ethiopian National Addressing Standard (ET-NAS)**. ET-NAS establishes a sovereign, open-source, offline-computable addressing scheme that assigns a deterministic, high-resolution (~14m × 14m or ~3m × 3m) digital address to every doorstep and parcel in Ethiopia.

---

## 2. Address Syntax Specification

An ET-NAS address string adheres to the following ABNF format:

```text
ET-NAS-Address   = "ET" "-" Region ["-" SubDivision] ["-" Woreda] ["-" House] "-" GridCode
Region           = 2ALPHA ; (e.g. AA, OR, AM, TG, SO, SI, DD, SN, SW, SR, AF, BG, GA, HA)
SubDivision      = 2*3ALPHA ; (e.g. LK = Lemi Kura, BO = Bole, KR = Kirkos)
Woreda           = "W" 2*3DIGIT ; (e.g. W03, W14)
House            = "H" 1*6ALPHANUM ; (e.g. H104, H204B)
GridCode         = 4*8ALPHANUM ["+" 2*4ALPHANUM] ; Open Location Code (Plus Code)
```

### Examples:
- **Full Standard Format**: `ET-AA-LK-W03-H104-8FW4+9X`
- **Short Colloquial Format**: `AA-LK-W03-8FW4+9X`
- **Global Plus Code Equivalence**: `6GW78FW4+9X`

---

## 3. Fayda National ID Database Integration

For digital identity storage in Ethiopia's **Fayda** biometric registry, addresses are serialized into standardized JSON:

```json
{
  "$schema": "https://megenagna.org/schemas/et-nas-v1.json",
  "country": "ETH",
  "region_code": "AA",
  "zone_or_subcity_code": "LK",
  "woreda": "W03",
  "house_number": "104",
  "plus_code_full": "6GW78FW4+9X",
  "plus_code_short": "8FW4+9X",
  "latitude": 9.020312,
  "longitude": 38.801937,
  "digital_address_standard": "ET-NAS-1.0"
}
```

---

## 4. Offline Navigation & Verification Protocol

1. **Zero-Network Resolution**: The GridCode component (`8FW4+9X` or `6GW78FW4+9X`) maps directly to latitude/longitude without any internet connection or database queries.
2. **Physical QR Code Protocol**: Municipal door plaques contain a QR code encoding a standard Geo URI (`geo:lat,lng`) and HTTPS fallback (`https://plus.codes/<fullCode>`), opening native offline map navigation on any smartphone.
