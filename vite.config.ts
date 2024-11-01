/// <reference types="vitest" />
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '~',
        replacement: resolve(process.cwd()),
      },
    ],
  },
  test: {
    environment: 'jsdom',
  },
})
