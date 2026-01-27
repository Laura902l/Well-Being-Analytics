import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  testMatch: '**/*.spec.ts',

  // ❌ НЕ запускать Angular unit tests (Jasmine/Karma)
  testIgnore: [
    '**/src/**/*.spec.ts',
    '**/node_modules/**'
  ],

  use: {
    baseURL: 'http://localhost:4200',
    headless: true
  }
});
