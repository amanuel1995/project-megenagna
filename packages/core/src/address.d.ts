/**
 * Ethiopian National Addressing System (ET-NAS) Engine
 * Part of Project Megenagna
 */
import { CodeArea } from './olc.js';
import { RegionMetadata, SubDivisionMetadata } from './constants.js';
export interface MegenagnaAddress {
    countryCode: 'ET';
    regionCode: string;
    regionNameEn: string;
    regionNameAm: string;
    subDivisionCode?: string;
    subDivisionNameEn?: string;
    subDivisionNameAm?: string;
    woreda?: string;
    houseNumber?: string;
    shortCode: string;
    fullCode: string;
    formatted: string;
    latitude: number;
    longitude: number;
    bounds: CodeArea;
}
export interface EncodeOptions {
    regionCode?: string;
    subDivisionCode?: string;
    woreda?: string | number;
    houseNumber?: string;
    codeLength?: number;
}
/**
 * Detects the nearest Ethiopian administrative region and sub-division.
 */
export declare function detectAdminContext(latitude: number, longitude: number): {
    region: RegionMetadata;
    subDivision?: SubDivisionMetadata;
};
/**
 * Creates a standardized Megenagna Address from latitude and longitude.
 */
export declare function fromCoordinates(latitude: number, longitude: number, options?: EncodeOptions): MegenagnaAddress;
/**
 * Parses a Megenagna formatted string (e.g. "ET-AA-LK-W03-8FW4+9X" or "AA-LK-8FW4+9X" or raw "6GW78FW4+9X")
 */
export declare function parseAddress(input: string): MegenagnaAddress;
/**
 * Formats a Megenagna Address into a JSON payload ready for Fayda National ID registration.
 */
export declare function toFaydaPayload(address: MegenagnaAddress): {
    country: 'ETH';
    region_code: string;
    zone_or_subcity_code?: string;
    woreda?: string;
    house_number?: string;
    plus_code_full: string;
    plus_code_short: string;
    latitude: number;
    longitude: number;
    digital_address_standard: 'ET-NAS-1.0';
};
//# sourceMappingURL=address.d.ts.map