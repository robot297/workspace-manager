import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Set BASE_URL env var to deploy under a sub-path, e.g. BASE_URL=/tools/setup npm run build
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_URL ?? '/',
  server: {
    host: true,
  },
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
