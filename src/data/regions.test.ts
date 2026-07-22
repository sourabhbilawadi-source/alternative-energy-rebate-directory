import { describe, it, expect } from 'vitest';
import { regionsData, COUNTRY_METADATA } from './regions';

describe('Regions Data Validation', () => {
  describe('COUNTRY_METADATA', () => {
    it('should be a non-empty object', () => {
      expect(typeof COUNTRY_METADATA).toBe('object');
      expect(Object.keys(COUNTRY_METADATA).length).toBeGreaterThan(0);
    });

    it('should have valid name and flag for each country', () => {
      for (const [code, data] of Object.entries(COUNTRY_METADATA)) {
        expect(typeof code).toBe('string');
        expect(code.length).toBe(2); // 'us', 'uk', etc.
        expect(typeof data.name).toBe('string');
        expect(data.name.length).toBeGreaterThan(0);
        expect(typeof data.flag).toBe('string');
        expect(data.flag.length).toBeGreaterThan(0);
      }
    });
  });

  describe('regionsData', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(regionsData)).toBe(true);
      expect(regionsData.length).toBeGreaterThan(0);
    });

    it('should not contain duplicate regions (countryCode-stateSlug-citySlug)', () => {
      const keys = new Set();
      const duplicates = [];

      for (const region of regionsData) {
        const key = `${region.countryCode}-${region.stateSlug}-${region.citySlug}`;
        if (keys.has(key)) {
          duplicates.push(key);
        }
        keys.add(key);
      }

      expect(duplicates).toEqual([]); // Should be empty
    });

    it('should have required string properties for all entries', () => {
      for (const region of regionsData) {
        expect(typeof region.countryCode).toBe('string');
        expect(typeof region.countryName).toBe('string');
        expect(typeof region.flag).toBe('string');
        expect(typeof region.stateSlug).toBe('string');
        expect(typeof region.stateName).toBe('string');
        expect(typeof region.citySlug).toBe('string');
        expect(typeof region.cityName).toBe('string');
      }
    });

    it('should have correct types for numeric fields (or null)', () => {
      for (const region of regionsData) {
        // Grid Rate, Sun Hours, Grid Emissions, Cost Per Watt can be number or null
        expect(region.gridRate === null || typeof region.gridRate === 'number').toBe(true);
        expect(region.sunHours === null || typeof region.sunHours === 'number').toBe(true);
        expect(region.gridEmissions === null || typeof region.gridEmissions === 'number').toBe(true);
        expect(region.costPerWatt === null || typeof region.costPerWatt === 'number').toBe(true);

        // Incentives can be numbers or null
        expect(region.federalTaxCreditPct === null || typeof region.federalTaxCreditPct === 'number').toBe(true);
        expect(region.stateRebate === null || typeof region.stateRebate === 'number').toBe(true);
        expect(region.utilityRebate === null || typeof region.utilityRebate === 'number').toBe(true);
      }
    });

    it('should use valid slug formats for state and city slugs', () => {
      // Slugs can include letters, numbers, hyphens, and some accented characters like ü
      const slugRegex = /^[a-z0-9-äöüß]+$/;
      for (const region of regionsData) {
        expect(region.stateSlug).toMatch(slugRegex);
        expect(region.citySlug).toMatch(slugRegex);
      }
    });

    it('should have a countryCode that exists in COUNTRY_METADATA', () => {
      const countryCodes = Object.keys(COUNTRY_METADATA);
      for (const region of regionsData) {
        expect(countryCodes).toContain(region.countryCode);
      }
    });
  });
});
