// src/data/regions.ts

export interface MetricSource {
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
}

export interface RegionEntry {
  countryCode: string;   // e.g. 'us'
  countryName: string;   // e.g. 'United States'
  flag: string;          // e.g. '🇺🇸'
  stateSlug: string;     // e.g. 'california'
  stateName: string;     // e.g. 'California'
  citySlug: string;      // e.g. 'los-angeles'
  cityName: string;      // e.g. 'Los Angeles'

  // Sizing/rate parameters (using null for TODO/placeholder values)
  gridRate: number | null;
  sunHours: number | null;
  gridEmissions: number | null;
  costPerWatt: number | null;

  // Incentives (using null for TODO/placeholder values)
  federalTaxCreditPct: number | null;
  stateRebate: number | null;
  utilityRebate: number | null;

  // Metric sources
  gridRateSource?: MetricSource;
  sunHoursSource?: MetricSource;
  gridEmissionsSource?: MetricSource;
  costPerWattSource?: MetricSource;
  federalTaxCreditSource?: MetricSource;
  stateRebateSource?: MetricSource;
  utilityRebateSource?: MetricSource;
}

export const COUNTRY_METADATA: Record<string, { name: string; flag: string }> = {
  us: { name: 'United States', flag: '🇺🇸' },
  uk: { name: 'United Kingdom', flag: '🇬🇧' },
  de: { name: 'Germany', flag: '🇩🇪' },
  ca: { name: 'Canada', flag: '🇨🇦' },
  au: { name: 'Australia', flag: '🇦🇺' },
  fr: { name: 'France', flag: '🇫🇷' }
};

const TODO_SOURCES = {
  gridRateSource: { sourceName: 'TODO', sourceUrl: '#', lastVerified: 'TODO' },
  sunHoursSource: { sourceName: 'TODO', sourceUrl: '#', lastVerified: 'TODO' },
  gridEmissionsSource: { sourceName: 'TODO', sourceUrl: '#', lastVerified: 'TODO' },
  costPerWattSource: { sourceName: 'TODO', sourceUrl: '#', lastVerified: 'TODO' },
  federalTaxCreditSource: { sourceName: 'TODO', sourceUrl: '#', lastVerified: 'TODO' },
  stateRebateSource: { sourceName: 'TODO', sourceUrl: '#', lastVerified: 'TODO' },
  utilityRebateSource: { sourceName: 'TODO', sourceUrl: '#', lastVerified: 'TODO' }
};

