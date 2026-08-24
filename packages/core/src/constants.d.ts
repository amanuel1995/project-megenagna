/**
 * Ethiopia Administrative Division Codes & Metadata
 * Compliant with Project Megenagna Addressing Standard (ET-NAS)
 */
export interface RegionMetadata {
    code: string;
    nameEn: string;
    nameAm: string;
    nameOm?: string;
    nameTi?: string;
    nameSo?: string;
    centerLat: number;
    centerLng: number;
    subcitiesOrZones?: Record<string, SubDivisionMetadata>;
}
export interface SubDivisionMetadata {
    code: string;
    nameEn: string;
    nameAm: string;
    nameOm?: string;
    centerLat: number;
    centerLng: number;
    defaultWoredasCount?: number;
}
export declare const ETHIOPIA_BOUNDS: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
};
export declare const ADDIS_ABABA_SUBCITIES: Record<string, SubDivisionMetadata>;
export declare const ETHIOPIA_REGIONS: Record<string, RegionMetadata>;
//# sourceMappingURL=constants.d.ts.map