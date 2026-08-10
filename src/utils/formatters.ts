export function formatValue(value: number, type: string, countryCode?: string) {
  const code = (countryCode || 'us').toLowerCase();
  const symbol = (code === 'de' || code === 'fr' || code === 'ie' || code === 'nl')
    ? '€'
    : (code === 'gb' || code === 'uk')
      ? '£'
      : (code === 'jp')
        ? '¥'
        : (code === 'nz')
          ? 'NZ$'
          : '$';
  if (type === 'percentage') {
    return `${value}%`;
  }
  if (type === 'per_watt') {
    return `${symbol}${value}/W`;
  }
  if (type === 'fixed') {
    return `${symbol}${value}`;
  }
  return `${symbol}${value} ${type}`;
}
