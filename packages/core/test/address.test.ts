import { test } from 'node:test';
import assert from 'node:assert';
import {
  encode,
  decode,
  shorten,
  recoverNearest,
  isValid,
  isFull,
  isShort,
  fromCoordinates,
  parseAddress,
  toFaydaPayload,
  detectAdminContext
} from '../src/index.js';

test('Open Location Code encoding & decoding for Ethiopian landmarks', () => {
  // Bole International Airport: 8.9778° N, 38.7993° E
  const boleCode = encode(8.9778, 38.7993, 10);
  assert.strictEqual(isValid(boleCode), true);
  assert.strictEqual(isFull(boleCode), true);
  assert.ok(boleCode.startsWith('6GWW'));

  const decoded = decode(boleCode);
  assert.ok(Math.abs(decoded.centerLatitude - 8.9778) < 0.001);
  assert.ok(Math.abs(decoded.centerLongitude - 38.7993) < 0.001);

  // Megenagna Square / Junction: 9.0203° N, 38.8020° E
  const megenagnaCode = encode(9.0203, 38.8020, 10);
  assert.strictEqual(isValid(megenagnaCode), true);
  assert.ok(megenagnaCode.includes('+'));
});

test('Address Shortening and Recovery for Addis Ababa', () => {
  // Meskel Square
  const fullCode = encode(9.0108, 38.7618, 10);
  const shortCode = shorten(fullCode, 9.010, 38.760);
  assert.strictEqual(isShort(shortCode), true);

  const recovered = recoverNearest(shortCode, 9.010, 38.760);
  assert.strictEqual(recovered, fullCode);
});

test('Format and parse Ethiopian National Address (ET-NAS)', () => {
  // Lemi Kura, Woreda 03 location
  const addr = fromCoordinates(9.0210, 38.8350, {
    regionCode: 'AA',
    subDivisionCode: 'LK',
    woreda: '03',
    houseNumber: '104'
  });

  assert.strictEqual(addr.countryCode, 'ET');
  assert.strictEqual(addr.regionCode, 'AA');
  assert.strictEqual(addr.subDivisionCode, 'LK');
  assert.strictEqual(addr.woreda, 'W03');
  assert.strictEqual(addr.houseNumber, '104');
  assert.ok(addr.formatted.startsWith('ET-AA-LK-W03-H104-'));

  // Test parsing back
  const parsed = parseAddress(addr.formatted);
  assert.strictEqual(parsed.regionCode, 'AA');
  assert.strictEqual(parsed.subDivisionCode, 'LK');
  assert.strictEqual(parsed.woreda, 'W03');
  assert.strictEqual(parsed.houseNumber, '104');
  assert.ok(Math.abs(parsed.latitude - 9.0210) < 0.005);
});

test('Fayda ID schema generation', () => {
  const addr = fromCoordinates(9.593, 41.866, {
    regionCode: 'DD'
  });
  const fayda = toFaydaPayload(addr);
  assert.strictEqual(fayda.country, 'ETH');
  assert.strictEqual(fayda.region_code, 'DD');
  assert.strictEqual(fayda.digital_address_standard, 'ET-NAS-1.0');
  assert.ok(fayda.plus_code_full.length >= 8);
});
