import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

// Mock astro:content and astro/loaders before importing content.config
vi.mock('astro:content', () => {
  return {
    defineCollection: (config: any) => config,
    z: z
  };
});

vi.mock('astro/loaders', () => {
  return {
    glob: (config: any) => config
  };
});

import { collections } from './content.config';

describe('content.config', () => {
  describe('blog collection', () => {
    it('should be defined with correct loader configuration', () => {
      expect(collections.blog).toBeDefined();

      expect(collections.blog.loader).toEqual({
        pattern: '**/[^_]*.{md,mdx}',
        base: './src/content/blog'
      });
    });

    describe('schema validation', () => {
      const schema = collections.blog.schema as z.ZodObject<any>;

      it('should validate and parse minimal valid data with defaults', () => {
        const validData = {
          title: 'A Great Blog Post',
          description: 'This is a test description.',
          publishDate: new Date('2024-01-01'),
        };

        const result = schema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.title).toBe('A Great Blog Post');
          expect(result.data.description).toBe('This is a test description.');
          expect(result.data.publishDate).toEqual(new Date('2024-01-01'));
          expect(result.data.draft).toBe(false); // Default value
          expect(result.data.relatedRegions).toEqual([]); // Default value
        }
      });

      it('should validate and parse complete valid data', () => {
        const validDataWithOverrides = {
          title: 'Another Post',
          description: 'More descriptions',
          publishDate: '2024-02-01', // Should coerce string to date
          draft: true,
          relatedRegions: ['US-CA', 'US-NY']
        };

        const result = schema.safeParse(validDataWithOverrides);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.draft).toBe(true);
          expect(result.data.relatedRegions).toEqual(['US-CA', 'US-NY']);
          expect(result.data.publishDate).toBeInstanceOf(Date);
          expect(result.data.publishDate.toISOString().startsWith('2024-02-01')).toBe(true);
        }
      });

      it('should fail validation when required fields are missing', () => {
        const missingTitle = {
          description: 'Missing title',
          publishDate: new Date(),
        };
        const result1 = schema.safeParse(missingTitle);
        expect(result1.success).toBe(false);

        const missingDescription = {
          title: 'Missing description',
          publishDate: new Date(),
        };
        const result2 = schema.safeParse(missingDescription);
        expect(result2.success).toBe(false);

        const missingPublishDate = {
          title: 'Missing date',
          description: 'Missing publish date',
        };
        const result3 = schema.safeParse(missingPublishDate);
        expect(result3.success).toBe(false);
      });

      it('should fail validation with invalid types', () => {
        const invalidTypes = {
          title: 123, // Expected string
          description: 'Test',
          publishDate: new Date(),
        };
        const result = schema.safeParse(invalidTypes);
        expect(result.success).toBe(false);
      });
    });
  });
});
