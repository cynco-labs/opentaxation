import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['**/*.ts', '!index.ts'],
      exclude: ['__tests__/**', 'vitest.config.ts'],
      thresholds: { lines: 80, branches: 80 },
    },
  },
  resolve: {
    alias: {
      '@tax-engine/config': path.resolve(__dirname, '../config'),
    },
  },
});

