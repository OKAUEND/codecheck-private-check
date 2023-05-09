/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/yumemi-codecheck-population-chart/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@/': `${__dirname}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/src/styles/variables.scss";`,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'c8',
    },
    setupFiles: ['src/mock/setup.ts'],
  },
});
