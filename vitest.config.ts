import { defineConfig } from 'vitest/config';

import { fileURLToPath } from 'url';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    alias: {
      'astro:content': fileURLToPath(new URL('./src/__mocks__/astro-content.cjs', import.meta.url)),
      'astro/loaders': fileURLToPath(new URL('./src/__mocks__/astro-loaders.cjs', import.meta.url))
    }
  },
});
