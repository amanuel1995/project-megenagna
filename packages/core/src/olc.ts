/**
 * Open Location Code (Plus Codes) Core Algorithm
 * Reference: https://github.com/google/open-location-code
 * Apache-2.0 License
 */

export const CODE_ALPHABET = '23456789CFGHJMPQRVWX';
export const SEPARATOR = '+';
export const SEPARATOR_POSITION = 8;
export const PADDING_CHARACTER = '0';
export const ENCODING_BASE = CODE_ALPHABET.length;
export const LATITUDE_MAX = 90;
export const LONGITUDE_MAX = 180;
export const PAIR_CODE_LENGTH = 10;
export const GRID_ROWS = 5;
export const GRID_COLUMNS = 4;
export const MIN_TRIMMED_CODE_LEN = 4;

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
export function isValid(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  const clean = code.trim().toUpperCase();

  const sepIdx = clean.indexOf(SEPARATOR);
  if (sepIdx === -1) return false;
  if (clean.lastIndexOf(SEPARATOR) !== sepIdx) return false;
  if (sepIdx % 2 !== 0 || sepIdx > SEPARATOR_POSITION) return false;

  // Check padding
  const padIdx = clean.indexOf(PADDING_CHARACTER);
  if (padIdx > -1) {
    if (padIdx === 0) return false;
    if (padIdx % 2 !== 0) return false;
    if (padIdx > SEPARATOR_POSITION) return false;
    const padding = clean.slice(padIdx, sepIdx);
    if (!/^[0]+$/.test(padding)) return false;
    if (clean.length > sepIdx + 1) return false; // No chars after + if padded
  }

  // Check characters
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (ch === SEPARATOR || ch === PADDING_CHARACTER) continue;
    if (CODE_ALPHABET.indexOf(ch) === -1) return false;
  }

  return true;
}

/**
 * Determines if a code is a Full (standalone global) Open Location Code.
 */
export function isFull(code: string): boolean {
  if (!isValid(code)) return false;
  const clean = code.trim().toUpperCase();
  const sepIdx = clean.indexOf(SEPARATOR);
  return sepIdx === SEPARATOR_POSITION;
}

/**
 * Determines if a code is a Short (relative) Open Location Code.
 */
export function isShort(code: string): boolean {
  if (!isValid(code)) return false;
  const clean = code.trim().toUpperCase();
  const sepIdx = clean.indexOf(SEPARATOR);
  return sepIdx >= 0 && sepIdx < SEPARATOR_POSITION;
}

function clipLatitude(lat: number): number {
  return Math.min(90, Math.max(-90, lat));
}

function normalizeLongitude(lng: number): number {
  while (lng < -180) lng += 360;
  while (lng >= 180) lng -= 360;
  return lng;
}

function computeLatitudePrecision(codeLength: number): number {
  if (codeLength <= 10) {
    return Math.pow(20, Math.floor(codeLength / -2 + 2));
  }
  return Math.pow(20, -3) / Math.pow(GRID_ROWS, codeLength - 10);
}

/**
 * Encodes latitude and longitude into an Open Location Code.
 */
export function encode(
  latitude: number,
  longitude: number,
  codeLength: number = 10
): string {
  if (codeLength < 2 || (codeLength < PAIR_CODE_LENGTH && codeLength % 2 === 1)) {
    throw new Error('Invalid Open Location Code length');
  }
  codeLength = Math.min(15, codeLength);

  let lat = clipLatitude(latitude);
  let lng = normalizeLongitude(longitude);

  if (lat === 90) {
    lat -= computeLatitudePrecision(codeLength);
  }

  let code = '';

  // Shift coordinates to positive domain
  let latVal = lat + LATITUDE_MAX;
  let lngVal = lng + LONGITUDE_MAX;

  let latResolution = 20.0;
  let lngResolution = 20.0;

  // Encode first 10 characters (pairs)
  for (let i = 0; i < Math.min(codeLength, PAIR_CODE_LENGTH); i += 2) {
    const latDigit = Math.floor(latVal / latResolution);
    const lngDigit = Math.floor(lngVal / lngResolution);

    latVal -= latDigit * latResolution;
    lngVal -= lngDigit * lngResolution;

    code += CODE_ALPHABET.charAt(latDigit);
    code += CODE_ALPHABET.charAt(lngDigit);

    if (code.length === SEPARATOR_POSITION && code.length < codeLength) {
      code += SEPARATOR;
    }

    latResolution /= 20.0;
    lngResolution /= 20.0;
  }

  if (code.length < SEPARATOR_POSITION) {
    while (code.length < SEPARATOR_POSITION) {
      code += PADDING_CHARACTER;
    }
  }

  if (code.indexOf(SEPARATOR) === -1) {
    code += SEPARATOR;
  }

  // Encode sub-grid characters (> 10 chars)
  if (codeLength > PAIR_CODE_LENGTH) {
    latResolution = Math.pow(20, -3);
    lngResolution = Math.pow(20, -3);

    for (let i = PAIR_CODE_LENGTH; i < codeLength; i++) {
      latResolution /= GRID_ROWS;
      lngResolution /= GRID_COLUMNS;

      const row = Math.floor(latVal / latResolution);
      const col = Math.floor(lngVal / lngResolution);

      latVal -= row * latResolution;
      lngVal -= col * lngResolution;

      code += CODE_ALPHABET.charAt(row * GRID_COLUMNS + col);
    }
  }

  return code;
}

