import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    relatedRegions: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

export const collections = {
  blog: blogCollection
};
