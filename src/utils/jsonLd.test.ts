import { describe, it, expect } from 'vitest';
import { sanitizeJsonLd } from './jsonLd';

describe('sanitizeJsonLd', () => {
  it('escapes HTML tags to prevent XSS', () => {
    const malicious = {
      name: "</script><script>alert(1)</script>"
    };
    const sanitized = sanitizeJsonLd(malicious);
    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
    expect(sanitized).toContain('\\u003c');
    expect(sanitized).toContain('\\u003e');
  });

  it('preserves valid JSON structure', () => {
    const data = { foo: "bar & baz" };
    const sanitized = sanitizeJsonLd(data);
    expect(JSON.parse(sanitized)).toEqual(data);
  });
});
