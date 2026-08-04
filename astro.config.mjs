import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3000,
  },
  site: 'https://emmanueltejeda.com',
  integrations: [react({
    babel: {
      plugins: [["babel-plugin-react-compiler", {}]]
    }
  }), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()],
    // Note: reactCompilerPreset from vite.config.ts is omitted here 
    // unless specifically needed for Astro's React integration.
    // Astro's @astrojs/react handles its own transformation.
  }
});
