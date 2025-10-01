// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  
  server: {
    port: 4321,
    host: true
  },

  build: {
    format: 'file'
  },

  adapter: cloudflare({
    mode: 'directory',
    platformProxy: {
      enabled: true
    }
  })
});