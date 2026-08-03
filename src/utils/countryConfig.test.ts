import { describe, it, expect } from 'vitest';
import { getCountryConfig } from './countryConfig';

describe('getCountryConfig', () => {
  it('returns correct config for Germany (de)', () => {
    expect(getCountryConfig('de')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hektar', isMetric: true });
  });

  it('returns correct config for France, Ireland, Netherlands (fr, ie, nl)', () => {
    const expected = { symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true };
    expect(getCountryConfig('fr')).toEqual(expected);
    expect(getCountryConfig('ie')).toEqual(expected);
    expect(getCountryConfig('nl')).toEqual(expected);
  });

  it('returns correct config for United Kingdom (uk)', () => {
    expect(getCountryConfig('uk')).toEqual({ symbol: '£', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
  });

  it('returns correct config for Australia (au)', () => {
    expect(getCountryConfig('au')).toEqual({ symbol: 'A$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('returns correct config for Canada (ca)', () => {
    expect(getCountryConfig('ca')).toEqual({ symbol: 'C$', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
  });

  it('returns correct config for New Zealand (nz)', () => {
    expect(getCountryConfig('nz')).toEqual({ symbol: 'NZ$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('returns correct config for Japan (jp)', () => {
    expect(getCountryConfig('jp')).toEqual({ symbol: '¥', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('returns default config for unknown country codes', () => {
    const expected = { symbol: '$', area: 'sq ft', carbon: 'Tons', land: 'Acres', isMetric: false };
    expect(getCountryConfig('us')).toEqual(expected);
    expect(getCountryConfig('unknown')).toEqual(expected);
    expect(getCountryConfig('')).toEqual(expected);
  });

  it('handles case insensitivity', () => {
    expect(getCountryConfig('DE')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hektar', isMetric: true });
    expect(getCountryConfig('Fr')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
    expect(getCountryConfig('uK')).toEqual({ symbol: '£', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
  });
});
