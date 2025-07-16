import fs from 'fs';
import { fileURLToPath, URL } from 'node:url';

import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost-cert.pem')
    },
    host: 'localhost'
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [NodeModulesPolyfillPlugin()]
    }
  },
  build: {
    rollupOptions: {
      plugins: [NodeModulesPolyfillPlugin()]
    }
  }
});
