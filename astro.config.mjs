// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import node from '@astrojs/node';

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

  adapter: node({
    mode: 'standalone'
  })
});