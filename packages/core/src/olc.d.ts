/**
 * Open Location Code (Plus Codes) Core Algorithm
 * Reference: https://github.com/google/open-location-code
 * Apache-2.0 License
 */
export declare const CODE_ALPHABET = "23456789CFGHJMPQRVWX";
export declare const SEPARATOR = "+";
export declare const SEPARATOR_POSITION = 8;
export declare const PADDING_CHARACTER = "0";
export declare const ENCODING_BASE: number;
export declare const LATITUDE_MAX = 90;
export declare const LONGITUDE_MAX = 180;
export declare const PAIR_CODE_LENGTH = 10;
export declare const GRID_ROWS = 5;
export declare const GRID_COLUMNS = 4;
export declare const MIN_TRIMMED_CODE_LEN = 4;
export interface CodeArea {
    southLatitude: number;
    westLongitude: number;
    northLatitude: number;
    eastLongitude: number;
    centerLatitude: number;
    centerLongitude: number;
    codeLength: number;
}
/**
 * Validates whether the given string is a valid Plus Code.
 */
export declare function isValid(code: string): boolean;
/**
 * Determines if a code is a Full (standalone global) Open Location Code.
 */
export declare function isFull(code: string): boolean;
/**
 * Determines if a code is a Short (relative) Open Location Code.
 */
export declare function isShort(code: string): boolean;
/**
 * Encodes latitude and longitude into an Open Location Code.
 */
export declare function encode(latitude: number, longitude: number, codeLength?: number): string;
/**
 * Decodes an Open Location Code into its bounding CodeArea.
 */
export declare function decode(code: string): CodeArea;
/**
 * Shortens a full Open Location Code relative to a reference coordinate.
 */
export declare function shorten(code: string, referenceLat: number, referenceLng: number): string;
/**
 * Recovers a full Open Location Code from a short code and reference coordinate.
 */
export declare function recoverNearest(shortCode: string, referenceLat: number, referenceLng: number): string;
//# sourceMappingURL=olc.d.ts.map