import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '__tests__/', '__mocks__/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'next-themes': path.resolve(__dirname, './__mocks__/next-themes.ts'),
      'next/navigation': path.resolve(__dirname, './__mocks__/next-navigation.ts'),
    },
  },
})
