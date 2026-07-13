import { describe, it, expect } from 'vitest';
import { useTranslations, translations } from './i18n';

describe('useTranslations', () => {
  it('should return English translations for "en-us"', () => {
    const t = useTranslations('en-us');
    expect(t).toBe(translations['en-us']);
  });

  it('should return German translations for "de-de"', () => {
    const t = useTranslations('de-de');
    expect(t).toBe(translations['de-de']);
  });

  it('should return French translations for "fr-fr"', () => {
    const t = useTranslations('fr-fr');
    expect(t).toBe(translations['fr-fr']);
  });

  it('should handle case-insensitivity correctly', () => {
    expect(useTranslations('EN-US')).toBe(translations['en-us']);
    expect(useTranslations('De-De')).toBe(translations['de-de']);
    expect(useTranslations('FR-fr')).toBe(translations['fr-fr']);
  });

  it('should fallback to "en-us" for unsupported languages', () => {
    const t = useTranslations('it-it');
    expect(t).toBe(translations['en-us']);
  });

  it('should fallback to "en-us" for an empty string', () => {
    const t = useTranslations('');
    expect(t).toBe(translations['en-us']);
  });

  it('should fallback to "en-us" for invalid inputs (e.g., null, undefined as string)', () => {
    // Note: TypeScript might complain if we pass non-string, but if called from JS:
    // We are simulating what happens if a bad string or untyped value gets through
    expect(useTranslations('null')).toBe(translations['en-us']);
    expect(useTranslations('undefined')).toBe(translations['en-us']);
    expect(useTranslations(' ')).toBe(translations['en-us']);
  });
});
