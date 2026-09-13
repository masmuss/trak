import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		include: ['src/test/**/*.test.ts'],
		setupFiles: ['src/test/setup.ts'],
		testTimeout: 30000,
		// Test files share one Postgres database, so they must not run in parallel.
		fileParallelism: false
	}
});
