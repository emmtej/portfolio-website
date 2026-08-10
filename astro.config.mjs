import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import reactCompiler from 'babel-plugin-react-compiler';

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3000,
  },
  site: 'https://www.emmanueltejeda.com',
  integrations: [react({
    babel: {
      plugins: [[reactCompiler, {}]]
    }
  }), sitemap({
    filter: (page) => {
      const pathname = new URL(page).pathname.replace(/\/?$/, '/');
      return !new Set([
        '/about/',
        '/it/about/',
        '/404/',
        '/it/404/',
      ]).has(pathname);
    },
  })],
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
