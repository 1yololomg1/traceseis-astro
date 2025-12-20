import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://www.traceseis.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
