/**
 * Ethiopia Administrative Division Codes & Metadata
 * Compliant with Project Megenagna Addressing Standard (ET-NAS)
 */
export const ETHIOPIA_BOUNDS = {
    minLat: 3.4,
    maxLat: 14.9,
    minLng: 32.9,
    maxLng: 48.0
};
export const ADDIS_ABABA_SUBCITIES = {
    BO: { code: 'BO', nameEn: 'Bole', nameAm: 'ቦሌ', centerLat: 8.995, centerLng: 38.790, defaultWoredasCount: 14 },
    LK: { code: 'LK', nameEn: 'Lemi Kura', nameAm: 'ለሚ ኩራ', centerLat: 9.020, centerLng: 38.835, defaultWoredasCount: 14 },
    YK: { code: 'YK', nameEn: 'Yeka', nameAm: 'የካ', centerLat: 9.035, centerLng: 38.805, defaultWoredasCount: 13 },
    KR: { code: 'KR', nameEn: 'Kirkos', nameAm: 'ቂርቆስ', centerLat: 9.008, centerLng: 38.758, defaultWoredasCount: 11 },
    AR: { code: 'AR', nameEn: 'Arada', nameAm: 'አራዳ', centerLat: 9.034, centerLng: 38.752, defaultWoredasCount: 10 },
    LD: { code: 'LD', nameEn: 'Lideta', nameAm: 'ልደታ', centerLat: 9.012, centerLng: 38.736, defaultWoredasCount: 10 },
    AK: { code: 'AK', nameEn: 'Addis Ketema', nameAm: 'አዲስ ከተማ', centerLat: 9.032, centerLng: 38.730, defaultWoredasCount: 10 },
    GL: { code: 'GL', nameEn: 'Gullele', nameAm: 'ጉለሌ', centerLat: 9.065, centerLng: 38.735, defaultWoredasCount: 10 },
    KK: { code: 'KK', nameEn: 'Kolfe Keranio', nameAm: 'ኮልፌ ቀራኒዮ', centerLat: 9.018, centerLng: 38.698, defaultWoredasCount: 15 },
    NL: { code: 'NL', nameEn: 'Nifas Silk-Lafto', nameAm: 'ንፋስ ስልክ ላፍቶ', centerLat: 8.960, centerLng: 38.728, defaultWoredasCount: 15 },
    AQ: { code: 'AQ', nameEn: 'Akaki Kality', nameAm: 'አቃቂ ቃሊቲ', centerLat: 8.895, centerLng: 38.765, defaultWoredasCount: 13 }
};
export const ETHIOPIA_REGIONS = {
    AA: {
        code: 'AA',
        nameEn: 'Addis Ababa',
        nameAm: 'አዲስ አበባ',
        nameOm: 'Finfinnee',
        centerLat: 9.010,
        centerLng: 38.760,
        subcitiesOrZones: ADDIS_ABABA_SUBCITIES
    },
    DD: {
        code: 'DD',
        nameEn: 'Dire Dawa',
        nameAm: 'ድሬዳዋ',
        nameOm: 'Dirree Dhawaa',
        nameSo: 'Diridhabe',
        centerLat: 9.593,
        centerLng: 41.866
    },
    OR: {
        code: 'OR',
        nameEn: 'Oromia',
        nameAm: 'ኦሮሚያ',
        nameOm: 'Oromiyaa',
        centerLat: 8.540,
        centerLng: 39.270
    },
    AM: {
        code: 'AM',
        nameEn: 'Amhara',
        nameAm: 'አማራ',
        centerLat: 11.590,
        centerLng: 37.390
    },
    TG: {
        code: 'TG',
        nameEn: 'Tigray',
        nameAm: 'ትግራይ',
        nameTi: 'ትግራይ',
        centerLat: 13.496,
        centerLng: 39.475
    },
    SO: {
        code: 'SO',
        nameEn: 'Somali',
        nameAm: 'ሶማሌ',
        nameSo: 'Soomaali',
        centerLat: 7.000,
        centerLng: 44.000
    },
    SI: {
        code: 'SI',
        nameEn: 'Sidama',
        nameAm: 'ሲዳማ',
        centerLat: 7.050,
        centerLng: 38.470
    },
    SN: {
        code: 'SN',
        nameEn: 'Central Ethiopia',
        nameAm: 'ማዕከላዊ ኢትዮጵያ',
        centerLat: 7.850,
        centerLng: 38.000
    },
    SW: {
        code: 'SW',
        nameEn: 'South West Ethiopia',
        nameAm: 'ደቡብ ምዕራብ ኢትዮጵያ',
        centerLat: 6.900,
        centerLng: 36.200
    },
    SR: {
        code: 'SR',
        nameEn: 'South Ethiopia',
        nameAm: 'ደቡብ ኢትዮጵያ',
        centerLat: 6.000,
        centerLng: 37.500
    },
    AF: {
        code: 'AF',
        nameEn: 'Afar',
        nameAm: 'አፋር',
        centerLat: 11.750,
        centerLng: 40.950
    },
    BG: {
        code: 'BG',
        nameEn: 'Benishangul-Gumuz',
        nameAm: 'ቤንሻንጉል ጉሙዝ',
        centerLat: 10.060,
        centerLng: 35.100
    },
    GA: {
        code: 'GA',
        nameEn: 'Gambella',
        nameAm: 'ጋምቤላ',
        centerLat: 8.250,
        centerLng: 34.580
    },
    HA: {
        code: 'HA',
        nameEn: 'Harari',
        nameAm: 'ሐረሪ',
        centerLat: 9.310,
        centerLng: 42.120
    }
};
//# sourceMappingURL=constants.js.map