export const regionsData: RegionEntry[] = [
  // ==========================================
  // EXISTING CITIES (WITH REAL/ORIGINAL DATA)
  // ==========================================
  
  // United States
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'california',
    stateName: 'California',
    citySlug: 'los-angeles',
    cityName: 'Los Angeles',
    gridRate: 0.28,
    sunHours: 1800,
    gridEmissions: 0.52,
    costPerWatt: 3.10,
    federalTaxCreditPct: 0.30,
    stateRebate: 1500,
    utilityRebate: 500,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'california',
    stateName: 'California',
    citySlug: 'san-francisco',
    cityName: 'San Francisco',
    gridRate: 0.28,
    sunHours: 1800,
    gridEmissions: 0.52,
    costPerWatt: 3.10,
    federalTaxCreditPct: 0.30,
    stateRebate: 1500,
    utilityRebate: 500,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'texas',
    stateName: 'Texas',
    citySlug: 'houston',
    cityName: 'Houston',
    gridRate: 0.14,
    sunHours: 1950,
    gridEmissions: 0.82,
    costPerWatt: 2.70,
    federalTaxCreditPct: 0.30,
    stateRebate: 0,
    utilityRebate: 400,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'new-york',
    stateName: 'New York',
    citySlug: 'new-york-city',
    cityName: 'New York City',
    gridRate: 0.23,
    sunHours: 1250,
    gridEmissions: 0.66,
    costPerWatt: 3.25,
    federalTaxCreditPct: 0.30,
    stateRebate: 1000,
    utilityRebate: 500,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'illinois',
    stateName: 'Illinois',
    citySlug: 'chicago',
    cityName: 'Chicago',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.30,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'arizona',
    stateName: 'Arizona',
    citySlug: 'phoenix',
    cityName: 'Phoenix',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.30,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'florida',
    stateName: 'Florida',
    citySlug: 'miami',
    cityName: 'Miami',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.30,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'washington',
    stateName: 'Washington',
    citySlug: 'seattle',
    cityName: 'Seattle',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.30,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'massachusetts',
    stateName: 'Massachusetts',
    citySlug: 'boston',
    cityName: 'Boston',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.30,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'colorado',
    stateName: 'Colorado',
    citySlug: 'denver',
    cityName: 'Denver',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.30,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },

  // United Kingdom
  {
    countryCode: 'uk',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    stateSlug: 'england',
    stateName: 'England',
    citySlug: 'london',
    cityName: 'London',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.0,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },
  {
    countryCode: 'uk',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    stateSlug: 'scotland',
    stateName: 'Scotland',
    citySlug: 'edinburgh',
    cityName: 'Edinburgh',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.0,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },

  // Germany
  {
    countryCode: 'de',
    countryName: 'Germany',
    flag: '🇩🇪',
    stateSlug: 'berlin',
    stateName: 'Berlin',
    citySlug: 'berlin',
    cityName: 'Berlin',
    gridRate: 0.38,
    sunHours: 1100,
    gridEmissions: 0.70,
    costPerWatt: 2.90,
    federalTaxCreditPct: 0.0,
    stateRebate: 1500,
    utilityRebate: 400,
    ...TODO_SOURCES
  },
  {
    countryCode: 'de',
    countryName: 'Germany',
    flag: '🇩🇪',
    stateSlug: 'bavaria',
    stateName: 'Bavaria',
    citySlug: 'munich',
    cityName: 'Munich',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.0,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },

  // Australia
  {
    countryCode: 'au',
    countryName: 'Australia',
    flag: '🇦🇺',
    stateSlug: 'new-south-wales',
    stateName: 'New South Wales',
    citySlug: 'sydney',
    cityName: 'Sydney',
    gridRate: 0.26,
    sunHours: 2100,
    gridEmissions: 0.75,
    costPerWatt: 1.80,
    federalTaxCreditPct: 0.0,
    stateRebate: 2000,
    utilityRebate: 800,
    ...TODO_SOURCES
  },
  {
    countryCode: 'au',
    countryName: 'Australia',
    flag: '🇦🇺',
    stateSlug: 'victoria',
    stateName: 'Victoria',
    citySlug: 'melbourne',
    cityName: 'Melbourne',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.0,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },

  // Canada
  {
    countryCode: 'ca',
    countryName: 'Canada',
    flag: '🇨🇦',
    stateSlug: 'ontario',
    stateName: 'Ontario',
    citySlug: 'toronto',
    cityName: 'Toronto',
    gridRate: 0.16,
    sunHours: 1300,
    gridEmissions: 0.12,
    costPerWatt: 2.80,
    federalTaxCreditPct: 0.0,
    stateRebate: 2500,
    utilityRebate: 600,
    ...TODO_SOURCES
  },
  {
    countryCode: 'ca',
    countryName: 'Canada',
    flag: '🇨🇦',
    stateSlug: 'british-columbia',
    stateName: 'British Columbia',
    citySlug: 'vancouver',
    cityName: 'Vancouver',
    gridRate: 0.32,
    sunHours: 1050,
    gridEmissions: 0.40,
    costPerWatt: 3.40,
    federalTaxCreditPct: 0.0,
    stateRebate: 1200,
    utilityRebate: 300,
    ...TODO_SOURCES
  },

  // ==========================================
  // 30 NEW CITIES (WITH TODO PLACEHOLDERS)
  // ==========================================
  
  // Georgia
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'georgia',
    stateName: 'Georgia',
    citySlug: 'atlanta',
    cityName: 'Atlanta',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Pennsylvania
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'pennsylvania',
    stateName: 'Pennsylvania',
    citySlug: 'philadelphia',
    cityName: 'Philadelphia',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'pennsylvania',
    stateName: 'Pennsylvania',
    citySlug: 'pittsburgh',
    cityName: 'Pittsburgh',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Texas
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'texas',
    stateName: 'Texas',
    citySlug: 'dallas',
    cityName: 'Dallas',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'texas',
    stateName: 'Texas',
    citySlug: 'austin',
    cityName: 'Austin',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'texas',
    stateName: 'Texas',
    citySlug: 'san-antonio',
    cityName: 'San Antonio',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // California
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'california',
    stateName: 'California',
    citySlug: 'san-diego',
    cityName: 'San Diego',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'california',
    stateName: 'California',
    citySlug: 'san-jose',
    cityName: 'San Jose',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'california',
    stateName: 'California',
    citySlug: 'sacramento',
    cityName: 'Sacramento',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Nevada
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'nevada',
    stateName: 'Nevada',
    citySlug: 'las-vegas',
    cityName: 'Las Vegas',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Florida
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'florida',
    stateName: 'Florida',
    citySlug: 'orlando',
    cityName: 'Orlando',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'florida',
    stateName: 'Florida',
    citySlug: 'tampa',
    cityName: 'Tampa',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'florida',
    stateName: 'Florida',
    citySlug: 'jacksonville',
    cityName: 'Jacksonville',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // North Carolina
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'north-carolina',
    stateName: 'North Carolina',
    citySlug: 'charlotte',
    cityName: 'Charlotte',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'north-carolina',
    stateName: 'North Carolina',
    citySlug: 'raleigh',
    cityName: 'Raleigh',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Tennessee
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'tennessee',
    stateName: 'Tennessee',
    citySlug: 'nashville',
    cityName: 'Nashville',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Ohio
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'ohio',
    stateName: 'Ohio',
    citySlug: 'columbus',
    cityName: 'Columbus',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'ohio',
    stateName: 'Ohio',
    citySlug: 'cleveland',
    cityName: 'Cleveland',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Indiana
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'indiana',
    stateName: 'Indiana',
    citySlug: 'indianapolis',
    cityName: 'Indianapolis',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Michigan
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'michigan',
    stateName: 'Michigan',
    citySlug: 'detroit',
    cityName: 'Detroit',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Minnesota
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'minnesota',
    stateName: 'Minnesota',
    citySlug: 'minneapolis',
    cityName: 'Minneapolis',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Missouri
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'missouri',
    stateName: 'Missouri',
    citySlug: 'kansas-city',
    cityName: 'Kansas City',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'missouri',
    stateName: 'Missouri',
    citySlug: 'st-louis',
    cityName: 'St. Louis',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Utah
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'utah',
    stateName: 'Utah',
    citySlug: 'salt-lake-city',
    cityName: 'Salt Lake City',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Oregon
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'oregon',
    stateName: 'Oregon',
    citySlug: 'portland',
    cityName: 'Portland',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // New Mexico
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'new-mexico',
    stateName: 'New Mexico',
    citySlug: 'albuquerque',
    cityName: 'Albuquerque',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Hawaii
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'hawaii',
    stateName: 'Hawaii',
    citySlug: 'honolulu',
    cityName: 'Honolulu',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Louisiana
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'louisiana',
    stateName: 'Louisiana',
    citySlug: 'new-orleans',
    cityName: 'New Orleans',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Maryland
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'maryland',
    stateName: 'Maryland',
    citySlug: 'baltimore',
    cityName: 'Baltimore',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  },
  // Virginia
  {
    countryCode: 'us',
    countryName: 'United States',
    flag: '🇺🇸',
    stateSlug: 'virginia',
    stateName: 'Virginia',
    citySlug: 'richmond',
    cityName: 'Richmond',
    gridRate: null,
    sunHours: null,
    gridEmissions: null,
    costPerWatt: null,
    federalTaxCreditPct: 0.30,
    stateRebate: null,
    utilityRebate: null,
    ...TODO_SOURCES
  }
];
