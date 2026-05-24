import js from '@eslint/js';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{ ignores: ['apps/**', 'packages/**'] },
	js.configs.recommended,
	{
		languageOptions: { globals: { ...globals.node } }
	}
);
