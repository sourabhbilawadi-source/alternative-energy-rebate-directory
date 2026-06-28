// src/lib/energyApi.ts
// Service handling real-time public API integrations for location metrics

export interface LocationSpecs {
  lat: number;
  lon: number;
  city: string;
  state: string;
  countryCode: string;
  postalCode: string;
  gridRate: number;
  sunHours: number;
  gridEmissions: number;
  costPerWatt: number;
}

// US State to EPA eGRID subregion grid emission factor lookup (in kg CO2 / kWh)
const US_STATE_EMISSIONS: Record<string, number> = {
  california: 0.22,
  texas: 0.37,
  'new york': 0.18,
  massachusetts: 0.24,
  florida: 0.36,
  washington: 0.08,
  oregon: 0.08,
  colorado: 0.51,
  illinois: 0.29,
  ohio: 0.52,
  pennsylvania: 0.31,
  georgia: 0.34,
  'north carolina': 0.31,
  arizona: 0.35,
  michigan: 0.45,
  new_jersey: 0.21,
  virginia: 0.28,
  maryland: 0.28,
  indiana: 0.62,
  wisconsin: 0.48,
  minnesota: 0.39,
  missouri: 0.65
};

const COUNTRY_DEFAULTS: Record<string, { gridRate: number; costPerWatt: number; emissions: number }> = {
  us: { gridRate: 0.18, costPerWatt: 3.00, emissions: 0.36 },
  uk: { gridRate: 0.30, costPerWatt: 3.20, emissions: 0.15 },
  de: { gridRate: 0.36, costPerWatt: 2.80, emissions: 0.38 },
  ca: { gridRate: 0.14, costPerWatt: 2.70, emissions: 0.12 },
  au: { gridRate: 0.25, costPerWatt: 1.90, emissions: 0.68 },
  fr: { gridRate: 0.25, costPerWatt: 2.40, emissions: 0.05 },
  ie: { gridRate: 0.38, costPerWatt: 2.20, emissions: 0.24 },
  nl: { gridRate: 0.28, costPerWatt: 1.60, emissions: 0.23 },
  nz: { gridRate: 0.35, costPerWatt: 2.80, emissions: 0.09 },
  jp: { gridRate: 31.00, costPerWatt: 270.00, emissions: 0.45 }
};

export async function queryLocationSpecs(
  query: string, 
  countryHint: string = 'us'
): Promise<LocationSpecs | null> {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) return null;

    // 1. Geocode location using OpenStreetMap Nominatim
    let countryRestr = countryHint.toLowerCase();
    if (countryRestr === 'uk') countryRestr = 'gb';
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery)}&countrycodes=${countryRestr}&format=json&limit=1`;
    const geoResponse = await fetch(geocodeUrl, {
      headers: {
        'User-Agent': 'IncentiveMapper-Alternative-Energy-Directory-v1.0'
      }
    });

    if (!geoResponse.ok) throw new Error('OSM Geocoding request failed');
    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) return null;
    
    const lat = Number(geoData[0].lat);
    const lon = Number(geoData[0].lon);
    const displayName = geoData[0].display_name || '';
    
    // Parse geocoding display name to guess city, state, country
    const parts = displayName.split(',').map((p: string) => p.trim());
    let city = parts[0] || '';
    let state = parts[parts.length - 3] || parts[parts.length - 2] || '';
    let country = parts[parts.length - 1] || '';
    
    // Convert country name to 2-letter country code
    let countryCode = countryHint.toLowerCase();
    const countryLower = country.toLowerCase();
    if (countryLower.includes('united states') || countryLower === 'usa' || countryLower === 'us') countryCode = 'us';
    else if (countryLower.includes('united kingdom') || countryLower === 'uk' || countryLower === 'gb' || countryLower.includes('england')) countryCode = 'uk';
    else if (countryLower.includes('germany') || countryLower === 'deutschland' || countryLower === 'de') countryCode = 'de';
    else if (countryLower.includes('canada') || countryLower === 'ca') countryCode = 'ca';
    else if (countryLower.includes('australia') || countryLower === 'au') countryCode = 'au';
    else if (countryLower.includes('france') || countryLower === 'fr') countryCode = 'fr';
    else if (countryLower.includes('ireland') || countryLower === 'ie') countryCode = 'ie';
    else if (countryLower.includes('netherlands') || countryLower === 'holland' || countryLower === 'nl') countryCode = 'nl';
    else if (countryLower.includes('new zealand') || countryLower === 'nz') countryCode = 'nz';
    else if (countryLower.includes('japan') || countryLower === 'nippon' || countryLower === 'jp') countryCode = 'jp';

    // 2. Fetch Solar Insolation (MJ/m2) from Open-Meteo
    let sunHours = 1450; // Standard fallback
    try {
      const solarUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=shortwave_radiation_sum&timezone=auto`;
      const solarResponse = await fetch(solarUrl);
      if (solarResponse.ok) {
        const solarData = await solarResponse.json();
        const dailyRadiationSum = solarData.daily?.shortwave_radiation_sum || [];
        if (dailyRadiationSum.length > 0) {
          // Average MJ/m2 per day
          const sum = dailyRadiationSum.reduce((acc: number, val: number) => acc + val, 0);
          const avgMj = sum / dailyRadiationSum.length;
          
          // Convert MJ/m2/day to kWh/m2/day (divided by 3.6)
          const avgKwhPerDay = avgMj / 3.6;
          
          // Annual sun hours = daily peak sun hours * 365
          sunHours = Math.round(avgKwhPerDay * 365);
          
          // Cap inside reasonable operational limits (800 - 2500)
          sunHours = Math.max(800, Math.min(2500, sunHours));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch solar hours from Open-Meteo, using default:', err);
    }

    // 3. Fetch Grid Emission Factor (kg CO2 / kWh)
    let gridEmissions = 0.40; // Default
    const cleanCountryCode = countryCode === 'gb' ? 'uk' : countryCode;
    
    if (cleanCountryCode === 'uk') {
      // Live UK Carbon Intensity API
      try {
        const ukEmissionsResponse = await fetch('https://api.carbonintensity.org.uk/intensity');
        if (ukEmissionsResponse.ok) {
          const ukData = await ukEmissionsResponse.json();
          const liveValueGrams = ukData.data?.[0]?.intensity?.actual || ukData.data?.[0]?.intensity?.forecast || 150;
          gridEmissions = liveValueGrams / 1000; // Convert gCO2/kWh to kgCO2/kWh
        }
      } catch (err) {
        console.warn('Failed to query UK Carbon Intensity API:', err);
        gridEmissions = 0.15;
      }
    } else if (cleanCountryCode === 'us') {
      // Match US state to EPA eGRID subregion map
      const matchedState = Object.keys(US_STATE_EMISSIONS).find(s => state.toLowerCase().includes(s));
      gridEmissions = matchedState ? US_STATE_EMISSIONS[matchedState] : US_STATE_EMISSIONS['california'];
    } else {
      // Other countries
      gridEmissions = COUNTRY_DEFAULTS[cleanCountryCode]?.emissions || 0.40;
    }

    // 4. Resolve default rates
    const defaults = COUNTRY_DEFAULTS[cleanCountryCode] || COUNTRY_DEFAULTS['us'];
    
    return {
      lat,
      lon,
      city: city || cleanQuery,
      state: state || 'Region',
      countryCode: cleanCountryCode,
      postalCode: cleanQuery,
      gridRate: defaults.gridRate,
      sunHours,
      gridEmissions,
      costPerWatt: defaults.costPerWatt
    };
  } catch (err) {
    console.error('Error fetching location specs from APIs:', err);
    return null;
  }
}
