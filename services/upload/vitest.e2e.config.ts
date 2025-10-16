import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'upload-service-e2e',
    root: './src',
    testMatch: ['**/__tests__/e2e/**/*.e2e.test.ts'],
    environment: 'node',
    setupFiles: ['__tests__/setup.ts'],
    testTimeout: 60000, // 60 seconds for E2E tests
    hookTimeout: 30000, // 30 seconds for setup/teardown
    teardownTimeout: 30000,
    maxConcurrency: 3, // Limit concurrent E2E tests
    sequence: {
      concurrent: false, // Run E2E tests sequentially to avoid conflicts
    },
    env: {
      NODE_ENV: 'test',
      TEST_DATABASE_URL:
        'postgresql://test:test@localhost:5432/upload_test_e2e',
      REDIS_URL: 'redis://localhost:6379/1',
      STORAGE_TYPE: 'local',
      STORAGE_PATH: './test-uploads',
      JWT_SECRET: 'test-jwt-secret-for-e2e-tests',
      ENABLE_SECURITY_SCANNING: 'false', // Disable for faster tests
      LOG_LEVEL: 'error', // Reduce log noise during tests
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        'src/generated/**',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-results/e2e-results.json',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './src/__tests__'),
    },
  },
});
