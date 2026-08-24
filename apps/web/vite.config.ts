import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@megenagna/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@megenagna/plaque': path.resolve(__dirname, '../../packages/plaque/src/index.ts')
    }
  },
  server: {
    port: 3000
  }
});
