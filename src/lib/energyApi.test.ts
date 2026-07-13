import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { queryLocationSpecs } from './energyApi';

describe('queryLocationSpecs', () => {
  beforeEach(() => {
    // Reset fetch mocks
    global.fetch = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null if Nominatim geocoding API fails', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
    });

    const result = await queryLocationSpecs('Nowhereville');
    expect(result).toBeNull();
  });

  it('should return null if Nominatim geocoding API returns empty results', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await queryLocationSpecs('Nowhereville');
    expect(result).toBeNull();
  });

  it('should return expected specs for a US location', async () => {
    // 1. Nominatim mock
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('nominatim')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{
            lat: '37.7749',
            lon: '-122.4194',
            display_name: 'San Francisco, California, United States',
          }],
        });
      }

      // 2. Open-Meteo mock
      if (url.includes('open-meteo')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            daily: {
              shortwave_radiation_sum: [18, 18, 18], // (18 / 3.6) * 365 = 1825 sunHours
            },
          }),
        });
      }

      return Promise.resolve({ ok: false });
    });

    const result = await queryLocationSpecs('San Francisco', 'us');

    expect(result).not.toBeNull();
    if (result) {
      expect(result.lat).toBe(37.7749);
      expect(result.lon).toBe(-122.4194);
      expect(result.city).toBe('San Francisco');
      expect(result.state).toBe('San Francisco'); // The logic picks parts[length - 2] which is 'San Francisco' since length is 3
      expect(result.countryCode).toBe('us');
      expect(result.sunHours).toBe(1825);
      expect(result.gridEmissions).toBe(0.22); // CA default from US_STATE_EMISSIONS
      expect(result.gridRate).toBe(0.18); // US default
      expect(result.costPerWatt).toBe(3.00); // US default
    }
  });

  it('should return expected specs for a UK location with Carbon Intensity API', async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      // 1. Nominatim mock
      if (url.includes('nominatim')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{
            lat: '51.5072',
            lon: '-0.1276',
            display_name: 'London, Greater London, England, United Kingdom',
          }],
        });
      }

      // 2. Open-Meteo mock
      if (url.includes('open-meteo')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            daily: {
              shortwave_radiation_sum: [10.8, 10.8, 10.8], // (10.8 / 3.6) * 365 = 1095 sunHours
            },
          }),
        });
      }

      // 3. Carbon Intensity API mock
      if (url.includes('carbonintensity')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            data: [{
              intensity: {
                actual: 180, // 180 gCO2/kWh = 0.18 kgCO2/kWh
              }
            }]
          }),
        });
      }

      return Promise.resolve({ ok: false });
    });

    const result = await queryLocationSpecs('London', 'uk');

    expect(result).not.toBeNull();
    if (result) {
      expect(result.countryCode).toBe('uk');
      expect(result.sunHours).toBe(1095);
      expect(result.gridEmissions).toBe(0.18);
      expect(result.gridRate).toBe(0.30); // UK default
      expect(result.costPerWatt).toBe(3.20); // UK default
    }
  });

  it('should handle Open-Meteo API failure gracefully', async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('nominatim')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{
            lat: '37.7749',
            lon: '-122.4194',
            display_name: 'San Francisco, California, United States',
          }],
        });
      }

      if (url.includes('open-meteo')) {
        return Promise.resolve({
          ok: false,
        });
      }

      return Promise.resolve({ ok: false });
    });

    const result = await queryLocationSpecs('San Francisco', 'us');

    expect(result).not.toBeNull();
    if (result) {
      expect(result.sunHours).toBe(1450); // Fallback standard value
    }
  });

  it('should handle UK Carbon Intensity API failure gracefully', async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('nominatim')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{
            lat: '51.5072',
            lon: '-0.1276',
            display_name: 'London, Greater London, England, United Kingdom',
          }],
        });
      }

      if (url.includes('open-meteo')) {
        return Promise.resolve({
          ok: false,
        });
      }

      if (url.includes('carbonintensity')) {
        // Need to simulate a thrown error or fetch rejection for it to catch and fallback to 0.15
        return Promise.reject(new Error('Network error'));
      }

      return Promise.resolve({ ok: false });
    });

    const result = await queryLocationSpecs('London', 'uk');

    expect(result).not.toBeNull();
    if (result) {
      expect(result.gridEmissions).toBe(0.15); // Fallback standard UK value
    }
  });

  it('should handle UK Carbon Intensity API non-ok response gracefully', async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('nominatim')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{
            lat: '51.5072',
            lon: '-0.1276',
            display_name: 'London, Greater London, England, United Kingdom',
          }],
        });
      }

      if (url.includes('carbonintensity')) {
        return Promise.resolve({ ok: false }); // not throwing error, just ok: false
      }

      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    const result = await queryLocationSpecs('London', 'uk');

    expect(result).not.toBeNull();
    if (result) {
      // In the implementation, if not ok, it just doesn't set it in the try block, so it remains the default 0.40
      expect(result.gridEmissions).toBe(0.40);
    }
  });

  it('should fall back to general defaults for unknown countries', async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('nominatim')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{
            lat: '0',
            lon: '0',
            display_name: 'Nowhere, Unknown',
          }],
        });
      }

      if (url.includes('open-meteo')) {
        return Promise.resolve({ ok: false });
      }

      return Promise.resolve({ ok: false });
    });

    const result = await queryLocationSpecs('Unknown Place', 'unknown');

    expect(result).not.toBeNull();
    if (result) {
      expect(result.countryCode).toBe('unknown');
      expect(result.gridEmissions).toBe(0.40); // COUNTRY_DEFAULTS default fallback
      expect(result.gridRate).toBe(0.18); // Fallback to 'us' default
    }
  });

  it('should return null and not make network requests when query is empty or whitespace', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    const result1 = await queryLocationSpecs('');
    expect(result1).toBeNull();

    const result2 = await queryLocationSpecs('   ');
    expect(result2).toBeNull();

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
