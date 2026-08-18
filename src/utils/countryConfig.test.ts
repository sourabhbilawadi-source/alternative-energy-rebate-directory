import { describe, it, expect } from 'vitest';
import { getCountryConfig } from './countryConfig';

describe('getCountryConfig', () => {
  it('should return config for Germany (de)', () => {
    expect(getCountryConfig('de')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hektar', isMetric: true });
  });

  it('should return config for France (fr), Ireland (ie), Netherlands (nl)', () => {
    expect(getCountryConfig('fr')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
    expect(getCountryConfig('ie')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
    expect(getCountryConfig('nl')).toEqual({ symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('should return config for United Kingdom (uk)', () => {
    expect(getCountryConfig('uk')).toEqual({ symbol: '£', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
  });

  it('should return config for Australia (au)', () => {
    expect(getCountryConfig('au')).toEqual({ symbol: 'A$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('should return config for Canada (ca)', () => {
    expect(getCountryConfig('ca')).toEqual({ symbol: 'C$', area: 'm²', carbon: 't', land: 'Acres', isMetric: true });
  });

  it('should return config for New Zealand (nz)', () => {
    expect(getCountryConfig('nz')).toEqual({ symbol: 'NZ$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('should return config for Japan (jp)', () => {
    expect(getCountryConfig('jp')).toEqual({ symbol: '¥', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true });
  });

  it('should return default config for US and unknown codes', () => {
    const defaultConfig = { symbol: '$', area: 'sq ft', carbon: 'Tons', land: 'Acres', isMetric: false };
    expect(getCountryConfig('us')).toEqual(defaultConfig);
    expect(getCountryConfig('unknown')).toEqual(defaultConfig);
  });

  it('should be case insensitive', () => {
    expect(getCountryConfig('DE')).toEqual(getCountryConfig('de'));
    expect(getCountryConfig('Fr')).toEqual(getCountryConfig('fr'));
    expect(getCountryConfig('US')).toEqual(getCountryConfig('us'));
  });
});
