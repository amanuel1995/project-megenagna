/**
 * Project Megenagna Shared Backend Service
 * Ultra-fast, zero-dependency REST & OpenAPI HTTP Server
 */

import http from 'node:http';
import { fromCoordinates, parseAddress, toFaydaPayload, ETHIOPIA_REGIONS } from '@megenagna/core';
import { generatePlaqueSvg } from '@megenagna/plaque';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

function sendJson(res: http.ServerResponse, status: number, data: any) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'public, max-age=300'
  });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;
  const searchParams = reqUrl.searchParams;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Health Check
  if (pathname === '/' || pathname === '/api/v1/health') {
    return sendJson(res, 200, {
      service: 'megenagna-shared-backend',
      status: 'operational',
      version: '0.1.0',
      system: 'Ethiopian National Addressing Standard (ET-NAS v1.0)'
    });
  }

  // List Regions & Sub-cities
  if (pathname === '/api/v1/regions') {
    return sendJson(res, 200, {
      regions: ETHIOPIA_REGIONS
    });
  }

  // Forward Geocoding: Coordinate -> Megenagna Address
  if (pathname === '/api/v1/encode') {
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');

    if (isNaN(lat) || isNaN(lng)) {
      return sendJson(res, 400, { error: 'lat and lng parameters must be valid numbers' });
    }

    const regionCode = searchParams.get('region') || undefined;
    const subDivisionCode = searchParams.get('subcity') || undefined;
    const woreda = searchParams.get('woreda') || undefined;
    const houseNumber = searchParams.get('house') || undefined;

    const address = fromCoordinates(lat, lng, { regionCode, subDivisionCode, woreda, houseNumber });
    return sendJson(res, 200, { success: true, address });
  }

  // Reverse Lookup / Address Parsing
  if (pathname === '/api/v1/parse' || pathname === '/api/v1/decode') {
    const rawAddress = searchParams.get('address') || searchParams.get('code');
    if (!rawAddress) {
      return sendJson(res, 400, { error: 'address or code query parameter is required' });
    }

    try {
      const address = parseAddress(rawAddress);
      return sendJson(res, 200, { success: true, address });
    } catch (err: any) {
      return sendJson(res, 400, { error: err.message });
    }
  }

  // Vector Door Plaque SVG Generator Endpoint
  if (pathname === '/api/v1/plaque.svg') {
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');

    if (isNaN(lat) || isNaN(lng)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Error: lat and lng query parameters are required');
      return;
    }

    const theme = (searchParams.get('theme') as any) || 'civic-blue';
    const woreda = searchParams.get('woreda') || undefined;
    const houseNumber = searchParams.get('house') || undefined;

    const address = fromCoordinates(lat, lng, { woreda, houseNumber });
    const svg = await generatePlaqueSvg(address, { theme });

    res.writeHead(200, {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400'
    });
    res.end(svg);
    return;
  }

  // Fayda KYC Payload
  if (pathname === '/api/v1/fayda/payload') {
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');

    if (isNaN(lat) || isNaN(lng)) {
      return sendJson(res, 400, { error: 'lat and lng parameters are required' });
    }

    const address = fromCoordinates(lat, lng, {
      woreda: searchParams.get('woreda') || undefined,
      houseNumber: searchParams.get('house') || undefined
    });

    const payload = toFaydaPayload(address);
    return sendJson(res, 200, { success: true, fayda: payload });
  }

  return sendJson(res, 404, { error: 'Endpoint not found' });
});

server.listen(PORT, () => {
  console.log(`[Project Megenagna] Shared Backend running on http://localhost:${PORT}`);
});
