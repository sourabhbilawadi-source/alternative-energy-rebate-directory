import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Production site URL required for sitemaps
  site: 'https://ecorebates.org',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()],
  adapter: cloudflare()
});