/**
 * Decodes an Open Location Code into its bounding CodeArea.
 */
export function decode(code: string): CodeArea {
  if (!isFull(code)) {
    throw new Error(`Passed code is not a valid full code: ${code}`);
  }

  const clean = code.trim().toUpperCase().replace(SEPARATOR, '').replace(/0+$/, '');

  let south = -LATITUDE_MAX;
  let west = -LONGITUDE_MAX;
  let latResolution = 20.0;
  let lngResolution = 20.0;

  const pairLength = Math.min(clean.length, PAIR_CODE_LENGTH);

  for (let i = 0; i < pairLength; i += 2) {
    const latDigit = CODE_ALPHABET.indexOf(clean.charAt(i));
    const lngDigit = CODE_ALPHABET.indexOf(clean.charAt(i + 1));

    south += latDigit * latResolution;
    west += lngDigit * lngResolution;

    latResolution /= 20.0;
    lngResolution /= 20.0;
  }

  let north = south + latResolution * 20.0;
  let east = west + lngResolution * 20.0;

  if (clean.length > PAIR_CODE_LENGTH) {
    latResolution = Math.pow(20, -3);
    lngResolution = Math.pow(20, -3);

    for (let i = PAIR_CODE_LENGTH; i < clean.length; i++) {
      const digit = CODE_ALPHABET.indexOf(clean.charAt(i));
      const row = Math.floor(digit / GRID_COLUMNS);
      const col = digit % GRID_COLUMNS;

      latResolution /= GRID_ROWS;
      lngResolution /= GRID_COLUMNS;

      south += row * latResolution;
      west += col * lngResolution;
    }

    north = south + latResolution;
    east = west + lngResolution;
  }

  return {
    southLatitude: south,
    westLongitude: west,
    northLatitude: north,
    eastLongitude: east,
    centerLatitude: (south + north) / 2,
    centerLongitude: (west + east) / 2,
    codeLength: clean.length
  };
}

/**
 * Shortens a full Open Location Code relative to a reference coordinate.
 */
export function shorten(
  code: string,
  referenceLat: number,
  referenceLng: number
): string {
  if (!isFull(code)) {
    throw new Error(`Code must be a full code: ${code}`);
  }
  const clean = code.trim().toUpperCase();
  if (clean.indexOf(PADDING_CHARACTER) !== -1) {
    throw new Error(`Cannot shorten padded code: ${code}`);
  }

  const codeArea = decode(clean);
  const range = Math.max(
    Math.abs(referenceLat - codeArea.centerLatitude),
    Math.abs(referenceLng - codeArea.centerLongitude)
  );

  // Determine how many prefix characters can be removed
  for (let i = 4; i >= 1; i--) {
    // Area size for 2*i characters
    const precision = computeLatitudePrecision(i * 2);
    if (range < precision * 0.3) {
      return clean.substring(i * 2);
    }
  }

  return clean;
}

/**
 * Recovers a full Open Location Code from a short code and reference coordinate.
 */
export function recoverNearest(
  shortCode: string,
  referenceLat: number,
  referenceLng: number
): string {
  if (isFull(shortCode)) return shortCode.trim().toUpperCase();
  if (!isShort(shortCode)) {
    throw new Error(`Passed code is not a valid short code: ${shortCode}`);
  }

  const clean = shortCode.trim().toUpperCase();
  const digitsToPrefix = SEPARATOR_POSITION - clean.indexOf(SEPARATOR);
  const fullRefCode = encode(referenceLat, referenceLng);
  const prefix = fullRefCode.substring(0, digitsToPrefix);
  const recovered = prefix + clean;

  const area = decode(recovered);
  let centerLat = area.centerLatitude;
  let centerLng = area.centerLongitude;

  const resolution = computeLatitudePrecision(digitsToPrefix);
  const halfRes = resolution / 2;

  if (referenceLat + halfRes < centerLat && centerLat - resolution >= -LATITUDE_MAX) {
    centerLat -= resolution;
  } else if (referenceLat - halfRes > centerLat && centerLat + resolution <= LATITUDE_MAX) {
    centerLat += resolution;
  }

  if (referenceLng + halfRes < centerLng && centerLng - resolution >= -LONGITUDE_MAX) {
    centerLng -= resolution;
  } else if (referenceLng - halfRes > centerLng && centerLng + resolution <= LONGITUDE_MAX) {
    centerLng += resolution;
  }

  return encode(centerLat, centerLng, area.codeLength);
}
