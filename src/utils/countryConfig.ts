export interface CountryConfig {
  symbol: string;
  area: string;
  carbon: string;
  land: string;
  isMetric: boolean;
}

export const getCountryConfig = (code: string): CountryConfig => {
  const c = code.toLowerCase();
  switch (c) {
    case 'de':
      return { symbol: '€', area: 'm²', carbon: 't', land: 'Hektar', isMetric: true };
    case 'fr':
    case 'ie':
    case 'nl':
      return { symbol: '€', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true };
    case 'uk':
      return { symbol: '£', area: 'm²', carbon: 't', land: 'Acres', isMetric: true };
    case 'au':
      return { symbol: 'A$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true };
    case 'ca':
      return { symbol: 'C$', area: 'm²', carbon: 't', land: 'Acres', isMetric: true };
    case 'nz':
      return { symbol: 'NZ$', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true };
    case 'jp':
      return { symbol: '¥', area: 'm²', carbon: 't', land: 'Hectares', isMetric: true };
    default:
      return { symbol: '$', area: 'sq ft', carbon: 'Tons', land: 'Acres', isMetric: false };
  }
};
