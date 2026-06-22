import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://ecorebates.org', // Production site URL required for sitemaps
  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()]
});