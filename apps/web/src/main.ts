/**
 * Project Megenagna Web Application Main Controller
 */

import L from 'leaflet';
import { fromCoordinates, toFaydaPayload, MegenagnaAddress } from '@megenagna/core';
import { generatePlaqueSvg } from '@megenagna/plaque';

// Default initial coordinates: Megenagna Square, Addis Ababa (9.0203, 38.8020)
let currentLat = 9.0203;
let currentLng = 38.8020;
let currentAddress: MegenagnaAddress;

// DOM Elements
const elValFormatted = document.getElementById('val-formatted')!;
const elValShortCode = document.getElementById('val-shortcode')!;
const elValFullCode = document.getElementById('val-fullcode')!;
const elValCoords = document.getElementById('val-coords')!;
const elValAdmin = document.getElementById('val-admin')!;
const elFaydaPreview = document.getElementById('fayda-json-preview')!;
const elPlaqueContainer = document.getElementById('plaque-container')!;
const elInputWoreda = document.getElementById('input-woreda') as HTMLInputElement;
const elInputHouse = document.getElementById('input-house') as HTMLInputElement;
const elSelectTheme = document.getElementById('select-theme') as HTMLSelectElement;
const elCitySelect = document.getElementById('city-select') as HTMLSelectElement;
const elBtnDownload = document.getElementById('btn-download-plaque') as HTMLButtonElement;
const elBtnCopyFayda = document.getElementById('btn-copy-fayda') as HTMLButtonElement;

// Initialize Leaflet Map
const map = L.map('map', {
  center: [currentLat, currentLng],
  zoom: 16,
  zoomControl: false
});

L.control.zoom({ position: 'topright' }).addTo(map);

// OpenStreetMap Standard CartoDB Dark/Voyager Tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19
}).addTo(map);

// Create Draggable Pin Marker
const pinIcon = L.divIcon({
  className: 'custom-pin',
  html: `<div style="background-color:#2563EB; width:22px; height:22px; border-radius:50%; border:3px solid #FFFFFF; box-shadow:0 0 12px rgba(37,99,235,0.8);"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

const marker = L.marker([currentLat, currentLng], {
  draggable: true,
  icon: pinIcon
}).addTo(map);

// Plus Code Bounding Box Area polygon
let gridAreaPolygon: L.Polygon | null = null;

async function updateAddressAndPlaque(lat: number, lng: number) {
  currentLat = lat;
  currentLng = lng;

  const woreda = elInputWoreda.value.trim() || undefined;
  const houseNumber = elInputHouse.value.trim() || undefined;
  const theme = (elSelectTheme.value || 'civic-blue') as any;

  currentAddress = fromCoordinates(currentLat, currentLng, {
    woreda,
    houseNumber
  });

  // Update UI Cards
  elValFormatted.textContent = currentAddress.formatted;
  elValShortCode.textContent = currentAddress.shortCode;
  elValFullCode.textContent = currentAddress.fullCode;
  elValCoords.textContent = `${currentAddress.latitude.toFixed(6)}, ${currentAddress.longitude.toFixed(6)}`;
  
  const subDiv = currentAddress.subDivisionNameEn ? ` • ${currentAddress.subDivisionNameEn} (${currentAddress.subDivisionNameAm || ''})` : '';
  elValAdmin.textContent = `${currentAddress.regionNameEn} (${currentAddress.regionNameAm})${subDiv}`;

  // Update Fayda JSON Preview
  const faydaData = toFaydaPayload(currentAddress);
  elFaydaPreview.textContent = JSON.stringify(faydaData, null, 2);

  // Update Map Grid Bounding Box (Visualizing the ~14x14m cell)
  const bounds = currentAddress.bounds;
  const polygonCoords: [number, number][] = [
    [bounds.southLatitude, bounds.westLongitude],
    [bounds.northLatitude, bounds.westLongitude],
    [bounds.northLatitude, bounds.eastLongitude],
    [bounds.southLatitude, bounds.eastLongitude]
  ];

  if (gridAreaPolygon) {
    gridAreaPolygon.setLatLngs(polygonCoords);
  } else {
    gridAreaPolygon = L.polygon(polygonCoords, {
      color: '#3B82F6',
      weight: 2,
      fillColor: '#3B82F6',
      fillOpacity: 0.25
    }).addTo(map);
  }

  // Render SVG Plaque
  const svg = await generatePlaqueSvg(currentAddress, {
    theme,
    width: 440,
    height: 255
  });
  elPlaqueContainer.innerHTML = svg;
}

// Map Click Listener
map.on('click', (e: L.LeafletMouseEvent) => {
  marker.setLatLng(e.latlng);
  updateAddressAndPlaque(e.latlng.lat, e.latlng.lng);
});

// Marker Drag Listener
marker.on('dragend', () => {
  const pos = marker.getLatLng();
  updateAddressAndPlaque(pos.lat, pos.lng);
});

// Input Event Listeners
elInputWoreda.addEventListener('input', () => updateAddressAndPlaque(currentLat, currentLng));
elInputHouse.addEventListener('input', () => updateAddressAndPlaque(currentLat, currentLng));
elSelectTheme.addEventListener('change', () => updateAddressAndPlaque(currentLat, currentLng));

// City Quick-Jump Selector
elCitySelect.addEventListener('change', (e) => {
  const val = (e.target as HTMLSelectElement).value;
  const [latStr, lngStr, zoomStr] = val.split(',');
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  const zoom = parseInt(zoomStr, 10);

  map.setView([lat, lng], zoom);
  marker.setLatLng([lat, lng]);
  updateAddressAndPlaque(lat, lng);
});

// Download Plaque Button
elBtnDownload.addEventListener('click', async () => {
  if (!currentAddress) return;
  const theme = (elSelectTheme.value || 'civic-blue') as any;
  const fullSvg = await generatePlaqueSvg(currentAddress, {
    theme,
    width: 600,
    height: 350
  });

  const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plaque-${currentAddress.formatted.toLowerCase()}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Copy Fayda JSON Button
elBtnCopyFayda.addEventListener('click', async () => {
  if (!currentAddress) return;
  const faydaData = toFaydaPayload(currentAddress);
  await navigator.clipboard.writeText(JSON.stringify(faydaData, null, 2));
  const origText = elBtnCopyFayda.textContent;
  elBtnCopyFayda.textContent = '✅ Copied to Clipboard!';
  setTimeout(() => {
    elBtnCopyFayda.textContent = origText;
  }, 2000);
});

// Initial Render
updateAddressAndPlaque(currentLat, currentLng);
