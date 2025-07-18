import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://CUNYTechPrep.github.io',
  base: '/git-gif-mosaic',
});