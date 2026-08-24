/**
 * Ethiopian National Addressing System (ET-NAS) Engine
 * Part of Project Megenagna
 */
import { encode, decode, shorten, recoverNearest, isFull, isShort } from './olc.js';
import { ETHIOPIA_REGIONS } from './constants.js';
/**
 * Calculates Euclidean distance between two lat/lng pairs (fast approximation).
 */
function distance(lat1, lng1, lat2, lng2) {
    const dLat = lat1 - lat2;
    const dLng = lng1 - lng2;
    return Math.sqrt(dLat * dLat + dLng * dLng);
}
/**
 * Detects the nearest Ethiopian administrative region and sub-division.
 */
export function detectAdminContext(latitude, longitude) {
    let closestRegion = ETHIOPIA_REGIONS.AA;
    let minRegionDist = Infinity;
    for (const reg of Object.values(ETHIOPIA_REGIONS)) {
        const dist = distance(latitude, longitude, reg.centerLat, reg.centerLng);
        if (dist < minRegionDist) {
            minRegionDist = dist;
            closestRegion = reg;
        }
    }
    let closestSubDiv = undefined;
    if (closestRegion.subcitiesOrZones) {
        let minSubDist = Infinity;
        for (const sub of Object.values(closestRegion.subcitiesOrZones)) {
            const dist = distance(latitude, longitude, sub.centerLat, sub.centerLng);
            if (dist < minSubDist) {
                minSubDist = dist;
                closestSubDiv = sub;
            }
        }
    }
    return {
        region: closestRegion,
        subDivision: closestSubDiv
    };
}
/**
 * Creates a standardized Megenagna Address from latitude and longitude.
 */
export function fromCoordinates(latitude, longitude, options = {}) {
    const codeLength = options.codeLength ?? 10;
    const fullCode = encode(latitude, longitude, codeLength);
    const bounds = decode(fullCode);
    const admin = detectAdminContext(latitude, longitude);
    const region = options.regionCode ? (ETHIOPIA_REGIONS[options.regionCode.toUpperCase()] || admin.region) : admin.region;
    const subDiv = options.subDivisionCode && region.subcitiesOrZones
        ? region.subcitiesOrZones[options.subDivisionCode.toUpperCase()] || admin.subDivision
        : admin.subDivision;
    const refLat = subDiv ? subDiv.centerLat : region.centerLat;
    const refLng = subDiv ? subDiv.centerLng : region.centerLng;
    const shortCode = shorten(fullCode, refLat, refLng);
    let woredaStr = '';
    if (options.woreda !== undefined) {
        const num = String(options.woreda).replace(/^W/i, '').padStart(2, '0');
        woredaStr = `W${num}`;
    }
    const parts = ['ET', region.code];
    if (subDiv)
        parts.push(subDiv.code);
    if (woredaStr)
        parts.push(woredaStr);
    if (options.houseNumber)
        parts.push(`H${options.houseNumber}`);
    parts.push(shortCode);
    const formatted = parts.join('-');
    return {
        countryCode: 'ET',
        regionCode: region.code,
        regionNameEn: region.nameEn,
        regionNameAm: region.nameAm,
        subDivisionCode: subDiv?.code,
        subDivisionNameEn: subDiv?.nameEn,
        subDivisionNameAm: subDiv?.nameAm,
        woreda: woredaStr || undefined,
        houseNumber: options.houseNumber,
        shortCode,
        fullCode,
        formatted,
        latitude: bounds.centerLatitude,
        longitude: bounds.centerLongitude,
        bounds
    };
}
/**
 * Parses a Megenagna formatted string (e.g. "ET-AA-LK-W03-8FW4+9X" or "AA-LK-8FW4+9X" or raw "6GW78FW4+9X")
 */
export function parseAddress(input) {
    if (!input || typeof input !== 'string') {
        throw new Error('Input address must be a valid string');
    }
    const clean = input.trim().toUpperCase();
    // Case 1: Raw Full Open Location Code
    if (isFull(clean)) {
        const bounds = decode(clean);
        return fromCoordinates(bounds.centerLatitude, bounds.centerLongitude);
    }
    // Case 2: Structured Megenagna National Address: ET-AA-LK-W03-8FW4+9X
    const tokens = clean.split('-');
    let regionCode = 'AA';
    let subDivisionCode;
    let woreda;
    let houseNumber;
    let gridCode = '';
    for (const token of tokens) {
        if (token === 'ET')
            continue;
        if (ETHIOPIA_REGIONS[token]) {
            regionCode = token;
            continue;
        }
        if (regionCode && ETHIOPIA_REGIONS[regionCode]?.subcitiesOrZones?.[token]) {
            subDivisionCode = token;
            continue;
        }
        if (/^W\d+$/i.test(token)) {
            woreda = token;
            continue;
        }
        if (/^H\d+$/i.test(token)) {
            houseNumber = token.substring(1);
            continue;
        }
        if (token.includes('+')) {
            gridCode = token;
        }
    }
    if (!gridCode) {
        throw new Error(`No Plus Code found in address string: "${input}"`);
    }
    const region = ETHIOPIA_REGIONS[regionCode] || ETHIOPIA_REGIONS.AA;
    const subDiv = subDivisionCode && region.subcitiesOrZones ? region.subcitiesOrZones[subDivisionCode] : undefined;
    let fullCode = gridCode;
    if (isShort(gridCode)) {
        const refLat = subDiv ? subDiv.centerLat : region.centerLat;
        const refLng = subDiv ? subDiv.centerLng : region.centerLng;
        fullCode = recoverNearest(gridCode, refLat, refLng);
    }
    const bounds = decode(fullCode);
    return fromCoordinates(bounds.centerLatitude, bounds.centerLongitude, {
        regionCode,
        subDivisionCode,
        woreda,
        houseNumber
    });
}
/**
 * Formats a Megenagna Address into a JSON payload ready for Fayda National ID registration.
 */
export function toFaydaPayload(address) {
    return {
        country: 'ETH',
        region_code: address.regionCode,
        zone_or_subcity_code: address.subDivisionCode,
        woreda: address.woreda,
        house_number: address.houseNumber,
        plus_code_full: address.fullCode,
        plus_code_short: address.shortCode,
        latitude: address.latitude,
        longitude: address.longitude,
        digital_address_standard: 'ET-NAS-1.0'
    };
}
//# sourceMappingURL=address.js.map