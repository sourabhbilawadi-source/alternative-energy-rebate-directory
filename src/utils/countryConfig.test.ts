import { describe, it, expect } from 'vitest';
import { getCountryConfig } from './countryConfig';

describe('getCountryConfig', () => {
  it('returns correct config for Germany (de)', () => {
    expect(getCountryConfig('de')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hektar', isMetric: true });
  });

  it('returns correct config for France (fr)', () => {
    expect(getCountryConfig('fr')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('returns correct config for UK (uk)', () => {
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

  it('handles uppercase and mixed case country codes', () => {
    expect(getCountryConfig('DE')).toEqual(getCountryConfig('de'));
    expect(getCountryConfig('Fr')).toEqual(getCountryConfig('fr'));
    expect(getCountryConfig('nL')).toEqual(getCountryConfig('nl'));
  });

  it('returns default config for unknown country codes', () => {
    const defaultConfig = { symbol: '$', area: 'sq ft', carbon: 'Tons', land: 'Acres', isMetric: false };
    expect(getCountryConfig('us')).toEqual(defaultConfig);
    expect(getCountryConfig('xyz')).toEqual(defaultConfig);
    expect(getCountryConfig('')).toEqual(defaultConfig);
  });
});
