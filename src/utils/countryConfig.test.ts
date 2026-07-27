import { describe, it, expect } from 'vitest';
import { getCountryConfig } from './countryConfig';

describe('getCountryConfig', () => {
  it('returns correct config for DE', () => {
    expect(getCountryConfig('de')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hektar', isMetric: true });
  });

  it('returns correct config for FR, IE, NL', () => {
    const expected = { symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true };
    expect(getCountryConfig('fr')).toEqual(expected);
    expect(getCountryConfig('ie')).toEqual(expected);
    expect(getCountryConfig('nl')).toEqual(expected);
  });

  it('returns correct config for UK', () => {
    expect(getCountryConfig('uk')).toEqual({ symbol: '£', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
  });

  it('returns correct config for AU, CA, NZ, JP', () => {
    expect(getCountryConfig('au')).toEqual({ symbol: 'A$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
    expect(getCountryConfig('ca')).toEqual({ symbol: 'C$', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
    expect(getCountryConfig('nz')).toEqual({ symbol: 'NZ$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
    expect(getCountryConfig('jp')).toEqual({ symbol: '¥', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('is case-insensitive', () => {
    expect(getCountryConfig('DE')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hektar', isMetric: true });
    expect(getCountryConfig('Fr')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('returns default config for unknown codes', () => {
    const expected = { symbol: '$', area: 'sq ft', carbon: 'Tons', land: 'Acres', isMetric: false };
    expect(getCountryConfig('us')).toEqual(expected);
    expect(getCountryConfig('unknown')).toEqual(expected);
    expect(getCountryConfig('')).toEqual(expected);
  });
});
