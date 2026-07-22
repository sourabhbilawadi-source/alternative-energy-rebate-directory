import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { queryLocationSpecs, _clearLocationCache } from '../energyApi';

describe('queryLocationSpecs', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    _clearLocationCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null for empty queries', async () => {
    const result = await queryLocationSpecs('   ');
    expect(result).toBeNull();
  });

  it('should return null if OSM geocoding fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);
    const result = await queryLocationSpecs('InvalidCity');
    expect(result).toBeNull();
  });

  it('should return null if OSM geocoding returns empty', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    } as Response);
    const result = await queryLocationSpecs('NowhereCity');
    expect(result).toBeNull();
  });

  it('should return correct location specs for a US city (e.g., Austin, TX)', async () => {
    // 1. OSM Geocoding
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = input.toString();

      if (url.includes('nominatim.openstreetmap.org')) {
        return {
          ok: true,
          json: async () => [{
            lat: '30.2672',
            lon: '-97.7431',
            display_name: 'Austin, Travis County, Texas, United States'
          }]
        } as Response;
      }

      if (url.includes('api.open-meteo.com')) {
        return {
          ok: true,
          json: async () => ({
            daily: {
              // say 20 MJ/m2 per day -> 5.55 kWh/m2/day -> ~2027 sun hours
              shortwave_radiation_sum: [20, 20, 20]
            }
          })
        } as Response;
      }

      return { ok: false } as Response;
    });

    const result = await queryLocationSpecs('Austin, TX', 'us');

    expect(result).not.toBeNull();
    expect(result?.lat).toBe(30.2672);
    expect(result?.lon).toBe(-97.7431);
    expect(result?.city).toBe('Austin');
    expect(result?.state).toBe('Texas');
    expect(result?.countryCode).toBe('us');

    // Check grid emissions for Texas (should be 0.37)
    expect(result?.gridEmissions).toBe(0.37);

    // Check sun hours
    expect(result?.sunHours).toBe(2028); // 20 / 3.6 * 365 = 2027.7

    // Check defaults
    expect(result?.gridRate).toBe(0.18);
    expect(result?.costPerWatt).toBe(3.00);
  });

  it('should use default sun hours if Open-Meteo fails', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = input.toString();

      if (url.includes('nominatim.openstreetmap.org')) {
        return {
          ok: true,
          json: async () => [{
            lat: '30.2672',
            lon: '-97.7431',
            display_name: 'Austin, Travis County, Texas, United States'
          }]
        } as Response;
      }

      if (url.includes('api.open-meteo.com')) {
        return { ok: false } as Response;
      }

      return { ok: false } as Response;
    });

    const result = await queryLocationSpecs('Austin, TX', 'us');
    expect(result?.sunHours).toBe(1450); // The fallback
  });

  it('should query UK Carbon Intensity API for UK queries', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = input.toString();

      if (url.includes('nominatim.openstreetmap.org')) {
        return {
          ok: true,
          json: async () => [{
            lat: '51.5072',
            lon: '-0.1276',
            display_name: 'London, Greater London, England, United Kingdom'
          }]
        } as Response;
      }

      if (url.includes('api.open-meteo.com')) {
        return { ok: false } as Response;
      }

      if (url.includes('api.carbonintensity.org.uk')) {
        return {
          ok: true,
          json: async () => ({
            data: [{
              intensity: {
                actual: 200 // 200 gCO2/kWh -> 0.2 kgCO2/kWh
              }
            }]
          })
        } as Response;
      }

      return { ok: false } as Response;
    });

    const result = await queryLocationSpecs('London', 'uk');

    expect(result?.countryCode).toBe('uk');
    expect(result?.gridEmissions).toBe(0.2); // 200 / 1000
    expect(result?.gridRate).toBe(0.30); // UK default
  });

  it('should fallback if UK Carbon Intensity API fails', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = input.toString();

      if (url.includes('nominatim.openstreetmap.org')) {
        return {
          ok: true,
          json: async () => [{
            lat: '51.5072',
            lon: '-0.1276',
            display_name: 'London, Greater London, England, United Kingdom'
          }]
        } as Response;
      }

      if (url.includes('api.carbonintensity.org.uk')) {
        return { ok: false } as Response;
      }

      return { ok: false } as Response;
    });

    const result = await queryLocationSpecs('London', 'uk');
    expect(result?.gridEmissions).toBe(0.15); // Fallback from code when UK fails
  });

  it('should handle unmapped US state with fallback emissions', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = input.toString();

      if (url.includes('nominatim.openstreetmap.org')) {
        return {
          ok: true,
          json: async () => [{
            lat: '44.3148',
            lon: '-85.6024',
            display_name: 'City, SomeCounty, UnknownState, United States'
          }]
        } as Response;
      }

      return { ok: false } as Response;
    });

    const result = await queryLocationSpecs('City, UnknownState', 'us');
    expect(result?.state).toBe('UnknownState');
    expect(result?.gridEmissions).toBe(0.22); // Falls back to California (0.22)
  });

  it('should handle unknown country fallback', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = input.toString();

      if (url.includes('nominatim.openstreetmap.org')) {
        return {
          ok: true,
          json: async () => [{
            lat: '1',
            lon: '1',
            display_name: 'RandomCity, RandomCountry'
          }]
        } as Response;
      }

      return { ok: false } as Response;
    });

    const result = await queryLocationSpecs('RandomCity', 'xx');
    expect(result?.countryCode).toBe('xx');
    // Falls back to US defaults for rates and emissions is 0.40
    expect(result?.gridEmissions).toBe(0.40);
    expect(result?.gridRate).toBe(0.18);
  });
});