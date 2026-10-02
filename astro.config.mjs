// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['@photo-sphere-viewer/core', 'gsap/SplitText'],
    },
  },

  integrations: [
    react()
  ],

  adapter: cloudflare(),
});