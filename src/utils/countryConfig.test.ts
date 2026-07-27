import { describe, it, expect } from 'vitest';
import { getCountryConfig } from './countryConfig';

describe('getCountryConfig', () => {
  it('should return correct config for de', () => {
    expect(getCountryConfig('de')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hektar', isMetric: true });
  });

  it('should return correct config for fr, ie, nl', () => {
    const expected = { symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true };
    expect(getCountryConfig('fr')).toEqual(expected);
    expect(getCountryConfig('ie')).toEqual(expected);
    expect(getCountryConfig('nl')).toEqual(expected);
  });

  it('should return correct config for uk', () => {
    expect(getCountryConfig('uk')).toEqual({ symbol: '£', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
  });

  it('should return correct config for au, ca, nz, jp', () => {
    expect(getCountryConfig('au')).toEqual({ symbol: 'A$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
    expect(getCountryConfig('ca')).toEqual({ symbol: 'C$', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
    expect(getCountryConfig('nz')).toEqual({ symbol: 'NZ$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
    expect(getCountryConfig('jp')).toEqual({ symbol: '¥', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('should handle case insensitivity', () => {
    expect(getCountryConfig('DE')).toEqual(getCountryConfig('de'));
    expect(getCountryConfig('Fr')).toEqual(getCountryConfig('fr'));
    expect(getCountryConfig('uK')).toEqual(getCountryConfig('uk'));
  });

  it('should fallback to default for unknown codes', () => {
    const defaultConfig = { symbol: '$', area: 'sq ft', carbon: 'Tons', land: 'Acres', isMetric: false };
    expect(getCountryConfig('us')).toEqual(defaultConfig);
    expect(getCountryConfig('unknown')).toEqual(defaultConfig);
    expect(getCountryConfig('')).toEqual(defaultConfig);
  });
});
