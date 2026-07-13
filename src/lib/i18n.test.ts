import { describe, it, expect } from 'vitest';
import { translations, useTranslations } from './i18n';

describe('i18n', () => {
  describe('translations object', () => {
    it('should contain keys for all supported languages', () => {
      expect(translations).toHaveProperty('en-us');
      expect(translations).toHaveProperty('de-de');
      expect(translations).toHaveProperty('fr-fr');
    });

    it('should have consistent translation keys across languages', () => {
      const enKeys = Object.keys(translations['en-us']);
      expect(Object.keys(translations['de-de'])).toEqual(enKeys);
      expect(Object.keys(translations['fr-fr'])).toEqual(enKeys);
    });
  });

  describe('useTranslations', () => {
    it('should return English translations when passed "en-us"', () => {
      const t = useTranslations('en-us');
      expect(t.nav.directory).toBe('Directory');
    });

    it('should return German translations when passed "de-de"', () => {
      const t = useTranslations('de-de');
      expect(t.nav.directory).toBe('Verzeichnis');
    });

    it('should return French translations when passed "fr-fr"', () => {
      const t = useTranslations('fr-fr');
      expect(t.nav.directory).toBe('Annuaire');
    });

    it('should be case-insensitive', () => {
      const t1 = useTranslations('EN-US');
      expect(t1.nav.directory).toBe('Directory');

      const t2 = useTranslations('De-dE');
      expect(t2.nav.directory).toBe('Verzeichnis');
    });

    it('should fallback to "en-us" for unsupported languages', () => {
      const t = useTranslations('es-es');
      expect(t.nav.directory).toBe('Directory');
    });

    it('should fallback to "en-us" for empty string', () => {
      const t = useTranslations('');
      expect(t.nav.directory).toBe('Directory');
    });

    it('should fallback to "en-us" for invalid inputs (e.g., null, undefined as string)', () => {
      // Note: TypeScript might complain if we pass non-string, but if called from JS:
      // We are simulating what happens if a bad string or untyped value gets through
      expect(useTranslations('null')).toBe(translations['en-us']);
      expect(useTranslations('undefined')).toBe(translations['en-us']);
      expect(useTranslations(' ')).toBe(translations['en-us']);
    });
  });
});
