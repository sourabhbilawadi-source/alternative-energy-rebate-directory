import { describe, it, expect } from 'vitest';
import { getCountryConfig } from './countryConfig';

describe('getCountryConfig', () => {
  it('returns correct config for de', () => {
    expect(getCountryConfig('de')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hektar', isMetric: true });
  });

  it('returns correct config for fr, ie, nl', () => {
    const expected = { symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true };
    expect(getCountryConfig('fr')).toEqual(expected);
    expect(getCountryConfig('ie')).toEqual(expected);
    expect(getCountryConfig('nl')).toEqual(expected);
  });

  it('returns correct config for uk', () => {
    expect(getCountryConfig('uk')).toEqual({ symbol: '£', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
  });

  it('returns correct config for au', () => {
    expect(getCountryConfig('au')).toEqual({ symbol: 'A$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('returns correct config for ca', () => {
    expect(getCountryConfig('ca')).toEqual({ symbol: 'C$', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
  });

  it('returns correct config for nz', () => {
    expect(getCountryConfig('nz')).toEqual({ symbol: 'NZ$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('returns correct config for jp', () => {
    expect(getCountryConfig('jp')).toEqual({ symbol: '¥', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('returns default config for unknown codes', () => {
    expect(getCountryConfig('us')).toEqual({ symbol: '$', area: 'sq ft', carbon: 'Tons', land: 'Acres', isMetric: false });
    expect(getCountryConfig('xyz')).toEqual({ symbol: '$', area: 'sq ft', carbon: 'Tons', land: 'Acres', isMetric: false });
  });

  it('handles case insensitivity', () => {
    expect(getCountryConfig('DE')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hektar', isMetric: true });
    expect(getCountryConfig('Fr')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });
});
