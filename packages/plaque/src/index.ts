/**
 * Project Megenagna - Door Plaque & Signage Generator
 * Produces crisp, vector SVG plaques compliant with Ethiopian Municipal standards.
 */

import QRCode from 'qrcode';
import { MegenagnaAddress } from '@megenagna/core';

export interface PlaqueOptions {
  theme?: 'civic-blue' | 'brass' | 'modern-dark' | 'clean-white';
  width?: number; // default 600
  height?: number; // default 350
  includeAmharic?: boolean;
}

export const THEMES = {
  'civic-blue': {
    background: '#0B2545',
    border: '#134074',
    primaryText: '#EEF4F8',
    secondaryText: '#8DA9C4',
    accent: '#F4D06F',
    qrDark: '#0B2545',
    qrLight: '#EEF4F8'
  },
  'brass': {
    background: '#2B1E11',
    border: '#C5A059',
    primaryText: '#F7E7CE',
    secondaryText: '#D4AF37',
    accent: '#F9D342',
    qrDark: '#2B1E11',
    qrLight: '#F7E7CE'
  },
  'modern-dark': {
    background: '#121212',
    border: '#27272A',
    primaryText: '#FFFFFF',
    secondaryText: '#A1A1AA',
    accent: '#10B981',
    qrDark: '#000000',
    qrLight: '#FFFFFF'
  },
  'clean-white': {
    background: '#FFFFFF',
    border: '#E2E8F0',
    primaryText: '#0F172A',
    secondaryText: '#64748B',
    accent: '#2563EB',
    qrDark: '#0F172A',
    qrLight: '#FFFFFF'
  }
};

/**
 * Generates an SVG string representation of a physical municipal door plaque.
 */
export async function generatePlaqueSvg(
  address: MegenagnaAddress,
  options: PlaqueOptions = {}
): Promise<string> {
  const themeKey = options.theme || 'civic-blue';
  const theme = THEMES[themeKey] || THEMES['civic-blue'];
  const width = options.width || 600;
  const height = options.height || 350;

  // Offline-resolvable navigation URI encoded in the QR code:
  // Using standard geo URI schema and web fallback
  const geoUrl = `https://plus.codes/${encodeURIComponent(address.fullCode)}`;

  // Generate QR code data URL (vector or image matrix)
  const qrSvgString = await QRCode.toString(geoUrl, {
    type: 'svg',
    margin: 1,
    color: {
      dark: theme.qrDark,
      light: theme.qrLight
    }
  });

  // Extract inner paths from the generated QR svg
  const qrContent = qrSvgString.replace(/<\?xml.*?\?>/, '').replace(/<svg.*?>/, '').replace(/<\/svg>/, '');

  const regionDisplay = `${address.regionNameEn} (${address.regionNameAm})`;
  const subDivDisplay = address.subDivisionNameEn ? `${address.subDivisionNameEn} • ${address.subDivisionNameAm || ''}` : '';
  const woredaDisplay = address.woreda ? `Woreda ${address.woreda.replace(/^W/i, '')}` : '';
  const houseDisplay = address.houseNumber ? `House ${address.houseNumber}` : '';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&amp;family=Noto+Sans+Ethiopic:wght@400;700&amp;display=swap');
      .font-main { font-family: 'Inter', 'Noto Sans Ethiopic', -apple-system, BlinkMacSystemFont, sans-serif; }
      .bold { font-weight: 700; }
      .extrabold { font-weight: 800; }
    </style>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Base Plate with Chamfered Border -->
  <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="16" fill="${theme.background}" stroke="${theme.border}" stroke-width="4" filter="url(#shadow)" />
  <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="10" fill="none" stroke="${theme.border}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>

  <!-- Corner Screw Holes for mounting -->
  <circle cx="30" cy="30" r="4" fill="${theme.border}" opacity="0.8" />
  <circle cx="${width - 30}" cy="30" r="4" fill="${theme.border}" opacity="0.8" />
  <circle cx="30" cy="${height - 30}" r="4" fill="${theme.border}" opacity="0.8" />
  <circle cx="${width - 30}" cy="${height - 30}" r="4" fill="${theme.border}" opacity="0.8" />

  <!-- Left Side: Address Details -->
  <g class="font-main" transform="translate(45, 60)">
    <!-- Header / Region -->
    <text x="0" y="0" font-size="14" fill="${theme.secondaryText}" letter-spacing="1.5" text-transform="uppercase" class="bold">
      ${address.countryCode} • ${regionDisplay}
    </text>

    <!-- SubCity / Zone -->
    <text x="0" y="32" font-size="22" fill="${theme.primaryText}" class="bold">
      ${subDivDisplay || address.regionNameEn}
    </text>

    <!-- Woreda & House (if available) -->
    <text x="0" y="62" font-size="16" fill="${theme.accent}" class="bold">
      ${[woredaDisplay, houseDisplay].filter(Boolean).join('  |  ')}
    </text>

    <!-- Big Digital Address Code -->
    <g transform="translate(0, 110)">
      <text x="0" y="0" font-size="11" fill="${theme.secondaryText}" letter-spacing="1">MEGENAGNA DIGITAL ADDRESS</text>
      <text x="0" y="38" font-size="34" fill="${theme.primaryText}" class="extrabold" letter-spacing="2">
        ${address.shortCode}
      </text>
      <text x="0" y="65" font-size="13" fill="${theme.secondaryText}">
        Full Code: <tspan fill="${theme.primaryText}" class="bold">${address.fullCode}</tspan>
      </text>
      <text x="0" y="85" font-size="11" fill="${theme.secondaryText}">
        ${address.formatted}
      </text>
    </g>
  </g>

  <!-- Right Side: QR Code Plate -->
  <g transform="translate(${width - 190}, 55)">
    <!-- QR Background Card -->
    <rect x="0" y="0" width="145" height="175" rx="10" fill="${theme.qrLight}" stroke="${theme.border}" stroke-width="1.5" />
    
    <!-- QR Vector Image -->
    <g transform="translate(12, 12) scale(0.68)">
      ${qrContent}
    </g>

    <!-- Scan Instruction Label -->
    <text x="72.5" y="160" text-anchor="middle" font-family="'Inter', sans-serif" font-size="9.5" fill="${theme.qrDark}" class="bold" letter-spacing="0.5">
      SCAN TO NAVIGATE
    </text>
  </g>

  <!-- Footer Watermark / National Standard -->
  <text x="${width / 2}" y="${height - 24}" text-anchor="middle" font-family="'Inter', sans-serif" font-size="9" fill="${theme.secondaryText}" opacity="0.75" letter-spacing="0.8">
    ETHIOPIA OPEN NATIONAL ADDRESSING SYSTEM (ET-NAS) • PROJECT MEGENAGNA
  </text>
</svg>
`.trim();
}
